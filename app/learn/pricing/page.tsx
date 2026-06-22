import Link from 'next/link';
import SiteShell from '@/components/SiteShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Academy Pricing | Taylor-Made Baby Academy',
  description:
    'Start free with preview lessons, or unlock the complete Taylor-Made Baby Academy — registry, nursery, gear, and postpartum — with workbooks, certificates, and downloadable resources.',
  path: '/learn/pricing',
  imagePath: '/assets/editorial/registry.jpg',
  imageAlt: 'Taylor-Made Baby Academy pricing',
  keywords: [
    'baby academy pricing',
    'baby prep course',
    'registry course',
    'nursery planning course',
  ],
});

// ─── Tier data ────────────────────────────────────────────────────────────────

const tiers = [
  {
    id: 'free',
    badge: 'Free',
    name: 'Preview',
    price: '$0',
    period: 'forever',
    description: 'Three complete lessons. No account required. Start immediately.',
    cta: { label: 'Start free lessons', href: '/learn', variant: 'secondary' as const },
    features: [
      'The Art of the Registry (full lesson)',
      'Nursery Foundations (full lesson)',
      'The Stroller Equation (full lesson)',
      'Mini workbook per lesson',
      'Key takeaways',
    ],
    highlight: false,
  },
  {
    id: 'academy',
    badge: 'Most Popular',
    name: 'Academy',
    price: '$97',
    period: 'one-time or $14.99/mo',
    description:
      'Every module across all four paths. Workbooks, certificates, and downloadable resources included.',
    cta: {
      label: 'Join the Waitlist',
      href: '/learn/waitlist',
      variant: 'primary' as const,
    },
    features: [
      'All 29 Academy modules across 4 paths',
      'Registry, Nursery, Gear, Postpartum',
      'Workbook with save & resume for every module',
      'Path completion certificates (shareable)',
      'TMBC Fully Prepared certification',
      'Downloadable checklists and timelines',
      'Stroller & car seat compatibility tool',
    ],
    highlight: true,
  },
  {
    id: 'academy-annual',
    badge: 'Annual',
    name: 'Academy — Annual',
    price: '$329',
    period: 'per year',
    description:
      'Everything in the Academy plan, billed yearly with a full year of content updates included.',
    cta: {
      label: 'Join the Waitlist',
      href: '/learn/waitlist',
      variant: 'secondary' as const,
    },
    features: [
      'Everything in the Academy plan',
      'All 29 modules across 4 paths',
      'A full year of content updates included',
      'Billed once per year',
    ],
    highlight: false,
  },
  {
    id: 'academy-concierge',
    badge: 'Academy + Support',
    name: 'Academy Concierge',
    price: '$49',
    period: 'per month',
    description:
      'Full Academy access plus ongoing, lightweight guidance. This is an Academy tier — separate from the Private Concierge consulting service ($1,997/mo).',
    cta: {
      label: 'Join the Waitlist',
      href: '/learn/waitlist',
      variant: 'secondary' as const,
    },
    features: [
      'All 29 Academy modules across 4 paths',
      'Everything in the Academy plan',
      'Ongoing Academy guidance',
      'Distinct from Private Concierge (1:1 consulting)',
    ],
    highlight: false,
  },
] as const;

