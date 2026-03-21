type ComparisonRow = {
  title: string;
  bestFor: string;
  tradeoff: string;
  everydayFeel: string;
  href?: string;
  isCurrent?: boolean;
};

export default function ComparisonTable({
  title,
  description,
  rows,
}: {
  title: string;
  description: string;
  rows: ComparisonRow[];
}) {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#A15B72]">Comparison</p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.35rem]">{title}</h2>
        <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p>
      </div>

      <div className="hidden overflow-hidden rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-white/92 shadow-[0_18px_55px_rgba(58,36,43,0.08)] lg:block">
        <table className="min-w-full">
          <thead className="bg-[rgba(251,245,239,0.98)]">
            <tr className="text-left">
              <th className="px-6 py-4 text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Lane</th>
              <th className="px-6 py-4 text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Best For</th>
              <th className="px-6 py-4 text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Tradeoff</th>
              <th className="px-6 py-4 text-[0.68rem] uppercase tracking-[0.24em] text-[#A15B72]">Everyday Feel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.title} className={row.isCurrent ? 'bg-[rgba(252,247,249,0.72)]' : 'bg-white/92'}>
                <td className="px-6 py-5 align-top">
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-base font-medium text-[#2F2430]">{row.title}</p>
                      {row.isCurrent ? <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Current lane</p> : null}
                      {row.href ? <a href={row.href} className="mt-2 inline-block text-sm text-[#8F4C62]">Open lane</a> : null}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm leading-7 text-[#4B3641]">{row.bestFor}</td>
                <td className="px-6 py-5 text-sm leading-7 text-[#4B3641]">{row.tradeoff}</td>
                <td className="px-6 py-5 text-sm leading-7 text-[#4B3641]">{row.everydayFeel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {rows.map((row) => (
          <section
            key={row.title}
            className="rounded-[1.6rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)]"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-medium text-[#2F2430]">{row.title}</h3>
              {row.isCurrent ? <span className="rounded-full bg-[rgba(215,161,175,0.14)] px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Current</span> : null}
            </div>
            {row.href ? <a href={row.href} className="mt-2 inline-block text-sm text-[#8F4C62]">Open lane</a> : null}
            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.15rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Best For</p>
                <p className="mt-2 text-sm leading-7 text-[#4B3641]">{row.bestFor}</p>
              </div>
              <div className="rounded-[1.15rem] bg-[rgba(250,244,246,0.92)] px-4 py-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Tradeoff</p>
                <p className="mt-2 text-sm leading-7 text-[#4B3641]">{row.tradeoff}</p>
              </div>
              <div className="rounded-[1.15rem] bg-[rgba(248,241,243,0.84)] px-4 py-4">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">Everyday Feel</p>
                <p className="mt-2 text-sm leading-7 text-[#4B3641]">{row.everydayFeel}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
