/* =============================================
   STORE: authStore
   PATH: src/store/authStore.ts
   ============================================= */

import { create } from 'zustand';

interface AuthStore {
  user: any | null;
  isAuthenticated: boolean;
  role: 'Admin' | 'Kitchen' | 'Waiter' | 'Customer' | null;
  login: (userData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  role: null,

  login: (userData) => set({
    user: userData,
    isAuthenticated: true,
    role: userData.role || 'Customer'
  }),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    role: null
  }),
}));