'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur border-b border-cherub-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Glinte home">
          {/* Wordmark stored on S3. Plain <img> rather than next/image —
              we don't know the natural dimensions, and the asset is small
              enough that Next's optimisation pipeline isn't worth the
              dimension book-keeping. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/homepage/glinte-logo.png"
            alt="Glinte"
            className="h-9 md:h-14 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="hover:text-cherub-600 transition">Shop</Link>
          <Link href="/about" className="hover:text-cherub-600 transition">About</Link>
          <Link href="/faq" className="hover:text-cherub-600 transition">FAQ</Link>
          <Link href="/contact" className="hover:text-cherub-600 transition">Contact</Link>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/account" className="hover:text-cherub-600">Hi, {user.name.split(' ')[0]}</Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="text-cherub-700 font-medium">Admin</Link>
              )}
              <button onClick={logout} className="text-ink-muted hover:text-cherub-600">
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:inline hover:text-cherub-600">Sign in</Link>
          )}

          <Link
            href="/cart"
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-cherub-200 hover:bg-cherub-50 transition"
            aria-label="Cart"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-cherub-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-cherub-200"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="block w-4 h-0.5 bg-ink relative before:content-[''] before:absolute before:w-4 before:h-0.5 before:bg-ink before:-top-1.5 after:content-[''] after:absolute after:w-4 after:h-0.5 after:bg-ink after:top-1.5" />
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-cherub-100 bg-cream">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3 text-sm">
            <Link href="/" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <Link href="/faq" onClick={() => setOpen(false)}>FAQ</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <div className="border-t border-cherub-100 pt-3" />
            {user ? (
              <>
                <Link href="/account" onClick={() => setOpen(false)}>My account</Link>
                {user.role === 'admin' && <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>}
                <button onClick={() => { logout(); setOpen(false); }} className="text-left text-ink-muted">Sign out</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.5L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}
