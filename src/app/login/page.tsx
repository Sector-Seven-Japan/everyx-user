"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsLoggedIn, setAuthToken, API_BASE_URL ,setIsLoading} = useContext(AppContext);

  useEffect(()=>{
    setIsLoading(false);
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unauthorized. Please check your credentials."
        );
      }
      
      document.cookie = `authToken=${data.token}`;
      setAuthToken(data.token); // Update authToken in context
      setIsLoggedIn(true); // Update login status
      router.push("/home");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div>
      <Navbar home="Login" />
      <h1 className="text-[27px] text-center py-20">LogIn</h1>

      <form onSubmit={handleLogin} className="px-8">
        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-xs text-center mb-4">{error}</p>
        )}

        {/* Email Input */}
        <div className="flex flex-col gap-2 mb-8">
          <label className="text-xs text-white opacity-25">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            title="Email"
            className="w-full text-xs bg-transparent border-b border-gray-400 outline-none"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2 relative">
          <p className="text-xs text-white opacity-25">Password</p>
          <p
            onClick={() => router.push("/profile/forgot-password")}
            className="text-[9px] underline absolute bottom-1 right-0"
          >
            Forgot Password
          </p>
          <input
            type="password"
            placeholder="Enter your password"
            title="Password"
            className="w-full h-5 text-xs bg-transparent border-b border-gray-400 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p className="text-xl opacity-25 text-center py-10">or</p>

        {/* Google Login Button */}
        <div className="bg-[#131314] w-60 relative left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-4 py-2 rounded-full cursor-pointer">
          <Image src="/images/google.svg" alt="" width={20} height={20} />
          Continue with Google
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="text-[#2DC198] text-sm border border-[#2DC198] w-full py-2 rounded-md mt-16"
        >
          Login
        </button>
        <p className="text-white text-[12px] text-center mt-5">
          New here?
          <Link className="underline" href="/auth/signup">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
