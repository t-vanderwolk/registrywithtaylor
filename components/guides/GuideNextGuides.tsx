import Link from 'next/link';
import type { GuideNextGuideItem } from '@/lib/guides/hubs';
import GuideGlyph from '@/components/guides/GuideGlyph';

export default function GuideNextGuides({
  title = 'Continue learning',
  items,
}: {
  title?: string;
  items: GuideNextGuideItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f4_0%,#fbf7f2_100%)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] md:p-8">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Next guides</p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-neutral-700">
          These five guides are meant to work like a planning loop, not five unrelated essays.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className={`rounded-[1.3rem] border p-4 transition duration-200 ${
              item.current
                ? 'border-[rgba(196,156,94,0.28)] bg-white shadow-[0_14px_32px_rgba(0,0,0,0.05)]'
                : 'border-black/6 bg-[rgba(255,255,255,0.72)] hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.24)] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={item.icon} />
              </div>
              <span className="text-[0.68rem] uppercase tracking-[0.16em] text-black/42">
                {item.current ? 'Current guide' : 'Open'}
              </span>
            </div>
            <p className="mt-4 font-serif text-[1.25rem] leading-[1.08] tracking-[-0.02em] text-neutral-900">{item.title}</p>
            <p className="mt-2 text-sm leading-7 text-neutral-700">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