const faqs = [
  {
    q: 'Can I try before I pay?',
    a: 'Yes. Three full lessons are free with no account required — The Art of the Registry, Nursery Foundations, and The Stroller Equation. Each includes a mini workbook and key takeaways.',
  },
  {
    q: 'What is the difference between the one-time, monthly, and annual plans?',
    a: 'Every paid plan unlocks the full Academy — all 29 modules, workbooks, certificates, and downloads. The one-time payment gives you lifetime access to today\'s content plus a year of updates. The monthly plan is the lowest upfront commitment and bills for as long as you stay subscribed. The annual plan bills once per year and includes a full year of content updates.',
  },
  {
    q: 'What is a path certificate?',
    a: 'When you complete all modules in a path (registry, nursery, gear, or postpartum), you receive a digital certificate you can save and share. The TMBC Fully Prepared certificate is issued when all four paths are done.',
  },
  {
    q: 'What is the Academy Concierge tier?',
    a: 'It is an Academy subscription ($49/mo) that adds ongoing, lightweight guidance on top of full Academy access. It is not the same as the Private Concierge — that is Taylor\'s one-on-one consulting service, which starts at $1,997/mo. Academy Concierge is self-guided learning with extra support; Private Concierge is hands-on advisory.',
  },
  {
    q: 'Is there a 1:1 option with Taylor?',
    a: 'Yes. One-on-one work with Taylor is the Private Concierge consulting service — separate from the Academy, and distinct from the Academy Concierge tier above — starting at $1,997/mo. Use the consultation form to apply.',
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LearnPricingPage() {
  return (
    <SiteShell currentPath="/learn/pricing">
      <main className="site-main min-h-0" style={{ backgroundColor: '#faf9f6' }}>

        {/* ─── Header ─────────────────────────────────────────────────── */}
        <section className="border-b border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fffdfb_0%,#fdf8f5_100%)] px-5 py-14 text-center sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]">
              Taylor-Made Baby Academy
            </p>
            <h1 className="mt-4 font-serif text-[2.4rem] leading-[0.96] tracking-[-0.05em] text-neutral-900 sm:text-[3.2rem]">
              Prepare for baby with clarity.
            </h1>
            <p className="mx-auto mt-5 max-w-[42ch] text-[1.05rem] leading-[1.8] text-neutral-600 sm:text-[1.12rem]">
              Start free. Unlock the full Academy when you&apos;re ready. No overwhelm, no upsell
              spiral — just the clearest path through registry, nursery, gear, and postpartum.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/learn" className="btn btn--secondary">
                Start free lessons
              </Link>
              <a href="#tiers" className="btn btn--primary">
                See pricing
              </a>
            </div>
          </div>
        </section>

        {/* ─── Tier grid ──────────────────────────────────────────────── */}
        <section id="tiers" className="px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-6 sm:grid-cols-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={[
                    'relative flex flex-col overflow-hidden rounded-[1.75rem] border p-7 sm:p-8',
                    tier.highlight
                      ? 'border-[rgba(215,161,175,0.4)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(253,247,244,0.97)_100%)] shadow-[0_28px_72px_rgba(72,49,56,0.1)]'
                      : 'border-[rgba(215,161,175,0.2)] bg-white shadow-[0_12px_34px_rgba(72,49,56,0.06)]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {/* Badge */}
                  <div className="mb-5 flex items-start justify-between">
                    <span
                      className={[
                        'inline-flex items-center rounded-full px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em]',
                        tier.highlight
                          ? 'bg-[var(--color-accent-dark)] text-white'
                          : 'bg-[rgba(232,154,174,0.12)] text-[var(--color-accent-dark)]',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  {/* Name + price */}
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/72">
                    {tier.name}
                  </p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-serif text-[2.4rem] leading-none tracking-[-0.04em] text-neutral-900">
                      {tier.price}
                    </span>
                    <span className="text-[0.82rem] text-neutral-400">{tier.period}</span>
                  </div>

                  <p className="mt-4 flex-1 text-[0.95rem] leading-[1.75] text-neutral-600">
                    {tier.description}
                  </p>

                  {/* Features */}
                  <ul className="mt-6 space-y-2.5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-[0.9rem] text-neutral-700">
                        <span
                          aria-hidden="true"
                          className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-8">
                    <Link
                      href={tier.cta.href}
                      className={[
                        'block w-full rounded-full py-3.5 text-center text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-all duration-200',
                        tier.cta.variant === 'primary'
                          ? 'bg-[var(--color-cta-pink)] text-white shadow-[0_8px_20px_rgba(216,137,160,0.28)] hover:bg-[var(--color-cta-pink-hover)]'
                          : 'border border-[rgba(215,161,175,0.3)] bg-white text-[var(--color-accent-dark)] hover:bg-[rgba(232,154,174,0.06)]',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {tier.cta.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-center text-[0.8rem] text-neutral-400">
              Prices shown in USD. Full Academy access is included with all TMBC service packages —{' '}
              <Link href="/services" className="underline underline-offset-2 hover:text-neutral-600">
                see services
              </Link>
              . 1:1 consultation sessions available separately —{' '}
              <Link href="/book" className="underline underline-offset-2 hover:text-neutral-600">
                book a consultation
              </Link>
              .
            </p>
          </div>
        </section>

        {/* ─── FAQ ────────────────────────────────────────────────────── */}
        <section className="border-t border-[rgba(0,0,0,0.05)] px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-[1.9rem] leading-tight tracking-[-0.04em] text-neutral-900 sm:text-[2.3rem]">
              Common questions
            </h2>
            <div className="mt-8 space-y-8">
              {faqs.map((faq) => (
                <div key={faq.q} className="border-b border-[rgba(0,0,0,0.06)] pb-8">
                  <p className="font-medium text-neutral-900">{faq.q}</p>
                  <p className="mt-3 text-[0.97rem] leading-[1.8] text-neutral-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ──────────────────────────────────────────────── */}
        <section className="bg-[linear-gradient(180deg,rgba(253,244,247,0.6)_0%,rgba(255,248,245,0.8)_100%)] px-5 py-16 text-center sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="font-handwritten-print text-[1.4rem] text-[var(--color-accent-dark)]/70">
              start where you are
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-tight tracking-[-0.04em] text-neutral-900 sm:text-[2.5rem]">
              The free lessons are the best first move.
            </h2>
            <p className="mx-auto mt-4 max-w-[38ch] text-[1rem] leading-[1.8] text-neutral-600">
              No account required. No credit card. Just three complete lessons with real takeaways
              and a workbook to anchor the thinking.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/learn/art-of-the-registry" className="btn btn--primary">
                Start Lesson 1 — Free
              </Link>
              <Link href="/learn" className="btn btn--secondary">
                See all lessons
              </Link>
            </div>
          </div>
        </section>

      </main>
    </SiteShell>
  );
}
