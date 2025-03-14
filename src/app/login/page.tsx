"use client";
import Navbar from "@/components/Navbar";
import React, { useContext, useEffect, useState } from "react";
import MobileLanding from "@/components/Screens/login/MobileView";
import WebLanding from "@/components/Screens/login/WebView";
import { AppContext } from "../Context/AppContext";

const Login = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { setIsLoading } = useContext(AppContext);

  // Handle screen size detection
  useEffect(() => {
    setIsLoading(false);
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
      <Navbar />
      {isMobile ? <MobileLanding /> : <WebLanding />}
    </>
  );
};

export default Login;
