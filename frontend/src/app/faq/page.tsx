export const metadata = { title: 'FAQ — Glinte' };

const FAQS = [
  // ---- Product (from the brand) ----
  {
    q: 'Are Glinte glosses vegan and cruelty-free?',
    a: 'Yes — every shade is 100% vegan and cruelty-free. No animal-derived ingredients, and never tested on animals.',
  },
  {
    q: 'How long do they last on?',
    a: 'Expect 2–4 hours of comfortable wear, depending on how generously you apply, and on eating and drinking through the day. The shine lingers beautifully and a top-up takes one swipe.',
  },
  {
    q: 'Do they feel sticky?',
    a: 'Not at all. The formula is built to feel cushiony and smooth, with a glossy finish that\'s comfortable enough to forget you\'re wearing it.',
  },
  {
    q: 'What\'s the shelf life?',
    a: 'Best within 24 months unopened, and within 6–12 months once opened. Check the PAO (period-after-opening) symbol on the pack for exact guidance.',
  },
  {
    q: 'Can I wear Glinte gloss over lipstick?',
    a: 'Absolutely. Wear it solo for juicy shine, or layer it over your favourite liner or lipstick to refresh the finish.',
  },
  {
    q: 'Are the glosses pigmented or sheer?',
    a: 'A perfect middle ground — a buildable tint that\'s wearable alone or layered, so you decide how loud the colour gets.',
  },
  {
    q: 'Will the gloss settle into lip lines?',
    a: 'No. The formula glides on smoothly and leaves an even, glossy finish without sinking into texture.',
  },
  {
    q: 'Are Glinte glosses suitable for everyday wear?',
    a: 'Yes — lightweight, comfortable, and built for the way you actually wear gloss. Through coffee, conversations, and long days.',
  },
  {
    q: 'Do the glosses have a fragrance or flavour?',
    a: 'Some shades carry a subtle sweet scent inspired by the shade itself, kept gentle so wear stays comfortable.',
  },
  {
    q: 'How do I choose the right shade for me?',
    a: 'Our shades are designed to flatter a wide range of Indian skin tones. Check the swatches and shade descriptions on each product page, or DM us on Instagram for personal shade help.',
  },
  {
    q: 'Are Glinte glosses transfer-proof?',
    a: 'As with any nourishing gloss, a little transfer is natural. The shine and tint wear softly through the day rather than disappearing all at once.',
  },

  // ---- Orders & shipping ----
  {
    q: 'How do I track my order?',
    a: 'Once your order is dispatched via Shiprocket, you\'ll receive a tracking link via email and SMS. You can also check the status anytime under My account → Orders.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most metro pincodes receive their order within 3–5 business days. Tier-2 cities and smaller towns may take 5–8 business days. Free shipping on orders over ₹999.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'All major UPI apps, debit and credit cards, netbanking and digital wallets — secured via Razorpay.',
  },
  {
    q: 'What\'s your return policy?',
    a: 'For hygiene reasons we don\'t accept returns on opened products. Unopened products can be returned within 7 days of delivery for a full refund. If your order arrives damaged, send us a photo within 48 hours and we\'ll replace it free of charge.',
  },
  {
    q: 'Can I change or cancel my order after placing it?',
    a: 'Get in touch within 2 hours of placing the order and we\'ll do our best to update or cancel it. Once the order is dispatched, we can\'t intercept.',
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-cherub-700 text-center">Help</p>
      <h1 className="font-display text-5xl text-center mt-2 mb-10">Frequently asked</h1>

      <div className="bg-white border border-cherub-100 rounded-2xl divide-y divide-cherub-100">
        {FAQS.map((item, i) => (
          <details key={i} className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between px-6 py-5 hover:bg-cherub-50/50 transition">
              <span className="font-medium pr-6">{item.q}</span>
              <span className="text-cherub-700 text-xl group-open:rotate-45 transition">+</span>
            </summary>
            <div className="px-6 pb-5 text-ink-muted leading-relaxed">{item.a}</div>
          </details>
        ))}
      </div>

      <p className="text-center text-sm text-ink-muted mt-8">
        Still stuck? <a href="/contact" className="text-cherub-700 hover:underline">Drop us a line</a>.
      </p>
    </div>
  );
}
