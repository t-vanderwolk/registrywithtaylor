import GuideEditorialImage from '@/components/guides/GuideEditorialImage';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideLifestyleImage } from '@/lib/guides/experience';

export default function GuideLifestyleGallery({
  title = 'Picture It In Real Life',
  description = 'A guide should help you picture how the decision shows up in an ordinary week, not only in a polished product photo.',
  images,
}: {
  title?: string;
  description?: string;
  images: GuideLifestyleImage[];
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <RevealOnScroll>
      <section className="space-y-5">
        <div className="max-w-4xl space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.32em] text-[#A15B72]">Lifestyle imagery</p>
          <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#2F2430] md:text-[2.35rem]">{title}</h2>
          <p className="text-base leading-8 text-[#5B4B55] md:text-lg">{description}</p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {images.slice(0, 3).map((image) => (
            <GuideEditorialImage
              key={`${image.src}-${image.caption}`}
              eyebrow={image.eyebrow}
              src={image.src}
              alt={image.alt}
              caption={image.caption}
            />
          ))}
        </div>
      </section>
    </RevealOnScroll>
  );
}
