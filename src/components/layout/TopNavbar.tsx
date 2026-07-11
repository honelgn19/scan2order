/* =============================================
   COMPONENT: TopNavbar (Mobile Optimized)
   PATH: src/components/layout/TopNavbar.tsx
   ============================================= */

import React from "react";
import { ThemeToggle } from "../common/ThemeToggle";
import { Bell, Menu } from "lucide-react";
import { Button } from "../../components/ui/button";

interface TopNavbarProps {
  title: string;
  isDark: boolean;
  toggleTheme: () => void;
  onMobileMenuClick?: () => void;
}

export default function TopNavbar({
  title,
  isDark,
  toggleTheme,
  onMobileMenuClick,
}: TopNavbarProps) {
  return (
    <div className="h-16 bg-zinc-900 border-b border-white/10 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMobileMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      </div>
    </div>
  );
}
