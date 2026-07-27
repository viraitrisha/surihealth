// src/routes/admin/dashboard.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import {
  adminGetContactMessages,
  adminGetPlatformStats,
  adminToggleTopPick,
  adminReplyToMessage,
  adminDeleteUser,
} from '../../server-functions/admin';
import { useToast } from '#/hooks/use-toast';
import {
  Users,
  MessageSquare,
  Heart,
  ShieldCheck,
  Mail,
  ChevronRight,
  Loader2,
  Star,
  UtensilsCrossed,
  BarChart3,
  Trash2,
  Eye,
  ShieldAlert,
  Search,
  ChevronLeft,
} from 'lucide-react';

export const Route = createFileRoute('/admin/dashboard')({
  loader: async () => {
    try {
      const messages = await adminGetContactMessages();
      const stats = await adminGetPlatformStats();
      return { messages: messages || [], stats };
    } catch (err) {
      throw new Error('Niet geautoriseerd');
    }
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { messages, stats } = Route.useLoaderData() as { messages: any[]; stats: any };
  const { toast } = useToast();
  const router = useRouter();

  // Algemene beheer states
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [banLoading, setBanLoading] = useState<string | null>(null);

  // RECEPTENBEHEER STATES: Zoeken, Filteren en Paginering
  const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentStepPage] = useState(1);
  const itemsPerPage = 10;

  const handleSendReply = async (messageId: string, userEmail: string) => {
    if (!replyText.trim()) return;
    setSendingId(messageId);
    try {
      await adminReplyToMessage({ data: { messageId, replyText } });
      toast({ title: 'Bericht beantwoord', type: 'success' });
      if (typeof window !== 'undefined') {
        window.location.href = `mailto:${userEmail}?subject=SuriHealth&body=${encodeURIComponent(replyText)}`;
      }
      setReplyText('');
      setReplyingToId(null);
    } catch {
      toast({ title: 'Fout bij verzenden', type: 'error' });
    } finally {
      setSendingId(null);
    }
  };

  const handleTopPickToggle = async (recipeId: string, currentStatus: boolean) => {
    setToggleLoading(recipeId);
    try {
      await adminToggleTopPick({ data: { recipeId, isTopPick: !currentStatus } });
      toast({ title: 'Top Pick status aangepast', type: 'success' });
      router.invalidate();
    } catch {
      toast({ title: 'Fout bij aanpassen', type: 'error' });
    } finally {
      setToggleLoading(null);
    }
  };

  const handleBanUser = async (userId: string, email: string) => {
    if (email === 'surihealth@gmail.com') {
      toast({
        title: 'Actie geweigerd',
        description: 'Beheerders kunnen niet verbannen worden.',
        type: 'warning',
      });
      return;
    }
    setBanLoading(userId);
    try {
      await adminDeleteUser({ data: { userId } });
      toast({
        title: 'Gebruiker verbannen',
        description: 'Account succesvol gewist uit database.',
        type: 'success',
      });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij bannen', description: err.message, type: 'error' });
    } finally {
      setBanLoading(null);
    }
  };

  const filteredRecipesMatrix = (stats.allRecipes || []).filter((recipe: any) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
      (recipe.nameNl && recipe.nameNl.toLowerCase().includes(recipeSearchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedCategoryFilter === 'all') return true;

    const dbCategory = (recipe.category || '').toLowerCase().trim();
    const dbMealTypes = (recipe.mealTypes || []).map((t: string) => t.toLowerCase().trim());

    if (selectedCategoryFilter === 'ontbijt') {
      return (
        dbCategory === 'ontbijt' ||
        dbCategory === 'breakfast' ||
        dbMealTypes.includes('ontbijt') ||
        dbMealTypes.includes('breakfast')
      );
    }
    if (selectedCategoryFilter === 'lunch') {
      return dbCategory === 'lunch' || dbMealTypes.includes('lunch');
    }
    if (selectedCategoryFilter === 'middagmaaltijd') {
      return (
        dbCategory === 'middagmaaltijd' ||
        dbCategory === 'dinner' ||
        dbCategory === 'main course' ||
        dbCategory === 'maincourse' ||
        dbMealTypes.includes('middagmaaltijd') ||
        dbMealTypes.includes('dinner') ||
        dbMealTypes.includes('main course')
      );
    }
    if (selectedCategoryFilter === 'avondeten') {
      return (
        dbCategory === 'avondeten' ||
        dbCategory === 'supper' ||
        dbCategory === 'dinner' ||
        dbMealTypes.includes('avondeten') ||
        dbMealTypes.includes('supper') ||
        dbMealTypes.includes('dinner')
      );
    }
    if (selectedCategoryFilter === 'dessert') {
      return (
        dbCategory === 'dessert' ||
        dbCategory === 'snack' ||
        dbCategory === 'snacks' ||
        dbCategory === 'snacks & desserts' ||
        dbMealTypes.includes('dessert') ||
        dbMealTypes.includes('snack') ||
        dbMealTypes.includes('dessert')
      );
    }

    return dbCategory === selectedCategoryFilter;
  });

  // Bereken pagineringsgrenzen
  const totalFilteredRecipes = filteredRecipesMatrix.length;
  const totalPages = Math.ceil(totalFilteredRecipes / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedRecipesPage = filteredRecipesMatrix.slice(startIndex, endIndex);

  const maxChartCount = Math.max(...stats.chartData.map((d: any) => d.count), 1);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10 mt-6 text-slate-800">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-emerald-400" /> SuriHealth Beheerderspaneel
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Cockpit voor platformstatistieken, contactbeheer en Surinaamse receptenanalyse.
          </p>
        </div>
      </div>

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="bg-teal-50 p-4 rounded-xl text-[#1A756A]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gebruikers</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalRegisteredUsers}</h3>
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="bg-amber-50 p-4 rounded-xl text-amber-600">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Berichten</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.totalContactSubmissions}</h3>
          </div>
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="bg-rose-50 p-4 rounded-xl text-rose-600">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Database Recepten</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stats.allRecipes.length} live</h3>
          </div>
        </div>
      </div>

      {/* MATRIX MET STATISTIEKEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white border p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
            <BarChart3 className="h-5 w-5 text-teal-600" /> Platform Gezondheidsrisico's Verdeling
          </h3>
          <div className="space-y-4 pt-2">
            {stats.chartData.map((bar: any) => {
              const percentage = (bar.count / maxChartCount) * 100;
              return (
                <div key={bar.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>{bar.name === 'Diabetic' ? 'Diabeet (Suikerziekte)' : bar.name}</span>
                    <span>{bar.count} users</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-[#1A756A] h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" /> Meest Opgeslagen (Top 5)
          </h3>
          <div className="space-y-3">
            {stats.topFavorites.map((fav: any) => (
              <div key={fav.recipeId} className="flex items-center gap-3 p-1">
                <img
                  src={fav.imageUrl}
                  alt={fav.recipeName}
                  className="w-10 h-10 object-cover rounded-lg bg-gray-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-800 truncate">{fav.recipeName}</h4>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    {fav.category}
                  </span>
                </div>
                <div className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg text-center font-black text-xs">
                  {fav.count} saves
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GEBRUIKERSBEHEER */}
      <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
          <ShieldAlert className="h-5 w-5 text-teal-600" /> Gebruikersbeheer & Toegangscontrole
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Naam</th>
                <th className="py-3 px-2">E-mailadres</th>
                <th className="py-3 px-2">Geregistreerd Op</th>
                <th className="py-3 px-2 text-center">Toegang intrekken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.allUsersList.slice(0, 5).map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-2 font-semibold text-slate-700">{u.name}</td>
                  <td className="py-3 px-2 text-slate-500">{u.email}</td>
                  <td className="py-3 px-2 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString('nl-SR')}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      type="button"
                      disabled={u.email === 'surihealth@gmail.com' || banLoading === u.id}
                      onClick={() => handleBanUser(u.id, u.email)}
                      className="p-1.5 rounded-xl border border-red-100 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white transition-all disabled:opacity-20 cursor-pointer focus:outline-none"
                    >
                      {banLoading === u.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEPTEN MATRIX */}
      <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-teal-600" />
            Complete Receptendatabase ({totalFilteredRecipes} van {stats.allRecipes.length})
          </h3>
        </div>
        <p className="text-xs text-gray-500 -mt-2">
          Beheer alle Surinaamse recepten, zoek direct in de database en wijs Top Picks toe.
        </p>

        {/* Live Recepten Zoekbalk */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek recept..."
            value={recipeSearchQuery}
            onChange={(e) => {
              setRecipeSearchQuery(e.target.value);
              setCurrentStepPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900 bg-gray-50/50"
          />
        </div>

        {/* Filter knoppenbalk */}
        <div className="flex flex-wrap gap-2">
          {['all', 'ontbijt', 'lunch', 'middagmaaltijd', 'avondeten', 'dessert'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setSelectedCategoryFilter(f);
                setCurrentStepPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer focus:outline-none transition-all ${
                selectedCategoryFilter === f
                  ? 'bg-[#1A756A] text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f === 'all' ? 'Alles' : f}
            </button>
          ))}
        </div>

        {/* Recepten Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Recept</th>
                <th className="py-3 px-2">Categorie</th>
                <th className="py-3 px-2">Top Pick</th>
                <th className="py-3 px-2 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayedRecipesPage.map((recipe: any) => (
                <tr key={recipe.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={recipe.imageUrl || '/placeholder.svg'}
                        alt={recipe.name}
                        className="w-8 h-8 object-cover rounded-md shrink-0 bg-gray-100"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-700 truncate">{recipe.name}</div>
                        {recipe.nameNl && (
                          <div className="text-[10px] text-gray-400 truncate">{recipe.nameNl}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
                      {recipe.category}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button
                      type="button"
                      disabled={toggleLoading === recipe.id}
                      onClick={() => handleTopPickToggle(recipe.id, recipe.isTopPick)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer focus:outline-none ${
                        recipe.isTopPick
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {toggleLoading === recipe.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Star
                          className={`h-3 w-3 ${
                            recipe.isTopPick ? 'fill-amber-500 text-amber-500' : ''
                          }`}
                        />
                      )}
                      {recipe.isTopPick ? 'Top' : 'Normaal'}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INTERACTIEVE PAGINERING BALK */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Weergave {startIndex + 1}-{Math.min(endIndex, totalFilteredRecipes)} van{' '}
            {totalFilteredRecipes} recepten
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentStepPage((prev) => prev - 1)}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Vorige
            </button>
            <span className="text-xs font-semibold text-gray-700">
              Pagina {currentPage} van {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentStepPage((prev) => prev + 1)}
              className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              Volgende <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES RECEIVER */}
      <div className="bg-white border p-6 rounded-3xl shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-2 border-b pb-3">
          <MessageSquare className="h-5 w-5 text-teal-600" /> Landingspagina Berichten ({messages.length})
        </h3>
        <div className="space-y-4">
          {messages.map((msg: any) => (
            <div key={msg.id} className="border border-gray-100 rounded-xl p-4 space-y-2 bg-gray-50/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-slate-800">{msg.name}</div>
                  <div className="text-xs text-gray-500">{msg.email}</div>
                </div>
                <span className="text-[10px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleDateString('nl-SR')}
                </span>
              </div>
              <p className="text-xs text-slate-600 italic bg-white p-2 rounded-lg border">
                "{msg.message}"
              </p>
              {replyingToId !== msg.id ? (
                <button
                  onClick={() => setReplyingToId(msg.id)}
                  className="text-xs font-bold text-[#1A756A] hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
                >
                  <Mail className="h-3 w-3" /> Beantwoorden
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Typ hier uw e-mail antwoord..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#1A756A] text-gray-900"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setReplyingToId(null);
                        setReplyText('');
                      }}
                      className="px-2.5 py-1 border text-gray-400 hover:bg-gray-50 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={() => handleSendReply(msg.id, msg.email)}
                      disabled={sendingId === msg.id || !replyText.trim()}
                      className="px-3 py-1.5 bg-[#1A756A] hover:bg-[#13574e] text-white rounded-lg text-xs font-black flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
                    >
                      {sendingId === msg.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Mail className="h-3 w-3" />
                      )}
                      Verzenden
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}