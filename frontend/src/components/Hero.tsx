import Link from 'next/link';

// Two banner slots: a wide one for desktop/tablet, a vertical one for phones.
//
// Desktop is wired to the S3 landing-page image. There's no mobile vertical
// crop yet — we serve the desktop image as a fallback on phones. Drop a real
// vertical at /public/images/hero-mobile.jpg (or change HERO_MOBILE) when
// the photography is ready.

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

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-transparent via-transparent to-cherub-50/40">
        <p className="uppercase tracking-[0.4em] text-xs md:text-sm text-ink-soft/80 mb-4 animate-fade-up">
          Pantone Pink Cherub
        </p>
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl text-ink-soft drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)] animate-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          Glossier than glossy.
        </h1>
        <p
          className="mt-5 max-w-xl text-ink-soft/85 md:text-lg animate-fade-up"
          style={{ animationDelay: '240ms' }}
        >
          Ten high-shine shades. Zero stickiness. All you.
        </p>
        <Link
          href="#shop"
          className="mt-8 inline-flex items-center gap-2 bg-ink text-cream px-7 py-3 rounded-full text-sm tracking-wide hover:bg-cherub-700 transition animate-fade-up"
          style={{ animationDelay: '360ms' }}
        >
          Shop the collection
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
