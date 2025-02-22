"use client";
import React, { useEffect, useState } from "react";
import MobileLanding from "@/components/Screens/Help/MobileView";
import WebLanding from "@/components/Screens/Help/WebView";

const help = () => {
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
      {isMobile ? <MobileLanding /> : <WebLanding />}
    </>
  );
};

export default help;
