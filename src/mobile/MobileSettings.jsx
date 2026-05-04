import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

export default function MobileSettings() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="h-full overflow-hidden bg-transparent pt-14 pb-10 relative flex flex-col">
      <Helmet>
        <title>Settings - Havtic Movie</title>
      </Helmet>

      <div className="flex-1 px-4 flex flex-col justify-center gap-6">
        {/* Profile Card */}
        <div className="bg-black/40 backdrop-blur-md rounded-[2.5rem] p-5 border border-white/10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-brand flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-brand/20 mb-3 border-4 border-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-black text-white">{user.name}</h2>
          <p className="text-gray-500 text-[10px] font-bold mt-0.5">{user.email}</p>
          <div className="mt-4 bg-brand/10 text-brand px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-brand/20">
            {user.isPremium ? "Premium Member" : "Free Member"}
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-black/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden border border-white/10">
          
          <Link to="/watchlist" className="w-full flex items-center justify-between p-5 border-b border-white/5 active:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">My Watchlist</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[8px] font-black">{user.watchlist?.length || 0}</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          {!user.isPremium && (
            <Link to="/premium" className="w-full flex items-center justify-between p-5 border-b border-white/5 active:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">Upgrade to Pro</span>
              </div>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          )}
          

          <a href="https://t.me/havtic" target="_blank" rel="noreferrer" className="w-full flex items-center justify-between p-5 active:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2s-.21-.05-.31-.03c-.14.03-2.29 1.45-6.46 4.26-.61.42-1.16.63-1.65.61-.54-.01-1.58-.31-2.35-.57-.95-.32-1.7-.49-1.63-.98.04-.26.4-.53 1.07-.81 4.17-1.81 6.96-3 8.36-3.57 3.98-1.62 4.8-1.9 5.35-1.91.12 0 .38.03.55.17.14.11.18.27.2.45-.02.04-.02.1-.02.13z"/></svg>
              </div>
              <span className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">Official Telegram</span>
            </div>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>

        </div>

        {/* Logout Section */}
        <div className="px-2">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="text-[10px] font-black uppercase tracking-widest">Sign Out Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
