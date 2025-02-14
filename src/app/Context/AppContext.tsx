"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

// Types and Interfaces
interface Category {
  name: string;
  slug: string;
}

type Categories = (Category | string)[];

interface BannerItem {
  name: string;
  slug: string;
  image_url: string;
  title: string;
}

interface TraderInfo {
  max_leverage: number;
  estimated_payout: number;
  estimated_probability: number;
}

interface OrderPayload {
  event_id: string;
  event_outcome_id: string;
  force_leverage: boolean;
  leverage: number;
  loan: number;
  pledge: number;
  wager: number;
}

interface OrderResponse {
  max_wager: number;
  min_wager: number;
  estimated_payout: number;
  estimated_probability: number;
  leverage: number;
  max_leverage: number;
  current_probability: number;
  indicative_return: number;
  new_probability: number;
  probability_change: number;
  wager: number;
  event_id: string;
  event_outcome_id: string;
}

interface AppContextProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  slugHeading: string;
  setSlugHeading: React.Dispatch<React.SetStateAction<string>>;
  selectedMenu: string;
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Categories;
  setCategories: React.Dispatch<React.SetStateAction<Categories>>;
  bannerData: BannerItem[];
  setBannerData: React.Dispatch<React.SetStateAction<BannerItem[]>>;
  findHeadingWithSlug: (slug: string) => string | undefined;
  getTimeRemaining: (endTime: string) => string;
  calculateMaxLeverage: (outcomes: { trader_info?: TraderInfo }[]) => number;
  calculateMaxEstimatedPayout: (
    outcomes: { trader_info?: TraderInfo }[]
  ) => number;
  formatDate: (isoDateString: string) => string;
  authToken: string | null;
  setAuthToken: React.Dispatch<React.SetStateAction<string | null>>;
  makeOrder: (
    outcomeId: string,
    eventId: string,
    amount: number,
    leverage: number
  ) => Promise<void>;
  isOrderMade: boolean;
  setIsOrderMade: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetails: OrderResponse;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderResponse>>;
  selectedOrder: string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>
  API_BASE_URL: string;

  userProfile: UserProfile | null;
  userStats: UserStats | null;
}

interface UserProfile {
  id: string;
  displayName: string;
  avatar: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  fullName: string;
  identityVerified: boolean;
  lastName: string;
  phone: string;
  phoneVerified: boolean;
  referralCode: string;
  referralCodeExpiresAt: string;
  referralCodeQuota: number;
}

interface UserStats {
  user_id: string;
  num_trophies: number;
  num_ranking: number;
  rate_winning: number;
  rate_return: number;
  wager_value: number;
  wager_value_24hr_change: number;
  rate_wager_value_24hr_change: number;
  fund_available: number;
  fund_available_24hr_change: number;
  profit: number;
  best_case_payoff: number;
  best_case_fund_available: number;
  best_case_fund_available_24hr_change: number;
  best_case_cumulative_profit: number;
  expected_payoff: number;
  expected_fund_available: number;
  expected_fund_available_24hr_change: number;
  expected_cumulative_profit: number;
  timestamp: string;

  selectedOrder: string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>;

}

const API_BASE_URL = "https://test-api.everyx.io";

// Initial context state
const initialState: AppContextProps = {
  filter: "",
  setFilter: () => {},
  slugHeading: "",
  setSlugHeading: () => {},
  selectedMenu: "Home",
  setSelectedMenu: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  search: "",
  setSearch: () => {},
  isLoading: false,
  setIsLoading: () => {},
  categories: [],
  setCategories: () => {},
  bannerData: [],
  setBannerData: () => {},
  findHeadingWithSlug: () => undefined,
  getTimeRemaining: () => "",
  calculateMaxLeverage: () => 0,
  calculateMaxEstimatedPayout: () => 0,
  formatDate: () => "",
  authToken: null,
  setAuthToken: () => {},
  makeOrder: async () => {},
  isOrderMade: false,
  orderDetails: {
    max_wager: 0,
    min_wager: 0,
    estimated_payout: 0,
    estimated_probability: 0,
    leverage: 1,
    max_leverage: 1,
    current_probability: 0,
    indicative_return: 0,
    new_probability: 0,
    probability_change: 0,
    wager: 0,
    event_id: "",
    event_outcome_id: "",
  },
  setIsOrderMade: () => {},
  setOrderDetails: () => {},
  API_BASE_URL,

  userProfile: null,
  userStats: null,

  selectedOrder: "",
  setSelectedOrder: () => {},

};

