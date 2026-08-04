import { createFileRoute, Link } from '@tanstack/react-router';
import { getRecipes } from '../../server-functions/recipes';
import {
  Coffee,
  Layers,
  Sun,
  Moon,
  Cookie,
  ArrowLeft,
  ArrowRight,
  Utensils,
} from 'lucide-react';

type CategorySearch = { mealType: string };

export const Route = createFileRoute('/dashboard/category')({
  validateSearch: (search: Record<string, unknown>): CategorySearch => ({
    mealType: (search.mealType as string) || 'lunch',
  }),
  loader: async (ctx: any) => {
    try {
      const currentMealQuery = ctx.search?.mealType || 'lunch';
      const response = await getRecipes({
        data: { mealType: currentMealQuery, limit: 250 },
      });
      return {
        categoryRecipes: response.recipes || [],
        selectedType: currentMealQuery,
      };
    } catch {
      return { categoryRecipes: [], selectedType: 'lunch' };
    }
  },
  component: CategoryRecipesPage,
});

function CategoryRecipesPage() {
  const { categoryRecipes, selectedType } = Route.useLoaderData();
  const targetType = selectedType.toLowerCase().trim();

  const dynamicCategoryRecipes = categoryRecipes.filter((recipe: any) => {
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
    if (targetType === 'dessert') {
      return (
        normalizedTypes.includes('dessert') ||
        normalizedTypes.includes('snack') ||
        normalizedTypes.includes('snacks')
      );
    }
    return normalizedTypes.includes(targetType);
  });

  const getHeaderDetails = () => {
    switch (targetType) {
      case 'ontbijt':
        return {
          title: 'Mijn Gefilterde Ontbijtopties',
          icon: <Coffee className="h-8 w-8 text-amber-500" />,
        };
      case 'lunch':
        return {
          title: 'Mijn Gefilterde Lunchgerechten',
          icon: <Layers className="h-8 w-8 text-blue-500" />,
        };
      case 'middagmaaltijd':
        return {
          title: 'Mijn Gefilterde Middagmaaltijden',
          icon: <Sun className="h-8 w-8 text-orange-500" />,
        };
      case 'avondeten':
        return {
          title: 'Mijn Gefilterde Avondmaaltijden',
          icon: <Moon className="h-8 w-8 text-indigo-500" />,
        };
      case 'dessert':
        return {
          title: 'Mijn Gefilterde Snacks & Desserts',
          icon: <Cookie className="h-8 w-8 text-rose-500" />,
        };
      default:
        return {
          title: 'Gefilterde Recepten',
          icon: <Utensils className="h-8 w-8 text-[var(--primary-color)]" />,
        };
    }
  };

  const header = getHeaderDetails();

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors no-underline"
      >
        <ArrowLeft className="w-4 h-4" /> Terug naar dashboard
      </Link>

      <section className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner shrink-0">
          {header.icon}
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            {header.title}
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">
            Alle Surinaamse kookplannen die 100% veilig zijn bevonden voor
            jouw actieve gezondheidsprofiel.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dynamicCategoryRecipes.map((recipe: any) => (
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
                Bekijk recept <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}

        {dynamicCategoryRecipes.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 font-medium bg-[var(--card-bg)] border rounded-3xl border-dashed">
            Geen gerechten gevonden voor deze categorie die matchen met uw
            actieve dieetbeperkingen.
          </div>
        )}
      </div>
    </div>
  );
}