export default function ExpertTipCallout({
  eyebrow = 'Expert Tip',
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(226,150,173,0.18)] bg-[linear-gradient(135deg,rgba(255,248,251,0.98),rgba(251,245,239,0.96),rgba(255,251,252,0.98))] p-6 shadow-[0_20px_60px_rgba(58,36,43,0.08)] sm:p-7">
      <div className="academy-rose-glow pointer-events-none absolute right-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_70%)] blur-2xl" />
      <div className="pointer-events-none absolute left-7 top-0 h-full w-px bg-[linear-gradient(180deg,rgba(217,134,162,0.22),rgba(217,134,162,0))]" />
      <div className="relative">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#D986A2]" />
        <span className="h-[1px] flex-1 bg-[linear-gradient(90deg,rgba(217,134,162,0.55),rgba(217,134,162,0))]" />
      </div>
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#2F2430]">{title}</h3>
      <p className="mt-4 max-w-3xl text-base leading-8 text-[#4B3641]">{body}</p>
      </div>
    </section>
  );
}
