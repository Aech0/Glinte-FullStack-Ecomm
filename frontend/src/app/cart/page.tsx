'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import QuantityStepper from '@/components/QuantityStepper';
import { api } from '@/lib/api';
import type { Order, ShippingAddress } from '@/lib/types';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const SHIPPING_FREE_THRESHOLD = 999;
const SHIPPING_FEE = 49;

export default function CartPage() {
  const { cart, loading, setQty, removeItem, refresh } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const hasOOS = cart.items.some((i) => i.stockStatus === 'out_of_stock');
  const subtotal = cart.subtotal;
  const shippingFee = subtotal === 0 ? 0 : subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      // Park the cart on the server and bounce through login.
      router.push('/login?next=/cart');
      return;
    }
    if (hasOOS) {
      setError('Please remove out-of-stock items before checkout.');
      return;
    }

    setCheckingOut(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error('Could not load Razorpay. Check your connection.');

      // Step 1: server creates a Razorpay order + a pending order in our DB.
      const initRes = await api<{
        orderId: string;
        rzpOrderId: string;
        amount: number;
        currency: string;
        keyId: string;
        name: string;
        description: string;
        prefill: { name: string; email: string; contact: string };
      }>('/api/razorpay/order', {
        method: 'POST',
        body: JSON.stringify({ shipping }),
      });

      // Step 2: open the Razorpay checkout modal.
      const rzp = new window.Razorpay({
        key: initRes.keyId,
        amount: initRes.amount,
        currency: initRes.currency,
        name: initRes.name,
        description: initRes.description,
        order_id: initRes.rzpOrderId,
        prefill: initRes.prefill,
        theme: { color: '#E78198' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: verify on server, which decrements stock + calls Shiprocket.
          try {
            const verified = await api<{ ok: true; order: Order }>('/api/razorpay/verify', {
              method: 'POST',
              body: JSON.stringify({
                orderId: initRes.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            await refresh();
            router.push(`/checkout/success?id=${verified.order.id}`);
          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
            setCheckingOut(false);
          }
        },
        modal: {
          ondismiss: () => setCheckingOut(false),
        },
      });

      rzp.on('payment.failed', (resp: any) => {
        setError(resp.error?.description || 'Payment failed');
        setCheckingOut(false);
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong starting checkout');
      setCheckingOut(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-ink-muted">Loading your cart…</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-4xl mb-3">Your cart is empty</h1>
        <p className="text-ink-muted mb-6">A little gloss never hurt anybody.</p>
        <Link
          href="/"
          className="inline-flex bg-ink text-cream px-7 py-3 rounded-full text-sm hover:bg-cherub-700 transition"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <h1 className="font-display text-4xl mb-8">Your cart</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        {/* Items */}
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className={`flex gap-4 bg-white rounded-2xl border p-4 ${
                item.stockStatus === 'out_of_stock' ? 'border-red-200 bg-red-50/40' : 'border-cherub-100'
              }`}
            >
              <Link href={`/products/${item.slug}`} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cherub-50 shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="120px" className="object-cover" />
              </Link>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <Link href={`/products/${item.slug}`} className="font-medium hover:text-cherub-700">{item.name}</Link>
                    <div className="text-xs text-ink-muted mt-0.5 flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 rounded-full ring-1 ring-black/5" style={{ background: item.shadeHex }} />
                      {item.shade}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{item.lineTotal}</div>
                    <div className="text-xs text-ink-muted">₹{item.price} each</div>
                  </div>
                </div>

                {item.stockStatus === 'out_of_stock' && (
                  <div className="mt-2 text-xs text-red-700 bg-red-100 inline-block self-start px-2 py-1 rounded-full">
                    Out of stock — please remove to continue
                  </div>
                )}
                {item.stockStatus === 'limited_stock' && (
                  <div className="mt-2 text-xs text-cherub-700 bg-cherub-100 inline-block self-start px-2 py-1 rounded-full">
                    Only {item.availableStock} left — quantity will be adjusted
                  </div>
                )}

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <QuantityStepper
                    value={item.qty}
                    onChange={(qty) => setQty(item.productId, qty)}
                    size="sm"
                    max={Math.max(1, item.availableStock || 1)}
                  />
                  <button
                    className="text-xs text-ink-muted underline hover:text-cherub-700"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + checkout */}
        <aside className="bg-white border border-cherub-100 rounded-2xl p-6 h-fit lg:sticky lg:top-20">
          <h2 className="font-display text-2xl mb-4">Order summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>₹{subtotal}</dd></div>
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>{shippingFee === 0 ? <span className="text-cherub-700">Free</span> : `₹${shippingFee}`}</dd>
            </div>
            {subtotal < SHIPPING_FREE_THRESHOLD && subtotal > 0 && (
              <div className="text-xs text-ink-muted">
                Add ₹{SHIPPING_FREE_THRESHOLD - subtotal} more for free shipping.
              </div>
            )}
            <div className="border-t border-cherub-100 pt-3 flex justify-between font-medium text-base">
              <dt>Total</dt><dd>₹{total}</dd>
            </div>
          </dl>

          <form className="mt-6 space-y-3" onSubmit={handleCheckout}>
            {!user && (
              <div className="text-xs bg-cherub-50 text-ink-soft border border-cherub-200 rounded-lg p-3">
                You'll be asked to sign in or create an account to complete checkout.
              </div>
            )}

            {user && (
              <details className="border border-cherub-100 rounded-xl" open>
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                  Shipping address
                </summary>
                <div className="px-4 pb-4 grid grid-cols-2 gap-2 text-sm">
                  <Input label="First name" required value={shipping.firstName} onChange={(v) => setShipping({ ...shipping, firstName: v })} />
                  <Input label="Last name" value={shipping.lastName || ''} onChange={(v) => setShipping({ ...shipping, lastName: v })} />
                  <Input label="Email" type="email" required wide value={shipping.email} onChange={(v) => setShipping({ ...shipping, email: v })} />
                  <Input label="Phone" required wide value={shipping.phone} onChange={(v) => setShipping({ ...shipping, phone: v })} />
                  <Input label="Address line 1" required wide value={shipping.address1} onChange={(v) => setShipping({ ...shipping, address1: v })} />
                  <Input label="Address line 2" wide value={shipping.address2 || ''} onChange={(v) => setShipping({ ...shipping, address2: v })} />
                  <Input label="City" required value={shipping.city} onChange={(v) => setShipping({ ...shipping, city: v })} />
                  <Input label="State" required value={shipping.state} onChange={(v) => setShipping({ ...shipping, state: v })} />
                  <Input label="Pincode" required value={shipping.pincode} onChange={(v) => setShipping({ ...shipping, pincode: v })} />
                  <Input label="Country" value={shipping.country || ''} onChange={(v) => setShipping({ ...shipping, country: v })} />
                </div>
              </details>
            )}

            {error && (
              <div className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={checkingOut || hasOOS}
              className="w-full bg-ink text-cream py-3 rounded-full text-sm hover:bg-cherub-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {checkingOut ? 'Opening payment…' : hasOOS ? 'Remove out-of-stock items' : `Pay ₹${total}`}
            </button>
            <p className="text-[11px] text-ink-muted text-center">
              Powered by Razorpay · UPI, Cards, Netbanking & Wallets
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? 'col-span-2' : ''}`}>
      <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1">
        {label} {required && <span className="text-cherub-700">*</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-cherub-200 bg-white focus:outline-none focus:border-cherub-500"
      />
    </label>
  );
}
