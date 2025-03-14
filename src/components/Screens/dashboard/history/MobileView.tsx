"use client";

import React, { useContext, useEffect, useState } from "react";

import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import { AppContext } from "@/app/Context/AppContext";
import CashWithdrawalCategoriesMobile from "@/components/CashWithdrawalCategoriesMobile";
// import DepositPopup from "@/components/DepositPopup";
// import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";

interface TransactionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type: "deposit" | "withdrawal";
  note: string;
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
  note,
  className = "",
  ...props
}) => {
  const baseClasses = "p-2 rounded w-20 text-[11px]";
  const variantClasses =
    type === "deposit"
      ? "border border-[#5DFF00] text-[#5DFF00]"
      : "bg-[#5DFF00] text-black";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {type === "deposit" ? "Deposit" : type.includes("order") ? "Order" : note.includes("COMPLETED!") ? "Deposit" : "Processing"}
    </button>
  );
};

const HistoryMobile: React.FC = () => {
  const { authToken, API_BASE_URL, setIsLoading } = useContext(AppContext);
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
        setTransactions(data.reverse());
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
    <>
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-4 pb-5">
        <CurrentCashBalanceCard />

        <div className="my-10">
          <CashWithdrawalCategoriesMobile />
        </div>

        <p className="text-[14px] text-center font-semibold">
          Deposit ＆ Withdrawal History:
        </p>

        <div className="mx-5 mt-10">
          {transactions.map((transaction, index) => (
            <>
              <div
                key={transaction.id + "" + index}
                className="flex items-center justify-between text-white my-5
                
                "
              >
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">
                    {new Date(transaction.datetime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p className="text-lg font-medium">
                    $ {Math.abs(transaction.amount).toFixed(2)}
                    <span className="text-sm text-gray-400 ml-1">(USDT)</span>
                  </p>
                </div>
                <TransactionButton type={transaction.transaction_type} note={transaction.note} />
              </div>
              <div>
                <svg
                  width="380"
                  height="9"
                  viewBox="0 0 380 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_633_3647)">
                    <line
                      x1="4"
                      y1="0.5"
                      x2="376"
                      y2="0.5"
                      stroke="url(#paint0_linear_633_3647)"
                      stroke-opacity="0.54"
                      stroke-dasharray="2 2"
                      shape-rendering="crispEdges"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_633_3647"
                      x="0"
                      y="0"
                      width="380"
                      height="9"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
                        result="effect1_dropShadow_633_3647"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_633_3647"
                        result="shape"
                      />
                    </filter>
                    <linearGradient
                      id="paint0_linear_633_3647"
                      x1="4"
                      y1="1.5"
                      x2="376"
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
            </>
          ))}
        </div>
      </div>
      {/* <DepositPopup/> */}
    </>
  );
};

export default HistoryMobile;
