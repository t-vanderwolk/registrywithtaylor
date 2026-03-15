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
}) {
  const shouldSkipImageOptimization = imageSrc ? isRemoteImageUrl(imageSrc) : false;

  return (
    <section className="border-b border-black/5 bg-[linear-gradient(180deg,#fbf7f2_0%,#f4ede3_100%)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-10 lg:px-10 lg:py-16">
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-[0.76rem] uppercase tracking-[0.26em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
            <h1 className="max-w-[12ch] font-serif text-[2.45rem] leading-[0.95] tracking-[-0.05em] text-neutral-900 sm:max-w-[13ch] sm:text-[3.4rem] lg:text-[4.35rem]">
              {title}
            </h1>
            <p className="max-w-[44rem] text-[1.02rem] leading-8 text-neutral-700 md:text-[1.08rem]">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-full border border-black/6 bg-white/88 px-4 py-2 text-sm text-neutral-700">
              <span className="mr-2 text-[0.66rem] uppercase tracking-[0.18em] text-black/42">Estimated read</span>
              <span className="text-neutral-900">{readTime}</span>
            </div>
            {publishedLabel ? (
              <div className="rounded-full border border-black/6 bg-white/88 px-4 py-2 text-sm text-neutral-700">
                <span className="mr-2 text-[0.66rem] uppercase tracking-[0.18em] text-black/42">Published</span>
                <span className="text-neutral-900">{publishedLabel}</span>
              </div>
            ) : null}
            {sectionCount ? (
              <div className="rounded-full border border-black/6 bg-white/88 px-4 py-2 text-sm text-neutral-700">
                <span className="mr-2 text-[0.66rem] uppercase tracking-[0.18em] text-black/42">Sections</span>
                <span className="text-neutral-900">{sectionCount}</span>
              </div>
            ) : null}
          </div>

          {jumpLinks.length > 0 ? (
            <div className="rounded-[1.6rem] border border-black/6 bg-white/84 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
              <p className="text-[0.72rem] uppercase tracking-[0.2em] text-black/48">Jump to</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {jumpLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-black/6 bg-[rgba(248,243,238,0.92)] px-4 py-2 text-sm text-neutral-800 transition hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.28)] hover:bg-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {imageSrc ? (
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
            <div className="relative aspect-[4/3.65]">
              <Image
                src={imageSrc}
                alt={imageAlt?.trim() || title}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
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
