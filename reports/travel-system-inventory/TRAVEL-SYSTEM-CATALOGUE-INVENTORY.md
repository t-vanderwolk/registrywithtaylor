# TMBC Travel System — Current Catalogue Inventory & Reconciliation

**Read-only inventory. No code, data, schema, migration, or catalogue change was made.**

- **Data source:** production export `reports/live-audit/` (also zipped as `tmbc-live-audit.zip`), captured **2026-08-24 11:06**. Canonical tables (`Stroller`, `CarSeat`, `Compatibility`) come from `db-*.csv`; the live public picker comes from `api-catalog-strollers.json` / `api-catalog-carseats.json` (the `/api/catalog/*` endpoints the finder + travel-system tool draw from).
- **No newer live query was run** (production DB is not reachable read-only from this environment; the exported API JSON is treated as the live picker of record).
- **How the tool links picker → compatibility (confirmed in code):** the stroller/seat pickers are the affiliate-catalog–derived public catalogue; compatibility is resolved against the canonical `Stroller`/`CarSeat`/`Compatibility` tables keyed by `brand:::model` (lower-cased). So an item is "reconciled" only when its picker `brand + model` normalises to a canonical `brand + model`. That join is exactly where most identity problems surface.

---

## 1. Headline totals

| Metric | Count |
|---|---|
| Canonical strollers/wagons (`Stroller`) | **263** |
| Strollers visible in public picker (distinct products) | **168** (across 40 brands) |
| Canonical car seats — all | 50 |
| Canonical **infant** car seats (`seatType = INFANT`) | **47** |
| Infant seats visible in public picker | **51** |
| Distinct adapter products (affiliate feed) | **197** |
| Affiliate-catalog stroller products (raw feed) | 484 |
| Compatibility rows total | **2,312** |
| — DIRECT | 220 |
| — ADAPTER | 2,080 |
| — LIMITED | 12 |
| — LOCKED / INCOMPATIBLE | 0 / 0 |
| Zero-match canonical strollers | **51** |
| Picker↔canonical mismatches | strollers **4 picker-only / 98 canonical-only**; seats **12 picker-only / 9 canonical-only** |
| Suspicious fan-out strollers (flagged) | **62** |
| High-confidence identity clusters | 1 stroller cluster (Joolz Day/Day+); see caveat |
| Accessories mis-stored in the canonical `Stroller` table | **0** |

> The compatibility library is **90% adapter-mediated** (2,080 / 2,312). Only 220 rows are true DIRECT fits. That ratio is the single biggest thing to sanity-check when the audited matrix replaces it.

---

## 2. Files produced (all under `reports/travel-system-inventory/`)

| File | Rows | What it is |
|---|---|---|
| `stroller-inventory.csv` | 263 | Every canonical stroller/wagon, fully classified |
| `infant-car-seat-inventory.csv` | 47 | Every canonical INFANT seat, fully classified |
| `adapter-inventory.csv` | 197 | Every adapter product in the affiliate feed |
| `picker-only-strollers.csv` | 4 | In picker, no canonical `Stroller` row |
| `canonical-only-strollers.csv` | 98 | Canonical strollers **not** shown in the picker |
| `picker-only-infant-seats.csv` | 12 | In seat picker, no matching canonical INFANT row |
| `canonical-only-infant-seats.csv` | 9 | Canonical INFANT seats **not** shown in the picker |
| `zero-match-strollers.csv` | 51 | Canonical strollers with `compatibility_row_count = 0`, classified |
| `suspicious-fanout.csv` | 62 | Strollers flagged for uniform / large / wide seat fan-out |
| `duplicate-identities.csv` | 2 | High-confidence identity clusters (conservative) |

`_summary.json` holds the machine-readable counts.

---

## 3. Strollers / wagons (`stroller-inventory.csv`)

263 canonical records. `travel_system_status` breakdown:

- **HAS_VERIFIED_MATCHES** — 212 (have ≥1 compatibility row).
- **ZERO_MATCHES_NEEDS_AUDIT / NOT_TRAVEL_SYSTEM_COMPATIBLE** — 51 total (see §7).
- **ACCESSORY_NOT_STROLLER** — 0 (the canonical table is clean; accessories live only in the 484-row affiliate feed, not in `Stroller`).

**Data gaps in the export (not derivable):** the canonical `Stroller` table carries **no `productType` and no `lifecycle_status`** columns. `product_type` in the inventory is therefore filled from the live picker category when the stroller is in the picker (blank otherwise), and `lifecycle_status` is left blank. If lifecycle/discontinued state matters for the matrix, it needs to be added to the schema or supplied separately.

---

## 4. Infant car seats (`infant-car-seat-inventory.csv`)

47 canonical INFANT seats. 13 carry the identity flags the brief called out, and they behave exactly as suspected:

