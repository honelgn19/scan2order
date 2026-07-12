/* =============================================
   FILE: src/services/firebase/tables.ts
   TABLES SERVICE
   ============================================= */

import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import type { Table } from "../../types";

export const tablesCollection = collection(db, "tables");

// Listen to real-time table status
export const listenToTables = (callback: (tables: Table[]) => void) => {
  return onSnapshot(tablesCollection, (snapshot) => {
    const tables = snapshot.docs.map((d) => {
      const data: any = d.data();
      const updatedAt =
        data.updatedAt && typeof data.updatedAt.toDate === "function"
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt || null;

      return { id: d.id, ...data, updatedAt } as Table;
    });
    callback(tables);
  });
};

// Update table status (e.g., Occupied, Available)
export const updateTableStatus = async (
  tableNumber: string,
  status: string,
  currentOrderId?: string,
) => {
  const tableRef = doc(db, "tables", tableNumber);
  return await updateDoc(tableRef, {
    status,
    currentOrderId: currentOrderId || null,
    updatedAt: serverTimestamp(),
  });
};

// Initialize tables (run once)
export const initializeTables = async () => {
  // Intentionally left blank: initialize via Firebase console or seed script
};
