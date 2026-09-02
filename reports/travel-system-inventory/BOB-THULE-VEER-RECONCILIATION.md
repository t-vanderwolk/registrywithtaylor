# TMBC Travel System — BOB · Thule · Veer Row-Level Reconciliation (Evidence-Completion Pass)

> **`BTV_FROZEN_V1` — FROZEN.** 392 rows · 87 KEEP · 245 REMOVE · 6 VERIFY · 54 EXCLUDE · 117 consumer-visible (87 verified + 30 Should Work). Future work may only *add* newly documented compatibility or *resolve* the 6 Aton G2 VERIFY rows — never regenerate or infer across this block from brand/family rules. Freeze rule + open items: `BTV_FROZEN_V1.md`.

**READ-ONLY.** No production database, repository code, schema, migration, script, catalogue, live picker, affiliate feed, or product record was modified. No `--apply`, deploy, commit, or push. All output lives in `reports/travel-system-inventory/`.

This pass retrieved the **actual first-party U.S. manufacturer fit charts** for every unresolved BOB and Thule row and drove the VERIFY/PENDING backlog from **119 → 6**. A follow-up cleanup then completed **Veer** provenance from Veer's first-party manuals and resolved the `Switch&Jog Jogging` duplicate identity, so **all 87 KEEP_UPDATE rows now carry a manufacturer source URL** (BOB + Thule with adapter SKUs; Veer with adapter manuals — Veer publishes no numeric SKU, flagged `SKU_NOT_PUBLISHED`). Row file: `TMBC_Compatibility_Row_Audit_BOB_Thule_Veer.csv` (31 columns incl. `manufacturer_source_url`…`adapter_revision`, and the derived `consumer_compatibility_status`, `consumer_status_basis`, `lineage_hypothesis_type`, `lineage_anchor_model`, `lineage_anchor_compatibility_id`, `lineage_source_url` — see the two-layer section below). Lineage validation detail lives in `TMBC_BTV_Lineage_Candidates_Validated.csv`, `_Lineage_Sources.csv`, `_Lineage_Rejected_Evidence.csv`, `_Lineage_QA.md`.

## Final totals (392 rows)

| Brand | rows | KEEP_UPDATE | REMOVE | VERIFY | EXCLUDE_PRODUCT | PENDING_IDENTITY |
|---|--:|--:|--:|--:|--:|--:|
| BOB | 87 | **26** | 61 | **0** | – | 0 |
| Thule | 134 | **37** | 91 | **6** | – | **0** |
| Veer | 171 | **24** | 93 | 0 | 54 | 0 |
| **Total** | **392** | **87** | **245** | **6** | **54** | **0** |

**Unresolved dropped from 119 (115 VERIFY + 4 PENDING) to 6.** The 6 remaining are a single genuine evidence gap (Cybex Aton G2, below).

## What changed vs. the prior pass

**BOB — was 0 KEEP / 64 REMOVE / 23 VERIFY → now 26 KEEP / 61 REMOVE / 0 VERIFY.**
The prior pass had no exact BOB lists and removed every newer Britax seat. The current BOB Gear adapter pages prove otherwise:
- **12 Britax rows flipped REMOVE → KEEP.** The current Single Britax ClickTight adapter (S943900) lists **Willow / Willow S / Willow SC / Cypress** and fits Revolution Flex 3.0, Alterrain Pro, Rambler; the Wayfinder (S14664700) and Renegade Wagon (S14685500) adapters list the same Willow family. So Willow S/SC/Cypress on those five chassis are genuinely compatible.
- **6 Graco rows flipped REMOVE → KEEP.** The BOB Graco adapter states **"All SnugRide models,"** so SnugRide SnugFit / SnugFit DLX / SnugFit LX are covered (GoMax is not a SnugRide → stays REMOVE).
- **8 VERIFY resolved to KEEP** (Chicco KeyFit 30 + KeyFit 30 ClearTex, Graco SnugRide Lite LX, Peg Perego Primo Viaggio 4‑35 + Nido — single and Duallie where an adapter exists).
- **15 VERIFY resolved to REMOVE**, the important ones being **every Nuna PIPA RX row** (no BOB adapter lists PIPA RX — all list only *Pipa / Pipa Lite*), **Chicco KeyFit Max** variants (BOB Chicco adapter lists KeyFit 30/30 Zip/Zip Air/Magic/Fit2/KeyFit 35, not "Max"), **Clek** (BOB makes no Clek adapter), **UPPAbaby Aria** (adapter lists MESA only), and **Peg Perego Primo Viaggio Lounge** (not listed).

