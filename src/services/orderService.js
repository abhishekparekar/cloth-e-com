import { db, getTenantCollection, getTenantDoc } from "./firebase";
import {
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { generateOrderId } from "../utils/formatters";

export const orderService = {
  // Create order in tenant Firestore: tenants/ladie-cloth-ecom-product/orders
  async createOrder(orderPayload) {
    const orderNumber = generateOrderId();
    const nowIso = new Date().toISOString();

    const newOrder = {
      ...orderPayload,
      orderNumber,
      status: orderPayload.status || "placed",
      timeline: [
        { status: "placed", at: nowIso },
        ...(orderPayload.payment?.status === "paid"
          ? [{ status: "confirmed", at: nowIso }]
          : []),
      ],
      tracking: orderPayload.tracking || { courier: "", trackingId: "", url: "" },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(getTenantCollection("orders"), newOrder);
      return { id: docRef.id, ...newOrder, createdAt: nowIso };
    } catch (err) {
      console.error("Firestore tenant order create error:", err);
      throw err;
    }
  },

  // Get all orders from tenant Firestore
  async getAllOrders() {
    try {
      const q = query(getTenantCollection("orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : d.data().createdAt,
      }));
    } catch (err) {
      console.error("Firestore tenant getAllOrders error:", err);
      // Fallback query without index ordering if needed
      try {
        const snap = await getDocs(getTenantCollection("orders"));
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : d.data().createdAt,
        }));
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return list;
      } catch (e2) {
        return [];
      }
    }
  },

  // Get single order by ID or orderNumber
  async getOrderById(orderId) {
    try {
      const docSnap = await getDoc(getTenantDoc("orders", orderId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        };
      }
    } catch (e) {
      console.warn("Direct order get error:", e);
    }

    const all = await this.getAllOrders();
    return all.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  },

  // Get user orders from tenant Firestore
  async getUserOrders(userId) {
    if (!userId) return [];
    try {
      const all = await this.getAllOrders();
      return all.filter((o) => o.userId === userId);
    } catch (err) {
      console.error("getUserOrders error:", err);
      return [];
    }
  },

  // Update order status & tracking in tenant Firestore
  async updateOrderStatus(orderId, newStatus, trackingInfo = null) {
    const nowIso = new Date().toISOString();
    try {
      const orderRef = getTenantDoc("orders", orderId);
      const currentDoc = await getDoc(orderRef);
      let updatedTimeline = [];

      if (currentDoc.exists()) {
        const data = currentDoc.data();
        updatedTimeline = [...(data.timeline || [])];
        if (!updatedTimeline.some((t) => t.status === newStatus)) {
          updatedTimeline.push({ status: newStatus, at: nowIso });
        }
      }

      const updates = {
        status: newStatus,
        timeline: updatedTimeline,
        updatedAt: serverTimestamp(),
      };
      if (trackingInfo) updates.tracking = trackingInfo;

      await updateDoc(orderRef, updates);
      return { id: orderId, ...updates };
    } catch (err) {
      console.error("Failed to update order status in tenant collection:", err);
      throw err;
    }
  },
};
