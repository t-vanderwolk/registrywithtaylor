import { getStrollerProfile } from '@/lib/resources/strollerProfiles';

/**
 * "About this stroller" — a TMBC-toned description + key specs, shown on the
 * travel-system results page when a stroller is selected. Falls back to the
 * catalog summary when no curated profile exists yet; renders nothing if there's
 * neither.
 */
export default function StrollerProfilePanel({
  brand,
  model,
  fallbackSummary,
}: {
  brand: string;
  model: string;
  fallbackSummary?: string | null;
}) {
  const profile = getStrollerProfile(brand, model);
  const description = profile?.description ?? fallbackSummary ?? null;
  const specs = profile?.specs ?? [];

  if (!description && specs.length === 0) return null;

  return (
    <section className="rounded-[1.6rem] border border-[rgba(215,161,175,0.22)] bg-white/95 p-5 shadow-[0_16px_36px_rgba(72,49,56,0.06)] md:p-6">
      <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
        About this stroller
      </p>
      {description ? (
        <p className="mt-2 max-w-3xl text-[0.95rem] leading-7 text-neutral-700">{description}</p>
      ) : null}
      {specs.length > 0 ? (
        <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {specs.map((spec) => (
            <div key={spec.label} className="border-t border-[rgba(215,161,175,0.24)] pt-2">
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                {spec.label}
              </dt>
              <dd className="mt-0.5 text-[0.9rem] leading-snug text-neutral-800">{spec.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
