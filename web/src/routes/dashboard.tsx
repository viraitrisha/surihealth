import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { checkDashboardGuard } = await import('../server-functions/auth');
    
    const guard = await checkDashboardGuard();
    
    if (!guard.authenticated) {
      throw redirect({ to: '/login' });
    }

    if (!guard.hasProfile) {
      throw redirect({ to: '/profile-setup' });
    }

    return { user: guard.user, profile: guard.profile };
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <main className="pt-4">
      <Outlet />
    </main>
  );
}
