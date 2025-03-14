"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import CategoryInfo from "@/components/CategoryInfo";
import CategoryRule from "@/components/CategoryRule";
import DrawGraph from "@/components/DrawGraph";
import HeadingSlider from "@/components/HeadingSlider";
import Footer from "@/components/Footer";
import CategoryActivity from "@/components/CategoryActivity";

interface WagerPayload {
  event_id: string;
  event_outcome_id: string;
  force_leverage: boolean;
  leverage: number;
  loan: number;
  max_payout: number;
  pledge: number;
  wager: number;
  wallet_id: number;
}

interface EventData {
  _id: string;
  name: string;
  description: string;
  category: {
    name: string;
  };
  ends_at: string;
  outcomes: Array<{
    _id: string;
    name: string;
    trader_info: {
      estimated_probability: number;
      max_leverage: number;
      estimated_payout: number;
    };
  }>;
  event_images_url: string[];
}

interface GraphData {
  datetime: string;
  event_id: string;
  event_outcome_id: string;
  probability: number;
  timestamp: string;
  value: number;
  estimated_payout: number;
  num_wagers: number;
  sum_wagers: number;
}

interface EventHistoryParams {
  precision?: "hour" | "minute"; // Updated to only include "hour" and "minute"
  from?: string;
  to?: string;
  eventId: string;
}

