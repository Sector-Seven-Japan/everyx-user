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

export default function EventCategoryPageDetails() {
  const { filter, setFilter, setIsLoading, API_BASE_URL } =
    useContext(AppContext);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const params = useParams();
  const categoryId = params?.categoryId as string | undefined;
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);

  // Memoized fetch function
  const fetchEvent = useCallback(async () => {
    if (!categoryId) return;

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
  }, [categoryId, setIsLoading, API_BASE_URL]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

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

  return (
    <div className="relative">
      <Navbar home="Home" />
      <HeadingSlider filter={filter} setFilter={setFilter} />
      {eventData ? (
        <>
          <CategoryInfo eventData={eventData} />
          <CategoryGraph
            eventData={eventData}
          />
          <div className="px-5">
            <h1 className="text-[23px] mb-8 mt-5">Live Chart</h1>
            {isLoadingGraph ? (
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
        <p className="text-center text-gray-500">Loading event details...</p>
      )}
      <Footer />
      <MakeOrder/>
    </div>
  );
}
