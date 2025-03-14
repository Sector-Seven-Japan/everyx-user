"use client";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useEffect } from "react";

export default function Navbar() {
  const {
    setSelectedMenu,
    setFilter,
    walletData,
    authToken,
    sidebar,
    setSidebar,
    setAuthToken,
    setWalletData,
  } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authToken) {
      setAuthToken("");
      setWalletData([]);
    }
  }, []);


  return (
    <div className="flex justify-between items-center p-5 bg-[#0e0e0e] fixed top-0 w-full z-20">
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
            router.push("/trade");
          }}
          src="/Images/logo_grey.png"
          className="cursor-pointer"
          alt="Logo image"
          width={25}
          height={25}
        />
      )}

      {pathname === "/" ? (
        authToken ? (
          <button
            onClick={() => {
              router.push("/trade");
            }}
            className="text-[13px] bg-[#d9d9d921] px-5 py-[6px] rounded-md"
          >
            Home
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                router.push("/login");
              }}
              className="text-[13px] text-[#d9d9d95e]"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                router.push("/login");
              }}
              className="text-[13px] bg-[#d9d9d921] px-5 py-[6px] rounded-md"
            >
              Login
            </button>
          </div>
        )
      ) : (
        <div className="flex gap-3">
          {authToken ? (
            <div className="text-xs flex flex-col items-end">
              <p className={`${!sidebar ? "text-[#585858]" : "text-white"}`}>
                Current Cash Balance
              </p>
              <p className={`${!sidebar ? "text-[#585858]" : "text-white"}`}>
                USDT {walletData[0]?.balance}
              </p>
            </div>
          ) : (
            ""
          )}

          {sidebar ? (
            <Image
              onClick={() => setSidebar(false)}
              className="cursor-pointer"
              src={"/Images/cross.svg"}
              alt="Menu Icon"
              width={20}
              height={20}
            />
          ) : (
            <Image
              onClick={() => setSidebar(true)}
              className="cursor-pointer"
              src={"/Images/menu.svg"}
              alt="Menu Icon"
              width={20}
              height={20}
            />
          )}
        </div>
      )}
    </div>
  );
}
