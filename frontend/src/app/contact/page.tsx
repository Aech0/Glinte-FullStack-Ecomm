'use client';

import { useState } from 'react';

// Submissions go through a `mailto:` for now — once an SMTP/transactional
// service is wired in, swap this for a POST to /api/contact.

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(form.subject || `[Glinte] from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:glintelipglaze@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-12">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cherub-700">Say hi</p>
        <h1 className="font-display text-5xl mt-2 mb-6">Contact</h1>
        <p className="text-ink-muted leading-relaxed">
          Questions about an order, a shade you wish existed, or just want to share
          a selfie wearing your favourite Glinte? We read every message.
        </p>

        <div className="mt-8 space-y-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">Email</div>
            <a href="mailto:glintelipglaze@gmail.com" className="text-cherub-700 hover:underline">glintelipglaze@gmail.com</a>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">Instagram</div>
            <a href="https://instagram.com/glinte" target="_blank" rel="noreferrer" className="text-cherub-700 hover:underline">@glinte</a>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted mb-1">Hours</div>
            <div>Mon–Fri, 10:00 — 18:00 IST</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-cherub-100 rounded-2xl p-6 space-y-4">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
        <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
        <Field label="Message" textarea value={form.message} onChange={(v) => setForm({ ...form, message: v })} required />

        <button
          type="submit"
          className="w-full bg-ink text-cream py-3 rounded-full text-sm hover:bg-cherub-700 transition"
        >
          Send message
        </button>
        {sent && (
          <p className="text-xs text-cherub-700 text-center">Your email client should now be open. If not, copy glintelipglaze@gmail.com.</p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-ink-muted mb-1">
        {label} {required && <span className="text-cherub-700">*</span>}
      </span>
      {textarea ? (
        <textarea
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 rounded-lg border border-cherub-200 bg-white focus:outline-none focus:border-cherub-500"
        />
      ) : (
        <input
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-cherub-200 bg-white focus:outline-none focus:border-cherub-500"
        />
      )}
    </label>
  );
}
