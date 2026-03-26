import type { AcademyChecklistSection, AcademyChecklistStatus } from '@/lib/guides/strollerAcademy';

const STATUS_STYLES: Record<
  AcademyChecklistStatus,
  { pillClassName: string; dotClassName: string; label: string }
> = {
  check: {
    pillClassName: 'bg-[rgba(225,240,232,0.92)] text-[#2C6A4F]',
    dotClassName: 'bg-[#2C6A4F]',
    label: 'Test',
  },
  watch: {
    pillClassName: 'bg-[rgba(249,236,224,0.96)] text-[#8B5D2B]',
    dotClassName: 'bg-[#B77730]',
    label: 'Watch',
  },
  ask: {
    pillClassName: 'bg-[rgba(241,233,247,0.96)] text-[#7A4C93]',
    dotClassName: 'bg-[#9562AF]',
    label: 'Ask',
  },
};

export default function ChecklistCardSet({
  title,
  description,
  sections,
}: {
  title: string;
  description?: string;
  sections: AcademyChecklistSection[];
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
          <span className="h-[1px] flex-1 max-w-[7rem] bg-[linear-gradient(90deg,rgba(217,134,162,0.55),rgba(217,134,162,0))]" />
        </div>
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#A15B72]">Checklist</p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.35rem]">{title}</h2>
        {description ? <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p> : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.title}
            className="academy-sheen rounded-[1.95rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(255,248,251,0.92)_100%)] p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)]"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
              <span className="h-[1px] flex-1 bg-[linear-gradient(90deg,rgba(217,134,162,0.45),rgba(217,134,162,0))]" />
            </div>
            <h3 className="text-xl font-medium text-[#2F2430]">{section.title}</h3>
            {section.description ? <p className="mt-2 text-sm leading-7 text-[#5B4B55]">{section.description}</p> : null}

            <div className="mt-5 space-y-3">
              {section.items.map((item) => {
                const statusStyle = STATUS_STYLES[item.status];
                return (
                  <div key={item.label} className="rounded-[1.35rem] border border-[rgba(217,134,162,0.08)] bg-[rgba(252,247,249,0.92)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    <div className="flex items-start gap-3">
                      <span className={`mt-2 h-2.5 w-2.5 rounded-full ${statusStyle.dotClassName}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-medium text-[#2F2430]">{item.label}</p>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] ${statusStyle.pillClassName}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                        {item.detail ? <p className="mt-2 text-sm leading-7 text-[#5B4B55]">{item.detail}</p> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
