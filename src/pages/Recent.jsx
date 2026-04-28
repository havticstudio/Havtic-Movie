import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { getTrendingMovies, getTrendingTVShows } from "../api/api";
import MovieCard from "../components/MovieCard";

export default function Recent() {
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
          const combined = [...movies, ...tv].sort(() => Math.random() - 0.5);
          
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
    <div className="min-h-screen bg-bg-main p-4 md:p-8">
      <Helmet>
        <title>Recent - Havtic Movie</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Recent Releases</h1>
        <p className="text-gray-400 text-sm mt-1">Stay updated with the latest movies and TV shows released today.</p>
      </div>

      {loading && page === 1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-bg-surface rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {items.map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              ref={index === items.length - 1 ? lastElementRef : null}
              className="animate-in fade-in zoom-in duration-500"
            >
              <MovieCard item={item} mediaType={item.media_type || "movie"} />
            </div>
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-[2rem]">
          No recent releases found.
        </div>
      )}
    </div>
  );
}
