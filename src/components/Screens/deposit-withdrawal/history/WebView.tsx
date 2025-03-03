"use client";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/app/Context/AppContext";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import HeadingSlider from "@/components/HeadingSlider";

interface TransactionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type: "deposit" | "withdrawal";
  variant?: "outline" | "default";
}

interface WalletResponse {
  id: number;
  user_id: string;
  name: string;
  currency: string;
  balance: number;
  withdrawable: number;
  last_transaction_at: number;
  created_at: number;
  updated_at: number;
}

interface TransactionsResponse {
  id: number;
  datetime: string;
  wallet_id: number;
  actor: string;
  user_id: string;
  admin_id: string;
  amount: number;
  balance: number;
  note: string;
  transaction_type: "deposit" | "withdrawal"; // Ensures correct type
  wager_id: number;
}

const TransactionButton: React.FC<TransactionButtonProps> = ({
  type,
  className = "",
  ...props
}) => {
  const baseClasses = "px-3 py-2 rounded-md w-[6.5vw] text-[0.9vw]";
  const variantClasses =
    type === "deposit"
      ? " border-[#5DFF00] text-[#5DFF00] border-[1px]"
      : "bg-[#5DFF00] text-black";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {type === "deposit" ? "Deposit" : "Withdrawal"}
    </button>
  );
};

const HistoryWeb: React.FC = () => {
  const { authToken, API_BASE_URL, setIsLoading, filter, setFilter } =
    useContext(AppContext);

  const [wallet, setWallet] = useState<WalletResponse[]>([]);
  const [transactions, setTransactions] = useState<TransactionsResponse[]>([]);

  const getWalletData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (error) {
      console.error("Error fetching the wallet data:", error);
    }
  };

  const getTransactionData = async (walletId: number) => {
    if (!walletId) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/wallets/${walletId}/transactions?pagination=true&limit=1000&page=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching the transaction data:", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getWalletData();
    }
  }, [authToken]);

  useEffect(() => {
    if (wallet.length > 0) {
      getTransactionData(wallet[0].id);
    }
  }, [wallet, authToken]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="bg-[#0E0E0E] w-full min-h-screen text-white relative">
      <div className="px-[20vw]">
        <HeadingSlider filter={filter} setFilter={setFilter} />
        <div className="flex justify-center gap-5 pt-[4.65%] ">
          <div className="flex-1">
            <p className="text-[1.6vw] font-regular tracking-[0.3vw] mb-8">
              Deposit & Withdrawal History:
            </p>

            {transactions.length === 0 ? (
              <p className="  mt-10 text-[1vw] font-regular tracking-[0.2vw]">
                No transactions available.
              </p>
            ) : (
              transactions.map((transaction, index) => (
                <div key={transaction.id + "" + index}>
                  <div className="flex items-center justify-between text-white my-5 w-full">
                    <p className="text-[1vw] text-white text-opacity-20">
                      {new Date(transaction.datetime).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>

                    <div>
                      <p className="text-[1vw] font-medium text-left ">
                        $ {Math.abs(transaction.amount).toFixed(2)}
                        <span className="text-[1vw] ml-1">(USDT)</span>
                      </p>
                    </div>

                    <TransactionButton type={transaction.transaction_type} />
                  </div>
                  <div>
                    <svg
                      width="100%"
                      height="9"
                      viewBox="0 0 793 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g filter="url(#filter0_d_658_36764)">
                        <line
                          x1="4"
                          y1="0.5"
                          x2="789"
                          y2="0.5"
                          stroke="url(#paint0_linear_658_36764)"
                          stroke-opacity="0.54"
                          stroke-dasharray="2 2"
                          shape-rendering="crispEdges"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_658_36764"
                          x="0"
                          y="0"
                          width="793"
                          height="9"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="4" />
                          <feGaussianBlur stdDeviation="2" />
                          <feComposite in2="hardAlpha" operator="out" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_658_36764"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_658_36764"
                            result="shape"
                          />
                        </filter>
                        <linearGradient
                          id="paint0_linear_658_36764"
                          x1="4"
                          y1="1.5"
                          x2="789"
                          y2="1.5"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#0E0E0E" />
                          <stop offset="0.495" stop-color="#C9C9C9" />
                          <stop offset="1" stop-color="#0E0E0E" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="">
            <div className="sticky top-20">
              <CurrentCashBalanceCardWebview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryWeb;
