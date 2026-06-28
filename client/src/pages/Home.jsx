/**
 * Home.jsx — Main dashboard page.
 *
 * Layout:
 *  - Compact Notion-style header
 *  - Inline search, filters, and sort toolbar
 *  - Compact task list grid
 *
 * Triggers initial data fetch on mount.
 */

import { useEffect } from "react";
import TaskList   from "../components/TaskList";
import SearchBar  from "../components/SearchBar";
import FilterBar  from "../components/FilterBar";
import { useTaskContext } from "../context/TaskContext";

const Home = () => {
  const { fetchTasks } = useTaskContext();

  // Initial load
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 space-y-4">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Tasks
          </h1>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            A minimalist workspace for tracking progress.
          </p>
        </div>
      </div>

      {/* ── Search + Filters Toolbar (horizontal layout) ─────────────────── */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between border-b divider pb-2.5">
        <div className="w-full sm:max-w-[200px]">
          <SearchBar />
        </div>
        <FilterBar />
      </div>

      {/* ── Task grid ───────────────────────────────────────────────────── */}
      <TaskList />

    </main>
  );
};

export default Home;
