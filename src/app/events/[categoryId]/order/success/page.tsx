"use client";
import { AppContext } from "@/app/Context/AppContext";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function OrderSuccess() {
  const router = useRouter();
  const { setIsLoading } = useContext(AppContext);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div>
      <Navbar home={""} />
      <div className="p-5 flex flex-col justify-between h-[600px]">
        <h1 className="text-center text-[27px] mt-16">Your Order</h1>
        <div className="flex flex-col items-center justify-center text-center gap-10">
          <Image
            src="/Icons/SuccessIcon.png"
            alt=""
            width={70}
            height={70}
          ></Image>
          <h2 className="text-[15px]">
            Your order has been successfully processed!
          </h2>
          <p className="text-[#707070] text-[13px] px-12">
            want to check your transaction history, please check it from the
            result history.
          </p>
        </div>

        <button
          onClick={() => {
            setIsLoading(true);
            router.push("/home");
          }}
          className="w-full py-4 px-4 border-[#2DC198] border-[0.25px] rounded-lg transition-colors text-[14px] text-[#2DC198]"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
