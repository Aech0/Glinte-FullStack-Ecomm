// Storage backend chooser.
//
//   • If MONGODB_URI is set in .env → use the Mongoose-backed store.
//   • Otherwise → use the JSON-file-backed store.
//
// Routes import from this file only and stay unaware of which backend is
// active. Adding a new backend later is a one-line change here.

import { genId } from './ids.js';

const useMongo = !!process.env.MONGODB_URI;
console.log(`[glinte] storage backend: ${useMongo ? 'MongoDB' : 'JSON files'}`);

// Lazy-load the chosen backend so the unused one (and its dependencies — e.g.
// mongoose) never gets evaluated.
let backendPromise;
function loadBackend() {
  if (!backendPromise) {
    backendPromise = useMongo
      ? import('./db.mongo.js').then((m) => m.db)
      : import('./db.file.js').then((m) => m.db);
  }
  return backendPromise;
}

function proxy(method) {
  return async (...args) => {
    const backend = await loadBackend();
    return backend[method](...args);
  };
}

export const db = {
  getProducts: proxy('getProducts'),
  saveProducts: proxy('saveProducts'),
  getUsers: proxy('getUsers'),
  saveUsers: proxy('saveUsers'),
  getCarts: proxy('getCarts'),
  saveCarts: proxy('saveCarts'),
  getOrders: proxy('getOrders'),
  saveOrders: proxy('saveOrders'),
};

export { genId };
