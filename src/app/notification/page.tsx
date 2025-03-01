"use client";

import { useState, useEffect, useContext } from "react";
import { cn } from "@/components/Cn";
import Navbar from "@/components/Navbar";
import { AppContext } from "@/app/Context/AppContext";

export default function Notification() {
  const [activeTab, setActiveTab] = useState("all");
  interface Notification {
    context: string;
    template: string;
    created_at: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { authToken, API_BASE_URL } = useContext(AppContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (authToken) {
      fetchNotifications("all");
    }

    // Detect if "Messages" button was clicked
    const handleMessageClick = () => setIsSidebarOpen(true);
    window.addEventListener("openSidebar", handleMessageClick);

    return () => {
      window.removeEventListener("openSidebar", handleMessageClick);
    };
  }, [authToken]);

  const fetchNotifications = async (tabType = activeTab) => {
    try {
      if (!authToken) return;

      const isUnreadOnly = tabType.toLowerCase() !== "all";

      const response = await fetch(
        `${API_BASE_URL}/notifications?with_archived=true&unread_only=${
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
    <>
      {/* Mobile View (Unchanged) */}
      <div className="min-h-screen bg-[#0E0E0E] text-white lg:hidden">
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
                {tab === "All" ? "All" : "New Message"}
              </button>
              <div
                className={cn(
                  "h-[2px] w-5 bg-[#00ff9d]",
                  activeTab === tab.toLowerCase() ? "block" : "hidden"
                )}
              ></div>
            </div>
          ))}
        </nav>
      </div>

      {/* Web View Sidebar (Hidden by Default) */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-[#1A1A1A] text-white shadow-lg transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } lg:block hidden`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
            ✖
          </button>
        </div>

        <div className="p-4 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif, i) => (
              <div key={i} className="p-3 border-b border-gray-700">
                <h3 className="text-[#00ff9d] font-medium">{notif?.context || "Notification"}</h3>
                <p className="text-gray-300 text-sm">{notif?.template || "No details available."}</p>
                <span className="text-gray-500 text-xs">{notif?.created_at || "Unknown time"}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No notifications found.</p>
          )}
        </div>
      </div>
    </>
  );
}
