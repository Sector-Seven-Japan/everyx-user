import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function BettingPage() {
  return (
    <div>
      <Navbar />
      <div className="p-5">
        <h1 className="text-[22px] mt-3 text-center">Your Order</h1>
        <div className="mb-6 mt-8">
          <div className="flex flex-col gap-2">
            <p className="text-[19px] font-light">A. Sanjeev</p>
            <div className="flex justify-between items-center gap-2">
              <div className="w-[80%] h-[19px]">
                <div
                  className="h-[19px] rounded-lg bg-[#00FFBB]"
                  style={{
                    width: `$90%`,
                  }}
                ></div>
              </div>
              <p className="text-[19px] font-light">90%</p>
              <Image
                src="/Images/checkbox.png"
                alt="checkbox"
                height={20}
                width={20}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-1">
        <div className="border p-5 border-[#515151] rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
                <p className="text-[22px] text-[#00FFB8]">$12</p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">
                  Leverage cash value
                </p>
                <p className="text-[22px] text-[#00FFB8]">
                  $2 <span className="text-sm text-[#E49C29]">x 1</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Projected payout</p>
                <p className="text-[22px] text-[#00FFB8]">$10</p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">Your return</p>
                <p className="text-[22px] text-[#00FFB8]">+1.3%</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-5">
            <p className="text-[#FF2E2E] text-[17px]">Stop level</p>
            <button className="bg-[#FF2E2E] rounded-md px-3 py-1">40%</button>
          </div>
        </div>
        <div className="flex justify-between items-center px-3 py-5">
          <Image src="/Images/down.png" alt="" height={10} width={10} />
          <div className="flex items-center gap-4">
            <p className="text-[13px] text-[#5D5D5D]">Cash used</p>
            <p className="text-[22px] text-[#00FFB8]">$12</p>
          </div>
          <Image src="/Images/down.png" alt="" height={10} width={10} />
        </div>
        <div className="border p-5 border-[#515151] rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
                <p className="text-[22px] text-[#00FFB8]">$12</p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">
                  Leverage cash value
                </p>
                <p className="text-[22px] text-[#00FFB8]">
                  $2 <span className="text-sm text-[#E49C29]">x 1</span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Projected payout</p>
                <p className="text-[22px] text-[#00FFB8]">$10</p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">Your return</p>
                <p className="text-[22px] text-[#00FFB8]">+1.3%</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-5">
            <p className="text-[#FF2E2E] text-[17px]">Stop level</p>
            <button className="bg-[#FF2E2E] rounded-md px-3 py-1">40%</button>
          </div>
        </div>
      </div>

      <div className="px-5">
        <button
          //   onClick={handleSubmit}
          className="text-[#00FFB8] w-full border border-[#00FFB8] mt-8 py-4 rounded-2xl"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
