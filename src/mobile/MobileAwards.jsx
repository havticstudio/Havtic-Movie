import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { getAwardWinningMovies } from "../api/api";
import MobileMovieCard from "./components/MobileMovieCard";
import MobileGrid from "./components/MobileGrid";

export default function MobileAwards() {
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
    <div className="min-h-screen bg-transparent pt-14 pb-10 relative">
      <Helmet>
        <title>Awards Hall of Fame</title>
      </Helmet>

      {/* Fixed Page Header */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-bg-main/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center h-[56px]">
        <h1 className="text-lg font-black text-white uppercase tracking-widest">Awards</h1>
        <div className="bg-brand/20 text-brand px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
          Hall of Fame
        </div>
      </div>

      <div className="pt-16">
        {/* Hall of Fame Hero - Mobile Optimized */}
        <div className="px-4 mb-8">
          <div className="relative rounded-[2rem] overflow-hidden bg-[#1a0505] border border-brand/20 p-6 text-center shadow-2xl shadow-brand/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand blur-[60px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand blur-[50px] opacity-10"></div>
            
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand text-[8px] font-black uppercase tracking-[0.2em]">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Gold Standard
              </div>
              <h2 className="text-3xl font-black text-white leading-none uppercase tracking-tighter mb-3">
                Critical <span className="text-brand">Excellence</span>
              </h2>
              <p className="text-gray-400 text-[10px] leading-relaxed font-bold uppercase tracking-wider">
                Handpicked selection of cinematic achievements.
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-brand"></div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest">Masterpieces</h3>
          </div>

          {loading && page === 1 ? (
            <MobileGrid items={[]} loading={true} />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {movies.map((movie, index) => (
                <div 
                  key={`${movie.id}-${index}`} 
                  ref={index === movies.length - 1 ? lastElementRef : null}
                  className="relative"
                >
                  <MobileMovieCard item={movie} mediaType="movie" className="w-full" />
                  <div className="absolute top-1 left-1 z-20 bg-brand text-white text-[6px] font-black px-1 py-0.5 rounded shadow-lg transform -rotate-12">
                    AWARDED
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
