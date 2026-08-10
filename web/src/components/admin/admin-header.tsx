import { authClient } from '../../auth/auth-client';
import { LogOut } from 'lucide-react';
import { useToast } from '#/hooks/use-toast';

export function AdminHeader() {
  const { toast } = useToast();

  const handleLogout = async () => {
    await authClient.signOut();
    toast({ title: 'Admin veilig uitgelogd', type: 'success' });
    if (typeof window !== 'undefined') window.location.href = '/login';
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 shadow-md h-20 text-white"
      style={{
        background: 'var(--header-color)',
        boxShadow: 'var(--box-shadow)',
      }}
    >
      {/* Linker kant: Alleen de titel */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-black tracking-wider" style={{ color: 'var(--white-color)' }}>
          SuriHealth
        </span>
      </div>

      {/* Rechter kant: Alleen de witte Log Uit knop */}
      <nav className="flex items-center gap-4">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-1.5 text-xs font-black uppercase px-4 py-2 rounded-xl transition-all cursor-pointer focus:outline-none"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'var(--white-color)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        >
          <LogOut className="h-4 w-4" style={{ color: 'var(--white-color)' }} /> Log Uit
        </button>
      </nav>
    </header>
  );
}