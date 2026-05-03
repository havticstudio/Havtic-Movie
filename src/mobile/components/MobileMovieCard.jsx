import { Link } from "react-router-dom";
import { GENRE_MAP } from "../../api/api";

const IMG_BASE = import.meta.env.VITE_IMG_URL;

export default function MobileMovieCard({ item, mediaType = "movie", className = "" }) {
  const poster = item.poster_path
    ? `${IMG_BASE}${item.poster_path}`
    : "https://placehold.co/342x513/1a1d27/555?text=No+Image";
  
  const title = item.name || item.title || "Unknown";
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const finalMediaType = item.media_type || mediaType;
  const linkTo = `/details/${finalMediaType}/${item.id}/${slug}`;

  return (
    <Link 
      to={linkTo} 
      className={`relative block aspect-[2/3] rounded-xl overflow-hidden bg-bg-surface shrink-0 snap-start active:scale-95 transition-transform ${className || "flex-none w-32 md:w-36"}`}
    >
      <img
        src={poster}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      {/* App-like dark gradient at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
      
      {/* App-like rating badge */}
      {item.vote_average > 0 && (
        <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
          <span className="text-white text-[9px] font-black">{item.vote_average.toFixed(1)}</span>
        </div>
      )}

      {/* Minimal Title inside the card */}
      <div className="absolute bottom-2 left-2 right-2">
        <p className="text-white font-bold text-[10px] leading-tight line-clamp-2 drop-shadow-md">
          {title}
        </p>
      </div>
    </Link>
  );
}
