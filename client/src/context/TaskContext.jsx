/**
 * TaskContext.jsx — Global state for tasks, filters, and UI flags.
 *
 * Provides:
 *  - tasks[]          current task list (from backend)
 *  - loading          true while a fetch/mutation is in flight
 *  - error            last error message (string | null)
 *  - filters          { search, status, priority, sort }
 *  - setFilters()     update any filter key
 *  - fetchTasks()     reload from backend
 *  - createTask()     POST → optimistic toast
 *  - updateTask()     PUT  → optimistic toast
 *  - deleteTask()     DELETE → optimistic toast
 *  - editTask         task being edited (null = form closed / create mode)
 *  - setEditTask()
 *  - showForm         whether the create/edit modal is open
 *  - setShowForm()
 *  - taskToDelete     task pending delete confirmation (null = modal closed)
 *  - setTaskToDelete()
 */

import { createContext, useContext, useCallback, useReducer, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  fetchTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
} from "../services/taskService";

// ── Reducer ─────────────────────────────────────────────────────────────────

const initialState = {
  tasks:   [],
  loading: false,
  error:   null,
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":  return { ...state, loading: true,  error: null };
    case "FETCH_SUCCESS":return { ...state, loading: false, tasks: action.payload };
    case "FETCH_ERROR":  return { ...state, loading: false, error: action.payload };
    case "MUTATE_START": return { ...state, loading: true };
    case "MUTATE_DONE":  return { ...state, loading: false };
    default:             return state;
  }
};

// ── Context ──────────────────────────────────────────────────────────────────

const TaskContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────

export const TaskProvider = ({ children }) => {
  const [state,    dispatch]        = useReducer(taskReducer, initialState);
  const [filters,  setFiltersState] = useState({ search: "", status: "", priority: "", sort: "latest" });
  const [editTask,      setEditTask]      = useState(null);   // task obj or null
  const [showForm,      setShowForm]      = useState(false);
  const [taskToDelete,  setTaskToDelete]  = useState(null);   // task obj or null

  // Keep a ref in sync with filters so fetchTasks can read the latest value
  // without needing to be in its own dependency array (prevents double-fetches).
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // ── Helpers ────────────────────────────────────────────────────────────────

  const setFilters = useCallback((patch) => {
    setFiltersState((prev) => ({ ...prev, ...patch }));
  }, []);

  // ── CRUD operations ────────────────────────────────────────────────────────

  const fetchTasks = useCallback(async (overrideFilters) => {
    dispatch({ type: "FETCH_START" });
    try {
      const params = overrideFilters ?? filtersRef.current;
      // Remove empty-string params so backend ignores them
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "")
      );
      const res = await fetchTasksAPI(clean);
      dispatch({ type: "FETCH_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
      toast.error(err.message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTask = useCallback(async (taskData) => {
    dispatch({ type: "MUTATE_START" });
    try {
      await createTaskAPI(taskData);
      toast.success("Task created!");
      await fetchTasks();
      setShowForm(false);
    } catch (err) {
      dispatch({ type: "MUTATE_DONE" });
      toast.error(err.message);
      throw err; // let the form display field-level errors if needed
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id, taskData) => {
    dispatch({ type: "MUTATE_START" });
    try {
      await updateTaskAPI(id, taskData);
      toast.success("Task updated!");
      await fetchTasks();
      setShowForm(false);
      setEditTask(null);
    } catch (err) {
      dispatch({ type: "MUTATE_DONE" });
      toast.error(err.message);
      throw err;
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    dispatch({ type: "MUTATE_START" });
    try {
      await deleteTaskAPI(id);
      toast.success("Task deleted.");
      setTaskToDelete(null);
      await fetchTasks();
    } catch (err) {
      dispatch({ type: "MUTATE_DONE" });
      toast.error(err.message);
    }
  }, [fetchTasks]);

  // ── Value ──────────────────────────────────────────────────────────────────

  const value = {
    ...state,
    filters,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    editTask,
    setEditTask,
    showForm,
    setShowForm,
    taskToDelete,
    setTaskToDelete,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used within <TaskProvider>");
  return ctx;
};

export default TaskContext;
