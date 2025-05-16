/* =============================================
   FILE: src/services/firebase/tables.ts
   TABLES SERVICE
   ============================================= */

import { db } from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc 
} from 'firebase/firestore';

export const tablesCollection = collection(db, 'tables');

// Listen to real-time table status
export const listenToTables = (callback: (tables: any[]) => void) => {
  return onSnapshot(tablesCollection, (snapshot) => {
    const tables = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(tables);
  });
};

// Update table status (e.g., Occupied, Available)
export const updateTableStatus = async (tableNumber: string, status: string, currentOrderId?: string) => {
  const tableRef = doc(db, 'tables', tableNumber);
  return await updateDoc(tableRef, {
    status,
    currentOrderId: currentOrderId || null,
    updatedAt: new Date()
  });
};

// Initialize tables (run once)
export const initializeTables = async () => {
  // This can be done manually in Firebase Console for now
  console.log("Tables should be initialized in Firestore");
};