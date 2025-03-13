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
  const {
    filter,
    setFilter,
    findHeadingWithSlug,
    API_BASE_URL,
    setIsLoading,
    search,
    setSearch,
  } = useContext(AppContext);
  const [events, setEvents] = useState<Event[]>([]);
  const { slug } = useParams();
  const [open, setOpen] = useState(false);
  const [filterC, setFilterC] = useState("Time");

  useEffect(()=>{
    setIsLoading(false);
  },[])

  // Type guard to ensure slug is a string
  const safeSlug = Array.isArray(slug) ? slug[0] : slug;

  // Use useCallback to memoize the fetch function
  const fetchEventsOfCategory = useCallback(async () => {
    try {
      // Only fetch if safeSlug exists
      if (safeSlug) {
        setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [safeSlug, API_BASE_URL, setIsLoading]);

  useEffect(() => {
    fetchEventsOfCategory();
  }, [fetchEventsOfCategory]);

  // Safely handle potential undefined slug
  const heading = safeSlug ? findHeadingWithSlug(safeSlug) : "";

  return (
    <div>
      <Navbar />
      <div className="w-full md:px-[10%] 2xl:px-[13%]">
        <HeadingSlider setFilter={setFilter} filter={filter} />
        <SearchBar search={search} setSearch={setSearch} />
        <div className="p-5 md:p-0">
          <div className="flex justify-between md:mb-10 relative">
            <h1 className="text-xl mb-6 md:text-[25px] md:mt-20 inter font-[700] ">
              {heading || safeSlug}
            </h1>
            <div className="flex-col gap-2 absolute top-20 right-0 hidden md:flex">
              <div className="flex w-36 bg-[rgba(255,255,255,0.1)] rounded-md justify-between items-center px-2 py-1">
                <div className="text-[14px]">{filterC}</div>
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
                    setFilterC("Time");
                    setOpen(false);
                  }}
                  className="bg-transparent hover:bg-white/10 transition duration-300  pl-5 text-[14px] cursor-pointer"
                >
                  Time
                </div>
                <div
                  onClick={() => {
                    setFilterC("Chart");
                    setOpen(false);
                  }}
                  className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
                >
                  Chart
                </div>
                <div
                  onClick={() => {
                    setFilterC("Prediction view");
                    setOpen(false);
                  }}
                  className="bg-transparent hover:bg-white/10 transition duration-300 pl-5 text-[14px] cursor-pointer"
                >
                  Prediction view
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-12">
            {events.length !== 0 ? (
              events.map((item) => (
                <div className="" key={item._id}>
                  <CategoryCard
                    item={item}
                  />
                </div>
              ))
            ) : (
              <div className="text-white h-[100px] justify-center">
                No Result found
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
