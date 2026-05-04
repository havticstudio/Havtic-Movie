import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { useData } from "../context/DataContext";

import MobileHero from "./components/MobileHero";
import MobileRow from "./components/MobileRow";
import MobileMovieCard from "./components/MobileMovieCard";

export default function MobileHome() {
  const { openSidebar } = useOutletContext();
  const { cache, getHomeData, getTrendingData } = useData();
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

  // Initial Fetch & Tab Change Logic
  useEffect(() => {
    const type = activeTab === "Movies" ? "movie" : "tv";

    // Use cached data immediately if available
    const cachedType = cache[type];
    if (cachedType.popular && cachedType.topRated) {
      setPopular(cachedType.popular);
      setTopRated(cachedType.topRated);
      setLoading(false);
    } else {
      setLoading(true);
      getHomeData(type).then(({ popular, topRated }) => {
        setPopular(popular);
        setTopRated(topRated);
        setLoading(false);
      });
    }

    // Handle trending cache
    if (cachedType.trending.length > 0) {
      setTrending(cachedType.trending);
      setPage(cachedType.page || 1);
      setHasMore(cachedType.hasMore);
    } else {
      setTrending([]);
      setPage(1);
      setHasMore(true);
    }
  }, [activeTab, getHomeData, cache.movie.popular, cache.tv.popular]); // Specific deps to avoid loops

  // Infinite fetch for trending section
  useEffect(() => {
    const type = activeTab === "Movies" ? "movie" : "tv";
    
    // Only fetch if this page hasn't been loaded yet
    if (page > cache[type].page) {
      if (page > 1) setLoadingMore(true);
      
      getTrendingData(type, page).then((results) => {
        if (results.length === 0) setHasMore(false);
        setLoadingMore(false);
      }).catch(err => {
        console.error(err);
        setLoadingMore(false);
      });
    } else if (cache[type].trending.length > 0) {
      // Data is already in cache and synced via the first useEffect
      setTrending(cache[type].trending);
      setHasMore(cache[type].hasMore);
    }
  }, [activeTab, page, getTrendingData, cache.movie.page, cache.tv.page]);

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
              <div
                key={`trending-${item.id}-${index}`}
                ref={index === trending.length - 1 ? lastElementRef : null}
                className="w-full"
              >
                <MobileMovieCard item={item} mediaType={mediaType} className="w-full" />
              </div>
            ))}
          </div>
          {loadingMore && (
             <div className="py-4 flex justify-center">
                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
