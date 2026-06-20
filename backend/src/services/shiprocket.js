// Tiny Shiprocket client. Their tokens last 10 days, so we cache one in
// memory and refresh proactively after 9.
//
// Docs: https://apidocs.shiprocket.in/

const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000;
let cachedToken = null;
let cachedAt = 0;

async function login() {
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    throw new Error(
      'Shiprocket creds missing — set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in backend/.env'
    );
  }
  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Shiprocket login failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.token;
}

async function getToken() {
  if (cachedToken && Date.now() - cachedAt < TOKEN_TTL_MS) return cachedToken;
  cachedToken = await login();
  cachedAt = Date.now();
  return cachedToken;
}

async function call(method, path, body) {
  const token = await getToken();
  const res = await fetch(`https://apiv2.shiprocket.in${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const message = data?.message || data?.errors || res.statusText;
    const err = new Error(`Shiprocket ${path} failed: ${JSON.stringify(message)}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// Map our order into Shiprocket's "Adhoc" create-order schema.
// https://apidocs.shiprocket.in/#5e7e7c8a-9a4c-4a1a-8e7f-9b3a3c7d4f5b
export async function createShipment(order) {
  const payload = {
    order_id: order.id,
    order_date: new Date(order.createdAt).toISOString().slice(0, 19).replace('T', ' '),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
    billing_customer_name: order.shipping.firstName,
    billing_last_name: order.shipping.lastName || '',
    billing_address: order.shipping.address1,
    billing_address_2: order.shipping.address2 || '',
    billing_city: order.shipping.city,
    billing_pincode: order.shipping.pincode,
    billing_state: order.shipping.state,
    billing_country: order.shipping.country || 'India',
    billing_email: order.shipping.email,
    billing_phone: order.shipping.phone,
    shipping_is_billing: true,
    order_items: order.items.map((it) => ({
      name: it.name,
      sku: it.productId,
      units: it.qty,
      selling_price: it.price,
    })),
    payment_method: 'Prepaid',
    sub_total: order.subtotal,
    length: 10,
    breadth: 10,
    height: 5,
    weight: Math.max(0.1, order.items.reduce((w, it) => w + 0.05 * it.qty, 0)),
  };
  return call('POST', '/v1/external/orders/create/adhoc', payload);
}

export async function trackShipment(shipmentId) {
  return call('GET', `/v1/external/courier/track/shipment/${shipmentId}`);
}

// Live serviceability + rate quote for the cart's destination pincode.
// Used by the cart page to show real shipping cost before checkout.
export async function getServiceability({ pickupPincode, deliveryPincode, weightKg, codAmount = 0 }) {
  const params = new URLSearchParams({
    pickup_postcode: String(pickupPincode),
    delivery_postcode: String(deliveryPincode),
    weight: String(weightKg),
    cod: String(codAmount > 0 ? 1 : 0),
  });
  return call('GET', `/v1/external/courier/serviceability/?${params}`);
}
