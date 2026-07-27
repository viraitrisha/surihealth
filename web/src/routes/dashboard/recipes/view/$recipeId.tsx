// src/routes/dashboard/recipes/view/$recipeId.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { getRecipeById, getRecipes } from '../../../../server-functions/recipes';
import { toggleFavorite } from '../../../../server-functions/favorites';
import { addShoppingItem } from '../../../../server-functions/shopping';
import { useToast } from '#/hooks/use-toast';
import { ArrowLeft, Heart, ShoppingBasket, Loader2, ArrowRight, Sparkles, MapPin } from 'lucide-react';

export const Route = (createFileRoute as any)('/dashboard/recipes/view/$recipeId')({
  loader: async ({ params }: { params: { recipeId: string } }) => {
    const recipe = await getRecipeById({ data: { id: params.recipeId } });
    const listResponse = await getRecipes({ data: { limit: 200 } });
    
    const currentIngs = new Set(recipe.ingredients.map((i: string) => i.toLowerCase().trim()));
    
    const similar = listResponse.recipes
      .filter((r: any) => r.id !== recipe.id)
      .map((r: any) => {
        const matchingCount = r.ingredients.filter((i: string) => 
          currentIngs.has(i.toLowerCase().trim())
        ).length;
        return { ...r, matchingCount };
      })
      .filter((r: any) => r.matchingCount >= 3)
      .sort((a: any, b: any) => b.matchingCount - a.matchingCount)
      .slice(0, 5);

    return { recipe, similarRecipes: similar };
  },
  component: RecipeDetailPage,
});

function RecipeDetailPage() {
  const { recipe, similarRecipes } = Route.useLoaderData() as { recipe: any; similarRecipes: any[] };
  const { toast } = useToast();
  const router = useRouter();
  
  const [favLoading, setFavLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);

  // 🛡️ ONVERWOESTBARE FRONTEND STATE: Beheert de hart-kleuring direct en rotsvast in de browser
  const [isFavorite, setIsFavorite] = useState<boolean>(recipe?.isFavorite === true);

  const handleAddToShoppingList = async () => {
    setShopLoading(true);
    try {
      const ingredientsToBulkAdd = recipe.ingredientsNl || recipe.ingredients;
      
      for (const ing of ingredientsToBulkAdd) {
        await addShoppingItem({ data: { name: ing } });
      }

      toast({
        title: 'Toegevoegd aan lijst!',
        description: 'Alle ingrediënten zijn succesvol op uw boodschappenlijst geplaatst.',
        type: 'success',
      });
    } catch (err) {
      toast({ title: 'Fout', description: 'Kon ingrediënten niet opslaan.', type: 'error' });
    } finally {
      setShopLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    setFavLoading(true);
    
    // 1. Schakel de kleur en de tekst direct om in de browser-engine (geen flitsen of vertragingen!)
    const nextState = !isFavorite;
    setIsFavorite(nextState);

    try {
      // 2. Werk de database veilig bij op de achtergrond
      await toggleFavorite({ data: { recipeId: recipe.id } });
      
      toast({
        title: nextState ? 'Toegevoegd aan favorieten!' : 'Verwijderd uit favorieten',
        type: 'success',
      });
      
      // FIX: router.invalidate() is hier compleet verwijderd om overschrijving te blokkeren!
    } catch (err) {
      // Rollback de kleur mocht de server-verbinding onverhoopt falen
      setIsFavorite(!nextState);
      toast({ title: 'Fout', description: 'Actie mislukt.', type: 'error' });
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 mt-12">
      {/* Terugknop */}
      <button 
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-slate-800 font-bold transition-colors cursor-pointer bg-transparent border-none"
      >
        <ArrowLeft className="h-5 w-5" /> Terug naar overzicht
      </button>

      {/* Recept Header Plaat */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full md:w-80 h-64 object-cover rounded-2xl shadow-inner bg-gray-50" />
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-2">
            <span className="bg-teal-50 text-[#1A756A] font-extrabold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              {recipe.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{recipe.name}</h1>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-400" /> Keuken/Regio: {recipe.area}
            </p>
          </div>

          {/* Interactie Knoppen */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={handleAddToShoppingList}
              disabled={shopLoading}
              className="flex items-center gap-2 bg-[#1A756A] hover:bg-[#13574e] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer focus:outline-none"
            >
              {shopLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBasket className="h-4 w-4" />}
              Boodschappenlijst maken
            </button>
            
            {/* FIX: De knop-stijlen en het hart-icoon reageren nu direct en stabiel op de lokale state */}
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`flex items-center gap-2 border px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer focus:outline-none ${
                isFavorite 
                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' 
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart 
                className={`h-4 w-4 transition-all ${
                  favLoading ? 'animate-pulse' : ''
                } ${
                  isFavorite ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-400'
                }`} 
              />
              <span>{isFavorite ? 'Favoriet' : 'Favoriet'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ingrediënten en Bereidingswijze Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Ingrediënten</h2>
          <ul className="space-y-2">
            {(recipe.ingredientsNl || recipe.ingredients).map((ing: string, i: number) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-[#1A756A] font-bold mt-0.5">•</span>
                <span>{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Bereidingswijze</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
            {recipe.instructionsNl || recipe.instructions}
          </p>
        </div>
      </div>

      {/* Vergelijkbare recepten */}
      {similarRecipes.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <h2 className="text-2xl font-extrabold text-slate-800">Vergelijkbare recepten</h2>
          <p className="text-sm text-gray-400">Geselecteerd op basis van overeenkomstige Surinaamse basiselementen.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {similarRecipes.map((sim: any) => (
              <Link
                key={sim.id}
                to="/dashboard/recipes/view/$recipeId"
                params={{ recipeId: sim.id }}
                className="bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:scale-[1.03] transition-all no-underline text-current group block cursor-pointer"
              >
                <img src={sim.imageUrl} alt={sim.name} className="w-full h-28 object-cover rounded-xl mb-2 bg-gray-50" />
                <h4 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-[#1A756A] transition-colors">
                  {sim.name}
                </h4>
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mt-1.5">
                  <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span>{sim.matchingCount} dezelfde ingrediënten</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
