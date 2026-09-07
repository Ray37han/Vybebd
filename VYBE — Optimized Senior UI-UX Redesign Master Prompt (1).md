# VYBE — OPTIMIZED UI/UX REDESIGN MASTER PROMPT

**Project:** VYBE — vybebd.store  
**Stack:** React 18 + Vite + Tailwind CSS + MERN + Firebase OTP  
**Scope:** Frontend homepage and shared customer-facing UI only  
**Primary objective:** Transform the existing VYBE interface into a premium, cohesive, conversion-focused home-decor / wall-art experience while preserving VYBE's original identity, products, personality, and existing architecture.

---

# 0. ROLE

You are acting as a **principal product designer + senior frontend engineer + UX strategist**.

Your job is NOT to redesign VYBE from scratch.

Your job is to **evolve the existing VYBE experience into a significantly more polished version of itself.**

Think:

> **VYBE 2.0 — not a different brand.**

The final result must feel like VYBE has matured, not like VYBE copied another company's website.

Prioritize:

1. Brand identity
2. Visual hierarchy
3. Product discovery
4. Conversion
5. Mobile UX
6. Performance
7. Accessibility
8. Maintainability

Do not sacrifice VYBE's personality for minimalism.

---

# 1. CORE BRAND DIRECTION

## VYBE positioning

VYBE should communicate:

> **Premium wall art and expressive home decor for people who want their space to reflect what they love.**

VYBE sells:

- Sports posters
- Anime / gaming posters
- Custom posters / prints
- Photo frames
- Canvas / wall art
- Home-decor products
- Solar Wobbler
- Bundles and curated collections

The brand should feel:

- Young
- Premium
- Creative
- Expressive
- Slightly edgy
- Modern
- Social-media native
- Personal
- Aspirational without feeling expensive or corporate

Avoid making VYBE feel:

- Corporate
- Generic ecommerce
- Luxury-fashion sterile
- Template-generated
- Overly futuristic
- Excessively neon
- Like an Apple clone

---

# 2. THE MOST IMPORTANT DESIGN PRINCIPLE

## PRODUCT FIRST. BRAND SECOND. UI THIRD.

The products should provide most of the visual color.

The interface should provide the structure.

Do NOT use gradients and saturated colors to make the website look exciting.

Instead:

> **Neutral interface + beautiful product photography + controlled accent color + intentional motion.**

VYBE should feel visually rich because the products are interesting—not because every section has a different color.

---

# 3. CURRENT CORE PROBLEM

The homepage currently behaves like several independent landing pages stacked together.

The hero carousel presents:

1. Solar Wobbler
2. Sports posters
3. Anime / gaming
4. Custom prints

Each slide changes:

- headline
- CTA
- visual mood
- promotional messaging
- colors
- sales proposition

This creates cognitive fragmentation.

A first-time visitor should understand VYBE within approximately **3 seconds**.

The homepage must therefore communicate one clear idea first, then progressively reveal the breadth of the brand.

---

# 4. NEW HOMEPAGE STORY

Use this narrative:

### STEP 1 — WHAT IS VYBE?

Hero.

### STEP 2 — WHAT CAN I SHOP?

Shop by Passion.

### STEP 3 — WHAT IS POPULAR?

Trending Now.

### STEP 4 — WHAT ELSE DO YOU SELL?

Home Decor.

### STEP 5 — WHAT MAKES VYBE DIFFERENT?

Custom Poster + Solar Wobbler.

### STEP 6 — WHY SHOULD I TRUST YOU?

Why Shop With VYBE.

### STEP 7 — WHAT ARE OTHER PEOPLE BUYING?

Social Proof.

### STEP 8 — WHAT SHOULD I DO NEXT?

Email capture / final CTA.

This should feel like a deliberate story, not a collection of components.

---

# 5. NON-NEGOTIABLE HOMEPAGE STRUCTURE

Implement this order:

```text
Announcement Bar
↓
Header / Navigation
↓
Hero
↓
Shop by Passion
↓
Trending Now
↓
Home Decor
↓
Custom Poster Chapter
↓
Solar Wobbler Chapter
↓
Why Shop With VYBE
↓
Bundle & Save
↓
Social Proof
↓
Newsletter
↓
Footer
```

Do not introduce additional major sections without a clear UX reason.

---

# 6. P0 — CRITICAL FIXES

These must be completed before visual polishing.

