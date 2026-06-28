/**
 * TaskForm.jsx — Create / Edit task modal with full validation.
 *
 * Validation rules:
 *  - Title: required, min 3 chars
 *  - Due date: cannot be in the past
 *
 * Mode is determined by whether `editTask` in context is set:
 *  - null   → "Create Task" mode
 *  - object → "Edit Task" mode (pre-fills all fields)
 *
 * Closes on Escape or clicking the backdrop.
 * Disables submit while loading.
 */

import { useEffect, useReducer, useCallback, useRef } from "react";
import { X, Save, Plus, AlertCircle } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import LoadingSpinner from "./LoadingSpinner";
import { todayInputDate, toInputDate } from "../utils/helpers";

// ── Form state reducer ───────────────────────────────────────────────────────

const INITIAL_FIELDS = {
  title:       "",
  description: "",
  priority:    "Medium",
  status:      "Pending",
  dueDate:     "",
};

const INITIAL_ERRORS = {
  title:   "",
  dueDate: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        fields: { ...state.fields, [action.name]: action.value },
        errors: { ...state.errors, [action.name]: "" }, // clear field error on change
      };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.errors } };
    case "RESET":
      return { fields: action.fields ?? INITIAL_FIELDS, errors: INITIAL_ERRORS };
    default:
      return state;
  }
};

// ── Component ────────────────────────────────────────────────────────────────

const TaskForm = () => {
  const {
    showForm, setShowForm,
    editTask, setEditTask,
    createTask, updateTask,
    loading,
  } = useTaskContext();

  const isEdit = Boolean(editTask);

  const [{ fields, errors }, dispatch] = useReducer(formReducer, {
    fields: INITIAL_FIELDS,
    errors: INITIAL_ERRORS,
  });

  // ── Pre-fill when editing ────────────────────────────────────────────────
  useEffect(() => {
    if (showForm) {
      dispatch({
        type: "RESET",
        fields: isEdit
          ? {
              title:       editTask.title       ?? "",
              description: editTask.description ?? "",
              priority:    editTask.priority    ?? "Medium",
              status:      editTask.status      ?? "Pending",
              dueDate:     editTask.dueDate ? toInputDate(editTask.dueDate) : "",
            }
          : INITIAL_FIELDS,
      });
    }
  }, [showForm, editTask, isEdit]);
  // ── Helpers ──────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    if (loading) return;
    setShowForm(false);
    setEditTask(null);
  }, [loading, setShowForm, setEditTask]);

  const handleChange = (e) =>
    dispatch({ type: "SET_FIELD", name: e.target.name, value: e.target.value });

  // ── Close on Escape (uses ref to avoid stale closure over `loading`) ───────
  const handleCloseRef = useRef(handleClose);
  handleCloseRef.current = handleClose;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleCloseRef.current(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Focus trap — keep keyboard focus inside the modal while open ──────────
  const panelRef = useRef(null);
  useEffect(() => {
    if (!showForm) return;
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
    // Move focus into the modal on open
    first?.focus();
    return () => document.removeEventListener("keydown", trap);
  }, [showForm]);

  // ── Scroll lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!fields.title.trim()) {
      errs.title = "Title is required.";
    } else if (fields.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters.";
    }
    if (fields.dueDate) {
      const due   = new Date(fields.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (due < today) errs.dueDate = "Due date cannot be in the past.";
    }
    if (Object.keys(errs).length) {
      dispatch({ type: "SET_ERRORS", errors: errs });
      return false;
    }
    return true;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title:       fields.title.trim(),
      description: fields.description.trim(),
      priority:    fields.priority,
      status:      fields.status,
      dueDate:     fields.dueDate || null,
    };

    try {
      if (isEdit) {
        await updateTask(editTask._id, payload);
      } else {
        await createTask(payload);
      }
    } catch {
      // Error already handled + toasted inside context
    }
  };

  if (!showForm) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      {/* Panel */}
      <div ref={panelRef} className="card bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl w-full max-w-md animate-scale-in max-h-[85vh] flex flex-col rounded-lg">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between p-4 pb-3 border-b divider flex-shrink-0">
          <div>
            <h2
              id="task-form-title"
              className="text-xs font-semibold text-zinc-900 dark:text-zinc-50"
            >
              {isEdit ? "Edit Task" : "Create Task"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="btn-ghost p-1 rounded-md text-zinc-450 hover:text-zinc-900 dark:hover:text-zinc-100"
            aria-label="Close form"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <form
          id="task-form"
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col flex-1 overflow-y-auto"
        >
          <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">

            {/* Title */}
            <div>
              <label htmlFor="task-title" className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="task-title"
                name="title"
                type="text"
                value={fields.title}
                onChange={handleChange}
                placeholder="Task title..."
                className={`input ${errors.title ? "input-error" : ""}`}
                maxLength={100}
                autoFocus
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title ? (
                  <p id="title-error" className="flex items-center gap-1 text-[10px] text-red-550 dark:text-red-400 font-medium">
                    {errors.title}
                  </p>
                ) : (
                  <span />
                )}
                <p className="text-[9px] text-zinc-400 dark:text-zinc-500">
                  {fields.title.length}/100
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="task-description" className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                id="task-description"
                name="description"
                value={fields.description}
                onChange={handleChange}
                placeholder="Add details..."
                rows={3}
                maxLength={1000}
                className="input resize-none"
              />
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 mt-1 text-right">
                {fields.description.length}/1000
              </p>
            </div>

            {/* Priority + Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="task-priority" className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  value={fields.priority}
                  onChange={handleChange}
                  className="select h-8 text-xs"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="task-status" className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  id="task-status"
                  name="status"
                  value={fields.status}
                  onChange={handleChange}
                  className="select h-8 text-xs"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="task-due-date" className="block text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                id="task-due-date"
                name="dueDate"
                type="date"
                value={fields.dueDate}
                onChange={handleChange}
                min={todayInputDate()}
                className={`input ${errors.dueDate ? "input-error" : ""}`}
                aria-invalid={Boolean(errors.dueDate)}
                aria-describedby={errors.dueDate ? "duedate-error" : undefined}
              />
              {errors.dueDate && (
                <p id="duedate-error" className="flex items-center gap-1 text-[10px] text-red-550 dark:text-red-400 mt-1 font-medium">
                  {errors.dueDate}
                </p>
              )}
            </div>

          </div>

          {/* ── Footer ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-2 p-3 border-t divider flex-shrink-0 bg-zinc-50/50 dark:bg-zinc-900/10">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-secondary h-8 py-0 px-3.5"
            >
              Cancel
            </button>
            <button
              id="task-form-submit"
              type="submit"
              disabled={loading}
              className="btn-primary min-w-[100px] h-8 py-0 px-3.5"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : isEdit ? (
                <><Save size={12} /> Update</>
              ) : (
                <><Plus size={12} /> Create</>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default TaskForm;
