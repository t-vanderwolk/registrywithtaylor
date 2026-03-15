import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideHubIconKey } from '@/lib/guides/hubs';

export default function GuideKeywordDefinition({
  eyebrow = 'Keyword to know',
  term,
  definition,
  icon = 'book',
}: {
  eyebrow?: string;
  term: string;
  definition: string;
  icon?: GuideHubIconKey;
}) {
  return (
    <section className="rounded-[1.8rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffaf7_0%,#fcf4ee_100%)] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.04)] md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
          <GuideGlyph icon={icon} />
        </div>
        <div className="min-w-0 space-y-2">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">{eyebrow}</p>
          <h2 className="font-serif text-[1.55rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">{term}</h2>
          <p className="text-[0.98rem] leading-7 text-neutral-700">{definition}</p>
        </div>
      </div>
    </section>
  );
}
