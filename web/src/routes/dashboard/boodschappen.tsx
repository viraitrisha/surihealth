import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import {
  getShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  clearShoppingList,
} from '../../server-functions/shopping';
import { useToast } from '#/hooks/use-toast';
import {
  ShoppingBasket,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Circle,
  Leaf,
  Download,
} from 'lucide-react';

export const Route = (createFileRoute as any)('/dashboard/boodschappen')({
  loader: async () => {
    const items = await getShoppingList();
    return { shoppingItems: items };
  },
  component: ShoppingListPage,
});

function ShoppingListPage() {
  const { shoppingItems } = Route.useLoaderData();
  const { toast } = useToast();
  const router = useRouter();

  const [newItemName, setNewItemName] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setLoadingAction('add');

    try {
      await addShoppingItem({ data: { name: newItemName.trim() } });
      setNewItemName('');
      router.invalidate();
      toast({ title: 'Toegevoegd!', type: 'success' });
    } catch (err) {
      toast({ title: 'Fout bij toevoegen', type: 'error' });
    } finally {
      setLoadingAction(null);
    }
  };

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

  const handleClearList = async () => {
    if (
      !confirm('Weet u zeker dat u uw hele boodschappenlijst wilt leegmaken?')
    )
      return;
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

  // Download de volledige lijst als .txt bestand
  const handleDownloadList = () => {
    const text = shoppingItems
      .map((item: any) => {
        const checkbox = item.checked ? '[✓]' : '[ ]';
        const quantity = item.quantity ? ` (${item.quantity})` : '';
        return `${checkbox} ${item.name}${quantity}`;
      })
      .join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boodschappenlijst.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative p-6 max-w-2xl mx-auto space-y-8 overflow-hidden">
      {/* Decoratieve bladeren */}
      <Leaf className="absolute -top-10 -left-10 w-40 h-40 text-[#1A756A]/10 rotate-12 pointer-events-none" />
      <Leaf className="absolute -bottom-8 -right-8 w-36 h-36 text-[#1A756A]/10 -rotate-12 pointer-events-none" />
      <Leaf className="absolute top-1/4 right-1/4 w-24 h-24 text-[#1A756A]/10 rotate-45 pointer-events-none" />

      {/* Gradient Banner */}
      <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            <ShoppingBasket className="h-8 w-8" />
            <span>Boodschappenlijst</span>
          </h1>
          <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
            Verzameling van uw geselecteerde maaltijd-ingrediënten.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {/* Teller */}
          <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
            <span className="block text-3xl font-black leading-none">
              {shoppingItems.length}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">
              Items
            </span>
          </div>
          {/* Actieknoppen */}
          <div className="flex gap-2">
            {shoppingItems.length > 0 && (
              <>
                <button
                  onClick={handleDownloadList}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-lg transition"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
                <button
                  onClick={handleClearList}
                  disabled={loadingAction !== null}
                  className="flex items-center gap-1 bg-red-400/20 hover:bg-red-400/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-2 rounded-lg transition disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Legen
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Handmatig Item Toevoegen Formulier */}
      <form
        onSubmit={handleAddItem}
        className="flex gap-3 bg-[var(--card-bg)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm"
      >
        <input
          type="text"
          placeholder="Voeg extra ingrediënt toe (bijv. Ketjap, Maggi...)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          disabled={loadingAction !== null}
          className="flex-1 px-4 py-2.5 bg-[#1A756A] border border-[var(--border-color)] rounded-xl text-sm focus:ring-2 focus:ring-[#1A756A] focus:outline-none text-white"
        />
        <button
          type="submit"
          disabled={loadingAction !== null || !newItemName.trim()}
          className="bg-[#1A756A] hover:bg-[#13574e] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-1 disabled:opacity-50"
        >
          {loadingAction === 'add' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Toevoegen
        </button>
      </form>

      {/* De Interactieve Items Lijst */}
      <div className="bg-[var(--card-bg)] rounded-3xl border border-[var(--border-color)] shadow-sm overflow-hidden">
        {shoppingItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500 space-y-2">
            <ShoppingBasket className="h-12 w-12 text-gray-200 dark:text-gray-700 mx-auto" />
            <p className="font-bold text-slate-700 dark:text-slate-200">
              Uw lijst is momenteel leeg
            </p>
            <p className="text-xs max-w-xs mx-auto">
              Klik op 'Boodschappenlijst maken' op een recepten detailpagina om
              ingrediënten in te laden.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {shoppingItems.map((item: any) => (
              <div
                key={item.id}
                onClick={() => handleToggleItem(item.id, item.checked)}
                className={`flex items-center justify-between p-4 cursor-pointer select-none transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/50 ${
                  item.checked
                    ? 'bg-gray-50/50 dark:bg-slate-800/30'
                    : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {loadingAction === item.id ? (
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  ) : item.checked ? (
                    <CheckCircle2 className="h-5 w-5 text-[#1A756A]" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                  )}
                  <span
                    className={`text-sm font-semibold transition-all ${
                      item.checked
                        ? 'line-through text-[var(--primary-color)]/70'
                        : 'text-[var(--primary-color)]'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                {item.quantity && (
                  <span className="text-xs font-bold text-white bg-[var(--primary-color)] px-2 py-0.5 rounded-lg">
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