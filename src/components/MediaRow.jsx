import { useRef } from "react";
import MovieCard from "./MovieCard";

/* ══════════════════════════════
   MEDIA ROW
══════════════════════════════ */
export default function MediaRow({ title, items, mediaType, loading, onWatch }) {
  const scrollRef = useRef(null);
  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-base md:text-lg">{title}</h3>
        <div className="flex gap-2">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              className="w-8 h-8 rounded-lg bg-[#1a1d27] text-gray-400 hover:text-white hover:bg-[#2a2d3e] flex items-center justify-center transition-colors"
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
                  d={dir === -1 ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-40 sm:w-44 md:w-48 h-64 rounded-2xl bg-[#1a1d27] animate-pulse"
              />
            ))
          : items.map((item) => (
              <div key={item.id} className="w-40 sm:w-44 md:w-48 shrink-0">
                <MovieCard
                  item={item}
                  mediaType={mediaType}
                  onWatch={onWatch}
                />
              </div>
            ))}
      </div>
    </section>
  );
}
