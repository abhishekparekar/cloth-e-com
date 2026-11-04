import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthStore } from "./store/authStore";

// Helper component to scroll to top on page navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App = () => {
  const initAuthListener = useAuthStore((s) => s.initAuthListener);

  useEffect(() => {
    if (initAuthListener) {
      initAuthListener();
    }
  }, [initAuthListener]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#2D1B36",
            color: "#FFFFFF",
            borderRadius: "1rem",
            fontSize: "13px",
            padding: "12px 18px",
            boxShadow: "0 10px 30px -10px rgba(45,27,54,0.3)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFFFFF",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
    </BrowserRouter>
  );
};

export default App;

