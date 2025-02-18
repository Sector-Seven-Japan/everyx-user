"use client";

import React, { useContext, useEffect, useState } from "react";
import CashWithdrawalCategories from "@/components/CashWithdrawalCategories";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppContext } from "@/app/Context/AppContext";

interface BetEntry {
  id: string;
  question: string;
  timestamp: string;
  amount: number;
  status: "open" | "closed";
}

const Portfolio: React.FC = () => {
  const { setIsLoading } = useContext(AppContext);
  const [bets, setBets] = useState<BetEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const { API_BASE_URL, authToken } = useContext(AppContext);
  const getWagerData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/wager-position-events?pagination=true&page=1&limit=10&status=active`,
        {
          method: "GET", // ✅ Change from POST to GET
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch wager data: ${response.status}`);
      }

      const data = await response.json();

      interface WagerData {
        event_id: string;
        event?: { name: string };
        wagered_at: string;
        wager: number;
        event_status: "open" | "closed";
      }

      const formattedBets: BetEntry[] = data.map((item: WagerData) => ({
        id: item.event_id,
        question: item.event?.name || "Unknown Event",
        timestamp: new Date(item.wagered_at).toLocaleString(),
        amount: item.wager || 0,
        status: item.event_status,
      }));

      setBets(formattedBets);
      console.log(formattedBets);
    } catch (error) {
      console.error("Error fetching wager data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      getWagerData();
    }
  }, [authToken]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-4 pb-5">
        <CurrentCashBalanceCard />
        <div className="my-10">
          <CashWithdrawalCategories
            openDepositPopup={() => {
              setOpen(true);
            }}
          />
        </div>

        <div className="flex justify-end items-center gap-4">
          <p className="text-[14px] text-center font-semibold">Results :</p>
          <div className="flex w-36 bg-[rgba(255,255,255,0.1)] rounded-md justify-between items-center px-2 py-1">
            <div className="text-[14px]">{filter}</div>
            <div
              className="flex justify-center items-center flex-col gap-1"
              onClick={() => {
                setOpen((con) => !con);
              }}
            >
              <div className="w-[20px] h-[1.5px] bg-white"></div>
              <div className="w-[18px] h-[1.5px] bg-white"></div>
              <div className="w-[12px] h-[1.5px] bg-white"></div>
            </div>
          </div>
        </div>

        <div
          className={`w-24 flex flex-col absolute right-10 mt-3 ${
            open ? "block" : "hidden"
          }`}
        >
          <div
            onClick={() => {
              setFilter("All");
              setOpen(false);
            }}
            className="bg-transparent hover:bg-white/10 transition duration-300  pl-5 text-[14px]"
          >
            All
          </div>
          <div
            onClick={() => {
              setFilter("Active");
              setOpen(false);
            }}
            className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px]"
          >
            Active
          </div>
          <div
            onClick={() => {
              setFilter("Success");
              setOpen(false);
            }}
            className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px]"
          >
            Success
          </div>
          <div
            onClick={() => {
              setFilter("Failed");
              setOpen(false);
            }}
            className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px]"
          >
            Failed
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-8 mt-24">
          {bets.length > 0 ? (
            bets.map((bet) => (
              <>
                <div key={bet.id} className="space-y-3 mb-5">
                  <div className="inline-block">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        bet.status === "closed"
                          ? "text-orange-500 border border-orange-500"
                          : "text-[#000] bg-[#00FFB8]"
                      }`}
                    >
                      {bet.status === "closed" ? "Inactive" : "Active"}
                    </span>
                  </div>

                  <h2 className="text-white text-lg font-medium">
                    {bet.question}
                  </h2>

                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">{bet.timestamp}</p>
                    <p
                      className={`text-xl font-bold ${
                        bet.amount < 0 ? "text-orange-500" : "text-[#00FFB8]"
                      }`}
                    >
                      $ {bet.amount.toFixed(2)} (USDT)
                    </p>
                  </div>
                </div>
                <div
                  className="border-t-2 border-dashed border-gray-400 w-full"
                  style={{
                    maskImage:
                      "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                    WebkitMaskImage:
                      "linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                  }}
                ></div>
              </>
            ))
          ) : (
            <p className="text-center text-gray-400">No bets available.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Portfolio;
