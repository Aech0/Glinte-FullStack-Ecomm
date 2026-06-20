'use client';

import type { Product } from '@/lib/types';

export type Filters = {
  search: string;
  shadeFamilies: string[];
  finishes: string[];
  inStockOnly: boolean;
  sort: 'featured' | 'price-asc' | 'price-desc' | 'name';
};

export const DEFAULT_FILTERS: Filters = {
  search: '',
  shadeFamilies: [],
  finishes: [],
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
  if (f.finishes.length) {
    list = list.filter((p) => f.finishes.includes(p.finish));
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

export default function FilterSidebar({
  products,
  filters,
  onChange,
}: {
  products: Product[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const families = [...new Set(products.map((p) => p.shadeFamily))].sort();
  const finishes = [...new Set(products.map((p) => p.finish))].sort();

  const toggleArray = (key: 'shadeFamilies' | 'finishes', value: string) => {
    const set = new Set(filters[key]);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onChange({ ...filters, [key]: [...set] });
  };

  return (
    <aside className="lg:sticky lg:top-20 lg:self-start space-y-7 text-sm">
      <div>
        <input
          type="search"
          placeholder="Search shades…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full px-4 py-2.5 rounded-full border border-cherub-200 bg-white focus:outline-none focus:border-cherub-500 placeholder:text-ink-muted/70"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-ink-muted mb-2">Sort</label>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as Filters['sort'] })}
          className="w-full px-3 py-2 rounded-lg border border-cherub-200 bg-white"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      <Group title="Shade Family">
        {families.map((fam) => (
          <Check
            key={fam}
            label={fam}
            checked={filters.shadeFamilies.includes(fam)}
            onChange={() => toggleArray('shadeFamilies', fam)}
          />
        ))}
      </Group>

      <Group title="Finish">
        {finishes.map((fn) => (
          <Check
            key={fn}
            label={fn}
            checked={filters.finishes.includes(fn)}
            onChange={() => toggleArray('finishes', fn)}
          />
        ))}
      </Group>

      <Group title="Availability">
        <Check
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </Group>

      <button
        onClick={() => onChange(DEFAULT_FILTERS)}
        className="text-xs text-ink-muted underline hover:text-cherub-700"
      >
        Reset filters
      </button>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-ink-muted mb-2">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-cherub-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-cherub-600 w-4 h-4 rounded"
      />
      <span>{label}</span>
    </label>
  );
}
