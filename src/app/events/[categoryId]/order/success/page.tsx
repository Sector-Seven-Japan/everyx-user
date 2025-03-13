"use client";
import { AppContext } from "@/app/Context/AppContext";
import CategoryActivity from "@/components/CategoryActivity";
import CategoryInfo from "@/components/CategoryInfo";
import CategoryRule from "@/components/CategoryRule";
import DrawGraph from "@/components/DrawGraph";
import Footer from "@/components/Footer";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useCallback } from "react";

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

export default function OrderSuccess() {
  const router = useRouter();
  const {
    setIsLoading,
    orderDetails,
    selectedOrder,
    API_BASE_URL,
    getCountdown,
    filter,
    setFilter,
    setIsOrderMade,
  } = useContext(AppContext);
  const categoryId = orderDetails?.event_id;
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [minuteGraphData, setMinuteGraphData] = useState<GraphData[]>([]);
  const [filterGraph, setFilterGraph] = useState("ALL");

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

  useEffect(() => {
    fetchEvent();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (eventData?.ends_at) {
      setCountdown(getCountdown(eventData.ends_at));
      const interval = setInterval(() => {
        setCountdown(getCountdown(eventData.ends_at));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [eventData?.ends_at, getCountdown]);

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
        setGraphData(hourlyData);
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
      setMinuteGraphData(minuteData);
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
          <div className="md:w-[68%] xl:w-[72%] md:block hidden">
            {eventData ? (
              <>
                <CategoryInfo eventData={eventData} />
                <div className="px-5">
                  <h1 className="text-[23px] mb-8 mt-5 md:text-[1.4vw] font-semibold">
                    Live Chart
                  </h1>
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
                      <p className="text-[#00FFBB] text-lg md:text-xs">
                        Loading graph...
                      </p>
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
          <div className="md:mt-5 w-full md:w-[32%] xl:w-[28%] pb-20 md:pb-0">
            <div className="px-8 py-5 md:bg-[#141414] md:rounded-xl md:px-5 sticky top-[70px]">
              <h1 className="text-center mb-4 md:text-[1.1vw] md:mb-[1.2vw] text-[22px]">
                Your Order
              </h1>
              <div className="flex flex-col items-center justify-center text-center gap-8 mt-5 md:gap-2">
                <div className="">
                  <Image
                    src="/Icons/SuccessIcon.png"
                    alt=""
                    width={70}
                    height={70}
                    className="md:w-[2vw] md:h-[2vw]"
                  ></Image>
                </div>
                <p className="text-lg font-light md:text-[0.7vw] md:mt-2">
                  Your order has been successfully processed!
                </p>
              </div>

              <div className="mt-20 md:mt-[1.5vw]">
                <div className="flex gap-3">
                  <button className="border border-[#00FFB8] px-4 py-2 text-xs text-[#2DC198] rounded-md md:rounded-sm md:py-[2px] md:text-[0.6vw]">
                    {eventData?.category?.name?.split(" ")[0] || "Global"}
                  </button>
                  <p className="text-[#2DC198] flex gap-1 items-center font-light">
                    <div className="md:w-3">
                      <Image
                        src={"/Images/FreeClock i.png"}
                        alt="clock"
                        height={18}
                        width={18}
                      />
                    </div>
                    <p className="text-[#2DC198] md:text-[0.7vw]">
                      {countdown}
                    </p>
                  </p>
                </div>
                <p className="text-[21px] tracking-[2px] font-light mt-8 md:text-[0.8vw] md:tracking-[1.5px] md:leading-[1.4vw]">
                  {eventData?.description}
                </p>
                <p className="text-[#3E3E3E] text-[16px] mt-2 md:text-[0.8vw] md:mt-[0.8vw]">
                  ID: {orderDetails?.event_id}
                </p>

                <div className="flex justify-center mt-2">
                  <Image
                    src="/Images/line.png"
                    alt=""
                    height={500}
                    width={500}
                    className="my-5"
                  />
                </div>

                <div className="mb-8">
                  <div className="flex flex-col gap-2">
                    <p className="text-[19px] font-light md:text-[0.7vw]">
                      {selectedOrder}
                    </p>
                    <div className="flex justify-between items-center gap-2">
                      <div className="w-[80%] h-[19px]">
                        <div
                          className="h-[19px] rounded-lg bg-[#00FFB8] md:h-[14px]"
                          style={{
                            width: `${Math.round(
                              orderDetails?.new_probability * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-[19px] font-light md:text-[0.7vw]">
                        {Math.round(orderDetails?.new_probability * 100)}%
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

                <div className="flex justify-center">
                  <Image
                    src="/Images/line.png"
                    alt=""
                    height={500}
                    width={500}
                    className="mb-5"
                  />
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col gap-[1px]">
                    <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                      Cash used
                    </p>
                    <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                      ${Math.round(orderDetails?.after_pledge)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-[1px] items-end">
                    <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                      Leverage cash value
                    </p>
                    <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                      ${Math.round(orderDetails?.after_wager)}{" "}
                      <span className="text-sm text-[#E49C29] md:text-[0.85vw]">
                        x {orderDetails?.after_leverage}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mt-10 gap-4 md:gap-[1vw]">
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setIsOrderMade(false);
                    router.push(`/trade`);
                  }}
                  className="bg-[#00FFB8] py-4 rounded-md text-black text-[18px] flex items-center justify-center gap-3 md:text-[0.9vw] md:py-[0.65vw]"
                >
                  Recommend Events
                  <div className="md:w-2">
                    <Image
                      src="/Images/rightarrowicon.png"
                      alt=""
                      height={15}
                      width={12}
                    />
                  </div>
                </button>
                <button
                  onClick={() => {
                    setIsLoading(true);
                    setIsOrderMade(false);
                    router.push("/dashboard/portfolio");
                  }}
                  className="bg-[#222222] py-4 rounded-md text-[#00FFB8] text-[18px] md:text-[0.9vw] md:py-[0.65vw] md:mb-5"
                >
                  View in Portfolio
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
