/**
 * server.js — Express application entry point.
 *
 * Responsibilities:
 *  1. Load environment variables (dotenv)
 *  2. Connect to MongoDB Atlas
 *  3. Configure middleware (cors, json parsing)
 *  4. Mount API routes
 *  5. Register global error handler
 *  6. Start the HTTP server
 */

const path = require("path");
const dotenv = require("dotenv");

// ── Load .env with an explicit path so it works regardless of cwd ────────────
// Using __dirname ensures the .env next to server.js is always found,
// even if `npm run dev` is invoked from a parent directory.
dotenv.config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");



const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorHandler");

// ── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ── Initialise Express ───────────────────────────────────────────────────────
const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow the configured client origin (e.g. http://localhost:5173) plus
// the production frontend URL when deployed.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' is not allowed`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ── Security headers (helmet) ─────────────────────────────────────────────────
app.use(helmet());

// ── Rate limiting — 100 requests per 15 minutes per IP ───────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" })); // Guard against large payloads
app.use(express.urlencoded({ extended: true }));

// ── Health-check endpoint ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Tracker API is running",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/tasks", taskRoutes);

// ── 404 handler for unmatched routes ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀  Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
