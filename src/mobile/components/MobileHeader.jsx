import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/havticmovielogo.png";

export default function MobileHeader({ onOpenSidebar, isSearchOpen, setIsSearchOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed top-0 left-0 right-0 z-[55] bg-transparent px-4 h-14 flex items-center justify-between">
      {/* Logo */}
      <div onClick={() => navigate("/")} className="cursor-pointer">
        <img src={logo} alt="Havtic Movie" className="h-5 object-contain" />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        {/* Search Icon (Home & Discover) */}
        {(location.pathname === "/" || location.pathname === "/discover") && (
          <button 
            onClick={() => {
              if (location.pathname === "/discover") {
                setIsSearchOpen(prev => !prev);
              } else {
                navigate("/discover", { state: { focusSearch: true } });
              }
            }}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </button>
        )}
        {/* Menu Toggle */}
        <button 
          onClick={onOpenSidebar} 
          className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center backdrop-blur-md active:scale-95 transition-transform"
        >
          <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
