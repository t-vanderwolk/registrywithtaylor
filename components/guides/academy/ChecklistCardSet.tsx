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
    <section className="blog-section-soft space-y-6 px-4 sm:px-6">
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">Checklist</p>
        <h2 className="mt-4 font-serif text-[clamp(2.1rem,4vw,2.9rem)] leading-[1.1] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
          {title}
        </h2>
        <div className="mt-4 h-1 w-[78px] rounded-full bg-[linear-gradient(90deg,rgba(232,154,174,0.9)_0%,rgba(215,161,175,1)_100%)] shadow-[0_10px_24px_rgba(232,154,174,0.18)]" />
        {description ? (
          <p className="mt-5 text-[1.04rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.08rem]">{description}</p>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.title}
            className="tmbc-blog-soft-card p-5 sm:p-6"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[var(--tmbc-blog-rose)]">Checklist Section</p>
            <h3 className="mt-4 font-serif text-[1.5rem] leading-[1.16] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)] sm:text-[1.7rem]">
              {section.title}
            </h3>
            {section.description ? <p className="mt-3 text-[0.98rem] leading-7 text-[var(--tmbc-blog-soft-text)]">{section.description}</p> : null}

            <div className="mt-5 space-y-3">
              {section.items.map((item) => {
                const statusStyle = STATUS_STYLES[item.status];
                return (
                  <div key={item.label} className="rounded-[1.35rem] border border-[rgba(215,161,175,0.16)] bg-[rgba(255,255,255,0.82)] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
                    <div className="flex items-start gap-3">
                      <span className={`mt-2 h-2.5 w-2.5 rounded-full ${statusStyle.dotClassName}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                          <p className="text-sm font-medium text-[var(--tmbc-blog-charcoal)]">{item.label}</p>
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.22em] ${statusStyle.pillClassName}`}>
                            {statusStyle.label}
                          </span>
                        </div>
                        {item.detail ? <p className="mt-2 text-sm leading-7 text-[var(--tmbc-blog-soft-text)]">{item.detail}</p> : null}
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
