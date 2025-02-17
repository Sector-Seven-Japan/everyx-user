"use client";

import { useContext } from "react";
import { AppContext } from "./Context/AppContext";
import Loader from "@/components/Loader/Loader";
import { ToastContainer } from "react-toastify";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useContext(AppContext);

  return (
    <>
      {isLoading && <Loader />}
      {children}
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
