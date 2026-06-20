'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

function RegisterInner() {
  const { register } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      router.push(next);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-4xl text-center mb-2">Create account</h1>
      <p className="text-center text-ink-muted mb-8">It takes 30 seconds.</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-cherub-100 rounded-2xl p-6">
        <Field label="Full name" value={name} onChange={setName} required />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field label="Password (min 6 characters)" type="password" value={password} onChange={setPassword} required />

        {error && (
          <div className="text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-cream py-3 rounded-full text-sm hover:bg-cherub-700 transition disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Already have one?{' '}
        <Link href={`/login${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="text-cherub-700 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-ink-muted mb-1">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-cherub-200 bg-white focus:outline-none focus:border-cherub-500"
      />
    </label>
  );
}
