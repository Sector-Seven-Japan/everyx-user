"use client";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useState, useEffect } from "react";

export default function Navbar() {
  const { setSelectedMenu, setFilter, walletData, authToken } =
    useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname(); // Get the current route
  const [sidebar, setSidebar] = useState(false);
  const [newWalletBalance, setNewWalletBalance] = useState<number>(0);

  // Check if the current route is "/menu" and set sidebar to true
  useEffect(() => {
    if (authToken && pathname === "/") {
      router.push("/home");
    }
    if (pathname === "/menu") {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
  }, [pathname]);

  const getNewWalletBalance = async () => {
    try {
      const response = await fetch(
        "https://everyx.weseegpt.com/wallets/balance",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNewWalletBalance(data?.balance || 0);
      }
    } catch (error) {
      console.log("Error fetching the new Wallet balance", error);
    }
  };

  useEffect(() => {
    if (authToken) {
      getNewWalletBalance();
    }
  }, [authToken]);

  return (
    <div className="flex justify-between items-center p-5 bg-[#0E0E0E]">
      {pathname === "/" ? (
        <Image
          src="/Images/logo_grey.png"
          className="cursor-pointer"
          alt="Logo image"
          width={25}
          height={25}
        />
      ) : (
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
      )}

      {pathname !== "/" ? (
        <div className="flex gap-3">
          {authToken !== null ? (
            <div className="text-xs flex flex-col items-end">
              <p className={`${!sidebar ? "text-[#585858]" : "text-white"}`}>
                Current Cash Balance
              </p>
              <p className={`${!sidebar ? "text-[#585858]" : "text-white"}`}>
                USDT {walletData[0]?.balance || newWalletBalance}
              </p>
            </div>
          ) : (
            ""
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
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => {
              router.push("/auth/signup");
            }}
            className="text-[13px] text-[#d9d9d95e]"
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              router.push("/login1");
            }}
            className="text-[13px] bg-[#d9d9d921] px-5 py-[6px] rounded-md"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}
