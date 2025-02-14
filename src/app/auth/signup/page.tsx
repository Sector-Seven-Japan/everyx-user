"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const Page = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const isSignup = async () => {
    const { username, phone, email, password, confirmPassword, referralCode, country, termsAccepted } = formData;

    // Validation
    if (!username || !phone || !email || !password || !country) {
      alert("Please fill all the fields correctly.");
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
          phone: `+91${phone}`, // Ensuring country code is included
          referral_code: referralCode,
        }).toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log("Signup successful:", data);
      window.location.href = "/auth/signup/email-verification";
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof Error) {
        alert(`Signup failed: ${error.message}`);
      } else {
        alert("Signup failed: An unknown error occurred.");
      }
    }
  };

  return (
    <>
      <Navbar home="Signup" />
      <div className="h-screen bg-[#0E0E0E] flex flex-col w-full mx-auto mb-5">
        <div className="text-center text-white text-2xl font-bold mt-6">Sign Up</div>
        <div className="flex flex-col px-6 text-white space-y-6 mt-6">
          
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-opacity-70 text-sm mb-1">Username</label>
            <input type="text" id="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none" />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-opacity-70 text-sm mb-1">Phone Number</label>
            <div className="flex items-center gap-2">
              <span className="text-opacity-35 text-sm">+91</span>
              <input type="tel" id="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleChange} className="flex-1 bg-transparent border-b border-gray-700 text-white text-sm outline-none" />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-opacity-70 text-sm mb-1">Email</label>
            <input type="email" id="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none" />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-opacity-70 text-sm mb-1">Password</label>
            <input type="password" id="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none" />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-opacity-70 text-sm mb-1">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none" />
          </div>

          {/* Referral Code */}
          <div className="mb-4">
            <label htmlFor="referralCode" className="block text-opacity-70 text-sm mb-1">Referral Code (Optional)</label>
            <input type="text" id="referralCode" placeholder="Enter referral code" value={formData.referralCode} onChange={handleChange} className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none" />
          </div>

          {/* Country */}
          <div className="mb-4">
            <label htmlFor="country" className="block text-opacity-70 text-sm mb-1">Country</label>
            <input type="text" id="country" placeholder="Enter your country" value={formData.country} onChange={handleChange} className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none" />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-6 px-6">
          <div className="flex items-start space-x-3">
            <input type="checkbox" id="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="w-4 h-4 border border-gray-700 rounded bg-transparent" />
            <label htmlFor="termsAccepted" className="text-opacity-50 text-sm">I have read and agree to these terms</label>
          </div>
        </div>

        {/* Signup Button */}
        <div className="mt-8 px-6">
          <button type="submit" className="w-full bg-[#707070] bg-opacity-10 text-white py-3 rounded-lg text-sm" onClick={isSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
