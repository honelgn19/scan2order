/* =============================================
   LAYOUT: AdminLayout
   PATH: src/layouts/AdminLayout.tsx
   ============================================= */

import React, { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import TopNavbar from "../components/layout/TopNavbar";
import { useDarkMode } from "../hooks/useDarkMode";

export default function AdminLayout() {
  const { isDark, toggleTheme } = useDarkMode(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          title="Admin Dashboard"
          isDark={isDark}
          toggleTheme={toggleTheme}
          onMobileMenuClick={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-auto p-6 bg-background">
          <Suspense
            fallback={
              <div className="space-y-6">
                <div className="h-8 w-1/3 rounded-xl bg-zinc-800 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-40 rounded-3xl bg-zinc-900 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
