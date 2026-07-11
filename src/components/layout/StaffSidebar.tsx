/* =============================================
   COMPONENT: StaffSidebar (Collapsible)
   PATH: src/components/layout/StaffSidebar.tsx
   ============================================= */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChefHat, UserCheck, ClipboardList, Users, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';

const staffMenu = [
  { icon: ChefHat, label: "Kitchen Queue", path: "/staff/kitchen" },
  { icon: ClipboardList, label: "Ready Orders", path: "/staff/ready-orders" },
  { icon: Users, label: "Active Tables", path: "/staff/active-tables" },
  { icon: UserCheck, label: "Waiter Dashboard", path: "/staff/waiter" },
];

export default function StaffSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-zinc-900 border-r border-white/10 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
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

        {/* Toggle Button - Always Visible */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {staffMenu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'hover:bg-white/10 text-zinc-300'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed && (
          <p className="text-xs text-zinc-500 text-center">© 2026 Bright Day Grand</p>
        )}
      </div>
    </div>
  );
}