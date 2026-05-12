import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getTrendingTVShows,
  getPopularAnime,
  getTopRatedAnime,
  getTrendingAnime,
  searchAllMedia,
} from "../api/api";

import TopBar from "../components/TopBar";
import HeroSlider from "../components/HeroSlider";
import MediaRow from "../components/MediaRow";
import MovieCard from "../components/MovieCard";
import Breadcrumbs from "../components/Breadcrumbs";

import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  
  const [activeTab, setActiveTab] = useState("Movies");
  const [search, setSearch] = useState(q);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  /* ── Sync internal search with URL ── */
  useEffect(() => {
    setSearch(q);
  }, [q]);

  // Infinite scroll states
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchFilterTab, setSearchFilterTab] = useState("All");

  // Explore infinite scroll states
  const [exploreResults, setExploreResults] = useState([]);
  const [explorePage, setExplorePage] = useState(0);

  const [sliderItems, setSliderItems] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  const mediaType = activeTab === "Movies" ? "movie" : "tv";
  const showSearch = search.trim().length > 0;

  /* ── Fetch on tab change ── */
  useEffect(() => {
    // Only reset search if we are NOT on a search result page (or optionally keep it)
    if (!q) setSearch("");
    setLoading(true);
    setExploreResults([]);
    setExplorePage(2); // Page 1 is already in popular row

    let fetchPopular, fetchTopRated, fetchTrending;

    if (activeTab === "Movies") {
      fetchPopular = getPopularMovies();
      fetchTopRated = getTopRatedMovies();
      fetchTrending = getTrendingMovies();
    } else if (activeTab === "Anime") {
      fetchPopular = getPopularAnime();
      fetchTopRated = getTopRatedAnime();
      fetchTrending = getTrendingAnime();
    } else {
      fetchPopular = getPopularTVShows();
      fetchTopRated = getTopRatedTVShows();
      fetchTrending = getTrendingTVShows();
    }

    Promise.allSettled([fetchPopular, fetchTopRated, fetchTrending])
      .then(([pop, top, trend]) => {
        if (pop.status === 'fulfilled') setPopular(pop.value);
        else console.error('Popular fetch failed:', pop.reason);
        
        if (top.status === 'fulfilled') setTopRated(top.value);
        else console.error('Top Rated fetch failed:', top.reason);
        
        if (trend.status === 'fulfilled') {
          setTrending(trend.value);
          setSliderItems(trend.value.slice(0, 5));
        } else {
          console.error('Trending fetch failed:', trend.reason);
        }
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  /* ── Debounced search (Page 1) ── */
  useEffect(() => {
    if (!search.trim()) {
      setTimeout(() => {
        setSearchResults([]);
        setSearchPage(1);
        setExploreResults([]);
        setExplorePage(2);
      }, 0);
      return;
    }
    setSearching(true);
    setSearchPage(1);
    setExplorePage(0);
    setExploreResults([]);

    const t = setTimeout(() => {
      searchAllMedia(search, 1)
        .then((res) => {
          setSearchResults(res);
          if (res.length >= 10) {
            setHasMoreSearch(true);
          } else {
            setHasMoreSearch(false);
            setExplorePage(1);
          }
        })
        .catch(console.error)
        .finally(() => setSearching(false));
    }, 400);

    return () => clearTimeout(t);
  }, [search]);

  /* ── Infinite scroll fetch (Page > 1) ── */
  useEffect(() => {
    if (searchPage === 1 || !search.trim()) return;

    setIsLoadingMore(true);
    searchAllMedia(search, searchPage)
      .then((res) => {
        if (res.length === 0) {
          setHasMoreSearch(false);
          setExplorePage(1);
        } else {
          setSearchResults(prev => {
            const newRes = res.filter(r => !prev.some(p => p.id === r.id));
            return [...prev, ...newRes];
          });
          if (res.length < 10) {
            setHasMoreSearch(false);
            setExplorePage(1);
          } else {
            setHasMoreSearch(true);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingMore(false));
  }, [searchPage, search]);

  /* ── Explore Infinite scroll fetch ── */
  useEffect(() => {
    if (explorePage === 0) return;

    setIsLoadingMore(true);
    const fetcher =
      activeTab === "Movies"
        ? getPopularMovies
        : activeTab === "Anime"
        ? getPopularAnime
        : getPopularTVShows;

    fetcher(explorePage)
      .then((res) => {
        setExploreResults(prev => {
          const newRes = res.filter(r => 
            !prev.some(p => p.id === r.id) && 
            (!showSearch || !searchResults.some(s => s.id === r.id)) &&
            (!popular.some(p => p.id === r.id))
          );
          return [...prev, ...newRes];
        });
      })
      .catch(console.error)
      .finally(() => setIsLoadingMore(false));
  }, [explorePage, activeTab, showSearch]);

  /* ── Intersection Observer for infinite scroll ── */
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (searching || isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (hasMoreSearch && showSearch) {
          setSearchPage(prev => prev + 1);
        } else if (!showSearch || explorePage > 0) {
          setExplorePage(prev => prev + 1);
        }
      }
    });
    if (node) observer.current.observe(node);
  }, [searching, isLoadingMore, hasMoreSearch, explorePage, showSearch]);


  return (
    <div className="min-h-screen bg-bg-main">
      <Helmet>
        <title>Havtic Movie - Best Movies & TV Shows</title>
        <meta name="description" content="Watch the latest movies, TV shows, and anime online for free on Havtic Movie. Discover popular and trending content." />
        <meta property="og:title" content="Havtic Movie - Best Movies & TV Shows" />
        <meta property="og:description" content="Watch the latest movies, TV shows, and anime online for free." />
      </Helmet>

      <div className="p-4 md:p-6 lg:p-8">
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          search={search}
          setSearch={setSearch}
        />

        {showSearch ? (
          <section className="animate-fade-in">
            <Breadcrumbs paths={[{ label: `Search results for "${search}"` }]} />

            <h1 className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter mb-8">
              Search Results for <span className="text-brand">{search}</span>
            </h1>

            {/* Filter Tabs (Pills) */}
            <div className="flex flex-wrap gap-2 mb-10">
              {["All", "Series", "Movies", "Music"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSearchFilterTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                    searchFilterTab === tab
                      ? "bg-white text-black border-white shadow-lg shadow-white/10"
                      : "bg-bg-surface text-gray-400 border-white/5 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {searching && searchPage === 1 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 md:gap-4">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full aspect-2/3 rounded-2xl bg-bg-surface animate-pulse"
                  />
                ))}
              </div>
            ) : searchResults.length > 0 || exploreResults.length > 0 ? (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 md:gap-4">
                  {searchResults
                    .filter(item => {
                      if (searchFilterTab === "All") return true;
                      if (searchFilterTab === "Movies") return item.media_type === "movie";
                      if (searchFilterTab === "Series") return item.media_type === "tv";
                      if (searchFilterTab === "Music") return false; // Music not supported by TMDB search
                      return true;
                    })
                    .map((item, index) => {
                      const isLast = exploreResults.length === 0 && index === searchResults.length - 1;
                      return (
                        <div ref={isLast ? lastElementRef : null} key={`search-${item.id}`}>
                          <MovieCard
                            item={item}
                            mediaType={item.media_type || mediaType}
                          />
                        </div>
                      );
                    })}
                  
                  
                  {exploreResults.map((item, index) => {
                    const isLast = index === exploreResults.length - 1;
                    return (
                      <div ref={isLast ? lastElementRef : null} key={`explore-${item.id}`}>
                        <MovieCard
                          item={item}
                          mediaType={mediaType}
                        />
                      </div>
                    );
                  })}
                </div>
                
                {isLoadingMore && (
                  <div className="flex justify-center py-6 w-full">
                    <div className="w-8 h-8 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <svg
                  className="w-12 h-12 mb-3 opacity-30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                  />
                </svg>
                <p className="text-sm">No results found for "{search}"</p>
              </div>
            )}
          </section>
        ) : (
          <>
            <HeroSlider
              items={sliderItems}
              mediaType={mediaType}
            />
            <MediaRow
              title="Popular on Havtic Movie"
              items={popular}
              mediaType={mediaType}
              loading={loading}
            />
            <MediaRow
              title="Top Rated"
              items={topRated}
              mediaType={mediaType}
              loading={loading}
            />
            <MediaRow
              title="Trending This Week"
              items={trending}
              mediaType={mediaType}
              loading={loading}
            />

            {/* Explore More section with infinite scroll */}
            <div className="mt-12">
              <h3 className="text-white font-bold text-lg md:text-xl mb-6">
                Explore More {activeTab}
              </h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 md:gap-4">
                {exploreResults.map((item, index) => {
                  const isLast = index === exploreResults.length - 1;
                  return (
                    <div ref={isLast ? lastElementRef : null} key={`explore-home-${item.id}`}>
                      <MovieCard item={item} mediaType={mediaType} />
                    </div>
                  );
                })}
              </div>
              
              {isLoadingMore && (
                <div className="flex justify-center py-6 w-full mt-4">
                  <div className="w-8 h-8 border-4 border-white/10 border-t-brand rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
