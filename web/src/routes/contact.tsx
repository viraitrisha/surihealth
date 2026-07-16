// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/contact')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/contact"!</div>
// }

import { createFileRoute, Link } from '@tanstack/react-router';
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
// CONTACT COMPONENT
// ============================================================
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Vul alle velden in');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Vul een geldig e-mailadres in');
      return;
    }

    console.log('Contact formulier:', formData);
    setSuccess(true);
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <>
      <Header />
      
      <div className="pt-32 min-h-screen bg-gray-50">
        <div className="relative overflow-hidden px-4 py-12 md:px-8">
          
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 md:flex-row">
            
            {/* ---- CONTACT CARD (Formulier) ---- */}
            <div className="relative z-10 flex-[0_1_70%] bg-white p-8 shadow-[0_0.2rem_1rem_#000000]">
              
              {/* Titel */}
              <div className="form-side">
                <h2 className="mb-2 text-4xl md:text-5xl font-bold text-[#1A756A]">Neem contact op</h2>
                <p className="subtitle mb-6 text-2xl text-gray-600">
                  Heb je een vraag? Wij helpen je graag!
                </p>
              </div>

              {/* Success melding */}
              {success && (
                <div className="mb-4 rounded-lg bg-green-100 p-4 text-center text-xl text-green-700 border-2 border-green-500">
                  ✅ Je bericht is verzonden! We nemen snel contact met je op.
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
                {/* Naam */}
                <div className="mb-4 flex flex-col">
                  <label className="mb-1 text-xl font-bold text-gray-700">
                    Naam
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                    placeholder="Naam"
                    required
                  />
                </div>

                {/* E-mailadres */}
                <div className="mb-4 flex flex-col">
                  <label className="mb-1 text-xl font-bold text-gray-700">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                    placeholder="Uw email"
                    required
                  />
                </div>

                {/* Onderwerp */}
                <div className="mb-4 flex flex-col">
                  <label className="mb-1 text-xl font-bold text-gray-700">
                    Onderwerp
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 px-4 py-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                    required
                  >
                    <option value="">Kies een onderwerp</option>
                    <option value="vraag">Vraag over recepten</option>
                    <option value="feedback">Feedback</option>
                    <option value="allergie">Allergie informatie</option>
                    <option value="account">Account probleem</option>
                    <option value="overig">Overig</option>
                  </select>
                </div>

                {/* Bericht */}
                <div className="mb-6 flex flex-col">
                  <label className="mb-1 text-xl font-bold text-gray-700">
                    Bericht
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    className="min-h-[120px] resize-none rounded-lg border border-gray-300 p-3 text-xl transition focus:border-[#1A756A] focus:outline-none focus:ring-2 focus:ring-[#1A756A]/20"
                    placeholder="Typ hier je bericht..."
                    required
                  />
                </div>

                {/* Verstuur knop */}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1A756A] py-4 text-3xl font-bold text-white transition-all duration-300 hover:bg-[#155B52] hover:shadow-lg hover:translate-y-[-2px]"
                >
                  Bericht versturen
                </button>
              </form>
            </div>

            {/* ---- INFO CARD MET ICONEN ---- */}
            <div className="relative z-20 flex-[0_1_30%] bg-[#0B3F39] p-8 text-white shadow-[0_0.2rem_1rem_#000000]">
              <h3 className="mb-6 border-b-[5px] border-white pb-2 text-3xl font-bold">
                Contactgegevens
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <p className="flex items-center gap-3 text-xl">
                  <svg className="w-8 h-8 text-[#2D9C8F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  info@surihealth.sr
                </p>

                {/* Telefoon */}
                <p className="flex items-center gap-3 text-xl">
                  <svg className="w-8 h-8 text-[#2D9C8F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +597 8904567
                </p>

                {/* Locatie */}
                <p className="flex items-center gap-3 text-xl">
                  <svg className="w-8 h-8 text-[#2D9C8F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Paramaribo, Suriname
                </p>

                {/* Tijd */}
                <p className="flex items-center gap-3 text-xl">
                  <svg className="w-8 h-8 text-[#2D9C8F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Ma-Vr: 09:00 - 17:00
                </p>
              </div>
            </div>
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
export const Route = createFileRoute('/contact')({
  component: ContactPage,
});