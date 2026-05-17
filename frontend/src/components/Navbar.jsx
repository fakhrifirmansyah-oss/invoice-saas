import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, User, ChevronDown, Bell, Hexagon } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    setIsScrolled(window.scrollY > 40); // initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Hide on auth pages
  if (location.pathname === '/login' || location.pathname === '/register') return null;

  // ── Style Logic ──────────────────────────────────────────────────
  // Landing page top → transparent. Anywhere else or scrolled → glassmorphism dark.
  const navBg = (!isLandingPage || isScrolled)
    ? 'bg-gray-900/85 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3'
    : 'bg-transparent py-5';

  // FDBAtech text: hidden when at top of landing page, visible otherwise
  const brandVisible = !(isLandingPage && !isScrolled);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center group">
          <div className={`w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 ${!brandVisible ? 'scale-110 shadow-indigo-500/40' : 'shadow-indigo-500/20'}`}>
            <Hexagon size={24} className="text-white" />
          </div>
          <span className={`ml-3 text-xl font-black tracking-tight transition-all duration-500 ${brandVisible ? 'opacity-100 translate-y-0 text-white' : 'opacity-0 -translate-y-1 pointer-events-none select-none'}`}>
            FDBAtech<span className="text-indigo-400">.</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center space-x-6">
          {token ? (
            <>
              <button className="text-gray-400 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-gray-900"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-1.5 pl-1.5 pr-3 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    A
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden">
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <LayoutDashboard size={16} className="mr-3 text-indigo-400" /> Dashboard
                    </Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                      <User size={16} className="mr-3 text-indigo-400" /> Profile
                    </Link>
                    <div className="h-px bg-white/10 my-1"></div>
                    <button onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                      <LogOut size={16} className="mr-3" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-semibold transition-all duration-500 ${brandVisible ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
              >
                Start Free Trial
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
