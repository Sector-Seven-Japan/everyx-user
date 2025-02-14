"use client"

import { Button } from "@/components/Button"
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation" // Import useRouter

export default function VerifyIdentityComplete() {
  const router = useRouter() // Initialize useRouter

  const handleDoneClick = () => {
    router.push("/login") // Redirect to /login when DONE button is clicked
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar home="Verification" />

      {/* Main Content */}
      <main className="px-4 pt-12 flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-center">Verify Identity</h1>
          <div className="space-y-1 text-center">
            <p className="text-white">Thank you.</p>
            <p className="text-gray-400 text-sm">We are processing the data.</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
          <div className="w-28 h-[1px] bg-[#00ffb8] opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
          <div className="w-28 h-[1px] bg-[#00ffb8] opacity-50" />
          <div className="w-4 h-4 rounded-full bg-[#00ffb8]" />
        </div>

        <p className="text-gray-400 text-sm text-center">Your verification status will update automatically.</p>

        {/* Status List */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="none" stroke="currentColor">
                <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-white">Applicant data</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="none" stroke="currentColor">
                <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-white">Identity document</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-black" fill="none" stroke="currentColor">
                <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-white">Selfie</span>
          </div>
        </div>

        {/* Done Button */}
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 rounded-xl mt-4"
          onClick={handleDoneClick} // Redirect when clicked
        >
          DONE
        </Button>
      </main>
    </div>
  )
}
