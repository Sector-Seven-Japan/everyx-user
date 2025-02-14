"use client";
import { AppContext } from "@/app/Context/AppContext";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import HeadingSlider from "@/components/HeadingSlider";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

// Define TraderInfo interface to match the expected structure
interface TraderInfo {
  estimated_probability: number;
  max_leverage: number;  // Added max_leverage
  estimated_payout: number;  // Added estimated_payout
}

// Define Outcome interface to match the expected structure
interface Outcome {
  _id: string;
  name: string;
  trader_info: TraderInfo;
}

// Define Event interface to match the Outcome type
interface Event {
  _id: string;
  event_images_url: string[];
  name: string;
  description: string;
  category: { 
    name: string; 
  };
  ends_at: string;
  outcomes: Outcome[];  // Use Outcome[] here
}

export default function EventCategoryPage() {
  const { filter, setFilter,API_BASE_URL ,setIsLoading,search,setSearch} = useContext(AppContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [heading, setHeading] = useState("");
  const { slug } = useParams();

  // Type guard to ensure slug is a string
  const safeSlug = Array.isArray(slug) ? slug[0] : slug;

  const fetchEventsOfCategory = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search-events?tags=${safeSlug}&sortby=relevance`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEvents(data || []);

      const headingResponse = await fetch(
        `${API_BASE_URL}/collections/${safeSlug}`
      );
      const headingData = await headingResponse.json();
      setHeading(headingData.name);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setEvents([]);
    }
  }, [safeSlug,API_BASE_URL]);

  useEffect(() => {
    fetchEventsOfCategory();
    setIsLoading(false)
  }, [fetchEventsOfCategory,setIsLoading]);

  return (
    <div>
      <Navbar home={"Home"} />
      <HeadingSlider setFilter={setFilter} filter={filter} />
      <SearchBar search={search} setSearch={setSearch} />
      <div className="p-5 flex flex-col gap-6">
        <h1 className="text-xl">{heading}</h1>
        {events.length!==0 ? events.map((item) => (
          <CategoryCard key={item._id} item={item} />
        )):(
          <div className="text-white h-[300px] flex items-center justify-center">No Result found</div>
        )}
      </div>
      <Footer />
    </div>
  );
}
