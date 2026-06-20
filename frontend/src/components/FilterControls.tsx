'use client';

// Shared filter UI used by both the desktop sidebar and the mobile drawer.
// Holds search box, sort dropdown, shade family multi-select, in-stock
// toggle, and a reset button. Pure controlled component — parent owns state.

import type { Product } from '@/lib/types';
import type { Filters } from './FilterSidebar';

export default function FilterControls({
  products,
  filters,
  onChange,
  onReset,
}: {
  products: Product[];
  filters: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
}) {
  const families = [...new Set(products.map((p) => p.shadeFamily))].sort();

  const toggleShadeFamily = (value: string) => {
    const set = new Set(filters.shadeFamilies);
    if (set.has(value)) set.delete(value);
    else set.add(value);
    onChange({ ...filters, shadeFamilies: [...set] });
  };

  return (
    <div className="space-y-7 text-sm">
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
            onChange={() => toggleShadeFamily(fam)}
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
        onClick={onReset}
        className="text-xs text-ink-muted underline hover:text-cherub-700"
      >
        Reset filters
      </button>
    </div>
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
