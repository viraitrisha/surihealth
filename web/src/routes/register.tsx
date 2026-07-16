// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/register')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/register"!</div>
// }


import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

// ============================================================
// FONT SIZE CONTEXT (voor de Aa knop)
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
        className="font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] text-3xl"
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
// HEADER COMPONENT (zonder sidebar)
// ============================================================
const Header = () => {
  return (
    <header className="fixed top-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-[0_0.2rem_1rem_#000000]">
      <div className="flex items-center justify-between px-10 py-8 md:px-20">
        <Link to="/home" className="text-4xl md:text-5xl font-bold text-white transition-transform duration-300 hover:scale-105 no-underline">
          SuriHealth
        </Link>

        <nav className="flex items-center gap-6 lg:gap-8">
          <Link to="/home" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            Home
          </Link>

          <FontSizeController />

          <Link to="/faq" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            FAQ
          </Link>
          <Link to="/contact" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            Contact
          </Link>
          <Link to="/login" className="relative text-3xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#155B52] after:transition-all after:duration-300 hover:after:w-full">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

// ============================================================
// FOOTER COMPONENT
// ============================================================
const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white py-10 px-10 md:px-20">
      <p className="text-xl md:text-2xl text-left">&copy; 2026 SuriHealth.</p>
    </footer>
  );
};

// ============================================================
// REGISTER COMPONENT
// ============================================================
function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    setCountdown(3);

    // Validatie
    if (!formData.name || !formData.email || !formData.password) {
      setError('Vul alle velden in');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Vul een geldig e-mailadres in');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten');
      setLoading(false);
      return;
    }

    // Simuleer registratie
    console.log('Register poging:', formData);
    
    // Toon success melding
    setSuccess(true);
    setLoading(false);

    // Countdown timer voor navigatie naar questions
    let timer = 3;
    const countdownInterval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      
      if (timer === 0) {
        clearInterval(countdownInterval);
        navigate({ to: '/questions' });
      }
    }, 1000);
  };

  return (
    <>
      <Header />
      
      <div className="flex min-h-[calc(100vh-80px)] flex-col md:flex-row pt-24">
        {/* ---- LINKER KANT: Afbeelding ---- */}
        <div className="hidden flex-1 md:block">
          <img
            src="/RLP.png"
            alt="Registreer afbeelding"
            className="h-screen w-full object-cover"
          />
        </div>

        {/* ---- RECHTER KANT: Formulier ---- */}
        <div className="flex flex-1 items-center justify-center bg-gray-50 p-8">
          <div className="w-full max-w-md">
            {/* Titel */}
            <div className="mb-8 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-[#1A756A]">Register</h1>
              
            </div>

            {/* Success melding */}
            {success && (
              <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-xl text-green-700 border-2 border-green-500 animate-pulse">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">🎉</span>
                  <span className="font-bold text-2xl">Account succesvol aangemaakt!</span>
                  <span className="text-base font-normal text-green-600">
                    Je wordt doorgestuurd naar de vragenlijst in {countdown} seconden...
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${(3 - countdown) / 3 * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error melding */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-center text-xl text-red-700 border-2 border-red-500">
                ❌ {error}
              </div>
            )}

            {/* Formulier */}
            <form onSubmit={handleSubmit}>
              {/* Volledige naam */}
              <div className="mb-4">
                <label 
                  htmlFor="name" 
                  className="mb-1 block text-xl font-semibold text-gray-700"
                >
                  Naam
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                  placeholder="Naam"
                  disabled={loading || success}
                  required
                />
              </div>

              {/* E-mailadres */}
              <div className="mb-4">
                <label 
                  htmlFor="email" 
                  className="mb-1 block text-xl font-semibold text-gray-700"
                >
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                  placeholder="Uw email"
                  disabled={loading || success}
                  required
                />
              </div>

              {/* Wachtwoord */}
              <div className="mb-4">
                <label 
                  htmlFor="password" 
                  className="mb-1 block text-xl font-semibold text-gray-700"
                >
                  Wachtwoord
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                  placeholder="Minimaal 8 tekens"
                  disabled={loading || success}
                  required
                />
                {/* Wachtwoord sterkte indicator */}
                {formData.password && !success && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded ${
                            level <= getPasswordStrength(formData.password)
                              ? getPasswordStrength(formData.password) <= 2
                                ? 'bg-red-500'
                                : getPasswordStrength(formData.password) <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {getPasswordStrength(formData.password) <= 2 && 'Zwak wachtwoord'}
                      {getPasswordStrength(formData.password) === 3 && 'Gemiddeld wachtwoord'}
                      {getPasswordStrength(formData.password) >= 4 && 'Sterk wachtwoord'}
                    </p>
                  </div>
                )}
              </div>

              {/* Onthoud mij optie */}
              <div className="mb-6">
                <label className="flex cursor-pointer items-center gap-2 text-xl text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) =>
                      setFormData({ ...formData, rememberMe: e.target.checked })
                    }
                    className="h-6 w-6 rounded border-gray-300 text-[#1A756A] focus:ring-[#1A756A]"
                    disabled={loading || success}
                  />
                  Onthoud mij
                </label>
              </div>

              {/* Registreer knop */}
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full rounded-lg py-4 text-3xl font-bold text-white transition ${
                  loading || success
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#1A756A] hover:bg-[#155B52] hover:shadow-lg active:translate-y-0.5'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Bezig met registreren...
                  </span>
                ) : success ? (
                  `✅ Geregistreerd! (${countdown}s)`
                ) : (
                  'Account aanmaken'
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-6 text-center text-xl text-gray-600">
              Heb je al een account?{' '}
              <a href="/login" className="font-medium text-[#1A756A] hover:underline">
                Log hier in
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// ============================================================
// HELPER FUNCTIE: Wachtwoord sterkte
// ============================================================
function getPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  return strength;
}

// ============================================================
// TANSTACK ROUTER EXPORT
// ============================================================
export const Route = createFileRoute('/register')({
  component: RegisterPage,
});