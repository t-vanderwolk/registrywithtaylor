import Image from 'next/image';
import type { ReactNode } from 'react';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import AcademyStageNav, { type AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';
import { isRemoteImageUrl } from '@/lib/blog/images';

type HeroStat = {
  label: string;
  value: string;
};

type HeroCta = {
  label: string;
  href: string;
};

export default function AcademyHero({
  eyebrow,
  title,
  description,
  note,
  primaryCta,
  secondaryCta,
  stageItems = [],
  stats = [],
  parentLink,
  asideSlot,
  imageSrc,
  imageAlt,
  imageAspectClassName,
  imageObjectClassName,
  imagePriority = false,
  imageOverlaySlot,
  directionalHint = "Keep going -> we'll walk through this step by step",
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  stageItems?: AcademyStageNavItem[];
  stats?: HeroStat[];
  parentLink?: HeroCta;
  asideSlot?: ReactNode;
  imageSrc?: string | null;
  imageAlt?: string | null;
  imageAspectClassName?: string;
  imageObjectClassName?: string;
  imagePriority?: boolean;
  imageOverlaySlot?: ReactNode;
  directionalHint?: string;
}) {
  const trimmedImageSrc = imageSrc?.trim() || '';
  const hasHeroImage = Boolean(trimmedImageSrc);
  const shouldSkipHeroImageOptimization = hasHeroImage ? isRemoteImageUrl(trimmedImageSrc) : false;
  const hasFooterCards = stats.length > 0 || Boolean(note) || Boolean(asideSlot);

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(251,245,239,0.97),rgba(255,250,252,0.96)_54%,rgba(247,231,236,0.88))] px-3.5 py-5 shadow-[0_28px_90px_rgba(71,44,53,0.08)] sm:rounded-[2.5rem] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="relative space-y-5 sm:space-y-8">
        <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(135deg,rgba(252,247,241,0.98),rgba(255,252,253,0.97)_48%,rgba(247,233,238,0.86))] shadow-[0_28px_90px_rgba(71,44,53,0.10)] sm:rounded-[2.45rem]">
          <div className="pointer-events-none absolute left-[-4rem] top-[-3rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.16)_0%,rgba(232,154,174,0)_72%)] blur-3xl" />
          <div className="pointer-events-none absolute right-[-5rem] bottom-[-4rem] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(196,156,94,0.14)_0%,rgba(196,156,94,0)_74%)] blur-3xl" />

          {hasHeroImage ? (
            <div className="absolute inset-0">
              <Image
                src={trimmedImageSrc}
                alt={imageAlt?.trim() || title}
                fill
                priority={imagePriority}
                sizes="100vw"
                className={imageObjectClassName ?? 'object-cover object-right-center'}
                unoptimized={shouldSkipHeroImageOptimization}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(252,247,241,0.92)_0%,rgba(252,247,241,0.82)_26%,rgba(252,247,241,0.46)_56%,rgba(252,247,241,0.18)_100%)] lg:hidden" />
              <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,rgba(252,247,241,0.98)_0%,rgba(252,247,241,0.96)_24%,rgba(252,247,241,0.88)_38%,rgba(252,247,241,0.56)_52%,rgba(252,247,241,0.20)_70%,rgba(252,247,241,0)_86%)]" />
              <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(circle_at_right_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_42%)]" />
              {imageOverlaySlot}
            </div>
          ) : null}

          <div className={`relative z-10 flex min-h-[18rem] flex-col justify-between gap-7 px-4 py-5 sm:min-h-[24rem] sm:gap-10 sm:px-8 sm:py-10 lg:min-h-[clamp(26rem,58vh,38rem)] lg:px-12 lg:py-10 ${hasHeroImage ? 'lg:pr-[14rem] xl:pr-[18rem]' : ''}`}>
            <div className="min-w-0 max-w-3xl">
              {parentLink ? (
                <a
                  href={parentLink.href}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[rgba(161,91,114,0.16)] bg-white/82 px-4 py-2 text-[0.62rem] uppercase tracking-[0.2em] text-[#8F4C62] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-auto sm:text-[0.68rem] sm:tracking-[0.22em]"
                >
                  {parentLink.label}
                </a>
              ) : null}
              <p className="mt-3 text-[0.65rem] uppercase tracking-[0.24em] text-[#9F556D] sm:text-[0.72rem] sm:tracking-[0.34em]">
                {eyebrow}
              </p>
              <h1 className="mt-4 max-w-[10ch] text-balance text-[clamp(2.1rem,11vw,5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-[#2F2430] sm:max-w-[11ch] sm:leading-[0.98]">
                {title}
              </h1>
              <p className="mt-4 max-w-[39rem] text-[0.94rem] leading-7 text-[#5B4B55] sm:mt-6 sm:text-[1.08rem] sm:leading-8">
                {description}
              </p>

              {primaryCta || secondaryCta ? (
                <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                  {primaryCta ? (
                    <a
                      href={primaryCta.href}
                      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-center text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62] sm:w-auto"
                    >
                      {primaryCta.label}
                    </a>
                  ) : null}
                  {secondaryCta ? (
                    <a
                      href={secondaryCta.href}
                      className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/82 px-6 py-3 text-center text-sm font-medium text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:w-auto"
                    >
                      {secondaryCta.label}
                    </a>
                  ) : null}
                </div>
              ) : null}

              {directionalHint ? (
                <p className="mt-4 text-[0.92rem] leading-7 text-[#6A5660] sm:text-[0.98rem]">
                  {directionalHint}
                </p>
              ) : null}
            </div>

            {hasFooterCards ? (
              <div className="w-full max-w-5xl">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,0.9fr))]">
                  {note ? (
                    <GuideHandwrittenNote
                      className="h-full sm:col-span-2 xl:col-auto"
                      title={note}
                      size="compact"
                      presentation="margin"
                    />
                  ) : null}

                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="min-w-0 rounded-[1.3rem] border border-[rgba(215,161,175,0.14)] bg-white/84 px-3.5 py-3.5 shadow-[0_14px_28px_rgba(58,36,43,0.06)] backdrop-blur-[2px] sm:rounded-[1.45rem] sm:px-4 sm:py-4"
                    >
                      <p className="text-[0.68rem] uppercase tracking-[0.26em] text-[#A15B72]">{stat.label}</p>
                      <p className="mt-2 break-words text-[0.95rem] font-medium leading-6 text-[#2F2430] sm:text-base">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {asideSlot ? <div className="mt-4">{asideSlot}</div> : null}
              </div>
            ) : null}
          </div>
        </div>

        {stageItems.length > 0 ? <AcademyStageNav items={stageItems} /> : null}
      </div>
    </section>
  );
}
