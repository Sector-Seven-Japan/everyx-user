"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useContext, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { AppContext } from "../../../app/Context/AppContext";
import { signIn, useSession } from "next-auth/react";
import Loader from "@/components/Loader/Loader";

export default function LoginPage() {
  // ... existing state and hooks from MobileView ...
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for managing loading
  const router = useRouter();
  const { setAuthToken, setIsLoggedIn, API_BASE_URL } = useContext(AppContext);
  const { isConnected: wagmiConnected, address } = useAccount();
  const { data: session, status } = useSession();

  // Handle Google authentication success
  const handleAuthentication = async () => {
    if (session?.user?.email && status === "authenticated") {
      setIsLoading(true); // Show loader
      try {
        // Make API call to your backend to get the auth token
        const response = await fetch(`${API_BASE_URL}/auth/v2/`, {
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
          router.push("/trade");
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

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/v2/user/exists/${email}`
      );

      if (!response.ok) throw new Error("Failed to check user existence");

      const data = await response.json();

      if (!data) {
        setPopupContent("new user");
        setIsLoading(false);
      } else {
        const res = await fetch(`${API_BASE_URL}/auth/v2/login/${email}`);
        if (!res.ok) throw new Error("Failed to log in user");

        setPopupContent("existing user");
      }
      setIsLoading(false);
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
        const response = await fetch(`${API_BASE_URL}/auth/v2/`, {
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
          router.push("/trade");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e0e0e]">
      <div className="w-full max-w-md px-8 py-12">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-12">
          <Image
            src="/Images/logo.png"
            width={60}
            height={60}
            alt="EveryX Icon"
            className="mb-6"
          />
          <h1 className="text-3xl font-semibold text-center">
            Welcome to EveryX
          </h1>
        </div>

        {/* Login Options Container */}
        <div className="space-y-6">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 font-semibold bg-[rgba(255,255,255,0.025)] hover:bg-[rgba(255,255,255,0.05)] 
            rounded-full flex items-center justify-center gap-3 px-6 transition-all duration-300"
          >
            <FcGoogle size={25} />
            <div>Continue with Google</div>
          </button>

          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] bg-gray-600 flex-1"></div>
            <span className="text-gray-400">or</span>
            <div className="h-[1px] bg-gray-600 flex-1"></div>
          </div>

          {/* Email Input */}
          <div className="flex w-full justify-between rounded-lg overflow-hidden border border-gray-600">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter Email"
              className="w-[70%] pl-4 py-4 bg-transparent outline-none font-semibold 
              placeholder:font-semibold placeholder:text-[#434343]"
            />
            <button
              onClick={handleContinue}
              className="w-[30%] py-4 px-3 border-l border-gray-600 font-normal 
              hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300"
            >
              Continue
            </button>
          </div>

          {/* Wallet Connection */}
          <div className="w-full">
            <ConnectButton.Custom>
              {({ openConnectModal, mounted }) => {
                const ready = mounted;
                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 90,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    <button
                      onClick={openConnectModal}
                      className="w-full py-4 font-semibold bg-[#00FFB8] hover:bg-[#00E6A6] 
                      rounded-md flex items-center justify-center gap-3 px-6 transition-all duration-300"
                    >
                      <Image
                        src="/Images/walletIcon.png"
                        width={20}
                        height={20}
                        alt="walletIcon"
                      />
                      <div className="text-black">Connect Wallet</div>
                    </button>
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>

        {/* Terms and Privacy */}
        <p className="text-center mt-12 font-semibold text-[#434343] hover:text-[#666666] cursor-pointer">
          Terms Privacy
        </p>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-black p-8 rounded-xl shadow-lg w-[90%] max-w-md border border-[#252525] relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 text-white hover:text-gray-300 transition-colors"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              {popupContent === "new user"
                ? "Create Your Account"
                : "Check Your Email"}
            </h2>
            <p className="text-gray-400">
              {popupContent === "new user"
                ? "It looks like you're new here! Create an account to get started."
                : `We've sent a confirmation link to ${email}. Please check your inbox.`}
            </p>
            {popupContent === "new user" && (
              <button
                onClick={() => {
                  router.push(
                    `/auth/signup?email=${encodeURIComponent(email)}`
                  );
                }}
                className="px-6 py-3 mt-6 border border-[#00FFBB] rounded-md text-sm 
              hover:bg-[#00FFBB] hover:text-black transition-all duration-300"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
