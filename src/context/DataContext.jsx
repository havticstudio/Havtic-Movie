import { createContext, useContext, useState, useCallback } from "react";
import * as api from "../api/api";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [cache, setCache] = useState({
    movie: {
      popular: null,
      topRated: null,
      trending: [],
      page: 0,
      hasMore: true,
    },
    tv: {
      popular: null,
      topRated: null,
      trending: [],
      page: 0,
      hasMore: true,
    },
    discover: {}, // key based cache for discovery
    awards: null,
    genres: {},
  });

  const getHomeData = useCallback(async (type) => {
    // We'll fetch the current cache value inside the function if needed, 
    // but better to just use the functional update for setting.
    // For checking existence, we can use a ref or just fetch anyway (API results will be the same)
    // To keep it simple and stable, we remove the cache dependency.
    
    const fetchPopular = type === "movie" ? api.getPopularMovies() : api.getPopularTVShows();
    const fetchTopRated = type === "movie" ? api.getTopRatedMovies() : api.getTopRatedTVShows();

    const [pop, top] = await Promise.all([fetchPopular, fetchTopRated]);

    setCache((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        popular: pop,
        topRated: top,
      },
    }));

    return { popular: pop, topRated: top };
  }, []); // Stable

  const getTrendingData = useCallback(async (type, page) => {
    const fetchTrending = type === "movie" ? api.getTrendingMovies("week", page) : api.getTrendingTVShows("week", page);
    const results = await fetchTrending;

    setCache((prev) => {
      const existing = prev[type].trending;
      const newItems = results.filter(newItem => !existing.some(oldItem => oldItem.id === newItem.id));
      return {
        ...prev,
        [type]: {
          ...prev[type],
          trending: [...existing, ...newItems],
          page: page,
          hasMore: results.length > 0,
        },
      };
    });

    return results;
  }, []); // Stable

  const getDiscoverData = useCallback(async (filters, page) => {
    const results = await api.discoverMedia({ ...filters, page });
    const cacheKey = JSON.stringify({ ...filters, page });
    
    setCache((prev) => ({
      ...prev,
      discover: {
        ...prev.discover,
        [cacheKey]: results,
      },
    }));

    return results;
  }, []); // Stable

  const value = {
    cache,
    getHomeData,
    getTrendingData,
    getDiscoverData,
    setCache,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
