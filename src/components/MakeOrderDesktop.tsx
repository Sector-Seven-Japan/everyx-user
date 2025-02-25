import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";

export default function MakeOrder() {
  const { orderDetails, makeOrder, setIsLoading } =
    useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();
  const [leverage, setLeverage] = useState<number>(1.0); // Allow decimal values
  const [value, setValue] = useState<number>(10);
  const maxTradeSize = orderDetails?.max_wager;
  const maxLeverage = orderDetails?.max_leverage;
  const eventId = orderDetails?.event_id;
  const outcomeId = orderDetails?.event_outcome_id;

  const handleTradeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setValue(newValue);
  };

  const handleLeverage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeverage(parseFloat(parseFloat(e.target.value).toFixed(1))); // Ensures one decimal place
  };

  const handleTradeSizePlus = (amount: number) => {
    const currentValue = parseFloat(value.toString());
    const newValue = Math.min(currentValue + amount, maxTradeSize);
    setValue(newValue);
  };

  const handleLeveragePlus = (percentage: number) => {
    const increment = (maxLeverage * percentage) / 100;
    const newValue = Math.min(leverage + increment, maxLeverage);
    setLeverage(parseFloat(newValue.toFixed(1))); // Round to one decimal place
  };

  const leveragePercentage = ((leverage - 1) / (maxLeverage - 1)) * 100;
  const tradeSizePercentage = (value / maxTradeSize) * 100;

  // Format the display value to always show 2 decimal places
  const displayValue = value.toFixed(2);
  const [wholePart, decimalPart] = displayValue.split(".");

  const handleSubmit = async () => {
    setIsLoading(true);

    console.log(
      "submitting with this data",
      outcomeId,
      eventId,
      value,
      leverage
    );
    const wager = value * leverage;
    const loan = wager - value;

    if (pathname.startsWith("/wager/")) {
      router.push(`/betting/${eventId}`);
      await makeOrder(outcomeId, eventId, true, leverage, loan, value, wager);
    } else {
      router.push(`/events/${eventId}/order`);
      await makeOrder(outcomeId, eventId, false, leverage, loan, value, wager);
    }
  };
  useEffect(() => {
    if (!eventId || !outcomeId) return;
    setIsLoading(true);
    const wager = value * leverage;
    const loan = wager - value;

    const debounceTimer = setTimeout(() => {
      if (pathname.startsWith("/wager/")) {
        makeOrder(outcomeId, eventId, true, leverage, loan, value, wager);
      } else {
        makeOrder(outcomeId, eventId, false, leverage, loan, value, wager);
      }
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [value, leverage]);

  return (
    <div className="bg-[#141414] rounded-xl p-5">
      <h1 className="text-center text-[18px] mb-2">Your Order</h1>
      <div className="mb-10">
        <h1 className="text-[14px] mb-3">Total Size</h1>
        <div className="border-[#454545] flex rounded-md border-[0.4px] gap-2 p-2">
          <div className="w-[60%] px-2 text-[15px]">
            ${wholePart}.{decimalPart}
          </div>
          {[20, 50, 100].map((item, index) => {
            return (
              <button
                key={index}
                onClick={() => handleTradeSizePlus(item)}
                className="bg-[#1b1b1b] rounded-md px-2 font-semibold text text-[13px] hover:bg-[#2b2b2b]"
              >
                +{item}
              </button>
            );
          })}
        </div>
        <div className="pl-2 mt-1">
          <input
            type="range"
            min="0"
            max={maxTradeSize}
            step="0.01"
            value={value}
            onChange={handleTradeSize}
            style={{
              background: `linear-gradient(to right, #00FFB8 ${tradeSizePercentage}%, #171717 ${tradeSizePercentage}%)`,
            }}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#00FFB8] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#00FFB8] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex flex-row-reverse">
            <p className="text-[#00FFB8] text-xs mt-3">
              Max trade size | ${maxTradeSize.toFixed(1)} MAX
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h1 className="text-[14px] mb-3">Leverage</h1>
        <div className="border-[#454545] flex rounded-md border-[0.4px] gap-2 p-2">
          <div className="w-[60%] text-[15px] px-2">x{leverage}</div>
          {[20, 50, 100].map((item, index) => {
            return (
              <button
                key={index}
                onClick={() => handleLeveragePlus(item)}
                className="bg-[#1b1b1b] rounded-md px-2 font-semibold text text-[13px] hover:bg-[#2b2b2b]"
              >
                +{item}
              </button>
            );
          })}
        </div>
        <div className="pl-2 mt-1">
          <input
            type="range"
            min="1"
            max={maxLeverage}
            step="0.1" // Allows increments of 0.1
            value={leverage}
            onChange={handleLeverage}
            style={{
              background: `linear-gradient(to right, #00FFB8 ${leveragePercentage}%, #171717 ${leveragePercentage}%)`,
            }}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer 
    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#00FFB8] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
    [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#00FFB8] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex flex-row-reverse">
            <p className="text-[#FF4E00] text-xs mt-3">
              Max Available leverage | {maxLeverage}MAX
            </p>
          </div>
        </div>
      </div>

      {pathname.startsWith("/wager") && (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${Math.round(orderDetails?.after_pledge)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">
                  Leverage cash value
                </p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${Math.round(orderDetails?.after_wager)}{" "}
                  <span className="text-sm text-[#E49C29]">
                    x {orderDetails?.leverage}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Projected payout</p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${Math.round(orderDetails?.after_payout)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">Your return</p>
                <p className="text-[22px] text-[#00FFB8]">
                  +{orderDetails?.after_return.toFixed(0)} %
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-7 md:items-center">
            <p className="text-[#FF2E2E] text-[17px] md:text-[14px]">
              Stop level
            </p>
            <button className="bg-[#FF2E2E] rounded-md px-3 py-1 md:py-[2px] md:text-[12px]">
              {(orderDetails?.after_stop_probability * 100).toFixed(0)}%
            </button>
          </div>
        </>
      )}

      <button
        onClick={handleSubmit}
        className="text-[#00FFB8] w-full border border-[#00FFB8] py-2 rounded-xl text-[16px] mt-5"
      >
        Proceed
      </button>
    </div>
  );
}
