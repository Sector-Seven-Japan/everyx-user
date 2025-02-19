import Image from "next/image";
import { IoCopyOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { IoIosLink } from "react-icons/io";

interface TransferCryptoPopupProps {
  setShowTransferCryptoPopup: (value: boolean) => void;
}

export default function TransferCryptoPopup({
  setShowTransferCryptoPopup,
}: TransferCryptoPopupProps) {
  const textToCopy = "0x56cbae006895aaf0546c6f0216249012329ba3640";

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Address copied to clipboard!"); // Optional: Show confirmation
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50 transition-transform duration-300 translate-y-0 bg-[#1a1a1a] rounded-t-2xl">
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
          <select
            name=""
            id=""
            className="bg-transparent w-full font-semibold outline-none"
          >
            <option value="">USDC</option>
          </select>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-[#5b5b5b] text-lg mb-1">CHAIN</h1>
        <div className="flex border p-3 rounded-xl border-[#434343] gap-2">
          <div className="flex w-7 h-6 items-center justify-center bg-[#833EC3] rounded-full">
            <IoIosLink className="text-[20px]" />
          </div>
          <select
            name=""
            id=""
            className="bg-transparent w-full font-semibold outline-none"
          >
            <option value="">Polygon</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mt-1 mb-5">
        <p className="text-[#5b5b5b] font-semibold">Minimum deposit</p>
        <p className="text-[#5b5b5b] font-semibold">$10.00</p>
      </div>

      <div>
        <h1 className="font-bold text-[#5b5b5b] text-lg mb-1">
          YOUR DEPOSIT ADDRESS
        </h1>
        <div className="flex border h-14 items-center px-2 rounded-xl border-[#434343] gap-2 justify-between">
          <p className="font-bold w-full overflow-hidden text-[14px]">
            {textToCopy}
          </p>
          <div
            className="w-10 h-10 bg-[#2b2b2b] rounded-lg flex items-center justify-center cursor-pointer"
            onClick={handleCopy} // Added the copy function here
          >
            <IoCopyOutline className="text-[20px]" />
          </div>
        </div>
      </div>

      <div className="flex h-56 w-full items-center justify-center">
        <Image src={"/Images/example.webp"} alt="qr" height={180} width={180} />
      </div>

      <div>
        <p className="text-[#5b5b5b] font-bold text-sm">
          Send in greater than $10.00 of this accepted token to the address
          above and it will auto swap to USDC in your Polymarket wallet, minus{" "}
          <span className="text-blue-400">fees. </span>
          <span className="text-blue-400">Terms & conditions </span>
          apply. Experiencing problems?{" "}
          <span className="text-blue-400">Get help.</span>
        </p>
      </div>
    </div>
  );
}
