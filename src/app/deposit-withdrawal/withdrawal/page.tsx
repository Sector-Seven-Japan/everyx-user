"use client";

import { AppContext } from "@/app/Context/AppContext";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import React, { useContext, useEffect, useState, useRef, TouchEvent as ReactTouchEvent } from "react";
import { useRouter } from "next/navigation";

const Withdrawal: React.FC = () => {
  const { filter, setFilter } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const isNavigatingRef = useRef(false);
  const [translateY, setTranslateY] = useState(0);
  const router = useRouter();

  // Handle viewport resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle touch interactions for pull-down navigation
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      isNavigatingRef.current = false;
    }
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    if (deltaY > 0) {
      e.preventDefault();
      window.scrollTo(0, 0);

      const translationAmount = Math.min(deltaY * 0.5, 200);
      setTranslateY(translationAmount);

      if (translationAmount > 150 && !isNavigatingRef.current) {
        isNavigatingRef.current = true;
        router.push("/deposit-withdrawal/history");
      }
    }
  };

  const handleTouchEnd = () => {
    setTranslateY(0);
    startYRef.current = null;
  };

  // Prevent pull-to-refresh on mobile
  useEffect(() => {
    const preventPullToRefresh = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventPullToRefresh, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventPullToRefresh);
    };
  }, []);

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex flex-col">
          <CurrentCashBalanceCard />
          <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col items-center rounded-t-3xl mt-10 py-2 touch-pan-y transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${translateY}px)`, willChange: "transform" }}
          >
            <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>

            {/* Withdrawal Section */}
            <div className="mt-10 flex items-center justify-center w-full px-5">
              <button className="text-white text-[16px]">Withdrawal :</button>
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

            {/* Contact Message */}
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

              {/* Contact Message */}
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
