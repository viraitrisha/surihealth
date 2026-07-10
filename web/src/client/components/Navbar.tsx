import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFontSize } from '../hooks/useFontSize';

const Navigation = () => {
  const [isFontPanelOpen, setIsFontPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { fontSize, updateFontSize } = useFontSize();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsFontPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="text-3xl font-bold text-suri-green">
              SuriHealth
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-suri-green transition-colors">
                Home
              </Link>
              
              {/* Font Toggle */}
              <div className="relative" ref={panelRef}>
                <button
                  onClick={() => setIsFontPanelOpen(!isFontPanelOpen)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-lg font-semibold"
                >
                  Aa
                </button>
                
                {isFontPanelOpen && (
                  <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-4 w-48 z-50">
                    <input
                      type="range"
                      min="50"
                      max="90"
                      value={fontSize}
                      onChange={(e) => updateFontSize(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>A</span>
                      <span>A</span>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/faq" className="text-gray-700 hover:text-suri-green transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-suri-green transition-colors">
                Contact
              </Link>
              <Link to="/login" className="btn-primary">
                Login
              </Link>

              {/* Sidebar Trigger */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
                </svg>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-2xl hover:text-gray-600"
            >
              ✕
            </button>
            
            <nav className="flex flex-col space-y-6 mt-12">
              <Link to="/" className="text-xl hover:text-suri-green transition-colors" onClick={() => setIsSidebarOpen(false)}>
                Home
              </Link>
              
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">Lettergrootte:</span>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={fontSize}
                  onChange={(e) => updateFontSize(parseFloat(e.target.value))}
                  className="flex-1"
                />
              </div>
              
              <Link to="/faq" className="text-xl hover:text-suri-green transition-colors" onClick={() => setIsSidebarOpen(false)}>
                FAQ
              </Link>
              <Link to="/contact" className="text-xl hover:text-suri-green transition-colors" onClick={() => setIsSidebarOpen(false)}>
                Contact
              </Link>
              <Link to="/login" className="btn-primary text-center" onClick={() => setIsSidebarOpen(false)}>
                Login
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;