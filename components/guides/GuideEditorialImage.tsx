import Image from 'next/image';

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
  return (
    <figure className="overflow-hidden rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#f8efe8_100%)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:p-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.45rem] border border-black/6 bg-[#f7f2eb] md:aspect-[16/9]">
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
      </div>
      <figcaption className="px-1 pb-1 pt-4">
        <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <p className="mt-2 text-sm leading-7 text-neutral-700">{caption}</p>
      </figcaption>
    </figure>
  );
}
