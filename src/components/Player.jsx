import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Player({ tmdbId, imdbId, type, mediaType, season, episode, title }) {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const mType = type || mediaType;
  
  // Use TMDB ID for most, but prioritize IMDB for vidsrc if available
  const id = (mType === 'movie' && imdbId) ? imdbId : (tmdbId || imdbId);

  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const controlTimer = useRef(null);

  useEffect(() => {
    // Do not load ads if the user is a premium member
    if (user?.isPremium) return;

    // Adsterra Popunder Script for Player Page
    const script = document.createElement('script');
    script.src = "https://pl29326691.profitablecpmratenetwork.com/6e/74/f9/6e74f975f5fe8960146d0f9cd5e39548.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [user]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    const domain = 'vidsrc.cc';
    const url = mType === 'movie' 
      ? `https://${domain}/v2/embed/movie/${id}` 
      : `https://${domain}/v2/embed/tv/${id}/${season}/${episode}`;
      
    setStreamUrl(url);
  }, [id, mType, season, episode, tmdbId, imdbId]);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlTimer.current);
    controlTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden group select-none shadow-2xl border border-white/5"
      onMouseMove={handleMouseMove}
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 gap-4">
          <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          <p className="text-white text-xs font-black tracking-[0.3em] uppercase">Havtic Player</p>
        </div>
      )}

      {streamUrl && (
        <iframe
          key={streamUrl}
          src={streamUrl}
          className="w-full h-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="origin"
          onLoad={handleLoad}
          title={title}
        />
      )}

      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 pointer-events-none z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-black text-lg tracking-tight">{title}</h3>
            {type === 'tv' && (
              <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-md">S{season} E{episode}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
