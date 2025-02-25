"use client";

import { useContext } from "react";
import { AppContext } from "./Context/AppContext";
import Loader from "@/components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import Menu from "@/components/Menu";


export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useContext(AppContext);

  return (
    <>
      {isLoading && <Loader />}
      <div className="mt-14">{children}</div>
      <Menu />
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
