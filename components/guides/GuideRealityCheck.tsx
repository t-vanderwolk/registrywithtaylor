import GuideGlyph from '@/components/guides/GuideGlyph';
import type { GuideHubIconKey } from '@/lib/guides/hubs';

export default function GuideRealityCheck({
  title = 'Reality check',
  text,
  icon = 'strategy',
}: {
  title?: string;
  text: string;
  icon?: GuideHubIconKey;
}) {
  return (
    <section className="rounded-[1.8rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdf9_0%,#f8efe7_100%)] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.04)] md:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(196,156,94,0.14)] text-[var(--color-accent-dark)]">
          <GuideGlyph icon={icon} />
        </div>
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-accent-dark)]/82">{title}</p>
          <p className="text-sm leading-7 text-neutral-700">{text}</p>
        </div>
      </div>
    </section>
  );
}
