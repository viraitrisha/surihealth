import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipes/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
// const Home = () => {
//   return (
//     <>
      {/* ==========================================================
          HEADER - Fixed navigatie
          ========================================================== */}
      <header className="fixed top-0 w-full z-[1000] bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] shadow-[0_0.2rem_1rem_#000000]">
        <div className="flex items-center justify-between px-6 py-4 md:px-12">
          {/* Logo */}
          <h1 className="text-3xl font-bold text-white transition-all duration-300 md:text-4xl hover:scale-105">
            SuriHealth
          </h1>

          {/* Navigatie */}
          <nav className="flex items-center gap-6 md:gap-8">
            {/* Home link */}
            <a 
              href="/" 
              className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </a>

            {/* Fontgrootte controller */}
            <div className="relative flex items-center">
              <button
                id="fontToggleBtn"
                className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full"
              >
                Aa
              </button>

              {/* Slider panel - hidden by default */}
              <div
                id="fontPanel"
                className="absolute left-1/2 top-full mt-2 hidden min-w-[160px] -translate-x-1/2 rounded-lg bg-white p-4 shadow-lg"
              >
                <input
                  id="fontSlider"
                  type="range"
                  min="50"
                  max="90"
                  defaultValue="62.5"
                  className="w-full accent-[#1A756A]"
                />
              </div>
            </div>

            {/* Overige links */}
            <a 
              href="/faq" 
              className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full"
            >
              FAQ
            </a>
            <a 
              href="/contact" 
              className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </a>
            <a 
              href="/login" 
              className="relative text-2xl font-bold text-white no-underline whitespace-nowrap transition-all duration-300 hover:text-[#0B3F39] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-[#0B3F39] after:transition-all after:duration-300 hover:after:w-full"
            >
              Login
            </a>

            {/* Sidebar trigger */}
            <button
              id="sidebar-trigger"
              className="rounded-lg p-1 transition hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* ==========================================================
          MAIN CONTENT
          ========================================================== */}
      <main>
        {/* ---- HERO: Slideshow ---- */}
        <section className="relative h-[500px] w-full overflow-hidden bg-gray-900">
          <div className="relative h-full w-full">
            {/* Slide 1 */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-1000">
              <span className="absolute left-4 top-4 z-10 rounded bg-black/50 px-3 py-1 text-sm text-white">
                1 / 3
              </span>
              <img
                src="/images/HMP Image 1.jpeg"
                alt="Gezond eten 1"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Slide 2 */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-1000">
              <span className="absolute left-4 top-4 z-10 rounded bg-black/50 px-3 py-1 text-sm text-white">
                2 / 3
              </span>
              <img
                src="/images/HMP Image 2.jpeg"
                alt="Gezond eten 2"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Slide 3 */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-1000">
              <span className="absolute left-4 top-4 z-10 rounded bg-black/50 px-3 py-1 text-sm text-white">
                3 / 3
              </span>
              <img
                src="/images/HMP Image 3.jpeg"
                alt="Gezond eten 3"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ---- SURIHEALTH TITEL ---- */}
        <section className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] px-4 py-12">
          <h1 className="flex flex-wrap items-center justify-center gap-4 text-center text-4xl font-bold text-white md:text-5xl">
            <span className="text-2xl text-white/60">────────</span>
            <span className="text-3xl">𓆩༺</span>
            SURIHEALTH
            <span className="text-3xl">༻𓆪</span>
            <span className="text-2xl text-white/60">────────</span>
          </h1>
        </section>

        {/* ---- INFO: Diverse Gerechten ---- */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="rounded-2xl bg-white p-8 shadow-[0_0.2rem_1rem_#000000]">
            {/* Titel */}
            <h2 className="mb-8 text-center text-3xl font-bold text-[#1A756A]">
              Diverse Gerechten
            </h2>

            {/* Beschrijving */}
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h3 className="mb-4 text-xl font-semibold text-[#2D9C8F]">
                Voor mensen met medische behoeften
              </h3>

              <p className="text-2xl leading-relaxed text-gray-600">
                Kies je aandoening (diabetes, hartziekte, etc.),
                allergieën, dieetvoorkeuren (halal, vegetarisch)
                en geef aan wat je wel/niet lekker vindt.
                Ons systeem filtert automatisch recepten die perfect
                bij jouw situatie passen.
              </p>
            </div>

            {/* ---- CAROUSEL ---- */}
            <div className="relative overflow-hidden">
              <div className="flex animate-scroll gap-4 hover:animation-pause">
                {/* Eerste set afbeeldingen */}
                <img
                  src="/images/HMP Image 4.jpeg"
                  alt="Gerecht 1"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 5.jpeg"
                  alt="Gerecht 2"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 6.jpeg"
                  alt="Gerecht 3"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 7.jpeg"
                  alt="Gerecht 4"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 8.jpeg"
                  alt="Gerecht 5"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />

                {/* Duplicate set voor naadloze loop */}
                <img
                  src="/images/HMP Image 4.jpeg"
                  alt="Gerecht 1"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 5.jpeg"
                  alt="Gerecht 2"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 6.jpeg"
                  alt="Gerecht 3"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 7.jpeg"
                  alt="Gerecht 4"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
                <img
                  src="/images/HMP Image 8.jpeg"
                  alt="Gerecht 5"
                  className="h-48 w-64 flex-shrink-0 rounded-xl object-cover shadow-[0_0.2rem_1rem_#000000]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================================
          FOOTER
          ========================================================== */}
      <footer className="mt-8 bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] px-4 py-8 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-lg">© 2024 SuriHealth. Alle rechten voorbehouden.</p>
        </div>
      </footer>

      {/* ==========================================================
          CUSTOM STYLES (alleen voor animaties die Tailwind niet heeft)
          ========================================================== */}
      <style>{`
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .hover\\:animation-pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    // </>
//   );
// };

// export default Home;