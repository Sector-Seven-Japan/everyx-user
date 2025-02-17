"use client";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useState, useEffect } from "react";

export default function Navbar() {
  const { setSelectedMenu, setFilter, walletData } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const [sidebar, setSidebar] = useState(false);

  // Check if the current route is "/menu" and set sidebar to true
  useEffect(() => {
    if (pathname === "/menu") {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
  }, [pathname]);

  return (
    <div className="flex justify-between items-center p-5 bg-[#0E0E0E]">
      <Image
        onClick={() => {
          setSidebar(false);
          setSelectedMenu("Home");
          setFilter("");
          router.push("/home");
        }}
        src="/Images/logo.png"
        className="cursor-pointer"
        alt="Logo image"
        width={25}
        height={25}
      />

      <div className="flex gap-3">
        {walletData.length !== 0 && (
          <div className="text-xs flex flex-col items-end">
            <p className={`${!sidebar ? "text-[#585858]" : "text-white"}`}>
              Current Cash Balance
            </p>
            <p className={`${!sidebar ? "text-[#585858]" : "text-white"}`}>
              {walletData[0]?.currency}T {walletData[0]?.balance}
            </p>
          </div>
        )}

        <Image
          className="cursor-pointer"
          onClick={() => {
            setSidebar(!sidebar);
            router.push(sidebar ? "/home" : "/menu");
          }}
          src={sidebar ? "/Images/cross.svg" : "/Images/menu.svg"}
          alt="Menu Icon"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}
