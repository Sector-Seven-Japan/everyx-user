"use client";

import { Button } from "@/components/Button";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation"; // Import useRouter

export default function VerifyIdentityProfile() {
  const router = useRouter(); // Initialize useRouter

  const handleNextClick = () => {
    router.push("/auth/signup/verify-4"); // Redirect to /signup/verify-4
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar home="Verification" />

      {/* Main Content */}
      <main className="px-4 pt-12 flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Verify Identity</h1>
          <p className="text-gray-400 text-center text-sm">
            Confirm your country of residence to learn how your personal data will be processed
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
          <div className="w-28 h-[1px] bg-[#00ffb8] opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
          <div className="w-28 h-[1px] bg-[#00ffb8] opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
        </div>

        {/* Profile Image */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500"></div>
            <div className="absolute inset-1 rounded-full overflow-hidden">
              <Image
                src="/Images/profile.jpg"
                alt="Profile"
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Next Button */}
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-xl mt-4"
          onClick={handleNextClick} // Add onClick to handle redirection
        >
          Next
        </Button>
      </main>
    </div>
  );
}
