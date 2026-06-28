/**
 * TaskList.jsx — Responsive grid of TaskCards.
 *
 * Handles three states:
 *  1. Loading  → full-page spinner
 *  2. Empty    → EmptyState with contextual messaging
 *  3. Tasks    → responsive 1 / 2 / 3 column grid
 */

import { memo } from "react";
import TaskCard from "./TaskCard";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";
import { useTaskContext } from "../context/TaskContext";

const TaskList = memo(() => {
  const {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    setShowForm,
    setEditTask,
  } = useTaskContext();

  const hasFilters =
    filters.search !== "" || filters.status !== "" || filters.priority !== "";

  if (loading) {
    return <LoadingSpinner size="page" text="Fetching tasks…" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
        <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        <p className="text-sm text-slate-400">Check your network and backend connection.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        filtered={hasFilters}
        onClear={() => setFilters({ search: "", status: "", priority: "", sort: "latest" })}
        onCreate={() => { setEditTask(null); setShowForm(true); }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
});

TaskList.displayName = "TaskList";

export default TaskList;
