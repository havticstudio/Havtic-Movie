import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Player({ tmdbId, imdbId, type, mediaType, season, episode, title, hideHeader = false }) {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const mType = type || mediaType;

  // Use TMDB ID for most, but prioritize IMDB for vidsrc if available
  const id = (mType === 'movie' && imdbId) ? imdbId : (tmdbId || imdbId);

  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const controlTimer = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const domain = 'vidsrc.cc';
    const url = mType === 'movie'
      ? `https://${domain}/v2/embed/movie/${id}`
      : `https://${domain}/v2/embed/tv/${id}/${season}/${episode}`;

    setStreamUrl(url);

    // Auto-hide spinner after 5 seconds to ensure video is accessible even if onLoad fails
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
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
      className={`relative w-full aspect-video bg-black overflow-hidden group select-none ${hideHeader ? '' : 'shadow-2xl border border-white/5'} ${isFullscreen ? 'rounded-none' : (hideHeader ? '' : 'rounded-3xl')}`}
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      {/* Beautiful Animated Spinner */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300 pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute w-16 h-16 rounded-full border-4 border-white/5"></div>
            {/* Spinning gradient ring */}
            <div className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-brand border-r-brand animate-spin"></div>
            {/* Inner pulsing dot */}
            <div className="w-4 h-4 bg-brand rounded-full animate-pulse shadow-[0_0_15px_rgba(229,9,20,0.8)]"></div>
          </div>
          <p className="mt-6 text-brand text-[10px] font-black tracking-[0.3em] uppercase animate-pulse drop-shadow-lg">Loading Stream</p>
        </div>
      )}

      {streamUrl && (
        <iframe
          key={streamUrl}
          src={streamUrl}
          className="w-full h-full border-0"
          allowFullScreen={true}
          webkitAllowFullScreen={true}
          mozallowfullscreen="true"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="origin"
          onLoad={handleLoad}
          title={title}
        />
      )}

      {/* Top Header Overlay */}
      {!hideHeader && (
        <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 pointer-events-none z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-black text-lg tracking-tight">{title}</h3>
              {type === 'tv' && (
                <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-md">S{season} E{episode}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Fullscreen Button (Bottom Right) */}
      <div className={`absolute bottom-4 right-4 z-20 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (!document.fullscreenElement) {
              containerRef.current?.requestFullscreen().catch(err => console.log(err));
            } else {
              document.exitFullscreen().catch(err => console.log(err));
            }
          }}
          className="w-10 h-10 rounded-xl bg-black/60 hover:bg-brand/90 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer border border-white/10 shadow-lg"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          )}
        </button>
      </div>
    </div>
  );
}
