import Image from 'next/image';
import Link from 'next/link';
import GuideBreadcrumbs from '@/components/guides/GuideBreadcrumbs';
import GuideHandwrittenNote from '@/components/guides/GuideHandwrittenNote';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import {
  DAILY_USE_GEAR_ACADEMY_HUB_PATH,
  DAILY_USE_GEAR_ACADEMY_TITLE,
  getDailyUseGearAcademySubmodule,
  getDailyUseGearAcademySubmoduleNavigation,
  getDailyUseGearAcademySubmodulePath,
  type DailyUseGearAcademyCard,
  type DailyUseGearAcademySection,
  type DailyUseGearAcademySubmoduleSlug,
} from '@/lib/academy/dailyUseGearAcademy';

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[2rem] leading-[0.98] tracking-[-0.05em] text-[#2F2430] sm:text-[2.55rem]">
        {title}
      </h2>
      <p className="mt-4 text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.05rem]">{description}</p>
    </div>
  );
}

function LinkCard({
  href,
  eyebrow,
  title,
  description,
  ctaLabel,
}: DailyUseGearAcademyCard) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[1.65rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.92)_100%)] p-5 shadow-[0_20px_48px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:shadow-[0_28px_62px_rgba(58,36,43,0.12)] sm:p-6"
    >
      {eyebrow ? <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p> : null}
      <h3 className="mt-4 font-serif text-[1.45rem] leading-[1.04] tracking-[-0.04em] text-[#2F2430] sm:text-[1.65rem]">
        {title}
      </h3>
      <p className="mt-4 text-[1rem] leading-8 text-[#5B4B55]">{description}</p>
      <span className="mt-auto pt-6 text-sm font-medium uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        {ctaLabel}
      </span>
    </Link>
  );
}

