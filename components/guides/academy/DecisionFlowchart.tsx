import FlowchartCard from '@/components/guides/academy/FlowchartCard';
import type { AcademyFlowchartNode } from '@/lib/guides/strollerAcademy';

export default function DecisionFlowchart({
  title,
  description,
  nodes,
}: {
  title: string;
  description: string;
  nodes: AcademyFlowchartNode[];
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#A15B72]">Decision Flow</p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.35rem]">{title}</h2>
        <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {nodes.map((node) => (
          <FlowchartCard key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
}