---

## P0.1 — REMOVE THE MULTI-MESSAGE AUTO HERO

Remove the current four-message auto-advancing hero.

The hero must have:

- One primary story
- One visual
- One headline
- One supporting statement
- One primary CTA
- One secondary CTA

Recommended positioning:

> **Premium wall art for what you're into.**

Supporting copy should explain that VYBE brings together sports, anime, gaming, custom prints and expressive decor.

The hero should primarily showcase the strongest current product/category.

### Important

Do NOT destroy existing hero assets.

Reuse the strongest existing photography where appropriate.

The other existing hero stories should become dedicated sections later in the page.

---

## P0.2 — IF A CAROUSEL IS RETAINED

If existing architecture makes a carousel useful:

- Manual interaction only
- No autoplay
- No automatic slide rotation
- Visible pagination
- Keyboard accessible
- Swipe support
- Proper ARIA labels
- 44×44px minimum controls
- Pause state must be unnecessary because autoplay is disabled

Prefer a static hero.

---

## P0.3 — DECOUPLE ANNOUNCEMENT BAR

The announcement bar must be completely independent from hero content.

Use one persistent message.

Example:

> **Cash on Delivery available nationwide • Fast delivery across Bangladesh**

Requirements:

- Same message site-wide
- Dismissible
- Persist dismissal for the session
- No relation to hero state
- No visual jumping when dismissed
- Mobile text must remain readable

Do not rotate promotional messages automatically.

---

## P0.4 — REMOVE EMPTY GRAY SECTION

Locate the empty gray horizontal section between newsletter and footer.

Determine its source.

Remove it if unused.

Do not simply hide it with:

```css
display: none;
```

unless the element is genuinely required by the architecture.

Remove the unnecessary component/markup when safe.

Verify:

- desktop
- tablet
- mobile

There must be no unexplained empty horizontal region.

---

## P0.5 — REMOVE DUPLICATE NEWSLETTER

There must be exactly **one primary email capture experience**.

Keep:

> Upgrade Your Walls

as the primary pre-footer newsletter section.

Remove the duplicate newsletter input from the footer.

Replace that footer area with:

- payment methods
- customer support information
- useful navigation
- social links

Do not create another email field.

---

## P0.6 — ADMIN NAVIGATION

The customer-facing navigation must never advertise admin functionality to normal customers.

Render:

```tsx
user?.role === "admin"
```

before displaying Admin Panel.

Important:

This is only a frontend visibility improvement.

Do NOT modify authentication, authorization, Firebase OTP, backend permissions, or admin security architecture during this task.

---

## P0.7 — SOCIAL EMBEDS

Remove raw Instagram/Facebook embed presentation from the visual layout.

Build a native VYBE social-proof card.

Each card should contain:

- image
- short curated caption
- optional username
- optional platform icon
- small "View on Instagram ↗" / equivalent link

Do not reproduce the full external embed UI.

The card should visually belong to the VYBE design system.

---

## P0.8 — HOME DECOR

Do not use emoji as product/category imagery.

Bad:

```text
🛏️
🕐
🖼️
🎨
```

Use:

1. Real product photography, preferred
2. Existing valid product images
3. Professionally art-directed placeholder imagery

If no suitable imagery exists:

**do not invent fake product photography.**

Instead, build the section so real imagery can be inserted later without redesigning the component.

---

# 7. DESIGN SYSTEM

Create a small, centralized design system.

Do not scatter visual decisions throughout components.

---

## 7.1 COLOR SYSTEM

Use:

### Base

```text
Background: near-black
Surface: slightly lighter dark
Text: warm/off-white
Muted text: subdued gray
Border: low-contrast neutral
```

Recommended base:

```text
#0B0B10
```

Use one primary accent.

Choose the existing VYBE accent that best represents the brand after inspecting the current implementation.

Do NOT force both gold and violet to compete as primary brand colors.

Recommended rule:

```text
Neutral UI
+
One VYBE accent
+
Product photography provides color
```

Avoid:

- rainbow section backgrounds
- arbitrary gradients
- unrelated green/red/blue/pink/purple cards
- excessive glow
- neon borders

Gradients may be used only when they improve hierarchy or integrate naturally with existing VYBE visuals.

---

# 8. TYPOGRAPHY

Create one typography hierarchy.

Use:

### Display

For:

- hero headline
- major chapter headings

### Body/UI

