"use client";
import { AppContext } from "@/app/Context/AppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Navbar({ home }: { home: string }) {
  const { setSelectedMenu ,setFilter} = useContext(AppContext);
  const router = useRouter();
  return (
    <div className="flex justify-between items-center p-5 bg-[#0E0E0E]">
      <Image
        onClick={() => {
          setSelectedMenu(("Home"));
          setFilter("")
          router.push("/home");
        }}
        src="/images/logo.png"
        className="cursor-pointer"
        alt="Logo image"
        width={20}
        height={20}
      />
      {home && <p>{home}</p>}
      {[
        "Home",
        "Portfolio",
        "Deposit",
        "Withdrawal",
        "Profile",
        "Terms",
        "Setting",
        "Help",
        "",
        "Verification",
        "Your Order"
      ].includes(home) ? (
        <Image
          className="cursor-pointer"
          onClick={() => {
            router.push("/menu");
          }}
          src="/images/menu.svg"
          alt=""
          width={20}
          height={20}
        />
      ) : (
        <Image
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
          src="/images/cross.svg"
          alt=""
          width={20}
          height={20}
        />
      )}
    </div>
  );
}
