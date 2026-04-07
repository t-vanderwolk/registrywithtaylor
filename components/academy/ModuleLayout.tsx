import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import DecisionRouter from '@/components/academy/DecisionRouter';
import DecisionTag from '@/components/academy/DecisionTag';
import ProductInsightCard from '@/components/academy/ProductInsightCard';
import BlogDivider from '@/components/blog/BlogDivider';
import CategoryTag from '@/components/blog/CategoryTag';
import ConnectedContentSection from '@/components/content/ConnectedContentSection';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { hasResolvedGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';
import { slugify } from '@/lib/slugify';
import {
  getAcademyPhaseLabel,
  getConnectedAcademyPaths,
  getModuleDecisionStatement,
  getModuleWhyThisExists,
  getProductInsights,
  getQuickCheckLines,
  getQuickCheckTags,
} from '@/lib/academy/decisionSupport';
import {
  buildAcademyBreadcrumbStructuredData,
  buildAcademyLearningResourceStructuredData,
} from '@/lib/academy/seo';
import { renderTextWithInternalLinks } from '@/lib/internal-links/render';
import { buildAcademyInternalLinkPlan } from '@/lib/internal-links/system';
import type {
  AcademyBreadcrumbItem,
  AcademyCoreSection,
  AcademyModuleData,
  AcademyProductExample,
  AcademyRelatedLink,
  AcademySubmoduleSection,
} from '@/lib/academy/content';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

export type ModuleLayoutData = {
  slug: string;
  pathSlug: AcademyModuleData['pathSlug'];
  moduleType?: AcademyModuleData['moduleType'];
  enableDecisionRouting?: AcademyModuleData['enableDecisionRouting'];
  href: string;
  title: string;
  description: string;
  subhead: string;
  intro: string[];
  imagePath: string;
  imageAlt: string;
  progress: {
    current: number;
    total: number;
  };
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
  editorialLinks: AcademyRelatedLink[];
  submoduleSection: AcademySubmoduleSection | null;
  breadcrumb: AcademyBreadcrumbItem[];
  trackingGuideId?: string | null;
};

type ModuleLayoutProps = {
  module: ModuleLayoutData;
};

function Breadcrumbs({ items }: { items: AcademyBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
      <ol className="flex min-w-0 flex-wrap items-center gap-2 text-[0.68rem] tracking-[0.18em] sm:text-[0.72rem] sm:tracking-[0.22em]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex min-w-0 flex-wrap items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-[rgba(161,91,114,0.35)]">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="max-w-full break-words transition duration-200 hover:text-[#8F4C62]">
                {item.label}
              </Link>
            ) : (
              <span className="max-w-full break-words text-[#8F4C62]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function renderLinkedParagraphs(
  paragraphs: string[],
  suggestions: ReturnType<typeof buildAcademyInternalLinkPlan>['contextualLinks'],
  keyPrefix: string,
  maxLinksPerParagraph = 1,
) : ReactNode[] {
  const usedHrefs = new Set<string>();

  return paragraphs.map((paragraph, index) => (
    <p
      key={`${keyPrefix}-${index}`}
      className="break-words"
    >
      {renderTextWithInternalLinks({
        text: paragraph,
        suggestions,
        usedHrefs,
        keyPrefix: `${keyPrefix}-${index}`,
        maxLinks: maxLinksPerParagraph,
        className: 'link-underline transition-colors duration-200 hover:text-neutral-900',
        placement: 'academy',
      })}
    </p>
  ));
}

function NextStepCard({
  href,
  title,
  description,
  ctaLabel,
  eyebrow = 'Module Link',
}: {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
}) {
  return (
    <Link
      href={href}
      className="group tmbc-blog-soft-card flex h-full min-w-0 flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-[rgba(232,154,174,0.34)] hover:shadow-[0_24px_54px_rgba(70,53,58,0.08)] sm:p-6"
    >
      <p className="w-fit">
        <span className="tmbc-tag">{eyebrow}</span>
      </p>
      <h3 className="mt-5 break-words font-serif text-[clamp(1.45rem,2vw,1.9rem)] leading-[1.12] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
        {title}
      </h3>
      <p className="mt-4 break-words text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)]">{description}</p>
      <span className="mt-auto pt-6 text-sm uppercase tracking-[0.16em] text-[var(--tmbc-blog-rose)] transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  note,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  note?: string;
}) {
  return (
    <div className="max-w-3xl min-w-0">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">{eyebrow}</p>
      <h2 className="mt-4 break-words font-serif text-[clamp(2.1rem,4vw,2.9rem)] leading-[1.1] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
        {title}
      </h2>
      <div className="mt-4 h-1 w-[78px] rounded-full bg-[linear-gradient(90deg,rgba(232,154,174,0.9)_0%,rgba(215,161,175,1)_100%)] shadow-[0_10px_24px_rgba(232,154,174,0.18)]" />
      {description ? (
        <p className="mt-5 break-words text-[1.05rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.08rem]">
          {description}
        </p>
      ) : null}
      {note ? <p className="academy-handwritten-aside mt-4">{note}</p> : null}
    </div>
  );
}

function buildDecisionChecklistSections(module: ModuleLayoutData) {
  if (module.decisionBullets.length === 0) {
    return [];
  }

  const midpoint = module.decisionBullets.length > 3 ? Math.ceil(module.decisionBullets.length / 2) : module.decisionBullets.length;
  const primary = module.decisionBullets.slice(0, midpoint).map((bullet) => ({
    label: bullet,
    status: 'check' as const,
  }));
  const secondary = module.decisionBullets.slice(midpoint).map((bullet, index, collection) => ({
    label: bullet,
    status: index === collection.length - 1 ? ('ask' as const) : ('watch' as const),
  }));

  return [
    {
      title: 'Do First',
      description: 'These are the moves that keep the rest of the module calmer and more useful.',
      items: primary,
    },
    ...(secondary.length > 0
      ? [
          {
            title: 'Keep In View',
            description: 'Use these as the edit pass before the list, shortlist, or purchase gets bigger.',
            items: secondary,
          },
        ]
      : []),
  ];
}

function buildDecisionBarDescription(module: ModuleLayoutData) {
  if (module.next && module.related) {
    return 'Use the next module to keep the sequence moving, and the related one when this decision starts touching another path.';
  }

  if (module.next) {
    return 'Keep the sequence moving while the context is still fresh.';
  }

  if (module.related) {
    return 'This is a good place to connect this decision to the next path it affects.';
  }

  return 'If you want help turning this into a cleaner plan, this is the right point to get a second opinion.';
}

function getModuleHandwrittenNote(module: ModuleLayoutData) {
  switch (module.pathSlug) {
    case 'registry':
      return {
        title: 'A calmer registry is usually a shorter registry.',
        description: 'The point is not to impress anyone. The point is to make the list feel useful when the boxes actually arrive.',
      };
    case 'nursery':
      return {
        title: 'Pretty is welcome. Functional at 2:14 AM is better.',
        description: 'If the room works when you are tired, you made the right design decision.',
      };
    case 'gear':
      return {
        title: 'The right gear decision usually gets quieter, not louder.',
        description: 'Once the category fits your real life, the product page drama tends to calm down on its own.',
      };
    case 'postpartum':
      return {
        title: 'Support counts too. It is not the side note.',
        description: 'A good plan makes room for recovery, feeding rhythm, and the adult part of the transition too.',
      };
    default:
      return {
        title: 'A little clarity now saves a lot of random later.',
        description: 'That is the whole TMBC angle.',
      };
  }
}

function getModuleTypographyAccent(module: ModuleLayoutData) {
  switch (module.pathSlug) {
    case 'registry':
      return {
        hero: 'keep the list edited',
        section: 'this is where the registry gets smarter',
        next: 'keep the easier decision in view',
      };
    case 'nursery':
      return {
        hero: 'pretty can follow function',
        section: 'make the route easier while you are tired',
        next: 'build the room around real life',
      };
    case 'gear':
      return {
        hero: 'fit first, features second',
        section: 'this is the part worth slowing down for',
        next: 'the shortlist can come after the framework',
      };
    case 'postpartum':
      return {
        hero: 'support is part of the plan',
        section: 'this is the part people rush past',
        next: 'care for the adults too',
      };
    default:
      return {
        hero: 'one calmer decision at a time',
        section: 'start with the quieter question',
        next: 'let clarity do the editing',
      };
  }
}

function formatInlineList(items: string[]) {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function buildModuleFocusLine(module: ModuleLayoutData) {
  const focusPoints = module.coreSections
    .map((section) => section.title.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (focusPoints.length === 0) {
    return 'This TMBC Academy module is here to make the category clearer before the product tabs multiply.';
  }

  return `Inside this module: ${formatInlineList(focusPoints)}.`;
}

function buildModuleAcademyConnectionCards(
  module: ModuleLayoutData,
  pathLabel: string | undefined,
) {
  const pathTitle = pathLabel ? `${pathLabel} Path` : 'Academy Path';
  const connectionCards = [
    {
      href: `/academy/${module.pathSlug}`,
      title: pathTitle,
      description: `Go back to the full ${pathLabel ?? 'Academy'} sequence if you want the wider decision map around this module.`,
      ctaLabel: 'View path ->',
      eyebrow: 'Path',
    },
    module.previous ? { ...module.previous, eyebrow: 'Previous' } : null,
    module.next ? { ...module.next, eyebrow: 'Next' } : null,
    module.related ? { ...module.related, eyebrow: 'Related' } : null,
  ].filter(
    (
      card,
    ): card is {
      href: string;
      title: string;
      description: string;
      ctaLabel: string;
      eyebrow: string;
    } => Boolean(card),
  );

  return Array.from(new Map(connectionCards.map((card) => [card.href, card])).values()).slice(0, 4);
}

function getEditorialLinkSectionCopy(editorialLinks: AcademyRelatedLink[]) {
  const hasBlogLinks = editorialLinks.some((link) => link.href.startsWith('/blog/'));
  const hasGuideLinks = editorialLinks.some((link) => link.href.startsWith('/guides/'));

  if (hasBlogLinks && hasGuideLinks) {
    return {
      title: 'Continue with related TMBC reading',
      description:
        'Use these links when you want either the wider guide view or a more concrete editorial example after the framework gets clearer.',
    };
  }

  if (hasGuideLinks) {
    return {
      title: 'Keep building through the TMBC guides',
      description:
        'Use these guide links when you want the wider hub, the next category, or the higher-level planning view around this module.',
    };
  }

  return {
    title: 'Continue in the Journal',
    description: 'Use these TMBC journal posts when you want the category shortlist after the framework gets clearer.',
  };
}

function getEditorialLinkEyebrow(href: string) {
  if (href.startsWith('/guides/')) {
    return 'Guide';
  }

  if (href.startsWith('/blog/')) {
    return 'Journal';
  }

  return 'Related';
}

export default async function ModuleLayout({ module }: ModuleLayoutProps) {
  const pathLabel = module.breadcrumb[1]?.label;
  const decisionChecklistSections = buildDecisionChecklistSections(module);
  const hasSoftCta = Boolean(module.softCtaTitle.trim() || module.softCtaBody.some((paragraph) => paragraph.trim()));
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(module.imagePath);
  const renderableProducts = module.products.filter((product) =>
    hasResolvedGuideAffiliateUrl({
      affiliateUrl: product.affiliateUrl,
      brand: product.brand,
      productName: product.name,
      name: product.name,
    }),
  );
  const handwrittenNote = getModuleHandwrittenNote(module);
  const typographyAccent = getModuleTypographyAccent(module);
  const moduleFocusLine = buildModuleFocusLine(module);
  const academyConnections = buildModuleAcademyConnectionCards(module, pathLabel);
  const editorialSectionCopy = getEditorialLinkSectionCopy(module.editorialLinks);
  const phaseLabel = getAcademyPhaseLabel(module);
  const decisionStatement = getModuleDecisionStatement(module);
  const whyThisExists = getModuleWhyThisExists(module);
  const quickCheckLines = getQuickCheckLines(module);
  const quickCheckTags = getQuickCheckTags(module);
  const connectedPaths = getConnectedAcademyPaths(module.pathSlug);
  const productInsights = getProductInsights({
    ...module,
    products: renderableProducts,
  });
  const internalLinkPlan = buildAcademyInternalLinkPlan({
    href: module.href as `/${string}`,
    pathSlug: module.pathSlug,
    slug: module.slug,
    title: module.title,
    description: module.description,
  });
  const travelSystemWidget =
    module.slug === 'travel-systems'
      ? await Promise.all([getTravelSystemStrollers(), getTravelSystemCarSeats()]).then(([strollers, carSeats]) => ({
          strollers,
          carSeats,
        }))
      : null;
  const decisionBarActions = [
    module.next ? { label: `Next: ${module.next.title}`, href: module.next.href } : null,
    { label: 'Work with me', href: '/consultation' },
  ].filter((action): action is { label: string; href: string } => Boolean(action));
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
      keywords: [
        module.title,
        pathLabel ?? module.pathSlug,
        module.subhead,
      ],
      teaches: [
        ...module.decisionBullets,
        ...module.coreSections.map((section) => section.title),
      ],
      hasPart:
        module.submoduleSection?.cards.map((card) => ({
          href: card.href,
          title: card.title,
          description: card.description,
        })) ?? [],
      learningResourceType: 'TMBC Academy Module',
    }),
  ];

  return (
    <section className="section-base" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
      <AcademyStructuredData data={structuredData} />
      <article className="tmbc-blog-shell mx-auto max-w-4xl px-5 pb-20 pt-10 sm:px-6 md:pb-24 md:pt-12">
        <div className="space-y-12">
          <div className="academy-load-in academy-load-in--1 pt-2">
            <Breadcrumbs items={module.breadcrumb} />
          </div>

          <header className="academy-load-in academy-load-in--2 tmbc-blog-hero">
            <div className="tmbc-blog-hero__inner">
              <div className="tmbc-blog-hero__eyebrow flex flex-wrap items-center gap-3">
                <CategoryTag label="TMBC Academy" />
                {pathLabel ? <CategoryTag label={pathLabel} /> : null}
              </div>

              <div className="tmbc-blog-hero__copy">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">
                  {phaseLabel}
                </p>
                <h1 className="text-[var(--tmbc-blog-charcoal)]">{module.title}</h1>
                <p className="excerpt">{module.subhead}</p>
                <p className="academy-handwritten-aside mt-5">{typographyAccent.hero}</p>
                <p className="mt-4 max-w-[42rem] text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.04rem]">
                  {moduleFocusLine}
                </p>
                <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1rem]">
                  Start with your real life, then let the choices get smaller.
                </p>
              </div>

              <div className="tmbc-blog-meta">
                <span>{pathLabel ?? 'Academy'} path</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                <span>Guided, not overwhelming</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-black/15" />
                <span>Step-by-step, not panic-by-panic</span>
              </div>

              <div className="tmbc-blog-hero__divider">
                <BlogDivider />
              </div>
            </div>
          </header>

          <div className="academy-load-in academy-load-in--2 tmbc-blog-featured-frame relative mb-10 aspect-[16/10] overflow-hidden p-4 sm:mb-12 sm:p-5">
            <div className="relative h-full w-full">
              <Image
                src={module.imagePath}
                alt={module.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-contain"
                unoptimized={shouldSkipHeroImageOptimization}
              />
            </div>
          </div>

          <section className="academy-load-in academy-load-in--3 blog-section-soft px-4 sm:px-6">
            <AcademyProgressBar
              current={module.progress.current}
              total={module.progress.total}
              label={phaseLabel}
              stepLabel={`Module ${module.progress.current} of ${module.progress.total}`}
            />
          </section>

          <section className="academy-load-in academy-load-in--4 tmbc-blog-soft-card px-6 py-6 sm:px-7">
            <p className="text-sm text-[var(--tmbc-blog-soft-text)]">This module helps you decide:</p>
            <h2 className="mt-3 max-w-3xl break-words font-serif text-[clamp(1.7rem,3vw,2.2rem)] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal)]">
              {decisionStatement}
            </h2>
            {quickCheckTags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {quickCheckTags.map((tag) => (
                  <DecisionTag key={`${module.slug}-${tag}`} label={tag} />
                ))}
              </div>
            ) : null}
          </section>

          <section className="academy-load-in academy-load-in--5 tmbc-blog-soft-card px-6 py-6 sm:px-7">
            <SectionHeading
              eyebrow="Why This Exists"
              title="This category is here to make the decision smaller"
              description={whyThisExists}
            />
          </section>

          {academyConnections.length > 0 ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Keep Exploring"
                title="Keep this decision connected in TMBC Academy"
                description="If this category starts touching the next decision, these are the cleanest internal stops instead of opening fifteen new tabs and hoping for emotional support."
              />

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {academyConnections.map((card) => (
                  <NextStepCard
                    key={`${module.slug}-academy-${card.href}`}
                    href={card.href}
                    title={card.title}
                    description={card.description}
                    ctaLabel={card.ctaLabel}
                    eyebrow={card.eyebrow}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <ConnectedContentSection
            eyebrow="Keep It Connected"
            title="Bridge this module back to the wider TMBC system"
            description="Use the guide when you want the higher-level decision map, the journal when you want a concrete example, and services when you want the shortlist translated to your actual life."
            cards={internalLinkPlan.journeyCards}
          />

          <section className="academy-load-in academy-load-in--5 tmbc-editorial-article-shell">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">Editorial Intro</p>
            <article className="tmbc-blog tmbc-blog-post-content mt-6 max-w-none">
              {renderLinkedParagraphs(
                module.intro,
                internalLinkPlan.contextualLinks,
                `${module.slug}-intro`,
              )}
            </article>
          </section>

          <GuideHandwrittenNote
            className="academy-load-in academy-load-in--6"
            eyebrow="Taylor's note"
            title={handwrittenNote.title}
            description={handwrittenNote.description}
            presentation="margin"
            size="compact"
            showEyebrow
            showSignoff={false}
          />

          <section className="space-y-8">
            <SectionHeading
              eyebrow="Core Considerations"
              title="What actually shapes this decision"
              note={typographyAccent.section}
            />

            <div className="space-y-10">
              {module.coreSections.map((section, index) => {
                const shouldSkipSectionImageOptimization = isRemoteImageUrl(section.imageSrc);

                return (
                  <article
                    key={section.title}
                    className="academy-load-in tmbc-editorial-article-shell"
                    style={{ animationDelay: `${120 + index * 80}ms` }}
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--tmbc-blog-rose)]">TMBC Focus</p>
                    <div className="tmbc-blog mt-6 max-w-none">
                      <h3 className="mt-0">{section.title}</h3>
                      {renderLinkedParagraphs(
                        section.paragraphs,
                        internalLinkPlan.contextualLinks,
                        `${module.slug}-${slugify(section.title)}`,
                      )}
                    </div>

                    <figure className="mt-8">
                      <div className="tmbc-blog-featured-frame relative aspect-[16/10] overflow-hidden p-4 sm:p-5">
                        <div className="relative h-full w-full">
                          <Image
                            src={section.imageSrc}
                            alt={section.imageAlt}
                            fill
                            sizes="(min-width: 1024px) 896px, 100vw"
                            className="object-contain"
                            unoptimized={shouldSkipSectionImageOptimization}
                          />
                        </div>
                      </div>
                      {section.imageCaption ? (
                        <figcaption className="px-1 pt-4 text-[13px] leading-6 text-[var(--tmbc-blog-soft-text)]">
                          {section.imageCaption}
                        </figcaption>
                      ) : null}
                    </figure>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-12 rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-[var(--tmbc-blog-ivory)] px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.06)] sm:px-7">
            <h3 className="font-semibold text-[1.08rem] text-[var(--tmbc-blog-charcoal)]">Quick check</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--tmbc-blog-soft-text)]">
              If this sounds like you, you&apos;re in the right place.
            </p>
            {quickCheckTags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {quickCheckTags.map((tag) => (
                  <DecisionTag key={`${module.slug}-checkpoint-${tag}`} label={tag} />
                ))}
              </div>
            ) : null}
            {quickCheckLines.length > 0 ? (
              <ul className="mt-5 space-y-3 text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)]">
                {quickCheckLines.map((line) => (
                  <li key={`${module.slug}-checkpoint-${line}`} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--tmbc-blog-rose)]" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          {travelSystemWidget ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Compatibility Tool"
                title="Travel system compatibility"
                description="If the stroller question is dragging the infant seat decision around with it, use this here instead of opening twelve tabs and hoping the adapter story reveals itself. Start with the stroller or the infant seat, then see what actually works together."
              />

              {travelSystemWidget.strollers.length > 0 || travelSystemWidget.carSeats.length > 0 ? (
                <div className="academy-load-in blog-section-soft px-4 py-5 sm:px-6 sm:py-6">
                  <TravelSystemGenerator
                    strollers={travelSystemWidget.strollers}
                    carSeats={travelSystemWidget.carSeats}
                  />
                </div>
              ) : (
                <div className="tmbc-blog-soft-card px-5 py-6 text-sm leading-7 text-[var(--tmbc-blog-soft-text)] sm:px-6">
                  The TMBC compatibility library is not available in this environment yet. Once the stroller and infant seat data are present, this module will show the same travel system generator used in the full tool.
                </div>
              )}
            </section>
          ) : null}

          {decisionChecklistSections.length > 0 ? (
            <ChecklistCardSet
              title={module.decisionTitle}
              description="This is the shorter, more usable version of the module once you want the actual takeaways."
              sections={decisionChecklistSections}
            />
          ) : null}

          {module.editorialLinks.length > 0 ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Keep Reading"
                title={editorialSectionCopy.title}
                description={editorialSectionCopy.description}
              />

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {module.editorialLinks.map((link) => (
                  <NextStepCard
                    key={`${module.slug}-${link.href}`}
                    href={link.href}
                    title={link.title}
                    description={link.description}
                    ctaLabel={link.ctaLabel}
                    eyebrow={getEditorialLinkEyebrow(link.href)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {module.submoduleSection ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Sub Modules"
                title={module.submoduleSection.title}
                description={module.submoduleSection.description}
              />

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {module.submoduleSection.cards.map((card) => (
                  <NextStepCard
                    key={`${module.slug}-${card.href}`}
                    href={card.href}
                    title={card.title}
                    description={card.description}
                    ctaLabel={card.ctaLabel}
                    eyebrow={card.eyebrow}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {productInsights.length > 0 ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Grounding Examples"
                title="Useful examples, not a shopping spiral"
                description="These are here to keep the decision connected to real life. In some modules they are product examples. In others they are the starter categories worth pressure-testing before the list grows."
              />

              <div className="grid gap-6 lg:grid-cols-3">
                {productInsights.slice(0, 3).map((product, index) => (
                  <div key={`${module.slug}-${product.brand}-${product.name}-${index}`} className="academy-load-in" style={{ animationDelay: `${140 + index * 80}ms` }}>
                    <ProductInsightCard
                      name={product.name}
                      brand={product.brand}
                      description={product.description}
                      problemItSolves={product.problemItSolves}
                      whenItFits={product.whenItFits}
                      whenItDoesNotFit={product.whenItDoesNotFit}
                      affiliateUrl={product.affiliateUrl}
                      imageSrc={product.imageSrc}
                      imageAlt={product.imageAlt}
                      category={product.category}
                      tag={product.tag}
                      guide={`${module.pathSlug}/${module.slug}`}
                      position={index + 1}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {hasSoftCta ? (
            <section className="space-y-5">
              <ExpertTipCallout
                eyebrow={module.softCtaLabel}
                title={module.softCtaTitle}
                body={module.softCtaBody.join(' ')}
              />
              <div className="tmbc-blog-soft-card px-6 py-6 sm:px-7">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">Work With Taylor</p>
                <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.04rem]">
                  If you want help translating this module into a smarter shortlist or cleaner registry plan, this is the right point to get tailored guidance.
                </p>
                <div className="mt-6">
                  {module.trackingGuideId ? (
                    <GuideTrackedLink
                      guideId={module.trackingGuideId}
                      href="/consultation"
                      event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                      sourceRoute={module.href}
                      className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-[rgba(232,154,174,0.34)] bg-[linear-gradient(135deg,#d889a0_0%,#c97691_100%)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(216,137,160,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-[0.98] hover:shadow-[0_20px_38px_rgba(203,120,146,0.26)] sm:w-auto"
                      meta={{
                        ctaLabel: 'Work with me',
                        label: 'academy_work_with_me',
                      }}
                    >
                      {'Work with me ->'}
                    </GuideTrackedLink>
                  ) : (
                    <Link
                      href="/consultation"
                      className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-[rgba(232,154,174,0.34)] bg-[linear-gradient(135deg,#d889a0_0%,#c97691_100%)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(216,137,160,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-[0.98] hover:shadow-[0_20px_38px_rgba(203,120,146,0.26)] sm:w-auto"
                    >
                      {'Work with me ->'}
                    </Link>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          <SaveDecisionBar
            title="Keep the right next step obvious."
            description={buildDecisionBarDescription(module)}
            actions={decisionBarActions}
          />

          <section className="space-y-6">
            <SectionHeading eyebrow="Where To Go Next" title="Keep the path feeling guided" note={typographyAccent.next} />
            <DecisionRouter module={module} />
          </section>

          <section className="space-y-5 rounded-[1.8rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-6 shadow-[0_18px_40px_rgba(58,36,43,0.07)]">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">Connected To</p>
              <h3 className="mt-3 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
                The Academy paths this decision touches next
              </h3>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-8 text-[var(--tmbc-blog-soft-text)]">
                You do not need to jump all three right now. This is just the cleaner map of where this decision tends to connect once real life starts narrowing the answer.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {connectedPaths.map((path) => (
                <Link
                  key={`${module.slug}-connected-${path.href}`}
                  href={path.href}
                  className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 ${
                    path.current
                      ? 'border-[rgba(161,91,114,0.22)] bg-[rgba(252,241,245,0.96)] text-[#8F4C62]'
                      : 'border-[rgba(215,161,175,0.18)] bg-white text-[var(--tmbc-blog-charcoal)] hover:border-[rgba(161,91,114,0.24)]'
                  }`}
                >
                  {path.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
    </section>
  );
}
