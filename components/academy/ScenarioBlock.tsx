type ScenarioBlockProps = {
  title: string;
  scenarios: readonly string[];
  className?: string;
};

function getVisibleScenarios(scenarios: readonly string[]) {
  return scenarios
    .map((scenario) => scenario.trim())
    .filter(Boolean)
    .filter((scenario, index, collection) => collection.indexOf(scenario) === index)
    .slice(0, 3);
}

export default function ScenarioBlock({
  title,
  scenarios,
  className = '',
}: ScenarioBlockProps) {
  const visibleScenarios = getVisibleScenarios(scenarios);

  if (visibleScenarios.length < 2) {
    return null;
  }

  return (
    <section
      className={[
        'rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-white/92 px-6 py-7 shadow-[0_20px_48px_rgba(58,36,43,0.08)] sm:px-7 sm:py-8',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--tmbc-blog-rose,#A15B72)]">
        Real-Life Scenarios
      </p>
      <h2 className="mt-4 max-w-3xl break-words font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.08] tracking-[-0.04em] text-[var(--tmbc-blog-charcoal,#2F2430)]">
        {title}
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {visibleScenarios.map((scenario, index) => (
          <article
            key={scenario}
            className="rounded-[1.3rem] border border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.86)] px-5 py-5"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.2em] text-[var(--tmbc-blog-rose,#A15B72)]">
              Scenario {index + 1}
            </p>
            <p className="mt-3 break-words text-[0.98rem] leading-7 text-[var(--tmbc-blog-soft-text,#5B4B55)]">
              {scenario}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
