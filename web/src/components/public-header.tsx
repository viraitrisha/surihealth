import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FontSizeController } from './font-resize-toggle';

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyles = `relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 
    hover:text-slate-200 
    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-white 
    after:transition-all after:duration-300 hover:after:w-full focus:outline-none`;

  const aaWrapperStyles = `relative inline-block 
    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-white 
    after:transition-all after:duration-300 hover:after:w-full`;

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-md">
      <div className="flex items-center justify-between px-6 py-5 md:px-16 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl md:text-4xl font-extrabold text-white transition-transform duration-300 hover:scale-[1.02] no-underline tracking-tight"
        >
          SuriHealth
        </Link>

        {/* Hamburger button */}
        <button
          className="lg:hidden flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>

        {/* Desktop navigatie */}
        <nav className="hidden lg:flex items-center gap-5 md:gap-8">
          <Link to="/" className={linkStyles}>Home</Link>
          <span className={aaWrapperStyles}>
            <FontSizeController />
          </span>
          <Link to="/faq" className={linkStyles}>FAQ</Link>
          <Link to="/contact" className={linkStyles}>Contact</Link>
          <Link to="/login" className={linkStyles}>Login</Link>
        </nav>

        {/* Desktop Register */}
        <Link
          to="/register"
          className="hidden lg:inline-block text-2xl font-bold bg-white text-[#1A756A] px-6 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 no-underline"
        >
          Register
        </Link>
      </div>

      {/* Mobiel menu */}
      <nav
        className={`
          lg:hidden
          ${menuOpen ? 'flex' : 'hidden'}
          flex-col absolute top-20 right-0 w-64 bg-[#1A756A] p-6 gap-4 shadow-xl rounded-bl-xl border-t border-white/10 transition-all duration-200
        `}
      >
        <Link to="/" className={linkStyles} onClick={() => setMenuOpen(false)}>Home</Link>
        <span className={aaWrapperStyles}>
          <FontSizeController />
        </span>
        <Link to="/faq" className={linkStyles} onClick={() => setMenuOpen(false)}>FAQ</Link>
        <Link to="/contact" className={linkStyles} onClick={() => setMenuOpen(false)}>Contact</Link>
        <Link to="/login" className={linkStyles} onClick={() => setMenuOpen(false)}>Login</Link>
        <Link
          to="/register"
          className="inline-block text-2xl font-bold bg-white text-[#1A756A] px-6 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-200 no-underline text-center"
          onClick={() => setMenuOpen(false)}
        >
          Register
        </Link>
      </nav>
    </header>
  );
}