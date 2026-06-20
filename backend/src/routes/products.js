import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// Public: list all products. Frontend filters client-side for snappiness;
// at this catalogue size (10) there is zero benefit to server-side filtering.
router.get('/', async (_req, res) => {
  const products = await db.getProducts();
  res.json(products);
});

router.get('/:slug', async (req, res) => {
  const products = await db.getProducts();
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

export default router;
