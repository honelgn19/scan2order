/* =============================================
   STORE: cartStore
   PATH: src/store/cartStore.ts
   ============================================= */

import { create } from 'zustand';

interface CartStore {
  items: any[];
  addItem: (item: any) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (newItem) => set((state) => {
    const existing = state.items.findIndex(item => item.id === newItem.id);
    if (existing !== -1) {
      const updated = [...state.items];
      updated[existing].quantity += newItem.quantity || 1;
      return { items: updated };
    }
    return { items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }] };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));