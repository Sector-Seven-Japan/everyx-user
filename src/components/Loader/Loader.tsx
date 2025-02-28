// import Image from "next/image";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="w-full h-full fixed flex items-center justify-center bg-black opacity-80 z-50">
      <div className="load-row">
        {/* <span></span>
        <span></span>
        <span></span>
        <span></span> */}
        <div style={{ width: "150px", height: "150px" }}>
          <img src="/Images/logo_animation.gif" alt="Loading animation" />
        </div>
      </div>
    </div>
  );
}
