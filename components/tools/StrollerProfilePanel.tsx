import { getStrollerProfile, type StrollerSpec } from '@/lib/resources/strollerProfiles';
import type { StrollerRealSpecs } from '@/lib/server/strollerSpecLookup';

const FOLD_LABELS: Record<string, string> = {
  'one-hand': 'One-hand fold',
  compact: 'Compact fold',
  standard: 'Standard fold',
};

/**
 * Turn the structured StrollerSpec numbers into display rows. These are the
 * "real numbers" from the feed and take precedence over the curated profile's
 * qualitative specs of the same name.
 */
function realSpecRows(real: StrollerRealSpecs | null): StrollerSpec[] {
  if (!real) return [];
  const rows: StrollerSpec[] = [];
  if (real.ownWeightLbs != null) {
    const w = Number.isInteger(real.ownWeightLbs) ? real.ownWeightLbs.toString() : real.ownWeightLbs.toFixed(1);
    rows.push({ label: 'Weight', value: `${w} lb` });
  }
  if (real.maxWeightLbs != null) rows.push({ label: 'Seat limit', value: `Up to ${real.maxWeightLbs} lb` });
  if (real.foldType) rows.push({ label: 'Fold', value: FOLD_LABELS[real.foldType] ?? real.foldType });
  return rows;
}

/**
 * "About this stroller" — a TMBC-toned description + key specs, shown on the
 * travel-system results page. Real numeric specs come from the feed-backed
 * StrollerSpec; the curated profile supplies the description and the qualitative
 * specs the feed can't (which car seats fit, from-birth method, seat facing).
 * Falls back to the catalog summary when nothing curated exists.
 */
export default function StrollerProfilePanel({
  brand,
  model,
  fallbackSummary,
  realSpecs = null,
}: {
  brand: string;
  model: string;
  fallbackSummary?: string | null;
  realSpecs?: StrollerRealSpecs | null;
}) {
  const profile = getStrollerProfile(brand, model);
  const description = profile?.description ?? fallbackSummary ?? null;

  const realRows = realSpecRows(realSpecs);
  const realLabels = new Set(realRows.map((row) => row.label));
  // Curated specs fill in what the feed can't; real numbers win on shared labels.
  const curatedRows = (profile?.specs ?? []).filter((row) => !realLabels.has(row.label));
  const specs = [...realRows, ...curatedRows];

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
