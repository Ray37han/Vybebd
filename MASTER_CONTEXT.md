# VYBE — Master AI Context File

> **Purpose:** This file is the single source of truth for any AI assistant working on this codebase.
> Read this first. You do not need to scan the whole project.
> **Keep this file updated** after every significant change so the next session starts with accurate context.

---

## 1. Project Overview

**VYBE** is a full-stack e-commerce poster store targeting the Bangladeshi market.
Customers browse/buy physical posters (A5–A1 / custom inch sizes), can request custom prints, and pay via bKash / Nagad / Cash on Delivery.

| Property | Value |
|---|---|
| **Live frontend** | https://vybebd.store (Vercel) |
| **Live backend API** | https://api.vybebd.store (Azure App Service) |
| **Stack** | MongoDB · Express · React 18 · Node 18+ (MERN) |
| **Auth** | Firebase Phone OTP + Google Sign-In → JWT (httpOnly cookie) |
| **Images** | Cloudinary (multi-resolution: thumbnail / medium / large / full) |
| **Realtime** | Socket.IO (visitor tracking, admin live count) |
| **Cache** | Redis (optional; server continues without it) |
| **State** | Zustand (persisted in localStorage) |
| **UI framework** | TailwindCSS v3 + Framer Motion + GSAP |
| **Currency** | BDT (Bangladeshi Taka) |

---

## 2. Monorepo Structure

