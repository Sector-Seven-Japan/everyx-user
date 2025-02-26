"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useContext, useEffect, useState } from "react";
import MobileLanding from "@/components/Screens/LandingPage/MobileView";
import WebLanding from "@/components/Screens/LandingPage/WebView";
import LoadingPage from "@/components/LoadingPage";
import { AppContext } from "./Context/AppContext";

const LandingPage = () => {
  const { setIsLoading } = useContext(AppContext);
  const [isLoadingl, setIsLoadingl] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingl(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoadingl) {
    return <LoadingPage />;
  }

  return (
    <>
      <Navbar />
      {isMobile ? <MobileLanding /> : <WebLanding />}
      <Footer />
    </>
  );
};

export default LandingPage;
