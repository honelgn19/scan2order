/* =============================================
   FILE: src/services/firebase/foods.ts
   FIXED & CLEAN VERSION
   ============================================= */

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";   // ← Correct path

// Define the type here (better than importing from page)
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  fasting: string;
  available: boolean;
  description: string;
}

// Real-time listener
export const listenToFoods = (callback: (foods: MenuItem[]) => void) => {
  console.log("🔄 Listening to 'foods' collection...");

  const foodsCollection = collection(db, "foods");
  const q = query(foodsCollection, orderBy("name"));

  return onSnapshot(q, 
    (snapshot) => {
      const foods = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];

      console.log(`📦 Received ${foods.length} food items from Firestore`);
      callback(foods);
    },
    (error) => {
      console.error("❌ Firestore error in foods:", error);
      callback([]); // Return empty array on error
    }
  );
};