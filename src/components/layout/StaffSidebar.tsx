/* =============================================
   COMPONENT: StaffSidebar (Collapsible)
   PATH: src/components/layout/StaffSidebar.tsx
   ============================================= */

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChefHat,
  UserCheck,
  ClipboardList,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const staffMenu = [
  { icon: ChefHat, label: "Kitchen Queue", path: "/staff/kitchen" },
  { icon: ClipboardList, label: "Ready Orders", path: "/staff/ready-orders" },
  { icon: Users, label: "Active Tables", path: "/staff/active-tables" },
  { icon: UserCheck, label: "Waiter Dashboard", path: "/staff/waiter" },
];

interface StaffSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function StaffSidebar({
  isMobileOpen = false,
  onMobileClose,
}: StaffSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <aside
        className={`fixed top-16 left-2 right-2 z-40 mx-auto w-[min(95%,24rem)] max-h-[calc(100vh-6rem)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl backdrop-blur-sm flex flex-col transition-all duration-300 lg:static lg:h-screen lg:rounded-none lg:border-r lg:border-white/10 lg:w-auto lg:flex lg:shadow-none lg:bg-zinc-900 ${isMobileOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto"} ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center w-full" : ""}`}
          >
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex-shrink-0">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold">Staff Portal</h1>
                <p className="text-xs text-amber-500">Bright Day Grand</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={onMobileClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {staffMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-amber-600 text-white"
                    : "hover:bg-white/10 text-zinc-300"
                } ${isCollapsed ? "justify-center" : ""}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          {!isCollapsed && (
            <p className="text-xs text-zinc-500 text-center">
              © 2026 Bright Day Grand
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
