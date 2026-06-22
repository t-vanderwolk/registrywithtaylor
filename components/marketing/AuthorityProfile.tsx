import Link from 'next/link';
import MarketingSection from '@/components/layout/MarketingSection';
import CheckIcon from '@/components/ui/CheckIcon';
import MotionCtaContent from '@/components/ui/MotionCtaContent';
import SectionIntro from '@/components/ui/SectionIntro';
import Image from 'next/image';

const experienceLogos = [
  {
    src: '/assets/logos/strolleria.png',
    alt: 'Strolleria logo',
    label: 'Strolleria',
    width: 1844,
    height: 457,
  },
  {
    src: '/assets/brand/potterybarnkids.png',
    alt: 'Pottery Barn Kids logo',
    label: 'PBKids',
    width: 860,
    height: 164,
  },
  {
    src: '/assets/brand/totsquad.png',
    alt: 'Baby Concierge powered by Tot Squad logo',
    label: 'Tot Squad',
    width: 1065,
    height: 228,
  },
] as const;

type AuthorityProfileProps = {
  title?: string;
  description?: string;
  experience: readonly string[];
  expertise: readonly string[];
  className?: string;
};

export default function AuthorityProfile({
  title = 'Meet Your Baby Gear Expert',
  description = 'Taylor translates baby gear noise into confident decisions by combining product expertise, real retail context, and private planning guidance.',
  experience,
  expertise,
  className = '',
}: AuthorityProfileProps) {
  return (
    <MarketingSection tone="ivory" spacing="spacious" className={className}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(19rem,0.98fr)] lg:items-start lg:gap-12 xl:gap-16">
        <div className="space-y-7 lg:pr-4">
          <SectionIntro
            align="left"
            eyebrow="Advisor Profile"
            title={title}
            description={description}
            contentWidthClassName="max-w-[38rem]"
          />

          <div className="rounded-[1.8rem] border border-[rgba(174,132,145,0.2)] bg-[linear-gradient(180deg,#ffffff_0%,#f9f1ec_100%)] p-6 shadow-[0_20px_48px_rgba(48,31,37,0.07)] sm:p-7">
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#7A626C]">What Taylor helps you sort</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:gap-x-8">
              {expertise.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4 rounded-[1.1rem] border border-[rgba(174,132,145,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(250,242,239,0.96)_100%)] px-4 py-4 shadow-[0_12px_26px_rgba(57,39,45,0.05)]"
                >
                  <div className="inline-flex rounded-full border border-[rgba(215,161,175,0.18)] bg-white/92 px-2.5 py-2 shadow-[0_8px_18px_rgba(58,36,43,0.06)]">
                    <CheckIcon frameClassName="mt-0" />
                  </div>
                  <p className="max-w-none text-[0.98rem] font-medium leading-8 text-[#41353B]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
            <Link href="/consultation" className="btn btn--primary w-full sm:w-auto">
              <MotionCtaContent>Book a Registry Consult</MotionCtaContent>
            </Link>
          </div>
        </div>

        <div className="lg:pt-2">
          <div className="mx-auto max-w-[29rem] lg:mx-0 lg:ml-auto">
            <div className="rounded-[2rem] border border-[rgba(196,156,94,0.22)] bg-[linear-gradient(180deg,#ffffff_0%,#fcf5f1_100%)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.07)] sm:p-7">
              <p className="text-[0.72rem] uppercase tracking-[0.22em] text-black/45">Experience includes</p>
              <h3 className="mt-4 font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900 sm:text-[2.2rem]">
                Hands-on Baby Gear Expertise
              </h3>

              <div className="mt-5 space-y-4">
                {experience.map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <CheckIcon frameClassName="mt-0.5" />
                    <p className="max-w-none text-[0.98rem] leading-8 text-neutral-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {experienceLogos.map((logo) => (
                  <div
                    key={logo.label}
                    className="flex min-h-[5rem] items-center justify-center rounded-[1.15rem] border border-[rgba(0,0,0,0.06)] bg-white px-3 py-4"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      sizes="(min-width: 1024px) 7rem, 28vw"
                      className="h-auto max-h-9 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="mt-6 inline-flex min-h-[44px] items-center text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-dark)] transition-opacity duration-200 hover:opacity-75"
              >
                <MotionCtaContent align="start" showArrow>
                  Meet Taylor
                </MotionCtaContent>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingSection>
  );
}
