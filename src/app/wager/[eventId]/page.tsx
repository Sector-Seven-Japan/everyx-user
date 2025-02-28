"use client";
import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import DrawGraph from "@/components/DrawGraph";
import MakeOrder from "@/components/MakeOrder";
import { useRouter } from "next/navigation";
import CategoryInfo from "@/components/CategoryInfo";
import CategoryRule from "@/components/CategoryRule";
import MakeOrderDesktop from "@/components/MakeOrderDesktop";
import Footer from "@/components/Footer";
import HeadingSlider from "@/components/HeadingSlider";

interface WagerData {
  id: string;
  event_id: string;
  event_outcome_id: string;
  event: {
    description: string;
    status: string;
    ends_at: string;
    outcomes: {
      _id: string;
      name: string;
      trader_info: {
        estimated_probability: number;
        estimated_payout: number;
      };
      histories: {
        estimated_probability_24hr_change: number;
      };
    }[];
  };
  event_outcome: {
    name: string;
  };
  wager: number;
  pledge: number;
  indicative_payout: number;
  indicative_return: number;
  probability: number;
  stop_probability: number;
  leverage: number;
  is_leveraged: boolean;
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

export default function WagerPage() {
  const {
    setIsLoading,
    setSelectedOrder,
    authToken,
    API_BASE_URL,
    makeOrder,
    setIsOrderMade,
    getCountdown,
    filter,
    setFilter,
  } = useContext(AppContext);
  const router = useRouter();
  const [option, setOption] = useState<string>("Order details");
  const params = useParams();
  const eventId = params.eventId;
  const [wagerData, setWagerData] = useState<WagerData | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [countdown, setCountdown] = useState<string>("");
  const [marginClicked, setMarginClicked] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
    setIsOrderMade(false);
  }, []);

  const fetchWagerData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/wager-positions/${eventId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data: WagerData = await response.json(); // Explicitly typing the response

      // Ensure TypeScript recognizes the type of `outcome`
      const matchedOutcome = data.event.outcomes.find(
        (outcome) => outcome._id === data.event_outcome_id
      );

      // Update wagerData state with only the matched outcome
      setWagerData({
        ...data,
        event: {
          ...data.event,
          outcomes: matchedOutcome ? [matchedOutcome] : [], // Ensure outcomes remains an array
        },
      });

      setSelectedOrder(
        `${data?.event_outcome_id}. ${data?.event_outcome.name}`
      );
    } catch (error) {
      console.log("Error fetching wager data", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchWagerData();
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (wagerData) {
        setIsLoading(true);
        setIsOrderMade(true);
        await makeOrder(
          wagerData?.event_outcome_id,
          wagerData?.event_id,
          true,
          1,
          0,
          10,
          10
        );
      }
      if (window.innerWidth >= 768) {
        // Check if the view is desktop (768px and above)
        setMarginClicked(true);
      }
    } catch (error) {
      console.log("Error adding margin", error);
    }
  };

  console.log("margin button", marginClicked);

  const fetchEvent = async () => {
    if (!wagerData?.event_id) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${wagerData?.event_id}`
      );
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
    if (wagerData?.event_id) {
      fetchEvent();
    }
  }, [wagerData?.event_id]);

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

  return (
    <div>
      <Navbar />
      <div className="md:px-[12%] 2xl:px-[19%]">
        <div className="md:block hidden">
          <HeadingSlider filter={filter} setFilter={setFilter} />
        </div>
        <div className="flex flex-col md:flex-row md:mt-14">
          <div className="md:w-[68%] xl:w-[72%] md:block hidden">
            {eventData ? (
              <>
                <CategoryInfo eventData={eventData} />
                <div className="px-5">
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
          <div className="md:mt-5 w-full md:w-[32%] xl:w-[28%]">
            {!marginClicked ? (
              <div className="pb-10 md:pb-5 md:bg-[#171717] rounded-2xl sticky top-[70px]">
                <div className="p-5">
                  <h1 className="text-center text-[22px] mb-4 md:text-[1.1vw] md:mb-[1.2vw]">
                    Your Order
                  </h1>
                  <div>
                    <div className="flex mt-7 gap-3">
                      <button className="border border-[#00FFB8] px-4 py-2 text-xs text-[#2DC198] rounded-md md:rounded-sm md:py-[2px] md:text-[0.6vw]">
                        {eventData && eventData.category.name || "Global"}
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
                    <p className="text-[21px] tracking-[2px] md:text-[0.8vw] md:tracking-[1.5px] md:leading-[1.4vw] font-light mt-4">
                      {wagerData?.event?.description}
                    </p>
                    <p className="text-[#3E3E3E] text-[16px] mt-2 md:text-[0.8vw] md:mt-[0.8vw]">
                      ID: {wagerData?.event_id}
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
                          $
                          {wagerData &&
                            Math.round(wagerData?.indicative_payout)}
                          <span className="text-[14px] text-[#E49C29] flex items-end md:text-[0.85vw]">
                            +{wagerData?.indicative_return.toFixed(0)}%
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[#5D5D5D] text-[17px] md:text-[0.75vw] mb-1 md:mb-0">
                          Your Traded Probability
                        </p>
                        <p className="flex justify-between text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                          {wagerData?.probability &&
                            Math.round(wagerData?.probability * 100).toFixed(0)}
                          %
                          <span className="text-[14px] text-[#E49C29] flex items-end md:text-[0.85vw]">
                            {wagerData &&
                            wagerData?.event?.outcomes[0].histories
                              ?.estimated_probability_24hr_change > 0
                              ? "+"
                              : ""}
                            {wagerData &&
                              Math.round(
                                wagerData?.event?.outcomes[0].histories
                                  ?.estimated_probability_24hr_change * 10
                              )}
                            %
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Image
                        src="/Images/line.png"
                        alt=""
                        height={300}
                        width={300}
                        className="my-5"
                      />
                    </div>

                    {/* Order Data */}
                    <div className="mb-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-[19px] font-light md:text-[0.7vw]">
                          {wagerData?.event_outcome_id}.{" "}
                          {wagerData?.event_outcome.name}
                        </p>
                        <div className="flex justify-between items-center gap-2">
                          <div className="w-[80%] h-[19px]">
                            <div
                              className="h-[19px] rounded-lg bg-[#00FFBB] md:h-[14px]"
                              style={{
                                width: `${Math.round(
                                  (wagerData?.probability ?? 0) * 100
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-[19px] font-light md:text-[0.7vw]">
                            {Math.round((wagerData?.probability ?? 0) * 100)}%
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

                    {/* Financial Information */}
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-[1px]">
                          <p className="text-[#5D5D5D] text-[13px] md:text-[0.85vw]">
                            Cash used
                          </p>
                          <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                            ${wagerData?.pledge.toFixed(1)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="flex flex-col gap-[1px]">
                          <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                            Projected payout
                          </p>
                          <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                            ${wagerData?.indicative_payout.toFixed(0)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-[1px] items-end">
                          <p className="text-[#5D5D5D] text-[13px] md:text-[0.75vw]">
                            Your return
                          </p>
                          <p className="text-[22px] text-[#00FFB8] md:text-[1.2vw]">
                            +{wagerData?.indicative_return.toFixed(0)} %
                          </p>
                        </div>
                      </div>
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
                            {wagerData?.event_outcome_id}.{" "}
                            {wagerData?.event_outcome.name}
                          </p>
                          <div className="flex justify-between items-center gap-2">
                            <div className="w-[80%] h-[19px]">
                              <div
                                className="h-[19px] rounded-lg bg-[#00FFBB] md:h-[14px]"
                                style={{
                                  width: `${Math.round(
                                    (wagerData?.probability ?? 0) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-[19px] font-light md:text-[0.7vw]">
                              {Math.round((wagerData?.probability ?? 0) * 100)}%
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
                        {wagerData && (
                          <DrawGraph
                            data={graphData}
                            outcomeIds={[wagerData?.event_outcome_id]}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-5">
                  {wagerData && wagerData?.is_leveraged ? (
                    <button
                      onClick={handleSubmit}
                      className="text-[#000] w-full text-[18px] border bg-[#5DFF00] mt-6 py-5 rounded-2xl md:text-[0.9vw] md:py-[0.65vw] md:mb-5"
                    >
                      Add Margin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsLoading(true);
                        router.push(`/events/${wagerData?.event_id}`);
                      }}
                      className="text-[#000] w-full text-[18px] border bg-[#5DFF00] mt-6 py-5 rounded-2xl md:text-[0.9vw] md:py-[0.65vw] md:mb-5"
                    >
                      Trade on this event again
                    </button>
                  )}
                </div>
                <div className="md:hidden">
                  <MakeOrder />
                </div>
              </div>
            ) : (
              <div className="hidden md:block md:mt-5">
                <MakeOrderDesktop />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="md:block hidden">
        <Footer />
      </div>
    </div>
  );
}
