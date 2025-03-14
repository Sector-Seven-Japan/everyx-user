import { useContext, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import { debounce } from "lodash";

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
  const [modalPosition, setModalPosition] = useState(1000); // Modal starts at 0 (fully open)
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(1000);
  const initialPositionRef = useRef(1000); // Store initial modal position

  const modalRef = useRef<HTMLDivElement>(null);
  const maxTradeSize = orderDetails?.max_wager;
  const maxLeverage = orderDetails?.max_leverage;
  const eventId = orderDetails?.event_id;
  const outcomeId = orderDetails?.event_outcome_id;

  // State for tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLeverageTooltip, setShowLeverageTooltip] = useState(false);
  const [showPayoutTooltip, setShowPayoutTooltip] = useState(false);
  const [showStopLevelTooltip, setShowStopLevelTooltip] = useState(false);
  const [showTradedPossibilityTooltip, setShowTradedPossibilityTooltip] = useState(false);

  // Update modal position when isOrderMade changes
  useEffect(() => {
    if (isOrderMade) {
      setModalPosition(0); // Show modal when order is made
    } else {
      setModalPosition(1000); // Hide modal when order is not made
    }
  }, [isOrderMade]);

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
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    initialPositionRef.current = modalPosition; // Store the current modal position
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaY = e.touches[0].clientY - startY;
    const newPosition = Math.max(0, initialPositionRef.current + deltaY); // Prevent going above 0

    setModalPosition(newPosition);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    const closeThreshold = 500; // Adjust based on your needs
    const screenHeight = window.innerHeight;

    if (modalPosition > closeThreshold) {
      // If dragged beyond threshold, close modal
      setModalPosition(screenHeight);
      setTimeout(() => setIsOrderMade(false), 300);
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

  const handleTradeSizePlus = debounce((amount: number) => {
    const currentValue = parseFloat(value.toString());
    const newValue = Math.min(currentValue + amount, maxTradeSize);
    setValue(newValue);
  }, 200);

  const handleLeveragePlus = (multiplier: number) => {
    const newValue = multiplier
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
      if (authToken) {
        await makeOrder(
          outcomeId,
          eventId,
          false,
          leverage,
          loan,
          value,
          wager
        );
      } else {
        await makeOrderWithoutAuth(
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
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [value, leverage, authToken]);

  return (
    <div
      className={`fixed bg-transparent w-full left-0 h-full z-10`}
      style={{
        bottom: 0,
        pointerEvents: isOrderMade ? "auto" : "none", // Disable interactions when hidden
      }}
    >
      <div
        ref={modalRef}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="pb-5 bg-[#1a1a1a] w-full px-5 absolute left-0 bottom-0 rounded-t-3xl"
        style={{
          transform: `translateY(${modalPosition}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          touchAction: "none", // Prevents page scrolling when dragging
        }}
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
          <div className="mt-3">
            <div className="slider-container w-full h-4 flex items-center px-5">
              <div className="relative w-full">
                {/* Base track - full width */}
                <div className="absolute h-1 w-full bg-[#373737] rounded-lg"></div>
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
            <div className="flex items-center mb-5">
              <h1 className="text-[23px]">Leverage</h1>
              {/* Info Icon with Tooltip */}
              <div
                className="relative ml-2"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span className="text-[16px] text-gray-400 cursor-pointer">
                  ⓘ
                </span>
                {showTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[200px] md:w-[250px] p-3 bg-[#2b2b2b] text-white text-sm rounded-lg shadow-lg z-20">
                    <p>
                      The value of your trade in this outcome after utilizing
                      leverage.
                    </p>
                    <p className="mt-1">
                      For more information see our{" "}
                      <span className="text-[#00FFB8] cursor-pointer">
                        Help Desk
                      </span>.
                    </p>
                  </div>
                )}
              </div>
            </div>
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
            <div className="mt-3">
              <div className="slider-container w-full h-4 flex items-center px-5">
                <div className="relative w-full">
                  {/* Base track - full width */}
                  <div className="absolute h-1 w-full bg-[#373737] rounded-lg"></div>
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
              <div className="flex items-center">
                <span>Leverage cash value</span>
                <div
                  className="relative ml-2"
                  onClick={() => setShowLeverageTooltip((prev) => !prev)}
                >
                  <span className="text-[14px] text-gray-400 cursor-pointer">ⓘ</span>
                  {showLeverageTooltip && (
                    <div className="absolute right-0 top-6 w-[250px] md:w-[300px] p-3 bg-[#2b2b2b] text-white text-sm rounded-lg shadow-lg z-20">
                      <p>
                        The value of your trade in this outcome <b>after utilizing leverage</b>. For more information see our <a className="new-tab-link text-[#00FFB8]" target="_blank" href="/help">Help Desk</a>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
              <div className="flex items-center">
                <span>Projected payout</span>
                <div
                  className="relative ml-2"
                  onClick={() => setShowPayoutTooltip((prev) => !prev)}
                >
                  <span className="text-[14px] text-gray-400 cursor-pointer">ⓘ</span>
                  {showPayoutTooltip && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[200px] md:w-[250px] p-3 bg-[#2b2b2b] text-white text-sm rounded-lg shadow-lg z-20">
                      <p>
                        The payout you would receive if the event resolved in your favor right now. This value can change over time.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[22px] text-[#00FFB8]">
                ${Math.round(orderDetails?.indicative_payout)}
              </p>
            </div>
            <div className="flex flex-col gap-[1px] items-end">
              <div className="flex items-center">
                <span>Your traded possibility</span>
                <div
                  className="relative ml-2"
                  onClick={() => setShowTradedPossibilityTooltip((prev) => !prev)}
                >
                  <span className="text-[14px] text-gray-400 cursor-pointer">ⓘ</span>
                  {showTradedPossibilityTooltip && (
                    <div className="absolute right-0 top-6 w-[250px] md:w-[300px] p-3 bg-[#2b2b2b] text-white text-sm rounded-lg shadow-lg z-20">
                      <p>
                        Your wager will move the market probability this much. You can set a warning on market impact <a className="new-tab-link text-[#00FFB8]" target="_blank" href="/setting">here</a>.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[22px] text-[#00FFB8]">
                +{orderDetails?.indicative_return?.toFixed(0)} %
              </p>
            </div>
          </div>
        </div>

        {pathname.startsWith("/wager") && (
          <div className="flex justify-between mt-7 md:items-center">
            <div className="flex items-center">
              <span>Stop level</span>
              <div
                className="relative ml-2"
                onClick={() => setShowStopLevelTooltip((prev) => !prev)}
              >
                <span className="text-[14px] text-gray-400 cursor-pointer">ⓘ</span>
                {showStopLevelTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-6 w-[200px] md:w-[250px] p-3 bg-[#2b2b2b] text-white text-sm rounded-lg shadow-lg z-20">
                    <p>
                      Your leveraged wager will become worthless if the probability of this outcome falls below this level.
                    </p>
                  </div>
                )}
              </div>
            </div>
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