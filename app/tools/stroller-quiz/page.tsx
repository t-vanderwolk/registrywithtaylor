import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import StrollerQuiz from '@/components/tools/StrollerQuiz';
import NewsletterCapture from '@/components/email/NewsletterCapture';
import FAQAccordion, { type FAQEntry } from '@/components/faq/FAQAccordion';
import AnnotationReveal from '@/components/ui/AnnotationReveal';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import CheckIcon from '@/components/ui/CheckIcon';
import { H2, H3, Body } from '@/components/ui/MarketingHeading';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { strollerQuizStructuredData } from '@/lib/marketing/strollerQuizStructuredData';
import {
  QUIZ_HERO,
  QUIZ_INTRO,
  QUIZ_HOW_IT_WORKS,
  QUIZ_RESULT_TYPES,
  QUIZ_CONSULT_CTA,
  QUIZ_CREATOR,
  QUIZ_REVIEWS,
  QUIZ_LEAD_MAGNET,
  QUIZ_FAQ,
  QUIZ_CLOSING,
} from '@/lib/marketing/strollerQuizContent';

export const metadata = buildMarketingMetadata({
  title: 'Best Stroller Quiz for Expecting Parents: Find Your Match | Taylor-Made Baby Co.',
  description:
    'Answer 8 questions and get your personalised stroller recommendation from certified baby gear expert Taylor Vanderwolk. Free, instant results, then book a 1-hour consultation for $75.',
  path: '/tools/stroller-quiz',
  imagePath: '/assets/editorial/strollers.png',
  imageAlt: 'Best Stroller Quiz by Taylor-Made Baby Co.',
  keywords: [
    'best stroller quiz',
    'stroller finder quiz',
    'which stroller is right for me',
    'best stroller for my lifestyle',
    'best stroller for SUV',
    'best stroller for city living',
    'lightweight stroller quiz',
    'stroller buying guide 2026',
  ],
});

const CTA_CLASS =
  'inline-flex items-center justify-center rounded-full bg-[var(--color-cta-pink)] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-cta-pink-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]';
const CTA_GHOST =
  'inline-flex items-center justify-center rounded-full border border-[#e2a9b6] px-7 py-3 text-sm font-semibold text-[var(--color-accent-dark)] transition hover:bg-[#fdf1f4]';

const quizFaqs: FAQEntry[] = QUIZ_FAQ.map((f) => ({ question: f.question, answer: f.answer }));

