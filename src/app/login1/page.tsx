"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useContext, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { AppContext } from "../Context/AppContext";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const router = useRouter();
  const { setAuthToken, setIsLoggedIn, setIsLoading } = useContext(AppContext);
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

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://everyx.weseegpt.com/auth/v2/user/exists/${email}`
      );

      if (!response.ok) throw new Error("Failed to check user existence");

      const data = await response.json();

      if (!data) {
        setPopupContent("new user");
        setIsLoading(false)
      } else {
        const res = await fetch(
          `https://everyx.weseegpt.com/auth/v2/login/${email}`
        );
        if (!res.ok) throw new Error("Failed to log in user");

        setPopupContent("existing user");
      }

      setShowPopup(true);
      setIsLoading(false)
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
      <div className="flex justify-center items-center mt-40">
        <Image
          src="/Images/logo.png"
          width={40}
          height={40}
          alt="EveryX Icon"
        />
      </div>

      <h1 className="text-[27px] text-center pt-6">Welcome to EveryX</h1>

      <div className="px-12 flex items-center flex-col mt-36">
        {/* Check if the session is not authenticated before showing the Google login button */}

        <button
          onClick={handleGoogleLogin}
          className="py-[14px] font-semibold mb-5 bg-[rgba(255,255,255,0.025)] rounded-full flex items-center justify-between gap-3 px-5"
        >
          <FcGoogle size={25} />
          <div>Continue with Google</div>
        </button>

        <div className="flex justify-between items-center mb-5 text-[#fff] font-light">
          or
        </div>

        {/* Email Login */}
        <div className="flex w-full justify-between rounded-lg overflow-hidden border border-gray-600">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter Email"
            className="w-[70%] text-sm pl-4 py-[14px] bg-transparent outline-none"
          />
          <button
            onClick={handleContinue}
            className="w-[30%] py-[14px] text-xs px-3 border-l border-gray-600 font-normal"
          >
            Continue
          </button>
        </div>

        {/* Wallet Connection Buttons */}

        <div className="mt-7 w-full">
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
                    className="py-[14px] font-semibold mb-5 bg-[#00FFB8] rounded-md flex items-center  gap-3 px-5 w-full"
                  >
                    <Image
                      src="/Images/walletIcon.png"
                      width={20}
                      height={20}
                      alt="walletIcon"
                    />
                    <div className="text-black text-center pl-12">
                      Connect Wallet
                    </div>
                  </button>
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        <p className="text-center mt-36 font-semibold text-[#434343]">
          Terms Privacy
        </p>
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
            {popupContent === "new user" && (
              <button
                onClick={() => {
                  setIsLoading(true);
                  router.push(
                    `/auth/signup?email=${encodeURIComponent(email)}`
                  );
                }}
                className="px-3 py-2 mt-4 border border-[#00FFBB] rounded-md text-sm"
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
