import Image from 'next/image';
import Link from 'next/link';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import {
  DAILY_USE_GEAR_ACADEMY_DECK,
  DAILY_USE_GEAR_ACADEMY_HUB_NEXT_LINKS,
  DAILY_USE_GEAR_ACADEMY_HUB_PATH,
  DAILY_USE_GEAR_ACADEMY_INTRO,
  DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS,
  DAILY_USE_GEAR_ACADEMY_PHILOSOPHY,
  DAILY_USE_GEAR_ACADEMY_PULL_QUOTE,
  DAILY_USE_GEAR_ACADEMY_REAL_LIFE_GUIDANCE,
  DAILY_USE_GEAR_ACADEMY_TITLE,
  getDailyUseGearAcademySubmoduleCards,
} from '@/lib/academy/dailyUseGearAcademy';

function LinkCard({
  href,
  eyebrow,
  title,
  description,
  ctaLabel,
}: {
  href: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.92)_100%)] p-5 shadow-[0_20px_48px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:shadow-[0_28px_62px_rgba(58,36,43,0.12)] sm:p-6"
    >
      {eyebrow ? <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p> : null}
      <h3 className="mt-4 font-serif text-[1.55rem] leading-[1.04] tracking-[-0.04em] text-[#2F2430] sm:text-[1.75rem]">
        {title}
      </h3>
      <p className="mt-4 text-[1rem] leading-8 text-[#5B4B55]">{description}</p>
      <span className="mt-auto pt-6 text-sm font-medium uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#2F2430] sm:text-[2.65rem]">
        {title}
      </h2>
      {description ? <p className="mt-4 text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.05rem]">{description}</p> : null}
    </div>
  );
}

const breadcrumbs = [
  { label: 'TMBC Academy', href: '/academy' },
  { label: 'Gear', href: '/academy/gear' },
  { label: DAILY_USE_GEAR_ACADEMY_TITLE },
];

const submoduleCards = getDailyUseGearAcademySubmoduleCards();

