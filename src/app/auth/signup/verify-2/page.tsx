"use client";

import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function VerifyIdentity() {
  const router = useRouter();

  // State to hold uploaded images
  const [docImages, setDocImages] = useState<{
    idOrDriver: string | null;
    bankDocument: string | null;
  }>({
    idOrDriver: null,
    bankDocument: null,
  });

  // Handler for image uploads
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: "idOrDriver" | "bankDocument"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocImages((prev) => ({
          ...prev,
          [docType]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigate to the next page
  const handleNextClick = () => {
    if (!docImages.idOrDriver || !docImages.bankDocument) {
      alert("Please upload all required documents before proceeding.");
      return;
    }
    console.log("Uploaded documents:", docImages);
    router.push("/auth/signup/verify-3");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar home="Verification" />

      {/* Main Content */}
      <main className="px-4 pt-12 flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Verify Identity</h1>
          <p className="text-gray-400 text-center text-sm">
            Confirm your country of residence to learn how your personal data will be processed.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
          <div className="w-28 h-[1px] bg-[#00ffb8] opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
          <div className="w-28 h-[1px] bg-gray-600 opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#585858]" />
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <h2 className="text-sm">Upload more than 2 documents:</h2>
          <div className="space-y-3">
            {/* ID or Driver Licence Upload */}
            <Card className="bg-zinc-900 border-zinc-800">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "idOrDriver")}
                  className="hidden"
                />
                <div className="w-full justify-start text-gray-400 py-6 flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-6 h-6 mr-3"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                    <path d="M12 8v8M8 12h8" strokeWidth="2" />
                  </svg>
                  <span>
                    {docImages.idOrDriver ? (
                      <span className="text-green-500">Uploaded</span>
                    ) : (
                      "ID or Driver Licence"
                    )}
                  </span>
                </div>
              </label>
            </Card>

            {/* Bank Documents Upload */}
            <Card className="bg-zinc-900 border-zinc-800">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "bankDocument")}
                  className="hidden"
                />
                <div className="w-full justify-start text-gray-400 py-6 flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-6 h-6 mr-3"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                    <path d="M12 8v8M8 12h8" strokeWidth="2" />
                  </svg>
                  <span>
                    {docImages.bankDocument ? (
                      <span className="text-green-500">Uploaded</span>
                    ) : (
                      "Bank Documents"
                    )}
                  </span>
                </div>
              </label>
            </Card>
          </div>
        </div>

        {/* Next Button */}
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-xl"
          onClick={handleNextClick}
        >
          Next
        </Button>
      </main>
    </div>
  );
}
