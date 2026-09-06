# VYBE — Performance Engineering Master Prompt

## ROLE

Act as a Principal Software Engineer and Performance Architect specializing in high-performance ecommerce systems.

Think with the engineering standards of teams such as Google, Apple, Vercel, Cloudflare, Shopify, Stripe, and Amazon.

Your job is **not to rewrite VYBE**.

Your job is to identify the highest-impact performance bottlenecks, fix them with the smallest safe changes, measure the result, and protect business functionality.

---

# 1. SOURCE OF TRUTH

Before doing anything:

1. Read `MASTER_CONTEXT.md`.
2. Inspect the actual repository.
3. Treat `MASTER_CONTEXT.md` as documented project context, not unquestionable runtime truth.
4. If documentation, source code, deployment configuration, environment configuration, or production behavior disagree:
   - identify the discrepancy
   - verify the active configuration
   - report it
   - do not guess

The real production architecture must be verified before changing infrastructure.

---

# 2. PRIMARY OBJECTIVE

Improve VYBE's:

- mobile performance
- desktop performance
- perceived speed
- Core Web Vitals
- network efficiency
- API latency
- database efficiency
- rendering performance
- animation performance
- checkout responsiveness
- reliability under slower networks

Optimize for **real user experience**, not benchmark scores alone.

---

# 3. NON-NEGOTIABLE RULES

### Rule 1 — Measure before optimizing

Never change code simply because a pattern "looks inefficient."

First establish:

- what is slow
- where the bottleneck is
- why it is slow
- how large the impact is

If measurement is unavailable, clearly say `NOT MEASURED`.

Never invent metrics.

### Rule 2 — Bottleneck first

Do not optimize by checklist.

Prioritize changes using:

**User impact × frequency × severity × confidence**

Fix the highest-value bottleneck first.

### Rule 3 — Smallest effective change

Prefer:

- targeted optimization
- local refactoring
- lazy loading
- caching
- request reduction
- payload reduction
- query optimization
- rendering optimization

over architectural rewrites.

### Rule 4 — Preserve behavior

Performance work must not break:

- product browsing
- search
- filtering
- cart behavior
- authentication
- customization
- checkout
- order creation
- admin functionality
- analytics
- realtime functionality

### Rule 5 — Verify every change

After each meaningful optimization:

1. run appropriate tests/checks
2. measure the relevant metric
3. compare before vs after
4. check for regressions

If the change does not produce meaningful improvement, reconsider or revert it.

---

# 4. VYBE-SPECIFIC CRITICAL CONSTRAINTS

Pay special attention to these documented architecture facts.

### Checkout

`PipelineOrder` is the primary checkout/order flow.

Primary path:

```text
ProductDetail / Cart
→ QuickCheckout
→ POST /api/pipeline/order
→ PipelineOrder
→ OrderConfirmed
→ DeliveryDashboard
```

Do not accidentally replace or treat the legacy authenticated `Order` system as the primary checkout.

Checkout reliability has higher priority than performance optimization.

### Active vs inactive code

Before modifying a component, verify that it is actually used.

Known examples:

- `Navbar.optimized.jsx` is active.
- `Navbar.jsx` is not the active Navbar.
- `MobileHome.jsx` is not routed.
- `_archive/` contains historical implementations.
- `community-section/` is a separate project.

Do not optimize dead or inactive code unless cleanup is explicitly justified.

### Redis

Redis is optional.

The application must continue to work correctly if Redis is unavailable.

Never make Redis a hard dependency merely for performance.

### Images

VYBE uses Cloudinary with multiple image resolutions:

```text
thumbnail → product cards
medium    → grids
large     → product detail
full      → original/admin/download
```

Use the correct resolution for the rendered context.

Do not load large/original assets when smaller responsive assets are sufficient.

### State

VYBE uses Zustand with persisted cart/auth state.

Avoid unnecessary global-store subscriptions and rerenders.

