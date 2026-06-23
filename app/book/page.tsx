import { Suspense } from 'react';
import Link from 'next/link';
import BookContent from '@/components/booking/BookContent';
import SiteShell from '@/components/SiteShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Book Your Registry Consult — Taylor-Made Baby Co.',
  description:
    'Pick a time that works for you. Your 1-hour Registry Consult with Taylor is just one step away.',
  path: '/book',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Schedule a consultation with Taylor-Made Baby Co.',
});

const whatToExpect = [
  'We’ll talk through where you are in the registry process.',
  'We’ll focus on your biggest questions first.',
  'We’ll narrow down the confusing product decisions.',
  'You’ll leave with next steps instead of another 47 tabs.',
];

export default function BookPage() {
  return (
    <SiteShell currentPath="/book">
      <main className="min-h-screen" style={{ backgroundColor: '#fbf7f4' }}>
        {/* Server-rendered intro — real content on first paint, not "Loading…" */}
        <section className="mx-auto max-w-2xl px-6 pb-2 pt-16 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
            Registry Consult
          </p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
            Book Your Registry Consult
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[1rem] leading-7 text-neutral-600">
            A 1-hour virtual session to help you start, edit, or make sense of your baby registry.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(215,161,175,0.3)] bg-white px-4 py-2 text-[0.85rem] font-semibold text-[var(--color-accent-dark)]">
            Registry Consult — $75 · 1-hour virtual
          </p>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-4 pt-6">
          <div className="rounded-[1.25rem] border border-[rgba(215,161,175,0.2)] bg-white p-6 shadow-[0_6px_18px_rgba(72,49,56,0.05)]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
              What to expect
            </p>
            <ul className="mt-3 space-y-2.5">
              {whatToExpect.map((item) => (
                <li key={item} className="flex gap-2.5 text-[0.95rem] leading-7 text-neutral-700">
                  <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-cta-pink)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Scheduler — only the embed is deferred, not the whole page */}
        <Suspense
          fallback={
            <div className="px-6 py-12 text-center text-sm text-neutral-400">Loading the scheduler…</div>
          }
        >
          <BookContent />
        </Suspense>

        <section className="mx-auto max-w-2xl px-6 pb-16 pt-2 text-center">
          <p className="text-[0.9rem] leading-7 text-neutral-500">
            Having trouble booking?{' '}
            <Link href="/contact" className="font-semibold text-[var(--color-accent-dark)] underline">
              Contact Taylor
            </Link>
            .
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
