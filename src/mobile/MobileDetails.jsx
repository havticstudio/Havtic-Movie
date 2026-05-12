import { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getTVShowDetails, getMovieDetails } from "../api/api";
import Player from "../components/Player";
import { useAuth } from "../context/AuthContext";
import MobileMovieCard from "./components/MobileMovieCard";

const IMG_BASE = import.meta.env.VITE_IMG_URL;

export default function MobileDetails() {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { openSidebar } = useOutletContext() || {};
  const { user, addToWatchlist, removeFromWatchlist } = useAuth();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // TV Show States
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!id || !mediaType) return;
    window.scrollTo(0,0);
    setLoading(true);
    setIsPlaying(false);
    
    const fetcher = mediaType === "movie" ? getMovieDetails(id) : getTVShowDetails(id);
    fetcher.then(setDetails).catch(console.error).finally(() => setLoading(false));
  }, [id, mediaType]);

  if (loading || !details) {
    return <div className="min-h-screen bg-black"></div>;
  }

  const title = details.name || details.title;
  const year = (details.release_date || details.first_air_date || "").split("-")[0];
  const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0]);
  
  const numericId = Number(id);
  const inWatchlist = user?.watchlist?.some(w => Number(w.id) === numericId);

  const handleWatchlist = () => {
    if (!user) return navigate("/login");
    if (inWatchlist) removeFromWatchlist(numericId);
    else {
      addToWatchlist({
        id: numericId, title: details.title || null, name: details.name || null,
        poster_path: details.poster_path, media_type: mediaType,
        vote_average: details.vote_average, release_date: details.release_date || null,
        first_air_date: details.first_air_date || null
      });
    }
  };

  const seasons = details.seasons?.filter(s => s.season_number > 0) || [];
  const currentSeason = seasons.find(s => s.season_number === season);
  const episodeCount = currentSeason?.episode_count || 1;

  return (
    <div className="min-h-screen bg-bg-main pb-20">
      <Helmet><title>{title}</title></Helmet>

      {/* Top Header */}
      {!isPlaying && (
        <button onClick={() => navigate(-1)} className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}

      {/* Player or Hero Banner */}
      {isPlaying ? (
        <div className="w-full sticky top-0 z-50 bg-bg-main shadow-2xl flex flex-col">
          {/* Top Bar */}
          <div className="w-full h-14 flex items-center justify-between px-4 bg-bg-main/90 backdrop-blur-md border-b border-white/5">
            <button 
              onClick={() => navigate('/apps')} 
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
            <span className="text-white text-xs font-black uppercase tracking-[0.2em]">{title.length > 20 ? title.slice(0,20)+'...' : title}</span>
            <button 
              onClick={() => openSidebar?.()}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
          
          <div className="w-full aspect-video bg-black">
            <Player 
              mediaType={mediaType} 
              tmdbId={id} 
              imdbId={details.imdb_id}
              season={season} 
              episode={episode} 
              title={title} 
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-[4/5]">
          <img src={details.poster_path ? `${IMG_BASE}${details.poster_path}` : ""} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/50 to-transparent" />
          
          <div className="absolute bottom-6 left-4 right-4 flex flex-col items-center text-center">
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-xl">{title}</h1>
            <div className="flex items-center justify-center gap-3 mt-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              <span className="text-green-400">{details.vote_average?.toFixed(1)} MATCH</span>
              <span>{year}</span>
              {runtime && <span>{runtime}m</span>}
              <span className="border border-white/20 px-1 rounded-sm">HD</span>
            </div>
            
            <button 
              onClick={() => setIsPlaying(true)}
              className="mt-6 w-full max-w-[250px] bg-white text-black py-3 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-white/20 active:scale-95 transition-transform flex justify-center items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Play
            </button>
            <button 
              onClick={handleWatchlist}
              className="mt-3 w-full max-w-[250px] bg-white/10 backdrop-blur-md text-white py-3 rounded-full font-bold uppercase tracking-widest text-xs border border-white/10 active:scale-95 transition-transform flex justify-center items-center gap-2"
            >
              {inWatchlist ? "Remove from List" : "Add to List"}
            </button>
          </div>
        </div>
      )}

      {/* Details Content */}
      <div className="px-4 mt-6">
        <p className="text-gray-300 text-sm leading-relaxed">{details.overview}</p>

        {/* Cast Preview */}
        {details.credits?.cast?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">Cast</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x">
              {details.credits.cast.slice(0, 10).map((actor) => (
                <div key={actor.id} className="flex flex-col items-center shrink-0 w-16 snap-start">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-bg-surface mb-2 border border-white/10">
                    <img 
                      src={actor.profile_path ? `${IMG_BASE}${actor.profile_path}` : "https://placehold.co/100x100/1a1d27/555?text=NA"} 
                      alt={actor.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-[9px] font-bold text-center leading-tight line-clamp-2">{actor.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TV Show Seasons */}
        {mediaType === "tv" && seasons.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">Episodes</h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
              {seasons.map(s => (
                <button
                  key={s.season_number}
                  onClick={() => setSeason(s.season_number)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors ${
                    season === s.season_number ? "bg-brand text-white" : "bg-white/5 text-gray-400"
                  }`}
                >
                  Season {s.season_number}
                </button>
              ))}
            </div>

            <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-4">
              {Array.from({ length: episodeCount }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => { setEpisode(i + 1); setIsPlaying(true); }}
                  className={`shrink-0 w-32 aspect-video rounded-xl flex items-center justify-center font-black transition-colors border snap-start ${
                    episode === i + 1 ? "bg-brand/20 border-brand text-brand" : "bg-white/5 border-white/5 text-gray-400"
                  }`}
                >
                  EP {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {details.similar?.results?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4 border-l-2 border-brand pl-2">More Like This</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x pb-4">
              {details.similar.results.map((item) => (
                <MobileMovieCard key={item.id} item={item} mediaType={mediaType} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
