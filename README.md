# Aanya Boutique — Luxury Ladies Ethnic & Western Wear

A modern, fast, and fully responsive e-commerce web application for ladies clothing (Sarees, Kurtis, Lehengas, Western Wear, Ethnic Sets, Accessories), built with **React 18**, **Tailwind CSS 3**, and **Firebase (Firestore & Authentication)**.

---

## 🏢 Multi-Tenant Firestore Architecture

All business data is strictly organized and stored under the dedicated tenant collection path:

```
tenants/
└── ladie-cloth-ecom-product/
    ├── products/       # Live catalog outfits, variants, pricing, inventory
    ├── categories/     # Boutique categories & collections
    ├── orders/         # Customer orders, pricing, timeline milestones, tracking AWB
    ├── coupons/        # Promotional discount codes (e.g. WELCOME10, FESTIVE20)
    ├── banners/        # Hero carousel slides & promotions
    ├── users/          # Customer profiles, roles, and saved delivery addresses
    └── settings/       # Flagship boutique metadata, tax rate, shipping thresholds
```

---

## 🎨 Single Unified Typography

In accordance with strict brand guidelines, the entire application uses **one single consistent, modern font family: `Poppins`** across headings, subheadings, labels, product cards, checkout flows, and the admin management studio.

---

## 🔐 Authentication & Roles

### 1. Admin Account
- **Admin Email:** `admin@gmail.com`
- **Admin Password:** `12345678`
- Direct access to the `/admin` portal.
- Handles product addition/editing/deletion, category updates, coupon creation, order status changes, and courier dispatch milestones.

### 2. Customer Registration
- The registration page (`/register`) is strictly reserved for **customer sign-ups**.
- Admin accounts cannot be created from the customer registration page.
- All new registrations automatically receive role: `customer`.

---

## 🚀 Running the Project

### Development
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```powershell
npm run build
```
Production assets are generated in `dist/` with optimized chunk-splitting and clean compression.
