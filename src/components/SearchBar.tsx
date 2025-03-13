import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import LiveIcon from "./LiveIcon";

interface searchProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function SearchBar({ search, setSearch }: searchProps) {
  const [isShadowBlinking, setIsShadowBlinking] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set up the blinking effect for the shadow only
  useEffect(() => {
    const interval = setInterval(() => {
      setIsShadowBlinking((prev) => !prev);
    }, 500); // Toggle every 1 second

    return () => clearInterval(interval);
  }, []);

  // Fixed scroll function
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentScroll = container.scrollLeft;
      const scrollAmount = 200; // Increased scroll amount for more noticeable movement

      container.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const categories = [
    "ALL",
    "Recommended",
    "Breaking news",
    "Trump Inaugration",
    "Sports",
    "Technology",
    "Finance",
    "Entertainment",
  ];

  return (
    <div className="flex md:items-center mt-5 md:mt-10 gap-2 flex-col md:flex-row items-start px-5 md:px-0">
      <div className="flex items-center gap-5 md:w-[60%] w-full">
        <div className="flex items-center gap-4">
          {/* <div
            className={`h-3 w-3 bg-[#ff4400] rounded-full ${
              isShadowBlinking ? "shadow-[0_0_15px_5px_#ff4400]" : ""
            }`}
          ></div> */}
          <LiveIcon size="md" />
          <p className="text-[#FF4400] font-bold md:text-[1.1vw] md:tracking-[3px]">
            LIVE
          </p>
        </div>
        <div className="flex w-full items-center gap-5 py-2 md:py-[8.5px] rounded-lg bg-transparent border border-[#ffffff17]">
          {/* Search Icon */}
          <div className="pl-4">
            <Image
              src="/Images/search.svg"
              alt="Search icon"
              width={18}
              height={18}
            />
          </div>

          {/* Search Input */}
          <input
            type="text"
            className="text-[13px] md:text-[16px] bg-transparent outline-none flex-1 text-[#454545] placeholder-[#454545] placeholder:text-[14px] md:placeholder:text-[1.1vw]"
            placeholder="Search by market"
            aria-label="Search by market"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Logo Icon */}
          <div className="pr-4">
            <Image
              src="/Images/logo_grey.png"
              alt="EveryX logo"
              height={20}
              width={20}
              className="hidden md:block"
            />
          </div>
        </div>
      </div>

      {/* Categories section with scrollbar and hover button */}
      <div
        className="md:w-[40%] relative w-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative flex items-center">
          {/* Container with fixed width and proper overflow control */}
          <div className="relative w-full overflow-hidden">
            {/* Scrollable container with padding to account for button */}
            <div
              ref={scrollContainerRef}
              className="flex gap-2 overflow-x-auto py-2 pr-12 no-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {categories.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-[#1a1a1a] px-7 py-2 md:py-3 rounded-md text-[12px] md:text-[14px] font-bold whitespace-nowrap cursor-pointer hover:bg-[#252525]"
                >
                  {item}
                </div>
              ))}
              {/* Added extra spacing to ensure good scrolling experience */}
              <div className="w-8 flex-shrink-0"></div>
            </div>

            {/* Gradient overlay positioned to extend behind the button */}
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-[#0e0e0e] to-transparent pointer-events-none"></div>
          </div>

          {/* Scroll arrow indicator that only appears on hover */}
          <button
            onClick={() => scrollRight()}
            className={`absolute -right-2 top-1/2 -translate-y-1/2 bg-[#343434] h-6 w-6 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-opacity duration-300 z-10 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Scroll right"
          >
            <img
              className="h-[8px] w-[8px] md:h-[0.7vw] md:w-[0.7vw]"
              src="/Images/rightarrow.svg"
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
}
