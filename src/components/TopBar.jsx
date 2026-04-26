/* ══════════════════════════════
   TOP BAR
══════════════════════════════ */
export default function TopBar({ activeTab, setActiveTab, search, setSearch }) {
  const tabs = ["Movies", "TV Shows", "Anime"];
  return (
    <div className="flex w-full text-white justify-between items-center gap-2 md:gap-4 mb-6 flex-wrap">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 md:px-4 py-2 cursor-pointer text-sm font-semibold transition-all duration-150 relative ${
              activeTab === tab
                ? "text-[#00e5c4]"
                : "text-white hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-[#00e5c4]" />
            )}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2 bg-[#1a1d27] border border-white/5 rounded-xl px-4 py-2.5 w-full mt-3 md:mt-0 md:w-80 lg:w-96 focus-within:border-[#00e5c4]/30 focus-within:ring-1 focus-within:ring-[#00e5c4]/20 transition-all">
        <svg
          className="w-4 h-4 text-gray-500 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search Movies, TV Shows, Anime"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-white text-sm flex-1 outline-none placeholder-gray-500 min-w-0"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-gray-500 hover:text-white transition-colors shrink-0"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
