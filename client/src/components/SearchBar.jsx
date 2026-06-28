/**
 * SearchBar.jsx — Debounced full-text search input.
 *
 * Debounces by 400 ms so we don't fire an API call on every keystroke.
 */

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import useTasks from "../hooks/useTasks";

const SearchBar = () => {
  const { filters, setFilters } = useTasks();
  const [local, setLocal] = useState(filters.search);

  // Keep local state in sync if filters are cleared externally
  useEffect(() => {
    setLocal(filters.search);
  }, [filters.search]);

  // Debounce: push to context 400 ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: local });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  const handleClear = () => {
    setLocal("");
    setFilters({ search: "" });
  };

  return (
    <div className="relative flex-1 min-w-0">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2
                   text-slate-400 dark:text-slate-500 pointer-events-none"
      />
      <input
        id="task-search-input"
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search tasks by title or description…"
        className="input pl-9 pr-9"
        aria-label="Search tasks"
      />
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     text-slate-400 hover:text-slate-600
                     dark:text-slate-500 dark:hover:text-slate-300
                     transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
