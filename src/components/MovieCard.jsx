import { Link, useNavigate } from "react-router-dom";
import { GENRE_MAP } from "../api/api";
import { useAuth } from "../context/AuthContext";

const IMG_BASE = import.meta.env.VITE_IMG_URL;

/* ══════════════════════════════
   STAR RATING
   ══════════════════════════════ */
function StarRating({ vote }) {
  const filled = Math.round((vote / 10) * 5);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3 h-3 ${i < filled ? "text-brand" : "text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ══════════════════════════════
   MOVIE CARD
   ══════════════════════════════ */
export default function MovieCard({ item, mediaType = "movie" }) {
  const navigate = useNavigate();
  const { user, addToWatchlist, removeFromWatchlist } = useAuth();

  const poster = item.poster_path
    ? `${IMG_BASE}${item.poster_path}`
    : "https://placehold.co/342x513/1a1d27/555?text=No+Image";
  
  const title = item.name || item.title || "Unknown";
  const genreLabel = GENRE_MAP[item.genre_ids?.[0]] || "—";
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  
  // Use the item's own media_type if available (for combined results)
  const finalMediaType = item.media_type || mediaType;
  const linkTo = `/details/${finalMediaType}/${item.id}/${slug}`;

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
        media_type: finalMediaType,
        vote_average: item.vote_average,
        release_date: item.release_date || null,
        first_air_date: item.first_air_date || null
      });
    }
  };

  return (
    <Link to={linkTo} className="relative rounded-2xl overflow-hidden group bg-bg-surface shrink-0 w-full h-full cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand/10 block flex-col border border-white/5">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main via-bg-main/20 to-transparent opacity-60" />
        
        {/* Watchlist Quick Action */}
        <button 
          onClick={handleWatchlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-lg backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer z-20 ${
            inWatchlist 
              ? "bg-brand border-brand text-white" 
              : "bg-black/40 border-white/10 text-white hover:bg-brand hover:border-brand"
          }`}
        >
          <svg className="w-4 h-4" fill={inWatchlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={inWatchlist ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
          </svg>
        </button>

        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-black text-sm leading-tight line-clamp-2 mb-1 uppercase tracking-tight">
            {title}
          </p>
          <StarRating vote={item.vote_average || 0} />
        </div>
      </div>

      <div className="px-3 py-2.5 flex items-center justify-between bg-bg-surface">
        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest truncate">{genreLabel}</span>
        {item.vote_average > 0 && (
          <div className="flex items-center gap-1">
             <span className="text-brand text-[10px] font-black uppercase tracking-tighter">
               {item.vote_average.toFixed(1)}
             </span>
          </div>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
