import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_MENU = [
  {
    label: "Menu",
    items: [
      { name: "Home", path: "/", icon: HomeIcon },
      { name: "Discover", path: "/discover", icon: DiscoverIcon },
      { name: "Awards", path: "/awards", icon: AwardsIcon },
      { name: "Celebrities", path: "/celebrities", icon: CelebIcon },
    ],
  },
  {
    label: "Library",
    items: [
      { name: "Recent", path: "/recent", icon: RecentIcon },
      { name: "Top Rated", path: "/top-rated", icon: TopRatedIcon },
      { name: "Downloaded", path: "/downloaded", icon: DownloadIcon },
      { name: "Playlists", path: "/playlists", icon: PlaylistIcon },
      { name: "Watchlist", path: "/watchlist", icon: WatchlistIcon },
      { name: "Completed", path: "/completed", icon: CompletedIcon },
    ],
  },
  {
    label: "General",
    items: [
      { name: "Settings", path: "/settings", icon: SettingsIcon },
      { name: "Log Out", path: "/logout", icon: LogoutIcon },
    ],
  },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#1a1d27] p-2 rounded-lg text-white"
        onClick={() => setOpen(!open)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#13151f] flex flex-col transition-transform duration-300 md:relative md:translate-x-0 shrink-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="px-6 py-6 mb-2">
          <span className="text-white font-black text-xl tracking-tight leading-tight">
            TINY<br />MOVIEZ
          </span>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-5 scrollbar-none">
          {NAV_MENU.map((group) => (
            <div key={group.label}>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map(({ name, path, icon: Icon }) => {
                  const active = location.pathname === path;
                  return (
                    <li key={name}>
                      <Link
                        to={path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 relative
                          ${active
                            ? "text-[#00e5c4] bg-[#1a1d27]"
                            : "text-gray-400 hover:text-white hover:bg-[#1e2130]"
                          }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#00e5c4]" />
                        )}
                        <Icon active={active} />
                        {name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* ── Icons ── */
function HomeIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
  );
}
function DiscoverIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}
function AwardsIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1M9 11H5m14 0h-4" />
    </svg>
  );
}
function CelebIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m6 0v-4m0 0a4 4 0 10-8 0" />
    </svg>
  );
}
function RecentIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function TopRatedIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}
function DownloadIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
function PlaylistIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
function WatchlistIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function CompletedIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function SettingsIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function LogoutIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-[#00e5c4]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}