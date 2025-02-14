"use client";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import Footer from "@/components/Footer";
import HeadingSlider from "@/components/HeadingSlider";
import ImageSlider from "@/components/ImageSlider";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import TopCategories from "@/components/TopCategoies";
import Category from "@/components/Category";
import CategoryCard from "@/components/CategoryCard"; // Add this import

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
  const { filter, setFilter, setIsOrderMade, API_BASE_URL, categories,search,setSearch,setIsLoading} = useContext(AppContext);
  const [searchData, setSearchData] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(false);
    setIsOrderMade(false);
  }, [setIsOrderMade]);

  useEffect(() => {
    // Only search if search term is not empty
    if (search.trim()) {
      const fetchSearchResults = async () => {
        try {
          setIsSearching(true);
          const response = await fetch(
            `${API_BASE_URL}/search-events?sortby=relevance&keyword=${encodeURIComponent(search)}`
          );

          if (!response.ok) {
            throw new Error('Search failed');
          }

          const data = await response.json();
          console.log(data);
          setSearchData(data);
        } catch (error) {
          console.error("Search error:", error);
          setSearchData([]);
        } finally {
          setIsSearching(false);
        }
      };

      // Debounce the search to prevent too many API calls
      const debounceTimer = setTimeout(fetchSearchResults, 500);

      // Cleanup function
      return () => clearTimeout(debounceTimer);
    } else {
      // Clear search results if search is empty
      setSearchData([]);
    }
  }, [search, API_BASE_URL]);

  return (
    <div className="w-full">
      <Navbar home="Home" />
      <HeadingSlider setFilter={setFilter} filter={filter} />
      <ImageSlider />
      <SearchBar search={search} setSearch={setSearch} />
      
      {!search && <TopCategories />}
      
      {!search && categories.map((item, index) => {
        if (typeof item === "object") {
          return <Category key={index} item={item} />;
        }
        return null;
      })}
      
      <div className="p-5">
        {isSearching ? (
          <div className="text-center text-gray-500 h-52 flex items-center justify-center">Searching...</div>
        ) : searchData.length > 0 ? (
          searchData.map((item) => (
            <CategoryCard key={item._id} item={item} />
          ))
        ) : search.trim() ? (
          <div className="text-center text-gray-500 h-52 flex items-center justify-center">No results found</div>
        ) : null}
      </div>
      
      <Footer />
    </div>
  );
}