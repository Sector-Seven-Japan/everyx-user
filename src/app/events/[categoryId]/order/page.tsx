"use client";
import { useContext, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";

interface WagerPayload {
  event_id: string;
  event_outcome_id: string;
  force_leverage: boolean;
  leverage: number;
  loan: number;
  max_payout: number;
  pledge: number;
  wager: number;
  wallet_id: number;
}

export default function Order() {
  const {
    setIsLoading,
    orderDetails,
    selectedOrder,
    walletData,
    API_BASE_URL,
    authToken,
    fetchWalletData
  } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  console.log(orderDetails);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const wagerPayload: WagerPayload = {
        event_id: orderDetails?.event_id,
        event_outcome_id: orderDetails?.event_outcome_id,
        force_leverage: false,
        leverage: 1,
        loan: 0,
        max_payout: orderDetails?.indicative_payout,
        pledge: orderDetails?.pledge,
        wager: orderDetails?.wager,
        wallet_id: walletData[0]?.id,
      };
      const response = await fetch(`${API_BASE_URL}/wagers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(wagerPayload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Order placement failed");
      }
      if (response.ok) {
        await fetchWalletData();
        await router.push(`/events/${orderDetails?.event_id}/order/success`);
      }
    } catch (error) {
      console.error("Navigation  error:", error);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="p-5">
        <h1 className="text-[22px] text-center mt-5">Your Order</h1>
        <div className="flex gap-3 mt-10 leading-6 mb-14">
          <div className="w-1/2 px-5 py-5 bg-[#131313] rounded-md flex flex-col">
            <div className="flex justify-between items-center border-b border-dashed border-[#676767] pb-3">
              <p className="text-[12px]">
                Potential <br /> Payout
              </p>
              <p className="text-[#FFAE2A] text-[21px]">
                +{orderDetails?.indicative_return.toFixed(0)}%
              </p>
            </div>
            <div className="flex items-center justify-center text-[#00FFB8] text-[22px] pt-3">
              $
              {Math.round(
                orderDetails?.wager * (orderDetails?.indicative_return / 100)
              )}
            </div>
          </div>
          <div className="w-1/2 px-5 py-5 bg-[#131313] rounded-md flex flex-col">
            <div className="flex justify-between items-center border-b border-dashed border-[#676767] pb-3">
              <p className="text-[12px]">
                Your Traded <br />
                Probability
              </p>
              <p className="text-[#FFAE2A] text-[21px]">
                +{(orderDetails?.probability_change * 100).toFixed(1)}%
              </p>
            </div>
            <div className="flex items-center justify-center text-[#00FFB8] text-[22px] pt-3">
              {Math.round(orderDetails?.new_probability * 100)}%
            </div>
          </div>
        </div>

        <div className="mb-14">
          <div className="flex flex-col gap-2">
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
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <p>CASH USED</p>
            <p className="text-[#00FFB8] text-[23px]">
              ${orderDetails?.after_wager.toFixed(1)}
            </p>
          </div>
          <div className="flex justify-between">
            <p>PROJECTED PAYOUT</p>
            <p className="text-[#00FFB8] text-[23px]">
              ${orderDetails?.after_payout.toFixed(1)}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="text-[#00FFB8] w-full border border-[#00FFB8] mt-16 py-4 rounded-2xl"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
