"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Withdrawal: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal points
    setInputValue(`$${value}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      // Navigate to the next page, passing the amount
      console.log(
        "Navigating to processing-deposit page with amount:",
        inputValue
      );
      router.push(
        `/dashboard/processing-withdrawal?amount=${inputValue.replace("$", "")}`
      );
    }
  };

  return (
    <div className="w-full">
      <div className="bg-[#262626] bg-opacity-[31%]  flex flex-col items-center rounded-t-3xl mt-10 py-2 h-[70vh]">
        <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

        {/* Deposit and Withdrawal Section */}
        <div className="mt-10 flex items-center justify-center w-full px-5">
          <button className="text-white text-[16px]">Withdrawal :</button>
        </div>

        {/* Input Box with Integrated Dollar Sign */}
        <div className=" mt-10  flex items-center bg-transparent justify-center px-10">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="$0.00"
            className="text-white bg-transparent text-[34px] font-bold outline-none placeholder-[#707070] w-full  pl-2 text-center"
          />
        </div>

        {/* Currency Box */}
        <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
          USD
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
