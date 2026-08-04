import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { Star, Utensils, ArrowRight, RefreshCw } from 'lucide-react';
import { getTopPicks } from '../../server-functions/toppicks';

interface Recipe {
  id: string;
  name: string;
  nameNl?: string;
  category: string;
  mealTypes: string[];
  isTopPick: boolean;
  area?: string;
  instructions: string;
  instructionsNl?: string;
  imageUrl: string;
  calories?: number;
  ingredients: string[];
  ingredientsNl?: string[];
}

interface TopPicksResponse {
  success: boolean;
  topPicks: Recipe[];
  count: number;
}

interface TopPicksProps {
  limit?: number;
}

export default function TopPicks({ limit = 10 }: TopPicksProps) {
  const [topPicks, setTopPicks] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopPicks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = (await getTopPicks({ data: { limit } })) as TopPicksResponse;
      setTopPicks(result.topPicks || []);
    } catch (err: any) {
      setError(err.message || 'Fout bij laden van top picks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopPicks();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Fout bij laden van top picks: {error}</p>
        <button
          onClick={fetchTopPicks}
          className="mt-2 inline-flex items-center gap-1 bg-[var(--primary-color)] text-white px-4 py-2 rounded-lg hover:bg-[var(--secondary-color)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Probeer opnieuw
        </button>
      </div>
    );
  }

  if (topPicks.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-slate-800 rounded-xl">
        <Star className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[var(--text-color)]">
          Geen top picks beschikbaar
        </h3>
        <p className="text-gray-500 dark:text-slate-400 mt-2">
          Er zijn momenteel geen top picks voor jouw profiel.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
        <h1 className="text-3xl font-bold text-[var(--text-color)]">
          Top Picks
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {topPicks.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.nameNl || recipe.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-recipe.jpg';
                }}
              />
              <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> Top Pick
              </span>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold text-lg text-[var(--text-color)] line-clamp-1">
                {recipe.nameNl || recipe.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                <span>{recipe.category}</span>
                {recipe.area && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span>{recipe.area}</span>
                  </>
                )}
              </div>
              {recipe.calories && (
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-slate-400">
                  <Utensils className="w-4 h-4" />
                  <span>{recipe.calories} kcal</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-1">
                {recipe.mealTypes.slice(0, 2).map((type, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full"
                  >
                    {type}
                  </span>
                ))}
                {recipe.mealTypes.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{recipe.mealTypes.length - 2}
                  </span>
                )}
              </div>
              <Link
                to="/dashboard/recipes/view/$recipeId"
                params={{ recipeId: recipe.id }}
                className="inline-flex items-center justify-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors no-underline mt-auto"
              >
                Kook recept <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}