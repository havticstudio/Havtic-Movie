import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/havticmovielogo.png";

const NAV_MENU = [
  {
    label: "Menu",
    items: [
      { name: "Home", path: "/", icon: HomeIcon },
      { name: "Discover", path: "/discover", icon: DiscoverIcon },
      { name: "Genres", path: "/genres", icon: GenreIcon },
      { name: "Awards", path: "/awards", icon: AwardsIcon },
      { name: "Celebrities", path: "/celebrities", icon: CelebIcon },
    ],
  },
  {
    label: "Library",
    items: [
      { name: "Recent", path: "/recent", icon: RecentIcon },
      { name: "Top Rated", path: "/top-rated", icon: TopRatedIcon },
      { name: "Watchlist", path: "/watchlist", icon: WatchlistIcon },
      { name: "Completed", path: "/completed", icon: CompletedIcon },
    ],
  },
  {
    label: "Premium",
    items: [
      { name: "Go Premium", path: "/premium", icon: PremiumIcon },
    ],
  },
  {
    label: "General",
    items: [
      { name: "Settings", path: "/settings", icon: SettingsIcon },
      { name: "Log Out", path: "/logout", icon: LogoutIcon, isAction: true },
    ],
  },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleAction = (name) => {
    if (name === "Log Out") {
      logout();
      navigate("/login");
    }
    setOpen(false);
  };

  return (
    <>
      {/* Mobile toggle button */}
      {!open && (
        <button
          className="fixed top-5 left-5 z-50 md:hidden bg-brand/90 backdrop-blur-md p-3 rounded-2xl text-white shadow-xl shadow-brand/20 active:scale-95 transition-all border border-brand/20"
          onClick={() => setOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-bg-main flex flex-col transition-all duration-500 ease-in-out md:relative md:translate-x-0 shrink-0 border-r border-white/5 shadow-2xl
          ${open ? "translate-x-0 opacity-100" : "-translate-x-full md:opacity-100 opacity-0"}`}
      >
        {/* Logo and Close button */}
        <div className="px-7 py-8 flex items-center justify-between">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 focus:outline-none">
            <img src={logo} alt="Havtic Movie" className="h-10 w-auto object-contain" />
          </Link>

          <button 
            className="md:hidden p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-5 scrollbar-hide pb-10">
          {NAV_MENU.map((group) => (
            <div key={group.label}>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 mb-2">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map(({ name, path, icon: Icon, isAction }) => {
                  const active = location.pathname === path;
                  
                  if (isAction) {
                    return (
                      <li key={name}>
                        <button
                          onClick={() => handleAction(name)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 text-gray-400 hover:text-white hover:bg-bg-surface-hover cursor-pointer"
                        >
                          <Icon active={false} />
                          {name}
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={name}>
                      <Link
                        to={path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 relative
                          ${active
                            ? "text-brand bg-bg-surface"
                            : "text-gray-400 hover:text-white hover:bg-bg-surface-hover"
                          }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand" />
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

          {/* Admin Menu */}
          {user?.isAdmin && (
            <div>
              <p className="text-brand/50 text-xs font-semibold uppercase tracking-widest px-3 mb-2 mt-5">
                Admin
              </p>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/admin/payments"
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 relative
                      ${location.pathname === "/admin/payments"
                        ? "text-brand bg-bg-surface"
                        : "text-gray-400 hover:text-white hover:bg-bg-surface-hover"
                      }`}
                  >
                    {location.pathname === "/admin/payments" && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand" />
                    )}
                    <AdminIcon active={location.pathname === "/admin/payments"} />
                    Manage Payments
                  </Link>
                </li>
              </ul>
            </div>
          )}
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
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
  );
}
function GenreIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}
function DiscoverIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}
function AwardsIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  );
}
function CelebIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5m6 0v-4m0 0a4 4 0 10-8 0" />
    </svg>
  );
}
function RecentIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function TopRatedIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}
function SettingsIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function LogoutIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
function WatchlistIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function CompletedIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PremiumIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
  );
}

function AdminIcon({ active }) {
  return (
    <svg className={`w-4 h-4 shrink-0 ${active ? "text-brand" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-5.618 2.04M12 21.359c-3.218-1.574-5.618-4.996-5.618-8.384v-4.01a11.955 11.955 0 015.618-2.041 11.955 11.955 0 015.618 2.041v4.01c0 3.388-2.4 6.81-5.618 8.384z" />
    </svg>
  );
}