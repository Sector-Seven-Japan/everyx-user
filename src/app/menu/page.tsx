"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import "./menu.css";
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();
  const { selectedMenu, setSelectedMenu } = useContext(AppContext);
  const [languageState, setLanguageState] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const { authToken } = useContext(AppContext);

  const navbarItems = isLoggedIn
    ? [
        { name: "Home", link: "/home" },
        { name: "Portfolio", link: "/deposit-withdrawal/history" },
        { name: "Profile", link: "/profile" },
        { name: "Settings", link: "/setting" },
        { name: "Help", link: "/help" },
      ]
    : [
        { name: "Settings", link: "/setting" },
        { name: "Help", link: "/help" },
      ];

  const handleLogotUser = async () => {
    try {
      const response = await fetch("https://test-api.everyx.io/tokens", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        setIsLoggedIn(false);
        document.cookie =
          "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar home="Menu" />
      <div className="mt-5 flex flex-row-reverse">
        <ul className="flex flex-col w-[42%]">
          {navbarItems.map((item, index) => (
            <Link
              key={index}
              href={`${item.link}`}
              className={`pl-8 py-3 relative ${
                selectedMenu === item.name
                  ? "bg-[#151515] text-white"
                  : "text-white hover:bg-white hover:bg-opacity-[10%] hover:text-white"
              }`}
              onClick={() => setSelectedMenu(item.name)}
            >
              {selectedMenu === item.name && (
                <div className="bg-white w-[2px] h-4 absolute top-4 left-4"></div>
              )}
              {item.name}
            </Link>
          ))}
        </ul>
      </div>

      {/* Language Toggle */}
      <div className="p-5 mt-60">
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

        {/* Login/Logout Button */}
        <button
          className="text-[#fff] text-sm border border-[#fff] w-full py-3 rounded-lg"
          onClick={() => {
            if (isLoggedIn) {
              handleLogotUser();
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
