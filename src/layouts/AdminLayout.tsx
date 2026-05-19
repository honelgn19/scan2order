/* =============================================
   LAYOUT: AdminLayout
   PATH: src/layouts/AdminLayout.tsx
   ============================================= */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/layout/AdminSidebar';
import TopNavbar from '../components/layout/TopNavbar';

export default function AdminLayout() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar 
          title="Admin Dashboard" 
          isDark={isDark} 
          toggleTheme={toggleTheme} 
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-zinc-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}