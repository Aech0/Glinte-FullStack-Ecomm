'use client';

import type { Product } from '@/lib/types';
import FilterControls from './FilterControls';

export type Filters = {
  search: string;
  shadeFamilies: string[];
  inStockOnly: boolean;
  sort: 'featured' | 'price-asc' | 'price-desc' | 'name';
};

export const DEFAULT_FILTERS: Filters = {
  search: '',
  shadeFamilies: [],
  inStockOnly: false,
  sort: 'featured',
};

export function applyFilters(products: Product[], f: Filters): Product[] {
  let list = [...products];
  if (f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shade.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (f.shadeFamilies.length) {
    list = list.filter((p) => f.shadeFamilies.includes(p.shadeFamily));
  }
  if (f.inStockOnly) {
    list = list.filter((p) => p.stock > 0);
  }
  switch (f.sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'featured':
    default:
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return list;
}

// Desktop sidebar wrapper. Hidden on mobile via the parent (page.tsx) —
// MobileFiltersDrawer handles the small-viewport experience.
export default function FilterSidebar({
  products,
  filters,
  onChange,
}: {
  products: Product[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <FilterControls
        products={products}
        filters={filters}
        onChange={onChange}
        onReset={() => onChange(DEFAULT_FILTERS)}
      />
    </aside>
  );
}