```
vybe-mern/
├── backend/                  # Express API (Node ESM modules)
│   ├── server.js             # ENTRY POINT — all routes, HTTP + Socket.IO
│   ├── config/
│   │   ├── cloudinary.js     # Cloudinary SDK init
│   │   ├── redis.js          # Redis client
│   │   └── firebase-admin.js # Firebase Admin SDK
│   ├── middleware/
│   │   ├── auth.js           # verifyToken (JWT), verifyAdmin
│   │   ├── cache.js          # Redis cache middleware + warmCache()
│   │   ├── security.js       # generalLimiter, strictLimiter
│   │   ├── rateLimiter.js    # Custom per-route limiters
│   │   ├── upload.js         # Multer (memory storage, 50MB)
│   │   ├── imageSecurity.js  # Signed URL / hotlink protection
│   │   └── deviceAuth.js     # Trusted device fingerprint middleware
│   ├── models/
│   │   ├── Product.js        # CORE product schema (see §5)
│   │   ├── Order.js          # Auth-flow orders
│   │   ├── PipelineOrder.js  # MAIN quick-checkout orders (see §5)
│   │   ├── User.js           # User schema with OTP + trusted devices
│   │   ├── Category.js       # Product categories
│   │   ├── FeaturedPoster.js # Homepage featured carousel items
│   │   ├── HeroItem.js       # Hero slider items
│   │   ├── PageView.js       # Analytics page view events
│   │   ├── ProductEvent.js   # Analytics product view/add-to-cart events
│   │   └── VisitorSession.js # Realtime visitor sessions
│   ├── routes/
│   │   ├── auth.js           # /api/auth
│   │   ├── products.js       # /api/products (CRUD, search, filter)
│   │   ├── orders.js         # /api/orders (auth-flow)
│   │   ├── pipeline.js       # /api/pipeline — MAIN checkout pipeline
│   │   ├── payment.js        # /api/payment (bKash, Nagad)
│   │   ├── cart.js           # /api/cart
│   │   ├── admin.js          # /api/admin
│   │   ├── analytics.js      # /api/analytics
│   │   ├── categories.js     # /api/categories
│   │   ├── customizations.js # /api/customizations
│   │   ├── customApprovals.js# /api/admin/custom-approvals
│   │   ├── bulkImport.js     # /api/admin/bulk-import
│   │   ├── featuredPosters.js# /api/featured-posters
│   │   ├── heroItems.js      # /api/hero-items
│   │   ├── images.js         # /api/images
│   │   ├── og.js             # /api/og/product/:id (OG meta)
│   │   └── sitemap.js        # /api/sitemap
│   ├── services/
│   │   ├── analyticsService.js  # Socket.IO broadcast + session tracking
│   │   ├── googleSheets.js      # Google Sheets order sync
│   │   ├── whatsapp.js          # WhatsApp order notification
│   │   ├── importService.js     # Bulk product import logic
│   │   └── courier/
│   │       ├── index.js         # Courier router
│   │       ├── pathao.js        # Pathao API
│   │       ├── steadfast.js     # Steadfast API
│   │       └── redx.js          # RedX API
│   ├── ecosystem.config.js      # PM2 config
│   ├── nginx.conf               # NGINX config (Azure)
│   ├── .env                     # NEVER commit — actual secrets
│   └── .env.example             # Env template
│
├── frontend/                    # React 18 + Vite SPA
│   ├── index.html
│   ├── vite.config.js           # Proxy /api → localhost:5000 in dev
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── main.jsx             # React entry — BrowserRouter, StrictMode
│   │   ├── App.jsx              # ALL routes defined here (see §6)
│   │   ├── firebase.js          # Firebase SDK init (Phone OTP + Google)
│   │   ├── index.css            # Global CSS + Tailwind
│   │   ├── store/index.js       # Zustand: useAuthStore, useCartStore
│   │   ├── context/
│   │   │   └── AnalyticsContext.jsx
│   │   ├── api/index.js         # Axios instance + all API call functions
│   │   ├── hooks/
│   │   │   ├── useImageProtection.js
│   │   │   ├── useInView.js
│   │   │   ├── usePageLoad.js
│   │   │   └── usePageRefreshProtection.js
│   │   ├── utils/firebaseErrors.js
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Products.jsx       # Catalog with filters/search/pagination
│   │   │   ├── ProductDetail.jsx  # Single product (size, tier, frame, cart)
│   │   │   ├── QuickCheckout.jsx  # MAIN checkout (no auth — pipeline flow)
│   │   │   ├── OrderConfirmed.jsx # Post-order success page
│   │   │   ├── Cart.jsx
│   │   │   ├── Customize.jsx      # Custom poster request form
│   │   │   ├── MyOrders.jsx       # Auth required
│   │   │   ├── Account.jsx        # Auth required
│   │   │   ├── Login.jsx          # OTP or Google
│   │   │   ├── Register.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfService.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── MobileHome.jsx     # NOT routed — dead page
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Products.jsx
│   │   │       ├── Orders.jsx           # Auth-flow orders
│   │   │       ├── DeliveryDashboard.jsx# MAIN order mgmt (pipeline orders)
│   │   │       ├── Users.jsx
│   │   │       ├── Analytics.jsx
│   │   │       ├── FeaturedPosters.jsx
│   │   │       ├── HeroItems.jsx
│   │   │       ├── AdminCustomOrders.jsx
│   │   │       ├── CustomApprovals.jsx
│   │   │       └── BulkImport.jsx
│   │   └── components/
│   │       ├── Navbar.optimized.jsx  # ACTIVE Navbar (App.jsx imports this as Navbar)
│   │       ├── Navbar.jsx            # NOT used — Navbar.optimized.jsx is active
│   │       ├── Footer.jsx
│   │       ├── HeroCarousel.jsx
│   │       ├── FeaturedProducts.jsx
│   │       ├── CollectionGrid.jsx
│   │       ├── BundleSection.jsx
│   │       ├── TrustBadges.jsx
│   │       ├── InstagramFeed.jsx
│   │       ├── Newsletter.jsx
│   │       ├── AnnouncementBar.jsx
│   │       ├── BackToTop.jsx
│   │       ├── OTPVerification.jsx
│   │       ├── ProtectedRoute.jsx
│   │       ├── ProtectedImage.jsx
│   │       ├── LoadingSkeleton.jsx
│   │       ├── LoadingSpinner.jsx
│   │       ├── CheckoutSkeleton.jsx
│   │       ├── StickyAddToCart.jsx
│   │       ├── PageTransition.jsx
│   │       ├── VybePageTransitions.jsx
│   │       ├── AnimatedIcon.jsx
│   │       ├── MagneticButton.jsx
│   │       ├── SpotlightContainer.jsx
│   │       └── mobile/
│   │           ├── BottomDock.jsx
│   │           ├── MobileHero.jsx
│   │           ├── MobileLayout.jsx
│   │           ├── MarqueeBar.jsx
│   │           ├── SnapCarousel.jsx
│   │           └── SkeletonCard.jsx
│
├── docs/                        # Historical docs — may be stale
├── _archive/                    # Moved here — safe to delete
│   ├── backend/routes_empty/    # 0-byte stub files
│   ├── backend/one_off_scripts/ # One-time pricing migration scripts
│   ├── frontend/pages_backup/   # .backup.jsx page files
│   ├── frontend/components_backup/ # Navbar.backup, Footer.backup
│   └── frontend/mobile_variants/   # MobileHero.lcp, MobileHero.optimized
│
├── vercel.json                  # Frontend Vercel deploy config
├── railway.json / railway.toml  # Railway alt backend host
├── nixpacks.toml
├── Dockerfile                   # Azure App Service deploy
├── README.md
└── MASTER_CONTEXT.md            # THIS FILE
```

