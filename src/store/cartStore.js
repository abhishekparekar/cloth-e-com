import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORE_CONFIG } from "../utils/constants";
import { INITIAL_COUPONS } from "../services/mockData";
import { getDoc } from "firebase/firestore";
import { getTenantDoc } from "../services/firebase";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,

      addItem: (product, variant, qty = 1) => {
        const { items } = get();
        const sku = variant?.sku || `${product.id}-${variant?.size || "FREE"}-${variant?.color || "DEFAULT"}`;
        const existingIndex = items.findIndex((i) => i.sku === sku);

        if (existingIndex > -1) {
          const updated = [...items];
          const newQty = updated[existingIndex].qty + qty;
          const maxStock = variant?.stock ?? 10;
          updated[existingIndex].qty = Math.min(newQty, maxStock);
          set({ items: updated });
        } else {
          const newItem = {
            id: `${product.id}-${Date.now()}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            image: product.images?.[0] || "",
            size: variant?.size || "Free Size",
            color: variant?.color || "Standard",
            sku: sku,
            stock: variant?.stock ?? 10,
            qty: Math.min(qty, variant?.stock ?? 10),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (sku) => {
        const { items } = get();
        set({ items: items.filter((i) => i.sku !== sku) });
      },

      updateQty: (sku, qty) => {
        const { items } = get();
        if (qty <= 0) {
          get().removeItem(sku);
          return;
        }
        const updated = items.map((item) => {
          if (item.sku === sku) {
            return { ...item, qty: Math.min(qty, item.stock || 10) };
          }
          return item;
        });
        set({ items: updated });
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      applyCoupon: async (code) => {
        if (!code) return { success: false, message: "Please enter a coupon code" };
        const cleanCode = code.trim().toUpperCase();

        // 1. Check live Firestore Tenant coupon first
        let coupon = null;
        try {
          const snap = await getDoc(getTenantDoc("coupons", cleanCode));
          if (snap.exists()) {
            const data = snap.data();
            if (data.isActive) {
              coupon = data;
            }
          }
        } catch (e) {
          console.warn("Firestore coupon fetch fallback:", e);
        }

        // 2. Fallback to default catalog coupons
        if (!coupon) {
          coupon = INITIAL_COUPONS.find(
            (c) => c.code.toUpperCase() === cleanCode && c.isActive
          );
        }

        if (!coupon) {
          return { success: false, message: "Invalid or expired coupon code" };
        }

        const subtotal = get().getSubtotal();
        if (subtotal < (coupon.minCartValue || 0)) {
          return {
            success: false,
            message: `Minimum order value for ${coupon.code} is ₹${coupon.minCartValue}`,
          };
        }

        let discount = 0;
        if (coupon.type === "percent") {
          discount = Math.round((subtotal * coupon.value) / 100);
          if (coupon.maxDiscount) {
            discount = Math.min(discount, coupon.maxDiscount);
          }
        } else {
          discount = coupon.value;
        }

        set({
          appliedCoupon: {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discount,
            description: coupon.description,
          },
        });

        return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
      },

      removeCoupon: () => set({ appliedCoupon: null }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0);
      },

      getDiscount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        return coupon.discount || 0;
      },

      getShipping: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= STORE_CONFIG.freeShippingThreshold) {
          return 0;
        }
        return STORE_CONFIG.standardShippingFee;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const taxable = Math.max(0, subtotal - discount);
        return Math.round(taxable * STORE_CONFIG.taxRate);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return Math.max(0, subtotal - discount + shipping + tax);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0);
      },
    }),
    {
      name: "aanya_boutique_cart",
    }
  )
);

