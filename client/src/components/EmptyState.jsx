/**
 * EmptyState.jsx — Shown when no tasks match current filters.
 *
 * Props:
 *  filtered  — true when filters/search are active (vs truly no tasks)
 *  onClear   — callback to clear filters
 *  onCreate  — callback to open the create-task modal
 */

import { ClipboardList, SearchX } from "lucide-react";

const EmptyState = ({ filtered = false, onClear, onCreate }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in text-center">
    <div className="text-zinc-300 dark:text-zinc-700 mb-3">
      {filtered ? <SearchX size={24} strokeWidth={1.5} /> : <ClipboardList size={24} strokeWidth={1.5} />}
    </div>

    <h3 className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mb-1">
      {filtered ? "No matching tasks" : "No tasks yet"}
    </h3>
    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-[220px] mb-4">
      {filtered
        ? "Try adjusting search queries or filter selectors to find tasks."
        : "Get started by adding your first task to the dashboard."
      }
    </p>

    <div className="flex items-center gap-2">
      {filtered && onClear && (
        <button
          id="empty-clear-filters-btn"
          onClick={onClear}
          className="btn-secondary"
        >
          Reset filters
        </button>
      )}
      {onCreate && (
        <button
          id="empty-create-task-btn"
          onClick={onCreate}
          className="btn-primary"
        >
          {filtered ? "Create task" : "Create first task"}
        </button>
      )}
    </div>
  </div>
);

export default EmptyState;
