export default function LoadingPage() {
  return (
    <div className="h-screen w-screen bg-black flex flex-col mx-auto absolute top-0 left-0 z-50">
      {/* Logo */}
      <div className="flex-1 flex items-center justify-center">
        <div style={{ width: "150px", height: "150px" }}>
          <img src="/Images/logo_animation.gif" alt="Loading animation" />
        </div>
      </div>
    </div>
  );
}