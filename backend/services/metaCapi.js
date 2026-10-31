/**
 * metaCapi.js — Meta Conversions API (CAPI) v20.0 service
 *
 * Handles server-side event firing for vybebd.store.
 * Tokens NEVER leave the backend. All PII is SHA-256 hashed before sending.
 *
 * Deduplication contract:
 *   event_id MUST match the client Pixel event_id exactly.
 *   Format: `purchase_${orderId}` (e.g. purchase_VYBE-20260923-0001)
 *
 * Supported events:
 *   - Purchase  (fired from pipeline.js after successful order creation)
 *
 * Env vars required (backend/.env):
 *   META_PIXEL_ID          — your Pixel / Dataset ID
 *   META_ACCESS_TOKEN      — System User token (never expose to frontend)
 *   META_TEST_EVENT_CODE   — (optional) for Events Manager test-events tool
 */

import crypto from 'crypto';

const PIXEL_ID       = process.env.META_PIXEL_ID;
const ACCESS_TOKEN   = process.env.META_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || '';
const API_VERSION    = 'v20.0';
const CAPI_URL       = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

/* ─── Hashing ─────────────────────────────────────────────────────────────── */
function sha256(value) {
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

/**
 * Normalise a Bangladeshi mobile number to international format without `+`.
 * Inputs handled:
 *   01XXXXXXXXX  → 8801XXXXXXXXX
 *   +8801XXXXXXXXX → 8801XXXXXXXXX
 *   8801XXXXXXXXX  → 8801XXXXXXXXX (unchanged)
 */
function normaliseBDPhone(phone = '') {
  const raw = String(phone).replace(/\s+/g, '').replace(/^\+/, '');
  if (raw.startsWith('880')) return raw;
  if (raw.startsWith('01')) return `880${raw}`;
  return raw;
}

/**
 * Build user_data payload from order.
 * All PII fields are SHA-256 hashed as required by Meta.
 *
 * @param {object} order    - PipelineOrder document (plain object)
 * @param {string} clientIp - Forwarded client IP from original request
 * @param {string} userAgent
 * @param {object} browser  - { fbp, fbc } from client (optional)
 */
function buildUserData(order, clientIp = '', userAgent = '', browser = {}) {
  const userData = {
    client_ip_address: clientIp || order.ipAddress || '',
    client_user_agent: userAgent || '',
  };

  if (order.phone) {
    userData.ph = [sha256(normaliseBDPhone(order.phone))];
  }
  if (order.email) {
    userData.em = [sha256(order.email)];
  }
  if (order.customerName) {
    // Split name into fn / ln (best-effort)
    const parts = String(order.customerName).trim().split(/\s+/);
    userData.fn = [sha256(parts[0] || '')];
    if (parts.length > 1) {
      userData.ln = [sha256(parts.slice(1).join(' '))];
    }
  }
  if (browser.fbp) userData.fbp = browser.fbp;
  if (browser.fbc) userData.fbc = browser.fbc;

  // Country code for BD
  userData.country = [sha256('bd')];

  return userData;
}

/* ─── Purchase event ──────────────────────────────────────────────────────── */
/**
 * Send a Purchase CAPI event.
 *
 * event_id = `purchase_${order.orderId}`   ← must match client Pixel eventID
 *
 * @param {object} order      - PipelineOrder plain object
 * @param {object} options    - { clientIp, userAgent, browser: { fbp, fbc } }
 */
export async function sendCapiPurchase(order, options = {}) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[CAPI] META_PIXEL_ID or META_ACCESS_TOKEN not set — skipping CAPI.');
    }
    return;
  }

  const { clientIp = '', userAgent = '', browser = {} } = options;

  // Build contents array from order.products (normalised)
  const products = Array.isArray(order.products) && order.products.length > 0
    ? order.products
    : [{ productId: order.productId || '', quantity: order.quantity || 1, price: order.price || 0 }];

  const contents = products.map((p) => ({
    id: String(p.productId || p.id || ''),
    quantity: Number(p.quantity || 1),
    item_price: Number(p.price || 0),
  }));

  const customData = {
    currency: 'BDT',
    value: Number(order.total || 0),
    order_id: String(order.orderId),
    content_type: 'product',
    content_ids: contents.map((c) => c.id),
    contents,
    // Payment method context (custom)
    payment_method: order.paymentMethod || '',
  };

  const event = {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: order.pageUrl || 'https://vybebd.store/checkout',
    event_id: `purchase_${order.orderId}`,   // ← deterministic dedup ID
    user_data: buildUserData(order, clientIp, userAgent, browser),
    custom_data: customData,
  };

  const body = {
    data: [event],
  };
  if (TEST_EVENT_CODE) {
    body.test_event_code = TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(`${CAPI_URL}?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      console.error('[CAPI] Purchase event error:', JSON.stringify(json));
    } else {
      console.log(`[CAPI] Purchase sent — orderId=${order.orderId} events_received=${json.events_received ?? '?'}`);
    }
  } catch (err) {
    // Non-fatal — never block the order response
    console.error('[CAPI] Network error sending Purchase event:', err.message);
  }
}

/**
 * Generic CAPI event sender for future events (ViewContent, AddToCart, etc.)
 * Can be used by any route that needs server-side signals.
 *
 * @param {string} eventName
 * @param {object} eventData  - { userData, customData, eventSourceUrl, eventId, actionSource }
 */
export async function sendCapiEvent(eventName, eventData = {}) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return;

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: eventData.actionSource || 'website',
    event_source_url: eventData.eventSourceUrl || 'https://vybebd.store',
    user_data: eventData.userData || {},
    custom_data: eventData.customData || {},
  };
  if (eventData.eventId) event.event_id = eventData.eventId;

  const body = { data: [event] };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(`${CAPI_URL}?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      console.error(`[CAPI] ${eventName} error:`, JSON.stringify(json));
    }
  } catch (err) {
    console.error(`[CAPI] ${eventName} network error:`, err.message);
  }
}
