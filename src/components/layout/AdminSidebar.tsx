/* =============================================
   COMPONENT: AdminSidebar
   PATH: src/components/layout/AdminSidebar.tsx
   ============================================= */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Tags, Table, ShoppingBag, CreditCard, BarChart3, Users, Bell, Settings } from 'lucide-react';

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
  return (
    <div className="w-72 h-screen bg-zinc-900 border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl">
            <span className="text-2xl">🍽️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lumina</h1>
            <p className="text-xs text-amber-500 -mt-1">ADMIN PANEL</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'hover:bg-white/10 text-zinc-300'
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