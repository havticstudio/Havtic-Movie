import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPersonDetails, getPersonCombinedCredits } from "../api/api";
import MovieCard from "../components/MovieCard";

export default function CelebrityDetails() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    Promise.all([
      getPersonDetails(id),
      getPersonCombinedCredits(id)
    ])
    .then(([personData, creditsData]) => {
      setPerson(personData);
      // Sort credits by popularity
      const sortedCredits = (creditsData || []).sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
      setCredits(sortedCredits);
    })
    .catch(console.error)
    .finally(() => {
      // Small delay for smooth transition from loading
      setTimeout(() => setLoading(false), 300);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-white/5 border-t-brand rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-brand/20 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center text-gray-500 animate-fade-up">
        Person not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main p-4 md:p-8">
      <Helmet>
        <title>{person.name} - Havtic Movie</title>
      </Helmet>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-12 bg-bg-surface p-6 md:p-10 rounded-[2rem] border border-white/5 animate-fade-up">
        <div className="w-48 h-72 md:w-64 md:h-96 shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 relative group">
          {person.profile_path ? (
            <img 
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`} 
              alt={person.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">
               <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent opacity-40"></div>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight leading-none animate-reveal">{person.name}</h1>
          
          <div className="flex flex-wrap gap-6 mb-8 text-sm">
             {person.birthday && (
               <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Birthday</p>
                 <p className="text-gray-200">{person.birthday}</p>
               </div>
             )}
             {person.place_of_birth && (
               <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Place of Birth</p>
                 <p className="text-gray-200">{person.place_of_birth}</p>
               </div>
             )}
             {person.known_for_department && (
               <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                 <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-1">Known For</p>
                 <p className="text-gray-200">{person.known_for_department}</p>
               </div>
             )}
          </div>

          <div className="relative">
             <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand rounded-full"></div>
             <p className="text-gray-300 text-sm md:text-base leading-relaxed pl-4 line-clamp-6 md:line-clamp-none">
               {person.biography || "No biography available for this celebrity."}
             </p>
          </div>
        </div>
      </div>

      {/* Filmography Section */}
      <div className="max-w-[1800px] mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-4">
            <span className="w-12 h-1 bg-brand"></span>
            Filmography
          </h2>
          <div className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/20">
            {credits.length} Credits
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {credits.map((item, index) => (
            <div 
              key={`${item.id}-${index}`} 
              className="animate-fade-up" 
              style={{ animationDelay: `${0.1 + (index % 12) * 0.05}s` }}
            >
              <MovieCard item={item} mediaType={item.media_type} />
            </div>
          ))}
        </div>
        
        {credits.length === 0 && (
          <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-[2rem]">
            No movie or TV credits found for this person.
          </div>
        )}
      </div>
    </div>
  );
}
