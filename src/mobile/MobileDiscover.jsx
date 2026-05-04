import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useOutletContext } from "react-router-dom";
import { useData } from "../context/DataContext";
import * as api from "../api/api";
import MobileMovieCard from "./components/MobileMovieCard";

export default function MobileDiscover() {
  const location = useLocation();
  const { isSearchOpen, setIsSearchOpen } = useOutletContext();
  const { getTrendingData, cache } = useData();
  
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
      }, 300);
    } else {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  }, [location.pathname, location.state, setIsSearchOpen]);

  // Main Data Fetching & Syncing Logic
  useEffect(() => {
    let isMounted = true;
    const isSearch = searchQuery.trim().length > 0;

    const fetchData = async () => {
      // 1. Initial State Handling for Page 1
      if (page === 1) {
        // Instant Cache Hydration to ensure "0 load" feel
        if (!isSearch) {
          if (filter === "all") {
            if (cache.movie.trending.length > 0 && cache.tv.trending.length > 0) {
              const movies = cache.movie.trending;
              const tv = cache.tv.trending;
              const combined = [];
              const max = Math.max(movies.length, tv.length);
              for (let i = 0; i < max; i++) {
                if (movies[i]) combined.push(movies[i]);
                if (tv[i]) combined.push(tv[i]);
              }
              setItems(combined);
              setLoading(false);
              // If we already have the first page, we don't need to fetch
              if (cache.movie.page >= 1 && cache.tv.page >= 1) return;
            } else {
              setItems([]);
              setLoading(true);
            }
          } else if (filter === "movie" || filter === "tv") {
            if (cache[filter].trending.length > 0) {
              setItems(cache[filter].trending);
              setLoading(false);
              if (cache[filter].page >= 1) return;
            } else {
              setItems([]);
              setLoading(true);
            }
          } else {
             // For anime or others not in global cache
             setItems([]);
             setLoading(true);
          }
        } else {
          // It's a search
          setItems([]);
          setLoading(true);
        }
      } else {
        setLoadingMore(true);
      }

      try {
        let results = [];
        if (isSearch) {
          results = await api.searchAllMedia(searchQuery, page);
        } else {
          if (filter === "all") {
            const movies = await getTrendingData("movie", page);
            const tv = await getTrendingData("tv", page);
            const combined = [];
            const max = Math.max(movies.length, tv.length);
            for (let i = 0; i < max; i++) {
              if (movies[i]) combined.push(movies[i]);
              if (tv[i]) combined.push(tv[i]);
            }
            results = combined;
          } else if (filter === "movie" || filter === "tv") {
            results = await getTrendingData(filter, page);
          } else if (filter === "anime") {
            results = await api.getPopularAnime(page);
          }
        }

        if (isMounted) {
          if (results.length === 0) {
             setHasMore(false);
          } else {
            setItems((prev) => {
              // Ensure we don't duplicate items
              const newItems = results.filter((newItem) => !prev.some((oldItem) => oldItem.id === newItem.id));
              return page === 1 ? results : [...prev, ...newItems];
            });
            setHasMore(true);
          }
          setLoading(false);
          setLoadingMore(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    // Reset page to 1 when filter/search changes
    // But we don't reset items here anymore to avoid the flicker
    if (isSearch) {
      const delayDebounceFn = setTimeout(() => {
        fetchData();
      }, 500);
      return () => {
        isMounted = false;
        clearTimeout(delayDebounceFn);
      };
    } else {
      fetchData();
      return () => {
        isMounted = false;
      };
    }
  }, [filter, page, searchQuery, getTrendingData, cache.movie.trending, cache.tv.trending]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent pt-14 pb-6 relative">
      <Helmet>
        <title>Discover</title>
      </Helmet>

      {/* Top Area (Scrolls naturally) */}
      <div className="bg-transparent border-b border-white/5 py-3">
        {/* Search Input Area */}
        {isSearchOpen ? (
          <div className="px-4 flex items-center gap-3 animate-fade-in">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input 
                ref={searchInputRef}
                autoFocus
                type="text" 
                placeholder="Search movies, TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white font-bold placeholder-gray-500 focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              className="w-8 h-8 flex items-center justify-center text-gray-400 active:scale-90 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center px-4">
            {/* Pills */}
            <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
              {["all", "movie", "tv", "anime"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-none px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors ${
                    filter === f 
                      ? "bg-brand text-white shadow-lg shadow-brand/20" 
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {f === "all" ? "Trending" : f === "movie" ? "Movies" : f === "tv" ? "Series" : "Anime"}
                </button>
              ))}
            </div>
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
