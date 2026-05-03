type DecisionRule = {
  condition: string;
  recommendation: string;
};

type HowToDecideBlockProps = {
  title: string;
  intro?: string;
  prioritize: readonly DecisionRule[];
  avoid: readonly DecisionRule[];
  scenarios?: readonly string[];
  className?: string;
};

function RuleCard({
  eyebrow,
  title,
  rules,
}: {
  eyebrow: string;
  title: string;
  rules: readonly DecisionRule[];
}) {
  if (rules.length === 0) {
    return null;
  }

  return (
    <article className="rounded-[1.35rem] border border-[rgba(215,161,175,0.16)] bg-white/88 px-5 py-5">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-[1.3rem] leading-[1.08] tracking-[-0.03em] text-[#2F2430]">{title}</h3>
      <div className="mt-5 space-y-4">
        {rules.map((rule) => (
          <div key={`${rule.condition}-${rule.recommendation}`} className="rounded-[1.1rem] bg-[rgba(252,247,249,0.86)] px-4 py-4">
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">If</p>
            <p className="mt-2 text-[0.96rem] leading-7 text-[#5B4B55]">{rule.condition}</p>
            <p className="mt-4 text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Then</p>
            <p className="mt-2 text-[0.98rem] leading-7 text-[#2F2430]">{rule.recommendation}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function HowToDecideBlock({
  title,
  intro,
  prioritize,
  avoid,
  scenarios = [],
  className = '',
}: HowToDecideBlockProps) {
  const visibleScenarios = scenarios.filter((scenario) => scenario.trim()).slice(0, 3);

  return (
    <section
      className={[
        'rounded-[1.8rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,248,251,0.94)_100%)] px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-7 sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">How to decide</p>
      <h2 className="mt-4 max-w-3xl font-serif text-[clamp(1.8rem,3vw,2.3rem)] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
        {title}
      </h2>
      {intro ? <p className="mt-4 max-w-3xl text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">{intro}</p> : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <RuleCard eyebrow="Prioritize" title="What usually helps" rules={prioritize} />
        <RuleCard eyebrow="Avoid" title="What usually backfires" rules={avoid} />
      </div>

      {visibleScenarios.length > 0 ? (
        <div className="mt-6">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">In real life</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {visibleScenarios.map((scenario, index) => (
              <article
                key={`${scenario}-${index}`}
                className="rounded-[1.2rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.86)] px-4 py-4"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[#A15B72]">Scenario {index + 1}</p>
                <p className="mt-3 text-[0.96rem] leading-7 text-[#5B4B55]">{scenario}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
