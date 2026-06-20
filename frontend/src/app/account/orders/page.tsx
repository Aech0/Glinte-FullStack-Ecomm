'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Order } from '@/lib/types';

const STATUS_LABELS: Record<Order['status'], string> = {
  pending_payment: 'Payment pending',
  paid: 'Paid',
  fulfilment_initiated: 'Fulfilment initiated',
  fulfilment_pending: 'Awaiting dispatch',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/account/orders');
      return;
    }
    if (!user) return;
    api<Order[]>('/api/orders')
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || !user || loading) {
    return <div className="py-20 text-center text-ink-muted">Loading…</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/account" className="text-xs text-ink-muted hover:text-cherub-700">← Back to account</Link>
      <h1 className="font-display text-4xl mt-3 mb-8">Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white border border-cherub-100 rounded-2xl">
          <p className="text-ink-muted mb-4">No orders yet.</p>
          <Link href="/" className="text-cherub-700 underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-cherub-100 rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wider text-ink-muted">Order #{order.id.slice(-8)}</div>
                  <div className="text-ink-muted">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs bg-cherub-100 text-cherub-700">
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <ul className="mt-3 divide-y divide-cherub-50 text-sm">
                {order.items.map((it) => (
                  <li key={it.productId} className="py-2 flex justify-between">
                    <span>{it.name} × {it.qty}</span>
                    <span>₹{it.price * it.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-cherub-100 flex justify-between text-sm font-medium">
                <span>Total</span><span>₹{order.total}</span>
              </div>
              {order.shiprocket?.shipmentId && (
                <div className="mt-3 text-xs text-cherub-700">
                  Shiprocket shipment ID: {order.shiprocket.shipmentId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
