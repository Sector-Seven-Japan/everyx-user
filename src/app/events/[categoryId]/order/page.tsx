"use client";
import { useContext, useEffect, useState, useMemo } from "react"; // Add useMemo
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import DrawGraph from "@/components/DrawGraph";
import CategoryRule from "@/components/CategoryRule";
import CategoryInfo from "@/components/CategoryInfo";
import HeadingSlider from "@/components/HeadingSlider";
import Footer from "@/components/Footer";
import CategoryGraph from "@/components/CategoryGraph";
import CategoryActivity from "@/components/CategoryActivity";

// ... (interface definitions remain unchanged)
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
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [countdown, setCountdown] = useState<string>("");
  const [isBalance, setIsBalance] = useState<boolean>(true);

  // Stabilize outcomeIds with useMemo
  const outcomeIds = useMemo(
    () => [orderDetails?.event_outcome_id],
    [orderDetails?.event_outcome_id]
  );

  useEffect(() => {
    if (walletData[0]?.balance < orderDetails.pledge) {
      setIsBalance(false);
    }
    setIsLoading(false);
    fetchEvent();
  }, [walletData, orderDetails, setIsLoading]); // Add dependencies

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
        console.error("Failed to fetch graph data:", error);
      } finally {
        setIsLoadingGraph(false);
      }
    };

    fetchData();
  }, [eventData?._id, API_BASE_URL]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!isBalance) {
      router.push("/deposits");
      return;
    }
    try {
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
      <div className="md:px-[12%] 2xl:px-[19%]">
        <div className="hidden md:block">
          <HeadingSlider filter={filter} setFilter={setFilter} />
        </div>
        <div className="flex flex-col md:flex-row md:mt-14">
          <div className="md:w-[68%] xl:w-[72%] md:block hidden">
            {eventData ? (
              <>
                <CategoryInfo eventData={eventData} />
                <div className="px-5">
                  <h1 className="text-[23px] mb-8 mt-5 xl:text-[1.4vw] font-semibold">
                    Live Chart
                  </h1>
                  {isLoadingGraph ? (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-[#00FFBB] text-lg md:text-xs">
                        Loading graph...
                      </p>
                    </div>
                  ) : (
                    <DrawGraph data={graphData} />
                  )}
                </div>
                <CategoryGraph eventData={eventData} />
                <CategoryRule />
                <CategoryActivity eventData={eventData} />
              </>
            ) : (
              <p className="text-center text-gray-500">
                Loading event details...
              </p>
            )}
          </div>
          <div className="md:mt-5 w-full md:w-[32%] xl:w-[28%] pb-20">
            <div className="md:pb-10 md:bg-[#141414] md:rounded-xl sticky top-[70px]">
              <div className="p-5">
                <h1 className="text-center mb-4 md:text-[1.1vw] md:mb-[1.2vw] text-[22px]">
                  Your Order
                </h1>
                <div>
                  <div className="flex mt-7 gap-3">
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
                  <p className="text-[21px] md:text-[0.8vw] tracking-[2.5px] md:tracking-[1.5px] md:leading-[1.4vw] font-light mt-4">
                    {eventData?.description}
                  </p>
                  <p className="text-[#3E3E3E] text-[16px] mt-2 md:text-[0.8vw] md:mt-[0.8vw]">
                    ID: {orderDetails?.event_id}
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#363636] pb-[6px] px-5 gap-8 mt-3 md:mt-0">
                <h1
                  className={`text-[17px] relative cursor-pointer md:text-[0.8vw] ${
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
                  className={`text-[17px] relative cursor-pointer md:text-[0.8vw] ${
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
                      <p className="text-[#5D5D5D] text-[17px] md:text-[0.75vw] mb-1 md:mb-0">
                        Potential payout
                      </p>
                      <p className="flex justify-between text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                        ${Math.round(orderDetails?.indicative_payout)}
                        <span className="text-[14px] text-[#E49C29] flex items-end md:text-[0.85vw]">
                          +{orderDetails?.indicative_return?.toFixed(0)}%
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[#5D5D5D] text-[17px] md:text-[0.75vw] mb-1 md:mb-0">
                        Your Traded Probability
                      </p>
                      <p className="flex justify-between text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                        {Math.round(orderDetails?.new_probability * 100)}%
                        <span className="text-[14px] text-[#E49C29] flex items-end md:text-[0.85vw]">
                          +
                          {(orderDetails?.probability_change * 100)?.toFixed(1)}
                          %
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Image
                      src="/Images/line.png"
                      alt=""
                      height={500}
                      width={500}
                      className="my-5"
                    />
                  </div>

                  {/* Order Data */}
                  <div className="mb-6">
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
                        <div>
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

                  {/* Financial Information */}
                  <div className="flex flex-col gap-4">
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
                            x {orderDetails?.leverage}
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
                          ${Math.round(orderDetails?.after_payout)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-[1px] items-end">
                        <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                          Your return
                        </p>
                        <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          {orderDetails?.after_return
                            ? orderDetails?.after_return?.toFixed(0) + "%"
                            : "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-7 md:items-center">
                    <p className="text-[#FF2E2E] text-[17px] md:text-[0.85vw]">
                      Stop level
                    </p>
                    <button className="bg-[#FF2E2E] rounded-md px-3 py-1 md:py-[2.5px] md:text-[0.75vw]">
                      {(orderDetails?.after_stop_probability * 100)?.toFixed(0)}
                      %
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
                              orderDetails?.current_probability * 100
                            )}
                            %
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
                      <DrawGraph data={graphData} outcomeIds={outcomeIds} />{" "}
                      {/* Use stabilized outcomeIds */}
                    </div>
                  </div>
                </div>
              )}

              <div className="px-5">
                <button
                  onClick={handleSubmit}
                  className="text-[#00ffbb] text-[16px] py-4 rounded-xl w-full border border-[#00ffbb] md:py-[0.7vw] xl:rounded-lg 2xl:rounded-2xl md:text-[1vw] mt-3 mb-[1vw]"
                >
                  {isBalance ? "Proceed" : "Insufficient balance"}
                </button>
              </div>
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
