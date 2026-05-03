import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const IMG_BASE = import.meta.env.VITE_IMG_URL;

export default function MobileHero({ items, mediaType = "movie" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items?.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items]);

  if (!items?.length) return <div className="h-96 bg-bg-surface animate-pulse" />;

  const item = items[currentIndex];
  const title = item.name || item.title;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const linkTo = `/details/${item.media_type || mediaType}/${item.id}/${slug}`;
  
  // Use poster for mobile, it looks better than backdrop
  const imgUrl = item.poster_path ? `${IMG_BASE}${item.poster_path}` : "";

  return (
    <Link to={linkTo} className="block relative w-full h-[60vh] overflow-hidden mb-6">
      <img
        key={item.id}
        src={imgUrl}
        alt={title}
        className="w-full h-full object-cover object-top animate-fade-in"
      />
      {/* App Vibe Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/40 to-transparent" />
      
      <div className="absolute bottom-6 left-4 right-4 flex flex-col items-center text-center animate-fade-up">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-xl leading-tight">
          {title}
        </h2>
        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-4">
          <span className="bg-brand/20 text-brand px-2 py-1 rounded-sm border border-brand/20">
            {item.vote_average.toFixed(1)} Rating
          </span>
          {item.release_date && <span>{item.release_date.split("-")[0]}</span>}
        </div>
        <button className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-white/10 active:scale-95 transition-transform w-full max-w-[200px]">
          Play Now
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-4 bg-brand" : "w-1 bg-white/30"
            }`}
          />
        ))}
      </div>
    </Link>
  );
}
