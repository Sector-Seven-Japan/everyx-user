"use client";
import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import DrawGraph from "@/components/DrawGraph";
import CategoryRule from "@/components/CategoryRule";
import CategoryInfo from "@/components/CategoryInfo";
import HeadingSlider from "@/components/HeadingSlider";
import Footer from "@/components/Footer";

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

// EventData interface
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

export default function Order() {
  const {
    setIsLoading,
    orderDetails,
    selectedOrder,
    walletData,
    API_BASE_URL,
    authToken,
    fetchWalletData,
    getCountdown,
    filter,
    setFilter,
  } = useContext(AppContext);
  const router = useRouter();
  const categoryId = orderDetails?.event_id;
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [option, setOption] = useState<string>("Order details");
  const [isLoaingGraph, setIsLoadingGraph] = useState(true);
  console.log(isLoaingGraph);
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    setIsLoading(false);
    fetchEvent();
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const wagerPayload: WagerPayload = {
        event_id: orderDetails?.event_id,
        event_outcome_id: orderDetails?.event_outcome_id,
        force_leverage: false,
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
    }
  };

  return (
    <div>
      <Navbar />
      <div className="hidden md:block">
        <HeadingSlider filter={filter} setFilter={setFilter} />
      </div>
      <div className="flex flex-col md:flex-row md:px-[10vw] md:mt-5 xl:px-[15vw]">
        <div className="md:w-full md:block hidden">
          {eventData ? (
            <>
              <CategoryInfo eventData={eventData} />
              <div className="px-5">
                <h1 className="text-[23px] mb-8 mt-5 md:text-[16px]">
                  Live Chart
                </h1>
                {isLoaingGraph ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-[#00FFBB] text-lg">Loading graph...</p>
                  </div>
                ) : (
                  <DrawGraph data={graphData} />
                )}
              </div>
              <CategoryRule />
            </>
          ) : (
            <p className="text-center text-gray-500">
              Loading event details...
            </p>
          )}
        </div>
        <div>
          <div className="pb-10 md:mt-5 md:bg-[#141414] md:rounded-xl md:w-[280px] sticky top-[70px]">
            <div className="p-5">
              <h1 className="text-[22px] mt-3 text-center md:text-[18px]">
                Your Order
              </h1>
              <div>
                <div className="flex mt-7 gap-3">
                  <button className="border border-[#00FFB8] px-4 py-1 text-xs text-[#2DC198] rounded-md md:rounded-sm md:py-[2px] md:text-[10px]">
                    {eventData?.category?.name?.split(" ")[0]}
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
                    <p className="text-[#2DC198] md:text-[10px]">{countdown}</p>
                  </p>
                </div>
                <p className="text-[21px] md:text-[12px] font-light mt-4">
                  {eventData?.description}
                </p>
                <p className="text-[#3E3E3E] mt-2 md:text-[12px]">
                  ID: NDSJHDH676235
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#363636] pb-[6px] px-5 gap-8 mt-3 md:mt-0">
              <h1
                className={`text-[17px] relative cursor-pointer md:text-[12px] ${
                  option === "Order details"
                    ? "text-[#00FFBB]"
                    : "text-[#323232]"
                }`}
                onClick={() => setOption("Order details")}
              >
                Order details
                {option === "Order details" && (
                  <div className="absolute w-5 h-[4px] bg-[#00FFBB] -bottom-[6px] left-1/2 transform -translate-x-1/2"></div>
                )}
              </h1>

              <h1
                className={`text-[17px] relative cursor-pointer md:text-[12px] ${
                  option === "Charts" ? "text-[#00FFBB]" : "text-[#323232]"
                }`}
                onClick={() => setOption("Charts")}
              >
                Charts
                {option === "Charts" && (
                  <div className="absolute w-5 h-[4px] bg-[#00FFBB] -bottom-[6px] left-1/2 transform -translate-x-1/2"></div>
                )}
              </h1>
            </div>

            {/* Conditional Rendering for Order Details */}
            {option === "Order details" ? (
              <div className="p-5">
                <div className="flex md:flex-col justify-between mt-5 md:mt-2 md:gap-3">
                  <div>
                    <p className="text-[#5D5D5D] text-[17px] md:text-[11px] mb-1 md:mb-0">
                      Potential payout
                    </p>
                    <p className="flex justify-between text-[22px] text-[#00FFB8] md:text-[16px]">
                      ${Math.round(orderDetails?.indicative_payout)}
                      <span className="text-[14px] text-[#E49C29] flex items-end md:text-[12px]">
                        +{orderDetails?.indicative_return?.toFixed(0)}%
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[#5D5D5D] text-[17px] md:text-[11px] mb-1 md:mb-0">
                      Your Traded Probability
                    </p>
                    <p className="flex justify-between text-[22px] text-[#00FFB8] md:text-[16px]">
                      {Math.round(orderDetails?.new_probability * 100)}%
                      <span className="text-[14px] text-[#E49C29] flex items-end md:text-[12px]">
                        +{(orderDetails?.probability_change * 100)?.toFixed(1)}%
                      </span>
                    </p>
                  </div>
                </div>
                <div className="h-[0.5px] w-[70%] mb-6 border-t border-dashed mx-auto mt-6 border-[#575757]"></div>

                {/* Order Data */}
                <div className="mb-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-[19px] font-light md:text-[12px]">
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
                      <p className="text-[19px] font-light md:text-[12px]">
                        {Math.round(orderDetails?.new_probability * 100)}%
                      </p>
                      <div className="md:w-3">
                        <Image
                          src="/Images/checkbox.png"
                          alt="checkbox"
                          height={20}
                          width={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[#5D5D5D] text-[13px] md:text-[11px]">
                        Cash used
                      </p>
                      <p className="text-[22px] text-[#00FFB8] md:text-[16px]">
                        ${Math.round(orderDetails?.after_pledge)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-[1px] items-end">
                      <p className="text-[#5D5D5D] text-[13px] md:text-[11px]">
                        Leverage cash value
                      </p>
                      <p className="text-[22px] text-[#00FFB8] md:text-[16px]">
                        ${Math.round(orderDetails?.after_wager)}{" "}
                        <span className="text-sm text-[#E49C29] md:text-[12px]">
                          x {orderDetails?.after_leverage}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex flex-col gap-[1px]">
                      <p className="text-[#5D5D5D] text-[13px] md:text-[11px]">
                        Projected payout
                      </p>
                      <p className="text-[22px] text-[#00FFB8] md:text-[16px]">
                        ${Math.round(orderDetails?.after_payout)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-[1px] items-end">
                      <p className="text-[#5D5D5D] text-[13px] md:text-[11px]">
                        Your return
                      </p>
                      <p className="text-[22px] text-[#00FFB8] md:text-[16px]">
                        +{orderDetails?.after_return?.toFixed(0)} %
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-7 md:items-center">
                  <p className="text-[#FF2E2E] text-[17px] md:text-[12px]">
                    Stop level
                  </p>
                  <button className="bg-[#FF2E2E] rounded-md px-3 py-1 md:py-[2px] md:text-[12px]">
                    {(orderDetails?.after_stop_probability * 100)?.toFixed(0)}%
                  </button>
                </div>
              </div>
            ) : (
              // Chart Section
              <div className="p-5">
                <div className="mt-5">
                  {/* Order Data */}
                  <div className="mb-6">
                    <div className="flex flex-col gap-2 mb-5">
                      <p className="text-[19px] font-light md:text-[1.1vw]">
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
                        <p className="text-[19px] font-light md:text-[1vw]">
                          {Math.round(orderDetails?.current_probability * 100)}%
                        </p>
                        <div className="md:w-3">
                          <Image
                            src="/Images/checkbox.png"
                            alt="checkbox"
                            height={20}
                            width={20}
                          />
                        </div>
                      </div>
                    </div>
                    <DrawGraph
                      data={graphData}
                      outcomeIds={[orderDetails?.event_outcome_id]}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="px-5">
              <button
                onClick={handleSubmit}
                className="text-[#00FFB8] w-full border border-[#00FFB8] mt-6 md:mt-0 py-4 rounded-2xl md:py-2 md:rounded-xl md:text-[14px]"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
