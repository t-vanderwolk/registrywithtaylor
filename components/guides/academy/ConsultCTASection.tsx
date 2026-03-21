import type { AcademyConsultCard } from '@/lib/guides/strollerAcademy';

export default function ConsultCTASection({
  title,
  description,
  cards,
}: {
  title: string;
  description: string;
  cards: AcademyConsultCard[];
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#A15B72]">Where To Try</p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.35rem]">{title}</h2>
        <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card) => (
          <section
            key={card.title}
            className="rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/90 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Consult Option</p>
            <h3 className="mt-3 text-xl font-medium text-[#2F2430]">{card.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#5B4B55]">{card.description}</p>
            <div className="mt-5 rounded-[1.15rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
              <p className="font-mono text-xs leading-6 text-[#7C5663]">{card.placeholderLabel}</p>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#5B4B55]">{card.note}</p>
          </section>
        ))}
      </div>
    </section>
  );
}
