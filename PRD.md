# PRD — Ladies Clothing E-Commerce Website

**Project Name:** Ladies Cloth Store ("Aanya Boutique" — placeholder, replace with real brand)
**Version:** 1.0
**Tech Stack:** React JS (Vite) · Tailwind CSS · Firebase (Firestore, Auth, Storage, Cloud Functions)
**Target Devices:** Mobile, Tablet, Laptop, Desktop (fully responsive)
**Primary Market:** India (INR, Razorpay, COD) — easily extendable to other regions

---

## 1. Project Overview

### 1.1 Vision
Build a modern, elegant, fast and fully responsive e-commerce website for a ladies clothing business (sarees, kurtis, lehengas, western wear, ethnic wear, accessories) with smooth animations, premium look and a complete shopping flow — from browsing to payment to order tracking — plus an admin panel to manage the business without touching code.

### 1.2 Goals
1. Give customers a beautiful, app-like shopping experience on every device.
2. Let the owner manage products, categories, orders, customers, banners and coupons from an admin dashboard.
3. Achieve high performance (Lighthouse ≥ 90) and strong SEO.
4. Convert visitors to buyers with a smooth, short checkout.

### 1.3 Success Metrics
| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| First Contentful Paint | < 1.8s |
| Cart → Order conversion | ≥ 3% |
| Mobile traffic usability | 100% pages responsive 320px → 1920px |
| Admin can add a product | < 2 minutes |

### 1.4 Target Users
- **Customers:** Women aged 16–50, mostly mobile users, shopping for daily, festive and wedding wear.
- **Admin / Owner:** Non-technical business owner managing catalog and orders.

---

## 2. Tech Stack & Tools

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS 3.x (custom theme) |
| Routing | React Router v6 |
| State management | Zustand (cart, wishlist, UI) + React Query (server state) |
| Animations | Framer Motion (page/UI), GSAP + ScrollTrigger (hero/scroll effects), Lottie (success/empty states) |
| Database | Firebase Firestore |
| Authentication | Firebase Auth (Email/Password, Google, Phone OTP) |
| Image storage | Firebase Storage (or Cloudinary for auto-optimization) |
| Backend logic | Firebase Cloud Functions (payment verification, order emails, stock updates) |
| Payments | Razorpay (UPI, cards, netbanking, wallets) + Cash on Delivery |
| Forms / validation | React Hook Form + Zod |
| Icons | Lucide React / React Icons |
| Notifications | React Hot Toast |
| Carousel | Swiper.js |
| SEO | React Helmet Async + sitemap + JSON-LD |
| Hosting | Firebase Hosting (or Vercel) |
| Analytics | Firebase Analytics / Google Analytics 4 |
| Code quality | ESLint, Prettier, Husky |

---

## 3. Design System

### 3.1 Design Style
Modern, feminine, premium and clean. Generous white space, soft rounded corners, glassmorphism accents, large fashion photography, subtle gradients and smooth micro-interactions.

### 3.2 Color Palette

| Role | Name | Hex |
|---|---|---|
| Primary | Rose Pink | `#E11D74` |
| Primary Light | Blush | `#FDE2EE` |
| Secondary | Royal Purple | `#7C3AED` |
| Accent | Champagne Gold | `#D4AF37` |
| Background | Soft Ivory | `#FFF9FB` |
| Surface | White | `#FFFFFF` |
| Text Primary | Deep Plum | `#2D1B36` |
| Text Muted | Mauve Grey | `#6B5B73` |
| Success | Emerald | `#10B981` |
| Warning | Amber | `#F59E0B` |
| Error | Red | `#EF4444` |

### 3.3 Linear Gradient Combinations

```css
/* Primary brand gradient — buttons, headings highlight */
--gradient-primary: linear-gradient(135deg, #E11D74 0%, #7C3AED 100%);

/* Soft hero background */
--gradient-hero: linear-gradient(135deg, #FDE2EE 0%, #EDE9FE 50%, #FFF9FB 100%);

/* Gold luxury accent — badges, sale tags, premium */
--gradient-gold: linear-gradient(135deg, #F6D365 0%, #D4AF37 50%, #B8860B 100%);

/* Sunset CTA — "Shop Now", "Add to Cart" hover */
--gradient-cta: linear-gradient(90deg, #FF6A88 0%, #E11D74 50%, #A21CAF 100%);

/* Dark footer / overlay */
--gradient-dark: linear-gradient(180deg, #2D1B36 0%, #1A0F20 100%);

/* Image overlay for banners */
--gradient-overlay: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(45,27,54,0.75) 100%);
```

