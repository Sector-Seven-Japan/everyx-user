"use client";

import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { tPOLY, tBNB } from "../../utils/ABI";
import type { Address } from "viem";
import { AppContext } from "./AppContext";

interface AbiItem {
  constant?: boolean;
  inputs?: Array<{ name: string; type: string }>;
  name?: string;
  outputs?: Array<{ name: string; type: string }>;
  payable?: boolean;
  stateMutability?: string;
  type: string;
}

interface DepositContextType {
  writeContract: ReturnType<typeof useWriteContract>["writeContract"];
  isError: boolean;
  isSuccess: boolean;
  isPending: boolean;
  changeToBigInt: (value: string) => string;
  address: Address | undefined;
  contractData: {
    [key: string]: {
      address: Address;
      abi: AbiItem[];
    }
  };
  amount: string | null;
  selectedNetwork: string,
  setSelectedNetwork: (data: string) => void;
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
    "tPOLY": {
      address: `0x953E8a78Ac9fe3d1c0746a9EcB1B30687f87EE13` as Address,
      abi: tPOLY,
    },
    "tBNB": {
      address: `0x9B7011DC67958472BABD619D6C61EeBb51c3edd9` as Address,
      abi: tBNB,
    }
  },
  amount: null,
  selectedNetwork: "",
  setSelectedNetwork: () => { },
  setAmount: () => { },
};

export const DepositContext = createContext<DepositContextType>(initialState);

export const DepositProvider = ({ children }: { children: ReactNode }) => {
  const { writeContract, isError, isSuccess, data, isPending } =
    useWriteContract();
  const { address } = useAccount();
  const [amount, setAmount] = useState<string | "">("");
  const [selectedNetwork, setSelectedNetwork] = useState<string | "">("tPOLY");
  const router = useRouter();

  const { requestDeposit } = useContext(AppContext);

  const contractData = {
    "tPOLY": {
      address: `0x953E8a78Ac9fe3d1c0746a9EcB1B30687f87EE13` as Address,
      abi: tPOLY,
    },
    "tBNB": {
      address: `0x9B7011DC67958472BABD619D6C61EeBb51c3edd9` as Address,
      abi: tBNB,
    }
  }

  const changeToBigInt = (value: string) => {
    try {
      return (parseFloat(value) * 10 ** 18).toString();
    } catch (error) {
      console.error("Error converting value to BigInt format:", error);
      return "0";
    }
  };

  const contextValue: DepositContextType = {
    selectedNetwork,
    setSelectedNetwork,
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

  useEffect(() => {
    if (data) {
      (async () => {
        await requestDeposit(data, amount, selectedNetwork)
      })()
    }
  }, [data])

  return (
    <DepositContext.Provider value={contextValue}>
      {children}
    </DepositContext.Provider>
  );
};