"use client";
import { AppContext } from "@/app/Context/AppContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

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

export default function CategoryInfo({ eventData }: CategoryInfoProps) {
  const { calculateMaxEstimatedPayout, calculateMaxLeverage, getCountdown } =
    useContext(AppContext);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (eventData?.ends_at) {
      setCountdown(getCountdown(eventData.ends_at));
      const interval = setInterval(() => {
        setCountdown(getCountdown(eventData.ends_at));
      }, 1000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [eventData?.ends_at, getCountdown]);

  // Handle the case when eventData is null
  if (!eventData) {
    return <p>Loading...</p>; // or some other loading UI
  }
  return (
    <div className="p-5">
      <div className="relative flex gap-3 items-center h-48 w-full rounded-t-2xl overflow-hidden">
        {eventData.event_images_url && (
          <img
            className="h-full w-full object-cover"
            src={eventData?.event_images_url[0]}
            alt={eventData?.name || "Event Image"}
          />
        )}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
      </div>
      {/* Card Details */}
      <div className="flex mt-3 gap-3 md:gap-7">
        <button className="border-[1px] border-[#2DC198] px-4 py-1 text-xs text-[#2DC198] rounded-sm md:text-[1.2vw] md:py-[0.65vw] md:px-[1.4vw] md:rounded-md">
          {eventData?.category?.name?.split(" ")[0] || "Global"}
        </button>
        <p className="text-[#2DC198] flex gap-2 items-center font-light">
          <Image
            src={"/Images/FreeClock i.png"}
            alt="clock"
            height={18}
            width={18}
          />

          <p className="md:text-[0.8vw] text-[#2DC198]">{countdown}</p>
        </p>
      </div>
      <div className="pt-4">
        <p className="font-light text-[20px] md:text-[1.6vw] md:tracking-[3px] md:mb-10">
          {eventData?.description}
        </p>
      </div>
      {
        <div className="flex gap-3 mt-5 leading-6 mb-5 md:leading-[1.9vw]">
          <div className="w-1/2 px-4 py-3 bg-[#131313] rounded-md md:px-[2vw] md:py-[1vw]">
            <p className="text-[#2DC198] text-[24px] font-light md:text-[1.5vw]">
              {eventData?.outcomes?.length
                ? `${calculateMaxLeverage(eventData?.outcomes)}x`
                : "N/A"}
            </p>
            <p className="text-[13px] md:text-[1vw]">Maximum leverage:</p>
          </div>
          <div className="w-1/2 px-4 py-3 bg-[#131313] rounded-md md:px-[2vw] md:py-[1vw]">
            <p className="text-[#2DC198] text-[24px] font-light md:text-[1.5vw]">
              {calculateMaxEstimatedPayout(eventData?.outcomes).toFixed(0)}%
            </p>
            <p className="text-[13px] md:text-[1vw]">Maximum return:</p>
          </div>
        </div>
      }
    </div>
  );
}
