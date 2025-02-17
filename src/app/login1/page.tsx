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
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const router = useRouter();
  const { API_BASE_URL, setAuthToken, setIsLoggedIn } = useContext(AppContext);
  const { isConnected: wagmiConnected, address } = useAccount();

  useEffect(() => {
    if (wagmiConnected && address) {
      handleConnect();
    }
  }, [wagmiConnected, address]);

  const handleContinue = async () => {
    if (!email) return;

    try {
      const response = await fetch(
        `https://everyx.weseegpt.com/auth/v2/user/exists/${email}`
      );

      if (!response.ok) throw new Error("Failed to check user existence");

      const data = await response.json();

      if (!data) {
        setPopupContent("new user");
      } else {
        const res = await fetch(
          `https://everyx.weseegpt.com/auth/v2/login/${email}`
        );
        if (!res.ok) throw new Error("Failed to log in user");

        setPopupContent("existing user");
      }

      setShowPopup(true);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleConnect = async () => {
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is undefined. Check AppContext.");
      return;
    }

    if (wagmiConnected && address) {
      console.log("Connecting wallet:", address);
      try {
        const response = await fetch(`https://everyx.weseegpt.com/auth/v2/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: address }),
        });

        if (!response.ok) throw new Error("Failed to connect wallet");

        console.log("API Response Status:", response.status);
        const data = await response.json();
        if (data) {
          document.cookie = `authToken=${data?.token}`;
          setAuthToken(data?.token);
          setIsLoggedIn(true);
          router.push("/home");
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-[27px] text-center py-20">Log In</h1>

      <div className="p-5">
        {/* Google Login Button */}
        <button className="w-full py-3 mb-5 bg-[#9c95ff] rounded-md flex items-center justify-center gap-3">
          <FaGoogle />
          Continue with Google
        </button>

        <div className="flex justify-between items-center mb-5">
          <div className="h-[1px] w-[45%] bg-[#626262]"></div>
          OR
          <div className="h-[1px] w-[45%] bg-[#626262]"></div>
        </div>

        {/* Email Login */}
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

        {/* Wallet Connection Buttons */}
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

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-6 rounded-xl shadow-lg w-[90%] max-w-sm border border-[#252525] relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-3 top-3 text-white"
            >
              ✖
            </button>
            <h2 className="font-bold">
              {popupContent === "new user"
                ? "Create Your Account"
                : "Check Your Email"}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {popupContent === "new user"
                ? "It looks like you're new here! Create an account to get started."
                : `We've sent a confirmation link to ${email}. Please check your inbox.`}
            </p>
            <button
              onClick={() => {
                router.push(`/auth/signup?email=${encodeURIComponent(email)}`);
              }}
              className="px-3 py-2 mt-4 border border-[#00FFBB] rounded-md text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
