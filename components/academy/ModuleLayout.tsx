import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  AcademyRouteCard,
  AcademySectionHeading,
} from '@/components/academy/AcademyPrimitives';
import AcademyStructuredData from '@/components/academy/AcademyStructuredData';
import ClarityCallout from '@/components/academy/ClarityCallout';
import DecisionCard from '@/components/academy/DecisionCard';
import DecisionBlock from '@/components/academy/DecisionBlock';
import DecisionTag from '@/components/academy/DecisionTag';
import HowToDecideBlock from '@/components/academy/HowToDecideBlock';
import NextBestDecisionCard from '@/components/academy/NextBestDecisionCard';
import ProductInsightCard from '@/components/academy/ProductInsightCard';
import StartHere from '@/components/academy/StartHere';
import TaylorsNoteCard from '@/components/academy/TaylorsNoteCard';
import WhatDoesntMatterList from '@/components/academy/WhatDoesntMatterList';
import WhatMattersList from '@/components/academy/WhatMattersList';
import YouAreHereCard from '@/components/academy/YouAreHereCard';
import BlogDivider from '@/components/blog/BlogDivider';
import CategoryTag from '@/components/blog/CategoryTag';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
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
  AcademyModuleCard,
  AcademyBreadcrumbItem,
  AcademyCoreSection,
  AcademyModuleData,
  AcademyProductExample,
  AcademyRelatedLink,
  AcademySubmoduleSection,
} from '@/lib/academy/content';
import { getAcademyPathData } from '@/lib/academy/content';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';
import { getCaseStudiesForAcademyModule } from '@/lib/caseStudies';

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

function uniqueItems(items: Array<string | null | undefined>) {
  return items
    .map((item) => item?.trim() ?? '')
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);
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

function buildInlineScenarioExamples(
  signatureScenarios: string[],
  caseStudies: Awaited<ReturnType<typeof getCaseStudiesForAcademyModule>>,
) {
  return uniqueItems([
    ...signatureScenarios,
    ...caseStudies.flatMap((study) =>
      study.scenarios.slice(0, 1).map((scenario) => `${study.title}: ${scenario}`),
    ),
  ]).slice(0, 3);
}

function buildProgressMessage(currentIndex: number, total: number) {
  if (currentIndex <= 0) {
    return 'You are at the first layer. You do not need the whole path solved before this part gets simpler.';
  }

  if (currentIndex >= total - 1) {
    return "You've completed this layer. Let the next decision stay small on purpose.";
  }

  return `You've completed ${currentIndex} ${currentIndex === 1 ? 'layer' : 'layers'}. Now keep the next one cleaner than the last one felt.`;
}

function buildNextDecisionLinks(
  module: ModuleLayoutData,
  pathCards: AcademyModuleCard[],
  currentIndex: number,
) {
  const primary =
    module.next
      ? module.next
      : pathCards[currentIndex + 1]
        ? {
            href: pathCards[currentIndex + 1].href,
            title: pathCards[currentIndex + 1].title,
            description: pathCards[currentIndex + 1].description,
            ctaLabel: pathCards[currentIndex + 1].ctaLabel,
          }
        : null;

  const secondary =
    module.related
      ? module.related
      : pathCards[0]
        ? {
            href: `/academy/${module.pathSlug}`,
            title: `Back to the ${module.pathSlug} path`,
            description: 'Zoom back out if you want the wider map before you choose the next detailed layer.',
            ctaLabel: 'View path ->',
          }
        : null;

  return { primary, secondary };
}

