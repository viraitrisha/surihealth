// src/routes/dashboard/recipes/index.tsx
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
  MapPin
} from 'lucide-react';

export const Route = (createFileRoute as any)('/dashboard/recipes')({
  loader: async () => {
    const response = await getRecipes({ data: { limit: 150 } });
    return { allRecipes: response.recipes || [] };
  },
  component: RecipesMainPage,
});

type MealType = 'ontbijt' | 'lunch' | 'middagmaaltijd' | 'avondeten' | 'dessert';

function RecipesMainPage() {
  const { allRecipes } = Route.useLoaderData() as { allRecipes: any[] };
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = allRecipes.filter((r: any) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.nameNl && r.nameNl.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const topPicks = allRecipes.filter((r: any) => r.isTopPick).slice(0, 15);
  const getByMealType = (type: string) => 
    allRecipes.filter((r: any) => r.mealTypes?.includes(type)).slice(0, 15);

  // Rij-configuratie met Lucide-iconen ter vervanging van de emoji's
  const rows: { id: MealType; title: string; icon: React.ReactNode; items: any[] }[] = [
    { id: 'ontbijt', title: 'Ontbijt', icon: <Coffee className="h-5 w-5 text-amber-500" />, items: getByMealType('ontbijt') },
    { id: 'lunch', title: 'Lunch', icon: <Layers className="h-5 w-5 text-blue-500" />, items: getByMealType('lunch') },
    { id: 'middagmaaltijd', title: 'Warme Middagmaaltijd', icon: <Sun className="h-5 w-5 text-orange-500" />, items: getByMealType('middagmaaltijd') },
    { id: 'avondeten', title: 'Avondeten', icon: <Moon className="h-5 w-5 text-indigo-500" />, items: getByMealType('avondeten') },
    { id: 'dessert', title: 'Snacks & Desserts', icon: <Cookie className="h-5 w-5 text-rose-500" />, items: getByMealType('dessert') },
  ];

  return (
    <div className="space-y-10 p-6 max-w-7xl mx-auto mt-6">
      
      {/* 1. Grote Zoekbalk */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Zoek naar recepten (bijv. Pom, Roti, Kip...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl shadow-sm text-base focus:ring-2 focus:ring-[#1A756A] focus:outline-none transition-all text-gray-900"
        />
      </div>

      {/* Grid voor de Zoekresultaten (Voorkomt overlappen) */}
      {searchQuery ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-800">
            Zoekresultaten ({filteredRecipes.length})
          </h2>
          {filteredRecipes.length === 0 ? (
            <p className="text-gray-400 text-sm">Geen recepten gevonden voor deze zoekopdracht.</p>
          ) : (
            // FIX: Maakt gebruik van een flexibel responsive grid dat overlapping fysiek onmogelijk maakt
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe: any) => (
                <RecipeCard key={recipe.id} recipe={recipe} isGridItem={true} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 2. Top Picks Rij */}
          {topPicks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-500 fill-amber-500 animate-pulse" />
                <h2 className="text-2xl font-black text-slate-800">Speciaal voor jou (Top Picks)</h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {topPicks.map((recipe: any) => (
                  <RecipeCard key={recipe.id} recipe={recipe} isGridItem={false} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Dynamische Maaltijd Rijen met 'Bekijk Alles' */}
          {rows.map((row) => row.items.length > 0 && (
            <div key={row.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  {row.icon}
                  <h2 className="text-xl font-black text-slate-800">{row.title}</h2>
                </div>
                <Link 
                  to="/dashboard/recipes/$category" 
                  params={{ category: row.id }}
                  className="flex items-center gap-0.5 text-xs font-bold text-[#1A756A] hover:underline no-underline"
                >
                  Bekijk alles <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              
              {/* Horizontale Scrollmatrix voor de startpagina */}
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-hide">
                {row.items.map((recipe: any) => (
                  <RecipeCard key={recipe.id} recipe={recipe} isGridItem={false} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// Geoptimaliseerd Kaart Component (Schakelt slim tussen Grid en Flex-row)
function RecipeCard({ recipe, isGridItem }: { recipe: any; isGridItem: boolean }) {
  return (
    <Link 
      to="/dashboard/recipes/view/$recipeId" 
      params={{ recipeId: recipe.id }}
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden snap-start hover:scale-[1.02] transition-all no-underline text-current group flex flex-col justify-between cursor-pointer ${
        isGridItem 
          ? 'w-full' // FIX: Vloeibare breedte in de grid-modus voorkomt dat kaarten over elkaar heen klappen!
          : 'min-w-[240px] md:min-w-[265px] max-w-[280px]' // Vaste breedte alleen in de horizontale scroll-rij
      }`}
    >
      <div className="relative h-40 w-full bg-gray-50 overflow-hidden">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-[#1A756A] uppercase bg-teal-50 px-2 py-0.5 rounded tracking-wider">
            {recipe.category}
          </span>
          <h3 className="font-bold text-sm leading-snug line-clamp-2 text-slate-800 group-hover:text-[#1A756A] transition-colors pt-1">
            {recipe.name}
          </h3>
        </div>
        
        {/* Onderkant metadata */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span>{recipe.area || 'Algemeen'}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            <span>~30 min</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
