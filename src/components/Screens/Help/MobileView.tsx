"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AppContext } from "../../../app/Context/AppContext";

const Help: React.FC = () => {
  const { setIsLoading, API_BASE_URL } = useContext(AppContext);
  const [categories, setCategories] = useState<
    { category: string; faqs: { question: string; answer: string }[] }[]
  >([]);

  const [openCategories, setOpenCategories] = useState<boolean[]>([]);
  const [openQuestions, setOpenQuestions] = useState<boolean[][]>([]);

  const getFaqs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching the FAQs:", error);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    getFaqs();
  }, [setIsLoading, API_BASE_URL]);

  useEffect(() => {
    setOpenCategories(categories.map((_, index) => index === 0)); // First category open
    setOpenQuestions(
      categories.map((cat) => new Array(cat.faqs.length).fill(false))
    );
  }, [categories]);

  const toggleCategory = (catIndex: number) => {
    setOpenCategories((prev) =>
      prev.map((open, i) => (i === catIndex ? !open : open))
    );
  };

  const toggleQuestion = (catIndex: number, qIndex: number) => {
    setOpenQuestions((prev) =>
      prev.map((cat, i) =>
        i === catIndex ? cat.map((q, j) => (j === qIndex ? !q : q)) : cat
      )
    );
  };

  // Function to convert HTML to plain text
  // Function to convert HTML to plain text with proper spacing
  const htmlToPlainText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Replace <p> with double line breaks and <br> with a single line break
    return tempDiv.innerHTML
      .replace(/<p>/g, "\n\n") // Double line spacing for <p> tags
      .replace(/<\/p>/g, "") // Remove closing </p> tags
      .replace(/<br\s*\/?>/g, "\n") // Single line spacing for <br> tags
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove any other HTML tags
      .trim();
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white pt-4">
        <h1 className="font-medium text-[29px] text-center mb-10">Q & A</h1>
        <div className="mt-5 font-normal mb-10">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="mb-10">
              <div
                className="flex justify-between items-center cursor-pointer text-[16px] font-semibold px-5"
                onClick={() => toggleCategory(catIndex)}
              >
                <p>{category.category}</p>
                {/* {openCategories[catIndex] ? (
                  <FaChevronUp size={18} color="#fff" />
                ) : (
                  <FaChevronDown size={18} color="#fff" />
                )} */}
              </div>

              {openCategories[catIndex] && (
                <div className="mt-3">
                  {category.faqs.map((item, qIndex) => (
                    <div key={qIndex} className="">
                      <div
                        className={`flex justify-between items-center cursor-pointer text-[14px] border-t border-b border-[rgba(255,255,255,0.05)] px-5 py-3 ${
                          openQuestions[catIndex]?.[qIndex]
                            ? "bg-[rgba(255,255,255,0.05)]"
                            : "bg-transparent"
                        }`}
                        onClick={() => toggleQuestion(catIndex, qIndex)}
                      >
                        <p
                          className={`${
                            openQuestions[catIndex]?.[qIndex]
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        >
                          Q . {item.question}
                        </p>
                        {openQuestions[catIndex]?.[qIndex] ? (
                          <FaChevronUp size={15} color="#fff" />
                        ) : (
                          <FaChevronDown size={15} color="gray" />
                        )}
                      </div>

                      {openQuestions[catIndex]?.[qIndex] && (
                        <div className="mt-2 text-[13px] opacity-80 px-5 space-y-2 text-justify">
                          {htmlToPlainText(item.answer)
                            .split("\n")
                            .filter(Boolean)
                            .map((para, i) => (
                              <p key={i}>{para}</p>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Help;
