# BTV_FROZEN_V1.1 — BOB · Thule · Veer travel-system compatibility (versioned correction of V1)

**Status: SUPERSEDED by `BTV_FROZEN_V1.2`.** Read-only audit block. V1.1 was a versioned correction of `BTV_FROZEN_V1` driven by the **Veer *Infant Car Seat Compatibility Guide*, updated November 2024**. It has since been **corrected by `BTV_FROZEN_V1.2`** — this V1.1 snapshot (99/233/6/54 · 129 consumer-visible) is preserved as history.

> **⚠️ V1.1's 12 Cruiser × {Willow S, Willow SC, Cypress} KEEP flips were reversed in V1.2.** Veer's *current* first-party adapter pages (updated ~22 days ago) show **no Cruiser adapter lists the newer Britax family** — `479257` is legacy-Britax only and the Willow/Cypress family is routed to the **Switchback (&Roll/&Jog)** adapter. The V1.1 `479257`/`MANUFACTURER_EXACT` attribution was **retracted** and the 12 rows **downgraded KEEP → VERIFY** (basis `SOURCE_REVISION_CONFLICT`). Current block: **87 KEEP / 233 REMOVE / 18 VERIFY / 54 EXCLUDE · 117 consumer-visible** — see `BTV_FROZEN_V1.2.md`. The numbers in *this* file below are the historical V1.1 state.

## What changed from V1

A single first-party source (the Nov 2024 Veer guide) proved that **12 frozen Veer `REMOVE` rows were wrong.** Britax **Willow S**, **Willow SC**, and **Cypress** are listed under the guide's **Cruiser & Cruiser City** and **Cruiser XL & Cruiser City XL** columns, attaching via the Cruiser's Graco/Britax/UPPAbaby infant-car-seat adapter — not, as V1 assumed, only via the Switchback premium adapter. The **† "requires Cruiser seat back to be folded down" applies to Willow / Willow S / Willow SC only; Britax Cypress carries no dagger** (no seat-back-folded condition). All 12 flips are `MANUFACTURER_EXACT_MODEL`.

| Layer | V1 (frozen) | **V1.1 (this correction)** | delta |
|---|---|---|---|
| audit_action | 87 KEEP · 245 REMOVE · 6 VERIFY · 54 EXCLUDE | **99 KEEP · 233 REMOVE · 6 VERIFY · 54 EXCLUDE** | +12 KEEP / −12 REMOVE |
| by brand (KEEP/REMOVE/VERIFY) | BOB 26/61/0 · Thule 37/91/6 · Veer 24/93/0 | BOB 26/61/0 · Thule 37/91/6 · **Veer 36/81/0** | Veer only |
| consumer (surfaced) | 117 (87 adapter + 30 Should Work) | **129 (99 adapter + 30 Should Work)** | +12 adapter |
| consumer (internal) | 0 NOT_COMPATIBLE · 202 UNKNOWN · 19 IDENTITY_DEDUP · 54 EXCLUDED | 0 NOT_COMPATIBLE · **190 UNKNOWN** · 19 IDENTITY_DEDUP · 54 EXCLUDED | −12 UNKNOWN |

**BOB and Thule are byte-for-byte identical to V1** (verified against a pre-flip snapshot: exactly 12 rows changed, all Veer, all `REMOVE → KEEP_UPDATE`). Total remains **392 rows**.

### The 12 corrected rows
Four production Cruiser records × three Britax seats (Willow S, Willow SC, Cypress S):
All-Terrain Cruiser, Cruiser, Cruiser City → chart "Cruiser & Cruiser City"; Cruiser City XL Essentials → chart "Cruiser XL & Cruiser City XL". Detail in `TMBC_BTV_Veer_Freeze_Correction_Diff.csv`.

### Identity decisions
- **Cypress S → Britax "Cypress"** — canonicalized (documented, not silently aliased). Britax's lineup is Willow / Willow S / Willow SC / **Cypress**; there is **no "Cypress S."** Production's `Cypress S` is a proven bad identity; recommend catalogue rename. The chart string is "Britax Cypress" / "Britax Cyprus" (printed typo).
- **All-Terrain Cruiser ≡ Cruiser** and **Switch&Jog Jogging ≡ Switch&Jog** (shared Babylist product IDs). AT-Cruiser/Cruiser duplication flagged for catalogue review; not deduped here.
- **Willow S / Willow SC** — exact string matches; unambiguous.

## Freeze rule (binding on future work — carried forward from V1)

Future work on this block **may only**:
1. **Add** newly documented compatibility — only via (a) exact manufacturer confirmation (`MANUFACTURER_EXACT`) or (b) an anchor-validated candidate with an affirmative first-party stroller-side attachment-lineage source; or
2. **Resolve** the 6 Thule Aton G2 `VERIFY` rows with affirmative first-party evidence.

