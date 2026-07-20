import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "../components/layout/StaffSidebar";
import TopNavbar from "../components/layout/TopNavbar";

export default function StaffLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <StaffSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar
          title="Staff Portal"
          onMobileMenuClick={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
