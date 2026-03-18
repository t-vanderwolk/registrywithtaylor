import Image from 'next/image';
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
  variant?: 'default' | 'stroller-hub' | 'stroller-category';
}) {
  const shouldSkipImageOptimization = imageSrc ? isRemoteImageUrl(imageSrc) : false;
  const isEditorialStrollerLayout = variant === 'stroller-hub' || variant === 'stroller-category';
  const displayTitle = variant === 'stroller-hub' ? 'The Taylor-Made Stroller Guide' : title;
  const stats = [
    { label: 'Estimated read', value: readTime },
    ...(publishedLabel ? [{ label: 'Published', value: publishedLabel }] : []),
    ...(sectionCount ? [{ label: 'Sections', value: String(sectionCount) }] : []),
  ];

  return (
    <section className="border-b border-black/5 bg-[linear-gradient(180deg,#fbf7f2_0%,#f4ede3_100%)]">
      <div
        className={`mx-auto gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 lg:py-16 ${
          isEditorialStrollerLayout
            ? 'max-w-[1300px] lg:px-8'
            : 'grid max-w-7xl lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10 lg:px-10'
        }`}
      >
        <div
          className={
            isEditorialStrollerLayout
              ? 'space-y-5 rounded-[1.75rem] border border-black/6 bg-white/78 p-5 text-center shadow-[0_20px_48px_rgba(0,0,0,0.05)] backdrop-blur-[2px] sm:space-y-6 sm:p-6 lg:rounded-[2rem] lg:p-8'
              : 'space-y-5 sm:space-y-6'
          }
        >
          <div className="space-y-4">
            <p className="text-[0.76rem] uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
            <h1
              className={`font-serif leading-[0.95] tracking-[-0.05em] text-neutral-900 ${
                isEditorialStrollerLayout
                  ? 'mx-auto max-w-[13ch] text-[2.05rem] sm:max-w-[12ch] sm:text-[3.2rem] lg:max-w-[10.5ch] lg:text-[4.35rem]'
                  : 'max-w-[12ch] text-[2.15rem] sm:max-w-[13ch] sm:text-[3.4rem] lg:text-[4.35rem]'
              }`}
            >
              {displayTitle}
            </h1>
            <p
              className={`max-w-[44rem] text-neutral-700 ${
                isEditorialStrollerLayout
                  ? 'mx-auto text-[0.96rem] leading-6 sm:text-[1.04rem] sm:leading-8'
                  : 'text-[0.98rem] leading-7 md:text-[1.08rem] md:leading-8'
              }`}
            >
              {description}
            </p>
          </div>

          {isEditorialStrollerLayout ? (
            <div className="grid grid-cols-2 gap-2.5 sm:mx-auto sm:flex sm:w-fit sm:flex-wrap sm:justify-center sm:gap-3">
              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${stat.value}`}
                  className={`rounded-[1rem] border border-black/6 bg-white/88 px-3 py-3 text-neutral-700 sm:rounded-full sm:px-4 sm:py-2 ${
                    stats.length % 2 === 1 && index === stats.length - 1 ? 'col-span-2' : ''
                  }`}
                >
                  <span className="block text-[0.62rem] uppercase tracking-[0.18em] text-black/42 sm:mr-2 sm:inline">
                    {stat.label}
                  </span>
                  <span className="mt-1 block text-[0.92rem] text-neutral-900 sm:mt-0 sm:inline sm:text-sm">{stat.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {stats.map((stat) => (
                <div
                  key={`${stat.label}-${stat.value}`}
                  className="rounded-full border border-black/6 bg-white/88 px-3 py-2 text-[0.92rem] text-neutral-700 sm:px-4 sm:text-sm"
                >
                  <span className="mr-2 text-[0.66rem] uppercase tracking-[0.18em] text-black/42">{stat.label}</span>
                  <span className="text-neutral-900">{stat.value}</span>
                </div>
              ))}
            </div>
          )}

          {jumpLinks.length > 0 ? (
            <div
              className={`rounded-[1.45rem] border border-black/6 bg-white/84 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.05)] sm:rounded-[1.6rem] sm:p-5 ${
                isEditorialStrollerLayout
                  ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(250,244,240,0.95)_100%)]'
                  : ''
              }`}
            >
              <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">Jump to</p>
              <div
                className={`mt-4 ${
                  isEditorialStrollerLayout
                    ? 'grid grid-cols-2 gap-2.5 sm:mx-auto sm:flex sm:w-fit sm:flex-wrap sm:justify-center sm:gap-3'
                    : 'flex gap-2.5 overflow-x-auto pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:pb-0'
                }`}
              >
                {jumpLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`rounded-full border border-black/6 bg-[rgba(248,243,238,0.92)] px-4 py-2 text-sm text-neutral-800 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.28)] hover:bg-white ${
                      isEditorialStrollerLayout ? 'text-center' : 'shrink-0 whitespace-nowrap'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {imageSrc ? (
          <div
            className={`relative overflow-hidden border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.08)] ${
              isEditorialStrollerLayout
                ? 'mt-6 rounded-[1.75rem] p-2 sm:mt-8 sm:rounded-[2rem] sm:p-3 lg:-mx-8 lg:mt-10 lg:rounded-none lg:border-x-0 lg:border-b-0 lg:p-0'
                : 'rounded-[1.7rem] sm:rounded-[2rem]'
            }`}
          >
            <div
              className={`relative overflow-hidden ${
                isEditorialStrollerLayout
                  ? 'aspect-[4/3.1] rounded-[1.25rem] sm:rounded-[1.5rem] lg:aspect-[16/6.4] lg:rounded-none'
                  : 'aspect-[4/3.65]'
              }`}
            >
              <Image
                src={imageSrc}
                alt={imageAlt?.trim() || title}
                fill
                priority
                sizes={isEditorialStrollerLayout ? '(min-width: 1024px) 1300px, 100vw' : '(min-width: 1024px) 40vw, 100vw'}
                className="object-cover"
                unoptimized={shouldSkipImageOptimization}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
