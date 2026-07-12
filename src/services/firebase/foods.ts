/* =============================================
   FILE: src/services/firebase/foods.ts
   FIXED & CLEAN VERSION
   ============================================= */

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { MenuItem } from "../../types";
import { parseMenuItem } from "../../lib/schemas";
import { error as loggerError } from "../../lib/logger";

export const listenToFoods = (callback: (foods: MenuItem[]) => void) => {
  const foodsCollection = collection(db, "foods");
  const q = query(foodsCollection, orderBy("name"));

  return onSnapshot(
    q,
    (snapshot) => {
      const foods = snapshot.docs.map((doc) => {
        const raw = { id: doc.id, ...doc.data() };
        try {
          const parsed = parseMenuItem(raw);
          return parsed as MenuItem;
        } catch (err) {
          loggerError("Invalid menu item", doc.id, err);
          return raw as MenuItem;
        }
      }) as MenuItem[];

      callback(foods);
    },
    () => {
      callback([]);
    },
  );
};
