import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import laptopMockup from "../assets/havticmovielogo.png"; // Fallback image for now

export default function AppDownload() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-main relative flex flex-col pt-20 px-6 md:px-12 xl:px-24 pb-20 items-center justify-center">
      <Helmet>
        <title>Download Havtic App</title>
      </Helmet>

      {/* Decorative gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-brand/20 blur-[150px] pointer-events-none rounded-full transform -translate-y-1/2"></div>

      <button 
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      <div className="max-w-4xl w-full text-center relative z-10 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
          Experience <span className="text-brand">Havtic</span> Anywhere
        </h1>
        <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto mb-12">
          Download our dedicated applications for Desktop and Mobile. Enjoy an uninterrupted, premium streaming experience with offline viewing and personalized notifications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {/* Desktop App Card */}
          <div className="bg-bg-surface border border-white/10 rounded-3xl p-8 flex flex-col items-center hover:border-brand/50 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-brand mb-6 shadow-xl border border-white/5">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Desktop App</h2>
            <p className="text-gray-400 text-center mb-8 text-sm">Available for Windows and macOS. Enjoy 4K streaming and keyboard shortcuts.</p>
            <button className="mt-auto w-full py-4 rounded-xl bg-brand text-white font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20">
              Download for PC
            </button>
          </div>

          {/* Mobile App Card */}
          <div className="bg-bg-surface border border-white/10 rounded-3xl p-8 flex flex-col items-center hover:border-brand/50 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-brand mb-6 shadow-xl border border-white/5">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Mobile App</h2>
            <p className="text-gray-400 text-center mb-8 text-sm">Available for Android and iOS. Take your movies on the go with offline downloads.</p>
            <button className="mt-auto w-full py-4 rounded-xl bg-brand text-white font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20">
              Download APK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
