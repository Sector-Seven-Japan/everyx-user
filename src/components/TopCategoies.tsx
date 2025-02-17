"use client";
import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";

export default function TopCategories() {
  const [topCategoies, setTopCategories] = useState([]);

  const fetchTopCategories = async () => {
    try {
      const response = await fetch(
        "https://test-api.everyx.io/events?purpose=top&pagination=false&sortby=newest"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTopCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setTopCategories([]);
    }
  };

  useEffect(() => {
    fetchTopCategories();
  }, []);


  return (
    <div className="px-5 py-8">
      <div className="flex justify-between">
        <h1 className="text-xl mb-6">Top Topics</h1>
      </div>
      <div className="flex flex-col gap-6">
        {topCategoies.slice(0,3).map((item, index) => {
          return <CategoryCard key={index} item={item} />;
        })}
      </div>
    </div>
  );
}
