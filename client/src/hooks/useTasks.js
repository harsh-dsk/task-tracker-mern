/**
 * useTasks.js — Custom hook that exposes all task-related state and actions
 * from TaskContext with a clean, component-friendly API.
 *
 * Also encapsulates the filter-change → re-fetch side effect so components
 * don't need to call fetchTasks manually on every filter update.
 */

import { useEffect, useRef } from "react";
import { useTaskContext } from "../context/TaskContext";

const useTasks = () => {
  const ctx = useTaskContext();
  const isFirstRender = useRef(true);

  // Re-fetch whenever any filter changes (skip the very first mount — Home
  // triggers that initial fetch itself, so we don't fire twice).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    ctx.fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.filters]);

  return ctx;
};

export default useTasks;
