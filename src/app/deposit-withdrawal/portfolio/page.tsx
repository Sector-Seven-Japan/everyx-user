"use client";

import React, { useContext, useEffect, useState } from "react";
import CashWithdrawalCategories from "@/components/CashWithdrawalCategories";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppContext } from "@/app/Context/AppContext";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { LuClock7 } from "react-icons/lu";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
interface BetEntry {
  id: string;
  question: string;
  wagered_at: string;
  status: "open" | "closed";
  ends_at: string;
  position: {
    id: string;
    event_outcome_id: string;
    event_outcome_name: string;
    pledge: number;
    wager: number;
    leverage: number;
    indicative_payout: number;
    indicative_return: number;
  }[];
}

const Portfolio: React.FC = () => {
  const { setIsLoading } = useContext(AppContext);
  const [bets, setBets] = useState<BetEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const { API_BASE_URL, authToken, isMobile } = useContext(AppContext);
  const router = useRouter();
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
        event?: { name: string; ends_at: string };
        wagered_at: string;
        event_status: "open" | "closed";
        positions: {
          id: string;
          event_outcome_id: string;
          event_outcome?: { name: string }; // ✅ Added optional chaining
          pledge: number;
          wager: number;
          leverage: number;
          indicative_payout: number;
          indicative_return: number;
        }[];
      }

      const formattedBets: BetEntry[] = data.map((item: WagerData) => ({
        id: item.event_id,
        question: item.event?.name || "Unknown Event",
        wagered_at: new Date(item.wagered_at).toLocaleString(),
        status: item.event_status,
        ends_at: item.event?.ends_at,
        position: item.positions.map((pos) => ({
          id: pos.id,
          event_outcome_id: pos.event_outcome_id,
          event_outcome_name: pos.event_outcome?.name || "Unknown Outcome", // ✅ Corrected access
          pledge: pos.pledge,
          wager: pos.wager,
          leverage: pos.leverage,
          indicative_payout: pos.indicative_payout,
          indicative_return: pos.indicative_return,
        })),
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

  function timeRemaining(targetTimeStr: string) {
    // Convert input string to a UTC Date object
    const targetTime = new Date(targetTimeStr);

    // Get current time in UTC
    const now = new Date();

    // Calculate the difference in milliseconds
    let diff = targetTime.getTime() - now.getTime();

    // If the time has already passed, return "Expired"
    if (diff <= 0) {
      return "Expired";
    }

    // Convert milliseconds to days, hours, and minutes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));

    // Format the output
    return `${days} Day${days !== 1 ? "s" : ""} and ${hours}h${minutes}m`;
  }

  const filteredBets = bets.filter((bet) => {
    const isExpired = new Date(bet.ends_at) < new Date();

    if (filter === "Active") return !isExpired; // Show only active bets
    if (filter === "Success")
      return (
        isExpired && bet.position.some((pos) => pos.indicative_return > 100)
      ); // Show only successful expired bets
    if (filter === "Failed")
      return (
        isExpired && bet.position.some((pos) => pos.indicative_return <= 100)
      ); // Show only failed expired bets

    return true; // Show all bets
  });

  return (
    <>
      <Navbar />

      {isMobile ? (
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
            {filteredBets.length > 0 ? (
              filteredBets.map((bet) => {
                const isExpired = new Date(bet.ends_at) < new Date();

                // If event is expired, display each position separately
                if (isExpired) {
                  return bet.position.map((pos) => (
                    <div key={pos.id} className="space-y-3 mb-5">
                      {/* Status Indicator */}
                      <div className="inline-block">
                        {pos.indicative_return > 100 ? (
                          <span className="px-3 py-1 rounded text-sm text-[#2dc198] border border-[#2dc198]">
                            Success
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded text-sm text-orange-500 border border-orange-500">
                            Failed
                          </span>
                        )}
                      </div>

                      {/* Event Question */}
                      <h2 className="text-white text-lg font-medium">
                        {bet.question}
                      </h2>

                      {/* Ended Time */}
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500 text-sm">
                          {format(new Date(bet.ends_at), "MMM d yyyy HH:mm")}
                        </div>
                        <div
                          className={
                            pos.indicative_return > 100
                              ? "text-[#2dc198] text-sm"
                              : "text-orange-500 text-sm"
                          }
                        >
                          $
                          {Number(pos.indicative_payout - pos.wager).toFixed(2)}
                        </div>
                      </div>

                      {/* Dotted Line Separator */}
                      <div
                        className="border-t-2 border-dashed border-gray-400 w-full mt-4"
                        style={{
                          maskImage:
                            "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                          WebkitMaskImage:
                            "linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                        }}
                      ></div>
                    </div>
                  ));
                }

                // If event is still active, display all positions under the same event
                return (
                  <div key={bet.id} className="space-y-3 mb-5">
                    {/* Status Indicator */}
                    <div className="inline-block">
                      <span className="px-3 py-1 rounded text-sm border-[#5dff00] border text-[#5dff00]">
                        Active
                      </span>
                    </div>

                    {/* Event Question */}
                    <h2 className="text-white text-lg font-medium">
                      {bet.question}
                    </h2>

                    {/* Grouped Positions for Active Events */}
                    <div className="mt-4">
                      <h3 className="text-gray-300 text-sm font-semibold">
                        Bets Placed:
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {bet.position.map((pos) => (
                          <li
                            onClick={() => {
                              setIsLoading(true);
                              router.push(`/wager/${pos?.id}`);
                            }}
                            key={pos.id}
                            className="bg-white/10 p-3 rounded-md flex justify-between items-center"
                          >
                            <span className="text-white text-sm">
                              {pos.event_outcome_id} : {pos.event_outcome_name}
                            </span>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[#5dff00] font-semibold">
                                $ {pos.pledge.toFixed(2)}{" "}
                                <span className="text-[9px] text-[#5dff00]">
                                  (USDT)
                                </span>
                              </span>

                              <span className="text-[#b27c25] font-semibold">
                                x{pos.leverage.toFixed(1)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {/* Time Remaining */}
                      <div className="text-[12px] text-[#2dc198] flex items-center gap-1 mt-5">
                        <LuClock7 color="#2dc198" />{" "}
                        {timeRemaining(bet.ends_at)}
                      </div>
                    </div>

                    {/* Dotted Line Separator */}
                    <div
                      className="border-t-2 border-dashed border-gray-400 w-full mt-4"
                      style={{
                        maskImage:
                          "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                        WebkitMaskImage:
                          "linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                      }}
                    ></div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400">No bets available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-10 gap-5 pt-10 lg:px-40 md:px-10 sm:px-10">
          <div className="bg-[#0E0E0E]  min-h-screen text-white px-5  pb-5 col-span-6">
            <div className="flex justify-between items-start">
              <div>Results : </div>
              <div className="flex items-start gap-4">
                <p className="text-[14px] text-left font-semibold">Results :</p>
                <div className="flex flex-col items-end  gap-2">
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
                  <div
                    className={`w-24 flex flex-col  right-10  ${
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
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-8 mt-24">
              {filteredBets.length > 0 ? (
                filteredBets.map((bet) => {
                  const isExpired = new Date(bet.ends_at) < new Date();

                  // If event is expired, display each position separately
                  if (isExpired) {
                    return bet.position.map((pos) => (
                      <div key={pos.id} className="space-y-3 mb-5">
                        {/* Status Indicator */}
                        <div className="inline-block">
                          {pos.indicative_return > 100 ? (
                            <span className="px-3 py-1 rounded text-sm text-[#2dc198] border border-[#2dc198]">
                              Success
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded text-sm text-orange-500 border border-orange-500">
                              Failed
                            </span>
                          )}
                        </div>

                        {/* Event Question */}
                        <h2 className="text-white text-lg font-medium">
                          {bet.question}
                        </h2>

                        {/* Ended Time */}
                        <div className="flex justify-between items-center">
                          <div className="text-gray-500 text-sm">
                            {format(new Date(bet.ends_at), "MMM d yyyy HH:mm")}
                          </div>
                          <div
                            className={
                              pos.indicative_return > 100
                                ? "text-[#2dc198] text-sm"
                                : "text-orange-500 text-sm"
                            }
                          >
                            $
                            {Number(pos.indicative_payout - pos.wager).toFixed(
                              2
                            )}
                          </div>
                        </div>

                        {/* Dotted Line Separator */}
                        <div
                          className="border-t-2 border-dashed border-gray-400 w-full mt-4"
                          style={{
                            maskImage:
                              "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                            WebkitMaskImage:
                              "linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                          }}
                        ></div>
                      </div>
                    ));
                  }

                  // If event is still active, display all positions under the same event
                  return (
                    <div key={bet.id} className="space-y-3 mb-5">
                      {/* Status Indicator */}
                      <div className="inline-block">
                        <span className="px-3 py-1 rounded text-sm border-[#5dff00] border text-[#5dff00]">
                          Active
                        </span>
                      </div>

                      {/* Event Question */}
                      <h2 className="text-white text-lg font-medium">
                        {bet.question}
                      </h2>

                      {/* Grouped Positions for Active Events */}
                      <div className="mt-4">
                        <h3 className="text-gray-300 text-sm font-semibold">
                          Bets Placed:
                        </h3>
                        <ul className="mt-2 space-y-2">
                          {bet.position.map((pos) => (
                            <li
                              onClick={() => {
                                setIsLoading(true);
                                router.push(`/wager/${pos?.id}`);
                              }}
                              key={pos.id}
                              className="bg-white/10 p-3 rounded-md flex justify-between items-center"
                            >
                              <span className="text-white text-sm">
                                {pos.event_outcome_id} :{" "}
                                {pos.event_outcome_name}
                              </span>
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-[#5dff00] font-semibold">
                                  $ {pos.pledge.toFixed(2)}{" "}
                                  <span className="text-[9px] text-[#5dff00]">
                                    (USDT)
                                  </span>
                                </span>

                                <span className="text-[#b27c25] font-semibold">
                                  x{pos.leverage.toFixed(1)}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {/* Time Remaining */}
                        <div className="text-[12px] text-[#2dc198] flex items-center gap-1 mt-5">
                          <LuClock7 color="#2dc198" />{" "}
                          {timeRemaining(bet.ends_at)}
                        </div>
                      </div>

                      {/* Dotted Line Separator */}
                      <div
                        className="border-t-2 border-dashed border-gray-400 w-full mt-4"
                        style={{
                          maskImage:
                            "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                          WebkitMaskImage:
                            "linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                        }}
                      ></div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400">No bets available.</p>
              )}
            </div>
          </div>
          <div className="col-span-4 flex justify-end">
            <CurrentCashBalanceCardWebview />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Portfolio;
