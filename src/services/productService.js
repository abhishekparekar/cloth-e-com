import { db, getTenantCollection, getTenantDoc } from "./firebase";
import {
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { seedTenantDatabaseIfNeeded } from "./dbInit";

export const productService = {
  // Fetch all products with filtering & sorting directly from Firestore tenant
  async getAllProducts(filters = {}) {
    let products = [];

    try {
      const q = query(getTenantCollection("products"));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Auto-initialize real data if first time
        await seedTenantDatabaseIfNeeded();
        const refetchSnap = await getDocs(q);
        products = refetchSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } else {
        products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.error("Firestore tenant products error:", err);
      // Try seeding once in case collection wasn't created
      try {
        await seedTenantDatabaseIfNeeded();
        const retrySnap = await getDocs(getTenantCollection("products"));
        products = retrySnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e2) {
        console.error("Retry failed:", e2);
      }
    }

    // Apply client-side filtering on live Firestore data
    let result = [...products];

    if (filters.category && filters.category !== "all") {
      result = result.filter(
        (p) => p.categoryId?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.fabric?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.fabric && filters.fabric.length > 0) {
      result = result.filter((p) => filters.fabric.includes(p.fabric));
    }

    if (filters.occasion && filters.occasion.length > 0) {
      result = result.filter((p) =>
        p.occasion?.some((occ) => filters.occasion.includes(occ))
      );
    }

    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.variants?.some((v) => filters.sizes.includes(v.size))
      );
    }

    if (filters.minPrice !== undefined && filters.minPrice !== "") {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    if (filters.featured) {
      result = result.filter((p) => p.isFeatured);
    }

    if (filters.bestSeller) {
      result = result.filter((p) => p.isBestSeller);
    }

    if (filters.newArrival) {
      result = result.filter((p) => p.isNew);
    }

    if (filters.inStock) {
      result = result.filter((p) =>
        p.variants?.some((v) => v.stock > 0)
      );
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "popularity":
          result.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
          break;
        case "discount":
          result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
          break;
        case "newest":
        default:
          result.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
          });
          break;
      }
    }

    return result;
  },

  async getProductBySlug(slug) {
    const products = await this.getAllProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  async getProductById(id) {
    try {
      const docSnap = await getDoc(getTenantDoc("products", id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (e) {
      console.warn("Direct product lookup error:", e);
    }
    const products = await this.getAllProducts();
    return products.find((p) => p.id === id) || null;
  },

  // Admin: Create new product in tenant Firestore
  async createProduct(productData) {
    try {
      const docRef = await addDoc(getTenantCollection("products"), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...productData };
    } catch (err) {
      console.error("Failed to create product in tenant collection:", err);
      throw err;
    }
  },

  // Admin: Update product in tenant Firestore
  async updateProduct(id, updates) {
    try {
      const docRef = getTenantDoc("products", id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { id, ...updates };
    } catch (err) {
      console.error("Failed to update product in tenant collection:", err);
      throw err;
    }
  },

  // Admin: Delete product from tenant Firestore
  async deleteProduct(id) {
    try {
      await deleteDoc(getTenantDoc("products", id));
      return true;
    } catch (err) {
      console.error("Failed to delete product from tenant collection:", err);
      throw err;
    }
  },
};
