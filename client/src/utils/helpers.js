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
  High:   { label: "High",   color: "border border-red-200/55 text-red-600 bg-red-50/30 dark:border-red-950/60 dark:text-red-400 dark:bg-red-950/10", dot: "bg-red-500" },
  Medium: { label: "Medium", color: "border border-amber-200/55 text-amber-700 bg-amber-50/20 dark:border-amber-950/60 dark:text-amber-400 dark:bg-amber-950/10", dot: "bg-amber-500" },
  Low:    { label: "Low",    color: "border border-zinc-200 text-zinc-650 bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:bg-zinc-900/30", dot: "bg-zinc-400" },
};

export const statusConfig = {
  "Pending":     { label: "Pending",     color: "border border-zinc-200 text-zinc-500 bg-zinc-50/50 dark:border-zinc-800 dark:text-zinc-400 dark:bg-zinc-900/20", dot: "bg-zinc-400" },
  "In Progress": { label: "In Progress", color: "border border-blue-200/55 text-blue-600 bg-blue-50/30 dark:border-blue-950/60 dark:text-blue-400 dark:bg-blue-950/10", dot: "bg-blue-500" },
  "Completed":   { label: "Completed",   color: "border border-emerald-200/55 text-emerald-600 bg-emerald-50/20 dark:border-emerald-950/60 dark:text-emerald-400 dark:bg-emerald-950/10", dot: "bg-emerald-500" },
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
