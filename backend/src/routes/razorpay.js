import { Router } from 'express';
import { db, genId } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { rzp, verifySignature } from '../services/razorpay.js';
import { createShipment } from '../services/shiprocket.js';

const router = Router();

// Step 1 of checkout: shopper has confirmed their cart and shipping address;
// we create a Razorpay order and a "pending" internal order, then hand the
// rzpOrderId back so the frontend can open the checkout modal.
router.post('/order', requireAuth, async (req, res) => {
  const { shipping } = req.body || {};
  if (!shipping || !shipping.firstName || !shipping.address1 || !shipping.pincode || !shipping.phone || !shipping.email) {
    return res.status(400).json({ error: 'Shipping address incomplete' });
  }

  // Re-price from canonical product data (never trust the client on price).
  const carts = await db.getCarts();
  const cart = carts[`user:${req.user.id}`];
  if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty' });

  const products = await db.getProducts();
  const lineItems = [];
  for (const item of cart.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    if (product.stock < item.qty) {
      return res.status(409).json({
        error: `${product.name} has only ${product.stock} left in stock`,
        productId: product.id,
      });
    }
    lineItems.push({
      productId: product.id,
      name: product.name,
      shade: product.shade,
      price: product.price,
      qty: item.qty,
    });
  }
  const subtotal = lineItems.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingFee = subtotal >= 999 ? 0 : 49; // free shipping over ₹999
  const total = subtotal + shippingFee;

  let rzpOrder;
  try {
    rzpOrder = await rzp().orders.create({
      amount: total * 100, // paise
      currency: 'INR',
      receipt: `glinte_${Date.now()}`,
      notes: { userId: req.user.id, email: req.user.email },
    });
  } catch (err) {
    console.error('Razorpay order create failed:', err);
    return res.status(502).json({ error: 'Could not initialise payment. Please try again.' });
  }

  const order = {
    id: genId('ord'),
    userId: req.user.id,
    items: lineItems,
    subtotal,
    shippingFee,
    total,
    shipping,
    status: 'pending_payment',
    razorpay: { orderId: rzpOrder.id },
    shiprocket: null,
    createdAt: new Date().toISOString(),
  };
  const orders = await db.getOrders();
  orders.push(order);
  await db.saveOrders(orders);

  res.json({
    orderId: order.id,
    rzpOrderId: rzpOrder.id,
    amount: total * 100,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
    name: 'Glinte',
    description: `${lineItems.length} item${lineItems.length === 1 ? '' : 's'}`,
    prefill: {
      name: `${shipping.firstName} ${shipping.lastName || ''}`.trim(),
      email: shipping.email,
      contact: shipping.phone,
    },
  });
});

// Step 2 of checkout: Razorpay's modal posts back signature + payment_id.
// We verify, then mark the order paid, decrement stock, clear cart, and
// hand off to Shiprocket.
router.post('/verify', requireAuth, async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ error: 'Missing verification parameters' });
  }

  const ok = verifySignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });
  if (!ok) return res.status(400).json({ error: 'Signature mismatch — payment could not be verified' });

  const orders = await db.getOrders();
  const order = orders.find((o) => o.id === orderId && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.razorpay.orderId !== razorpayOrderId) {
    return res.status(400).json({ error: 'Order ID mismatch' });
  }

  order.status = 'paid';
  order.razorpay.paymentId = razorpayPaymentId;
  order.razorpay.signature = razorpaySignature;
  order.paidAt = new Date().toISOString();

  // Decrement stock atomically (single save).
  const products = await db.getProducts();
  for (const item of order.items) {
    const p = products.find((x) => x.id === item.productId);
    if (p) p.stock = Math.max(0, p.stock - item.qty);
  }
  await db.saveProducts(products);

  // Clear the user's cart.
  const carts = await db.getCarts();
  delete carts[`user:${req.user.id}`];
  await db.saveCarts(carts);

  // Try to push to Shiprocket — but never fail the response on this. If it
  // errors we leave order in a "paid, fulfilment_pending" state for admin.
  try {
    const sr = await createShipment(order);
    order.shiprocket = {
      orderId: sr.order_id,
      shipmentId: sr.shipment_id,
      status: sr.status,
      raw: sr,
    };
    order.status = 'fulfilment_initiated';
  } catch (err) {
    console.error('Shiprocket create failed:', err.message);
    order.shiprocket = { error: err.message };
    order.status = 'fulfilment_pending';
  }

  await db.saveOrders(orders);
  res.json({ ok: true, order });
});

export default router;
