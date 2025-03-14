"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const VerifyIdentity: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();

  const handleNextClick = () => {
    if (!selectedOption) {
      alert("Please select your country of residence.");
      return;
    }
    router.push("/auth/signup/verify-2");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-1 px-4 md:px-10 lg:px-20 xl:px-40 2xl:px-60">
        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Verify Identity</h1>

        {/* Subtitle */}
        <p className="text-center text-sm md:text-base mb-10 max-w-2xl">
          Confirm your country of residence to learn how your personal data will be processed.
        </p>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
          <div className="w-28 h-[1px] bg-gray-600 opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#585858]" />
          <div className="w-28 h-[1px] bg-gray-600 opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#585858]" />
        </div>

        {/* Country Selection */}
        <div className="w-full max-w-lg">
          <h2 className="text-lg md:text-xl mb-6">Select your country of residence:</h2>

          {/* Option 1 */}
          <div
            className="flex items-center gap-4 mb-6 cursor-pointer"
            onClick={() => setSelectedOption("option1")}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 ${
                selectedOption === "option1" ? "bg-[#00ffb8] border-[#00ffb8]" : "border-white"
              } flex items-center justify-center`}
            >
              {selectedOption === "option1" && (
                <div className="w-3 h-3 rounded-full bg-[#0e0e0e]" />
              )}
            </div>
            <p className="text-sm md:text-base">All countries except USA</p>
          </div>

          {/* Option 2 */}
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setSelectedOption("option2")}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 ${
                selectedOption === "option2" ? "bg-[#00ffb8] border-[#00ffb8]" : "border-white"
              } flex items-center justify-center`}
            >
              {selectedOption === "option2" && (
                <div className="w-3 h-3 rounded-full bg-[#0e0e0e]" />
              )}
            </div>
            <p className="text-sm md:text-base">United States of America</p>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextClick}
          className="w-full max-w-lg mt-16 py-4 rounded-lg bg-[#00ffb8] text-black text-center text-lg font-bold"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VerifyIdentity;
