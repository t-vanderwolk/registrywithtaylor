import Image from 'next/image';
import Link from 'next/link';
import GuideTrackedLink from '@/components/guides/GuideTrackedLink';
import ProductCard from '@/components/ui/ProductCard';
import { GuideAnalyticsEvents } from '@/lib/guides/events';
import type { AcademyBreadcrumbItem, AcademyModuleData } from '@/lib/academy/content';

type ModuleLayoutProps = {
  module: AcademyModuleData;
};

function Breadcrumbs({ items }: { items: AcademyBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-[#C9AB9D]">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="transition duration-200 hover:text-[#5F463D]">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#5F463D]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ProgressBar({
  current,
  total,
  pathLabel,
}: {
  current: number;
  total: number;
  pathLabel?: string;
}) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const progressLabel = pathLabel ? `Module ${current} of ${total} - ${pathLabel}` : `Module ${current} of ${total}`;

  return (
    <div className="rounded-[1.5rem] border border-[rgba(114,90,77,0.12)] bg-white/88 p-5 shadow-[0_12px_28px_rgba(48,31,24,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">{progressLabel}</p>
        <p className="text-sm leading-7 text-neutral-700">A guided sequence, not a content pile.</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EAE0D6]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#BE8C74_0%,#DDAA90_100%)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
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
      className="group flex h-full flex-col rounded-2xl border border-[rgba(114,90,77,0.12)] bg-white/92 p-5 shadow-[0_12px_28px_rgba(48,31,24,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(48,31,24,0.08)]"
    >
      <h3 className="font-serif text-[1.45rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">{title}</h3>
      <p className="mt-3 text-[0.98rem] leading-7 text-neutral-700">{description}</p>
      <span className="mt-auto pt-5 text-sm font-semibold text-neutral-900 transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </Link>
  );
}

