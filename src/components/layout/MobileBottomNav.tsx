/* =============================================
   COMPONENT: MobileBottomNav
   PATH: src/components/layout/MobileBottomNav.tsx
   ============================================= */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Menu, ShoppingCart, User } from 'lucide-react';

// Default Export
export default function MobileBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-border md:hidden z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        
        <NavLink 
          to="/customer" 
          className={({ isActive }) => 
            `flex flex-col items-center py-1 px-4 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`
          }
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </NavLink>

        <NavLink 
          to="/customer/menu" 
          className={({ isActive }) => 
            `flex flex-col items-center py-1 px-4 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`
          }
        >
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </NavLink>

        <NavLink 
          to="/customer/cart" 
          className={({ isActive }) => 
            `flex flex-col items-center py-1 px-4 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`
          }
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Cart</span>
        </NavLink>

        <NavLink 
          to="/customer/live-tracking" 
          className={({ isActive }) => 
            `flex flex-col items-center py-1 px-4 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`
          }
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Orders</span>
        </NavLink>
      </div>
    </div>
  );
}