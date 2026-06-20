import Link from 'next/link';

// Shared layout for the four legal pages: Privacy, Terms, Refund, Shipping.
// Renders an eyebrow + title + a "last updated" line, then the children
// inside a readable column with consistent typography.

export default function PolicyShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 md:py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-cherub-700 text-center">
        The fine print
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-center mt-2 mb-2">
        {title}
      </h1>
      <p className="text-center text-xs text-ink-muted mb-10">
        Last updated · {lastUpdated}
      </p>

      <article className="space-y-6 text-ink-soft leading-relaxed text-[15px] policy-prose">
        {children}
      </article>

      <p className="text-center text-sm text-ink-muted mt-12">
        Questions? Write to us at{' '}
        <a
          href="mailto:glintelipglaze@gmail.com"
          className="text-cherub-700 hover:underline"
        >
          glintelipglaze@gmail.com
        </a>
        .
      </p>

      <div className="text-center mt-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-cherub-700">← Back to Glinte</Link>
      </div>

      <style>{`
        .policy-prose h2 {
          font-family: var(--font-display);
          font-size: 1.4rem;
          color: #1F1014;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .policy-prose h3 {
          font-weight: 600;
          color: #1F1014;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
        .policy-prose ul {
          list-style: disc;
          padding-left: 1.25rem;
          color: #7A6068;
        }
        .policy-prose li {
          margin: 0.25rem 0;
        }
        .policy-prose p {
          color: #7A6068;
        }
      `}</style>
    </div>
  );
}
