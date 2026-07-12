/* =============================================
   FILE: src/services/firebase/orders.ts
   ORDERS SERVICE
   ============================================= */

import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import type { Order } from "../../types";
import { parseOrder } from "../../lib/schemas";
import { log, error as loggerError } from "../../lib/logger";

export const ordersCollection = collection(db, "orders");

// Listen to real-time orders
export const listenToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(ordersCollection, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((d) => {
      const data: any = d.data();
      const createdAt =
        data.createdAt && typeof data.createdAt.toDate === "function"
          ? data.createdAt.toDate().toISOString()
          : data.createdAt || null;
      const updatedAt =
        data.updatedAt && typeof data.updatedAt.toDate === "function"
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt || null;

      return {
        id: d.id,
        ...data,
        createdAt,
        updatedAt,
      } as Order;
    });
    callback(orders);
  });
};

// Add new order
export const addOrder = async (
  orderData: Omit<Order, "id" | "createdAt" | "timestamp">,
) => {
  try {
    // runtime validation
    parseOrder(orderData);

    const res = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: "Pending",
      paymentStatus: "Pending",
    });

    log("Order added:", res.id);
    return res;
  } catch (err) {
    loggerError("addOrder error:", err);
    throw err;
  }
};

// Update order status (Kitchen / Waiter use)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, "orders", orderId);
  try {
    return await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    throw err;
  }
};
