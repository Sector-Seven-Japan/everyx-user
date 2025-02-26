"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { IoCard } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import TransferCryptoPopup from "./TransferCryptoPopup";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AppContext } from "@/app/Context/AppContext";

interface DepositPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositPopup({ isOpen, onClose }: DepositPopupProps) {
  const [showTransferCryptoPopup, setShowTransferCryptoPopup] = useState(false);
  const router = useRouter(); // Use Next.js router for navigation
  const { authToken, API_BASE_URL } = useContext(AppContext);
  const [depositAddress, setDepositAddress] = useState<string>(""); // Deposit address state

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/deposit/create/wallet`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setDepositAddress(data.address);
      setShowTransferCryptoPopup(true);
    } catch (error) {
      console.log("failed to fetch deposit address", error);
    }
  };

  return (
    <>
      {/* Main Deposit Popup */}
      <div
        className={`fixed bottom-0 left-0 w-full p-2 z-50 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } shadow-lg`}
      >
        <div className="border border-[#373737] w-full h-full rounded-2xl bg-[#131414] shadow-xl">
          <div className="flex justify-between border-b border-[#373737] p-3 items-center">
            <MdOutlineKeyboardArrowLeft className="text-[25px] text-[#5b5b5b]" />
            <div className="flex flex-col items-center">
              <h1 className="text-lg">Source</h1>
              <p className="text-[#5b5b5b]">Polymarket Balance: $0.00</p>
            </div>
            <RxCross1
              className="text-[20px] text-[#5b5b5b] cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="w-full py-3 px-3 flex flex-col gap-2">
            {/* Transfer Crypto - Opens second popup */}
            <div
              className="flex items-center gap-4 border border-[#373737] p-3 rounded-xl hover:bg-[#202020] cursor-pointer"
              onClick={handleSubmit}
            >
              <FontAwesomeIcon icon={faBolt} className="text-[30px]" />
              <div>
                <h1 className="text-lg text-white">Transfer Crypto</h1>
                <p className="text-[#5b5b5b]">No limit . Instant</p>
              </div>
            </div>

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
                    className={`flex items-center gap-4 border border-[#373737] p-3 rounded-xl hover:bg-[#202020] cursor-pointer ${
                      !ready ? "opacity-50 pointer-events-none" : ""
                    }`}
                    onClick={handleClick}
                  >
                    <IoIosLink className="text-[30px]" />
                    <div>
                      {connected ? (
                        <div className="flex flex-col">
                          <button
                            // onClick={openChainModal}
                            type="button"
                            className="text-white"
                          >
                            {chain.name}
                          </button>
                          <button
                            // onClick={openAccountModal}
                            type="button"
                            className="text-white"
                          >
                            {account.displayName}{" "}
                            {account.displayBalance
                              ? `(${account.displayBalance})`
                              : ""}
                          </button>
                        </div>
                      ) : (
                        <button className="text-lg text-white">
                          Connect Wallet
                        </button>
                      )}
                    </div>
                  </div>
                );
              }}
            </ConnectButton.Custom>

            {/* Cards */}
            <div className="flex items-center gap-4 border border-[#373737] p-3 rounded-xl hover:bg-[#202020]">
              <IoCard className="text-[30px]" />
              <div>
                <h1 className="text-lg text-white">Cards</h1>
                <p className="text-[#5b5b5b]">$10,000 limit . 2 mins</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Crypto Details Popup */}
      {showTransferCryptoPopup && (
        <TransferCryptoPopup
          data={depositAddress}
          setShowTransferCryptoPopup={setShowTransferCryptoPopup}
        />
      )}
    </>
  );
}
