import MobileMovieCard from "./MobileMovieCard";

export default function MobileRow({ title, items, mediaType, loading }) {
  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-4 w-32 bg-white/10 rounded-full mb-4 animate-pulse ml-4" />
        <div className="flex gap-3 overflow-hidden">
          <div className="w-1 shrink-0" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-none w-32 aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
          ))}
          <div className="w-1 shrink-0" />
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Title */}
      <h3 className="text-white font-black text-sm uppercase tracking-widest mb-3 border-l-[3px] border-brand pl-2 ml-4">
        {title}
      </h3>
      
      {/* Slider */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 scroll-pl-4">
        {/* Left Spacer to guarantee gap */}
        <div className="w-1 shrink-0" />
        
        {items.map((item) => (
          <MobileMovieCard key={item.id} item={item} mediaType={mediaType} />
        ))}
        
        {/* Right Spacer to guarantee gap */}
        <div className="w-1 shrink-0" />
      </div>
    </div>
  );
}
