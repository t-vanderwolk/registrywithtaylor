import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import GiftForm from '@/components/gift/GiftForm';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Gift a Registry Consult — Taylor-Made Baby Co.',
  description:
    'Give the gift of confidence: a prepaid 1-hour virtual Registry Consult with Taylor. Purchase in minutes; they book their own time.',
  path: '/gift',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Gift a Registry Consult with Taylor-Made Baby Co.',
});

export default function GiftPage() {
  return (
    <SiteShell currentPath="/gift">
      <main className="min-h-screen" style={{ backgroundColor: '#fbf7f4' }}>
        <section className="mx-auto max-w-2xl px-6 pb-2 pt-16 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
            Registry Consult
          </p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
            Give the Gift of Confidence
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[1rem] leading-7 text-neutral-600">
            A prepaid 1-hour virtual Registry Consult — the perfect baby shower or new-parent gift.
            Purchase in minutes; they pick a time that works for them.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(215,161,175,0.3)] bg-white px-4 py-2 text-[0.85rem] font-semibold text-[var(--color-accent-dark)]">
            Registry Consult — $75 · 1-hour virtual
          </p>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-16 pt-6">
          <div className="rounded-[1.25rem] border border-[rgba(215,161,175,0.2)] bg-white p-6 shadow-[0_6px_18px_rgba(72,49,56,0.05)] sm:p-8">
            <GiftForm />
          </div>
          <p className="mx-auto mt-5 max-w-xl text-center text-[0.82rem] leading-6 text-neutral-500">
            Have a gift code?{' '}
            <Link href="/redeem" className="font-semibold text-[var(--color-accent-dark)] underline underline-offset-2">
              Redeem it here
            </Link>
            .
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
