import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

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
}

export default function CategoryCard({ item }: CategoryCardProps) {
  const { getCountdown } = useContext(AppContext);
  const router = useRouter();
  const { setIsLoading, setSelectedOrder, makeOrderWithoutAuth, makeOrder, authToken, setIsOrderMade, setSelectedOutcomeId } = useContext(AppContext);

  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (item?.ends_at) {
      setCountdown(getCountdown(item.ends_at));
      const interval = setInterval(() => {
        setCountdown(getCountdown(item.ends_at));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [item?.ends_at, getCountdown]);

  const handleNavigation = async () => {
    try {
      setIsLoading(true);
      router.push(`/events/${item?._id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // Function to truncate text if it's longer than the specified length
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Determine if we need to show a scrollbar
  const showScrollbar = item?.outcomes.length > 4;

  return (
    <div className="cursor-pointer h-full relative flex flex-col justify-between border border-transparent rounded-lg">
      <div className="flex gap-3">
        <div onClick={handleNavigation} className="h-[70px] min-w-[70px] w-[70px] cursor-pointer flex-shrink-0">
          <img
            className="h-full w-full object-cover rounded"
            src={item?.event_images_url[0]}
            alt={item?.name || "Event Image"}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="text-[#2DC198] flex gap-1 items-center font-light">
              <div className="flex-shrink-0">
                <Image
                  src={"/Images/FreeClock i.png"}
                  alt="clock"
                  height={18}
                  width={18}
                />
              </div>
              <p className="text-[#2DC198] text-[12px] md:text-[14px] whitespace-nowrap">
                {countdown}
              </p>
            </p>
          </div>
          <div className="cursor-pointer" onClick={handleNavigation}>
            <p className="font-light text-[13px] md:text-[15px] line-clamp-2 inter tracking-[0.9px] leading-5">
              {item?.name}
            </p>
          </div>
        </div>
      </div>

      <div className={`mt-6 ${showScrollbar ? 'max-h-[180px] overflow-y-auto pr-1' : ''}`}>
        <div className="flex flex-col gap-1">
          {item?.outcomes.map((outcome: Outcome, index: number) => {
            const formattedName = outcome.name.charAt(0).toUpperCase() + outcome.name.slice(1);
            const displayName = truncateText(formattedName, 20);
            
            return (
              <div key={index} className="flex w-full items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] md:text-[14px] truncate">
                    {String.fromCharCode(65 + index)}. {displayName}
                  </p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="font-semibold text-[12px] md:text-[14px] whitespace-nowrap">
                    {Math.round(outcome.trader_info.estimated_probability * 100)}%
                  </div>
                  <button
                    onClick={async () => {
                      setSelectedOrder(
                        String.fromCharCode(65 + index) +
                          ". " +
                          outcome.name.charAt(0).toUpperCase() +
                          outcome.name.slice(1)
                      );
                      setIsLoading(true);
                      if (authToken) {
                        await makeOrder(
                          outcome._id,
                          item._id,
                          false,
                          1,
                          0,
                          10,
                          10
                        );
                      } else {
                        await makeOrderWithoutAuth(
                          outcome._id,
                          item._id,
                          false,
                          1,
                          0,
                          10,
                          10
                        );
                      }
                      setIsOrderMade(true);
                      setSelectedOutcomeId(outcome._id);
                      router.push(`/events/${item._id}?selected=true`)
                    }}
                    className="cursor-pointer bg-[#2C4B51] text-[#00FFB8] text-[11px] md:text-[14px] px-6 py-1 rounded-md whitespace-nowrap"
                  >
                    Buy
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleNavigation}
        className="text-[#00ffbb] text-sm border border-[#00ffbb] w-full rounded-md py-2 md:py-3 md:text-[14px] mt-5"
      >
        View More
      </button>
    </div>
  );
}