# VYBE — SENIOR ARCHITECTURE & IMPLEMENTATION MASTER PROMPT

You are working on the existing VYBE ecommerce platform.

You have been given:

```text
MASTER_CONTEXT.md
```

Treat it as the source of truth for the existing system.

Your task is to architect and implement the next major evolution of VYBE:

> Expand VYBE from a poster-focused ecommerce store into a broader Wall Art + Home Decor platform, beginning with Solar Wobbler as the first Home Decor product.

You must approach this as a **senior software architect + senior product designer + senior ecommerce engineer**, not as a feature-level code generator.

The objective is not simply to "add Solar Wobbler."

The objective is to create the **correct scalable architecture for an expanding Home Decor business while preserving the existing poster business.**

---

# 1. NON-NEGOTIABLE PRINCIPLE

The architecture must follow:

> **VISUALLY DIFFERENT, TECHNICALLY UNIFIED.**

Home Decor should have a different customer-facing visual identity from Posters.

But both must use the same underlying:

- Product system
- Cart
- Checkout
- Order pipeline
- Authentication
- Payment
- Search
- Analytics
- Admin
- Cloudinary
- SEO infrastructure

Do NOT create a second ecommerce platform.

---

# 2. BEFORE WRITING CODE

Do not immediately modify files.

First inspect the actual repository.

Read:

```text
MASTER_CONTEXT.md
```

Then inspect the implementation of:

```text
backend/models/Product.js
backend/models/PipelineOrder.js
backend/models/Order.js

backend/routes/products.js
backend/routes/admin.js
backend/routes/pipeline.js
backend/routes/categories.js
backend/routes/analytics.js

frontend/src/store/index.js
frontend/src/api/index.js

frontend/src/pages/ProductDetail.jsx
frontend/src/pages/Products.jsx
frontend/src/pages/QuickCheckout.jsx
frontend/src/pages/Cart.jsx

frontend/src/pages/admin/Products.jsx
frontend/src/pages/admin/DeliveryDashboard.jsx
frontend/src/pages/admin/Analytics.jsx

frontend/src/components/Navbar.optimized.jsx

Cloudinary upload implementation
Category implementation
Search implementation
SEO/OG implementation
```

Also inspect relevant reusable components.

Do not assume MASTER_CONTEXT.md perfectly describes the current implementation.

Verify important architectural assumptions against the actual code.

---

# 3. CREATE AN ARCHITECTURE AUDIT FIRST

Before implementation, produce an internal architecture assessment.

Determine:

### Product

- Which fields are globally reusable?
- Which fields are poster-specific?
- Which fields are tightly coupled to size/tier/frame?
- How are products serialized?
- How does frontend assume poster structure?

### Cart

- How is cart-line identity calculated?
- Where is deduplication implemented?
- Which fields are mandatory?
- Which fields are poster-specific?

### Checkout

- How does QuickCheckout interpret cart items?
- How does `/api/pipeline/order` interpret products?
- How are prices calculated?
- Where is inventory validated?
- How are order items serialized?

### Orders

- How are old PipelineOrders represented?
- How are multi-item orders represented?
- Which fields are required by DeliveryDashboard?

### Admin

- How are products created?
- How are products edited?
- How are images uploaded?
- How are categories selected?
- How is validation performed?

### Search

- Which fields participate in MongoDB search?
- How are categories filtered?
- Are poster assumptions embedded in filtering?

### SEO

- How are product metadata and OG data generated?

### Analytics

- How are ProductEvents generated?
- Can product type be introduced without breaking existing analytics?

Document risks before changing architecture.

---

# 4. ARCHITECTURAL DECISION

The target product architecture should conceptually become:

```text
Product
│
├── Core Identity
│   ├── _id
│   ├── name
│   ├── slug
│   ├── description
│   ├── shortDescription
│   ├── productType
│   └── category
│
├── Commerce
│   ├── price
│   ├── originalPrice
│   ├── discount
│   ├── stock
│   └── variants
│
├── Media
│   └── images
│
├── Merchandising
│   ├── featured
│   ├── newArrival
│   ├── bestSelling
│   └── isActive
│
├── Search
│   ├── tags
│   ├── searchKeywords
│   └── normalized fields
│
├── SEO
│   └── metadata
│
├── Poster Configuration
│   ├── sizes
│   ├── tiers
│   ├── frames
│   └── customization
│
└── Home Decor Configuration
    ├── variants
    ├── features
    ├── specifications
    └── faq
```

