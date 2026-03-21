import Image from 'next/image';
import Link from 'next/link';
import { isRemoteImageUrl } from '@/lib/blog/images';
import type { GuideHeroJumpLink } from '@/lib/guides/hubs';

export default function GuideHero({
  eyebrow,
  title,
  description,
  readTime,
  publishedLabel,
  sectionCount,
  jumpLinks,
  imageSrc,
  imageAlt,
  variant = 'default',
  parentLink,
}: {
  eyebrow: string;
  title: string;
  description: string;
  readTime: string;
  publishedLabel?: string;
  sectionCount?: number;
  jumpLinks: GuideHeroJumpLink[];
  imageSrc?: string | null;
  imageAlt?: string | null;
  variant?: 'default' | 'guide-hub' | 'stroller-hub' | 'stroller-category';
  parentLink?: {
    href: string;
    label: string;
  } | null;
}) {
  const shouldSkipImageOptimization = imageSrc ? isRemoteImageUrl(imageSrc) : false;
  const isEditorialStrollerLayout =
    variant === 'guide-hub' || variant === 'stroller-hub' || variant === 'stroller-category';
  const showHeroImage = Boolean(imageSrc && variant !== 'stroller-category');
  const heroImageSrc = showHeroImage ? imageSrc! : '';
  const heroImageClassName = isEditorialStrollerLayout
    ? 'object-contain object-center p-4 md:p-5'
    : 'object-cover';
  const displayTitle = variant === 'stroller-hub' ? 'The Taylor-Made Stroller Guide' : title;
  const stats = [
    { label: 'Read time', value: readTime },
    ...(publishedLabel ? [{ label: 'Published', value: publishedLabel }] : []),
    ...(sectionCount ? [{ label: 'Sections', value: String(sectionCount) }] : []),
  ];

  return (
    <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
      <div className="mx-auto w-full max-w-[1520px] px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-24 xl:px-12">
        <div className={`grid gap-8 ${showHeroImage ? 'lg:grid-cols-[minmax(0,1.14fr)_24rem] lg:items-center lg:gap-10' : ''}`}>
          <div className="space-y-8">
            <div className="space-y-5">
              {parentLink ? (
                <Link
                  href={parentLink.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/6 bg-white px-4 py-2 text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)] transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <span aria-hidden="true">-&lt;</span>
                  <span>{parentLink.label}</span>
                </Link>
              ) : null}

              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
              <h1 className="max-w-[16ch] text-4xl font-serif tracking-tight text-charcoal md:text-5xl">{displayTitle}</h1>
              <p className="max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">{description}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {stats.map((stat) => (
                <div
                  key={`${stat.label}-${stat.value}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-white/92 px-4 py-2 text-sm text-neutral-700"
                >
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/78">{stat.label}</span>
                  <span className="text-charcoal">{stat.value}</span>
                </div>
              ))}
            </div>

            {jumpLinks.length > 0 ? (
              <div className="rounded-2xl border border-black/6 bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/78">Jump to</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {jumpLinks.map((link) => (
                    <a
                      key={`${link.href}-${link.label}`}
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center rounded-full border border-[rgba(215,161,175,0.22)] bg-[#FCFAFB] px-4 py-2 text-sm text-charcoal transition duration-200 hover:-translate-y-1 hover:shadow-md"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {showHeroImage ? (
            <div className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white shadow-sm">
              <div className={`relative ${isEditorialStrollerLayout ? 'aspect-[4/4.2]' : 'aspect-[4/5]'}`}>
                <Image
                  src={heroImageSrc}
                  alt={imageAlt?.trim() || title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  className={heroImageClassName}
                  unoptimized={shouldSkipImageOptimization}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
