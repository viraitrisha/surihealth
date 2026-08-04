import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getRecipes } from '../../server-functions/recipes';
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
  Cookie 
} from 'lucide-react';

export const Route = (createFileRoute as any)('/dashboard/automatic')({
  loader: async () => {
    try {
      const response = await getRecipes({ data: { limit: 250 } });
      return { allRecipes: response.recipes || [] };
    } catch (err) {
      return { allRecipes: [] };
    }
  },
  component: AutomaticPlannerPage,
});

type MealType = 'ontbijt' | 'lunch' | 'middagmaaltijd' | 'avondeten' | 'dessert';

function AutomaticPlannerPage() {
  const { allRecipes } = Route.useLoaderData() as { allRecipes: any[] };

  const [selectedMenu, setSelectedMenu] = useState<Record<MealType, any | null>>({
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
    const pool = allRecipes.filter(r => 
      r.mealTypes?.includes(type) && !excludeIds.includes(r.id)
    );
    if (pool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };

  const shuffleMenu = () => {
    setSelectedMenu(prev => {
      const updated = { ...prev };
      const chosenIds: string[] = [];

      (Object.keys(lockedMeals) as MealType[]).forEach(type => {
        if (lockedMeals[type] && prev[type]) {
          chosenIds.push(prev[type].id);
        }
      });

      (Object.keys(updated) as MealType[]).forEach(type => {
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
    if (allRecipes.length > 0) {
      shuffleMenu();
    }
  }, [allRecipes]);

  const toggleLock = (type: MealType) => {
    setLockedMenu(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Iconen mapping ter vervanging van de emoji's
  const mealConfig: Record<MealType, { label: string; icon: React.ReactNode }> = {
    ontbijt: { label: 'Ontbijt', icon: <Coffee className="h-4 w-4 text-amber-500" /> },
    lunch: { label: 'Lunch', icon: <Layers className="h-4 w-4 text-blue-500" /> },
    middagmaaltijd: { label: 'Middagmaaltijd', icon: <Sun className="h-4 w-4 text-orange-500" /> },
    avondeten: { label: 'Avondeten', icon: <Moon className="h-4 w-4 text-indigo-500" /> },
    dessert: { label: 'Snack / Dessert', icon: <Cookie className="h-4 w-4 text-rose-500" /> },
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-amber-300 fill-amber-300" /> Automatische Dagplanner
          </h1>
          <p className="text-white/90 text-sm md:text-base font-medium max-w-xl">
            Genereer direct een gebalanceerd Surinaams dagmenu afgestemd op uw medische condities. Behou wat u lekker vindt en hussel de rest!
          </p>
        </div>
        
        <button
          type="button"
          onClick={shuffleMenu}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black px-6 py-4 rounded-2xl shadow-md transition-all text-base shrink-0 active:scale-95 cursor-pointer focus:outline-none"
        >
          <Shuffle className="h-5 w-5" /> Menu Husselen
        </button>
      </div>

      {/* Grid Matrix met de 5 Maaltijden */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(Object.keys(mealConfig) as MealType[]).map(type => {
          const recipe = selectedMenu[type];
          const isLocked = lockedMeals[type];
          const config = mealConfig[type];

          return (
            <div 
              key={type} 
              className={`bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
                isLocked ? 'border-[#1A756A] ring-2 ring-[#1A756A]/10 bg-teal-50/20' : 'border-gray-100'
              }`}
            >
              {/* Bovenkant: Icon + Label + Slotje */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  {config.icon}
                  <span>{config.label}</span>
                </span>
                
                <button
                  type="button"
                  onClick={() => toggleLock(type)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none ${
                    isLocked 
                      ? 'bg-[#1A756A] border-[#1A756A] text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
                  }`}
                  title={isLocked ? 'Ontgrendelen' : 'Vastzetten in menu'}
                >
                  {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Midden: Receptinhoud */}
              {recipe ? (
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <img 
                      src={recipe.imageUrl} 
                      alt={recipe.name} 
                      className="w-full h-28 object-cover rounded-xl shadow-inner bg-gray-50" 
                    />
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug">
                      {recipe.name}
                    </h3>
                  </div>

                  {/* Onderkant: Gecorrigeerde link naar de detailpagina */}
                  <div className="pt-2 border-t border-gray-50 mt-auto">
                    <Link
                      to="/dashboard/recipes/view/$recipeId"
                      params={{ recipeId: recipe.id }} // FIX: Gekoppeld aan de exacte hoofdlettergevoelige route-id van de router
                      className="w-full flex items-center justify-between text-xs font-bold text-[#1A756A] hover:underline no-underline"
                    >
                      <span>Kook recept</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-300 flex flex-col justify-center items-center h-full">
                  <ChefHat className="h-8 w-8 mb-2" />
                  <span className="text-xs font-medium text-gray-400">Geen match</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
