"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import "./settings.css";
import Navbar from "@/components/Navbar";
import { AppContext } from "../Context/AppContext";
import Loader from "@/components/Loader/Loader";

const Setting: React.FC = () => {
  const router = useRouter();
  const { authToken, API_BASE_URL } = useContext(AppContext);
  const [favoriteTags, setFavoriteTags] = useState<
    { tag: { slug: string; name: string }; enabled: boolean }[]
  >([]);
  const [notifications, setNotifications] = useState<
    Record<string, { name: string; enabled: boolean }>
  >({});
  const [wager, setWager] = useState({
    default_wager_size: "",
    default_leverage: "",
    warn_when_market_impact_exceeds: "",
  });

  const [updatedNotifications, setUpdatedNotifications] = useState<
    Record<string, boolean>
  >({});
  const [updatedFavoriteTags, setUpdatedFavoriteTags] = useState<
    { tag: { slug: string; name: string }; enabled: boolean }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const notificationNames: Record<string, string> = {
    EI01: "Event is ending soon!",
    EI02: "New reward available!",
    EI03: "Your account has been updated.",
    EI04: "Payment received successfully.",
    EI06: "Security alert detected!",
    EI07: "Friend request received.",
    EI08: "Your verification is complete.",
    DW01: "Deposit successful!",
    DW03: "Withdrawal request submitted.",
    DW04: "There was an issue with your deposit.",
    DW05: "Withdrawal completed successfully.",
    DW06: "Insufficient balance warning.",
    ACR01: "Achievement unlocked!",
    ACR02: "You have leveled up!",
    ACR03: "You are in the top 10%!",
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/preferences`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();

      const notificationMap: Record<
        string,
        { name: string; enabled: boolean }
      > = {};
      data.notification_types.forEach(
        (type: {
          name: string;
          notifications: { notification_code: string; enabled: boolean }[];
        }) => {
          type.notifications.forEach(
            (notif: { notification_code: string; enabled: boolean }) => {
              notificationMap[notif.notification_code] = {
                name: notificationNames[notif.notification_code] || type.name,
                enabled: notif.enabled,
              };
            }
          );
        }
      );

      setNotifications(notificationMap);

      setFavoriteTags(data.favorite_tags || []);

      setWager({
        default_wager_size: data.wager.default_wager_size || "",
        default_leverage: data.wager.default_leverage || "",
        warn_when_market_impact_exceeds:
          data.wager.warn_when_market_impact_exceeds || "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchSettings();
    }
  }, [authToken]);

  const handleFavoriteTagToggle = (slug: string) => {
    const updatedTags = [...favoriteTags];
    const tagIndex = updatedTags.findIndex((tag) => tag.tag.slug === slug);
    if (tagIndex !== -1) {
      updatedTags[tagIndex].enabled = !updatedTags[tagIndex].enabled;
      setFavoriteTags(updatedTags); // Update UI immediately

      const updatedTag = updatedTags[tagIndex];

      setUpdatedFavoriteTags((prevState) => {
        // Check if the tag is already in the updated list
        const tagIndex = prevState.findIndex(
          (fav) => fav.tag.slug === updatedTag.tag.slug
        );
        if (tagIndex !== -1) {
          // Update the existing tag if it's already in the updated list
          const updatedFavorites = [...prevState];
          updatedFavorites[tagIndex] = updatedTag;
          return updatedFavorites;
        } else {
          // Add the new updated tag to the list
          return [...prevState, updatedTag];
        }
      });
    }
  };

  const saveData = async () => {
    try {
      const wagerResponse = await fetch(`${API_BASE_URL}/preferences/wager`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(wager),
      });

      if (!wagerResponse.ok) {
        throw new Error("Error saving wager settings");
      }

      // Only save favorite tags that have changed
      for (const updatedTag of updatedFavoriteTags) {
        const favResponse = await fetch(
          `${API_BASE_URL}/preferences/favorite-tags/${updatedTag.tag.slug}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              enabled: updatedTag.enabled,
            }),
          }
        );
        if (!favResponse.ok) {
          throw new Error(`Error saving favorite tag: ${updatedTag.tag.slug}`);
        }
      }

      // Update notifications that have changed
      for (const key of Object.keys(updatedNotifications)) {
        const notifResponse = await fetch(
          `${API_BASE_URL}/preferences/notifications/${key}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              enabled: updatedNotifications[key],
            }),
          }
        );
        if (!notifResponse.ok) {
          throw new Error(`Error saving notification: ${key}`);
        }
      }

      toast.success("Update Successful", {
        autoClose: 2000,
        theme: "dark",
      });

      setUpdatedNotifications({});
      setUpdatedFavoriteTags([]);
    } catch (error) {
      toast.error(
        "Error saving settings: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar home="Setting" />
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-4 pb-28">
        <h2 className="font-medium text-[17px] text-left">Notifications</h2>
        <div className="my-5 flex flex-col gap-5">
          {Object.keys(notifications).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-[14px]">{notifications[key].name}</label>
              <Switch
                checked={notifications[key]?.enabled ?? false}
                onChange={() => {
                  setNotifications((prev) => {
                    const updatedNotificationsMap = {
                      ...prev,
                      [key]: {
                        ...prev[key],
                        enabled: !prev[key]?.enabled,
                      },
                    };

                    setUpdatedNotifications((prevState) => ({
                      ...prevState,
                      [key]: !prev[key]?.enabled,
                    }));

                    return updatedNotificationsMap;
                  });
                }}
                className={`${
                  notifications[key]?.enabled ? "bg-green-500" : "bg-gray-900"
                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    notifications[key]?.enabled
                      ? "translate-x-6"
                      : "translate-x-1"
                  } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                />
              </Switch>
            </div>
          ))}
        </div>

        <h2 className="font-medium text-[17px] text-left mt-10">Favourites</h2>
        <div className="my-5 flex flex-col gap-5">
          {favoriteTags.map((item) => (
            <div
              key={item.tag.slug}
              className="flex items-center justify-between"
            >
              <label className="text-[14px]">{item.tag.name}</label>
              <Switch
                checked={item.enabled}
                onChange={() => handleFavoriteTagToggle(item.tag.slug)}
                className={`${
                  item.enabled ? "bg-green-500" : "bg-gray-900"
                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span
                  className={`${
                    item.enabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform bg-white rounded-full transition`}
                />
              </Switch>
            </div>
          ))}
        </div>

        <h2 className="font-medium text-[17px] text-left mt-10">Trades</h2>
        <div className="flex flex-col mt-5 gap-5">
          {Object.keys(wager).map((key) => (
            <div key={key}>
              <label className="text-[14px] text-white opacity-[27%]">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="text"
                value={wager[key as keyof typeof wager]}
                onChange={(e) =>
                  setWager((prev) => ({
                    ...prev,
                    [key as keyof typeof wager]: e.target.value,
                  }))
                }
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
                className="w-full mt-2 bg-transparent border-b-[1px] text-[14px] text-white pb-1 border-[#707070] outline-none"
              />
            </div>
          ))}
        </div>

        <div className="px-5 mt-10">
          <button
            type="button"
            className="w-full bg-transparent border-[0.25px] border-[#2DC198] rounded-lg h-14 flex justify-center items-center"
            onClick={saveData}
          >
            <span className="text-[16px] text-[#2DC198]">SAVE</span>
          </button>

          <div
            className="text-center mt-5 underline cursor-pointer"
            onClick={() => router.back()}
          >
            Back
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
