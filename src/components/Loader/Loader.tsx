import "./Loader.css"

export default function Loader() {
  return (
    <div className="w-full h-full fixed flex items-center justify-center bg-black opacity-80 z-50">
      <div className="load-row">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}