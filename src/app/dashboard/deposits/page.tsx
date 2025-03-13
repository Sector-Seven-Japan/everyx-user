"use client";

import { AppContext } from "@/app/Context/AppContext";
import { DepositContext } from "@/app/Context/DepositContext";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Deposit: React.FC = () => {
  const { isMobile, filter, setFilter } = useContext(AppContext);
  const router = useRouter();
  const { writeContract, contractData, amount, setAmount } =
    useContext(DepositContext);

  // Local state for input value
  const [value, setValue] = useState<string>("");

  // Debug the amount value from context on mount and updates
  useEffect(() => {
    console.log("Deposit page - Current context amount:", amount);
  }, [amount]);

  // Debug the local value on updates
  useEffect(() => {
    console.log("Deposit page - Current local value:", value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
    console.log("Input changed to:", newValue);
    setValue(newValue); // Update local state
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value) {
      setAmount(value); // Update context amount when Enter is pressed
      try {
        const numericValue = value.replace("$", "");
        if (isNaN(parseFloat(numericValue))) {
          console.error("Invalid amount");
          return;
        }

        const valueInWei = (parseFloat(numericValue) * 10 ** 18).toString();
        console.log("Transferring amount:", numericValue);

        if (contractData?.address && contractData?.abi) {
          writeContract({
            address: contractData.address as `0x${string}`,
            abi: contractData.abi,
            functionName: "transfer",
            args: ["0x6e22d47D5aFDe5baf633Abc0C805781483BCC69e", valueInWei],
          });
        } else {
          console.error("Contract data is not properly initialized");
        }
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex flex-col">
          <CurrentCashBalanceCard />
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl mt-10 py-2">
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            <div className="mt-10 flex items-center justify-between w-full px-5">
              <div>
                <MdOutlineKeyboardArrowLeft
                  className="text-[30px]"
                  onClick={() => {
                    router.back();
                  }}
                />
              </div>
              <button className="text-white text-[16px] ml-[-9%]">
                Deposit
              </button>
              <div></div>
            </div>

            <div className="mt-10 flex items-center bg-transparent justify-center px-10">
              <input
                type="text"
                value={value ? `$${value}` : ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="0.00"
                className="text-white bg-transparent text-[34px] font-bold outline-none placeholder-[#707070] w-full pl-2 text-center"
                aria-label="Enter deposit amount"
              />
            </div>

            <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
              USD
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] px-[20vw] text-white">
          <HeadingSlider filter={filter} setFilter={setFilter} />
          <div className="pt-[4.65%] flex justify-center gap-5 h-screen">
            <div className="bg-[#262626] bg-opacity-[31%] flex flex-col items-center rounded-t-3xl py-2 h-full w-full">
              <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

              <div className="mt-10 flex items-center justify-center w-full px-5">
                <button className="text-white text-[16px]">Deposit</button>
              </div>

              <div className="mt-10 flex items-center bg-transparent justify-center px-10 pt-40">
                <input
                  type="text"
                  value={value ? `$${value}` : ""}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="$0.00"
                  className="text-white bg-transparent text-[34px] font-bold outline-none placeholder-[#707070] w-full pl-2 text-center"
                  aria-label="Enter deposit amount"
                />
              </div>

              <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
                USD
              </div>
            </div>
            <div className="flex justify-end">
              <CurrentCashBalanceCardWebview />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Deposit;