For:

- descriptions
- navigation
- buttons
- metadata

Maximum:

- 2 font families
- 2–3 meaningful weights
- consistent hierarchy

Do not give every section its own typography personality.

The typography should feel like one brand system.

---

# 9. SPACING SYSTEM

Use an 8-point spacing rhythm:

```text
8
16
24
32
48
64
96
```

Where appropriate, use larger values for cinematic hero/chapter sections.

Do not create random spacing values without a reason.

---

# 10. CARD SYSTEM

Create one reusable card language.

Cards should share:

- consistent radius
- border treatment
- shadow behavior
- image treatment
- hover behavior
- internal spacing

Product cards can vary in size.

Their visual language should not change.

Avoid having:

```text
card A = 12px radius
card B = 24px radius
card C = square
card D = giant glow
```

unless there is a strong functional reason.

---

# 11. BUTTON SYSTEM

Exactly two primary button styles.

### Primary

- solid VYBE accent
- white/dark high-contrast text depending on accent
- pill shape
- strong hover state

### Secondary

- transparent
- subtle border
- pill shape
- clear hover state

Badges are NOT buttons.

For example:

```text
SAVE 25%
BESTSELLER
NEW
LIMITED
```

must be visually distinct from interactive controls.

---

# 12. HERO DESIGN

The hero should feel cinematic.

Structure:

```text
[large visual]
     +
[content block]
```

Content:

```text
Eyebrow
Headline
Short supporting copy

[Primary CTA] [Secondary CTA]
```

Do not overload the hero.

Target:

- headline: concise
- supporting copy: 1–2 lines desktop
- CTA count: maximum 2

---

## Hero contrast

Use a consistent image scrim where necessary.

Example concept:

```css
linear-gradient(
  90deg,
  rgba(0,0,0,.78),
  rgba(0,0,0,.35),
  transparent
)
```

But do not blindly apply the exact gradient to every image.

The goal is:

> predictable readable text while preserving the photography.

Check contrast visually and semantically.

---

# 13. SHOP BY PASSION

Keep the existing category concept.

Improve consistency.

Every category tile must follow the same content architecture:

```text
Image
Category
Short description
Explore →
```

OR:

```text
Image
Category
Explore →
```

Choose one.

Do not mix formats randomly.

Categories can include:

- Football
- Cricket
- Anime
- Gaming
- Movies
- Music
- Cars
- etc.

The image should communicate the category immediately.

---

# 14. TRENDING NOW

Keep the existing product grid if it is already performing well visually.

Preserve useful existing functionality such as:

- sale badges
- discount labels
- quick view
- pricing
- product images

Improve:

- consistency
- whitespace
- typography
- image aspect ratio
- hover states
- mobile scrolling
- loading behavior

Do not redesign a good component merely for novelty.

---

# 15. HOME DECOR

This section introduces VYBE's broader product direction.

It must feel like a real expansion of the brand.

Possible categories:

```text
Photo Frames
Canvas Prints
Wall Clocks
Cushion Covers
```

Use real imagery.

Each card should answer:

> "What is this?"

within one glance.

---

# 16. CUSTOM POSTER CHAPTER

Turn the former custom-poster hero slide into a dedicated immersive section.

Structure:

```text
Large photography
+
Story
+
CTA
```

Suggested hierarchy:

```text
MAKE IT YOURS

Create a wall piece that means something to you.

[Create Your Poster]
```

This should feel more editorial than a normal product card.

---

# 17. SOLAR WOBBLER CHAPTER

Give Solar Wobbler its own visual chapter.

Do not make it compete with the main hero.

Position it as:

> VYBE's unusual / collectible / conversation-piece product.

Use:

- large product photography
- short story
- clear CTA
- restrained motion

Avoid excessive animations.

---

# 18. WHY SHOP WITH VYBE

Keep the existing trust section.

This section is already one of the strongest parts of the page.

Preserve its core concept.

Possible benefits:

- Cash on Delivery
- bKash / Nagad
- Fast Delivery
- Quality Products
- Customer Support

Improve consistency only.

Do not repeat these same benefits beneath every hero.

---

# 19. BUNDLE & SAVE

Keep this section.

Make it feel like a curated VYBE offer rather than a generic ecommerce discount banner.

Use:

- strong product imagery
- one accent
- clear price hierarchy
- one primary CTA
- optional secondary CTA

