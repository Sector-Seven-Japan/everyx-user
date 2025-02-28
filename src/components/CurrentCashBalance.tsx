import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import settingIcon from "../../public/Icons/settingIcon.png";
import { useRouter, usePathname } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import { IoPersonCircleOutline } from "react-icons/io5";

const CurrentCashBalanceCard: React.FC = () => {
  const router = useRouter();
  const { userStats, userProfile, authToken, API_BASE_URL } =
    useContext(AppContext);
  const pathname = usePathname();
  const handleSettingsClick = () => {
    router.push("/profile");
  };

  const [newWalletBalance, setNewWalletBalance] = useState<number>(0);

  const getNewWalletBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets/balance`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNewWalletBalance(data?.balance || 0);
      }
    } catch (error) {
      console.log("Error fetching the new Wallet balance", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getNewWalletBalance();
    }
  }, [authToken]);

  return (
    <>
      <div className="flex justify-center items-center mt-5 relative">
        {userProfile?.avatar ? (
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={userProfile.avatar}
              alt="User Profile Pic"
              className="object-cover rounded-full"
              width={80}
              height={80}
            />
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center">
            <IoPersonCircleOutline className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <Image
          src={settingIcon}
          alt="Setting icon"
          className="absolute top-1 left-[55%]"
          onClick={handleSettingsClick}
        />
      </div>
      <p className="text-[15px] text-center mt-5">Current Cash Balance</p>
      <div className="flex justify-center mt-5 items-baseline font-bold">
        <span className="text-[34px]">
          $
          {
            (newWalletBalance || userStats?.fund_available || "0")
              .toString()
              .split(".")[0]
          }
        </span>
        <span className="text-[30px]">
          .
          {
            (newWalletBalance || userStats?.fund_available || 0.0)
              .toFixed(2)
              .split(".")[1]
          }
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
                    (userStats?.best_case_fund_available || "0")
                      .toLocaleString()
                      .split(".")[0]
                  }
                </span>
                <span className="text-[14px]">
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
              <span>Cumulative winnings</span>
              <span className="font-bold">
                <span className="text-[22px]">
                  $
                  {
                    (userStats?.best_case_cumulative_profit || "0")
                      .toLocaleString()
                      .split(".")[0]
                  }
                </span>
                <span className="text-[14px]">
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
