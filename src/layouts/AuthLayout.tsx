/* =============================================
   LAYOUT: AuthLayout
   PATH: src/layouts/AuthLayout.tsx
   ============================================= */

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '../components/common/ThemeToggle';

export default function AuthLayout() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>
      
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}