"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useContext, useEffect, useState } from "react";
import MobileLanding from "@/components/Screens/LandingPage/MobileView";
import WebLanding from "@/components/Screens/LandingPage/WebView";
import LoadingPage from "@/components/LoadingPage";
import { AppContext } from "./Context/AppContext";

const LandingPage = () => {
  const { setIsLoading, isMobile } = useContext(AppContext);
  const [isLoadingl, setIsLoadingl] = useState(true);

  useEffect(() => {
    setIsLoading(false);
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
