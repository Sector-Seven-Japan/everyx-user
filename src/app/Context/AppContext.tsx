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
  pledge: number;
  event_id: string;
  event_outcome_id: string;
  after_wager: number;
  after_payout: number;
  indicative_payout: number;
  after_return: number;
  after_stop_probability: number;
  before_wager: number;
  before_leverage: number;
  before_payout: number;
  before_return: number;
  before_stop_probability: number;
  after_leverage: number;
  loan: number;
  before_pledge: number;
  after_pledge: number;
  stop_probability: number;
}

interface Wallet {
  id: number;
  currency: string;
  balance: number;
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

interface AppContextProps {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  sidebar: boolean;
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
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
    force_leverage: boolean,
    leverage: number,
    loan: number,
    pledge: number,
    wager: number
  ) => Promise<void>;
  makeOrderWithAuth: (
    outcomeId: string,
    eventId: string,
    force_leverage: boolean,
    leverage: number,
    loan: number,
    pledge: number,
    wager: number
  ) => Promise<void>;
  isOrderMade: boolean;
  setIsOrderMade: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetails: OrderResponse;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderResponse>>;
  API_BASE_URL: string;
  selectedOrder: string;
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>;
  walletData: Wallet[];
  setWalletData: React.Dispatch<React.SetStateAction<Wallet[]>>;
  fetchWalletData: () => Promise<void>;
  userProfile: UserProfile | null;
  userStats: UserStats | null;
  getCountdown: (ends_at: string) => string;
  isMobile: boolean;
  time: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  depositAddress: string;
  setDepositAddress: React.Dispatch<React.SetStateAction<string>>;
  getDepositAddress: () => Promise<void>;
  fetchingData: boolean;
  selectedOutcomeId: string;
  setSelectedOutcomeId: React.Dispatch<React.SetStateAction<string>>;
}


