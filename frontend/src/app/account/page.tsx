'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/account');
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="py-20 text-center text-ink-muted">Loading…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl mb-2">My account</h1>
      <p className="text-ink-muted mb-8">Welcome back, {user.name}.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/account/orders"
          className="bg-white border border-cherub-100 rounded-2xl p-6 hover:shadow-soft transition"
        >
          <div className="font-medium mb-1">Orders</div>
          <div className="text-sm text-ink-muted">View past orders and tracking</div>
        </Link>
        {user.role === 'admin' && (
          <Link
            href="/admin"
            className="bg-cherub-50 border border-cherub-200 rounded-2xl p-6 hover:shadow-soft transition"
          >
            <div className="font-medium mb-1 text-cherub-700">Admin dashboard</div>
            <div className="text-sm text-ink-muted">Manage products & orders</div>
          </Link>
        )}
        <button
          onClick={logout}
          className="bg-white border border-cherub-100 rounded-2xl p-6 hover:shadow-soft transition text-left"
        >
          <div className="font-medium mb-1">Sign out</div>
          <div className="text-sm text-ink-muted">End this session</div>
        </button>
      </div>

      <div className="mt-10 bg-white border border-cherub-100 rounded-2xl p-6 text-sm">
        <div className="text-xs uppercase tracking-wider text-ink-muted mb-3">Account details</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-ink-muted">Name</div>
          <div className="col-span-2">{user.name}</div>
          <div className="text-ink-muted">Email</div>
          <div className="col-span-2">{user.email}</div>
          <div className="text-ink-muted">Member since</div>
          <div className="col-span-2">{new Date(user.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}
