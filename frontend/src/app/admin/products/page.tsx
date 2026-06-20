'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Product } from '@/lib/types';

const EMPTY_DRAFT: Partial<Product> = {
  name: '',
  shade: '',
  shadeHex: '#F4B6C2',
  shadeFamily: 'Pink',
  finish: 'High Shine',
  price: 499,
  compareAtPrice: 599,
  volume: '5 ml',
  stock: 20,
  description: '',
  longDescription: '',
  ingredients: '',
  howToUse: '',
};

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState<Partial<Product> | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/login?next=/admin/products');
    }
  }, [loading, user, router]);

  const refresh = () => api<Product[]>('/api/admin/products').then(setProducts);

  useEffect(() => {
    if (user?.role === 'admin') refresh();
  }, [user]);

  if (loading || !user || user.role !== 'admin') {
    return <div className="py-20 text-center text-ink-muted">Loading…</div>;
  }

  const saveEdit = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const { id, slug, ...patch } = editing;
      await api(`/api/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
      setEditing(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await api(`/api/admin/products/${id}`, { method: 'DELETE' });
    await refresh();
  };

  const create = async () => {
    if (!creating) return;
    setBusy(true);
    try {
      await api('/api/admin/products', { method: 'POST', body: JSON.stringify(creating) });
      setCreating(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/admin" className="text-xs text-ink-muted hover:text-cherub-700">← Back to admin</Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-4xl">Products</h1>
        <button
          onClick={() => setCreating(EMPTY_DRAFT)}
          className="bg-ink text-cream px-4 py-2 rounded-full text-sm hover:bg-cherub-700 transition"
        >
          + New product
        </button>
      </div>

      <div className="mt-6 overflow-x-auto bg-white border border-cherub-100 rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-cherub-50 text-left">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Shade</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-cherub-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-ink-muted">{p.slug}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full ring-1 ring-black/5" style={{ background: p.shadeHex }} />
                    <span>{p.shade}</span>
                  </div>
                </td>
                <td className="px-4 py-3">₹{p.price}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 0 ? 'text-red-600' : p.stock < 5 ? 'text-cherub-700' : ''}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button onClick={() => setEditing(p)} className="text-cherub-700 hover:underline">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ProductDrawer
          draft={editing || creating!}
          isNew={!editing}
          busy={busy}
          onChange={(d) => (editing ? setEditing(d as Product) : setCreating(d))}
          onClose={() => {
            setEditing(null);
            setCreating(null);
          }}
          onSave={editing ? saveEdit : create}
        />
      )}
    </div>
  );
}

function ProductDrawer({
  draft,
  isNew,
  busy,
  onChange,
  onClose,
  onSave,
}: {
  draft: Partial<Product>;
  isNew: boolean;
  busy: boolean;
  onChange: (d: Partial<Product>) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const update = <K extends keyof Product>(key: K, val: Product[K]) =>
    onChange({ ...draft, [key]: val });

  return (
    <div className="fixed inset-0 bg-ink/40 z-50 flex items-stretch justify-end" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-cream h-full overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl">{isNew ? 'New product' : `Edit ${draft.name}`}</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field wide label="Name" value={draft.name || ''} onChange={(v) => update('name', v)} />
          <Field label="Shade" value={draft.shade || ''} onChange={(v) => update('shade', v)} />
          <Field label="Shade hex" value={draft.shadeHex || ''} onChange={(v) => update('shadeHex', v)} />
          <Field label="Shade family" value={draft.shadeFamily || ''} onChange={(v) => update('shadeFamily', v)} />
          <Field label="Finish" value={draft.finish || ''} onChange={(v) => update('finish', v)} />
          <Field label="Price (₹)" type="number" value={String(draft.price ?? '')} onChange={(v) => update('price', Number(v))} />
          <Field label="Compare at (₹)" type="number" value={String(draft.compareAtPrice ?? '')} onChange={(v) => update('compareAtPrice', Number(v) || null)} />
          <Field label="Volume" value={draft.volume || ''} onChange={(v) => update('volume', v)} />
          <Field label="Stock" type="number" value={String(draft.stock ?? '')} onChange={(v) => update('stock', Number(v))} />
          <Field wide label="Short description" value={draft.description || ''} onChange={(v) => update('description', v)} />
          <Field wide textarea label="Long description" value={draft.longDescription || ''} onChange={(v) => update('longDescription', v)} />
          <Field wide textarea label="Ingredients" value={draft.ingredients || ''} onChange={(v) => update('ingredients', v)} />
          <Field wide textarea label="How to use" value={draft.howToUse || ''} onChange={(v) => update('howToUse', v)} />
          <Field
            wide
            textarea
            label="Image URLs (one per line, recommended 4)"
            value={(draft.images || []).join('\n')}
            onChange={(v) => update('images', v.split('\n').map((s) => s.trim()).filter(Boolean))}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onSave}
            disabled={busy}
            className="bg-ink text-cream px-5 py-2 rounded-full text-sm hover:bg-cherub-700 transition disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-full border border-cherub-200 text-sm hover:bg-cherub-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  wide,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  wide?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className={`block ${wide ? 'col-span-2' : ''}`}>
      <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-cherub-200 bg-white focus:outline-none focus:border-cherub-500"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-cherub-200 bg-white focus:outline-none focus:border-cherub-500"
        />
      )}
    </label>
  );
}
