import { useAuth } from "../context/AuthContext";
import { Helmet } from "react-helmet-async";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";

export default function Watchlist() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Login to view your watchlist</h2>
        <Link to="/login" className="bg-brand text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">Sign In</Link>
      </div>
    );
  }

  const items = user.watchlist || [];

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8 animate-fade-up">
      <Helmet>
        <title>Watchlist - Havtic Movie</title>
      </Helmet>

      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">My <span className="text-brand">Watchlist</span></h1>
          <p className="text-gray-500 text-sm mt-1">Movies and shows you want to watch later.</p>
        </div>
        <div className="bg-brand/10 text-brand px-4 py-2 rounded-full text-xs font-black border border-brand/20">
          {items.length} ITEMS
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-[2rem]">
          <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg">Your watchlist is empty.</p>
          <Link to="/discover" className="text-brand text-sm font-bold mt-2 hover:underline">Explore new content</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <MovieCard item={item} mediaType={item.media_type || "movie"} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
