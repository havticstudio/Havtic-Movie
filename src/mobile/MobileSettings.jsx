import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
    <div className="min-h-screen bg-transparent pt-14 pb-6 relative">
      <Helmet>
        <title>Account Settings</title>
      </Helmet>

      {/* Fixed Page Header */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-bg-main/95 backdrop-blur-xl border-b border-white/5 px-4 pt-4 pb-3">
        <h1 className="text-lg font-black text-white uppercase tracking-widest text-center">My Account</h1>
      </div>

      <div className="pt-16 px-4 mt-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-black/40 backdrop-blur-md rounded-[2rem] p-6 border border-white/10 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-brand flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-brand/20 mb-4 border-4 border-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-black text-white">{user.name}</h2>
          <p className="text-gray-400 text-xs font-bold mt-1">{user.email}</p>
          <div className="mt-4 bg-brand/20 text-brand px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
            Premium Member
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-black/40 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/10">
          
          <button className="w-full flex items-center justify-between p-5 border-b border-white/5 active:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span className="text-sm font-bold text-white">Change Password</span>
            </div>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          
          <div className="w-full flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              <div>
                <p className="text-sm font-bold text-white text-left">Dark Mode</p>
                <p className="text-[10px] text-gray-500 text-left mt-0.5">Always On</p>
              </div>
            </div>
            <div className="w-10 h-6 bg-brand/20 rounded-full relative p-1 border border-brand/20">
              <div className="w-4 h-4 bg-brand rounded-full ml-auto"></div>
            </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-5 active:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="text-sm font-bold text-brand">Sign Out</span>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}
