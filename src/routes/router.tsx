/* =============================================
   FILE: src/routes/router.tsx
   CORRECTED VERSION - NO CIRCULAR IMPORT
   ============================================= */

import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import StaffLayout from "../layouts/StaffLayout";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import Login from "../pages/auth/Login";

// Customer Pages
import QRLandingPage from "../pages/customer/QRLandingPage";
import DigitalMenuPage from "../pages/customer/DigitalMenuPage";
import CartPage from "../pages/customer/CartPage";
import CheckoutPage from "../pages/customer/CheckoutPage";
import OrderSuccessPage from "../pages/customer/OrderSuccessPage";
import LiveOrderTrackingPage from "../pages/customer/LiveOrderTrackingPage";

// Staff Pages
import KitchenDashboard from "../pages/staff/KitchenDashboard";
import WaiterDashboard from "../pages/staff/WaiterDashboard";
import ReadyOrdersPage from "../pages/staff/ReadyOrdersPage";
import ActiveTablesPage from "../pages/staff/ActiveTablesPage";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import FoodManagement from "../pages/admin/FoodManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";
import TableManagement from "../pages/admin/TableManagement";
import OrdersManagement from "../pages/admin/OrdersManagement";
import PaymentsManagement from "../pages/admin/PaymentsManagement";
import ReportsAnalytics from "../pages/admin/ReportsAnalytics";
import UserManagement from "../pages/admin/UserManagement";
import NotificationsPage from "../pages/admin/NotificationsPage";
import SettingsPage from "../pages/admin/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      // ======================
      // AUTH ROUTES
      // ======================
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
        ],
      },

      // ======================
      // CUSTOMER ROUTES
      // ======================
      {
        path: "customer",
        element: <CustomerLayout />,
        children: [
          { index: true, element: <QRLandingPage /> },
          { path: "menu", element: <DigitalMenuPage /> },
          { path: "cart", element: <CartPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "order-success", element: <OrderSuccessPage /> },
          { path: "live-tracking", element: <LiveOrderTrackingPage /> },
        ],
      },

      // ======================
      // STAFF ROUTES
      // ======================
      {
        path: "staff",
        element: <StaffLayout />,
        children: [
          { path: "kitchen", element: <KitchenDashboard /> },
          { path: "waiter", element: <WaiterDashboard /> },
          { path: "ready-orders", element: <ReadyOrdersPage /> },
          { path: "active-tables", element: <ActiveTablesPage /> },
        ],
      },

      // ======================
      // ADMIN ROUTES
      // ======================
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "foods", element: <FoodManagement /> },
          { path: "categories", element: <CategoryManagement /> },
          { path: "tables", element: <TableManagement /> },
          { path: "orders", element: <OrdersManagement /> },
          { path: "payments", element: <PaymentsManagement /> },
          { path: "reports", element: <ReportsAnalytics /> },
          { path: "users", element: <UserManagement /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },

      // Redirect root to customer
      {
        path: "/",
        element: <Navigate to="/customer" replace />,
      },
    ],
  },
]);