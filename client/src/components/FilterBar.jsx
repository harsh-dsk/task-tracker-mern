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
    <div className="flex flex-wrap items-center gap-2">

      {/* ── Filter icon (visual only) ───────────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mr-1">
        <SlidersHorizontal size={15} />
        <span className="text-xs font-medium hidden sm:inline">Filters</span>
      </div>

      {/* ── Status ─────────────────────────────────────────────────────── */}
      <select
        id="filter-status"
        value={filters.status}
        onChange={(e) => setFilters({ status: e.target.value })}
        className="select text-sm py-2 px-3 w-auto min-w-[130px]"
        aria-label="Filter by status"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* ── Priority ───────────────────────────────────────────────────── */}
      <select
        id="filter-priority"
        value={filters.priority}
        onChange={(e) => setFilters({ priority: e.target.value })}
        className="select text-sm py-2 px-3 w-auto min-w-[135px]"
        aria-label="Filter by priority"
      >
        <option value="">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* ── Sort ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown size={13} className="text-slate-400 dark:text-slate-500" />
        <select
          id="filter-sort"
          value={filters.sort}
          onChange={(e) => setFilters({ sort: e.target.value })}
          className="select text-sm py-2 px-3 w-auto min-w-[120px]"
          aria-label="Sort tasks"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      {/* ── Clear all ──────────────────────────────────────────────────── */}
      {hasActiveFilters && (
        <button
          id="clear-filters-btn"
          onClick={clearAll}
          className="text-xs text-primary-600 dark:text-primary-400
                     hover:underline font-medium ml-1 transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default FilterBar;
