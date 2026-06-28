/**
 * Task.js — Mongoose model for a Task document.
 *
 * Fields:
 *  title       — required string, 3–100 chars
 *  description — optional string, up to 1000 chars
 *  priority    — enum: Low | Medium | High  (default: Medium)
 *  status      — enum: Pending | In Progress | Completed  (default: Pending)
 *  dueDate     — optional Date
 *  createdAt   — auto-set by Mongoose timestamps
 *  updatedAt   — auto-set by Mongoose timestamps
 */

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "Priority must be Low, Medium, or High",
      },
      default: "Medium",
    },

    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        message: "Status must be Pending, In Progress, or Completed",
      },
      default: "Pending",
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

// Index for faster search/sort operations
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