**Thule — was 9 KEEP / 29 REMOVE / 92 VERIFY / 4 PENDING → now 37 KEEP / 91 REMOVE / 6 VERIFY / 0 PENDING.**
- **3 prior KEEP rows corrected to REMOVE:** Chicco **KeyFit Max** on Urban Glide 4‑wheel. Thule's Universal/Chicco adapter (20110762) enumerates Chicco through **KeyFit 35 — never "KeyFit Max."**
- **31 VERIFY resolved to KEEP** using the current per‑stroller approved lists. The newest adapters (20110761/762/763/764, US 2024) DO list the newer seats: **Cybex Cloud T, Maxi‑Cosi Mico Luxe & Peri 180, Nuna PIPA RX / PIPA Aire RX / PIPA Aire, Clek Liing/Liingo, Cybex Cloud G** all fit Urban Glide 3 / 4‑wheel / 3 Double.
- **55 VERIFY resolved to REMOVE.** The **older strollers** carry **older approved lists**: Sleek (11000300), Shine (11400502/503), and Spring 2 (11300410/411) do **not** list Cloud T, Mico Luxe, Peri 180, PIPA Aire/urbn, Ambra, Mico Pro/XP, or KeyFit Max. Both Shine and Spring 2 *do* list **PIPA RX** (KEEP). **Clek Liing/Liingo is on the Shine list (KEEP) but NOT on Spring 2 (REMOVE)** — so Spring 2's only KEEPs among these production rows are Chicco KeyFit 30, KeyFit 30 ClearTex, and Nuna PIPA RX, while Shine also keeps Clek Liing/Liingo.
- **29 REMOVE confirmed** against the legacy chart: Glide 2 / Urban Glide 2 / UG2 Double use adapter **51100941**, whose approved list predates all the 2023‑2025 seats production fanned onto them.
- **4 PENDING resolved:** see identity, below.

**Veer — 24 KEEP / 93 REMOVE / 54 EXCLUDE.** The manufacturer compatibility decisions are unchanged from the prior pass; a final identity cleanup set the **6 `Switch&Jog Jogging` KEEP rows to REMOVE** as duplicate-record rows (that chassis is an alias of `Switch&Jog` — the same six compatible pairs remain on the canonical `Switch&Jog` record). Cypress identity resolved (below).

## The 6 remaining VERIFY — specific missing evidence

All six are **Cybex Aton G2 / Aton G2 Swivel** on **Urban Glide 3 single, Urban Glide 4‑wheel, Urban Glide 3 Double**. Thule's current charts list Cybex **"Aton G"** (plus Aton 2/Q/S2, Cloud G/T/Z/Z2) but not the **"Aton G2"** 2024 refresh by name. The seat is almost certainly the same-footprint successor, but Thule has not published it on the approved list, so this cannot be asserted as KEEP without Thule confirming the Aton G entry covers Aton G2. Row metadata references the correct per‑chassis adapter: the four single‑stroller rows cite **20110761 / 1476111.pdf**; the two **Urban Glide 3 Double** rows cite **20110763 / 1476114.pdf**. **Missing evidence: Thule's confirmation (or an updated chart) that "Aton G" includes Aton G2 / Aton G2 Swivel.**

## Identity / canonicalization resolved

