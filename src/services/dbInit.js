import { db, TENANT_ID, getTenantCollection, getTenantRootDoc } from "./firebase";
import { getDocs, setDoc, doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { INITIAL_PRODUCTS, INITIAL_BANNERS, INITIAL_COUPONS } from "./mockData";
import { CATEGORIES, STORE_CONFIG } from "../utils/constants";

let isSeeding = false;

export const seedTenantDatabaseIfNeeded = async () => {
  if (isSeeding) return;
  isSeeding = true;

  try {
    // 1. Check if products already exist in tenant collection
    const productsCol = getTenantCollection("products");
    const snapshot = await getDocs(productsCol);

    if (!snapshot.empty) {
      // Already populated with live Firestore data
      isSeeding = false;
      return { seeded: false, count: snapshot.size };
    }

    console.info(`Initializing tenant "${TENANT_ID}" data into Firestore...`);

    // Ensure tenant root doc exists
    await setDoc(getTenantRootDoc(), {
      tenantId: TENANT_ID,
      name: "Ladies Cloth E-Commerce Store",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Seed Categories
    for (const cat of CATEGORIES) {
      const catRef = doc(db, "tenants", TENANT_ID, "categories", cat.id);
      await setDoc(catRef, {
        ...cat,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Seed Banners
    for (const banner of INITIAL_BANNERS) {
      const bannerRef = doc(db, "tenants", TENANT_ID, "banners", banner.id);
      await setDoc(bannerRef, {
        ...banner,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Seed Coupons
    for (const coupon of INITIAL_COUPONS) {
      const couponRef = doc(db, "tenants", TENANT_ID, "coupons", coupon.code);
      await setDoc(couponRef, {
        ...coupon,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Seed Store Settings
    const settingsRef = doc(db, "tenants", TENANT_ID, "settings", "store");
    await setDoc(settingsRef, {
      ...STORE_CONFIG,
      updatedAt: serverTimestamp(),
    });

    // Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      const prodRef = doc(db, "tenants", TENANT_ID, "products", prod.id);
      await setDoc(prodRef, {
        ...prod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    console.info(`Successfully seeded tenant "${TENANT_ID}" into Firestore!`);
    isSeeding = false;
    return { seeded: true, count: INITIAL_PRODUCTS.length };
  } catch (error) {
    console.error("Error seeding tenant database:", error);
    isSeeding = false;
    return { seeded: false, error };
  }
};

