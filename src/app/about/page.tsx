"use client";
import React, { useContext } from "react";
import MobileLanding from "@/components/Screens/About/MobileView";
import WebLanding from "@/components/Screens/About/WebView";
import { AppContext } from "@/app/Context/AppContext";

const About = () => {
  const { isMobile } = useContext(AppContext);

  // Handle screen size detection

  return <>{isMobile ? <MobileLanding /> : <WebLanding />}</>;
};

export default About;
