/**
 * FilterBar.jsx — Status filter, priority filter, and sort controls.
 */

import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import useTasks from "../hooks/useTasks";

const FilterBar = () => {
  const { filters, setFilters } = useTasks();

  const hasActiveFilters =
    filters.status !== "" || filters.priority !== "" || filters.sort !== "latest";

  const clearAll = () =>
    setFilters({ status: "", priority: "", sort: "latest", search: "" });

  return (
    <div className="flex flex-wrap items-center gap-1.5">

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <select
        id="filter-status"
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value })}
        className="select text-[11px] py-1 px-2 w-auto h-7 min-w-[100px] bg-zinc-100/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        aria-label="Filter by status"
      >
        <option value="">Status: All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* ── Priority ───────────────────────────────────────────────────── */}
      <select
        id="filter-priority"
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value })}
        className="select text-[11px] py-1 px-2 w-auto h-7 min-w-[100px] bg-zinc-100/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        aria-label="Filter by priority"
      >
        <option value="">Priority: All</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* ── Sort ───────────────────────────────────────────────────────── */}
      <select
        id="filter-sort"
        value={filters.sort}
        onChange={(e) => setFilters({ sort: e.target.value })}
        className="select text-[11px] py-1 px-2 w-auto h-7 min-w-[90px] bg-zinc-100/50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        aria-label="Sort tasks"
      >
        <option value="latest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="dueDate">Sort: Due Date</option>
      </select>

      {/* ── Clear all ──────────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          id="clear-filters-btn"
          onClick={clearAll}
          className="text-[10px] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100
                     hover:underline font-medium px-2 py-1 transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default FilterBar;
