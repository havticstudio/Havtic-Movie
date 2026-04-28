import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

/* ══════════════════════════════
   HERO SLIDER
   ══════════════════════════════ */
export default function HeroSlider({ items, mediaType }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { user, addToWatchlist, removeFromWatchlist } = useAuth();

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setCurrent((p) => (p + 1) % items.length),
      6000,
    );
  }, [items.length]);

  useEffect(() => {
    if (items.length) startTimer();
    return () => clearInterval(timerRef.current);
  }, [items.length, startTimer]);

  const go = (dir) => {
    setCurrent((p) => (p + dir + items.length) % items.length);
    startTimer();
  };

  if (!items.length) {
    return (
      <div className="w-full h-64 md:h-80 lg:h-96 rounded-2xl bg-bg-surface animate-pulse" />
    );
  }

  const item = items[current];
  const backdrop = item.backdrop_path
    ? `${BACKDROP_BASE}${item.backdrop_path}`
    : null;
  const title = item.name || item.title || "";

  const inWatchlist = user?.watchlist?.some(w => Number(w.id) === Number(item.id));

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate("/login");
    
    if (inWatchlist) {
      removeFromWatchlist(Number(item.id));
    } else {
      addToWatchlist({
        id: Number(item.id),
        title: item.title || null,
        name: item.name || null,
        poster_path: item.poster_path,
        media_type: mediaType || item.media_type,
        vote_average: item.vote_average,
        release_date: item.release_date || null,
        first_air_date: item.first_air_date || null
      });
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 lg:h-[75vh] min-h-[400px] select-none shadow-2xl">
      {backdrop ? (
        <img
          key={current}
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bg-surface to-bg-main" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-bg-main/95 via-bg-main/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main/90 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-12">
        <h2 
          className="text-white font-black text-3xl md:text-5xl lg:text-7xl mb-4 max-w-3xl leading-tight animate-reveal"
          style={{ textShadow: '0px 0px 20px rgba(0,0,0,0.5)' }}
        >
          {title}
        </h2>
        {item.overview && (
          <p 
            className="text-gray-200 text-xs md:text-lg mb-8 max-w-2xl line-clamp-3 hidden md:block font-medium animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            {item.overview}
          </p>
        )}

        <div className="flex items-center gap-4 flex-wrap animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={handleWatchlist}
            className={`flex items-center gap-2 backdrop-blur-md border px-6 py-3 rounded-xl transition-all cursor-pointer text-sm font-black uppercase tracking-widest ${
              inWatchlist 
                ? "bg-brand/20 border-brand/40 text-brand" 
                : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={inWatchlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            {inWatchlist ? "In Watchlist" : "Watchlist"}
          </button>

          <Link
            to={`/details/${mediaType || item.media_type || "movie"}/${item.id}/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}`}
            className="bg-brand text-white font-black text-sm uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-brand-hover transition-all shadow-xl shadow-brand/30 cursor-pointer"
          >
            Watch Now
          </Link>

          <div className="flex gap-2 ml-4">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  startTimer();
                }}
                className={`rounded-full transition-all duration-500 cursor-pointer ${
                  i === current
                    ? "w-8 h-2 bg-brand shadow-lg shadow-brand/50"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand/80 transition-all cursor-pointer border border-white/5 hover:border-brand/50 group shadow-2xl"
      >
        <svg
          className="w-6 h-6 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand/80 transition-all cursor-pointer border border-white/5 hover:border-brand/50 group shadow-2xl"
      >
        <svg
          className="w-6 h-6 transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
