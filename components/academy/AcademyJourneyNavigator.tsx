import Link from 'next/link';
import {
  getAcademyHomeData,
  getAcademyPathData,
  type AcademyModuleSlug,
  type AcademyPathSlug,
} from '@/lib/academy/content';

type AcademyJourneyNavigatorProps = {
  currentPathSlug?: AcademyPathSlug;
  currentModuleSlug?: AcademyModuleSlug;
};

function PathCard({
  href,
  title,
  description,
  eyebrow,
  active,
}: {
  href: string;
  title: string;
  description: string;
  eyebrow: string;
  active: boolean;
}) {
  const className = active
    ? 'rounded-[1.4rem] border border-[rgba(161,91,114,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-4 py-4 shadow-[0_18px_36px_rgba(58,36,43,0.08)]'
    : 'rounded-[1.4rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-4 py-4 shadow-[0_14px_30px_rgba(58,36,43,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(161,91,114,0.22)] hover:shadow-[0_18px_36px_rgba(58,36,43,0.08)]';

  return (
    <Link href={href} className={className}>
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-[1.2rem] leading-[1.05] tracking-[-0.03em] text-[#2F2430]">{title}</h3>
      <p className="mt-2 text-[0.96rem] leading-7 text-[#5B4B55]">{description}</p>
    </Link>
  );
}

function ModuleChip({
  href,
  label,
  title,
  active,
}: {
  href: string;
  label: string;
  title: string;
  active: boolean;
}) {
  const className = active
    ? 'rounded-[1.2rem] border border-[rgba(161,91,114,0.24)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(252,241,245,0.96)_100%)] px-4 py-4 shadow-[0_16px_30px_rgba(58,36,43,0.08)]'
    : 'rounded-[1.2rem] border border-[rgba(215,161,175,0.14)] bg-white/88 px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(161,91,114,0.2)] hover:shadow-[0_16px_30px_rgba(58,36,43,0.07)]';

  return (
    <Link href={href} className={className}>
      <p className="text-[0.66rem] uppercase tracking-[0.2em] text-[#A15B72]">{label}</p>
      <p className="mt-2 font-medium leading-6 text-[#2F2430]">{title}</p>
    </Link>
  );
}

export default async function AcademyJourneyNavigator({
  currentPathSlug,
  currentModuleSlug,
}: AcademyJourneyNavigatorProps) {
  const home = getAcademyHomeData();
  const currentPath = currentPathSlug ? await getAcademyPathData(currentPathSlug) : null;

  return (
    <section className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,248,251,0.92)_100%)] px-5 py-6 shadow-[0_20px_44px_rgba(58,36,43,0.08)] sm:px-6 sm:py-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">Academy Journey</p>
          <h2 className="mt-3 font-serif text-[1.7rem] leading-[0.98] tracking-[-0.04em] text-[#2F2430] sm:text-[2.15rem]">
            Keep the next useful step in view
          </h2>
          <p className="mt-3 text-[0.98rem] leading-7 text-[#5B4B55] sm:text-[1rem] sm:leading-8">
            Move through the Academy in order when you can. Skip ahead when real life clearly needs a different answer first.
          </p>
        </div>

        <Link
          href="/academy"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(58,36,43,0.08)]"
        >
          View all Academy paths
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {home.paths.map((path) => (
          <PathCard
            key={path.slug}
            href={path.href}
            title={path.title}
            description={path.description}
            eyebrow={path.eyebrow}
            active={path.slug === currentPathSlug}
          />
        ))}
      </div>

      {currentPath ? (
        <div className="mt-6 rounded-[1.6rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.86)] px-4 py-5 sm:px-5 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{currentPath.title} path</p>
              <h3 className="mt-2 font-serif text-[1.45rem] leading-[1.02] tracking-[-0.03em] text-[#2F2430] sm:text-[1.72rem]">
                One module at a time is still a full plan
              </h3>
            </div>
            <p className="text-sm uppercase tracking-[0.16em] text-[#8F4C62]">
              {currentPath.moduleCards.length} modules in order
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {currentPath.moduleCards.map((moduleCard, index) => (
              <ModuleChip
                key={moduleCard.slug}
                href={moduleCard.href}
                label={`Module ${index + 1}`}
                title={moduleCard.title}
                active={moduleCard.slug === currentModuleSlug}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
