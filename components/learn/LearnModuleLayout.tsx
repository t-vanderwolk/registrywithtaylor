import Image from 'next/image';
import type { ReactNode } from 'react';

import KeyTakeaways from '@/components/learn/KeyTakeaways';
import LessonCTA from '@/components/learn/LessonCTA';
import LessonDivider from '@/components/learn/LessonDivider';
import LessonHeader from '@/components/learn/LessonHeader';
import LessonImage from '@/components/learn/LessonImage';
import LessonNavStrip from '@/components/learn/LessonNavStrip';
import LessonSection from '@/components/learn/LessonSection';
// LessonVideoPlaceholder removed — no video placeholders in the UI
import MiniWorkbook from '@/components/learn/MiniWorkbook';
import TaylorsNote from '@/components/learn/TaylorsNote';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import { getAcademyPathData } from '@/lib/academy/content';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyLearningResourceStructuredData,
} from '@/lib/academy/seo';
import type {
  AcademyBreadcrumbItem,
  AcademyCoreSection,
  AcademyModuleData,
  AcademyProductExample,
  AcademyRelatedLink,
  AcademySubmoduleSection,
} from '@/lib/academy/content';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LearnModuleData = {
  /**
   * Module slug. Typed as string (not the narrower AcademyModuleSlug union)
   * so submodule builders whose slugs aren't in the union type
   * (stroller lanes, car seat categories, etc.) can pass through without casting.
   */
  slug: string;
  pathSlug: AcademyModuleData['pathSlug'];
  href: string;
  title: string;
  description: string;
  subhead: string;
  intro: string[];
  imagePath: string;
  imageAlt: string;
  progress: { current: number; total: number };
  coreSections: AcademyCoreSection[];
  decisionTitle: string;
  decisionBullets: string[];
  products: AcademyProductExample[];
  softCtaLabel: string;
  softCtaTitle: string;
  softCtaBody: string[];
  previous: AcademyRelatedLink | null;
  next: AcademyRelatedLink | null;
  related: AcademyRelatedLink | null;
  submoduleSection: AcademySubmoduleSection | null;
  breadcrumb: AcademyBreadcrumbItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Rough reading time: ~3 min per section + 5 min base. */
function estimateReadingTime(coreSections: AcademyCoreSection[]): number {
  return Math.max(8, coreSections.length * 3 + 5);
}

/**
 * Convert decisionBullets into workbook reflection prompts.
 * Capped at 3 so the workbook stays focused.
 */
function buildWorkbookPrompts(bullets: string[], moduleSlug: string) {
  return bullets.slice(0, 3).map((bullet, index) => ({
    id: `${moduleSlug}-prompt-${index}`,
    label: bullet.endsWith('?') ? bullet : `${bullet} — how does this apply to your situation?`,
    placeholder:
      'Take a moment to think through this before moving to the next module...',
  }));
}

/**
 * Derive Taylor's Note content.
 * Uses softCtaBody if populated, otherwise falls back to the module intro.
 */
function deriveTaylorsNote(module: LearnModuleData): string[] {
  const body = module.softCtaBody.filter(Boolean);
  if (body.length > 0) return body;

  // Fall back to intro paragraphs (max 2)
  return module.intro.slice(0, 2);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PathBadge({ pathSlug }: { pathSlug: string }) {
  const labels: Record<string, string> = {
    registry: 'Registry Path',
    nursery: 'Nursery Path',
    gear: 'Gear Path',
    postpartum: 'Postpartum Path',
  };
  return labels[pathSlug] ?? `${capitalize(pathSlug)} Path`;
}

function SubmoduleGrid({ section }: { section: AcademySubmoduleSection }) {
  return (
    <div className="space-y-7">
      {/* Section header */}
      <div className="rounded-[1.25rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,248,250,0.9)_0%,rgba(255,255,255,0.97)_100%)] px-6 py-6 sm:px-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/72">
          Keep Building
        </p>
        <h2 className="mt-2 font-serif text-[1.35rem] leading-tight tracking-[-0.03em] text-neutral-900 sm:text-[1.55rem]">
          {section.title}
        </h2>
        <p className="mt-2.5 text-[0.95rem] leading-[1.75] text-neutral-500">
          {section.description}
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.cards.map((card, i) => (
          <a
            key={card.href}
            href={card.href}
            className="group relative flex flex-col gap-3.5 overflow-hidden rounded-[1.25rem] border border-[rgba(215,161,175,0.22)] bg-white p-5 shadow-[0_8px_24px_rgba(72,49,56,0.05)] transition-all duration-250 hover:-translate-y-1 hover:border-[rgba(215,161,175,0.4)] hover:shadow-[0_20px_48px_rgba(72,49,56,0.1)]"
          >
            {/* Card accent strip */}
            <div
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 rounded-t-[1.25rem] bg-[linear-gradient(90deg,var(--color-accent)_0%,rgba(215,161,175,0.4)_100%)] transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden
            />

            {/* Step badge */}
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(232,154,174,0.3)] bg-[rgba(232,154,174,0.1)] font-sans text-[0.7rem] font-bold text-[var(--color-accent-dark)]"
            >
              {i + 1}
            </span>

            {card.eyebrow && (
              <p className="text-[0.63rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/65">
                {card.eyebrow}
              </p>
            )}

            <h3 className="font-serif text-[1.12rem] leading-tight tracking-[-0.025em] text-neutral-900 transition-colors group-hover:text-[var(--color-accent-dark)]">
              {card.title}
            </h3>

            <p className="flex-1 text-[0.88rem] leading-relaxed text-neutral-500">
              {card.description}
            </p>

            <div className="flex items-center gap-1 text-[0.76rem] font-semibold text-[var(--color-accent-dark)]">
              <span>{card.ctaLabel}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProductSection({ products }: { products: AcademyProductExample[] }) {
  const renderableProducts = products.filter((p) => p.name.trim().length > 0);
  if (renderableProducts.length === 0) return null;

  return (
    <div className="space-y-6">
      <LessonSection eyebrow="Product Examples" title="Real examples to pressure-test">
        <p>
          These are here to keep the decision connected to real life. They are examples, not an
          invitation to turn this module into a shopping spiral.
        </p>
      </LessonSection>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {renderableProducts.slice(0, 3).map((product, index) => (
          <div
            key={`${product.brand}-${product.name}-${index}`}
            className="flex flex-col gap-3 rounded-[1.25rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(253,247,244,0.94)_100%)] p-5 shadow-[0_8px_24px_rgba(72,49,56,0.04)]"
          >
            {product.imageSrc && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-[0.9rem] bg-[rgba(253,245,247,0.8)]">
                <Image
                  src={product.imageSrc}
                  alt={product.imageAlt ?? product.name}
                  fill
                  className="object-contain p-2"
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 320px, 100vw"
                />
              </div>
            )}
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/72">
                {product.brand || product.category}
              </p>
              <p className="mt-1 font-medium text-neutral-900">{product.name}</p>
            </div>
            <p className="flex-1 text-[0.88rem] leading-relaxed text-neutral-600">
              {product.description}
            </p>
            {product.affiliateUrl && (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-[rgba(215,161,175,0.3)] bg-white px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-neutral-700 transition-all duration-200 hover:border-[rgba(215,161,175,0.5)] hover:text-[var(--color-accent-dark)]"
              >
                View product
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default async function LearnModuleLayout({ module }: { module: LearnModuleData }) {
  // Fetch path data for nav strip
  const pathData = await getAcademyPathData(module.pathSlug);

  // Build lesson nav list — normalise /academy/* hrefs to /learn/*
  const lessonNavLessons = pathData.moduleCards.map((card, index) => ({
    number: index + 1,
    title: card.title,
    href: (card.href as string).replace(/^\/academy\//, '/learn/'),
  }));

  const currentIndex = pathData.moduleCards.findIndex((c) => c.slug === module.slug);
  const currentLessonNumber = currentIndex >= 0 ? currentIndex + 1 : module.progress.current;

  // Reading time
  const estimatedMinutes = estimateReadingTime(module.coreSections);

  // Taylor's note content
  const taylorsNoteContent = deriveTaylorsNote(module);

  // Workbook prompts derived from decision bullets
  const workbookPrompts = buildWorkbookPrompts(module.decisionBullets, module.slug);

  // Next lesson for CTA — normalise any /academy/* hrefs to /learn/*
  const toLearnHref = (href: string) => href.replace(/^\/academy\//, '/learn/');

  const nextCard = (() => {
    const raw =
      module.next ??
      (pathData.moduleCards[currentIndex + 1]
        ? {
            href: pathData.moduleCards[currentIndex + 1].href,
            title: pathData.moduleCards[currentIndex + 1].title,
            description: pathData.moduleCards[currentIndex + 1].description,
            ctaLabel: 'Next module →',
          }
        : null);
    return raw ? { ...raw, href: toLearnHref(raw.href) } : null;
  })();

  // Path label
  const pathLabel = PathBadge({ pathSlug: module.pathSlug });

  // Structured data
  const structuredData = [
    buildAcademyBreadcrumbStructuredData({
      breadcrumbs: module.breadcrumb,
      currentPath: module.href,
    }),
    buildAcademyLearningResourceStructuredData({
      title: module.title,
      description: module.description,
      path: module.href,
      breadcrumbs: module.breadcrumb,
      keywords: [module.title, pathLabel, module.subhead],
      teaches: [
        ...module.decisionBullets,
        ...module.coreSections.map((s) => s.title),
      ],
      hasPart:
        module.submoduleSection?.cards.map((c) => ({
          href: c.href,
          title: c.title,
          description: c.description,
        })) ?? [],
      learningResourceType: 'TMBC Academy Module',
    }),
  ];

  return (
    <section style={{ backgroundColor: '#faf9f6' }}>
      <AcademyStructuredData data={structuredData} />

      {/* ─── Lesson header ─────────────────────────────────────────────── */}
      <LessonHeader
        breadcrumbs={module.breadcrumb.map((b) => ({
          label: b.label,
          href: b.href ?? null,
        }))}
        title={module.title}
        subhead={module.subhead}
        description={module.description}
        lessonLabel={pathLabel}
        estimatedMinutes={estimatedMinutes}
        progressLabel={`Module ${module.progress.current} of ${module.progress.total}`}
      />

      {/* ─── Lesson nav strip ──────────────────────────────────────────── */}
      <LessonNavStrip
        current={currentLessonNumber}
        total={pathData.moduleCards.length}
        lessons={lessonNavLessons}
      />

      {/* ─── Main lesson body ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="space-y-14">

          {/* 1. Overview */}
          <LessonSection eyebrow="Overview" title={module.subhead}>
            {module.intro.map((paragraph, index) => (
              <p key={`intro-${index}`}>{paragraph}</p>
            ))}
            {module.imagePath && (
              <LessonImage
                src={module.imagePath}
                alt={module.imageAlt}
                priority
                aspectRatio="4/3"
              />
            )}
          </LessonSection>

          {/* 2. What you'll learn */}
          {module.decisionBullets.length > 0 && (
            <div className="rounded-[1.45rem] border border-[rgba(232,154,174,0.22)] bg-[linear-gradient(135deg,rgba(255,248,250,0.95)_0%,rgba(255,255,255,0.98)_100%)] px-6 py-7 shadow-[0_8px_24px_rgba(72,49,56,0.06)] sm:px-8">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(232,154,174,0.18)]"
                >
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3" aria-hidden>
                    <path d="M2 6.5l2.5 2.5 5.5-5.5" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/72">
                  What you&apos;ll learn
                </p>
              </div>
              <h2 className="mt-3 font-serif text-[1.2rem] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[1.35rem]">
                {module.decisionTitle}
              </h2>
              <ul className="mt-5 space-y-3">
                {module.decisionBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
                    />
                    <span className="text-[0.95rem] leading-[1.7] text-neutral-600">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <LessonDivider />

          {/* 3. Core lesson sections */}
          {module.coreSections.length > 0 && (
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <div
                  className="h-px flex-1 rounded-full"
                  style={{ background: 'linear-gradient(90deg, rgba(215,161,175,0.35) 0%, transparent 100%)' }}
                  aria-hidden
                />
                <p className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/65">
                  Core Lesson
                </p>
                <div
                  className="h-px flex-1 rounded-full"
                  style={{ background: 'linear-gradient(270deg, rgba(215,161,175,0.35) 0%, transparent 100%)' }}
                  aria-hidden
                />
              </div>

              {module.coreSections.map((section, index) => (
                <div
                  key={`section-${index}`}
                  className="relative rounded-[1.35rem] border border-[rgba(215,161,175,0.14)] bg-white/70 px-6 py-7 shadow-[0_6px_20px_rgba(72,49,56,0.04)] backdrop-blur-sm sm:px-8 sm:py-8"
                >
                  {/* Left accent stripe */}
                  <div
                    className="absolute left-0 top-8 h-10 w-0.5 rounded-r-full bg-[var(--color-accent)]"
                    aria-hidden
                  />
                  <LessonSection
                    stepNumber={index + 1}
                    title={section.title}
                  >
                    {section.imageSrc && (
                      <LessonImage
                        src={section.imageSrc}
                        alt={section.imageAlt}
                        caption={section.imageCaption}
                      />
                    )}
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p key={`section-${index}-p-${pIndex}`}>{paragraph}</p>
                    ))}
                  </LessonSection>
                </div>
              ))}
            </div>
          )}

          <LessonDivider />

          {/* 4. Taylor's Note */}
          {taylorsNoteContent.length > 0 && (
            <TaylorsNote>
              {taylorsNoteContent.map((paragraph, index) => (
                <p key={`note-${index}`}>{paragraph}</p>
              ))}
            </TaylorsNote>
          )}

          {/* 5. Mini Workbook */}
          {workbookPrompts.length > 0 && (
            <MiniWorkbook
              subtitle="Before moving on, reflect on these questions:"
              prompts={workbookPrompts}
              pathSlug={module.pathSlug}
              moduleSlug={module.slug}
            />
          )}

          {/* 6. Key Takeaways */}
          {module.decisionBullets.length > 0 && (
            <KeyTakeaways items={module.decisionBullets} />
          )}

          {/* 7. Product examples (optional) */}
          <ProductSection products={module.products} />

          {/* 8. Submodule grid (for hub modules) */}
          {module.submoduleSection && (
            <SubmoduleGrid section={module.submoduleSection} />
          )}

          {/* 9. Lesson CTA */}
          <LessonCTA
            heading={
              nextCard
                ? 'Ready to keep going?'
                : `You've finished the ${capitalize(module.pathSlug)} path.`
            }
            body={
              nextCard
                ? `The full Taylor-Made Baby Academy walks you step by step through every decision in this path and beyond.`
                : `All modules in this path are complete. The full Academy has three more paths — Registry, Nursery, Gear, and Postpartum.`
            }
            primaryLabel={nextCard ? `Next: ${nextCard.title}` : 'Return to Academy'}
            primaryHref={nextCard?.href ?? '/learn'}
            secondaryLabel="Book a Consultation"
            secondaryHref="/consultation"
          />

          {/* 10. Related / cross-path link (if exists and different from next) */}
          {module.related && toLearnHref(module.related.href) !== (nextCard?.href ?? '') && (
            <div className="rounded-[1.25rem] border border-[rgba(215,161,175,0.18)] bg-white/80 px-6 py-5 shadow-[0_8px_20px_rgba(72,49,56,0.04)]">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/72">
                Also connected
              </p>
              <a
                href={toLearnHref(module.related.href)}
                className="group mt-3 flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-serif text-[1.1rem] leading-tight tracking-[-0.02em] text-neutral-900">
                    {module.related.title}
                  </p>
                  <p className="mt-1.5 text-[0.88rem] leading-relaxed text-neutral-600">
                    {module.related.description}
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-sm font-semibold text-[var(--color-accent-dark)] transition-transform duration-200 group-hover:translate-x-0.5">
                  {module.related.ctaLabel}
                </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
