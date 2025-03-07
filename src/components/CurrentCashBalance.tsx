import Image from "next/image";
import React, { useContext } from "react";
import settingIcon from "../../public/Icons/settingIcon.png";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import { IoPersonCircleOutline } from "react-icons/io5";

const CurrentCashBalanceCard: React.FC = () => {
  const router = useRouter();
  const { userStats, userProfile, walletData } = useContext(AppContext);
  const pathname = usePathname();

  const handleSettingsClick = () => {
    router.push("/profile");
  };

  // Helper function to format numbers safely
  const formatNumber = (
    value: number | undefined | null | string,
    decimals: number = 2
  ) => {
    if (value === undefined || value === null) {
      return { whole: "0", decimal: "00" };
    }
    const num = Number(value);
    const formatted = num.toFixed(decimals);
    const [whole, decimal] = formatted.split(".");
    return { whole: whole || "0", decimal: decimal || "00" };
  };

  // Format all monetary values
  const balance = formatNumber(
    walletData?.length > 0 ? walletData[0]?.balance : 0
  );
  const bestCase = formatNumber(userStats?.best_case_fund_available);
  const winnings = formatNumber(userStats?.best_case_cumulative_profit);

  return (
    <>
      <div className="flex justify-center items-center mt-5 relative">
        {userProfile?.avatar ? (
          <div className="w-14 h-14 rounded-full overflow-hidden">
            <Image
              src={userProfile.avatar}
              alt="User Profile Pic"
              className="object-cover rounded-full"
              width={70}
              height={70}
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
          className="absolute top-1 left-[58%]"
          onClick={handleSettingsClick}
        />
      </div>
      <p className="text-[15px] text-center mt-5">Current Cash Balance</p>
      <div className="flex justify-center mt-5 items-baseline font-bold">
        <span className="text-[34px]">${balance.whole}</span>
        <span className="text-[30px]">.{balance.decimal}</span>
      </div>
      {pathname === "/dashboard/portfolio" ||
      pathname === "/dashboard/history" ? (
        <div className="mt-5">
          {/* Top Dashed Border */}
          <div>
            <svg
              width="380"
              height="9"
              viewBox="0 0 380 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_633_3647)">
                <line
                  x1="4"
                  y1="0.5"
                  x2="376"
                  y2="0.5"
                  stroke="url(#paint0_linear_633_3647)"
                  stroke-opacity="0.54"
                  stroke-dasharray="2 2"
                  shape-rendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_633_3647"
                  x="0"
                  y="0"
                  width="380"
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
                    result="effect1_dropShadow_633_3647"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_633_3647"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_633_3647"
                  x1="4"
                  y1="1.5"
                  x2="376"
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

          <div className="my-5 space-y-4">
            {/* Best Case Cash Balance */}
            <div className="flex justify-between items-end">
              <span>Best case cash balance</span>
              <span className="font-bold">
                <span className="text-[22px]">${bestCase.whole}</span>
                <span className="text-[14px]">.{bestCase.decimal}</span>
              </span>
            </div>

            {/* Cumulative Winnings */}
            <div className="flex justify-between items-end">
              <span>Cumulative winnings</span>
              <span className="font-bold">
                <span className="text-[22px]">${winnings.whole}</span>
                <span className="text-[14px]">.{winnings.decimal}</span>
              </span>
            </div>
          </div>

          <div>
            <svg
              width="380"
              height="9"
              viewBox="0 0 380 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g filter="url(#filter0_d_633_3647)">
                <line
                  x1="4"
                  y1="0.5"
                  x2="376"
                  y2="0.5"
                  stroke="url(#paint0_linear_633_3647)"
                  stroke-opacity="0.54"
                  stroke-dasharray="2 2"
                  shape-rendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_633_3647"
                  x="0"
                  y="0"
                  width="380"
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
                    result="effect1_dropShadow_633_3647"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_633_3647"
                    result="shape"
                  />
                </filter>
                <linearGradient
                  id="paint0_linear_633_3647"
                  x1="4"
                  y1="1.5"
                  x2="376"
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
        </div>
      ) : null}
    </>
  );
};

export default CurrentCashBalanceCard;
