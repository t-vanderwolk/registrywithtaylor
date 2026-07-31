import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import GiftForm from '@/components/gift/GiftForm';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { giftStructuredData } from '@/lib/marketing/giftStructuredData';

export const metadata = buildMarketingMetadata({
  title: 'Gift a Baby Registry Consultation, $75 | Taylor-Made Baby Co.',
  description:
    'Give the gift of confidence: a prepaid 1-hour virtual baby registry consultation with Taylor Vanderwolk. Purchase in minutes; the recipient books their own time. A thoughtful baby shower and new-parent gift.',
  path: '/gift',
  imagePath: '/assets/hero/hero-06.jpg',
  imageAlt: 'Gift a baby registry consultation with Taylor-Made Baby Co.',
  keywords: [
    'baby registry consultation gift',
    'baby shower gift for expecting parents',
    'gift a registry consultant',
    'new parent gift',
    'baby gear consultation gift certificate',
    'registry help gift',
    'virtual baby registry consultation gift',
  ],
});

export default function GiftPage() {
  return (
    <SiteShell currentPath="/gift">
      <main className="min-h-screen" style={{ backgroundColor: '#fbf7f4' }}>
        <PageViewTracker path="/gift" pageType="gift" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(giftStructuredData) }}
        />

        <section className="mx-auto max-w-2xl px-6 pb-2 pt-14 text-center">
          <nav aria-label="Breadcrumb" className="mb-6 text-[0.72rem] uppercase tracking-[0.16em] text-neutral-400">
            <ol className="flex items-center justify-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[var(--color-accent-dark)]">Home</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href="/services" className="transition hover:text-[var(--color-accent-dark)]">Registry Consultation</Link>
              </li>
              <li aria-hidden="true">›</li>
              <li className="font-semibold text-[var(--color-accent-dark)]" aria-current="page">Gift a Consult</li>
            </ol>
          </nav>

          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
            Registry Consult
          </p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
            Gift a Baby Registry Consultation
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[1rem] leading-7 text-neutral-600">
            A prepaid 1-hour virtual{' '}
            <Link href="/services" className="font-semibold text-[var(--color-accent-dark)] underline underline-offset-2">
              Registry Consult
            </Link>{' '}
            — the perfect baby shower or new-parent gift. Purchase in minutes; the recipient picks a
            time that works for them.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-[rgba(215,161,175,0.3)] bg-white px-4 py-2 text-[0.85rem] font-semibold text-[var(--color-accent-dark)]">
            Registry Consult — $75 · 1-hour virtual
          </p>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-10 pt-6">
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

        {/* How gifting works — mirrors the HowTo schema, adds internal links */}
        <section className="mx-auto max-w-3xl px-6 pb-16">
          <h2 className="text-center font-serif text-[1.5rem] tracking-[-0.02em] text-neutral-900">
            How gifting works
          </h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: '1',
                t: 'Purchase the gift',
                b: 'Add the recipient’s name and a note, then check out securely. Takes about a minute.',
              },
              {
                n: '2',
                t: 'They get a certificate',
                b: 'We email them a personalized certificate with a redemption code — or you deliver it yourself.',
              },
              {
                n: '3',
                t: 'They book their session',
                b: 'They redeem the code and pick a time for their 1-hour Registry Consult. No further payment.',
              },
            ].map((s) => (
              <li key={s.n} className="rounded-[1rem] border border-[rgba(215,161,175,0.2)] bg-white p-5 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(216,137,160,0.12)] font-serif text-[1.05rem] text-[var(--color-accent-dark)]">
                  {s.n}
                </span>
                <p className="mt-3 text-[0.95rem] font-semibold text-neutral-800">{s.t}</p>
                <p className="mt-1.5 text-[0.82rem] leading-6 text-neutral-500">{s.b}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-xl text-center text-[0.85rem] leading-6 text-neutral-500">
            Booking for yourself instead?{' '}
            <Link href="/book" className="font-semibold text-[var(--color-accent-dark)] underline underline-offset-2">
              Book your own Registry Consult
            </Link>
            , or see everything included on the{' '}
            <Link href="/services" className="font-semibold text-[var(--color-accent-dark)] underline underline-offset-2">
              services page
            </Link>
            .
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
