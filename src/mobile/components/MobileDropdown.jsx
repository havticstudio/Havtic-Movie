import { useState } from "react";

export default function MobileDropdown({ label, options, activeId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeOption = options.find((opt) => opt.id === activeId) || options[0];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.1em] text-gray-300 hover:bg-white/10 transition-all active:scale-95"
      >
        <span className="text-gray-500/80">{label}</span>
        <span className="text-white truncate max-w-[80px]">{activeOption.name}</span>
        <svg
          className={`w-3 h-3 text-brand transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full bg-bg-surface rounded-t-[40px] border-t border-white/10 max-h-[75vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 ease-out">
            {/* Handle bar */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2 shrink-0" />

            <div className="px-8 py-6 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-1">Select {label}</h3>
                <p className="text-[9px] text-gray-500 uppercase tracking-widest">Choose your preference</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto px-6 pb-12 grid grid-cols-2 gap-3 custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelect(opt.id);
                    setIsOpen(false);
                  }}
                  className={`group relative px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all text-left overflow-hidden ${
                    activeId === opt.id
                      ? "bg-brand text-white shadow-2xl shadow-brand/40 scale-[1.02]"
                      : "bg-white/5 text-gray-400 border border-white/5 hover:border-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="relative z-10">{opt.name}</span>
                  {activeId === opt.id && (
                    <div className="absolute top-0 right-0 p-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
