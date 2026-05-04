import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/havticmovielogo.png";

const MENU_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Discover", path: "/discover" },
  { name: "Genres", path: "/genres" },
  { name: "Awards", path: "/awards" },
  { name: "Celebrities", path: "/celebrities" },
  { name: "Recent", path: "/recent" },
  { name: "Top Rated", path: "/top-rated" },
  { name: "Watchlist", path: "/watchlist" },
  { name: "Completed", path: "/completed" },
];

export default function MobileSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-3/4 max-w-sm bg-bg-surface border-l border-white/10 z-[70] flex flex-col shadow-2xl animate-fade-left">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
          <img src={logo} alt="Havtic Movie" className="h-6 object-contain" />
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {MENU_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-colors ${
                    active ? "bg-brand/10 text-brand border border-brand/20" : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 px-4">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest px-4 mb-2">Account</p>
            <div className="space-y-1">
              <Link to="/premium" onClick={onClose} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand to-red-400 hover:bg-white/5">
                Go Premium
              </Link>
              <Link to="/settings" onClick={onClose} className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/5">
                Settings
              </Link>
              {user?.isAdmin && (
                <Link to="/admin/payments" onClick={onClose} className="block px-4 py-3 rounded-xl text-sm font-bold text-brand/80 hover:bg-white/5">
                  Admin Panel
                </Link>
              )}
              {user ? (
                <button onClick={() => { logout(); onClose(); }} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-white/5">
                  Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={onClose} className="block px-4 py-3 rounded-xl text-sm font-bold text-brand hover:bg-white/5">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
