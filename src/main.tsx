/* =============================================
   FILE: src/main.tsx
   ============================================= */

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./routes/router";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/sonner";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// =============================================
// Suppress AbortError in development
// =============================================
if (import.meta.env.DEV) {
  const originalError = console.error;

  console.error = (...args) => {
    const message = String(args[0]);

    if (
      message.includes("AbortError") ||
      message.includes("user aborted")
    ) {
      return;
    }

    originalError(...args);
  };
}