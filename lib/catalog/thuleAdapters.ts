/**
 * Thule car-seat adapter products, per stroller family. Each Thule adapter is a
 * single SKU that holds the whole euro group (Maxi-Cosi / Nuna / CYBEX / BeSafe),
 * so one product fills the Nuna + Maxi-Cosi + CYBEX adapter pairings at once.
 *
 * Amazon links carry Taylor's affiliate tag; images are Thule's own product PNGs.
 * Verified from thule.com fit-compatibility (03.2026):
 *   • Urban Glide 3 adapter (B0D2P1NNJN) → Thule Glide 3, Urban Glide 3 single,
 *     Urban Glide 4-Wheel. NOT the Urban Glide 3 DOUBLE (separate adapter).
 *   • Sleek adapter (B07FRRM8VD) → Thule Sleek, Sleek 2.
 *
 * Not yet covered (need their own SKUs): Urban Glide 2 / Glide 2 / Spring gen,
 * Thule Shine, the Urban Glide 3 DOUBLE, and the UPPAbaby/Britax Thule adapters.
 */
export type ThuleAdapterRule = {
  match: RegExp;
  /** Skip even when `match` hits (e.g. the double, which uses a different SKU). */
  exclude?: RegExp;
  label: string;
  adapterType: string;
  adapterUrl: string;
  adapterImage: string;
  /** Seat brands this one adapter holds. */
  seatBrands: string[];
};

export const THULE_ADAPTERS: ThuleAdapterRule[] = [
  {
    match: /urban glide 3|urban glide 4|\bglide 3\b/i,
    exclude: /double/i,
    label: 'Urban Glide 3 / 4-Wheel',
    adapterType: 'Thule Urban Glide 3 car seat adapter (Maxi-Cosi / Nuna / CYBEX)',
    adapterUrl: 'https://www.amazon.com/dp/B0D2P1NNJN?tag=taylormadebab-20',
    adapterImage:
      'https://www.thule.com/-/p/rjmmwraX1Tmx2OnGKIsc5-EjUmCNdBv9Pba8Jv7Z_i8/rs:fit/h:1200/cb:2.17/w:1800/plain/approved/std.lang.all/35/10/1423510.png',
    seatBrands: ['Nuna', 'Maxi-Cosi', 'Cybex'],
  },
  {
    match: /\bsleek\b/i,
    label: 'Sleek',
    adapterType: 'Thule Sleek car seat adapter (Maxi-Cosi / Nuna / CYBEX)',
    adapterUrl: 'https://www.amazon.com/dp/B07FRRM8VD?tag=taylormadebab-20',
    adapterImage:
      'https://www.thule.com/-/p/JE9sF6uZvbgVCeFE4hnAIh3KrVJ4wchHeEYX4i2R9hg/rs:fit/h:1200/cb:1.6/w:1800/plain/approved/std.lang.all/45/23/1384523.png',
    seatBrands: ['Nuna', 'Maxi-Cosi', 'Cybex'],
  },
];

export function thuleAdapterForModel(model: string): ThuleAdapterRule | null {
  return (
    THULE_ADAPTERS.find((r) => r.match.test(model) && !(r.exclude?.test(model) ?? false)) ?? null
  );
}
