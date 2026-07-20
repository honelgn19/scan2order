import React from "react";
import { ThemeToggle } from "../common/ThemeToggle";
import { Bell, LogOut, Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import { signOutUser } from "../../services/firebase/auth";

interface TopNavbarProps {
  title: string;
  onMobileMenuClick?: () => void;
}

export default function TopNavbar({
  title,
  onMobileMenuClick,
}: TopNavbarProps) {
  return (
    <div className="h-16 bg-background/95 border-b border-border px-4 flex items-center justify-between">
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOutUser()}
          title="Log out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
