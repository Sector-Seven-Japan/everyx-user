"use client";
import { useContext, useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { AppContext } from "@/app/Context/AppContext";
import LoadingPage from "./LoadingPage";

export default function TopCategories() {
  const [topCategoies, setTopCategories] = useState([]);
  const { API_BASE_URL } = useContext(AppContext);

  const [fetchingData, setFetchingData] = useState(true);

  const fetchTopCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events?purpose=top&pagination=false&sortby=newest`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTopCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setTopCategories([]);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchTopCategories();
  }, []);

  return fetchingData == false ? (
    <div className="px-5 py-8 md:px-0">
      <div className="flex justify-between">
        <h1 className="text-xl mb-6 md:mb-10 md:text-[1.5vw] md:tracking-[1.5px] md:mt-20 inter font-[700]">
          TOP Topics
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {topCategoies.slice(0, 4).map((item, index) => {
          return (
            <CategoryCard
              key={index}
              item={item}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <LoadingPage />
  );
}