export default async function ModuleLayout({ module }: ModuleLayoutProps) {
  const pathData = await getAcademyPathData(module.pathSlug);
  const pathLabel = module.breadcrumb[1]?.label;
  const hasSoftCta = Boolean(module.softCtaTitle.trim() || module.softCtaBody.some((paragraph) => paragraph.trim()));
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(module.imagePath);
  const renderableProducts = module.products.filter((product) => product.name.trim().length > 0);
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
  const caseStudies = getCaseStudiesForAcademyModule(module.slug, module.pathSlug);
  const inlineScenarios = buildInlineScenarioExamples(signatureSystem.scenarios.items, caseStudies);
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
  const currentIndex = pathData.moduleCards.findIndex((card) => card.slug === module.slug);
  const completedSteps = currentIndex > 0 ? pathData.moduleCards.slice(0, currentIndex) : [];
  const { primary: nextPrimary, secondary: nextSecondary } = buildNextDecisionLinks(
    module,
    pathData.moduleCards,
    currentIndex,
  );
  const progressMessage = buildProgressMessage(
    currentIndex === -1 ? Math.max(module.progress.current - 1, 0) : currentIndex,
    pathData.moduleCards.length || module.progress.total,
  );
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

          <div className="academy-load-in academy-load-in--2">
            <YouAreHereCard
              trail={module.breadcrumb.map((item) => ({ title: item.label, href: item.href }))}
              progressLabel={`Module ${module.progress.current} of ${module.progress.total}`}
              currentTitle={module.title}
              currentStepLabel={phaseLabel}
              completedSteps={completedSteps}
              nextStep={nextPrimary}
            />
          </div>

          <header className="academy-load-in academy-load-in--3 tmbc-blog-hero">
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

          <div className="academy-load-in academy-load-in--3 tmbc-blog-featured-frame relative mb-10 aspect-[16/10] overflow-hidden p-4 sm:mb-12 sm:p-5">
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

          <section className="academy-load-in academy-load-in--4 blog-section-soft px-4 sm:px-6">
            <AcademyProgressBar
              current={module.progress.current}
              total={module.progress.total}
              label={phaseLabel}
              stepLabel={`Module ${module.progress.current} of ${module.progress.total}`}
            />
          </section>

          <div className="academy-load-in academy-load-in--5 space-y-8">
            <TaylorsNoteCard
              title={signatureSystem.taylorsNote.title}
              body={signatureSystem.taylorsNote.body}
              supportingLine={signatureSystem.taylorsNote.supportingLine}
            />

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

            {module.coreSections.length > 0 ? (
              <section className="space-y-6">
                <AcademySectionHeading
                  eyebrow="Decision Sections"
                  title="Use the right context before the shortlist gets loud again"
                  description="This is the educational layer behind the choice. Nothing here needs to feel like homework. It just needs to make the next move more obvious."
                />

                <div className="grid gap-6">
                  {module.coreSections.map((section, index) => (
                    <DecisionCard
                      key={`${module.slug}-${section.title}-${index}`}
                      eyebrow={`Decision layer ${index + 1}`}
                      title={section.title}
                      paragraphs={section.paragraphs}
                      example={inlineScenarios[index % Math.max(inlineScenarios.length, 1)]}
                      imageSrc={section.imageSrc ?? undefined}
                      imageAlt={section.imageAlt ?? undefined}
                      imageCaption={section.imageCaption ?? undefined}
                      tone={index % 3 === 1 ? 'blush' : index % 3 === 2 ? 'ivory' : 'white'}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <HowToDecideBlock
              title={signatureSystem.howToDecide.title}
              intro={signatureSystem.howToDecide.description}
              prioritize={signatureSystem.howToDecide.prioritize}
              avoid={signatureSystem.howToDecide.avoid}
              scenarios={inlineScenarios}
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

          {module.submoduleSection ? (
            <section className="space-y-6">
              <AcademySectionHeading
                eyebrow="Keep Building"
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

          <NextBestDecisionCard
            title="Now that this feels clearer, here is what matters next"
            description={buildDecisionBarDescription(module)}
            progressMessage={progressMessage || typographyAccent.next}
            primary={nextPrimary}
            secondary={nextSecondary}
            connectedPaths={connectedPaths}
          />
        </div>
      </article>
    </section>
  );
}
