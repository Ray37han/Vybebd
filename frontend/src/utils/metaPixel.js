/**
 * metaPixel.js — Meta Pixel (client-side) utility for vybebd.store
 *
 * Features:
 *  - Async pixel initialisation (non-blocking)
 *  - SPA-safe PageView (fires once per pathname, not on re-renders)
 *  - Deterministic event_id for server-side deduplication with CAPI
 *  - AddToCart / Purchase debounce guards to prevent double-fires
 *  - Browser context extractor (_fbp, _fbc cookies)
 *
 * NEVER import from VITE_META_PIXEL_ID if the var is missing — the
 * snippet silently no-ops so the rest of the app continues to work.
 */

/* ─── Config ──────────────────────────────────────────────────────────────── */
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';

/* ─── Internal state ──────────────────────────────────────────────────────── */
let _initialized = false;
let _lastPageViewPath = null; // SPA dedup guard

// Debounce / fired-once guards
const _firedPurchase = new Set();   // key: event_id
const _firedAddToCart = new Set();  // key: `${productId}_${timestamp_bucket}`

/* ─── Init ────────────────────────────────────────────────────────────────── */
/**
 * Injects the Meta Pixel base code asynchronously.
 * Safe to call multiple times — idempotent.
 */
export function initMetaPixel() {
  if (_initialized || !PIXEL_ID) return;
  _initialized = true;

  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );
  /* eslint-enable */

  window.fbq('init', PIXEL_ID);
}

/* ─── SPA PageView ────────────────────────────────────────────────────────── */
/**
 * Fire PageView exactly once per unique pathname.
 * Call this inside a useEffect that depends on location.pathname.
 *
 * @param {string} pathname - current window.location.pathname
 */
export function trackPageView(pathname) {
  if (!window.fbq || !PIXEL_ID) return;
  if (_lastPageViewPath === pathname) return; // prevent re-render duplicates
  _lastPageViewPath = pathname;
  window.fbq('track', 'PageView');
}

/* ─── Generic event wrapper ───────────────────────────────────────────────── */
/**
 * @param {string}      eventName - Standard or custom Meta event name
 * @param {object}      data      - Event payload
 * @param {string|null} eventId   - Deduplication ID to match CAPI server event
 */
export function trackEvent(eventName, data = {}, eventId = null) {
  if (!window.fbq || !PIXEL_ID) return;
  const options = eventId ? { eventID: eventId } : {};
  window.fbq('track', eventName, data, options);
}

/* ─── Browser context helper ──────────────────────────────────────────────── */
/**
 * Returns { fbp, fbc } from Meta first-party cookies.
 * Forward to backend so CAPI can use them for event matching.
 */
export function getMetaBrowserContext() {
  const cookies = document.cookie.split(';').reduce((acc, c) => {
    const [k, v] = c.trim().split('=');
    if (k) acc[k] = v || '';
    return acc;
  }, {});
  return {
    fbp: cookies['_fbp'] || '',
    fbc: cookies['_fbc'] || '',
  };
}

/* ─── Payload formatters ──────────────────────────────────────────────────── */
/**
 * Standard product payload for ViewContent / AddToCart
 */
export function formatProductPayload(product, quantity = 1) {
  const id = String(product?._id || product?.id || product?.sku || '');
  const name = product?.name || product?.title || '';
  const price = Number(product?.price || product?.discountPrice || product?.basePrice || 0);
  return {
    content_ids: [id],
    content_name: name,
    content_type: 'product',
    currency: 'BDT',
    value: price * Number(quantity),
    contents: [{ id, quantity: Number(quantity), item_price: price }],
  };
}

/**
 * Cart payload for InitiateCheckout
 */
export function formatCartPayload(items = [], total = 0) {
  return {
    content_ids: items.map((i) => String(i.product?._id || i.product?.id || '')),
    content_type: 'product',
    currency: 'BDT',
    value: Number(total),
    num_items: items.reduce((s, i) => s + Number(i.quantity || 1), 0),
    contents: items.map((i) => ({
      id: String(i.product?._id || i.product?.id || ''),
      quantity: Number(i.quantity || 1),
      item_price: Number(i.product?.price || i.product?.basePrice || 0),
    })),
  };
}

/**
 * Purchase payload
 */
export function formatPurchasePayload(orderId, products = [], total = 0, currency = 'BDT') {
  return {
    content_ids: products.map((p) => String(p.productId || p.id || '')),
    content_type: 'product',
    currency,
    value: Number(total),
    order_id: String(orderId),
    contents: products.map((p) => ({
      id: String(p.productId || p.id || ''),
      quantity: Number(p.quantity || 1),
      item_price: Number(p.price || 0),
    })),
  };
}

/* ─── Deduplication-safe event wrappers ───────────────────────────────────── */

/**
 * ViewContent — deterministic event_id for CAPI dedup.
 */
export function trackViewContent(product) {
  const eventId = `view_${String(product?._id || product?.id || Date.now())}`;
  trackEvent('ViewContent', formatProductPayload(product, 1), eventId);
}

/**
 * AddToCart — 2s time-bucket dedup prevents rapid double-clicks.
 */
export function trackAddToCart(product, quantity = 1) {
  const bucket = Math.floor(Date.now() / 2000);
  const guardKey = `${String(product?._id || product?.id)}_${bucket}`;
  if (_firedAddToCart.has(guardKey)) return;
  _firedAddToCart.add(guardKey);
  setTimeout(() => _firedAddToCart.delete(guardKey), 4000);

  const eventId = `atc_${String(product?._id || product?.id)}_${Date.now()}`;
  trackEvent('AddToCart', formatProductPayload(product, quantity), eventId);
}

/**
 * InitiateCheckout — fires on checkout page mount.
 */
export function trackInitiateCheckout(items = [], total = 0) {
  trackEvent('InitiateCheckout', formatCartPayload(items, total), null);
}

/**
 * Purchase — deterministic event_id: `purchase_${orderId}`.
 * MUST match the event_id used in backend metaCapi.js.
 * sessionStorage guard prevents re-fire on page refresh.
 */
export function trackPurchase(orderId, products = [], total = 0) {
  if (!orderId) return;

  const eventId = `purchase_${orderId}`;

  // sessionStorage guard — persists across React re-renders, clears per tab
  if (sessionStorage.getItem(eventId)) return;
  if (_firedPurchase.has(eventId)) return;

  _firedPurchase.add(eventId);
  sessionStorage.setItem(eventId, '1');

  trackEvent('Purchase', formatPurchasePayload(orderId, products, total), eventId);
}
