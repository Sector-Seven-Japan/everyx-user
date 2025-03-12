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
        <div
          onClick={handleNavigation}
          className="pt-4 lg:h-[3vw] sm:h-[10vw] cursor-pointer"
        >
          <p
            className={` md:text-[0.65vw] md:line-clamp-2 md:min-h-[20px] europa  tracking-[1.2px]  ${
              !hide && "md:text-[0.7vw]"
            }`}
          >
            {item?.name}
          </p>
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

              ) : (
                <div className="flex justify-center items-center h-full ">
                  <DrawGraph data={graphData} />
                </div>
              )}
            </div>
            <div
              className={`${
                !showPrediction && "hidden"
              } md:mt-1 flex flex-col gap-4`}
            >
              {item?.outcomes.map((outcome: Outcome, index: number) => (
                <div
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
                    router.push(`/events/${item._id}?selected=true`);
                  }}
                  key={outcome._id}
                  className={`flex flex-col gap-1 md:gap-2 cursor-pointer`}
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