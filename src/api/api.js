// Point to our backend proxy instead of direct TMDB
const BASE_URL = "/api/tmdb"; 

// ── Generic fetcher ──
const tmdbFetch = async (path, params = {}) => {
  const url = new URL(`${window.location.origin}${BASE_URL}${path}`);  
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
};

// ══════════════════════════════
//  MOVIES
// ══════════════════════════════

export const getPopularMovies = async (page = 1) => {
  const data = await tmdbFetch("/movie/popular", { page });
  return data.results;
};

export const getTopRatedMovies = async (page = 1) => {
  const data = await tmdbFetch("/movie/top_rated", { page });
  return data.results;
};

export const getTrendingMovies = async (timeWindow = "week", page = 1) => {
  const data = await tmdbFetch(`/trending/movie/${timeWindow}`, { page });
  return data.results;
};

export const getMovieDetails = async (id) => {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "credits,recommendations" });
};

export const searchMovies = async (query, page = 1) => {
  const data = await tmdbFetch("/search/movie", { query, page });
  return data.results;
};

// ══════════════════════════════
//  TV SHOWS
// ══════════════════════════════

export const getPopularTVShows = async (page = 1) => {
  const data = await tmdbFetch("/tv/popular", { page });
  return data.results;
};

export const getTopRatedTVShows = async (page = 1) => {
  const data = await tmdbFetch("/tv/top_rated", { page });
  return data.results;
};

export const getTrendingTVShows = async (timeWindow = "week", page = 1) => {
  const data = await tmdbFetch(`/trending/tv/${timeWindow}`, { page });
  return data.results;
};

export const getTVShowDetails = async (id) => {
  return tmdbFetch(`/tv/${id}`, { append_to_response: "credits,recommendations" });
};

export const searchTVShows = async (query, page = 1) => {
  const data = await tmdbFetch("/search/tv", { query, page });
  return data.results;
};

// ══════════════════════════════
//  ANIME  (Japanese animation)
// ══════════════════════════════

export const getPopularAnime = async (page = 1) => {
  const data = await tmdbFetch("/discover/tv", {
    with_genres: 16,
    with_origin_country: "JP",
    sort_by: "popularity.desc",
    page,
  });
  return data.results;
};

export const getTopRatedAnime = async (page = 1) => {
  const data = await tmdbFetch("/discover/tv", {
    with_genres: 16,
    with_origin_country: "JP",
    sort_by: "vote_average.desc",
    "vote_count.gte": 200,
    page,
  });
  return data.results;
};

export const getTrendingAnime = async () => {
  const data = await tmdbFetch("/trending/tv/week");
  // filter animation genre (16) from trending
  return (data.results || []).filter((item) =>
    item.genre_ids?.includes(16)
  );
};

export const searchAnime = async (query, page = 1) => {
  const data = await tmdbFetch("/search/tv", { query, page });
  return data.results;
};

// ══════════════════════════════
//  PEOPLE
// ══════════════════════════════

export const getPopularPeople = async (page = 1) => {
  const data = await tmdbFetch("/person/popular", { page });
  return data.results;
};

export const getPersonDetails = async (id) => {
  return tmdbFetch(`/person/${id}`);
};

export const getPersonCombinedCredits = async (id) => {
  const data = await tmdbFetch(`/person/${id}/combined_credits`);
  return data.cast;
};

// ══════════════════════════════
//  GLOBAL SEARCH
// ══════════════════════════════

export const searchAllMedia = async (query, page = 1) => {
  const data = await tmdbFetch("/search/multi", { query, page });
  
  // Filter out people, keep movies and TV shows (anime is categorized as TV)
  let results = data.results.filter(
    (item) => item.media_type === "movie" || item.media_type === "tv"
  );

  // Sort exact matches to the top
  const lowerQuery = query.toLowerCase().trim();
  results.sort((a, b) => {
    const titleA = (a.title || a.name || "").toLowerCase().trim();
    const titleB = (b.title || b.name || "").toLowerCase().trim();
    
    const aExact = titleA === lowerQuery ? 1 : 0;
    const bExact = titleB === lowerQuery ? 1 : 0;
    
    if (aExact !== bExact) {
      return bExact - aExact; // exact matches first
    }
    
    // Fallback: starts with
    const aStarts = titleA.startsWith(lowerQuery) ? 1 : 0;
    const bStarts = titleB.startsWith(lowerQuery) ? 1 : 0;
    
    if (aStarts !== bStarts) {
      return bStarts - aStarts;
    }
    
    // Default TMDB popularity sort
    return (b.popularity || 0) - (a.popularity || 0);
  });

  return results;
};

export const getAwardWinningMovies = async (page = 1) => {
  const data = await tmdbFetch("/discover/movie", {
    sort_by: "vote_average.desc",
    "vote_count.gte": 1000,
    "vote_average.gte": 8,
    page,
  });
  return data.results;
};

// ══════════════════════════════
//  GENRE MAP  (handy for labels)
// ══════════════════════════════

export const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
  10759: "Action & Adventure",
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};