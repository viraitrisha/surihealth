// src/components/admin-header.tsx
import { Link, useNavigate } from '@tanstack/react-router';
import { authClient } from '../../auth/auth-client';
import { ShieldCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { useToast } from '#/hooks/use-toast';

export function AdminHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await authClient.signOut();
    toast({ title: 'Admin veilig uitgelogd', type: 'success' });
    if (typeof window !== 'undefined') window.location.href = '/login';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-gradient-to-r from-[#1A756A] to-[#2D9C8F] px-6 py-4 shadow-md h-20 text-white">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-emerald-400" />
        <span className="text-xl font-black tracking-wider uppercase text-slate-100">SuriHealth HQ</span>
      </div>

      <nav className="flex items-center gap-4">
        <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-xs font-black uppercase bg-slate-800 hover:bg-slate-700/80 px-4 py-2 rounded-xl text-slate-200 transition-all no-underline">
          <LayoutDashboard className="h-4 w-4 text-emerald-400" /> Cockpit
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-black uppercase bg-red-950/40 hover:bg-red-900/60 border border-red-900/30 px-4 py-2 rounded-xl text-red-400 transition-all cursor-pointer focus:outline-none">
          <LogOut className="h-4 w-4" /> Log Uit
        </button>
      </nav>
    </header>
  );
}