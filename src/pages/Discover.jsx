import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { getTrendingMovies, getTrendingTVShows, getPopularAnime } from "../api/api";
import MovieCard from "../components/MovieCard";

export default function Discover() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all"); // all, movie, tv, anime

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

  // Reset when filter changes
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
  }, [filter]);

  useEffect(() => {
    let isMounted = true;
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    const fetchData = async () => {
      try {
        let results = [];
        if (filter === "all") {
          const [movies, tv] = await Promise.all([
            getTrendingMovies("week", page),
            getTrendingTVShows("week", page)
          ]);
          // Interleave movies and TV shows
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
        
        if (isMounted) {
          if (results.length === 0) {
            setHasMore(false);
          } else {
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
        if (isMounted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [filter, page]);

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8">
      <Helmet>
        <title>Discover - Havtic Movie</title>
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Discover</h1>
          <p className="text-gray-400 text-sm mt-2">Explore the world of entertainment across all genres.</p>
        </div>

        <div className="flex flex-wrap bg-bg-surface p-1.5 rounded-2xl border border-white/5">
          {["all", "movie", "tv", "anime"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                filter === f 
                  ? "bg-brand text-white shadow-xl shadow-brand/40" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {f === "all" ? "All" : f === "movie" ? "Movies" : f === "tv" ? "TV Shows" : "Anime"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 transition-all duration-500">
        {loading && page === 1 ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={`loader-${i}`} className="aspect-[2/3] bg-bg-surface rounded-2xl animate-pulse border border-white/5" />
          ))
        ) : (
          items.map((item, index) => (
            <div 
              key={`${filter}-${item.id}-${index}`} 
              ref={index === items.length - 1 ? lastElementRef : null}
              className="animate-in fade-in zoom-in duration-500"
            >
              <MovieCard 
                item={item} 
                mediaType={item.media_type || (filter === "anime" || filter === "tv" ? "tv" : "movie")} 
              />
            </div>
          ))
        )}
      </div>
      
      {loadingMore && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}
      
      {!loading && !loadingMore && items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">No content found for this category.</p>
        </div>
      )}
    </div>
  );
}
