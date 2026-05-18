/* =============================================
   COMPONENT: StaffSidebar
   PATH: src/components/layout/StaffSidebar.tsx
   ============================================= */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChefHat, UserCheck, ClipboardList, Users } from 'lucide-react';

const staffMenu = [
  { icon: ChefHat, label: "Kitchen Queue", path: "/staff/kitchen" },
  { icon: ClipboardList, label: "Ready Orders", path: "/staff/ready-orders" },
  { icon: Users, label: "Active Tables", path: "/staff/active-tables" },
  { icon: UserCheck, label: "Waiter Dashboard", path: "/staff/waiter" },
];

export default function StaffSidebar() {
  return (
    <div className="w-72 h-screen bg-zinc-900 border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl">
            <span className="text-2xl">👨‍🍳</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Staff Portal</h1>
            <p className="text-xs text-amber-500">Lumina Grand</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {staffMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-amber-600 text-white' : 'hover:bg-white/10 text-zinc-300'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}