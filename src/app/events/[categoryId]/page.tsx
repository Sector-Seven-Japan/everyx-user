"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import CategoryGraph from "@/components/CategoryGraph";
import CategoryInfo from "@/components/CategoryInfo";
import Footer from "@/components/Footer";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import MakeOrder from "@/components/MakeOrder";
import CategoryRule from "@/components/CategoryRule";
import DrawGraph from "@/components/DrawGraph";
import MakeOrderDesktop from "@/components/MakeOrderDesktop";
import CategoryActivity from "@/components/CategoryActivity";

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
  precision?: "hour" | "minute";
  from?: string;
  to?: string;
  eventId: string;
}

export default function EventCategoryPageDetails() {
  const { filter, setFilter, setIsLoading, API_BASE_URL } =
    useContext(AppContext);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const params = useParams();
  const categoryId = params?.categoryId as string | undefined;
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [minuteGraphData, setMinuteGraphData] = useState<GraphData[]>([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [filterGraph, setFilterGraph] = useState("ALL");

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

  // Fetch event data
  useEffect(() => {
    if (!categoryId) return;

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/events/${categoryId}`);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setEventData(data);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        setEventData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [categoryId, setIsLoading, API_BASE_URL]);

  // Fetch hourly graph data only once when eventData._id changes
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
    <div className="w-full">
      <Navbar />
      <div className="md:px-[12%] 2xl:px-[19%]">
        <HeadingSlider filter={filter} setFilter={setFilter} />

        <div className="flex flex-col md:flex-row md:mt-0">
          <div className="xl:w-[70%] w-full">
            {eventData ? (
              <>
                <CategoryInfo eventData={eventData} />
                <div className="px-5 md:pl-0">
                  <h1 className="text-[18px] mb-8 xl:text-[1.4vw] inter font-semibold">
                    Live Chart
                  </h1>
                  <div className="flex justify-end gap-5 items-center">
                    {["1h", "6h", "1d", "1w", "1m", "ALL"].map((time) => (
                      <div
                        key={time}
                        className={`cursor-pointer text-white ${
                          filterGraph === time
                            ? "text-[#FFFFFF] font-semibold"
                            : "text-white/50 hover:text-white/75"
                        }`}
                        onClick={() => handleFilterChange(time)}
                      >
                        {time}
                      </div>
                    ))}
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
                        data={filterGraph === "1h" ? minuteGraphData : graphData}
                        graphFilter={filterGraph}
                      />
                    </div>
                  )}
                </div>
                <CategoryGraph eventData={eventData} />
                <CategoryRule />
                <CategoryActivity eventData={eventData} />
              </>
            ) : (
              <p className="text-center text-gray-500">Loading event details...</p>
            )}
          </div>
          <div className="mt-5 hidden md:block md:w-[30%]">
            <MakeOrderDesktop />
          </div>
        </div>
      </div>
      <div className="md:hidden block">
        <MakeOrder />
      </div>
      <Footer />
    </div>
  );
}
