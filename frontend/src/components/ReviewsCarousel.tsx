'use client';

// Auto-rotating reviews carousel.
//
// Behaviour:
//   • Mobile  : 1 review card visible, advances by 1 every 7s
//   • Desktop : 3 review cards visible, slides by 1 every 7s
//   • Pauses on hover so the shopper can finish reading
//   • Arrows + dots for manual control
//
// Same dual-track loop trick as AboutCarousel: render the review list twice,
// snap index back to 0 silently after the first copy ends. Seamless infinite
// scroll without measuring widths in JS.
//
// Photos and reviewer names come from S3 — owner uploads JPEGs into the
// `resources/back/imgs/testis/` folder with `<First Last>.jpeg` filenames;
// they get paired with the quotes in the same order below.

import { useEffect, useState } from 'react';

const S3_BASE =
  'https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/testis';

const REVIEWS = [
  {
    name: 'Niharika Singh',
    photo: `${S3_BASE}/Niharika+Singh.jpeg`,
    quote:
      'This gloss gives the perfect glass-like shine without feeling overly thick. The formula feels nourishing, almost like a lip treatment. My lips looked fuller and smoother the moment I applied it.',
  },
  {
    name: 'Paridhi Gupta',
    photo: `${S3_BASE}/Paridhi+Gupta.jpeg`,
    quote:
      "What I love most is how comfortable it feels. There's no tackiness when I press my lips. It also leaves my lips feeling soft even after it wears off.",
  },
  {
    name: 'Pooja Vyas',
    photo: `${S3_BASE}/Pooja+Vyas.jpeg`,
    quote:
      "I've tried a lot of lip glosses, and this one stands out because of its texture. It's silky, not sticky, and spreads evenly. The glossy finish looks beautiful in natural light and photographs really well too.",
  },
  {
    name: 'Simar Gulati',
    photo: `${S3_BASE}/Simar+Gulati.jpeg`,
    quote:
      "The shine lasted much longer than I expected. Even after eating a light snack, my lips still had a healthy glow. It feels moisturizing throughout the day and doesn't settle into lip lines.",
  },
  {
    name: 'Veerasana Shukla',
    photo: `${S3_BASE}/Veerasana+Shukla.jpeg`,
    quote:
      'This has become my go-to gloss for quick makeup days. One swipe instantly makes my lips look hydrated.',
  },
  {
    name: 'Goutamee Pathare',
    photo: `${S3_BASE}/Goutamee+Pathare.jpeg`,
    quote:
      "I love how this gloss doesn't feel heavy at all. It's lightweight, comfortable, and gives a beautiful reflective shine. It kept my lips looking fresh for hours and didn't dry them out like some other glosses do.",
  },
  {
    name: 'Isha Katariya',
    photo: `${S3_BASE}/Isha+Katariya.jpeg`,
    quote: 'My lips stayed soft, hydrated, and shiny much longer than expected.',
  },
];

const INTERVAL_MS = 7000;
const TRANSITION_MS = 600;

export default function ReviewsCarousel() {
  const len = REVIEWS.length;
  const [index, setIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [paused, setPaused] = useState(false);

  // Auto-advance — paused on hover.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => i + 1), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused]);

  // Seamless wrap-around: after the transition completes, if we've crossed
  // into the duplicate copy, snap back to the equivalent index in the first
  // copy with `transition: none` so the snap is invisible.
  useEffect(() => {
    if (index >= len) {
      const t = setTimeout(() => {
        setWithTransition(false);
        setIndex(index - len);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setWithTransition(true))
        );
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
    if (index < 0) {
      const t = setTimeout(() => {
        setWithTransition(false);
        setIndex(index + len);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setWithTransition(true))
        );
      }, TRANSITION_MS);
      return () => clearTimeout(t);
    }
  }, [index, len]);

  const next = () => setIndex((i) => i + 1);
  const prev = () => setIndex((i) => i - 1);
  const goTo = (i: number) => setIndex(i);

  // Logical "active dot" — index modulo len, normalised positive.
  const activeDot = ((index % len) + len) % len;

  // Render the list twice for the loop trick.
  const items = [...REVIEWS, ...REVIEWS];

  return (
    <section className="bg-cream border-t border-cherub-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-cherub-700 mb-2">
            Real reviews
          </p>
          <h2 className="font-display text-4xl md:text-5xl">From your lips to ours.</h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            {/* Track. CSS var --shift = one tile width (100% mobile, 33.33% desktop). */}
            <div
              className="flex items-stretch [--shift:100%] md:[--shift:33.3333%]"
              style={{
                transform: `translateX(calc(var(--shift) * -${index}))`,
                transition: withTransition
                  ? `transform ${TRANSITION_MS}ms ease`
                  : 'none',
              }}
            >
              {items.map((review, i) => (
                <div key={i} className="shrink-0 w-full md:w-1/3 px-2 md:px-3">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous review"
            className="absolute left-1 md:-left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-cherub-200 hover:bg-cherub-50 hover:border-cherub-400 transition shadow-soft flex items-center justify-center text-cherub-700 text-lg z-10"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next review"
            className="absolute right-1 md:-right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-cherub-200 hover:bg-cherub-50 hover:border-cherub-400 transition shadow-soft flex items-center justify-center text-cherub-700 text-lg z-10"
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === activeDot
                  ? 'w-6 bg-cherub-700'
                  : 'w-2 bg-cherub-200 hover:bg-cherub-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
}: {
  review: { name: string; photo: string; quote: string };
}) {
  return (
    <article className="bg-white border border-cherub-100 rounded-2xl p-6 md:p-7 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Stars />
        <span className="text-[10px] uppercase tracking-wider text-ink-muted">5.0</span>
      </div>

      <p className="text-ink-soft leading-relaxed text-[15px] flex-1">
        <span className="text-cherub-300 font-display text-2xl leading-none mr-1">“</span>
        {review.quote}
        <span className="text-cherub-300 font-display text-2xl leading-none ml-0.5">”</span>
      </p>

      <div className="mt-6 flex items-center gap-3 pt-5 border-t border-cherub-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={review.photo}
          alt={review.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-cherub-100 bg-cherub-50"
          loading="lazy"
        />
        <div>
          <div className="font-medium text-ink leading-tight">{review.name}</div>
          <div className="text-xs text-cherub-700 mt-0.5">Verified review</div>
        </div>
      </div>
    </article>
  );
}

function Stars() {
  return (
    <div className="flex gap-0.5 text-cherub-600">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2.5l2.93 6.18 6.82.66-5.13 4.59 1.5 6.72L12 17.27l-6.12 3.38 1.5-6.72L2.25 9.34l6.82-.66z" />
        </svg>
      ))}
    </div>
  );
}
