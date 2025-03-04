import { useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";

export default function MakeOrder() {
  const {
    orderDetails,
    isOrderMade,
    setIsOrderMade,
    makeOrder,
    setIsLoading,
    selectedOrder,
    authToken,
    makeOrderWithoutAuth,
  } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();
  const lev = orderDetails?.leverage;
  const [leverage, setLeverage] = useState<number>(lev);
  const tradeVal = orderDetails?.pledge;
  const [value, setValue] = useState<number>(tradeVal);
  const [inputValue, setInputValue] = useState<string>("10");
  const [inputLeverage, setInputLeverage] = useState<string>("1.0");
  const [startY, setStartY] = useState<number | null>(null);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY) return;
    const diffY = e.touches[0].clientY - startY;
    if (diffY > 50) {
      setIsOrderMade(false);
    }
  };

  const handleTradeSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow any input to be entered first
    const val = e.target.value;
    setInputValue(val);

    // Only update the actual value if it's a valid number
    const newValue = parseFloat(val);
    if (!isNaN(newValue)) {
      if (newValue < 10) {
        setValue(10);
      } else if (newValue > maxTradeSize) {
        setValue(maxTradeSize);
      } else {
        setValue(newValue);
      }
    }
  };

  const handleTradeSizeBlur = () => {
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue) || newValue < 10) {
      newValue = 10;
    } else if (newValue > maxTradeSize) {
      newValue = maxTradeSize; // Prevent going beyond max
    }
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  const handleLeverage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow any input to be entered first
    const val = e.target.value;
    setInputLeverage(val);

    // Only update the actual value if it's a valid number
    const newValue = parseFloat(val);
    if (!isNaN(newValue)) {
      if (newValue < 1) {
        setLeverage(1);
      } else if (newValue > maxLeverage) {
        setLeverage(maxLeverage);
      } else {
        setLeverage(newValue);
      }
    }
  };

  const handleLeverageBlur = () => {
    let newValue = parseFloat(inputLeverage);
    if (isNaN(newValue) || newValue < 1) {
      newValue = 1;
    } else if (newValue > maxLeverage) {
      newValue = maxLeverage;
    }
    // Round to one decimal place for display
    const roundedValue = parseFloat(newValue.toFixed(1));
    setLeverage(roundedValue);
    setInputLeverage(roundedValue.toString());
  };

  // Update input values when slider values change
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  useEffect(() => {
    setInputLeverage(leverage.toString());
  }, [leverage]);

  const handleTradeSizePlus = (amount: number) => {
    const currentValue = parseFloat(value.toString());
    const newValue = Math.min(currentValue + amount, maxTradeSize);
    setValue(newValue);
  };

  const handleLeveragePlus = (multiplier: number) => {
    const newValue = Math.min(leverage * multiplier, maxLeverage);
    const roundedValue = parseFloat(newValue.toFixed(1));
    setLeverage(roundedValue);
  };

  // Calculate the correct percentage for the range input background
  const calculateLeveragePercentage = () => {
    if (!maxLeverage) return 0;
    return ((leverage - 1) / (maxLeverage - 1)) * 100;
  };

  const calculateTradeSizePercentage = () => {
    if (!maxTradeSize) return 0;
    return ((value - 10) / (maxTradeSize - 10)) * 100;
  };

  const leveragePercentage = calculateLeveragePercentage();
  const tradeSizePercentage = calculateTradeSizePercentage();

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
      if(authToken){
        await makeOrder(outcomeId, eventId, false, leverage, loan, value, wager);
      }
      else{
        await makeOrderWithoutAuth(outcomeId, eventId, false, leverage, loan, value, wager);
      }
    }
  };

  useEffect(() => {
    if (!eventId || !outcomeId) return;
    const wager = value * leverage;
    const loan = wager - value;

    const debounceTimer = setTimeout(() => {
      if (pathname.startsWith("/wager/")) {
        makeOrder(outcomeId, eventId, true, leverage, loan, value, wager);
      } else {
        if (authToken) {
          makeOrder(outcomeId, eventId, false, leverage, loan, value, wager);
        } else {
          makeOrderWithoutAuth(
            outcomeId,
            eventId,
            false,
            leverage,
            loan,
            value,
            wager
          );
        }
      }
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [value, leverage, authToken]);

  return (
    <div
      className={`fixed bg-transparent w-full left-0 h-full transition-transform duration-200 ease-in-out z-10 ${
        isOrderMade ? "translate-y-0" : "translate-y-[1000px]"
      }`}
      style={{ bottom: 0 }}
    >
      <div
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        className="pb-5 bg-[#1a1a1a] w-full px-5 absolute left-0 bottom-0 rounded-t-3xl"
      >
        <div className="w-[15%] h-[3px] bg-white mb-5 mt-4 mx-auto"></div>
        <div className="mb-5">
          <h1 className="text-[23px] mb-5">Total Size</h1>
          <div className="border-[#454545] flex rounded-md border-[0.4px] gap-2 p-2">
            <div className="flex items-center px-2">
              <span className="text-[19px]">$</span>
              <input
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={handleTradeSize}
                onBlur={handleTradeSizeBlur}
                className="w-[60%] text-[19px] bg-transparent border-none outline-none"
              />
            </div>
            {[20, 50, 100].map((item, index) => {
              return (
                <button
                  key={index}
                  onClick={() => handleTradeSizePlus(item)}
                  className="rounded-md py-1 px-2 font-semibold text text-[13px] bg-[#2b2b2b]"
                >
                  +{item}
                </button>
              );
            })}
          </div>
          <div className="pl-2 mt-3">
            <div className="slider-container w-full h-4 flex items-center">
              <div className="relative w-full">
                {/* Base track - full width */}
                <div className="absolute h-1 w-full bg-[#171717] rounded-lg"></div>
                {/* Colored track - variable width based on value */}
                <div
                  className="absolute h-1 bg-[#00FFB8] rounded-lg"
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
                  className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
                />
                {/* Thumb - positioned based on value */}
                <div
                  className="absolute w-4 h-4 bg-[#00FFB8] rounded-full top-[1px] transform -translate-y-1/2 pointer-events-none"
                  style={{ left: `calc(${tradeSizePercentage}% - 8px)` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <p className="text-[#00FFB8] text-xs mt-5">
                Max trade size | ${maxTradeSize?.toFixed(1)} MAX
              </p>
            </div>
          </div>
        </div>

        {pathname.startsWith("/events") && (
          <div className="mb-10">
            <h1 className="text-[23px] mb-5">Leverage</h1>
            <div className="border-[#454545] flex rounded-md border-[0.4px] gap-2 p-2 justify-between">
              <div className="flex items-center px-2">
                <span className="text-[19px]">x</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={inputLeverage}
                  onChange={handleLeverage}
                  onBlur={handleLeverageBlur}
                  className="w-[60%] text-[19px] bg-transparent border-none outline-none"
                />
              </div>
              {[2, 3, 5].map((item, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => handleLeveragePlus(item)}
                    className="rounded-md py-1 px-3 font-semibold text text-[13px] bg-[#2b2b2b]"
                  >
                    {item}x
                  </button>
                );
              })}
            </div>
            <div className="pl-2 mt-3">
              <div className="slider-container w-full h-4 flex items-center">
                <div className="relative w-full">
                  {/* Base track - full width */}
                  <div className="absolute h-1 w-full bg-[#171717] rounded-lg"></div>
                  {/* Colored track - variable width based on value */}
                  <div
                    className="absolute h-1 bg-[#00FFB8] rounded-lg"
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
                    className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
                  />
                  {/* Thumb - positioned based on value */}
                  <div
                    className="absolute w-4 h-4 bg-[#00FFB8] rounded-full top-[1px] transform -translate-y-1/2 pointer-events-none"
                    style={{ left: `calc(${leveragePercentage}% - 8px)` }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-row-reverse">
                <p className="text-[#FF4E00] text-xs mt-5">
                  Max Available leverage | {maxLeverage?.toFixed(1)}MAX
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <Image
            src="/Images/line.png"
            alt=""
            height={500}
            width={500}
            className="mb-5"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-[1px]">
            <p className="text-[#5D5D5D] text-[13px]">Selected Outcome</p>
            <p className="text-[20px] text-[#00FFB8]">{selectedOrder}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex flex-col gap-[1px]">
              <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
              <p className="text-[22px] text-[#00FFB8]">
                ${Math.round(orderDetails?.pledge)}
              </p>
            </div>
            <div className="flex flex-col gap-[1px] items-end">
              <p className="text-[#5D5D5D] text-[13px]">Leverage cash value</p>
              <p className="text-[22px] text-[#00FFB8]">
                ${Math.round(orderDetails?.wager)}{" "}
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
                ${Math.round(orderDetails?.indicative_payout)}
              </p>
            </div>
            <div className="flex flex-col gap-[1px] items-end">
              <p className="text-[#5D5D5D] text-[13px]">Your return</p>
              <p className="text-[22px] text-[#00FFB8]">
                +{orderDetails?.indicative_return?.toFixed(0)} %
              </p>
            </div>
          </div>
        </div>

        {pathname.startsWith("/wager") && (
          <div className="flex justify-between mt-7 md:items-center">
            <p className="text-[#FF2E2E] text-[17px] md:text-[14px]">
              Stop level
            </p>
            <button className="bg-[#FF2E2E] rounded-md px-3 py-1 md:py-[2px] md:text-[12px]">
              {(orderDetails?.after_stop_probability * 100).toFixed(0)}%
            </button>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="text-[#00FFB8] w-full border border-[#00FFB8] mt-5 py-4 rounded-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}
