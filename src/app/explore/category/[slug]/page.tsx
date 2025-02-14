"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { AppContext } from "@/app/Context/AppContext";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";

// Updated Event interface
interface TraderInfo {
  estimated_probability: number;
  max_leverage: number;
  estimated_payout: number;
}

interface Outcome {
  _id: string;
  name: string;
  trader_info: TraderInfo;
}

interface Event {
  _id: string;
  event_images_url: string[];
  name: string;
  description: string;
  category: { 
    name: string; 
  };
  ends_at: string;
  outcomes: Outcome[];
}

export default function EventCategoryPage() {
  const { filter, setFilter, findHeadingWithSlug,API_BASE_URL,setIsLoading,search,setSearch } = useContext(AppContext);
  const [events, setEvents] = useState<Event[]>([]);
  const { slug } = useParams();

  // Type guard to ensure slug is a string
  const safeSlug = Array.isArray(slug) ? slug[0] : slug;

  // Use useCallback to memoize the fetch function
  const fetchEventsOfCategory = useCallback(async () => {
    try {
      // Only fetch if safeSlug exists
      if (safeSlug) {
        const response = await fetch(
          `${API_BASE_URL}/search-events?tags=${safeSlug}&sortby=relevance`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEvents(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setEvents([]);
    }
  }, [safeSlug,API_BASE_URL]);

  useEffect(() => {
    fetchEventsOfCategory();
    setIsLoading(false)
  }, [fetchEventsOfCategory,setIsLoading]);
  
  // Safely handle potential undefined slug
  const heading = safeSlug ? findHeadingWithSlug(safeSlug) : '';

  return (
    <div>
      <Navbar home={"Home"} />
      <HeadingSlider setFilter={setFilter} filter={filter} />
      <SearchBar search={search} setSearch={setSearch} />
      <div className="p-5">
        <h1 className="text-xl mb-6">{heading || safeSlug}</h1>
        {events.length!==0? events.map((item) => (
          <CategoryCard key={item._id} item={item} />
        )):(
          <div className="text-white h-[300px] flex items-center justify-center">No Result found</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
