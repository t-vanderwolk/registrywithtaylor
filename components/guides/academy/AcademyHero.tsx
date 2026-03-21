import type { ReactNode } from 'react';
import AcademyStageNav, { type AcademyStageNavItem } from '@/components/guides/academy/AcademyStageNav';

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
}) {
  const hasAsideContent = stats.length > 0 || Boolean(note) || Boolean(asideSlot);

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(251,245,239,0.97),rgba(255,250,252,0.96)_54%,rgba(247,231,236,0.88))] px-5 py-10 shadow-[0_35px_120px_rgba(71,44,53,0.10)] sm:rounded-[2.5rem] sm:px-8 sm:py-12 lg:px-12 lg:py-14">
      <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_top,rgba(215,161,175,0.18),transparent_62%)] lg:block" />

      <div className="relative space-y-10">
        <div className={`grid gap-8 ${hasAsideContent ? 'lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.72fr)] lg:items-start' : ''}`}>
          <div className="min-w-0 max-w-3xl">
            {parentLink ? (
              <a
                href={parentLink.href}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.16)] bg-white/82 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-[#8F4C62] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {parentLink.label}
              </a>
            ) : null}
            <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#9F556D]">{eyebrow}</p>
            <h1 className="mt-4 max-w-[13ch] text-balance text-[clamp(2.35rem,10vw,4rem)] font-medium leading-[0.96] tracking-[-0.04em] text-[#2F2430] sm:max-w-4xl sm:leading-[1.01] lg:leading-[1.02]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-[0.98rem] leading-7 text-[#5B4B55] sm:text-lg sm:leading-8">{description}</p>

            {primaryCta || secondaryCta ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
          </div>

          {hasAsideContent ? (
            <div className="min-w-0 rounded-[1.8rem] border border-[rgba(215,161,175,0.14)] bg-white/78 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:rounded-[2rem] sm:p-6">
              {stats.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-[1.4rem] bg-[rgba(250,244,246,0.92)] px-4 py-4">
                      <p className="text-[0.68rem] uppercase tracking-[0.26em] text-[#A15B72]">{stat.label}</p>
                      <p className="mt-2 text-base font-medium text-[#2F2430]">{stat.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {note ? (
                <div className={stats.length > 0 ? 'mt-5' : ''}>
                  <p className="text-[0.68rem] uppercase tracking-[0.26em] text-[#A15B72]">TMBC Note</p>
                  <p className="mt-3 text-base leading-7 text-[#4B3641]">{note}</p>
                </div>
              ) : null}

              {asideSlot ? <div className={stats.length > 0 || note ? 'mt-5' : ''}>{asideSlot}</div> : null}
            </div>
          ) : null}
        </div>

        {stageItems.length > 0 ? <AcademyStageNav items={stageItems} /> : null}
      </div>
    </section>
  );
}
