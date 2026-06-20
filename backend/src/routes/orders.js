import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { trackShipment } from '../services/shiprocket.js';

const router = Router();

// A customer's own order history.
router.get('/', requireAuth, async (req, res) => {
  const orders = await db.getOrders();
  const mine = orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(mine);
});

router.get('/:id', requireAuth, async (req, res) => {
  const orders = await db.getOrders();
  const order = orders.find((o) => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.get('/:id/tracking', requireAuth, async (req, res) => {
  const orders = await db.getOrders();
  const order = orders.find((o) => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (!order.shiprocket?.shipmentId) {
    return res.json({ status: 'not_yet_shipped' });
  }
  try {
    const tracking = await trackShipment(order.shiprocket.shipmentId);
    res.json(tracking);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

export default router;
