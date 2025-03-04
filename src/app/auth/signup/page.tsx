"use client";
import { AppContext } from "@/app/Context/AppContext";
import React, { useState, useContext, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Phone input styles
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
        `Signup failed: ${error instanceof Error ? error.message : "An unknown error occurred."
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
              className="block text-gray-400 text-sm mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none py-2"
            />
          </div>

          {/* Phone Number with Country Code */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">
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
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
              }}
              dropdownStyle={{
                backgroundColor: "black",
                border: "1px solid gray",
              }}
              containerClass="w-full"
              dropdownClass="bg-black text-white border-gray-600"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none py-2"
            />
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-gray-400 text-sm mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none py-2"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-400 text-sm mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none py-2"
              />
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label
              htmlFor="referralCode"
              className="block text-gray-400 text-sm mb-1"
            >
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referralCode"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-gray-700 text-white text-sm outline-none py-2"
            />
          </div>

          {/* Country Dropdown */}
          <div>
            <label className="block text-grey-400 text-sm mb-1">Country</label>
            <Select
              options={countryOptions}
              onChange={handleCountryChange}
              className="text-blue"
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
                  backgroundColor: "black",
                  color: "white",
                  border: "none",
                }),
                option: (styles, { isFocused, isSelected }) => ({
                  ...styles,
                  backgroundColor: isSelected ? "blue" : isFocused ? "blue" : "black",
                  color: isSelected ? "white" : isFocused ? "white" : "white",
                  cursor: "pointer",
                  transition: "background 0.3s ease-in-out",
                }),
                singleValue: (styles) => ({
                  ...styles,
                  color: "white", // Selected country text in white
                }),
              }}
            />

          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-700 rounded bg-transparent"
            />
            <label htmlFor="termsAccepted" className="text-gray-400 text-sm">
              I accept the terms and conditions
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm transition duration-200"
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