**Tailwind config (extend):**
```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#E11D74", light: "#FDE2EE", dark: "#B3135A" },
        secondary: "#7C3AED",
        gold: "#D4AF37",
        ivory: "#FFF9FB",
        plum: "#2D1B36",
        mauve: "#6B5B73",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Poppins", "sans-serif"],
        accent: ["Cormorant Garamond", "serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg,#E11D74,#7C3AED)",
        "gradient-hero": "linear-gradient(135deg,#FDE2EE,#EDE9FE 50%,#FFF9FB)",
        "gradient-gold": "linear-gradient(135deg,#F6D365,#D4AF37 50%,#B8860B)",
        "gradient-cta": "linear-gradient(90deg,#FF6A88,#E11D74 50%,#A21CAF)",
        "gradient-dark": "linear-gradient(180deg,#2D1B36,#1A0F20)",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(225,29,116,0.25)",
        glow: "0 0 30px rgba(124,58,237,0.35)",
      },
      borderRadius: { xl2: "1.25rem" },
      screens: { xs: "480px" },
    },
  },
};
```

### 3.4 Typography
| Usage | Font | Weights |
|---|---|---|
| Headings / Logo | **Playfair Display** | 500, 600, 700 |
| Body / UI | **Poppins** | 300, 400, 500, 600 |
| Accent / taglines | **Cormorant Garamond** (italic) | 400, 500 |

**Type scale (mobile → desktop):** H1 `text-4xl → text-7xl`, H2 `text-3xl → text-5xl`, H3 `text-xl → text-3xl`, body `text-sm/base`.

### 3.5 UI Components Style
- Buttons: pill-shaped, gradient fill, hover lift + glow, press scale 0.97.
- Cards: white, `rounded-2xl`, soft shadow, hover zoom image + quick-action icons.
- Inputs: rounded, floating labels, pink focus ring.
- Badges: gold gradient for "New", pink for "Sale %".
- Glassmorphism for navbar on scroll (`backdrop-blur-lg bg-white/70`).
- Skeleton loaders for all async content.

---

## 4. Animation & Interaction Requirements

| Area | Animation | Tool |
|---|---|---|
| Page transitions | Fade + slide-up between routes | Framer Motion `AnimatePresence` |
| Hero section | Text reveal (staggered), floating images, parallax | GSAP / Framer Motion |
| Scroll reveal | Sections fade/slide in on scroll | Framer Motion `whileInView` |
| Product card | Hover: image zoom + second image swap, wishlist heart pop | Tailwind + Framer Motion |
| Navbar | Hide on scroll down, show on scroll up, glass blur | Framer Motion |
| Add to cart | Product flies to cart icon, cart badge bounces | Framer Motion |
| Cart drawer | Slide-in from right with backdrop blur | Framer Motion |
| Buttons | Gradient shift on hover, ripple/press effect | Tailwind |
| Category tiles | Tilt/3D hover + overlay reveal | Framer Motion |
| Numbers/counters | Count-up stats (happy customers etc.) | react-countup |
| Loading | Skeleton shimmer + branded logo loader | Tailwind |
| Success states | Lottie checkmark on order placed | Lottie |
| Marquee | Infinite offer/announcement ticker | CSS |
| Cursor (desktop only) | Optional custom cursor follower | Framer Motion |

**Rules:** Respect `prefers-reduced-motion`; animations ≤ 600ms for UI, never block interaction; lazy-load heavy libraries (GSAP, Lottie).

---

## 5. Site Map & Pages

### 5.1 Customer-Facing Pages
1. **Home** `/`
2. **Shop / All Products** `/shop`
3. **Category Page** `/category/:slug`
4. **Product Details** `/product/:slug`
5. **Search Results** `/search?q=`
6. **Cart** `/cart`
7. **Checkout** `/checkout`
8. **Order Success** `/order-success/:id`
9. **Login / Register / Forgot Password** `/login`, `/register`
10. **My Account** `/account` (profile, addresses)
11. **My Orders** `/account/orders` + order detail/track `/account/orders/:id`
12. **Wishlist** `/wishlist`
13. **About Us** `/about`
14. **Contact Us** `/contact`
15. **FAQ / Shipping / Return policy / Privacy / Terms**
16. **404 Page** (animated)

