"use client";
import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function ImageSlider() {
  const router = useRouter();
  const { bannerData, setIsLoading } = useContext(AppContext);

  return (
    <div className="w-full bg-[#0E0E0E] relative px-4 md:px-0 md:mt-10">
      {/* Ensure cursor-pointer applies to the entire scrolling area */}
      <div className="flex overflow-x-scroll no-scrollbar snap-x snap-mandatory cursor-pointer">
        {bannerData.map((item, index) => (
          <div
            onClick={() => {
              setIsLoading(true);
              router.push(`/explore/collections/${item?.slug}`);
            }}
            key={index}
            className="relative rounded-2xl overflow-hidden w-full min-w-full h-[120px] md:h-[14vw] border border-[#242424] md:border-0 flex snap-center md:mx-[120px] cursor-pointer"
          >
            <div className="w-2/3 cursor-pointer"></div>
            <div className="h-full w-1/3 relative cursor-pointer">
              <img
                src={item?.image_url}
                alt=""
                className="h-full w-full object-cover cursor-pointer"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 cursor-pointer"></div>
            </div>
            <div className="px-4 md:pl-0 py-3 flex flex-col justify-between md:justify-center absolute h-full top-0 left-0 cursor-pointer">
              <div className="flex items-center gap-4 cursor-pointer">
                <div className="bg-white text-black px-5 py-1 rounded-md text-[12px] md:text-[1.3vw] Zenfont md:py-[0.1vw] md:px-[1vw] cursor-pointer">
                  Events
                </div>
                <img
                  className="w-[15px] h-[15px] md:w-[28px] md:h-[28px] cursor-pointer"
                  src="/Images/logo.png"
                  alt=""
                />
              </div>
              <div>
                <p className="text-[22px] whitespace-nowrap md:text-[3.6vw] Zenfont md:mb-5 cursor-pointer">
                  {item?.name}
                </p>
              </div>
              <div className="flex gap-3 items-center cursor-pointer">
                <div className="w-[23px] h-[23px] bg-[#343434] rounded-full flex justify-center items-center cursor-pointer">
                  <img
                    className="h-[8px]"
                    src="/Images/rightarrow.svg"
                    alt=""
                  />
                </div>
                <p className="text-[#343434] md:text-[1.5vw] cursor-pointer">
                  Check now
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
