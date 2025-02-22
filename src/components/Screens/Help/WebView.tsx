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
      <div className="bg-[#0E0E0E] w-full min-h-screen text-white">
        {/* Main container with responsive width and padding */}
        <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-12">
          <h1 className="font-medium text-[29px] md:text-[35px] lg:text-[40px] text-center mb-10 md:mb-16">
            Q & A
          </h1>

          {/* FAQ Container */}
          <div className="max-w-[900px] mx-auto">
            {categories.map((category, catIndex) => (
              <div 
                key={catIndex} 
                className="mb-10 md:mb-16 bg-[rgba(255,255,255,0.02)] rounded-lg overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className="flex justify-between items-center cursor-pointer 
                  text-[16px] md:text-[18px] font-semibold px-5 md:px-8 py-4 md:py-6
                  hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300"
                  onClick={() => toggleCategory(catIndex)}
                >
                  <p className="text-[#00FFB8]">{category.category}</p>
                  {openCategories[catIndex] ? (
                    <FaChevronUp size={18} className="text-[#00FFB8]" />
                  ) : (
                    <FaChevronDown size={18} className="text-[#00FFB8]" />
                  )}
                </div>

                {/* Questions and Answers */}
                {openCategories[catIndex] && (
                  <div className="mt-2 md:mt-3">
                    {category.faqs.map((item, qIndex) => (
                      <div key={qIndex} className="border-t border-[rgba(255,255,255,0.05)]">
                        {/* Question */}
                        <div
                          className={`flex justify-between items-center cursor-pointer 
                          text-[14px] md:text-[16px] px-5 md:px-8 py-4 md:py-5
                          transition-all duration-300 hover:bg-[rgba(255,255,255,0.03)]
                          ${
                            openQuestions[catIndex]?.[qIndex]
                              ? "bg-[rgba(255,255,255,0.05)]"
                              : "bg-transparent"
                          }`}
                          onClick={() => toggleQuestion(catIndex, qIndex)}
                        >
                          <p
                            className={`flex-1 pr-4 ${
                              openQuestions[catIndex]?.[qIndex]
                                ? "text-white"
                                : "text-gray-400"
                            }`}
                          >
                            Q . {item.question}
                          </p>
                          {openQuestions[catIndex]?.[qIndex] ? (
                            <FaChevronUp 
                              size={15} 
                              className="flex-shrink-0 text-white transition-transform duration-300" 
                            />
                          ) : (
                            <FaChevronDown 
                              size={15} 
                              className="flex-shrink-0 text-gray-400 transition-transform duration-300" 
                            />
                          )}
                        </div>

                        {/* Answer */}
                        {openQuestions[catIndex]?.[qIndex] && (
                          <div className="px-5 md:px-8 py-4 md:py-6 bg-[rgba(255,255,255,0.02)]">
                            <div className="text-[13px] md:text-[15px] opacity-80 
                              space-y-3 text-justify leading-relaxed md:leading-loose">
                              {htmlToPlainText(item.answer)
                                .split("\n")
                                .filter(Boolean)
                                .map((para, i) => (
                                  <p 
                                    key={i}
                                    className="text-gray-300"
                                  >
                                    {para}
                                  </p>
                                ))}
                            </div>
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
      </div>
      <Footer />
    </>
  );
};

export default Help;