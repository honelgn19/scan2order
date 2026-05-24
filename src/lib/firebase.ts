// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCB3rhhsM_4s5KkxpryrFHC0Fdx3G9iCgc",
  authDomain: "scan2order-365ff.firebaseapp.com",
  projectId: "scan2order-365ff",
  storageBucket: "scan2order-365ff.firebasestorage.app",
  messagingSenderId: "104334514451",
  appId: "1:104334514451:web:147d0072e23c48194222e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
console.log("PROJECT ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
export default app;
