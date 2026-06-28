/**
 * TaskCard.jsx — Individual task card displayed in the grid.
 *
 * Shows: title, description, priority badge, status badge,
 *        due date (with overdue warning), created date, edit + delete actions.
 *
 * Hover: lifts with shadow transition and subtle scale.
 * Mobile: action buttons are always visible (no hover available on touch).
 */

import { memo } from "react";
import { Calendar, Clock, Pencil, Trash2, AlertCircle } from "lucide-react";
import {
  getPriorityClasses,
  getStatusClasses,
  formatDate,
  isOverdue,
  priorityConfig,
  statusConfig,
} from "../utils/helpers";
import { useTaskContext } from "../context/TaskContext";

const TaskCard = memo(({ task }) => {
  const { setEditTask, setShowForm, setTaskToDelete } = useTaskContext();

  const overdue = isOverdue(task.dueDate, task.status);

  const handleEdit = () => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleDelete = () => setTaskToDelete(task);

  return (
    <article
      className="card card-hover flex flex-col gap-4 p-5 group animate-fade-in"
      aria-label={`Task: ${task.title}`}
    >
      {/* ── Top row: badges + actions ──────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        {/* Badges */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Priority */}
          <span className={`badge ${getPriorityClasses(task.priority)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[task.priority]?.dot}`} />
            {task.priority}
          </span>
          {/* Status */}
          <span className={`badge ${getStatusClasses(task.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[task.status]?.dot}`} />
            {task.status}
          </span>
        </div>

        {/* Action buttons — always visible on mobile, hover-only on desktop */}
        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                        transition-opacity duration-200 flex-shrink-0">
          <button
            id={`edit-task-${task._id}`}
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600
                       hover:bg-primary-50 dark:hover:bg-primary-900/30
                       dark:hover:text-primary-400 transition-colors"
            aria-label={`Edit ${task.title}`}
          >
            <Pencil size={14} />
          </button>
          <button
            id={`delete-task-${task._id}`}
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600
                       hover:bg-red-50 dark:hover:bg-red-900/30
                       dark:hover:text-red-400 transition-colors"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div className="flex-1">
        <h3
          className={`font-semibold text-base leading-snug mb-1.5
                      ${task.status === "Completed"
                        ? "line-through text-slate-400 dark:text-slate-500"
                        : "text-slate-900 dark:text-white"}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed
                        line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* ── Footer: dates ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 pt-3 border-t divider">
        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1.5 text-xs font-medium
                          ${overdue
                            ? "text-red-500 dark:text-red-400"
                            : "text-slate-400 dark:text-slate-500"}`}
          >
            {overdue
              ? <AlertCircle size={13} className="flex-shrink-0" />
              : <Calendar    size={13} className="flex-shrink-0" />
            }
            <span>{overdue ? "Overdue · " : "Due · "}{formatDate(task.dueDate)}</span>
          </div>
        )}
        {/* Created at */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <Clock size={12} className="flex-shrink-0" />
          <span>Created {formatDate(task.createdAt)}</span>
        </div>
      </div>
    </article>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;

