import Image from 'next/image';
import Link from 'next/link';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import ProductCard from '@/components/ui/ProductCard';
import { isRemoteImageUrl } from '@/lib/blog/images';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import type { AcademyBreadcrumbItem, AcademyModuleData } from '@/lib/academy/content';

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

function HeroStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="academy-sheen rounded-[1.3rem] border border-[rgba(226,150,173,0.2)] bg-[linear-gradient(180deg,rgba(255,252,253,0.96)_0%,rgba(252,243,247,0.92)_100%)] px-4 py-4 shadow-[0_14px_36px_rgba(58,36,43,0.08)]">
      <div className="mb-3 h-[2px] w-12 rounded-full bg-[linear-gradient(90deg,rgba(217,134,162,0.08),rgba(217,134,162,0.65),rgba(217,134,162,0.08))]" />
      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[#A15B72]">{label}</p>
      <p className="mt-2 text-sm font-medium text-[#2F2430]">{value}</p>
    </div>
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
      className="group academy-sheen flex h-full flex-col rounded-[1.9rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,247,250,0.92)_100%)] p-5 shadow-[0_20px_56px_rgba(58,36,43,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(217,134,162,0.28)] hover:shadow-[0_28px_64px_rgba(58,36,43,0.12)]"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
        <span className="h-[1px] flex-1 bg-[linear-gradient(90deg,rgba(217,134,162,0.4),rgba(217,134,162,0))]" />
      </div>
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-[1.38rem] leading-[1.05] tracking-[-0.03em] text-[#2F2430] sm:text-[1.55rem]">{title}</h3>
      <p className="mt-3 text-[0.96rem] leading-7 text-[#5B4B55] sm:text-[0.98rem]">{description}</p>
      <span className="mt-auto pt-5 text-sm font-semibold text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </Link>
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

export default function ModuleLayout({ module }: ModuleLayoutProps) {
  const pathLabel = module.breadcrumb[1]?.label;
  const decisionChecklistSections = buildDecisionChecklistSections(module);
  const hasSoftCta = Boolean(module.softCtaTitle.trim() || module.softCtaBody.some((paragraph) => paragraph.trim()));
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(module.imagePath);
  const handwrittenNote = getModuleHandwrittenNote(module);
  const typographyAccent = getModuleTypographyAccent(module);
  const decisionBarActions = [
    module.next ? { label: `Next: ${module.next.title}`, href: module.next.href } : null,
    module.related ? { label: `Related: ${module.related.title}`, href: module.related.href } : null,
    { label: 'Work with me', href: '/consultation' },
  ].filter((action): action is { label: string; href: string } => Boolean(action));

  return (
    <div className="bg-[radial-gradient(circle_at_top_right,rgba(232,154,174,0.2),transparent_26%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.34),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(232,154,174,0.12),transparent_32%),linear-gradient(180deg,#fef9f7_0%,#fdf1f4_30%,#fff8fb_58%,#fffdfa_100%)]">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 md:pb-24 md:pt-14 lg:px-10">
        <div className="space-y-12">
          <div className="academy-load-in academy-load-in--1">
            <Breadcrumbs items={module.breadcrumb} />
          </div>

          <section className="academy-load-in academy-load-in--2 relative overflow-hidden rounded-[2.45rem] border border-[rgba(226,150,173,0.2)] bg-[linear-gradient(135deg,rgba(255,250,252,0.98)_0%,rgba(252,242,246,0.98)_38%,rgba(251,245,239,0.98)_72%,rgba(255,252,253,0.98)_100%)] px-5 py-7 shadow-[0_30px_84px_rgba(58,36,43,0.12)] sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="academy-rose-glow pointer-events-none absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.28)_0%,rgba(232,154,174,0)_72%)] blur-2xl" />
            <div className="academy-petal-drift pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(243,216,196,0.34)_0%,rgba(243,216,196,0)_72%)] blur-2xl" />
            <div className="pointer-events-none absolute inset-x-8 top-6 h-px bg-[linear-gradient(90deg,rgba(217,134,162,0),rgba(217,134,162,0.45),rgba(217,134,162,0))]" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-end">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">
                  TMBC Academy · {pathLabel ?? 'Academy'}
                </p>
                <h1 className="mt-4 max-w-[14ch] font-serif text-[2.35rem] leading-[0.96] tracking-[-0.05em] text-[#2F2430] sm:text-[3.3rem] md:text-[3.8rem]">
                  {module.title}
                </h1>
                <p className="mt-5 max-w-[44rem] text-[1rem] leading-7 text-[#4B3641] sm:text-[1.08rem] sm:leading-8">{module.subhead}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(217,134,162,0.18)] bg-white/76 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62] shadow-[0_12px_26px_rgba(58,36,43,0.06)]">
                    Step-by-step, not panic-by-panic
                  </span>
                  <span className="academy-script-note academy-script-note--sm academy-script-note--tilt-left">softly, but on purpose</span>
                </div>
                <p className="academy-script-note academy-script-note--tilt-right mt-4">{typographyAccent.hero}</p>
                <p className="academy-handwritten-aside mt-2">Start with your real life, then let the choices get smaller.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <HeroStat label="Module" value={`${module.progress.current} of ${module.progress.total}`} />
                  <HeroStat label="Path" value={pathLabel ?? 'Academy'} />
                  <HeroStat label="Approach" value="Guided, not overwhelming" />
                </div>
              </div>

              <div className="academy-sheen overflow-hidden rounded-[1.9rem] border border-white/80 bg-[linear-gradient(135deg,rgba(253,244,247,0.98),rgba(247,231,236,0.9)_54%,rgba(250,241,231,0.92))] shadow-[0_22px_46px_rgba(58,36,43,0.12)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={module.imagePath}
                    alt={module.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 24rem, 100vw"
                    className="object-contain p-4 sm:p-8"
                    unoptimized={shouldSkipHeroImageOptimization}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="academy-load-in academy-load-in--3 rounded-[1.95rem] border border-[rgba(226,150,173,0.18)] bg-white/86 px-6 py-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8">
            <AcademyProgressBar
              current={module.progress.current}
              total={module.progress.total}
              label={pathLabel ? `${pathLabel} path progress` : 'Academy module progress'}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-start">
            <div className="academy-load-in academy-load-in--4 rounded-[1.95rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-8 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8 md:px-10">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Editorial Intro</p>
              <div className="mt-5 max-w-[46rem] space-y-5 text-[1.04rem] leading-8 text-[#5B4B55]">
                {module.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <GuideHandwrittenNote
              className="academy-load-in academy-load-in--5 self-start lg:mt-8"
              eyebrow="Taylor's note"
              title={handwrittenNote.title}
              description={handwrittenNote.description}
              presentation="margin"
              size="compact"
              showEyebrow
              showSignoff={false}
            />
          </section>

          <section className="space-y-8">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Core Considerations</p>
              <h2 className="mt-3 font-serif text-[2.2rem] leading-[0.96] tracking-[-0.04em] text-[#2F2430] sm:text-[2.6rem]">
                What actually shapes this decision
              </h2>
              <p className="academy-script-note academy-script-note--sm academy-script-note--tilt-left mt-4">{typographyAccent.section}</p>
            </div>

            <div className="space-y-10">
              {module.coreSections.map((section, index) => (
                (() => {
                  const shouldSkipSectionImageOptimization = isRemoteImageUrl(section.imageSrc);

                  return (
                    <article
                      key={section.title}
                      className="academy-load-in rounded-[2rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-8 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8 md:px-10"
                      style={{ animationDelay: `${120 + index * 80}ms` }}
                    >
                      <div className="mb-5 flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
                        <span className="h-[1px] flex-1 bg-[linear-gradient(90deg,rgba(217,134,162,0.38),rgba(217,134,162,0))]" />
                      </div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">TMBC Focus</p>
                      <h3 className="mt-3 font-serif text-[1.58rem] leading-[1.02] tracking-[-0.03em] text-[#2F2430] sm:text-[2rem]">
                        {section.title}
                      </h3>
                      <div className="mt-5 max-w-[46rem] space-y-5 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1.02rem] sm:leading-8">
                        {section.paragraphs.map((paragraph) => (
                          <p key={`${section.title}-${paragraph}`}>{paragraph}</p>
                        ))}
                      </div>

                      <figure className="academy-sheen mt-8 overflow-hidden rounded-[1.75rem] border border-[rgba(226,150,173,0.2)] bg-[linear-gradient(135deg,rgba(255,247,250,0.98),rgba(247,231,236,0.9))]">
                        <div className="relative aspect-[16/9] w-full">
                          <Image
                            src={section.imageSrc}
                            alt={section.imageAlt}
                            fill
                            sizes="(min-width: 1280px) 72rem, (min-width: 768px) 90vw, 100vw"
                            className="object-contain p-4 sm:p-6"
                            unoptimized={shouldSkipSectionImageOptimization}
                          />
                        </div>
                        {section.imageCaption ? (
                          <figcaption className="px-5 py-4 text-sm leading-6 text-[#6B5560] sm:px-6">
                            {section.imageCaption}
                          </figcaption>
                        ) : null}
                      </figure>
                    </article>
                  );
                })()
              ))}
            </div>
          </section>

          {decisionChecklistSections.length > 0 ? (
            <ChecklistCardSet
              title={module.decisionTitle}
              description="This is the shorter, more usable version of the module once you want the actual takeaways."
              sections={decisionChecklistSections}
            />
          ) : null}

          {module.editorialLinks.length > 0 ? (
            <section className="space-y-6">
              <div className="max-w-3xl">
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Keep Reading</p>
                <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                  Continue in the Journal
                </h2>
                <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">
                  Use these TMBC journal posts when you want the category shortlist after the framework gets clearer.
                </p>
              </div>

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
              <div className="max-w-3xl">
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Sub Modules</p>
                <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                  {module.submoduleSection.title}
                </h2>
                <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">{module.submoduleSection.description}</p>
              </div>

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

          {module.products.length > 0 ? (
            <section className="space-y-6">
              <div className="max-w-3xl">
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Product Examples</p>
                <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                  Guided examples, not a ranking
                </h2>
                <p className="mt-4 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">
                  These are here to make the decision more concrete in real life. They are not meant to turn the module into a product list.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
              {module.products.slice(0, 3).map((product, index) => (
                  <div key={`${module.slug}-${product.brand}-${product.name}-${index}`} className="academy-load-in" style={{ animationDelay: `${140 + index * 80}ms` }}>
                    <ProductCard
                      name={product.name}
                      brand={product.brand}
                      description={product.description}
                      pros={product.pros}
                      affiliateUrl={product.affiliateUrl}
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
              <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/88 px-6 py-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-7">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Work With Taylor</p>
                <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-[#5B4B55] sm:text-base sm:leading-8">
                  If you want help translating this module into a smarter shortlist or cleaner registry plan, this is the right point to get tailored guidance.
                </p>
                <div className="mt-5">
                  {module.trackingGuideId ? (
                    <GuideTrackedLink
                      guideId={module.trackingGuideId}
                      href="/consultation"
                      event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                      sourceRoute={module.href}
                      className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[#A15B72] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62] sm:w-auto"
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
                      className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full bg-[#A15B72] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62] sm:w-auto"
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
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Next Steps</p>
              <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                Keep the path moving
              </h2>
              <p className="academy-handwritten-aside mt-4">{typographyAccent.next}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {module.previous ? <NextStepCard {...module.previous} /> : null}
              {module.next ? <NextStepCard {...module.next} /> : null}
              {module.related ? <NextStepCard {...module.related} /> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
