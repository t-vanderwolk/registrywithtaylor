import Image from 'next/image';
import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import FinalCTA from '@/components/layout/FinalCTA';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import { Body, H2, H3 } from '@/components/ui/MarketingHeading';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { aboutStructuredData } from '@/lib/marketing/aboutStructuredData';
import PodcastFeature from '@/components/marketing/PodcastFeature';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import {
  ABOUT_AVAILABILITY,
  ABOUT_BEFORE_AFTER,
  ABOUT_BIO,
  ABOUT_COMPARE,
  ABOUT_CREDENTIALS,
  ABOUT_FAQ,
  ABOUT_GEAR,
  ABOUT_LEAD_MAGNET,
  ABOUT_ORIGIN,
  ABOUT_PAIN_HOOK,
  ABOUT_QUOTABLE,
  ABOUT_REVIEWS,
  ABOUT_STATS,
  ABOUT_STEPS,
  ABOUT_VALUE_STACK,
} from '@/lib/marketing/aboutContent';

const ABOUT_PAGE_PARTNERS: { name: string; logo: string; href?: string }[] = [
  { name: 'Silver Cross', logo: '/assets/logos/silver-cross-logo-1.webp', href: 'https://www.silvercrossus.com' },
  { name: 'mima', logo: '/affiliate-logos/mima.png', href: 'https://www.mimakids.com' },
  { name: 'Babylist', logo: '/assets/logos/babylist.png', href: 'https://www.babylist.com' },
  { name: 'macrobaby', logo: '/assets/logos/macrobaby-logo.webp', href: 'https://www.macrobaby.com' },
  { name: 'Momcozy', logo: '/assets/logos/momcozy.png', href: 'https://www.momcozy.com' },
  { name: 'Baby Brezza', logo: '/assets/logos/babybrezzalogo.png', href: 'https://www.babybrezza.com' },
  { name: 'BabyQuip', logo: '/assets/logos/babyquip.png', href: 'https://www.babyquip.com' },
  { name: 'dadada Baby', logo: '/assets/logos/dadadadalogo.png', href: 'https://dadadababy.com' },
  { name: 'Ergobaby', logo: '/assets/logos/ergobabylogo.png', href: 'https://www.ergobaby.com' },
  { name: 'Happiest Baby', logo: '/assets/logos/happiestbaby-logo.png', href: 'https://www.happiestbaby.com' },
  { name: 'Jool Baby', logo: '/assets/logos/joolbabylogo.png', href: 'https://joolbaby.com' },
  { name: 'Kyte Baby', logo: '/assets/logos/kytebaby-logo.png', href: 'https://kytebaby.com' },
  { name: 'Munchkin', logo: '/assets/logos/munchkin.png', href: 'https://www.munchkin.com' },
  { name: 'Nanit', logo: '/assets/logos/nanit.png', href: 'https://www.nanit.com' },
  { name: 'Veer', logo: '/affiliate-logos/veer.png', href: 'https://www.veercycle.com' },
];

const CTA_CLASS =
  'inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-cta-pink-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';

function CompareCell({ value }: { value: 'yes' | 'no' | 'partial' | 'varies' }) {
  if (value === 'yes') return <span className="font-semibold text-[var(--color-accent-dark)]">✓</span>;
  if (value === 'no') return <span className="text-neutral-300">✗</span>;
  return <span className="text-xs uppercase tracking-wide text-neutral-500">{value === 'partial' ? 'Partial' : 'Varies'}</span>;
}

export const metadata = buildMarketingMetadata({
  title: 'About Taylor Vanderwolk, Baby Registry Consultant | Taylor-Made Baby Co.',
  description:
    'Meet Taylor Vanderwolk, certified baby registry consultant and Tot Squad specialist with 7+ years of baby gear expertise. Book your $75 registry consult.',
  path: '/about',
  imagePath: '/assets/hero/hero-05.jpg',
  imageAlt: 'Taylor Vanderwolk baby registry consultant workspace',
  keywords: [
    'baby registry consultant',
    'Taylor Vanderwolk',
    'baby gear expert',
    'baby registry help',
    'Tot Squad certified specialist',
    'Target Baby Concierge',
    'stroller consultant',
  ],
});

