import Image from 'next/image';
import AcademyHero from '@/components/guides/academy/AcademyHero';
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
    : 'object-contain object-center p-3 md:object-cover md:p-0';
  const displayTitle = variant === 'stroller-hub' ? 'The Taylor-Made Stroller Guide' : title;
  const stats = [
    { label: 'Read time', value: readTime },
    ...(publishedLabel ? [{ label: 'Published', value: publishedLabel }] : []),
    ...(sectionCount ? [{ label: 'Sections', value: String(sectionCount) }] : []),
  ];
  const stageItems = jumpLinks.map((link, index) => ({
    id: `guide-stage-${index + 1}`,
    label: String(index + 1).padStart(2, '0'),
    title: link.label,
    description: 'Jump into this part of the guide next.',
    href: link.href,
  }));
  const primaryCta = jumpLinks[0]
    ? {
        href: jumpLinks[0].href,
        label: jumpLinks[0].label,
      }
    : undefined;
  const secondaryCta = jumpLinks[1]
    ? {
        href: jumpLinks[1].href,
        label: jumpLinks[1].label,
      }
    : parentLink
      ? {
          href: parentLink.href,
          label: parentLink.label,
        }
      : undefined;

  return (
    <section className="bg-[linear-gradient(180deg,#FBF7F8_0%,#FFFFFF_100%)]">
      <div className="mx-auto w-full max-w-[1520px] px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-24 xl:px-12">
        <AcademyHero
          eyebrow={eyebrow}
          title={displayTitle}
          description={description}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          stageItems={stageItems}
          stats={stats}
          parentLink={parentLink ? { href: parentLink.href, label: parentLink.label } : undefined}
          asideSlot={
            showHeroImage ? (
              <div className="overflow-hidden rounded-[1.6rem] border border-[rgba(215,161,175,0.16)] bg-white shadow-[0_16px_44px_rgba(58,36,43,0.10)]">
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
            ) : undefined
          }
        />
      </div>
    </section>
  );
}
