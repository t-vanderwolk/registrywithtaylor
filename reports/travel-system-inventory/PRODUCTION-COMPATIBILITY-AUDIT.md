# TMBC Travel System — Production Compatibility Row-Level Export & Provenance

**Read-only. No database, catalogue, schema, code, migration, script, or production change was made. No `--apply`.**

- **Source:** production export `reports/live-audit/db-compatibility.csv` (+ `db-stroller`, `db-carseat`, `db-adapters`, `api-catalog-*.json`), captured **2026-08-24 11:06**.
- **Terminology (enforced):** every existing row is a **production compatibility row**, never a "verified match." Verification requires manufacturer evidence tied to that exact stroller generation + exact infant-seat model, and **no such evidence is stored on any row** (see Q1–Q2). The `confidence` column (HIGH/MEDIUM/LOW) is the *generating script's* confidence, **not** manufacturer verification, and is preserved verbatim for reference only.

## Files produced (all under `reports/travel-system-inventory/`)

| File | Rows | Contents |
|---|---|---|
| `production-compatibility-full.csv` | **2,312** | one row per `Compatibility` record; every requested column (blank where the column does not exist in production) + `confidence` preserved + 14 diagnostic columns |
| `production-compatibility-by-stroller.csv` | 212 | aggregated by exact canonical stroller |
| `production-compatibility-by-seat.csv` | 44 | aggregated from the infant-seat side |
| `production-compatibility-source-provenance.csv` | 9 | every row bucketed by how it appears to have entered the system |
| `_compat_answers.json` | — | machine-readable answers below |

Columns that **do not exist in production** and are therefore blank on every row: `compatibility_status`, `source_url`, `source_name`, `source_type`, `source_date`, `verification_status`, `hard_coded_rule_source` (except the 6 explicit rows), `adapter_sku` (present on only 100 rows). This absence is itself the central finding.

---

## The 9 required answers

**1. Rows with an actual manufacturer source URL — `0` / 2,312.**
The production `Compatibility` model has no `source_url`/`source_name`/`source_date`/`verification_status` fields at all. Zero rows can cite a manufacturer.

**2. Rows with an exact-model manufacturer source — `0` / 2,312.** Same reason. **Nothing in production is manufacturer-verified in the sense your audited matrix requires.**

**3. Rows inferred vs explicit.** By the strict rule (no note + DIRECT/LIMITED + adapter not required), only **6** rows read as hard "explicit" rules; **2,306** are inference/rule-generated. But read this honestly: **all 2,312 rows were produced by scripts or hand-authored rules, none by manufacturer citation** — including the 220 `DIRECT` rows. Treat the whole table as *production claims pending audit*, not as a verified/unverified split.

**4. Scripts that generated / can regenerate the inferred rows:**
- `scripts/scanAdapterCompatibility.ts` → the "Inferred from the catalog adapter …" rows (adapter-title inference).
- `scripts/applySameBrandCompatibility.ts` → "Conservative same-brand default …".
- `scripts/applyUniversalAdapterCompatibility.ts` → universal-adapter expansion.
- Brand rules: `applyBabyJoggerCompatibility.ts`, `applyBritaxCompatibility.ts`, `wireCybexPriamMiosCompat.ts`, `addDonkeyRidgeMinuDuo.ts`, `addGt3AdapterUnhideMixx.ts`, `applyThuleAdapterLinks.ts`.
- Pruners (can also reshape): `pruneBritaxCompatibility.ts`, `pruneBabyJoggerCompatibility.ts`.
- Scanners: `scanStrollerMatches.ts`, `scanStrollersNoCompat.ts`.

**5. Exact stroller+seat pairs duplicated more than once — `0`.** No `(stroller_id, car_seat_id)` appears twice; there are no literal duplicate rows. **The duplication problem is at the identity level, not the row level** — the same physical product exists under multiple `stroller_id`s, so its matches are split. See `production-compatibility-by-stroller.csv`, e.g. **Baby Jogger Summit X3 / X3 Single / X3 Single Jogging = 0 / 0 / 7** and **Thule Urban Glide 4-Wheel vs 4-Wheel Single Child = 20 vs 4**. That fragmentation must be resolved before the counts mean anything.

**6. ADAPTER rows with no real matching car-seat-adapter product — `1,783` / 2,080 (86%).** Only 297 ADAPTER rows carry an `adapter_url` that matches a product in the affiliate adapter feed; the other 1,783 have an empty or non-cataloged adapter link. So the large majority of adapter-mediated matches are **not backed by a purchasable, catalogued adapter** — and, separately, the 197-row adapter feed itself is polluted with non-car-seat-adapters (trays, bases, bassinet/cot-height adapters, bundles), so even the 297 "matched" rows need the adapter re-classification you described (`CAR_SEAT_ADAPTER` vs `TRAY_ADAPTER` / `CAR_SEAT_BASE` / `BUNDLE` / …).

**7. Compatibility rows attached to non-chassis records — `54` rows across `3` accessory records.** All three are Veer accessories mis-filed as strollers (see Q8). *(This corrects my earlier inventory, which reported 0 — its accessory detector missed "Comfort Seat" / "Nap System." Corrected here.)*

