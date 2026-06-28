/**
 * DeleteModal.jsx — Confirmation dialog before deleting a task.
 *
 * Renders as a portal-style overlay with a smooth scaleIn animation.
 * Closes on Escape key or clicking the backdrop.
 */

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import LoadingSpinner from "./LoadingSpinner";

const DeleteModal = () => {
  const { taskToDelete, setTaskToDelete, deleteTask, loading } = useTaskContext();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setTaskToDelete(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setTaskToDelete]);

  // Prevent background scroll while open
  useEffect(() => {
    document.body.style.overflow = taskToDelete ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [taskToDelete]);

  // Focus trap
  const panelRef = useRef(null);
  useEffect(() => {
    if (!taskToDelete) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    const trap = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", trap);
    first?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [taskToDelete]);

  if (!taskToDelete) return null;

  const handleConfirm = () => deleteTask(taskToDelete._id);
  const handleClose   = () => setTaskToDelete(null);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Panel */}
      <div
        ref={panelRef}
        className="card bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl w-full max-w-sm animate-scale-in rounded-lg"
        aria-describedby="delete-modal-desc"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2.5 border-b divider">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-500" />
            <h2
              id="delete-modal-title"
              className="text-xs font-semibold text-zinc-900 dark:text-zinc-50"
            >
              Delete Task
            </h2>
          </div>
          <button
            id="delete-modal-close"
            onClick={handleClose}
            disabled={loading}
            className="btn-ghost p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <p id="delete-modal-desc" className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-zinc-850 dark:text-zinc-200">
              "{taskToDelete.title}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-3 border-t divider bg-zinc-50/50 dark:bg-zinc-900/10">
          <button
            id="delete-modal-cancel"
            onClick={handleClose}
            disabled={loading}
            className="btn-secondary h-8 py-0 px-3.5"
          >
            Cancel
          </button>
          <button
            id="delete-modal-confirm"
            onClick={handleConfirm}
            disabled={loading}
            className="btn-danger min-w-[80px] h-8 py-0 px-3.5"
          >
            {loading ? <LoadingSpinner size="sm" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
