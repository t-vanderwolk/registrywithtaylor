import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import RevealOnScroll from '@/components/ui/RevealOnScroll';
import type { GuideComparisonBandGroup } from '@/lib/guides/hubs';
import { getStrollerComparisonBandGroups } from '@/lib/guides/strollerSystem';

function ComparisonGroup({
  label,
  items,
}: GuideComparisonBandGroup) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.18em] text-black/48">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={`${item.id}-${item.href}`}
            href={item.href}
            className={`group flex h-full flex-col rounded-xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md ${
              item.isActive
                ? 'border-[rgba(196,156,94,0.26)] bg-white shadow-sm'
                : 'border-black/6 bg-[rgba(255,255,255,0.92)] hover:border-[rgba(196,156,94,0.22)] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={item.icon} />
              </div>
              <span className="text-xs uppercase tracking-[0.16em] text-black/42">
                {item.isActive ? 'Current guide' : 'Compare'}
              </span>
            </div>

            <h3 className="mt-4 font-serif text-[1.35rem] leading-[1.08] tracking-tight text-charcoal">{item.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-neutral-700">{item.bestFor}</p>

            {item.strength ? (
              <p className="mt-3 rounded-xl border border-[rgba(196,156,94,0.14)] bg-[rgba(255,248,241,0.84)] px-4 py-3 text-base leading-relaxed text-neutral-700">
                <span className="mr-2 text-xs uppercase tracking-[0.16em] text-black/45">Strength</span>
                <span>{item.strength}</span>
              </p>
            ) : null}

            <p className="mt-3 rounded-xl border border-[rgba(0,0,0,0.06)] bg-[rgba(252,247,242,0.84)] px-4 py-3 text-base leading-relaxed text-neutral-700">
              <span className="mr-2 text-xs uppercase tracking-[0.16em] text-black/45">Tradeoff</span>
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
    <RevealOnScroll>
      <section className="rounded-2xl border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff9f5_0%,#fbf4ec_100%)] p-6 shadow-sm md:p-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">
            {title ?? 'Compare the stroller lanes before you over-compare the models'}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
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
    </RevealOnScroll>
  );
}
