import { HeartPulse, Utensils, Sparkles, Leaf } from "lucide-react";

export default function Welkom() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
      {/* Decorative leaves (low opacity) */}
      <Leaf className="absolute -top-10 -left-10 w-40 h-40 text-white/10 rotate-12" />
      <Leaf className="absolute -bottom-8 -right-8 w-36 h-36 text-white/10 -rotate-12" />
      <Leaf className="absolute top-1/3 right-1/4 w-24 h-24 text-white/10 rotate-45" />

      <div className="max-w-6xl mx-auto px-6 py-16 text-center text-white">
        <h2 className="text-4xl font-black tracking-tight">
          Welkom bij SuriHealth
        </h2>
        <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
          Ontdek gezonde Surinaamse gerechten die passen bij jouw medische
          profiel en smaakvoorkeuren. Plan moeiteloos je maaltijden voor
          de hele dag.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
            <HeartPulse className="mx-auto mb-3 w-10 h-10 text-amber-300" />
            <h3 className="text-xl font-bold">Gezonde keuzes</h3>
            <p className="text-white/80 mt-1">
              Recepten die bijdragen aan een gezonde levensstijl.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
            <Utensils className="mx-auto mb-3 w-10 h-10 text-amber-300" />
            <h3 className="text-xl font-bold">Persoonlijke recepten</h3>
            <p className="text-white/80 mt-1">
              Recepten afgestemd op jouw smaak en dieetwensen.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
            <Sparkles className="mx-auto mb-3 w-10 h-10 text-amber-300" />
            <h3 className="text-xl font-bold">Nieuwe inspiratie</h3>
            <p className="text-white/80 mt-1">
              Ontdek dagelijks verse suggesties voor jouw maaltijden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}