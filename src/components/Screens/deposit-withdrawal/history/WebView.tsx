"use client";

import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "@/app/Context/AppContext";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";

// import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";

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
      {type === "deposit" ? "Deposit" : "Withdrawal"}
    </button>
  );
};

const HistoryWeb: React.FC = () => {
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
    <div className="bg-[#0E0E0E] w-full min-h-screen text-white lg:px-40 pt-4 pb-5 md:px-10 sm:px-10 mt-20">
      <div className="grid grid-cols-10 gap-10 mx-5 mt-10">
        <div className="lg:col-span-6 md:col-span-6 sm:col-span-6">
          <p className="text-[24px] font-semibold">
            Deposit ＆ Withdrawal History :
          </p>

          {transactions.map((transaction, index) => (
            <>
              <div
                key={transaction.id + "" + index}
                className="flex items-center justify-between text-white my-5
                
                "
              >
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
                <div className="w-52">
                  <p className="text-lg font-medium text-left ">
                    $ {Math.abs(transaction.amount).toFixed(2)}
                    <span className="text-sm text-gray-400 ml-1">(USDT)</span>
                  </p>
                </div>

                <TransactionButton type={transaction.transaction_type} />
              </div>
              <div
                className="border-t-2 border-dashed border-gray-400 w-full"
                style={{
                  maskImage:
                    "linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                  WebkitMaskImage:
                    "linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.4))",
                }}
              ></div>
            </>
          ))}
        </div>
        <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 flex justify-end">
          <CurrentCashBalanceCardWebview />
        </div>
      </div>
    </div>
  );
};

export default HistoryWeb;
