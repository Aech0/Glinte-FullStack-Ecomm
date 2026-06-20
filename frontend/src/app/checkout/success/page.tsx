'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import type { Order } from '@/lib/types';

function SuccessInner() {
  const params = useSearchParams();
  const id = params.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api<Order>(`/api/orders/${id}`)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cherub-100 text-cherub-700 mb-6 text-3xl">
        ✓
      </div>
      <h1 className="font-display text-4xl mb-3">Thank you</h1>
      <p className="text-ink-muted mb-8">
        Your payment is in and we're prepping your gloss. A confirmation email
        from Razorpay will land in your inbox shortly.
      </p>

      {loading ? (
        <div className="text-ink-muted">Loading order…</div>
      ) : order ? (
        <div className="bg-white border border-cherub-100 rounded-2xl p-6 text-left">
          <div className="text-xs text-ink-muted uppercase tracking-wider mb-2">Order #{order.id.slice(-8)}</div>
          <ul className="divide-y divide-cherub-50">
            {order.items.map((it) => (
              <li key={it.productId} className="py-3 flex justify-between">
                <span>{it.name} × {it.qty}</span>
                <span>₹{it.price * it.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-cherub-100 flex justify-between font-medium">
            <span>Total paid</span><span>₹{order.total}</span>
          </div>
          {order.shiprocket?.shipmentId ? (
            <div className="mt-4 text-xs text-cherub-700">
              Shiprocket shipment created — tracking will appear in your account once dispatched.
            </div>
          ) : order.shiprocket?.error ? (
            <div className="mt-4 text-xs text-ink-muted">
              We've received your payment. Our team will dispatch your order shortly.
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-8 flex justify-center gap-3">
        <Link href="/account/orders" className="bg-ink text-cream px-6 py-2.5 rounded-full text-sm hover:bg-cherub-700 transition">
          View my orders
        </Link>
        <Link href="/" className="px-6 py-2.5 rounded-full border border-cherub-200 text-sm hover:bg-cherub-50">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-ink-muted">Loading…</div>}>
      <SuccessInner />
    </Suspense>
  );
}