export const AppContext = createContext<AppContextProps>(initialState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // State management
  const router = useRouter();
  const [filter, setFilter] = useState<string>("");
  const [slugHeading, setSlugHeading] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<string>("Home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Categories>([]);
  const [bannerData, setBannerData] = useState<BannerItem[]>([]);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isOrderMade, setIsOrderMade] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [orderDetails, setOrderDetails] = useState<OrderResponse>({
    max_wager: 0,
    min_wager: 0,
    estimated_payout: 0,
    estimated_probability: 0,
    leverage: 1,
    max_leverage: 1,
    current_probability: 0,
    indicative_return: 0,
    new_probability: 0,
    probability_change: 0,
    wager: 0,
    event_id: "",
    event_outcome_id: "",
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  // API Calls
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/layout`);
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.top_categories || []);
      setBannerData(data.new_collections || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
      setBannerData([]);
    }
  };

  const makeOrder = async (
    outcomeId: string,
    eventId: string,
    amount: number,
    leverage: number
  ) => {
    if (!authToken) {
      return router.push("/login");
    }

    // setIsLoading(true);
    setIsOrderMade(true);

    const orderPayload: OrderPayload = {
      event_id: eventId,
      event_outcome_id: outcomeId,
      force_leverage: false,
      leverage: leverage,
      loan: 0,
      pledge: amount,
      wager: amount,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Order placement failed");
      }
      const responseData = (await response.json()) as OrderResponse;
      setOrderDetails(responseData); // Update with new data after clearing old data
    } catch (error) {
      console.error("Error making order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility Functions
  const findHeadingWithSlug = (slug: string): string | undefined => {
    const foundItem = categories.find((item) =>
      typeof item === "object" ? item.slug === slug : false
    );
    return typeof foundItem === "object" ? foundItem.name : undefined;
  };

  const getTimeRemaining = (endTime: string): string => {
    const now = new Date();
    const endDate = new Date(endTime);
    let diff = Math.floor((endDate.getTime() - now.getTime()) / 1000);

    if (diff <= 0) return "Ended";

    const months = Math.floor(diff / (30 * 24 * 60 * 60));
    diff %= 30 * 24 * 60 * 60;
    const weeks = Math.floor(diff / (7 * 24 * 60 * 60));
    diff %= 7 * 24 * 60 * 60;
    const days = Math.floor(diff / (24 * 60 * 60));
    diff %= 24 * 60 * 60;
    const hours = Math.floor(diff / (60 * 60));

    if (months > 0) return `${months}mo ${weeks}w`;
    if (weeks > 0) return `${weeks}w ${days}d`;
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}H`;
  };

  // Function to calculate the max leverage from a set of outcomes
  const calculateMaxLeverage = (
    outcomes?: { trader_info?: TraderInfo }[]
  ): number => {
    return Math.max(
      0,
      ...(outcomes ?? []).map(
        (outcome) => outcome.trader_info?.max_leverage ?? 0
      )
    );
  };

  // Function to calculate the max estimated payout from a set of outcomes
  const calculateMaxEstimatedPayout = (
    outcomes?: { trader_info?: TraderInfo }[]
  ): number => {
    return Math.max(
      0,
      ...(outcomes ?? []).map(
        (outcome) => outcome.trader_info?.estimated_payout ?? 0
      )
    );
  };

  // Function to format a date
  const formatDate = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getProfileData = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    }
  };

  const getUserStatsData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("userStats data at the appcontext", data);
        setUserStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch the userStats:", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getProfileData();
      getUserStatsData();
    }
  }, [authToken]);

  useEffect(() => {
    fetchCategories();
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) =>
      cookie.startsWith("authToken=")
    );

    if (tokenCookie) {
      const token = tokenCookie.split("=")[1]; // Extract the token
      console.log("Auth token retrieved from cookies:", token); // Log token
      setAuthToken(token);
    } else {
      console.log("No authToken found in cookies."); // Log if no token found
    }
  }, []); // Only run on mount

  // This useEffect will run when authToken changes
  useEffect(() => {
    console.log("authToken changed:", authToken); // Log whenever authToken is updated
    if (authToken) {
      setIsLoggedIn(true); // Set isLoggedIn to true if token exists
      console.log("User is logged in.");
    } else {
      setIsLoggedIn(false); // Set isLoggedIn to false if no token is found
      console.log("User is not logged in.");
    }
  }, [authToken]); // Runs when authToken is updated

  const contextValue: AppContextProps = {
    filter,
    setFilter,
    slugHeading,
    setSlugHeading,
    selectedMenu,
    setSelectedMenu,
    isLoggedIn,
    setIsLoggedIn,
    search,
    setSearch,
    isLoading,
    setIsLoading,
    categories,
    setCategories,
    bannerData,
    setBannerData,
    findHeadingWithSlug,
    getTimeRemaining,
    calculateMaxLeverage,
    calculateMaxEstimatedPayout,
    formatDate,
    authToken,
    setAuthToken,
    makeOrder,
    isOrderMade,
    setIsOrderMade,
    orderDetails,
    setOrderDetails,
    API_BASE_URL,

    userProfile,
    userStats,

    selectedOrder,
    setSelectedOrder

  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
