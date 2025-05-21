// src/services/firebase/foods.ts
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase"; // ← This should now work

import type { MenuItem } from "../../pages/customer/DigitalMenuPage"; // adjust path if needed

export const listenToFoods = (callback: (foods: MenuItem[]) => void) => {
  const foodsCollection = collection(db, "foods");

  const q = query(foodsCollection, orderBy("name"));

  return onSnapshot(q, (snapshot) => {
    const foods = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];

    callback(foods);
  });
};