This is a conceptual target.

Do not blindly implement every field.

Only introduce fields that are actually required.

---

# 5. PRODUCT TYPE

Introduce a scalable product type concept:

```text
poster
home_decor
```

Existing poster products must continue functioning.

New Solar Wobbler should be:

```text
productType: home_decor
category: solar-wobblers
```

Do not identify products using names.

NEVER write generic business logic such as:

```js
if (product.name === "Solar Wobbler")
```

Use product type/category/configuration.

---

# 6. BACKWARD COMPATIBILITY

This is a hard requirement.

Existing poster documents may not contain:

```text
productType
variants
features
specifications
faq
```

They must continue working.

Implement safe defaults where appropriate.

Do not perform destructive migrations without explicit necessity.

Do not rewrite historical orders unnecessarily.

Do not break:

- Existing products
- Existing poster pricing
- Existing poster customization
- Existing cart
- Existing checkout
- Existing orders
- Existing admin workflows

---

# 7. POSTER PRICING MUST REMAIN INTACT

Existing poster pricing is:

```text
size × tier → price
```

with frame selection.

Do not replace it with a generic single-price system if doing so would break posters.

Instead:

```text
Poster
    → existing pricing architecture

Home Decor
    → generic price / variant pricing
```

Keep these concerns separate.

---

# 8. HOME DECOR PRICING

Home Decor should not require:

```text
A5
A4
A3
A2
A1
Standard
Premium
Frame
```

unless an actual Home Decor product requires those concepts.

Solar Wobbler should use the simplest valid pricing structure.

Use BDT.

Backend must remain authoritative for final order pricing.

---

# 9. CATEGORY ARCHITECTURE

The conceptual hierarchy should become:

```text
Poster
├── Football
├── F1
├── Cars
├── Movies
└── ...

Home Decor
├── Solar Wobblers
├── Desk Decor
├── Room Decor
└── ...
```

Do not create unnecessary category infrastructure.

Do not create empty customer-facing categories.

---

# 10. CART ARCHITECTURE

Continue using:

```text
useCartStore
```

Do not create:

```text
useHomeDecorCart
useSolarWobblerCart
```

Cart lines must support both product types.

Conceptually:

```text
Poster:
product + size + tier + frame + customization

Home Decor:
product + variant
```

Centralize cart-line identity/deduplication logic.

Do not duplicate cart identity rules across components.

---

# 11. MIXED CART

This must work:

```text
Cart
├── A3 F1 Poster
└── Solar Wobbler
```

The existing poster cart behavior must remain unchanged.

Test:

- Add poster
- Add Solar Wobbler
- Change quantities
- Remove either item
- Refresh
- Checkout

---

# 12. CHECKOUT

Continue using:

```text
QuickCheckout.jsx
```

and:

```text
POST /api/pipeline/order
```

Do NOT create:

```text
SolarWobblerCheckout
HomeDecorCheckout
```

The checkout should become product-type-aware only where required.

Do not redesign checkout unnecessarily.

---

# 13. PIPELINE ORDER

The existing PipelineOrder is the PRIMARY order architecture.

Preserve compatibility with existing fields.

Where necessary, make `products[]` the future-proof representation.

Conceptually:

```js
products: [
  {
    productId,
    productType,
    productName,
    productImageUrl,
    variant,
    size,
    tier,
    frame,
    quantity,
    unitPrice,
    totalPrice
  }
]
```

Only implement fields that fit the actual application.

Old orders must remain readable.

---

# 14. INVENTORY

Inventory validation must happen server-side.

Do not trust frontend stock.

Do not allow negative stock.

Inspect the existing pipeline before modifying inventory behavior.

Do not create duplicate inventory deduction logic.

---

# 15. ADMIN ARCHITECTURE

Extend:

```text
frontend/src/pages/admin/Products.jsx
```

and:

```text
backend/routes/admin.js
backend/models/Product.js
```

where possible.

Do NOT create a permanent:

```text
Solar Wobbler Admin
```

subsystem.

Instead create:

```text
Generic Product Admin
│
├── Poster
└── Home Decor
```

Solar Wobbler is an instance of Home Decor.

---

# 16. ADMIN PRODUCT TYPE SELECTOR

Product creation/editing should support:

```text
Product Type

○ Poster
○ Home Decor
```

When Poster:

show poster-specific configuration.

When Home Decor:

show Home Decor-specific configuration.

