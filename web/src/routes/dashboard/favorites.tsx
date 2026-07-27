// src/routes/dashboard/favorites.tsx
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { getFavoriteRecipes, toggleFavorite } from '../../server-functions/favorites';
import { useToast } from '#/hooks/use-toast';
import { Heart, ChefHat, Trash2, ArrowRight, MapPin } from 'lucide-react';

export const Route = (createFileRoute as any)('/dashboard/favorites')({
  // BACKEND SSR LOADER: Laad alle favoriete recepten inclusief de inner-joined receptdata direct in
  loader: async () => {
    const list = await getFavoriteRecipes();
    return { favoriteList: list || [] };
  },
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favoriteList } = Route.useLoaderData() as { favoriteList: any[] };
  const { toast } = useToast();
  const router = useRouter();

  // Actie: Snelkoppeling om een recept direct vanuit dit scherm te ontfavorieten
  const handleRemoveFavorite = async (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault(); // Voorkom dat de Link-klik naar de detailpagina afgaat
    e.stopPropagation();

    try {
      await toggleFavorite({ data: { recipeId } });
      toast({ title: 'Verwijderd uit favorieten', type: 'success' });
      
      // Forceert TanStack Start om de loaders opnieuw te draaien en de lijst live bij te werken
      router.invalidate(); 
    } catch (err) {
      toast({ title: 'Fout bij verwijderen', type: 'error' });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 mt-6">
      
      {/* Pagina Header Banner (Zonder Emoji's, Gecorrigeerde Hart-vulling) */}
      <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            {/* FIX: stroke-none weggehaald en fill-white gecorrigeerd voor een perfect rood/wit pulserend hart */}
            <Heart className="h-8 w-8 fill-white text-white animate-pulse" /> 
            <span>Mijn Favorieten</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
            Uw persoonlijke selectie van goedgekeurde Surinaamse gezonde recepten.
          </p>
        </div>
        <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
          <span className="block text-3xl font-black leading-none">{favoriteList.length}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">Opgeslagen</span>
        </div>
      </div>

      {/* Grid overzicht */}
      {favoriteList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <ChefHat className="h-14 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700">Nog geen favorieten</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto text-sm px-4">
            Klik op het hartje of de favoriet-knop op een receptpagina om uw favoriete gezonde Surinaamse gerechten hier te verzamelen.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {favoriteList.map((item: any) => {
            // Vang dynamisch op of je backend mapping { favoriteId, recipe } of rechtstreekse records retourneert
            const recipe = item.recipe || item;
            const keyId = item.favoriteId || item.id;

            if (!recipe) return null;

            return (
              <Link
                key={keyId}
                to="/dashboard/recipes/view/$recipeId" // FIX: Verwijst nu correct naar het herstelde subsegment
                params={{ recipeId: recipe.id }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:scale-[1.03] transition-all no-underline text-current group flex flex-col justify-between cursor-pointer"
              >
                <div className="relative h-44 w-full bg-gray-50 overflow-hidden">
                  <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Snelkoppeling Prullenbak Knop rechtsboven */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveFavorite(e, recipe.id)}
                    className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl shadow-sm transition-all focus:outline-none cursor-pointer"
                    title="Verwijderen uit favorieten"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

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
                    <span className="flex items-center gap-0.5 text-[#1A756A] font-bold group-hover:underline">
                      Koken <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
