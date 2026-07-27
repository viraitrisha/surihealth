// src/routes/dashboard/boodschappen.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { 
  getShoppingList, 
  addShoppingItem, 
  toggleShoppingItem, 
  clearShoppingList 
} from '../../server-functions/shopping';
import { useToast } from '#/hooks/use-toast';
import { ShoppingBasket, Plus, Trash2, Loader2, CheckCircle2, Circle } from 'lucide-react';

export const Route = (createFileRoute as any)('/dashboard/boodschappen')({
  // BACKEND SSR: Laad de boodschappenlijst direct in via de server loader
  loader: async () => {
    const items = await getShoppingList();
    return { shoppingItems: items };
  },
  component: ShoppingListPage,
});

function ShoppingListPage() {
  const { shoppingItems } = Route.useLoaderData();
  const { toast } = useToast();
  const router = useRouter(); // Voor het verversen van de server data

  const [newItemName, setNewItemName] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Actie: Item handmatig toevoegen
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setLoadingAction('add');

    try {
      await addShoppingItem({ data: { name: newItemName.trim() } });
      setNewItemName('');
      router.invalidate(); // Forceert TanStack Start om de loader opnieuw te draaien
      toast({ title: 'Toegevoegd!', type: 'success' });
    } catch (err) {
      toast({ title: 'Fout bij toevoegen', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  // Actie: Item afvinken / aanvinken (Toggle)
  const handleToggleItem = async (id: string, currentChecked: boolean) => {
    setLoadingAction(id);
    try {
      await toggleShoppingItem({ data: { id, checked: !currentChecked } });
      router.invalidate();
    } catch (err) {
      toast({ title: 'Actie mislukt', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  // Actie: Volledige lijst leegmaken
  const handleClearList = async () => {
    if (!confirm('Weet u zeker dat u uw hele boodschappenlijst wilt leegmaken?')) return;
    setLoadingAction('clear');

    try {
      await clearShoppingList();
      router.invalidate();
      toast({ title: 'Boodschappenlijst geleegd', type: 'success' });
    } catch (err) {
      toast({ title: 'Fout bij leegmaken', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Titel & Leegmaken Knop */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 p-3 rounded-2xl text-[#1A756A]">
            <ShoppingBasket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Boodschappenlijst</h1>
            <p className="text-xs text-gray-400">Verzameling van uw geselecteerde maaltijd-ingrediënten</p>
          </div>
        </div>
        {shoppingItems.length > 0 && (
          <button
            onClick={handleClearList}
            disabled={loadingAction !== null}
            className="flex items-center gap-2 border border-red-200 hover:bg-red-50 text-red-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
          >
            <Trash2 className="h-4 w-4" /> Lijst legen
          </button>
        )}
      </div>

      {/* Handmatig Item Toevoegen Formulier */}
      <form onSubmit={handleAddItem} className="flex gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <input
          type="text"
          placeholder="Voeg extra ingrediënt toe (bijv. Ketjap, Maggi...)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          disabled={loadingAction !== null}
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1A756A] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loadingAction !== null || !newItemName.trim()}
          className="bg-[#1A756A] hover:bg-[#13574e] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-1 disabled:opacity-50"
        >
          {loadingAction === 'add' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Toevoegen
        </button>
      </form>

      {/* De Interactieve Items Lijst */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {shoppingItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 space-y-2">
            <ShoppingBasket className="h-12 w-12 text-gray-200 mx-auto" />
            <p className="font-bold text-slate-700">Uw lijst is momenteel leeg</p>
            <p className="text-xs max-w-xs mx-auto">Klik op 'Boodschappenlijst maken' op een recepten detailpagina om ingrediënten in te laden.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {shoppingItems.map((item: any) => (
              <div 
                key={item.id}
                onClick={() => handleToggleItem(item.id, item.checked)}
                className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors hover:bg-gray-50/80 ${
                  item.checked ? 'bg-gray-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {loadingAction === item.id ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : item.checked ? (
                    <CheckCircle2 className="h-5 w-5 text-[#1A756A]" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                  <span className={`text-sm font-semibold transition-all ${
                    item.checked ? 'line-through text-gray-400' : 'text-slate-700'
                  }`}>
                    {item.name}
                  </span>
                </div>
                {item.quantity && (
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">
                    {item.quantity}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
