import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";

// Customer Pages
import { Home } from "../pages/Home";
import { Shop } from "../pages/Shop";
import { CategoryPage } from "../pages/CategoryPage";
import { ProductDetails } from "../pages/ProductDetails";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderSuccess } from "../pages/OrderSuccess";
import { WishlistPage } from "../pages/WishlistPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { AccountPage } from "../pages/account/AccountPage";
import { OrdersPage } from "../pages/account/OrdersPage";
import { OrderDetailPage } from "../pages/account/OrderDetailPage";
import { AboutPage } from "../pages/AboutPage";
import { ContactPage } from "../pages/ContactPage";
import {
  FAQPage,
  ShippingPolicyPage,
  ReturnPolicyPage,
  PrivacyPolicyPage,
} from "../pages/PolicyPages";
import { NotFoundPage } from "../pages/NotFoundPage";

// Admin Pages
import { AdminLayout } from "../components/admin/AdminLayout";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminProducts } from "../pages/admin/AdminProducts";
import { AdminCategories } from "../pages/admin/AdminCategories";
import { AdminOrders } from "../pages/admin/AdminOrders";
import { AdminCoupons } from "../pages/admin/AdminCoupons";
import { AdminCustomers } from "../pages/admin/AdminCustomers";
import { AdminBanners } from "../pages/admin/AdminBanners";
import { AdminSettings } from "../pages/admin/AdminSettings";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Facing Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="product/:slug" element={<ProductDetails />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success/:id" element={<OrderSuccess />} />
        <Route path="wishlist" element={<WishlistPage />} />

        {/* Auth */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />

        {/* Account (Protected) */}
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="account/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="account/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Information & Policies */}
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="return-policy" element={<ReturnPolicyPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />

        {/* 404 Inside Storefront */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

