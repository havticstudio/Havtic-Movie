import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getTVShowDetails, getMovieDetails } from "../api/api";
import MovieCard from "../components/MovieCard";
import Player from "../components/Player";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";


export default function Watch() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { user, addToWatchlist, removeFromWatchlist, addToCompleted, removeFromCompleted } = useAuth();

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [sourceLinks, setSourceLinks] = useState({ link1: '', link2: '', link3: '' });
  
  const playerContainerRef = useRef(null);

  // Keyboard shortcuts (Fullscreen enabled via 'F' key)
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
  
  // Fetch existing custom links
  useEffect(() => {
    if (!id) return;
    fetch(`/api/media/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSourceLinks({
            link1: data.customUrl1 || '',
            link2: data.customUrl2 || '',
            link3: data.customUrl3 || ''
          });
        }
      });
  }, [id]);

  const title = details?.name || details?.title || "Loading...";

  const seasons = details?.seasons?.filter((s) => s.season_number > 0) || [];
  const currentSeason = seasons.find((s) => s.season_number === season);
  const episodeCount = currentSeason?.episode_count || 1;

  const year = (details?.release_date || details?.first_air_date || "").split("-")[0];

  const numericId = Number(id);
  const inWatchlist = user?.watchlist?.some(w => Number(w.id) === numericId);
  const inCompleted = user?.completed?.some(c => Number(c.id) === numericId);

  const handleWatchlist = () => {
    if (!user) return navigate("/login");
    if (inWatchlist) {
      removeFromWatchlist(numericId);
    } else {
      addToWatchlist({
        id: numericId,
        title: details.title || null,
        name: details.name || null,
        poster_path: details.poster_path,
        media_type: mediaType,
        vote_average: details.vote_average,
        release_date: details.release_date || null,
        first_air_date: details.first_air_date || null
      });
    }
  };

  const handleCompleted = () => {
    if (!user) return navigate("/login");
    if (inCompleted) {
      removeFromCompleted(numericId);
    } else {
      addToCompleted({
        id: numericId,
        title: details.title || null,
        name: details.name || null,
        poster_path: details.poster_path,
        media_type: mediaType,
        vote_average: details.vote_average,
        release_date: details.release_date || null,
        first_air_date: details.first_air_date || null
      });
    }
  };

  return (
    <div className="text-white">
      {details && (
        <Helmet>
          <title>{title} - Watch on Havtic Movie</title>
          <meta name="description" content={details?.overview || `Watch ${title} online for free in high quality.`} />
          <meta property="og:title" content={`${title} - Watch on Havtic Movie`} />
          <meta property="og:description" content={details?.overview || `Watch ${title} online for free.`} />
          {details?.poster_path && <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${details.poster_path}`} />}
        </Helmet>
      )}
      <div className="w-full p-4 md:p-6 lg:p-10">
        
        {/* Breadcrumbs */}
        <div className="max-w-[1800px] mx-auto px-1">
          <Breadcrumbs 
            paths={[
              { label: mediaType === "movie" ? "Movies" : "Series", link: "/" },
              { label: title }
            ]} 
          />
        </div>

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 max-w-[1800px] mx-auto border-b border-white/5 pb-6 gap-4">
          <h1 className="text-gray-300 text-sm md:text-xl font-black uppercase tracking-tight">
            {title} {mediaType === "tv" && `[S${String(season).padStart(2, "0")} E${String(episode).padStart(2, "0")}]`}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3">
             <button 
               onClick={handleWatchlist}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border cursor-pointer ${
                 inWatchlist 
                   ? "bg-brand/10 border-brand/30 text-brand" 
                   : "bg-bg-surface border-white/5 text-gray-400 hover:text-white"
               }`}
             >
               <svg className="w-4 h-4" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
               </svg>
               {inWatchlist ? "In Watchlist" : "Add Watchlist"}
             </button>

             <button 
               onClick={handleCompleted}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border cursor-pointer ${
                 inCompleted 
                   ? "bg-green-500/10 border-green-500/30 text-green-500" 
                   : "bg-bg-surface border-white/5 text-gray-400 hover:text-white"
               }`}
             >
               <svg className="w-4 h-4" fill={inCompleted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
               {inCompleted ? "Watched" : "Mark Finished"}
             </button>

             <div className="w-[1px] h-6 bg-white/10 hidden sm:block mx-1"></div>

             <button className="bg-brand text-white px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 cursor-pointer">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
               </svg>
               App
             </button>
              {user?.isAdmin && (
                <button 
                  onClick={() => setShowSourceModal(true)}
                  className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-yellow-600 transition-all shadow-lg shadow-yellow-500/20 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Add Source
                </button>
              )}
          </div>
        </div>

        {/* ── Source Modal ── */}
        {showSourceModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-bg-surface border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl scale-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Add Movie Sources</h2>
                <button onClick={() => setShowSourceModal(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">VIP Source 1 (Primary)</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/embed/1" 
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand transition-all"
                    value={sourceLinks.link1}
                    onChange={(e) => setSourceLinks({...sourceLinks, link1: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">VIP Source 2</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/embed/2" 
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand transition-all"
                    value={sourceLinks.link2}
                    onChange={(e) => setSourceLinks({...sourceLinks, link2: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">VIP Source 3</label>
                  <input 
                    type="text" 
                    placeholder="https://example.com/embed/3" 
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand transition-all"
                    value={sourceLinks.link3}
                    onChange={(e) => setSourceLinks({...sourceLinks, link3: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setShowSourceModal(false)}
                  className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    const res = await fetch('/api/media/save', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ 
                        tmdbId: id, 
                        type: mediaType, 
                        customUrl1: sourceLinks.link1,
                        customUrl2: sourceLinks.link2,
                        customUrl3: sourceLinks.link3,
                        title 
                      })
                    });
                    if (res.ok) {
                      setShowSourceModal(false);
                      alert("Sources saved successfully!");
                      window.location.reload();
                    }
                  }}
                  className="flex-1 bg-brand text-white font-black py-3 rounded-xl shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all"
                >
                  Save Links
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col xl:flex-row gap-6 mb-8 max-w-[1800px] mx-auto">
          
          {/* Left: Video Player */}
          <div className="flex-1 flex flex-col gap-2">
            {/* Player Container */}
            <div ref={playerContainerRef} className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl group">
              <Player 
                imdbId={id} 
                type={mediaType} 
                season={season} 
                episode={episode} 
                title={title} 
              />
            </div>


            {/* Below Player Warning/Report */}
            <div className="flex justify-between items-center text-xs md:text-sm text-gray-400 bg-bg-surface px-4 py-3 rounded-lg border border-white/5">
              <p>Find any content infringes on your rights, please contact us.</p>
              <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Report
              </button>
            </div>
          </div>

          {/* Right: Resources / Episodes Sidebar */}
          <div className="xl:w-[400px] shrink-0">
            <div className="bg-bg-surface rounded-xl p-6 border border-white/5 h-full">
              <h3 className="text-gray-100 font-bold text-xl mb-1">Playlist</h3>
              <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest font-semibold">
                Source: Havtic Player | Premium
              </p>

              {mediaType === "tv" ? (
                <>
                  <div className="mb-5">
                    <select 
                      value={season}
                      onChange={(e) => { setSeason(Number(e.target.value)); setEpisode(1); }}
                      className="w-full bg-bg-surface-hover text-gray-200 text-sm rounded-lg px-3 py-2.5 outline-none border border-transparent focus:border-brand appearance-none cursor-pointer"
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
                        <div key={i} className="h-10 rounded-lg bg-bg-surface-hover animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-hide">
                      {Array.from({ length: episodeCount }).map((_, i) => {
                        const ep = i + 1;
                        const isActive = episode === ep;
                        return (
                          <button
                            key={ep}
                            onClick={() => setEpisode(ep)}
                            className={`h-10 rounded-lg flex justify-center items-center font-medium transition-all cursor-pointer ${
                              isActive 
                                ? 'bg-brand/20 text-brand shadow-inner shadow-black/20' 
                                : 'bg-bg-surface-hover text-gray-300 hover:bg-bg-surface hover:text-white'
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
                <div className="bg-brand/20 text-brand px-4 py-4 rounded-lg text-center font-bold text-xs shadow-inner shadow-black/20 flex items-center justify-center gap-3 border border-brand/10">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
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
            <div className="bg-bg-surface p-4 md:p-6 rounded-xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row gap-6">
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
                        <svg className="w-8 h-8 text-brand" fill="currentColor" viewBox="0 0 20 20">
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

            <div className="flex flex-col gap-8">
              
              {/* Cast */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center border-l-4 border-brand pl-2">
                  Top Cast <span className="text-gray-500 text-sm font-normal ml-2">({details.credits?.cast?.length || 0})</span>
                </h3>
                
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {details.credits?.cast?.slice(0, 15).map(actor => (
                    <div key={actor.id} className="w-28 md:w-32 shrink-0 snap-start">
                      <div className="w-full aspect-[2/3] bg-bg-surface-hover rounded-lg overflow-hidden mb-2">
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
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center border-l-4 border-brand pl-2">
                  More like this
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8">
                  {details.recommendations?.results?.slice(0, 12).map(item => (
                    <MovieCard key={item.id} item={item} mediaType={mediaType} />
                  ))}
                  {(!details.recommendations?.results || details.recommendations.results.length === 0) && (
                    <p className="text-gray-500 text-sm col-span-full">No recommendations available.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
