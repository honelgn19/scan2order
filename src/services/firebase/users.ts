/* =============================================
   FILE: src/services/firebase/users.ts
   USERS SERVICE
   ============================================= */

import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import type { User } from "../../types";
import { parseUser } from "../../lib/schemas";
import { log, error as loggerError } from "../../lib/logger";

export const usersCollection = collection(db, "users");

// Listen to real-time users
export const listenToUsers = (callback: (users: User[]) => void) => {
  return onSnapshot(usersCollection, (snapshot) => {
    const users = snapshot.docs.map((d) => {
      const raw = { id: d.id, ...d.data() };
      try {
        const parsed = parseUser(raw);
        return parsed as User;
      } catch (err) {
        loggerError("Invalid user document", d.id, err);
        const data: any = d.data();
        const createdAt =
          data.createdAt && typeof data.createdAt.toDate === "function"
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null;
        return { id: d.id, ...data, createdAt } as User;
      }
    });
    callback(users);
  });
};

// Add new user (Admin use)
export const addUser = async (userData: Omit<User, "id" | "joinDate">) => {
  try {
    parseUser(userData);
    const res = await addDoc(usersCollection, {
      ...userData,
      createdAt: serverTimestamp(),
      status: "Active",
    });
    log("User added:", res.id);
    return res;
  } catch (err) {
    loggerError("addUser error:", err);
    throw err;
  }
};

// Update user (Admin use)
export const updateUser = async (userId: string, updates: Partial<User>) => {
  const userRef = doc(db, "users", userId);
  try {
    return await updateDoc(userRef, updates as any);
  } catch (err) {
    loggerError("updateUser error:", err);
    throw err;
  }
};
