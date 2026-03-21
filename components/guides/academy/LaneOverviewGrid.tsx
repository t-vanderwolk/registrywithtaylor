import LaneCard from '@/components/guides/academy/LaneCard';
import type { StrollerAcademyLane } from '@/lib/guides/strollerAcademy';

export default function LaneOverviewGrid({
  title,
  description,
  lanes,
}: {
  title: string;
  description: string;
  lanes: StrollerAcademyLane[];
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#A15B72]">Stroller Lanes</p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.4rem]">{title}</h2>
        <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {lanes.map((lane) => (
          <LaneCard key={lane.slug} lane={lane} />
        ))}
      </div>
    </section>
  );
}
