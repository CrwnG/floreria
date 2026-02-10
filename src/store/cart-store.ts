import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productoId === item.productoId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productoId === item.productoId
                  ? { ...i, cantidad: i.cantidad + item.cantidad }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, item], isOpen: true };
        }),

      removeItem: (productoId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productoId !== productoId),
        })),

      updateQuantity: (productoId, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((i) => i.productoId !== productoId)
              : state.items.map((i) =>
                  i.productoId === productoId ? { ...i, cantidad } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.cantidad, 0);
      },
    }),
    {
      name: 'fiorella-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
