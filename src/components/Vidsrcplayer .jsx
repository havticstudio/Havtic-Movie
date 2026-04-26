import { useState, useEffect } from "react";
import { getTVShowDetails, getMovieDetails } from "../api/api";

const SERVERS = [
  {
    name: "Server 1",
    getUrl: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.net/embed/movie?tmdb=${id}`
        : `https://vidsrc.net/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: "Server 2",
    getUrl: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.pro/embed/movie/${id}`
        : `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "Server 3",
    getUrl: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.cc/v2/embed/movie/${id}`
        : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "Server 4",
    getUrl: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.me/embed/movie?tmdb=${id}`
        : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
];

/**
 * VidSrcPlayer
 * Props:
 *   item      – TMDB item object
 *   mediaType – "movie" | "tv"
 *   onClose   – close handler
 */

export default function VidSrcPlayer({ item, mediaType, onClose }) {
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [activeServer, setActiveServer] = useState(SERVERS[0]);
  const [language, setLanguage] = useState("Auto");

  // Fetch full details
  useEffect(() => {
    if (!item) return;
    const fetcher =
      mediaType === "movie"
        ? getMovieDetails(item.id)
        : getTVShowDetails(item.id);
    setLoadingDetails(true);
    fetcher
      .then((d) => setDetails(d))
      .catch(console.error)
      .finally(() => setLoadingDetails(false));
  }, [item, mediaType]);

  // Handle body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (!item) return null;

  const title = item.name || item.title || "Unknown";

  const embedSrc = activeServer.getUrl(mediaType, item.id, season, episode);

  const seasons =
    details?.seasons?.filter((s) => s.season_number > 0) || [];
  const currentSeason = seasons.find((s) => s.season_number === season);
  const episodeCount = currentSeason?.episode_count || 1;

  const year = (details?.release_date || details?.first_air_date || "").split("-")[0];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d0f14] overflow-y-auto">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
        
        {/* ── Header ── */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <h1 className="text-gray-200 text-lg md:text-xl font-medium flex items-center gap-2">
            {title} {year ? `[${year}]` : ""} {mediaType === "tv" && `S${String(season).padStart(2, "0")}`}
          </h1>
          <div className="flex items-center gap-4">
            <button className="bg-[#adc5bb] text-gray-900 px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#9cb3a9] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download App
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-[#232531] p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Main Content Split ── */}
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Left: Video Player & Details */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Player Container */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl" style={{ paddingTop: "56.25%" }}>
              <iframe
                key={embedSrc}
                src={embedSrc}
                className="absolute inset-0 w-full h-full"
                allowFullScreen={true}
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allow="autoplay; fullscreen; picture-in-picture"
                frameBorder="0"
                scrolling="no"
                title={title}
              />
            </div>

            {/* Below Player Warning/Report */}
            <div className="flex justify-between items-center text-xs md:text-sm text-gray-400 bg-[#15171e] px-4 py-3 rounded-lg border border-white/5">
              <p>Find any content infringes on your rights, please contact us.</p>
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report
              </button>
            </div>

            {/* Movie / Show Details */}
            {details && (
              <div className="mt-6 bg-[#1a1c24] p-6 rounded-xl border border-white/5">
                <div className="flex flex-col md:flex-row gap-6">
                  {details.poster_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                      alt={title}
                      className="w-32 md:w-48 rounded-lg shadow-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
                    
                    <div className="flex flex-wrap gap-3 items-center text-sm text-gray-400 mb-4">
                      {details.vote_average > 0 && (
                        <span className="flex items-center gap-1 text-[#00e5c4] font-medium">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {details.vote_average.toFixed(1)}
                        </span>
                      )}
                      <span>{year}</span>
                      {details.runtime && <span>{details.runtime} min</span>}
                      {details.number_of_seasons && <span>{details.number_of_seasons} Seasons</span>}
                      
                      <div className="flex gap-2">
                        {details.genres?.map(g => (
                          <span key={g.id} className="px-2 py-0.5 rounded border border-gray-600 text-xs">
                            {g.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                      {details.overview}
                    </p>

                    {details.tagline && (
                      <p className="text-gray-500 italic">"{details.tagline}"</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Resources / Episodes Sidebar */}
          <div className="xl:w-80 2xl:w-96 shrink-0">
            <div className="bg-[#242631] rounded-xl p-5 sticky top-6">
              <h3 className="text-gray-100 font-semibold text-lg mb-1">Resources</h3>
              <p className="text-xs text-gray-400 mb-5 flex items-center gap-2">
                Source: Multiple <span className="w-1 h-1 rounded-full bg-gray-500"></span> By TMDB
              </p>

              {/* Language & Server Selectors (Common for both Movie and TV) */}
              <div className="flex gap-2 mb-5">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 bg-[#323443] text-gray-200 text-sm rounded-lg px-2 py-2.5 outline-none border border-transparent focus:border-[#adc5bb] appearance-none cursor-pointer"
                >
                  <option value="Auto">Auto / Dub</option>
                  <option value="Hindi">Hindi Dub</option>
                  <option value="English">English</option>
                </select>
                
                <select 
                  value={activeServer.name}
                  onChange={(e) => {
                    const found = SERVERS.find(s => s.name === e.target.value);
                    if (found) setActiveServer(found);
                  }}
                  className="flex-1 bg-[#323443] text-gray-200 text-sm rounded-lg px-2 py-2.5 outline-none border border-transparent focus:border-[#adc5bb] appearance-none cursor-pointer"
                >
                  {SERVERS.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {mediaType === "tv" ? (
                <>
                  <div className="mb-5">
                    <select 
                      value={season}
                      onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
                      className="w-full bg-[#323443] text-gray-200 text-sm rounded-lg px-3 py-2.5 outline-none border border-transparent focus:border-[#adc5bb] appearance-none cursor-pointer"
                    >
                      {seasons.map(s => (
                        <option key={s.season_number} value={s.season_number}>
                          Season {String(s.season_number).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {loadingDetails ? (
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-10 rounded-lg bg-[#323443] animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                      {Array.from({ length: episodeCount }).map((_, i) => {
                        const ep = i + 1;
                        const isActive = episode === ep;
                        return (
                          <button
                            key={ep}
                            onClick={() => setEpisode(ep)}
                            className={`h-10 rounded-lg flex justify-center items-center font-medium transition-all ${
                              isActive 
                                ? 'bg-[#184029] text-[#00e5c4] shadow-inner shadow-black/20' 
                                : 'bg-[#323443] text-gray-300 hover:bg-[#3d4052] hover:text-white'
                            }`}
                          >
                            {isActive ? (
                              <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="4" y="10" width="4" height="10" />
                                <rect x="10" y="4" width="4" height="16" />
                                <rect x="16" y="13" width="4" height="7" />
                              </svg>
                            ) : (
                              String(ep).padStart(2, '0')
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-[#184029] text-[#00e5c4] px-4 py-3 rounded-lg text-center font-medium shadow-inner shadow-black/20 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Full Movie Playing
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      {/* Scrollbar styling for the episode list */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #242631;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3d4052;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a4d62;
        }
      `}</style>
    </div>
  );
}