export default function BettingPage() {
  const {
    orderDetails,
    setIsLoading,
    walletData,
    API_BASE_URL,
    authToken,
    fetchWalletData,
    selectedOrder,
    getCountdown,
    filter,
    setFilter,
  } = useContext(AppContext);
  const router = useRouter();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [minuteGraphData, setMinuteGraphData] = useState<GraphData[]>([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [countdown, setCountdown] = useState<string>("");
  const [filterGraph, setFilterGraph] = useState("ALL");
  const categoryId = orderDetails?.event_id;

  useEffect(() => {
    if (!categoryId) {
      console.log("No event ID found in orderDetails, redirecting back...");
      router.back();
    }
  }, [categoryId, router]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const wagerPayload: WagerPayload = {
        event_id: orderDetails?.event_id,
        event_outcome_id: orderDetails?.event_outcome_id,
        force_leverage: true,
        leverage: orderDetails?.leverage,
        loan: orderDetails?.loan,
        max_payout: orderDetails?.indicative_payout,
        pledge: orderDetails?.pledge,
        wager: orderDetails?.wager,
        wallet_id: walletData[0]?.id,
      };
      const response = await fetch(`${API_BASE_URL}/wagers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(wagerPayload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Order placement failed");
      }
      if (response.ok) {
        await fetchWalletData();
        await router.push(`/events/${orderDetails?.event_id}/order/success`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    fetchEvent();
  }, [categoryId]);

  useEffect(() => {
    if (eventData?.ends_at) {
      console.log(countdown);
      setCountdown(getCountdown(eventData.ends_at));
      const interval = setInterval(() => {
        setCountdown(getCountdown(eventData.ends_at));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [eventData?.ends_at, getCountdown]);

  const fetchEvent = async () => {
    if (!categoryId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/events/${categoryId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error("Failed to fetch event:", error);
      setEventData(null);
    }
  };

  const getGraphData = useCallback(
    async ({ eventId, precision = "hour", from, to }: EventHistoryParams) => {
      try {
        const params = new URLSearchParams();
        if (precision) params.append("precision", precision);
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        const url = `${API_BASE_URL}/events/${eventId}/history?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error getting graph data:", error);
        throw error;
      }
    },
    [API_BASE_URL]
  );

  // Fetch hourly data only initially
  useEffect(() => {
    if (!eventData?._id) return;

    const fetchHourlyGraphData = async () => {
      try {
        setIsLoadingGraph(true);
        const currentDate = new Date().toISOString();

        // Fetch hourly data only
        const hourlyData = await getGraphData({
          eventId: eventData._id,
          precision: "hour",
          from: "2025-02-01T18:30:00.000Z",
          to: currentDate,
        });
        setGraphData(hourlyData || []);
      } catch (error) {
        console.error("Failed to fetch hourly graph data:", error);
        setGraphData([]);
      } finally {
        setIsLoadingGraph(false);
      }
    };

    fetchHourlyGraphData();
  }, [eventData?._id, getGraphData]);

  // Function to fetch minute data when 1h is selected
  const fetchMinuteGraphData = useCallback(async () => {
    if (!eventData?._id || minuteGraphData.length > 0) return; // Don't refetch if already loaded

    try {
      setIsLoadingGraph(true);
      const currentDate = new Date().toISOString();
      const minuteData = await getGraphData({
        eventId: eventData._id,
        precision: "minute",
        from: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Last hour
        to: currentDate,
      });
      setMinuteGraphData(minuteData || []);
    } catch (error) {
      console.error("Failed to fetch minute graph data:", error);
      setMinuteGraphData([]);
    } finally {
      setIsLoadingGraph(false);
    }
  }, [eventData?._id, getGraphData]);

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setFilterGraph(newFilter);
    if (newFilter === "1h") {
      fetchMinuteGraphData();
    }
  };

  return (
    <div>
      <Navbar />
      <div className="md:px-[12%] 2xl:px-[19%]">
        <div className="md:block hidden">
          <HeadingSlider filter={filter} setFilter={setFilter} />
        </div>
        <div className="flex flex-col md:flex-row md:mt-1">
          <div className="md:w-[68%] xl:w-[70%] md:block hidden">
            {eventData ? (
              <>
                <CategoryInfo eventData={eventData} />
                <div className="px-5 md:pl-0">
                  <h1 className="text-[23px] mb-8 mt-5">Live Chart</h1>
                  <div className="flex justify-end gap-5 items-center mb-4">
                    <div
                      className={`cursor-pointer text-white ${
                        filterGraph === "1h"
                          ? "text-[#FFFFFF] font-semibold"
                          : "text-white/50 hover:text-white/75"
                      }`}
                      onClick={() => handleFilterChange("1h")}
                    >
                      1h
                    </div>
                    <div
                      className={`cursor-pointer text-white ${
                        filterGraph === "6h"
                          ? "text-[#FFFFFF] font-semibold"
                          : "text-white/50 hover:text-white/75"
                      }`}
                      onClick={() => handleFilterChange("6h")}
                    >
                      6h
                    </div>
                    <div
                      className={`cursor-pointer text-white ${
                        filterGraph === "1d"
                          ? "text-[#FFFFFF] font-semibold"
                          : "text-white/50 hover:text-white/75"
                      }`}
                      onClick={() => handleFilterChange("1d")}
                    >
                      1d
                    </div>
                    <div
                      className={`cursor-pointer text-white ${
                        filterGraph === "1w"
                          ? "text-[#FFFFFF] font-semibold"
                          : "text-white/50 hover:text-white/75"
                      }`}
                      onClick={() => handleFilterChange("1w")}
                    >
                      1w
                    </div>
                    <div
                      className={`cursor-pointer text-white ${
                        filterGraph === "1m"
                          ? "text-[#FFFFFF] font-semibold"
                          : "text-white/50 hover:text-white/75"
                      }`}
                      onClick={() => handleFilterChange("1m")}
                    >
                      1m
                    </div>
                    <div
                      className={`cursor-pointer text-white ${
                        filterGraph === "ALL"
                          ? "text-[#FFFFFF] font-semibold"
                          : "text-white/50 hover:text-white/75"
                      }`}
                      onClick={() => handleFilterChange("ALL")}
                    >
                      ALL
                    </div>
                  </div>
                  {isLoadingGraph ? (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-[#00FFBB] text-lg">Loading graph...</p>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full sm:h-full lg:h-[15vw] ">
                      <DrawGraph
                        data={
                          filterGraph === "1h" ? minuteGraphData : graphData
                        }
                        graphFilter={filterGraph}
                      />
                    </div>
                  )}
                </div>
                <CategoryRule />
                <CategoryActivity eventData={eventData} />
              </>
            ) : (
              <p className="text-center text-gray-500">
                Loading event details...
              </p>
            )}
          </div>
          <div className="md:mt-5 w-full md:w-[32%] xl:w-[30%] pb-20 md:pb-0">
            <div className="md:bg-[#171717] rounded-2xl md:pb-5 sticky top-[70px]">
              <div className="p-5 md:pb-0">
                <h1 className="text-[22px] mt-4 text-center md:text-[18px]">
                  Your Order
                </h1>
                <div className="mb-6 mt-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-[19px] font-light md:text-[0.7vw]">
                      {selectedOrder}
                    </p>
                    <div className="flex justify-between items-center gap-2">
                      <div className="w-[80%] h-[19px]">
                        <div
                          className="h-[19px] rounded-lg bg-[#00FFBB] md:h-[14px]"
                          style={{
                            width: `${Math.round(
                              orderDetails?.current_probability * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-[19px] font-light md:text-[0.7vw]">
                        {Math.round(
                          (orderDetails?.current_probability ?? 0) * 100
                        )}
                        %
                      </p>
                      <div className="">
                        <Image
                          src="/Images/checkbox.png"
                          alt="checkbox"
                          height={20}
                          width={20}
                          className="md:w-[0.7vw] md:h-[0.7vw]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-1 md:px-5">
                <div className="border p-5 border-[#515151d6] rounded-xl md:p-4">
                  <div className="flex flex-col gap-4 md:gap-2">
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-[1px]">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Cash used
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          ${Math.round(orderDetails?.before_pledge || 0)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[1px] items-end">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Leverage cash value
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          ${Math.round(orderDetails?.before_wager || 0)}{" "}
                          <span className="text-sm text-[#E49C29]">
                            x {orderDetails?.before_leverage || 1}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col gap-[1px]">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Projected payout
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          ${Math.round(orderDetails?.before_payout || 0)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[1px] items-end">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Your return
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          {orderDetails?.before_return
                            ? `+${orderDetails.before_return.toFixed(0)}%`
                            : "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-5">
                    <p className="text-[#FF2E2E] text-[17px] md:text-[0.85vw]">
                      Stop level
                    </p>
                    <button className="bg-[#FF2E2E] rounded-md px-3 py-1 md:py-[2.5px] md:text-[0.75vw]">
                      {(
                        orderDetails?.before_stop_probability * 100 || 0
                      ).toFixed(0)}
                      %
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center px-3 py-5 md:py-7 md:px-10">
                  <Image src="/Images/down.png" alt="" height={10} width={10} />
                  <div className="flex items-center gap-4 md:items-end">
                    <p className="text-[13px] text-[#5D5D5D] md:text-[0.75vw] md:mb-1">
                      Cash used
                    </p>
                    <p className="text-[22px] text-[#00FFB8] md:text-[1.5vw]">
                      ${Math.round(orderDetails?.wager || 0)}
                    </p>
                  </div>
                  <Image src="/Images/down.png" alt="" height={10} width={10} />
                </div>
                <div className="border p-5 border-[#515151d6] rounded-xl md:p-4">
                  <div className="flex flex-col gap-4 md:gap-2">
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-[1px]">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Cash used
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          ${Math.round(orderDetails?.after_pledge || 0)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[1px depo] items-end">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Leverage cash value
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          ${Math.round(orderDetails?.after_wager || 0)}{" "}
                          <span className="text-sm text-[#E49C29]">
                            x {orderDetails?.after_leverage.toFixed(1) || 1}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col gap-[1px]">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Projected payout
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          ${Math.round(orderDetails?.after_payout || 0)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[1px] items-end">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Your return
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          {orderDetails?.after_return
                            ? `+${orderDetails.after_return.toFixed(0)}%`
                            : "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-5">
                    <p className="text-[#FF2E2E] text-[17px] md:text-[0.85vw]">
                      Stop level
                    </p>
                    <button className="bg-[#FF2E2E] rounded-md px-3 py-1 md:py-[2.5px] md:text-[0.75vw]">
                      {(
                        orderDetails?.after_stop_probability * 100 || 0
                      ).toFixed(0)}
                      %
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-5">
                <button
                  onClick={handleSubmit}
                  className="text-[#00ffbb] rounded-2xl text-[16px] py-5 w-full border border-[#00ffbb] md:py-[0.7vw] xl:rounded-lg 2xl:rounded-2xl md:text-[1vw] mt-3 mb-[1vw] md:mt-10"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:block hidden">
        <Footer />
      </div>
    </div>
  );
}
