import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

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
  } catch { }
  return url;
}

const VIDSRC_DOMAIN = 'vidsrc-embed.su';
const INTERACTION_WAIT_MS = 10000;
const LOAD_TIMEOUT_MS = 12000;

export default function Player({ imdbId, type, season, episode, title }) {
  const { user } = useAuth();
  const containerRef = useRef(null);

  const [streamUrl, setStreamUrl] = useState(null);
  const [serverName, setServerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const idxRef = useRef(0);
  const confirmedRef = useRef(false);
  const iframeOnRef = useRef(false);
  const timerRef = useRef(null);
  const controlTimer = useRef(null);
  const isVipModeRef = useRef(false);
  const vipLinksRef = useRef([]);

  const tryServer = useCallback((index, isVipSearch = true) => {
    clearTimeout(timerRef.current);

    if (isVipSearch) {
      if (index >= vipLinksRef.current.length) {
        // VIP links exhausted, try VidSrc as fallback
        isVipModeRef.current = false;
        tryServer(0, false);
        return;
      }
      setStreamUrl(normalizeUrl(vipLinksRef.current[index]));
      setServerName(`VIP ${index + 1}`);
      isVipModeRef.current = true;
    } else {
      // VidSrc Fallback
      if (index > 0) {
        setLoading(false);
        return;
      }
      setStreamUrl(type === 'movie' 
        ? `https://${VIDSRC_DOMAIN}/embed/movie/${imdbId}` 
        : `https://${VIDSRC_DOMAIN}/embed/tv/${imdbId}/${season}/${episode}`
      );
      setServerName('VidSrc');
      isVipModeRef.current = false;
    }

    idxRef.current = index;
    setLoading(true);

    timerRef.current = setTimeout(() => {
      if (!confirmedRef.current) tryServer(index + 1, isVipModeRef.current);
    }, LOAD_TIMEOUT_MS);
  }, [imdbId, type, season, episode]);

  useEffect(() => {
    if (!imdbId) return;
    idxRef.current = 0;
    confirmedRef.current = false;
    iframeOnRef.current = false;
    setLoading(true);

    // Fetch VIP links from DB
    fetch(`/api/media/${imdbId}`)
      .then(r => r.json())
      .then(data => {
        vipLinksRef.current = [data?.customUrl1, data?.customUrl2, data?.customUrl3].filter(Boolean);
        
        // If VIP links exist, try them first!
        if (vipLinksRef.current.length > 0) {
          tryServer(0, true);
        } else {
          tryServer(0, false); // No VIP, try VidSrc
        }
      })
      .catch(() => tryServer(0, false));

    return () => clearTimeout(timerRef.current);
  }, [imdbId, type, season, episode, tryServer]);

  useEffect(() => {
    const onBlur = () => {
      if (!confirmedRef.current && iframeOnRef.current) {
        clearTimeout(timerRef.current);
        confirmedRef.current = true;
      }
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, []);

  const handleLoad = useCallback(() => {
    iframeOnRef.current = true;
    setLoading(false);
    if (confirmedRef.current) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!confirmedRef.current) tryServer(idxRef.current + 1, isVipModeRef.current);
    }, INTERACTION_WAIT_MS);
  }, [tryServer]);

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
          {!loading && serverName && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${serverName.startsWith('VIP') ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}>
              {serverName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
