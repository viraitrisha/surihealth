import { Link } from '@tanstack/react-router';
import { BarChart3, Users, UtensilsCrossed, MessageSquare, LogOut } from 'lucide-react';

export function AdminSidebar() {

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { to: '/admin/users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { to: '/admin/recipes', label: 'Recipes', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { to: '/admin/contact', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-72 bg-[var(--accent-color)] text-white min-h-screen p-8 flex flex-col fixed h-full z-10 select-none">
      
      {/* Smart Route Active Highlights Map Matrix */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: true }}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all no-underline block cursor-pointer"
            // Active route mapping colors
            activeProps={{
              className: 'bg-[var(--primary-color)] text-white shadow-sm font-bold',
            }}
            inactiveProps={{
              className: 'text-slate-300 hover:bg-[var(--secondary-color)]/20 hover:text-white',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}