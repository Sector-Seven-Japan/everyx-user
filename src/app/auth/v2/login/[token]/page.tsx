"use client";
import { AppContext } from "@/app/Context/AppContext";
import { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader"; // Import the Loader component

export default function AuthLogin() {
  const { setAuthToken, setIsLoggedIn } = useContext(AppContext);
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const [isLoading, setIsLoading] = useState(true); // State for managing loading

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token); // Set token in local storage
      setAuthToken(token);
      setIsLoggedIn(true);
      router.push("/home");
    }
  }, [token, setAuthToken, setIsLoggedIn, router]);

  useEffect(() => {
    if (!token) {
      setIsLoading(false); // Hide loader if no token is found
    }
  }, [token]);

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader /> {/* Use the Loader component */}
        </div>
      )}
    </div>
  );
}
