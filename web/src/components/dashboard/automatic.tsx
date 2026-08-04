import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Shuffle,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  ChefHat,
  Coffee,
  Layers,
  Sun,
  Moon,
  Cookie,
} from 'lucide-react';

interface AutomaticPlannerPageProps {
  allRecipes: any[];
}

type MealType = 'ontbijt' | 'lunch' | 'middagmaaltijd' | 'avondeten' | 'dessert';

export default function AutomaticPlannerPage({
  allRecipes,
}: AutomaticPlannerPageProps) {
  const [selectedMenu, setSelectedMenu] = useState<
    Record<MealType, any | null>
  >({
    ontbijt: null,
    lunch: null,
    middagmaaltijd: null,
    avondeten: null,
    dessert: null,
  });

  const [lockedMeals, setLockedMenu] = useState<Record<MealType, boolean>>({
    ontbijt: false,
    lunch: false,
    middagmaaltijd: false,
    avondeten: false,
    dessert: false,
  });

  const getRandomRecipe = (type: MealType, excludeIds: string[] = []) => {
    const pool = allRecipes.filter(
      (recipe) =>
        recipe.mealTypes?.includes(type) && !excludeIds.includes(recipe.id)
    );
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const shuffleMenu = () => {
    setSelectedMenu((prev) => {
      const updated = { ...prev };
      const chosenIds: string[] = [];
      (Object.keys(lockedMeals) as MealType[]).forEach((type) => {
        if (lockedMeals[type] && prev[type]) chosenIds.push(prev[type].id);
      });
      (Object.keys(updated) as MealType[]).forEach((type) => {
        if (!lockedMeals[type]) {
          const freshPick = getRandomRecipe(type, chosenIds);
          if (freshPick) {
            updated[type] = freshPick;
            chosenIds.push(freshPick.id);
          }
        }
      });
      return updated;
    });
  };

  useEffect(() => {
    if (allRecipes.length > 0) shuffleMenu();
  }, [allRecipes]);

  const toggleLock = (type: MealType) => {
    setLockedMenu((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const mealConfig: Record<
    MealType,
    { label: string; icon: React.ReactNode }
  > = {
    ontbijt: { label: 'Ontbijt', icon: <Coffee className="h-4 w-4 text-amber-500" /> },
    lunch: { label: 'Lunch', icon: <Layers className="h-4 w-4 text-blue-500" /> },
    middagmaaltijd: {
      label: 'Middagmaaltijd',
      icon: <Sun className="h-4 w-4 text-orange-500" />,
    },
    avondeten: { label: 'Avondeten', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
    dessert: { label: 'Snack / Dessert', icon: <Cookie className="h-4 w-4 text-rose-500" /> },
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-amber-300 fill-amber-300" />
            Automatische Dagplanner
          </h1>
          <p className="text-white/90 text-sm font-medium max-w-xl leading-relaxed">
            Genereer direct een gebalanceerd Surinaams dagmenu afgestemd op
            uw medische condities. Behoud wat u lekker vindt en hussel de rest!
          </p>
        </div>
        <button
          type="button"
          onClick={shuffleMenu}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black px-5 py-3 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider shrink-0"
        >
          <Shuffle className="h-4 w-4" /> Menu Husselen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {(Object.keys(mealConfig) as MealType[]).map((type) => {
          const recipe = selectedMenu[type];
          const isLocked = lockedMeals[type];
          const config = mealConfig[type];
          return (
            <div
              key={type}
              className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all ${
                isLocked
                  ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/10 bg-teal-50/20'
                  : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  {config.icon}
                  <span>{config.label}</span>
                </span>
                <button
                  type="button"
                  onClick={() => toggleLock(type)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isLocked
                      ? 'bg-[var(--primary-color)] border-[var(--primary-color)] text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
                  }`}
                  title={isLocked ? 'Ontgrendelen' : 'Vastzetten in menu'}
                >
                  {isLocked ? (
                    <Lock className="h-3.5 w-3.5" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>

              {recipe ? (
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-32 object-cover rounded-xl shadow-inner bg-gray-50"
                    />
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug">
                      {recipe.name}
                    </h3>
                  </div>
                  <Link
                    to="/dashboard/recipes/view/$recipeId"
                    params={{ recipeId: recipe.id }}
                    className="inline-flex items-center justify-center gap-1 text-xs font-bold px-4 py-2 rounded-lg bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)] transition-colors no-underline mt-2"
                  >
                    Kook recept <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-14 text-gray-300 flex flex-col justify-center items-center h-full">
                  <ChefHat className="h-10 w-10 mb-2" />
                  <span className="text-xs font-medium text-gray-400">
                    Geen match
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}