### 5.2 Admin Pages (`/admin`, protected)
1. Dashboard (sales, orders, revenue charts, low stock)
2. Products (list, add, edit, delete, bulk actions)
3. Categories & Sub-categories
4. Orders (filter, status update, invoice print)
5. Customers
6. Coupons / Offers
7. Banners / Homepage sections manager
8. Reviews moderation
9. Inventory / Stock
10. Settings (store info, shipping charges, tax, social links)

---

## 6. Detailed Feature Requirements

### 6.1 Home Page Sections
1. **Announcement bar** — marquee: "Free shipping above ₹999 | Use code WELCOME10".
2. **Navbar** — logo, mega menu (Categories), search with suggestions, wishlist, cart, user.
3. **Hero slider** — full-width animated banners (admin-managed), CTA buttons.
4. **Shop by Category** — animated category tiles.
5. **New Arrivals** — product carousel.
6. **Offer / Sale banner** — gradient banner with countdown timer.
7. **Best Sellers** — grid with tabs (Kurtis / Sarees / Western…).
8. **Trending Collection** — large image split layout.
9. **Why Choose Us** — icons (Free shipping, Easy returns, Secure payment, Quality).
10. **Instagram / Lookbook gallery**.
11. **Customer Testimonials** — slider with ratings.
12. **Newsletter signup** — gradient section.
13. **Footer** — links, contact, socials, payment icons.

### 6.2 Shop / Category Page
- Product grid (2 cols mobile, 3 tablet, 4 desktop), infinite scroll or pagination.
- **Filters:** category, price range slider, size, color, fabric, occasion, discount, rating, availability.
- **Sort:** Newest, Price low→high, high→low, Popularity, Discount.
- Mobile: filter in bottom-sheet drawer.
- Active filter chips, "Clear all".
- Quick View modal.

### 6.3 Product Details Page
- Image gallery with thumbnails, swipe on mobile, hover/zoom on desktop, optional video.
- Title, price, MRP, discount %, rating, stock status.
- Color swatches (linked variants) and size selector with **Size Guide** modal.
- Quantity selector, **Add to Cart**, **Buy Now**, wishlist.
- Pincode delivery check (estimated delivery).
- Tabs: Description, Fabric & Care, Shipping & Returns, Reviews.
- Share buttons (WhatsApp, copy link).
- Related products & "Recently viewed".
- Sticky Add-to-Cart bar on mobile.
- Reviews with star rating and photo upload (verified buyers only).

### 6.4 Cart
- Slide-in mini cart drawer + full cart page.
- Update quantity, remove, move to wishlist.
- Coupon code apply, price breakup (subtotal, discount, shipping, tax, total).
- Free shipping progress bar.
- Cart persists: localStorage for guests, Firestore for logged-in users (merged on login).

### 6.5 Checkout
- Steps: Address → Delivery → Payment → Review.
- Guest checkout optional (email + phone) / login.
- Saved addresses, pincode auto-validation.
- Payment: **Razorpay** (UPI/Cards/Netbanking/Wallet) and **COD**.
- Order summary sticky on desktop.
- Stock re-validation before order creation.
- Order confirmation page + email/WhatsApp notification.

### 6.6 User Account
- Register/login (email, Google, phone OTP), forgot password.
- Profile edit, multiple addresses, order history with status timeline (Placed → Confirmed → Packed → Shipped → Out for delivery → Delivered).
- Cancel / return request.
- Wishlist management.

### 6.7 Search
- Instant search with debounced suggestions (name, category, tags).
- Recent searches, trending searches.
- (Phase 2) Algolia/Typesense for advanced full-text search, since Firestore lacks native text search.

### 6.8 Admin Panel
- Role-based access (`admin`, `staff`) via Firebase custom claims.
- **Dashboard:** today's sales, total orders, revenue chart (Recharts), top products, low-stock alerts, recent orders.
- **Product management:** multi-image upload with drag-reorder, variants (size/color/stock), SKU, price/MRP, tags, SEO fields, featured / new / bestseller flags, publish/draft.
- **Order management:** status update, add tracking ID/courier, print invoice (PDF), refund note.
- **Banner manager:** upload hero banners, set links, order, schedule.
- **Coupon manager:** percent/flat, min cart value, expiry, usage limit.
- **Customer list** with order history.
- Export orders/products to CSV.

### 6.9 Additional Features
- WhatsApp floating chat button.
- Back-to-top button.
- Wishlist and cart counters in header.
- Cookie consent banner.
- Dark mode (optional, Phase 2).
- Multi-language (English/Hindi/Marathi) — Phase 2.
- Abandoned cart email — Phase 2.

---

## 7. Firestore Database Design

### 7.1 Collections

