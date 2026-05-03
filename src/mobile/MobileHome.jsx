import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getTrendingTVShows,
} from "../api/api";

import MobileHero from "./components/MobileHero";
import MobileRow from "./components/MobileRow";
import MobileMovieCard from "./components/MobileMovieCard";
import logo from "../assets/havticmovielogo.png";

export default function MobileHome() {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Movies");
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const mediaType = activeTab === "Movies" ? "movie" : "tv";

  // Intersection Observer for Infinite Scroll on Trending
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

  // Reset when tab changes
  useEffect(() => {
    setPage(1);
    setTrending([]);
    setHasMore(true);
    
    // Fetch top rows once per tab change
    setLoading(true);
    const fetchPopular = activeTab === "Movies" ? getPopularMovies() : getPopularTVShows();
    const fetchTopRated = activeTab === "Movies" ? getTopRatedMovies() : getTopRatedTVShows();
    
    Promise.all([fetchPopular, fetchTopRated])
      .then(([pop, top]) => {
        setPopular(pop);
        setTopRated(top);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Infinite fetch for trending section
  useEffect(() => {
    let isMounted = true;
    if (page > 1) setLoadingMore(true);

    const fetchTrending = activeTab === "Movies" ? getTrendingMovies("week", page) : getTrendingTVShows("week", page);

    fetchTrending.then(results => {
      if (isMounted) {
        if (results.length === 0) {
          setHasMore(false);
        } else {
          setTrending(prev => {
            const newItems = results.filter(newItem => !prev.some(oldItem => oldItem.id === newItem.id));
            return [...prev, ...newItems];
          });
        }
        setLoadingMore(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setLoadingMore(false);
    });

    return () => { isMounted = false; };
  }, [activeTab, page]);

  return (
    <div className="min-h-screen bg-transparent w-full pb-6">
      <Helmet>
        <title>Havtic Movie</title>
      </Helmet>

      {/* Tabs Overlay Gradient */}
      <div className="absolute top-0 left-0 right-0 z-40 px-4 pt-16 pb-8 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex justify-center pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          {["Movies", "Series"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-black uppercase tracking-widest transition-colors ${
                activeTab === tab ? "text-white" : "text-gray-400 drop-shadow-md"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <MobileHero items={trending.slice(0, 5)} mediaType={mediaType} />

      <div className="-mt-4 relative z-10">
        <MobileRow title="Popular Now" items={popular} mediaType={mediaType} loading={loading} />
        <MobileRow title="Top Rated" items={topRated} mediaType={mediaType} loading={loading} />
        
        {/* Infinite Scroll Trending Section */}
        <div className="mt-8 px-4">
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 border-l-2 border-brand pl-2">
            Trending {activeTab}
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {trending.map((item, index) => (
              <div key={`trending-${item.id}-${index}`} ref={index === trending.length - 1 ? lastElementRef : null} className="w-full">
                <MobileMovieCard item={item} mediaType={mediaType} className="w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
