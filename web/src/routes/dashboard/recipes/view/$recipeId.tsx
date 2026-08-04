import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { getRecipeById, getRecipes } from '../../../../server-functions/recipes';
import { toggleFavorite } from '../../../../server-functions/favorites';
import { addShoppingItem } from '../../../../server-functions/shopping';
import { useToast } from '#/hooks/use-toast';
import {
  ArrowLeft,
  Clock,
  Flame,
  MapPin,
  UtensilsCrossed,
  BookOpen,
  Heart,
  CheckCircle2,
  ShoppingBasket,
  Loader2,
  Sparkles,
  Leaf,
} from 'lucide-react';

export const Route = createFileRoute('/dashboard/recipes/view/$recipeId')({
  loader: async ({ params }: { params: { recipeId: string } }) => {
    const recipe = await getRecipeById({ data: { id: params.recipeId } });
    const listResponse = await getRecipes({ data: { limit: 200 } });

    const currentIngs = new Set(
      (recipe.ingredients || []).map((i: string) => i.toLowerCase().trim())
    );
    const similar = listResponse.recipes
      .filter((r: any) => r.id !== recipe.id)
      .map((r: any) => {
        const matchingCount = (r.ingredients || []).filter((i: string) =>
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
  const { recipe, similarRecipes } = Route.useLoaderData() as {
    recipe: any;
    similarRecipes: any[];
  };
  const { toast } = useToast();

  const [favLoading, setFavLoading] = useState(false);
  const [shopLoading, setShopLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(recipe?.isFavorite === true);

  const handleAddToShoppingList = async () => {
    setShopLoading(true);
    try {
      const ingredients = recipe.ingredientsNl || recipe.ingredients || [];
      for (const ing of ingredients) {
        await addShoppingItem({ data: { name: ing } });
      }
      toast({
        title: 'Toegevoegd aan lijst!',
        description: 'Alle ingrediënten staan op uw boodschappenlijst.',
        type: 'success',
      });
    } catch {
      toast({ title: 'Fout', description: 'Kon ingrediënten niet opslaan.', type: 'error' });
    } finally {
      setShopLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    setFavLoading(true);
    const nextState = !isFavorite;
    setIsFavorite(nextState);
    try {
      await toggleFavorite({ data: { recipeId: recipe.id } });
      toast({
        title: nextState ? 'Toegevoegd aan favorieten!' : 'Verwijderd uit favorieten',
        type: 'success',
      });
    } catch {
      setIsFavorite(!nextState);
      toast({ title: 'Fout', description: 'Actie mislukt.', type: 'error' });
    } finally {
      setFavLoading(false);
    }
  };

  const instructionSteps =
    (recipe.instructionsNl || recipe.instructions)
      ?.split('\n')
      .filter((step: string) => step.trim().length > 0) || [];

  return (
    <div className="relative max-w-5xl mx-auto p-4 sm:p-8 space-y-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
      {/* Decorative leaves (subtle background art) */}
      <Leaf className="absolute top-0 left-0 w-24 h-24 text-[var(--primary-color)]/10 -rotate-12 pointer-events-none" />
      <Leaf className="absolute bottom-10 right-0 w-32 h-32 text-[var(--primary-color)]/10 rotate-45 pointer-events-none" />
      <Leaf className="absolute top-1/4 right-1/4 w-16 h-16 text-[var(--primary-color)]/5 -rotate-45 pointer-events-none" />

      {/* Top Terugknop */}
      <div className="flex items-center justify-between relative z-10">
        <Link
          to="/dashboard/recipes"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary-color)] hover:text-[var(--secondary-color)] no-underline transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
        </Link>
      </div>

      {/* DETAILELEMENTEN HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
        {/* Receptenafbeelding */}
        <div className="md:col-span-5 rounded-3xl overflow-hidden shadow-sm border border-[var(--border-color)] bg-[var(--card-bg)]">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="w-full h-64 md:h-80 object-cover shadow-inner"
          />
        </div>

        {/* Kerngegevens & Knoppen */}
        <div className="md:col-span-7 space-y-5 flex flex-col justify-between h-full">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 dark:bg-teal-950/30 text-[var(--primary-color)] rounded-xl text-xs font-black uppercase tracking-wider border border-teal-100/30">
              {recipe.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-color)] leading-tight">
              {recipe.nameNl || recipe.name}
            </h1>
            {recipe.nameNl && (
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold italic">
                Origineel: {recipe.name}
              </p>
            )}
          </div>

          {/* DYNAMISCHE CALORIEËNBALK – labels in primary kleur */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 border border-[var(--border-color)]/40 rounded-2xl">
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <Flame className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-wide">
                Energie
              </span>
              <strong className="text-base font-black text-[var(--text-color)] mt-0.5">
                {recipe.calories} kcal
              </strong>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center border-x border-[var(--border-color)]/60">
              <MapPin className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-wide">
                Regio
              </span>
              <strong className="text-sm font-black text-[var(--text-color)] mt-1">
                {recipe.area || 'Surinaams'}
              </strong>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <Clock className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-[10px] font-bold text-[var(--primary-color)] uppercase tracking-wide">
                Kooktijd
              </span>
              <strong className="text-sm font-black text-[var(--text-color)] mt-1">
                ~35 min
              </strong>
            </div>
          </div>

          {/* Interactieve Actieknoppen */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleAddToShoppingList}
              disabled={shopLoading}
              className="flex items-center gap-2 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50 cursor-pointer focus:outline-none"
            >
              {shopLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShoppingBasket className="h-4 w-4" />
              )}
              <span>Boodschappenlijst maken</span>
            </button>
            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`flex items-center gap-2 border px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer focus:outline-none ${
                isFavorite
                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-all ${
                  favLoading ? 'animate-pulse' : ''
                } ${isFavorite ? 'fill-red-600 text-red-600 scale-110' : 'text-gray-400'}`}
              />
              <span>{isFavorite ? 'Favoriet' : 'Favoriet maken'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* INGREDIËNTEN EN INSTRUCTIES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-gray-100 dark:border-slate-800/60 relative z-10">
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-base font-black text-[var(--text-color)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
            <BookOpen className="w-4 h-4 text-[var(--primary-color)]" /> Ingrediënten
          </h3>
          <ul className="space-y-2">
            {(
              (recipe.ingredientsNl && recipe.ingredientsNl.length > 0
                ? recipe.ingredientsNl
                : recipe.ingredients) || []
            ).map((ing: string, idx: number) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-[var(--border-color)] text-xs font-bold text-[var(--text-color)] transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="capitalize">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-8 space-y-4">
          <h3 className="text-base font-black text-[var(--text-color)] uppercase tracking-wider flex items-center gap-2 border-b border-[var(--border-color)] pb-2">
            <UtensilsCrossed className="w-4 h-4 text-[var(--primary-color)]" /> Bereidingswijze
          </h3>
          {/* Alle stappen in één kaart, zonder nummers */}
          <div className="p-6 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-sm">
            {instructionSteps.map((step: string, idx: number) => (
              <p
                key={idx}
                className="text-sm leading-relaxed text-[var(--text-color)] mb-3 last:mb-0"
              >
                {step}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* VERGELIJKBARE RECEPTEN */}
      {similarRecipes.length > 0 && (
        <div className="pt-6 border-t border-gray-100 dark:border-slate-800/60 relative z-10">
          <h3 className="text-base font-black text-[var(--text-color)] uppercase tracking-wider flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Vergelijkbare Recepten
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Op basis van overlappende basiselementen en ingrediënten.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {similarRecipes.map((sim: any) => (
              <Link
                key={sim.id}
                to="/dashboard/recipes/view/$recipeId"
                params={{ recipeId: sim.id }}
                className="group block bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={sim.imageUrl}
                  alt={sim.name}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3">
                  <p className="text-xs font-bold text-[var(--text-color)] truncate">
                    {sim.nameNl || sim.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold mt-1">
                    {sim.matchingCount} overeenkomende ingrediënten
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}