"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const router = useRouter();
  return (
    <div className="bg-[#0E0E0E] w-full pt-20 px-10 pb-10">
      {/* Logo Section */}
      <div className="flex justify-center">
        <Image
          src="/images/Logo_footer.png"
          alt="EveryX Logo"
          width={50}
          height={50}
        />
      </div>

      {/* Footer Links */}
      <div className="text-[#fff] text-[14px] flex justify-between mt-10 opacity-[34%]">
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
      <p className="text-[#fff] text-[12px] mt-10 opacity-[33%] text-justify">
        EveryX is owned and operated by ABC Concepts B.V., the only platform
        where you can engage in event gambling with real money leveraging. ABC
        Concepts B.V. is registered with the XYZ Agency under Article 2 of the
        Financial Authority&apos;s regulations for operating ZYX business.
        <br />
        <br />
        Our official registration number is BVO123456789A.
        <br />
        <br />
        Our official registration number is BVO123456789A.
      </p>

      {/* Bottom Logo Section */}
      <div className="flex justify-center mt-20">
        <Image
          src="/images/Logo_footer_bottom.png"
          alt="Footer Bottom Logo"
          width={50}
          height={50}
        />
      </div>

      {/* Copyright */}
      <p className="text-[#fff] text-[12px] mt-10 opacity-[33%] text-center">
        Copyright © 2000-2025 EveryX INC. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
