import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const SERVERS = [
  { id: 'vidsrc.me', name: 'Server 1 (Best)', domain: 'vidsrc.me' },
  { id: 'vidsrc.to', name: 'Server 2 (Stable)', domain: 'vidsrc.to' },
  { id: 'embed.su', name: 'Server 3 (Direct)', domain: 'embed.su' },
  { id: 'vidsrc.cc', name: 'Server 4 (Fast)', domain: 'vidsrc.cc' },
  { id: 'vidsrc.xyz', name: 'Server 5 (New)', domain: 'vidsrc.xyz' },
];

export default function Player({ tmdbId, imdbId, type, mediaType, season, episode, title }) {
  const { user } = useAuth();
  const containerRef = useRef(null);
  const mType = type || mediaType;
  
  // Use TMDB ID for most, but prioritize IMDB for vidsrc if available
  const id = (mType === 'movie' && imdbId) ? imdbId : (tmdbId || imdbId);

  const [activeServer, setActiveServer] = useState(SERVERS[0]);
  const [streamUrl, setStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showServerPicker, setShowServerPicker] = useState(false);

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
    
    const domain = activeServer.domain;
    let url = "";

    if (domain === 'vidsrc.me') {
      const idParam = imdbId ? `imdb=${imdbId}` : `tmdb=${tmdbId}`;
      url = mType === 'movie' 
        ? `https://${domain}/embed/movie?${idParam}` 
        : `https://${domain}/embed/tv?${idParam}&season=${season}&episode=${episode}`;
    } else if (domain === 'embed.su') {
      url = mType === 'movie' 
        ? `https://${domain}/embed/movie/${tmdbId || id}` 
        : `https://${domain}/embed/tv/${tmdbId || id}/${season}/${episode}`;
    } else if (domain === 'vidsrc.cc') {
      url = mType === 'movie' 
        ? `https://${domain}/v2/embed/movie/${id}` 
        : `https://${domain}/v2/embed/tv/${id}/${season}/${episode}`;
    } else {
      url = mType === 'movie' 
        ? `https://${domain}/embed/movie/${id}` 
        : `https://${domain}/embed/tv/${id}/${season}/${episode}`;
    }
      
    setStreamUrl(url);
  }, [id, mType, season, episode, activeServer, tmdbId, imdbId]);

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

      {/* Server Selection Overlay */}
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-xl z-30 transition-all duration-500 flex flex-col items-center justify-center p-6 ${showServerPicker ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent pointer-events-none" />
        <h4 className="text-white font-black text-xs uppercase tracking-[0.3em] mb-8 drop-shadow-lg">Select Mirror Server</h4>
        <div className="grid grid-cols-1 gap-4 w-full max-w-[260px] relative z-10">
          {SERVERS.map((srv) => (
            <button
              key={srv.id}
              onClick={() => {
                setActiveServer(srv);
                setShowServerPicker(false);
              }}
              className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border flex items-center justify-center gap-3 group/btn ${
                activeServer.id === srv.id 
                  ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeServer.id === srv.id ? 'bg-brand animate-pulse' : 'bg-gray-600'}`} />
              {srv.name}
            </button>
          ))}
          <button 
            onClick={() => setShowServerPicker(false)}
            className="mt-6 text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            Dismiss
          </button>
        </div>
      </div>

      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/90 to-transparent transition-opacity duration-500 pointer-events-none z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-black text-lg tracking-tight">{title}</h3>
            {type === 'tv' && (
              <span className="bg-brand text-white text-[10px] font-black px-2 py-0.5 rounded-md">S{season} E{episode}</span>
            )}
          </div>
          <button 
            onClick={() => setShowServerPicker(true)}
            className="pointer-events-auto bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full border border-white/10 active:scale-95 transition-transform flex items-center gap-2"
          >
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            {activeServer.name}
          </button>
        </div>
      </div>
    </div>
  );
}
