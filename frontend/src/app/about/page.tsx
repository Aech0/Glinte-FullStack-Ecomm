import Link from 'next/link';

export const metadata = { title: 'About — Glinte' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-cherub-700 text-center">Our story</p>
      <h1 className="font-display text-5xl text-center mt-2 mb-10">About Glinte</h1>

      <div className="prose prose-pink space-y-6 text-ink-soft leading-relaxed text-[17px]">
        <p>
          Glinte started with a simple frustration. Every gloss we tried was either
          sticky enough to catch hair on a windy day, or so thin it disappeared after
          one sip of coffee. We wanted something in between — pigmented enough to be
          felt, weightless enough to forget you were wearing it.
        </p>
        <p>
          So we made it ourselves. Ten shades, hand-tested across hundreds of lips,
          formulated in Mumbai with vegan, cruelty-free ingredients. No animal-derived
          waxes. No parabens. No fragrance designed to mask something cheap underneath.
        </p>
        <p>
          What we kept: real shine that lasts past lunch, micro-fine pearl in the
          shimmer shades, and a doe-foot applicator that actually picks up the right
          amount of product. What we cut: stickiness, thick film, and the kind of
          packaging that ends up at the bottom of your bag scratched up after a week.
        </p>

        <div className="grid md:grid-cols-3 gap-4 not-prose pt-4">
          <Value title="Vegan + cruelty-free" body="Every ingredient, every batch, every test." />
          <Value title="Made in India" body="Formulated and bottled in Mumbai." />
          <Value title="Small-batch" body="Made in batches of 200 so freshness never fades." />
        </div>

        <p className="pt-6">
          Glinte is for the way you actually wear gloss — through dinner, through
          coffee, through a long phone call with your favourite person. Welcome.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex bg-ink text-cream px-7 py-3 rounded-full text-sm hover:bg-cherub-700 transition"
        >
          Shop the collection
        </Link>
      </div>
    </div>
  );
}

function Value({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-cherub-50 border border-cherub-100 rounded-2xl p-5">
      <div className="font-medium text-ink mb-1">{title}</div>
      <div className="text-sm text-ink-muted">{body}</div>
    </div>
  );
}
