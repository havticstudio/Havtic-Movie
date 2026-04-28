import { Link } from "react-router-dom";

export default function Breadcrumbs({ paths = [] }) {
  return (
    <nav className="flex items-center gap-2 text-gray-500 text-[10px] md:text-xs mb-6 uppercase tracking-widest font-black animate-fade-in">
      <Link to="/" className="hover:text-brand transition-colors">
        Home
      </Link>
      
      {paths.map((path, index) => (
        <div key={index} className="flex items-center gap-2">
          <svg className="w-2.5 h-2.5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
          
          {path.link ? (
            <Link to={path.link} className="hover:text-brand transition-colors">
              {path.label}
            </Link>
          ) : (
            <span className="text-gray-400">{path.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
