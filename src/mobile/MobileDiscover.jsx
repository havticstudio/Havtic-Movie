import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext } from "react-router-dom";
import { getTrendingMovies, getTrendingTVShows, getPopularAnime, searchAllMedia } from "../api/api";
import MobileMovieCard from "./components/MobileMovieCard";

export default function MobileDiscover() {
  const location = useLocation();
  const { isSearchOpen, setIsSearchOpen } = useOutletContext();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all");
  
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

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

  // Handle opening/closing search box based on navigation state
  useEffect(() => {
    if (location.state?.focusSearch) {
      setIsSearchOpen(true);
      setTimeout(() => {
        if (searchInputRef.current) searchInputRef.current.focus();
      }, 300); // Wait for CSS transition
    } else {
      setIsSearchOpen(false);
      setSearchQuery(""); // clear search if we navigate here normally
    }
  }, [location.pathname, location.state, setIsSearchOpen]);

  // Reset when filter or search changes
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
  }, [filter, searchQuery]);

  useEffect(() => {
    let isMounted = true;
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    const fetchData = async () => {
      try {
        let results = [];
        
        if (searchQuery.trim().length > 0) {
          results = await searchAllMedia(searchQuery, page);
        } else {
          if (filter === "all") {
            const [movies, tv] = await Promise.all([
              getTrendingMovies("week", page),
              getTrendingTVShows("week", page)
            ]);
            const combined = [];
            const max = Math.max(movies.length, tv.length);
            for (let i = 0; i < max; i++) {
              if (movies[i]) combined.push(movies[i]);
              if (tv[i]) combined.push(tv[i]);
            }
            results = combined;
          } else if (filter === "movie") {
            results = await getTrendingMovies("week", page);
          } else if (filter === "tv") {
            results = await getTrendingTVShows("week", page);
          } else if (filter === "anime") {
            results = await getPopularAnime(page);
          }
        }
        
        if (isMounted) {
          if (results.length === 0) setHasMore(false);
          else {
            setItems(prev => {
              const newItems = results.filter(newItem => !prev.some(oldItem => oldItem.id === newItem.id));
              return [...prev, ...newItems];
            });
          }
          setLoading(false);
          setLoadingMore(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) { setLoading(false); setLoadingMore(false); }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => { 
      isMounted = false; 
      clearTimeout(delayDebounceFn);
    };
  }, [filter, page, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-6 relative">
      <Helmet>
        <title>Discover</title>
      </Helmet>

      {/* Top Area (Scrolls naturally) */}
      <div className="bg-bg-main/95 backdrop-blur-xl border-b border-white/5 pt-2 pb-2">
        {/* Search Input (Animated) */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSearchOpen ? 'max-h-20 opacity-100 mb-3' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="px-4 relative pt-1">
            <svg className="absolute left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search movies, TV shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white font-bold placeholder-gray-500 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
            />
          </div>
        </div>

        {/* Pills (Hidden when searching) */}
        {searchQuery.trim().length === 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4">
            {["all", "movie", "tv", "anime"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors ${
                  filter === f 
                    ? "bg-brand text-white" 
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {f === "all" ? "Trending" : f === "movie" ? "Movies" : f === "tv" ? "TV Shows" : "Anime"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="mt-4 p-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
        {loading && page === 1 ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={`loader-${i}`} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
          ))
        ) : items.length === 0 ? (
          <div className="col-span-3 sm:col-span-4 flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-12 h-12 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No results found</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={`item-${item.id}-${index}`} ref={index === items.length - 1 ? lastElementRef : null}>
              <MobileMovieCard 
                item={item} 
                mediaType={item.media_type || (filter === "anime" || filter === "tv" ? "tv" : "movie")} 
                className="w-full"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
