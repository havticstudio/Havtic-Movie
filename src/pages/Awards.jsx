import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { getAwardWinningMovies } from "../api/api";
import MovieCard from "../components/MovieCard";

export default function Awards() {
  const [movies, setMovies] = useState([]);
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

    getAwardWinningMovies(page)
      .then(results => {
        if (isMounted) {
          if (results.length === 0) {
            setHasMore(false);
          } else {
            setMovies(prev => {
              const newItems = results.filter(newItem => !prev.some(oldItem => oldItem.id === newItem.id));
              return [...prev, ...newItems];
            });
          }
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      });

    return () => { isMounted = false; };
  }, [page]);

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8">
      <Helmet>
        <title>Awards Hall of Fame - Havtic Movie</title>
      </Helmet>

      {/* Hall of Fame Hero */}
      <div className="relative mb-16 rounded-[2rem] overflow-hidden bg-[#1a0505] border border-brand/20 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-bg-main via-transparent to-bg-main opacity-60"></div>
        
        <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/30 text-brand text-xs font-black uppercase tracking-[0.3em] animate-pulse">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Critical Excellence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
            Hall of <span className="text-brand text-glow">Fame</span>
          </h1>
          
          <p className="max-w-2xl text-gray-400 text-sm md:text-lg font-medium leading-relaxed">
            A curated selection of cinematic achievements that have earned the highest 
            praise from critics and audiences worldwide.
          </p>
          
          <div className="mt-10 flex gap-4">
             <div className="h-[2px] w-12 bg-brand self-center"></div>
             <span className="text-white text-xs font-bold tracking-widest uppercase">The Gold Standard</span>
             <div className="h-[2px] w-12 bg-brand self-center"></div>
          </div>
        </div>

        {/* Animated Ornaments */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      {/* Content Grid */}
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <span className="w-8 h-[2px] bg-brand"></span>
            All-Time High Rated
          </h2>
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            {movies.length} Masterpieces Found
          </div>
        </div>

        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-bg-surface rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {movies.map((movie, index) => (
              <div 
                key={`${movie.id}-${index}`} 
                ref={index === movies.length - 1 ? lastElementRef : null}
                className="group relative"
              >
                {/* Award Badge */}
                <div className="absolute -top-3 -left-3 z-20 bg-brand text-white text-[10px] font-black px-2 py-1 rounded shadow-[0_4px_10px_rgba(239,68,68,0.5)] transform -rotate-12 group-hover:rotate-0 transition-transform duration-300">
                  TOP RATED
                </div>
                
                <div className="transition-transform duration-500 group-hover:-translate-y-2">
                  <MovieCard item={movie} mediaType="movie" />
                </div>
                
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && !loadingMore && movies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">No award-winning content found at the moment.</p>
        </div>
      )}

      <style>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
        }
      `}</style>
    </div>
  );
}
