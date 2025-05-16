/* =============================================
   FILE: src/services/firebase/orders.ts
   ORDERS SERVICE
   ============================================= */

import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export const ordersCollection = collection(db, 'orders');

// Listen to real-time orders
export const listenToOrders = (callback: (orders: any[]) => void) => {
  const q = query(ordersCollection, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  });
};

// Add new order
export const addOrder = async (orderData: any) => {
  return await addDoc(ordersCollection, {
    ...orderData,
    createdAt: new Date(),
    status: 'Pending',
    paymentStatus: 'Pending'
  });
};

// Update order status (Kitchen / Waiter use)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, 'orders', orderId);
  return await updateDoc(orderRef, { 
    status,
    updatedAt: new Date()
  });
};