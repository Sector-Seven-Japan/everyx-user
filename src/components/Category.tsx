"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import CategoryCard from "./CategoryCard";
import { AppContext } from "@/app/Context/AppContext";

// Define interfaces
interface CategoryItem {
  slug: string;
  name: string;
}

// Correct TraderInfo structure
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

interface Event {
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

interface CategoryProps {
  item: CategoryItem;
}

export default function Category({ item }: CategoryProps) {
  const { setFilter, API_BASE_URL } = useContext(AppContext);
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);

  // Use useCallback to avoid re-creating the function every render
  const fetchEventsOfCategory = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search-events?tags=${item?.slug}&sortby=relevance`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setEvents(data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setEvents([]);
    }
  }, [item?.slug, API_BASE_URL]); // Add `item?.slug` as a dependency

  useEffect(() => {
    fetchEventsOfCategory();
  }, [fetchEventsOfCategory]); // Use `fetchEventsOfCategory` as a dependency

  if (!events.length) {
    return null;
  }

  return (
    <div className="px-5 py-8">
      <div className="flex justify-between">
        <h1 className="text-xl mb-6">{item?.name}</h1>
        <button
          onClick={() => {
            setFilter(item?.name);
            router.push(`/explore/category/${item?.slug}`);
          }}
          className="bg-[#161616] h-9 px-5 mb-8 rounded-md text-[10px]"
        >
          View ALL
        </button>
      </div>
      <div className="flex flex-col gap-6">
        {events.slice(0,3).map((eventItem) => (
          <CategoryCard key={eventItem._id} item={eventItem} />
        ))}
      </div>
    </div>
  );
}
