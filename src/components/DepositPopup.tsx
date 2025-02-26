"use client";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IoCopyOutline } from "react-icons/io5";
import { QRCodeCanvas } from "qrcode.react"; // Corrected import
import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/app/Context/AppContext";

export default function DepositPopup() {
  const router = useRouter();
  const { isOpen, setIsOpen, depositAddress, isMobile } =
    useContext(AppContext);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      alert("Address copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      {/* Main Deposit Popup */}
      {isMobile ? (
        <div
          className={`fixed bottom-0 left-0 w-full p-2 z-50 transition-transform duration-300 bg-[#262626] rounded-t-2xl pb-20 px-5 pt-8 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          } shadow-lg`}
        >
          <div className="flex justify-between items-center">
            <div
              onClick={() => {
                setIsOpen(false);
              }}
            >
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
      ) : (
        <div
          className={`fixed bottom-0 left-[10vw] w-[50%]  max-h-screen mt-20 z-50 transition-transform duration-300 bg-[#262626] rounded-t-2xl pb-20 px-5 pt-8 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          } shadow-lg`}
        >
          <div className="flex justify-between items-center">
            <div
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <MdOutlineKeyboardArrowLeft className="text-[30px]" />
            </div>
            <p className="text-[16px]">Deposit:</p>
            <p className="text-[#00ffbb] text-[13px]">Withdrawal</p>
          </div>

          <div className="flex justify-center mt-10">
            <div className="w-[25vw]">
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
          <div className="flex justify-center">
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
                    className={`flex items-center w-80 rounded-xl gap-4 bg-[#00FFB8] p-3  cursor-pointer text-black justify-center ${
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
      )}
    </>
  );
}
