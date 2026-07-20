import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/common/ThemeToggle";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
