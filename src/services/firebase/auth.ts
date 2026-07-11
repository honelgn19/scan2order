import { signInAnonymously } from "firebase/auth";
import { auth } from "../../lib/firebase"; // adjust the path if needed

export async function signInCustomer() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const result = await signInAnonymously(auth);
  return result.user;
}