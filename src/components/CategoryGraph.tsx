"use client";
import { AppContext } from "@/app/Context/AppContext";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";

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
  const { makeOrder, setIsOrderMade, setSelectedOrder, setIsLoading } =
    useContext(AppContext);

  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(
    null
  );

  useEffect(() => {
    // setIsOrderMade(false);
  }, []);

  return (
    <div className="mt-3">
      <h1 className="px-5 text-[23px] md:text-[16px]">What do you predict ?</h1>
      <div className="pl-5 pr-5 py-8 flex flex-col gap-5">
        {eventData?.outcomes.map((outcome: Outcome, index: number) => (
          <div key={outcome._id} className="flex flex-col gap-1">
            <p className="text-[19px] font-light md:text-[14px]">
              {String.fromCharCode(65 + index)}.{" "}
              {outcome.name.charAt(0).toUpperCase() + outcome.name.slice(1)}
            </p>
            <div className="flex justify-between items-center gap-2">
              <div className="w-[80%] h-[19px] md:h-[19px]">
                <div
                  onClick={async () => {
                    setSelectedOrder(
                      String.fromCharCode(65 + index) +
                        ". " +
                        outcome.name.charAt(0).toUpperCase() +
                        outcome.name.slice(1)
                    );
                    setIsLoading(true);
                    await makeOrder(
                      outcome._id,
                      eventData._id,
                      false,
                      1,
                      0,
                      10,
                      10
                    );
                    setIsOrderMade(true);
                    setSelectedOutcomeId(outcome._id);
                  }}
                  className="h-[19px] rounded-lg cursor-pointer hover:opacity-80 transition-opacity md:h-[19px]"
                  style={{
                    backgroundColor: outcomeColors[index],
                    width: `${Math.round(
                      outcome.trader_info.estimated_probability * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex gap-5 items-center">
                <p className="text-[19px] font-light md:text-[14px]">
                  {Math.round(outcome.trader_info.estimated_probability * 100)}%
                </p>
                <div className="md:w-4">
                  <Image
                    src={
                      selectedOutcomeId === outcome._id
                        ? "/Images/checkbox.png"
                        : "/Images/checkbox_grey.png"
                    }
                    alt="checkbox"
                    height={20}
                    width={20}
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
