import Image from 'next/image';
import Link from 'next/link';
import BlogDivider from '@/components/blog/BlogDivider';
import CategoryTag from '@/components/blog/CategoryTag';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import ProductCard from '@/components/ui/ProductCard';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import { hasResolvedGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';
import type { AcademyBreadcrumbItem, AcademyModuleData } from '@/lib/academy/content';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

type ModuleLayoutProps = {
  module: AcademyModuleData;
};

function Breadcrumbs({ items }: { items: AcademyBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-[rgba(161,91,114,0.35)]">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="transition duration-200 hover:text-[#8F4C62]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#8F4C62]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
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
      className="group tmbc-blog-soft-card flex h-full flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-[rgba(232,154,174,0.34)] hover:shadow-[0_24px_54px_rgba(70,53,58,0.08)] sm:p-6"
    >
      <p className="w-fit">
        <span className="tmbc-tag">{eyebrow}</span>
      </p>
      <h3 className="mt-5 font-serif text-[clamp(1.45rem,2vw,1.9rem)] leading-[1.12] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
        {title}
      </h3>
      <p className="mt-4 text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)]">{description}</p>
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
    <div className="max-w-3xl">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[clamp(2.1rem,4vw,2.9rem)] leading-[1.1] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
        {title}
      </h2>
      <div className="mt-4 h-1 w-[78px] rounded-full bg-[linear-gradient(90deg,rgba(232,154,174,0.9)_0%,rgba(215,161,175,1)_100%)] shadow-[0_10px_24px_rgba(232,154,174,0.18)]" />
      {description ? (
        <p className="mt-5 text-[1.05rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.08rem]">
          {description}
        </p>
      ) : null}
      {note ? <p className="academy-handwritten-aside mt-4">{note}</p> : null}
    </div>
  );
}

function buildDecisionChecklistSections(module: AcademyModuleData) {
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

function buildDecisionBarDescription(module: AcademyModuleData) {
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

function getModuleHandwrittenNote(module: AcademyModuleData) {
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

function getModuleTypographyAccent(module: AcademyModuleData) {
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
  const travelSystemWidget =
    module.slug === 'travel-systems'
      ? await Promise.all([getTravelSystemStrollers(), getTravelSystemCarSeats()]).then(([strollers, carSeats]) => ({
          strollers,
          carSeats,
        }))
      : null;
  const decisionBarActions = [
    module.next ? { label: `Next: ${module.next.title}`, href: module.next.href } : null,
    module.related ? { label: `Related: ${module.related.title}`, href: module.related.href } : null,
    { label: 'Work with me', href: '/consultation' },
  ].filter((action): action is { label: string; href: string } => Boolean(action));

  return (
    <section className="section-base" style={{ backgroundColor: 'var(--tmbc-blog-ivory)' }}>
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
                  Module {module.progress.current} of {module.progress.total}
                </p>
                <h1 className="text-[var(--tmbc-blog-charcoal)]">{module.title}</h1>
                <p className="excerpt">{module.subhead}</p>
                <p className="academy-handwritten-aside mt-5">{typographyAccent.hero}</p>
                <p className="mt-4 max-w-[42rem] text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.04rem]">
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
              label={pathLabel ? `${pathLabel} path progress` : 'Academy module progress'}
            />
          </section>

          <section className="academy-load-in academy-load-in--4 tmbc-editorial-article-shell">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">Editorial Intro</p>
            <article className="tmbc-blog tmbc-blog-post-content mt-6 max-w-none">
              {module.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          </section>

          <GuideHandwrittenNote
            className="academy-load-in academy-load-in--5"
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
                      {section.paragraphs.map((paragraph) => (
                        <p key={`${section.title}-${paragraph}`}>{paragraph}</p>
                      ))}
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
                title="Continue in the Journal"
                description="Use these TMBC journal posts when you want the category shortlist after the framework gets clearer."
              />

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {module.editorialLinks.map((link) => (
                  <NextStepCard
                    key={`${module.slug}-${link.href}`}
                    href={link.href}
                    title={link.title}
                    description={link.description}
                    ctaLabel={link.ctaLabel}
                    eyebrow="Journal"
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

          {renderableProducts.length > 0 ? (
            <section className="space-y-6">
              <SectionHeading
                eyebrow="Product Examples"
                title="Guided examples, not a ranking"
                description="These are here to make the decision more concrete in real life. They are not meant to turn the module into a product list."
              />

              <div className="grid gap-6 lg:grid-cols-3">
                {renderableProducts.slice(0, 3).map((product, index) => (
                  <div key={`${module.slug}-${product.brand}-${product.name}-${index}`} className="academy-load-in" style={{ animationDelay: `${140 + index * 80}ms` }}>
                    <ProductCard
                      name={product.name}
                      brand={product.brand}
                      description={product.description}
                      pros={product.pros}
                      affiliateUrl={product.affiliateUrl}
                      imageSrc={product.imageSrc}
                      imageAlt={product.imageAlt}
                      category={product.category}
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
            <SectionHeading eyebrow="Next Steps" title="Keep the path moving" note={typographyAccent.next} />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {module.previous ? <NextStepCard {...module.previous} /> : null}
              {module.next ? <NextStepCard {...module.next} /> : null}
              {module.related ? <NextStepCard {...module.related} /> : null}
            </div>
          </section>
        </div>
      </article>
    </section>
  );
}
