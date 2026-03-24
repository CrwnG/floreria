import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  productoId: string;
  slug: string;
  nombre: string;
  imagen: string;
  precio: number;
  precioOriginal?: number;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (productoId: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  isWishlisted: (productoId: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.productoId === item.productoId)) {
            return state;
          }
          return {
            items: [...state.items, { ...item, addedAt: Date.now() }],
          };
        }),

      removeItem: (productoId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productoId !== productoId),
        })),

      toggleItem: (item) => {
        const { items } = get();
        if (items.some((i) => i.productoId === item.productoId)) {
          set({ items: items.filter((i) => i.productoId !== item.productoId) });
        } else {
          set({ items: [...items, { ...item, addedAt: Date.now() }] });
        }
      },

      isWishlisted: (productoId) => {
        return get().items.some((i) => i.productoId === productoId);
      },

      clearWishlist: () => set({ items: [] }),

      getItemCount: () => get().items.length,
    }),
    {
      name: 'fiorella-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
