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
  stageItems,
  stats = [],
}: {
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  stageItems: AcademyStageNavItem[];
  stats?: HeroStat[];
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(251,245,239,0.97),rgba(255,250,252,0.96)_54%,rgba(247,231,236,0.88))] px-6 py-12 shadow-[0_35px_120px_rgba(71,44,53,0.10)] sm:px-9 lg:px-12 lg:py-14">
      <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_top,rgba(215,161,175,0.18),transparent_62%)] lg:block" />

      <div className="relative space-y-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.72fr)] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#9F556D]">{eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-5xl lg:text-[4rem] lg:leading-[1.02]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5B4B55] sm:text-lg">{description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={primaryCta.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#A15B72] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
              >
                {primaryCta.label}
              </a>
              <a
                href={secondaryCta.href}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/82 px-6 py-3 text-sm font-medium text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                {secondaryCta.label}
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[rgba(215,161,175,0.14)] bg-white/78 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
            {stats.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
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
          </div>
        </div>

        <AcademyStageNav items={stageItems} />
      </div>
    </section>
  );
}