---

## 3. Environment Variables

### Backend (backend/.env)

| Variable | Purpose |
|---|---|
| PORT | Server port (default 5000) |
| MONGODB_URI | MongoDB Atlas connection string |
| JWT_SECRET | JWT signing secret |
| NODE_ENV | development / production |
| REDIS_URL | Redis URL (optional) |
| CACHE_TTL | Redis TTL in seconds |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| FIREBASE_* | Firebase Admin SDK credentials |
| EMAIL_USER / EMAIL_PASS | Nodemailer SMTP |
| RESEND_API_KEY | Resend email API |
| GOOGLE_SHEETS_ID | Sheets spreadsheet ID |
| GOOGLE_SERVICE_ACCOUNT | Service account JSON |
| WHATSAPP_API_* | WhatsApp Business API |
| PATHAO_* / STEADFAST_* / REDX_* | Courier APIs |
| BKASH_* / NAGAD_* | Payment gateway |
| TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID | Telegram order bot |
| WEBSITE_INSTANCE_ID | Auto-set on Azure |
| WEBSITE_HOSTNAME | Auto-set on Azure |

### Frontend (frontend/.env / .env.local)

| Variable | Purpose |
|---|---|
| VITE_API_URL | Backend API base URL |
| VITE_FIREBASE_API_KEY | Firebase web API key |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase auth domain |
| VITE_FIREBASE_PROJECT_ID | Firebase project ID |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase storage bucket |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID |
| VITE_FIREBASE_APP_ID | Firebase app ID |

NOTE: frontend/.env.production only contains VITE_API_URL for Vercel.
Firebase keys fall back to hardcoded values in firebase.js if env vars are missing.

---

## 4. API Routes Map

### Public (no auth)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/products | List products (pagination, filter, search) |
| GET | /api/products/:id | Single product |
| GET | /api/categories | All categories |
| GET | /api/featured-posters | Featured carousel items |
| GET | /api/hero-items | Hero slider items |
| POST | /api/auth/register | Register (triggers OTP) |
| POST | /api/auth/verify-otp | Verify OTP |
| POST | /api/auth/login | Login (triggers OTP) |
| POST | /api/auth/google | Google OAuth via Firebase |
| POST | /api/auth/logout | Clear session cookie |
| POST | /api/pipeline/order | MAIN: place quick-checkout order |
| GET | /api/sitemap | XML sitemap |
| GET | /api/og/product/:id | OG meta for social crawlers |
| GET | /api/analytics/track | Track page view |

### Protected (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/auth/me | Current user profile |
| GET | /api/orders | User order history |
| POST | /api/orders | Place auth-flow order |
| GET/PUT | /api/cart | Server-side cart sync |
| GET | /api/customizations | User's custom requests |
| POST | /api/customizations | Submit custom poster |

