import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getPopularPeople } from "../api/api";

export default function Celebrities() {
  const [people, setPeople] = useState([]);
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
    <div className="min-h-screen bg-bg-main p-4 md:p-8">
      <Helmet>
        <title>Celebrities - Havtic Movie</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Popular Celebrities</h1>
        <p className="text-gray-400 text-sm mt-1">Discover the trending actors and actresses.</p>
      </div>

      {loading && page === 1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {people.map((person, index) => (
            <Link 
              key={`${person.id}-${index}`} 
              to={`/celebrity/${person.id}`}
              ref={index === people.length - 1 ? lastElementRef : null}
              className="group cursor-pointer"
            >
              <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-bg-surface relative mb-3 shadow-lg group-hover:shadow-brand/10 transition-all duration-300">
                {person.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-white font-bold text-sm truncate">{person.name}</h3>
              <p className="text-gray-500 text-xs mt-1 truncate">{person.known_for?.map(m => m.title || m.name).join(", ")}</p>
            </Link>
          ))}
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
