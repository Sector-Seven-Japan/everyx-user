"use client";

import { AppContext } from "@/app/Context/AppContext";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import React, { useContext, useEffect, useState, useRef } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useAccount } from "wagmi";

// Preloader component
const Preloader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-40 w-full">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-[#00FFB8] border-t-transparent rounded-full animate-spin"></div>
        <div
          className="absolute top-0 left-0 w-10 h-10 border-4 border-[#00FFB8] border-t-transparent rounded-full animate-spin opacity-50"
          style={{ animationDuration: "1.5s" }}
        ></div>
      </div>
    </div>
  );
};

// Export the Deposit component directly as default
export default function Deposit() {
  const router = useRouter();
  const {
    getDepositAddress,
    depositAddress,
    isMobile,
    filter,
    setFilter,
    setIsLoading,
  } = useContext(AppContext);

  const { isConnected: wagmiConnected } = useAccount();
  const [hasRedirected, setHasRedirected] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [isQrLoading, setIsQrLoading] = useState(true); // Start with loading true
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!wagmiConnected) {
      sessionStorage.setItem("hasRedirected", "false");
      setHasRedirected(false);
    }
  }, [wagmiConnected]);

  useEffect(() => {
    const sessionHasRedirected =
      sessionStorage.getItem("hasRedirected") === "true";
    if (wagmiConnected && !sessionHasRedirected && !hasRedirected) {
      router.push("/dashboard/deposits");
      sessionStorage.setItem("hasRedirected", "true");
      setHasRedirected(true);
    }
  }, [wagmiConnected, hasRedirected, router]);

  // Handle deposit address fetching and QR loading state
  useEffect(() => {
    if (!depositAddress) {
      setIsQrLoading(true);
      getDepositAddress()
        .then(() => {
          setIsQrLoading(false);
        })
        .catch((err) => {
          console.error("Failed to get deposit address:", err);
          setIsQrLoading(false);
        });
    } else {
      setIsQrLoading(false);
    }
  }, [depositAddress, getDepositAddress]);

  // Handle touch events for pull-down gesture
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
        setTranslateY(distance);
      }
    };

    const handleTouchEnd = () => {
      if (touchStart === null || touchMove === null) return;

      const distance = touchMove - touchStart;
      const threshold = 150;

      if (distance > threshold) {
        router.push("/dashboard/portfolio");
      }

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
            className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col px-5 rounded-t-3xl mt-10 py-2 touch-pan-y transition-transform duration-200 ease-out"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            <div className="flex justify-center">
              <div className="w-16 h-[3px] bg-[rgb(112,112,112)] rounded-xl"></div>
            </div>
            <div className="flex justify-between items-center mt-10">
              <div>
                <MdOutlineKeyboardArrowLeft
                  className="text-[30px]"
                  onClick={() => router.back()}
                />
              </div>
              <p className="text-[16px] pr-[8vw]">Deposit:</p>
              <div></div>
            </div>

            <div>
              <h1 className="text-[#5b5b5b] mb-1 mt-5 text-[13px]">
                YOUR DEPOSIT ADDRESS
              </h1>
              <div className="flex border h-14 items-center px-2 rounded-xl border-[#434343] gap-2 justify-between">
                <p className="w-full overflow-hidden text-[14px] truncate">
                  {depositAddress || "Loading address..."}
                </p>
                <div
                  className="w-10 h-10 bg-[#2b2b2b] rounded-lg flex items-center justify-center cursor-pointer
                    hover:bg-[#3b3b3b] active:bg-[#1b1b1b] transition-colors duration-200
                    hover:scale-105 active:scale-95"
                  onClick={handleCopy}
                  title="Copy address"
                >
                  <IoCopyOutline className="text-[20px]" />
                </div>
              </div>
            </div>

            <div className="flex h-56 w-full items-center justify-center mt-10">
              {isQrLoading ? (
                <Preloader />
              ) : depositAddress ? (
                <div className="p-1 border border-[#434343] rounded-lg bg-white">
                  <QRCodeCanvas
                    value={depositAddress}
                    size={180}
                    fgColor="#000"
                    bgColor="#fff"
                    level="Q"
                  />
                </div>
              ) : (
                <p className="text-[#5b5b5b] text-[14px]">
                  No deposit address available
                </p>
              )}
            </div>

            <p className="text-center mb-5 text-[18px]">or</p>
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const isConnected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                const handleClick = () => {
                  if (isConnected) {
                    router.push("/dashboard/deposits");
                  } else {
                    openConnectModal();
                  }
                };

                return (
                  <div
                    className={`flex items-center gap-4  p-3 rounded-sm cursor-pointer text-black  ${
                      !ready ? "opacity-50 pointer-events-none" : ""
                    } ${
                      isConnected
                        ? "border-[1px] border-solid border-[#00ffbb] "
                        : "bg-[#00FFB8]"
                    }`}
                    onClick={handleClick}
                  >
                    <Image
                      src={
                        isConnected
                          ? "Images/connected.png"
                          : "/Images/connect.png"
                      }
                      alt=""
                      height={20}
                      width={20}
                    />
                    <div className="ml-[28%]">
                      {isConnected ? (
                        <div className="flex flex-col">
                          <button type="button" className="text-[#00ffbb]">
                            Add Funds
                          </button>
                        </div>
                      ) : (
                        <button className="text-md text-black">
                          Connect Wallet
                        </button>
                      )}
                    </div>
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] px-[20vw]">
          <HeadingSlider filter={filter} setFilter={setFilter} />
          <div className="flex justify-center pt-[4.65%] gap-5">
            <div className="bg-[#262626] bg-opacity-[31%] flex flex-col items-center rounded-t-3xl pb-10 pt-2 min-h-screen w-full flex-1">
              <div className="mt-3 flex items-center justify-center w-full px-5">
                <button className="text-white text-[16px]">Deposit :</button>
              </div>

              <div className="px-[10vw] mt-[3vw] w-full flex flex-col items-center">
                <p className="text-[0.8vw]">
                  <span className="font-bold">Note: </span>
                  Currently We accept only USDT on the Amoy Polygon Test Network
                </p>
                <div className="w-full">
                  <h1 className="text-white text-opacity-20 mt-[2vw] text-[0.8vw] font-">
                    Your Deposit Address
                  </h1>
                  <div className="flex border h-10 items-center rounded-lg border-[#434343] gap-2 justify-between mt-1 w-full">
                    <p className="w-full overflow-hidden text-[0.6vw] text-white text-opacity-60 truncate px-3">
                      {depositAddress || "Loading address..."}
                    </p>
                    <div
                      className="pr-2 flex items-center justify-center cursor-pointer
                        hover:bg-[#2b2b2b] active:bg-[#1b1b1b] rounded-r-lg h-full w-10
                        transition-colors duration-200 hover:scale-105 active:scale-95"
                      onClick={handleCopy}
                      title="Copy address"
                    >
                      <IoCopyOutline className="text-[1vw]" />
                    </div>
                  </div>
                </div>

                <div className="flex h-40 w-full items-center justify-center my-[3vw]">
                  {isQrLoading ? (
                    <Preloader />
                  ) : depositAddress ? (
                    <div className="p-1 border border-[#434343] rounded-lg bg-white">
                      <QRCodeCanvas
                        value={depositAddress}
                        size={180}
                        fgColor="#000"
                        bgColor="#fff"
                        level="Q"
                      />
                    </div>
                  ) : (
                    <p className="text-white text-opacity-60 text-[0.8vw]">
                      No deposit address available
                    </p>
                  )}
                </div>

                <p className="text-center mb-5 text-[18px]">or</p>
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                  }) => {
                    const ready = mounted && authenticationStatus !== "loading";
                    const isConnected =
                      ready &&
                      account &&
                      chain &&
                      (!authenticationStatus ||
                        authenticationStatus === "authenticated");

                    const handleClick = () => {
                      if (isConnected) {
                        router.push("/dashboard/deposits");
                      } else {
                        openConnectModal();
                      }
                    };

                    return (
                      <div
                        className={`flex items-center rounded-lg gap-3 p-3 cursor-pointer justify-between w-full text-black ${
                          !ready ? "pointer-events-none bg-opacity-10" : ""
                        }  ${
                          isConnected
                            ? "border-[1px] border-solid border-[#00ffbb] "
                            : "bg-[#00FFB8]"
                        }`}
                        onClick={handleClick}
                      >
                        <div className="relative">
                          <Image
                            src={
                              isConnected
                                ? "Images/connected.png"
                                : "/Images/connect.png"
                            }
                            alt=""
                            height={18}
                            width={18}
                          />
                        </div>
                        <div>
                          {isConnected ? (
                            <div className="flex flex-col">
                              <button type="button" className="text-[#00ffbb] ">
                                Add Funds
                              </button>
                            </div>
                          ) : (
                            <button className="text-md text-black ">
                              Connect Wallet
                            </button>
                          )}
                        </div>
                        <div></div>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
            <div>
              <CurrentCashBalanceCardWebview />
            </div>
          </div>
        </div>
      )}
    </>
  );
}