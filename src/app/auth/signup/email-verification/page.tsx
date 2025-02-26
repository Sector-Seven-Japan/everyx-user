"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AppContext } from "@/app/Context/AppContext";

const Verification: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {API_BASE_URL} = useContext(AppContext);

  // Fetch registered email from local storage
  useEffect(() => {
    const fetchRegisteredEmail = () => {
      try {
        const storedEmail = localStorage.getItem("registeredEmail");

        if (!storedEmail) {
          throw new Error("Email not found in local storage.");
        }

        setEmail(storedEmail);
      } catch (err) {
        console.error("Error fetching email:", err);
        setError("Error fetching registered email.");
      }
    };

    fetchRegisteredEmail();
  }, []);

  // Validate email only after email is fetched
  useEffect(() => {
    if (!email) return;

    const validateEmail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/register-validation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error(`Validation failed: ${response.statusText}`);
        }

        console.log("Email validated successfully.");
      } catch (err) {
        console.error("Email validation error:", err);
      }
    };

    validateEmail();
  }, [email]); // Runs only after email is set

  // Navigate to success page after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/auth/signup/success");
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const handleResendEmail = () => {
    alert("Resending email...");
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col max-w-[430px] mx-auto">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-white px-4">
        {/* Title */}
        <h1 className="text-2xl font-bold mt-16">Verify Email</h1>

        {/* Confirmation Message */}
        <p className="text-center text-sm mt-8">
          We sent a confirmation email to:
        </p>

        {/* Display Registered Email or Error */}
        {error ? (
          <p className="text-red-500 text-lg font-light mt-2">{error}</p>
        ) : (
          <p className="text-lg font-light mt-2">{email || "Loading..."}</p>
        )}

        {/* Instruction */}
        <div className="text-center text-sm leading-6 mt-10">
          <p>Check your inbox and click on the confirmation link to verify</p>
          <p>your account and be able to deposit to it.</p>
        </div>

        {/* Resend Email */}
        <button
          className="mt-8 underline text-sm text-gray-300 hover:text-white"
          onClick={handleResendEmail}
        >
          Resend Email
        </button>
      </div>
    </div>
  );
};

export default Verification;