export default function DailyUseGearHub() {
  return (
    <section className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(244,224,209,0.7),transparent_30%),radial-gradient(circle_at_top_right,rgba(232,154,174,0.2),transparent_28%),linear-gradient(180deg,#fffdfa_0%,#fcf3f5_34%,#fffdf8_100%)]">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
        <GuideBreadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_45%,rgba(249,241,233,0.96)_100%)] shadow-[0_28px_72px_rgba(58,36,43,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
            <div className="px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">TMBC Gear Module</p>
              <h1 className="mt-4 max-w-[10ch] font-serif text-[2.45rem] leading-[0.92] tracking-[-0.06em] text-[#2F2430] sm:text-[4rem]">
                {DAILY_USE_GEAR_ACADEMY_TITLE}
              </h1>
              <p className="mt-5 max-w-[42rem] text-[1.08rem] leading-8 text-[#4B3641] sm:text-[1.18rem] sm:leading-9">
                {DAILY_USE_GEAR_ACADEMY_DECK}
              </p>

              <div className="mt-6 max-w-[44rem] space-y-4 text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">
                {DAILY_USE_GEAR_ACADEMY_INTRO.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="#daily-use-gear-submodules"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                >
                  Explore submodules
                </Link>
                <Link
                  href="/academy/gear"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(58,36,43,0.08)]"
                >
                  Back to Gear Path
                </Link>
              </div>
            </div>

            <div className="border-t border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#fdf7f8_0%,#fffdf9_100%)] lg:border-l lg:border-t-0">
              <div className="relative aspect-[5/4] border-b border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#f7efe6_0%,#f3e4dc_100%)]">
                <Image
                  src="/assets/editorial/babystuff.png"
                  alt="Editorial baby gear image for Daily Use Gear."
                  fill
                  priority
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="object-contain p-6 sm:p-8"
                />
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-[1.45rem] border border-[rgba(215,161,175,0.18)] bg-white/88 p-5 shadow-[0_18px_34px_rgba(58,36,43,0.06)]">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Pull quote</p>
                  <p className="mt-3 font-serif text-[1.38rem] leading-8 tracking-[-0.03em] text-[#4B3641]">
                    {DAILY_USE_GEAR_ACADEMY_PULL_QUOTE}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Gear path</p>
                    <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">Module 5 of 5</p>
                  </div>
                  <div className="rounded-[1.3rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4">
                    <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Inside this module</p>
                    <p className="mt-2 text-base font-medium leading-7 text-[#2F2430]">6 focused submodules</p>
                  </div>
                </div>

                <div className="rounded-[1.55rem] border border-[rgba(215,161,175,0.16)] bg-white/84 px-5 py-5">
                  <AcademyProgressBar current={5} total={5} label="Gear path progress" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-12 sm:px-8 md:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)] md:pb-16 lg:px-10">
        <section className="rounded-[1.85rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8">
          <SectionHeading
            eyebrow="What You'll Learn"
            title="How to judge the products that touch the day most"
            description="This module is built around the categories that get used constantly, cleaned constantly, and felt immediately if the fit is wrong."
          />

          <ul className="mt-6 space-y-3">
            {DAILY_USE_GEAR_ACADEMY_LEARNING_HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-[1.2rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.86)] px-4 py-4"
              >
                <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#D986A2]" />
                <span className="text-[1rem] leading-8 text-[#4B3641]">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[1.85rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,251,252,0.98)_0%,rgba(248,240,234,0.94)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8">
          <SectionHeading
            eyebrow="The TMBC Take"
            title="Daily use gear deserves calmer logic than it usually gets"
          />

          <div className="mt-6 space-y-4 text-[1rem] leading-8 text-[#5B4B55]">
            {DAILY_USE_GEAR_ACADEMY_PHILOSOPHY.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <GuideHandwrittenNote
            className="mt-6"
            tone="linen"
            size="compact"
            title="Parents do not need more products here. They need better guidance."
            description={
              <p>
                Daily-use gear works best when it is edited around the repeated parts of the day, not around the fear of missing one more thing.
              </p>
            }
          />
        </section>
      </div>

      <div id="daily-use-gear-submodules" className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <SectionHeading
          eyebrow="Submodules"
          title="Open the part of the routine that needs the clearer answer"
          description="Each submodule is built as a guided Academy page, not a roundup. The goal is to help you understand the job, test the fit, and buy less randomly."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {submoduleCards.map((card) => (
            <LinkCard key={card.href} {...card} />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8 md:pb-16 lg:px-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.92)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8">
            <SectionHeading
              eyebrow="Start Here"
              title="Start with your real life"
              description="This is the edit pass that keeps Daily Use Gear from turning into a pile of almost-right products."
            />

            <div className="mt-6 rounded-[1.6rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.86)] p-5 sm:p-6">
              <div className="space-y-3">
                {DAILY_USE_GEAR_ACADEMY_REAL_LIFE_GUIDANCE.map((line) => (
                  <p key={line} className="text-[1.02rem] leading-8 text-[#4B3641] sm:text-[1.08rem] sm:leading-9">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <GuideHandwrittenNote
            title="The right setup should make the day feel quieter."
            description={
              <p>
                Daily-use gear is not the place to perform preparedness. It is the place to support the routines you will repeat when no one is in the mood for friction.
              </p>
            }
            presentation="margin"
            showEyebrow
            eyebrow="Taylor's note"
          />
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 md:pb-24 lg:px-10">
        <SectionHeading
          eyebrow="Next Step"
          title="Keep the Academy moving"
          description="Daily Use Gear is the final core Gear module. Use the links below to revisit the last Gear decision or continue the Academy into the adult side of early parenthood."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {DAILY_USE_GEAR_ACADEMY_HUB_NEXT_LINKS.map((link) => (
            <LinkCard key={link.href} {...link} />
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/consultation"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(216,137,160,0.34)] bg-[linear-gradient(135deg,#d889a0_0%,#c97691_100%)] px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_18px_38px_rgba(216,137,160,0.24)] transition duration-300 hover:-translate-y-0.5 hover:brightness-[0.98]"
          >
            Want the shortlist? Work with Taylor
          </Link>
        </div>
      </div>
    </section>
  );
}
