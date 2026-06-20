import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';

import { db, genId } from './db.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import razorpayRoutes from './routes/razorpay.js';
import adminRoutes from './routes/admin.js';

const app = express();

// Trust the proxy in front of us (Railway, etc.) so rate-limit and `req.ip`
// see the real client IP, not the proxy's.
app.set('trust proxy', 1);

// Security headers — sensible defaults from helmet. We keep cross-origin
// resource policy permissive so S3-hosted product images load fine from
// the frontend domain.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false, // Next handles its own CSP if needed
  })
);

// CORS — FRONTEND_ORIGIN can be a single URL or a comma-separated list. In
// production this should be locked to your real frontend hostname(s);
// for dev we default to localhost:3000.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow same-origin / curl / mobile apps (no Origin header).
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true, // for the anonymous-cart cookie
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/admin', adminRoutes);

// Generic JSON error handler — keeps payloads predictable for the frontend.
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

async function seedAdminIfEmpty() {
  const users = await db.getUsers();
  if (users.length) return;
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@glinte.in';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  users.push({
    id: genId('usr'),
    email: email.toLowerCase(),
    name: 'Glinte Admin',
    passwordHash: await bcrypt.hash(password, 10),
    role: 'admin',
    createdAt: new Date().toISOString(),
  });
  await db.saveUsers(users);
  console.log(`[glinte] seeded admin → ${email} / ${password}`);
}

const PORT = Number(process.env.PORT) || 4000;
seedAdminIfEmpty().then(() => {
  app.listen(PORT, () => {
    console.log(`[glinte] backend listening on http://localhost:${PORT}`);
    console.log(`[glinte] CORS allow-list: ${allowedOrigins.join(', ')}`);
  });
});