- **Same seat, two spellings:** **Clek `Liing`** (picker, 71 rows) vs **Clek `Liingo`** (canonical-only, 68 rows) — almost certainly one product recorded twice. *(Not auto-merged because the strings differ; flagged for human review.)*
- **PIPA family:** `PIPA Aire` (159), `PIPA Aire rx` (172), `PIPA RX` (171), `PIPA urbn` (173, picker-hidden by design — travel-system-only). Four distinct high-volume records; the picker also shows colorway-polluted `PIPA aire rx in Biscotti` / `PIPA rx in Caviar/Cognac` that don't reconcile (see §6).
- **UPPAbaby:** `Aria` + `Aria V2` are grouped as one identity cluster (44 vs 47 rows) — confirm whether both should exist. `Mesa V3` (48 rows) present.
- **Britax:** `Willow S` (31), `Willow SC` (24), `Cypress S` (25, picker-hidden).
- **Evenflo:** `LiteMax NXT` and `Revolve180 LiteMax NXT Rotational` both present (6 rows each) — the Revolve180 is a convertible/rotational line, so confirm it belongs in the INFANT set.

---

## 5. Adapters (`adapter-inventory.csv`)

197 adapter products across 4 providers: `babylist_impact` 81, `awin_anbbaby` 53, `shopify_macrobaby` 52, `manual_tmbc` 11.

- **Only 32 of 197 adapter products are actually referenced by a compatibility row** (matched on `adapter_url`); **165 are unused** in the current compatibility library. That's the adapter catalogue's biggest issue — most catalogued adapters are not wired to any match, and conversely the 2,080 ADAPTER rows mostly point at a small set of generic adapter titles.
- There is **no dedicated `Adapter` model.** Adapter identity today lives in two disconnected places: the affiliate feed (this file) and free-text `Compatibility.adapter_type` / `adapter_url` / `adapter_price` on each of the 2,080 rows. Generations/revisions (Baby Jogger current vs legacy, Joolz Aer² S2, Veer premium vs Britax, Thule single vs double, UPPAbaby Minu/Ridge/Vista) are **not modelled** — they exist only as title text. `stroller_models_named` / `car_seat_models_named` could not be reliably parsed from titles and are left blank; that mapping is the main thing a real adapter model would need.

---

## 6. Picker ↔ canonical reconciliation

**A. Picker-only strollers — `picker-only-strollers.csv` (4).** All four are Delta Children umbrella/double products with retailer-polluted titles (e.g., "Delta – Jeep Adventureglyde Stroller By Delta Children, Black With Grey"). Recommended `ADD_CANONICAL_RECORD`, but most are umbrellas that may not warrant travel-system entries at all → treat as `NEEDS_HUMAN_REVIEW`.

