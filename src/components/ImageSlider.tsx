"use client"
import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function ImageSlider() {
  const router = useRouter();
  const { bannerData, setIsLoading } = useContext(AppContext);

  return (
    <div className={`w-full bg-[#0E0E0E] relative px-4 md:px-0 md:mt-10`}>
      <div className="flex overflow-x-scroll no-scrollbar cursor-pointer">
        <div className="flex gap-2 pb-2"> {/* Added pb-2 for some bottom spacing */}
          {bannerData.map((item, index) => (
            <div
              onClick={() => {
                setIsLoading(true)
                router.push(`/explore/collections/${item?.slug}`);
              }}
              key={index}
              className="relative rounded-2xl overflow-hidden w-[85%] min-w-[85%] md:min-w-[52%] md:w-[52%] 2xl:min-w-[53%] 2xl:w-[53%] h-[120px] md:h-[9vw] 2xl:h-[8vw] border border-[#242424] flex cursor-pointer"
              style={{ borderBottom: '1px solid #242424' }} // Ensuring the bottom border is visible
            >
              <div className="w-2/3 cursor-pointer"></div>
              <div className="h-full w-1/3 relative cursor-pointer">
                <img
                  src={item?.image_url}
                  alt={item?.title}
                  className="w-full h-full object-cover cursor-pointer"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
              </div>
              <div className="px-4 py-3 flex flex-col justify-between absolute h-full top-0 left-0 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="bg-white text-black px-5 py-1 rounded-sm text-[12px] md:text-[0.9vw] md:px-4 md:py-[3px] Zenfont cursor-pointer">
                    Events
                  </div>
                  <img
                    className="w-[15px] h-[15px] md:w-[20px] md:h-[20px] cursor-pointer"
                    src="/Images/logo.png"
                    alt=""
                  />
                </div>
                <div>
                  <p className="text-[22px] whitespace-nowrap md:text-[1.5vw] Zenfont cursor-pointer">{item?.name}</p>
                </div>
                <div className="flex gap-3 items-center cursor-pointer">
                  <div className="w-[23px] h-[23px] md:w-[1.5vw] md:h-[1.5vw] bg-[#343434] rounded-full flex justify-center items-center cursor-pointer">
                    <img
                      className="h-[8px] w-[8px] md:h-[0.7vw] md:w-[0.7vw]"
                      src="/Images/rightarrow.svg"
                      alt=""
                    />
                  </div>
                  <p className="text-[#343434] cursor-pointer">check now</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
