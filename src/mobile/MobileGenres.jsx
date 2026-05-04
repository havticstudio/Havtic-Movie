import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
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
  const { getDiscoverData } = useData();
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
      const data = await getDiscoverData(filters, pageNum);
      if (isMore) {
        setResults((prev) => {
            const newItems = data.filter(newItem => !prev.some(oldItem => oldItem.id === newItem.id));
            return [...prev, ...newItems];
        });
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
  }, [filters, getDiscoverData]);

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
      {/* Tabs Header */}
      <div className="relative z-40 bg-transparent border-b border-white/5 px-4 py-3 flex justify-start items-center h-auto min-h-[56px]">
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
          {["movie", "tv"].map((t) => (
            <button
              key={t}
              onClick={() => updateFilter("type", t)}
              className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                filters.type === t ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-gray-500"
              }`}
            >
              {t === "movie" ? "Movies" : "TV"}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 px-4">
        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <MobileDropdown label="Genre" options={GENRES} activeId={filters.genre} onSelect={(id) => updateFilter("genre", id)} />
          <MobileDropdown label="Country" options={COUNTRIES} activeId={filters.country} onSelect={(id) => updateFilter("country", id)} />
          <MobileDropdown label="Year" options={YEARS} activeId={filters.year} onSelect={(id) => updateFilter("year", id)} />
          <MobileDropdown label="Language" options={LANGUAGES} activeId={filters.language} onSelect={(id) => updateFilter("language", id)} />
          <div className="col-span-2">
            <MobileDropdown label="Sort" options={SORT_OPTIONS} activeId={filters.sort} onSelect={(id) => updateFilter("sort", id)} />
          </div>
        </div>

        {/* Content Grid */}
        <div className="">
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

function MobileDropdown({ label, options, activeId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLabel = options.find(o => o.id === activeId)?.name || "All";

  return (
    <div className="flex flex-col gap-1.5 relative">
      <span className="text-gray-500 text-[7px] font-black uppercase tracking-[0.2em] pl-1">{label}</span>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between group active:scale-95 transition-all"
      >
        <span className="text-white text-[10px] font-black uppercase tracking-widest truncate mr-2">{activeLabel}</span>
        <svg className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#120a0a] border border-white/10 rounded-[1.5rem] shadow-2xl z-[70] max-h-60 overflow-y-auto scrollbar-hide py-2 animate-fade-in">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { onSelect(opt.id); setIsOpen(false); }}
                className={`w-full text-left px-5 py-3 text-[9px] font-black uppercase tracking-widest transition-colors ${
                  activeId === opt.id ? "text-brand bg-brand/5" : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
