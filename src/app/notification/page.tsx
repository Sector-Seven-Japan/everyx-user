"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { cn } from "@/components/Cn";
import Navbar from "@/components/Navbar";
import { AppContext } from "../Context/AppContext";

export default function AchievementsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const { authToken } = useContext(AppContext);

  useEffect(() => {
    if (authToken) {
      fetchNotifications("all"); // Pass the default tab explicitly
    }
  }, [authToken]);
  const fetchNotifications = async (tabType = activeTab) => {
    try {
      if (!authToken) return;

      // Use the parameter value instead of directly accessing activeTab
      const isUnreadOnly = tabType.toLowerCase() !== "all";

      const response = await fetch(
        `https://test-api.everyx.io/notifications?with_archived=true&unread_only=${
          !isUnreadOnly ? "false" : "true"
        }&pagination=true&page=1&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  return (
    <div className="min-h-screen bg-[`#0E0E0E`] text-white">
      <Navbar />

      <nav className="flex justify-end items-center px-4 border-b border-gray-800 space-x-4">
        {["All", "Unread"].map((tab) => (
          <div className="flex flex-col items-center" key={tab}>
            <button
              onClick={() => {
                setActiveTab(tab.toLowerCase());
                fetchNotifications(tab.toLowerCase());
              }}
              className={cn(
                "py-3 px-2 relative",
                activeTab === tab.toLowerCase()
                  ? "text-[#00ff9d]"
                  : "text-gray-400"
              )}
            >
              {tab == "All" ? "All" : "New Message"}
            </button>
            <div
              className={cn(
                "h-[2px] w-5 bg-[#00ff9d]  ",
                activeTab === tab.toLowerCase() ? "block" : "hidden"
              )}
            ></div>
          </div>
        ))}
      </nav>

      {/* <div className="px-4 py-6 space-y-6">
        {notifications.length > 0 ? (
          notifications.map((notif, i) => (
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
                  {notif?.context || "Achievement Unlocked!"}
                </h2>
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <span className="mr-2">◷</span>
                  {notif?.created_at || "Unknown time"}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {notif?.template || "No description available."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No notifications found.</p>
        )}
      </div> */}
    </div>
  );
}
