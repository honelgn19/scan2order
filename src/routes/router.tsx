/* =============================================
   FILE: src/routes/router.tsx
   ============================================= */

import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Protected Route
import ProtectedRoute from "../components/ProtectedRoute";

// Layouts
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const CustomerLayout = lazy(() => import("../layouts/CustomerLayout"));
const StaffLayout = lazy(() => import("../layouts/StaffLayout"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));

// Auth Pages
const Login = lazy(() => import("../pages/auth/Login"));

// Customer Pages
const QRLandingPage = lazy(() => import("../pages/customer/QRLandingPage"));
const DigitalMenuPage = lazy(() => import("../pages/customer/DigitalMenuPage"));
const CartPage = lazy(() => import("../pages/customer/CartPage"));
const CheckoutPage = lazy(() => import("../pages/customer/CheckoutPage"));
const OrderSuccessPage = lazy(
  () => import("../pages/customer/OrderSuccessPage"),
);
const LiveOrderTrackingPage = lazy(
  () => import("../pages/customer/LiveOrderTrackingPage"),
);

// Staff Pages
const KitchenDashboard = lazy(() => import("../pages/staff/KitchenDashboard"));
const WaiterDashboard = lazy(() => import("../pages/staff/WaiterDashboard"));
const ReadyOrdersPage = lazy(() => import("../pages/staff/ReadyOrdersPage"));
const ActiveTablesPage = lazy(() => import("../pages/staff/ActiveTablesPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const FoodManagement = lazy(() => import("../pages/admin/FoodManagement"));
const CategoryManagement = lazy(
  () => import("../pages/admin/CategoryManagement"),
);
const TableManagement = lazy(() => import("../pages/admin/TableManagement"));
const OrdersManagement = lazy(() => import("../pages/admin/OrdersManagement"));
const PaymentsManagement = lazy(
  () => import("../pages/admin/PaymentsManagement"),
);
const ReportsAnalytics = lazy(() => import("../pages/admin/ReportsAnalytics"));
const UserManagement = lazy(() => import("../pages/admin/UserManagement"));
const NotificationsPage = lazy(
  () => import("../pages/admin/NotificationsPage"),
);
const SettingsPage = lazy(() => import("../pages/admin/SettingsPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      /* ==========================
         AUTH
      ========================== */

      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
        ],
      },

      /* ==========================
         CUSTOMER
      ========================== */

      {
        path: "customer",
        element: (
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <QRLandingPage />,
          },
          {
            path: "menu",
            element: <DigitalMenuPage />,
          },
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "order-success",
            element: <OrderSuccessPage />,
          },
          {
            path: "live-tracking",
            element: <LiveOrderTrackingPage />,
          },
        ],
      },

      /* ==========================
         STAFF
      ========================== */

      {
        path: "staff",
        element: (
          <ProtectedRoute
            allowedRoles={["admin", "kitchen", "waiter", "cashier"]}
          >
            <StaffLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "kitchen",
            element: (
              <ProtectedRoute allowedRoles={["admin", "kitchen"]}>
                <KitchenDashboard />
              </ProtectedRoute>
            ),
          },

          {
            path: "waiter",
            element: (
              <ProtectedRoute allowedRoles={["admin", "waiter"]}>
                <WaiterDashboard />
              </ProtectedRoute>
            ),
          },

          {
            path: "ready-orders",
            element: (
              <ProtectedRoute allowedRoles={["admin", "waiter"]}>
                <ReadyOrdersPage />
              </ProtectedRoute>
            ),
          },

          {
            path: "active-tables",
            element: (
              <ProtectedRoute allowedRoles={["admin", "waiter"]}>
                <ActiveTablesPage />
              </ProtectedRoute>
            ),
          },
        ],
      },

      /* ==========================
         ADMIN
      ========================== */

      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "foods",
            element: <FoodManagement />,
          },
          {
            path: "categories",
            element: <CategoryManagement />,
          },
          {
            path: "tables",
            element: <TableManagement />,
          },
          {
            path: "orders",
            element: <OrdersManagement />,
          },
          {
            path: "payments",
            element: <PaymentsManagement />,
          },
          {
            path: "reports",
            element: <ReportsAnalytics />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },

      /* ==========================
         DEFAULT REDIRECT
      ========================== */

      {
        path: "",
        element: <Navigate to="/customer" replace />,
      },
    ],
  },
]);