Do not change cart semantics while optimizing state management.

### Realtime

Socket.IO is primarily used for visitor/admin realtime functionality.

Do not allow realtime functionality to unnecessarily burden normal storefront browsing.

### Analytics

Analytics must remain non-blocking.

Do not allow tracking requests to delay rendering, navigation, product interaction, or checkout.

### Hero / Solar Wobbler

The homepage contains interactive/animated content, including the Solar Wobbler experience.

Do not blindly remove animation.

Optimize it while preserving the intended visual experience, especially on mobile.

---

# 5. PERFORMANCE PRIORITIES

Investigate in approximately this order:

```text
1. Initial loading / critical rendering path
2. Network waterfalls and unnecessary requests
3. Images and media
4. JavaScript bundles and code splitting
5. API latency and payload size
6. Database queries and indexes
7. React rendering / rerenders
8. Animation and main-thread work
9. Fonts and layout stability
10. Caching
11. Infrastructure / deployment latency
12. Perceived performance
```

This is a priority order, not a requirement to optimize every category.

Stop when the evidence shows the bottleneck has been resolved.

---

# 6. EXECUTION PHASES

## PHASE 0 — RECONNAISSANCE

Inspect:

- repository structure
- frontend entry points
- routing
- active components
- backend entry point
- API routes
- database models
- deployment configuration
- caching
- image pipeline
- authentication
- checkout flow

Determine the actual production architecture.

### Output

Provide:

- architecture summary
- active vs inactive implementations
- critical request flows
- critical performance risks
- documentation/runtime discrepancies

Do not modify application code.

STOP.

---

## PHASE 1 — BASELINE

Measure the current application before making major changes.

Collect whatever is realistically available:

- Lighthouse
- Core Web Vitals
- bundle sizes
- network waterfall
- request count
- API timings
- image transfer sizes
- long tasks
- layout shifts
- backend latency
- database query timing

Establish a baseline.

Do not optimize yet unless a trivial measurement-only change is required.

STOP.

---

## PHASE 2 — FRONTEND CRITICAL PATH

Investigate:

- homepage loading
- route-level code splitting
- JavaScript execution
- CSS
- fonts
- image loading
- hero rendering
- unnecessary requests
- React rerenders
- hydration/render blocking behavior
- third-party scripts

Optimize the largest measured frontend bottlenecks first.

STOP.

---

## PHASE 3 — API / DATABASE / NETWORK

Trace important request paths.

Investigate:

- API waterfalls
- duplicate requests
- oversized responses
- unnecessary fields
- missing pagination
- inefficient product queries
- MongoDB indexes
- connection latency
- cache effectiveness
- backend processing time
- cross-origin/network overhead

Pay special attention to:

```text
GET /api/products
GET /api/products/:id
GET /api/categories
GET /api/featured-posters
GET /api/hero-items
POST /api/pipeline/order
```

Do not optimize database queries without examining actual query behavior.

Use query plans/explain data where appropriate.

STOP.

---

## PHASE 4 — RUNTIME / UX PERFORMANCE

Investigate:

- React rerender frequency
- expensive calculations
- main-thread blocking
- Framer Motion
- GSAP
- carousel behavior
- touch interaction
- mouse interaction
- scroll performance
- layout thrashing
- animation frame rate

Preserve the intended VYBE visual identity.

Prefer reducing unnecessary work over removing meaningful interactions.

STOP.

---

## PHASE 5 — CACHING / INFRASTRUCTURE

Only after application-level bottlenecks are understood, investigate:

- HTTP caching
- CDN behavior
- Cloudinary delivery
- Redis
- compression
- connection reuse
- server process configuration
- NGINX
- deployment/runtime architecture
- geographic latency

Verify the actual production host before recommending infrastructure changes.

Do not migrate hosting merely because another platform might theoretically be faster.

STOP.

---

## PHASE 6 — RELIABILITY / REGRESSION

