/* =============================================
   COMPONENT: TopNavbar
   PATH: src/components/layout/TopNavbar.tsx
   ============================================= */

import React from 'react';
import { ThemeToggle } from '../common/ThemeToggle';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavbarProps {
  title: string;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function TopNavbar({ title, isDark, toggleTheme }: TopNavbarProps) {
  return (
    <div className="h-16 bg-zinc-900 border-b border-white/10 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <ThemeToggle isDark={isDark} toggle={toggleTheme} />

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right">
            <p className="text-sm font-medium">Manager</p>
            <p className="text-xs text-zinc-500">Admin</p>
          </div>
          <div className="w-9 h-9 bg-amber-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}