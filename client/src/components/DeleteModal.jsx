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
                 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Panel */}
      <div
        ref={panelRef}
        className="card shadow-modal w-full max-w-md animate-scale-in"
        aria-describedby="delete-modal-desc"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl
                            bg-red-100 dark:bg-red-900/30 flex-shrink-0">
              <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-white"
              >
                Delete Task
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            id="delete-modal-close"
            onClick={handleClose}
            disabled={loading}
            className="btn-ghost p-1.5 -mt-1 -mr-1 rounded-lg"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          <p id="delete-modal-desc" className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              "{taskToDelete.title}"
            </span>
            ? This will permanently remove it from your task list.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4
                        border-t divider">
          <button
            id="delete-modal-cancel"
            onClick={handleClose}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            id="delete-modal-confirm"
            onClick={handleConfirm}
            disabled={loading}
            className="btn-danger min-w-[100px]"
          >
            {loading
              ? <LoadingSpinner size="sm" />
              : "Delete Task"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
