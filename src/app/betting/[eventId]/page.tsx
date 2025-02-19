"use client";
import { useContext} from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";

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

export default function BettingPage() {
  const {
    orderDetails,
    setIsLoading,
    walletData,
    API_BASE_URL,
    authToken,
    fetchWalletData,
    selectedOrder,
  } = useContext(AppContext);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const wagerPayload: WagerPayload = {
        event_id: orderDetails?.event_id,
        event_outcome_id: orderDetails?.event_outcome_id,
        force_leverage: true,
        leverage: orderDetails?.leverage,
        loan: orderDetails?.loan,
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
      console.error("Navigation error:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-5">
        <h1 className="text-[22px] mt-3 text-center">Your Order</h1>
        <div className="mb-6 mt-8">
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
                {Math.round((orderDetails?.current_probability ?? 0) * 100)}%
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
      </div>

      <div className="px-1">
        <div className="border p-5 border-[#515151] rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${orderDetails?.before_wager.toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">
                  Leverage cash value
                </p>
                <p className="text-[22px] text-[#00FFB8]">
                  $2{" "}
                  <span className="text-sm text-[#E49C29]">
                    x {orderDetails?.before_leverage}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Projected payout</p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${orderDetails?.before_payout.toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">Your return</p>
                <p className="text-[22px] text-[#00FFB8]">
                  +{orderDetails?.before_return.toFixed(0)} %
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-5">
            <p className="text-[#FF2E2E] text-[17px]">Stop level</p>
            <button className="bg-[#FF2E2E] rounded-md px-3 py-1">
              {(orderDetails?.before_stop_probability * 100).toFixed(0)}%
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center px-3 py-5">
          <Image src="/Images/down.png" alt="" height={10} width={10} />
          <div className="flex items-center gap-4">
            <p className="text-[13px] text-[#5D5D5D]">Cash used</p>
            <p className="text-[22px] text-[#00FFB8]">${orderDetails?.wager}</p>
          </div>
          <Image src="/Images/down.png" alt="" height={10} width={10} />
        </div>
        <div className="border p-5 border-[#515151] rounded-xl">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[1px]">
                <p className="text-[#5D5D5D] text-[13px]">Cash used</p>
                <p className="text-[22px] text-[#00FFB8]">
                  ${orderDetails?.after_wager.toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col gap-[1px] items-end">
                <p className="text-[#5D5D5D] text-[13px]">
                  Leverage cash value
                </p>
                <p className="text-[22px] text-[#00FFB8]">
                  $2{" "}
                  <span className="text-sm text-[#E49C29]">
                    x {orderDetails?.after_leverage}
                  </span>
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

          <div className="flex justify-between mt-5">
            <p className="text-[#FF2E2E] text-[17px]">Stop level</p>
            <button className="bg-[#FF2E2E] rounded-md px-3 py-1">
              {(orderDetails?.after_stop_probability * 100).toFixed(0)}%
            </button>
          </div>
        </div>
      </div>

      <div className="px-5">
        <button
          onClick={handleSubmit}
          className="text-[#00FFB8] w-full border border-[#00FFB8] mt-8 py-4 rounded-2xl"
        >
          Proceed
        </button>
      </div>
    </div>
  );
}
