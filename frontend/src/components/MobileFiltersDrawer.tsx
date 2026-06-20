'use client';

// Mobile filter UX — a single "Filters & Sort" trigger button at the top of
// the products area. Tapping it slides in a right-side drawer with the same
// FilterControls. Saves the long inline filter stack from eating the top
// half of every shopper's screen.
//
// Standard pattern used by ASOS, Hyphen, Shopify storefronts — feels
// familiar to anyone who's shopped online on a phone.

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { DEFAULT_FILTERS, type Filters } from './FilterSidebar';
import FilterControls from './FilterControls';

export default function MobileFiltersDrawer({
  products,
  filters,
  onChange,
  resultCount,
}: {
  products: Product[];
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);

  // Active count = user-applied filters only (sort + search don't count;
  // they're always present in the UI even when at defaults).
  const activeCount = filters.shadeFamilies.length + (filters.inStockOnly ? 1 : 0);

  // Lock body scroll while the drawer is open so the content underneath
  // doesn't scroll behind the drawer.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape — small accessibility nicety.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-5 py-3 rounded-full border border-cherub-200 bg-white text-sm hover:border-cherub-400 transition"
      >
        <span className="flex items-center gap-2 font-medium">
          <FilterIcon />
          Filters & Sort
        </span>
        <span className="flex items-center gap-2">
          {activeCount > 0 && (
            <span className="bg-cherub-700 text-white text-[10px] rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center font-medium">
              {activeCount}
            </span>
          )}
          <span className="text-cherub-700">→</span>
        </span>
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-ink/50 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters and sort"
        className={`fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-cream z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-cherub-100">
          <h3 className="font-display text-2xl">Filters</h3>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close filters"
            className="w-9 h-9 rounded-full hover:bg-cherub-50 flex items-center justify-center text-2xl text-ink-muted leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <FilterControls
            products={products}
            filters={filters}
            onChange={onChange}
            onReset={() => onChange(DEFAULT_FILTERS)}
          />
        </div>

        <div className="border-t border-cherub-100 p-4 bg-cream">
          <button
            onClick={() => setOpen(false)}
            className="w-full bg-ink text-cream py-3 rounded-full text-sm hover:bg-cherub-700 transition"
          >
            Show {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </button>
        </div>
      </aside>
    </>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}
