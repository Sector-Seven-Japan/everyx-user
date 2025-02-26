"use client";
import { useContext, useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { AppContext } from "@/app/Context/AppContext";

export default function TopCategories() {
  const [topCategoies, setTopCategories] = useState([]);
  const {API_BASE_URL} = useContext(AppContext);

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
    }
  };

  useEffect(() => {
    fetchTopCategories();
  }, []);


  return (
    <div className="px-5 py-8 md:px-[76px]">
      <div className="flex justify-between">
        <h1 className="text-xl mb-6 md:mb-10 md:text-[25px] md:mt-20">Top Topics</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-x-5">
        {topCategoies.slice(0,3).map((item, index) => {
          return <CategoryCard key={index} item={item} showChart={true} showPrediction={true} showTime={true}/>;
        })}
      </div>
    </div>
  );
}
