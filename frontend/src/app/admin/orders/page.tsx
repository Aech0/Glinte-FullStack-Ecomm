'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Order } from '@/lib/types';

const STATUSES: Order['status'][] = [
  'pending_payment',
  'paid',
  'fulfilment_initiated',
  'fulfilment_pending',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login?next=/admin/orders');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role === 'admin') api<Order[]>('/api/admin/orders').then(setOrders);
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="py-20 text-center text-ink-muted">Loading…</div>;
  }

  const updateStatus = async (id: string, status: Order['status']) => {
    const updated = await api<Order>(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setOrders((list) => list.map((o) => (o.id === id ? updated : o)));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/admin" className="text-xs text-ink-muted hover:text-cherub-700">← Back to admin</Link>
      <h1 className="font-display text-4xl mt-3 mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white border border-cherub-100 rounded-2xl text-ink-muted">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-cherub-100 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-muted">#{o.id.slice(-8)} · {new Date(o.createdAt).toLocaleString()}</div>
                  <div className="font-medium">{o.shipping.firstName} {o.shipping.lastName} — {o.shipping.email}</div>
                  <div className="text-ink-muted text-xs mt-0.5">{o.shipping.address1}, {o.shipping.city} {o.shipping.pincode}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">₹{o.total}</span>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value as Order['status'])}
                    className="px-3 py-1.5 rounded-lg border border-cherub-200 bg-white text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="mt-3 text-sm text-ink-muted divide-y divide-cherub-50">
                {o.items.map((it) => (
                  <li key={it.productId} className="py-1.5 flex justify-between">
                    <span>{it.name} × {it.qty}</span>
                    <span>₹{it.price * it.qty}</span>
                  </li>
                ))}
              </ul>
              {o.shiprocket?.shipmentId && (
                <div className="mt-3 text-xs text-cherub-700">Shiprocket shipment {o.shiprocket.shipmentId}</div>
              )}
              {o.shiprocket?.error && (
                <div className="mt-3 text-xs text-red-600">Shiprocket error: {o.shiprocket.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
