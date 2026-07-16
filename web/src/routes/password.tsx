// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/password')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/forgotpassword"!</div>
// }


import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

// ============================================================
// FONT SIZE CONTEXT (voor de Aa knop)
// ============================================================
const useFontSize = () => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? parseFloat(saved) : 62.5;
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
const FontSizeController = ({ mobile = false }: { mobile?: boolean }) => {
  const { fontSize, setFontSize } = useFontSize();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] ${
          mobile ? 'text-lg' : 'text-2xl'
        }`}
      >
        Aa
      </button>

      {isOpen && (
        <div className={`absolute ${
          mobile ? 'left-0 top-full mt-2' : 'left-1/2 top-full mt-2 -translate-x-1/2'
        } min-w-[160px] rounded-lg bg-white p-4 shadow-lg z-50`}>
          <input
            type="range"
            min="50"
            max="90"
            step="0.1"
            value={fontSize}
            onChange={(e) => setFontSize(parseFloat(e.target.value))}
            className="w-full accent-[#1A756A]"
          />
          <div className="mt-2 text-center text-sm text-gray-600">
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
const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <header className="fixed top-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-[0_0.2rem_1rem_#000000]">
        <div className="flex items-center justify-between px-10 py-4 md:px-20">
          <Link to="/" className="text-3xl md:text-4xl font-bold text-white transition-transform duration-300 hover:scale-105 no-underline">
            SuriHealth
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/home" className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
              Home
            </Link>

            <FontSizeController />

            <Link to="/faq" className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
              FAQ
            </Link>
            <Link to="/contact" className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
              Contact
            </Link>
            <Link to="/login" className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
              Login
            </Link>

            <button onClick={toggleSidebar} className="rounded-lg p-1 transition hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
            </button>
          </nav>

          <button onClick={toggleSidebar} className="md:hidden rounded-lg p-1 transition hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar} />
          <div className="fixed top-0 right-0 h-full w-64 bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-lg z-50 p-6 transform transition-transform">
            <button onClick={closeSidebar} className="float-right text-white text-2xl hover:text-[#155B52] transition">
              ✕
            </button>
            <nav className="flex flex-col mt-8 space-y-4">
              <Link to="/" className="text-white text-xl font-bold no-underline hover:text-[#155B52] transition">
                Home
              </Link>
              <FontSizeController mobile={true} />
              <Link to="/faq" className="text-white text-xl font-bold no-underline hover:text-[#155B52] transition">
                FAQ
              </Link>
              <Link to="/contact" className="text-white text-xl font-bold no-underline hover:text-[#155B52] transition">
                Contact
              </Link>
              <Link to="/login" className="text-white text-xl font-bold no-underline hover:text-[#155B52] transition">
                Login
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

// ============================================================
// FOOTER COMPONENT
// ============================================================
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white text-center py-10">
      <p className="text-xl">&copy; 2026 SuriHealth.</p>
    </footer>
  );
};

// ============================================================
// PASSWORD RESET COMPONENT
// ============================================================
function PasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset link verstuurd naar:', email);
    setIsSubmitted(true);
    setTimeout(() => {
      window.location.href = '/login';
    }, 3000);
  };

  return (
    <>
      <Header />
      
      <div className="flex min-h-[calc(100vh-80px)] flex-col md:flex-row pt-20">
        {/* ---- LINKER KANT: Afbeelding ---- */}
        <div className="hidden flex-1 md:block">
          <img
            src="/RLP.png"
            alt="Password reset"
            className="h-screen w-full object-cover"
          />
        </div>

        {/* ---- RECHTER KANT: Formulier ---- */}
        <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
          <div className="w-full max-w-md">
            {/* Titel */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A756A]">Wachtwoord vergeten?</h1>
              <p className="mt-2 text-xl text-gray-600">Voer uw email in en wij sturen u een resetlink</p>
            </div>

            {isSubmitted ? (
              // Success message
              <div className="text-center bg-white rounded-lg shadow-lg p-8">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-[#1A756A] mb-4">
                  Reset link verstuurd!
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We hebben een reset link gestuurd naar <br />
                  <strong className="text-[#1A756A]">{email}</strong>
                </p>
                <p className="text-base text-gray-500">
                  Je wordt binnen enkele seconden doorgestuurd...
                </p>
                <Link
                  to="/login"
                  className="inline-block mt-6 text-[#1A756A] font-bold hover:underline text-lg"
                >
                  Terug naar login
                </Link>
              </div>
            ) : (
              // Password form
              <div className="bg-white rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block mb-1 text-lg font-semibold text-gray-700">
                      E-mailadres
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Uw email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#1A756A] py-4 text-2xl font-bold text-white transition hover:bg-[#155B52] hover:shadow-lg active:translate-y-0.5"
                  >
                    Reset link versturen
                  </button>

                  <p className="text-center mt-6 text-lg">
                    Weet u uw wachtwoord weer?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-[#1A756A] hover:underline"
                    >
                      Terug naar login
                    </Link>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// ============================================================
// TANSTACK ROUTER EXPORT
// ============================================================
export const Route = createFileRoute('/password')({
  component: PasswordPage,
});