Avoid excessive gradient effects.

---

# 20. SOCIAL PROOF

Use native VYBE cards.

Example:

```text
[Customer/Product Image]

★★★★★

"Short curated customer statement."

@username

View on Instagram ↗
```

The cards should feel editorial and trustworthy.

Do not allow external embed UI to determine your layout.

---

# 21. NEWSLETTER

Use one newsletter section only.

Purpose:

> Convert visitors who are interested but not ready to buy.

Keep:

- strong headline
- short value proposition
- email input
- one CTA

Do not make it visually louder than the products.

---

# 22. FOOTER

Create a clean 3–4 column footer.

Suggested:

### Shop

- Posters
- Custom Posters
- Home Decor
- Solar Wobbler
- Bundles

### Support

- Contact
- Shipping
- Returns
- FAQs

### VYBE

- About
- Instagram
- Facebook
- Terms
- Privacy

### Payment / Trust

- bKash
- Nagad
- Cash on Delivery
- delivery information

No newsletter input.

---

# 23. RESPONSIVE DESIGN

Mobile is NOT a collapsed desktop layout.

Design mobile intentionally.

Target widths:

```text
Mobile
Tablet
Desktop
Large desktop
```

Check especially:

### Mobile

- hero crop
- headline wrapping
- CTA width
- card horizontal scrolling
- navigation
- hamburger interaction
- image loading
- footer density
- tap targets

Minimum interactive target:

```text
44 × 44px
```

Avoid:

- tiny arrows
- cramped CTA stacks
- horizontal overflow
- clipped text
- awkward whitespace
- excessively tall sections

---

# 24. MOTION SYSTEM

Motion should communicate hierarchy.

Use:

```text
150–300ms
ease-out
```

for normal interactions.

Recommended:

- button hover
- card hover
- image scale
- navigation transitions
- section reveal

Major sections may use subtle scroll reveal.

Do NOT animate everything.

Never create:

- constant floating animations
- aggressive parallax
- unnecessary spinning
- auto-playing visual distractions

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

and reduce/disable non-essential animation.

---

# 25. PERFORMANCE

Visual quality must not come at the expense of performance.

Prioritize:

- responsive images
- lazy loading below-the-fold images
- appropriate image dimensions
- avoiding unnecessary JavaScript
- minimizing third-party embeds
- avoiding layout shift
- stable image aspect ratios
- reusable components
- no unnecessary dependency additions

Do not install a library when the requirement can be solved cleanly with existing React/Tailwind capabilities.

---

# 26. ACCESSIBILITY

Ensure:

### Navigation

- proper labels
- keyboard navigation
- focus states

### Buttons

- descriptive labels
- minimum 44×44px targets

### Images

Use meaningful alt text.

Bad:

```text
poster1.jpg
image.png
```

Good:

```text
Cristiano Ronaldo football poster
```

Decorative images should use appropriate empty alt attributes.

### Contrast

Maintain readable contrast across:

- text
- buttons
- navigation
- cards
- overlays

### Motion

Respect reduced-motion preferences.

---

# 27. CODE ARCHITECTURE

Before editing:

1. Inspect the existing frontend architecture.
2. Identify reusable components.
3. Locate homepage sections.
4. Locate global layout/header/footer.
5. Locate Tailwind configuration.
6. Identify existing design tokens.
7. Identify existing image utilities.
8. Identify existing authentication/user state.

Do NOT immediately rewrite files.

Reuse existing architecture whenever practical.

---

# 28. IMPLEMENTATION RULES

For every change:

1. Search for the actual component responsible for the UI.
2. Understand its current dependencies.
3. Make the smallest sensible architectural change.
4. Preserve existing functionality.
5. Reuse existing assets where appropriate.
6. Avoid unrelated refactors.
7. Keep components maintainable.
8. Test after meaningful changes.
9. Check desktop and mobile.
10. Fix regressions before continuing.

---

# 29. STRICT SCOPE

This redesign is primarily frontend UI/UX.

DO NOT modify:

```text
backend/
Firebase authentication logic
OTP implementation
payment processing
checkout business logic
order processing
database schema
admin authorization architecture
```

unless a tiny frontend integration change is absolutely required for the UI.

If you discover a backend issue:

> Document it instead of silently changing it.

---

# 30. IMPLEMENTATION PHASES

Work in these phases.

## PHASE 1 — AUDIT

Before changing code:

