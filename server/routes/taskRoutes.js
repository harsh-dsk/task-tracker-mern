/**
 * taskRoutes.js — Express router for the /api/tasks resource.
 */

const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// GET    /api/tasks        — list all tasks (search / filter / sort via query params)
// POST   /api/tasks        — create a new task
router.route("/").get(getAllTasks).post(createTask);

// PUT    /api/tasks/:id    — update a task
// DELETE /api/tasks/:id    — delete a task
router.route("/:id").put(updateTask).delete(deleteTask);

module.exports = router;
