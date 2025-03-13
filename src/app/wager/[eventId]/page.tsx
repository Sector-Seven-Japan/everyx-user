"use client";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
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
import CategoryActivity from "@/components/CategoryActivity";

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
  const eventId = params.eventId as string;
  const [wagerData, setWagerData] = useState<WagerData | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [minuteGraphData, setMinuteGraphData] = useState<GraphData[]>([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [countdown, setCountdown] = useState<string>("");
  const [marginClicked, setMarginClicked] = useState<boolean>(false);
  const [filterGraph, setFilterGraph] = useState("ALL");

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
      const data: WagerData = await response.json();

      const matchedOutcome = data.event.outcomes.find(
        (outcome) => outcome._id === data.event_outcome_id
      );

      setWagerData({
        ...data,
        event: {
          ...data.event,
          outcomes: matchedOutcome ? [matchedOutcome] : [],
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
      setIsLoading(true);
      fetchWagerData();
      setIsLoading(false);
    }
  }, [authToken, eventId]);

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
        setMarginClicked(true);
      }
    } catch (error) {
      console.log("Error adding margin", error);
    }
  };

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

  const chartGraph = useMemo(() => {
    return wagerData ? (
      <DrawGraph
        data={filterGraph === "1h" ? minuteGraphData : graphData}
        outcomeIds={[wagerData.event_outcome_id]}
        graphFilter={filterGraph}
      />
    ) : null;
  }, [graphData, minuteGraphData, wagerData?.event_outcome_id, filterGraph]);

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
            {!marginClicked ? (
              <div className="pb-10 md:pb-5 md:bg-[#171717] rounded-2xl sticky top-[70px]">
                <div className="p-5">
                  <h1 className="text-center text-[22px] mb-4 md:text-[1.1vw] md:mb-[1.2vw]">
                    Your Order
                  </h1>
                  <div>
                    <div className="flex mt-7 gap-3">
                      <button className="border border-[#00FFB8] px-4 py-2 text-xs text-[#2DC198] rounded-md md:rounded-sm md:py-[2px] md:text-[0.6vw]">
                        {(eventData && eventData?.category?.name) || "Global"}
                      </button>
                      <div className="text-[#2DC198] flex gap-1 items-center font-light">
                        <span className="md:w-3 inline-block">
                          <Image
                            src={"/Images/FreeClock i.png"}
                            alt="clock"
                            height={18}
                            width={18}
                          />
                        </span>
                        <span className="text-[#2DC198] md:text-[0.7vw]">
                          {countdown}
                        </span>
                      </div>
                    </div>
                    <p className="text-[21px] tracking-[2px] md:text-[0.8vw] md:tracking-[1.5px] md:leading-[1.4vw] font-light mt-4">
                      {wagerData?.event?.description}
                    </p>
                    <p className="text-[#3E3E3E] text-[16px] mt-2 md:text-[0.8vw] md:mt-[0.8vw]">
                      ID: {wagerData?.event_id}
                    </p>
                  </div>
                </div>

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

                {option === "Order details" ? (
                  <div className="p-5">
                    <div className="flex md:flex-col justify-between mt-5 md:mt-2 md:gap-3">
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
                        height={500}
                        width={500}
                        className="my-5"
                      />
                    </div>

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
                  <div className="p-5">
                    <div className="mt-5">
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

                        {isLoadingGraph ? (
                          <div className="flex justify-center items-center h-40">
                            <p className="text-[#00FFBB] text-lg md:text-xs">
                              Loading graph...
                            </p>
                          </div>
                        ) : (
                          chartGraph
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
              <div className="hidden tailwind md:block sticky top-[70px]">
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
