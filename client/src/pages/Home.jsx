/**
 * Home.jsx — Main dashboard page.
 *
 * Layout:
 *  - Hero section with stats bar
 *  - Search bar + filter bar
 *  - Task list grid
 *
 * Triggers initial data fetch on mount.
 */

import { useEffect, memo } from "react";
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import TaskList   from "../components/TaskList";
import SearchBar  from "../components/SearchBar";
import FilterBar  from "../components/FilterBar";
import { useTaskContext } from "../context/TaskContext";

// ── Stat card — defined outside Home so it is never re-created ────────────────

const StatCard = memo(({ label, value, icon: Icon, color }) => (
  <div className="card px-5 py-4 flex items-center gap-4 animate-fade-in">
    <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${color}`}>
      <Icon size={18} className="text-white" strokeWidth={2} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-medium">{label}</p>
    </div>
  </div>
));

StatCard.displayName = "StatCard";

// ── Page ─────────────────────────────────────────────────────────────────────

const Home = () => {
  const { tasks, fetchTasks } = useTaskContext();

  // Initial load
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derived stats
  const total       = tasks.length;
  const pending     = tasks.filter((t) => t.status === "Pending").length;
  const inProgress  = tasks.filter((t) => t.status === "In Progress").length;
  const completed   = tasks.filter((t) => t.status === "Completed").length;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl
                        bg-primary-600 shadow-sm mt-0.5">
          <LayoutDashboard size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Manage and track all your tasks in one place
          </p>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Tasks"  value={total}      icon={LayoutDashboard} color="bg-primary-600"  />
        <StatCard label="Pending"      value={pending}    icon={Clock}           color="bg-slate-500"    />
        <StatCard label="In Progress"  value={inProgress} icon={AlertCircle}     color="bg-blue-500"     />
        <StatCard label="Completed"    value={completed}  icon={CheckCircle2}    color="bg-emerald-500"  />
      </div>

      {/* ── Search + Filters ────────────────────────────────────────────── */}
      <div className="card p-4 space-y-3">
        <SearchBar />
        <div className="border-t divider pt-3">
          <FilterBar />
        </div>
      </div>

      {/* ── Task grid ───────────────────────────────────────────────────── */}
      <TaskList />

    </main>
  );
};

export default Home;
