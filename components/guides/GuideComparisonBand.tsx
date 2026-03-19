import Link from 'next/link';
import GuideGlyph from '@/components/guides/GuideGlyph';
import { getStrollerComparisonBandGroups } from '@/lib/guides/strollerSystem';

function ComparisonGroup({
  label,
  items,
}: {
  label: string;
  items: ReturnType<typeof getStrollerComparisonBandGroups>['core'];
}) {
  return (
    <div className="space-y-4">
      <p className="text-[0.68rem] uppercase tracking-[0.18em] text-black/48">{label}</p>
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
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
}: {
  slug: string;
}) {
  const groups = getStrollerComparisonBandGroups(slug);

  return (
    <section className="rounded-[1.8rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff9f5_0%,#fbf4ec_100%)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-6">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Category comparison</p>
        <h2 className="font-serif text-[1.9rem] leading-[1.02] tracking-tight text-neutral-900 sm:text-3xl">
          Compare the stroller lanes before you over-compare the models
        </h2>
        <p className="max-w-[72ch] text-sm leading-7 text-neutral-700">
          Start with the core three first. Then compare the more specialized paths once the everyday question is already clear.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <ComparisonGroup label="Core 3 first" items={groups.core} />
        <ComparisonGroup label="Secondary band" items={groups.secondary} />
      </div>
    </section>
  );
}
