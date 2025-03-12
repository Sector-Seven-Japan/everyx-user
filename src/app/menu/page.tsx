"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import "./menu.css";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useDisconnect } from "wagmi";

export default function Menu() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const {
    selectedMenu,
    setSelectedMenu,
    setSidebar,
    setIsLoading,
    API_BASE_URL,
    setAuthToken,
    setWalletData,
  } = useContext(AppContext);
  const [languageState, setLanguageState] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const { authToken } = useContext(AppContext);

  const navbarItems = isLoggedIn
    ? [
        { name: "Home", link: "/trade" },
        { name: "Portfolio", link: "/dashboard/portfolio" },
        { name: "Profile", link: "/profile" },
        { name: "Message", link: "/notification" },
        { name: "Mission", link: "/trade", disabled: true },
        { name: "Settings", link: "/setting" },
        { name: "Help", link: "/help" },
      ]
    : [{ name: "Help", link: "/help" }];

  const handleLogoutUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tokens`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response);

      await signOut({ redirect: false });

      setAuthToken("");
      setWalletData([]);
      document.cookie =
        "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "next-auth.csrf-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "next-auth.callback-url=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "next-auth.state=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      disconnect();
      localStorage.removeItem("authToken");
      router.push("/trade");
      setIsLoggedIn(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="mt-5 flex flex-row-reverse">
        <ul className="flex flex-col w-[42%]">
          {navbarItems.map((item, index) => (
            <Link
              key={index}
              href={`${item.link}`}
              className={`pl-8 py-3 ${
                item?.disabled ? "pointer-events-none" : ""
              } relative ${
                selectedMenu === item.name
                  ? "bg-[#151515] text-white"
                  : "text-[#323232] hover:bg-white hover:bg-opacity-[10%] hover:text-white"
              }`}
              onClick={() => {
                setIsLoading(true);
                setSelectedMenu(item.name);
                if (item.name === "Message") {
                  setSidebar(true);
                } else {
                  setSidebar(false);
                }
              }}
            >
              {selectedMenu === item.name && (
                <div className="bg-white w-[2px] h-4 absolute top-4 left-4"></div>
              )}
              {item.name}
            </Link>
          ))}
        </ul>
      </div>

      <div className="p-5 mt-36">
        {/* Language Toggle */}
        <div className="flex justify-center gap-6 items-center mb-8 pl-[100px]">
          <p
            className={`${
              !languageState ? "text-[#fff]" : "text-[#707070]"
            } text-[14px]`}
          >
            English
          </p>
          <label className="switch">
            <input
              type="checkbox"
              checked={languageState}
              onChange={() => setLanguageState(!languageState)}
            />
            <span className="slider round"></span>
          </label>
          <p
            className={`${
              !languageState ? "text-[#707070]" : "text-[#fff]"
            } text-[14px]`}
          >
            Japanese
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mt-10">
          <a
            href="https://discord.gg/Febu4RRJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fff] hover:text-[#5865F2] transition-colors duration-200"
          >
            <img
              src="https://discord.com/favicon.ico"
              alt="Discord"
              className="w-6 h-6"
            />
          </a>
          <a
            href="https://x.com/everyx_io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fff] hover:text-[#1DA1F2] transition-colors duration-200"
          >
            <img
              src="https://x.com/favicon.ico"
              alt="X"
              className="w-6 h-6"
            />
          </a>
        </div>

        {/* Login/Logout Button */}
        <button
          className="text-[#fff] text-sm border border-[#fff] w-full py-4 rounded-xl hover:bg-[#2DC198] hover:bg-opacity-100 hover:text-black hover:border-black transition-colors duration-200 mb-6"
          onClick={() => {
            if (isLoggedIn) {
              handleLogoutUser();
            } else {
              router.push("/login");
            }
          }}
        >
          {isLoggedIn ? "Logout" : "Login / Signup"}
        </button>

      </div>
    </div>
  );
}
