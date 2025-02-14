"use client"
import { AppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function ImageSlider() {
  const router = useRouter();
  const { bannerData,setIsLoading } = useContext(AppContext);

  return (
    <div className={`w-full bg-[#0E0E0E] relative px-4`}>
      <div className="flex overflow-x-scroll no-scrollbar">
        <div className="flex gap-3">
          {bannerData.map((item, index) => (
            <div
              onClick={() => {
                setIsLoading(true)
                router.push(`/explore/collections/${item?.slug}`);
              }}
              key={index}
              className="relative rounded-2xl overflow-hidden w-full min-w-[360px] h-[120px] border border-[#242424] flex"
            >
              <div className="w-2/3"></div>
              <div className="h-full w-1/3 relative">
                <img
                  src={item?.image_url}
                  alt={item?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
              </div>
              <div className="px-4 py-3 flex flex-col justify-between absolute h-full top-0 left-0">
                <div className="flex items-center gap-4">
                  <div className="bg-white text-black px-2 py-1 rounded-md text-[12px]">
                    Politics
                  </div>
                  <img
                    className="w-[15px] h-[15px]"
                    src="/images/logo.png"
                    alt=""
                  />
                </div>
                <div>
                  <p className="text-[22px] whitespace-nowrap">{item?.name}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-[23px] h-[23px] bg-[#343434] rounded-full flex justify-center items-center">
                    <img
                      className="h-[8px]"
                      src="/Images/rightarrow.svg"
                      alt=""
                    />
                  </div>
                  <p className="text-[#343434]">check now</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