Do not show irrelevant fields.

---

# 17. ADMIN — BASIC INFORMATION

Support:

```text
Name
Slug
Product Type
Category
Short Description
Description
```

Validate required fields.

Backend validation is mandatory.

---

# 18. ADMIN — MEDIA

Use the existing Cloudinary system.

Support:

```text
Product images
Lifestyle images
Primary image
Image ordering
Delete
Replace
Preview
```

Reuse existing multi-resolution image architecture.

Do not introduce another image hosting service.

Do not store base64 image data.

---

# 19. ADMIN — PRICING

Home Decor:

```text
Selling Price
Original Price
Discount
```

If variants are necessary:

```text
Variant
SKU
Price
Stock
Active
```

Do not implement variants simply because the architecture supports them.

Only use them when required.

---

# 20. ADMIN — INVENTORY

Support:

```text
Stock
Low-stock threshold
Availability
```

Prefer derived availability.

Do not create contradictory manual states.

---

# 21. ADMIN — HOME DECOR CONTENT

Support structured:

```text
Features
Specifications
FAQ
```

Recommended specification representation:

```js
[
  {
    label,
    value
  }
]
```

Recommended FAQ representation:

```js
[
  {
    question,
    answer
  }
]
```

Do not hardcode content into React components.

Do not invent product specifications.

---

# 22. ADMIN — MERCHANDISING

Reuse existing fields where possible:

```text
featured
newArrival
bestSelling
isActive
```

Do not create redundant flags.

---

# 23. ADMIN — SEO

Support:

```text
SEO Title
Meta Description
Keywords where appropriate
Social Image
Canonical where appropriate
```

Generate sensible defaults when possible.

Allow manual overrides.

Extend existing SEO architecture.

---

# 24. ADMIN — PREVIEW

Provide a product preview action where practical.

It should use the real customer-facing product page.

Do not create a separate preview implementation.

---

# 25. ADMIN UX

The interface must be:

```text
Professional
Fast
Clear
Structured
Operational
Responsive
Accessible
```

Organize the editor into logical sections.

Use the existing VYBE admin design language.

Do not introduce an unrelated dashboard template.

---

# 26. HOME DECOR CUSTOMER EXPERIENCE

Create:

```text
/home-decor
```

as a dedicated customer-facing experience.

The visual language should be:

```text
Minimal
Warm
Premium
Editorial
Tactile
Lifestyle-oriented
Modern
```

while still belonging to VYBE.

Existing Posters should remain:

```text
Bold
Graphic
Energetic
Expressive
Pop-culture oriented
```

Do not destroy the poster identity.

---

# 27. HOME DECOR NAVIGATION

Update the active:

```text
Navbar.optimized.jsx
```

not:

```text
Navbar.jsx
```

Primary navigation should support:

```text
Posters
Home Decor
Collections
Bundles
Search
Account
Cart
```

Adapt to the existing responsive navigation architecture.

Do not break mobile navigation.

---

# 28. SOLAR WOBBLER

Create Solar Wobbler as real product data.

Use:

```text
productType = home_decor
category = solar-wobblers
```

All customer-facing data must come from the product model/API.

Do not hardcode:

```text
price
stock
specifications
description
features
```

into React components.

---

# 29. SOLAR WOBBLER PRODUCT PAGE

Use the existing:

```text
ProductDetail.jsx
```

architecture unless inspection proves a better approach.

The page should support:

```text
Gallery
Product name
Short description
Price
Availability
Quantity
Add to Cart
Buy Now
Delivery information
Payment information
Story
How it works
Lifestyle imagery
Specifications
FAQ
Reviews if available
Related products
Complete Your Space
```

Do not invent product claims.

Do not fabricate reviews.

Do not fabricate specifications.

---

# 30. FIRST-VIEWPORT PRIORITY

The first viewport must immediately communicate:

```text
What is this?
Why is it interesting?
How much is it?
Is it available?
How do I buy it?
```

Do not bury the CTA under excessive animation or storytelling.

---

# 31. SEARCH

Extend existing search to understand:

```text
productType
Home Decor categories
Home Decor search keywords
```

Do not build a second search engine.

Poster search must remain functional.

---

# 32. FILTERS

Poster filters remain:

```text
Category
Price
Size
Tier
Frame
```

Home Decor filters should only show applicable attributes.

Do not expose:

```text
A5
A4
Premium
Frame
```

to Solar Wobbler unless applicable.

---

