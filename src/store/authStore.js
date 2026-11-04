import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth, db, getTenantDoc, googleProvider } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "12345678";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      // Initialize listener to sync with Firebase Auth
      initAuthListener: () => {
        onAuthStateChanged(auth, async (fbUser) => {
          if (fbUser) {
            try {
              const isAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
              const userRef = getTenantDoc("users", fbUser.uid);
              const userSnap = await getDoc(userRef);

              let userData;
              if (userSnap.exists()) {
                userData = { uid: fbUser.uid, ...userSnap.data() };
                if (isAdmin) userData.role = "admin";
              } else {
                userData = {
                  uid: fbUser.uid,
                  name: fbUser.displayName || (isAdmin ? "Admin Manager" : fbUser.email.split("@")[0]),
                  email: fbUser.email,
                  phone: fbUser.phoneNumber || "",
                  role: isAdmin ? "admin" : "customer",
                  addresses: [],
                  createdAt: new Date().toISOString(),
                };
                await setDoc(userRef, {
                  ...userData,
                  createdAt: serverTimestamp(),
                }, { merge: true });
              }

              set({ user: userData, isAuthenticated: true, loading: false });
            } catch (err) {
              console.error("Error syncing user data from Firestore tenant:", err);
            }
          }
        });
      },

      login: async (email, password) => {
        set({ loading: true });
        const trimmedEmail = email.trim().toLowerCase();
        const isAdminMatch = trimmedEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD;

        // If credentials match Admin (admin@gmail.com / 12345678)
        if (isAdminMatch) {
          let adminUserData = {
            uid: "admin-uid-master",
            name: "Admin Manager",
            email: ADMIN_EMAIL,
            phone: "+91 98765 43210",
            role: "admin",
            addresses: [],
            createdAt: new Date().toISOString(),
          };

          try {
            // Attempt Firebase Auth sign-in / sign-up if enabled
            let userCredential = null;
            try {
              userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
            } catch (authErr) {
              if (
                authErr.code === "auth/user-not-found" ||
                authErr.code === "auth/invalid-credential" ||
                authErr.code === "auth/invalid-login-credentials"
              ) {
                try {
                  userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
                } catch (signUpErr) {
                  console.warn("Firebase Auth sign-up error (Email/Password provider might be disabled in Firebase Console):", signUpErr);
                }
              } else {
                console.warn("Firebase Auth sign-in warning:", authErr);
              }
            }

            if (userCredential?.user) {
              adminUserData.uid = userCredential.user.uid;
            }

            // Sync with Firestore Tenant: tenants/ladie-cloth-ecom-product/users
            try {
              const userRef = getTenantDoc("users", adminUserData.uid);
              await setDoc(
                userRef,
                {
                  ...adminUserData,
                  updatedAt: serverTimestamp(),
                },
                { merge: true }
              );
            } catch (fsErr) {
              console.warn("Firestore tenant admin doc note:", fsErr);
            }

            // Successfully set Admin session
            set({ user: adminUserData, isAuthenticated: true, loading: false });
            return { success: true, role: "admin" };
          } catch (err) {
            // Guarantee admin access regardless of Firebase console provider settings
            set({ user: adminUserData, isAuthenticated: true, loading: false });
            return { success: true, role: "admin" };
          }
        }

        // Customer Login Flow
        try {
          const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
          const fbUser = userCredential.user;
          const userRef = getTenantDoc("users", fbUser.uid);
          const userSnap = await getDoc(userRef);

          let userData;
          if (userSnap.exists()) {
            userData = { uid: fbUser.uid, ...userSnap.data() };
          } else {
            userData = {
              uid: fbUser.uid,
              name: fbUser.displayName || trimmedEmail.split("@")[0],
              email: trimmedEmail,
              phone: fbUser.phoneNumber || "",
              role: "customer",
              addresses: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, {
              ...userData,
              createdAt: serverTimestamp(),
            }, { merge: true });
          }

          set({ user: userData, isAuthenticated: true, loading: false });
          return { success: true, role: userData.role };
        } catch (err) {
          set({ loading: false });
          let message = "Invalid email or password.";
          if (err.code === "auth/operation-not-allowed") {
            message = "Email/Password sign-in is not enabled in Firebase Console. Please enable it in Firebase Console > Authentication > Sign-in method.";
          } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
            message = "Incorrect password. Please try again.";
          } else if (err.code === "auth/user-not-found") {
            message = "No account found with this email. Please register.";
          }
          return { success: false, error: message };
        }
      },

      register: async (name, email, password, phone = "") => {
        set({ loading: true });
        const trimmedEmail = email.trim().toLowerCase();

        // Admin cannot be registered from registration page
        if (trimmedEmail === ADMIN_EMAIL.toLowerCase() || trimmedEmail.includes("admin@")) {
          set({ loading: false });
          return {
            success: false,
            error: "Admin accounts cannot be registered here. Please sign in directly.",
          };
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
          const fbUser = userCredential.user;

          const userData = {
            uid: fbUser.uid,
            name: name.trim(),
            email: trimmedEmail,
            phone: phone.trim(),
            role: "customer", // Strictly customer only
            addresses: [],
            createdAt: new Date().toISOString(),
          };

          // Save to tenant users collection
          await setDoc(getTenantDoc("users", fbUser.uid), {
            ...userData,
            createdAt: serverTimestamp(),
          });

          set({ user: userData, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          set({ loading: false });
          let message = "Failed to create account.";
          if (err.code === "auth/email-already-in-use") {
            message = "An account with this email already exists. Please log in.";
          } else if (err.code === "auth/weak-password") {
            message = "Password must be at least 6 characters long.";
          }
          return { success: false, error: message };
        }
      },

      loginWithGoogle: async () => {
        set({ loading: true });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const fbUser = result.user;
          const isAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          const userRef = getTenantDoc("users", fbUser.uid);
          const userSnap = await getDoc(userRef);

          let userData;
          if (userSnap.exists()) {
            userData = { uid: fbUser.uid, ...userSnap.data() };
            if (isAdmin) userData.role = "admin";
          } else {
            userData = {
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email.split("@")[0],
              email: fbUser.email,
              phone: fbUser.phoneNumber || "",
              role: isAdmin ? "admin" : "customer",
              addresses: [],
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, {
              ...userData,
              createdAt: serverTimestamp(),
            }, { merge: true });
          }

          set({ user: userData, isAuthenticated: true, loading: false });
          return { success: true, role: userData.role };
        } catch (err) {
          set({ loading: false });
          return { success: false, error: err.message };
        }
      },

      logout: async () => {
        try {
          await firebaseSignOut(auth);
        } catch (e) {
          console.error("Signout error", e);
        }
        set({ user: null, isAuthenticated: false });
      },

      addAddress: async (newAddress) => {
        const { user } = get();
        if (!user) return;
        const addressItem = {
          ...newAddress,
          id: `addr-${Date.now()}`,
          isDefault: !user.addresses?.length || newAddress.isDefault,
        };
        const updatedAddresses = [...(user.addresses || []), addressItem];
        set({ user: { ...user, addresses: updatedAddresses } });

        try {
          await setDoc(
            getTenantDoc("users", user.uid),
            { addresses: updatedAddresses, updatedAt: serverTimestamp() },
            { merge: true }
          );
        } catch (err) {
          console.error("Error saving address to tenant Firestore:", err);
        }
      },

      removeAddress: async (addressId) => {
        const { user } = get();
        if (!user) return;
        const updatedAddresses = (user.addresses || []).filter((a) => a.id !== addressId);
        set({ user: { ...user, addresses: updatedAddresses } });

        try {
          await setDoc(
            getTenantDoc("users", user.uid),
            { addresses: updatedAddresses, updatedAt: serverTimestamp() },
            { merge: true }
          );
        } catch (err) {
          console.error("Error removing address from tenant Firestore:", err);
        }
      },

      setDefaultAddress: async (addressId) => {
        const { user } = get();
        if (!user) return;
        const updated = (user.addresses || []).map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }));
        set({ user: { ...user, addresses: updated } });

        try {
          await setDoc(
            getTenantDoc("users", user.uid),
            { addresses: updated, updatedAt: serverTimestamp() },
            { merge: true }
          );
        } catch (err) {
          console.error("Error updating default address in tenant Firestore:", err);
        }
      },

      updateProfile: async (profileData) => {
        const { user } = get();
        if (!user) return;
        const updatedUser = { ...user, ...profileData };
        set({ user: updatedUser });

        try {
          await setDoc(
            getTenantDoc("users", user.uid),
            { ...profileData, updatedAt: serverTimestamp() },
            { merge: true }
          );
        } catch (err) {
          console.error("Error updating profile in tenant Firestore:", err);
        }
      },
    }),
    {
      name: "aanya_boutique_auth_session",
    }
  )
);
