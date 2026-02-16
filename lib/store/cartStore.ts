import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { Product } from '@models/Product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  setAuthenticated: (isAuth: boolean) => void;
}

/**
 * Custom storage that switches between localStorage (logged-in) and sessionStorage (guest).
 * Guests lose their cart on tab close / refresh.
 * Logged-in users keep their cart across sessions.
 */
let currentStorage: Storage | undefined =
  typeof window !== 'undefined' ? sessionStorage : undefined;

const adaptiveStorage: StateStorage = {
  getItem: (name) => currentStorage?.getItem(name) ?? null,
  setItem: (name, value) => currentStorage?.setItem(name, value),
  removeItem: (name) => currentStorage?.removeItem(name),
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      setAuthenticated: (isAuth: boolean) => {
        if (typeof window === 'undefined') return;

        const key = 'soyol-cart-storage';
        const currentData = currentStorage?.getItem(key);

        if (isAuth) {
          // Switching to localStorage: copy data from session → local
          if (currentData) {
            localStorage.setItem(key, currentData);
          }
          currentStorage = localStorage;
        } else {
          // Switching to sessionStorage: clear localStorage cart
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
          currentStorage = sessionStorage;
          set({ items: [] });
        }
      },
    }),
    {
      name: 'soyol-cart-storage',
      storage: createJSONStorage(() => adaptiveStorage),
    }
  )
);