**`users/{uid}`**
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "role": "customer | admin | staff",
  "addresses": [
    { "id": "string", "name": "", "phone": "", "line1": "", "line2": "", "city": "", "state": "", "pincode": "", "isDefault": true }
  ],
  "wishlist": ["productId"],
  "createdAt": "timestamp"
}
```

**`products/{productId}`**
```json
{
  "name": "string",
  "slug": "string",
  "description": "string",
  "fabric": "string",
  "care": "string",
  "categoryId": "string",
  "subCategoryId": "string",
  "price": 1299,
  "mrp": 1999,
  "discountPercent": 35,
  "images": ["url"],
  "variants": [
    { "sku": "KRT-RED-M", "color": "Red", "colorHex": "#C1121F", "size": "M", "stock": 12 }
  ],
  "tags": ["kurti", "cotton", "festive"],
  "occasion": ["casual", "party"],
  "isFeatured": true,
  "isNew": true,
  "isBestSeller": false,
  "ratingAvg": 4.5,
  "ratingCount": 120,
  "status": "published | draft",
  "seo": { "title": "", "description": "" },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**`categories/{categoryId}`**
```json
{ "name": "Kurtis", "slug": "kurtis", "image": "url", "parentId": null, "order": 1, "isActive": true }
```

**`carts/{uid}`**
```json
{ "items": [ { "productId": "", "sku": "", "qty": 1, "price": 1299 } ], "updatedAt": "timestamp" }
```

**`orders/{orderId}`**
```json
{
  "orderNumber": "ORD-2026-00001",
  "userId": "uid",
  "items": [ { "productId": "", "name": "", "image": "", "sku": "", "size": "", "color": "", "qty": 1, "price": 1299 } ],
  "address": { },
  "pricing": { "subtotal": 0, "discount": 0, "shipping": 0, "tax": 0, "total": 0 },
  "coupon": "WELCOME10",
  "payment": { "method": "razorpay | cod", "status": "pending | paid | failed | refunded", "razorpayOrderId": "", "razorpayPaymentId": "" },
  "status": "placed | confirmed | packed | shipped | out_for_delivery | delivered | cancelled | returned",
  "tracking": { "courier": "", "trackingId": "", "url": "" },
  "timeline": [ { "status": "placed", "at": "timestamp" } ],
  "createdAt": "timestamp"
}
```

**`reviews/{reviewId}`** — `productId, userId, userName, rating, title, comment, images[], isVerifiedBuyer, status(pending/approved), createdAt`

**`coupons/{code}`** — `type(percent|flat), value, minCartValue, maxDiscount, expiresAt, usageLimit, usedCount, isActive`

**`banners/{id}`** — `image, mobileImage, title, subtitle, ctaText, link, order, isActive`

**`settings/store`** — `storeName, logo, contactEmail, phone, whatsapp, freeShippingMin, shippingCharge, taxPercent, socialLinks`

**`newsletter/{id}`** — `email, createdAt`

### 7.2 Required Composite Indexes
- `products`: `status + categoryId + createdAt (desc)`
- `products`: `status + isFeatured + createdAt (desc)`
- `products`: `status + price (asc)`
- `orders`: `userId + createdAt (desc)`
- `reviews`: `productId + status + createdAt (desc)`

### 7.3 Security Rules (baseline)
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && request.auth.token.admin == true; }
    function isOwner(uid) { return isSignedIn() && request.auth.uid == uid; }

    match /products/{id}   { allow read: if true; allow write: if isAdmin(); }
    match /categories/{id} { allow read: if true; allow write: if isAdmin(); }
    match /banners/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /settings/{id}   { allow read: if true; allow write: if isAdmin(); }
    match /coupons/{id}    { allow read: if isSignedIn(); allow write: if isAdmin(); }

    match /users/{uid} {
      allow read, update: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid);
    }
    match /carts/{uid}  { allow read, write: if isOwner(uid); }

    match /orders/{id} {
      allow read: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid);
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isAdmin();
    }
    match /reviews/{id} {
      allow read: if resource.data.status == 'approved' || isAdmin();
      allow create: if isSignedIn();
      allow update, delete: if isAdmin();
    }
    match /newsletter/{id} { allow create: if true; allow read: if isAdmin(); }
  }
}
```
> Important: Payment verification, stock deduction, coupon usage count and final price calculation MUST happen in **Cloud Functions** (server-side) — never trust the client for totals.

---

## 8. Cloud Functions

| Function | Trigger | Purpose |
|---|---|---|
| `createRazorpayOrder` | HTTPS callable | Recalculate cart total server-side, create Razorpay order |
| `verifyPayment` | HTTPS callable | Verify Razorpay signature, mark order paid |
| `onOrderCreated` | Firestore onCreate | Deduct stock, send confirmation email/WhatsApp |
| `onOrderStatusChange` | Firestore onUpdate | Notify customer on status change |
| `applyCoupon` | HTTPS callable | Validate coupon, return discount |
| `updateProductRating` | Review onWrite | Recalculate average rating |
| `setAdminClaim` | HTTPS callable | Assign admin role (super-admin only) |

---

## 9. Project Folder Structure

```
ladies-cloth-store/
├── public/
├── src/
│   ├── assets/            # images, lottie, fonts
│   ├── components/
│   │   ├── common/        # Button, Input, Modal, Loader, Rating, Badge
│   │   ├── layout/        # Navbar, Footer, MobileMenu, AnnouncementBar
│   │   ├── home/          # Hero, Categories, NewArrivals, Testimonials...
│   │   ├── product/       # ProductCard, Gallery, SizeSelector, Filters
│   │   ├── cart/          # CartDrawer, CartItem, CouponBox
│   │   ├── checkout/      # AddressForm, PaymentOptions, OrderSummary
│   │   └── admin/         # Sidebar, StatCard, DataTable, ProductForm
│   ├── pages/
│   │   ├── Home.jsx, Shop.jsx, ProductDetails.jsx, Cart.jsx, Checkout.jsx ...
│   │   └── admin/
│   ├── hooks/             # useAuth, useCart, useProducts, useDebounce
│   ├── store/             # zustand stores (cartStore, wishlistStore, uiStore)
│   ├── services/          # firebase.js, productService.js, orderService.js ...
│   ├── context/           # AuthContext
│   ├── routes/            # AppRoutes, ProtectedRoute, AdminRoute
│   ├── utils/             # formatPrice, validators, constants
│   ├── styles/            # index.css (tailwind layers, custom utilities)
│   ├── App.jsx
│   └── main.jsx
├── functions/             # Firebase Cloud Functions
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
├── tailwind.config.js
├── vite.config.js
└── .env
```

---

## 10. Responsive Design Requirements

| Breakpoint | Width | Layout |
|---|---|---|
| Mobile S | 320–479px | 1-col sections, 2-col product grid, bottom nav, hamburger menu |
| Mobile L / `xs` | 480–639px | Same, larger spacing |
| Tablet / `sm–md` | 640–1023px | 3-col grid, side filter drawer |
| Laptop / `lg` | 1024–1279px | 4-col grid, sidebar filters, mega menu |
| Desktop / `xl–2xl` | 1280px+ | Max container 1440px, centered |

**Rules**
- Mobile-first approach; no horizontal scroll at any width.
- Touch targets ≥ 44×44px.
- Mobile **bottom navigation bar** (Home, Shop, Wishlist, Cart, Account).
- Images use `srcset`, WebP/AVIF, `loading="lazy"`, aspect-ratio boxes to avoid layout shift.
- Test on: iPhone SE, iPhone 14, Pixel 7, Galaxy S, iPad, iPad Pro, 13" laptop, 1080p & 4K monitors.
- Browsers: latest 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari 15+.

---

## 11. Non-Functional Requirements

### 11.1 Performance
- Code-splitting with `React.lazy` per route; lazy-load images and heavy libs.
- Image compression (< 150KB per product image), WebP.
- Firestore: pagination (`limit` + `startAfter`), avoid unbounded listeners, cache with React Query.
- Bundle size target: initial JS < 250KB gzip.

### 11.2 SEO
- Unique title/meta per page, Open Graph & Twitter cards, canonical URLs.
- Product JSON-LD schema (price, availability, rating), breadcrumbs schema.
- `sitemap.xml`, `robots.txt`; clean slug URLs.
- Consider prerendering (react-snap / Vite SSG plugin) for key pages since CRA/Vite SPA has limited SEO.

### 11.3 Accessibility
- WCAG 2.1 AA: color contrast, alt text, keyboard navigation, focus rings, ARIA labels, semantic HTML.

### 11.4 Security
- Firestore/Storage rules as above; admin via custom claims.
- Server-side price & payment verification.
- Input validation (Zod) on client and in functions.
- HTTPS only, Firebase App Check enabled, secrets in env (never commit `.env`).
- Rate-limit sensitive functions.

### 11.5 Reliability
- Error boundaries, friendly error pages, offline fallback for cart (PWA optional).
- Firebase budget alerts to avoid unexpected billing.

---

## 12. Environment Variables (`.env`)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_RAZORPAY_KEY_ID=
VITE_WHATSAPP_NUMBER=
# Functions only (never expose to client):
RAZORPAY_KEY_SECRET=
```

