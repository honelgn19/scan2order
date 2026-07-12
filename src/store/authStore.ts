/* =============================================
   STORE: authStore
   PATH: src/store/authStore.ts
   ============================================= */

import { create } from "zustand";
import type { User } from "../types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  role: User["role"] | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  role: null,

  login: (userData) =>
    set({
      user: userData,
      isAuthenticated: true,
      role: userData.role || "Customer",
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      role: null,
    }),
}));
