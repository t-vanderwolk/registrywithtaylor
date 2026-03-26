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
    <section className="relative overflow-hidden rounded-[2.15rem] border border-[rgba(226,150,173,0.2)] bg-[linear-gradient(135deg,rgba(255,249,252,0.98),rgba(251,245,239,0.98),rgba(255,251,252,0.98))] p-6 shadow-[0_28px_74px_rgba(58,36,43,0.11)] sm:p-7">
      <div className="academy-rose-glow pointer-events-none absolute left-[-2rem] top-[-1.5rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_74%)] blur-2xl" />
      <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-[linear-gradient(90deg,rgba(217,134,162,0),rgba(217,134,162,0.5),rgba(217,134,162,0))]" />
      <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
        <span className="h-[1px] flex-1 bg-[linear-gradient(90deg,rgba(217,134,162,0.55),rgba(217,134,162,0))]" />
      </div>
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">Next Step</p>
      <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#2F2430] sm:text-[2rem]">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-8 text-[#5B4B55]">{description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {actions.map((action) =>
          action.href ? (
            <a
              key={action.label}
              href={action.href}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#D986A2,#A15B72)] px-5 py-3 text-sm font-medium text-white shadow-[0_14px_28px_rgba(161,91,114,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(161,91,114,0.34)]"
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

      <div className="mt-5 flex justify-end">
        <span className="font-script text-[1.7rem] leading-none text-[#D986A2]">XOXO -T</span>
      </div>
      </div>
    </section>
  );
}
