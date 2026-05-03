import { Link, useLocation } from "react-router-dom";

const BOTTOM_MENU = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Discover", path: "/discover", icon: DiscoverIcon },
  { name: "Watchlist", path: "/watchlist", icon: WatchlistIcon },
  { name: "Premium", path: "/premium", icon: PremiumIcon },
  { name: "Account", path: "/settings", icon: AccountIcon },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-main/80 backdrop-blur-xl border-t border-white/5 md:hidden px-4 pb-safe">
      <div className="flex justify-between items-center h-16">
        {BOTTOM_MENU.map(({ name, path, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={name}
              to={path}
              className={`flex flex-col items-center gap-1 transition-colors ${
                active ? "text-brand" : "text-gray-500"
              }`}
            >
              <Icon active={active} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function HomeIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? "fill-brand" : "fill-none stroke-current"}`} strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
  );
}

function DiscoverIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? "fill-brand" : "fill-none stroke-current"}`} strokeWidth={2} viewBox="0 0 24 24">
      <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

function WatchlistIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? "fill-brand" : "fill-none stroke-current"}`} strokeWidth={2} viewBox="0 0 24 24">
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function PremiumIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? "fill-brand" : "fill-none stroke-current"}`} strokeWidth={2} viewBox="0 0 24 24">
      <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  );
}

function AccountIcon({ active }) {
  return (
    <svg className={`w-6 h-6 ${active ? "fill-brand" : "fill-none stroke-current"}`} strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
