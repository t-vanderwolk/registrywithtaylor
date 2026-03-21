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
    <section className="rounded-2xl border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f4_0%,#fbf7f2_100%)] p-5 shadow-sm md:p-7">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Next guides</p>
        <h2 className="font-serif text-2xl tracking-tight text-charcoal md:text-3xl">{title}</h2>
        <p className="max-w-4xl text-base leading-relaxed text-neutral-700 md:text-lg">
          These five guides are meant to work like a planning loop, not five unrelated essays.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className={`rounded-xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md ${
              item.current
                ? 'border-[rgba(196,156,94,0.28)] bg-white shadow-sm'
                : 'border-black/6 bg-[rgba(255,255,255,0.8)] hover:border-[rgba(196,156,94,0.24)] hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon={item.icon} />
              </div>
              <span className="text-xs uppercase tracking-[0.16em] text-black/42">
                {item.current ? 'Current guide' : 'Open'}
              </span>
            </div>
            <p className="mt-4 font-serif text-[1.3rem] leading-[1.08] tracking-tight text-charcoal">{item.title}</p>
            <p className="mt-2 text-base leading-relaxed text-neutral-700">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
