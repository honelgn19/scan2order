import { createBrowserRouter } from "react-router-dom";

// Layouts
import App from "./App";
import AdminLayout from "./components/layouts/AdminLayout";
import StaffLayout from "./components/layouts/StaffLayout";
import CustomerLayout from "./components/layouts/CustomerLayout";

// Pages
import DigitalMenuPage from "./pages/DigitalMenuPage";
import QRLandingPage from "./pages/QRLandingPage";
import Login from "./pages/Login";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccessPage";

// Staff Pages
import KitchenDashboard from "./pages/KitchenDashboard";
import WaiterDashboard from "./pages/WaiterDashboard";
import LiveOrderTracking from "./pages/LiveOrderTrackingPage";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import FoodManagement from "./pages/FoodManagement";
import CategoryManagement from "./pages/CategoryManagement";
import TableManagement from "./pages/TableManagement";
import OrdersManagement from "./pages/OrdersManagement";
import PaymentsManagement from "./pages/PaymentsManagement";
import ReportsAnalytics from "./pages/ReportsAnalytics";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public / Customer Routes
      {
        element: <CustomerLayout />,
        children: [
          { index: true, element: <QRLandingPage /> },
          { path: "login", element: <Login /> },
          { path: "menu", element: <DigitalMenuPage /> },
          { path: "cart", element: <CartPage /> },
          { path: "checkout", element: <CheckoutPage /> },
          { path: "order-success", element: <OrderSuccess /> },
        ],
      },

      // Staff Routes
      {
        element: <StaffLayout />,
        children: [
          { path: "kitchen", element: <KitchenDashboard /> },
          { path: "waiter", element: <WaiterDashboard /> },
          { path: "live-orders", element: <LiveOrderTracking /> },
        ],
      },

      // Admin Routes (Nested Layout)
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
        ],
      },

      // 404
      {
        path: "*",
        element: (
          <h1 className="text-center mt-20 text-3xl font-bold text-white">
            404 - Page Not Found
          </h1>
        ),
      },
    ],
  },
]);
