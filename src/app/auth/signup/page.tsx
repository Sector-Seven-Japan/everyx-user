"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    country: "",
    termsAccepted: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const isSignup = async () => {
    const { username, phone, email, password, confirmPassword, referralCode, country, termsAccepted } = formData;

    if (!username || !phone || !email || !password || !country) {
      alert("Please fill all the required fields correctly.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://test-api.everyx.io/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          email,
          display_name: username,
          password,
          country,
          phone: `+91${phone}`,
          referral_code: referralCode,
        }).toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful:", data);
      router.push("/auth/signup/success"); // Redirecting to success page
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof Error) {
        alert(`Signup failed: ${error.message}`);
      } else {
        alert("Signup failed: An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-screen bg-[#0E0E0E] flex flex-col w-full mx-auto mb-5">
        <div className="text-center text-white text-2xl font-bold mt-6">Sign Up</div>
        <div className="flex flex-col px-6 text-white space-y-6 mt-6">
          {(Object.keys(formData) as (keyof typeof formData)[]).map((key) => (
            key !== "termsAccepted" && (
              <div key={key} className="mb-4">
                <label htmlFor={key} className="block text-opacity-70 text-sm mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={key.includes("password") ? "password" : "text"}
                  id={key}
                  placeholder={`Enter your ${key}`}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none"
                />
              </div>
            )
          ))}
        </div>

        <div className="mt-6 px-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-700 rounded bg-transparent"
            />
            <label htmlFor="termsAccepted" className="text-opacity-50 text-sm">
              I have read and agree to these terms
            </label>
          </div>
        </div>

        <div className="mt-8 px-6">
          <button
            type="submit"
            className="w-full bg-[#707070] bg-opacity-10 text-white py-3 rounded-lg text-sm"
            onClick={isSignup}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
