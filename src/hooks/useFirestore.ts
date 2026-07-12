// src/hooks/useFirestore.ts

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export function useFirestore<T extends { id?: string }>(
  collectionName: string,
  queryConstraints: QueryConstraint[] = [],
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // start fetching collection

    const colRef = collection(db, collectionName);
    const q = query(colRef, ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as T[];

        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return {
    data,
    loading,
    error,
  };
}

/* =========================================
   Helper Functions
========================================= */

export const addDocument = async <D = any>(collectionName: string, data: D) => {
  try {
    return await addDoc(collection(db, collectionName), data as any);
  } catch (err) {
    throw err;
  }
};

export const updateDocument = async <D = any>(
  collectionName: string,
  id: string,
  data: D,
) => {
  try {
    return await updateDoc(doc(db, collectionName, id), data as any);
  } catch (err) {
    throw err;
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    return await deleteDoc(doc(db, collectionName, id));
  } catch (err) {
    throw err;
  }
};
