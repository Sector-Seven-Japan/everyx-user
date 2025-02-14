import Image from "next/image";
import React, { useContext } from "react";
import settingIcon from "../../public/Icons/settingIcon.png";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";

const CurrentCashBalanceCard: React.FC = () => {
  const router = useRouter();
  const { userStats, userProfile } = useContext(AppContext);
  const pathname = usePathname();
  const handleSettingsClick = () => {
    router.push("/profile");
  };

  return (
    <>
      <div className="flex justify-center items-center mt-5 relative">
        {userProfile && (
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={userProfile.avatar}
              alt="User Profile Pic"
              className="object-cover rounded-full"
              width={80}
              height={80}
            />
          </div>
        )}
        <Image
          src={settingIcon}
          alt="Setting icon"
          className="absolute top-1 left-[65%]"
          onClick={handleSettingsClick}
        />
      </div>
      <p className="text-[15px] text-center mt-5">Current Cash Balance</p>
      <div className="flex justify-center mt-5 items-baseline font-bold">
        <span className="text-[34px]">
          ${userStats?.fund_available.toString().split(".")[0]}
        </span>
        <span className="text-[30px]">
          .{userStats?.fund_available.toFixed(2).split(".")[1]}
        </span>
      </div>
      {pathname === "/deposit-withdrawal/portfolio" ||
      pathname === "/deposit-withdrawal/history" ? (
        <div className="mt-5">
          {/* Top Dashed Border */}
          <div
            className="border-t-2 border-dashed border-gray-400 w-full my-3"
            style={{
              maskImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
              WebkitMaskImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
            }}
          ></div>

          <div className="my-5 space-y-4">
            {/* Best Case Cash Balance */}
            <div className="flex justify-between items-end">
              <span>Best case cash balance</span>
              <span className="font-bold">
                <span className="text-[22px]">
                  $
                  {
                    userStats?.best_case_fund_available
                      .toLocaleString()
                      .split(".")[0]
                  }
                </span>
                <span className="text-[14px]">
                  .
                  {userStats?.best_case_fund_available.toFixed(2).split(".")[1]}
                </span>
              </span>
            </div>

            {/* Cumulative Winnings */}
            <div className="flex justify-between items-end">
              <span>Cumulative winnings</span>
              <span className="font-bold">
                <span className="text-[22px]">
                  $
                  {
                    userStats?.best_case_cumulative_profit
                      .toLocaleString()
                      .split(".")[0]
                  }
                </span>
                <span className="text-[14px]">
                  .
                  {
                    userStats?.best_case_cumulative_profit
                      .toFixed(2)
                      .split(".")[1]
                  }
                </span>
              </span>
            </div>
          </div>

          <div
            className="border-t-2 border-dashed border-gray-400 w-full my-3"
            style={{
              maskImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
              WebkitMaskImage:
                "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
            }}
          ></div>
        </div>
      ) : null}
    </>
  );
};

export default CurrentCashBalanceCard;
