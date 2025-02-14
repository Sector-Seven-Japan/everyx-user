"use client";

import React, { useContext, useEffect } from "react";

import CashWithdrawalCategories from "@/components/CashWithdrawalCategories";
import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppContext } from "@/app/Context/AppContext";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "deposit" | "withdrawal";
}

interface TransactionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type: Transaction["type"];
  variant?: "outline" | "default";
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
  const transactions: Transaction[] = [
    { id: "1", date: "Nov 2 2024 14:05", amount: 500.0, type: "deposit" },
    { id: "2", date: "Nov 2 2024 14:05", amount: 50.0, type: "withdrawal" },
    { id: "3", date: "Nov 2 2024 14:05", amount: 500.0, type: "deposit" },
    { id: "4", date: "Nov 2 2024 14:05", amount: 50.0, type: "withdrawal" },
    { id: "5", date: "Nov 2 2024 14:05", amount: 50.0, type: "withdrawal" },
    { id: "6", date: "Nov 2 2024 14:05", amount: 50.0, type: "withdrawal" },
    { id: "7", date: "Nov 2 2024 14:05", amount: 50.0, type: "withdrawal" },
  ];
  const { setIsLoading } = useContext(AppContext);

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <>
      <Navbar home="Portfolio" />
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-4 pb-5">
        <CurrentCashBalanceCard />

        <div className="my-10">
          <CashWithdrawalCategories />
        </div>

        <p className="text-[14px] text-center font-semibold">
          Deposit ＆Withdrawal History:
        </p>

        <div className="mx-5 mt-10">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between text-white mb-10"
            >
              <div className="space-y-1">
                <p className="text-sm text-gray-400">{transaction.date}</p>
                <p className="text-lg font-medium">
                  $ {transaction.amount.toFixed(2)}
                  <span className="text-sm text-gray-400 ml-1">(USDT)</span>
                </p>
              </div>
              <TransactionButton type={transaction.type} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default History;
