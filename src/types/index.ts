/* =============================================
   FILE: src/types/index.ts
   GLOBAL TYPE DEFINITIONS
   ============================================= */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
  fasting: "FASTING" | "NON_FASTING" | "BOTH";
  available: boolean;
  prepTime?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  tableNumber: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Cash Pending" | "Failed" | "Refunded";
  timestamp: string;
  customerName?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Kitchen" | "Waiter" | "Customer";
  status: "Active" | "Inactive";
  joinDate?: string;
}

export interface Table {
  id: string;
  number: string;
  capacity?: number;
  status: "Available" | "Occupied" | "Reserved" | "Cleaning";
  currentSession?: {
    customerName: string;
    startedAt: string;
    guests: number;
  };
}
