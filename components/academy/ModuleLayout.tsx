import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  AcademyConnectedPaths,
  AcademyRouteCard,
  AcademySectionHeading,
} from '@/components/academy/AcademyPrimitives';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import ClarityCallout from '@/components/academy/ClarityCallout';
import DecisionBlock from '@/components/academy/DecisionBlock';
import DecisionFilter from '@/components/academy/DecisionFilter';
import DecisionRouter from '@/components/academy/DecisionRouter';
import DecisionTag from '@/components/academy/DecisionTag';
import ProductInsightCard from '@/components/academy/ProductInsightCard';
import ScenarioBlock from '@/components/academy/ScenarioBlock';
import StartHere from '@/components/academy/StartHere';
import WhatDoesntMatterList from '@/components/academy/WhatDoesntMatterList';
import WhatMattersList from '@/components/academy/WhatMattersList';
import BlogDivider from '@/components/blog/BlogDivider';
import CategoryTag from '@/components/blog/CategoryTag';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import { isRemoteImageUrl } from '@/lib/blog/images';
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
import { buildAcademySignatureSystem } from '@/lib/academy/signatureSystem';
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
  submoduleSection: AcademySubmoduleSection | null;
  breadcrumb: AcademyBreadcrumbItem[];
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
  if (module.slug === 'sleep-space-decisions') {
    return {
      title: 'You are not choosing one perfect sleep setup.',
      description:
        'Most newborns move between a few spaces. The calmer plan is understanding how those spaces work together before the shopping tabs start auditioning for soulmates.',
    };
  }

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

export default async function ModuleLayout({ module }: ModuleLayoutProps) {
  const pathLabel = module.breadcrumb[1]?.label;
  const hasSoftCta = Boolean(module.softCtaTitle.trim() || module.softCtaBody.some((paragraph) => paragraph.trim()));
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(module.imagePath);
  const renderableProducts = module.products.filter((product) => product.name.trim().length > 0);
  const handwrittenNote = getModuleHandwrittenNote(module);
  const typographyAccent = getModuleTypographyAccent(module);
  const moduleFocusLine = buildModuleFocusLine(module);
  const phaseLabel = getAcademyPhaseLabel(module);
  const decisionStatement = getModuleDecisionStatement(module);
  const whyThisExists = getModuleWhyThisExists(module);
  const quickCheckLines = getQuickCheckLines(module);
  const quickCheckTags = getQuickCheckTags(module);
  const signatureSystem = buildAcademySignatureSystem(module, {
    decisionStatement,
    whyThisExists,
    quickCheckLines,
  });
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

          <div className="academy-load-in academy-load-in--4 space-y-8">
            <StartHere
              title={signatureSystem.startHere.title}
              description={signatureSystem.startHere.description}
            >
              {renderLinkedParagraphs(
                signatureSystem.startHere.paragraphs,
                internalLinkPlan.contextualLinks,
                `${module.slug}-signature-start`,
              )}
            </StartHere>

            <DecisionBlock
              title={signatureSystem.decisionBlock.title}
              description={signatureSystem.decisionBlock.description}
              contrast={signatureSystem.decisionBlock.contrast}
            >
              {quickCheckTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {quickCheckTags.map((tag) => (
                    <DecisionTag key={`${module.slug}-${tag}`} label={tag} />
                  ))}
                </div>
              ) : null}
            </DecisionBlock>

            <div className="grid gap-6 lg:grid-cols-2">
              <WhatMattersList
                title={signatureSystem.whatMatters.title}
                items={signatureSystem.whatMatters.items}
              />
              <WhatDoesntMatterList
                title={signatureSystem.whatDoesNotMatter.title}
                items={signatureSystem.whatDoesNotMatter.items}
              />
            </div>

            <ScenarioBlock
              title={signatureSystem.scenarios.title}
              scenarios={signatureSystem.scenarios.items}
            />

            <DecisionFilter
              title={signatureSystem.decisionFilter.title}
              chooseIf={signatureSystem.decisionFilter.chooseIf}
              skipIf={signatureSystem.decisionFilter.skipIf}
            />

            <ClarityCallout insight={signatureSystem.clarityInsight} />
          </div>

          {travelSystemWidget ? (
            <section className="space-y-6">
              <AcademySectionHeading
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

          {productInsights.length > 0 ? (
            <section className="space-y-6">
              <AcademySectionHeading
                eyebrow="Product Examples"
                title={`${module.title} examples to pressure-test`}
                description="These are here to keep the decision connected to real life. They are examples, not a quiet invitation to turn the module into a shopping spiral."
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
                      position={index + 1}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

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

          {module.submoduleSection ? (
            <section className="space-y-6">
              <AcademySectionHeading
                eyebrow="Sub Modules"
                title={module.submoduleSection.title}
                description={module.submoduleSection.description}
              />

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {module.submoduleSection.cards.map((card) => (
                  <AcademyRouteCard
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
                  <Link
                    href="/consultation"
                    className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-[rgba(232,154,174,0.34)] bg-[linear-gradient(135deg,#d889a0_0%,#c97691_100%)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(216,137,160,0.22)] transition duration-300 hover:-translate-y-0.5 hover:brightness-[0.98] hover:shadow-[0_20px_38px_rgba(203,120,146,0.26)] sm:w-auto"
                  >
                    {'Work with me ->'}
                  </Link>
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
            <AcademySectionHeading eyebrow="Where To Go Next" title="Keep the path feeling guided" note={typographyAccent.next} />
            <DecisionRouter module={module} />
          </section>

          <AcademyConnectedPaths
            description="You do not need to jump all three right now. This is just the cleaner map of where this decision tends to connect once real life starts narrowing the answer."
            paths={connectedPaths}
          />
        </div>
      </article>
    </section>
  );
}
