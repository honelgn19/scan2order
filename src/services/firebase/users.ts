/* =============================================
   FILE: src/services/firebase/users.ts
   USERS SERVICE
   ============================================= */

import { db } from '../../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc 
} from 'firebase/firestore';

export const usersCollection = collection(db, 'users');

// Listen to real-time users
export const listenToUsers = (callback: (users: any[]) => void) => {
  return onSnapshot(usersCollection, (snapshot) => {
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(users);
  });
};

// Add new user (Admin use)
export const addUser = async (userData: any) => {
  return await addDoc(usersCollection, {
    ...userData,
    createdAt: new Date(),
    status: 'Active'
  });
};

// Update user (Admin use)
export const updateUser = async (userId: string, updates: any) => {
  const userRef = doc(db, 'users', userId);
  return await updateDoc(userRef, updates);
};