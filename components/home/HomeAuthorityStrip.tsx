import Image from 'next/image';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type HomeAuthorityLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
};

export default function HomeAuthorityStrip({
  text,
  logos = [],
}: {
  text: string;
  logos?: readonly HomeAuthorityLogo[];
}) {
  return (
    <section className="border-y border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#fbf7f3_0%,#f8f2ec_100%)] py-5 md:py-6">
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="max-w-4xl text-[0.78rem] uppercase tracking-[0.16em] text-black/52 md:text-[0.82rem]">
              {text}
            </p>

            {logos.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 md:gap-x-10">
                {logos.map((logo) => (
                  <div key={logo.src} className="flex h-6 items-center justify-center opacity-55 grayscale transition duration-300 hover:opacity-75">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      sizes="(min-width: 768px) 8rem, 30vw"
                      className={['h-auto w-auto object-contain', logo.className ?? 'max-h-5'].join(' ')}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
