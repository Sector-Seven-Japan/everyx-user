"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const router = useRouter();
  return (
    <div className="bg-[#0E0E0E] w-full pt-20 px-10 sm:px-10 md:px-40 lg:px-[15vw]">
      {/* Logo Section */}
      <div className="flex justify-center md:mb-[5vw]">
        <Image
          src="/Images/Logo_footer.png"
          alt="EveryX Logo"
          width={50}
          height={50}
          className="w-[50px] md:w-[50px] h-auto"
        />
      </div>

      {/* Footer Links */}
      <div className="text-[#fff] opacity-[90%] text-[14px] flex flex-row justify-center items-center gap-4 sm:gap-8 mt-10 flex-wrap md:justify-between md:px-[9vw] md:text-[1.1vw] md:mb-[5vw]">
        <button
          type="button"
          onClick={() => {
            router.push("/about");
          }}
        >
          Company
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/privacy");
          }}
        >
          Privacy Policy
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/terms");
          }}
        >
          Terms of Use
        </button>
      </div>

      {/* Footer Description */}
      <p className="text-[#fff] opacity-[90%] text-[12px] mt-10 text-justify md:text-[1vw] md:leading-9">
        EveryX is owned and operated by ABC Concepts B.V., the only platform
        where you can engage in event gambling with real money leveraging. ABC
        Concepts B.V. is registered with the XYZ Agency under Article 2 of the
        Financial Authority&apos;s regulations for operating ZYX business.
        <br />
        Our official registration number is BVO123456789A.
        <br />
        ©2024 All rights reserved. Unauthorized reproduction or redistribution is prohibited
      </p>

      {/* Bottom Logo Section */}
      <div className="flex justify-center mt-20">
        <Image
          src="/Images/Logo_footer_bottom.png"
          alt="Footer Bottom Logo"
          width={50}
          height={50}
          className="w-[50px] md:w-[5vw] h-auto"
        />
      </div>

      {/* Copyright */}
      <p className="text-[#fff] text-[12px] my-10 opacity-[90%] text-center md:text-[0.9vw] md:mb-[5vw]">
        Copyright © 2000-2025 EveryX INC. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
