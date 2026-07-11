/* =============================================
   FILE: src/components/ProtectedRoute.tsx
   ============================================= */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "kitchen" | "waiter" | "cashier")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  // Wait until Firebase finishes checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Anonymous users (customers) cannot access staff/admin pages
  if (user.isAnonymous) {
    return <Navigate to="/customer" replace />;
  }

  // Role check
  if (
    allowedRoles &&
    (!role || !allowedRoles.includes(role))
  ) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}