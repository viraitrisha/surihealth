import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

// ============================================================
// FONT SIZE CONTEXT
// ============================================================
const useFontSize = () => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseFloat(saved) : 75;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  return { fontSize, setFontSize };
};

// ============================================================
// FONT SIZE CONTROLLER (Aa knop)
// ============================================================
const FontSizeController = () => {
  const { fontSize, setFontSize } = useFontSize();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] text-3xl"
      >
        Aa
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 min-w-[180px] rounded-lg bg-white p-4 shadow-lg z-50">
          <input
            type="range"
            min="50"
            max="90"
            step="0.1"
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="w-full accent-[#1A756A]"
          />
          <div className="mt-2 text-center text-base text-gray-600">
            {Math.round(fontSize)}%
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// HEADER COMPONENT
// ============================================================
export const Header = () => {
  return (
    <header className="fixed top-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-[0_0.2rem_1rem_#000000]">
      <div className="flex items-center justify-between px-10 py-8 md:px-20">
        <Link to="/" className="text-4xl md:text-5xl font-bold text-white transition-transform duration-300 hover:scale-105 no-underline">
          SuriHealth
        </Link>

        <nav className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full">
            Home
          </Link>

          <FontSizeController />

          <Link to="/faq" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full">
            FAQ
          </Link>
          <Link to="/contact" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full">
            Contact
          </Link>
          <Link to="/login" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};