import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideComparisonBandGroup } from '@/lib/guides/hubs';
import { getStrollerComparisonBandGroups } from '@/lib/guides/strollerSystem';

function ComparisonGroup({
  label,
  items,
}: GuideComparisonBandGroup) {
  return (
    <div className="space-y-4">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">{label}</p>
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={`${item.id}-${item.href}`}
            href={item.href}
            className={`group flex h-full flex-col rounded-[1.35rem] border p-4 transition duration-200 ${
              item.isActive
                ? 'border-[rgba(196,156,94,0.26)] bg-white shadow-[0_14px_32px_rgba(0,0,0,0.05)]'
                : 'border-black/6 bg-[rgba(255,255,255,0.86)] hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.22)] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={item.icon} />
              </div>
              <span className="text-[0.62rem] uppercase tracking-[0.16em] text-black/42">
                {item.isActive ? 'Current guide' : 'Compare'}
              </span>
            </div>

            <h3 className="mt-4 font-serif text-[1.2rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{item.bestFor}</p>

            {item.strength ? (
              <p className="mt-3 rounded-[1rem] border border-[rgba(196,156,94,0.14)] bg-[rgba(255,248,241,0.84)] px-3 py-3 text-sm leading-6 text-neutral-700">
                <span className="mr-2 text-[0.66rem] uppercase tracking-[0.16em] text-black/45">Strength</span>
                <span>{item.strength}</span>
              </p>
            ) : null}

            <p className="mt-3 rounded-[1rem] border border-[rgba(0,0,0,0.06)] bg-[rgba(252,247,242,0.84)] px-3 py-3 text-sm leading-6 text-neutral-700">
              <span className="mr-2 text-[0.66rem] uppercase tracking-[0.16em] text-black/45">Tradeoff</span>
              <span>{item.tradeoff}</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function GuideComparisonBand({
  slug,
  groups,
  eyebrow = 'Category comparison',
  title,
  description,
}: {
  slug?: string;
  groups?: GuideComparisonBandGroup[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const resolvedGroups =
    groups ??
    (slug
      ? (() => {
          const strollerGroups = getStrollerComparisonBandGroups(slug);
          return [
            { label: 'Core 3 first', items: strollerGroups.core.map((item) => ({ ...item, id: item.slug })) },
            { label: 'Secondary band', items: strollerGroups.secondary.map((item) => ({ ...item, id: item.slug })) },
          ] satisfies GuideComparisonBandGroup[];
        })()
      : []);

  if (resolvedGroups.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.8rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff9f5_0%,#fbf4ec_100%)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-6">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
        <h2 className="font-serif text-[1.9rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl">
          {title ?? 'Compare the stroller lanes before you over-compare the models'}
        </h2>
        <p className="max-w-[72ch] text-sm leading-7 text-neutral-700">
          {description ??
            'Start with the core three first. Then compare the more specialized paths once the everyday question is already clear.'}
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {resolvedGroups.map((group) => (
          <ComparisonGroup key={group.label} label={group.label} items={group.items} />
        ))}
      </div>
    </section>
  );
}
