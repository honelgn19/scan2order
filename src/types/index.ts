/* =============================================
   FILE: src/types/index.ts
   GLOBAL TYPE DEFINITIONS
   ============================================= */

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  fasting: 'FASTING' | 'NON_FASTING' | 'BOTH';
  available: boolean;
  prepTime?: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: number;
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
  status: 'Pending' | 'Preparing' | 'Ready' | 'Delivered';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Cash';
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Kitchen' | 'Waiter';
  status: 'Active' | 'Inactive';
}

export interface Table {
  number: string;
  status: 'Available' | 'Occupied' | 'Reserved';
  guests?: number;
  currentOrderId?: string;
}