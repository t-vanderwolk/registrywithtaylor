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
    <section className="rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(251,245,239,0.97),rgba(255,250,252,0.94))] p-6 shadow-[0_24px_70px_rgba(58,36,43,0.10)] sm:p-7">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">Next Step</p>
      <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#2F2430] sm:text-[2rem]">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-[#5B4B55]">{description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {actions.map((action) =>
          action.href ? (
            <a
              key={action.label}
              href={action.href}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#A15B72] px-5 py-3 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
            >
              {action.label}
            </a>
          ) : (
            <span
              key={action.label}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(215,161,175,0.18)] bg-white/82 px-5 py-3 font-mono text-[0.68rem] text-[#7C5663]"
            >
              {action.label}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
