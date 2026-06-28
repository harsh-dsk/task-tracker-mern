/**
 * taskController.js — CRUD handlers for the Task resource.
 *
 * Exports:
 *  getAllTasks   — GET  /api/tasks
 *  createTask   — POST /api/tasks
 *  updateTask   — PUT  /api/tasks/:id
 *  deleteTask   — DELETE /api/tasks/:id
 *
 * Query params for getAllTasks:
 *  search   — full-text search on title / description
 *  status   — filter by status  (Pending | In Progress | Completed)
 *  priority — filter by priority (Low | Medium | High)
 *  sort     — latest (default) | oldest | dueDate
 */

const Task = require("../models/Task");

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract Mongoose validation error messages into a flat array.
 */
const extractValidationErrors = (err) =>
  Object.values(err.errors).map((e) => e.message);

// ─── GET /api/tasks ───────────────────────────────────────────────────────────

/**
 * @desc  Fetch all tasks with optional search, filter, and sort.
 * @route GET /api/tasks
 * @access Public
 */
const getAllTasks = async (req, res, next) => {
  try {
    const { search, status, priority, sort } = req.query;

    // Build the query object dynamically
    const query = {};

    // ── Search: regex match on title or description (case-insensitive) ─────
    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ title: regex }, { description: regex }];
    }

    // ── Filter by status ───────────────────────────────────────────────────
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (status && validStatuses.includes(status)) {
      query.status = status;
    }

    // ── Filter by priority ─────────────────────────────────────────────────
    const validPriorities = ["Low", "Medium", "High"];
    if (priority && validPriorities.includes(priority)) {
      query.priority = priority;
    }

    // ── Sort ───────────────────────────────────────────────────────────────
    let sortOption = {};
    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "dueDate":
        // Tasks without a due date come last
        sortOption = { dueDate: 1 };
        break;
      case "latest":
      default:
        sortOption = { createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/tasks ──────────────────────────────────────────────────────────

/**
 * @desc  Create a new task.
 * @route POST /api/tasks
 * @access Public
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    // ── Due-date guard: reject past dates ──────────────────────────────────
    if (dueDate) {
      const due = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // compare date only, not time
      if (due < today) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be in the past",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    // Mongoose validation errors → 400
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: extractValidationErrors(error),
      });
    }
    next(error);
  }
};

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────

/**
 * @desc  Update an existing task by ID.
 * @route PUT /api/tasks/:id
 * @access Public
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    // ── Due-date guard ─────────────────────────────────────────────────────
    if (dueDate) {
      const due = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (due < today) {
        return res.status(400).json({
          success: false,
          message: "Due date cannot be in the past",
        });
      }
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, priority, status, dueDate: dueDate || null },
      {
        new: true,           // return the updated document
        runValidators: true, // run schema validators on update
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: extractValidationErrors(error),
      });
    }
    // Invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }
    next(error);
  }
};

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────

/**
 * @desc  Delete a task by ID.
 * @route DELETE /api/tasks/:id
 * @access Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: { id },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID format",
      });
    }
    next(error);
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
