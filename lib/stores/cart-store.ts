import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem, OrderItem } from '@/types';

interface CartState {
  items: OrderItem[];
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (menuItem, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.menuItemId === menuItem.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.menuItemId === menuItem.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      subtotal: (item.quantity + quantity) * item.price,
                    }
                  : item
              ),
            };
          }

          const newItem: OrderItem = {
            id: `temp-${Date.now()}`,
            menuItemId: menuItem.id,
            menuItem,
            quantity,
            price: menuItem.price,
            subtotal: menuItem.price * quantity,
          };

          return {
            items: [...state.items, newItem],
          };
        }),
      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.menuItemId !== menuItemId),
        })),
      updateQuantity: (menuItemId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.menuItemId === menuItemId
              ? {
                  ...item,
                  quantity: Math.max(0, quantity),
                  subtotal: item.price * Math.max(0, quantity),
                }
              : item
          ).filter((item) => item.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.subtotal, 0);
      },
      getItemCount: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
