import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import {
  adminGetPlatformStats,
  adminToggleBlockUser,
  adminUpdateUserRole,
  adminDeleteUser,
} from '../../server-functions/admin';
import { useToast } from '#/hooks/use-toast';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Unlock,
  UserCircle,
  Shield,
  Trash2,
  Leaf,
} from 'lucide-react';

const ITEMS_PER_PAGE = 8;
const PROTECTED_EMAIL = 'surihealth@gmail.com';

export const Route = (createFileRoute as any)('/admin/users')({
  loader: async () => {
    try {
      const stats = await adminGetPlatformStats();
      return { stats };
    } catch (err) {
      throw new Error('Niet geautoriseerd');
    }
  },
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { stats } = Route.useLoaderData() as { stats: any };
  const { toast } = useToast();
  const router = useRouter();

  const [loadingBlockId, setLoadingBlockId] = useState<string | null>(null);
  const [loadingRoleId, setLoadingRoleId] = useState<string | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const allUsers = stats.allUsersList || [];
  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter((u: any) => u.role === 'admin').length;
  const blockedCount = allUsers.filter((u: any) => u.blocked === true).length;

  const filtered = allUsers.filter((user: any) => {
    const q = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.role?.toLowerCase().includes(q)
    );
  });

  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedUsers = filtered.slice(startIndex, endIndex);

  // ---- Handlers ----
  const handleToggleBlock = async (userId: string, currentlyBlocked: boolean, email: string) => {
    if (email === PROTECTED_EMAIL && !currentlyBlocked) return;
    setLoadingBlockId(userId);
    try {
      await adminToggleBlockUser({ data: { userId, block: !currentlyBlocked } });
      toast({ title: !currentlyBlocked ? 'Gebruiker geblokkeerd' : 'Gebruiker gedeblokkeerd', type: 'success' });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij verwerken', description: err.message, type: 'error' });
    } finally {
      setLoadingBlockId(null);
    }
  };

  const handleRoleToggle = async (userId: string, currentRole: string, email: string) => {
    if (email === PROTECTED_EMAIL) return;
    setLoadingRoleId(userId);
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminUpdateUserRole({ data: { userId, newRole } });
      toast({ title: newRole === 'admin' ? 'Promoot tot Admin' : 'Gedegradeerd naar Gebruiker', type: 'success' });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij rol aanpassen', description: err.message, type: 'error' });
    } finally {
      setLoadingRoleId(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (email === PROTECTED_EMAIL) return;
    setLoadingDeleteId(userId);
    try {
      await adminDeleteUser({ data: { userId } });
      toast({ title: 'Gebruiker permanent verwijderd', description: 'Alle gekoppelde data zijn succesvol geschoond.', type: 'success' });
      router.invalidate();
    } catch (err: any) {
      toast({ title: 'Fout bij verwijderen', description: err.message, type: 'error' });
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const isProtected = (email: string) => email === PROTECTED_EMAIL;

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden">
      <AdminSidebar />

      {/* Decoratieve bladeren */}
      <Leaf className="absolute -top-10 -left-10 w-40 h-40 text-[#1A756A]/10 rotate-12 pointer-events-none" />
      <Leaf className="absolute -bottom-8 -right-8 w-36 h-36 text-[#1A756A]/10 -rotate-12 pointer-events-none" />
      <Leaf className="absolute top-1/4 right-1/4 w-24 h-24 text-[#1A756A]/10 rotate-45 pointer-events-none" />

      <main className="flex-1 ml-72 p-10 pt-0 space-y-8 relative z-10">
        <div className="h-6" />

        {/* GRADIENT BANNER */}
        <div className="bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] p-8 rounded-3xl text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
              <Users className="h-8 w-8" />
              <span>Gebruikersbeheer</span>
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium max-w-xl">
              Beheer accounts, blokkeer gebruikers of wijzig rollen binnen het SuriHealth platform.
            </p>
          </div>
          <div className="bg-white/10 px-5 py-3 rounded-2xl border border-white/10 text-center shrink-0 min-w-[100px]">
            <span className="block text-3xl font-black leading-none">{totalUsers}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block mt-1">Gebruikers</span>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={Users} color="teal" label="Totaal" value={totalUsers} />
          <StatCard icon={ShieldCheck} color="purple" label="Beheerders" value={adminCount} />
          <StatCard icon={ShieldAlert} color="red" label="Geblokkeerd" value={blockedCount} />
        </div>

        {/* ZOEKBALK */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam, e-mail of rol..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1A756A] outline-none bg-gray-50 text-gray-900 transition-all font-medium"
            />
          </div>
          <div className="text-xs text-gray-400 font-bold tracking-wide">
            {totalFiltered} accounts gevonden
          </div>
        </div>

        {/* GEBRUIKERSTABEL */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1A756A]/5 border-b border-gray-100">
                <tr className="text-xs font-bold text-[#1A756A] uppercase tracking-wider">
                  <th className="px-6 py-4">Gebruiker</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Geregistreerd</th>
                  <th className="px-6 py-4 text-center">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                {displayedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-200 animate-pulse" />
                      Geen gebruikers gevonden
                    </td>
                  </tr>
                ) : (
                  displayedUsers.map((user: any) => (
                    <tr key={user.id} className="hover:bg-[#1A756A]/5 transition-colors">
                      {/* Name + avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">{user.name || 'Onbekend'}</span>
                            <span className="text-[10px] text-gray-400 uppercase">ID: {user.id.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-600 text-xs">{user.email}</td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        {user.blocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                            <Ban className="w-3 h-3" /> Geblokkeerd
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                            <Unlock className="w-3 h-3" /> Actief
                          </span>
                        )}
                      </td>

                      {/* Role badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border ${
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-100 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCircle className="w-3 h-3" />}
                          {user.role || 'user'}
                        </span>
                      </td>

                      {/* Registration date */}
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('nl-SR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* Block / Unblock */}
                          <button
                            type="button"
                            disabled={loadingBlockId === user.id || (isProtected(user.email) && !user.blocked)}
                            onClick={() => handleToggleBlock(user.id, user.blocked, user.email)}
                            className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                              isProtected(user.email) && !user.blocked
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : user.blocked
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm'
                            }`}
                          >
                            {loadingBlockId === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : user.blocked ? <Unlock className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                            {isProtected(user.email) && !user.blocked ? 'Hoofd' : user.blocked ? 'Deblokkeer' : 'Blokkeer'}
                          </button>

                          {/* Role toggle */}
                          <button
                            type="button"
                            disabled={loadingRoleId === user.id || isProtected(user.email)}
                            onClick={() => handleRoleToggle(user.id, user.role, user.email)}
                            className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                              isProtected(user.email)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : user.role === 'admin'
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 shadow-sm'
                                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100 shadow-sm'
                            }`}
                          >
                            {loadingRoleId === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : user.role === 'admin' ? <UserCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                            {isProtected(user.email) ? 'Hoofd' : user.role === 'admin' ? 'Degraderen' : 'Admin maken'}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            disabled={loadingDeleteId === user.id || isProtected(user.email)}
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none ${
                              isProtected(user.email)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                            }`}
                          >
                            {loadingDeleteId === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            {isProtected(user.email) ? 'Beveiligd' : 'Verwijder'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">
                Weergave {startIndex + 1}–{Math.min(endIndex, totalFiltered)} van {totalFiltered} gebruikers
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-20 text-gray-600 transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-gray-700">{currentPage} / {totalPages}</span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-20 text-gray-600 transition-all cursor-pointer focus:outline-none"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ---- StatCard component ----
function StatCard({ icon: Icon, color, label, value }: { icon: any; color: 'teal' | 'purple' | 'red'; label: string; value: number }) {
  const colorMap = {
    teal: { bg: 'bg-teal-50', text: 'text-[#1A756A]' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
  };
  const { bg, text } = colorMap[color];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex items-center gap-5">
      <div className={`p-4 rounded-2xl ${bg} ${text}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs uppercase font-bold text-slate-400 tracking-wide">{label}</p>
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
    </div>
  );
}