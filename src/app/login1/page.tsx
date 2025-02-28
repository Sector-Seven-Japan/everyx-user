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
import { signIn, useSession } from "next-auth/react";
import Loader from "@/components/Loader/Loader";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for managing loading
  const router = useRouter();
  const { setAuthToken, setIsLoggedIn } = useContext(AppContext);
  const { isConnected: wagmiConnected, address } = useAccount();
  const { data: session, status } = useSession();

  // Handle Google authentication success
  const handleAuthentication = async () => {
    if (session?.user?.email && status === "authenticated") {
      setIsLoading(true); // Show loader
      try {
        // Make API call to your backend to get the auth token
        const response = await fetch(`https://everyx.weseegpt.com/auth/v2/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        if (!response.ok) {
          throw new Error("Failed to authenticate with Google");
        }

        const data = await response.json();

        if (data?.token) {
          // Set auth token in local storage
          localStorage.setItem("authToken", data.token);
          // Update context
          setAuthToken(data.token);
          setIsLoggedIn(true);
          // Redirect to home page
          router.push("/home");
        } else {
          console.error("No token received from server");
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      // Once session is authenticated, handle Google login
      handleAuthentication();
    }
  }, [status]); // This will trigger whenever the session status changes

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
    if (wagmiConnected && address) {
      console.log("Connecting wallet:", address);
      setIsLoading(true); // Show loader
      try {
        const response = await fetch(`https://everyx.weseegpt.com/auth/v2/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: address }),
        });

        if (!response.ok) throw new Error("Failed to connect wallet");

        console.log("API Response Status:", response.status);
        const data = await response.json();
        if (data?.token) {
          // Set auth token in local storage
          localStorage.setItem("authToken", data.token);
          setAuthToken(data.token);
          setIsLoggedIn(true);
          router.push("/home");
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    }
  };

  // Modified Google login handler
  const handleGoogleLogin = () => {
    if (typeof window !== "undefined") {
      setIsLoading(true);
      signIn("google");
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-[27px] text-center py-20">Log In</h1>

      <div className="p-5">
        {/* Check if the session is not authenticated before showing the Google login button */}

        <button
          onClick={handleGoogleLogin}
          className="w-full py-[14px] font-semibold mb-5 bg-[#509BD5] rounded-md flex items-center justify-center gap-3"
        >
          <FaGoogle />
          <div>Continue with google</div>
        </button>

        <div className="flex justify-between items-center mb-5 text-[#343434] font-semibold">
          <div className="h-[1px] w-[43%] bg-[#626262]"></div>
          OR
          <div className="h-[1px] w-[43%] bg-[#626262]"></div>
        </div>

        {/* Email Login */}
        <div className="flex w-full justify-between rounded-md overflow-hidden border border-[#464646]">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Email"
            className="w-[70%] pl-4 py-[15px] bg-transparent outline-none font-semibold placeholder:font-semibold placeholder:text-[#434343]"
          />
          <button
            onClick={handleContinue}
            className="w-[30%] py-[15px] px-3 border-l border-[#343434] font-semibold"
          >
            Continue
          </button>
        </div>

        {/* Wallet Connection Buttons */}
        <div className="mt-5 w-full">
          <div className="flex flex-wrap items-center justify-between">
            <WalletButton.Custom wallet="rainbow">
              {({ ready, connect }) => (
                <Button
                  disabled={!ready}
                  onClick={async () => {
                    await connect();
                    handleConnect();
                  }}
                  className="px-7 py-7 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
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
                  className="px-7 py-7 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
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
                  className="px-7 py-7 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
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
                  className="px-7 py-7 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  <Image
                    src="/Images/walletConnect.png"
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
        <p className="text-center mt-36 font-semibold text-[#434343]">
          By signing up you agree to our&nbsp;<span onClick={() => {
            router.push(
              `/terms`
            );
          }} className="text-[#00FFB8] cursor-pointer">Terms of Service</span>{" "}
        </p>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader /> {/* Use the Loader component */}
        </div>
      )}

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
