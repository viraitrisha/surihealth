import { createFileRoute, Link } from '@tanstack/react-router';
import { getRecipes } from '../../../server-functions/recipes';
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Sparkles,
  Coffee,
  Layers,
  Sun,
  Moon,
  Cookie,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { title: string; icon: React.ReactNode }> = {
  ontbijt: { title: 'Ontbijt Catalogus', icon: <Coffee className="h-6 w-6 text-amber-500" /> },
  lunch: { title: 'Lunch Assortiment', icon: <Layers className="h-6 w-6 text-blue-500" /> },
  middagmaaltijd: {
    title: 'Warme Middagmaaltijden',
    icon: <Sun className="h-6 w-6 text-orange-500" />,
  },
  avondeten: {
    title: 'Diner & Avondrecepten',
    icon: <Moon className="h-6 w-6 text-indigo-500" />,
  },
  dessert: { title: 'Snacks & Desserts', icon: <Cookie className="h-6 w-6 text-rose-500" /> },
};

export const Route = createFileRoute('/dashboard/recipes/$category')({
  loader: async ({ params }: { params: { category: string } }) => {
    const categoryId = params.category.toLowerCase().trim();
    const response = await getRecipes({ data: { limit: 250 } });

    const filteredRecipes = (response.recipes || []).filter((r: any) => {
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
      if (categoryId === 'dessert') {
        return (
          normalized.includes('dessert') ||
          normalized.includes('snack') ||
          normalized.includes('snacks')
        );
      }
      return normalized.includes(categoryId);
    });

    return { category: categoryId, recipes: filteredRecipes };
  },
  component: CategoryGridPage,
});

function CategoryGridPage() {
  const { category, recipes } = Route.useLoaderData() as { category: string; recipes: any[] };
  const config = CATEGORY_CONFIG[category] || {
    title: 'Recepten Database',
    icon: <UtensilsCrossed className="h-6 w-6 text-teal-600" />,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      {/* Back Button */}
      <Link
        to="/dashboard/recipes"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors no-underline"
      >
        <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
      </Link>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] p-8 rounded-3xl text-white shadow-md flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shadow-inner">
              {config.icon}
            </div>
            <h1 className="text-3xl font-black tracking-tight">{config.title}</h1>
          </div>
          <p className="text-white/80 text-xs font-medium max-w-xl leading-relaxed">
            Volledig database-overzicht van alle gerechten binnen deze kookcategorie.
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
          <span className="block text-3xl font-black leading-none">{recipes.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">Gerechten</span>
        </div>
      </div>

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-[var(--bg-color)] border border-dashed border-gray-200 dark:border-slate-700 rounded-3xl shadow-sm">
          <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold">Geen recepten geladen</h3>
          <p className="text-gray-400 mt-1 max-w-md mx-auto text-xs">
            Er bevinden zich momenteel geen gerechten onder dit maaltijdetiket.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recipes.map((recipe: any) => (
            <Link
              key={recipe.id}
              to="/dashboard/recipes/view/$recipeId"
              params={{ recipeId: recipe.id }}
              className="bg-[var(--bg-color)] border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all no-underline text-current flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full bg-gray-50 dark:bg-slate-800 overflow-hidden">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {recipe.isTopPick && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white font-black px-2.5 py-1 rounded-xl text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3 fill-white" /> Top Pick
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-bold text-[var(--primary-color)] uppercase bg-teal-50 dark:bg-teal-950/30 px-2 py-0.5 rounded tracking-wider border border-teal-100 dark:border-teal-800/40">
                    {recipe.category}
                  </span>
                  <h3 className="font-bold text-sm leading-snug line-clamp-2 text-[var(--text-color)]">
                    {recipe.name}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 pt-2 border-t border-gray-50 dark:border-slate-800/40">
                  <span className="flex items-center gap-1 font-semibold">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{recipe.area || 'Algemeen'}</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{recipe.calories ? `${recipe.calories} kcal` : '~30 min'}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}