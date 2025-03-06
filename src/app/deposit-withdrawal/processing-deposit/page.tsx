"use client";
import React, { Suspense, useContext } from "react";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import Navbar from "@/components/Navbar";
import styles from "../../../components/ProcessingIcon.module.css";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import { AppContext } from "@/app/Context/AppContext";
import { DepositContext } from "@/app/Context/DepositContext";

const DepositProcessingContent: React.FC = () => {
  const { isMobile } = useContext(AppContext);

  const { amount } = useContext(DepositContext);

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex flex-col">
          <CurrentCashBalanceCard />
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl mt-10 py-2">
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            {/* Deposit and Withdrawal Section */}
            <div className="mt-10 flex items-center justify-center w-full px-5">
              <button className="text-white text-[16px]">Deposit :</button>
            </div>

            {/* Input Box with Processing loader */}
            <div className="flex justify-center items-end gap-2">
              <div className="flex justify-center mt-5 items-baseline font-bold">
                <span className="text-[34px]">
                  ${amount ? parseFloat(amount).toFixed(2).split(".")[0] : "0"}.
                </span>
                <span className="text-[30px]">
                  {amount ? parseFloat(amount).toFixed(2).split(".")[1] : "00"}
                </span>
              </div>

              <div className="absolute right-5 mb-1">
                <div className={styles.dotSpinner}>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                </div>
              </div>
            </div>

            {/* Currency Box */}
            <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
              USD
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex justify-center gap-5 lg:px-[20vw] md:px-10 sm:px-10">
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl py-2 w-full ">
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            {/* Deposit and Withdrawal Section */}
            <div className="mt-10 flex items-center justify-center w-full px-5">
              <button className="text-white text-[16px]">Deposit :</button>
            </div>

            {/* Input Box with Processing loader */}
            <div className="flex justify-center items-end gap-3 mt-40">
              <div className="flex justify-center mt-5 items-baseline font-bold ml-10">
                <span className="text-[34px]">
                  ${amount ? parseFloat(amount).toFixed(2).split(".")[0] : "0"}.
                </span>
                <span className="text-[30px]">
                  {amount ? parseFloat(amount).toFixed(2).split(".")[1] : "00"}
                </span>
              </div>
              <div className="mb-1">
                <div className={styles.dotSpinner}>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                  <div className={styles.dotSpinnerDot}></div>
                </div>
              </div>
            </div>

            {/* Currency Box */}
            <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
              USD
            </div>
          </div>
          <div className=" flex justify-end">
            <CurrentCashBalanceCardWebview />
          </div>
        </div>
      )}
    </>
  );
};

const DepositProcessing: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepositProcessingContent />
    </Suspense>
  );
};

export default DepositProcessing;
