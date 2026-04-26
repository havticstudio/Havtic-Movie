import { Link } from "react-router-dom";
import { GENRE_MAP } from "../api/api";

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
          className={`w-3 h-3 ${i < filled ? "text-[#00e5c4]" : "text-gray-600"}`}
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
export default function MovieCard({ item, mediaType = "tv" }) {
  const poster = item.poster_path
    ? `${IMG_BASE}${item.poster_path}`
    : "https://placehold.co/342x513/1a1d27/555?text=No+Image";
  const title = item.name || item.title || "Unknown";
  const genreLabel = GENRE_MAP[item.genre_ids?.[0]] || "—";
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const linkTo = `/details/${mediaType}/${item.id}/${slug}`;

  return (
    <Link to={linkTo} className="relative rounded-2xl overflow-hidden group bg-[#1a1d27] shrink-0 w-full h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 block flex-col">
      <div className="relative">
        <img
          src={poster}
          alt={title}
          className="w-full aspect-2/3 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t-from-[#13151f] via-[#13151f]/10 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-0.5">
            {title}
          </p>
          <StarRating vote={item.vote_average || 0} />
        </div>
      </div>

      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-gray-500 text-xs truncate">{genreLabel}</span>
        {item.vote_average > 0 && (
          <span className="text-[#00e5c4] text-xs font-bold">
            {item.vote_average.toFixed(1)}
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#0e1018]/95 backdrop-blur-sm flex items-center gap-2 px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
        <button className="flex-1 bg-[#00e5c4] text-[#13151f] text-xs font-extrabold py-2 rounded-lg hover:bg-[#00cdb0] transition-colors pointer-events-none">
          ▶ Watch
        </button>
        <button className="w-8 h-8 rounded-lg bg-[#2a2d3e] flex items-center justify-center text-gray-400 hover:text-[#00e5c4] transition-colors shrink-0" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </Link>
  );
}
