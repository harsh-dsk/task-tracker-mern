/**
 * App.jsx — Root application component.
 *
 * Provides:
 *  - TaskProvider (global state)
 *  - Toaster (react-hot-toast)
 *  - Persistent dark mode (class applied by Navbar on mount)
 *  - Renders Navbar, Home page, TaskForm overlay, DeleteModal overlay
 */

import { Toaster } from "react-hot-toast";
import { TaskProvider } from "./context/TaskContext";
import Navbar      from "./components/Navbar";
import TaskForm    from "./components/TaskForm";
import DeleteModal from "./components/DeleteModal";
import Home        from "./pages/Home";

const App = () => (
  <TaskProvider>
    {/* ── Toast notifications ─────────────────────────────────────────── */}
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.15)",
          background: "var(--toast-bg, #ffffff)",
          color: "var(--toast-color, #1e293b)",
        },
        success: {
          iconTheme: { primary: "#10b981", secondary: "#ffffff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
        },
      }}
    />

    {/* ── Layout ──────────────────────────────────────────────────────── */}
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <Home />
    </div>

    {/* ── Overlays (rendered at root to avoid z-index issues) ─────────── */}
    <TaskForm />
    <DeleteModal />
  </TaskProvider>
);

export default App;
