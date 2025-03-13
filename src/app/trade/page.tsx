"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import Footer from "@/components/Footer";
import HeadingSlider from "@/components/HeadingSlider";
import ImageSlider from "@/components/ImageSlider";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import CategoryCard from "@/components/CategoryCard";
import Category from "@/components/Category";
import LoadingPage from "@/components/LoadingPage";
import TopCategories from "@/components/TopCategoies";

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

interface SearchResultItem {
  _id: string;
  name: string;
  description: string;
  category: {
    name: string;
  };
  ends_at: string;
  outcomes: Outcome[];
  event_images_url: string[];
}

export default function Home() {
  const {
    filter,
    setFilter,
    setIsOrderMade,
    API_BASE_URL,
    search,
    setSearch,
    setIsLoading,
    categories,
    fetchingData,
    setSelectedOutcomeId
  } = useContext(AppContext);
  const [searchData, setSearchData] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    setSelectedOutcomeId("");
    setIsLoading(false);
    setIsOrderMade(false);
  }, [setIsOrderMade]);

  useEffect(() => {
    if (search.trim()) {
      const fetchSearchResults = async () => {
        try {
          setIsSearching(true);
          const response = await fetch(
            `${API_BASE_URL}/search-events?sortby=relevance&keyword=${encodeURIComponent(
              search
            )}`
          );

          if (!response.ok) {
            throw new Error("Search failed");
          }

          const data = await response.json();
          setSearchData(data);
        } catch (error) {
          console.error("Search error:", error);
          setSearchData([]);
        } finally {
          setIsSearching(false);
        }
      };

      const debounceTimer = setTimeout(fetchSearchResults, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchData([]);
    }
  }, [search, API_BASE_URL]);

  return fetchingData == false ? (
    <div>
      <Navbar />
      <div className="w-full max-w-screen-2xl mx-auto md:px-10 lg:px-16 xl:px-20">
        <HeadingSlider setFilter={setFilter} filter={filter} />
        <ImageSlider />
        <SearchBar search={search} setSearch={setSearch} />

        {!search && <TopCategories />}

        {!search &&
          categories.map((item, index) => {
            if (typeof item === "object") {
              return <Category key={index} item={item} />;
            }
            return null;
          })}

        <div className="p-3">
          {isSearching ? (
            <div className="text-center text-gray-500 h-52 flex items-center justify-center">
              Searching...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-12 md:mt-10">
              {searchData.length > 0 ? (
                searchData.map((item) => (
                  <CategoryCard
                    key={item._id}
                    item={item}
                  />
                ))
              ) : search.trim() ? (
                <div className="text-white h-[100px] flex items-center justify-center">
                  No Result found
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <LoadingPage />
  );
}
