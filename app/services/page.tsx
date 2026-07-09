import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import Hero from '@/components/ui/Hero';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { servicesStructuredData } from '@/lib/marketing/servicesStructuredData';
import {
  SERVICES_HERO_STATS,
  SERVICES_PAIN_HOOK,
  SERVICES_DECISIONS,
  SERVICES_WHY,
  SERVICES_ROI,
  SERVICES_INCLUDES,
  SERVICES_COVERAGE,
  SERVICES_STEPS,
  SERVICES_COMPARE,
  SERVICES_FIT,
  SERVICES_TESTIMONIALS,
  SERVICES_AVAILABILITY,
  SERVICES_CREDENTIALS,
  SERVICES_PRICING,
  SERVICES_ADDONS,
  SERVICES_LEAD_MAGNET,
  SERVICES_FAQ,
  SERVICES_CLOSING,
} from '@/lib/marketing/servicesContent';

export const metadata = buildMarketingMetadata({
  title: 'Baby Registry Consultation, $75 Virtual Session | Taylor-Made Baby Co.',
  description:
    'Book a 1-hour virtual baby registry consultation with certified Tot Squad specialist Taylor Vanderwolk for $75. Strollers, car seats, nursery, and registry strategy. Book your session today.',
  path: '/services',
  imagePath: '/assets/hero/hero-03.jpg',
  imageAlt: 'Baby registry consultation with Taylor Vanderwolk, baby registry consultant',
  keywords: [
    'baby registry consultant',
    'book baby registry consultation',
    'baby registry consultation $75',
    'virtual baby registry consultant',
    'baby registry expert',
    'baby gear consultant',
    'stroller consultation service',
    'baby registry help',
  ],
});

const CTA_CLASS =
  'inline-flex items-center justify-center rounded-full bg-[var(--color-accent-dark)] px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90';
const CTA_GHOST =
  'inline-flex items-center justify-center rounded-full border border-[#e2a9b6] px-7 py-3 text-sm font-semibold text-[var(--color-accent-dark)] transition hover:bg-[#fdf1f4]';

const EYEBROW = 'text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/70';
const H2 = 'font-serif text-[clamp(1.7rem,3vw,2.4rem)] leading-tight tracking-[-0.03em] text-neutral-900';

function CompareCell({ v }: { v: 'yes' | 'no' | 'partial' | 'varies' }) {
  if (v === 'yes') return <span className="font-semibold text-emerald-600" aria-label="yes">✓</span>;
  if (v === 'no') return <span className="text-neutral-300" aria-label="no">✗</span>;
  return <span className="text-[0.72rem] font-medium text-amber-600 capitalize">{v}</span>;
}

const serviceFaqs: FAQEntry[] = SERVICES_FAQ.map((f) => ({ question: f.question, answer: f.answer }));

