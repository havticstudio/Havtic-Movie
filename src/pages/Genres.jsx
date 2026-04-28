import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { discoverMedia } from "../api/api";
import MovieCard from "../components/MovieCard";

const GENRES = [
  { id: "All", name: "All" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Sci-Fi" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

const COUNTRIES = [
  { id: "All", name: "All" },
  { id: "US", name: "United States" },
  { id: "GB", name: "United Kingdom" },
  { id: "KR", name: "Korea" },
  { id: "JP", name: "Japan" },
  { id: "BD", name: "Bangladesh" },
  { id: "CN", name: "China" },
  { id: "IN", name: "India" },
  { id: "FR", name: "France" },
  { id: "DE", name: "Germany" },
  { id: "ES", name: "Spain" },
  { id: "IT", name: "Italy" },
  { id: "RU", name: "Russia" },
  { id: "TR", name: "Turkey" },
  { id: "PK", name: "Pakistan" },
];

const YEARS = [
  { id: "All", name: "All" },
  { id: "2026", name: "2026" },
  { id: "2025", name: "2025" },
  { id: "2024", name: "2024" },
  { id: "2023", name: "2023" },
  { id: "2022", name: "2022" },
  { id: "2021", name: "2021" },
  { id: "2020", name: "2020" },
  { id: "2010s", name: "2010s" },
  { id: "2000s", name: "2000s" },
  { id: "1990s", name: "1990s" },
  { id: "1980s", name: "1980s" },
];

const LANGUAGES = [
  { id: "All", name: "All" },
  { id: "en", name: "English" },
  { id: "hi", name: "Hindi" },
  { id: "bn", name: "Bengali" },
  { id: "ta", name: "Tamil" },
  { id: "te", name: "Telugu" },
  { id: "ml", name: "Malayalam" },
  { id: "kn", name: "Kannada" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "ja", name: "Japanese" },
  { id: "ko", name: "Korean" },
];

const SORT_OPTIONS = [
  { id: "popularity.desc", name: "Hottest" },
  { id: "release_date.desc", name: "Latest" },
  { id: "vote_average.desc", name: "Rating" },
];

import { useSearchParams } from "react-router-dom";

export default function Genres() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "movie",
    genre: searchParams.get("genre") || "All",
    country: searchParams.get("country") || "All",
    year: searchParams.get("year") || "All",
    language: searchParams.get("language") || "All",
    sort: searchParams.get("sort") || "popularity.desc",
  });

  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Sync state back to URL when filters change
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== 'All') params[key] = val;
      else if (key === 'type' && val) params[key] = val; // Always keep type
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const fetchResults = useCallback(async (pageNum, isMore = false) => {
    if (isMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const data = await discoverMedia({ ...filters, page: pageNum });
      if (isMore) {
        setResults((prev) => [...prev, ...data]);
      } else {
        setResults(data);
      }
      setHasMore(data.length > 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [filters, fetchResults]);

  useEffect(() => {
    if (page > 1) {
      fetchResults(page, true);
    }
  }, [page, fetchResults]);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  const updateFilter = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8">
      <Helmet>
        <title>Genres - Havtic Movie</title>
      </Helmet>

      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter mb-8">
          Explore by <span className="text-brand">Genres</span>
        </h1>

        {/* Filters UI */}
        <div className="bg-bg-surface border border-white/5 rounded-3xl p-6 md:p-8 mb-10 space-y-6 shadow-2xl">
          {/* Type Toggle */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <span className="text-gray-500 text-xs font-black uppercase tracking-widest w-20">Type</span>
            <div className="flex bg-bg-main p-1 rounded-xl border border-white/5">
              {["movie", "tv"].map((t) => (
                <button
                  key={t}
                  onClick={() => updateFilter("type", t)}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                    filters.type === t ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {t === "movie" ? "Movies" : "TV Series"}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Row */}
          <FilterRow label="Genre" options={GENRES} activeId={filters.genre} onSelect={(id) => updateFilter("genre", id)} />
          <FilterRow label="Country" options={COUNTRIES} activeId={filters.country} onSelect={(id) => updateFilter("country", id)} />
          <FilterRow label="Year" options={YEARS} activeId={filters.year} onSelect={(id) => updateFilter("year", id)} />
          <FilterRow label="Language" options={LANGUAGES} activeId={filters.language} onSelect={(id) => updateFilter("language", id)} />
          <FilterRow label="Sort by" options={SORT_OPTIONS} activeId={filters.sort} onSelect={(id) => updateFilter("sort", id)} />
        </div>

        {/* Results Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-bg-surface rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 md:gap-6">
            {results.map((item, index) => {
              const isLast = index === results.length - 1;
              return (
                <div ref={isLast ? lastElementRef : null} key={`${item.id}-${index}`}>
                  <MovieCard item={item} mediaType={filters.type} />
                </div>
              );
            })}
          </div>
        )}

        {loadingMore && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          </div>
        )}
        
        {!loading && results.length === 0 && (
           <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
             No content found matching these filters
           </div>
        )}
      </div>
    </div>
  );
}

function FilterRow({ label, options, activeId, onSelect }) {
  return (
    <div className="flex flex-wrap items-center gap-y-3">
      <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest w-20 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
              activeId === opt.id
                ? "bg-white text-black border-white shadow-lg"
                : "bg-transparent text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
}
