'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A calm, on-brand horizontal bar chart showing roughly how many years of use
 * each car-seat type buys you. Bars grow in when the chart scrolls into view
 * (staggered), and it respects prefers-reduced-motion. Values are a general
 * real-world guide, not a spec sheet — exact limits vary by model.
 */
type SeatBar = { label: string; years: number; note: string };

const SEATS: SeatBar[] = [
  { label: 'Infant car seat', years: 1.5, note: 'Birth to ~30-35 lb, clicks onto a stroller' },
  { label: 'Convertible', years: 4, note: 'Rear-facing baby, then forward-facing toddler' },
  { label: 'Booster', years: 4, note: 'Belt-positioning for older, taller kids' },
  { label: 'All-in-one', years: 10, note: 'Every stage in one seat, birth through booster' },
];
const MAX_YEARS = 10;

export default function CarSeatLifespanChart() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduce(true);
      setShown(true);
      return;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mkt-card rounded-[1.5rem] border border-[var(--color-card-border)] bg-white p-6 shadow-[0_10px_30px_rgba(55,40,46,0.06)] sm:p-8"
    >
      <div className="space-y-5">
        {SEATS.map((seat, i) => {
          const pct = Math.round((seat.years / MAX_YEARS) * 100);
          return (
            <div key={seat.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-[1.05rem] leading-tight tracking-[-0.01em] text-neutral-900">{seat.label}</span>
                <span className="shrink-0 text-[0.82rem] font-semibold text-[var(--color-accent-dark)]">
                  ~{seat.years % 1 === 0 ? seat.years : seat.years.toFixed(1)} yr{seat.years === 1 ? '' : 's'}
                </span>
              </div>
              <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-[rgba(215,161,175,0.16)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-cta-pink),var(--color-accent-dark))]"
                  style={{
                    width: shown ? `${pct}%` : '0%',
                    transition: reduce ? 'none' : 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
                    transitionDelay: reduce ? '0ms' : `${i * 120}ms`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-[0.82rem] leading-6 text-neutral-500">{seat.note}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-6 border-t border-[rgba(215,161,175,0.18)] pt-4 text-[0.78rem] leading-6 text-neutral-400">
        A general real-world guide. Exact height and weight limits vary by model, so always check the seat you are
        eyeing before you buy.
      </p>
    </div>
  );
}
