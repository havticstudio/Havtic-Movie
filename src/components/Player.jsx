import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Auto-convert various video URLs to embeddable format
function normalizeUrl(url) {
  try {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  } catch {}
  return url;
}

export default function Player({ imdbId, type, season, episode, title }) {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [serverName, setServerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    if (!imdbId) return;

    setChecking(true);
    setLoading(true);
    setStreamUrl(null);

    // Step 1: Check if admin has set a custom VIP link
    fetch(`/api/media/${imdbId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.customUrl) {
          // VIP link found — use it immediately
          setStreamUrl(normalizeUrl(data.customUrl));
          setServerName('VIP Server');
          setChecking(false);
        } else {
          // Step 2: Auto-detect best available server
          return fetch(`/api/stream/find-server?tmdbId=${imdbId}&type=${type}&season=${season}&episode=${episode}`)
            .then(res => res.json())
            .then(result => {
              setStreamUrl(result.url);
              setServerName(result.serverName);
              setChecking(false);
            });
        }
      })
      .catch(() => {
        // Fallback to Server 1 if everything fails
        const fallback = type === 'tv'
          ? `https://vidsrc.me/embed/tv?tmdb=${imdbId}&season=${season}&episode=${episode}`
          : `https://vidsrc.me/embed/movie?tmdb=${imdbId}`;
        setStreamUrl(fallback);
        setServerName('Server 1');
        setChecking(false);
      });
  }, [imdbId, type, season, episode]);

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden group select-none shadow-2xl border border-white/5"
      onMouseMove={handleMouseMove}
    >
      {/* Loading / Checking State */}
      {(loading || checking) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 gap-4">
          <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-white text-xs font-black tracking-[0.3em] uppercase">
              {checking ? 'Finding best server...' : 'Havtic Player'}
            </p>
            {checking && (
              <p className="text-gray-500 text-[10px] mt-1">Checking available sources</p>
            )}
          </div>
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
          onLoad={() => setLoading(false)}
        />
      )}

      {/* Top Overlay: Title + Server Badge */}
      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 pointer-events-none z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-white font-black text-lg tracking-tight drop-shadow-lg">{title}</h3>
          {type === 'tv' && (
            <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-md">
              S{season} E{episode}
            </span>
          )}
          {!checking && serverName && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
              serverName === 'VIP Server' 
                ? 'bg-yellow-500 text-black' 
                : 'bg-white/10 text-white'
            }`}>
              {serverName}
            </span>
          )}
        </div>
        {user?.isPremium && (
          <p className="text-brand text-[10px] font-black uppercase tracking-[0.2em] mt-1">Premium Mode Active</p>
        )}
      </div>

      {/* Fullscreen Button */}
      <div className={`absolute bottom-6 right-6 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={toggleFullscreen} className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white hover:bg-brand transition-all border border-white/10 active:scale-90">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
        </button>
      </div>
    </div>
  );
}
