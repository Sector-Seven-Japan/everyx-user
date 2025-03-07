"use client";

import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { abi } from "../../utils/ABI";
import type { Address } from "viem";

interface DepositContextType {
  writeContract: ReturnType<typeof useWriteContract>["writeContract"];
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  changeToBigInt: (value: string) => string;
  address: Address | undefined;
  contractData: {
    address: Address;
    abi: typeof abi;
  };
  amount: string | null;
  setAmount: (data: string) => void;
}

const initialState: DepositContextType = {
  writeContract: () => undefined,
  isError: false,
  isSuccess: false,
  isPending: false,
  changeToBigInt: () => "0",
  address: undefined,
  contractData: {
    address: `0x953E8a78Ac9fe3d1c0746a9EcB1B30687f87EE13` as Address,
    abi,
  },
  amount: null,
  setAmount: () => {},
};

export const DepositContext = createContext<DepositContextType>(initialState);

export const DepositProvider = ({ children }: { children: ReactNode }) => {
  const { writeContract, isError, isSuccess, data, isPending } =
    useWriteContract();
  const { address } = useAccount();
  const [amount, setAmount] = useState<string | null>(null);
  const router = useRouter();

  const contractData = {
    address: `0x953E8a78Ac9fe3d1c0746a9EcB1B30687f87EE13` as Address,
    abi,
  };

  const changeToBigInt = (value: string) => {
    try {
      return (parseFloat(value) * 10 ** 18).toString();
    } catch (error) {
      console.error("Error converting value to BigInt format:", error);
      return "0";
    }
  };

  const contextValue: DepositContextType = {
    writeContract,
    isError,
    isSuccess,
    isPending,
    changeToBigInt,
    address,
    contractData,
    amount,
    setAmount,
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "Context State Update - isError:",
        isError,
        "isSuccess:",
        isSuccess,
        "amount:",
        amount,
        "address:",
        address,
        "data:",
        data
      );
    }
  }, [isError, isSuccess, address, data, amount]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isSuccess) {
        router.push(`/dashboard/deposits/success?amount=${amount}`);
      } else if (isError) {
        router.push(`/dashboard/deposits/failed?amount=${amount}`);
      } else if (isPending) {
        router.push(`/dashboard/processing-deposit?amount=${amount}`);
      }
    }
  }, [isSuccess, isError, isPending, amount, router, data]);

  return (
    <DepositContext.Provider value={contextValue}>
      {children}
    </DepositContext.Provider>
  );
};
