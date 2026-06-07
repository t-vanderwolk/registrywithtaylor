import Image from 'next/image';

import KeyTakeaways from '@/components/learn/KeyTakeaways';
import LessonCTA from '@/components/learn/LessonCTA';
import LessonDivider from '@/components/learn/LessonDivider';
import LessonHeader from '@/components/learn/LessonHeader';
import LessonImage from '@/components/learn/LessonImage';
import LessonNavStrip from '@/components/learn/LessonNavStrip';
import LessonSection from '@/components/learn/LessonSection';
import TaylorsNote from '@/components/learn/TaylorsNote';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import { getAcademyPathData } from '@/lib/academy/content';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyCollectionStructuredData,
} from '@/lib/academy/seo';
import type { AcademyModuleSlug, AcademyPathSlug } from '@/lib/academy/content';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LearnHubCard = {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
};

export type LearnHubLayoutProps = {
  pathSlug: AcademyPathSlug;
  moduleSlug: AcademyModuleSlug;
  /** Breadcrumb trail. Last item has no href (current page). */
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  deck: string;
  intro: string[];
  heroImageSrc: string;
  heroImageAlt: string;
  progress: { current: number; total: number };
  /** Short bullets shown in KeyTakeaways */
  learningHighlights: string[];
  /** Paragraphs shown in the "how we think about this" section */
  philosophy: string[];
  taylorNoteTitle: string;
  taylorNoteBody: string;
  submodulesTitle: string;
  submodulesDescription: string;
  submoduleCards: LearnHubCard[];
  /** CTA into the first submodule */
  primaryCta: { href: string; label: string };
  /** Links to adjacent path modules (prev / next) */
  nextLinks: LearnHubCard[];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Normalise any /academy/* hrefs to their /learn/* canonical equivalents. */
function toLearnHref(href: string) {
  return href.replace(/^\/academy\//, '/learn/');
}

function SubmoduleGrid({ cards }: { cards: LearnHubCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <a
          key={card.href}
          href={toLearnHref(card.href)}
          className="group flex flex-col gap-3 rounded-[1.25rem] border border-[rgba(215,161,175,0.22)] bg-white p-5 shadow-[0_8px_24px_rgba(72,49,56,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(72,49,56,0.09)]"
        >
          {card.eyebrow && (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/72">
              {card.eyebrow}
            </p>
          )}
          <h3 className="font-serif text-[1.15rem] leading-tight tracking-[-0.025em] text-neutral-900">
            {card.title}
          </h3>
          <p className="flex-1 text-[0.9rem] leading-relaxed text-neutral-600">
            {card.description}
          </p>
          <span className="text-[0.78rem] font-semibold text-[var(--color-accent-dark)] transition-transform duration-200 group-hover:translate-x-0.5">
            {card.ctaLabel}
          </span>
        </a>
      ))}
    </div>
  );
}

