import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileBottomNav from '../components/layout/MobileBottomNav';   // ← Default import (no curly braces)
import { ThemeToggle } from '../components/common/ThemeToggle';

export default function CustomerLayout() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
            🍽️
          </div>
          <div>
            <h1 className="font-bold text-xl">Lumina</h1>
            <p className="text-xs text-amber-500 -mt-1">Grand Restaurant</p>
          </div>
        </div>
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>

      <main className="pb-20">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}