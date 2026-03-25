import Image from 'next/image';
import Link from 'next/link';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import ChecklistCardSet from '@/components/guides/academy/ChecklistCardSet';
import ExpertTipCallout from '@/components/guides/academy/ExpertTipCallout';
import SaveDecisionBar from '@/components/guides/academy/SaveDecisionBar';
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
    <div className="rounded-[1.15rem] border border-[rgba(215,161,175,0.18)] bg-[rgba(255,251,252,0.9)] px-4 py-4 shadow-[0_10px_30px_rgba(58,36,43,0.06)]">
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
}: {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(58,36,43,0.12)]"
    >
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Module Link</p>
      <h3 className="mt-3 font-serif text-[1.55rem] leading-[1.04] tracking-[-0.03em] text-[#2F2430]">{title}</h3>
      <p className="mt-3 text-[0.98rem] leading-7 text-[#5B4B55]">{description}</p>
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

export default function ModuleLayout({ module }: ModuleLayoutProps) {
  const pathLabel = module.breadcrumb[1]?.label;
  const decisionChecklistSections = buildDecisionChecklistSections(module);
  const hasSoftCta = Boolean(module.softCtaTitle.trim() || module.softCtaBody.some((paragraph) => paragraph.trim()));
  const shouldSkipHeroImageOptimization = isRemoteImageUrl(module.imagePath);
  const decisionBarActions = [
    module.next ? { label: `Next: ${module.next.title}`, href: module.next.href } : null,
    module.related ? { label: `Related: ${module.related.title}`, href: module.related.href } : null,
    { label: 'Work with me', href: '/consultation' },
  ].filter((action): action is { label: string; href: string } => Boolean(action));

  return (
    <div className="bg-[radial-gradient(circle_at_top_right,rgba(215,161,175,0.16),transparent_28%),radial-gradient(circle_at_top_left,rgba(243,216,196,0.28),transparent_30%),linear-gradient(180deg,#fdf8f5_0%,#fbf1f4_36%,#fffdfa_100%)]">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-8 md:pb-24 md:pt-14 lg:px-10">
        <div className="space-y-12">
          <Breadcrumbs items={module.breadcrumb} />

          <section className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(252,247,249,0.98)_0%,rgba(251,245,239,0.98)_52%,rgba(255,251,252,0.98)_100%)] px-6 py-8 shadow-[0_26px_70px_rgba(58,36,43,0.10)] sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.26)_0%,rgba(215,161,175,0)_72%)] blur-2xl" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[-4rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(243,216,196,0.32)_0%,rgba(243,216,196,0)_72%)] blur-2xl" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-end">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">
                  TMBC Academy · {pathLabel ?? 'Academy'}
                </p>
                <h1 className="mt-4 max-w-[14ch] font-serif text-[2.9rem] leading-[0.92] tracking-[-0.05em] text-[#2F2430] sm:text-[3.3rem] md:text-[3.8rem]">
                  {module.title}
                </h1>
                <p className="mt-5 max-w-[44rem] text-[1.08rem] leading-8 text-[#4B3641]">{module.subhead}</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <HeroStat label="Module" value={`${module.progress.current} of ${module.progress.total}`} />
                  <HeroStat label="Path" value={pathLabel ?? 'Academy'} />
                  <HeroStat label="Approach" value="Guided, not overwhelming" />
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/88 shadow-[0_18px_42px_rgba(58,36,43,0.10)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={module.imagePath}
                    alt={module.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 24rem, 100vw"
                    className="object-cover"
                    unoptimized={shouldSkipHeroImageOptimization}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/86 px-6 py-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8">
            <AcademyProgressBar
              current={module.progress.current}
              total={module.progress.total}
              label={pathLabel ? `${pathLabel} path progress` : 'Academy module progress'}
            />
          </section>

          <section className="rounded-[1.95rem] border border-[rgba(215,161,175,0.18)] bg-white/90 px-6 py-8 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8 md:px-10">
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Editorial Intro</p>
            <div className="mt-5 max-w-[46rem] space-y-5 text-[1.04rem] leading-8 text-[#5B4B55]">
              {module.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Core Considerations</p>
              <h2 className="mt-3 font-serif text-[2.2rem] leading-[0.96] tracking-[-0.04em] text-[#2F2430] sm:text-[2.6rem]">
                What actually shapes this decision
              </h2>
            </div>

            <div className="space-y-10">
              {module.coreSections.map((section) => (
                (() => {
                  const shouldSkipSectionImageOptimization = isRemoteImageUrl(section.imageSrc);

                  return (
                    <article
                      key={section.title}
                      className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 px-6 py-8 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-8 md:px-10"
                    >
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">TMBC Focus</p>
                      <h3 className="mt-3 font-serif text-[1.8rem] leading-[1] tracking-[-0.03em] text-[#2F2430] sm:text-[2rem]">
                        {section.title}
                      </h3>
                      <div className="mt-5 max-w-[46rem] space-y-5 text-[1.02rem] leading-8 text-[#5B4B55]">
                        {section.paragraphs.map((paragraph) => (
                          <p key={`${section.title}-${paragraph}`}>{paragraph}</p>
                        ))}
                      </div>

                      <figure className="mt-8 overflow-hidden rounded-[1.6rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(251,245,239,0.98),rgba(247,231,236,0.88))]">
                        <div className="relative aspect-[16/9] w-full">
                          <Image
                            src={section.imageSrc}
                            alt={section.imageAlt}
                            fill
                            sizes="(min-width: 1280px) 72rem, (min-width: 768px) 90vw, 100vw"
                            className="object-cover"
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

          {module.products.length > 0 ? (
            <section className="space-y-6">
              <div className="max-w-3xl">
                <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#A15B72]">Product Examples</p>
                <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-[#2F2430] sm:text-[2.4rem]">
                  Guided examples, not a ranking
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-[#5B4B55]">
                  These are here to make the decision more concrete in real life. They are not meant to turn the module into a product list.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {module.products.slice(0, 3).map((product, index) => (
                  <ProductCard
                    key={`${module.slug}-${product.brand}-${product.name}-${index}`}
                    name={product.name}
                    brand={product.brand}
                    description={product.description}
                    pros={product.pros}
                    affiliateUrl={product.affiliateUrl}
                    category={product.category}
                    guide={`${module.pathSlug}/${module.slug}`}
                    position={index + 1}
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
              <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/88 px-6 py-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:px-7">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Work With Taylor</p>
                <p className="mt-3 max-w-3xl text-base leading-8 text-[#5B4B55]">
                  If you want help translating this module into a smarter shortlist or cleaner registry plan, this is the right point to get tailored guidance.
                </p>
                <div className="mt-5">
                  {module.trackingGuideId ? (
                    <GuideTrackedLink
                      guideId={module.trackingGuideId}
                      href="/consultation"
                      event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                      sourceRoute={module.href}
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#A15B72] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
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
                      className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#A15B72] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
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
