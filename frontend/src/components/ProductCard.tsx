'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const oos = product.stock <= 0;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (oos || adding) return;
    setAdding(true);
    try {
      await addItem(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-cherub-100 hover:shadow-soft transition-shadow"
    >
      <div className="relative aspect-square bg-cherub-50 overflow-hidden shine-hover">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Hover-swap second image — only shows on hover, only on hover-capable devices */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block"
          />
        )}
        {oos && (
          <span className="absolute top-3 left-3 bg-ink/85 text-cream text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Sold out
          </span>
        )}
        {!oos && product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="absolute top-3 right-3 bg-cherub-600 text-white text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
            Save ₹{product.compareAtPrice - product.price}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-medium text-ink">{product.name}</h3>
            <div className="text-xs text-ink-muted mt-0.5 flex items-center gap-1.5">
              <span
                className="inline-block w-3 h-3 rounded-full ring-1 ring-black/5"
                style={{ background: product.shadeHex }}
              />
              {product.shade} · {product.finish}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">₹{product.price}</div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <div className="text-xs text-ink-muted line-through">₹{product.compareAtPrice}</div>
            )}
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={oos || adding}
          className={`mt-4 w-full text-sm py-2.5 rounded-full transition ${
            oos
              ? 'bg-cherub-50 text-ink-muted cursor-not-allowed'
              : added
                ? 'bg-cherub-700 text-white'
                : 'bg-ink text-cream hover:bg-cherub-700'
          }`}
        >
          {oos ? 'Out of stock' : added ? 'Added ✓' : adding ? 'Adding…' : 'Add to cart'}
        </button>
      </div>
    </Link>
  );
}