- **Britax "Cypress S" = Britax "Cypress."** Britax sells no seat named "Cypress S" (its ClickTight infant seat is **Cypress**; only Willow has S / SC variants — confirmed on us.britax.com and Veer's own manual, which lists "Cyprus"). Production's "Cypress S" is a mislabel → canonicalize to **Cypress** on every affected row. The identity fix is action-aware: KEEP stands only where the chassis is supported (BOB ClickTight/Wayfinder/Renegade; Veer Switchback), while Cypress S rows on the **Veer Cruiser** (legacy Britax = B‑Safe only) remain **REMOVE** and Cypress S rows on the Veer accessory records remain **EXCLUDE_PRODUCT**. No REMOVE/EXCLUDE row asserts "KEEP stands."
- **Thule Urban Glide 4‑wheel = Urban Glide 4‑Wheel Single Child.** One chassis, two records. The 4 duplicate‑record rows are set REMOVE (canonicalize; compatibility lives on the canonical Urban Glide 4‑wheel record), clearing the 4 PENDING.
- **Veer Switch&Jog = Switch&Jog Jogging** — one chassis, two records (alias). Handled identically to the Thule duplicate: the **6 duplicate rows on `Switch&Jog Jogging` are set REMOVE** (canonicalize; the six compatible pairs remain on canonical `Switch&Jog`). This is an identity dedup, **not** a manufacturer incompatibility.

## Exact manufacturer sources applied

**BOB Gear (bobgear.com), current adapter pages + Jan 2025 chart:**

| Adapter | SKU | Key seats |
|---|---|---|
| Single Britax ClickTight | S943900 | Champ, Willow, Willow S, Willow SC, Cypress (Alterrain/Alterrain Pro/Revolution Flex 3.0/Rambler) |
| Wayfinder | S14664700 | Willow family + Cypress, Cybex Aton 2/Cloud Q/Aton M, Maxi‑Cosi Mico 30/Mico Max 30/Coral XP/Mico Max Plus, Nuna Pipa/Pipa Lite (Wayfinder only) |
| Renegade Wagon | S14685500 | Willow family + Cypress, Cybex Aton 2/Aton Q/Cloud Q, Nuna Pipa/Pipa Lite |
| Single Chicco | S12045900 | KeyFit 30/30 Zip/Zip Air/Magic, Fit2, KeyFit 35 |
| Single Graco | S12045400 | **All SnugRide models** |
| Single Cybex/Maxi‑Cosi/Nuna | S12046000 | Cybex Aton 2/Cloud Q; Maxi‑Cosi Mico 30/Mico Max 30/Coral XP/Mico Max Plus; Nuna Pipa/Pipa Lite |
| Single Peg Perego | S12045500 | Primo Viaggio 4‑35, 4‑35 Nido |
| Single UPPAbaby | S12046600 | MESA (only) |
| Duallie Chicco / Graco / Britax | S02984700 / S02984500 / S02984600 | KeyFit family / All SnugRide / **legacy B‑Safe only (no Willow/Cypress)** |

**Thule (thule.com "approved" fit charts):**

| Adapter | SKU | Source PDF | Notes |
|---|---|---|---|
| UG3 / UG4 – Maxi‑Cosi | 20110761 | 1476111.pdf (US Feb 2024) | adds Cloud T, Mico Luxe, Peri 180, PIPA RX/Aire RX/Aire |
| UG3 / UG4 – Universal/Chicco | 20110762 | 1476112.pdf | Chicco → KeyFit 35 (no Max); UPPAbaby Mesa V2/Mesa Max/Aria; Clek Liing/Liingo; Graco SnugRide 35 Lite LX |
| UG3 Double – MC / Universal | 20110763 / 20110764 | 1476114.pdf / 1476115.pdf | mirror the singles |
| Sleek – Maxi‑Cosi | 11000300 | 643095.pdf | older list; excludes Cloud T/Mico Luxe/Peri 180/PIPA Aire/RX |
| Shine – Maxi‑Cosi / Chicco | 11400502 / 11400503 | 1205150.pdf | has Clek + PIPA RX; excludes Cloud T/Mico Luxe/Peri 180/PIPA Aire |
| Spring – Maxi‑Cosi / Chicco | 11300410 / 11300411 | 783859.pdf | has PIPA RX; excludes newer Cybex/Maxi‑Cosi & Clek |
| Glide / Urban Glide 1&2 (legacy) | 51100941 | 514848.pdf | pre‑2023 list; excludes every newer seat |

**Veer (support.goveer.com first-party adapter manuals, Nov 2024 fit lists):**

| Adapter | Source | Key seats |
|---|---|---|
| Cruiser — Cybex/Maxi‑Cosi/Nuna/Clek | 479577 | Nuna PIPA aire RX / RX / lite lx / lite / PIPA; Cybex Aton Q & M; Maxi‑Cosi Mico Max 30/Mico 30/Nxt/Mico AP; Clek Liing (Cloud Q NOT compatible) |
| Cruiser — Graco/Britax/UPPAbaby | 479257 | UPPAbaby Mesa/Mesa V2/Mesa Max/Aria |
| Switchback (&Roll/&Jog) — Maxi‑Cosi/Nuna/Clek/Cybex | 532224 | same Nuna/Maxi‑Cosi/Cybex/Clek list **plus newer Britax Cypress/Willow/Willow S/Willow SC** |
| Switchback — UPPAbaby | 537495 | UPPAbaby Mesa/Mesa V2/Mesa Max/Aria |
| Switchback — Britax (legacy) | 510552 | B‑Safe family only — explicitly NOT Cypress/Willow (those use 532224) |

Every KEEP_UPDATE row (all three brands) carries its exact `manufacturer_source_url`. BOB + Thule KEEP rows also carry the exact `adapter_sku`; Veer publishes no numeric SKU on its manuals, so those rows use `SKU_NOT_PUBLISHED` with the first-party manual URL as evidence. The Veer manuals also confirm the **Britax "Cypress"** listing (spelled "Cyprus" on Veer's page), corroborating the production "Cypress S" → "Cypress" canonicalization.

## Add candidates (`TMBC_Compatibility_Add_Candidates_BOB_Thule_Veer.csv`)

The ADD file contains **exact stroller × seat pairs only** (no placeholders, no "(various)") — **7 rows** (4 BOB Champ + 3 Thule Charm). Each row is oriented `stroller_model` = chassis, `car_seat_model` = infant seat.
- **BOB Champ** (4): × Revolution Flex 3.0 / Alterrain Pro / Rambler (ADAPTER S943900), and × Wayfinder (INCLUDED, Wayfinder Pack). Champ is on the ClickTight adapter's seat list but absent from the CarSeat catalogue — the native BOB travel‑system path. (BOB Champ is the *car seat*; the reversal seen in earlier prose was prose-only — the CSV is correctly oriented.)
- **Thule Charm** (3): × Maxi‑Cosi Peri 180 / Nuna PIPA Aire RX / Nuna PIPA RX (ADAPTER 11500701, SOLD_SEPARATELY) — the only entries on the first-party Charm 11500701 fit chart that exactly match the US CarSeat catalogue. The Charm chassis itself must be added first (see catalogue gaps).

## Catalogue / research follow-up (NOT compatibility rows)

- **Thule Charm — closed.** The first-party 11500701 fit chart (US May 2026) was retrieved and extracted exactly into `TMBC_BTV_Thule_Charm_Crosswalk.csv` (29 entries): 3 EXACT_CANONICAL_US_MATCH → 3 Charm ADD rows; 7 US_CATALOGUE_GAP; 4 IDENTITY_REVIEW_REQUIRED (Willow, Cloud T i-size, Cloud G i-size, Coral — **not** aliased to Willow S/SC, Cloud T, Cloud G Pro, Coral XP); 15 NON_US/i-Size (excluded). Canonical chassis = **Thule Charm** ("Charm 2 in 1"); bundle/color SKUs 11500502/504/506 are **one** chassis, not three. The chart **also lists Cybex Aton‑G**, a second first-party Thule source confirming Aton G belongs in the catalogue as a real archived seat (still nothing about G2). Catalogue gaps in `TMBC_BTV_Catalogue_Gaps.csv`.

## Consumer compatibility layer (`consumer_compatibility_status` — derived, additive)

The audit `audit_action` (evidence/database decision) is kept separate from the consumer-facing category. A `REMOVE` almost always means *"this exact seat is not named on the manufacturer's published list,"* which is **not** the same as the manufacturer saying the pairing is incompatible. So a second, derived field maps each row into the four-category consumer system **without changing any audit decision underneath**:

| `audit_action` | derived `consumer_compatibility_status` | rule |
|---|---|---|
| KEEP_UPDATE + attachment component | **COMPATIBLE_WITH_ADAPTER** | adapter/bumper/ring required; exact seat named on the adapter |
| KEEP_UPDATE + no attachment | **DIRECTLY_COMPATIBLE** | direct click-in |
| VERIFY or REMOVE **with a proven `lineage_source_url`** | **SHOULD_WORK_UNVERIFIED** | see the evidence model + mechanical rule below |
| REMOVE, manufacturer **affirmatively excludes** it | **NOT_COMPATIBLE** | e.g. "Cybex Cloud Q NOT compatible" (none in this slice) |
| REMOVE, no proven lineage & no affirmative negative | **UNKNOWN** | absence of evidence, not evidence of absence |
| REMOVE, duplicate/bad identity | **IDENTITY_DEDUP** | canonical record carries the pair; no consumer result |
| EXCLUDE_PRODUCT | **EXCLUDED_PRODUCT** | accessory, not a stroller; no consumer result |

**Evidence model (`consumer_status_basis`) — SHOULD_WORK requires *proven* attachment lineage, not "several related seats on one adapter."** The fact that an adapter lists PIPA + PIPA Lite does not, by itself, document that a later PIPA-branded carrier uses the same stroller-side attachment — that is still family inference, just narrower. A row therefore qualifies as SHOULD_WORK only with an affirmative source:

| `consumer_status_basis` | requirement |
|---|---|
| `MANUFACTURER_EXACT` | exact stroller × exact seat confirmation (these are the KEEP rows) |
| `DOCUMENTED_SUCCESSOR_SAME_INTERFACE` | manufacturer documents the successor **and** an unchanged attachment interface |
| `DOCUMENTED_SHARED_ATTACHMENT_PLATFORM` | manufacturer explicitly documents both seats sharing attachment geometry/platform |
| `MANUFACTURER_PLATFORM_GROUP` | manufacturer explicitly defines a compatibility family that contains the exact seat |
| `NONE` | everything else → UNKNOWN |

Proof is kept separate from guess. `consumer_status_basis` is **proof-only** (values above); a separate audit column **`lineage_hypothesis_type`** (`SUSPECTED_*`/`NONE`) holds the pre-proof guess so nothing labelled "DOCUMENTED" ever overstates the evidence. Three columns carry the proof: **`lineage_anchor_model`** + **`lineage_anchor_compatibility_id`** (the anchor must be a real KEEP/`MANUFACTURER_EXACT` row on the **same** canonical stroller/adapter — not a name on a PDF) and **`lineage_source_url`**. **Mechanical rule:** `SHOULD_WORK_UNVERIFIED` requires a strong basis **+** a valid anchor id **+** a source that affirmatively proves the stroller-side attachment. Any blank → `UNKNOWN`.

**Applied to BTV (anchor validation + sourcing + a first-party correction pass — see `TMBC_BTV_Lineage_QA.md`).** The 16 word-share rows (KeyFit Max, Peg Lounge) were downgraded. Of the remaining 113 provisional candidates, **anchor validation dropped 80** that had no in-dataset KEEP anchor on the same stroller (every Cybex Aton G2/G2 Swivel; every UPPAbaby Mesa V3; all BOB Nuna/Mico/Cloud). Of the **33 valid-anchored** survivors, first-party sourcing **promoted 30** to SHOULD_WORK:
- **Nuna PIPA Aire / PIPA Aire RX / PIPA urbn** (21) → `MANUFACTURER_PLATFORM_GROUP` — Nuna documents the adapter fits "any PIPA series" seat, and the PIPA urbn page states it "pairs with all Nuna strollers designed for PIPA series car seats" (its baseless design is a *vehicle*-install trait, not a stroller-attachment one).
- **UPPAbaby Aria V2** (6) → `DOCUMENTED_SHARED_ATTACHMENT_PLATFORM` — UPPAbaby adapter "compatible with all Aria models."
- **Maxi-Cosi Mico XP** (3) → `DOCUMENTED_SHARED_ATTACHMENT_PLATFORM` — the Maxi-Cosi Zelia stroller adapter lists Mico XP + Mico XP Max + Mico Luxe (the KEEP anchor) on the same adapter.

Held back: **Maxi-Cosi Mico Pro** (3) → source-pending — a **real** current seat (IC418; the earlier "not a real model" finding was wrong), but no first-party *stroller* adapter names it sharing attachment with Mico Luxe (shared *vehicle* base rejected). **Catalogue gap:** Cybex **Aton G** is a real legacy CYBEX seat (now discontinued, replaced by G2), absent from the CarSeat table; it is on the Thule 20110761/763 lists, so cataloguing it would make Thule × Aton G a `MANUFACTURER_EXACT` anchor. The **6 Aton G2 rows stay VERIFY** (Thule does not name G2). See `TMBC_BTV_Catalogue_Gaps.csv`.

**Distribution across the 392 rows** (audit_action totals unchanged: KEEP 87 · REMOVE 245 · VERIFY 6 · EXCLUDE 54):

| consumer_compatibility_status | rows | surfaced to parents? |
|---|--:|---|
| DIRECTLY_COMPATIBLE | 0 | yes |
| COMPATIBLE_WITH_ADAPTER | 87 | yes (manufacturer-verified) |
| SHOULD_WORK_UNVERIFIED | **30** | yes (Nuna PIPA Aire/Aire RX/urbn 21 + UPPAbaby Aria V2 6 + Maxi-Cosi Mico XP 3, first-party lineage sourced) |
| NOT_COMPATIBLE | 0 | yes (no affirmative exclusion in this slice) |
| UNKNOWN | 202 | no public assertion — incl. 3 valid candidates source-pending (Maxi-Cosi Mico Pro) + 80 invalid-anchor |
| IDENTITY_DEDUP | 19 | no (Switch&Jog Jogging 15 + UG4 Single Child 4) |
| EXCLUDED_PRODUCT | 54 | no |

**Frozen BTV numbers:** **87 manufacturer-verified compatible · 30 lineage-sourced Should Work · 0 manufacturer-confirmed incompatible · 54 excluded products · 19 identity dedups · 6 unresolved exact Thule rows** (audit `VERIFY`). **117 rows are consumer-visible** (87 + 30). 3 valid candidates (Maxi-Cosi Mico Pro) remain source-pending; the "113 candidate" count fell to 33 valid anchors → 30 promoted (candidate totals are allowed to fall as anchor validation proves some were never valid).

## Materialization guardrail (for the importer — `audit_action` ≠ delete)

**`audit_action = REMOVE` must not mean "delete this pairing everywhere."** In this slice 30 REMOVE rows are confirmed SHOULD_WORK (lineage-sourced) and must be preserved as unverified consumer pairings. The importer/materialization layer must branch on **both** fields:

| audit_action | consumer_compatibility_status | production treatment |
|---|---|---|
| KEEP_UPDATE | DIRECTLY_COMPATIBLE / COMPATIBLE_WITH_ADAPTER | retain/update **verified** pairing |
| REMOVE | SHOULD_WORK_UNVERIFIED | drop as *verified*, **preserve/materialize as unverified consumer pairing** |
| REMOVE | UNKNOWN | remove from consumer results (no assertion) |
| REMOVE | NOT_COMPATIBLE | materialize as an **explicit negative** |
| REMOVE | IDENTITY_DEDUP | remove duplicate identity only (pair lives on canonical record) |
| VERIFY | SHOULD_WORK_UNVERIFIED | preserve as unverified pending resolution |
| EXCLUDE_PRODUCT | EXCLUDED_PRODUCT | exclude entirely |

The earlier "removing 299 REMOVE+EXCLUDE rows leaves 93" figure is correct **for the verified audit layer only** — it is **not** the consumer dataset. The consumer dataset **today is 117 surfaced relationships** (87 manufacturer-verified + 30 lineage-sourced Should Work); more can be added only as further candidates pass the lineage-source test.

## Net effect

Removing/excluding the 299 REMOVE+EXCLUDE rows would take the live BOB/Thule/Veer footprint from 392 to **93 rows**, of which **87 are now on documented exact manufacturer lists** and **6 await one Thule confirmation** (Aton G2). Merge by `compatibility_id` to preserve every other brand's decisions and the 2,312 total.
