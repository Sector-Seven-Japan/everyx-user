"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { cn } from "@/components/Cn";
import Navbar from "@/components/Navbar";
import { AppContext } from "../Context/AppContext";

export default function AchievementsPage() {
    const [activeTab, setActiveTab] = useState<"all" | "new">("all");
    const [notifications, setNotifications] = useState<any[]>([]);
    const { authToken } = useContext(AppContext); // Get token from context

    useEffect(() => {
        if (!authToken) {
            console.warn("Auth token is missing! Attempting to fetch from localStorage...");
            const storedToken = localStorage.getItem("authToken");
            if (storedToken) {
                console.log("Token retrieved from localStorage:", storedToken);
            }
        }
    }, [authToken]);

    const fetchNotifications = async (unreadOnly = false) => {
        if (!authToken) {
            console.error("Unauthorized: No token available");
            return;
        }

        try {
            const cleanedToken = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
            const url = new URL("https://test-api.everyx.io/notifications");
            url.searchParams.append("tags", "");
            url.searchParams.append("with_archived", "false");
            url.searchParams.append("unread_only", unreadOnly.toString());
            url.searchParams.append("limit", "10");
            url.searchParams.append("page", "1");

            const response = await fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Authorization": cleanedToken,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            } else {
                console.error("Failed to fetch notifications. Response:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications(activeTab === "new");
    }, [activeTab]); // Ensures API is called only when tab changes

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

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

            {notifications.length > 0 ? (
                <div className="px-4 py-6 space-y-6">
                    {notifications.map((notif, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <Image
                                src="/Images/notif.jpg"
                                alt="Achievement"
                                width={80}
                                height={100}
                                className="rounded-lg object-cover h-24"
                            />
                            <div className="flex-1 h-full">
                                <h2 className="text-[#00ff9d] text-xl font-medium mb-1">
                                    {notif.context || "Achievement Unlocked!"}
                                </h2>
                                <div className="flex items-center text-gray-400 text-sm mb-3">
                                    <span className="mr-2">◷</span> {notif.created_at || "Unknown time"}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {notif.template || "No description available."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center">No notifications found.</p>
            )}
        </div>
    );
}
