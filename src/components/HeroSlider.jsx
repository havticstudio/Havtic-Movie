import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

/* ══════════════════════════════
   HERO SLIDER
══════════════════════════════ */
export default function HeroSlider({ items, mediaType, onWatch }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

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
      <div className="w-full h-64 md:h-80 lg:h-96 rounded-2xl bg-[#1a1d27] animate-pulse" />
    );
  }

  const item = items[current];
  const backdrop = item.backdrop_path
    ? `${BACKDROP_BASE}${item.backdrop_path}`
    : null;
  const title = item.name || item.title || "";

  return (
    <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 lg:h-[800px] select-none">
      {backdrop ? (
        <img
          key={current}
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br-from-teal-900 to-slate-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r-from-[#13151f]/95 via-[#13151f]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t-from-[#13151f]/90 via-transparent to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
        <h2 
          className="text-white font-black text-3xl md:text-5xl lg:text-6xl mb-3 max-w-2xl leading-tight"
          style={{ textShadow: '0px 0px 20px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.9)' }}
        >
          {title}
        </h2>
        {item.overview && (
          <p 
            className="text-gray-100 text-xs md:text-base mb-6 max-w-2xl line-clamp-3 hidden md:block font-medium"
            style={{ textShadow: '1px 1px 8px rgba(0,0,0,1)' }}
          >
            {item.overview}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <button className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/20 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Watchlist
          </button>

          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  startTimer();
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-[#00e5c4]"
                    : "w-2 h-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <Link
            to={`/details/${mediaType}/${item.id}/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")}`}
            className="ml-auto bg-[#00e5c4] text-[#13151f] font-extrabold text-sm px-6 py-2 rounded-xl hover:bg-[#00cdb0] transition-colors shadow-lg shadow-[#00e5c4]/25"
          >
            Watch Now
          </Link>
        </div>
      </div>

      <button
        onClick={() => go(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
