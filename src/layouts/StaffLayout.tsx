/* =============================================
   LAYOUT: StaffLayout
   PATH: src/layouts/StaffLayout.tsx
   ============================================= */

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "../components/layout/StaffSidebar";
import TopNavbar from "../components/layout/TopNavbar";

export default function StaffLayout() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
      <StaffSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          title="Staff Portal"
          isDark={isDark}
          toggleTheme={toggleTheme}
          onMobileMenuClick={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
