import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useOutletContext } from "react-router-dom";
import { getPopularPeople } from "../api/api";

export default function MobileCelebrities() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isSearchOpen } = useOutletContext();

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

    getPopularPeople(page)
      .then(results => {
        if (isMounted) {
          if (results.length === 0) {
            setHasMore(false);
          } else {
            setPeople(prev => {
              const newPeople = results.filter(newP => !prev.some(oldP => oldP.id === newP.id));
              return [...prev, ...newPeople];
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
        <title>Celebrities - Havtic Movie</title>
      </Helmet>

      {/* Hero Section - Scrolling */}
      <div className="px-4 mb-8 pt-4">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#1a0b0b] to-[#0d0404] border border-white/5 p-8 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand blur-[80px] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600 blur-[80px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse"></span>
              Trending Stars
            </div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
              Explore the most popular actors and creators in the industry
            </p>
          </div>
        </div>
      </div>

      {/* People Grid - 3 Columns */}
      <div className="px-4 grid grid-cols-3 gap-x-3 gap-y-6">
        {loading && page === 1 ? (
          Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-full bg-white/5 mb-3 border border-white/5"></div>
              <div className="h-2 w-16 bg-white/5 rounded-full mx-auto mb-1"></div>
              <div className="h-1.5 w-12 bg-white/5 rounded-full mx-auto"></div>
            </div>
          ))
        ) : (
          people.map((person, index) => (
            <Link 
              key={`${person.id}-${index}`} 
              to={`/celebrity/${person.id}`}
              ref={index === people.length - 1 ? lastElementRef : null}
              className="flex flex-col items-center group active:scale-95 transition-transform"
            >
              <div className="relative mb-3">
                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-brand blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                
                <div className="w-[85px] h-[85px] rounded-full overflow-hidden border-2 border-white/10 p-0.5 group-hover:border-brand/50 transition-colors bg-[#120a0a]">
                   <div className="w-full h-full rounded-full overflow-hidden relative">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                    )}
                   </div>
                </div>
                
                {/* Popularity Badge (Optional) */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-brand text-white text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  VIEW
                </div>
              </div>
              
              <div className="text-center w-full px-1">
                <h3 className="text-white font-black text-[9px] uppercase tracking-wider truncate mb-0.5">
                  {person.name}
                </h3>
                <p className="text-gray-500 text-[7px] font-bold uppercase tracking-widest truncate">
                  {person.known_for_department || "Actor"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-white/5 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
