"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string>("");
  const router = useRouter();

  const handleContinue = async () => {
    if (!email) return;

    await setToken("sadjhsdfdkjshk");
    router.push(`/auth/signup?email=${encodeURIComponent(email)}`);

    // try {
    //   const res = await fetch("/api/auth", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email }),
    //   });
    //   const data = await res.json();

    //   if (data.token) {
    //     setToken(data.token);
    //   } else {
    //     router.push(`/signup?email=${encodeURIComponent(email)}`);
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };

  return (
    <div>
      <Navbar />
      <h1 className="text-[27px] text-center py-20">Log In</h1>
      <div className="p-5">
        <div className="flex w-full  justify-between rounded-md overflow-hidden border border-[#464646]">
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
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
      </div>
      {/* Login Code Popup */}
      {token && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-6 rounded-xl shadow-lg w-[90%] max-w-sm border border-[#252525] relative">
            <div
              onClick={() => {
                setToken("");
              }}
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
            <div className="mt-3 flex w-full  justify-between rounded-md overflow-hidden border border-[#464646]">
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
