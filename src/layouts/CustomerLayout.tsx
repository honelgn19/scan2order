/* =============================================
   FILE: src/layouts/CustomerLayout.tsx
   ============================================= */

import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { signInCustomer } from "../services/firebase/auth";

export default function CustomerLayout() {
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const authenticateCustomer = async () => {
      try {
        await signInCustomer();
      } catch (error) {
        console.error("Anonymous sign in failed:", error);
      } finally {
        setLoading(false);
      }
    };

    authenticateCustomer();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-lg border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
              🍽️
            </div>

            <div>
              <h1 className="text-xl font-bold">Lumina</h1>
              <p className="text-[10px] text-amber-500">
                Grand Restaurant
              </p>
            </div>
          </div>

          <ThemeToggle
            isDark={isDark}
            toggle={toggleTheme}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}