export default function StrollerQuizPage() {
  return (
    <SiteShell currentPath="/tools/stroller-quiz">
      <main className="site-main">
        <PageViewTracker path="/tools/stroller-quiz" pageType="other" />
        <AnnotationReveal />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(strollerQuizStructuredData) }}
        />

        {/* Hero: breadcrumb + H1 + expert attribution + the quiz tool */}
        <MarketingSection tone="ivory" spacing="spacious" reveal={false}>
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.16em] text-neutral-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li><Link href="/" className="link-underline hover:text-[var(--color-accent-dark)]">Home</Link></li>
                <li aria-hidden className="text-neutral-300">/</li>
                <li><Link href="/tools" className="link-underline hover:text-[var(--color-accent-dark)]">Baby Gear Tools</Link></li>
                <li aria-hidden className="text-neutral-300">/</li>
                <li aria-current="page" className="text-[var(--color-accent-dark)]">Stroller Quiz</li>
              </ol>
            </nav>

            <p className="mkt-eyebrow mt-6">{QUIZ_HERO.eyebrow}</p>
            <h1 className="mt-3 font-serif text-[clamp(2rem,4.4vw,3rem)] leading-[1.05] tracking-[-0.03em] text-neutral-900">
              {QUIZ_HERO.h1}
            </h1>
            <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-neutral-600">{QUIZ_HERO.attribution}</p>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.78rem] font-medium text-[var(--color-accent-dark)]">
              {QUIZ_HERO.freebadges.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="text-[var(--color-accent-dark)]"><CheckIcon /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <RevealOnScroll>
              <H2 className="font-serif">{QUIZ_INTRO.heading}</H2>
            </RevealOnScroll>
            {QUIZ_INTRO.paragraphs.map((p, i) => (
              <RevealOnScroll key={i} delayMs={Math.min(60 + i * 60, 200)}>
                <Body className="mt-3 text-neutral-600">{p}</Body>
              </RevealOnScroll>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <StrollerQuiz />
          </div>
        </MarketingSection>

        {/* How the quiz works, 3 things Taylor checks first */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">{QUIZ_HOW_IT_WORKS.eyebrow}</p>
              <H2 className="mt-3 font-serif">{QUIZ_HOW_IT_WORKS.heading}</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">{QUIZ_HOW_IT_WORKS.intro}</Body>
            </RevealOnScroll>
            <ol className="space-y-4">
              {QUIZ_HOW_IT_WORKS.steps.map((s, i) => (
                <RevealOnScroll key={s.title} delayMs={Math.min(i * 70, 220)}>
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
          </div>
        </MarketingSection>

        {/* Result-type descriptions (SSR, indexable) */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">{QUIZ_RESULT_TYPES.eyebrow}</p>
              <H2 className="mt-3 font-serif">{QUIZ_RESULT_TYPES.heading}</H2>
              <Body className="mt-3 max-w-2xl text-neutral-600">{QUIZ_RESULT_TYPES.intro}</Body>
            </RevealOnScroll>
            <div className="grid gap-4 md:grid-cols-2">
              {QUIZ_RESULT_TYPES.types.map((t, i) => (
                <RevealOnScroll key={t.name} delayMs={Math.min(i * 60, 280)}>
                  <article className="mkt-card flex h-full flex-col rounded-2xl border border-[#f2d3db] bg-[linear-gradient(180deg,#ffffff,#fdf7f9)] p-6">
                    <h3 className="font-serif text-[1.3rem] leading-tight tracking-[-0.02em] text-[var(--color-accent-dark)]">{t.name}</h3>
                    <p className="mt-1 text-[0.72rem] uppercase tracking-[0.14em] text-neutral-400">{t.keyword}</p>
                    <p className="mt-3 text-[0.82rem] font-semibold text-neutral-800">Top brands</p>
                    <p className="text-[0.86rem] leading-6 text-neutral-600">{t.brands}</p>
                    <p className="mt-3 text-[0.86rem] leading-7 text-neutral-600">{t.recommendedFor}</p>
                    <p className="mt-3 border-t border-[rgba(215,161,175,0.28)] pt-3 text-[0.85rem] leading-7 text-neutral-700">
                      <span className="font-semibold text-[var(--color-accent-dark)]">★ Taylor’s note: </span>
                      {t.note}
                    </p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* Post-quiz consultation CTA */}
        <MarketingSection tone="ivoryWarm" spacing="spacious" container="default">
          <div className="mx-auto max-w-4xl">
            <RevealOnScroll>
              <p className="mkt-eyebrow text-center">{QUIZ_CONSULT_CTA.eyebrow}</p>
              <H2 className="mt-3 text-center font-serif">{QUIZ_CONSULT_CTA.heading}</H2>
              <Body className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">{QUIZ_CONSULT_CTA.body}</Body>
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
              <div className="mkt-card mx-auto mt-9 max-w-2xl rounded-[1.4rem] border border-[#e2a9b6] bg-white p-8 shadow-[0_18px_50px_rgba(120,60,80,0.1)]">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[0.8rem] uppercase tracking-[0.18em] text-neutral-500">The quiz covers stroller type. A consultation covers:</p>
                  <p className="shrink-0 font-serif text-[2.4rem] leading-none text-[var(--color-accent-dark)]">$75</p>
                </div>
                <ul className="mt-6 space-y-2">
                  {QUIZ_CONSULT_CTA.covers.map((c) => (
                    <li key={c} className="flex gap-2.5 text-[0.9rem] leading-6 text-neutral-700">
                      <span className="mt-0.5 shrink-0"><CheckIcon /></span>
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col items-center gap-3">
                  <Link href="/book" className={CTA_CLASS}>Book Your 1-Hour Session, $75</Link>
                  <p className="text-[0.76rem] text-neutral-400">Virtual · US Nationwide · Full refund if cancelled 24+ hrs before</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* About the quiz creator (E-E-A-T) */}
        <MarketingSection tone="white" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">{QUIZ_CREATOR.eyebrow}</p>
              <H3 className="mt-3 font-serif">{QUIZ_CREATOR.heading}</H3>
            </RevealOnScroll>
            {QUIZ_CREATOR.bio.map((p, i) => (
              <RevealOnScroll key={i} delayMs={Math.min(60 + i * 50, 200)}>
                <Body className="max-w-3xl text-neutral-600">{p}</Body>
              </RevealOnScroll>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              {QUIZ_CREATOR.credentials.map((c, i) => (
                <RevealOnScroll key={c.title} delayMs={Math.min(i * 70, 240)}>
                  <div className="mkt-card h-full rounded-2xl border border-[#f2d3db] bg-[#fdf7f9] p-6">
                    <h4 className="font-serif text-[1.12rem] tracking-[-0.02em] text-neutral-900">★ {c.title}</h4>
                    <p className="mt-2 text-[0.86rem] leading-7 text-neutral-600">{c.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
            <RevealOnScroll>
              <Link href="/about" className="link-underline text-sm font-semibold text-[var(--color-accent-dark)]">
                Read more about Taylor →
              </Link>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* Stroller-specific reviews */}
        <MarketingSection tone="ivory" spacing="spacious" container="default">
          <div className="mx-auto max-w-5xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">{QUIZ_REVIEWS.eyebrow}</p>
              <H3 className="mt-3 font-serif">{QUIZ_REVIEWS.heading}</H3>
            </RevealOnScroll>
            <div className="grid gap-5 md:grid-cols-2">
              {QUIZ_REVIEWS.reviews.map((r, i) => (
                <RevealOnScroll key={r.author} delayMs={Math.min(i * 90, 200)}>
                  <figure className="mkt-card flex h-full flex-col rounded-2xl border border-[#f2d3db] bg-white p-6">
                    <div className="text-[0.85rem] text-amber-500">{'★'.repeat(r.stars)}</div>
                    <p className="mt-3 font-serif text-[1.05rem] leading-snug tracking-[-0.02em] text-neutral-900">{r.headline}</p>
                    <blockquote className="mt-3 flex-1 text-[0.86rem] leading-7 text-neutral-600">“{r.quote}”</blockquote>
                    <p className="mt-4 text-[0.78rem] font-semibold text-[var(--color-accent-dark)]">{r.outcome}</p>
                    <figcaption className="mt-2 text-[0.78rem] text-neutral-400">{r.author} · {r.source}</figcaption>
                  </figure>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </MarketingSection>

        {/* Lead magnet: stroller buying checklist */}
        <MarketingSection id="free-checklist" tone="white" spacing="spacious" container="default">
          <div className="mx-auto grid max-w-5xl scroll-mt-24 items-start gap-8 md:grid-cols-2">
            <RevealOnScroll>
              <div>
                <p className="mkt-eyebrow">{QUIZ_LEAD_MAGNET.eyebrow}</p>
                <H2 className="mt-3 font-serif">{QUIZ_LEAD_MAGNET.heading}</H2>
                <Body className="mt-4 text-neutral-600">{QUIZ_LEAD_MAGNET.body}</Body>
                <ul className="mt-5 space-y-2">
                  {QUIZ_LEAD_MAGNET.bullets.map((b) => (
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
                <p className="mt-4 text-center text-[0.8rem] text-neutral-500">
                  Want expert help instead?{' '}
                  <Link href="/book" className="link-underline font-semibold text-[var(--color-accent-dark)]">Book a Consultation, $75</Link>
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* FAQ */}
        <MarketingSection tone="ivory" spacing="spacious" container="narrow">
          <div className="mx-auto max-w-2xl space-y-6">
            <RevealOnScroll>
              <p className="mkt-eyebrow">Common questions</p>
              <H2 className="mt-3 font-serif">Stroller Quiz FAQs, Questions Expecting Parents Ask</H2>
            </RevealOnScroll>
            <RevealOnScroll delayMs={80}>
              <FAQAccordion items={quizFaqs} className="bg-white" />
            </RevealOnScroll>
          </div>
        </MarketingSection>

        {/* Closing CTA */}
        <section className="bg-[linear-gradient(180deg,#fbeef2,#f2d3db)] py-20 md:py-24">
          <RevealOnScroll className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-[clamp(1.9rem,3.4vw,2.6rem)] leading-tight tracking-[-0.03em] text-neutral-900">
              {QUIZ_CLOSING.headline}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[0.98rem] leading-[1.85] text-neutral-700">{QUIZ_CLOSING.body}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/book" className={CTA_CLASS}>Book a Baby Registry Consultation, $75</Link>
              <Link href="#free-checklist" className={CTA_GHOST}>Free Stroller Checklist</Link>
            </div>
            <p className="mt-4 text-[0.76rem] text-neutral-500">{QUIZ_CLOSING.meta}</p>
          </RevealOnScroll>
        </section>
      </main>
    </SiteShell>
  );
}
