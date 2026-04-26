import { useLocation } from "react-router-dom";

export default function Placeholder() {
  const location = useLocation();
  const title = location.pathname.split("/").pop().replace("-", " ").toUpperCase();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-24 h-24 mb-6 rounded-full bg-[#1a1d27] flex items-center justify-center border border-white/5 shadow-2xl shadow-black/60">
        <svg className="w-12 h-12 text-[#00e5c4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
        {title || "PAGE"} COMING SOON
      </h1>
      <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
        We're currently working hard on this section. Stay tuned for updates and check back later for awesome content!
      </p>
    </div>
  );
}
