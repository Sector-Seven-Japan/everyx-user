"use client";
import { AppContext } from "@/app/Context/AppContext";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

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

export default function OrderSuccess() {
  const router = useRouter();
  const { setIsLoading, orderDetails, selectedOrder, API_BASE_URL } =
    useContext(AppContext);
  const categoryId = orderDetails?.event_id;
  const [eventData, setEventData] = useState<EventData | null>(null);

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
    fetchEvent();
    setIsLoading(false);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="px-8 py-5">
        <div className="flex flex-col items-center justify-center text-center gap-8 mt-5">
          <Image
            src="/Icons/SuccessIcon.png"
            alt=""
            width={70}
            height={70}
          ></Image>
          <p className="text-lg font-light">
            Your order has been successfully processed!
          </p>
        </div>

        <div className="mt-20">
          <div className="flex gap-3">
            <button className="border border-[#00FFB8] px-4 py-1 text-xs text-[#2DC198] rounded-md">
              {eventData?.category?.name?.split(" ")[0]}
            </button>
            <p className="text-[#2DC198] flex gap-1 items-center font-light">
              <Image
                src={"/Images/FreeClock i.png"}
                alt="clock"
                height={18}
                width={18}
              />
              1 Day and 23h30m
            </p>
          </div>
          <p className="text-[21px] font-light mt-4">
            {eventData?.description}
          </p>
          <p className="text-[#3E3E3E] mt-2">ID: NDSJHDH676235</p>

          <div className="h-[0.5px] w-[70%] mb-6 border-t border-dashed mx-auto mt-6 border-[#575757]"></div>

          <div className="mb-8">
            <div className="flex flex-col gap-2">
              <p className="text-[19px] font-light">{selectedOrder}</p>
              <div className="flex justify-between items-center gap-2">
                <div className="w-[80%] h-[19px]">
                  <div
                    className="h-[19px] rounded-lg bg-[#00FFBB]"
                    style={{
                      width: `80%`,
                    }}
                  ></div>
                </div>
                <p className="text-[19px] font-light">
                  {Math.round(orderDetails?.current_probability * 100)}%
                </p>
                <Image
                  src="/Images/checkbox.png"
                  alt="checkbox"
                  height={20}
                  width={20}
                />
              </div>
            </div>
          </div>

          <div className="h-[0.5px] w-[70%] mb-6 border-t border-dashed mx-auto mt-6 border-[#575757]"></div>

          <div className="flex justify-between">
            <div className="flex flex-col gap-[1px]">
              <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
              <p className="text-[22px] text-[#00FFB8]">
                ${orderDetails?.after_wager.toFixed(1)}
              </p>
            </div>
            <div className="flex flex-col gap-[1px] items-end">
              <p className="text-[#5D5D5D] text-[13px]">Leverage cash value</p>
              <p className="text-[22px] text-[#00FFB8]">
                $2{" "}
                <span className="text-sm text-[#E49C29]">
                  x {orderDetails?.leverage}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col mt-10 gap-4">
          <button
            onClick={() => {
              setIsLoading(true);
              router.push(`/events/${categoryId}`);
            }}
            className="bg-[#00FFB8] py-3 rounded-md text-black text-[18px] flex items-center justify-center gap-3"
          >
            Trade on this event again
            <Image
              src="/Images/rightarrowicon.png"
              alt=""
              height={15}
              width={12}
            />
          </button>
          <button
            onClick={() => {
              setIsLoading(true);
              router.push("/deposit-withdrawal/history");
            }}
            className="bg-[#222222] py-3 rounded-md text-[#00FFB8] text-[18px]"
          >
            View in Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
