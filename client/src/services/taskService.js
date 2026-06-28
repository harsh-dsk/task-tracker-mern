/**
 * taskService.js — Axios instance + API call wrappers.
 *
 * All backend communication goes through here.
 * Base URL is read from VITE_API_URL (set in .env).
 */

import api from "./api";

// ── Task API calls ─────────────────────────────────────────────────────────

/**
 * Fetch all tasks.
 * @param {Object} params - { search, status, priority, sort }
 */
export const fetchTasksAPI = (params = {}) =>
  api.get("/tasks", { params });

/**
 * Create a new task.
 * @param {Object} taskData - { title, description, priority, status, dueDate }
 */
export const createTaskAPI = (taskData) =>
  api.post("/tasks", taskData);

/**
 * Update an existing task.
 * @param {string} id
 * @param {Object} taskData
 */
export const updateTaskAPI = (id, taskData) =>
  api.put(`/tasks/${id}`, taskData);

/**
 * Delete a task by ID.
 * @param {string} id
 */
export const deleteTaskAPI = (id) =>
  api.delete(`/tasks/${id}`);

export default api;
