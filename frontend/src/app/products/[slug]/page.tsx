'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';
import QuantityStepper from '@/components/QuantityStepper';
import { useCart } from '@/lib/cart-context';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!params?.slug) return;
    api<Product>(`/api/products/${params.slug}`)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-cherub-50 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-10 w-2/3 bg-cherub-50 rounded animate-pulse" />
          <div className="h-5 w-1/2 bg-cherub-50 rounded animate-pulse" />
          <div className="h-24 bg-cherub-50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-4xl mb-3">Shade not found</h1>
        <p className="text-ink-muted mb-6">We couldn't find that gloss.</p>
        <Link href="/" className="text-cherub-700 underline">Back to all glosses</Link>
      </div>
    );
  }

  const oos = product.stock <= 0;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addItem(product.id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="text-xs text-ink-muted mb-6">
        <Link href="/" className="hover:text-cherub-700">Shop</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-cherub-50">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                  activeImage === i ? 'border-cherub-600' : 'border-transparent hover:border-cherub-200'
                }`}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cherub-700">{product.shadeFamily} · {product.finish}</p>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{product.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
            <span
              className="inline-block w-4 h-4 rounded-full ring-1 ring-black/5"
              style={{ background: product.shadeHex }}
            />
            {product.shade}
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <div className="text-3xl font-medium">₹{product.price}</div>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <div className="text-lg text-ink-muted line-through">₹{product.compareAtPrice}</div>
                <span className="text-xs bg-cherub-100 text-cherub-700 px-2 py-0.5 rounded-full">
                  Save ₹{product.compareAtPrice - product.price}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-ink-soft leading-relaxed">{product.longDescription}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {!oos && (
              <QuantityStepper value={qty} onChange={setQty} max={Math.min(product.stock, 10)} />
            )}
            <button
              onClick={handleAdd}
              disabled={oos || adding}
              className={`flex-1 sm:flex-none sm:min-w-[200px] py-3 px-6 rounded-full text-sm transition ${
                oos
                  ? 'bg-cherub-50 text-ink-muted cursor-not-allowed'
                  : added
                    ? 'bg-cherub-700 text-white'
                    : 'bg-ink text-cream hover:bg-cherub-700'
              }`}
            >
              {oos ? 'Out of stock' : added ? 'Added to cart ✓' : adding ? 'Adding…' : 'Add to cart'}
            </button>
          </div>

          {!oos && product.stock < 10 && (
            <div className="mt-3 text-xs text-cherub-700">Only {product.stock} left — going fast.</div>
          )}

          {/* Accordion-ish detail blocks */}
          <div className="mt-10 divide-y divide-cherub-100 border-y border-cherub-100">
            <DetailRow title="How to use" body={product.howToUse} />
            <DetailRow title="Ingredients" body={product.ingredients} />
            <DetailRow title="Volume" body={product.volume} />
          </div>

          <button
            onClick={() => router.push('/cart')}
            className="mt-8 text-sm text-ink-muted underline hover:text-cherub-700"
          >
            View cart →
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ title, body }: { title: string; body: string }) {
  return (
    <details className="py-4 group">
      <summary className="flex items-center justify-between cursor-pointer list-none">
        <span className="font-medium">{title}</span>
        <span className="text-cherub-700 group-open:rotate-45 transition">+</span>
      </summary>
      <div className="mt-2 text-ink-muted text-sm leading-relaxed">{body}</div>
    </details>
  );
}
