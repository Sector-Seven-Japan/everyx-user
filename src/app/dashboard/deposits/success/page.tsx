"use client";
import Image from "next/image";
import React, { Suspense, useContext } from "react";
import SuccessIcon from "../../../../../public/Icons/SuccessIcon.svg";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import { AppContext } from "@/app/Context/AppContext";

const Success: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const { isMobile } = useContext(AppContext);

  // Handle screen size detection

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex flex-col ">
          <CurrentCashBalanceCard />
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl mt-10 py-2 px-5">
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            {/* Deposit and Withdrawal Section */}
            <div className="mt-10 flex items-center justify-center w-full px-5">
              <button className="text-white text-[16px]">Deposit :</button>
            </div>

            <div className="mt-20 mb-10 ">
              <Image src={SuccessIcon} alt="SuccessIcon" />
            </div>
            <div>
              <p className="text-center text-[22px] font-light">
                Payments successful !
              </p>
              <p className="text-center text-[15px] font-semibold">
                ${parseFloat(amount ?? "0").toFixed(2)} USD
              </p>
            </div>

            <button
              className="w-full py-3 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198] mt-10"
              type="button"
              onClick={() => router.push("/dashboard/history")}
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex justify-center gap-5 lg:px-[20vw] md:px-10 sm:px-10 ">
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl  py-2 px-5 w-full">
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            {/* Deposit and Withdrawal Section */}
            <div className="mt-10 flex items-center justify-center w-full px-5">
              <button className="text-white text-[16px]">Deposit :</button>
            </div>

            <div className="mt-28 mb-10 ">
              <Image src={SuccessIcon} alt="SuccessIcon" />
            </div>
            <div>
              <p className="text-center text-[22px] font-light">
                Payments successful !
              </p>
              <p className="text-center text-[15px] font-semibold">
                ${parseFloat(amount ?? "0").toFixed(2)} USD
              </p>
            </div>

            <button
              className="w-72 py-3 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198] mt-10"
              type="button"
              onClick={() => router.push("/dashboard/history")}
            >
              Done
            </button>
          </div>
          <div className=" flex justify-end">
            <CurrentCashBalanceCardWebview />
          </div>
        </div>
      )}
    </>
  );
};

const WrappedSuccess = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Success />
    </Suspense>
  );
};

export default WrappedSuccess;
