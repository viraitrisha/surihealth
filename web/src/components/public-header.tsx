import { Link } from '@tanstack/react-router';
import { FontSizeController } from './font-resize-toggle';

export function PublicHeader() {
  const linkStyles =
    "relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-slate-200 after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full focus:outline-none";

  return (
    <header className="fixed top-0 left-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-md">
      <div className="flex items-center justify-between px-6 py-5 md:px-16 max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-3xl md:text-4xl font-extrabold text-white transition-transform duration-300 hover:scale-[1.02] no-underline tracking-tight"
        >
          SuriHealth
        </Link>

        <nav className="flex items-center gap-5 md:gap-8">
          <Link to="/" className={linkStyles}>Home</Link>
          <FontSizeController />
          <Link to="/faq" className={linkStyles}>FAQ</Link>
          <Link to="/contact" className={linkStyles}>Contact</Link>
          <Link
            to="/login"
            className="text-2xl font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-xl transition-all duration-200 border border-white/20 focus:outline-none"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}