# 33. ANALYTICS

Extend existing analytics.

Do not create a separate analytics architecture.

Where useful, include:

```text
productType
```

and Home Decor events.

Potential events:

```text
home_decor_view
solar_wobbler_view
add_to_cart
begin_checkout
purchase
poster_to_decor_click
decor_to_poster_click
```

Use the existing analytics infrastructure.

---

# 34. SEO

Extend:

```text
/api/og/product/:id
/api/sitemap
```

rather than replacing them.

Ensure:

```text
/home-decor
/products/:id
```

have appropriate:

- Metadata
- Canonical URLs
- Open Graph
- Product structured data
- Breadcrumbs
- Sitemap entries
- Internal links

---

# 35. PERFORMANCE

Preserve the existing Cloudinary optimization.

Use appropriate image sizes.

Do not load full-resolution images unnecessarily.

Do not introduce large dependencies without justification.

Use lazy loading where appropriate.

Avoid excessive client-side rendering.

---

# 36. ACCESSIBILITY

Ensure:

- Semantic HTML
- Keyboard navigation
- Visible focus
- Accessible form labels
- Accessible dialogs
- Meaningful alt text
- Proper button semantics
- Reduced motion support
- Adequate contrast
- Touch-friendly controls

---

# 37. MOTION

Existing:

```text
Framer Motion
GSAP
```

are sufficient.

Do not add another animation framework.

Home Decor animation should be:

```text
Subtle
Purposeful
Premium
Fast
```

Avoid animation that interferes with shopping.

Respect:

```text
prefers-reduced-motion
```

---

# 38. SECURITY

All admin operations must remain protected by:

```text
verifyToken
verifyAdmin
```

Backend must validate:

```text
productType
category
price
stock
images
variants
```

Do not trust frontend validation.

Do not expose secrets.

Do not modify authentication architecture unless required.

---

# 39. IMPLEMENTATION PROCESS

Do not implement everything in one uncontrolled operation.

Follow these stages.

---

## STAGE 1 — AUDIT

No code changes.

Inspect the repository and produce:

```text
Current Architecture
Poster Dependencies
Home Decor Requirements
Breaking Risks
Recommended Changes
Files to Modify
Files to Avoid
Migration Risks
```

Stop.

---

## STAGE 2 — ARCHITECTURE PLAN

No production implementation yet.

Design:

```text
Product model
Category model
Cart model
PipelineOrder compatibility
Admin architecture
API changes
Routing
Search
SEO
Analytics
```

Explain:

```text
What is reused
What is extended
What is created
What is intentionally unchanged
```

Stop.

---

## STAGE 3 — FOUNDATION

Implement only the architecture necessary to support:

```text
productType
home_decor
solar-wobbler category
generic Home Decor product fields
```

Preserve poster behavior.

Run the application.

Test existing posters.

---

## STAGE 4 — ADMIN

Implement the product-type-aware admin system.

Verify:

```text
Create Poster
Edit Poster
Create Home Decor
Edit Home Decor
```

Do not regress poster management.

---

## STAGE 5 — SOLAR WOBBLER

Create the actual Solar Wobbler product through the new product architecture.

Do not hardcode its data.

Verify:

```text
Database
API
Admin
Product listing
```

---

## STAGE 6 — HOME DECOR CUSTOMER EXPERIENCE

Build:

```text
/home-decor
```

with the new visual direction.

Do not redesign unrelated poster pages.

---

## STAGE 7 — PRODUCT EXPERIENCE

Make Solar Wobbler work through the customer-facing product experience.

Test:

```text
Gallery
Price
Stock
Cart
Buy Now
```

---

## STAGE 8 — COMMERCE

Test:

```text
Poster
Solar Wobbler
Poster + Solar Wobbler
```

through:

```text
Cart
QuickCheckout
PipelineOrder
Order confirmation
Admin order management
```

---

## STAGE 9 — SEARCH / SEO / ANALYTICS

Integrate Home Decor into:

```text
Search
Analytics
OG
Sitemap
Structured data
```

---

## STAGE 10 — POLISH

Review:

```text
Typography
Spacing
Hierarchy
Buttons
Cards
Images
Navigation
Mobile
Animation
Accessibility
Loading
Errors
```

Do not perform unrelated redesigns.

---

## STAGE 11 — FINAL QA

Test:

```text
375
390
414
768
1024
1280
1440
1920
```

Verify:

### Existing VYBE

