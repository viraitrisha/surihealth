import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { FaHome, FaUtensils, FaShoppingBasket, FaHeart, FaUser, FaCog } from 'react-icons/fa';
import { SettingsDrawer } from './settings-drawer';

export function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (newTheme: 'light' | 'dark') => setTheme(newTheme);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] px-6 py-4 shadow-md h-20">
        <Link to="/dashboard" className="text-3xl md:text-4xl font-extrabold text-white no-underline tracking-tight shrink-0">
          SuriHealth
        </Link>

        {/* Hamburger mobile menu knop */}
        <button
          className="lg:hidden flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}></span>
        </button>

        {/* Gecorrigeerde Navigatiematrix */}
        <nav className={`
          lg:flex lg:flex-row lg:items-center lg:gap-3 lg:static lg:bg-transparent lg:p-0 lg:shadow-none lg:w-auto lg:h-auto lg:rounded-none lg:border-none
          ${menuOpen ? 'flex' : 'hidden'}
          flex-col absolute top-20 right-0 w-64 bg-[#1A756A] p-6 gap-4 shadow-xl rounded-bl-xl border-t border-white/10 transition-all duration-200
        `}>
          <Link to="/dashboard" className="nav-link group relative flex items-center gap-3 lg:flex-col lg:gap-1 text-white text-xl lg:text-2xl no-underline hover:bg-white/10 rounded-xl px-4 py-2.5 transition-colors">
            <FaHome className="shrink-0" />
            <span className="text-base lg:text-xs lg:opacity-0 lg:group-hover:opacity-100 lg:absolute lg:top-full lg:mt-2 lg:bg-slate-900/90 lg:text-white lg:px-2 lg:py-1 lg:rounded-lg lg:whitespace-nowrap lg:pointer-events-none transition-opacity shadow-sm">
              Startscherm
            </span>
          </Link>

          <Link to="/dashboard/recipes" className="nav-link group relative flex items-center gap-3 lg:flex-col lg:gap-1 text-white text-xl lg:text-2xl no-underline hover:bg-white/10 rounded-xl px-4 py-2.5 transition-colors">
            <FaUtensils className="shrink-0" />
            <span className="text-base lg:text-xs lg:opacity-0 lg:group-hover:opacity-100 lg:absolute lg:top-full lg:mt-2 lg:bg-slate-900/90 lg:text-white lg:px-2 lg:py-1 lg:rounded-lg lg:whitespace-nowrap lg:pointer-events-none transition-opacity shadow-sm">
              Recepten
            </span>
          </Link>

          <Link to="/dashboard/boodschappen" className="nav-link group relative flex items-center gap-3 lg:flex-col lg:gap-1 text-white text-xl lg:text-2xl no-underline hover:bg-white/10 rounded-xl px-4 py-2.5 transition-colors">
            <FaShoppingBasket className="shrink-0" />
            <span className="text-base lg:text-xs lg:opacity-0 lg:group-hover:opacity-100 lg:absolute lg:top-full lg:mt-2 lg:bg-slate-900/90 lg:text-white lg:px-2 lg:py-1 lg:rounded-lg lg:whitespace-nowrap lg:pointer-events-none transition-opacity shadow-sm">
              Boodschappen
            </span>
          </Link>

          <Link to="/dashboard/favorites" className="nav-link group relative flex items-center gap-3 lg:flex-col lg:gap-1 text-white text-xl lg:text-2xl no-underline hover:bg-white/10 rounded-xl px-4 py-2.5 transition-colors">
            <FaHeart className="shrink-0" />
            <span className="text-base lg:text-xs lg:opacity-0 lg:group-hover:opacity-100 lg:absolute lg:top-full lg:mt-2 lg:bg-slate-900/90 lg:text-white lg:px-2 lg:py-1 lg:rounded-lg lg:whitespace-nowrap lg:pointer-events-none transition-opacity shadow-sm">
              Favorieten
            </span>
          </Link>

          <Link to="/dashboard/profile" className="nav-link group relative flex items-center gap-3 lg:flex-col lg:gap-1 text-white text-xl lg:text-2xl no-underline hover:bg-white/10 rounded-xl px-4 py-2.5 transition-colors">
            <FaUser className="shrink-0" />
            <span className="text-base lg:text-xs lg:opacity-0 lg:group-hover:opacity-100 lg:absolute lg:top-full lg:mt-2 lg:bg-slate-900/90 lg:text-white lg:px-2 lg:py-1 lg:rounded-lg lg:whitespace-nowrap lg:pointer-events-none transition-opacity shadow-sm">
              Profiel
            </span>
          </Link>

          <button 
            onClick={() => { setSettingsOpen(true); setMenuOpen(false); }} 
            className="nav-link group relative flex items-center gap-3 lg:flex-col lg:gap-1 text-white text-xl lg:text-2xl no-underline hover:bg-white/10 rounded-xl px-4 py-2.5 transition-colors w-full lg:w-auto text-left lg:text-center cursor-pointer focus:outline-none"
          >
            <FaCog className="shrink-0" />
            <span className="text-base lg:text-xs lg:opacity-0 lg:group-hover:opacity-100 lg:absolute lg:top-full lg:mt-2 lg:bg-slate-900/90 lg:text-white lg:px-2 lg:py-1 lg:rounded-lg lg:whitespace-nowrap lg:pointer-events-none transition-opacity shadow-sm">
              Instellingen
            </span>
          </button>
        </nav>
      </header>

      {/* Schuifpanelen */}
      <SettingsDrawer
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onOpenProfile={() => {
          setSettingsOpen(false);
        }}
        onThemeToggle={toggleTheme}
        currentTheme={theme}
      />
    </>
  );
}