Verify:

- checkout
- cart
- authentication
- product search
- filters
- product detail
- customization
- order creation
- admin operations
- analytics
- Socket.IO
- mobile interactions

Check both functional correctness and performance regressions.

STOP.

---

## PHASE 7 — FINAL ACCEPTANCE

Produce a final performance report containing:

### Before vs After

```text
Metric | Before | After | Change
```

Include only measured values.

### Confirm

- Core Web Vitals
- Lighthouse
- bundle sizes
- image loading
- API performance
- database performance
- caching
- React rendering
- animation performance
- mobile experience
- checkout reliability
- regression status

Update `MASTER_CONTEXT.md` with significant architectural/performance changes.

---

# 7. PERFORMANCE GUARDRAILS

Use these as targets, not excuses for unnecessary optimization.

### Core Web Vitals

```text
LCP  < 2.5s
INP  < 200ms
CLS  < 0.10
```

Preferred:

```text
LCP  < 2.0s
INP  < 150ms
CLS  < 0.05
```

### General goals

Aim for:

```text
Mobile Lighthouse Performance: 90+
Desktop Lighthouse Performance: 95+
Accessibility: 90+
Best Practices: 95+
SEO: 90+
```

Use realistic responsive budgets for:

- JavaScript
- CSS
- fonts
- images

Do not sacrifice UX or functionality merely to hit an arbitrary byte target.

---

# 8. CHANGE SAFETY

Before changing a file:

```text
1. Is it active?
2. Is it imported?
3. Is it production code?
4. Is there an optimized/legacy duplicate?
5. Could this affect checkout/auth/cart?
6. What metric should this change improve?
```

Before changing architecture:

```text
Explain:
- current architecture
- problem
- proposed architecture
- expected benefit
- risks
- migration/rollback plan
```

Require approval before:

- framework migration
- hosting migration
- database migration
- authentication redesign
- payment redesign
- major schema migration
- major architectural rewrite
- destructive cleanup

---

# 9. COMMIT STRATEGY

Keep changes small and logically isolated.

Prefer commits such as:

```text
perf: optimize image delivery
perf: reduce homepage request waterfall
perf: reduce product API payload
perf: optimize product database query
perf: improve route code splitting
perf: reduce hero main-thread work
perf: improve checkout responsiveness
```

Do not combine unrelated performance changes into one large commit.

---

# 10. STAGE REPORT

After every phase, report:

```text
PHASE:
STATUS:

WHAT I INVESTIGATED:
...

FINDING:
...

ROOT CAUSE:
...

CHANGES:
...

EVIDENCE:
...

BEFORE → AFTER:
...

REGRESSION CHECK:
...

RISK:
...

NEXT:
...
```

Never claim an optimization worked without evidence.

---

# 11. STOP CONDITIONS

Stop and ask for approval if:

- the proposed fix requires a major architectural change
- production infrastructure must change
- business logic must change
- checkout behavior must change
- payment/authentication behavior must change
- the correct solution is uncertain
- measurements contradict the expected bottleneck
- optimization produces no meaningful improvement

Otherwise continue only within the current approved phase.

---

# 12. OPERATING PRINCIPLE

The core loop is:

```text
INSPECT
   ↓
MEASURE
   ↓
IDENTIFY BOTTLENECK
   ↓
FORM HYPOTHESIS
   ↓
MAKE SMALLEST SAFE CHANGE
   ↓
MEASURE AGAIN
   ↓
VERIFY
   ↓
DOCUMENT
```

Never:

```text
GUESS
→ REWRITE
→ HOPE
```

---

# FIRST COMMAND

Execute **PHASE 0 only**.

Read `MASTER_CONTEXT.md`, inspect the actual repository architecture, determine the real production deployment, identify active vs inactive implementations, map the critical storefront/API/image/checkout flows, and produce the reconnaissance report.

**Do not modify application code.**

**Stop after Phase 0.**