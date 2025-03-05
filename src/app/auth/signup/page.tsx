"use client";
import { AppContext } from "@/app/Context/AppContext";
import React, { useState, useContext, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import countryList from "react-select-country-list";

const Page = () => {
  const { setIsLoading, API_BASE_URL } = useContext(AppContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleCountryChange = (
    newValue: { label: string; value: string } | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      country: newValue ? newValue.label : "",
    }));
  };

  const countryOptions = countryList().getData();

  const isSignup = async () => {
    const {
      username,
      phone,
      email,
      password,
      confirmPassword,
      referralCode,
      country,
      termsAccepted,
    } = formData;

    if (!username || !phone || !email || !password || !country) {
      console.log(username);
      console.log(phone);
      console.log(email);
      console.log(password);
      console.log(country);
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
      const response = await fetch(`${API_BASE_URL}/register`, {
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
          phone,
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
      alert(
        `Signup failed: ${
          error instanceof Error ? error.message : "An unknown error occurred."
        }`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E0E0E] px-6 md:px-12 lg:px-20 py-10">
      <div className="w-full max-w-lg bg-[#0E0E0E] p-6 rounded-xl shadow-lg">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Sign Up
        </h2>

        <div className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-400 text-xs mb-1" // Changed from text-sm to text-xs
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/10 text-white text-sm outline-none py-2 hover:border-[#00FFB8] focus:border-[#00FFB8] transition-colors"
            />
          </div>

          {/* Phone Number with Country Code */}
          <div>
            <label
              htmlFor="phone"
              className="block text-gray-400 text-xs mb-1" // Changed from text-sm to text-xs
            >
              Phone Number
            </label>
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{
                backgroundColor: "transparent",
                width: "100%",
                fontSize: "14px",
                border: "none",
                outline: "none",
                boxShadow: "none",
                color: "white",
                paddingBottom: "8px",
                transition: "border-color 0.2s ease-in-out",
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
                transition: "border-color 0.2s ease-in-out",
              }}
              dropdownStyle={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #374151",
                color: "white",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              containerClass="w-full border-b border-white/10 hover:border-[#00FFB8] transition-colors"
              dropdownClass="custom-phone-dropdown bg-[#1A1A1A] text-white border-gray-700"
              inputClass="phone-input focus:border-b-[#00FFB8] hover:border-b-[#00FFB8]"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-400 text-xs mb-1" // Changed from text-sm to text-xs
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/10 text-white text-sm outline-none py-2 hover:border-[#00FFB8] focus:border-[#00FFB8] transition-colors"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-gray-400 text-xs mb-1" // Changed from text-sm to text-xs
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 text-white text-sm outline-none py-2 hover:border-[#00FFB8] focus:border-[#00FFB8] transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-400 text-xs mb-1" // Changed from text-sm to text-xs
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Re Enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/10 text-white text-sm outline-none py-2 hover:border-[#00FFB8] focus:border-[#00FFB8] transition-colors"
              />
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label
              htmlFor="referralCode"
              className="block text-gray-400 text-xs mb-1" // Changed from text-sm to text-xs
            >
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referralCode"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/10 text-white text-sm outline-none py-2 hover:border-[#00FFB8] focus:border-[#00FFB8] transition-colors"
            />
          </div>

          {/* Country Dropdown */}
          <div className="border-b border-white/10 hover:border-[#00FFB8] transition-colors">
            <label
              htmlFor="country"
              className="block text-gray-400 text-xs mb-1" // Changed from text-sm to text-xs
            >
              Country
            </label>
            <Select
              options={countryOptions}
              onChange={handleCountryChange}
              className="text-[#00FFB8]"
              classNamePrefix="react-select"
              styles={{
                control: (styles) => ({
                  ...styles,
                  backgroundColor: "transparent",
                  color: "white",
                  fontSize: "14px",
                  paddingBottom: "8px",
                  border: "none",
                  boxShadow: "none",
                  cursor: "pointer",
                }),
                menu: (styles) => ({
                  ...styles,
                  backgroundColor: "#1A1A1A",
                  color: "white",
                  border: "1px solid #374151",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }),
                option: (styles, { isFocused, isSelected }) => ({
                  ...styles,
                  backgroundColor: isSelected
                    ? "#00FFB8"
                    : isFocused
                    ? "rgba(0, 255, 184, 0.2)"
                    : "#1A1A1A",
                  color: isSelected ? "black" : "white",
                  cursor: "pointer",
                  transition: "background 0.3s ease-in-out",
                }),
                singleValue: (styles) => ({
                  ...styles,
                  color: "white",
                }),
              }}
            />
            <style jsx global>{`
              .react-select__menu::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="w-4 h-4 border border-white/10 rounded bg-transparent text-[#00FFB8] focus:ring-[#00FFB8] focus:ring-offset-0"
            />
            <label
              htmlFor="termsAccepted"
              className="text-gray-400 text-xs" // Changed from text-sm to text-xs
            >
              I accept the terms and conditions
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#00FFB8] hover:bg-[#00CC93] text-black py-3 rounded-lg text-sm font-medium transition duration-200"
            onClick={isSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
