import Image from "next/image";
import React from "react";
import settingIcon from "../../public/Icons/settingIcon.png";
import { useRouter, usePathname } from "next/navigation";

interface CurrentCashBalanceCardProps {
  balance: number;
  bestCaseBalance?: number;
  cumulativeWinnings?: number;
  avatar?: string;
}

const CurrentCashBalanceCard: React.FC<CurrentCashBalanceCardProps> = ({
  balance,
  bestCaseBalance,
  cumulativeWinnings,
  avatar,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSettingsClick = () => {
    router.push("/profile");
  };

  return (
    <>
      <div className="flex justify-center items-center mt-5 relative">
        {avatar && (
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image
              src={avatar}
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
          className="absolute top-1 left-[65%] cursor-pointer"
          onClick={handleSettingsClick}
        />
      </div>
      <p className="text-[15px] text-center mt-5">Current Cash Balance</p>

      {/* Display Current Cash Balance */}
      <div className="flex justify-center mt-5 items-baseline font-bold">
        <span className="text-[34px]">
          ${Math.floor(balance).toLocaleString()}
        </span>
        <span className="text-[30px]">
          .{(balance % 1).toFixed(2).split(".")[1]}
        </span>
      </div>

      {/* Conditional Section */}
      {(pathname === "/deposit-withdrawal/portfolio" ||
        pathname === "/deposit-withdrawal/history") && (
        <div className="mt-5">
          {/* Top Dashed Border */}
          <div className="border-t-2 border-dashed border-gray-400 w-full my-3"></div>

          <div className="my-5 space-y-4">
            {/* Best Case Cash Balance */}
            {bestCaseBalance !== undefined && (
              <div className="flex justify-between items-end">
                <span>Best case cash balance</span>
                <span className="font-bold">
                  <span className="text-[22px]">
                    ${Math.floor(bestCaseBalance).toLocaleString()}
                  </span>
                  <span className="text-[14px]">
                    .{(bestCaseBalance % 1).toFixed(2).split(".")[1]}
                  </span>
                </span>
              </div>
            )}

            {/* Cumulative Winnings */}
            {cumulativeWinnings !== undefined && (
              <div className="flex justify-between items-end">
                <span>Cumulative winnings</span>
                <span className="font-bold">
                  <span className="text-[22px]">
                    ${Math.floor(cumulativeWinnings).toLocaleString()}
                  </span>
                  <span className="text-[14px]">
                    .{(cumulativeWinnings % 1).toFixed(2).split(".")[1]}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Bottom Dashed Border */}
          <div className="border-t-2 border-dashed border-gray-400 w-full my-3"></div>
        </div>
      )}
    </>
  );
};

export default CurrentCashBalanceCard;