function NextLinksBar({ links }: { links: LearnHubCard[] }) {
  if (links.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="group flex flex-col gap-3 rounded-[1.25rem] border border-[rgba(215,161,175,0.18)] bg-white/80 p-5 shadow-[0_6px_18px_rgba(72,49,56,0.04)] transition-all duration-200 hover:shadow-[0_12px_32px_rgba(72,49,56,0.07)]"
        >
          {link.eyebrow && (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/65">
              {link.eyebrow}
            </p>
          )}
          <p className="font-serif text-[1.1rem] leading-tight tracking-[-0.02em] text-neutral-900">
            {link.title}
          </p>
          <p className="flex-1 text-[0.88rem] leading-relaxed text-neutral-600">
            {link.description}
          </p>
          <span className="text-[0.78rem] font-semibold text-[var(--color-accent-dark)] transition-transform duration-200 group-hover:translate-x-0.5">
            {link.ctaLabel}
          </span>
        </a>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default async function LearnHubLayout({
  pathSlug,
  moduleSlug,
  breadcrumbs,
  title,
  deck,
  intro,
  heroImageSrc,
  heroImageAlt,
  progress,
  learningHighlights,
  philosophy,
  taylorNoteTitle,
  taylorNoteBody,
  submodulesTitle,
  submodulesDescription,
  submoduleCards,
  primaryCta,
  nextLinks,
}: LearnHubLayoutProps) {
  // Fetch path data for LessonNavStrip
  const pathData = await getAcademyPathData(pathSlug);

  const lessonNavLessons = pathData.moduleCards.map((card, index) => ({
    number: index + 1,
    title: card.title,
    href: toLearnHref(card.href as string),
  }));

  const currentIndex = pathData.moduleCards.findIndex((c) => c.slug === moduleSlug);
  const currentLessonNumber = currentIndex >= 0 ? currentIndex + 1 : progress.current;

  const pathLabel = `${pathSlug.charAt(0).toUpperCase()}${pathSlug.slice(1)} Path`;

  // Structured data
  const canonicalPath = breadcrumbs[breadcrumbs.length - 1]?.href ?? `/${pathSlug}/${moduleSlug}`;
  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs: breadcrumbs.map((b) => ({ label: b.label, href: b.href })),
      currentPath: canonicalPath,
    }),
    buildAcademyCollectionStructuredData({
      title,
      description: deck,
      path: canonicalPath,
      breadcrumbs: breadcrumbs.map((b) => ({ label: b.label, href: b.href })),
      items: submoduleCards.map((c) => ({
        href: toLearnHref(c.href),
        title: c.title,
        description: c.description,
      })),
      keywords: [title, pathLabel, ...learningHighlights.slice(0, 3)],
    }),
  ];

  return (
    <section style={{ backgroundColor: '#faf9f6' }}>
      <AcademyStructuredData data={structuredData} />

      {/* ─── Lesson header ─────────────────────────────────────────────── */}
      <LessonHeader
        breadcrumbs={breadcrumbs.map((b) => ({ label: b.label, href: b.href ?? null }))}
        title={title}
        lessonLabel={pathLabel}
        estimatedMinutes={Math.max(10, submoduleCards.length * 4 + 5)}
        progressLabel={`Module ${progress.current} of ${progress.total}`}
      />

      {/* ─── Lesson nav strip ──────────────────────────────────────────── */}
      <LessonNavStrip
        current={currentLessonNumber}
        total={pathData.moduleCards.length}
        lessons={lessonNavLessons}
      />

      {/* ─── Body ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="space-y-14">

          {/* 1. Overview */}
          <LessonSection eyebrow="Overview" title={deck}>
            {intro.map((paragraph, i) => (
              <p key={`intro-${i}`}>{paragraph}</p>
            ))}
            <LessonImage src={heroImageSrc} alt={heroImageAlt} priority aspectRatio="4/3" />
          </LessonSection>

          <LessonDivider />

          {/* 2. Philosophy / how we think about this */}
          {philosophy.length > 0 && (
            <LessonSection eyebrow="The TMBC Approach" title="How we think about this decision">
              {philosophy.map((paragraph, i) => (
                <p key={`philosophy-${i}`}>{paragraph}</p>
              ))}
            </LessonSection>
          )}

          {/* 3. What you'll learn */}
          <KeyTakeaways items={learningHighlights} />

          <LessonDivider />

          {/* 4. Submodule grid */}
          <div className="space-y-6">
            <LessonSection eyebrow="Choose Your Lane" title={submodulesTitle}>
              <p>{submodulesDescription}</p>
            </LessonSection>
            <SubmoduleGrid cards={submoduleCards} />
          </div>

          <LessonDivider />

          {/* 5. Taylor's Note */}
          <TaylorsNote>
            <p className="font-medium text-neutral-800">{taylorNoteTitle}</p>
            <p>{taylorNoteBody}</p>
          </TaylorsNote>

          {/* 6. Navigation to adjacent modules */}
          {nextLinks.length > 0 && (
            <div className="space-y-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/72">
                Keep Moving
              </p>
              <NextLinksBar
                links={nextLinks.map((l) => ({ ...l, href: toLearnHref(l.href) }))}
              />
            </div>
          )}

          {/* 7. CTA */}
          <LessonCTA
            heading="Ready to go deeper?"
            body="The full Taylor-Made Baby Academy walks you through every decision in this category and connects it to the rest of your baby prep."
            primaryLabel={primaryCta.label}
            primaryHref={toLearnHref(primaryCta.href)}
            secondaryLabel="Back to Academy"
            secondaryHref="/learn"
          />
        </div>
      </div>
    </section>
  );
}
