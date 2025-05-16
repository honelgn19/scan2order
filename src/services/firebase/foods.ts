/* =============================================
   FILE: src/services/firebase/foods.ts
   FOODS SERVICE
   ============================================= */

import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  updateDoc, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';

export const foodsCollection = collection(db, 'foods');

// Get real-time foods
export const listenToFoods = (callback: (foods: any[]) => void) => {
  return onSnapshot(foodsCollection, (snapshot) => {
    const foods = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(foods);
  });
};

// Add new food item (Admin use)
export const addFood = async (foodData: any) => {
  return await addDoc(foodsCollection, {
    ...foodData,
    createdAt: new Date(),
    available: true
  });
};

// Update food (Admin use)
export const updateFood = async (foodId: string, updates: any) => {
  const foodRef = doc(db, 'foods', foodId);
  return await updateDoc(foodRef, updates);
};

// Delete food
export const deleteFood = async (foodId: string) => {
  const foodRef = doc(db, 'foods', foodId);
  return await deleteDoc(foodRef);
};