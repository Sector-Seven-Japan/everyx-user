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
  const [error, setError] = useState<{ email?: string; password?: string; general?: string }>({});
  const { setIsLoggedIn, setAuthToken, API_BASE_URL, setIsLoading } = useContext(AppContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({}); // Reset errors before validating

    // Basic validation
    const newErrors: { email?: string; password?: string; general?: string } = {};
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("email", email);
      formData.append("password", password);

      setIsLoading(true)
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
        throw new Error(data.message || "Invalid email or password.");
      }

      document.cookie = `authToken=${data.token}`;
      setAuthToken(data.token);
      setIsLoggedIn(true);
      router.push("/home");
    } catch (error) {
      setIsLoading(false)
      setError({ general: (error as Error).message });
    }
  };

  return (
    <div>
      <Navbar/>
      <h1 className="text-[27px] text-center py-20">Log In</h1>

      <form onSubmit={handleLogin} className="px-8">
        {/* Email Input */}
        <div className="flex flex-col gap-2 mb-9">
          <label className="text-xs text-white opacity-25">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full text-xs bg-transparent border-b border-gray-400 outline-none"
          />
          {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2 relative mb-4">
          <p className="text-xs text-white opacity-25">Password</p>
          <p
            onClick={() => router.push("/profile/forgot-password")}
            className="text-[9px] underline absolute bottom-1 right-0 cursor-pointer"
          >
            Forgot Password?
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full text-xs bg-transparent border-b border-gray-400 outline-none"
          />
          {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
        </div>

        {/* General Error Message */}
        {error.general && <p className="text-red-500 text-xs text-center mt-3">Invalid Email or password</p>}

        <p className="text-xl opacity-25 text-center py-10">or</p>

        {/* Google Login Button */}
        <div className="bg-[#131314] w-60 mx-auto flex justify-center items-center gap-4 py-2 rounded-full cursor-pointer">
          <Image src="/Images/google.svg" alt="Google Logo" width={20} height={20} />
          Continue with Google
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="text-[#2DC198] text-sm border border-[#2DC198] w-full py-2 rounded-md mt-10"
        >
          Login
        </button>

        <p className="text-white text-[12px] text-center mt-5">
          New here?{" "}
          <Link className="underline" href="/auth/signup">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
