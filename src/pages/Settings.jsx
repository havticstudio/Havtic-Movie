import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";

export default function Settings() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8 animate-fade-up">
      <Helmet>
        <title>Settings - Havtic Movie</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-10">Settings</h1>

        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-bg-surface p-6 md:p-8 rounded-3xl border border-white/5">
            <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Profile Information</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-brand flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-brand/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
                  Premium Member
                </div>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-bg-surface p-6 md:p-8 rounded-3xl border border-white/5">
            <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">General Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-bold text-sm">Theme Mode</p>
                  <p className="text-gray-500 text-xs mt-1">Currently restricted to Dark Red Vibes</p>
                </div>
                <div className="w-12 h-6 bg-brand/20 rounded-full relative p-1 border border-brand/20">
                  <div className="w-4 h-4 bg-brand rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="h-[1px] bg-white/5 w-full"></div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white font-bold text-sm">Email Notifications</p>
                  <p className="text-gray-500 text-xs mt-1">Get updates about new award winning movies</p>
                </div>
                <div className="w-12 h-6 bg-bg-main rounded-full relative p-1 border border-white/5">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Account Actions */}
          <section className="bg-bg-surface p-6 md:p-8 rounded-3xl border border-white/5">
            <h2 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Danger Zone</h2>
            <button 
              onClick={logout}
              className="w-full bg-white/5 hover:bg-brand/10 hover:text-brand border border-white/5 hover:border-brand/20 text-gray-400 font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition-all"
            >
              Sign Out from this device
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
