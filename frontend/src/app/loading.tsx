// Next.js renders this instantly while the next route segment is loading.
// In dev mode that "blank flash" between clicks is replaced with this; in
// production it shows during data-fetching or hydration on slow networks.

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-cherub-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cherub-700 animate-spin" />
      </div>
      <p className="mt-5 text-xs uppercase tracking-[0.3em] text-cherub-700 font-display">
        Glinte
      </p>
    </div>
  );
}
