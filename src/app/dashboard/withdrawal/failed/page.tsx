"use client";
import Image from "next/image";
import React, { Suspense, useContext } from "react";
import FailedIcon from "../../../../../public/Icons/FailedIcon.svg";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import { AppContext } from "@/app/Context/AppContext";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";

const FailedContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const { isMobile } = useContext(AppContext);

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
              <button className="text-white text-[16px]">Withdrawal :</button>
            </div>

            <div className="mt-20 mb-10 ">
              <Image src={FailedIcon} alt="SuccessIcon" />
            </div>
            <div>
              <p className="text-center text-[22px] font-light">
                Withdrawal Failed!
              </p>
              <p className="text-center text-[15px] font-semibold">
                ${parseFloat(amount ?? "0").toFixed(2)} USD
              </p>
            </div>

            <button
              className="w-full py-3 px-4 border-[#fff] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#fff] mt-10"
              type="button"
              onClick={() => router.push("/dashboard/history")}
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] w-full min-h-screen flex justify-center text-white pt-5  gap-5 lg:px-[20vw] md:px-10 sm:px-10">
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl  py-2 px-5 ">
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            {/* Deposit and Withdrawal Section */}
            <div className="mt-10 flex items-center justify-center w-full px-5">
              <button className="text-white text-[16px]">withdrawal :</button>
            </div>

            <div className="mt-28 mb-10 ">
              <Image src={FailedIcon} alt="SuccessIcon" />
            </div>
            <div>
              <p className="text-center text-[22px] font-light">
                Withdrawal Failed!
              </p>
              <p className="text-center text-[15px] font-semibold">
                ${parseFloat(amount ?? "0").toFixed(2)} USD
              </p>
            </div>

            <button
              className="w-72 py-3 px-4 border-[#fff] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#fff] mt-10"
              type="button"
              onClick={() => router.push("/dashboard/history")}
            >
              Back to Portfolio
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

const Failed: React.FC = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FailedContent />
    </Suspense>
  );
};

export default Failed;
