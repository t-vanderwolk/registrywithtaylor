import Image from 'next/image';
import GuideSignoffMark from '@/components/blog/GuideSignoffMark';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

export default function HomeEditorialBreak({
  imageSrc,
  imageAlt = '',
  tone = 'white',
  eyebrow = 'A quieter moment',
  title = 'Some decisions get better when the noise dies down.',
  description = 'That is usually when you can tell what actually matters and what was just taking up space.',
}: {
  imageSrc: string;
  imageAlt?: string;
  tone?: 'white' | 'blush' | 'linen';
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const toneClassName =
    tone === 'blush'
      ? 'bg-[linear-gradient(180deg,#fff8f7_0%,#f9eff1_100%)]'
      : tone === 'linen'
        ? 'bg-[linear-gradient(180deg,#f8f4ee_0%,#f4eee6_100%)]'
        : 'bg-white';

  return (
    <section className={`py-14 md:py-20 ${toneClassName}`.trim()}>
      <div className="mx-auto max-w-6xl px-6">
        <RevealOnScroll>
          <div className="relative isolate overflow-hidden rounded-[2.35rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.99)_0%,rgba(250,242,239,0.97)_100%)] p-4 shadow-[0_28px_68px_rgba(55,40,46,0.08)] sm:p-5 lg:p-6">
            <div className="pointer-events-none absolute left-[-4rem] top-6 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.16)_0%,rgba(232,154,174,0)_72%)] blur-3xl" />
            <div className="pointer-events-none absolute right-[-3rem] bottom-[-2rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(196,156,94,0.14)_0%,rgba(196,156,94,0)_74%)] blur-3xl" />

            <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,#fffdfa_0%,#f6eee6_100%)] shadow-[0_22px_48px_rgba(46,30,35,0.08)]">
                <div className="absolute inset-x-0 top-0 z-[1] h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0)_72%)]" />
                <div className="relative aspect-[16/8.6] min-h-[18rem] sm:min-h-[20rem]">
                  <div className="absolute inset-0 p-4 sm:p-6 md:p-7">
                    <div className="relative h-full w-full">
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(min-width: 1024px) 56rem, 100vw"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.65rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,252,252,0.98)_0%,rgba(249,239,243,0.95)_100%)] p-5 shadow-[0_18px_36px_rgba(55,40,46,0.07)] sm:p-6">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
                <h3
                  className="mt-3 text-[2.15rem] font-semibold leading-[0.9] tracking-[0.01em] text-[#D986A2] sm:text-[2.65rem]"
                  style={{ fontFamily: '"Caveat", cursive' }}
                >
                  {title}
                </h3>
                <p className="mt-4 max-w-none text-[0.96rem] leading-7 text-[#5B4B55]">{description}</p>
                <div className="mt-6 text-[#D986A2]">
                  <GuideSignoffMark className="h-auto w-[7.5rem] max-w-full" />
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
