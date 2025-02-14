import Image from "next/image";
import { useState } from "react";

export default function CategoryChart() {
  const [selectedBtn, setSelectedBtn] = useState("ALL");
  
  return (
    <div className="px-5 mb-10">
      <h1 className="text-center font-bold mb-8">Live Chart</h1>
      <div className="flex justify-between items-end mb-5">
        <p className="text-[#00FFB8] text-[15px] pb-[1px]">A. Jannik Sinner</p>
        <div className="flex items-end gap-4">
          <p className="text-[21px] font-bold">
            30<span className="text-[12px]">% chance</span>
          </p>
          <p className="text-[#FF4E00] text-xs flex items-center gap-2">
            <Image
              className="h-6 pb-[2px]"
              src="/images/downarrow.png"
              alt=""
              height={10}
              width={10}
            />
            53%
          </p>
        </div>
      </div>
      <div
        className="rounded-lg overflow-hidden"
        style={{ position: "relative", width: "100%", height: "150px" }}
      >
        <Image
          src="/images/chart.png"
          alt=""
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex justify-between mt-3">
        {[1, 2, 3, 4, 5, 6, 7].map((item, index) => {
          return (
            <p key={index} className="text-[11px] text-[#9A9A9A]">
              Jan {item}
            </p>
          );
        })}
      </div>
      <div className="flex mt-4 justify-between">
        {["ALL", "1M", "1W", "1D", "6H", "1H"].map((item, index) => {
          return (
            <button
              onClick={() => {
                setSelectedBtn(item);
              }}
              key={index}
              className={`${
                selectedBtn === item && "bg-[#00FFB8] text-black"
              } text-xs px-[16px] py-[6px] border border-[#00FFB8] text-[#00FFB8] rounded-full`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
