/* =============================================
   COMPONENT: AdminSidebar (Improved Toggle)
   PATH: src/components/layout/AdminSidebar.tsx
   ============================================= */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, UtensilsCrossed, Tags, Table, 
  ShoppingBag, CreditCard, BarChart3, Users, Bell, Settings, 
  ChevronLeft, ChevronRight, Menu 
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: UtensilsCrossed, label: "Foods", path: "/admin/foods" },
  { icon: Tags, label: "Categories", path: "/admin/categories" },
  { icon: Table, label: "Tables", path: "/admin/tables" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: BarChart3, label: "Reports", path: "/admin/reports" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: Bell, label: "Notifications", path: "/admin/notifications" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-zinc-900 border-r border-white/10 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex-shrink-0">
            <span className="text-2xl">🍽️</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-2xl font-bold">Bright Day</h1>
              <p className="text-xs text-amber-500 -mt-1">ADMIN PANEL</p>
            </div>
          )}
        </div>

        {/* Toggle Button - Always visible */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
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

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/10">
        {!isCollapsed && (
          <p className="text-xs text-zinc-500 text-center">© 2026 Bright Day Grand</p>
        )}
      </div>
    </div>
  );
}