---

## 13. Development Roadmap (Phases)

| Phase | Duration | Deliverables |
|---|---|---|
| **0. Setup** | 2–3 days | Vite + React + Tailwind, Firebase project, folder structure, theme, fonts, ESLint/Prettier, Git repo |
| **1. UI Foundation** | 1 week | Design system, Navbar, Footer, mobile nav, common components, page transitions |
| **2. Home & Catalog** | 1.5 weeks | Home sections with animations, Shop/Category pages, filters, sort, product card, skeletons |
| **3. Product Details** | 1 week | Gallery, variants, size guide, reviews UI, related products |
| **4. Auth & Account** | 1 week | Login/register (email, Google, OTP), profile, addresses, wishlist |
| **5. Cart & Checkout** | 1.5 weeks | Cart drawer/page, coupons, checkout steps, COD |
| **6. Payments & Orders** | 1 week | Razorpay + Cloud Functions, order creation, stock deduction, order history & tracking |
| **7. Admin Panel** | 2 weeks | Dashboard, products, categories, orders, banners, coupons, customers |
| **8. Polish** | 1 week | Animations tuning, SEO, accessibility, performance optimization |
| **9. QA & Testing** | 1 week | Cross-device/browsers testing, bug fixing, security rules review |
| **10. Deployment** | 2–3 days | Production Firebase setup, domain, SSL, analytics, go-live |

