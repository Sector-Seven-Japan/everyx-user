import Image from "next/image";
import React, { useContext, useState } from "react";
import settingIcon from "../../public/Icons/settingIcon.png";
import { usePathname, useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import CashWithdrawalCategories from "./CashWithdrawalCategories";
import Loader from "./Loader/Loader";
import { MdCamera } from "react-icons/md";

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
      <div className="max-w-[280px] sticky top-20 ">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Loader />
          </div>
        )}

        <div className="flex flex-col bg-[white] bg-opacity-[3%] rounded-3xl px-3 py-8">
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
              <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                <MdCamera className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <Image
              src={settingIcon}
              alt="Setting icon"
              className="absolute top-1 left-[65%] cursor-pointer"
              onClick={handleSettingsClick}
            />
          </div>
          <p className="text-[10px] sm:text-[9px] md:text-[10px] lg:text-[13px] text-center mt-4">
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
            <div
              className="border-t-2 border-dashed border-gray-400 w-full my-2"
              style={{
                maskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
              }}
            ></div>
            <div className="my-4 space-y-3">
              {/* Best Case Cash Balance */}
              <div className="flex justify-between items-end">
                <span className="text-[9px] sm:text-[10px] md:text-[10px] lg:text-[10px]">
                  Best case cash balance
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
                <span className="text-[9px] sm:text-[10px] md:text-[10px] lg:text-[10px]">
                  Cumulative winnings
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
            <div
              className="border-t-2 border-dashed border-gray-400 w-full my-2"
              style={{
                maskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                WebkitMaskImage:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
              }}
            ></div>
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
