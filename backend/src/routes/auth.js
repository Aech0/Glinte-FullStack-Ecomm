import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { db, genId } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Rate limiters: keep simple credential-stuffing and signup-spam attempts
// at bay. Limits are per-IP. Behind a proxy (Railway), Express's trust-proxy
// setting in server.js makes sure the real client IP is used.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 new accounts per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many accounts created from this address. Try again later.' },
});

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt };
}

router.post('/register', registerLimiter, async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const users = await db.getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const user = {
    id: genId('usr'),
    email: email.toLowerCase(),
    name,
    passwordHash: await bcrypt.hash(password, 10),
    role: 'customer',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await db.saveUsers(users);

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const users = await db.getUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// "Who am I" — used by frontend on page load to restore session.
router.get('/me', requireAuth, async (req, res) => {
  const users = await db.getUsers();
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
});

export default router;
