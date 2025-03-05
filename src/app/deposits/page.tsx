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
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  TouchEvent as ReactTouchEvent,
} from "react";
import { IoCopyOutline } from "react-icons/io5";
import { useAccount } from "wagmi";

const Deposit: React.FC = () => {
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
  const [translateY, setTranslateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const isNavigatingRef = useRef(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    // Only track touch if at the top of the container
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      isNavigatingRef.current = false;
    }
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (startYRef.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    // Only pull down
    if (deltaY > 0) {
      e.preventDefault(); // Prevent default scrolling
      window.scrollTo(0, 0); // Stop default browser scroll

      // Gradually increase translation with a dampening effect
      const translationAmount = Math.min(deltaY * 0.5, 200);
      setTranslateY(translationAmount);

      // Check if pull is significant
      if (translationAmount > 150 && !isNavigatingRef.current) {
        isNavigatingRef.current = true;
        router.push("/deposit-withdrawal/history");
      }
    }
  };

  const handleTouchEnd = () => {
    // Smoothly reset translation
    setTranslateY(0);
    startYRef.current = null;
  };

  useEffect(() => {
    const preventPullToRefresh = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventPullToRefresh, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventPullToRefresh);
    };
  }, []);

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
      router.push("/deposit-withdrawal/deposits");
      sessionStorage.setItem("hasRedirected", "true");
      setHasRedirected(true);
    }
  }, [wagmiConnected, hasRedirected, router]);

  useEffect(() => {
    getDepositAddress();
  }, [getDepositAddress]);

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
            className="relative bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col px-5 rounded-t-3xl mt-10 py-2 touch-pan-y transition-transform duration-300 ease-out overflow-y-auto"
            style={{
              transform: `translateY(${translateY}px)`,
              willChange: "transform",
            }}
          >
            {/* Puller indicator */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-[3px] bg-[rgb(112,112,112)] rounded-xl"></div>

            <div className="mt-8">
              <p className="text-[16px] pr-[8vw] text-center">Deposit:</p>
            </div>

            <div>
              <h1 className="text-[#5b5b5b] mb-1 mt-5 text-[13px]">
                YOUR DEPOSIT ADDRESS
              </h1>
              <div className="flex border h-14 items-center px-2 rounded-xl border-[#434343] gap-2 justify-between">
                <p className="w-full overflow-hidden text-[14px] truncate">
                  {depositAddress}
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
              {depositAddress && (
                <div className="p-1 border border-[#434343] rounded-lg bg-white">
                  <QRCodeCanvas
                    value={depositAddress}
                    size={180}
                    fgColor="#000"
                    bgColor="#fff"
                    level="Q"
                  />
                </div>
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
                    router.push("/deposit-withdrawal/deposits");
                  } else {
                    openConnectModal();
                  }
                };

                return (
                  <div
                    className={`flex items-center gap-4 bg-[#00FFB8] p-3 rounded-sm cursor-pointer text-black justify-center ${
                      !ready ? "opacity-50 pointer-events-none" : ""
                    }`}
                    onClick={handleClick}
                  >
                    <Image
                      src="/Images/connect.png"
                      alt=""
                      height={20}
                      width={20}
                    />
                    <div>
                      {isConnected ? (
                        <div className="flex flex-col">
                          <button type="button" className="text-black">
                            Connect Wallet
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
                      {depositAddress}
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
                  {depositAddress && (
                    <div className="p-1 border border-[#434343] rounded-lg bg-white">
                      <QRCodeCanvas
                        value={depositAddress}
                        size={180}
                        fgColor="#000"
                        bgColor="#fff"
                        level="Q"
                      />
                    </div>
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
                        router.push("/deposit-withdrawal/deposits");
                      } else {
                        openConnectModal();
                      }
                    };

                    return (
                      <div
                        className={`flex items-center rounded-lg gap-3 bg-[#00FFB8] p-3 cursor-pointer justify-between w-full text-black ${
                          !ready
                            ? "pointer-events-none bg-opacity-10"
                            : isConnected
                            ? "opacity-50"
                            : ""
                        }`}
                        onClick={handleClick}
                      >
                        <div className="relative">
                          <Image
                            src="/Images/connect.png"
                            alt=""
                            height={18}
                            width={18}
                          />
                        </div>
                        <div>
                          {isConnected ? (
                            <div className="flex flex-col">
                              <button type="button" className="text-black">
                                Connect Wallet
                              </button>
                            </div>
                          ) : (
                            <button className="text-md text-black">
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
};

export default Deposit;