### Admin (/api/admin/* — role: admin)

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/dashboard | Stats |
| GET/POST/PUT/DELETE | /api/admin/products | Product CRUD |
| GET/PUT | /api/admin/orders | Auth-flow orders |
| GET | /api/pipeline/orders | All pipeline orders |
| PUT | /api/pipeline/orders/:id/status | Update status |
| POST | /api/pipeline/orders/:id/courier | Assign courier |
| GET/PUT | /api/admin/users | User management |
| GET/POST/DELETE | /api/admin/featured-posters | Featured posters |
| GET/POST/DELETE | /api/admin/hero-items | Hero items |
| GET/PUT | /api/admin/custom-approvals | Approve custom orders |
| POST | /api/admin/bulk-import | Bulk import |
| GET | /api/analytics/* | Analytics data |

---

## 5. Data Models

### Product
```
name, description, category (enum — see §11),
images[{publicId, urls:{thumbnail,medium,large,full}}],
sizes[{name(A5-A1/inches), tier(Standard|Premium), dimensions, price, originalPrice}],
basePrice, originalPrice, discount, customizable, customizationOptions,
stock, sold, rating{average, count}, reviews[], featured, newArrival, bestSelling,
isActive, tags[], normalizedName, normalizedCategory, normalizedTags,
searchKeywords, groupKey — timestamps
```
Key: sizes array supports Standard and Premium tiers per size. Price is per-size-per-tier.

### PipelineOrder (quick checkout — PRIMARY flow)
```
orderId (VYBE-YYYYMMDD-XXXX, unique, atomic),
customerName, phone, email, district, address, orderNotes,
productId, productName, productImageUrl, quantity, price,
subtotal, deliveryCharge, total, products[],
paymentMethod(Cash On Delivery|bKash|Nagad), transactionId,
status(Pending|Confirmed|Processing|Shipped|Delivered|Cancelled),
courier, trackingId, deliveryAgent, ipAddress,
syncedToSheets, whatsappSent, courierOrderId,
adminNote, statusTimeline[] — timestamps
```
Key: No auth required. Goes to Google Sheets + WhatsApp, managed in DeliveryDashboard.

### Order (auth-flow — legacy/secondary)
```
user(ref), orderNumber,
items[{product, name, image, size, tier, frame, quantity, price,
  customization{uploadedImageUrl, uploadedImagePublicId, textOverlay,
  frameColor, adminInstructions, status(pending|approved|rejected), rejectionReason}}],
shippingAddress{name, phone, phoneVerified, firebaseUid, street, city, state, zipCode},
paymentMethod(bkash|nagad|rocket|cod), paymentInfo{transactionId, status, paidAt},
pricing{subtotal, shippingCost, discount, total},
orderStatus(pending|pending_admin_review|processing|printing|shipped|delivered|cancelled|rejected),
hasCustomItems, trackingNumber, notes, statusHistory[] — timestamps
```

### User
```
name, email, password(hashed, optional for OAuth), avatar,
authProvider(local|google), firebaseUid, phone, address{},
role(user|admin), cart[], wishlist[], orders[],
emailVerified, verificationCode, codeExpires,
trustedDevices[{deviceId, deviceName, fingerprint, ipAddress, expiresAt(30d)}],
backupCodes[], loginHistory[],
securitySettings{twoFactorEnabled, emailNotifications, loginAlerts}
```

---

## 6. Frontend Routes

```
/                    → Home.jsx
/products            → Products.jsx
/products/:id        → ProductDetail.jsx
/customize           → Customize.jsx
/cart                → Cart.jsx
/login               → Login.jsx
/register            → Register.jsx
/checkout            → QuickCheckout.jsx  (lazy, no auth)
/quick-checkout      → QuickCheckout.jsx  (alias)
/order-success       → OrderConfirmed.jsx (lazy)
/order-confirmed     → OrderConfirmed.jsx (alias)
/my-orders           → MyOrders.jsx       (auth required)
/account             → Account.jsx        (auth required)
/privacy-policy      → PrivacyPolicy.jsx
/terms-of-service    → TermsOfService.jsx
/admin               → admin/Dashboard.jsx
/admin/products      → admin/Products.jsx
/admin/orders        → admin/DeliveryDashboard.jsx  ← MAIN order mgmt
/admin/users         → admin/Users.jsx
/admin/featured-posters → admin/FeaturedPosters.jsx
/admin/hero-items    → admin/HeroItems.jsx
/admin/custom-orders → admin/AdminCustomOrders.jsx
/admin/custom-approvals → admin/CustomApprovals.jsx
/admin/bulk-import   → admin/BulkImport.jsx
/admin/analytics     → admin/Analytics.jsx
*                    → NotFound.jsx
```

IMPORTANT: App.jsx imports Navbar from './components/Navbar.optimized'
Checkout is lazy-loaded (Suspense fallback = CheckoutSkeleton)

---

## 7. State Management (Zustand — src/store/index.js)

### useAuthStore (persisted: auth-storage)
```
{ user, token, isAuthenticated }
Actions: setUser(), setToken(), login(user, token), logout()
```

### useCartStore (persisted: cart-storage)
```
{ items: [{product, size, tier, frame, quantity, customization, _id}] }
Actions: addItem(), updateQuantity(), removeItem(), clearCart(), setItems()
Getters: getTotal(), getItemCount()
```
Cart logic: Customized items always added as NEW (no dedup).
Non-custom items dedup by product._id + size + tier + frame.

---

## 8. Authentication Flow

### Phone OTP (primary)
1. User enters phone → backend sends OTP via Firebase Admin
2. User enters OTP → backend verifies → issues JWT (httpOnly cookie) + user object
3. JWT also stored in localStorage (key: 'token')
4. Frontend useAuthStore holds {user, token, isAuthenticated}

### Google Sign-In
1. Firebase signInWithPopup(GoogleAuthProvider) → Firebase ID token
2. POST /api/auth/google → backend verifies via Firebase Admin
3. Backend creates/updates User → returns JWT

### Route Guards
- ProtectedRoute checks useAuthStore.isAuthenticated
- ProtectedRoute adminOnly checks user.role === 'admin'

### Trusted Devices
- After OTP login, device fingerprint stored in User.trustedDevices (30-day expiry)
- deviceAuth.js middleware checks fingerprint on subsequent requests

---

## 9. Checkout / Order Pipeline (PRIMARY FLOW)

No login required:

```
ProductDetail / Cart
      ↓
QuickCheckout.jsx
  - Collects: name, phone, district, address, payment method
  - Delivery: 60 BDT (Dhaka) / 120 BDT (outside Dhaka)
      ↓
POST /api/pipeline/order
      ↓ (parallel)
  MongoDB PipelineOrder saved
  Google Sheets row added
  WhatsApp notification sent
      ↓
OrderConfirmed.jsx
  Shows orderId: VYBE-YYYYMMDD-XXXX
      ↓
Admin: DeliveryDashboard.jsx
  Confirm → Processing → Shipped → Delivered
  Assign courier (Pathao / Steadfast / RedX)
  Add tracking ID
```

Order ID: VYBE-YYYYMMDD-XXXX (daily sequence, atomic via PipelineCounter collection)
Payment methods: Cash On Delivery, bKash, Nagad
TO CHANGE DELIVERY CHARGE: Edit QuickCheckout.jsx, search "deliveryCharge"

---

## 10. Image System

All product images on Cloudinary. Each image stored with:
- thumbnail (~150px) — product cards
- medium (~400px) — grid views
- large (~800px) — product detail
- full (original) — download / admin

Field: product.images[n].urls.{thumbnail|medium|large|full}
publicId stored for reference; url field kept for backward compatibility
Images protected via ProtectedImage.jsx + useImageProtection.js
Admin uploads: /api/admin/products → upload.js (Multer) → Cloudinary

---

## 11. Product Categories (category enum in Product.js)

```
bikes, sports-cars, vintage-cars, muscle-cars, vector-cars,
football, football-motivational, cricket, ufc, nba, f1, f1-motivational,
marvel, dc, movies, tv-series, music, games,
motivational, best-selling, sports, cars,
abstract, minimalist, nature, typography, custom, anime, vintage, modern, other
```

Product sizes: A5, A4, A3, A2, A1, 12x18, 16x20, 18x24, 24x36
Tiers: Standard, Premium (each size can have both)
Frames: No Frame, Black, White, Woody

---

## 12. Deployment Architecture

### Frontend → Vercel
- Build: cd frontend && npm install && npm run build
- Output: frontend/dist
- All SPA routes → index.html
- Social crawlers → /api/og/product/:id for OG meta
- /sitemap.xml proxied to api.vybebd.store/api/sitemap

### Backend → Azure App Service
- Docker deploy via Dockerfile
- PM2 process manager (ecosystem.config.js)
- NGINX reverse proxy (nginx.conf)
- Azure detected via WEBSITE_INSTANCE_ID env var
- In production: backend also serves frontend/dist as static fallback

### Alternative: Railway (railway.json / nixpacks.toml)

---

## 13. Key Business Logic

### Pricing
- basePrice = lowest Standard price (for display/sorting)
- Actual = sizes.find(s => s.name === selectedSize && s.tier === selectedTier).price
- Discount = % off originalPrice (shown as strikethrough)
- Delivery: 60 BDT Dhaka / 120 BDT outside Dhaka

### Custom Orders
- Users upload image via Customize.jsx → /api/customizations
- Creates Order with hasCustomItems: true
- Admin reviews in /admin/custom-approvals

### Analytics
- AnalyticsContext tracks route changes → POST /api/analytics/track
- Realtime visitor count via Socket.IO (join-admin room, 30s heartbeat)
- PageView, ProductEvent, VisitorSession power the analytics dashboard

### Search (Products.jsx + products.js route)
- MongoDB weighted text index (normalized_text_search)
- Weights: normalizedName(10) > name(8) > normalizedCategory(5) > normalizedTags(3) > searchKeywords(2) > description/tags(1)
- Filters: category, price range, size, sort
- Pagination: page + limit

---

## 14. Known Gotchas

1. ACTIVE NAVBAR: App.jsx imports Navbar.optimized.jsx as Navbar. Editing Navbar.jsx does nothing.
2. TWO ORDER SYSTEMS: PipelineOrder (primary, no auth) vs Order (auth, legacy). Do not confuse.
3. CART: Zustand only on frontend. /api/cart syncs only when logged in.
4. REDIS: Optional. Server boots fine without it. All cache has try/catch fallthrough.
5. FIREBASE KEYS: Fall back to hardcoded values in firebase.js if env vars missing.
6. community-section/ folder in root is a SEPARATE sub-project, unrelated to main app.
7. MobileHome.jsx exists but is NOT routed in App.jsx — dead page.
8. OTPVerification.jsx used in BOTH Login and Register flows.
9. _archive/ folder contains moved files — safe to delete after review.
10. docs/ folder has historical notes — MASTER_CONTEXT.md supersedes them.
11. DELIVERY CHARGE: Change 60/120 BDT values in QuickCheckout.jsx (search "deliveryCharge").

---

## 15. Common Tasks — Where to Look

| Task | Files |
|---|---|
| Change homepage hero | admin/HeroItems.jsx + /api/hero-items + HeroItem model |
| Change featured posters | admin/FeaturedPosters.jsx + /api/featured-posters |
| Add/edit product | admin/Products.jsx + /api/admin + Product.js model |
| Change delivery charges | frontend/src/pages/QuickCheckout.jsx |
| Add product category | Product.js (category enum) + tailwind.config.js |
| Fix checkout form | frontend/src/pages/QuickCheckout.jsx |
| Fix order management | admin/DeliveryDashboard.jsx + backend/routes/pipeline.js |
| Add new page | frontend/src/pages/ + App.jsx routes |
| Change API base URL | frontend/.env (VITE_API_URL) + .env.production |
| Fix auth | backend/routes/auth.js + middleware/auth.js + frontend/src/firebase.js |
| Change announcement bar | frontend/src/components/AnnouncementBar.jsx |
| Change footer | frontend/src/components/Footer.jsx |
| Modify cart behavior | frontend/src/store/index.js |
| Add analytics event | backend/routes/analytics.js + services/analyticsService.js |
| Update courier APIs | backend/services/courier/ |

---

## 16. Session Update Log

AI assistants: Append an entry here after completing significant work.
Format: YYYY-MM-DD — what was changed

- 2026-08-18 — MASTER_CONTEXT.md created. Moved unnecessary files to _archive/: 0-byte stubs (routes: optimized-async/pagination/projection, redis-cache; models: OptimizedUser; server.production.js; package.production.json), page backups (Home.backup.jsx, Home.backup.old.jsx, Login.jsx.backup), component backups (Footer.backup.jsx, Navbar.backup.jsx), mobile variants (MobileHero.lcp.jsx, MobileHero.optimized.jsx), one-off scripts (updateA3RicePrice, updateA3SizePrice, updateAllPrices, updateNewPricing, updatePricing25pct, updateProductionPricing, updateStandardPremiumPrices, migrateImagesToPublic, listAllProducts, findA3Products, checkPricing, verifyPricing, deleteOrders), production-update.log.
