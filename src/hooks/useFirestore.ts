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

    console.log(`Fetching collection: ${collectionName}`);

    const colRef = collection(db, collectionName);
    const q = query(colRef, ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("Firestore snapshot:", snapshot.docs);

        const items = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as T[];

        console.log("Mapped Firestore data:", items);

        setData(items);
        setLoading(false);
      },
      (err) => {
        console.error(`Firestore Error (${collectionName}):`, err);

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

export const addDocument = async (collectionName: string, data: any) => {
  return await addDoc(collection(db, collectionName), data);
};

export const updateDocument = async (
  collectionName: string,
  id: string,
  data: any,
) => {
  return await updateDoc(doc(db, collectionName, id), data);
};

export const deleteDocument = async (collectionName: string, id: string) => {
  return await deleteDoc(doc(db, collectionName, id));
};
