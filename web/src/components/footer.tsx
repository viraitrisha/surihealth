export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#1A756A] to-[#2D9C8F] text-white py-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-lg md:text-xl text-left font-medium opacity-90">
          &copy; {currentYear} SuriHealth. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}