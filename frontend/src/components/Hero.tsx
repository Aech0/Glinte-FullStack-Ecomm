import Link from 'next/link';

// Two banner slots: a wide one for desktop/tablet, a vertical one for phones.
//
// To swap placeholders for real photography:
//   1. Drop the files into /public/images/
//        hero-desktop.jpg   (recommended 2400 × 1100, banner crop)
//        hero-mobile.jpg    (recommended  900 × 1300, vertical crop)
//   2. Replace the two HERO_* constants below.
//
// Mobile-specific styling (only): copy is shrunk and tucked at the bottom so
// the watermarked "glinte" wordmark in the middle of the photo reads as the
// hero element (owner's brief). Only the bottom ~30% of the image is shaded
// for text contrast; the rest stays clear so the wordmark shows through.
// All `md:` overrides keep the desktop look pixel-identical to before.

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

      {/* Mobile-only contrast gradient. Only the bottom ~30% darkens so the
          watermarked wordmark in the middle of the photo stays prominent. */}
      <div
        aria-hidden
        className="absolute inset-0 md:hidden bg-gradient-to-t from-black/60 via-transparent to-transparent"
      />

      <div
        className="absolute inset-0 flex flex-col items-center text-center px-6
                   justify-end pb-6
                   md:justify-center md:pb-0
                   md:bg-gradient-to-b md:from-transparent md:via-transparent md:to-cherub-50/40"
      >
        <h1
          className="font-display text-2xl md:text-7xl lg:text-8xl
                     text-cream md:text-ink-soft
                     drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]
                     md:drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]
                     animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          Glossier than glossy.
        </h1>
        <p
          className="mt-2 md:mt-5 max-w-xl text-xs md:text-lg
                     text-cream/90 md:text-ink-soft/85 animate-fade-up"
          style={{ animationDelay: '240ms' }}
        >
          Ten high-shine shades. Zero stickiness. All you.
        </p>
        <Link
          href="#shop"
          className="mt-4 md:mt-8 inline-flex items-center gap-2
                     bg-cream text-ink md:bg-ink md:text-cream
                     px-5 md:px-7 py-2 md:py-3 rounded-full text-xs md:text-sm tracking-wide
                     hover:bg-white md:hover:bg-cherub-700 transition animate-fade-up"
          style={{ animationDelay: '360ms' }}
        >
          Shop the collection
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
