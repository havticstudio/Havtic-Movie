import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const VIDSRC_DOMAIN = 'vidsrc-embed.su';

export default function Player({ imdbId, type, season, episode, title }) {
  const { user } = useAuth();
  const containerRef = useRef(null);

  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const controlTimer = useRef(null);

  useEffect(() => {
    if (!imdbId) return;
    setLoading(true);
    
    // Set fast loading stream URL immediately
    const url = type === 'movie' 
      ? `https://${VIDSRC_DOMAIN}/embed/movie/${imdbId}` 
      : `https://${VIDSRC_DOMAIN}/embed/tv/${imdbId}/${season}/${episode}`;
      
    setStreamUrl(url);
  }, [imdbId, type, season, episode]);

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
          allow="autoplay; encrypted-media"
          referrerPolicy="origin"
          onLoad={handleLoad}
          title={title}
        />
      )}

      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 pointer-events-none z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-white font-black text-lg tracking-tight">{title}</h3>
          {type === 'tv' && (
            <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-md">S{season} E{episode}</span>
          )}
          {!loading && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white/10 text-white">
              VidSrc
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
