import { Router } from 'express';
import { db, genId } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

// ---- Products ----
router.get('/products', async (_req, res) => {
  res.json(await db.getProducts());
});

router.post('/products', async (req, res) => {
  const products = await db.getProducts();
  const body = req.body || {};
  const slug = (body.slug || body.name || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (!slug) return res.status(400).json({ error: 'Name or slug required' });
  if (products.find((p) => p.slug === slug)) {
    return res.status(409).json({ error: 'Slug already in use' });
  }
  const product = {
    id: slug,
    slug,
    name: body.name || slug,
    shade: body.shade || '',
    shadeHex: body.shadeHex || '#F4B6C2',
    shadeFamily: body.shadeFamily || 'Pink',
    finish: body.finish || 'High Shine',
    price: Number(body.price) || 0,
    compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
    volume: body.volume || '5 ml',
    stock: Number(body.stock) || 0,
    featured: !!body.featured,
    description: body.description || '',
    longDescription: body.longDescription || '',
    ingredients: body.ingredients || '',
    howToUse: body.howToUse || '',
    images: Array.isArray(body.images) && body.images.length ? body.images : [
      `https://placehold.co/800x800/F4B6C2/3a1c25?text=${encodeURIComponent(body.name || 'Glinte')}`,
    ],
  };
  products.push(product);
  await db.saveProducts(products);
  res.status(201).json(product);
});

router.patch('/products/:id', async (req, res) => {
  const products = await db.getProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  // Don't let id/slug be changed in place — would break URLs and cart references.
  const { id: _id, slug: _slug, ...patch } = req.body || {};
  products[idx] = { ...products[idx], ...patch };
  await db.saveProducts(products);
  res.json(products[idx]);
});

router.delete('/products/:id', async (req, res) => {
  const products = await db.getProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  const [removed] = products.splice(idx, 1);
  await db.saveProducts(products);
  res.json(removed);
});

// ---- Orders ----
router.get('/orders', async (_req, res) => {
  const orders = await db.getOrders();
  res.json(orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'status required' });
  const orders = await db.getOrders();
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = status;
  await db.saveOrders(orders);
  res.json(order);
});

export default router;
