"use client";
import { AppContext } from "@/app/Context/AppContext";
import { useContext, useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

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
  const searchParams = useSearchParams();
  const selected = searchParams.get("selected");
  const router = useRouter();

  useEffect(() => {
    if (selected) return;

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
      <h1 className="px-5 text-[18px] inter font-semibold mt-10 md:mt-0 md:text-[1.2vw] md:tracking-[1.1px] md:mb-12 mb-8">
        What do you predict ?
      </h1>

      <div className="flex w-full px-5 flex-col gap-3">
        {eventData?.outcomes?.map((outcome: Outcome, index: number) => {
          return (
            <div
              onClick={async () => {
                if (
                  pathname.match(/^\/events\/[^/]+\/order$/) ||
                  pathname.match(/^\/events\/[^/]+\/order\/success$/)
                ) {
                  if (selectedOutcomeId !== outcome._id) {
                    router.push(`/events/${eventData._id}?selected="true"`);
                  }
                }
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
              className="w-full h-[52px] rounded-sm md:h-[4.8vw] relative md:rounded-lg bg-[#131313] flex items-center md:px-12 px-8"
            >
              <div
                style={{
                  backgroundColor: outcomeColors[index],
                }}
                className={`absolute top-0 left-0 h-full rounded-lg ${selectedOutcomeId===outcome._id ? "w-full":"w-2"}`}
              ></div>
              <div className="flex gap-16 items-center">
                <span className={`z-10 text-[17px] md:text-[1.6vw] font-bold ${selectedOutcomeId===outcome._id ? "text-black":"text-white"}`}>
                  {Math.round(outcome.trader_info.estimated_probability * 100)}%
                </span>
                <p className={`z-10 text-[16px] md:text-[1.3vw] ${selectedOutcomeId===outcome._id? "text-black":"text-white"}`}>
                  {String.fromCharCode(65 + index)}.{" "}
                  {outcome.name.charAt(0).toUpperCase() + outcome.name.slice(1)}s
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
