"use client";

import { useContext, useState } from "react";
import { WalletButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

import { Button } from "@/components/Button";
import { useAccount, useDisconnect } from "wagmi";
import { AppContext } from "../Context/AppContext";

export default function LoginPage() {
  const { API_BASE_URL } = useContext(AppContext);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const { isConnected: wagmiConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  console.log(walletAddress);
  const handleConnect = async () => {
    if (address) {
      setIsConnected(true);
      setWalletAddress(address);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/v2/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: address }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error occured in fetching the user details", error);
      }
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    disconnect(); // This will disconnect the wallet using wagmi
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!isConnected && !wagmiConnected ? (
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <WalletButton.Custom wallet="rainbow">
            {({ ready, connect }) => (
              <Button
                disabled={!ready}
                onClick={async () => {
                  await connect();
                  handleConnect();
                }}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <Image
                  src="/Images/rainbow.svg"
                  alt="Rainbow Wallet"
                  width={25}
                  height={25}
                  className="rounded-lg"
                />
              </Button>
            )}
          </WalletButton.Custom>
          <WalletButton.Custom wallet="metamask">
            {({ ready, connect }) => (
              <Button
                disabled={!ready}
                onClick={async () => {
                  await connect();
                  handleConnect();
                }}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <Image
                  src="/Images/metamask.svg"
                  alt="MetaMask Wallet"
                  width={25}
                  height={25}
                  className="rounded-lg"
                />
              </Button>
            )}
          </WalletButton.Custom>
          <WalletButton.Custom wallet="coinbase">
            {({ ready, connect }) => (
              <Button
                disabled={!ready}
                onClick={async () => {
                  await connect();
                  handleConnect();
                }}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <Image
                  src="/Images/coinbase.svg"
                  alt="Coinbase Wallet"
                  width={25}
                  height={25}
                  className="rounded-lg"
                />
              </Button>
            )}
          </WalletButton.Custom>
          <WalletButton.Custom wallet="walletConnect">
            {({ ready, connect }) => (
              <Button
                disabled={!ready}
                onClick={async () => {
                  await connect();
                  handleConnect();
                }}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <Image
                  src="/Images/walletConnectLogo.png"
                  alt="WalletConnect"
                  width={25}
                  height={25}
                  className="rounded-lg"
                />
              </Button>
            )}
          </WalletButton.Custom>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-lg">Connected Wallet Address:</p>
          <Button onClick={handleDisconnect} variant="destructive">
            Disconnect
          </Button>
        </div>
      )}
    </div>
  );
}
