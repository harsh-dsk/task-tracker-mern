/**
 * errorHandler.js — Global Express error-handling middleware.
 *
 * Must be registered LAST (after all routes) in server.js.
 * Catches any error forwarded via next(error) and returns a
 * structured JSON response with an appropriate HTTP status code.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log the full error in development so the stack is visible in the console
  if (process.env.NODE_ENV !== "production") {
    console.error("🔴 Error:", err);
  }

  // Default status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ── Mongoose bad ObjectId (e.g. malformed _id) ──────────────────────────
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── Mongoose duplicate key ───────────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // ── Mongoose validation errors ───────────────────────────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Expose stack trace only in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