export default function ModuleLayout({ module }: ModuleLayoutProps) {
  const pathLabel = module.breadcrumb[1]?.label;

  return (
    <div className="bg-[linear-gradient(180deg,#fcf8f2_0%,#f8efe4_34%,#fffdfa_100%)]">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-8 md:pb-24 md:pt-14 lg:px-10">
        <div className="space-y-10">
          <Breadcrumbs items={module.breadcrumb} />

          <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(114,90,77,0.12)] bg-[linear-gradient(135deg,rgba(255,253,249,0.98)_0%,rgba(249,240,231,0.96)_100%)] px-6 py-8 shadow-[0_26px_60px_rgba(48,31,24,0.08)] sm:px-8 sm:py-10 md:px-10 md:py-12">
            <div className="pointer-events-none absolute right-[-4rem] top-[-4rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(223,183,161,0.28)_0%,rgba(223,183,161,0)_70%)] blur-2xl" />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-end">
              <div>
                <p className="text-[0.75rem] uppercase tracking-[0.24em] text-[#8A6C62]">{module.title}</p>
                <h1 className="mt-4 max-w-[14ch] font-serif text-[2.9rem] leading-[0.92] tracking-[-0.05em] text-neutral-900 sm:text-[3.3rem] md:text-[3.8rem]">
                  {module.title}
                </h1>
                <p className="mt-5 max-w-[44rem] text-[1.08rem] leading-8 text-neutral-700">{module.subhead}</p>
              </div>

              <div className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/82 shadow-[0_18px_36px_rgba(48,31,24,0.08)]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={module.imagePath}
                    alt={module.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 24rem, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <ProgressBar current={module.progress.current} total={module.progress.total} pathLabel={pathLabel} />

          <section className="rounded-[1.8rem] border border-[rgba(114,90,77,0.1)] bg-white/88 px-6 py-8 shadow-[0_16px_34px_rgba(48,31,24,0.05)] sm:px-8 md:px-10">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">Editorial Intro</p>
            <div className="mt-5 max-w-[46rem] space-y-5 text-[1.04rem] leading-8 text-neutral-700">
              {module.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">Core Considerations</p>
              <h2 className="mt-3 font-serif text-[2.2rem] leading-[0.96] tracking-[-0.04em] text-neutral-900 sm:text-[2.6rem]">
                What actually shapes this decision
              </h2>
            </div>

            <div className="space-y-10">
              {module.coreSections.map((section) => (
                <article
                  key={section.title}
                  className="rounded-[1.8rem] border border-[rgba(114,90,77,0.1)] bg-white/92 px-6 py-8 shadow-[0_16px_34px_rgba(48,31,24,0.05)] sm:px-8 md:px-10"
                >
                  <h3 className="font-serif text-[1.8rem] leading-[1] tracking-[-0.03em] text-neutral-900 sm:text-[2rem]">
                    {section.title}
                  </h3>
                  <div className="mt-5 max-w-[46rem] space-y-5 text-[1.02rem] leading-8 text-neutral-700">
                    {section.paragraphs.map((paragraph) => (
                      <p key={`${section.title}-${paragraph}`}>{paragraph}</p>
                    ))}
                  </div>

                  <figure className="mt-8 overflow-hidden rounded-2xl border border-[rgba(114,90,77,0.1)] bg-[#F8F1E9]">
                    <div className="relative aspect-[16/9] w-full">
                      <Image
                        src={section.imageSrc}
                        alt={section.imageAlt}
                        fill
                        sizes="(min-width: 1280px) 72rem, (min-width: 768px) 90vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    {section.imageCaption ? (
                      <figcaption className="px-5 py-4 text-sm leading-6 text-neutral-600 sm:px-6">
                        {section.imageCaption}
                      </figcaption>
                    ) : null}
                  </figure>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[1.8rem] border border-[rgba(114,90,77,0.1)] bg-white/92 px-6 py-8 shadow-[0_16px_34px_rgba(48,31,24,0.05)] sm:px-8 md:px-10">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">{module.decisionTitle}</p>
            <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-neutral-900 sm:text-[2.4rem]">
              What this means for your real life
            </h2>
            <ul className="mt-6 space-y-4 text-[1rem] leading-8 text-neutral-700">
              {module.decisionBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-[0.9rem] h-2 w-2 shrink-0 rounded-full bg-[#B87E66]"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </section>

          {module.products.length > 0 ? (
            <section className="space-y-6">
              <div className="max-w-3xl">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">Product Examples</p>
                <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-neutral-900 sm:text-[2.4rem]">
                  Guided examples, not a ranking
                </h2>
                <p className="mt-4 text-[1rem] leading-8 text-neutral-700">
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

          <section className="rounded-[1.9rem] border border-[rgba(114,90,77,0.12)] bg-[linear-gradient(135deg,#fffaf5_0%,#f6ede3_100%)] px-6 py-8 shadow-[0_18px_38px_rgba(48,31,24,0.06)] sm:px-8 md:px-10">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">{module.softCtaLabel}</p>
            <h2 className="mt-3 max-w-[26ch] font-serif text-[2rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.35rem]">
              {module.softCtaTitle}
            </h2>
            <div className="mt-4 max-w-[40rem] space-y-4 text-[1rem] leading-8 text-neutral-700">
              {module.softCtaBody.map((paragraph) => (
                <p key={`${module.slug}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-6">
              {module.trackingGuideId ? (
                <GuideTrackedLink
                  guideId={module.trackingGuideId}
                  href="/consultation"
                  event={GuideAnalyticsEvents.TO_CONSULTATION_CLICK}
                  sourceRoute={module.href}
                  className="btn btn--secondary"
                  meta={{
                    ctaLabel: 'Work with me',
                    label: 'academy_work_with_me',
                  }}
                >
                  {'Work with me ->'}
                </GuideTrackedLink>
              ) : (
                <Link href="/consultation" className="btn btn--secondary">
                  {'Work with me ->'}
                </Link>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#8A6C62]">Next Steps</p>
              <h2 className="mt-3 font-serif text-[2.1rem] leading-[0.97] tracking-[-0.04em] text-neutral-900 sm:text-[2.4rem]">
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
