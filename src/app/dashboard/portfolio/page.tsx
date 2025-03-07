"use client";

import React, { useContext, useEffect, useState } from "react";

import CurrentCashBalanceCard from "@/components/CurrentCashBalance";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppContext } from "@/app/Context/AppContext";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";
import CashWithdrawalCategoriesMobile from "@/components/CashWithdrawalCategoriesMobile";
import HeadingSlider from "@/components/HeadingSlider";

interface BetEntry {
  id: string;
  question: string;
  wagered_at: string;
  status: "open" | "closed";
  ends_at: string;
  position: {
    id: string;
    event_outcome_id: string;
    event_outcome_name: string;
    pledge: number;
    wager: number;
    leverage: number;
    indicative_payout: number;
    indicative_return: number;
  }[];
}

const Portfolio: React.FC = () => {
  const { setIsLoading } = useContext(AppContext);
  const [bets, setBets] = useState<BetEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const { API_BASE_URL, authToken, isMobile } = useContext(AppContext);
  const router = useRouter();
  const getWagerData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/wager-position-events?pagination=true&page=1&limit=10&status=active`,
        {
          method: "GET", // ✅ Change from POST to GET
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch wager data: ${response.status}`);
      }

      const data = await response.json();

      interface WagerData {
        event_id: string;
        event?: { name: string; ends_at: string };
        wagered_at: string;
        event_status: "open" | "closed";
        positions: {
          id: string;
          event_outcome_id: string;
          event_outcome?: { name: string }; // ✅ Added optional chaining
          pledge: number;
          wager: number;
          leverage: number;
          indicative_payout: number;
          indicative_return: number;
        }[];
      }

      const formattedBets: BetEntry[] = data.map((item: WagerData) => ({
        id: item.event_id,
        question: item.event?.name || "Unknown Event",
        wagered_at: new Date(item.wagered_at).toLocaleString(),
        status: item.event_status,
        ends_at: item.event?.ends_at,
        position: item.positions.map((pos) => ({
          id: pos.id,
          event_outcome_id: pos.event_outcome_id,
          event_outcome_name: pos.event_outcome?.name || "Unknown Outcome", // ✅ Corrected access
          pledge: pos.pledge,
          wager: pos.wager,
          leverage: pos.leverage,
          indicative_payout: pos.indicative_payout,
          indicative_return: pos.indicative_return,
        })),
      }));

      setBets(formattedBets);
      console.log(formattedBets);
    } catch (error) {
      console.error("Error fetching wager data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      getWagerData();
    }
  }, [authToken]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  function timeRemaining(targetTimeStr: string) {
    // Convert input string to a UTC Date object
    const targetTime = new Date(targetTimeStr);

    // Get current time in UTC
    const now = new Date();

    // Calculate the difference in milliseconds
    let diff = targetTime.getTime() - now.getTime();

    // If the time has already passed, return "Expired"
    if (diff <= 0) {
      return "Expired";
    }

    // Convert milliseconds to days, hours, and minutes
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));

    // Format the output
    return `${days} Day${days !== 1 ? "s" : ""} and ${hours}h${minutes}m`;
  }

  const filteredBets = bets.filter((bet) => {
    const isExpired = new Date(bet.ends_at) < new Date();

    if (filter === "Active") return !isExpired; // Show only active bets
    if (filter === "Success")
      return (
        isExpired && bet.position.some((pos) => pos.indicative_return > 100)
      ); // Show only successful expired bets
    if (filter === "Failed")
      return (
        isExpired && bet.position.some((pos) => pos.indicative_return <= 100)
      ); // Show only failed expired bets

    return true; // Show all bets
  });

  return (
    <>
      <Navbar />

      {isMobile ? (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white px-5 pt-4 pb-5">
          <CurrentCashBalanceCard />
          <div className="my-10">
            <CashWithdrawalCategoriesMobile />
          </div>

          <div className="flex justify-end items-center gap-4">
            <p className="text-[14px] text-center font-semibold">Results :</p>
            <div className="flex w-36 bg-[rgba(255,255,255,0.1)] rounded-md justify-between items-center px-2 py-1">
              <div className="text-[14px]">{filter}</div>
              <div
                className="flex justify-center items-center flex-col gap-1 cursor-pointer"
                onClick={() => {
                  setOpen((con) => !con);
                }}
              >
                <div className="w-[20px] h-[1.5px] bg-white"></div>
                <div className="w-[18px] h-[1.5px] bg-white"></div>
                <div className="w-[12px] h-[1.5px] bg-white"></div>
              </div>
            </div>
          </div>

          <div
            className={`w-24 flex flex-col absolute right-10 mt-3 ${
              open ? "block" : "hidden"
            }`}
          >
            <div
              onClick={() => {
                setFilter("All");
                setOpen(false);
              }}
              className="bg-transparent hover:bg-white/10 transition duration-300  pl-5 text-[14px] cursor-pointer"
            >
              All
            </div>
            <div
              onClick={() => {
                setFilter("Active");
                setOpen(false);
              }}
              className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
            >
              Active
            </div>
            <div
              onClick={() => {
                setFilter("Success");
                setOpen(false);
              }}
              className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
            >
              Success
            </div>
            <div
              onClick={() => {
                setFilter("Failed");
                setOpen(false);
              }}
              className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
            >
              Failed
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-8 mt-24">
            {filteredBets.length > 0 ? (
              filteredBets.map((bet) => {
                const isExpired = new Date(bet.ends_at) < new Date();

                // If event is expired, display each position separately
                if (isExpired) {
                  return bet.position.map((pos) => (
                    <div key={pos.id} className="space-y-3 mb-5">
                      {/* Status Indicator */}
                      <div className="inline-block">
                        {pos.indicative_return > 100 ? (
                          <span className="px-3 py-1 rounded text-sm text-[#2dc198] border border-[#2dc198]">
                            Success
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded text-sm text-orange-500 border border-orange-500">
                            Failed
                          </span>
                        )}
                      </div>

                      {/* Event Question */}
                      <h2
                        onClick={() => {
                          setIsLoading(true);
                          router.push(`/events/${bet.id}`);
                        }}
                        className="text-white text-lg font-medium cursor-pointer"
                      >
                        {bet.question}
                      </h2>

                      {/* Ended Time */}
                      <div className="flex justify-between items-center">
                        <div className="text-gray-500 text-sm">
                          {format(new Date(bet.ends_at), "MMM d yyyy HH:mm")}
                        </div>
                        <div
                          className={
                            pos.indicative_return > 100
                              ? "text-[#2dc198] text-sm"
                              : "text-orange-500 text-sm"
                          }
                        >
                          $
                          {Number(pos.indicative_payout - pos.wager).toFixed(2)}
                        </div>
                      </div>

                      {/* Dotted Line Separator */}
                      <div>
                        <svg
                          width="380"
                          height="9"
                          viewBox="0 0 380 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#filter0_d_633_3647)">
                            <line
                              x1="4"
                              y1="0.5"
                              x2="376"
                              y2="0.5"
                              stroke="url(#paint0_linear_633_3647)"
                              stroke-opacity="0.54"
                              stroke-dasharray="2 2"
                              shape-rendering="crispEdges"
                            />
                          </g>
                          <defs>
                            <filter
                              id="filter0_d_633_3647"
                              x="0"
                              y="0"
                              width="380"
                              height="9"
                              filterUnits="userSpaceOnUse"
                              color-interpolation-filters="sRGB"
                            >
                              <feFlood
                                flood-opacity="0"
                                result="BackgroundImageFix"
                              />
                              <feColorMatrix
                                in="SourceAlpha"
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                result="hardAlpha"
                              />
                              <feOffset dy="4" />
                              <feGaussianBlur stdDeviation="2" />
                              <feComposite in2="hardAlpha" operator="out" />
                              <feColorMatrix
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                              />
                              <feBlend
                                mode="normal"
                                in2="BackgroundImageFix"
                                result="effect1_dropShadow_633_3647"
                              />
                              <feBlend
                                mode="normal"
                                in="SourceGraphic"
                                in2="effect1_dropShadow_633_3647"
                                result="shape"
                              />
                            </filter>
                            <linearGradient
                              id="paint0_linear_633_3647"
                              x1="4"
                              y1="1.5"
                              x2="376"
                              y2="1.5"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stop-color="#0E0E0E" />
                              <stop offset="0.495" stop-color="#C9C9C9" />
                              <stop offset="1" stop-color="#0E0E0E" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  ));
                }

                // If event is still active, display all positions under the same event
                return (
                  <div key={bet.id} className="space-y-3 mb-5">
                    {/* Status Indicator */}
                    <div className="inline-block">
                      <span className="px-3 py-1 rounded text-sm border-[#5dff00] border text-[#5dff00]">
                        Active
                      </span>
                    </div>

                    {/* Event Question */}
                    <h2
                      onClick={() => {
                        setIsLoading(true);
                        router.push(`/events/${bet.id}`);
                      }}
                      className="text-white text-lg font-medium cursor-pointer"
                    >
                      {bet.question}
                    </h2>

                    {/* Grouped Positions for Active Events */}
                    <div className="mt-4">
                      <h3 className="text-gray-300 text-sm font-semibold">
                        Bets Placed:
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {bet.position.map((pos) => (
                          <li
                            onClick={() => {
                              setIsLoading(true);
                              router.push(`/wager/${pos?.id}`);
                            }}
                            key={pos.id}
                            className="bg-white/10 p-3 rounded-md flex justify-between items-center"
                          >
                            <span className="text-white text-sm">
                              {pos.event_outcome_id} : {pos.event_outcome_name}
                            </span>
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[#5dff00] font-semibold">
                                $ {pos.pledge.toFixed(2)}{" "}
                                <span className="text-[9px] text-[#5dff00]">
                                  (USDT)
                                </span>
                              </span>

                              <span className="text-[#b27c25] font-semibold">
                                x{pos.leverage.toFixed(1)}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {/* Time Remaining */}
                      <div className="text-[12px] text-[#2dc198] flex items-center gap-1 mt-5">
                        <div>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_658_36693)">
                              <path
                                d="M7.60094 0.921875C3.40973 0.921875 0 4.15641 0 8.13202C0 12.1079 3.40973 15.3422 7.60094 15.3422C11.7921 15.3422 15.2019 12.1079 15.2019 8.13202C15.2019 4.15641 11.7921 0.921875 7.60094 0.921875ZM7.60094 13.6254C4.40774 13.6254 1.80977 11.1613 1.80977 8.13202C1.80977 5.103 4.40774 2.63859 7.60094 2.63859C10.7941 2.63859 13.3921 5.103 13.3921 8.13202C13.3921 11.1613 10.7941 13.6254 7.60094 13.6254Z"
                                fill="#00FFB8"
                              />
                              <path
                                d="M7.67494 4.18164C7.29459 4.18164 6.98625 4.47407 6.98625 4.83492V7.79243L4.78771 9.87794C4.51868 10.1329 4.51868 10.5466 4.78771 10.8019C5.05665 11.0569 5.4927 11.0569 5.7617 10.8019L8.36368 8.3337V7.66434V4.83492C8.36368 4.47407 8.05534 4.18164 7.67494 4.18164Z"
                                fill="#00FFB8"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_658_36693">
                                <rect
                                  width="15.2019"
                                  height="14.4203"
                                  fill="white"
                                  transform="translate(0 0.921875)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        {timeRemaining(bet.ends_at)}
                      </div>
                    </div>

                    {/* Dotted Line Separator */}
                    <div>
                      <svg
                        width="380"
                        height="9"
                        viewBox="0 0 380 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g filter="url(#filter0_d_633_3647)">
                          <line
                            x1="4"
                            y1="0.5"
                            x2="376"
                            y2="0.5"
                            stroke="url(#paint0_linear_633_3647)"
                            stroke-opacity="0.54"
                            stroke-dasharray="2 2"
                            shape-rendering="crispEdges"
                          />
                        </g>
                        <defs>
                          <filter
                            id="filter0_d_633_3647"
                            x="0"
                            y="0"
                            width="380"
                            height="9"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            />
                            <feColorMatrix
                              in="SourceAlpha"
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                              result="hardAlpha"
                            />
                            <feOffset dy="4" />
                            <feGaussianBlur stdDeviation="2" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix
                              type="matrix"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                            />
                            <feBlend
                              mode="normal"
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow_633_3647"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="effect1_dropShadow_633_3647"
                              result="shape"
                            />
                          </filter>
                          <linearGradient
                            id="paint0_linear_633_3647"
                            x1="4"
                            y1="1.5"
                            x2="376"
                            y2="1.5"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#0E0E0E" />
                            <stop offset="0.495" stop-color="#C9C9C9" />
                            <stop offset="1" stop-color="#0E0E0E" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400">No bets available.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#0E0E0E] w-full min-h-screen text-white relative">
          <div className="px-[20vw]">
            <HeadingSlider filter={filter} setFilter={setFilter} />
            <div className="flex justify-center gap-5 pt-[4.65%]">
              <div className=" text-white px-5  pb-5 flex-1">
                <div className="flex justify-between items-start">
                  <div className="text-[1.6vw] font-regular tracking-[0.3vw]">
                    Results:
                  </div>

                  <div className="flex flex-col items-end  gap-2">
                    <div className="flex w-36 bg-[rgba(255,255,255,0.1)] rounded-md justify-between items-center px-2 py-1">
                      <div className="text-[14px]">{filter}</div>
                      <div
                        className="flex justify-center items-center flex-col gap-1 cursor-pointer"
                        onClick={() => {
                          setOpen((con) => !con);
                        }}
                      >
                        <div className="w-[20px] h-[1.5px] bg-white"></div>
                        <div className="w-[18px] h-[1.5px] bg-white"></div>
                        <div className="w-[12px] h-[1.5px] bg-white"></div>
                      </div>
                    </div>
                    <div
                      className={`w-24 flex flex-col  right-10  ${
                        open ? "block" : "hidden"
                      }`}
                    >
                      <div
                        onClick={() => {
                          setFilter("All");
                          setOpen(false);
                        }}
                        className="bg-transparent hover:bg-white/10 transition duration-300  pl-5 text-[14px] cursor-pointer"
                      >
                        All
                      </div>
                      <div
                        onClick={() => {
                          setFilter("Active");
                          setOpen(false);
                        }}
                        className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
                      >
                        Active
                      </div>
                      <div
                        onClick={() => {
                          setFilter("Success");
                          setOpen(false);
                        }}
                        className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
                      >
                        Success
                      </div>
                      <div
                        onClick={() => {
                          setFilter("Failed");
                          setOpen(false);
                        }}
                        className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
                      >
                        Failed
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" space-y-8 mt-24 ">
                  {filteredBets.length > 0 ? (
                    filteredBets.map((bet) => {
                      const isExpired = new Date(bet.ends_at) < new Date();

                      // If event is expired, display each position separately
                      if (isExpired) {
                        return bet.position.map((pos) => (
                          <div key={pos.id} className="space-y-3 mb-5">
                            {/* Status Indicator */}
                            <div className="inline-block">
                              {pos.indicative_return > 100 ? (
                                <span className="px-3 py-1 rounded text-sm text-[#2dc198] border border-[#2dc198]">
                                  Success
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded text-sm text-orange-500 border border-orange-500">
                                  Failed
                                </span>
                              )}
                            </div>

                            {/* Event Question */}
                            <h2
                              onClick={() => {
                                setIsLoading(true);
                                router.push(`/events/${bet.id}`);
                              }}
                              className="text-white text-lg font-medium cursor-pointer"
                            >
                              {bet.question}
                            </h2>

                            {/* Ended Time */}
                            <div className="flex justify-between items-center">
                              <div className="text-gray-500 text-sm">
                                {format(
                                  new Date(bet.ends_at),
                                  "MMM d yyyy HH:mm"
                                )}
                              </div>
                              <div
                                className={
                                  pos.indicative_return > 100
                                    ? "text-[#2dc198] text-sm"
                                    : "text-orange-500 text-sm"
                                }
                              >
                                $
                                {Number(
                                  pos.indicative_payout - pos.wager
                                ).toFixed(2)}
                              </div>
                            </div>

                            {/* Dotted Line Separator */}
                            <div>
                              <svg
                                width="100%"
                                height="9"
                                viewBox="0 0 793 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g filter="url(#filter0_d_658_36764)">
                                  <line
                                    x1="4"
                                    y1="0.5"
                                    x2="789"
                                    y2="0.5"
                                    stroke="url(#paint0_linear_658_36764)"
                                    stroke-opacity="0.54"
                                    stroke-dasharray="2 2"
                                    shape-rendering="crispEdges"
                                  />
                                </g>
                                <defs>
                                  <filter
                                    id="filter0_d_658_36764"
                                    x="0"
                                    y="0"
                                    width="793"
                                    height="9"
                                    filterUnits="userSpaceOnUse"
                                    color-interpolation-filters="sRGB"
                                  >
                                    <feFlood
                                      flood-opacity="0"
                                      result="BackgroundImageFix"
                                    />
                                    <feColorMatrix
                                      in="SourceAlpha"
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                      result="hardAlpha"
                                    />
                                    <feOffset dy="4" />
                                    <feGaussianBlur stdDeviation="2" />
                                    <feComposite
                                      in2="hardAlpha"
                                      operator="out"
                                    />
                                    <feColorMatrix
                                      type="matrix"
                                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in2="BackgroundImageFix"
                                      result="effect1_dropShadow_658_36764"
                                    />
                                    <feBlend
                                      mode="normal"
                                      in="SourceGraphic"
                                      in2="effect1_dropShadow_658_36764"
                                      result="shape"
                                    />
                                  </filter>
                                  <linearGradient
                                    id="paint0_linear_658_36764"
                                    x1="4"
                                    y1="1.5"
                                    x2="789"
                                    y2="1.5"
                                    gradientUnits="userSpaceOnUse"
                                  >
                                    <stop stop-color="#0E0E0E" />
                                    <stop offset="0.495" stop-color="#C9C9C9" />
                                    <stop offset="1" stop-color="#0E0E0E" />
                                  </linearGradient>
                                </defs>
                              </svg>
                            </div>
                          </div>
                        ));
                      }

                      // If event is still active, display all positions under the same event
                      return (
                        <div key={bet.id} className="space-y-3 mb-5">
                          {/* Status Indicator */}
                          <div className="flex justify-start   items-center gap-5">
                            <span className="px-4 py-1 rounded text-sm border-[#5dff00] border text-[#5dff00]">
                              Active
                            </span>
                            {/* Time Remaining */}
                            <div className="text-[14px] text-[#2dc198] flex items-center gap-1">
                              <div>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_658_36693)">
                                    <path
                                      d="M7.60094 0.921875C3.40973 0.921875 0 4.15641 0 8.13202C0 12.1079 3.40973 15.3422 7.60094 15.3422C11.7921 15.3422 15.2019 12.1079 15.2019 8.13202C15.2019 4.15641 11.7921 0.921875 7.60094 0.921875ZM7.60094 13.6254C4.40774 13.6254 1.80977 11.1613 1.80977 8.13202C1.80977 5.103 4.40774 2.63859 7.60094 2.63859C10.7941 2.63859 13.3921 5.103 13.3921 8.13202C13.3921 11.1613 10.7941 13.6254 7.60094 13.6254Z"
                                      fill="#00FFB8"
                                    />
                                    <path
                                      d="M7.67494 4.18164C7.29459 4.18164 6.98625 4.47407 6.98625 4.83492V7.79243L4.78771 9.87794C4.51868 10.1329 4.51868 10.5466 4.78771 10.8019C5.05665 11.0569 5.4927 11.0569 5.7617 10.8019L8.36368 8.3337V7.66434V4.83492C8.36368 4.47407 8.05534 4.18164 7.67494 4.18164Z"
                                      fill="#00FFB8"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_658_36693">
                                      <rect
                                        width="15.2019"
                                        height="14.4203"
                                        fill="white"
                                        transform="translate(0 0.921875)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>
                              {timeRemaining(bet.ends_at)}
                            </div>
                          </div>

                          {/* Event Question */}
                          <h2
                            onClick={() => {
                              setIsLoading(true);
                              router.push(`/events/${bet.id}`);
                            }}
                            className="text-white text-lg font-medium cursor-pointer"
                          >
                            {bet.question}
                          </h2>

                          {/* Grouped Positions for Active Events */}
                          <div className="mt-4">
                            <h3 className="text-gray-300 text-sm font-semibold">
                              Bets Placed:
                            </h3>
                            <ul className="mt-2 space-y-2">
                              {bet.position.map((pos) => (
                                <li
                                  onClick={() => {
                                    setIsLoading(true);
                                    router.push(`/wager/${pos?.id}`);
                                  }}
                                  key={pos.id}
                                  className="bg-white/10 p-3 rounded-md flex justify-between items-center"
                                >
                                  <span className="text-white text-sm">
                                    {pos.event_outcome_id} :{" "}
                                    {pos.event_outcome_name}
                                  </span>
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="text-[#5dff00] font-semibold">
                                      $ {pos.pledge.toFixed(2)}{" "}
                                      <span className="text-[9px] text-[#5dff00]">
                                        (USDT)
                                      </span>
                                    </span>

                                    <span className="text-[#b27c25] font-semibold">
                                      x{pos.leverage.toFixed(1)}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Dotted Line Separator */}
                          <div>
                            <svg
                              width="100%"
                              height="9"
                              viewBox="0 0 793 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g filter="url(#filter0_d_658_36764)">
                                <line
                                  x1="4"
                                  y1="0.5"
                                  x2="789"
                                  y2="0.5"
                                  stroke="url(#paint0_linear_658_36764)"
                                  stroke-opacity="0.54"
                                  stroke-dasharray="2 2"
                                  shape-rendering="crispEdges"
                                />
                              </g>
                              <defs>
                                <filter
                                  id="filter0_d_658_36764"
                                  x="0"
                                  y="0"
                                  width="793"
                                  height="9"
                                  filterUnits="userSpaceOnUse"
                                  color-interpolation-filters="sRGB"
                                >
                                  <feFlood
                                    flood-opacity="0"
                                    result="BackgroundImageFix"
                                  />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                  />
                                  <feOffset dy="4" />
                                  <feGaussianBlur stdDeviation="2" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_658_36764"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_658_36764"
                                    result="shape"
                                  />
                                </filter>
                                <linearGradient
                                  id="paint0_linear_658_36764"
                                  x1="4"
                                  y1="1.5"
                                  x2="789"
                                  y2="1.5"
                                  gradientUnits="userSpaceOnUse"
                                >
                                  <stop stop-color="#0E0E0E" />
                                  <stop offset="0.495" stop-color="#C9C9C9" />
                                  <stop offset="1" stop-color="#0E0E0E" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-left text-gray-400">
                      No bets available.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="sticky top-20">
                  <CurrentCashBalanceCardWebview />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Portfolio;
