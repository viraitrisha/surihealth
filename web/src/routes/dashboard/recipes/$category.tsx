// src/routes/dashboard/recipes/$category.tsx
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
  UtensilsCrossed 
} from 'lucide-react';

// Configuratie om database-id's te koppelen aan Nederlandse titels en Lucide-iconen
const CATEGORY_CONFIG: Record<string, { title: string; icon: React.ReactNode }> = {
  ontbijt: { title: 'Ontbijt Recepten', icon: <Coffee className="h-6 w-6 text-amber-500" /> },
  lunch: { title: 'Lunch Suggesties', icon: <Layers className="h-6 w-6 text-blue-500" /> },
  middagmaaltijd: { title: 'Warme Middagmaaltijden', icon: <Sun className="h-6 w-6 text-orange-500" /> },
  avondeten: { title: 'Heerlijk Avondeten', icon: <Moon className="h-6 w-6 text-indigo-500" /> },
  dessert: { title: 'Snacks & Desserts', icon: <Cookie className="h-6 w-6 text-rose-500" /> },
};

export const Route = (createFileRoute as any)('/dashboard/recipes/$category')({
  // BACKEND SSR DEEL: Haal alle recepten op die horen bij deze maaltijdcategorie
  loader: async ({ params }: { params: { category: string } }) => {
    const categoryId = params.category.toLowerCase();
    
    // We halen een ruime set op om alle gefilterde opties direct te kunnen tonen
    const response = await getRecipes({ data: { limit: 100 } });
    
    // Filter de recepten die dit specifieke maaltijdtype in hun array hebben staan
    const filteredRecipes = (response.recipes || []).filter((r: any) => 
      r.mealTypes?.includes(categoryId)
    );

    return { 
      category: categoryId,
      recipes: filteredRecipes 
    };
  },
  component: CategoryGridPage,
});

function CategoryGridPage() {
  const { category, recipes } = Route.useLoaderData() as { category: string; recipes: any[] };
  const config = CATEGORY_CONFIG[category] || { title: 'Recepten Overzicht', icon: <UtensilsCrossed className="h-6 w-6 text-teal-600" /> };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* --- BREADCRUMB / TERUGKNOP --- */}
      <div className="flex items-center gap-4">
        <Link 
          to="/dashboard/recipes"
          className="flex items-center gap-2 text-gray-500 hover:text-slate-800 font-bold transition-colors no-underline bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Terug naar overzicht
        </Link>
      </div>

      {/* --- TITLE BLOCK (Zonder Emoji's) --- */}
      <div className="bg-linear-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl border border-white/10 shadow-inner">
              {config.icon}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{config.title}</h1>
          </div>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
            Gefilterd op basis van uw Surinaamse markttoegankelijkheid en persoonlijke gezondheidsdoelen.
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-25">
          <span className="block text-3xl font-black leading-none">{recipes.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">Recepten</span>
        </div>
      </div>

      {/* --- GRID MET RECEPTEN --- */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <ChefHat className="h-14 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">Geen recepten gevonden</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto text-sm">
            Er zijn momenteel geen recepten in deze categorie die voldoen aan uw strikte allergie- of dieetrestricties.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recipes.map((recipe: any) => (
            <Link
              key={recipe.id}
              to="/dashboard/recipes/view/$recipeId"
              params={{ recipeId: recipe.id }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:scale-[1.03] transition-all no-underline text-current group flex flex-col justify-between cursor-pointer"
            >
              {/* Afbeelding met Top Pick badge */}
              <div className="relative h-44 w-full bg-gray-50 overflow-hidden">
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {recipe.isTopPick && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white font-black px-2.5 py-1 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3 fill-white" /> Top Pick
                  </div>
                )}
              </div>

              {/* Inhoud */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-[#1A756A] uppercase bg-teal-50 px-2 py-0.5 rounded tracking-wider">
                    {recipe.category}
                  </span>
                  <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-800 group-hover:text-[#1A756A] transition-colors pt-1">
                    {recipe.name}
                  </h3>
                </div>
                
                {/* Meta rij (Zonder Emoji's) */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <span>{recipe.area || 'Algemeen'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" /> 
                    <span>~30 min</span>
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