```text
Homepage
Posters
Categories
Product pages
Customization
Cart
Checkout
Login
Orders
```

### New VYBE

```text
Home Decor
Solar Wobbler
Product page
Cart
Checkout
Mixed cart
Order
Admin
```

---

# 40. HARD "DO NOT" RULES

Never:

```text
Create a separate Solar Wobbler ecommerce system.
Create a separate Home Decor checkout.
Create a separate Home Decor cart.
Create a Solar Wobbler database model without architectural justification.
Hardcode Solar Wobbler product data into UI components.
Identify Solar Wobbler by product name.
Break existing poster pricing.
Break historical orders.
Break poster checkout.
Break poster customization.
Create fake reviews.
Create fake specifications.
Invent product claims.
Create empty product categories.
Add unnecessary dependencies.
Rewrite unrelated parts of the application.
Modify Navbar.jsx instead of Navbar.optimized.jsx.
Expose secrets.
Trust frontend pricing.
Trust frontend inventory.
Skip backend validation.
```

---

# 41. QUALITY BAR

Judge every implementation against this question:

> Would this architecture still be clean if VYBE had 50 Home Decor products next year?

If not, refactor before proceeding.

The system must support future products such as:

```text
Solar Wobblers
Desk Decor
Room Decor
Decorative Objects
Lighting
Wall Decor
```

without rebuilding:

```text
Cart
Checkout
Orders
Authentication
Search
Analytics
Admin
```

---

# 42. DEFINITION OF DONE

The project is complete only when:

### Architecture

- Product supports multiple product types.
- Existing posters remain backward compatible.
- Home Decor does not require a duplicate commerce architecture.

### Admin

- Admin can create Home Decor products.
- Admin can edit Solar Wobbler.
- Admin can manage media.
- Admin can manage pricing.
- Admin can manage stock.
- Admin can manage features.
- Admin can manage specifications.
- Admin can manage FAQs.
- Admin can manage SEO.
- Admin can control visibility.
- Admin can preview products.

### Customer

- Home Decor has a dedicated landing page.
- Solar Wobbler has a polished product experience.
- Product is data-driven.
- Add to Cart works.
- Buy Now works.

### Commerce

- Solar Wobbler can coexist with posters in cart.
- Checkout works.
- PipelineOrder works.
- Admin order management works.

### Technical

- No duplicate commerce systems.
- No unnecessary product-specific logic.
- No broken existing functionality.
- No critical console errors.
- No broken API requests.

### Responsive

All major flows work at:

```text
375px
390px
414px
768px
1024px
1280px
1440px
1920px
```

---

# 43. MASTER_CONTEXT UPDATE

After significant implementation, update:

```text
MASTER_CONTEXT.md
```

Add only the relevant architectural changes and a Session Update Log entry.

Do not rewrite unrelated historical information.

Example:

```text
2026-09-05 — Introduced product-type-aware architecture for Home Decor, extended admin product management, and added Solar Wobbler support while preserving existing poster commerce flows.
```

---

# 44. FINAL REPORT

At the end provide:

```text
1. Architecture decisions
2. Files modified
3. Files created
4. Database changes
5. API changes
6. Admin changes
7. Cart changes
8. Checkout/order changes
9. Home Decor changes
10. Solar Wobbler implementation
11. Search changes
12. SEO changes
13. Analytics changes
14. Security changes
15. Responsive testing
16. Regression testing
17. Bugs discovered
18. Bugs fixed
19. Remaining risks
20. Recommended next phase
```

Do not simply say "implemented successfully."

Explain what actually changed.

---

# FINAL ARCHITECTURAL PRINCIPLE

The desired evolution is:

```text
TODAY

VYBE
└── Poster Ecommerce
        │
        │
        ▼

TARGET

VYBE
│
├── Wall Art
│   ├── Posters
│   ├── Custom Posters
│   └── Bundles
│
└── Home Decor
    ├── Solar Wobblers
    ├── Desk Decor
    ├── Room Decor
    └── Future Products
```

while underneath:

```text
                 VYBE COMMERCE CORE
                        │
       ┌────────────────┼────────────────┐
       │                │                │
    Products           Cart           Checkout
       │                │                │
       ├────────────── Orders ───────────┤
       │                │                │
     Search          Analytics          SEO
       │                │                │
       └──────────── Admin ──────────────┘
```

Build the architecture first.

Build the feature second.

Preserve the business that already works.

Design the system for the business VYBE is becoming.