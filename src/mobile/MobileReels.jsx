import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { getTrendingMovies, getMediaVideos } from "../api/api";
import { Link } from "react-router-dom";

export default function MobileReels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const movies = await getTrendingMovies("day", 1);
        const reelsWithVideos = await Promise.all(
          movies.slice(0, 10).map(async (movie) => {
            const videos = await getMediaVideos("movie", movie.id);
            const trailer = videos.find(
              (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
            );
            return { ...movie, trailer };
          })
        );
        setReels(reelsWithVideos.filter((r) => r.trailer));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      <Helmet>
        <title>Reels - Havtic Movie</title>
      </Helmet>

      {/* Vertical Scroll Container */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        style={{ height: 'calc(100vh - 64px)' }}
      >
        {reels.map((reel, index) => (
          <div 
            key={reel.id} 
            className="h-full w-full snap-start relative bg-black flex items-center justify-center"
          >
            {/* YouTube Player */}
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
              <iframe
                className="w-full aspect-video scale-[2] md:scale-100"
                src={`https://www.youtube.com/embed/${reel.trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${reel.trailer.key}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3`}
                title={reel.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
              
              {/* Tap to Unmute / Play helper */}
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 active:bg-transparent transition-colors">
                <div className="bg-black/60 backdrop-blur-md rounded-full p-4 opacity-0 active:opacity-100 pointer-events-none transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                </div>
              </div>
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>

            {/* UI Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 pb-12">
              <div className="flex justify-between items-end">
                {/* Info Section */}
                <div className="flex-1 pr-12 animate-fade-up">
                   <h2 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase leading-tight">
                     {reel.title}
                   </h2>
                   <p className="text-gray-300 text-[10px] font-bold uppercase tracking-widest line-clamp-2 mb-4 opacity-80">
                     {reel.overview}
                   </p>
                   <Link 
                     to={`/details/movie/${reel.id}/${reel.title.toLowerCase().replace(/ /g, '-')}`}
                     className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                   >
                     Watch Full Movie
                   </Link>
                </div>

                {/* Actions Section */}
                <div className="flex flex-col gap-6 items-center animate-fade-in">
                   <div className="flex flex-col items-center gap-1">
                     <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                     </button>
                     <span className="text-[10px] font-black text-white">{(reel.vote_count / 100).toFixed(1)}K</span>
                   </div>

                   <div className="flex flex-col items-center gap-1">
                     <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
                     </button>
                     <span className="text-[10px] font-black text-white">Share</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Button */}
      <Link to="/" className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
      </Link>
    </div>
  );
}
