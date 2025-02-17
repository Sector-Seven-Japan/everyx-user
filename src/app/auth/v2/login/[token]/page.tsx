"use client";
import { AppContext } from "@/app/Context/AppContext";
import { useContext, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AuthLogin() {
  const { setAuthToken, setIsLoggedIn } = useContext(AppContext);
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  useEffect(() => {
    if (token) {
      document.cookie = `authToken=${token}`;
      setAuthToken(token);
      setIsLoggedIn(true);
      router.push("/home");
    }
  }, [token, setAuthToken, setIsLoggedIn, router]);

  return <div></div>;
}
