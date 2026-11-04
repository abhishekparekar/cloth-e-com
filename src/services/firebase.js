import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Exact Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBX19VWQ81SAB5Hy_gkMyV6Dwx9SZgy6iI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "job-portal-85414.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://job-portal-85414-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "job-portal-85414",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "job-portal-85414.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "699831995778",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:699831995778:web:ef21f0c36144c240d4d39b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9TV1ETH13K"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Analytics
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

// Tenant Definition
// All store collections live under: tenants/ladie-cloth-ecom-product/
export const TENANT_ID = "ladie-cloth-ecom-product";
export const TENANT_ROOT = "tenants";

export const getTenantCollection = (subcollectionName) => {
  return collection(db, TENANT_ROOT, TENANT_ID, subcollectionName);
};

export const getTenantDoc = (subcollectionName, docId) => {
  return doc(db, TENANT_ROOT, TENANT_ID, subcollectionName, docId);
};

export const getTenantRootDoc = () => {
  return doc(db, TENANT_ROOT, TENANT_ID);
};

export { app, auth, db, storage, analytics, googleProvider };
