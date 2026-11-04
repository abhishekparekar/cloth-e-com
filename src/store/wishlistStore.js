import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        const { items } = get();
        if (!items.some((item) => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },

      removeFromWishlist: (productId) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      toggleWishlist: (product) => {
        const isIn = get().isInWishlist(product.id);
        if (isIn) {
          get().removeFromWishlist(product.id);
          return false;
        } else {
          get().addToWishlist(product);
          return true;
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "aanya_boutique_wishlist",
    }
  )
);