function SectionPanel({
  id,
  eyebrow,
  title,
  section,
  tone = 'white',
}: {
  id: string;
  eyebrow: string;
  title: string;
  section: DailyUseGearAcademySection;
  tone?: 'white' | 'blush' | 'linen';
}) {
  const backgroundClassName =
    tone === 'linen'
      ? 'bg-[linear-gradient(180deg,rgba(255,251,246,0.98)_0%,rgba(247,239,228,0.94)_100%)]'
      : tone === 'blush'
        ? 'bg-[linear-gradient(180deg,rgba(255,249,252,0.98)_0%,rgba(249,239,244,0.94)_100%)]'
        : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,248,251,0.94)_100%)]';

  return (
    <section
      id={id}
      className={`rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] px-6 py-7 shadow-[0_22px_50px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8 ${backgroundClassName}`}
    >
      <SectionHeading eyebrow={eyebrow} title={title} description={section.description} />

      {section.paragraphs?.length ? (
        <div className="mt-6 space-y-4 text-[1rem] leading-8 text-[#5B4B55]">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}

      {section.groups?.length ? (
        <div className={`mt-6 grid gap-4 ${section.groups.length > 1 ? 'lg:grid-cols-2' : ''}`}>
          {section.groups.map((group) => (
            <div
              key={`${group.title ?? 'group'}-${group.items.join(' ')}`}
              className="rounded-[1.45rem] border border-[rgba(215,161,175,0.14)] bg-white/84 p-5"
            >
              {group.title ? (
                <h3 className="font-serif text-[1.3rem] leading-[1.08] tracking-[-0.03em] text-[#2F2430]">
                  {group.title}
                </h3>
              ) : null}
              <ul className={`space-y-3 text-[1rem] leading-8 text-[#4B3641] ${group.title ? 'mt-4' : ''}`}>
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-3 h-2 w-2 shrink-0 rounded-full bg-[#D986A2]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default function DailyUseGearSubmodulePage({
  slug,
}: {
  slug: DailyUseGearAcademySubmoduleSlug;
}) {
  const submodule = getDailyUseGearAcademySubmodule(slug);
  const navigation = getDailyUseGearAcademySubmoduleNavigation(slug);
  const currentPath = getDailyUseGearAcademySubmodulePath(slug);

  const breadcrumbs = [
    { label: 'TMBC Academy', href: '/academy' },
    { label: 'Gear', href: '/academy/gear' },
    { label: DAILY_USE_GEAR_ACADEMY_TITLE, href: DAILY_USE_GEAR_ACADEMY_HUB_PATH },
    { label: submodule.title },
  ];

  return (
    <section className="min-h-0 bg-[radial-gradient(circle_at_top_left,rgba(244,224,209,0.62),transparent_28%),radial-gradient(circle_at_top_right,rgba(232,154,174,0.2),transparent_24%),linear-gradient(180deg,#fffdfa_0%,#fcf3f5_30%,#fffdf8_100%)]">
      <div className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:px-8 md:pb-10 md:pt-14 lg:px-10">
        <GuideBreadcrumbs items={breadcrumbs} />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 sm:px-8 md:pb-12 lg:px-10">
        <section className="overflow-hidden rounded-[2.15rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_46%,rgba(249,241,233,0.96)_100%)] shadow-[0_28px_72px_rgba(58,36,43,0.1)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.98fr)]">
            <div className="px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">TMBC Academy / Daily Use Gear</p>
                <span className="inline-flex min-h-[34px] items-center rounded-full border border-[rgba(215,161,175,0.18)] bg-white/84 px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em] text-[#8F4C62]">
                  Module {submodule.order} of 6
                </span>
              </div>

              <h1 className="mt-5 max-w-[11ch] font-serif text-[2.4rem] leading-[0.92] tracking-[-0.06em] text-[#2F2430] sm:text-[3.7rem]">
                {submodule.title}
              </h1>
              <p className="mt-5 max-w-[40rem] text-[1.08rem] leading-8 text-[#4B3641] sm:text-[1.16rem] sm:leading-9">
                {submodule.deck}
              </p>

              <div className="mt-6 max-w-[42rem] space-y-4 text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">
                {submodule.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={`${currentPath}#learn`}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
                >
                  Start with Learn
                </Link>
                <Link
                  href={`${currentPath}#next-steps`}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(58,36,43,0.08)]"
                >
                  See next steps
                </Link>
              </div>
            </div>

            <div className="border-t border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#fdf7f8_0%,#fffdf9_100%)] lg:border-l lg:border-t-0">
              <div className="relative aspect-[5/4] border-b border-[rgba(215,161,175,0.14)] bg-[linear-gradient(180deg,#f7efe6_0%,#f3e4dc_100%)]">
                <Image
                  src={submodule.heroImageSrc}
                  alt={submodule.heroImageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 34rem, 100vw"
                  className="object-contain p-6 sm:p-8"
                />
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
                <div className="rounded-[1.45rem] border border-[rgba(215,161,175,0.18)] bg-white/88 p-5 shadow-[0_18px_34px_rgba(58,36,43,0.06)]">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">This page helps you</p>
                  <p className="mt-3 text-[1rem] leading-8 text-[#4B3641]">
                    Move from category confusion into a cleaner real-life decision before the shopping tabs get louder than the routine itself.
                  </p>
                </div>

                <div className="rounded-[1.55rem] border border-[rgba(215,161,175,0.16)] bg-white/84 px-5 py-5">
                  <AcademyProgressBar
                    current={submodule.order}
                    total={6}
                    label={`${DAILY_USE_GEAR_ACADEMY_TITLE} progress`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-5 pb-20 sm:px-8 md:space-y-8 md:pb-24 lg:px-10">
        <SectionPanel id="learn" eyebrow="Learn" title="Learn" section={submodule.learn} tone="white" />
        <SectionPanel id="plan" eyebrow="Plan" title="Plan" section={submodule.plan} tone="blush" />
        <SectionPanel id="try" eyebrow="Try" title="Try" section={submodule.trySection} tone="linen" />
        <SectionPanel id="buy" eyebrow="Buy" title="Buy" section={submodule.buy} tone="white" />

        <GuideHandwrittenNote
          title={submodule.note.title}
          description={<p>{submodule.note.body}</p>}
          eyebrow={submodule.note.eyebrow}
          tone={submodule.note.tone}
          showEyebrow
          presentation="margin"
        />

        <section
          id="next-steps"
          className="rounded-[1.95rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,248,251,0.94)_100%)] px-6 py-7 shadow-[0_22px_50px_rgba(58,36,43,0.08)] sm:px-8 sm:py-8"
        >
          <SectionHeading
            eyebrow="Next Step"
            title="Keep the module moving"
            description="Use the next link when the daily-use sequence is still helping, or go back to the hub if you want the full map again before deciding what to open next."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <LinkCard {...navigation.previous} />
            <LinkCard {...navigation.hub} />
            <LinkCard {...navigation.next} />
          </div>
        </section>
      </div>
    </section>
  );
}
