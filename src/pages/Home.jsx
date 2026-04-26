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

export default function Home() {
  const [activeTab, setActiveTab] = useState("Movies");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  // Infinite scroll states
  const [searchPage, setSearchPage] = useState(1);
  const [hasMoreSearch, setHasMoreSearch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    setSearch("");
    setTimeout(() => setLoading(true), 0);
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

    Promise.all([fetchPopular, fetchTopRated, fetchTrending])
      .then(([pop, top, trend]) => {
        setSliderItems(trend.slice(0, 5));
        setPopular(pop);
        setTopRated(top);
        setTrending(trend);
      })
      .catch(console.error)
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
    <div className="min-h-screen bg-[#13151f]">
      <Helmet>
        <title>TinyMoviez - Best Movies & TV Shows</title>
        <meta name="description" content="Watch the latest movies, TV shows, and anime online for free on TinyMoviez. Discover popular and trending content." />
        <meta property="og:title" content="TinyMoviez - Best Movies & TV Shows" />
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
          <section>
            <h3 className="text-white font-bold text-lg mb-4">
              Results for <span className="text-[#00e5c4]">"{search}"</span>
            </h3>
            {searching && searchPage === 1 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 md:gap-4">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full aspect-2/3 rounded-2xl bg-[#1a1d27] animate-pulse"
                  />
                ))}
              </div>
            ) : searchResults.length > 0 || exploreResults.length > 0 ? (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 md:gap-4">
                  {searchResults.map((item, index) => {
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
                    <div className="w-8 h-8 border-4 border-gray-600 border-t-[#00e5c4] rounded-full animate-spin"></div>
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
              title="Popular on TinyMoviez"
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
                  <div className="w-8 h-8 border-4 border-gray-600 border-t-[#00e5c4] rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
