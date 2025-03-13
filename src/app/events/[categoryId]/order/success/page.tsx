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
import { useContext, useEffect, useState } from "react";

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
  precision?: "hour" | "day" | "month";
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
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [eventData?.ends_at, getCountdown]);

  useEffect(() => {
    const getGraphData = async ({
      eventId,
      precision = "hour",
      from,
      to,
    }: EventHistoryParams) => {
      try {
        // Build URL with query parameters
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
        // console.log("data at getGraphData", data);
        return data;
      } catch (error) {
        console.error("Error getting graph data:", error);
        throw error; // Re-throw the error to handle it in the calling code
      }
    };

    setIsLoadingGraph(true);
    const fetchData = async () => {
      try {
        if (eventData) {
          const currentDate = new Date().toISOString();
          const data = await getGraphData({
            eventId: eventData?._id,
            precision: "hour",
            from: "2025-02-01T18:30:00.000Z",
            to: currentDate,
          });
          setGraphData(data);
        }
      } catch (error) {
        // Handle error appropriately
        console.error("Failed to fetch graph data:", error);
      } finally {
        setIsLoadingGraph(false); // Stop loading
      }
    };

    fetchData();
  }, [eventData?._id, API_BASE_URL]);

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
                  <h1 className="text-[23px] mb-8 mt-5 md:text-[1.4vw] font-semibold">
                    Live Chart
                  </h1>
                  {isLoadingGraph ? (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-[#00FFBB] text-lg md:text-xs">
                        Loading graph...
                      </p>
                    </div>
                  ) : (
                    <DrawGraph data={graphData} graphFilter={"6h"} />
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
            <div className="px-8 py-5 md:bg-[#141414] md:rounded-xl md:px-5 sticky top-[70px]">
              <h1 className="text-center mb-4 md:text-[1.1vw] md:mb-[1.2vw] text-[22px]">
                Your Order
              </h1>
              <div className="flex flex-col items-center justify-center text-center gap-8 mt-5 md:gap-2">
                <div className="border border-[#00FF11] rounded-full p-3">
                  <Image
                    src="/Icons/arrow.svg"
                    alt=""
                    width={60}
                    height={60}
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
                        src={"/Icons/freeclock.svg"}
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
                          className="h-[19px] rounded-lg bg-[#00FFBB] md:h-[14px]"
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
                  Recommended Events
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
