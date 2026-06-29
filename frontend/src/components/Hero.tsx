import Link from 'next/link';

// Two banner slots: a wide one for desktop/tablet, a vertical one for phones.
//
// To swap placeholders for real photography, replace the HERO_* URLs below.
//
// Styling is intentionally the same across every viewport (per the client):
// small copy tucked at the bottom of the image, dark gradient over the lower
// third for contrast, the photo's watermarked "glinte" wordmark stays the
// hero element. No more per-breakpoint flips between light and dark text —
// what you see on a phone is what you see on a laptop.

const HERO_DESKTOP =
  'https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/Landing%20Page%20Image/glinte%20%289%29.png';
const HERO_MOBILE =
  'https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/Landing%20Page%20Image/vertical%20website%20%282%29.png';

export default function Hero() {
  return (
    <section className="relative w-full bg-cherub-200">
      <picture>
        <source media="(min-width: 768px)" srcSet={HERO_DESKTOP} />
        <img
          src={HERO_MOBILE}
          alt="Glinte lip gloss"
          className="w-full h-[70vh] md:h-[80vh] object-cover"
        />
      </picture>

      {/* Contrast gradient — only the bottom ~30% darkens so the watermark
          wordmark in the middle of the photo stays prominent on every size. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      />

      <div className="absolute inset-0 flex flex-col items-center text-center px-6 justify-end pb-6">
        <h1
          className="font-display text-2xl
                     text-cream
                     drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]
                     animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          Glossier than glossy.
        </h1>
        <p
          className="mt-2 max-w-xl text-xs text-cream/90 animate-fade-up"
          style={{ animationDelay: '240ms' }}
        >
          Ten high-shine shades. Zero stickiness. All you.
        </p>
        <Link
          href="#shop"
          className="mt-4 inline-flex items-center gap-2
                     bg-cream text-ink
                     px-5 py-2 rounded-full text-xs tracking-wide
                     hover:bg-white transition animate-fade-up"
          style={{ animationDelay: '360ms' }}
        >
          Shop the collection
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
