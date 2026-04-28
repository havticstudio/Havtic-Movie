import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Player({ imdbId, type, season, episode, title }) {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [streamUrl, setStreamUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Fetch stream link from backend
  useEffect(() => {
    const fetchStream = async () => {
      try {
        setLoading(true);
        setError(null);
        setStreamUrl(null);

        // Highly stable vidsrc.me source for TMDB IDs
        const sourceUrl = type === 'tv' 
          ? `https://vidsrc.me/embed/tv?tmdb=${imdbId}&season=${season}&episode=${episode}`
          : `https://vidsrc.me/embed/movie?tmdb=${imdbId}`;
        
        setStreamUrl(sourceUrl);
        setLoading(false);
      } catch (err) {
        setError('Failed to load player');
        setLoading(false);
      }
    };

    if (imdbId) fetchStream();
  }, [imdbId, type, season, episode]);

  // Controls Logic
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    setPlaying(!playing);
  };

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
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group select-none shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xs font-bold tracking-widest animate-pulse uppercase">Havtic Player</p>
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

      {/* Premium Overlay for Havtic Branding */}
      <div className={`absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 pointer-events-none z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-white font-bold text-lg drop-shadow-md">{title}</h3>
        {user?.isPremium && (
          <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">Premium Mode Active</p>
        )}
      </div>

      {/* Custom Fullscreen Trigger Overlay */}
      <div className={`absolute bottom-4 right-4 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button onClick={toggleFullscreen} className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition-colors">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
        </button>
      </div>
    </div>
  );
}
