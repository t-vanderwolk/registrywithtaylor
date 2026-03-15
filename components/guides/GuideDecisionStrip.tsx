import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideHubIconKey } from '@/lib/guides/hubs';

export default function GuideDecisionStrip({
  title,
  bullets,
  href,
  ctaLabel,
  icon,
}: {
  title: string;
  bullets: string[];
  href: string;
  ctaLabel: string;
  icon: GuideHubIconKey;
}) {
  if (bullets.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.6rem] border border-black/6 bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] md:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
            <GuideGlyph icon={icon} />
          </div>
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">Decision strip</p>
            <h3 className="mt-2 font-serif text-[1.4rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">{title}</h3>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-700">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.82rem] h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent-dark)]/65" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link
          href={href}
          className="inline-flex shrink-0 items-center text-sm font-semibold text-neutral-900 transition hover:text-[var(--color-accent-dark)]"
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true" className="ml-2">
            -&gt;
          </span>
        </Link>
      </div>
    </section>
  );
}
