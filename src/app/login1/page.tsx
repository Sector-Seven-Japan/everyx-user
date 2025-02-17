"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/Button";
import { useAccount } from "wagmi";
import { AppContext } from "../Context/AppContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  const { API_BASE_URL } = useContext(AppContext);
  const { isConnected: wagmiConnected, address } = useAccount();

  useEffect(() => {
    if (wagmiConnected && address) {
      handleConnect();
    }
  }, [wagmiConnected, address]);

  const handleContinue = async () => {
    if (!email) return;
    await setToken("sadjhsdfdkjshk");
    router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
  };

  const handleConnect = async () => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is undefined. Check AppContext.");
      return;
    }

    if (wagmiConnected && address) {
      console.log("Connecting wallet:", address);
      try {
        const response = await fetch(`http://everyx.weseegpt.com/auth/v2/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: address }),
        });

        console.log("API Response Status:", response.status);
        const data = await response.json();
        console.log("API Response Data:", data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-[27px] text-center py-20">Log In</h1>
      <div className="p-5">
        <button className="w-full py-3 mb-5 bg-[#9c95ff] rounded-md flex items-center justify-center gap-3">
          <FaGoogle />
          Continue with Google
        </button>
        <div className="flex justify-between items-center mb-5">
          <div className="h-[1px] w-[45%] bg-[#626262]"></div>
          OR
          <div className="h-[1px] w-[45%] bg-[#626262]"></div>
        </div>
        <div className="flex w-full justify-between rounded-md overflow-hidden border border-[#464646]">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Email"
            className="w-[70%] pl-4 py-[15px] bg-transparent outline-none font-semibold placeholder:font-semibold"
          />
          <button
            onClick={handleContinue}
            className="w-[30%] py-[15px] px-3 border-l border-[#343434] font-semibold"
          >
            Continue
          </button>
        </div>

        <div className="mt-10 w-full">
          <div className="flex flex-wrap justify-between items-center">
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
                    src="/images/rainbow.svg"
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
                    src="/images/metamask.svg"
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
                    src="/images/coinbase.svg"
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
                    src="/images/walletConnect.png"
                    alt="WalletConnect"
                    width={25}
                    height={25}
                    className="rounded-lg"
                  />
                </Button>
              )}
            </WalletButton.Custom>
          </div>
        </div>
      </div>

      {token && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-6 rounded-xl shadow-lg w-[90%] max-w-sm border border-[#252525] relative">
            <div
              onClick={() => setToken("")}
              className="absolute right-3 top-3"
            >
              <Image
                src={"/Images/cross.svg"}
                alt="cross_icon"
                width={12}
                height={12}
              />
            </div>
            <h2 className="font-bold">Enter Login Code</h2>
            <p className="mt-2 text-sm text-gray-600">
              <p>We&apos;ve sent a confirmation code to your email.</p>
            </p>
            <div className="mt-3 flex w-full justify-between rounded-md overflow-hidden border border-[#464646]">
              <input
                type="email"
                placeholder="OTP"
                className="pl-4 py-2 bg-transparent outline-none font-semibold placeholder:font-semibold"
              />
              <button className="w-[30%] py-2 px-3 border-l border-[#343434] font-semibold text-[#00FFBB] text-sm">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