export default function AboutPage() {
  return (
    <SiteShell currentPath="/about">
      <main className="site-main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutStructuredData) }}
        />

        <Hero
          className="homepage-hero"
          eyebrow="Meet Taylor"
          title="Meet Taylor Vanderwolk, Baby Registry Consultant & Certified Baby Gear Expert"
          subtitle="I help expecting parents build confident baby registries and make the right stroller, car seat, nursery, and gear decisions, without the overwhelm, the algorithm noise, or the sponsored advice."
          primaryCta={{ label: 'Book a Registry Consultation ($75)', href: '/book' }}
          image="/assets/hero/hero-05.jpg"
          imageAlt="Taylor Vanderwolk baby registry consultant workspace"
          contentClassName="homepage-hero-content"
          staggerContent
        />

        {/* Pain-point hook */}
        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-5">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">{ABOUT_PAIN_HOOK.heading}</H2>
            </RevealOnScroll>
            {ABOUT_PAIN_HOOK.paragraphs.map((p, i) => (
              <RevealOnScroll key={i} delayMs={i * 60}>
                <Body className="text-neutral-700">{p}</Body>
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* Before / After */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-8">
            <RevealOnScroll>
              <H3 className="text-center font-serif text-neutral-900">{ABOUT_BEFORE_AFTER.title}</H3>
            </RevealOnScroll>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="mkt-card rounded-2xl border border-black/5 bg-neutral-50 p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Before working with Taylor</p>
                <ul className="space-y-3 text-neutral-700">
                  {ABOUT_BEFORE_AFTER.before.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mkt-card rounded-2xl border border-[#f2d3db] bg-[#fdf1f4] p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">After working with Taylor</p>
                <ul className="space-y-3 text-neutral-800">
                  {ABOUT_BEFORE_AFTER.after.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/book" className={CTA_CLASS}>Book a Consultation ($75)</a>
              <a href="#free-guide" className="inline-flex items-center justify-center rounded-full border border-[#e2a9b6] px-7 py-3 text-sm font-semibold text-[var(--color-accent-dark)] transition hover:bg-[#fdf1f4]">Get the Free Guide</a>
            </div>
          </div>
        </MarketingSection>

        {/* Bio */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-3xl space-y-8">
            <RevealOnScroll>
              <div className="flex justify-center">
                <Image
                  src="/assets/taylor.jpeg"
                  alt="Taylor Vanderwolk, Baby Registry Consultant and Certified Baby Gear Expert"
                  width={280}
                  height={340}
                  className="rounded-2xl object-cover shadow-md"
                  priority
                />
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">Taylor Vanderwolk, Your Baby Registry Consultant</H2>
            </RevealOnScroll>
            <RevealOnScroll delayMs={60}>
              <Body className="text-lg font-medium text-neutral-900">{ABOUT_QUOTABLE}</Body>
            </RevealOnScroll>
            <RevealOnScroll delayMs={120}>
              <div className="space-y-6 text-left">
                {ABOUT_BIO.map((p, i) => (
                  <Body key={i} className="text-neutral-700">{p}</Body>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* Origin story */}
        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-6">
            <RevealOnScroll>
              <H3 className="font-serif text-neutral-900">{ABOUT_ORIGIN.heading}</H3>
            </RevealOnScroll>
            {ABOUT_ORIGIN.paragraphs.map((p, i) => (
              <RevealOnScroll key={i} delayMs={Math.min(i * 40, 160)}>
                <Body className="text-neutral-700">{p}</Body>
              </RevealOnScroll>
            ))}
          </div>
        </MarketingSection>

        {/* Social-proof stats bar */}
        <MarketingSection tone="ivory" spacing="default" container="default">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {ABOUT_STATS.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-3xl text-[var(--color-accent-dark)]">{s.value}</div>
                <div className="mt-1 text-sm text-neutral-600">{s.label}</div>
              </div>
            ))}
          </div>
        </MarketingSection>

        {/* Credentials */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-8">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">Experience &amp; Credentials</H2>
            </RevealOnScroll>
            <div className="grid gap-5 md:grid-cols-2">
              {ABOUT_CREDENTIALS.map((c) => (
                <div key={c.name} className="mkt-card rounded-2xl border border-black/5 bg-neutral-50 p-6">
                  <h3 className="font-serif text-lg text-neutral-900">{c.name}</h3>
                  <p className="mt-2 text-neutral-700">{c.body}</p>
                  {c.link ? (
                    <a
                      href={c.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm font-semibold text-[var(--color-accent-dark)]"
                    >
                      Visit {c.link.label} →
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* How it works */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-8">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">What Happens When You Book a Consultation With Taylor</H2>
            </RevealOnScroll>
            <div className="grid gap-6 md:grid-cols-2">
              {ABOUT_STEPS.map((s) => (
                <div key={s.n} className="mkt-card rounded-2xl bg-white p-6 shadow-sm">
                  <div className="font-serif text-2xl text-[var(--color-accent-dark)]">{s.n}</div>
                  <h3 className="mt-1 font-serif text-lg text-neutral-900">{s.title}</h3>
                  <p className="mt-2 text-neutral-700">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a href="/book" className={CTA_CLASS}>Book Your 1-Hour Consultation ($75)</a>
              <p className="mt-2 text-sm text-neutral-500">Full refund if cancelled 24 hours before your session.</p>
            </div>
          </div>
        </MarketingSection>

        {/* What Taylor helps you choose */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-8">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">What Taylor Helps You Choose</H2>
            </RevealOnScroll>
            <Body className="text-neutral-700">Every consultation is scoped to your needs. Most families cover some or all of the following decisions.</Body>
            <div className="grid gap-4 md:grid-cols-2">
              {ABOUT_GEAR.map((g) => (
                <div key={g.title} className="mkt-card rounded-2xl border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                  <h3 className="font-serif text-lg text-[var(--color-accent-dark)]">{g.title}</h3>
                  <p className="mt-1.5 text-neutral-700">{g.body}</p>
                </div>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* The Taylor-Made Approach */}
        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-8">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">The Taylor-Made Approach to Baby Registry &amp; Gear Decisions</H2>
            </RevealOnScroll>
            <RevealOnScroll delayMs={90}>
              <div className="space-y-1 pt-1">
                <H3 className="font-serif text-neutral-900">Real life over registry noise.</H3>
                <H3 className="font-serif text-neutral-900">Fit over features.</H3>
                <H3 className="font-serif text-neutral-900">Buy with purpose, not pressure.</H3>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={170}>
              <div className="space-y-6">
                <Body className="text-neutral-700">
                  Today’s baby market offers hundreds of stroller options, dozens of car seat brands, and an endless stream of registry recommendations. Most of them conflict with each other, and many are driven by sponsorship rather than genuine advice.
                </Body>
                <Body className="text-neutral-700">
                  The Taylor-Made approach is built on real-life fit. We slow the process down. We look at how you actually live, your home layout, your daily routines, your vehicle, your long-term family plans, and the budget that actually makes sense for your life.
                </Body>
                <Body className="text-neutral-700">Then we figure out what to buy, what to skip, and what can wait.</Body>
                <Body className="text-neutral-700">No panic buying. No trend chasing. No just-in-case overload. Just practical, independent guidance that makes sense for your real life, not for the algorithm.</Body>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* What makes this different */}
        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-7">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">What Makes Taylor-Made Baby Co. Different: Independent, Unsponsored Baby Gear Advice</H2>
            </RevealOnScroll>
            <RevealOnScroll delayMs={90}>
              <div className="space-y-6">
                <H3 className="text-neutral-900">Most baby guidance starts with products. This starts with how you actually live.</H3>
                <Body className="text-neutral-700">
                  Your home. Your routines. Your comfort with risk, spending, and space. Your vehicle. Your partner’s priorities. The width of your elevator if you live in an apartment. The size of your car’s trunk.
                </Body>
                <Body className="text-neutral-700">This is not a template registry. It is not a sales floor disguised as advice. It is not an affiliate blog dressed up as expertise.</Body>
                <Body className="text-neutral-700">
                  Taylor-Made Baby Co. is structured, one-on-one baby registry consulting from a specialist with 7+ years of real retail and hands-on family experience, who receives zero commission from any brand she recommends.
                </Body>
                <Body className="text-neutral-700">Because when baby prep fits your real life, the next season feels a whole lot steadier.</Body>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* Value stack */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-3xl space-y-6">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">What You Get for $75</H2>
            </RevealOnScroll>
            <Body className="text-neutral-700">{ABOUT_VALUE_STACK.intro}</Body>
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white">
              {ABOUT_VALUE_STACK.rows.map((r) => (
                <div key={r.item} className="flex items-center justify-between gap-4 border-b border-black/5 px-5 py-3">
                  <span className="text-neutral-700">{r.item}</span>
                  <span className="whitespace-nowrap text-sm text-neutral-500">{r.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 bg-[#fbeef2] px-5 py-4 font-semibold text-neutral-900">
                <span>{ABOUT_VALUE_STACK.totalLabel}</span>
                <span className="whitespace-nowrap">
                  <span className="text-neutral-400 line-through">{ABOUT_VALUE_STACK.totalValue}</span> → {ABOUT_VALUE_STACK.price}
                </span>
              </div>
            </div>
            <div className="text-center">
              <a href="/book" className={CTA_CLASS}>Book Your Registry Consultation ($75)</a>
            </div>
          </div>
        </MarketingSection>

        {/* Taylor vs alternatives */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-6">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">Why Not Just Use YouTube, Reddit, or a Parenting App?</H2>
            </RevealOnScroll>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="p-3 text-left font-semibold text-neutral-900">Feature</th>
                    {ABOUT_COMPARE.columns.map((c) => (
                      <th key={c} className="p-3 text-center font-semibold text-neutral-700">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ABOUT_COMPARE.rows.map((r) => (
                    <tr key={r.feature} className="border-b border-black/5">
                      <td className="p-3 text-left text-neutral-700">{r.feature}</td>
                      {r.values.map((v, i) => (
                        <td key={i} className="p-3 text-center">
                          <CompareCell value={v} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MarketingSection>

        {/* Reviews */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-8">
            <RevealOnScroll>
              <H3 className="text-center font-serif text-neutral-900">What Expecting Parents Say About Taylor-Made Baby Co.</H3>
            </RevealOnScroll>
            <div className="grid gap-6 md:grid-cols-3">
              {ABOUT_REVIEWS.map((r) => (
                <figure key={r.author} className="mkt-card rounded-2xl bg-white p-6 shadow-sm">
                  <div className="text-[var(--color-accent-dark)]" aria-hidden>★★★★★</div>
                  <blockquote className="mt-3 text-neutral-700">“{r.quote}”</blockquote>
                  <figcaption className="mt-3 text-sm font-semibold text-neutral-900">
                    {r.author}
                    <span className="block font-normal text-neutral-500">{r.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="text-center">
              <a href="https://www.strolleria.com" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[var(--color-accent-dark)]">
                See all reviews on Strolleria →
              </a>
            </div>
          </div>
        </MarketingSection>

        {/* Availability */}
        <MarketingSection tone="white" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-6">
            <RevealOnScroll>
              <H3 className="font-serif text-neutral-900">{ABOUT_AVAILABILITY.heading}</H3>
            </RevealOnScroll>
            {ABOUT_AVAILABILITY.body.map((p, i) => (
              <Body key={i} className="text-neutral-700">{p}</Body>
            ))}
            <ul className="space-y-2 text-neutral-700">
              {ABOUT_AVAILABILITY.timing.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckIcon />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <a href="/book" className={CTA_CLASS}>Book Your Registry Consultation</a>
              <p className="mt-2 text-sm text-neutral-500">$75 · 1 hour · virtual · US nationwide · full refund if cancelled 24 hours before.</p>
            </div>
          </div>
        </MarketingSection>

        <PodcastFeature
          heading="Baby Registry Consultant Taylor Vanderwolk on the BabyQuip Podcast"
          description="Taylor joins the BabyQuip Tiny Travels Podcast to talk through what actually matters when preparing for a baby as a baby registry consultant, how to stop letting the gear pile-up steal the joy from early parenthood, and why real-life fit beats product specs every time."
        />

        {/* Partner logos */}
        <MarketingSection tone="white" container="wide" spacing="default" reveal={false}>
          <div className="mx-auto max-w-6xl space-y-10 text-center">
            <RevealOnScroll>
              <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Trusted retail and brand partners.</p>
            </RevealOnScroll>
            <RevealOnScroll delayMs={100}>
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-5 sm:gap-8">
                {ABOUT_PAGE_PARTNERS.map((partner) => {
                  const inner = (
                    <div className="flex h-16 items-center justify-center px-2 sm:h-20">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={160}
                        height={56}
                        className="h-8 w-auto max-w-full object-contain opacity-75 transition duration-200 group-hover:opacity-100 sm:h-10 md:h-12"
                        loading="lazy"
                      />
                    </div>
                  );
                  if (!partner.href) {
                    return (
                      <div key={partner.name} className="flex items-center justify-center">
                        {inner}
                      </div>
                    );
                  }
                  return (
                    <a
                      key={partner.name}
                      href={partner.href}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="group flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                      aria-label={`Visit ${partner.name}`}
                    >
                      {inner}
                    </a>
                  );
                })}
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* FAQ */}
        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-6">
            <RevealOnScroll>
              <H2 className="font-serif text-neutral-900">Frequently Asked Questions</H2>
            </RevealOnScroll>
            <div className="space-y-3">
              {ABOUT_FAQ.map((f) => (
                <details key={f.question} className="mkt-card group rounded-2xl border border-black/5 bg-white p-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-serif text-lg text-neutral-900">
                    <span>{f.question}</span>
                    <span className="mt-1 shrink-0 text-[var(--color-accent-dark)] transition group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 text-neutral-700">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* Lead magnet */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div id="free-guide" className="mx-auto grid max-w-4xl scroll-mt-24 items-start gap-8 md:grid-cols-2">
            <div>
              <H2 className="font-serif text-neutral-900">{ABOUT_LEAD_MAGNET.title}</H2>
              <Body className="mt-3 text-neutral-700">{ABOUT_LEAD_MAGNET.intro}</Body>
              <ul className="mt-5 space-y-3 text-neutral-700">
                {ABOUT_LEAD_MAGNET.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <CheckIcon />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mkt-card rounded-2xl border border-black/5 bg-neutral-50 p-6">
              <NewsletterCapture />
            </div>
          </div>
        </MarketingSection>

        <FinalCTA />
      </main>
    </SiteShell>
  );
}
