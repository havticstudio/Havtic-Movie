import MobileMovieCard from "./MobileMovieCard";

export default function MobileGrid({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <p className="font-bold">No results found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4">
      {items.map((item) => (
        <div key={item.id} className="w-full">
          <MobileMovieCard item={item} mediaType={item.media_type || "movie"} className="w-full" />
        </div>
      ))}
    </div>
  );
}
