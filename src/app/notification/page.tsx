"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu } from "lucide-react"
import { cn } from "@/components/Cn"
import Navbar from "@/components/Navbar"

export default function AchievementsPage() {
    const [activeTab, setActiveTab] = useState<"all" | "new">("all")

    const AchievementsList = () => (
        <div className="px-4 py-6 space-y-6">
            <div className="flex gap-4 items-start">
                <Image
                    src="/Images/notif.jpg"
                    alt="Achievement"
                    width={80} // Increased width for better coverage
                    height={100} // Increased height to extend the image down
                    className="rounded-lg object-cover h-24" // Adjusted height
                />
                <div className="flex-1 h-full">
                    <h2 className="text-[#00ff9d] text-xl font-medium mb-1">Achievement Unlocked !</h2>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                        <span className="mr-2">◷</span>1 Day and 23h30m
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        This market will resolve to "Yes" if both of the following two conditions are met:
                    </p>
                    <ol className="list-decimal text-gray-300 text-sm leading-relaxed ml-4 mt-2 space-y-2">
                        <li>Donald J. Trump wins the 2024 US Presidential election.</li>
                        <li>
                            An armistice, ceasefire, or negotiated settlement is announced by both Ukraine and Russia regarding the
                            ongoing war in Ukraine at any point between the Associated Press calling the election for Donald Trump,
                            and April 19, 2025, 11:59 PM ET.
                        </li>
                    </ol>
                </div>
            </div>

            {/* Additional Achievement Items */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                    <Image
                        src="/Images/notif.jpg"
                        alt="Achievement"
                        width={80}
                        height={100}
                        className="rounded-lg object-cover h-24"
                    />
                    <div>
                        <h2 className="text-[#00ff9d] text-xl font-medium mb-1">Achievement Unlocked !</h2>
                        <div className="flex items-center text-gray-400 text-sm">
                            <span className="mr-2">◷</span>1 Day and 23h30m
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Navigation */}
            <nav className="flex justify-end items-center px-4 border-b border-gray-800 space-x-4">
    <button
        onClick={() => setActiveTab("all")}
        className={cn("py-3 px-2 relative", activeTab === "all" ? "text-[#00ff9d]" : "text-gray-400")}
    >
        All
        {activeTab === "all" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00ff9d]" />}
    </button>
    <button
        onClick={() => setActiveTab("new")}
        className={cn("py-3 px-2 relative", activeTab === "new" ? "text-[#00ff9d]" : "text-gray-400")}
    >
        New message
        {activeTab === "new" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00ff9d]" />}
    </button>
</nav>


            {/* Content */}
            {activeTab === "all" && <AchievementsList />}
            {activeTab === "new" && <AchievementsList />}
        </div>
    )
}
