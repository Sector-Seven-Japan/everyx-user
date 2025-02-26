"use client";
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import MobileLanding from "@/components/Screens/login/MobileView";
import WebLanding from "@/components/Screens/login/WebView";

const Login = () => {
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

      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Store token and set login state
      document.cookie = `authToken=${data.token}`;
      setAuthToken(data.token);
      setIsLoggedIn(true);
      router.push("/trade")
      ;
    } catch (error) {
      setIsLoading(false);
      setError({ general: (error as Error).message });
    }
  };

  // Handle Google Login (sign-in via Google provider)
  const handleGoogleLogin = () => {
    if (typeof window !== "undefined") {
      signIn("google", { callbackUrl: `${window.location.origin}/trade` });
    }
  };

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
