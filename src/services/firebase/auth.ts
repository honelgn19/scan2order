import { signInAnonymously, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

export async function signInCustomer() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const result = await signInAnonymously(auth);
  return result.user;
}

export async function signOutUser() {
  if (!auth.currentUser) return;
  return signOut(auth);
}
