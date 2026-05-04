import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { getTrendingMovies, getTrendingTVShows } from "../api/api";
import MobileMovieCard from "./components/MobileMovieCard";

export default function MobileRecent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  useEffect(() => {
    let isMounted = true;
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    const fetchData = async () => {
      try {
        const [movies, tv] = await Promise.all([
          getTrendingMovies("day", page),
          getTrendingTVShows("day", page)
        ]);
        
        if (isMounted) {
          const combined = [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
          
          if (movies.length === 0 && tv.length === 0) {
            setHasMore(false);
          } else {
            setItems(prev => {
              const newItems = combined.filter(newItem => !prev.some(oldItem => oldItem.id === newItem.id));
              return [...prev, ...newItems];
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };
    fetchData();

    return () => { isMounted = false; };
  }, [page]);

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-10 relative">
      <Helmet>
        <title>Latest Releases - Havtic Movie</title>
      </Helmet>

      {/* Hero Accent */}
      <div className="px-4 mb-6 pt-4">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#1a0b0b] to-[#0d0404] border border-white/5 p-6 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand blur-[80px] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white italic tracking-tighter mb-1 uppercase">
              RECENT <span className="text-brand">RELEASES</span>
            </h2>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest max-w-[180px] mx-auto leading-tight">
              Freshly added movies and shows updated today
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 grid grid-cols-3 gap-3">
        {loading && page === 1 ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
          ))
        ) : (
          items.map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              ref={index === items.length - 1 ? lastElementRef : null}
              className="animate-fade-up"
            >
              <MobileMovieCard item={item} mediaType={item.media_type || "movie"} className="w-full" />
            </div>
          ))
        )}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-white/5 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="py-20 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest px-6">
          No recent releases available right now
        </div>
      )}
    </div>
  );
}
