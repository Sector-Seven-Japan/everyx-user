"use client"

import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useAccount, useWriteContract } from 'wagmi';
import { abi } from '../../utils/ABI';

interface DepositContextType {
    writeContract: (args: any) => void;
    isError: boolean;
    isSuccess: boolean;
    changeToBigInt: (value: string) => string;
    address: string | undefined;
    contractData: {
        address: string;
        abi: any[];
    };
    amount: string | null;
    setAmount: (data: string) => void;
}

const initialState: DepositContextType = {
    writeContract: () => {},
    isError: false,
    isSuccess: false,
    changeToBigInt: (value: string) => "0",
    address: undefined,
    contractData: {
        address: `0x953E8a78Ac9fe3d1c0746a9EcB1B30687f87EE13`,
        abi,
    },
    amount: null,
    setAmount: () => {}
};

export const DepositContext = createContext<DepositContextType>(initialState);

export const DepositProvider = ({ children }: { children: ReactNode }) => {
    const { writeContract, isError, isSuccess, data, isPending } = useWriteContract();
    const { address } = useAccount();
    const [amount, setAmount] = useState<string | null>(null);
    const router = useRouter();

    const contractData = {
        address: `0x953E8a78Ac9fe3d1c0746a9EcB1B30687f87EE13`,
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
        changeToBigInt,
        address,
        contractData,
        amount,
        setAmount
    };

    useEffect(() => {
        console.log(isError, isSuccess, address, data);
    }, [isError, isSuccess, address, data]);

    useEffect(() => {
        if (isSuccess) {
            // TODO: check if we got hash/data
            // TOOD: trigger the API with user token
            // TODO: in reponse you will get 2 things -> 404 (error) 200(success)

        }
        else if (isError) {
            router.push(
                `/deposit-withdrawal/deposits/failed?amount=${amount}`
            );
        }
        else if (isPending) {
            router.push(`/deposit-withdrawal/processing-deposit`);
        }
    }, [isSuccess, isError, isPending, amount, router]);

    return (
        <DepositContext.Provider value={contextValue}>
            {children}
        </DepositContext.Provider>
    );
};