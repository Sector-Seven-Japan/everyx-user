import Image from "next/image";
import { IoCopyOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { IoIosLink } from "react-icons/io";
import { QRCodeCanvas } from "qrcode.react"; // Corrected import

interface TransferCryptoPopupProps {
  setShowTransferCryptoPopup: (value: boolean) => void;
  data: string;
}

export default function TransferCryptoPopup({
  data,
  setShowTransferCryptoPopup,
}: TransferCryptoPopupProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      alert("Address copied to clipboard!"); // You can replace this with a toast notification
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50 transition-transform duration-300 translate-y-0 bg-[#262626] rounded-t-2xl">
      {/* Close Button */}
      <div className="mb-5 relative">
        <div className="absolute right-0 -top-2">
          <RxCross1
            className="text-[20px] text-[#5b5b5b] cursor-pointer"
            onClick={() => setShowTransferCryptoPopup(false)}
          />
        </div>
        <h1 className="font-bold text-[#5b5b5b] text-lg mb-1 mt-3">TOKEN</h1>
        <div className="flex border p-3 rounded-xl border-[#434343] gap-2">
          <Image
            src="/Images/usd_logo.webp"
            alt="usd_logo"
            height={25}
            width={25}
          />
          <select className="bg-transparent w-full font-semibold outline-none">
            <option value="">USDT</option>
          </select>
        </div>
      </div>

      {/* Blockchain Selection */}
      <div>
        <h1 className="font-bold text-[#5b5b5b] text-lg mb-1">CHAIN</h1>
        <div className="flex border p-3 rounded-xl border-[#434343] gap-2">
          <div className="flex w-7 h-6 items-center justify-center bg-[#833EC3] rounded-full">
            <IoIosLink className="text-[20px]" />
          </div>
          <select className="bg-transparent w-full font-semibold outline-none">
            <option value="">Polygon</option>
          </select>
        </div>
      </div>


      {/* Deposit Address */}
      <div>
        <h1 className="font-bold text-[#5b5b5b] text-lg mb-1 mt-5">
          YOUR DEPOSIT ADDRESS
        </h1>
        <div className="flex border h-14 items-center px-2 rounded-xl border-[#434343] gap-2 justify-between">
          <p className="w-full overflow-hidden text-[14px] truncate">
            {data}
          </p>
          <div
            className="w-10 h-10 bg-[#2b2b2b] rounded-lg flex items-center justify-center cursor-pointer"
            onClick={handleCopy}
          >
            <IoCopyOutline className="text-[20px]" />
          </div>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex h-56 w-full items-center justify-center">
        {data && (
          <div className="p-1 border border-[#434343] rounded-lg bg-white">
            <QRCodeCanvas
              value={data}
              size={180}
              fgColor="#000"
              bgColor="#fff"
              level="Q"
            />
          </div>
        )}
      </div>

     
    </div>
  );
}
