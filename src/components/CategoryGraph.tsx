"use client";
import { AppContext } from "@/app/Context/AppContext";
import { useContext, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

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

interface EventData {
  _id: string;
  name: string;
  description: string;
  category: Category;
  ends_at: string;
  outcomes: Outcome[];
  event_images_url: string[];
}

interface CategoryInfoProps {
  eventData: EventData;
}

const outcomeColors = ["#00FFBB", "#FF5952", "#924DD3", "#26A45B", "#3661DF"];

export default function CategoryGraph({ eventData }: CategoryInfoProps) {
  const {
    makeOrder,
    setIsOrderMade,
    setSelectedOrder,
    setIsLoading,
    setSelectedOutcomeId,
    selectedOutcomeId,
    authToken,
    makeOrderWithoutAuth,
  } = useContext(AppContext);

  const pathname = usePathname();

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;


    if (
      isDesktop &&
      pathname.startsWith("/events/") &&
      !pathname.match(/^\/events\/[^/]+\/order$/) && 
      !pathname.match(/^\/events\/[^/]+\/order\/success$/)
    ) {
      setIsLoading(true);
      const outcome = eventData?.outcomes[0];

      if (outcome) {
        setSelectedOrder(
          String.fromCharCode(65) +
            ". " +
            outcome.name.charAt(0).toUpperCase() +
            outcome.name.slice(1)
        );
        setSelectedOutcomeId(outcome._id);

        (async () => {
          if (authToken) {
            await makeOrder(outcome._id, eventData._id, false, 1, 0, 10, 10);
          } else {
            await makeOrderWithoutAuth(
              outcome._id,
              eventData._id,
              false,
              1,
              0,
              10,
              10
            );
          }
          setIsOrderMade(true);
        })();
      }
    }
  }, [pathname]); // Include pathname in the dependency array


  return (
    <div className="mt-3 md:mt-20">
      <h1 className="px-5 text-[23px] md:text-[1.2vw] md:tracking-[1.1px] md:mb-9">
        What do you predict ?
      </h1>
      <div className="pl-5 pr-5 py-8 flex flex-col gap-5">
        {eventData?.outcomes.map((outcome: Outcome, index: number) => (
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
                  eventData._id,
                  false,
                  1,
                  0,
                  10,
                  10
                );
              } else {
                await makeOrderWithoutAuth(
                  outcome._id,
                  eventData._id,
                  false,
                  1,
                  0,
                  10,
                  10
                );
              }
              setIsOrderMade(true);
              setSelectedOutcomeId(outcome._id);
            }}
            key={outcome._id}
            className="flex flex-col gap-1"
          >
            <div className="text-[19px] font-light md:text-[1.2vw]">
              {String.fromCharCode(65 + index)}.{" "}
              {outcome.name.charAt(0).toUpperCase() + outcome.name.slice(1)}
            </div>

            <div className="flex justify-between items-center gap-2">
              <div className={`w-[80%] h-[19px] md:h-[1.5vw] rounded-lg`}>
                <div
                  className="h-[19px] rounded-lg cursor-pointer hover:opacity-80 transition-opacity md:h-[1.5vw] md:rounded-xl"
                  style={{
                    backgroundColor: outcomeColors[index],
                    width: `${Math.round(
                      outcome.trader_info.estimated_probability * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex gap-5 items-center">
                <div className="text-[19px] font-light md:text-[1.3vw]">
                  {Math.round(outcome.trader_info.estimated_probability * 100)}%
                </div>
                <div className="">
                  <Image
                    src={
                      selectedOutcomeId === outcome._id
                        ? "/Images/checkbox.png"
                        : "/Images/checkbox_grey.png"
                    }
                    alt="checkbox"
                    height={20}
                    width={20}
                    className="md:h-[1.5vw] md:w-[1.5vw]"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
