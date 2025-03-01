import Image from "next/image";
import React, { useContext, useState } from "react";
import settingIcon from "../../public/Icons/settingIcon.png";
import { usePathname, useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import CashWithdrawalCategories from "./CashWithdrawalCategories";
import Loader from "./Loader/Loader";

import { IoPersonCircleOutline } from "react-icons/io5";
const CurrentCashBalanceCardWebview: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { userStats, userProfile } = useContext(AppContext);
  const currentPath = usePathname(); // Get the current page path

  const handleSettingsClick = () => {
    if (currentPath !== "/profile") {
      setIsLoading(true);
      router.push("/profile");
    }
  };

  return (
    <>
      <div className="sticky top-20 ">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <Loader />
          </div>
        )}

        <div className="flex flex-col bg-[white] bg-opacity-[3%] rounded-3xl px-[1vw] py-10">
          <div className="flex justify-center items-center mt-5 relative">
            {userProfile?.avatar ? (
              <div className="h-14 w-14 relative rounded-full overflow-hidden">
                <Image
                  src={userProfile.avatar}
                  alt="User Profile Pic"
                  className="object-cover rounded-full"
                  fill
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center">
                <IoPersonCircleOutline className="w-14 h-14 text-gray-400" />
              </div>
            )}

            <Image
              src={settingIcon}
              alt="Setting icon"
              className="absolute top-1 left-[63%] cursor-pointer"
              onClick={handleSettingsClick}
            />
          </div>
          <p className="text-[10px] sm:text-[9px] md:text-[0.7vw] text-center mt-7">
            Current Cash Balance
          </p>
          <div className="flex justify-center mt-4 items-baseline font-bold">
            <span className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[20px]">
              ${(userStats?.fund_available || "0").toString().split(".")[0]}
            </span>
            <span className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[18px]">
              .{(userStats?.fund_available || 0.0).toFixed(2).split(".")[1]}
            </span>
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

            <div className="my-4 space-y-3">
              {/* Best Case Cash Balance */}
              <div className="flex justify-between items-end">
                <span className="text-[9px] sm:text-[10px] md:text-[10px] lg:text-[10px] flex items-center gap-2">
                  Best case cash balance{" "}
                  <span>
                    {" "}
                    <svg
                      width="14"
                      height="13"
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
                  </span>
                </span>
                <span className="font-bold">
                  <span className="text-[14px] sm:text-[10px] md:text-[14px] lg:text-[14px]">
                    $
                    {
                      (userStats?.best_case_fund_available || "0")
                        .toLocaleString()
                        .split(".")[0]
                    }
                  </span>
                  <span className="text-[10px] sm:text-[9px] md:text-[11px] lg:text-[12px]">
                    .
                    {
                      (userStats?.best_case_fund_available || 0.0)
                        .toFixed(2)
                        .split(".")[1]
                    }
                  </span>
                </span>
              </div>
              {/* Cumulative Winnings */}
              <div className="flex justify-between items-end">
                <span className="text-[9px] sm:text-[10px] md:text-[10px] lg:text-[10px] flex gap-2">
                  Cumulative winnings
                  <span>
                    {" "}
                    <svg
                      width="14"
                      height="13"
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
                  </span>
                </span>
                <span className="font-bold">
                  <span className="text-[14px] sm:text-[10px] md:text-[14px] lg:text-[14px]">
                    $
                    {
                      (userStats?.best_case_cumulative_profit || "0")
                        .toLocaleString()
                        .split(".")[0]
                    }
                  </span>
                  <span className="text-[10px] sm:text-[9px] md:text-[11px] lg:text-[12px]">
                    .
                    {
                      (userStats?.best_case_cumulative_profit || 0.0)
                        .toFixed(2)
                        .split(".")[1]
                    }
                  </span>
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
