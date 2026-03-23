import Image from 'next/image';
import GuideInkBadge from '@/components/guides/GuideInkBadge';

export default function GuideEditorialImage({
  eyebrow = 'Editorial break',
  src,
  alt,
  caption,
}: {
  eyebrow?: string;
  src: string;
  alt: string;
  caption: string;
}) {
  const isPlaceholder = src.includes('/placeholders/') || src.includes('/placeholder');

  return (
    <figure className="overflow-hidden rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8efe8_100%)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:p-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.45rem] border border-black/6 bg-[#f7f2eb] md:aspect-[16/9]">
        {isPlaceholder ? (
          <div className="absolute left-3 top-3 z-[2] md:left-4 md:top-4">
            <GuideInkBadge label="image note" className="bg-white/82" />
          </div>
        ) : null}
        <div className="absolute inset-0 p-3 md:p-4">
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="object-contain object-center"
            />
          </div>
        </div>

        {isPlaceholder ? (
          <div className="pointer-events-none absolute bottom-3 right-3 z-[2] max-w-[9.5rem] rotate-[-4deg] rounded-[1rem] border border-[#D986A2]/20 bg-white/84 px-2.5 py-2 shadow-[0_12px_26px_rgba(58,36,43,0.08)] sm:bottom-4 sm:right-4 sm:max-w-[13rem] sm:px-3">
            <p
              className="text-[0.9rem] leading-none text-[#B86584] sm:text-[1.05rem]"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              Drop the editorial image here.
            </p>
          </div>
        ) : null}
      </div>
      <figcaption className="px-1 pb-1 pt-4">
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <p className="mt-2 text-sm leading-7 text-neutral-700">{caption}</p>
      </figcaption>
    </figure>
  );
}
