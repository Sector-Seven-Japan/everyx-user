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
      <div className="flex gap-3 md:gap-8">
        <div className="h-[70px] min-w-[70px] md:w-[8vw] md:h-[8vw] w-[70px] cursor-pointer flex-shrink-0">
          <img
            className="h-full w-full object-cover rounded"
            src={eventData?.event_images_url[0]}
            alt={eventData?.name || "Event Image"}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center md:justify-end md:gap-5 gap-2">
          <div>
            <p className="text-[#2DC198] flex gap-1 md:gap-6 items-center font-light">
              <div className="flex-shrink-0">
                <Image
                  src={"/Images/FreeClock i.png"}
                  alt="clock"
                  height={18}
                  width={18}
                  className="md:w-[2vw] md:h-[2vw]"
                />
              </div>
              <p className="text-[#2DC198] text-[15px] md:text-[1.4vw] whitespace-nowrap">
                {countdown}
              </p>
            </p>
          </div>
          <div className="cursor-pointer">
            <p className="font-light text-[14px] md:text-[1.4vw] line-clamp-2 inter tracking-[0.9px]">
              {eventData?.name}
            </p>
          </div>
        </div>
      </div>
      {
        <div className="flex gap-3 mt-10 leading-6 mb-5 md:leading-[1.9vw]">
          <div className="w-1/2 px-4 py-3 bg-[#131313] rounded-md md:px-[2vw] md:py-[1vw]">
            <p className="text-[#2DC198] text-[24px] font-light md:text-[1.5vw] ">
              {eventData?.outcomes?.length
                ? `${calculateMaxLeverage(eventData?.outcomes)}x`
                : "N/A"}
            </p>
            <p className="text-[13px] md:text-[1vw] ">Maximum leverage:</p>
          </div>
          <div className="w-1/2 px-4 py-3 bg-[#131313] rounded-md md:px-[2vw] md:py-[1vw]">
            <p className="text-[#2DC198] text-[24px] font-light md:text-[1.5vw] ">
              {calculateMaxEstimatedPayout(eventData?.outcomes).toFixed(0)}%
            </p>
            <p className="text-[13px] md:text-[1vw] ">Maximum return:</p>
          </div>
        </div>
      }
    </div>
  );
}
