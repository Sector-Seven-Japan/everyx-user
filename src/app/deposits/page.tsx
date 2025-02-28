"use client";

import { AppContext } from "@/app/Context/AppContext";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import Navbar from "@/components/Navbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import React, { useContext, useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Deposit: React.FC = () => {
  const router = useRouter();

  const { getDepositAddress, depositAddress, isMobile } =
    useContext(AppContext);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  useEffect(() => {
    getDepositAddress();
  }, [depositAddress]);

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-5 flex flex-col">
          <CurrentCashBalanceCard />
          <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col px-5 rounded-t-3xl mt-10 py-5">
            <div className="flex justify-between items-center">
              <div>
                <MdOutlineKeyboardArrowLeft className="text-[30px]" />
              </div>
              <p className="text-[16px]">Deposit:</p>
              <p className="text-[#00ffbb] text-[13px]">Withdrawal</p>
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
                // openAccountModal,
                // openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === "authenticated");

                const handleClick = () => {
                  if (connected) {
                    router.push("/deposit-withdrawal/deposits"); // Redirect if connected
                  } else {
                    openConnectModal(); // Open wallet connect modal if not connected
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
                      {connected ? (
                        <div className="flex flex-col">
                          <button
                            // onClick={openChainModal}
                            type="button"
                            className="text-black"
                          >
                            {chain.name}
                          </button>
                          <button
                            // onClick={openAccountModal}
                            type="button"
                            className="text-black"
                          >
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
        <div className="bg-[#0E0E0E] lg:px-[10vw] md:px-[5vw] sm:px-[5vw] pt-[2vw] grid grid-cols-10 gap-[2vw] h-screen">
          <div className="bg-[#262626] bg-opacity-[31%] flex flex-col items-center rounded-t-3xl py-[2vw] col-span-6 h-full">
            <div className="w-[4vw] h-[0.2vw] bg-[#707070] rounded-xl"></div>

            {/* Deposit and Withdrawal Section */}
            <div className="mt-[2vw] flex items-center justify-between w-full px-[2vw]">
              <div></div>
              <button className="text-white text-[1vw] pl-[5vw]">
                Deposit :
              </button>
              <button
                className="text-[#2DC198] text-[1vw]"
                type="button"
                onClick={() => router.push("/deposit-withdrawal/withdrawal")}
              >
                Withdrawal
              </button>
            </div>

            <div className="px-[10vw] mt-20  w-full">
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
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  const handleClick = () => {
                    if (connected) {
                      router.push("/deposit-withdrawal/deposits"); // Redirect if connected
                    } else {
                      openConnectModal(); // Open wallet connect modal if not connected
                    }
                  };

                  return (
                    <div
                      className={`flex items-center rounded-lg gap-3 bg-[#00FFB8] p-3 cursor-pointer justify-between text-black  ${
                        !ready
                          ? "pointer-events-none bg-opacity-10"
                          : connected
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
                        {connected ? (
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
          <div className="col-span-4 flex justify-end">
            <CurrentCashBalanceCardWebview />
          </div>
        </div>
      )}
    </>
  );
};

export default Deposit;
