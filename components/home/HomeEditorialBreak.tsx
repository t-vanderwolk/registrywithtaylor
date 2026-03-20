import Image from 'next/image';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function HomeEditorialBreak({
  imageSrc,
  imageAlt = '',
  tone = 'white',
}: {
  imageSrc: string;
  imageAlt?: string;
  tone?: 'white' | 'blush' | 'linen';
}) {
  const toneClassName =
    tone === 'blush'
      ? 'bg-[linear-gradient(180deg,#fff8f7_0%,#f9eff1_100%)]'
      : tone === 'linen'
        ? 'bg-[linear-gradient(180deg,#f8f4ee_0%,#f4eee6_100%)]'
        : 'bg-white';

  return (
    <section className={`py-12 md:py-16 ${toneClassName}`.trim()}>
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(0,0,0,0.06)] shadow-[0_22px_55px_rgba(0,0,0,0.06)]">
            <div className="relative aspect-[16/7] min-h-[16rem] bg-[#f6f1eb]">
              <Image src={imageSrc} alt={imageAlt} fill sizes="(min-width: 1024px) 72rem, 100vw" className="object-cover" />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
