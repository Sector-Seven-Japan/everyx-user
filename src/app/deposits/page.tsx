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
import React, { useContext, useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useAccount } from "wagmi";

const Deposit: React.FC = () => {
  const router = useRouter();
  const { getDepositAddress, depositAddress, isMobile, filter, setFilter } =
    useContext(AppContext);


  const { isConnected: wagmiConnected } = useAccount();
  const [hasRedirected, setHasRedirected] = useState(false);

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
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col px-5 rounded-t-3xl mt-10 py-5">
            <div className="flex justify-center items-center">
              <div>
                <MdOutlineKeyboardArrowLeft
                  className="text-[30px]"
                  onClick={() => {
                    router.back();
                  }}
                />
              </div>
              <p className="text-[16px]">Deposit:</p>
              <div></div>
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
                  className="w-10 h-10 bg-[#2b2b2b] rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={handleCopy}
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
            {/* Connect Exchange - Using RainbowKit ConnectButton */}
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
                    router.push("/deposit-withdrawal/deposits"); // Redirect if connected
                  } else {
                    openConnectModal(); // Open wallet connect modal if not connected
                  }
                };

                return (
                  <div
                    className={`flex items-center gap-4 bg-[#00FFB8] p-3 rounded-sm cursor-pointer text-black justify-center ${!ready ? "opacity-50 pointer-events-none" : ""
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
                            {chain.name}
                          </button>
                          <button type="button" className="text-black">
                            {account.displayName}{" "}
                            {account.displayBalance
                              ? `(${account.displayBalance})`
                              : ""}
                          </button>
                        </div>
                      ) : (
                        <button className="text-lg text-black">
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
        <div className="bg-[#0E0E0E] md:px-[12%] lg:px-[20vw]">
          <HeadingSlider filter={filter} setFilter={setFilter} />
          <div className="flex md:flex-row md:pt-[4.65%] justify-between gap-5">
            <div className="bg-[#262626] bg-opacity-[31%] md:w-[60%] xl:w-[70%] w-full pb-[4vw] rounded-2xl">
              {/* Deposit and Withdrawal Section */}

              <div className="mt-[2vw] flex items-center justify-center w-full px-[2vw]">
                <button className="text-white text-[1vw] ">Deposit :</button>
              </div>

              <div className="px-[10vw] mt-5 w-full">
                <p className="text-[14px]">
                  <span className="font-bold">Note: </span>
                  Currently We accept only USDT on the Amoy Polygon Test Network
                </p>
                <div>
                  <h1 className="text-[#5b5b5b] mb-1 mt-5 text-[12px]">
                    YOUR DEPOSIT ADDRESS
                  </h1>
                  <div className="flex border h-10 items-center  rounded-xl border-[#434343] gap-2 justify-between">
                    <p className="w-full overflow-hidden text-[14px] truncate">
                      {depositAddress}
                    </p>
                    <div
                      className="w-10 h-10 bg-[#2b2b2b] rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={handleCopy}
                    >
                      <IoCopyOutline className="text-[18px]" />
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
                {/* Connect Exchange - Using RainbowKit ConnectButton */}
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
                        router.push("/deposit-withdrawal/deposits"); // Redirect if connected
                      } else {
                        openConnectModal(); // Open wallet connect modal if not connected
                      }
                    };

                    return (
                      <div
                        className={`flex items-center rounded-lg gap-3 bg-[#00FFB8] p-3 cursor-pointer justify-between text-black  ${!ready
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
            <div className="m:w-[40%]  xl:w-[30%]">
              <CurrentCashBalanceCardWebview />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Deposit;
