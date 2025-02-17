"use client"
import { AppContext } from "@/app/Context/AppContext";
import { useContext } from "react";

// Define the structure of the eventData
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

interface CategoryInfoProps {
  eventData: EventData;
}

export default function CategoryInfo({
  eventData,
}: CategoryInfoProps) {
  const { calculateMaxEstimatedPayout, calculateMaxLeverage, formatDate,isOrderMade } =
    useContext(AppContext);

  // Handle the case when eventData is null
  if (!eventData) {
    return <p>Loading...</p>; // or some other loading UI
  }

  return (
    <div className="p-5">
      <div className="relative flex gap-3 items-center h-48 w-full">
        <img
          className="h-full w-full object-cover"
          src={eventData?.event_images_url[0]}
          alt={eventData?.name || "Event Image"}
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      {/* Card Details */}
      <div className="flex mt-3 gap-3">
        <button className="border border-[#00FFB8] px-4 py-1 text-xs text-[#00FFB8] rounded-sm">
          {eventData?.category?.name?.split(" ")[0]}
        </button>
        <p className="text-[#00FFB8]">{formatDate(eventData?.ends_at)}</p>
      </div>
      <div className="pt-4">
        <p className="font-light">{eventData?.description}</p>
      </div>
      {!isOrderMade && (
        <div className="flex gap-3 mt-5 leading-6 mb-5">
          <div className="w-1/2 px-4 py-3 bg-[#131313] rounded-md">
            <p className="text-[#2DC198] text-[24px] font-light">
              {eventData?.outcomes?.length
                ? `${calculateMaxLeverage(eventData?.outcomes)}x`
                : "N/A"}
            </p>
            <p className="text-[13px]">Maximum leverage:</p>
          </div>
          <div className="w-1/2 px-4 py-3 bg-[#131313] rounded-md">
            <p className="text-[#2DC198] text-[24px] font-light">
              {calculateMaxEstimatedPayout(eventData?.outcomes).toFixed(0)}%
            </p>
            <p className="text-[13px]">Maximum return:</p>
          </div>
        </div>
      )}
    </div>
  );
}
