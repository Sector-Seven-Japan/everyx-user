"use client";
import { useContext, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import DrawGraph from "@/components/DrawGraph";

export default function WagerPage() {
  const {
    setIsLoading,
    orderDetails,
    selectedOrder,
    walletData,
    API_BASE_URL,
    authToken,
    fetchWalletData,
  } = useContext(AppContext);
  const router = useRouter();
  const [option, setOption] = useState<string>("Order details");

  return (
    <div className="pb-10">
      <Navbar />
      <div className="p-5">
        <h1 className="text-[22px] mt-3 text-center">Your Order</h1>
        <div>
          <div className="flex mt-7 gap-3">
            <button className="border border-[#00FFB8] px-4 py-1 text-xs text-[#2DC198] rounded-md">
              Sports
            </button>
            <p className="text-[#2DC198] flex gap-1 items-center font-light">
              <Image
                src={"/Images/FreeClock i.png"}
                alt="clock"
                height={18}
                width={18}
              />
              1 Day and 23h30m
            </p>
          </div>
          <p className="text-[21px] font-light mt-4">
          Who will make it to the Asutralian OpenMen's Singles semifinals ？ 
          </p>
          <p className="text-[#3E3E3E] mt-2">ID: NDSJHDH676235</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#363636] pb-[6px] px-5 gap-8 mt-3">
        <h1
          className={`text-[17px] relative cursor-pointer ${
            option === "Order details" ? "text-[#00FFBB]" : "text-[#323232]"
          }`}
          onClick={() => setOption("Order details")}
        >
          Order details
          {option === "Order details" && (
            <div className="absolute w-5 h-[4px] bg-[#00FFBB] -bottom-[6px] left-1/2 transform -translate-x-1/2"></div>
          )}
        </h1>

        <h1
          className={`text-[17px] relative cursor-pointer ${
            option === "Charts" ? "text-[#00FFBB]" : "text-[#323232]"
          }`}
          onClick={() => setOption("Charts")}
        >
          Charts
          {option === "Charts" && (
            <div className="absolute w-5 h-[4px] bg-[#00FFBB] -bottom-[6px] left-1/2 transform -translate-x-1/2"></div>
          )}
        </h1>
      </div>

      {/* Conditional Rendering for Order Details */}
      {option === "Order details" ? (
        <div className="p-5">
          <div className="flex justify-between mt-5">
            <div>
              <p className="text-[#5D5D5D] text-[17px] mb-1">
                Potential payout
              </p>
              <p className="flex justify-between text-[22px] text-[#00FFB8]">
                $
                {Math.round(
                  orderDetails?.wager * (orderDetails?.indicative_return / 100)
                )}
                <span className="text-[14px] text-[#E49C29] flex items-end">
                  +{orderDetails?.indicative_return.toFixed(0)}%
                </span>
              </p>
            </div>
            <div>
              <p className="text-[#5D5D5D] text-[17px] mb-1">
                Your Traded Probability
              </p>
              <p className="flex justify-between text-[22px] text-[#00FFB8]">
                {Math.round(orderDetails?.new_probability * 100)}%
                <span className="text-[14px] text-[#E49C29] flex items-end">
                  +{(orderDetails?.probability_change * 100).toFixed(1)}%
                </span>
              </p>
            </div>
          </div>
          <div className="h-[0.5px] w-[70%] mb-6 border-t border-dashed mx-auto mt-6 border-[#575757]"></div>

          {/* Order Data */}
          <div className="mb-6">
            <div className="flex flex-col gap-2">
              <p className="text-[19px] font-light">A. Sanjeev visgwakrmaa</p>
              <div className="flex justify-between items-center gap-2">
                <div className="w-[80%] h-[19px]">
                  <div
                    className="h-[19px] rounded-lg bg-[#00FFBB]"
                    style={{
                      width: `80%`,
                    }}
                  ></div>
                </div>
                <p className="text-[19px] font-light">
                  {Math.round(orderDetails?.current_probability * 100)}%
                </p>
                <Image
                  src="/Images/checkbox.png"
                  alt="checkbox"
                  height={20}
                  width={20}
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${orderDetails?.after_wager.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Projected payout</p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${orderDetails?.after_payout.toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">Your return</p>
                <p className="text-[22px] text-[#00FFB8]">
                  +{orderDetails?.after_return.toFixed(0)} %
                </p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        // Chart Section
        <div className="p-5">
          <div className="mt-5">
            {/* Order Data */}
            <div className="mb-6">
              <div className="flex flex-col gap-2 mb-5">
                <p className="text-[19px] font-light">{selectedOrder}</p>
                <div className="flex justify-between items-center gap-2">
                  <div className="w-[80%] h-[19px]">
                    <div
                      className="h-[19px] rounded-lg bg-[#00FFBB]"
                      style={{
                        width: `${Math.round(
                          orderDetails?.current_probability * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-[19px] font-light">
                    {Math.round(orderDetails?.current_probability * 100)}%
                  </p>
                  <Image
                    src="/Images/checkbox.png"
                    alt="checkbox"
                    height={20}
                    width={20}
                  />
                </div>
              </div>
              {/* <DrawGraph data={graphData} /> */}
            </div>
          </div>
        </div>
      )}

      <div className="px-5">
        <button
        //   onClick={handleSubmit}
          className="text-[#000] w-full border bg-[#5DFF00] mt-6 py-4 rounded-2xl"
        >
          Add Margin
        </button>
      </div>
    </div>
  );
}
