"use client";
import Link from "next/link";
import { useContext } from "react";
import { AppContext } from "../app/Context/AppContext";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useDisconnect } from "wagmi";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";

export default function Menu() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const {
    selectedMenu,
    setSelectedMenu,
    setSidebar,
    setIsLoading,
    sidebar,
    API_BASE_URL,
    setWalletData,
  } = useContext(AppContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const { authToken, setAuthToken } = useContext(AppContext);

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
    setIsLoading(true);
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
    <div
      className={`fixed top-0 right-0 w-full z-10 bg-[#0E0E0E] pt-16 h-[100vh] transition-all duration-300 md:w-[200px] ${
        sidebar ? "" : "translate-x-full"
      }`}
    >
      <div className="mt-5 flex flex-row-reverse">
        <ul className="flex flex-col w-[42%] md:w-[90%]">
          {navbarItems.map((item, index) => (
            <Link
              key={index}
              href={`${item.link}`}
              className={`pl-8 py-3 ${
                item?.disabled ? "pointer-events-none" : ""
              } relative md:py-2 md:text-[14px] ${
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
                <div className="bg-white w-[2px] h-4 absolute top-4 md:top-3 left-4"></div>
              )}
              {item.name}
            </Link>
          ))}
        </ul>
      </div>

      {/* Social Media Icons */}
      <div className="flex justify-center gap-6 mt-10">
          <a
            href="https://discord.gg/Febu4RRJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fff] hover:text-[#5865F2] transition-colors duration-200"
          >
            <FaDiscord className="text-2xl" />
          </a>
          <a
            href="https://x.com/everyx_io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#fff] hover:text-[#1DA1F2] transition-colors duration-200"
          >
            <FaXTwitter className="text-2xl" />
          </a>
        </div>

      <div className="mt-10">
        {/* Login/Logout Button */}
        <button
          className="text-[#fff] text-sm border border-[#fff] w-full py-4 rounded-xl hover:bg-[#2DC198] hover:bg-opacity-100 hover:text-black hover:border-black transition-colors duration-200 md:py-2 mb-6"
          onClick={() => {
            if (isLoggedIn) {
              handleLogoutUser();
            } else {
              router.push("/login");
            }
            setSidebar(false);
          }}
        >
          {isLoggedIn ? "Logout" : "Login / Signup"}
        </button>

      </div>
    </div>
  );
}
