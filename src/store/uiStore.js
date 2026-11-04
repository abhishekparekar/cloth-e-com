import { create } from "zustand";

export const useUIStore = create((set) => ({
  isCartOpen: false,
  quickViewProduct: null,
  isSizeGuideOpen: false,
  isMobileMenuOpen: false,
  searchQuery: "",

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openQuickView: (product) => set({ quickViewProduct: product }),
  closeQuickView: () => set({ quickViewProduct: null }),

  openSizeGuide: () => set({ isSizeGuideOpen: true }),
  closeSizeGuide: () => set({ isSizeGuideOpen: false }),

  setMobileMenuOpen: (val) => set({ isMobileMenuOpen: val }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

