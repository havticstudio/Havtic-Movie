import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ══════════════════════════════
   TOP BAR
   ══════════════════════════════ */
export default function TopBar({ activeTab, setActiveTab, search, setSearch }) {
  const tabs = ["Movies", "TV Shows", "Anime"];
  const { user } = useAuth();

  return (
    <div className="flex flex-col md:flex-row w-full text-white justify-between items-center gap-4 mb-10 pt-16 md:pt-0">
      
      {/* Search Input - Full width on mobile */}
      <div className="order-2 md:order-1 w-full md:flex-1 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-bg-surface border border-white/5 rounded-2xl px-5 py-3 w-full md:w-80 lg:w-[450px] xl:w-[500px] focus-within:border-brand/40 focus-within:ring-2 focus-within:ring-brand/10 transition-all shadow-inner">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search movies, series, anime..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-white text-sm flex-1 outline-none placeholder-gray-600 bg-transparent min-w-0"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-500 hover:text-white transition-colors p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Tabs and User Profile */}
      <div className="order-1 md:order-2 w-full md:w-auto flex items-center justify-between md:justify-end gap-2 md:gap-6">
        <div className="flex bg-bg-surface p-1 rounded-xl border border-white/5 shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg cursor-pointer text-xs font-bold transition-all duration-200 uppercase tracking-widest ${
                activeTab === tab
                  ? "bg-brand text-white shadow-lg shadow-brand/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {user ? (
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-black text-sm shadow-inner group-hover:bg-brand group-hover:text-white transition-all">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden xl:block text-xs font-black text-gray-400 uppercase tracking-widest">{user.name}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-brand hover:bg-brand-hover text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand/20 whitespace-nowrap"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
