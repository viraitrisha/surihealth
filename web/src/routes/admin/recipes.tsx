import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import {
  adminGetPlatformStats,
  adminCreateRecipe,
  adminUpdateRecipe,
  adminDeleteRecipe,
  adminToggleTopPick,
} from '../../server-functions/admin';
import { useToast } from '#/hooks/use-toast';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import { estimateRecipeCalories } from '../../utils/calorieCalculator';
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
  Filter,
  Leaf,
  ChefHat,
  Flame,
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

  const [searchQuery, setSearchQuery] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalOpenMode] = useState<'create' | 'edit'>('create');

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
    calories: 150,
    ingredientsString: '',
    ingredientsNlString: '',
  });

  const categories = [
    'Kip',
    'Rundvlees',
    'Vis',
    'Garnalen',
    'Vegetarisch',
    'Bijgerecht',
    'Snack',
    'Dessert',
  ];

  // LIVE CALORIE AUTOMATION
  useEffect(() => {
    if (!isModalOpen) return;
    const cleanTokens = [
      ...formState.ingredientsString.split(','),
      ...formState.ingredientsNlString.split(','),
    ]
      .map((i) => i.trim())
      .filter(Boolean);
    if (cleanTokens.length > 0) {
      const targetCalculatedKcal = estimateRecipeCalories(cleanTokens);
      setFormState((prev) => ({ ...prev, calories: targetCalculatedKcal }));
    }
  }, [formState.ingredientsString, formState.ingredientsNlString, isModalOpen]);

  // Unieke maaltijdtypes verzamelen
  const allMealTypes = useMemo(() => {
    const types = new Set<string>();
    (stats.allRecipes || []).forEach((recipe: any) => {
      (recipe.mealTypes || []).forEach((t: string) => types.add(t.trim()));
    });
    return Array.from(types).sort();
  }, [stats.allRecipes]);

  // Filtering + reset pagina
  const filteredRecipes = useMemo(() => {
    let list = (stats.allRecipes || []).filter((recipe: any) => {
      return (
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.area && recipe.area.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    if (mealTypeFilter) {
      list = list.filter((recipe: any) =>
        (recipe.mealTypes || []).some(
          (t: string) => t.toLowerCase().trim() === mealTypeFilter.toLowerCase()
        )
      );
    }
    return list;
  }, [stats.allRecipes, searchQuery, mealTypeFilter]);

  const totalFiltered = filteredRecipes.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedRecipes = filteredRecipes.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, mealTypeFilter]);

  // ---- Acties behouden zoals voorheen ----
  const openCreateModal = () => { /* ... hetzelfde */ 
    setFormState({
      id: '', name: '', nameNl: '', category: 'Kip', mealTypesString: 'Lunch, Avondeten', area: 'Surinaams',
      instructions: '', instructionsNl: '', imageUrl: '', calories: 120, ingredientsString: '', ingredientsNlString: ''
    });
    setModalOpenMode('create'); setIsModalOpen(true);
  };

  const openEditModal = (recipe: any) => {
    const rawTokens = [...(recipe.ingredients || []), ...(recipe.ingredientsNl || [])];
    setFormState({
      id: recipe.id, name: recipe.name, nameNl: recipe.nameNl || '', category: recipe.category,
      mealTypesString: (recipe.mealTypes || []).join(', '), area: recipe.area || 'Surinaams',
      instructions: recipe.instructions, instructionsNl: recipe.instructionsNl || '',
      imageUrl: recipe.imageUrl,
      calories: recipe.calories && recipe.calories > 0 ? recipe.calories : estimateRecipeCalories(rawTokens),
      ingredientsString: (recipe.ingredients || []).join(', '), ingredientsNlString: (recipe.ingredientsNl || []).join(', '),
    });
    setModalOpenMode('edit'); setIsModalOpen(true);
  };

  const handleSaveRecipe = async (e: React.FormEvent) => { /* ... hetzelfde */
    e.preventDefault(); setLoadingId('submit-btn');
    const cleanMealTypes = formState.mealTypesString.split(',').map(t => t.trim()).filter(Boolean);
    const cleanIngredients = formState.ingredientsString.split(',').map(i => i.trim()).filter(Boolean);
    const cleanIngredientsNl = formState.ingredientsNlString.split(',').map(i => i.trim()).filter(Boolean);
    const payload = {
      name: formState.name, nameNl: formState.nameNl || undefined, category: formState.category,
      mealTypes: cleanMealTypes, area: formState.area || undefined, instructions: formState.instructions,
      instructionsNl: formState.instructionsNl || undefined, imageUrl: formState.imageUrl,
      calories: Number(formState.calories) || undefined, ingredients: cleanIngredients,
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
      setIsModalOpen(false); router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij opslaan', description: err.message, type: 'error' });
    } finally { setLoadingId(null); }
  };

  const handleDeleteRecipe = async (recipeId: string) => { /* ... hetzelfde */
    if (!window.confirm('Weet u zeker dat u dit recept permanent wilt verwijderen uit de database?')) return;
    setLoadingId(recipeId);
    try {
      await adminDeleteRecipe({ data: { recipeId } });
      toast({ title: 'Recept permanent verwijderd uit de database', type: 'success' });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij verwijderen', description: err.message, type: 'error' });
    } finally { setLoadingId(null); }
  };

  const handleToggleTopPickClick = async (recipeId: string, currentStatus: boolean) => { /* ... hetzelfde */
    setLoadingId(`top-${recipeId}`);
    try {
      await adminToggleTopPick({ data: { recipeId, isTopPick: !currentStatus } });
      toast({ title: !currentStatus ? 'Toegevoegd aan Top Picks' : 'Verwijderd uit Top Picks', type: 'success' });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij wijzigen status', description: err.message, type: 'error' });
    } finally { setLoadingId(null); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-72 p-10 pt-0 space-y-8 relative overflow-hidden">
        {/* Decoratieve bladeren */}
        <Leaf className="absolute -top-10 -left-10 w-40 h-40 text-[#1A756A]/10 rotate-12 pointer-events-none" />
        <Leaf className="absolute -bottom-8 -right-8 w-36 h-36 text-[#1A756A]/10 -rotate-12 pointer-events-none" />
        <Leaf className="absolute top-1/4 right-1/4 w-24 h-24 text-[#1A756A]/10 rotate-45 pointer-events-none" />

        <div className="h-6"></div>

        {/* GRADIENT BANNER */}
        <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
              <ChefHat className="h-8 w-8" />
              <span>Receptenbeheer</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
              Beheer de volledige Surinaamse receptendatabase. Voeg toe, bewerk of markeer als Top Pick.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
              <span className="block text-3xl font-black leading-none">{stats.allRecipes?.length || 0}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">Recepten</span>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-white text-[#1A756A] font-bold px-4 py-2.5 rounded-xl shadow-md text-xs uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Recept Toevoegen
            </button>
          </div>
        </div>

        {/* ZOEK & FILTER BALK */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam, categorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1A756A] outline-none bg-gray-50 text-gray-900 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={mealTypeFilter}
              onChange={(e) => setMealTypeFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-700 focus:ring-2 focus:ring-[#1A756A] outline-none cursor-pointer"
            >
              <option value="">Alle maaltijdtypes</option>
              {allMealTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-400 font-bold tracking-wide">
            {totalFiltered} van {stats.allRecipes?.length || 0} live recepten getoond
          </div>
        </div>

        {/* RECEPTEN TABEL */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#1A756A]/5 text-xs font-bold uppercase tracking-wider text-[#1A756A]">
                  <th className="px-6 py-4">Receptafbeelding & Naam</th>
                  <th className="px-6 py-4">Categorie</th>
                  <th className="px-6 py-4">Maaltijdtypes</th>
                  <th className="px-6 py-4">Calorieën</th>
                  <th className="px-6 py-4 text-center">Top Pick</th>
                  <th className="px-6 py-4 text-center">Beheer Acties</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecipes.map((recipe: any) => {
                  const inlineTokens = [...(recipe.ingredients || []), ...(recipe.ingredientsNl || [])];
                  const activeKcalValue = recipe.calories && recipe.calories > 0
                    ? recipe.calories
                    : estimateRecipeCalories(inlineTokens);

                  return (
                    <tr
                      key={recipe.id}
                      className="border-b border-gray-50 hover:bg-[#1A756A]/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                            {recipe.imageUrl ? (
                              <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                            ) : (
                              <UtensilsCrossed className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{recipe.name}</div>
                            <div className="text-xs text-slate-400">ID: {recipe.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 bg-[#1A756A]/10 text-[#1A756A] rounded-full text-xs font-semibold">
                          {recipe.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="truncate block max-w-[140px]" title={(recipe.mealTypes || []).join(', ')}>
                          {(recipe.mealTypes || []).join(', ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        <span className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#1A756A]" /> {activeKcalValue} kcal
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleTopPickClick(recipe.id, recipe.isTopPick)}
                          disabled={loadingId === `top-${recipe.id}`}
                          className={`p-2 rounded-xl transition-all ${
                            recipe.isTopPick
                              ? 'text-amber-500 bg-amber-50 border border-amber-200'
                              : 'text-gray-300 bg-gray-50 border border-transparent'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${recipe.isTopPick ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => setViewingRecipe(recipe)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEditModal(recipe)} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteRecipe(recipe.id)} disabled={loadingId === recipe.id} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl disabled:opacity-30">
                            {loadingId === recipe.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATIE */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/40">
              <span className="text-xs text-slate-500">
                Weergave {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalFiltered)} van {totalFiltered} recepten
              </span>
              <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-20 text-gray-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-slate-700 px-3">{currentPage} / {totalPages}</span>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-20 text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODAL: VIEW RECIPE */}
        {viewingRecipe && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-6 rounded-t-3xl text-white flex justify-between items-center">
                <h3 className="text-2xl font-black">{viewingRecipe.name}</h3>
                <button onClick={() => setViewingRecipe(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {viewingRecipe.nameNl && <p className="text-sm text-slate-500">NL: {viewingRecipe.nameNl}</p>}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold">Categorie</span> {viewingRecipe.category}</div>
                  <div><span className="font-semibold">Maaltijdtypes</span> {(viewingRecipe.mealTypes || []).join(', ')}</div>
                  <div><span className="font-semibold">Energie Matrix</span> {viewingRecipe.calories || estimateRecipeCalories([...viewingRecipe.ingredients||[], ...viewingRecipe.ingredientsNl||[]])} kcal</div>
                  <div><span className="font-semibold">Afkomst / Regio</span> {viewingRecipe.area || 'Surinaams'}</div>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700">Ingrediënten</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-xl">{(viewingRecipe.ingredients || []).join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700">Bereidingsinstructies</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{viewingRecipe.instructions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE / EDIT RECIPE */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-6 rounded-t-3xl text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">
                  {modalMode === 'create' ? 'Nieuw Recept Invoeren' : 'Recept Specificaties Aanpassen'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveRecipe} className="p-6 space-y-4">
                {/* De formuliervelden blijven identiek, alleen de knop onderaan heeft nu primary styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Receptnaam (EN) *</label>
                    <input type="text" required value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nederlandse Vertaling (Naam)</label>
                    <input type="text" value={formState.nameNl} onChange={e => setFormState({...formState, nameNl: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Database Categorie *</label>
                    <select value={formState.category} onChange={e => setFormState({...formState, category: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Land van Herkomst / Area</label>
                    <input type="text" value={formState.area} onChange={e => setFormState({...formState, area: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Maaltijd Schakelaars (Komma gescheiden) *</label>
                  <input type="text" required value={formState.mealTypesString} onChange={e => setFormState({...formState, mealTypesString: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A] placeholder-gray-300" placeholder="Ontbijt, Lunch, Avondeten" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Calorieën (Live Matrix)</label>
                  <div className="flex items-center gap-3">
                    <input type="number" value={formState.calories} onChange={e => setFormState({...formState, calories: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]" />
                    <span className="text-sm font-medium text-slate-500">kcal</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Receptafbeelding Link (Image URL) *</label>
                  <input type="url" required value={formState.imageUrl} onChange={e => setFormState({...formState, imageUrl: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A] placeholder-gray-300" placeholder="unsplash.com..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ingrediënten (EN) *</label>
                    <textarea required rows={3} value={formState.ingredientsString} onChange={e => setFormState({...formState, ingredientsString: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A] resize-none placeholder-gray-300" placeholder="Chicken, Garlic, Onion" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ingrediënten (NL)</label>
                    <textarea rows={3} value={formState.ingredientsNlString} onChange={e => setFormState({...formState, ingredientsNlString: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A] resize-none placeholder-gray-300" placeholder="Kip, Knoflook, Ui" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kookinstructies (EN) *</label>
                    <textarea required rows={3} value={formState.instructions} onChange={e => setFormState({...formState, instructions: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kookinstructies (NL)</label>
                    <textarea rows={3} value={formState.instructionsNl} onChange={e => setFormState({...formState, instructionsNl: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A756A]" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-500 font-bold">Annuleren</button>
                  <button type="submit" disabled={loadingId === 'submit-btn'} className="px-5 py-2.5 bg-[#1A756A] hover:bg-[#13574e] text-white rounded-xl shadow-md flex items-center gap-1.5 font-black uppercase tracking-wider">
                    {loadingId === 'submit-btn' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {modalMode === 'create' ? 'Invoegen' : 'Wijzigingen Opslaan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}