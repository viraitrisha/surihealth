import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { getRecipes } from '../../../server-functions/recipes';
import {
  Search,
  ChevronRight,
  Sparkles,
  Clock,
  Coffee,
  Layers,
  Sun,
  Moon,
  Cookie,
  MapPin,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard/recipes/')({
  loader: async () => {
    const response = await getRecipes({ data: { limit: 500 } });
    return { allRecipes: response.recipes || [] };
  },
  component: RecipesMainPage,
});

type MealType = 'ontbijt' | 'lunch' | 'middagmaaltijd' | 'avondeten' | 'dessert';

function RecipesMainPage() {
  const { allRecipes } = Route.useLoaderData() as { allRecipes: any[] };
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
    <div className="space-y-12 p-6 max-w-7xl mx-auto mt-6 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Zoek recepten (bijv. Pom, Roti, Moksi Alesi...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-[var(--bg-color)] border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all text-[var(--text-color)]"
        />
      </div>

      {searchQuery ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Zoekresultaten ({filteredRecipes.length})</h2>
          {filteredRecipes.length === 0 ? (
            <div className="p-8 text-center bg-[var(--bg-color)] border border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-400 text-sm">
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

          {/* Category Rows */}
          {rows.map(
            (row) =>
              row.items.length > 0 && (
                <div key={row.id} className="space-y-4">
                  <div className="flex justify-between items-end border-b border-gray-100 dark:border-slate-800 pb-2">
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
      className="bg-[var(--bg-color)] border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden snap-start hover:shadow-md transition-all no-underline text-current flex flex-col justify-between group"
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