import Image from "next/image";
import React, { useContext, useState } from "react";
import settingIcon from "../../public/Icons/settingIcon.png";
import { usePathname, useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import CashWithdrawalCategories from "./CashWithdrawalCategories";
import { IoPersonCircleOutline } from "react-icons/io5";
import Loader from "./Loader/Loader";

const CurrentCashBalanceCardWebview: React.FC = () => {
  const router = useRouter();
  const { userStats, userProfile, walletData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const currentPath = usePathname();

  // State for tooltip visibility (toggled on hover)
  const [showCurrentTooltip, setShowCurrentTooltip] = useState(false);
  const [showBestCaseTooltip, setShowBestCaseTooltip] = useState(false);
  const [showWinningsTooltip, setShowWinningsTooltip] = useState(false);

  const handleSettingsClick = () => {
    if (currentPath !== "/profile") {
      setIsLoading(true);
      router.push("/profile");
    }
  };

  // Helper function to format numbers safely
  const formatNumber = (value: number | undefined | null, decimals: number = 2) => {
    if (value === undefined || value === null) {
      return { whole: "0", decimal: "00" };
    }
    const num = Number(value);
    const formatted = num.toFixed(decimals);
    const [whole, decimal] = formatted.split(".");
    return { whole: whole || "0", decimal: decimal || "00" };
  };

  // Format all monetary values
  const balance = formatNumber(walletData?.length > 0 ? walletData[0]?.balance : 0);
  const bestCase = formatNumber(userStats?.best_case_fund_available);
  const winnings = formatNumber(userStats?.best_case_cumulative_profit);

  return (
    <>
      <div className="sticky top-20 w-[18vw] ">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <Loader />
          </div>
        )}
        <div className="flex flex-col bg-[white] bg-opacity-[3%] rounded-3xl px-[2vw] py-[4vw]">
          <div className="flex justify-center items-center mt-5 relative">
            {userProfile?.avatar ? (
              <div className="h-[3vw] w-[3vw] relative rounded-full overflow-hidden">
                <Image
                  src={userProfile.avatar}
                  alt="User Profile Pic"
                  className="object-cover rounded-full"
                  fill
                />
              </div>
            ) : (
              <div className="w-[3vw] h-[3vw] rounded-full bg-transparent flex items-center justify-center">
                <IoPersonCircleOutline className="w-[3vw] h-[3vw] text-gray-400" />
              </div>
            )}

            <Image
              src={settingIcon}
              alt="Setting icon"
              className="absolute -top-3 left-[60%] cursor-pointer w-[0.8vw] h-[0.8vw]"
              onClick={handleSettingsClick}
            />
          </div>
          <div className="flex items-center justify-center mt-7">
            <p className="text-[0.8vw] text-center font-normal gothic">
              Current Cash Balance
            </p>
            {/* Info Icon with Tooltip (hover to show) */}
            <div
              className="relative ml-1"
              onMouseEnter={() => setShowCurrentTooltip(true)}
              onMouseLeave={() => setShowCurrentTooltip(false)}
            >
              <svg
                width="0.5vw"
                height="0.6vw"
                viewBox="0 0 14 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.24">
                  <path
                    d="M7.00235 12.1887C10.2332 12.1887 12.8523 9.71552 12.8523 6.66467C12.8523 3.61383 10.2332 1.14062 7.00235 1.14062C3.77148 1.14062 1.15234 3.61383 1.15234 6.66467C1.15234 9.71552 3.77148 12.1887 7.00235 12.1887Z"
                    stroke="white"
                  />
                  <path
                    d="M6.61985 9.29102V5.98502H7.30985V9.29102H6.61985ZM6.96785 5.37302C6.83585 5.37302 6.72985 5.33502 6.64985 5.25902C6.57385 5.18302 6.53585 5.08102 6.53585 4.95302C6.53585 4.83302 6.57385 4.73502 6.64985 4.65902C6.72985 4.58302 6.83585 4.54502 6.96785 4.54502C7.09185 4.54502 7.19385 4.58302 7.27385 4.65902C7.35385 4.73502 7.39385 4.83302 7.39385 4.95302C7.39385 5.08102 7.35385 5.18302 7.27385 5.25902C7.19385 5.33502 7.09185 5.37302 6.96785 5.37302Z"
                    fill="white"
                  />
                </g>
              </svg>
              {showCurrentTooltip && (
                <div className="absolute -left-2 top-4 w-[12vw] p-[0.5vw] bg-[#2b2b2b] text-white text-[0.6vw] rounded-lg shadow-lg z-20">
                  <p>
                    The cash available at this moment for trading. Pending deposits
                    or withdrawals are not included.
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-4 items-baseline font-bold">
            <span className="text-[2.3vw]">${balance.whole}</span>
            <span className="text-[1.5vw]">.{balance.decimal}</span>
          </div>

          <div className="mt-4">
            <svg
              width="100%"
              height="9"
              viewBox="0 0 257 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_658_35585)">
                <line
                  x1="4"
                  y1="0.5"
                  x2="253"
                  y2="0.5"
                  stroke="url(#paint0_linear_658_35585)"
                  stroke-opacity="0.54"
                  stroke-dasharray="2 2"
                  shape-rendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_658_35585"
                  x="0"
                  y="0"
                  width="257"
                  height="9"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_658_35585"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_658_35585"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_658_35585"
                  x1="4"
                  y1="1.5"
                  x2="253"
                  y2="1.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#0E0E0E" />
                  <stop offset="0.495" stop-color="#C9C9C9" />
                  <stop offset="1" stop-color="#0E0E0E" />
                </linearGradient>
              </defs>
            </svg>

            <div className="">
              {/* Best Case Cash Balance */}
              <div className="flex justify-between items-center">
                <span className="text-[0.5vw] flex items-end font-thin gap-1">
                  Best case cash balance
                  <div
                    className="relative"
                    onMouseEnter={() => setShowBestCaseTooltip(true)}
                    onMouseLeave={() => setShowBestCaseTooltip(false)}
                  >
                    <svg
                      width="0.5vw"
                      height="0.6vw"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.24">
                        <path
                          d="M7.00235 12.1887C10.2332 12.1887 12.8523 9.71552 12.8523 6.66467C12.8523 3.61383 10.2332 1.14062 7.00235 1.14062C3.77148 1.14062 1.15234 3.61383 1.15234 6.66467C1.15234 9.71552 3.77148 12.1887 7.00235 12.1887Z"
                          stroke="white"
                        />
                        <path
                          d="M6.61985 9.29102V5.98502H7.30985V9.29102H6.61985ZM6.96785 5.37302C6.83585 5.37302 6.72985 5.33502 6.64985 5.25902C6.57385 5.18302 6.53585 5.08102 6.53585 4.95302C6.53585 4.83302 6.57385 4.73502 6.64985 4.65902C6.72985 4.58302 6.83585 4.54502 6.96785 4.54502C7.09185 4.54502 7.19385 4.58302 7.27385 4.65902C7.35385 4.73502 7.39385 4.83302 7.39385 4.95302C7.39385 5.08102 7.35385 5.18302 7.27385 5.25902C7.19385 5.33502 7.09185 5.37302 6.96785 5.37302Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                    {showBestCaseTooltip && (
                      <div className="absolute -left-2 top-4 w-[12vw] p-[0.5vw] bg-[#2b2b2b] text-white text-[0.6vw] rounded-lg shadow-lg z-20">
                        <p>
                          The best possible cash balance based on current market
                          conditions and your trades.
                        </p>
                      </div>
                    )}
                  </div>
                </span>
                <span className="font-bold">
                  <span className="text-[0.8vw]">${bestCase.whole}</span>
                  <span className="text-[0.6vw]">.{bestCase.decimal}</span>
                </span>
              </div>
              {/* Cumulative Winnings */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-[0.5vw] font-thin flex gap-1">
                  Cumulative winnings
                  <div
                    className="relative"
                    onMouseEnter={() => setShowWinningsTooltip(true)}
                    onMouseLeave={() => setShowWinningsTooltip(false)}
                  >
                    <svg
                      width="0.5vw"
                      height="0.6vw"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.24">
                        <path
                          d="M7.00235 12.1887C10.2332 12.1887 12.8523 9.71552 12.8523 6.66467C12.8523 3.61383 10.2332 1.14062 7.00235 1.14062C3.77148 1.14062 1.15234 3.61383 1.15234 6.66467C1.15234 9.71552 3.77148 12.1887 7.00235 12.1887Z"
                          stroke="white"
                        />
                        <path
                          d="M6.61985 9.29102V5.98502H7.30985V9.29102H6.61985ZM6.96785 5.37302C6.83585 5.37302 6.72985 5.33502 6.64985 5.25902C6.57385 5.18302 6.53585 5.08102 6.53585 4.95302C6.53585 4.83302 6.57385 4.73502 6.64985 4.65902C6.72985 4.58302 6.83585 4.54502 6.96785 4.54502C7.09185 4.54502 7.19385 4.58302 7.27385 4.65902C7.35385 4.73502 7.39385 4.83302 7.39385 4.95302C7.39385 5.08102 7.35385 5.18302 7.27385 5.25902C7.19385 5.33502 7.09185 5.37302 6.96785 5.37302Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                    {showWinningsTooltip && (
                      <div className="absolute -left-2 top-4 w-[12vw] p-[0.5vw] bg-[#2b2b2b] text-white text-[0.6vw] rounded-lg shadow-lg z-20">
                        <p>
                          The total winnings accumulated from your trades to date.
                        </p>
                      </div>
                    )}
                  </div>
                </span>
                <span className="font-bold">
                  <span className="text-[0.8vw]">${winnings.whole}</span>
                  <span className="text-[0.6vw]">.{winnings.decimal}</span>
                </span>
              </div>
            </div>
            <svg
              width="100%"
              height="9"
              viewBox="0 0 257 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_658_35585)">
                <line
                  x1="4"
                  y1="0.5"
                  x2="253"
                  y2="0.5"
                  stroke="url(#paint0_linear_658_35585)"
                  stroke-opacity="0.54"
                  stroke-dasharray="2 2"
                  shape-rendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_658_35585"
                  x="0"
                  y="0"
                  width="257"
                  height="9"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_658_35585"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_658_35585"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_658_35585"
                  x1="4"
                  y1="1.5"
                  x2="253"
                  y2="1.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#0E0E0E" />
                  <stop offset="0.495" stop-color="#C9C9C9" />
                  <stop offset="1" stop-color="#0E0E0E" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="mt-5">
            <CashWithdrawalCategories />
          </div>
        </div>
      </div>
    </>
  );
};

export default CurrentCashBalanceCardWebview;