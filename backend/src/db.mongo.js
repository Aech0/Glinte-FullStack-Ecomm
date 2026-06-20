// MongoDB-backed store. Used when MONGODB_URI is set in .env.
//
// Exposes the *same* read/write API as db.file.js so routes don't need to
// change. Internally uses Mongoose with a Strict-on-read approach: any field
// not in the schema gets dropped, which keeps Mongo docs clean even if the
// JSON seed has extras.
//
// First connection auto-seeds products from data/products.json if the
// products collection is empty — this gives the client a smooth first-run.

import mongoose from 'mongoose';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---- Schemas --------------------------------------------------------------

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: String,
    shade: String,
    shadeHex: String,
    shadeFamily: String,
    finish: String,
    price: Number,
    compareAtPrice: { type: Number, default: null },
    volume: String,
    stock: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    description: String,
    longDescription: String,
    ingredients: String,
    howToUse: String,
    images: { type: [String], default: [] },
  },
  { timestamps: true, collection: 'products' }
);

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    name: String,
    passwordHash: String,
    role: { type: String, default: 'customer' },
    createdAt: String, // we keep our own ISO string for parity with the file store
  },
  { timestamps: false, collection: 'users' }
);

const cartItemSchema = new mongoose.Schema(
  { productId: String, qty: Number, addedAt: String },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    updatedAt: String,
  },
  { timestamps: false, collection: 'carts' }
);

const orderItemSchema = new mongoose.Schema(
  { productId: String, name: String, shade: String, price: Number, qty: Number },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: Number,
    shippingFee: Number,
    total: Number,
    shipping: Object,
    status: String,
    razorpay: Object,
    shiprocket: { type: Object, default: null },
    createdAt: String,
    paidAt: String,
  },
  { timestamps: false, collection: 'orders' }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// ---- Connection management -----------------------------------------------

let connecting = null;
async function connect() {
  if (mongoose.connection.readyState === 1) return;
  if (connecting) return connecting;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not set — refusing to connect');
  }
  connecting = mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(async (m) => {
      console.log('[glinte] connected to MongoDB');
      await seedProductsIfEmpty();
      return m;
    })
    .catch((err) => {
      connecting = null; // allow retry
      throw err;
    });
  return connecting;
}

async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  const seedPath = path.resolve(__dirname, '..', 'data', 'products.json');
  try {
    const raw = await fs.readFile(seedPath, 'utf8');
    const list = JSON.parse(raw);
    if (list.length) {
      await Product.insertMany(list);
      console.log(`[glinte] seeded ${list.length} products from data/products.json`);
    }
  } catch (err) {
    console.warn('[glinte] could not seed products from JSON:', err.message);
  }
}

// ---- Helpers --------------------------------------------------------------

// Strip Mongo-internal fields so callers see plain objects identical to the
// shape the file store returns.
function clean(doc) {
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  return rest;
}

// Generic upsert-many + delete-missing. Mirrors the "save the whole list"
// API the file store offers, in a single round trip.
async function syncCollection(Model, key, list) {
  const ids = list.map((d) => d[key]);
  const ops = list.map((d) => ({
    replaceOne: { filter: { [key]: d[key] }, replacement: d, upsert: true },
  }));
  if (ops.length) await Model.bulkWrite(ops, { ordered: false });
  await Model.deleteMany({ [key]: { $nin: ids } });
}

// ---- Public API (matches db.file.js) -------------------------------------

export const db = {
  async getProducts() {
    await connect();
    const docs = await Product.find().lean();
    return docs.map(clean);
  },
  async saveProducts(list) {
    await connect();
    await syncCollection(Product, 'id', list);
  },
  async getUsers() {
    await connect();
    const docs = await User.find().lean();
    return docs.map(clean);
  },
  async saveUsers(list) {
    await connect();
    await syncCollection(User, 'id', list);
  },
  async getCarts() {
    await connect();
    const docs = await Cart.find().lean();
    const map = {};
    for (const d of docs) {
      const { key, ...rest } = clean(d);
      map[key] = rest;
    }
    return map;
  },
  async saveCarts(map) {
    await connect();
    const list = Object.entries(map).map(([key, value]) => ({ key, ...value }));
    await syncCollection(Cart, 'key', list);
  },
  async getOrders() {
    await connect();
    const docs = await Order.find().lean();
    return docs.map(clean);
  },
  async saveOrders(list) {
    await connect();
    await syncCollection(Order, 'id', list);
  },
};
