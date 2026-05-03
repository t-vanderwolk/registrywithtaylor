import Link from 'next/link';

type NextDecisionLink = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

type ConnectedPath = {
  label: string;
  href: string;
  current?: boolean;
};

type NextBestDecisionCardProps = {
  title: string;
  description: string;
  progressMessage?: string;
  primary: NextDecisionLink | null;
  secondary?: NextDecisionLink | null;
  connectedPaths?: readonly ConnectedPath[];
  className?: string;
};

function NextLinkCard({
  eyebrow,
  link,
}: {
  eyebrow: string;
  link: NextDecisionLink;
}) {
  return (
    <Link
      href={link.href}
      className="group flex h-full min-w-0 flex-col rounded-[1.35rem] border border-[rgba(215,161,175,0.18)] bg-white/88 px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:bg-white hover:shadow-[0_20px_42px_rgba(58,36,43,0.08)]"
    >
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-[#2F2430]">{link.title}</h3>
      <p className="mt-4 text-[0.96rem] leading-7 text-[#5B4B55]">{link.description}</p>
      <span className="mt-auto pt-5 text-sm uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        {link.ctaLabel}
      </span>
    </Link>
  );
}

export default function NextBestDecisionCard({
  title,
  description,
  progressMessage,
  primary,
  secondary = null,
  connectedPaths = [],
  className = '',
}: NextBestDecisionCardProps) {
  return (
    <section
      className={[
        'rounded-[1.85rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.96)_48%,rgba(249,241,233,0.94)_100%)] px-6 py-7 shadow-[0_22px_50px_rgba(58,36,43,0.08)] sm:px-7 sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Next best decision</p>
      <h2 className="mt-4 max-w-3xl font-serif text-[clamp(1.8rem,3vw,2.3rem)] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
        {title}
      </h2>
      <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">{description}</p>
      {progressMessage ? <p className="academy-handwritten-aside mt-5">{progressMessage}</p> : null}

      {primary || secondary ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {primary ? <NextLinkCard eyebrow="Most likely next" link={primary} /> : null}
          {secondary ? <NextLinkCard eyebrow="If that is not the real question" link={secondary} /> : null}
        </div>
      ) : null}

      {connectedPaths.length > 0 ? (
        <div className="mt-6">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Still connected to</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {connectedPaths.map((path) => (
              <Link
                key={`${path.href}-${path.label}`}
                href={path.href}
                className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 ${
                  path.current
                    ? 'border-[rgba(161,91,114,0.22)] bg-[rgba(252,241,245,0.96)] text-[#8F4C62]'
                    : 'border-[rgba(215,161,175,0.18)] bg-white text-[#2F2430] hover:border-[rgba(161,91,114,0.24)]'
                }`}
              >
                {path.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
