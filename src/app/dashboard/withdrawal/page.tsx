"use client";

import { AppContext } from "@/app/Context/AppContext";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Withdrawal: React.FC = () => {
  const { filter, setFilter } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0); // For gradual movement
  const router = useRouter();

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle touch events
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.touches[0].clientY);
      setTouchMove(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart === null) return;

      const currentY = e.touches[0].clientY;
      setTouchMove(currentY);

      const distance = currentY - touchStart;
      if (distance > 0) {
        // Only move downward
        setTranslateY(distance); // Gradually move the container
      }
    };

    const handleTouchEnd = () => {
      if (touchStart === null || touchMove === null) return;

      const distance = touchMove - touchStart;
      const threshold = 150; // Increased threshold for clearer gesture

      console.log({ touchStart, touchMove, distance, translateY });

      if (distance > threshold) {
        console.log("Pull down detected, navigating to portfolio...");
        router.push("/dashboard/history");
      }

      // Reset values with animation
      setTranslateY(0);
      setTouchStart(null);
      setTouchMove(null);
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, touchStart, touchMove, router]);

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex flex-col">
          <CurrentCashBalanceCard />
          <div
            ref={containerRef}
            className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl mt-10 py-2 touch-pan-y transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            {/* Deposit and Withdrawal Section */}
            <div className="flex justify-between items-center mt-5 w-full px-5">
              <div>
                <MdOutlineKeyboardArrowLeft
                  className="text-[30px]"
                  onClick={() => {
                    router.back();
                  }}
                />
              </div>
              <p className="text-[16px] pr-[8vw]">Withdrawal:</p>
              <div></div>
            </div>

            {/* Disabled Input Box */}
            <div className="mt-10 flex items-center bg-transparent justify-center px-10">
              <input
                type="text"
                value="$0.00"
                disabled
                className="text-white bg-transparent text-[34px] font-bold outline-none placeholder-[#707070] w-full pl-2 text-center opacity-50 cursor-not-allowed"
              />
            </div>

            {/* Currency Box */}
            <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
              USD
            </div>

            {/* Message */}
            <div className="text-[#FF6961] text-sm mt-6 text-center px-5">
              Please contact{" "}
              <a href="mailto:kyc@everyx.io" className="underline">
                kyc@everyx.io
              </a>{" "}
              to request a withdrawal.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] md:px-[12%] lg:px-[20vw]">
          <HeadingSlider filter={filter} setFilter={setFilter} />
          <div className="pt-[4.65%] flex justify-center gap-5 h-screen">
            <div className="bg-[#262626] bg-opacity-[31%] flex flex-col items-center rounded-t-3xl py-2 h-full w-full">
              {/* <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div> */}

              {/* Deposit and Withdrawal Section */}
              <div className="mt-2 flex items-center justify-center w-full px-5">
                <button className="text-white text-[16px]">Withdrawal :</button>
              </div>

              {/* Disabled Input Box */}
              <div className="mt-10 flex items-center bg-transparent justify-center px-10 pt-40">
                <input
                  type="text"
                  value="$0.00"
                  disabled
                  className="text-white bg-transparent text-[34px] font-bold outline-none placeholder-[#707070] w-full pl-2 text-center opacity-50 cursor-not-allowed"
                />
              </div>

              {/* Currency Box */}
              <div className="bg-[#707070] bg-opacity-[20%] px-5 py-1 rounded-3xl mt-5">
                USD
              </div>

              {/* Message */}
              <div className="text-[#FF6961] text-sm mt-6 text-center px-5">
                Please contact{" "}
                <a href="mailto:kyc@everyx.io" className="underline">
                  kyc@everyx.io
                </a>{" "}
                to request a withdrawal.
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

export default Withdrawal;
