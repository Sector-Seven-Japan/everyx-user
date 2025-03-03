import { AppContext } from "@/app/Context/AppContext";
import React, { useState, useEffect, useContext } from "react";
import { faker } from '@faker-js/faker';

interface TraderInfo {
  max_leverage: number;
  estimated_payout: number;
  estimated_probability: number;
}

interface Outcome {
  _id: string;
  name: string;
  trader_info: TraderInfo;
}

interface Category {
  name: string;
}

interface EventData {
  _id: string;
  name: string;
  description: string;
  category: Category;
  ends_at: string;
  outcomes: Outcome[];
  event_images_url: string[];
}

interface CategoryInfoProps {
  eventData: EventData;
}

interface RecentWager {
  datetime: string;
  event_id: string;
  event_outcome_id: string;
  probability: number;
  wager: number;
  pledge: number;
  leverage: number;
  expected_payout: number;
}

const generateRandomUsername = () => {
  let username = faker.internet.userName().replace(/[^a-zA-Z]/g, ''); 
  username = username.slice(0, 10); 

  
  while (username.length < 10) {
    username += faker.string.alpha(1);
  }

  return username;
};


export default function CategoryActivity({ eventData }: CategoryInfoProps) {
  const [recentWagers, setRecentWagers] = useState<RecentWager[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);
  const { API_BASE_URL } = useContext(AppContext);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/events/${eventData._id}/recent-wagers?pagination=true&page=1&limit=25`
    )
      .then((response) => response.json())
      .then((data) => {
        setRecentWagers(data);
        setUsernames(data.map(() => generateRandomUsername()));
      })
      .catch((error) => console.error("Error fetching recent wagers:", error));
  }, [API_BASE_URL, eventData._id]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatTime = (datetime: string) => {
    const date = new Date(datetime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}h${minutes}m`;
  };

  const gradientColors = [
    "bg-gradient-to-r from-green-400 to-blue-500",
    "bg-gradient-to-r from-pink-500 to-yellow-500",
    "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
    "bg-gradient-to-r from-yellow-400 to-red-500",
    "bg-gradient-to-r from-blue-400 to-purple-500",
    "bg-gradient-to-r from-red-400 to-yellow-500",
    "bg-gradient-to-r from-green-500 to-teal-500",
    "bg-gradient-to-r from-orange-400 to-pink-500",
    "bg-gradient-to-r from-indigo-400 to-blue-500",
    "bg-gradient-to-r from-teal-400 to-green-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
    "bg-gradient-to-r from-pink-400 to-red-500",
    "bg-gradient-to-r from-purple-500 to-indigo-500",
    "bg-gradient-to-r from-blue-500 to-teal-500",
    "bg-gradient-to-r from-red-500 to-pink-500",
    "bg-gradient-to-r from-green-500 to-yellow-500",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-teal-500 to-blue-500",
    "bg-gradient-to-r from-indigo-500 to-purple-500",
    "bg-gradient-to-r from-pink-500 to-orange-500",
    "bg-gradient-to-r from-yellow-500 to-green-500",
    "bg-gradient-to-r from-red-500 to-indigo-500",
    "bg-gradient-to-r from-blue-500 to-pink-500",
    "bg-gradient-to-r from-teal-500 to-orange-500",
    "bg-gradient-to-r from-purple-500 to-green-500",
  ];

  const outcomeColors = ["#00FFBB", "#FF5952", "#924DD3", "#26A45B", "#3661DF"];

  const getOutcomeNameAndColor = (outcomeId: string) => {
    const outcome = eventData?.outcomes?.find(
      (outcome) => outcome._id === outcomeId
    );
    const colorIndex = outcomeId.charCodeAt(0) % outcomeColors.length;
    return {
      name: outcome ? outcome.name : "Unknown",
      color: outcomeColors[colorIndex],
    };
  };

  return (
    <div className="px-5 mt-10">
      <h1 className="text-[23px] mb-8 md:text-[1.5vw] md:mb-14">Activities</h1>

      {recentWagers.length === 0 ? (
        <p>No recent activities.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {recentWagers.slice(0, 10).map((wager, i) => {
            const { name, color } = getOutcomeNameAndColor(
              wager.event_outcome_id
            );
            return (
              <div className="flex gap-5 items-center md:gap-10 2xl:gap-14 " key={i}>
                <div>
                  <div
                    className={`w-14 h-14 rounded-full md:w-[3vw] md:h-[3vw] ${
                      gradientColors[i % gradientColors.length]
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between w-full md:items-center">
                  <div className="text-[19px] flex flex-col gap-1 w-[55%] md:w-[40%] md:flex-row md:gap-10 md:justify-between gothic_font 2xl:text-[1vw] md:text-[1.1vw]">
                    {usernames[i]} bought
                    <div>
                      at{" "}
                      <span className="text-[#FFAE2A] text-[19px] 2xl:text-[1vw] md:text-[1.1vw]">
                        ${wager.wager}
                      </span>
                    </div>
                  </div>
                  <div className="text-[19px] flex flex-col gap-1 w-[45%] md:w-[40%] md:flex-row md:justify-between">
                    <p className="text-end gothic_font 2xl:text-[1vw] md:text-[1.1vw] md:flex md:gap-1" style={{ color }}>
                      {wager?.event_outcome_id}.{" "}
                      <span style={{ color }} className="gothic_font md:hidden"> {truncateText(name, 7)}</span>
                      <span style={{ color }} className="gothic_font hidden md:block"> {truncateText(name, 20)}</span>
                    </p>
                    <p className="opacity-[17%] text-end gothic_font 2xl:text-[1vw] md:text-[1.1vw]">
                      {formatTime(wager.datetime)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}