"use client";

import React, { useContext, useEffect, useState } from "react";
import CashWithdrawalCategories from "@/components/CashWithdrawalCategories";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppContext } from "@/app/Context/AppContext";

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

const History: React.FC = () => {
  const { authToken, API_BASE_URL } = useContext(AppContext);

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

  return (
    <>
      <Navbar/>
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-4 pb-5">
        <CurrentCashBalanceCard />

        <div className="my-10">
          <CashWithdrawalCategories />
        </div>

        <p className="text-[14px] text-center font-semibold">
          Deposit ＆ Withdrawal History:
        </p>

        <div className="mx-5 mt-10">
          {transactions.map((transaction) => (
            <>
              <div
                key={transaction.id}
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
      </div>
      <Footer />
    </>
  );
};

export default History;