**Total estimate:** ~10–12 weeks (solo developer); 6–8 weeks (small team).

---

## 14. Testing Plan

- **Unit:** Vitest + React Testing Library (cart logic, price utils, validators).
- **Integration:** Firebase Emulator Suite (Auth, Firestore, Functions) for rules and flows.
- **E2E:** Playwright/Cypress — browse → add to cart → checkout → order.
- **Responsive/manual:** Chrome DevTools + real devices + BrowserStack.
- **Performance:** Lighthouse CI, WebPageTest.
- **Security:** Firestore rules unit tests, payment tampering tests.

---

## 15. Acceptance Criteria (Definition of Done)

- [ ] All pages are responsive from 320px to 1920px with no layout break.
- [ ] Users can browse, filter, search, wishlist, add to cart, checkout (Razorpay + COD) and view orders.
- [ ] Payment verified server-side; stock reduces after order.
- [ ] Admin can manage products, categories, orders, banners and coupons without code changes.
- [ ] Animations are smooth (60fps) and respect reduced-motion.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 95, Best Practices ≥ 90.
- [ ] Firestore security rules tested; no sensitive keys in client code.
- [ ] Site deployed on production domain with HTTPS and analytics.

---

## 16. Future Enhancements (Phase 2+)

- AI size recommendation & "Complete the look" suggestions
- Virtual try-on / AR preview
- Loyalty points & referral program
- Abandoned cart recovery (email/WhatsApp)
- Advanced search with Algolia/Typesense
- Multi-language and multi-currency
- PWA with push notifications
- Shiprocket / Delhivery integration for live tracking & labels
- Mobile app (React Native) reusing Firebase backend

---

## 17. Risks & Mitigation

| Risk | Mitigation |
|---|---|
| Firestore read costs grow | Pagination, caching, limit listeners, use `getDocs` where realtime not needed |
| Poor SEO for SPA | Prerendering / SSG for product & category pages |
| Fake/tampered prices | Server-side totals in Cloud Functions |
| Heavy images slow site | Compression, WebP, CDN/Cloudinary, lazy loading |
| Over-animation hurts performance | Animate only transform/opacity, lazy-load GSAP, reduced-motion support |
| Overselling stock | Transactional stock deduction in Cloud Functions |

---

## 18. Instructions for the Developer / AI Coding Assistant

1. Follow this PRD phase by phase; complete and test each phase before the next.
2. Use mobile-first Tailwind classes; never hard-code colors — use theme tokens.
3. Keep components small and reusable; business logic in `services/` and `hooks/`.
4. Every async UI must have loading (skeleton), empty and error states.
5. Never trust client-side data for pricing, stock or payment status.
6. Commit with meaningful messages; use feature branches.
7. Document setup steps in `README.md`.

---

*End of PRD — Ladies Clothing E-Commerce Website v1.0*
