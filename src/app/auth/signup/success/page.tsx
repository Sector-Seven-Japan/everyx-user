"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../../Context/AppContext";

export default function SuccessPage() {
  const router = useRouter();
  const { setAuthToken, setIsLoggedIn } = useContext(AppContext);

  const handleNextClick = async () => {
    try {
      const response = await axios.post("https://test-api.everyx.io/login", {
        email: "user@example.com",  // Replace with actual email input
        password: "password123",    // Replace with actual password input
      });

      if (response.status === 200) {
        const token = response.data.token; // Assuming API returns { token: "..." }
        setAuthToken(token);
        setIsLoggedIn(true);
        router.push("/home"); // Redirect to home page after successful login
      } else {
        console.error("Login failed: Invalid response");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-5 flex flex-col justify-between h-[680px]">
        <h1 className="text-center text-[27px] mt-16">Verify Email</h1>
        <div className="flex flex-col items-center justify-center text-center gap-10">
          <Image src="/Icons/SuccessIcon.png" alt="Success" width={70} height={70} />
          <h2 className="text-[22px]">Mail Verification Successful!</h2>
          <p className="text-[#707070] text-[13px] px-12">Email already verified.</p>
        </div>
        <button
          className="w-full py-4 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[#2DC198]"
          onClick={handleNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
}
