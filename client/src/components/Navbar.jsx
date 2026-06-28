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
    <header className="sticky top-0 z-40 glass border-b divider shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand ─────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-600 shadow-sm">
              <CheckSquare size={20} className="text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                TaskFlow
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                Task Manager
              </span>
            </div>
          </div>

          {/* ── Stats (desktop) ────────────────────────────────────────────── */}
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span>{inProgressCount} in progress</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              <span>{completedCount} done</span>
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              id="dark-mode-toggle"
              onClick={() => setDark((d) => !d)}
              className="btn-ghost p-2 rounded-xl"
              aria-label="Toggle dark mode"
            >
              {dark
                ? <Sun  size={18} className="text-yellow-400" />
                : <Moon size={18} className="text-slate-500" />
              }
            </button>

            {/* New Task */}
            <button
              id="new-task-btn"
              onClick={handleNewTask}
              className="btn-primary"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
