"use client";

import { AppContext } from "@/app/Context/AppContext";
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
  const { getDepositAddress, depositAddress } = useContext(AppContext);

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
    <div>
      <div className="bg-[#262626] bg-opacity-[31%] flex-1 flex flex-col px-5 rounded-t-3xl mt-10 py-5">
        <div className="flex justify-center ">
          <div className="w-16 h-[3px] bg-[#707070] rounded-xl"></div>
        </div>

        <div className="flex justify-between items-center mt-3">
          <div>
            <MdOutlineKeyboardArrowLeft
              className="text-[30px]"
              onClick={() => {
                router.back();
              }}
            />
          </div>
          <p className="text-[16px] mr-[7vw]">Deposit:</p>
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
                className={`flex items-center gap-4 bg-[#00FFB8] p-3 rounded-sm cursor-pointer text-black justify-between ${
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
                <div></div>
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default Deposit;
