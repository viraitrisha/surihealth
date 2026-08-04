// src/routes/admin/recipes.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import {
  adminGetPlatformStats,
  adminCreateRecipe,
  adminUpdateRecipe,
  adminDeleteRecipe,
  adminToggleTopPick,
} from '../../server-functions/admin';
import { useToast } from '#/hooks/use-toast';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  Star,
  X,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Flame,
  BookOpen,
} from 'lucide-react';

export const Route = (createFileRoute as any)('/admin/recipes')({
  loader: async () => {
    try {
      const stats = await adminGetPlatformStats();
      return { stats };
    } catch (err) {
      throw new Error('Niet geautoriseerd');
    }
  },
  component: AdminRecipesPage,
});

function AdminRecipesPage() {
  const { stats } = Route.useLoaderData() as { stats: any };
  const { toast } = useToast();
  const router = useRouter();

  // Interface view & state matrices
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalOpenMode] = useState<'create' | 'edit'>('create');

  // Unified schema form states matching your exact schema.ts fields
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    nameNl: '',
    category: 'Kip',
    mealTypesString: 'Lunch, Avondeten',
    area: 'Surinaams',
    instructions: '',
    instructionsNl: '',
    imageUrl: '',
    calories: 350,
    ingredientsString: 'Kip, Knoflook, Ui',
    ingredientsNlString: 'Kip, Knoflook, Ui',
  });

  const categories = ['Kip', 'Rundvlees', 'Vis', 'Garnalen', 'Vegetarisch', 'Bijgerecht', 'Snack', 'Dessert'];

  // Filter out records based on real-time search parameters
  const filteredRecipes = (stats.allRecipes || []).filter((recipe: any) => {
    return (
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.area && recipe.area.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const totalFiltered = filteredRecipes.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRecipes = filteredRecipes.slice(startIndex, startIndex + itemsPerPage);

  // Trigger modal display state bindings
  const openCreateModal = () => {
    setFormState({
      id: '',
      name: '',
      nameNl: '',
      category: 'Kip',
      mealTypesString: 'Lunch, Avondeten',
      area: 'Surinaams',
      instructions: '',
      instructionsNl: '',
      imageUrl: '',
      calories: 350,
      ingredientsString: '',
      ingredientsNlString: '',
    });
    setModalOpenMode('create');
    setIsModalOpen(true);
  };

  const openEditModal = (recipe: any) => {
    setFormState({
      id: recipe.id,
      name: recipe.name,
      nameNl: recipe.nameNl || '',
      category: recipe.category,
      mealTypesString: (recipe.mealTypes || []).join(', '),
      area: recipe.area || 'Surinaams',
      instructions: recipe.instructions,
      instructionsNl: recipe.instructionsNl || '',
      imageUrl: recipe.imageUrl,
      calories: recipe.calories || 0,
      ingredientsString: (recipe.ingredients || []).join(', '),
      ingredientsNlString: (recipe.ingredientsNl || []).join(', '),
    });
    setModalOpenMode('edit');
    setIsModalOpen(true);
  };

  // CRUD Form Mutation Handlers
  const handleSaveRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingId('submit-btn');

    // Parse text area lines cleanly into string arrays before pushing to drizzle
    const cleanMealTypes = formState.mealTypesString.split(',').map((t) => t.trim()).filter(Boolean);
    const cleanIngredients = formState.ingredientsString.split(',').map((i) => i.trim()).filter(Boolean);
    const cleanIngredientsNl = formState.ingredientsNlString.split(',').map((i) => i.trim()).filter(Boolean);

    const payload = {
      name: formState.name,
      nameNl: formState.nameNl || undefined,
      category: formState.category,
      mealTypes: cleanMealTypes,
      area: formState.area || undefined,
      instructions: formState.instructions,
      instructionsNl: formState.instructionsNl || undefined,
      imageUrl: formState.imageUrl,
      calories: Number(formState.calories) || undefined,
      ingredients: cleanIngredients,
      ingredientsNl: cleanIngredientsNl.length ? cleanIngredientsNl : undefined,
    };

    try {
      if (modalMode === 'create') {
        await adminCreateRecipe({ data: payload });
        toast({ title: 'Recept succesvol toegevoegd', type: 'success' });
      } else {
        await adminUpdateRecipe({ data: { ...payload, id: formState.id } });
        toast({ title: 'Recept succesvol bijgewerkt', type: 'success' });
      }
      setIsModalOpen(false);
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij opslaan', description: err.message, type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!window.confirm('Weet u zeker dat u dit recept permanent wilt verwijderen uit PostgreSQL?')) return;
    setLoadingId(recipeId);
    try {
      await adminDeleteRecipe({ data: { recipeId } });
      toast({ title: 'Recept permanent verwijderd uit de database', type: 'success' });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij verwijderen', description: err.message, type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleTopPickClick = async (recipeId: string, currentStatus: boolean) => {
    setLoadingId(`top-${recipeId}`);
    try {
      await adminToggleTopPick({ data: { recipeId, isTopPick: !currentStatus } });
      toast({
        title: !currentStatus ? 'Toegevoegd aan Top Picks' : 'Verwijderd uit Top Picks',
        type: 'success',
      });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij wijzigen status', description: err.message, type: 'error' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar />

      <main className="flex-1 ml-72 p-10 pt-0 space-y-8 animate-in fade-in duration-200">
        <div className="h-6"></div>

        {/* CONTENT SUMMARY HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-5">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Receptenbeheer</h2>
            <p className="text-slate-500 mt-2">Voeg Surinaamse recepten toe, bewerk ingrediënten of wijzig maaltijd vlaggen.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#1A756A] hover:bg-[#13574e] text-white font-bold px-4 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider self-start sm:self-center cursor-pointer focus:outline-none transition-all"
          >
            <Plus className="w-4 h-4" /> Recept Toevoegen
          </button>
        </div>

        {/* REALTIME SEARCH MANAGEMENT COMPARTMENT */}
        <div className="bg-white border rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op receptnaam, categorie, afkomst..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1A756A] outline-none bg-gray-50 text-gray-900 transition-all font-medium"
            />
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 font-bold tracking-wide">
            {totalFiltered} van {stats.allRecipes?.length || 0} live recepten getoond
          </div>
        </div>

        {/* ADMINISTRATIVE LIFECYCLE MANAGEMENT GRID INTERFACE */}
        <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Receptafbeelding & Naam</th>
                  <th className="px-6 py-4">Categorie</th>
                  <th className="px-6 py-4">Maaltijdtypes</th>
                  <th className="px-6 py-4">Calorieën</th>
                  <th className="px-6 py-4 text-center">Top Pick</th>
                  <th className="px-6 py-4 text-center">Beheer Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {displayedRecipes.map((recipe: any) => (
                  <tr key={recipe.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-14 h-11 object-cover rounded-xl bg-gray-100 border shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-800 truncate max-w-[140px]">{recipe.name}</div>
                          <div className="text-xs text-gray-400">ID: {recipe.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {recipe.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="truncate block max-w-[140px]" title={(recipe.mealTypes || []).join(', ')}>
                        {(recipe.mealTypes || []).join(', ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">{recipe.calories ? `${recipe.calories} kcal` : 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleTopPickClick(recipe.id, recipe.isTopPick)}
                        disabled={loadingId === `top-${recipe.id}`}
                        className={`p-2 rounded-xl transition-all cursor-pointer focus:outline-none ${
                          recipe.isTopPick
                            ? 'text-amber-500 bg-amber-50 border border-amber-200'
                            : 'text-gray-300 hover:text-gray-500 bg-gray-50 border border-transparent'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${recipe.isTopPick ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingRecipe(recipe)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 rounded-xl cursor-pointer"
                          title="Bekijk details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(recipe)}
                          className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
                          title="Bewerk recept"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          disabled={loadingId === recipe.id}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-xl cursor-pointer disabled:opacity-30"
                          title="Verwijder recept"
                        >
                          {loadingId === recipe.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COMPACT INTERACTIVE PAGINATION COMPARTMENT CONTROL BAR */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Weergave {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalFiltered)} van {totalFiltered} recepten
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-20 text-gray-600 transition-all cursor-pointer focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-20 text-gray-600 transition-all cursor-pointer focus:outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ===============================================================
          MODAL SUBCOMPONENT BLUEPRINT 1: INLINE FILE READ PORTAL (READ)
          =============================================================== */}
      {viewingRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative">
            <button
              onClick={() => setViewingRecipe(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{viewingRecipe.name}</h2>
            {viewingRecipe.nameNl && <p className="text-sm text-slate-500 mb-4">NL: {viewingRecipe.nameNl}</p>}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <span className="font-semibold">Categorie:</span> {viewingRecipe.category}
              </div>
              <div>
                <span className="font-semibold">Maaltijdtypes:</span> {(viewingRecipe.mealTypes || []).join(', ')}
              </div>
              <div>
                <span className="font-semibold">Calorieën:</span> {viewingRecipe.calories || 'N/A'} kcal
              </div>
              <div>
                <span className="font-semibold">Afkomst:</span> {viewingRecipe.area || 'Onbekend'}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="font-semibold text-slate-700">Ingrediënten</h4>
              <p className="text-slate-600 bg-gray-50 p-3 rounded-xl">
                {(viewingRecipe.ingredients || []).join(', ')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700">Bereidingsinstructies</h4>
              <p className="text-slate-600 bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">
                {viewingRecipe.instructions}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===============================================================
          MODAL SUBCOMPONENT BLUEPRINT 2: MUTATION WRITE FORMS ENGINE
          =============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {modalMode === 'create' ? 'Nieuw Recept Invoeren' : 'Recept Specificaties Aanpassen'}
            </h2>
            <form onSubmit={handleSaveRecipe} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Receptnaam (EN)</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Nederlandse Vertaling (Naam)</label>
                <input
                  type="text"
                  value={formState.nameNl}
                  onChange={(e) => setFormState({ ...formState, nameNl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Database Categorie</label>
                <select
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Land van Herkomst / Area</label>
                <input
                  type="text"
                  value={formState.area}
                  onChange={(e) => setFormState({ ...formState, area: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Maaltijd Schakelaars (Gescheiden door komma's)</label>
                <input
                  type="text"
                  required
                  value={formState.mealTypesString}
                  onChange={(e) => setFormState({ ...formState, mealTypesString: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                  placeholder="Ontbijt, Lunch, Avondeten"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Calorieën (kcal)</label>
                <input
                  type="number"
                  value={formState.calories}
                  onChange={(e) => setFormState({ ...formState, calories: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Receptafbeelding Link (Image URL)</label>
                <input
                  type="url"
                  required
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                  placeholder="unsplash.com..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Ingrediënten Matrix (Komma gescheiden - EN)</label>
                <textarea
                  required
                  rows={3}
                  value={formState.ingredientsString}
                  onChange={(e) => setFormState({ ...formState, ingredientsString: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A] resize-none"
                  placeholder="Chicken, Garlic, Onion"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Ingrediënten Matrix (Komma gescheiden - NL)</label>
                <textarea
                  rows={3}
                  value={formState.ingredientsNlString}
                  onChange={(e) => setFormState({ ...formState, ingredientsNlString: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A] resize-none"
                  placeholder="Kip, Knoflook, Ui"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Kookinstructies & Bereidingsstappen (EN)</label>
                <textarea
                  required
                  rows={4}
                  value={formState.instructions}
                  onChange={(e) => setFormState({ ...formState, instructions: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Kookinstructies & Bereidingsstappen (NL)</label>
                <textarea
                  rows={4}
                  value={formState.instructionsNl}
                  onChange={(e) => setFormState({ ...formState, instructionsNl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 cursor-pointer focus:outline-none"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={loadingId === 'submit-btn'}
                  className="px-5 py-2.5 bg-[#1A756A] hover:bg-[#13574e] text-white rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  {loadingId === 'submit-btn' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {modalMode === 'create' ? 'Invoegen' : 'Wijzigingen Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}