import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import MobileGrid from "./components/MobileGrid";

export default function MobileWatchlist() {
  const { user, loading } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return <div className="min-h-screen bg-transparent"></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <svg className="w-16 h-16 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Login Required</h2>
        <p className="text-gray-400 text-xs mb-6">Sign in to view and manage your watchlist.</p>
        <Link to="/login" className="bg-brand text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] w-full shadow-lg shadow-brand/20 active:scale-95 transition-transform">
          Sign In
        </Link>
      </div>
    );
  }

  const items = user.watchlist || [];
  const filteredItems = items.filter(item => 
    (item.title || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-6 relative">
      <Helmet>
        <title>Watchlist</title>
      </Helmet>

      {/* Fixed Page Header */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-bg-main/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center h-[56px]">
        {isSearching ? (
          <div className="flex-1 flex items-center gap-3 animate-fade-in">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input 
                autoFocus
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white font-bold focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <button 
              onClick={() => { setIsSearching(false); setSearchQuery(""); }}
              className="text-brand text-[10px] font-black uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-black text-white uppercase tracking-widest">Watchlist</h1>
            <div className="flex items-center gap-2">
              {items.length > 7 && (
                <button 
                  onClick={() => setIsSearching(true)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                </button>
              )}
              <div className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest min-w-[32px] text-center">
                {items.length}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="pt-16">

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
          <svg className="w-12 h-12 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Your watchlist is empty</p>
          <Link to="/discover" className="text-brand text-[10px] font-black uppercase tracking-widest border border-brand/20 px-6 py-2 rounded-full">Explore</Link>
        </div>
      ) : (
        <div className="mt-4">
          <MobileGrid items={filteredItems} loading={false} />
          {filteredItems.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">No matching movies found</p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
