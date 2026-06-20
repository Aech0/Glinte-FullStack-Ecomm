'use client';

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}) {
  const btn =
    size === 'sm'
      ? 'w-7 h-7 text-sm'
      : 'w-9 h-9';
  return (
    <div className="inline-flex items-center border border-cherub-200 rounded-full overflow-hidden bg-white">
      <button
        type="button"
        className={`${btn} hover:bg-cherub-50 transition disabled:opacity-40`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease"
      >
        −
      </button>
      <span className={`${size === 'sm' ? 'w-7' : 'w-10'} text-center font-medium tabular-nums`}>{value}</span>
      <button
        type="button"
        className={`${btn} hover:bg-cherub-50 transition disabled:opacity-40`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
