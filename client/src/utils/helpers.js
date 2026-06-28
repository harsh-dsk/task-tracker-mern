/**
 * helpers.js — Pure utility functions used across the UI.
 */

// ── Date formatting ─────────────────────────────────────────────────────────

/**
 * Format a date string or Date object to a short readable string.
 * e.g. "Jun 28, 2026"
 */
export const formatDate = (date) => {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

/**
 * Return true if the date is today or in the future.
 */
export const isFuture = (date) => {
  if (!date) return true;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
};

/**
 * Return true if the due date has passed and the task is not completed.
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "Completed") return false;
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
};

/**
 * Convert a JS Date to the value accepted by <input type="date"> (YYYY-MM-DD).
 */
export const toInputDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Today's date in YYYY-MM-DD format — used as the `min` on due-date inputs.
 */
export const todayInputDate = () => {
  return new Date().toISOString().split("T")[0];
};

// ── Priority helpers ────────────────────────────────────────────────────────

export const priorityConfig = {
  High:   { label: "High",   color: "bg-red-100    text-red-700    dark:bg-red-900/40    dark:text-red-400",    dot: "bg-red-500"    },
  Medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400", dot: "bg-yellow-500" },
  Low:    { label: "Low",    color: "bg-green-100  text-green-700  dark:bg-green-900/40  dark:text-green-400",  dot: "bg-green-500"  },
};

export const statusConfig = {
  "Pending":     { label: "Pending",     color: "bg-slate-100  text-slate-600  dark:bg-slate-800    dark:text-slate-400",  dot: "bg-slate-400"  },
  "In Progress": { label: "In Progress", color: "bg-blue-100   text-blue-700   dark:bg-blue-900/40   dark:text-blue-400",   dot: "bg-blue-500"   },
  "Completed":   { label: "Completed",   color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400", dot: "bg-emerald-500" },
};

/**
 * Get Tailwind classes for a priority badge.
 */
export const getPriorityClasses = (priority) =>
  priorityConfig[priority]?.color ?? "bg-slate-100 text-slate-600";

/**
 * Get Tailwind classes for a status badge.
 */
export const getStatusClasses = (status) =>
  statusConfig[status]?.color ?? "bg-slate-100 text-slate-600";
