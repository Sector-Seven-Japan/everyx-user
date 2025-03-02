import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import toast from "react-hot-toast";

export default function MakeOrder() {
  const { orderDetails, makeOrder, setIsLoading, walletData, setIsOrderMade } =
    useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();
  const lev = orderDetails?.leverage;
  const tradeVal = orderDetails?.pledge;
  const [leverage, setLeverage] = useState<number>(lev);
  const [value, setValue] = useState<number>(10);
  const [inputValue, setInputValue] = useState<string>("10");
  const [inputLeverage, setInputLeverage] = useState<string>("1.0");
  const maxTradeSize = orderDetails?.max_wager;
  const maxLeverage = orderDetails?.max_leverage;
  const eventId = orderDetails?.event_id;
  const outcomeId = orderDetails?.event_outcome_id;

  useEffect(() => {
    if (tradeVal !== undefined) {
      setValue(tradeVal);
      setInputValue(tradeVal.toString());
    }
    if (lev !== undefined) {
      setLeverage(lev);
      setInputLeverage(lev.toString());
    }
  }, [tradeVal, lev]);

  const handleTradeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setValue(Math.min(newValue, maxTradeSize)); // Ensure it doesn't exceed max
    }
  };

  const handleTradeSizeBlur = () => {
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue) || newValue < 10) {
      newValue = 10;
    } else if (newValue > maxTradeSize) {
      newValue = maxTradeSize;
    }
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  const handleLeverage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLeverage(e.target.value);
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      setLeverage(Math.min(newValue, maxLeverage)); // Ensure it doesn't exceed max
    }
  };

  const handleLeverageBlur = () => {
    let newValue = parseFloat(inputLeverage);
    if (isNaN(newValue) || newValue < 1) {
      newValue = 1;
    } else if (newValue > maxLeverage) {
      newValue = maxLeverage;
    }
    const roundedValue = parseFloat(newValue.toFixed(1));
    setLeverage(roundedValue);
    setInputLeverage(roundedValue.toString());
  };

  useEffect(() => setInputValue(value.toString()), [value]);
  useEffect(() => setInputLeverage(leverage.toString()), [leverage]);

  const handleTradeSizePlus = (amount: number) => {
    setValue((prev) => Math.min(prev + amount, maxTradeSize));
  };

  const handleLeveragePlus = (amount: number) => {
    setLeverage((prev) => Math.min(prev + amount, maxLeverage));
  };

  const calculatePercentage = (current: number, min: number, max: number) => {
    return Math.min(((current - min) / (max - min)) * 100, 100); // Cap at 100%
  };

  const tradeSizePercentage = calculatePercentage(value, 10, maxTradeSize);
  const leveragePercentage = calculatePercentage(leverage, 1, maxLeverage);

  const handleSubmit = async () => {
    if (walletData[0]?.balance < value) {
      toast("You have insufficient balance", {
        style: { background: "#333", color: "#fff" },
      });
      setIsOrderMade(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const wager = value * leverage;
    const loan = wager - value;

    if (pathname.startsWith("/wager/")) {
      router.push(`/betting/${eventId}`);
      makeOrder(outcomeId, eventId, true, leverage, loan, value, wager);
    } else {
      router.push(`/events/${eventId}/order`);
      makeOrder(outcomeId, eventId, false, leverage, loan, value, wager);
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
    <div className="bg-[#141414] rounded-xl sticky top-[70px] w-full p-6">
      <h1 className="text-center mb-3 text-[1.1vw] md:mb-[1.2vw]">
        Your Order
      </h1>
      <div className="mb-[2vw]">
        <h1 className="text-[0.7vw] mb-2">Total Size</h1>
        <div className="border-[#aeaeae68] border-[0.4px] flex rounded-md gap-2 p-2">
          <div className="w-[60%] px-2 text-[13px] flex items-center">
            $
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={handleTradeSize}
              onBlur={handleTradeSizeBlur}
              className="w-full bg-transparent border-none outline-none"
            />
          </div>
          {[20, 50, 100].map((item, index) => {
            return (
              <button
                key={index}
                onClick={() => handleTradeSizePlus(item)}
                className="bg-[#1b1b1b] rounded-sm px-2 font-semibold text text-[10px] hover:bg-[#2b2b2b]"
              >
                +{item}
              </button>
            );
          })}
        </div>
        <div className="pl-2 mt-2">
          <div className="slider-container w-full h-4 flex items-center">
            <div className="relative w-full">
              {/* Base track - full width */}
              <div className="absolute h-[3px] w-full bg-[#171717] rounded-lg"></div>
              {/* Colored track - variable width based on value */}
              <div
                className="absolute h-[3px] bg-[#00FFB8] rounded-lg"
                style={{ width: `${tradeSizePercentage}%` }}
              ></div>
              {/* Input range */}
              <input
                type="range"
                min="10"
                max={maxTradeSize}
                step="0.01"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                className="absolute w-full h-[3px] opacity-0 cursor-pointer z-10"
              />
              {/* Thumb - positioned based on value */}
              <div
                className="absolute w-4 h-4 bg-[#00FFB8] rounded-full top-[1.5px] transform -translate-y-1/2 pointer-events-none"
                style={{ left: `calc(${tradeSizePercentage}% - 8px)` }}
              ></div>
            </div>
          </div>
          <div className="flex flex-row-reverse">
            <p className="text-[#00FFB8] text-[0.6vw] mt-4">
              Max trade size | ${maxTradeSize?.toFixed(1)} MAX
            </p>
          </div>
        </div>
      </div>

      {pathname.startsWith("/events") && (
        <div className="mb-[2vw]">
          <h1 className="text-[0.7vw] mb-2">Leverage</h1>
          <div className="border-[#aeaeae68] flex rounded-md border-[0.4px] gap-2 p-2">
            <div className="w-[60%] text-[13px] px-2 flex items-center">
              x
              <input
                type="text"
                inputMode="decimal"
                value={inputLeverage}
                onChange={handleLeverage}
                onBlur={handleLeverageBlur}
                className="w-full bg-transparent border-none outline-none"
              />
            </div>
            {[2, 3, 5].map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleLeveragePlus(item)}
                  className="bg-[#1b1b1b] rounded-sm px-2 font-semibold text text-[10px] hover:bg-[#2b2b2b]"
                >
                  {item}x
                </button>
              );
            })}
          </div>
          <div className="pl-2 mt-2">
            <div className="slider-container w-full h-4 flex items-center">
              <div className="relative w-full">
                {/* Base track - full width */}
                <div className="absolute h-[3px] w-full bg-[#171717] rounded-lg"></div>
                {/* Colored track - variable width based on value */}
                <div
                  className="absolute h-[3px] bg-[#00FFB8] rounded-lg"
                  style={{ width: `${leveragePercentage}%` }}
                ></div>
                {/* Input range */}
                <input
                  type="range"
                  min="1"
                  max={maxLeverage}
                  step="0.1"
                  value={leverage}
                  onChange={(e) => setLeverage(parseFloat(e.target.value))}
                  className="absolute w-full h-[3px] opacity-0 cursor-pointer z-10"
                />
                {/* Thumb - positioned based on value */}
                <div
                  className="absolute w-4 h-4 bg-[#00FFB8] rounded-full top-[1.5px] transform -translate-y-1/2 pointer-events-none"
                  style={{ left: `calc(${leveragePercentage}% - 8px)` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <p className="text-[#FF4E00] text-[0.6vw] mt-4">
                Max Available leverage | {maxLeverage}MAX
              </p>
            </div>
          </div>
        </div>
      )}

      {pathname.startsWith("/wager") && (
        <>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[11px] md:text-[0.75vw]">
                  Cash used
                </p>
                <p className="text-[16px] text-[#00FFB8] md:text-[1.2vw]">
                  ${Math.round(orderDetails?.after_pledge)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[11px] md:text-[0.75vw]">
                  Leverage cash value
                </p>
                <p className="text-[16px] text-[#00FFB8] md:text-[1.2vw]">
                  ${Math.round(orderDetails?.after_wager)}{" "}
                  <span className="text-[12px] text-[#E49C29] md:text-[0.85vw]">
                    x {orderDetails?.leverage}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[11px] md:text-[0.75vw]">
                  Projected payout
                </p>
                <p className="text-[16px] text-[#00FFB8] md:text-[1.2vw]">
                  ${Math.round(orderDetails?.after_payout)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[11px] md:text-[0.75vw]">
                  Your return
                </p>
                <p className="text-[16px] text-[#00FFB8] md:text-[1.2vw]">
                  +{orderDetails?.after_return?.toFixed(0)} %
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-7 md:items-center">
            <p className="text-[#FF2E2E] text-[17px] md:text-[0.85vw]">
              Stop level
            </p>
            <button className="bg-[#FF2E2E] rounded-md px-3 py-1 md:py-[2.5px] md:text-[0.75vw]">
              {(orderDetails?.after_stop_probability * 100).toFixed(0)}%
            </button>
          </div>
        </>
      )}

      <button
        onClick={handleSubmit}
        className="text-[#2DC198] w-full border border-[#2DC198] py-[0.7vw] xl:rounded-lg 2xl:rounded-2xl text-[1vw] mt-3 mb-[1vw]"
      >
        Proceed
      </button>
    </div>
  );
}
