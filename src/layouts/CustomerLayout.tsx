import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import Logo from "../components/common/Logo";
import { ThemeToggle } from "../components/common/ThemeToggle";
import { signInCustomer } from "../services/firebase/auth";
import { error as loggerError } from "../lib/logger";

export default function CustomerLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticateCustomer = async () => {
      try {
        await signInCustomer();
      } catch (error) {
        loggerError("Anonymous sign in failed:", error);
      } finally {
        setLoading(false);
      }
    };

    authenticateCustomer();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 py-3 flex items-center justify-between">
          <Logo size="sm" showText textSub="GRAND HOTEL & RESTAURANT" />

          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}
