import { getAuth, signInAnonymously } from "firebase/auth";

const auth = getAuth();

export async function signInCustomer() {
  if (auth.currentUser) return auth.currentUser;

  const result = await signInAnonymously(auth);

  return result.user;
}