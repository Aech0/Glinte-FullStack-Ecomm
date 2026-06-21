'use client';

import { useEffect, useMemo, useState } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import FilterSidebar, { DEFAULT_FILTERS, applyFilters, type Filters } from '@/components/FilterSidebar';
import MobileFiltersDrawer from '@/components/MobileFiltersDrawer';
import AboutCarousel from '@/components/AboutCarousel';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Product[]>('/api/products')
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);

  return (
    <>
      <Hero />

      {/* Brand strip */}
      <section className="bg-cherub-50 border-y border-cherub-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs uppercase tracking-wider text-ink-soft/80">
          <div>Vegan + Cruelty-Free</div>
          <div>Non-sticky Formula</div>
          <div>Made in India</div>
          <div>Free shipping over ₹999</div>
        </div>
      </section>

      <section id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cherub-700 mb-2">The Collection</p>
            <h2 className="font-display text-4xl md:text-5xl">All Glosses</h2>
          </div>
          <p className="text-ink-muted max-w-md">
            Ten shades, one obsession. Filter by shade family to find your match.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-8 text-sm">
            Couldn't load products: {error}. Make sure the backend is running on port 4000.
          </div>
        )}

        {/* Mobile: drawer trigger sits ABOVE the grid so it doesn't push
            products down by 40px of grid-gap. Hidden on lg+. */}
        <div className="lg:hidden mb-6">
          <MobileFiltersDrawer
            products={products}
            filters={filters}
            onChange={setFilters}
            resultCount={filtered.length}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          <div className="hidden lg:block">
            <FilterSidebar products={products} filters={filters} onChange={setFilters} />
          </div>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-cherub-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-ink-muted">
                No glosses match those filters yet. Try resetting.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About-us tile carousel — owner-supplied square graphics */}
      <AboutCarousel />

      {/* Customer reviews — S3-hosted profile pics + owner-supplied copy */}
      <ReviewsCarousel />

      {/* Brand story */}
      <section className="bg-cream border-t border-cherub-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cherub-700 mb-3">The Glinte Story</p>
          <h3 className="font-display text-3xl md:text-4xl mb-5">Built for the way you actually wear gloss.</h3>
          <p className="text-ink-muted leading-relaxed max-w-2xl mx-auto">
            Glinte was born out of a simple frustration: every gloss we tried was either
            sticky enough to catch hair on a windy day, or so thin it disappeared after
            one sip of coffee. So we made our own. Ten shades. High shine. Zero stick.
          </p>
        </div>
      </section>
    </>
  );
}