Future work **must not**:
- regenerate or infer compatibility across this block from brand-wide, same-brand, or shared-Euro / "universal-adapter" rules;
- alias or fan out similar model names (predecessor→successor, i-Size→US, carrier-family word-share) without an affirmative attachment-lineage source;
- change any frozen `audit_action` decision or the **99/233/6/54** counts unless a genuine row-level error is proven by exact first-party evidence (as this V1.1 correction was);
- treat `REMOVE` as a blanket "delete everywhere" — the importer must branch on `audit_action × consumer_compatibility_status`.

Any further evidence-proven correction is a new version (`V1.2`, …) that preserves this snapshot's history.

## Bounded open items (documented, not evidence holes)

- **Thule Aton G2 / Aton G2 Swivel × {Urban Glide 3, Urban Glide 4-wheel, Urban Glide 3 Double} = 6 rows** — audit `VERIFY`, consumer `UNKNOWN`. Unchanged from V1.
- **Maxi-Cosi Mico Pro = 3 valid-anchor rows** — `VALID_CANDIDATE_SOURCE_NOT_FOUND`. Unchanged. (The Nov 2024 Veer chart does not list Mico Pro.)
- **Veer catalogue gaps / ADD candidates** (chart-proven, seat stocked, no Veer row) — **Clek Liing** (all 4 platforms), **Chicco KeyFit 30 / KeyFit 30 ClearTex** (all 4), **Peg Perego Primo Viaggio 4-35** (Cruiser platforms only). Logged in `TMBC_BTV_Veer_2024_Guide_Crosswalk.csv`; not injected (read-only).
- **Veer identity fixes for catalogue** — rename `Cypress S → Cypress`; resolve the All-Terrain Cruiser vs Cruiser duplicate record; add missing Babylist/Amazon links for Britax Willow S / Willow SC / Cypress (see `TMBC_BTV_Veer_Retail_Link_Audit.csv`).

## BOB re-validation (Jan 2024 Single chart — no change)

The first-party **BOB Gear Single Stroller/Wagon Compatibility Chart (Jan 2024)** was reconciled against the 68 single-chassis frozen BOB rows: **0 corrections** — every frozen KEEP is either directly corroborated by the Jan 2024 chart or remains supported by newer first-party BOB evidence (some Graco — SnugRide Lite LX, SnugFit LX — rest on BOB's broader "All SnugRide models" pages rather than this older chart's specific model list), and every frozen REMOVE is chart-absent. The 2024 chart is corroboration / adapter-SKU evidence; **current/newer BOB pages outrank it** in source precedence, especially for Graco. BOB stays **26 KEEP / 61 REMOVE** (no BOB row changed). *(Historical: at V1.1 the block was `BTV_FROZEN_V1.1`; it is now `BTV_FROZEN_V1.2` — see `BTV_FROZEN_V1.2.md`. BOB's counts are unchanged across V1.1 → V1.2.)* Detail: `TMBC_BTV_BOB_2024_Single_Chart_Crosswalk.csv`, `TMBC_BTV_BOB_Single_Freeze_Check_Diff.csv` (0 rows). The **Revolution Flex 3.0 Duallie** (double) Britax-family REMOVE rows are a bounded item — the *Single* chart cannot resolve a double; needs the BOB Duallie chart.

## Artifacts

`TMBC_Compatibility_Row_Audit_BOB_Thule_Veer.csv` (392 rows, 31 cols) · `_Summary.csv` · `BOB-THULE-VEER-RECONCILIATION.md` · **`TMBC_BTV_Veer_2024_Guide_Crosswalk.csv`** (44 chart entries) · **`TMBC_BTV_Veer_Freeze_Correction_Diff.csv`** (12 rows) · **`TMBC_BTV_Veer_Retail_Link_Audit.csv`** (7 products) · **`TMBC_BTV_BOB_2024_Single_Chart_Crosswalk.csv`** (38 grouped entries) · **`TMBC_BTV_BOB_Single_Freeze_Check_Diff.csv`** (0 corrections) · **`TMBC_BTV_BOB_2024_Single_Chart_NormalizedPairs.csv`** (446 chart-supported pair rows) · **`TMBC_BTV_Veer_2024_Guide_NormalizedPairs.csv`** (230 source-transcription rows) · `TMBC_BTV_Lineage_QA.md` (Veer-2024 + BOB-2024 + source-integrity QA appended) · `BTV_FROZEN_V1.md` (original V1, preserved).

The two `*_Crosswalk.csv` files are **grouped source extractions**; the two `*_NormalizedPairs.csv` files are their deterministic one-row-per-(stroller/platform × seat × adapter) expansion (no identities fanned out). The Nov 2024 Veer chart lists **Britax Cypress with no dagger**; the † (Cruiser seat back folded down) applies to Willow / Willow S / Willow SC only.

**Production safety:** No production database, schema, migration, seed, import, compatibility generator, or unrelated product record was changed. No `--apply`, deploy, commit, or push. All artifacts live in `reports/travel-system-inventory/`.
