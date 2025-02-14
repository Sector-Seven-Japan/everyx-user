"use client";
import React, { useState } from 'react';
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function ChangePassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNext = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setShowPasswordFields(true);
    setError('');
  };

  const handlePasswordReset = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsSuccess(true);
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div>
      <Navbar home={""} />
      <div className="p-5 flex flex-col justify-between h-[680px]">
        <h1 className="text-center text-[27px] mt-16">Password Reset</h1>
        
        {!showPasswordFields ? (
          <div className="flex flex-col gap-2 mb-8 px-10">
            <label className="text-xs text-white opacity-25">Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-transparent border-b border-gray-400 outline-none placeholder:text-[#fff]"
              placeholder="AlexKapawski@gmail.com"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        ) : !isSuccess ? (
          <div className="flex flex-col gap-8 mb-8 px-10">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white opacity-25">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-transparent border-b border-gray-400 outline-none placeholder:text-[#fff]"
                placeholder=".........."
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white opacity-25">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs bg-transparent border-b border-gray-400 outline-none placeholder:text-[#fff]"
                placeholder=".........."
              />
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center gap-10">
            <Image src="/Icons/SuccessIcon.png" alt='' width={70} height={70}></Image>
            <h2 className="text-[15px]">Your password has been reset successfully!</h2>
            <p className="text-[#707070] text-[13px] px-12">To trade you need to first make a deposit, 
            but you can keep exploring events.</p>
          </div>
        )}

        <div className="flex flex-col gap-6 p-5">
          {!showPasswordFields ? (
            <button 
              onClick={handleNext}
              className="w-full py-3 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198]"
            >
              Next
            </button>
          ) : !isSuccess ? (
            <button 
              onClick={handlePasswordReset}
              className="w-full py-3 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198]"
            >
              Next
            </button>
          ) : (
            <button 
              onClick={handleBackToLogin}
              className="w-full py-3 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198]"
            >
              Back to Login
            </button>
          )}
          
          <button
            className="w-full flex items-center justify-center transition-colors gap-2 underline text-white text-[12px]"
            type="button"
            onClick={() => {
              if (isSuccess) {
                handleBackToLogin();
              } else if (showPasswordFields) {
                setShowPasswordFields(false);
              } else {
                router.push("/login");
              }
            }}
          >
            {isSuccess ? 'Back' : (showPasswordFields ? 'Back' : 'Back to login')}
          </button>
        </div>
      </div>
    </div>
  );
}