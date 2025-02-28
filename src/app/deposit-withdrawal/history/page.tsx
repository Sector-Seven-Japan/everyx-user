"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HistoryMobile from "@/components/Screens/deposit-withdrawal/history/MobileView";
import HistoryWeb from "@/components/Screens/deposit-withdrawal/history/WebView";


// import CurrentCashBalanceCardWebview from "@/components/CurrentCashBalanceWebview";

const History = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set breakpoint (e.g., 768px for mobile)
    };

    // Set initial value
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {" "}
      <Navbar />
      {isMobile ? <HistoryMobile /> : <HistoryWeb />}
      <Footer />
    </>
  );
};

export default History;
