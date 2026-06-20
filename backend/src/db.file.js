// JSON-file-backed store. Used in dev / when MONGODB_URI is not set.
//
// Each "collection" is a JSON file in /data. Reads parse on demand; writes
// serialise to a temp file then rename, so a crash mid-write can't corrupt
// the file.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');

async function readFile(name) {
  const full = path.join(DATA_DIR, `${name}.json`);
  const raw = await fs.readFile(full, 'utf8');
  return JSON.parse(raw);
}

async function writeFile(name, data) {
  const full = path.join(DATA_DIR, `${name}.json`);
  const tmp = `${full}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, full);
}

// Per-collection in-process write lock so concurrent writes don't clobber.
const locks = new Map();
async function withLock(name, fn) {
  const prev = locks.get(name) || Promise.resolve();
  let release;
  const next = new Promise((r) => (release = r));
  locks.set(name, prev.then(() => next));
  try {
    await prev;
    return await fn();
  } finally {
    release();
    if (locks.get(name) === next) locks.delete(name);
  }
}

export const db = {
  async getProducts() {
    return readFile('products');
  },
  async saveProducts(list) {
    return withLock('products', () => writeFile('products', list));
  },
  async getUsers() {
    return readFile('users');
  },
  async saveUsers(list) {
    return withLock('users', () => writeFile('users', list));
  },
  async getCarts() {
    return readFile('carts');
  },
  async saveCarts(map) {
    return withLock('carts', () => writeFile('carts', map));
  },
  async getOrders() {
    return readFile('orders');
  },
  async saveOrders(list) {
    return withLock('orders', () => writeFile('orders', list));
  },
};
