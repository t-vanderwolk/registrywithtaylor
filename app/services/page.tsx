import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import Hero from '@/components/ui/Hero';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import { H2, H3, Body } from '@/components/ui/MarketingHeading';
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
  'inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-cta-pink-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';
const CTA_GHOST =
  'inline-flex items-center justify-center rounded-full border border-[#e2a9b6] px-7 py-3 text-sm font-semibold text-[var(--color-accent-dark)] transition hover:bg-[#fdf1f4]';

function CompareCell({ v }: { v: 'yes' | 'no' | 'partial' | 'varies' }) {
  if (v === 'yes') return <span className="font-semibold text-[var(--color-accent-dark)]" aria-label="yes">✓</span>;
  if (v === 'no') return <span className="text-neutral-300" aria-label="no">✗</span>;
  return <span className="text-[0.7rem] font-medium uppercase tracking-wide text-neutral-500">{v}</span>;
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
          title="Your Baby Registry Consultation, One Focused Hour"
          subtitle="Taylor-Made Baby Co. helps expecting parents make confident baby gear decisions in a single virtual session at $75, covering strollers, car seats, nursery, feeding gear, and registry strategy, personalised to your real home and budget."
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
        <MarketingSection tone="ivory" spacing="tight" container="default">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 text-center">
            {SERVICES_HERO_STATS.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-[2rem] leading-none text-[var(--color-accent-dark)] sm:text-[2.4rem]">{s.value}</div>
                <div className="mt-1.5 text-[0.72rem] uppercase tracking-[0.16em] text-neutral-500">{s.label}</div>
              </div>
            ))}
          </div>
        </MarketingSection>

        {/* Pain hook + six decisions */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-2xl space-y-5 text-center">
            <RevealOnScroll>
              <p className="font-serif text-[1.5rem] leading-snug tracking-[-0.02em] text-neutral-900">{SERVICES_PAIN_HOOK.lead}</p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={60}>
              <p className="text-[1rem] leading-[1.85] text-neutral-600">{SERVICES_PAIN_HOOK.body}</p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120}>
              <p className="text-[1.05rem] font-semibold text-[var(--color-accent-dark)]">{SERVICES_PAIN_HOOK.close}</p>
            </RevealOnScroll>
          </div>

          <div className="mx-auto mt-14 max-w-5xl">
            <RevealOnScroll>
              <H2 className="text-center font-serif">What Gets Decided in Your 1-Hour Session</H2>
            </RevealOnScroll>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-500">
              This is not a general overview call. It is a working session. These are the decisions that get made.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_DECISIONS.map((d, i) => (
                <RevealOnScroll key={d.title} delayMs={Math.min(i * 70, 280)}>
                  <div className="mkt-card h-full rounded-2xl border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                    <span className="font-serif text-[1.35rem] text-[var(--color-accent-dark)]/50">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-2 font-serif text-[1.2rem] leading-tight tracking-[-0.02em] text-neutral-900">{d.title}</h3>
                    <p className="mt-2.5 text-[0.88rem] leading-7 text-neutral-600">{d.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
            <p className="mt-9 text-center text-sm text-neutral-500">
              Six decisions. One hour. $75.{' '}
              <Link href="/book" className="link-underline font-semibold text-[var(--color-accent-dark)]">Book your session</Link>
            </p>
          </div>
        </MarketingSection>

        {/* Why this exists */}
        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-5">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Why it matters</p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={60}>
              <H2 className="font-serif">{SERVICES_WHY.heading}</H2>
            </RevealOnScroll>
            {SERVICES_WHY.paragraphs.map((p, i) => (
              <RevealOnScroll key={i} delayMs={Math.min(120 + i * 50, 300)}>
                <Body className={i === SERVICES_WHY.paragraphs.length - 1 ? 'font-medium text-neutral-900' : 'text-neutral-700'}>{p}</Body>
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* ROI table */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">The math</p>
              <H2 className="mt-3 font-serif">{SERVICES_ROI.heading}</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">{SERVICES_ROI.intro}</Body>
            </RevealOnScroll>
            <RevealOnScroll delayMs={90}>
              <div className="overflow-hidden rounded-2xl border border-[#f2d3db]">
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
                      <tr key={r.mistake} className="align-top transition-colors hover:bg-[#fdf9fb]">
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
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* What's included */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">What you get</p>
              <H2 className="mt-3 font-serif">{SERVICES_INCLUDES.heading}</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">{SERVICES_INCLUDES.intro}</Body>
            </RevealOnScroll>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_INCLUDES.items.map((item, i) => (
                <RevealOnScroll key={item.title} delayMs={Math.min(i * 60, 280)}>
                  <div className="mkt-card h-full rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <h3 className="font-serif text-[1.15rem] leading-tight tracking-[-0.02em] text-neutral-900">{item.title}</h3>
                    <p className="mt-2.5 text-[0.88rem] leading-7 text-neutral-600">{item.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* What we cover */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Coverage</p>
              <H2 className="mt-3 font-serif">{SERVICES_COVERAGE.heading}</H2>
            </RevealOnScroll>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES_COVERAGE.categories.map((c, i) => (
                <RevealOnScroll key={c.name} delayMs={Math.min(i * 60, 280)}>
                  <div className="mkt-card h-full rounded-2xl border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                    <h3 className="font-serif text-[1.25rem] tracking-[-0.02em] text-[var(--color-accent-dark)]">{c.name}</h3>
                    <p className="mt-2.5 text-[0.88rem] leading-7 text-neutral-600">{c.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* How it works */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">The process</p>
              <H2 className="mt-3 font-serif">How Your Baby Registry Consultation Works, 4 Simple Steps</H2>
            </RevealOnScroll>
            <ol className="space-y-4">
              {SERVICES_STEPS.map((s, i) => (
                <RevealOnScroll key={s.title} delayMs={Math.min(i * 70, 280)}>
                  <li className="mkt-card flex gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                    <span className="font-serif text-[1.7rem] leading-none text-[var(--color-accent-dark)]/45">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-serif text-[1.2rem] leading-tight tracking-[-0.02em] text-neutral-900">{s.title}</h3>
                      <p className="mt-2 text-[0.9rem] leading-7 text-neutral-600">{s.body}</p>
                    </div>
                  </li>
                </RevealOnScroll>
              ))}
            </ol>
            <div className="text-center">
              <Link href="/book" className={CTA_CLASS}>Book Your 1-Hour Consultation, $75</Link>
            </div>
          </div>
        </MarketingSection>

        {/* Comparison */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Compare</p>
              <H2 className="mt-3 font-serif">{SERVICES_COMPARE.heading}</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">{SERVICES_COMPARE.intro}</Body>
            </RevealOnScroll>
            <RevealOnScroll delayMs={90}>
              <div className="overflow-x-auto rounded-2xl border border-[#f2d3db]">
                <table className="w-full min-w-[680px] border-collapse text-left text-[0.82rem]">
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
                      <tr key={row.feature} className="transition-colors hover:bg-[#fdf9fb]">
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
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* Who this is for */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-8">
            <RevealOnScroll>
              <H2 className="font-serif">{SERVICES_FIT.heading}</H2>
            </RevealOnScroll>
            <div className="grid gap-5 md:grid-cols-2">
              <RevealOnScroll>
                <div className="mkt-card h-full rounded-2xl border border-emerald-200 bg-white p-6">
                  <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-emerald-600">Yes, book this if</p>
                  <ul className="mt-4 space-y-2.5">
                    {SERVICES_FIT.yes.map((y) => (
                      <li key={y} className="flex gap-2.5 text-[0.9rem] leading-6 text-neutral-700">
                        <span className="mt-0.5 shrink-0"><CheckIcon /></span>
                        {y}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
              <RevealOnScroll delayMs={90}>
                <div className="mkt-card h-full rounded-2xl border border-neutral-200 bg-white p-6">
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
              </RevealOnScroll>
            </div>
          </div>
        </MarketingSection>

        {/* Testimonials with savings */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Client stories</p>
              <H2 className="mt-3 font-serif">What Families Actually Saved, Beyond the Session</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">
                The $75 consultation pays for itself when it prevents a single wrong purchase. Here is the real-world math from three verified client sessions.
              </Body>
            </RevealOnScroll>
            <div className="grid gap-5 lg:grid-cols-3">
              {SERVICES_TESTIMONIALS.map((t, i) => (
                <RevealOnScroll key={t.author} delayMs={Math.min(i * 90, 260)}>
                  <figure className="mkt-card flex h-full flex-col rounded-2xl border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                    <div className="text-[0.85rem] text-amber-500">★★★★★</div>
                    <p className="mt-3 font-serif text-[1.05rem] leading-snug tracking-[-0.02em] text-neutral-900">{t.headline}</p>
                    <blockquote className="mt-3 flex-1 text-[0.86rem] leading-7 text-neutral-600">“{t.quote}”</blockquote>
                    <p className="mt-4 text-[0.78rem] font-semibold text-[var(--color-accent-dark)]">{t.saving}</p>
                    <figcaption className="mt-2 text-[0.78rem] text-neutral-400">{t.author} · {t.source}</figcaption>
                  </figure>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* Availability */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Booking</p>
              <H2 className="mt-3 font-serif">{SERVICES_AVAILABILITY.heading}</H2>
              <Body className="mt-4 max-w-2xl text-neutral-600">{SERVICES_AVAILABILITY.body}</Body>
            </RevealOnScroll>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES_AVAILABILITY.windows.map((w, i) => (
                <RevealOnScroll key={w.label} delayMs={Math.min(i * 60, 240)}>
                  <div className="mkt-card rounded-xl border border-black/5 bg-white px-5 py-4 shadow-sm">
                    <p className="font-serif text-[1.05rem] text-neutral-900">{w.label}</p>
                    <p className="mt-1 text-[0.82rem] text-neutral-500">{w.note}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
            <div>
              <Link href="/book" className={CTA_CLASS}>Check Available Times →</Link>
            </div>
          </div>
        </MarketingSection>

        {/* Credentials */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Your consultant</p>
              <H2 className="mt-3 font-serif">{SERVICES_CREDENTIALS.heading}</H2>
              <Body className="mt-4 max-w-3xl text-neutral-600">{SERVICES_CREDENTIALS.lead}</Body>
            </RevealOnScroll>
            <div className="grid gap-4 sm:grid-cols-2">
              {SERVICES_CREDENTIALS.items.map((c, i) => (
                <RevealOnScroll key={c.title} delayMs={Math.min(i * 70, 240)}>
                  <div className="mkt-card h-full rounded-2xl border border-[#f2d3db] bg-[#fdf7f9] p-6">
                    <h3 className="font-serif text-[1.12rem] tracking-[-0.02em] text-neutral-900">★ {c.title}</h3>
                    <p className="mt-2 text-[0.86rem] leading-7 text-neutral-600">{c.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* Pricing CTA */}
        <MarketingSection tone="ivoryWarm" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl">
            <RevealOnScroll>
              <H2 className="text-center font-serif">{SERVICES_PRICING.heading}</H2>
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
              <div className="mkt-card mx-auto mt-9 max-w-2xl rounded-[1.4rem] border border-[#e2a9b6] bg-white p-8 text-center shadow-[0_18px_50px_rgba(120,60,80,0.1)]">
                <p className="font-serif text-[3rem] leading-none text-[var(--color-accent-dark)]">$75</p>
                <p className="mt-1 text-[0.8rem] uppercase tracking-[0.18em] text-neutral-500">1-Hour Virtual Consultation</p>
                <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
                  {SERVICES_PRICING.included.map((inc) => (
                    <li key={inc} className="flex gap-2.5 text-[0.9rem] leading-6 text-neutral-700">
                      <span className="mt-0.5 shrink-0"><CheckIcon /></span>
                      {inc}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <Link href="/book" className={CTA_CLASS}>Book Your Session Now</Link>
                  <p className="text-[0.78rem] text-neutral-400">
                    Questions? <a href={`mailto:${SERVICES_PRICING.contact}`} className="link-underline text-[var(--color-accent-dark)]">{SERVICES_PRICING.contact}</a>
                  </p>
                </div>
              </div>
            </RevealOnScroll>

            <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
              {SERVICES_ADDONS.map((a, i) => (
                <RevealOnScroll key={a.title} delayMs={Math.min(i * 80, 160)}>
                  <div className="mkt-card h-full rounded-2xl border border-black/5 bg-white/80 p-6">
                    <h3 className="font-serif text-[1.1rem] tracking-[-0.02em] text-neutral-900">{a.title}</h3>
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent-dark)]/70">{a.tag}</p>
                    <p className="mt-2 text-[0.85rem] leading-7 text-neutral-600">{a.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* Lead magnet */}
        <MarketingSection id="free-guide" tone="white" spacing="spacious" container="default">
          <div className="mx-auto grid max-w-5xl scroll-mt-24 items-start gap-8 md:grid-cols-2">
            <RevealOnScroll>
              <div>
                <p className="mkt-eyebrow">Free download</p>
                <H2 className="mt-3 font-serif">{SERVICES_LEAD_MAGNET.heading}</H2>
                <Body className="mt-4 text-neutral-600">{SERVICES_LEAD_MAGNET.body}</Body>
                <ul className="mt-5 space-y-2">
                  {SERVICES_LEAD_MAGNET.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[0.88rem] leading-6 text-neutral-700">
                      <span className="mt-0.5 shrink-0"><CheckIcon /></span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <div className="rounded-2xl border border-[#f2d3db] bg-[#fdf7f9] p-7">
                <NewsletterCapture />
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* FAQ */}
        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Common questions</p>
              <H2 className="mt-3 font-serif">Frequently Asked Questions</H2>
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
              <FAQAccordion items={serviceFaqs} className="bg-white" />
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* Closing CTA */}
        <section className="bg-[linear-gradient(180deg,#fbeef2,#f2d3db)] py-20 md:py-24">
          <RevealOnScroll className="mx-auto max-w-3xl px-6 text-center">
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
            <p className="mt-4 text-[0.76rem] text-neutral-500">$75 · 1 Hour · Virtual · US Nationwide · Full refund 24+ hrs before</p>
          </RevealOnScroll>
        </section>
      </main>
    </SiteShell>
  );
}
