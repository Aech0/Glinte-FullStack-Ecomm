import { Router } from 'express';
import { db, genId } from '../db.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = Router();

const ANON_COOKIE = 'glinte_cart_id';
// Per the brief: cart is server-side. Anonymous shoppers get a httpOnly
// cookie that keys their cart in carts.json; logged-in shoppers key on userId.
// Logging in merges the anon cart into the user cart, then clears the cookie.

function cartKey(req) {
  if (req.user) return `user:${req.user.id}`;
  const anonId = req.cookies?.[ANON_COOKIE];
  return anonId ? `anon:${anonId}` : null;
}

function ensureAnonCookie(req, res) {
  if (req.user) return null;
  let anonId = req.cookies?.[ANON_COOKIE];
  if (!anonId) {
    anonId = genId('anon');
    res.cookie(ANON_COOKIE, anonId, {
      httpOnly: true,
      sameSite: 'lax',
      // 30 days. Don't set `secure: true` in dev — that would block over http.
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
  return `anon:${anonId}`;
}

async function loadCart(key) {
  if (!key) return { items: [] };
  const carts = await db.getCarts();
  return carts[key] || { items: [], updatedAt: null };
}

async function persistCart(key, cart) {
  const carts = await db.getCarts();
  carts[key] = { ...cart, updatedAt: new Date().toISOString() };
  await db.saveCarts(carts);
}

// Hydrates a stored cart into something the frontend can render directly:
// each item gets product info + a flag showing whether the requested quantity
// is currently in stock.
async function hydrate(cart) {
  const products = await db.getProducts();
  const items = cart.items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null; // product was deleted — quietly drop
      const availableStock = product.stock;
      const stockStatus =
        availableStock <= 0
          ? 'out_of_stock'
          : availableStock < item.qty
            ? 'limited_stock'
            : 'in_stock';
      return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        shade: product.shade,
        shadeHex: product.shadeHex,
        image: product.images[0],
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        qty: item.qty,
        availableStock,
        stockStatus,
        lineTotal: product.price * item.qty,
      };
    })
    .filter(Boolean);

  const subtotal = items
    .filter((i) => i.stockStatus !== 'out_of_stock')
    .reduce((sum, i) => sum + i.lineTotal, 0);
  const hasUnavailable = items.some((i) => i.stockStatus === 'out_of_stock');
  const hasLimitedStock = items.some((i) => i.stockStatus === 'limited_stock');

  return { items, subtotal, hasUnavailable, hasLimitedStock };
}

router.get('/', optionalAuth, async (req, res) => {
  const key = cartKey(req);
  const cart = await loadCart(key);
  res.json(await hydrate(cart));
});

router.post('/items', optionalAuth, async (req, res) => {
  const { productId, qty = 1 } = req.body || {};
  if (!productId) return res.status(400).json({ error: 'productId required' });
  if (qty < 1) return res.status(400).json({ error: 'qty must be >= 1' });

  const products = await db.getProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Allocate an anon cookie if needed so the cart persists across requests.
  const key = req.user ? `user:${req.user.id}` : ensureAnonCookie(req, res);
  const cart = await loadCart(key);
  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.items.push({ productId, qty, addedAt: new Date().toISOString() });
  }
  await persistCart(key, cart);
  res.json(await hydrate(cart));
});

router.patch('/items/:productId', optionalAuth, async (req, res) => {
  const { qty } = req.body || {};
  if (typeof qty !== 'number' || qty < 0) {
    return res.status(400).json({ error: 'qty must be a non-negative number' });
  }
  const key = cartKey(req);
  if (!key) return res.json({ items: [], subtotal: 0 });

  const cart = await loadCart(key);
  if (qty === 0) {
    cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
  } else {
    const item = cart.items.find((i) => i.productId === req.params.productId);
    if (!item) return res.status(404).json({ error: 'Item not in cart' });
    item.qty = qty;
  }
  await persistCart(key, cart);
  res.json(await hydrate(cart));
});

router.delete('/items/:productId', optionalAuth, async (req, res) => {
  const key = cartKey(req);
  if (!key) return res.json({ items: [], subtotal: 0 });
  const cart = await loadCart(key);
  cart.items = cart.items.filter((i) => i.productId !== req.params.productId);
  await persistCart(key, cart);
  res.json(await hydrate(cart));
});

// Called by the frontend right after login/register so the items the shopper
// added before signing in don't disappear.
router.post('/merge', requireAuth, async (req, res) => {
  const anonId = req.cookies?.[ANON_COOKIE];
  if (!anonId) return res.json(await hydrate(await loadCart(`user:${req.user.id}`)));

  const carts = await db.getCarts();
  const anonKey = `anon:${anonId}`;
  const userKey = `user:${req.user.id}`;
  const anonCart = carts[anonKey] || { items: [] };
  const userCart = carts[userKey] || { items: [] };

  for (const anonItem of anonCart.items) {
    const existing = userCart.items.find((i) => i.productId === anonItem.productId);
    if (existing) existing.qty += anonItem.qty;
    else userCart.items.push(anonItem);
  }
  carts[userKey] = { ...userCart, updatedAt: new Date().toISOString() };
  delete carts[anonKey];
  await db.saveCarts(carts);

  // Clear the anon cookie so future requests use the user key.
  res.clearCookie(ANON_COOKIE);
  res.json(await hydrate(carts[userKey]));
});

export default router;
