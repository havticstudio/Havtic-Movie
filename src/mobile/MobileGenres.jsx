import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { discoverMedia } from "../api/api";
import MobileMovieCard from "./components/MobileMovieCard";
import MobileGrid from "./components/MobileGrid";

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

export default function MobileGenres() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== 'All') params[key] = val;
      else if (key === 'type' && val) params[key] = val;
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
    <div className="min-h-screen bg-transparent pt-14 pb-10 relative">
      <Helmet><title>Explore Genres</title></Helmet>

      {/* Fixed Header */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-bg-main/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex justify-between items-center h-[56px]">
        <h1 className="text-lg font-black text-white uppercase tracking-widest">Explore</h1>
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          {["movie", "tv"].map((t) => (
            <button
              key={t}
              onClick={() => updateFilter("type", t)}
              className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                filters.type === t ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-gray-500"
              }`}
            >
              {t === "movie" ? "Movies" : "TV"}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-16">
        {/* Horizontal Filters */}
        <div className="mb-6 space-y-4">
          <FilterScroll label="Genre" options={GENRES} activeId={filters.genre} onSelect={(id) => updateFilter("genre", id)} />
          <FilterScroll label="Country" options={COUNTRIES} activeId={filters.country} onSelect={(id) => updateFilter("country", id)} />
          <FilterScroll label="Year" options={YEARS} activeId={filters.year} onSelect={(id) => updateFilter("year", id)} />
          <FilterScroll label="Language" options={LANGUAGES} activeId={filters.language} onSelect={(id) => updateFilter("language", id)} />
          <FilterScroll label="Sort" options={SORT_OPTIONS} activeId={filters.sort} onSelect={(id) => updateFilter("sort", id)} />
        </div>

        {/* Content Grid */}
        <div className="px-4">
          {loading && page === 1 ? (
            <MobileGrid items={[]} loading={true} />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {results.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`} 
                  ref={index === results.length - 1 ? lastElementRef : null}
                >
                  <MobileMovieCard item={item} mediaType={filters.type} className="w-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="py-20 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
              No matching content found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterScroll({ label, options, activeId, onSelect }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="px-4 text-gray-500 text-[8px] font-black uppercase tracking-[0.2em]">{label}</span>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 snap-x">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border snap-start ${
              activeId === opt.id
                ? "bg-white text-black border-white shadow-lg"
                : "bg-white/5 text-gray-400 border-white/5"
            }`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
}
