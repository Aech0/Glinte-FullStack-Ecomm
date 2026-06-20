'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Order, Product } from '@/lib/types';

export default function AdminHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login?next=/admin');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    Promise.all([
      api<Product[]>('/api/admin/products'),
      api<Order[]>('/api/admin/orders'),
    ]).then(([p, o]) => {
      setProducts(p);
      setOrders(o);
    }).catch(() => {});
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="py-20 text-center text-ink-muted">Loading…</div>;
  }

  const revenue = orders
    .filter((o) => o.status !== 'pending_payment' && o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 5).length;
  const oosCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl mb-2">Admin</h1>
      <p className="text-ink-muted mb-8">Inventory and orders at a glance.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Products" value={products.length} />
        <Stat label="Orders" value={orders.length} />
        <Stat label="Revenue" value={`₹${revenue.toLocaleString('en-IN')}`} />
        <Stat label="Low / Out of stock" value={`${lowStock} / ${oosCount}`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products"
          className="bg-white border border-cherub-100 rounded-2xl p-6 hover:shadow-soft transition"
        >
          <div className="font-medium mb-1">Manage products</div>
          <div className="text-sm text-ink-muted">Add, edit, update stock and pricing</div>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-white border border-cherub-100 rounded-2xl p-6 hover:shadow-soft transition"
        >
          <div className="font-medium mb-1">View orders</div>
          <div className="text-sm text-ink-muted">Status, fulfilment, Shiprocket info</div>
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-cherub-100 rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-ink-muted">{label}</div>
      <div className="font-display text-3xl mt-1">{value}</div>
    </div>
  );
}
