// src/routes/admin/dashboard.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router';
import { adminGetContactMessages, adminGetPlatformStats } from '../../server-functions/admin';
import { AdminSidebar } from '../../components/admin/admin-sidebar';
import {
  Users,
  MessageSquare,
  UtensilsCrossed,
  TrendingUp,
  Calendar,
  Layers,
  Heart,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ------------------------------------------------------------------
// Color palette (corresponds to CSS variables; keep as-is for dynamic theming)
// ------------------------------------------------------------------
const COLORS = [
  'var(--primary-color)',
  '#F59E0B',
  '#EC4899',
  '#3B82F6',
  '#8B5CF6',
  '#10B981',
];

// ------------------------------------------------------------------
// Route definition – SSR loader fetches data directly from PostgreSQL
// ------------------------------------------------------------------
export const Route = (createFileRoute as any)('/admin/dashboard')({
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

// ------------------------------------------------------------------
// Main Dashboard Component
// ------------------------------------------------------------------
function AdminDashboardPage() {
  const { stats } = Route.useLoaderData() as { stats: any };
  const router = useRouter();

  const now = new Date();
  const monthName = now.toLocaleString('nl-NL', { month: 'long' });
  const year = now.getFullYear();

  // Derived data
  const lineChartData: any[] = stats.currentMonthData || [];
  const yearChartData: any[] = stats.yearChartData || [];
  const items: any[] = stats.chartData || [];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Reusable Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 pt-6 space-y-8 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500 mt-2">
              Welkom terug, beheerder. Hier zie je een overzicht van de belangrijkste statistieken.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.invalidate()}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition-all cursor-pointer focus:outline-none"
          >
            Gegevens Vernieuwen
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            icon={Users}
            bgClass="bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
            label="Gebruikers"
            value={stats.totalRegisteredUsers}
          />
          <StatCard
            icon={MessageSquare}
            bgClass="bg-amber-100 text-amber-600"
            label="Contact Berichten"
            value={stats.totalContactSubmissions}
          />
          <StatCard
            icon={UtensilsCrossed}
            bgClass="bg-pink-100 text-pink-600"
            label="Database Recepten"
            value={`${stats.allRecipes.length} live`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Registrations Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <ChartHeader
              icon={TrendingUp}
              title={`Registraties (${monthName} ${year})`}
              iconBg="bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
              legend={[
                { color: 'var(--primary-color)', label: 'Deze maand' },
                { color: '#F59E0B', label: 'Vorige maand' },
              ]}
            />
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineChartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} interval={2} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                  <Tooltip
                    formatter={(value: any) => [value, 'Registraties']}
                    contentStyle={tooltipStyle}
                  />
                  <Area type="monotone" dataKey="users" stroke="var(--primary-color)" strokeWidth={2} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="previous" stroke="#F59E0B" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart (Top Triggers) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <ChartHeader
              icon={Layers}
              title="Top Triggers"
              iconBg="bg-blue-50 text-blue-500"
              legend={null}
            />
            <div className="h-[200px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={items}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {items.map((_, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [value, 'Gebruikers']}
                    contentStyle={tooltipStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-20 overflow-y-auto">
              {items.slice(0, 6).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="truncate">
                    {item.name}: <strong>{item.count}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Annual Bar Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <ChartHeader
            icon={Calendar}
            title={`Jaaroverzicht (${year})`}
            iconBg="bg-blue-50 text-blue-500"
            legend={null}
          />
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                <Tooltip
                  formatter={(value: any) => [value, 'Nieuwe Users']}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="users" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Favorited Recipes */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <ChartHeader
            icon={Heart}
            title="Meest Opgeslagen Kookrecepten (Top 5)"
            iconBg="bg-rose-50 text-rose-500"
            legend={null}
          />
          <div className="space-y-3 mt-4">
            {stats.topFavorites.slice(0, 5).map((fav: any, index: number) => (
              <div
                key={fav.recipeId}
                className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <span className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 truncate">{fav.recipeName}</p>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
                    {fav.category}
                  </p>
                </div>
                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-lg text-xs font-black">
                  {fav.count} saves
                </span>
              </div>
            ))}
            {(!stats.topFavorites || stats.topFavorites.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">
                Nog geen opgeslagen recepten.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ------------------------------------------------------------------
// Small reusable sub-components
// ------------------------------------------------------------------

function StatCard({
  icon: Icon,
  bgClass,
  label,
  value,
}: {
  icon: any;
  bgClass: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex items-center gap-5">
      <div className={`p-4 rounded-2xl shadow-sm ${bgClass}`}>
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-xs uppercase font-bold text-slate-500 tracking-wide">{label}</p>
        <h3 className="text-4xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
    </div>
  );
}

function ChartHeader({
  icon: Icon,
  title,
  iconBg,
  legend,
}: {
  icon: any;
  title: string;
  iconBg: string;
  legend: { color: string; label: string }[] | null;
}) {
  return (
    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-lg text-slate-800">{title}</h2>
      </div>
      {legend && (
        <div className="flex gap-4 text-xs font-bold text-slate-500">
          {legend.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: 'none',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  fontSize: '12px',
  padding: '8px 12px',
  fontWeight: 'bold',
};

export default AdminDashboardPage;