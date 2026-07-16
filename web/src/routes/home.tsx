// import { createFileRoute } from '@tanstack/react-router'

// export const Route = createFileRoute('/home')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return <div>Hello "/home"!</div>
// }


import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, createContext, useContext } from 'react'

// ============================================================
// FONT SIZE CONTEXT (voor alle pagina's)
// ============================================================
const FontSizeContext = createContext<{
  fontSize: number
  setFontSize: (size: number) => void
} | undefined>(undefined)

const useFontSize = () => {
  const context = useContext(FontSizeContext)
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider')
  }
  return context
}

const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize')
    return saved ? parseFloat(saved) : 75
  })

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
    localStorage.setItem('fontSize', fontSize.toString())
  }, [fontSize])

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  )
}

// ============================================================
// FONT SIZE CONTROLLER (herbruikbaar)
// ============================================================
const FontSizeController = ({ mobile = false }: { mobile?: boolean }) => {
  const { fontSize, setFontSize } = useFontSize()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#155B52] ${
          mobile ? 'text-xl' : 'text-3xl'
        }`}
      >
        Aa
      </button>

      {isOpen && (
        <div className={`absolute ${
          mobile ? 'left-0 top-full mt-2' : 'left-1/2 top-full mt-2 -translate-x-1/2'
        } min-w-[180px] rounded-lg bg-white p-4 shadow-lg z-50`}>
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
  )
}

// ============================================================
// HOME PAGE COMPONENT
// ============================================================
function RouteComponent() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const slides = [
    '/HMP Image 1.jpeg',
    '/HMP Image 2.jpeg',
    '/HMP Image 3.jpeg',
  ]

  const carouselImages = [
    '/HMP Image 4.jpeg',
    '/HMP Image 5.jpeg',
    '/HMP Image 6.jpeg',
    '/HMP Image 7.jpeg',
    '/HMP Image 8.jpeg',
    '/HMP Image 4.jpeg',
    '/HMP Image 5.jpeg',
    '/HMP Image 6.jpeg',
    '/HMP Image 7.jpeg',
    '/HMP Image 8.jpeg'
  ]

  // Slideshow auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  // Carousel scroll effect
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.scrollWidth / 2
      const animate = () => {
        if (carouselRef.current) {
          carouselRef.current.scrollLeft += 1
          if (carouselRef.current.scrollLeft >= scrollAmount) {
            carouselRef.current.scrollLeft = 0
          }
        }
      }
      const interval = setInterval(animate, 30)
      return () => clearInterval(interval)
    }
  }, [])

  return (
    <FontSizeProvider>
      {/* ============================================================ */}
      {/* HEADER - ZONDER SIDEBAR */}
      {/* ============================================================ */}
      <header className="fixed top-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-[0_0.2rem_1rem_#000000]">
        <div className="flex items-center justify-between px-10 py-8 md:px-20">
          <h1 className="text-4xl font-bold text-white transition-transform duration-300 md:text-5xl hover:scale-105">
            SuriHealth
          </h1>

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

      {/* ============================================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================================ */}
      <main className="pt-24">
        {/* ========================================================== */}
        {/* HERO SLIDESHOW */}
        {/* ========================================================== */}
        <section className="relative h-[85vh] w-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-white/50" />
              <span className="hidden">1 / 3</span>
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ))}
        </section>

        {/* ========================================================== */}
        {/* SURIHEALTH HEADER */}
        {/* ========================================================== */}
        <section className="w-full py-16 bg-[#0B3F39]">
          <div className="flex justify-center items-center gap-4 md:gap-8 text-white font-bold flex-wrap text-center">
            <span className="tracking-[-1px] text-3xl md:text-6xl">────────</span>
            <span className="text-5xl md:text-[5.5rem] leading-none">𓆩༺</span>
            <span className="text-4xl md:text-6xl">SURIHEALTH</span>
            <span className="text-5xl md:text-[5.5rem] leading-none">༻𓆪</span>
            <span className="tracking-[-1px] text-3xl md:text-6xl">────────</span>
          </div>
        </section>

        {/* ========================================================== */}
        {/* INFO SECTION */}
        {/* ========================================================== */}
        <section className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white py-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Diverse Gerechten</h2>

          <div className="mx-8 md:mx-16 text-left">
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">
              Voor mensen met medische behoeften
            </h3>
            <p className="text-xl md:text-2xl leading-relaxed">
              Kies je aandoening (diabetes, hartziekte, etc.), allergieën, dieetvoorkeuren (halal, vegetarisch) en geef aan wat je wel/niet lekker vindt. Ons systeem filtert automatisch recepten die perfect bij jouw situatie passen.
            </p>
          </div>

          <div className="w-full overflow-hidden relative my-8">
            <div ref={carouselRef} className="flex w-max gap-4 animate-scroll">
              {carouselImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Carousel ${index + 1}`}
                  className="flex-shrink-0 h-[200px] w-[160px] md:h-[480px] md:w-[400px] object-cover border-4 border-black"
                />
              ))}
            </div>
          </div>

          <div className="mx-8 md:mx-16 text-left md:text-right">
            <h3 className="text-3xl md:text-4xl font-semibold mb-4">
              Voor iedereen die gezonder wil eten
            </h3>
            <p className="text-xl md:text-2xl leading-relaxed">
              Geen specifieke aandoening? Geen probleem! Je kunt ook gewoon aangeven dat je "gezonder wilt eten" en wij geven je heerlijke, uitgebalanceerde Surinaamse recepten zonder complexe restricties.
            </p>
          </div>
        </section>

        {/* ========================================================== */}
        {/* WORKING SECTION (STAP 1, 2, 3) */}
        {/* ========================================================== */}
        <section className="grid gap-0">
          {/* STAP 1 */}
          <div className="bg-white text-black min-h-[70vh] p-8 md:p-16 overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-4 md:gap-6 mb-4">
              <span className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white text-3xl font-bold flex items-center justify-center rounded-full shadow-[0_0_0.5rem_#0B3F39]">
                1
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A756A] m-0 relative">
                Maak een profiel
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] rounded-lg"></span>
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src="/HMP working-section stap 1.png"
                alt="Stap 1"
                className="w-full md:w-[420px] h-auto transition-all duration-300 hover:-translate-y-1"
              />
              <div className="flex-1">
                <p className="text-xl md:text-2xl leading-relaxed mb-4">
                  U begint uw SuriHealth ervaring door een persoonlijk profiel aan te maken dat precies bij uw situatie en voorkeuren past. Dit is een eenvoudig proces waarbij u een reeks vragen beantwoordt die specifiek zijn ontworpen voor Surinamers met gezondheidsbehoeften.
                </p>
                <ul className="list-none p-0 m-0 space-y-3">
                  <li className="pl-8 relative text-lg md:text-xl">
                    <span className="text-[#1A756A] font-bold absolute left-0 text-2xl">✓</span>
                    U kunt uw profiel altijd bewerken
                  </li>
                  <li className="pl-8 relative text-lg md:text-xl">
                    <span className="text-[#1A756A] font-bold absolute left-0 text-2xl">✓</span>
                    Alle informatie wordt veilig en privé opgeslagen
                  </li>
                  <li className="pl-8 relative text-lg md:text-xl">
                    <span className="text-[#1A756A] font-bold absolute left-0 text-2xl">✓</span>
                    Uw profiel vormt de basis voor alle gepersonaliseerde aanbevelingen
                  </li>
                  <li className="pl-8 relative text-lg md:text-xl">
                    <span className="text-[#1A756A] font-bold absolute left-0 text-2xl">✓</span>
                    Hoe meer details u geeft, hoe beter de resultaten
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* STAP 2 */}
          <div className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white min-h-[70vh] p-8 md:p-16 overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-4 md:gap-6 mb-4">
              <span className="w-14 h-14 md:w-16 md:h-16 bg-white text-[#1A756A] text-3xl font-bold flex items-center justify-center rounded-full shadow-[0_0_0.5rem_#0B3F39]">
                2
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white m-0 relative">
                Filter op basis van profiel
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-white rounded-lg"></span>
              </h2>
            </div>

            <div>
              <p className="text-xl md:text-2xl leading-relaxed mb-4">
                Zodra uw profiel compleet is, activeert SuriHealth zijn intelligente filtersysteem dat automatisch de hele receptendatabase doorzoekt en alleen de recepten selecteert die perfect bij uw specifieke situatie passen.
              </p>
              <ul className="list-none p-0 m-0 space-y-3">
                <li className="pl-8 relative text-lg md:text-xl">
                  <span className="text-white font-bold absolute left-0 text-2xl">✓</span>
                  Medisch veilig zijn voor uw specifieke gezondheidssituatie
                </li>
                <li className="pl-8 relative text-lg md:text-xl">
                  <span className="text-white font-bold absolute left-0 text-2xl">✓</span>
                  Culinair aantrekkelijk zijn volgens uw smaakvoorkeuren
                </li>
                <li className="pl-8 relative text-lg md:text-xl">
                  <span className="text-white font-bold absolute left-0 text-2xl">✓</span>
                  Praktisch uitvoerbaar zijn met lokale ingrediënten
                </li>
                <li className="pl-8 relative text-lg md:text-xl">
                  <span className="text-white font-bold absolute left-0 text-2xl">✓</span>
                  Budgetvriendelijk blijven binnen uw financiële mogelijkheden
                </li>
                <li className="pl-8 relative text-lg md:text-xl">
                  <span className="text-white font-bold absolute left-0 text-2xl">✓</span>
                  Tijddeficiënt zijn volgens uw beschikbare tijd
                </li>
              </ul>
            </div>
          </div>

          {/* STAP 3 */}
          <div className="bg-white text-black min-h-[70vh] p-8 md:p-16 overflow-hidden transition-all duration-300">
            <div className="flex items-center gap-4 md:gap-6 mb-4">
              <span className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white text-3xl font-bold flex items-center justify-center rounded-full shadow-[0_0_0.5rem_#0B3F39]">
                3
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A756A] m-0 relative">
                Automatisch of Handmatig Receptselectie
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] rounded-lg"></span>
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <p className="text-xl md:text-2xl leading-relaxed">
                  Geniet van het gemak van automatisering wanneer u haast heeft, en de creativiteit van handmatige selectie wanneer u tijd heeft om te verkennen en te experimenteren met de rijke Surinaamse keuken, altijd binnen de grenzen van uw gezondheidsbehoeften en persoonlijke voorkeuren.
                </p>
              </div>
              <img
                src="/HMP working-section stap 3.png"
                alt="Stap 3"
                className="w-full md:w-[750px] h-auto transition-all duration-300 hover:-translate-y-1"
              />
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* BENT U GEINTERESSEERD */}
        {/* ========================================================== */}
        <section className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-white text-4xl md:text-[4rem] font-bold">
            Bent u geïnteresseerd?
            <br />
            <i className="text-3xl md:text-4xl font-normal">Geen account?</i>
          </p>
          <Link
            to="/register"
            className="inline-block mt-6 px-10 md:px-12 py-4 md:py-5 bg-black text-white rounded-lg font-bold text-2xl md:text-3xl no-underline transition-all duration-300 hover:bg-[#155B52] hover:shadow-lg hover:-translate-y-1"
          >
            REGISTREER NU!
          </Link>
        </section>

        {/* ========================================================== */}
        {/* ABOUT US */}
        {/* ========================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 max-w-7xl mx-auto">
          <div>
            <h2 className="pb-4 border-b-4 border-black text-3xl md:text-4xl font-bold text-[#1A756A]">
              Visie
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mt-4 text-gray-700">
              Wij geloven dat gezonde voeding bijdraagt aan het herstel en welzijn van de samenleving. De SuriHealth Mealplanner maakt voedingsinformatie en gepersonaliseerde recepten toegankelijk voor patiënten, gezondheidsbewuste gebruikers en diëtisten.
            </p>
          </div>

          <div>
            <h2 className="pb-4 border-b-4 border-black text-3xl md:text-4xl font-bold text-[#1A756A]">
              Missie
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mt-4 text-gray-700">
              De SuriHealth Mealplanner biedt gepersonaliseerde recepten op basis van medische aandoeningen, allergieën en voorkeuren, zodat patiënten en gezondheidsbewuste gebruikers passende voedingskeuzes kunnen maken.
            </p>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* FOOTER - TEKST AAN DE LINKERKANT */}
      {/* ============================================================ */}
      <footer className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white py-10 px-10 md:px-20">
        <p className="text-xl md:text-2xl text-left">&copy; 2026 SuriHealth</p>
      </footer>

      {/* ============================================================ */}
      {/* ANIMATIONS */}
      {/* ============================================================ */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </FontSizeProvider>
  )
}

// ============================================================
// ROUTER EXPORT
// ============================================================
export const Route = createFileRoute('/home')({
  component: RouteComponent,
})