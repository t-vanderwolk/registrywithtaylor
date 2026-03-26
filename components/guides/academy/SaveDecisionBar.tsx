type SaveDecisionAction = {
  label: string;
  href?: string;
  placeholder?: boolean;
};

export default function SaveDecisionBar({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: SaveDecisionAction[];
}) {
  return (
    <section className="blog-section-soft px-5 sm:px-7">
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose)]">Next Step</p>
        <h2 className="mt-4 font-serif text-[clamp(2rem,3vw,2.5rem)] leading-[1.08] tracking-[-0.03em] text-[var(--tmbc-blog-charcoal)]">
          {title}
        </h2>
        <div className="mt-4 h-1 w-[78px] rounded-full bg-[linear-gradient(90deg,rgba(232,154,174,0.9)_0%,rgba(215,161,175,1)_100%)] shadow-[0_10px_24px_rgba(232,154,174,0.18)]" />
        <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-[var(--tmbc-blog-soft-text)] sm:text-[1.04rem]">{description}</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {actions.map((action) =>
            action.href ? (
              <a
                key={action.label}
                href={action.href}
                className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-[rgba(232,154,174,0.34)] bg-[linear-gradient(135deg,#d889a0_0%,#c97691_100%)] px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white shadow-[0_16px_34px_rgba(216,137,160,0.22)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_38px_rgba(203,120,146,0.26)] sm:w-auto"
              >
                {action.label}
              </a>
            ) : (
              <span
                key={action.label}
                className="inline-flex min-h-[46px] w-full items-center justify-center rounded-full border border-[rgba(215,161,175,0.24)] bg-white/82 px-5 py-3 text-center text-[0.68rem] uppercase tracking-[0.16em] text-[var(--tmbc-blog-soft-text)] sm:w-auto"
              >
                {action.label}
              </span>
            ),
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <span className="font-handwritten-print text-[1.55rem] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--tmbc-blog-rose)]">
            XOXO -T
          </span>
        </div>
      </div>
    </section>
  );
}
