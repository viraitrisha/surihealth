import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { getRecipes } from '../../../server-functions/recipes';
import { getViewHistory } from '../../../server-functions/history';
import {
  Search,
  ChevronRight,
  Coffee,
  Layers,
  Sun,
  Moon,
  Cookie,
  MapPin,
  Clock,
  Leaf,
  Utensils,
  History,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard/recipes/$category')({
  loader: async () => {
    const response = await getRecipes({ data: { limit: 500 } });

    let historyEntries: any[] = [];
    try {
      const rawHistory = await getViewHistory();
      const uniqueMap = new Map<string, any>();
      rawHistory.forEach((entry: any) => {
        const recipeId = entry.recipe?.id;
        if (!recipeId) return;
        const currentViewed = new Date(entry.viewedAt).getTime();
        const existing = uniqueMap.get(recipeId);
        if (!existing || currentViewed > new Date(existing.viewedAt).getTime()) {
          uniqueMap.set(recipeId, entry);
        }
      });
      historyEntries = Array.from(uniqueMap.values())
        .sort((a: any, b: any) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
        .slice(0, 15);
    } catch {
      // gebruiker niet geautoriseerd of fout → lege geschiedenis
    }

    return {
      allRecipes: response.recipes || [],
      history: historyEntries,
    };
  },
  component: RecipesMainPage,
});

type MealType = 'ontbijt' | 'lunch' | 'middagmaaltijd' | 'avondeten' | 'dessert';

function RecipesMainPage() {
  const { allRecipes, history } = Route.useLoaderData() as {
    allRecipes: any[];
    history: any[];
  };
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = allRecipes.filter(
    (r: any) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.nameNl && r.nameNl.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getByMealType = (type: string) => {
    const target = type.toLowerCase().trim();
    return allRecipes
      .filter((r: any) => {
        let cleanTypes: string[] = [];
        try {
          if (Array.isArray(r.mealTypes)) {
            cleanTypes = r.mealTypes;
          } else if (typeof r.mealTypes === 'string') {
            const parsed = JSON.parse(r.mealTypes);
            cleanTypes = Array.isArray(parsed) ? parsed : [String(parsed)];
          }
        } catch {
          cleanTypes = [String(r.mealTypes)];
        }
        const normalized = cleanTypes.map((t) => String(t).toLowerCase().trim());
        if (target === 'dessert') {
          return (
            normalized.includes('dessert') ||
            normalized.includes('snack') ||
            normalized.includes('snacks')
          );
        }
        return normalized.includes(target);
      })
      .slice(0, 15);
  };

  const rows: { id: MealType; title: string; icon: React.ReactNode; items: any[] }[] = [
    {
      id: 'ontbijt',
      title: 'Ontbijt',
      icon: <Coffee className="h-5 w-5 text-amber-500" />,
      items: getByMealType('ontbijt'),
    },
    {
      id: 'lunch',
      title: 'Lunch',
      icon: <Layers className="h-5 w-5 text-blue-500" />,
      items: getByMealType('lunch'),
    },
    {
      id: 'middagmaaltijd',
      title: 'Warme Middagmaaltijd',
      icon: <Sun className="h-5 w-5 text-orange-500" />,
      items: getByMealType('middagmaaltijd'),
    },
    {
      id: 'avondeten',
      title: 'Avondeten',
      icon: <Moon className="h-5 w-5 text-indigo-500" />,
      items: getByMealType('avondeten'),
    },
    {
      id: 'dessert',
      title: 'Snacks & Desserts',
      icon: <Cookie className="h-5 w-5 text-rose-500" />,
      items: getByMealType('dessert'),
    },
  ];

  return (
    <div className="relative p-6 max-w-7xl mx-auto space-y-12 mt-6 overflow-hidden bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      {/* Decoratieve bladeren */}
      <Leaf className="absolute -top-10 -left-10 w-40 h-40 text-[var(--primary-color)]/10 rotate-12 pointer-events-none" />
      <Leaf className="absolute -bottom-8 -right-8 w-36 h-36 text-[var(--primary-color)]/10 -rotate-12 pointer-events-none" />
      <Leaf className="absolute top-1/4 right-1/4 w-24 h-24 text-[var(--primary-color)]/10 rotate-45 pointer-events-none" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <Utensils className="h-8 w-8" />
            <span>Alle Recepten</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
            Ontdek de rijke smaken van de gezonde Surinaamse keuken.
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
          <span className="block text-3xl font-black leading-none">{allRecipes.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">Recepten</span>
        </div>
      </div>

      {/* Zoekbalk */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Zoek recepten (bijv. Pom, Roti, Moksi Alesi...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all text-[var(--text-color)]"
        />
      </div>

      {searchQuery ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Zoekresultaten ({filteredRecipes.length})</h2>
          {filteredRecipes.length === 0 ? (
            <div className="p-8 text-center bg-[var(--card-bg)] border border-dashed border-[var(--border-color)] rounded-2xl text-gray-400 text-sm">
              Geen recepten gevonden.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe: any) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {rows.map(
            (row) =>
              row.items.length > 0 && (
                <div key={row.id} className="space-y-4">
                  <div className="flex justify-between items-end border-b border-[var(--border-color)] pb-2">
                    <div className="flex items-center gap-2">
                      {row.icon}
                      <h2 className="text-xl font-bold">{row.title}</h2>
                    </div>
                    <Link
                      to="/dashboard/recipes/$category"
                      params={{ category: row.id }}
                      className="inline-flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors no-underline"
                    >
                      Bekijk alles <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-none">
                    {row.items.map((recipe: any) => (
                      <div key={recipe.id} className="min-w-[240px] md:min-w-[265px] max-w-[280px]">
                        <RecipeCard recipe={recipe} />
                      </div>
                    ))}
                  </div>
                </div>
              )
          )}

          {/* Onlangs Bekeken */}
          {history.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
                <History className="h-5 w-5 text-[var(--primary-color)]" />
                <h2 className="text-xl font-bold">Onlangs Bekeken</h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-none">
                {history.map((entry: any) => (
                  <div key={entry.historyId} className="min-w-[240px] md:min-w-[265px] max-w-[280px]">
                    <RecipeCard recipe={entry.recipe} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <Link
      to="/dashboard/recipes/view/$recipeId"
      params={{ recipeId: recipe.id }}
      className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden snap-start hover:shadow-md transition-all no-underline text-current flex flex-col justify-between group"
    >
      <div className="relative h-40 w-full bg-gray-50 dark:bg-slate-800 overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="inline-block text-[10px] font-bold text-[var(--primary-color)] uppercase bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded tracking-wider border border-teal-100 dark:border-teal-800/40">
            {recipe.category}
          </span>
          <h3 className="font-bold text-sm leading-snug line-clamp-2 text-[var(--text-color)]">
            {recipe.name}
          </h3>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-50 dark:border-slate-800/40">
          <span className="flex items-center gap-1 font-semibold">
            <MapPin className="h-3 w-3" />
            <span>{recipe.area || 'Algemeen'}</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="h-3 w-3" />
            <span>{recipe.calories ? `${recipe.calories} kcal` : '~30 min'}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}