**8. Every row on Veer Comfort Seat / Nap System records — 54 rows**, fully listed in `production-compatibility-full.csv` (filter `stroller_is_non_chassis_accessory = yes`). Each of the three accessories was fanned out to the **same 18 infant seats** via ADAPTER inference:
- `Veer Cruiser Wagon Comfort Seat for Toddlers` — 18 rows
- `Veer Cruiser Wagon XL Comfort Seat for Toddlers` — 18 rows
- `Veer Cruiser XL Nap System` — 18 rows

These are accessories, not chassis → **ACCESSORY_NOT_STROLLER**, and all 54 rows are removal candidates.

**9. Every row on Zoe Traveler — 7 rows**, all `ADAPTER`, all `euro_shared_adapter_expansion` (Nuna PIPA Aire/Aire rx/RX/urbn + UPPAbaby Aria/Aria V2/Mesa V3). Your manufacturer audit found the Traveler does **not** accept an infant seat → **all 7 are removal candidates.**

---

## Source-provenance distribution (`production-compatibility-source-provenance.csv`)

| Bucket | Rows | % | What it means |
|---|---:|---:|---|
| `exact_manufacturer_source` | **0** | 0.0% | manufacturer-cited (none exist) |
| `retailer_source` | 903 | 39.1% | ADAPTER row with an adapter affiliate link but no rule note — attached from a retailer/adapter link, no manufacturer basis |
| `euro_shared_adapter_expansion` | 629 | 27.2% | "accepts Nuna / Maxi-Cosi", "same Maxi-Cosi click", shared-adapter path — geometry inference |
| `other_rule_with_note` | 310 | 13.4% | hand-authored editorial rules ("clicks onto the Romer Tura", "adapters included with the Prism", "Silver Cross Clic clicks directly") — curated but still not manufacturer-*sourced* |
| `adapter_title_inference` | 281 | 12.2% | "Inferred from the catalog adapter …" (a catalogued adapter's title implied the fit) |
| `same_brand_rule` | 121 | 5.2% | "Conservative same-brand default …" |
| `universal_adapter_expansion` | 34 | 1.5% | universal-adapter rule |
| `legacy_unknown` | 28 | 1.2% | no note, no link |
| `hard_coded_exact_rule` | 6 | 0.3% | explicit direct-fit rule, no note |

**~2/3 of the library (retailer_source + euro + adapter_title + universal + same_brand ≈ 1,968 rows) is adapter/geometry/brand inference.** None is manufacturer-sourced.

---

## Diagnostic columns in the full export (for your reconciliation)

Per row: `same_brand_pair`, `adapter_url_matches_affiliate_product`, `adapter_catalog_product_id/name/provider`, `duplicate_pair_count/key`, `stroller_identity_reconciles_to_picker`, `car_seat_identity_reconciles_to_picker`, `stroller_is_non_chassis_accessory`, and four suspicion flags: `suspicious_same_brand_expansion`, `suspicious_euro_adapter_expansion`, `suspicious_brand_level_expansion` (Nuna/WonderFold/Graco/Chicco/Maxi-Cosi/Larktale uniform sets, or "all &lt;brand&gt; strollers accepts …" notes), `suspicious_universal_expansion`.

---

## Corrections carried over to audit vocabulary (from your review)

- `HAS_VERIFIED_MATCHES` → **`HAS_PRODUCTION_COMPATIBILITY_ROWS`** everywhere. Existence of a row ≠ verification.
- **Clek `Liing` ≠ `Liingo`** — distinct seats (Liingo is baseless); keep separate.
- **UPPAbaby `Aria` ≠ `Aria V2`** — distinct generations; do not merge. *(My earlier "identity cluster" flag was wrong.)*
- **Doona X** — integrated car-seat/stroller; not "legacy," needs special handling (it is its own travel system).
- **Evenflo `Revolve180 LiteMax NXT Rotational`** — a legitimate infant seat; keep in the infant catalogue.
- **`SHOULD_HAVE_MATCHES` is not an assertion** — travel stroller ≠ travel-system-compatible (e.g., Safety 1st Easy-Fold needs manufacturer research, not an assumed match). Joie family (Nutmeg, Caraway Whirl, Ginger/DLX, Kava, Poppy Whirl, Chive) is the real *under-population* case (0 production rows vs. known included-adapter fits).
- **Identity collisions to resolve before compatibility** (see by-stroller export): Bugaboo `Fox 5` vs picker "Fox 5 Renew"; Britax `Juniper On-The-Go` vs `Juniper+`; Baby Jogger Summit X3 ×3; Thule Urban Glide duplicate chassis; Mockingbird `Single` vs `Single 3.0`; Nuna MIXX next title variants.

---

## Bottom line for the next step

The four exports give you every one of the 2,312 production pairs at row level, each tagged with its inferred provenance and suspicion flags, with **manufacturer verification explicitly recorded as absent**. That is the reconciliation surface for assigning your final four-state system (Directly Compatible · Compatible With Adapter · Should Work · Not Compatible) while keeping manufacturer-confirmed evidence separate from geometry/inference — starting with the clear removal candidates (54 Veer-accessory rows, 7 Zoe Traveler rows) and the identity-fragmentation fixes.