**B. Canonical-only strollers — `canonical-only-strollers.csv` (98).** Canonical strollers not surfaced in the picker. **79 of them carry compatibility rows** (so they drive matches a shopper can't reach from the stroller side), incl. Mockingbird Single 3.0 (27), UPPAbaby Cruz V2 (22) / Vista V2 (20), Zoe Tour (21), and a large block of **Veer Cruiser** wagon variants (18 each). 19 have zero rows. This is the largest single reconciliation bucket and needs a rule: are these intentionally hidden (retailer/legacy) or dropped by picker filters?

**C. Picker-only infant seats — `picker-only-infant-seats.csv` (12).** Now split by intent:
- **5 = `ADD_ALIAS` (canonical already exists; picker name is a colorway/variant):** Cybex `Cloud T`, Nuna `PIPA aire rx`, Nuna `PIPA rx`, UPPAbaby `Aria V2`, UPPAbaby `Mesa V3`. These are **normalization misses**, not missing products.
- **7 = `ADD_CANONICAL_RECORD` (genuinely no canonical row):** AXKID ONE 3, Evenflo (Gold) Shyft DualRide ×2, Joie Mint, Maxi-Cosi Peri 180, Peg Perego Primo Viaggio Lounge, Peg Perego Primo Viaggio Nido. **Caveat:** the two Peg Perego "Primo Viaggio" picker rows likely correspond to existing canonical `Primo Viaggio Lounge` / `Primo Viaggio 4-35 (Nido)` records (a "PEG " prefix + colorway defeated the matcher) → verify before adding; probably `ADD_ALIAS`.

**D. Canonical-only infant seats — `canonical-only-infant-seats.csv` (9).** Canonical INFANT seats absent from the picker. **8 of 9 carry compatibility rows**, several very high: **Nuna PIPA urbn (173)**, **Cybex Aton G2 Swivel (69)**, **Clek Liingo (68)**, **Chicco KeyFit 30 (52)**, Britax Cypress S (25), Maxi-Cosi Mico XP (23), Peg Perego Primo Viaggio 4-35 / Lounge (10 each). Doona X (0) is legacy. **This is the most material picker/canonical disagreement:** popular seats that power hundreds of matches cannot be selected from the seat side of the tool.

---

## 7. Zero-match strollers (`zero-match-strollers.csv`, 51)

| Classification | Count | Meaning |
|---|---|---|
| SHOULD_HAVE_MATCHES | **24** | In picker, full-size/travel/wagon, but zero rows — genuine gaps |
| CONFIRMED_NOT_TRAVEL_SYSTEM_COMPATIBLE | **12** | Umbrella/travel by design |
| LEGACY_NEEDS_RESEARCH | 15 | Not in picker, no rows, no obvious identity twin |
| PROBABLY_NOT / NEEDS_IDENTITY | 0 / 0 | — |

- **SHOULD_HAVE_MATCHES** includes real gear a shopper can pick and get *nothing*: Nuna DEMI icon / FLEX / SWIV, Joie Ginger / Ginger DLX / Kava / Nutmeg / Chive / Caraway Whirl / Poppy Whirl, Joolz Day+, Mompush Lithe Double, Ingenuity 3DSuite, Baby Jogger City Prix / Summit X3, and several Delta/Jeep wagons. These are the priority compatibility gaps.
- **CONFIRMED_NOT** is the umbrella/travel set (Peg Perego Volo ×3 variant records, Mompush Lithe ×2, Evenflo Hummingbird ×2, UPPAbaby G-LUXE, Bellini Juno, Joie Tansy, Safety 1st umbrella). Correctly zero — but note the **variant proliferation** (Volo recorded 3×, Hummingbird 2×).

---

## 8. Suspicious fan-out (`suspicious-fanout.csv`, 62)

Flags: **UNIFORM_BRAND_SEAT_COUNT 56**, **LARGE_SEAT_COUNT 6**, WIDE_BRAND_FANOUT (subset). Brands where *every* frame has an identical seat count (classic euro-group / same-brand fan-out signature): **Nuna 17, WonderFold 12, Graco 10, Chicco 9, Maxi-Cosi 5, Larktale 3**. Largest single fan-outs: Bombi Bēbee V3 (35 seats / 11 brands), BOB Revolution Flex 3.0 (32), Baby Jogger City Select 2 (30), Cybex Gazelle S / e-Gazelle S (30 each), Mockingbird Single-to-Double (30). This is a **diagnostic** flag, not a compatibility assertion — these are the rows most likely to be over-generated by brand-wide adapter inference and should be spot-verified against the audited matrix.

---

## 9. Highest-priority cleanup (ranked)

1. **Make high-volume canonical seats selectable** — Chicco KeyFit 30, Cybex Aton G2 Swivel, Clek Liingo, Britax Cypress S, Maxi-Cosi Mico XP power 20–70+ matches each but aren't in the seat picker (§6D).
2. **Resolve the Clek `Liing` / `Liingo` split** (same product, two records, 71 + 68 rows).
3. **Fix seat picker name pollution** — 5 ADD_ALIAS colorway mismatches (PIPA aire rx / rx, Aria V2, Mesa V3, Cloud T) so the picker reconciles to canonical instead of appearing "missing."
4. **Fill SHOULD_HAVE_MATCHES gaps** — 24 pickable strollers (Nuna DEMI icon/FLEX/SWIV, Joie Ginger family, Joolz Day+, Mompush Lithe Double…) that currently return zero seats.
5. **Decide the 98 canonical-only strollers** (esp. the 79 with compat rows — Veer Cruiser block, UPPAbaby Cruz/Vista V2, Mockingbird) — picker filter bug or intentional hide?
6. **Validate euro-group fan-out** (Nuna/WonderFold/Graco/Chicco uniform counts) before trusting the 2,080 adapter rows.
7. **Model adapters properly** — 165/197 adapter products are unused; generations/revisions live only in free text.
8. **Collapse zero-match variant proliferation** (Peg Perego Volo ×3, Evenflo Hummingbird ×2, Mompush Lithe ×2).

---

## 10. Method, caveats & limits

- **Matching** is normalized `brand:::model` (lower-cased, non-alphanumerics collapsed), mirroring the tool's own `babylistKey`. Picker-only reconciliation additionally strips trailing "in <colorway>", repeated brand prefixes, and common seat marketing suffixes to find a base-model canonical candidate.
- **Duplicate detection is intentionally conservative** (high-precision): after tightening it to *not* collapse legitimately distinct configurations (single vs double vs twin, generation numbers), only **Joolz Day / Day+** remained as a confident cluster. A broader, lower-precision variant-family view already exists at `reports/stroller-model-variant-duplicates.csv`; the identity twins worth acting on are called out inline above (Clek Liing/Liingo, UPPAbaby Aria/Aria V2, Peg Perego Primo Viaggio Lounge dup, Volo/Hummingbird proliferation) rather than asserted as machine "duplicates."
- **Could not be classified from the repo/export alone:** (a) stroller `productType` and `lifecycle_status` for canonical-only strollers not in the picker (no such columns); (b) exact adapter → stroller-model / seat-model mappings and adapter generations (free-text only, no `Adapter` model); (c) whether ADD_ALIAS vs ADD_CANONICAL is correct for the Peg Perego "Primo Viaggio" picker rows (matcher ambiguity); (d) `retailer_brand_direct` (not represented as a retailer slot in the picker payload). These need either a schema field, a fresh live query, or a human call.
