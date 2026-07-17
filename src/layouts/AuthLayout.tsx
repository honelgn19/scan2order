/* =============================================
   LAYOUT: AuthLayout
   PATH: src/layouts/AuthLayout.tsx
   ============================================= */

import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { useDarkMode } from "../hooks/useDarkMode";

export default function AuthLayout() {
  const { isDark, toggleTheme } = useDarkMode(true);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>

      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
