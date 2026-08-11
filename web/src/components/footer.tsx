import { ArrowUp } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] text-white pt-0 pb-0 overflow-hidden z-0 border-t-4 border-[var(--accent-color)]">
      <div className="absolute -top-12 -left-1/4 w-[150%] h-24 bg-[var(--accent-color)] opacity-10 rotate-[-3deg] pointer-events-none" />
      <div className="flex justify-center py-6 relative">
        <button
          onClick={scrollToTop}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--primary-color)] text-white border-none cursor-pointer transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-[var(--secondary-color)]"
          aria-label="Terug naar boven"
        >
          <ArrowUp className="h-5 w-5 transition-transform group-hover:animate-bounce" />
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 px-6 md:px-8 py-5 bg-[var(--card-bg)]/10 backdrop-blur-md border-t border-white/20">
        <p className="font-semibold text-white text-sm md:text-base">
          &copy; {currentYear} SuriHealth. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}