- inspect the frontend
- map homepage components
- identify duplicated UI
- identify existing tokens
- identify existing hero implementation
- identify social embed implementation
- identify newsletter implementations
- identify admin navigation
- identify empty gray element
- identify image sources

Output a concise implementation map internally.

Do not rewrite the application.

---

## PHASE 2 — P0 FIXES

Implement:

1. Remove multi-message auto hero
2. Decouple announcement bar
3. Remove empty gray region
4. Remove duplicate newsletter
5. Gate Admin Panel
6. Replace social embeds
7. Remove emoji product placeholders

Verify the page after each meaningful fix.

---

## PHASE 3 — DESIGN SYSTEM

Implement:

- colors
- typography
- spacing
- card primitive
- button primitive
- badges
- interaction states
- focus states

Do not create unnecessary abstractions.

---

## PHASE 4 — HOMEPAGE STORY

Rebuild the homepage flow:

```text
Announcement
Hero
Shop by Passion
Trending
Home Decor
Custom Poster
Solar Wobbler
Why VYBE
Bundles
Social Proof
Newsletter
Footer
```

---

## PHASE 5 — RESPONSIVE POLISH

Test:

```text
mobile
tablet
desktop
large desktop
```

Pay special attention to:

- hero
- grids
- horizontal overflow
- CTA sizing
- navigation
- typography
- footer
- image crops

---

## PHASE 6 — PERFORMANCE + ACCESSIBILITY

Check:

- image loading
- layout stability
- unnecessary renders
- third-party embeds
- keyboard navigation
- screen-reader labels
- contrast
- reduced motion
- touch targets

---

# 31. VISUAL QUALITY BAR

Before considering the task complete, the homepage should pass this test:

### 3-second test

A new visitor should understand:

> **What VYBE sells and why it is interesting.**

### 10-second test

A visitor should understand:

> **What categories they can shop.**

### 30-second test

A visitor should discover:

> **Trending products + custom products + unique products + trust signals.**

### Visual test

The page should feel:

> **One brand, one design language, many products.**

Not:

> Four landing pages stitched together.

---

# 32. "DO NOT" LIST

Do NOT:

- turn VYBE into an Apple clone
- remove VYBE's personality
- make everything white/minimal
- add unnecessary glassmorphism
- add excessive gradients
- add neon everywhere
- add excessive animations
- use emoji as product imagery
- use raw social embeds
- create duplicate CTAs
- create duplicate newsletter forms
- hide problems with CSS hacks
- introduce unnecessary dependencies
- rewrite unrelated backend code
- replace good existing components without reason
- invent fake product photography
- hardcode random colors throughout components
- create inconsistent card styles
- make mobile an afterthought

---

# 33. PRESERVE WHAT ALREADY WORKS

This is critical.

Do not assume everything existing is bad.

Preserve strong existing elements when they already work:

- product cards
- pricing presentation
- sale badges
- quick view
- product imagery
- VYBE brand language
- trust section
- useful ecommerce interactions
- existing responsive behavior
- existing Tailwind architecture

Improve them rather than replacing them unnecessarily.

---

# 34. SUCCESS CRITERIA

The redesign is successful when:

### Brand

VYBE is immediately recognizable.

### UX

Visitors can understand and navigate the product ecosystem effortlessly.

### Visuals

The page feels premium, cohesive and intentional.

### Conversion

CTAs are clear without becoming aggressive.

### Mobile

The experience feels designed—not compressed.

### Performance

The page remains fast despite richer visuals.

### Accessibility

Core interactions are keyboard and screen-reader friendly.

### Architecture

The implementation remains maintainable.

### Most importantly

The final website should make someone think:

> **"This feels like VYBE, just significantly better."**

---

# 35. FINAL EXECUTION COMMAND

Start by inspecting the existing frontend.

Do not immediately code.

First understand:

```text
component structure
homepage architecture
design tokens
Tailwind configuration
image system
navigation
hero
product cards
social embeds
newsletter
footer
authentication state
```

Then execute the redesign in the defined phases.

After each phase:

1. verify functionality
2. verify desktop layout
3. verify mobile layout
4. check for regressions
5. continue only when stable

Prioritize correctness over speed.

Prioritize coherence over novelty.

Prioritize VYBE's identity over generic "premium ecommerce" aesthetics.

The final result should be:

> **VYBE — evolved, not replaced.**