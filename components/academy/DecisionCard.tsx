import Image from 'next/image';
import { isRemoteImageUrl } from '@/lib/blog/images';

type DecisionCardProps = {
  eyebrow?: string;
  title: string;
  paragraphs: readonly string[];
  example?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageFit?: 'cover' | 'contain';
  tone?: 'white' | 'ivory' | 'blush';
  className?: string;
};

export default function DecisionCard({
  eyebrow = 'Decision section',
  title,
  paragraphs,
  example,
  imageSrc,
  imageAlt,
  imageCaption,
  imageFit = 'contain',
  tone = 'white',
  className = '',
}: DecisionCardProps) {
  const visibleParagraphs = paragraphs.filter((paragraph) => paragraph.trim());
  const backgroundClassName =
    tone === 'blush'
      ? 'bg-[linear-gradient(180deg,rgba(255,248,251,0.98)_0%,rgba(252,241,245,0.94)_100%)]'
      : tone === 'ivory'
        ? 'bg-[linear-gradient(180deg,#fffdf8_0%,#f8f1e8_100%)]'
        : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,250,251,0.94)_100%)]';
  const shouldSkipOptimization = imageSrc ? isRemoteImageUrl(imageSrc) : false;

  return (
    <article
      className={[
        'overflow-hidden rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] shadow-[0_18px_42px_rgba(58,36,43,0.07)]',
        backgroundClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="px-6 py-6 sm:px-7 sm:py-7">
        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{eyebrow}</p>
        <h3 className="mt-4 max-w-3xl font-serif text-[1.55rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430] sm:text-[1.72rem]">
          {title}
        </h3>
        <div className="mt-4 space-y-4 text-[0.98rem] leading-8 text-[#5B4B55] sm:text-[1rem]">
          {visibleParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {example ? (
          <div className="mt-6 rounded-[1.25rem] border border-[rgba(215,161,175,0.14)] bg-white/82 px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Real life</p>
            <p className="mt-3 text-[0.96rem] leading-7 text-[#5B4B55]">{example}</p>
          </div>
        ) : null}
      </div>

      {imageSrc && imageAlt ? (
        <figure className="border-t border-[rgba(215,161,175,0.14)] bg-white/74 px-5 py-5 sm:px-6">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-white/80">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 40rem, 100vw"
              className={imageFit === 'cover' ? 'object-cover' : 'object-contain p-4'}
              unoptimized={shouldSkipOptimization}
            />
          </div>
          {imageCaption ? (
            <figcaption className="pt-4 text-[13px] leading-6 text-[#7B5A68]">{imageCaption}</figcaption>
          ) : null}
        </figure>
      ) : null}
    </article>
  );
}