export default function ServicesPage() {
  return (
    <SiteShell currentPath="/services">
      <main className="site-main">
        <PageViewTracker path="/services" pageType="services" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
        />

        <Hero
          className="homepage-hero services-hero"
          eyebrow="$75 · 1-Hour Virtual Session · US Nationwide"
          title="Baby Registry Consultation, Expert Help for Expecting Parents"
          subtitle="Taylor-Made Baby Co. offers 1-hour virtual baby registry consultations at $75, covering strollers, car seats, nursery, feeding gear, and registry strategy for expecting parents across the United States."
          primaryCta={{ label: 'Book Your Consultation, $75', href: '/book' }}
          secondaryCta={{ label: 'Contact Taylor', href: '/contact' }}
          tagline="Registry Strategy • Strollers • Car Seats • Feeding • Sleep • Nursery"
          image="/assets/hero/hero-03.jpg"
          imageAlt="Baby registry consultation with Taylor Vanderwolk, baby registry consultant"
          contentClassName="homepage-hero-content services-hero-content"
          ribbonClassName="translate-y-6 md:translate-y-8"
          staggerContent
        />

        {/* Proof strip */}
        <section className="border-y border-[#f2d3db] bg-[#fdf1f4]">
          <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 px-6 py-7">
            {SERVICES_HERO_STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-[1.7rem] leading-none text-[var(--color-accent-dark)]">{s.value}</p>
                <p className="mt-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pain hook + six decisions */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="font-serif text-[1.4rem] leading-snug tracking-[-0.02em] text-neutral-900">
              {SERVICES_PAIN_HOOK.lead}
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-[1.8] text-neutral-600">
              {SERVICES_PAIN_HOOK.body}
            </p>
            <p className="mt-5 text-[1.02rem] font-semibold text-[var(--color-accent-dark)]">
              {SERVICES_PAIN_HOOK.close}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-5xl px-6">
            <h2 className={`${H2} text-center`}>What Gets Decided in Your 1-Hour Session</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-500">
              This is not a general overview call. It is a working session. These are the decisions that get made.
            </p>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_DECISIONS.map((d, i) => (
                <div key={d.title} className="rounded-[1.1rem] border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                  <span className="font-serif text-[1.3rem] text-[var(--color-accent-dark)]/55">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 font-serif text-[1.2rem] leading-tight tracking-[-0.02em] text-neutral-900">{d.title}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-7 text-neutral-600">{d.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-neutral-500">
              Six decisions. One hour. $75.{' '}
              <Link href="/book" className="font-semibold text-[var(--color-accent-dark)] underline-offset-4 hover:underline">
                Book your session
              </Link>
            </p>
          </div>
        </section>

        {/* Why this exists */}
        <section className="bg-[#faf5f0] py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <p className={EYEBROW}>Why it matters</p>
            <h2 className={`${H2} mt-3`}>{SERVICES_WHY.heading}</h2>
            <div className="mt-6 space-y-4">
              {SERVICES_WHY.paragraphs.map((p, i) => (
                <p key={i} className={i === SERVICES_WHY.paragraphs.length - 1 ? 'text-[1rem] font-medium leading-[1.85] text-neutral-800' : 'text-[0.96rem] leading-[1.85] text-neutral-600'}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ROI table */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className={EYEBROW}>The math</p>
            <h2 className={`${H2} mt-3`}>{SERVICES_ROI.heading}</h2>
            <p className="mt-3 max-w-2xl text-sm text-neutral-500">{SERVICES_ROI.intro}</p>
            <div className="mt-8 overflow-hidden rounded-[1.1rem] border border-[#f2d3db]">
              <table className="w-full border-collapse text-left text-[0.85rem]">
                <thead className="bg-[#fdf1f4] text-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Common mistake</th>
                    <th className="px-4 py-3 font-semibold">Typical cost</th>
                    <th className="hidden px-4 py-3 font-semibold md:table-cell">Why it happens</th>
                    <th className="px-4 py-3 font-semibold">A consultation prevents it</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f6e2e8]">
                  {SERVICES_ROI.rows.map((r) => (
                    <tr key={r.mistake} className="align-top">
                      <td className="px-4 py-3 font-medium text-neutral-800">{r.mistake}</td>
                      <td className="px-4 py-3 font-semibold text-[var(--color-accent-dark)]">{r.cost}</td>
                      <td className="hidden px-4 py-3 text-neutral-500 md:table-cell">{r.why}</td>
                      <td className="px-4 py-3 text-neutral-600">{r.prevents}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#fbeef2] align-top font-semibold">
                    <td className="px-4 py-3 text-neutral-900">{SERVICES_ROI.total.label}</td>
                    <td className="px-4 py-3 text-[var(--color-accent-dark)]">{SERVICES_ROI.total.cost}</td>
                    <td className="hidden px-4 py-3 md:table-cell" />
                    <td className="px-4 py-3 text-neutral-900">{SERVICES_ROI.total.note}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="bg-[#faf5f0] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className={EYEBROW}>What you get</p>
            <h2 className={`${H2} mt-3`}>{SERVICES_INCLUDES.heading}</h2>
            <p className="mt-3 max-w-2xl text-sm text-neutral-500">{SERVICES_INCLUDES.intro}</p>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_INCLUDES.items.map((item) => (
                <div key={item.title} className="rounded-[1.1rem] border border-[#efd9df] bg-white p-6">
                  <h3 className="font-serif text-[1.15rem] leading-tight tracking-[-0.02em] text-neutral-900">{item.title}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-7 text-neutral-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we cover */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className={EYEBROW}>Coverage</p>
            <h2 className={`${H2} mt-3`}>{SERVICES_COVERAGE.heading}</h2>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_COVERAGE.categories.map((c) => (
                <div key={c.name} className="rounded-[1.1rem] border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                  <h3 className="font-serif text-[1.25rem] tracking-[-0.02em] text-[var(--color-accent-dark)]">{c.name}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-7 text-neutral-600">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-[#faf5f0] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <p className={EYEBROW}>The process</p>
            <h2 className={`${H2} mt-3`}>How Your Baby Registry Consultation Works, 4 Simple Steps</h2>
            <ol className="mt-9 space-y-4">
              {SERVICES_STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4 rounded-[1.1rem] border border-[#efd9df] bg-white p-6">
                  <span className="font-serif text-[1.6rem] leading-none text-[var(--color-accent-dark)]/45">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-serif text-[1.2rem] leading-tight tracking-[-0.02em] text-neutral-900">{s.title}</h3>
                    <p className="mt-2 text-[0.9rem] leading-7 text-neutral-600">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className={EYEBROW}>Compare</p>
            <h2 className={`${H2} mt-3`}>{SERVICES_COMPARE.heading}</h2>
            <p className="mt-3 max-w-2xl text-sm text-neutral-500">{SERVICES_COMPARE.intro}</p>
            <div className="mt-8 overflow-x-auto rounded-[1.1rem] border border-[#f2d3db]">
              <table className="w-full border-collapse text-left text-[0.82rem]">
                <thead className="bg-[#fdf1f4] text-neutral-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Feature</th>
                    {SERVICES_COMPARE.columns.map((col) => (
                      <th key={col} className="px-3 py-3 text-center font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f6e2e8]">
                  {SERVICES_COMPARE.rows.map((row) => (
                    <tr key={row.feature}>
                      <td className="px-4 py-3 font-medium text-neutral-800">{row.feature}</td>
                      {row.values.map((v, i) => (
                        <td key={i} className="px-3 py-3 text-center">
                          <CompareCell v={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <section className="bg-[#faf5f0] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className={`${H2}`}>{SERVICES_FIT.heading}</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.1rem] border border-emerald-200 bg-white p-6">
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-emerald-600">Yes, book this if</p>
                <ul className="mt-4 space-y-2.5">
                  {SERVICES_FIT.yes.map((y) => (
                    <li key={y} className="flex gap-2.5 text-[0.9rem] leading-6 text-neutral-700">
                      <span className="mt-0.5 shrink-0 text-emerald-600">✓</span>
                      {y}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[1.1rem] border border-neutral-200 bg-white p-6">
                <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-neutral-500">Not the right fit if</p>
                <ul className="mt-4 space-y-2.5">
                  {SERVICES_FIT.no.map((n) => (
                    <li key={n} className="flex gap-2.5 text-[0.9rem] leading-6 text-neutral-500">
                      <span className="mt-0.5 shrink-0 text-neutral-300">✗</span>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials with savings */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className={EYEBROW}>Client stories</p>
            <h2 className={`${H2} mt-3`}>What Families Actually Saved, Beyond the Session</h2>
            <p className="mt-3 max-w-2xl text-sm text-neutral-500">
              The $75 consultation pays for itself when it prevents a single wrong purchase. Here is the real-world math from three verified client sessions.
            </p>
            <div className="mt-9 grid gap-5 lg:grid-cols-3">
              {SERVICES_TESTIMONIALS.map((t) => (
                <figure key={t.author} className="flex flex-col rounded-[1.1rem] border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                  <div className="text-[0.85rem] text-amber-500">★★★★★</div>
                  <p className="mt-3 font-serif text-[1.05rem] leading-snug tracking-[-0.02em] text-neutral-900">{t.headline}</p>
                  <blockquote className="mt-3 flex-1 text-[0.86rem] leading-7 text-neutral-600">“{t.quote}”</blockquote>
                  <p className="mt-4 text-[0.78rem] font-semibold text-[var(--color-accent-dark)]">{t.saving}</p>
                  <figcaption className="mt-2 text-[0.78rem] text-neutral-400">{t.author} · {t.source}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Availability */}
        <section className="bg-[#faf5f0] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <p className={EYEBROW}>Booking</p>
            <h2 className={`${H2} mt-3`}>{SERVICES_AVAILABILITY.heading}</h2>
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-[1.8] text-neutral-600">{SERVICES_AVAILABILITY.body}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {SERVICES_AVAILABILITY.windows.map((w) => (
                <div key={w.label} className="rounded-[0.9rem] border border-[#efd9df] bg-white px-5 py-4">
                  <p className="font-serif text-[1.05rem] text-neutral-900">{w.label}</p>
                  <p className="mt-1 text-[0.82rem] text-neutral-500">{w.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/book" className={CTA_CLASS}>Check Available Times →</Link>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-6">
            <p className={EYEBROW}>Your consultant</p>
            <h2 className={`${H2} mt-3`}>{SERVICES_CREDENTIALS.heading}</h2>
            <p className="mt-4 max-w-3xl text-[0.96rem] leading-[1.85] text-neutral-600">{SERVICES_CREDENTIALS.lead}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SERVICES_CREDENTIALS.items.map((c) => (
                <div key={c.title} className="rounded-[1.1rem] border border-[#f2d3db] bg-[#fdf7f9] p-6">
                  <h3 className="font-serif text-[1.12rem] tracking-[-0.02em] text-neutral-900">★ {c.title}</h3>
                  <p className="mt-2 text-[0.86rem] leading-7 text-neutral-600">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="bg-[linear-gradient(180deg,#fdf1f4,#fbeef2)] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className={`${H2} text-center`}>{SERVICES_PRICING.heading}</h2>
            <div className="mx-auto mt-9 max-w-2xl rounded-[1.4rem] border border-[#e2a9b6] bg-white p-8 text-center shadow-[0_18px_50px_rgba(120,60,80,0.1)]">
              <p className="font-serif text-[3rem] leading-none text-[var(--color-accent-dark)]">$75</p>
              <p className="mt-1 text-[0.8rem] uppercase tracking-[0.18em] text-neutral-500">1-Hour Virtual Consultation</p>
              <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
                {SERVICES_PRICING.included.map((inc) => (
                  <li key={inc} className="flex gap-2.5 text-[0.9rem] leading-6 text-neutral-700">
                    <span className="mt-0.5 shrink-0 text-[var(--color-accent-dark)]">✓</span>
                    {inc}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col items-center gap-3">
                <Link href="/book" className={CTA_CLASS}>Book Your Session Now</Link>
                <p className="text-[0.78rem] text-neutral-400">
                  Questions? <a href={`mailto:${SERVICES_PRICING.contact}`} className="text-[var(--color-accent-dark)]">{SERVICES_PRICING.contact}</a>
                </p>
              </div>
            </div>

            <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
              {SERVICES_ADDONS.map((a) => (
                <div key={a.title} className="rounded-[1.1rem] border border-[#efd9df] bg-white/70 p-6">
                  <h3 className="font-serif text-[1.1rem] tracking-[-0.02em] text-neutral-900">{a.title}</h3>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-dark)]/70">{a.tag}</p>
                  <p className="mt-2 text-[0.85rem] leading-7 text-neutral-600">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead magnet */}
        <section id="free-guide" className="scroll-mt-24 bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2 md:items-center">
            <div>
              <p className={EYEBROW}>Free download</p>
              <h2 className={`${H2} mt-3`}>{SERVICES_LEAD_MAGNET.heading}</h2>
              <p className="mt-4 text-[0.95rem] leading-[1.8] text-neutral-600">{SERVICES_LEAD_MAGNET.body}</p>
              <ul className="mt-5 space-y-2">
                {SERVICES_LEAD_MAGNET.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[0.88rem] leading-6 text-neutral-700">
                    <span className="mt-0.5 shrink-0 text-[var(--color-accent-dark)]">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[1.4rem] border border-[#f2d3db] bg-[#fdf7f9] p-7">
              <NewsletterCapture />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#faf5f0] py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <p className={EYEBROW}>Common questions</p>
            <h2 className={`${H2} mt-3`}>Frequently Asked Questions</h2>
            <div className="mt-8">
              <FAQAccordion items={serviceFaqs} className="bg-white" />
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[linear-gradient(180deg,#fbeef2,#f2d3db)] py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.6rem)] leading-tight tracking-[-0.03em] text-neutral-900">
              {SERVICES_CLOSING.headline}
            </h2>
            <p className="mt-3 font-serif text-[1.1rem] text-[var(--color-accent-dark)]">{SERVICES_CLOSING.categories}</p>
            <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-[1.85] text-neutral-700">{SERVICES_CLOSING.body}</p>
            <p className="mt-5 font-semibold text-neutral-900">{SERVICES_CLOSING.proof}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/book" className={CTA_CLASS}>Book Your Consultation</Link>
              <Link href="#free-guide" className={CTA_GHOST}>Free Stroller Guide</Link>
            </div>
            <p className="mt-4 text-[0.76rem] text-neutral-500">
              $75 · 1 Hour · Virtual · US Nationwide · Full refund 24+ hrs before
            </p>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
