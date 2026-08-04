import { createFileRoute, Link } from '@tanstack/react-router';
import { getRecipes } from '../../server-functions/recipes';
import AutomaticPlannerPage from '../../components/dashboard/automatic';
import Welkom from '../../components/dashboard/welkom';
import {
  Coffee,
  Layers,
  Sun,
  Moon,
  Cookie,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard/')({
  loader: async () => {
    try {
      const response = await getRecipes({ data: { limit: 250 } });
      return { allRecipes: response.recipes || [] };
    } catch {
      return { allRecipes: [] };
    }
  },
  component: DashboardHome,
});

function DashboardHome() {
  const { allRecipes } = Route.useLoaderData() as { allRecipes: any[] };

  const getRecipesByMealType = (
    type: 'ontbijt' | 'lunch' | 'middagmaaltijd' | 'avondeten' | 'dessert'
  ) => {
    const target = type.toLowerCase().trim();
    return allRecipes
      .filter((recipe: any) => {
        let cleanTypes: string[] = [];
        try {
          if (Array.isArray(recipe.mealTypes)) {
            cleanTypes = recipe.mealTypes;
          } else if (typeof recipe.mealTypes === 'string') {
            const parsed = JSON.parse(recipe.mealTypes);
            cleanTypes = Array.isArray(parsed) ? parsed : [String(parsed)];
          }
        } catch {
          cleanTypes = [String(recipe.mealTypes)];
        }
        const normalizedTypes = cleanTypes.map((t) =>
          String(t).toLowerCase().trim()
        );
        if (target === 'dessert') {
          return (
            normalizedTypes.includes('dessert') ||
            normalizedTypes.includes('snack') ||
            normalizedTypes.includes('snacks')
          );
        }
        return normalizedTypes.includes(target);
      })
      .slice(0, 4);
  };

  const rows = [
    {
      id: 'ontbijt',
      title: 'Ontbijt Inspiratie',
      icon: <Coffee className="h-5 w-5 text-amber-500" />,
      items: getRecipesByMealType('ontbijt'),
    },
    {
      id: 'lunch',
      title: 'Lichte Lunch',
      icon: <Layers className="h-5 w-5 text-blue-500" />,
      items: getRecipesByMealType('lunch'),
    },
    {
      id: 'middagmaaltijd',
      title: 'Warme Middagmaaltijd',
      icon: <Sun className="h-5 w-5 text-orange-500" />,
      items: getRecipesByMealType('middagmaaltijd'),
    },
    {
      id: 'avondeten',
      title: 'Verantwoord Avondeten',
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
      items: getRecipesByMealType('avondeten'),
    },
    {
      id: 'dessert',
      title: 'Snacks & Desserts',
      icon: <Cookie className="h-5 w-5 text-rose-500" />,
      items: getRecipesByMealType('dessert'),
    },
  ];

  const carouselTopPicks = allRecipes
    .filter((r: any) => r.isTopPick)
    .slice(0, 10);

  return (
    <div className="space-y-12 pb-20 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      {/* 1. FULL‑WIDTH WELCOME */}
      <Welkom />

      {/* 2. AUTOMATISCHE DAGPLANNER */}
      <section className="max-w-6xl mx-auto px-6">
        <AutomaticPlannerPage allRecipes={allRecipes} />
      </section>

      {/* 3. TOP PICKS CAROUSEL */}
      <section className="max-w-6xl mx-auto px-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2">
          <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
          <h3 className="text-xl font-bold tracking-tight">
            Onze Top Picks voor Jou
          </h3>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {carouselTopPicks.map((recipe: any) => (
            <div
              key={recipe.id}
              className="w-64 shrink-0 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between snap-start transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative h-36 bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                  Top Pick
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm line-clamp-1">
                    {recipe.name}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {recipe.category}
                  </p>
                </div>
                <Link
                  to="/dashboard/recipes/view/$recipeId"
                  params={{ recipeId: recipe.id }}
                  className="inline-flex items-center justify-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors no-underline"
                >
                  Kook nu <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
          {carouselTopPicks.length === 0 && (
            <p className="text-sm text-gray-400 font-medium py-4">
              Geen top picks beschikbaar voor jouw profiel.
            </p>
          )}
        </div>
      </section>

      {/* 4. MEDISCH GEFILTERDE CATEGORIE RIJEN */}
      <section className="max-w-6xl mx-auto px-6 space-y-10">
        <div className="border-t border-gray-100 dark:border-slate-800/60 pt-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Gepersonaliseerde Surinaamse Keuken
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Recepten gefilterd op basis van jouw biometrische waarden,
            allergenen en medische restricties.
          </p>
        </div>

        {rows.map((row) => {
          if (row.items.length === 0) return null;
          return (
            <div key={row.id} className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2 font-bold text-base">
                  {row.icon}
                  <h3>{row.title}</h3>
                </div>
                <Link
                  to="/dashboard/category"
                  search={{ mealType: row.id }}
                  className="inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors no-underline"
                >
                  Bekijk alles <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {row.items.map((recipe: any) => (
                  <div
                    key={recipe.id}
                    className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="relative h-36 bg-gray-50 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm line-clamp-1">
                          {recipe.name}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {recipe.category}
                        </span>
                      </div>
                      <Link
                        to="/dashboard/recipes/view/$recipeId"
                        params={{ recipeId: recipe.id }}
                        className="inline-flex items-center justify-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors no-underline mt-2"
                      >
                        Bekijk gerecht <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}