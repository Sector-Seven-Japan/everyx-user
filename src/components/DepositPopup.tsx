"use client";
import { useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { IoCard } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import TransferCryptoPopup from "./TransferCryptoPopup";

interface DepositPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DepositPopup({ isOpen, onClose }: DepositPopupProps) {
  const [showTransferCryptoPopup, setShowTransferCryptoPopup] = useState(false);

  return (
    <>
      {/* Main Deposit Popup */}
      <div
        className={`fixed bottom-0 left-0 w-full p-2 z-50 transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } shadow-lg`} // Added shadow-lg for the popup
      >
        <div className="border border-[#373737] w-full h-full rounded-2xl bg-[#131414] shadow-xl">
          {" "}
          {/* Added shadow-xl for stronger shadow */}
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
              onClick={() => setShowTransferCryptoPopup(true)}
            >
              <FontAwesomeIcon icon={faBolt} className="text-[30px]" />
              <div>
                <h1 className="text-lg text-white">Transfer Crypto</h1>
                <p className="text-[#5b5b5b]">No limit . Instant</p>
              </div>
            </div>

            {/* Connect Exchange */}
            <div className="flex items-center gap-4 border border-[#373737] p-3 rounded-xl hover:bg-[#202020]">
              <IoIosLink className="text-[30px]" />
              <div>
                <h1 className="text-lg text-white">Connect Exchange</h1>
                <p className="text-[#5b5b5b]">No limit . 3 mins</p>
              </div>
            </div>

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
          setShowTransferCryptoPopup={setShowTransferCryptoPopup}
        />
      )}
    </>
  );
}
