'use client';

import { useEffect, useState } from 'react';

// Auto-rotating tile carousel for the homepage "Why Glinte" section.
//
// Behaviour:
//   • Mobile  : 1 tile visible, advances by 1 every 5s
//   • Desktop : 3 tiles visible, advances by 1 every 5s (so the visible
//               window slides 1→2→3, then 2→3→4, etc.)
//   • Pauses on hover so the shopper has time to read.
//   • Arrows + clickable dots for manual control.
//
// Loop trick: we render the tile list TWICE back-to-back. When `index`
// reaches the end of the first copy, the visible tiles are identical to
// the start of the first copy, so we silently snap `index` back to 0 with
// no animation — gives a seamless infinite loop without measuring widths
// in JS.

const S3_BASE =
  'https://elasticbeanstalk-ap-south-1-539247475467.s3.ap-south-1.amazonaws.com/resources/back/imgs/homepage';

const TILES = [
  `${S3_BASE}/1.png`,
  `${S3_BASE}/2.png`,
  `${S3_BASE}/3.png`,
  `${S3_BASE}/4.png`,
  `${S3_BASE}/5.PNG`,
  `${S3_BASE}/6.PNG`,
];

const INTERVAL_MS = 5000;
const TRANSITION_MS = 600;

export default function AboutCarousel() {
  const len = TILES.length;
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
        // Two RAF ticks gives the browser time to commit the no-transition
        // paint before we re-enable the transition for the next move.
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
  const items = [...TILES, ...TILES];

  return (
    <section className="bg-cherub-50/60 border-t border-cherub-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-cherub-700 mb-2">Why Glinte</p>
          <h2 className="font-display text-4xl md:text-5xl">Made the way it should be.</h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            {/* The tile track. CSS var --shift toggles the per-step distance:
                100% (one full tile) on mobile, 33.3333% (one of three) on
                desktop. transform = -index * shift. */}
            <div
              className="flex [--shift:100%] md:[--shift:33.3333%]"
              style={{
                transform: `translateX(calc(var(--shift) * -${index}))`,
                transition: withTransition
                  ? `transform ${TRANSITION_MS}ms ease`
                  : 'none',
              }}
            >
              {items.map((src, i) => (
                <div key={i} className="shrink-0 w-full md:w-1/3 px-2 md:px-3">
                  {/* Plain <img> — Next/Image needs explicit dimensions for
                      remote sources and we don't know the natural aspect of
                      the JPEG/PNG ahead of time. The shadow + rounded
                      treatment matches the rest of the brand. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="w-full aspect-square object-cover rounded-2xl shadow-soft bg-white"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows — sit just outside the track on desktop, slightly inset on mobile */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous tile"
            className="absolute left-1 md:-left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-cherub-200 hover:bg-cherub-50 hover:border-cherub-400 transition shadow-soft flex items-center justify-center text-cherub-700 text-lg"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next tile"
            className="absolute right-1 md:-right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-cherub-200 hover:bg-cherub-50 hover:border-cherub-400 transition shadow-soft flex items-center justify-center text-cherub-700 text-lg"
          >
            →
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {TILES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to tile ${i + 1}`}
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
