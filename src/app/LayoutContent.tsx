"use client";

import { useContext } from "react";
import { AppContext } from "./Context/AppContext";
import Loader from "@/components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import Menu from "@/components/Menu";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useContext(AppContext);
  const path = usePathname();

  return (
    <>
      {isLoading && <Loader />}
      <div className={`${path == "/auth/signup" ? "mt-0" : "mt-14"}`}>
        {children}
      </div>
      <Menu />
      <Toaster />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
