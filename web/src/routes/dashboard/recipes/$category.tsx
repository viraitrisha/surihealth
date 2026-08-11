import { createFileRoute, Link } from '@tanstack/react-router';
import { getRecipes } from '../../../server-functions/recipes';
import {
  UtensilsCrossed,
  ArrowLeft,
  Coffee,
  Layers,
  Sun,
  Moon,
  Cookie,
  MapPin,
  Clock,
  Leaf,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode; title: string }> = {
  ontbijt: { icon: <Coffee className="h-6 w-6 text-amber-500" />, title: 'Ontbijt' },
  lunch: { icon: <Layers className="h-6 w-6 text-blue-500" />, title: 'Lunch' },
  middagmaaltijd: {
    icon: <Sun className="h-6 w-6 text-orange-500" />,
    title: 'Warme Middagmaaltijd',
  },
  avondeten: { icon: <Moon className="h-6 w-6 text-indigo-500" />, title: 'Avondeten' },
  snack: { icon: <Cookie className="h-6 w-6 text-rose-500" />, title: 'Snacks & Desserts' },
  snacks: { icon: <Cookie className="h-6 w-6 text-rose-500" />, title: 'Snacks & Desserts' },
  dessert: { icon: <Cookie className="h-6 w-6 text-rose-500" />, title: 'Snacks & Desserts' },
  default: {
    icon: <UtensilsCrossed className="h-6 w-6 text-teal-600" />,
    title: 'Recepten',
  },
};

export const Route = (createFileRoute as any)('/dashboard/recipes/$category')({
  loader: async ({ params }: { params: { category: string } }) => {
    const rawParam = params.category.toLowerCase().trim();
    const knownMealTypes = [
      'ontbijt',
      'lunch',
      'middagmaaltijd',
      'avondeten',
      'snack',
      'snacks',
      'dessert',
    ];

    let filterPayload: {
      category?: string;
      mealType?: string;
      all: boolean;
      limit: number;
    } = {
      all: true,
      limit: 500,
    };

    if (knownMealTypes.includes(rawParam)) {
      filterPayload.mealType = rawParam;
    } else {
      filterPayload.category =
        rawParam.charAt(0).toUpperCase() + rawParam.slice(1);
    }

    const response = await getRecipes({ data: filterPayload });

    const displayName = filterPayload.mealType
      ? CATEGORY_ICONS[filterPayload.mealType]?.title || filterPayload.mealType
      : filterPayload.category || 'Recepten';

    return {
      recipes: response.recipes,
      displayName,
      totalCount: response.pagination.total,
      paramValue: filterPayload.mealType || filterPayload.category,
    };
  },
  component: GeneralCategoryPage,
});

function GeneralCategoryPage() {
  const { recipes, displayName, paramValue } = Route.useLoaderData() as {
    recipes: any[];
    displayName: string;
    totalCount: number;
    paramValue: string;
  };

  const config =
    CATEGORY_ICONS[paramValue?.toLowerCase()] || CATEGORY_ICONS.default;

  return (
    <div className="relative p-6 max-w-7xl mx-auto space-y-8 overflow-hidden bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      {/* Decoratieve bladeren */}
      <Leaf className="absolute -top-10 -left-10 w-40 h-40 text-[var(--primary-color)]/10 rotate-12 pointer-events-none" />
      <Leaf className="absolute -bottom-8 -right-8 w-36 h-36 text-[var(--primary-color)]/10 -rotate-12 pointer-events-none" />
      <Leaf className="absolute top-1/4 right-1/4 w-24 h-24 text-[var(--primary-color)]/10 rotate-45 pointer-events-none" />

      {/* Terugknop */}
      <Link
        to="/dashboard/recipes"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors no-underline relative z-10"
      >
        <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
      </Link>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <span className="shrink-0">{config.icon}</span>
            <span>{displayName}</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
            Volledig database-overzicht van alle gerechten binnen deze categorie.
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
          <span className="block text-3xl font-black leading-none">
            {recipes.length}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">
            Recepten
          </span>
        </div>
      </div>

      {/* Recepten Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card-bg)] border border-dashed border-[var(--border-color)] rounded-3xl shadow-sm relative z-10">
          <UtensilsCrossed className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold">Geen recepten gevonden</h3>
          <p className="text-gray-400 mt-1 max-w-md mx-auto text-xs">
            Er zijn momenteel geen gerechten beschikbaar voor {displayName} in de database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
          {recipes.map((recipe: any) => (
            <Link
              key={recipe.id}
              to="/dashboard/recipes/view/$recipeId"
              params={{ recipeId: recipe.id }}
              className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all no-underline text-current flex flex-col justify-between group"
            >
              <div className="relative h-44 w-full bg-gray-50 dark:bg-slate-800 overflow-hidden">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="w-8 h-8 text-gray-400" />
                  </div>
                )}
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
                    <span>
                      {recipe.calories ? `${recipe.calories} kcal` : '~30 min'}
                    </span>
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