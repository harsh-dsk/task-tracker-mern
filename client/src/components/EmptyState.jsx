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
  <div className="flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
    {/* Illustration */}
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-3xl bg-primary-50 dark:bg-primary-900/20
                      flex items-center justify-center shadow-inner">
        {filtered
          ? <SearchX size={40} className="text-primary-400 dark:text-primary-500" strokeWidth={1.5} />
          : <ClipboardList size={40} className="text-primary-400 dark:text-primary-500" strokeWidth={1.5} />
        }
      </div>
      {/* Decorative dots */}
      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-yellow-300 dark:bg-yellow-600 opacity-70" />
      <span className="absolute -bottom-1 -left-2 w-3 h-3 rounded-full bg-primary-300 dark:bg-primary-700 opacity-70" />
    </div>

    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
      {filtered ? "No tasks match your filters" : "No tasks yet"}
    </h3>
    <p className="text-sm text-slate-400 dark:text-slate-500 text-center max-w-xs mb-6">
      {filtered
        ? "Try adjusting your search or filters to find what you're looking for."
        : "Create your first task and start tracking your work efficiently."
      }
    </p>

    <div className="flex items-center gap-3">
      {filtered && onClear && (
        <button
          id="empty-clear-filters-btn"
          onClick={onClear}
          className="btn-secondary text-sm"
        >
          Clear filters
        </button>
      )}
      {onCreate && (
        <button
          id="empty-create-task-btn"
          onClick={onCreate}
          className="btn-primary text-sm"
        >
          {filtered ? "Create new task" : "Create your first task"}
        </button>
      )}
    </div>
  </div>
);

export default EmptyState;