const API_BASE_URL = "https://test-api.everyx.io";
// const API_BASE_URL = "https://dev-api.everyx.io";




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
  makeOrderWithAuth: async () => {},
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
    pledge: 0,
    event_id: "",
    event_outcome_id: "",
    after_payout: 0,
    after_wager: 0,
    indicative_payout: 0,
    after_return: 0,
    after_stop_probability: 0,
    before_wager: 0,
    before_leverage: 0,
    before_payout: 0,
    before_return: 0,
    before_stop_probability: 0,
    after_leverage: 0,
    loan: 0,
    before_pledge: 0,
    after_pledge: 0,
    stop_probability: 0,
  },
  setIsOrderMade: () => {},
  setOrderDetails: () => {},
  API_BASE_URL,
  selectedOrder: "",
  setSelectedOrder: () => {},
  walletData: [],
  setWalletData: () => {},
  sidebar: false,
  setSidebar: () => {},
  fetchWalletData: async () => {},
  userProfile: null,
  userStats: null,
  getCountdown: () => "Ended",
  isMobile: false,
  time: "0",
  isOpen: false,
  setIsOpen: () => {},
  depositAddress: "",
  setDepositAddress: () => {},
  getDepositAddress: async () => {},
  fetchingData: false,
  selectedOutcomeId: "",
  setSelectedOutcomeId: () => {},
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
  const [walletData, setWalletData] = useState<Wallet[]>([]);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [fetchingData, setFetchingDataStatus] = useState<boolean>(true);
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
    pledge: 0,
    event_id: "",
    event_outcome_id: "",
    after_payout: 0,
    after_wager: 0,
    indicative_payout: 0,
    after_return: 0,
    after_stop_probability: 0,
    before_wager: 0,
    before_leverage: 0,
    before_payout: 0,
    before_return: 0,
    before_stop_probability: 0,
    after_leverage: 0,
    loan: 0,
    before_pledge: 0,
    after_pledge: 0,
    stop_probability: 0,
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [depositAddress, setDepositAddress] = useState<string>("");
  const [time, setTime] = useState(0); // Time in seconds
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string>("");

  // Handling the Screen time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime >= 5 * 60) {
          return 0; // Reset to 0 after 5 minutes
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set breakpoint (e.g., 768px for mobile)
    };

    // Set initial value
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // API Calls
  const fetchCategories = async () => {
    try {
      setFetchingDataStatus(true);
      const response = await fetch(`${API_BASE_URL}/layout`);
      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      setCategories(data.top_categories || []);
      setBannerData(data.new_collections || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
      setBannerData([]);
      setIsLoading(false);
    } finally {
      setFetchingDataStatus(false);
    }
  };

  const fetchWalletData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wallets`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch wallet data");
      const data = await response.json();
      setWalletData(data);
    } catch (error) {
      console.log("failed to fetch Wallet data", error);
    }
  };

  const makeOrder = async (
    outcomeId: string,
    eventId: string,
    force_leverage: boolean,
    leverage: number,
    loan: number,
    pledge: number,
    wager: number
  ) => {
    if (!authToken) {
      return router.push("/login");
    }
    const orderPayload: OrderPayload = {
      event_id: eventId,
      event_outcome_id: outcomeId,
      force_leverage: force_leverage,
      leverage: leverage,
      loan: loan,
      pledge: pledge,
      wager: wager,
    };

    console.log(orderPayload);

    try {
      const response = await fetch(`${API_BASE_URL}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Order placement failed");
      }
      const responseData = (await response.json()) as OrderResponse;
      setOrderDetails(responseData);
    } catch (error) {
      console.error("Error making order:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const makeOrderWithAuth = async (
    outcomeId: string,
    eventId: string,
    force_leverage: boolean,
    leverage: number,
    loan: number,
    pledge: number,
    wager: number
  ) => {
    if (!authToken) {
      return router.push("/login");
    }
    const orderPayload: OrderPayload = {
      event_id: eventId,
      event_outcome_id: outcomeId,
      force_leverage: force_leverage,
      leverage: leverage,
      loan: loan,
      pledge: pledge,
      wager: wager,
    };

    console.log(orderPayload);

    try {
      const response = await fetch(`${API_BASE_URL}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Order placement failed");
      }
      const responseData = (await response.json()) as OrderResponse;
      setOrderDetails(responseData);
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
        setUserStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch the userStats:", error);
    }
  };

  const getCountdown = (ends_at: string): string => {
    const now = new Date();
    const endDate = new Date(ends_at);
    let diff = Math.floor((endDate.getTime() - now.getTime()) / 1000);

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (24 * 60 * 60));
    diff %= 24 * 60 * 60;
    const hours = Math.floor(diff / (60 * 60));
    diff %= 60 * 60;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    const daysStr = days > 0 ? `${days}d ` : "";
    const hoursStr = hours > 0 ? `${hours}h` : "";
    const minutesStr =
      minutes > 0 ? `${String(minutes).padStart(2, "0")}m` : "";
    const secondsStr = `${String(seconds).padStart(2, "0")}s`;

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.trim();
  };

  const getDepositAddress = async () => {
    try {
      setIsOpen(true);
      const res = await fetch(`${API_BASE_URL}/deposit/create/wallet`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      console.log(data);
      setDepositAddress(data.address);
    } catch (error) {
      console.log("failed to fetch deposit address", error);
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
    if (authToken) {
      fetchWalletData();
    }
  }, [authToken]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      console.log("Auth token retrieved from local storage:", token); // Log token
      setAuthToken(token);
    } else {
      console.log("No authToken found in local storage."); // Log if no token found
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
    fetchingData,
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
    selectedOrder,
    setSelectedOrder,
    walletData,
    setWalletData,
    sidebar,
    setSidebar,
    fetchWalletData,
    userProfile,
    userStats,
    getCountdown,
    isMobile,
    time: formatTime(time),
    isOpen,
    setIsOpen,
    depositAddress,
    setDepositAddress,
    getDepositAddress,
    makeOrderWithAuth,
    selectedOutcomeId,
    setSelectedOutcomeId,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
