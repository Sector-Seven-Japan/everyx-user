"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import "./menu.css";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Menu() {
  const router = useRouter();
  const { selectedMenu, setSelectedMenu, setSidebar, setIsLoading } =
    useContext(AppContext);
  const [languageState, setLanguageState] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const { authToken } = useContext(AppContext);

  const navbarItems = isLoggedIn
    ? [
        { name: "Home", link: "/home" },
        { name: "Portfolio", link: "/deposit-withdrawal/history" },
        { name: "Profile", link: "/profile" },
        { name: "Message", link: "/home" },
        { name: "Mission", link: "/home" },
        { name: "Settings", link: "/setting" },
        { name: "Help", link: "/help" },
      ]
    : [{ name: "Help", link: "/help" }];

  const handleLogotUser = async () => {
    try {
      const response = await fetch("https://test-api.everyx.io/tokens", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response)

      await signOut({ redirect: false }); // Sign out without redirecting
      document.cookie = "next-auth.session-token=; max-age=0;"; // Clear session cookie
      document.cookie = "authToken=; max-age=0;"; // Clear custom auth token
      router.push("/login"); // Redirect to login page after sign out
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
              className={`pl-8 py-3 relative ${
                selectedMenu === item.name
                  ? "bg-[#151515] text-white"
                  : "text-[#323232] hover:bg-white hover:bg-opacity-[10%] hover:text-white"
              }`}
              onClick={() => {
                setIsLoading(true);
                setSelectedMenu(item.name);
                setSidebar(false);
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

      {/* Language Toggle */}
      <div className="p-5 mt-36">
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
          className="text-[#fff] text-sm border border-[#fff] w-full py-4 rounded-xl"
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
