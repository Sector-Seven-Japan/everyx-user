"use client";

import React, { useState, useContext } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { AppContext } from "@/app/Context/AppContext";
import { toast } from "react-toastify";
import Image from "next/image";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";

const PasswordChange: React.FC = () => {
  const router = useRouter();
  const { userProfile } = useContext(AppContext);
  const { authToken, API_BASE_URL, isMobile } = useContext(AppContext);

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field: keyof typeof visibility) => {
    setVisibility({ ...visibility, [field]: !visibility[field] });
  };

  const handlePasswordChange = async () => {
    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("All fields are required.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and Confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/passwords`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          old_password: passwords.oldPassword,
          password: passwords.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast.success("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(
        `Error changing password. Try again: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <>
      <Navbar />
      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-5">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              {userProfile && (
                <Image
                  src={userProfile?.avatar}
                  alt="User Profile Pic"
                  className="object-cover rounded-full"
                  width={80}
                  height={80}
                />
              )}
            </div>
          </div>
          <p className="text-center text-[17px] font-medium pt-5">
            Change Password
          </p>

          <div className="space-y-6 px-5 my-32">
            {["oldPassword", "newPassword", "confirmPassword"].map(
              (field, index) => (
                <div key={index} className="border-b border-gray-800">
                  <label className="block text-[12px] mb-1 opacity-[27%]">
                    {field === "oldPassword"
                      ? "Old Password"
                      : field === "newPassword"
                      ? "New Password"
                      : "Confirm New Password"}
                  </label>
                  <div className="flex items-center justify-between">
                    <input
                      type={
                        visibility[field as keyof typeof visibility]
                          ? "text"
                          : "password"
                      }
                      name={field}
                      value={passwords[field as keyof typeof passwords]}
                      onChange={handleChange}
                      placeholder=".........."
                      className="flex-1 bg-transparent py-2 text-[12px] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        toggleVisibility(field as keyof typeof visibility)
                      }
                      className="ml-2 text-gray-400"
                    >
                      {visibility[field as keyof typeof visibility] ? (
                        <IoEyeOutline size={18} />
                      ) : (
                        <IoEyeOffOutline size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="space-y-4 pt-6">
            <button
              className="w-full py-3 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198]"
              onClick={handlePasswordChange}
            >
              SAVE
            </button>
            <button
              className="w-full flex items-center justify-center transition-colors gap-2 underline text-white text-[12px]"
              type="button"
              onClick={() => router.push("/profile")}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="md:px-[12%] 2xl:px-[19%]">
          <div className="flex md:flex-row md:mt-32 justify-between gap-5 md:pb-20">
            <div className="bg-[#0E0E0E] md:w-[60%] xl:w-[75%] w-full">
              <p className="text-left text-[17px] font-medium ">
                Change Password
              </p>

              <div className="space-y-6 my-10">
                {["oldPassword", "newPassword", "confirmPassword"].map(
                  (field, index) => (
                    <div key={index} className="border-b border-gray-800">
                      <label className="block text-[12px] mb-1 opacity-[27%]">
                        {field === "oldPassword"
                          ? "Old Password"
                          : field === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"}
                      </label>
                      <div className="flex items-center justify-between">
                        <input
                          type={
                            visibility[field as keyof typeof visibility]
                              ? "text"
                              : "password"
                          }
                          name={field}
                          value={passwords[field as keyof typeof passwords]}
                          onChange={handleChange}
                          placeholder=".........."
                          className="flex-1 bg-transparent py-2 text-[12px] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            toggleVisibility(field as keyof typeof visibility)
                          }
                          className="ml-2 text-gray-400"
                        >
                          {visibility[field as keyof typeof visibility] ? (
                            <IoEyeOutline size={18} />
                          ) : (
                            <IoEyeOffOutline size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-1 flex justify-between items-center gap-5">
                <button
                  className="w-56  border-[#fff]  rounded-lg py-3 px-4 border-[0.25px]  text-white text-[14px]"
                  type="button"
                  onClick={() => router.push("/profile")}
                >
                  Back
                </button>
                <button
                  className="w-56 py-3 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198]"
                  onClick={handlePasswordChange}
                >
                  SAVE
                </button>
              </div>
            </div>
            <div className="m:w-[40%] xl:w-[25%]">
              <CurrentCashBalanceCardWebview />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordChange;
