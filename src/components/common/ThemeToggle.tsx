/* =============================================
   COMPONENT: ThemeToggle
   PATH: src/components/common/ThemeToggle.tsx
   ============================================= */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

// Named Export (Recommended)
export function ThemeToggle({ isDark, toggle }: ThemeToggleProps) {
  return (
    <Button variant="ghost" size="icon" onClick={toggle}>
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

// Also keep default export for flexibility
export default ThemeToggle;