import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSearchStore } from "../../store/useSearchStore";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clearQuery = useSearchStore((s) => s.clear);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!navRef.current.contains(e.target)) setIsMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const q = query?.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);
  const linkClass = (path: string) =>
    `${
      isActive(path)
        ? "text-sw-yellow border-b-2 border-sw-yellow"
        : "text-gray-300 hover:text-white"
    } transition-colors px-2 py-1 text-sm font-bold tracking-wide uppercase`;

  return (
    <div className="w-full min-h-screen bg-sw-black text-gray-100 font-sans flex flex-col">
      <nav
        ref={navRef}
        className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              onClick={() => {
                clearQuery();
                navigate("/people");
              }}
              className="text-sw-yellow font-black text-2xl tracking-widest hover:opacity-80 transition"
            >
              SWAPI REBORN
            </Link>

            <div className="hidden md:flex space-x-6 items-center">
              <Link to="/people" className={linkClass("/people")}>
                People
              </Link>
              <Link to="/planets" className={linkClass("/planets")}>
                Planets
              </Link>
              <Link to="/starships" className={linkClass("/starships")}>
                Starships
              </Link>
              <Link to="/vehicles" className={linkClass("/vehicles")}>
                Vehicles
              </Link>
              <Link to="/species" className={linkClass("/species")}>
                Species
              </Link>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:block w-80"
            >
              <input
                type="text"
                placeholder="Search Galaxy..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-sw-yellow focus:ring-1 focus:ring-sw-yellow transition text-white"
              />
            </form>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen((s) => !s)}
                className="text-gray-300 hover:text-white p-2"
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-4 pt-4 pb-2 space-y-2">
              {["people", "planets", "starships", "vehicles", "species"].map(
                (item) => (
                  <Link
                    key={item}
                    to={`/${item}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 uppercase"
                  >
                    {item}
                  </Link>
                )
              )}
            </div>
            <div className="p-4">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-sm text-white"
                />
              </form>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
export default Layout;
