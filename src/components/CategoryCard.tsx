import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import DrawGraph from "./DrawGraph";
import Image from "next/image";

// Define the GraphData type
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

// Define types for the properties
interface TraderInfo {
  max_leverage: number;
  estimated_payout: number;
  estimated_probability: number;
}

interface Outcome {
  _id: string;
  name: string;
  trader_info: TraderInfo;
}

interface Category {
  name: string;
}

interface Item {
  _id: string;
  name: string;
  description: string;
  category: Category;
  ends_at: string;
  outcomes: Outcome[];
  event_images_url: string[];
}

interface CategoryCardProps {
  item: Item;
  showTime: boolean;
  showChart: boolean;
  showPrediction: boolean;
  hide: boolean;
}

interface EventHistoryParams {
  precision?: "hour" | "day" | "month";
  from?: string;
  to?: string;
  eventId: string;
}

export default function CategoryCard({
  item,
  showChart,
  showPrediction,
  hide,
}: CategoryCardProps) {
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const { API_BASE_URL, getCountdown } = useContext(AppContext);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const router = useRouter();
  const { setIsLoading, calculateMaxLeverage, calculateMaxEstimatedPayout } =
    useContext(AppContext);
  const [countdown, setCountdown] = useState<string>("");

  const outcomeColors = ["#00FFBB", "#FF5952", "#924DD3", "#26A45B", "#3661DF"];

  const handleNavigation = async () => {
    try {
      setIsLoading(true);
      router.push(`/events/${item?._id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  useEffect(() => {
    if (item?.ends_at) {
      setCountdown(getCountdown(item.ends_at));
      const interval = setInterval(() => {
        setCountdown(getCountdown(item.ends_at));
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [item?.ends_at, getCountdown]);

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
        throw error; // Re-throw the error to handle it in the calling code
      }
    };

    const fetchData = async () => {
      try {
        const currentDate = new Date().toISOString();
        const data = await getGraphData({
          eventId: item?._id,
          precision: "hour",
          from: "2025-02-01T18:30:00.000Z",
          to: currentDate,
        });
        setGraphData(data);
      } catch (error) {
        // Handle error appropriately
        console.error("Failed to fetch graph data:", error);
      } finally {
        setIsLoadingGraph(false); // Stop loading
      }
    };

    fetchData();
  }, [item?._id, API_BASE_URL]);

  return (
    <div className="rounded-xl overflow-hidden cursor-pointer h-full relative flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="relative flex gap-3 items-center h-52 md:h-32">
          <img
            className="h-full w-full object-cover"
            src={item?.event_images_url[0]}
            alt={item?.name || "Event Image"}
          />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Card Details */}
        <div className="flex mt-3 gap-3 md:mt-2 items-center">
          <button className="border border-[#2DC198] px-4 py-1 text-xs text-[#2DC198] rounded-sm md:text-[0.65vw] md:px-4 md:py-[1px]">
            {item?.category?.name?.split(" ")[0] || "Global"}
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
            <p className="text-[#2DC198] md:text-[0.68vw]">{countdown}</p>
          </p>
        </div>
        <div className="pt-4">
          <p
            className={`font-light md:text-[0.65vw] md:line-clamp-2 md:min-h-[20px] inter tracking-[1.2px] ${
              !hide && "md:text-[0.7vw]"
            }`}
          >
            {item?.name}
          </p>
        </div>
        <div
          className={`flex gap-3 mt-5 leading-0 md:mb-0 mb-5 ${
            hide && "hidden"
          }`}
        >
          <div className={`w-1/2 px-4 py-3 bg-[#131313] rounded-md md:py-2`}>
            <p className="text-[#2DC198] text-[24px] font-light md:text-[14px]">
              {item?.outcomes?.length
                ? `${calculateMaxLeverage(item.outcomes)}x`
                : "N/A"}
            </p>
            <p className="text-[13px] md:text-[0.5vw]">Maximum leverage:</p>
          </div>
          <div className={`w-1/2 px-4 py-3 bg-[#131313] rounded-md md:py-2`}>
            <p className="text-[#2DC198] text-[24px] font-light md:text-[14px]">
              {calculateMaxEstimatedPayout(item?.outcomes).toFixed(0)}%
            </p>
            <p className="text-[13px] md:text-[0.5vw]">Maximum return:</p>
          </div>
        </div>
        {
          <div>
            <div
              className={`flex flex-col gap-5 mb-7 md:gap-1 md:mb-0 ${
                !showChart && "hidden"
              } `}
            >
              {isLoadingGraph ? (
                <div className="flex justify-center items-center h-40">
                  <p className="text-[#00FFBB] text-lg md:text-xs">
                    Loading graph...
                  </p>
                </div>
              ) : (
                <div className="flex justify-center items-center w-full h-full ">
                  <DrawGraph data={graphData} />
                </div>
              )}
            </div>
            <div
              className={`${
                !showPrediction && "hidden"
              } md:mt-5 flex flex-col gap-4`}
            >
              {item?.outcomes.map((outcome: Outcome, index: number) => (
                <div
                  key={outcome._id}
                  className={`flex flex-col gap-1 md:gap-2`}
                >
                  <p className="text-[19px] font-light md:text-[0.85vw]">
                    {String.fromCharCode(65 + index)}.{" "}
                    {outcome.name.charAt(0).toUpperCase() +
                      outcome.name.slice(1)}
                  </p>
                  <div className="flex justify-between items-center md:flex-col md:items-start gap-2 md:gap-1 md:mb-0">
                    <div
                      className="h-[19px] md:h-[15px] rounded-lg"
                      style={{
                        backgroundColor: outcomeColors[index],
                        width: `${Math.round(
                          outcome.trader_info.estimated_probability * 100
                        )}%`,
                      }}
                    ></div>
                    <p className="text-[19px] font-light md:text-[13px] md:hidden">
                      {Math.round(
                        outcome.trader_info.estimated_probability * 100
                      )}
                      %
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      </div>
      <button
        onClick={handleNavigation}
        className="text-[#2DC198] text-sm border border-[#2DC198] w-full rounded-md mb-2 py-[10px] md:py-[.5vw] md:font-light md:text-[0.68vw] mt-5"
      >
        View More
      </button>
    </div>
  );
}
