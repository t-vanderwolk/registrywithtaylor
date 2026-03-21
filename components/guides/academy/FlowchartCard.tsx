import GuideGlyph from '@/components/guides/GuideGlyph';
import type { AcademyFlowchartNode } from '@/lib/guides/strollerAcademy';

export default function FlowchartCard({
  node,
}: {
  node: AcademyFlowchartNode;
}) {
  return (
    <div className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/90 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[#9F556D]">
          <GuideGlyph icon={node.icon} className="h-5 w-5" />
        </span>
        <h3 className="text-xl font-medium text-[#2F2430]">{node.title}</h3>
      </div>
      <p className="mt-4 text-sm leading-7 text-[#5B4B55]">{node.description}</p>

      <div className="mt-5 space-y-3">
        {node.outcomes.map((outcome) => (
          <div key={outcome.label} className="rounded-[1.2rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-[#2F2430]">{outcome.label}</p>
              {outcome.href ? (
                <a href={outcome.href} className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">
                  Open lane
                </a>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-7 text-[#5B4B55]">{outcome.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
