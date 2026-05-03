import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import MobileGrid from "./components/MobileGrid";

export default function MobileCompleted() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
        <svg className="w-16 h-16 text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">Login Required</h2>
        <Link to="/login" className="bg-brand text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] w-full shadow-lg shadow-brand/20 mt-4">
          Sign In
        </Link>
      </div>
    );
  }

  const items = user.completed || [];

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-6 relative">
      <Helmet><title>Completed</title></Helmet>

      {/* Fixed Page Header */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-bg-main/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-black text-white uppercase tracking-widest">Completed</h1>
        <div className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
          {items.length}
        </div>
      </div>

      <div className="pt-16">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
            <svg className="w-12 h-12 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">You haven't completed any movies</p>
          </div>
        ) : (
          <div className="mt-4">
            <MobileGrid items={items} loading={false} />
          </div>
        )}
      </div>
    </div>
  );
}
