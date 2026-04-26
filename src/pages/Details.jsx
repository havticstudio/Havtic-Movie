import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getTVShowDetails, getMovieDetails } from "../api/api";
import MovieCard from "../components/MovieCard";

const SERVERS = [
  {
    name: "Server 1",
    getUrl: (type, id, s, e) =>
      type === "movie"
        ? `https://vsembed.su/embed/movie?tmdb=${id}`
        : `https://vsembed.su/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    name: "Server 2",
    getUrl: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.cc/v2/embed/movie/${id}`
        : `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`,
  },
  {
    name: "Server 3",
    getUrl: (type, id, s, e) =>
      type === "movie"
        ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
];

export default function Watch() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [activeServer, setActiveServer] = useState(SERVERS[0]);
  const playerContainerRef = useRef(null);

  // Keyboard shortcuts (Fullscreen)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          playerContainerRef.current?.requestFullscreen().catch(err => {
            console.log("Error attempting to enable fullscreen:", err);
          });
        } else {
          document.exitFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch full details
  useEffect(() => {
    if (!id || !mediaType) return;
    const fetcher =
      mediaType === "movie"
        ? getMovieDetails(id)
        : getTVShowDetails(id);
    setLoadingDetails(true);
    fetcher
      .then((d) => setDetails(d))
      .catch(console.error)
      .finally(() => setLoadingDetails(false));
  }, [id, mediaType]);

  const title = details?.name || details?.title || "Loading...";

  const embedSrc = activeServer.getUrl(mediaType, id, season, episode);

  const seasons = details?.seasons?.filter((s) => s.season_number > 0) || [];
  const currentSeason = seasons.find((s) => s.season_number === season);
  const episodeCount = currentSeason?.episode_count || 1;

  const year = (details?.release_date || details?.first_air_date || "").split("-")[0];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white overflow-x-hidden">
      <Helmet>
        <title>{title} - Watch on TinyMoviez</title>
        <meta name="description" content={details?.overview || `Watch ${title} online for free in high quality.`} />
        <meta property="og:title" content={`${title} - Watch on TinyMoviez`} />
        <meta property="og:description" content={details?.overview || `Watch ${title} online for free.`} />
        {details?.poster_path && <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${details.poster_path}`} />}
      </Helmet>
      <div className="w-full p-4 md:p-6 lg:p-10">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6 max-w-[1800px] mx-auto border-b border-white/5 pb-4">
          <h1 className="text-gray-300 text-sm md:text-base font-medium">
            {title} {mediaType === "tv" && `[S${String(season).padStart(2, "0")} E${String(episode).padStart(2, "0")}]`}
          </h1>
          <button className="bg-[#adc5bb] text-gray-900 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-[#9cb3a9] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Download App
          </button>
        </div>                {/* ── Top Area: Player + Server Sidebar ── */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8 max-w-[1800px] mx-auto">
          
          {/* Left: Video Player */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Player Container */}
            <div ref={playerContainerRef} className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl group" style={{ paddingTop: "56.25%" }}>
              <iframe
                key={embedSrc}
                src={embedSrc}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
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
          </div>

          {/* Right: Resources / Episodes Sidebar */}
          <div className="xl:w-[400px] shrink-0">
            <div className="bg-[#1c1e26] rounded-xl p-6 border border-white/5 h-full">
              <h3 className="text-gray-100 font-bold text-xl mb-1">Resources</h3>
              <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest font-semibold">
                Source: Multiple Servers | By TinyMoviez
              </p>

              {/* Server Selector */}
              <div className="mb-6">
                <div className="relative">
                  <select 
                    value={activeServer.name}
                    onChange={(e) => {
                      const found = SERVERS.find(s => s.name === e.target.value);
                      if (found) setActiveServer(found);
                    }}
                    className="w-full bg-[#2a2d3a] text-gray-200 text-xs rounded-lg px-4 py-3 outline-none border border-white/5 focus:border-[#adc5bb] appearance-none cursor-pointer"
                  >
                    {SERVERS.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
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
                <div className="bg-[#184029] text-[#00e5c4] px-4 py-4 rounded-lg text-center font-bold text-xs shadow-inner shadow-black/20 flex items-center justify-center gap-3 border border-[#00e5c4]/10">
                  <div className="w-2 h-2 rounded-full bg-[#00e5c4] animate-pulse"></div>
                  {title} {details?.original_language === 'hi' ? '[Hindi]' : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Area: IMDB-style Details ── */}
        {details && (
          <div className="flex flex-col gap-8 max-w-[1800px] mx-auto">
            {/* Banner */}
            <div className="bg-[#15171e] p-4 md:p-6 rounded-xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row gap-6">
              {details.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                  alt={title}
                  className="w-32 md:w-48 lg:w-56 rounded-lg shadow-2xl object-cover shrink-0 z-10"
                />
              )}
              <div className="flex-1 flex flex-col justify-center z-10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
                      {title} {details?.original_language === 'hi' ? '[Hindi]' : ''}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mt-2 font-medium">
                      {year && <span>{year}</span>}
                      {details.adult !== undefined && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                          <span>{details.adult ? "R" : "PG-13"}</span>
                        </>
                      )}
                      {details.production_countries?.[0] && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                          <span>{details.production_countries[0].name}</span>
                        </>
                      )}
                      {details.genres?.length > 0 && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                          <span>{details.genres.map(g => g.name).join(" | ")}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Rating Block */}
                  {details.vote_average > 0 && (
                    <div className="text-right shrink-0">
                      <div className="text-4xl font-bold text-white flex items-center justify-end gap-1">
                        <svg className="w-8 h-8 text-[#f5c518]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{details.vote_average.toFixed(1)}</span>
                        <span className="text-lg text-gray-400 font-normal">/10</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{details.vote_count?.toLocaleString()} people rated</div>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-6 max-w-4xl">
                  {details.overview}
                  <span className="text-white font-semibold cursor-pointer ml-2 hover:underline">More {'>'}</span>
                </p>
                {details.tagline && <p className="text-gray-500 italic mt-2">"{details.tagline}"</p>}
              </div>

              {/* Faint Background Banner */}
              {details.backdrop_path && (
                <div 
                  className="absolute inset-0 opacity-10 object-cover bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${details.backdrop_path})` }}
                />
              )}
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
              
              {/* Cast */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center border-l-4 border-[#f5c518] pl-2">
                  Top Cast <span className="text-gray-500 text-sm font-normal ml-2">({details.credits?.cast?.length || 0})</span>
                </h3>
                
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                  {details.credits?.cast?.slice(0, 15).map(actor => (
                    <div key={actor.id} className="w-28 md:w-32 shrink-0 snap-start">
                      <div className="w-full aspect-[2/3] bg-[#232531] rounded-lg overflow-hidden mb-2">
                        {actor.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-200 truncate" title={actor.name}>{actor.name}</p>
                      <p className="text-xs text-gray-500 truncate" title={actor.character}>{actor.character}</p>
                    </div>
                  ))}
                  {(!details.credits?.cast || details.credits.cast.length === 0) && (
                    <p className="text-gray-500 text-sm">No cast information available.</p>
                  )}
                </div>
              </div>

              {/* More Like This */}
              <div className="xl:w-[350px] shrink-0">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center border-l-4 border-[#f5c518] pl-2">
                  More like this
                </h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {details.recommendations?.results?.slice(0, 4).map(item => (
                    <MovieCard key={item.id} item={item} mediaType={mediaType} />
                  ))}
                  {(!details.recommendations?.results || details.recommendations.results.length === 0) && (
                    <p className="text-gray-500 text-sm col-span-2">No recommendations available.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

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
    </div>
  );
}
