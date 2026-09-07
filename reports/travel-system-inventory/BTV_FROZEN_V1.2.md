# BTV_FROZEN_V1.2 — BOB · Thule · Veer travel-system compatibility (current-source conflict correction)

**Status: FROZEN.** Read-only audit block. Versioned correction of `BTV_FROZEN_V1.1`, driven by a first-party re-read of Veer's **current** adapter pages. `BTV_FROZEN_V1.md` (V1) and `BTV_FROZEN_V1.1.md` (V1.1) are preserved unchanged — V1.2 does not erase that they existed.

## What changed from V1.1

V1.1 flipped 12 Cruiser × {Willow S, Willow SC, Cypress} rows to **KEEP / MANUFACTURER_EXACT** attributed to Cruiser adapter **`479257`**, on the strength of the Nov 2024 Veer *Compatibility Guide*. Veer's **current** first-party adapter pages (each "Updated ~22–23 days ago", verified 2026-09-02) contradict that attribution:

- **`479257`** (Cruiser Graco/Britax/UPPAbaby): Britax support is **"legacy Britax models (pre-2024)"** — B-Safe 35/Elite/Ultra/Gen2/Gen2 FlexFit/FlexFit+/Endeavour/Chaperone. Willow/Cypress **not** listed.
- **`479577`** (Cruiser Cybex/Maxi-Cosi/Nuna/Clek): "If you have a … **Britax** … seat, you'll need a **different Veer adapter**."
- **`510552`** (Switchback Britax, &Roll/&Jog): explicit WARNING that **Cypress / Willow / Willow S / Willow SC** are "**not compatible with this adapter**… you need the **Nuna / Cybex / Maxi-Cosi / Clek adapter** instead" (Switchback = &Roll/&Jog).

Current Veer documentation **explicitly supports the newer Britax family on the Switchback (&Roll/&Jog) adapter, while no current Cruiser adapter page identifies support for that family**. Under evidence-precedence (current/newer first-party pages outrank older), the `479257`/`MANUFACTURER_EXACT` attribution is **retracted**, and the 12 rows are a `SOURCE_REVISION_CONFLICT` (guide lists them on the Cruiser; current exact adapter docs identify no approved Cruiser adapter). **Absence of current Cruiser documentation is not an affirmative manufacturer incompatibility** — hence `VERIFY`, not REMOVE.

**Applied:** the 12 rows are downgraded **KEEP_UPDATE → VERIFY**, consumer **COMPATIBLE_WITH_ADAPTER → UNKNOWN**, basis **`SOURCE_REVISION_CONFLICT`** (VERIFY not REMOVE — a real first-party guide *does* list the pairing; only the current Cruiser adapter is unconfirmed).

| Layer | V1.1 | **V1.2** | delta |
|---|---|---|---|
| audit_action | 99 KEEP · 233 REMOVE · 6 VERIFY · 54 EXCLUDE | **87 KEEP · 233 REMOVE · 18 VERIFY · 54 EXCLUDE** | −12 KEEP / +12 VERIFY |
| Veer (K/R/V/E) | 36 / 81 / 0 / 54 | **24 / 81 / 12 / 54** | Veer only |
| consumer-visible | 129 (99 adapter + 30 SW) | **117 (87 adapter + 30 SW)** | −12 |
| consumer (internal) | 190 UNKNOWN · 19 DEDUP · 54 EXCL | **202 UNKNOWN** · 19 DEDUP · 54 EXCL | +12 UNKNOWN |

**BOB and Thule are byte-for-byte identical to V1.1/V1** (26/61 and 37/91/6). Total remains **392**. Detail: `TMBC_BTV_Veer_SourceRevisionConflict_Diff.csv` (12 rows) + the SOURCE_REVISION_CONFLICT section of `BOB-THULE-VEER-RECONCILIATION.md`.

## The 18 VERIFY rows (now)

- **6 — Thule Cybex Aton G2 / Aton G2 Swivel** (Urban Glide 3 / 4-wheel / 3 Double): unchanged. **Re-validated** against the first-party `20110761` (UG3 Maxi-Cosi adapter, US Feb 2024) and Charm `11500701` charts — both name Cybex **"Aton G", not "Aton G2"**. See `TMBC_BTV_Thule_20110761_UG3_Crosswalk.csv`.
- **12 — Veer Cruiser × {Willow S, Willow SC, Cypress}** (All-Terrain Cruiser, Cruiser, Cruiser City, Cruiser City XL Essentials): NEW `SOURCE_REVISION_CONFLICT`; guide lists on Cruiser, no current Cruiser adapter identified.

## Open items / resolution path

- **Resolve the 12 Cruiser Britax rows:** confirm from a current first-party Veer source the exact Cruiser adapter (if any) for Willow/Cypress → promote back to KEEP with that adapter; or, if Veer affirmatively states the newer Britax family is not Cruiser-compatible, the Cruiser pairing is REMOVE.
- **Identity-dedup (documented, not applied):** All-Terrain Cruiser ≡ Cruiser (Veer markets "All-Terrain Cruiser," model "Cruiser," goveer.com/products/cruiser; shared Babylist product 16064). One canonical chassis should carry compatibility; the duplicate's rows → REMOVE/IDENTITY_DEDUP before counting unique consumer-visible relationships. Parallel to `Switch&Jog Jogging` ≡ `Switch&Jog`.
- **Prior bounded items carry forward:** Maxi-Cosi Mico Pro (3, source-pending); catalogue gaps (Cybex Aton G, Thule Charm chassis + gaps).

## Normalized source-transcription files (typed)

`TMBC_BTV_Veer_2024_Guide_NormalizedPairs.csv` (230 rows) and `TMBC_BTV_BOB_2024_Single_Chart_NormalizedPairs.csv` (446 rows) carry a `pair_type` column: `EXACT_SOURCE_PAIR` / `FAMILY_OR_SYSTEM_CLAIM` (e.g. "SnugRide SnugLock (all models)") / `COMBINED_SOURCE_ENTRY` (e.g. "Aton Q & M", raw string preserved, not fanned out). They are **typed source transcriptions**, not blanket exact pairs.

## Production safety

The audit-row freeze itself stayed report-only: no BTV row decision was applied directly to production, and no BOB/Thule row was changed. A separate Veer runtime/catalog fix was later deployed in commit `d134b10` via migration `20260907010000_correct_veer_adapter_images_and_wagon_variants`; that migration renamed the four public Veer wagon product identities and corrected stored adapter images, but did not change these frozen audit-row decisions. All audit artifacts live in `reports/travel-system-inventory/`. `BTV_FROZEN_V1.md` and `BTV_FROZEN_V1.1.md` remain preserved as history.
