import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPersonDetails, getPersonCombinedCredits } from "../api/api";
import MobileMovieCard from "./components/MobileMovieCard";

export default function MobileCelebrityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    Promise.all([
      getPersonDetails(id),
      getPersonCombinedCredits(id)
    ])
    .then(([personData, creditsData]) => {
      setPerson(personData);
      const sortedCredits = (creditsData || []).sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
      setCredits(sortedCredits);
    })
    .catch(console.error)
    .finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080101] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/5 border-t-brand rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!person) return null;

  return (
    <div className="min-h-screen bg-[#080101] pb-20 relative">
      <Helmet>
        <title>{person.name} - Havtic Movie</title>
      </Helmet>

      {/* Hero Header */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        {/* Background Backdrop (using first credit's backdrop or profile) */}
        <div className="absolute inset-0">
          <img 
            src={`https://image.tmdb.org/t/p/w780${credits[0]?.backdrop_path || person.profile_path}`} 
            alt="" 
            className="w-full h-full object-cover blur-[2px] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080101]/60 to-[#080101]"></div>
        </div>

        {/* Back Button Removed */}
      </div>

      {/* Profile Info Overlay */}
      <div className="relative px-6 -mt-32 z-10 flex flex-col items-center">
        <div className="w-36 h-36 rounded-full border-4 border-[#080101] overflow-hidden shadow-2xl mb-4 bg-[#120a0a]">
          {person.profile_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`} 
              alt={person.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700">
               <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
          )}
        </div>
        
        <h1 className="text-3xl font-black text-white text-center italic tracking-tighter mb-1 uppercase">
          {person.name}
        </h1>
        <p className="text-brand text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          {person.known_for_department}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 w-full gap-3 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 flex flex-col items-center">
            <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Birthday</span>
            <span className="text-white text-[10px] font-bold">{person.birthday || "N/A"}</span>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-4 flex flex-col items-center">
            <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">Place of Birth</span>
            <span className="text-white text-[10px] font-bold text-center line-clamp-1">{person.place_of_birth?.split(',').pop() || "N/A"}</span>
          </div>
        </div>

        {/* Biography */}
        <div className="w-full mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
            <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Biography</h2>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
          </div>
          <p className={`text-gray-400 text-xs leading-relaxed text-center px-2 ${showFullBio ? '' : 'line-clamp-4'}`}>
            {person.biography || "No biography available for this star."}
          </p>
          {person.biography && person.biography.length > 200 && (
            <button 
              onClick={() => setShowFullBio(!showFullBio)}
              className="w-full mt-3 text-brand text-[9px] font-black uppercase tracking-widest"
            >
              {showFullBio ? 'Show Less' : 'Read Full Bio'}
            </button>
          )}
        </div>

        {/* Filmography Grid (3 Columns) */}
        <div className="w-full">
           <div className="flex items-center justify-between mb-6">
             <h2 className="text-white text-[11px] font-black uppercase tracking-[0.15em]">Filmography</h2>
             <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[8px] text-gray-500 font-black">
               {credits.length} WORKED
             </span>
           </div>
           
           <div className="grid grid-cols-3 gap-3">
             {credits.slice(0, 15).map((item, index) => (
               <div key={`${item.id}-${index}`} className="animate-fade-up" style={{ animationDelay: `${index * 0.05}s` }}>
                 <MobileMovieCard item={item} mediaType={item.media_type} />
               </div>
             ))}
           </div>
           
           {credits.length > 15 && !showFullBio && (
              <div className="mt-8 grid grid-cols-3 gap-3">
                {credits.slice(15, 30).map((item, index) => (
                  <div key={`${item.id}-${index}`} className="animate-fade-up">
                    <MobileMovieCard item={item} mediaType={item.media_type} />
                  </div>
                ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
