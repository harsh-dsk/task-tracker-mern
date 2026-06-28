/**
 * Navbar.jsx — Top navigation bar.
 *
 * Features:
 *  - Brand logo + name
 *  - "New Task" button (opens TaskForm)
 *  - Dark mode toggle (persisted to localStorage)
 *  - Responsive: collapses gracefully on mobile
 */

import { useEffect, useState } from "react";
import { CheckSquare, Moon, Sun, Plus } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";

const Navbar = () => {
  const { setShowForm, setEditTask, tasks } = useTaskContext();

  // ── Dark mode ─────────────────────────────────────────────────────────────
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleNewTask = () => {
    setEditTask(null);   // ensure we're in "create" mode
    setShowForm(true);
  };

  const completedCount  = tasks.filter((t) => t.status === "Completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "In Progress").length;

  return (
    <header className="sticky top-0 z-40 glass border-b divider">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">

          {/* ── Brand ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-zinc-900 dark:bg-zinc-100">
              <CheckSquare size={13} className="text-white dark:text-zinc-900" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-semibold text-xs text-zinc-900 dark:text-white tracking-tight">
                TaskFlow
              </span>
              <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Manager
              </span>
            </div>
          </div>

          {/* ── Stats (desktop) ────────────────────────────────────────────── */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
              <span>{inProgressCount} in progress</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-800">|</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>{completedCount} completed</span>
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-1.5">
            {/* Dark mode toggle */}
            <button
              id="dark-mode-toggle"
              onClick={() => setDark((d) => !d)}
              className="btn-ghost p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
              aria-label="Toggle dark mode"
            >
              {dark
                ? <Sun  size={14} className="text-amber-500" />
                : <Moon size={14} className="text-zinc-500" />
              }
            </button>

            {/* New Task */}
            <button
              id="new-task-btn"
              onClick={handleNewTask}
              className="btn-primary"
            >
              <Plus size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">New task</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
