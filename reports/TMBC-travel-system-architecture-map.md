# Travel System Compatibility Tool — Forensic Architecture Map
**Repository:** `registrywithtaylor` · **Branch:** `main` · **Read date:** 2026-08-24
**Method:** static read of the repository and Prisma schema on the connected device. No files modified, no database queried, no script executed, no migration created, nothing committed or deployed.

**Confidence key used throughout:**
- `VERIFIED` — read directly in the source this pass.
- `UNVERIFIED: <reason>` — could not be established from the repository alone.

**One caveat that shapes everything below:** the repo's `.env` points `DATABASE_URL` at `postgresql://…@localhost:5432/registrywithtaylor` — a local dev database. Production runs on Heroku (`Procfile`: `release: npx prisma migrate deploy` / `web: npm start`) with its own config var. **No live row counts in this document are verified against production.** Every claim here is about code behavior, not current data.

---

# 1. DATABASE SCHEMA

All models below are in `prisma/schema.prisma`. There are 41 models total; these are the ones the Travel System tool touches.

## 1.1 `Stroller` — authoritative, compatibility side

| Aspect | Value |
|---|---|
| PK | `id String @id @default(cuid())` |
| Unique | `@@unique([brand, model], name: "brand_model")` |
| Index | `@@index([brand])` |
| Relations | `compatibilities Compatibility[]`, `spec StrollerSpec?` |
| Used live? | **Yes** — the compatibility half of every lookup |
| Authoritative? | **Authoritative** for compatibility; *not* the source of the picker list |

Fields: `brand`, `model`, `displayName?`, `summary?`, `amazonUrl?`, `manualBabylistUrl?`, `imageUrl?`, `babylistSku?`, `babylistUrl?`, `babylistPrice?`, `babylistImage?`, `babylistUpdatedAt?`, `createdAt`, `updatedAt`.

**No visibility/`isPublic`/`isHidden` column exists.** A stroller's visibility in the tool is an emergent side effect of whether it has a recognized retailer link — see §6.4.

## 1.2 `CarSeat` — authoritative, seat side

| Aspect | Value |
|---|---|
| PK | `id String @id @default(cuid())` |
| Unique | `@@unique([brand, model], name: "brand_model")` |
| Indexes | `@@index([brand])`, `@@index([seatType])` |
| Relations | `compatibilities Compatibility[]` |
| Used live? | **Yes** — both the picker list and the compatibility half |
| Authoritative? | **Authoritative** |

Fields: `brand`, `model`, `displayName?`, `seatType CarSeatType @default(INFANT)`, `summary?`, `amazonUrl?`, `manualBabylistUrl?`, `imageUrl?`, `babylistSku?`, `babylistUrl?`, `babylistPrice?`, `babylistImage?`, `babylistUpdatedAt?`, `createdAt`, `updatedAt`.

`enum CarSeatType { INFANT | CONVERTIBLE | ALL_IN_ONE }`. **Every travel-system query hard-filters `seatType = 'INFANT'`.**

## 1.3 `Compatibility` — the only stored pairing table

| Aspect | Value |
|---|---|
| PK | `id String @id @default(cuid())` |
| Unique | `@@unique([strollerId, carSeatId])` |
| Indexes | `@@index([strollerId])`, `@@index([carSeatId])`, `@@index([compatibilityType])` |
| FKs | `strollerId → Stroller.id onDelete: Cascade`; `carSeatId → CarSeat.id onDelete: Cascade` |
| Used live? | **Yes** |
| Authoritative? | **Authoritative — but not exhaustive.** See §3; a large share of what users see is never in this table. |

Fields:
```
compatibilityType  CompatibilityType            -- DIRECT | ADAPTER | LIMITED | LOCKED | INCOMPATIBLE
adapterRequired    Boolean  @default(false)
adapterType        String?                       -- free-text adapter NAME shown to shoppers
notes              String?
confidence         CompatibilityConfidence @default(HIGH)   -- HIGH | MEDIUM | LOW
adapterBabylistUrl String?                       -- ── Babylist (Impact.com) adapter sync fields ──
adapterPrice       Float?
adapterImage       String?
adapterBabylistSku String?
adapterUpdatedAt   DateTime?
createdAt / updatedAt
```

**`onDelete: Cascade` on both FKs is load-bearing:** deleting a `Stroller` or `CarSeat` row silently destroys every compatibility pairing attached to it. Since the admin UI cannot rename `brand`/`model` (§10.4), correcting a misspelled product means delete-and-recreate — which wipes its whole pairing set.

**There is no visibility flag on `Compatibility`.** The only ways to stop a pairing surfacing are delete, or re-typing it `INCOMPATIBLE` (which is filtered out at read time — §3.F) and thereby mislabeling it.

## 1.4 `AffiliateCatalogProduct` + `ProductEnrichment` — derived / feed data

`AffiliateCatalogProduct` (PK `id`, `@@unique([provider, externalId])`, indexes on `brand`/`title`/`sku`/`productTypePath`/`isActiveInFeed`/`lastSyncedAt`).
Key fields: `provider @default("babylist_impact")`, `catalogId @default("8981")`, `externalId`, `sku?`, `brand?`, `title`, `price?`, `salePrice?`, `imageUrl?`, `productUrl?`, `affiliateUrl?`, `manualAmazonUrl?`, `retailer @default("Babylist")`, `itemGroupId?`, `isActiveInFeed @default(true)`, `rawPayload Json?`, `enrichment ProductEnrichment?`.

`ProductEnrichment` (PK `id`, `rawProductId @unique → AffiliateCatalogProduct.id onDelete: Cascade`).
Key fields: `canonicalBrand?`, `canonicalName?`, `slug? @unique`, `tmbcCategory?`, `tmbcSubcategory?`, `productType?`, `visibility @default("auto")`, `isPublic @default(false)`, `needsReview @default(true)`, `reviewStatus CatalogReviewStatus @default(AUTO_CATEGORIZED)`, `confidenceScore?`, plus editorial/tag fields.

`enum CatalogReviewStatus { AUTO_CATEGORIZED | NEEDS_REVIEW | REVIEWED | HIDDEN }`

**Used live? Yes — this pair is the sole source of the stroller picker list** (§7). **Authoritative? No — derived from affiliate feeds and an auto-categorizer.**

## 1.5 Supporting models

- `StrollerSpec` — PK `id`, `strollerId @unique → Stroller onDelete: Cascade`. Quiz/compare dimensions. Not read by the travel-system tool. `VERIFIED`: `app/api/matchmaker/strollers/route.ts` notes these fields "are null on every row right now."
- `GbgBadgeOverride` — GoodBuy Gear open-box badge overrides. Display only; no compatibility impact.

## 1.6 Field-by-field answer to the specific asks

| Concept | Exact location |
|---|---|
| stroller brand/model | `Stroller.brand`, `Stroller.model` (unique together) |
| car seat brand/model | `CarSeat.brand`, `CarSeat.model` (unique together) |
| seat type | `CarSeat.seatType` (`CarSeatType`) |
| compatibility type | `Compatibility.compatibilityType` (`CompatibilityType`) |
| adapter required | `Compatibility.adapterRequired` |
| adapter type/name | `Compatibility.adapterType` (free text) |
| notes | `Compatibility.notes` |
| confidence | `Compatibility.confidence` (`CompatibilityConfidence`) |
| URLs | `Stroller/CarSeat`: `babylistUrl`, `amazonUrl`, `manualBabylistUrl`. `Compatibility`: `adapterBabylistUrl`. `AffiliateCatalogProduct`: `affiliateUrl`, `productUrl`, `manualAmazonUrl` |
| prices | `babylistPrice`, `Compatibility.adapterPrice`, `AffiliateCatalogProduct.price`/`salePrice` |
| images | `imageUrl` (manual, wins), `babylistImage` (synced), `Compatibility.adapterImage`, `AffiliateCatalogProduct.imageUrl` |
| retailer providers | `AffiliateCatalogProduct.provider` — observed values: `babylist_impact`, `shopify_macrobaby`, `bombi_direct`, `manual_tmbc`, `awin_anbbaby`, `impact_goodbuygear` |
| model aliases / canonical names | `ProductEnrichment.canonicalBrand`, `ProductEnrichment.canonicalName`. **No alias column exists on `Stroller`/`CarSeat`** — aliasing there is code-only (`lib/catalog/brandAliases.ts`) |
| product status / visibility | `ProductEnrichment.reviewStatus`, `.needsReview`, `.isPublic`, `AffiliateCatalogProduct.isActiveInFeed`. **Nothing equivalent on `Stroller`/`CarSeat`/`Compatibility`** |

---

# 2. LIVE PUBLIC API FLOW

## 2.1 `/api/compatibility` — `app/api/compatibility/route.ts` (62 lines)

- Params: `strollerBrand` + `strollerModel`, **or** `carSeatBrand` + `carSeatModel`.
- Calls: `getTravelSystemCompatibility()` / `getTravelSystemCompatibilityByCarSeat()` in `lib/server/travelSystemCompatibility.ts`.
- Tables: `Stroller`, `CarSeat`, `Compatibility`, `AffiliateCatalogProduct` (adapter + retailer enrichment).
- Headers: `Cache-Control: no-store`. `runtime = 'nodejs'`.
- Errors: 404 `{"error":"Stroller not found."}` / `{"error":"Car seat not found."}`; 400 when params are incomplete.

**`VERIFIED` — this route has zero call sites in the application.** A repo-wide grep for `api/compatibility` across `app/`, `components/`, `lib/` finds no `fetch()`. The results page calls the server functions directly. The endpoint is a public, externally-reachable surface that nothing internal consumes.

## 2.2 `/api/catalog/strollers` — `app/api/catalog/strollers/route.ts`
Calls `getPublicStrollerCatalogBrands()` (`lib/server/publicStrollerCatalog.ts:173`). Reads `AffiliateCatalogProduct` ⋈ `ProductEnrichment`. Returns `{ brands: [{ brand, count, types: [{ category, label, products: [...] }] }] }`. `Cache-Control: public, s-maxage=600, stale-while-revalidate=3600`.

## 2.3 `/api/catalog/carseats` — `app/api/catalog/carseats/route.ts`
Calls `getPublicCarSeatBrands()` (`lib/server/publicCarSeatCatalog.ts:72`). Reads `AffiliateCatalogProduct` ⋈ `ProductEnrichment` where `enrichment.productType === 'infant car seat'`. Same response shape and cache headers.

**`VERIFIED` — `/api/catalog/carseats` is NOT the travel-system tool's car seat list.** The tool reads the `CarSeat` table (§8.1). The two disagree on both membership and naming: the catalog endpoint returns colorway-polluted model strings such as `"Nuna PIPA aire rx in Biscotti"`, `"UPPAbaby Mesa V3 in Ada"`, `"Peg Perego PEG Primo Viaggio Nido in Mon Amour"`.

## 2.4 End-to-end flow

```
PICKER (page load, server-rendered)
  app/tools/travel-system/page.tsx
    → getTravelSystemStrollers()  → getPublicStrollerCatalogTravelSystemOptions()
                                   → getPublicStrollerCatalogBrands()
                                   → AffiliateCatalogProduct ⋈ ProductEnrichment
                                   → canonicalise → dedupe → exclude → retailer-gate
    → getTravelSystemCarSeats()   → raw SQL: CarSeat WHERE seatType='INFANT'
                                   → enrichWithPublicRetailers → hasPublicTravelSystemRetailer
    → props → <TravelSystemGenerator/>  (client; search + browse only)

RESULTS (server-rendered, no API hop)
  app/tools/travel-system/results/page.tsx  ?stroller=<slug> | ?carSeat=<slug>
    → findTravelSystemOptionBySlug()
    → getTravelSystemCompatibility() | getTravelSystemCompatibilityByCarSeat()
        ├─ findStrollerByBrandAndModel()      ← brand-only WHERE (§13.1)
        ├─ explicit rows: Compatibility ⋈ CarSeat  (seatType='INFANT')
        ├─ closed-ecosystem filter (stroller→seat direction ONLY)
        ├─ + getSameBrandDefaultCarSeats()    ← GENERATED, not stored
        ├─ + getSharedAdapterInferredSeats()  ← GENERATED, not stored
        ├─ getAdapterType() overwrite         ← discards stored adapterType (§3.G)
        ├─ .filter(type !== 'INCOMPATIBLE')
        ├─ canonicalBrand() collapse
        ├─ .sort(compareCompatibleCarSeats)
        └─ fillAdapterProducts()              ← adapter deep link, Amazon-search fallback
    → ResultCard / AdapterCallout             ← presentation-layer adapter override (§13.2)

/api/compatibility  → same two server functions, but nothing in the app calls it.
```

---

# 3. COMPATIBILITY RESOLUTION ENGINE

Primary file: **`lib/server/travelSystemCompatibility.ts` (1,612 lines)**. Types/sorting: **`lib/compatibilityEngine.ts` (232 lines)**.

## 3.A How `DIRECT` is determined
Three independent ways:
1. **Stored** — a `Compatibility` row with `compatibilityType = 'DIRECT'`, passed through `normalizeCompatibilityType()` (`lib/compatibilityEngine.ts`). Note: that function returns **`'INCOMPATIBLE'` for any unrecognised string**, and the row is then dropped — an unexpected enum value silently deletes a pairing from results.
2. **Generated — same-brand default** (§3.C). Forced `compatibilityType: 'DIRECT'`, `adapterRequired: false`, `adapterType: null`, `confidence: 'MEDIUM'`.
3. **Presentation** — `resultBucket()` in `results/page.tsx` puts a row in the "Direct Fit" section only when `compatibilityType === 'DIRECT' && !adapterRequired`.

## 3.B How `ADAPTER` is determined
1. **Stored** — `compatibilityType = 'ADAPTER'` and/or `adapterRequired = true`.
2. **Generated — shared-adapter inference** (§3.D). Forced `'ADAPTER'`, `adapterRequired: true`, `confidence: 'MEDIUM'`.
3. Server-side, `saveCompatibility()` in the admin action forces `adapterRequired: compatibilityType === 'ADAPTER' || boolField(...)`.

## 3.C Same-brand default — **YES, this exists**

- **Functions:** `getSameBrandDefaultCarSeats()` (stroller→seat) and `getSameBrandDefaultStrollers()` (seat→stroller), `lib/server/travelSystemCompatibility.ts`.
- **Gate:** `supportsSameBrandDirectDefault(brand)` → `DIRECT_DEFAULT_BRANDS` (lines ~493-500):
  ```ts
  const DIRECT_DEFAULT_BRANDS = new Set([
    'cybex', 'joie', 'nuna', 'orbit baby', 'peg perego', 'romer', 'uppababy',
  ]);
  ```
- **Conditions:** the *selected item's own brand* must be in that set. It then pulls **every** same-brand row (`CarSeat WHERE seatType='INFANT' AND LOWER(brand)=LOWER(<brand>)`, or `Stroller WHERE LOWER(brand)=…`), excluding ids already present as explicit rows, and requiring `hasPublicTravelSystemRetailer`.
- **Output stamp:** `compatibilityType: 'DIRECT'`, `adapterRequired: false`, `adapterType: null`, `confidence: 'MEDIUM'`, and the fixed note:
  > `"This is the same-brand default path. Confirm the current release details before you buy, but it is the cleanest place to start."`
- **Exceptions:** none beyond the brand gate and the retailer gate. There is **no model-level check** — every infant seat of the brand is paired with every stroller of the brand, regardless of generation or actual fit.
- **Stored?** **No.** Returned dynamically. Nothing is written to `Compatibility`.

## 3.D Universal / shared-adapter inference — **YES, this exists**

- **Functions:** `getSharedAdapterInferredSeats()` (forward) and `getSharedAdapterInferredStrollers()` (reverse).
- **Constants** (lines ~517-524):
  ```ts
  const SHARED_ADAPTER_TRIGGER_BRAND = 'nuna';
  // Britax is intentionally NOT in the shared euro group — it only fits strollers
  // whose manufacturer specifically lists it (handled via explicit compatibility
  // rows), never through the universal Nuna / Maxi-Cosi / CYBEX / Clek inference.
  const SHARED_ADAPTER_EXPANSION_BRANDS = ['cybex', 'clek', 'maxi-cosi'];
  ```
  and (line ~503) `const SHARED_ADAPTER_BRANDS = new Set(['clek', 'cybex', 'maxi-cosi', 'nuna']);`
- **Forward trigger:** the stroller must already have **at least one explicit Nuna infant-seat row**. Then **every** Cybex, Clek and Maxi-Cosi infant seat in the DB (with a public retailer) is added.
- **Reverse trigger:** `usesSharedInfantSeatAdapter(carSeat.brand)` — i.e. the seat is Clek/Cybex/Maxi-Cosi/**Nuna**. Then **every** non-closed stroller that has any explicit Nuna row is added.
- **Blockers, both directions:** `isClosedEcosystemStroller()` and `isDirectFitOnlyStroller()`.
- **Output stamp:** `compatibilityType: 'ADAPTER'`, `adapterRequired: true`, `confidence: 'MEDIUM'`, fixed note:
  > `"Compatible via the shared Nuna / CYBEX / Clek / Maxi-Cosi adapter standard. Verify the specific adapter for your stroller model before purchase."`
- **Stored?** **No.** Dynamic only.
- **Scale:** one explicit Nuna row on a stroller silently produces *N* additional pairings, where *N* = the count of all Cybex + Clek + Maxi-Cosi infant seats with public retailers.

## 3.E Hard-coded rule sets (complete)

```ts
CLOSED_ECOSYSTEM_STROLLER_BRANDS = new Set(['nuna'])          // ~line 540
ADAPTER_INCLUDED_WITH_STROLLER_BRANDS = new Set(['mercedes','mercedes baby'])  // ~line 510
TRAVEL_SYSTEM_ONLY_SEATS = new Set(['nuna:::pipa urbn'])      // lib/compatibilityEngine.ts:48
DIRECT_FIT_ONLY_STROLLERS = [                                  // ~lines 549-563
  { brand: 'silver cross', model: /\bclic\b/i },
  { brand: 'britax',       model: /brook|grove|juniper|phases|prism/i },
  { brand: 'romer',        model: /\btura\b|\blani\b/i },
]
```

**The Nuna asymmetry is deliberate and documented in-file** (comment at ~lines 527-538): Nuna *strollers* are closed (same-brand seats only, no adapters, no inference); Nuna *car seats* are universal and ride onto other brands' strollers. The two halves are intentionally not mirrored.

## 3.F Other logic that alters what is returned

1. **Closed-ecosystem filter on explicit rows — forward direction only.** In `getTravelSystemCompatibility()`:
   ```ts
   const isClosedStroller = isClosedEcosystemStroller(stroller.brand);
   ... isClosedStroller
       ? explicitRows.filter((row) => normalizeBrand(row.brand) === normalizeBrand(stroller.brand))
       : explicitRows
   ```
   **`getTravelSystemCompatibilityByCarSeat()` has no equivalent filter** — its `publicExplicitRows` is filtered only by `hasPublicTravelSystemRetailer`. **This is a confirmed directional mismatch:** a non-Nuna seat with a stored `Compatibility` row against a Nuna stroller is **shown** in the seat→stroller direction and **hidden** in the stroller→seat direction.
2. **`INCOMPATIBLE` rows are dropped**, not displayed as incompatible: `.filter((row) => row.compatibilityType !== 'INCOMPATIBLE')`.
3. **Brand-casing collapse** via `canonicalBrand()` (`lib/catalog/brandAliases.ts`), which also rewrites the leading brand token of `displayName`.
4. **Retailer gate** — `hasPublicTravelSystemRetailer()` removes any stroller or seat lacking a recognised retailer, *including* products that have a perfectly valid stored pairing.
5. **Catalog-only fallback** — if no `Stroller` row exists for the brand at all, the function returns the catalog card with `compatibleCarSeats: []` (§7.4). The reverse function has **no** such fallback; it returns `null`.
6. **Sorting** — `compareCompatibleCarSeats` / `compareCompatibleStrollers` (`lib/compatibilityEngine.ts`): `COMPATIBILITY_SCORES {DIRECT:500, ADAPTER:400, LIMITED:300, LOCKED:200, INCOMPATIBLE:100}` desc → `CONFIDENCE_SCORES {HIGH:30, MEDIUM:20, LOW:10}` desc → brand/model/displayName alpha.

## 3.G `getAdapterType()` — the stored adapter name is overwritten

Precedence, in order (`lib/server/travelSystemCompatibility.ts` ~lines 615-650):

1. `!adapterRequired` → `null`
2. stroller brand ∈ `ADAPTER_INCLUDED_WITH_STROLLER_BRANDS` → `"Included with stroller — not sold separately"`
3. **car seat brand ∈ `SHARED_ADAPTER_BRANDS` → `"<StrollerBrand> adapter for Maxi-Cosi / Nuna / CYBEX / Clek infant seats"`**
4. stored `adapterType` if non-empty
5. `notes` contains `'included'` → `"Included with stroller"`
6. `notes` contains `'sold separately'` → `"<StrollerBrand> car seat adapter (sold separately)"`
7. same brand → `"<Brand> infant car seat adapter"`
8. fallback → `"<StrollerBrand> adapter for <CarSeatBrand> infant seats"`

**Step 3 fires before step 4.** For any Clek / Cybex / Maxi-Cosi / Nuna seat, a curated adapter name stored in `Compatibility.adapterType` is **discarded** and replaced with the generic euro-group string. This is the single most direct way an exact, manufacturer-verified adapter name fails to reach the user.

---

# 4. DATA-WRITING / POPULATION SCRIPTS

`scripts/` holds 179 files; **95** write to one or more of the target tables. `package.json` defines ~40 `catalog:*` / `strollers:*` aliases. The convention is a dry-run default with an `--apply` flag (`const apply = process.argv.includes('--apply')`).

## 4.1 Scripts that WRITE `Compatibility` — the reintroduction surface

| Script | npm alias | Writes | Infers? | REINTRODUCTION RISK |
|---|---|---|---|---|
| `applyUniversalAdapterCompatibility.ts` | `catalog:universal-adapters(-apply)` | `compatibility.create` | **Yes** — `TRIGGER_SEAT_BRAND='Nuna'` (ln41) + `UNIVERSAL_ADAPTER_RULES` in `lib/catalog/universalAdapters.ts`; one ADAPTER row per matched stroller × Nuna seat, plus each rule's `extraSeatBrands` | **YES — highest.** Rebuilds the whole universal-adapter expansion as *stored* rows |
| `applySameBrandCompatibility.ts` | `catalog:same-brand(-apply)` | `compatibility.create` | **Yes** — `RULES: Rule[]` ln44-109, 8 in-file brand rules (Graco, Evenflo, Chicco, Britax, Baby Trend, Maxi-Cosi, Silver Cross, Peg Perego), each a `strollerModel`/`carSeatModel` regex pair | **YES** |
| `scanAdapterCompatibility.ts` | `catalog:scan-adapters(-apply)` | `compatibility.create` | **Yes** — infers from adapter product **titles**; see §5.3 | **YES** |
| `applyBabyJoggerCompatibility.ts` | `catalog:baby-jogger-compat(-apply)` | `compatibility.create` | Chart transcription from `lib/catalog/babyJoggerAdapters.ts`; forces `confidence:'HIGH'` (ln97-99) | **YES** |
| `applyBritaxCompatibility.ts` | `catalog:britax-compat(-apply)` | `compatibility.create`, `carSeat.create` (ln50) | Chart from `lib/catalog/britaxAdapters.ts` via `britaxRuleForModel()` | **YES** |
| `applyRomerCompatibility.ts` | `catalog:romer-compat(-apply)` | `compatibility.create`, `carSeat.create` (ln49) | Chart from `lib/catalog/romerAdapters.ts` | **YES** |
| `wireCybexPriamMiosCompat.ts` | — | `compatibility.create` | Copies `SOURCE_MODEL='gazelle s'` rows onto `TARGET_MODELS={priam,mios,e-priam}` (ln23-24) | **YES** |
| `addPipaUrbn.ts` | `catalog:add-pipa-urbn(-apply)` | `compatibility.create`, `carSeat.create/update` | Clones **every** row from the PIPA seat with the highest `_count.compatibilities` (ln35-53) | **YES** |
| `addNunaStrollers.ts` | `catalog:add-nuna-strollers(-apply)` | `compatibility.create` | DIRECT-fits 4 Nuna strollers to every Nuna PIPA seat | **YES** |
| `addBugabooTurtleDirect.ts` | `catalog:add-bugaboo-turtle(-apply)` | `compatibility.create`, `carSeat.upsert` | DIRECT to **every** Bugaboo stroller unconditionally | **YES** |
| `addBrookDirectFitSeats.ts` | `catalog:brook-direct-seats(-apply)` | `compatibility.create/update`, `carSeat.create` | Best-match seat resolver (ln70-81) | **YES** |
| `addDonkeyRidgeMinuDuo.ts` | `catalog:add-donkey-ridge-minu-duo(-apply)` | `compatibility.create` | Minu Duo × (Nuna + Chicco) as ADAPTER/MEDIUM | **YES** |
| `addGt3AdapterUnhideMixx.ts` | `catalog:gt3-mixx(-apply)` | `compatibility.create` | MIXX next × every Nuna INFANT seat, DIRECT | **YES** |
| `scanStrollersNoCompat.ts` | `catalog:scan-orphan-strollers(-apply)` | `compatibility.create` (ln100) | Copies a matched sibling stroller's rows onto orphans; `SAME_BRAND_DEFAULT` Set ln23 **duplicates rather than imports** the runtime `DIRECT_DEFAULT_BRANDS` | **YES.** Header comment ln9 claims "Report only — no writes" — **factually stale**, it writes under `--apply` |
| `fixNunaOwnBrandDirectFit.ts` | `catalog:fix-nuna-direct(-apply)` | `compatibility.update` | None — flips mistyped Nuna×Nuna ADAPTER rows to DIRECT | Low — repair only |
| `pruneBabyJoggerCompatibility.ts` | `catalog:baby-jogger-prune(-apply)` | `compatibility.deleteMany` | Removal filter over the Baby Jogger chart | Deletes |
| `pruneBritaxCompatibility.ts` | `catalog:britax-prune(-apply)` | `compatibility.deleteMany` | Filter over `britaxRuleForModel` | Deletes |
| `pruneRomerCompatibility.ts` | `catalog:romer-prune(-apply)` | `compatibility.deleteMany` | `seatAllowed()` ln30-41 | Deletes |
| `pruneChiccoGracoPegCompat.ts` | — | `compatibility.deleteMany` | `SEAT_RE=/chicco|graco|peg[\s-]?perego/i` ln20 + Gazelle carve-out | Deletes |
| `syncBabylistCatalog.ts --mode=adapters` | — | `compatibility.update` (ln506) | Keyword `parseAdapterName()` ln338-347 | **Overwrites adapter fields unconditionally — no guard for hand-set values** |

## 4.2 Scripts that write `Stroller` / `CarSeat` (selection)
`importStrollersFromCatalog.ts` (`strollers:import`), `importCarSeatsFromCatalog.ts` — the latter hard-codes an infant-seat allowlist in `isEligibleInfantCarSeat()` ln103-117 (~25 model tokens: pipa, mesa, aria, liing, liingo, cloud, aton, keyfit, fit2, snugride, litemax, ez lift, secure lift, gomax, primo viaggio, turtle, mico, willow, cypress, safe wash, b safe, doona, g5, juni, mint latch, onboard, shyft dualride, peri 180). `seedManualStrollers.ts`, `removeStrollerModels.ts`, `removeNonStrollers.ts`, `normalizeBrandCasing.ts`, `fixCarSeatTypes.ts`, plus ~20 one-off `add*.ts` scripts that find-or-create `Stroller` rows.

## 4.3 Feed sync / import scripts (`AffiliateCatalogProduct`)
`importAffiliateCatalog.ts` (`catalog:import`), `syncBabylistCatalog.ts`, `importMacroBabyCatalog.ts`, `importGoodBuyGearCatalog.ts`, `importAwinAnb.ts`, `recategorizeAffiliateCatalog.ts`, `cleanAffiliateCatalog.ts`, `pruneCatalog.ts`, `hideBrands.ts`, `hideAccessoryProducts.ts`, `cleanupUnmatchedDuplicates.ts`.

`importMacroBabyCatalog.ts` carries the largest in-file dataset: `KNOWN_BRANDS` (49), `COLOR_WORDS`, `VERSION_TERMS`, `INFANT_SEAT_MODEL_RE`, `INFANT_SEAT_BRANDS` (17), and `STROLLER_FAMILY_PATTERNS` (**41 named stroller families**, ln194-241).

**Four independent `isCarSeatAdapter()` implementations exist** — `lib/catalog/adapterModelMatching.ts` (exported), `scripts/promoteCarSeatAdapters.ts` ln24-27, `scripts/importAwinAnb.ts` ln62-67, and the MacroBaby importer's own. They are not the same code; behavioral drift between them is possible.

## 4.4 Scheduled / automated jobs — **none in the repository**

`VERIFIED` negatives: no `vercel.json`; no `.github/`; zero `CRON_SECRET` matches; no `app/api/**/cron*` route; no `node-cron`/`node-schedule`/recurring `setInterval`. `Procfile` is two lines and contains no scheduler.

Two **stale doc-comments** reference automation that does not exist in this checkout:
- `scripts/importAffiliateCatalog.ts:7` — `* Ongoing (Heroku Scheduler) from a hosted feed URL:`
- `scripts/syncBabylistCatalog.ts:595,649` — `// ── Orchestrator (imported by the cron route) ──` / `// Run only when invoked directly (not when imported by the cron route).` — grep for `runSync|syncBabylistCatalog` across `app/` and `lib/` returns **zero** importers.

`UNVERIFIED: whether a Heroku Scheduler add-on is configured in production.` Heroku Scheduler is configured on the dashboard, outside version control. **This is the single most important thing to check outside the repo** — if `catalog:import` or a Babylist sync runs on a schedule there, it can overwrite adapter links and re-hide/unhide products with no code change.

## 4.5 Migrations containing data

Six migrations insert into `Compatibility`/`Stroller`/`CarSeat`:

| Migration | Stroller | CarSeat | Compatibility | `ON CONFLICT` |
|---|---:|---:|---|---|
| `20260321183000_add_travel_system_compatibility` | 14 | 10 | 36 literal | No (fresh tables) |
| `20260322184500_expand_travel_system_compatibility_library` | 48 | 7 | ≥151 (12 CTE/CROSS JOIN blocks; 5 are brand-wide, so DB-state dependent) | Yes, `DO UPDATE` |
| `20260322201500_expand_travel_system_by_car_seat` | — | 9 | 186 static | Yes |
| `20260612120000_strolleria_compatibility_update` | 16 | 1 | 114 static | Yes |
| `20260613120000_babylist_compatibility_update` | 4 | 4 | 50 static **+ 2 self-referential mirror blocks** cloning every PIPA RX row onto PIPA Aire rx, and every Mico Luxe row onto Mico Pro | Yes |
| `20260615120000_goodbuygear_compatibility_update` | 19 | 4 | 264 static — **the file's own header claims "~130 new compatibility pairs", roughly half the actual count**; blocks 4-10 use a *partial* `ON CONFLICT` SET that omits `compatibilityType`/`adapterRequired` | Yes (non-uniform) |

Three more migrations mutate without inserting:
1. `20260322214500_normalize_shared_infant_seat_adapter_labels` — bulk `UPDATE "Compatibility" SET "adapterType" = stroller."brand" || ' adapter for Maxi-Cosi / Nuna / CYBEX / Clek infant seats'` for all euro-group seats. **A migration has already overwritten every curated euro-group adapter name once.**
2. `20260322221000_rename_pipa_lite_rx_to_pipa_aire` — renames `PIPA Lite RX` → `PIPA Aire`. **Naming hazard:** migration `20260613120000` later adds a *separate* seat named `PIPA Aire rx`. Two similar, non-identical rows now exist.
3. `20260322223000_remove_selected_travel_system_car_seats` — the deliberate-deletion migration: removes `Silver Cross Dream i-Size`, `Silver Cross Glide Plus 360`, `Stokke PIPA` and their pairings. Cross-checked against all 95 scripts: **none names these three pairs** — reintroduction risk for them specifically is negative.

---

# 5. ADAPTER ARCHITECTURE

## 5.1 Is an adapter its own model? — **No**

`prisma/schema.prisma` defines no `Adapter` model. Adapter data lives in four places:

1. **`Compatibility` fields** — `adapterRequired`, `adapterType`, `adapterBabylistUrl`, `adapterPrice`, `adapterImage`, `adapterBabylistSku`, `adapterUpdatedAt`. Per *pairing*, not per product. **There is no manual-override sibling column** (unlike `Stroller.babylistUrl` / `manualBabylistUrl`), so a sync write and a hand edit occupy the same column.
2. **`AffiliateCatalogProduct` rows whose `title` matches `/adapter/i`** — no dedicated flag; selected by `getCatalogAdapters()`.
3. **Hard-coded TS constants** — `lib/catalog/universalAdapters.ts` (`UNIVERSAL_ADAPTER_RULES`), `britaxAdapters.ts`, `romerAdapters.ts`, `babyJoggerAdapters.ts`, `thuleAdapters.ts`, `pipaUrbnTravelSystems.ts`.
4. **Runtime string generation** — `getAdapterType()` (§3.G) fabricates the label when nothing better applies.

## 5.2 Association to stroller and to car seat
- **To a stroller:** `adapterTitleMatchesStrollerModel()` in `lib/catalog/adapterModelMatching.ts` (356 lines) — token/regex normalization over the product title, with brand-specific special cases (e.g. Veer Cruiser/Switchback normalization at ~ln266-289) and `KNOWN_STROLLER_BRANDS`.
- **To a car seat:** **brand-level, not model-level.** `titleBrandSeatMatches` / `SEAT_BRAND_ALIASES` (`scripts/scanAdapterCompatibility.ts` ln55-73, 15 entries — e.g. `Britax` matches `/\bbritax\b/i, /\bb-?safe\b/i, /\bwillow\b/i`) and `CAR_SEAT_BRAND_TOKENS` at runtime. **This is the root of overbroad adapter inference.**

## 5.3 Do adapter titles trigger compatibility? — **Yes, and they write rows**

`scripts/scanAdapterCompatibility.ts --apply`:
1. Pull catalog products with `title contains 'adapter'`, providers `['babylist_impact','awin_anbbaby','shopify_macrobaby','impact_goodbuygear']`.
2. `strollerMatches` = every `Stroller` the title matches (usually 0-1, can be more).
3. `seatMatches` = **every `CarSeat` row of each brand named in the title**.
4. Nested loop → `|strollerMatches| × |seatMatches|` candidate pairs, minus `RESTRICTED_SEAT_RE = /chicco|graco|peg[\s-]?perego/i` (ln328), which restricts those three brands to the Cybex Gazelle line only.
5. Creates `compatibilityType:'ADAPTER'`, `adapterRequired:true`, `adapterType:<adapter title>`, `confidence:'MEDIUM'`, `notes:'Inferred from the catalog adapter "<title>".'`
6. A companion prune deletes only rows whose `notes` begins `'Inferred from the catalog adapter'` — **hand-curated rows are immune to the prune, and existing rows are never updated.**

**One generically-titled adapter ("… for Maxi-Cosi / Nuna / CYBEX / Clek") can therefore generate rows against every Nuna PIPA variant, every Maxi-Cosi model, every Cybex Aton/Cloud and every Clek model at once, per matched stroller. There is no cap in code.**

An opt-in `--universal` flag activates `BRAND_UNIVERSAL_SEATS` (ln35-44, 8 brands each mapped to `['Maxi-Cosi','Nuna','Cybex']`).

## 5.4 Where the displayed adapter link comes from
`fillAdapterProducts()` → `getCatalogAdapters()` → `adaptersForStrollerModel()` → `pickAdapter()`.
- Providers admitted: `ADAPTER_PROVIDERS = ['babylist_impact','shopify_macrobaby','manual_tmbc']`. **`awin_anbbaby` and `impact_goodbuygear` are excluded here** even though the scanner ingests them.
- Rank: `ADAPTER_PROVIDER_RANK = { babylist_impact: 0, shopify_macrobaby: 1, manual_tmbc: 2 }`.
- `isAnbAdapterUrl()` = `/awin1?\.com|anb-?baby/i` — applied to the URL, **not** to `adapterImage`.
- **Skip guard:** the catalog lookup is skipped entirely when `row.adapterUrl && row.adapterImage` are both already set.
- **Unconditional fallback:** if no URL survives, `amazonAdapterSearchUrl()` produces an Amazon **keyword search** URL (`https://www.amazon.com/s?k=…&tag=taylormadebab-20`) — not a specific product. The UI therefore almost never shows "Adapter link unavailable".

**Edge case worth knowing:** a row whose ANB `adapterBabylistUrl` is nulled at read time but whose `adapterImage` is still populated fails the skip guard's `!url && !image` test, skips the catalog re-lookup, and lands on the Amazon search fallback **while still displaying the ANB-sourced product photo**.

## 5.5 Adapter ecosystem coverage — what exists and what does not

**Present with dedicated rule data:** Nuna (trigger brand), Cybex, Clek, Maxi-Cosi (euro group); UPPAbaby, Chicco, Graco, Peg Perego (as `extraSeatBrands` targets); Baby Jogger (`babyJoggerAdapters.ts`, deliberately *not* universal); Britax incl. Willow/Willow S/Willow SC/Cypress S/Arbor (`britaxAdapters.ts`, `DIRECT_FIT_ONLY`); Romer Juni + Sera (`romerAdapters.ts`, `DIRECT_FIT_ONLY`); Thule (`thuleAdapters.ts`); Bugaboo, Silver Cross (Clic excluded), mima, Mercedes-Benz/Hartan, Zoe, Veer, WonderFold, Larktale, Bumbleride, Mompush (Lithe excluded), Bombí straps, Orbit Baby, Joie.

**Notably ABSENT or near-absent:**
| Item | Status |
|---|---|
| "Maxi-Cosi-style / premium post adapters" | **No such construct.** Zero hits for `premium` co-occurring with Maxi-Cosi anywhere in the adapter/compatibility code |
| **Safety 1st** | Brand-recognition plumbing only (`KNOWN_STROLLER_BRANDS`, `CAR_SEAT_BRAND_TOKENS`). **Not** in `SEAT_BRAND_ALIASES`, so the scanner can never detect it in a title; in no family rule |
| **Evenflo** | Wired into the scanner (`SEAT_BRAND_ALIASES`) but in **no** family rule — can only ever receive a row via title-scanning |
| **Baby Trend** | **Effectively absent.** One appearance, in `KNOWN_STROLLER_BRANDS`. Never treated as a car-seat/adapter brand |
| **Orbit Baby "SmartHub"** | Brand present; the SmartHub name appears only as marketing prose in `lib/resources/strollerProfiles.ts` and `strollerSpecSeeds.ts` — no adapter logic |
| **Bugaboo Turtle / Turtle Air** | Present, but filed as a **Bugaboo** seat-brand alias (`scanAdapterCompatibility.ts:69`, `{ brand: 'Bugaboo', res: [/\bturtle\b/i] }`), not under Nuna or Cybex |

---

# 6. PRODUCT / AFFILIATE LINK FLOW

## 6.1 Data-population precedence
- **`babylistUrl`** — `loadPublicRetailerMap()`: `Stroller/CarSeat.babylistUrl` (sync column) beats the `babylist_impact` catalog row, which is the fallback for manually-added products.
- **`amazonUrl`** — `enrichWithPublicRetailers()`: `Stroller/CarSeat.amazonUrl` (manual) **always** wins over the static `TRAVEL_SYSTEM_AFFILIATE_LINKS` map in `lib/travelSystemAffiliateLinks.ts`, and the static map is only consulted if the item is already public via another channel.
- **image** — `fields.babylistImage ?? fields.macroBabyImage ?? fields.bombiImage ?? item.imageUrl`. Note the raw SQL selects use `COALESCE("imageUrl","babylistImage")`, so the manual `imageUrl` wins at the SQL layer.
- **adapter** — provider rank (§5.4).

## 6.2 Button-rendering precedence (UI layer)
`app/tools/travel-system/results/page.tsx` `ResultCard()`:
```
direct (Mima / Silver Cross, via getDirectAffiliateLink) → Babylist (real link, else brand-store fallback)
  → MacroBaby → Bombi ;  Amazon always additionally available when isAmazonAllowedForBrand()
```
GoodBuy Gear and ANB/Awin **never** render as buttons.

**Three different implementations of this same chain exist**, and they disagree:
| Component | Chain |
|---|---|
| `ResultCard` (results/page.tsx) | `directUrl` renders as a *separate always-first* button; Babylist/MacroBaby/Bombi as primary; Amazon third |
| `SelectedSummaryCard` (results/page.tsx) | Babylist → MacroBaby → Bombi. **No `directUrl` branch at all** — Mima/Silver Cross direct links never appear on this card |
| `renderBrowseCard` (TravelSystemGenerator.tsx) | `directUrl ? 'direct' : babylist : macrobaby : bombi : babylist-fallback` — direct folded *into* the ternary |

## 6.3 Can one product hold multiple retailer links? — **Yes**
Every result object carries `babylistUrl/Price/Image`, `macroBabyUrl/Price/Image`, `bombiUrl/Price/Image` and `amazonUrl` simultaneously. No data-layer function picks one. A Silver Cross stroller with direct + Babylist + Amazon links renders **three buy buttons at once**. Only MacroBaby/Bombi/Babylist are mutually exclusive (an if/else-if chain).
**Adapters are the exception** — `pickAdapter()` genuinely collapses to one.

## 6.4 What makes a product invisible for retailer reasons
`hasPublicTravelSystemRetailer(row)` — requires a recognised retailer link. `isTravelSystemOnlySeat()` bypasses it (only `nuna:::pipa urbn` qualifies). Additionally, `hasInvalidInfantCarSeatBabylistDestination` **nulls** an infant seat's `babylistUrl` when the destination path contains `travel-system`, `convertible`, `booster`, `adapter`, `cover`, `insert`, `mirror` or `protector`.

## 6.5 Where to put an exact deep link so it reliably surfaces

| Target | Column | Surfaces? | Sync-safe? |
|---|---|---|---|
| Stroller / car seat — Amazon | `Stroller.amazonUrl` / `CarSeat.amazonUrl` | Yes | **Safe** — no sync targets it |
| Stroller / car seat — Babylist | `Stroller.babylistUrl` / `CarSeat.babylistUrl` | Yes | **Unsafe** — `syncBabylistCatalog.ts` **nulls it** when its own matcher fails to re-confirm the product |
| Stroller / car seat — Babylist (intended manual column) | `manualBabylistUrl` | **NO — dead field** | n/a |
| Adapter | `Compatibility.adapterBabylistUrl` (+ `adapterImage`, `adapterPrice`) | Yes, immediately | **Unsafe** — `syncBabylistCatalog.ts --mode=adapters` overwrites unconditionally; no manual-override column exists |
| Adapter (durable route) | `AffiliateCatalogProduct` with `provider:'manual_tmbc'`, `tmbcCategory:'Travel Systems & Adapters'`, `reviewStatus:'REVIEWED'` | Only when the row's own adapter fields are empty | Safe — no sync writes `manual_tmbc` |

**`manualBabylistUrl` is a dead field.** Schema comment says it is "kept separate and is never touched by the sync" — but grep finds **zero** reads outside `app/admin/*`. `loadBabylistMap()` selects only `"babylistUrl"`. A value placed there has no effect on the public tool.

---

# 7. STROLLER PICKER / CATALOG FLOW

## 7.1 Source — `AffiliateCatalogProduct`, not `Stroller`
`getPublicStrollerCatalogBrands()`, `lib/server/publicStrollerCatalog.ts:177-186`:
```ts
const where = {
  isActiveInFeed: true,
  enrichment: { is: {
    tmbcCategory: 'Strollers',
    needsReview: false,
    reviewStatus: { notIn: ['HIDDEN', 'NEEDS_REVIEW'] },
  } },
};
```
`getPublicStrollerCatalogTravelSystemOptions()` (lines 427-451) is a plain flat-map of that result — **the picker and the tool see the identical set.**

## 7.2 Canonicalisation and dedupe
- Brand: `canonicalBrand()` / `canonicalStrollerBrand()` (`lib/catalog/brandAliases.ts`, `strollerFinderRules.ts`).
- Model: `parseStrollerModel()` (`lib/catalog/strollerModel.ts`), `productModelKey()` (`modelIdentity.ts`), `normalizeStrollerVariantModel()` (`strollerVariantIdentity.ts`), merge rules in `strollerModelMerges.ts`.
- Exclusions: `isExcludedStrollerFinderProduct()` (`strollerFinderRules.ts`).
- Dedupe: variant grouping with `compareGroupsForPublicKeep()`, tie-broken **first** by `loadStrollerCompatibilityCounts()`.

## 7.3 Compatibility count is a tie-breaker, never a filter
`loadStrollerCompatibilityCounts()` (lines 149-171) builds a `productModelKey → count` map from `Stroller LEFT JOIN Compatibility`. It is consumed **only** by `compareGroupsForPublicKeep` to decide which of several colliding variants survives. A group with `compatibilityCount === 0` is kept exactly like one with a nonzero count.

## 7.4 Why the picker count exceeds the compatibility-side count
They are different tables, populated by different processes: affiliate feed sync + auto-categorizer (`AffiliateCatalogProduct`) vs. manual curation (`Stroller`). Nothing constrains one to the other.

When a picker option has **no `Stroller` row for its brand at all**, `getTravelSystemCompatibility()` returns:
```ts
return catalogOption ? { stroller: catalogOption, compatibleCarSeats: [] } : null;
```
and because `findPublicStrollerCatalogOption()` matches against the picker's own output, `catalogOption` is **guaranteed** to be found. **User-visible result: the stroller card renders normally with buy links, and the compatible-seat list is silently empty.** Not an error, not a 404, not removed from the picker.

When a `Stroller` row for the brand *does* exist, the fuzzy `findStrollerByBrandAndModel()` (§13.1) returns *some* row of that brand and the tool proceeds against the **wrong model's** pairings.

---

# 8. CAR SEAT PICKER / CATALOG FLOW

## 8.1 Two different sources — proven
| | `/api/catalog/carseats` | Travel-system tool |
|---|---|---|
| Function | `getPublicCarSeatBrands()` | `getTravelSystemCarSeats()` |
| Table | `AffiliateCatalogProduct` ⋈ `ProductEnrichment` | **`CarSeat`** (raw SQL) |
| Infant test | `enrichment.productType === 'infant car seat'` | `seatType = 'INFANT'` |
| Gate | `isActiveInFeed`, `needsReview:false`, `reviewStatus ∉ {HIDDEN,NEEDS_REVIEW}` | `hasPublicTravelSystemRetailer()` |
| Naming | Feed titles, colorways included | Curated `brand`/`model` |

`getPublicCarSeatBrands` never touches `prisma.carSeat`; `getTravelSystemCarSeats` never touches `db.affiliateCatalogProduct`.

## 8.2 What qualifies as "infant"
Catalog side: `ProductEnrichment.productType`, written by `categorizeProduct()` (`lib/catalog/categorize.ts` RULES ln41-50). Two low-confidence catch-alls are worth noting:
```ts
{ re: /\b(pipa|liing|cloud ?[gqtz]\b|mico|aria|mesa|keyfit)\b/, productType: 'infant car seat', conf: 0.7 },
{ re: /\bcar ?seats?\b/,                                        productType: 'infant car seat', conf: 0.6 },
```
The second makes **"infant car seat" the default for anything merely containing "car seat"**.

Tool side: `CarSeat.seatType` only — a curated enum, unaffected by the categorizer.

## 8.3 Travel-system-only bypass
`TRAVEL_SYSTEM_ONLY_SEATS = new Set(['nuna:::pipa urbn'])` (`lib/compatibilityEngine.ts:48`). `hasPublicTravelSystemRetailer()` returns `true` early for such a seat, so it appears with full compatibility but no standalone buy link. **Exactly one seat qualifies.**

---

# 9. FRONTEND FLOW

## 9.1 Component tree
```
/tools/travel-system            app/tools/travel-system/page.tsx (152 ln, force-dynamic)
  └─ SiteShell → main → MarketingSection
       └─ TravelSystemGenerator   components/tools/TravelSystemGenerator.tsx (666 ln, 'use client')
            ├─ ModeToggle (Stroller First / Car Seat First)
            ├─ search input (substring filter only)
            ├─ brand tiles ← BRAND_LOGOS (from components/tools/StrollerCatalogFinder.tsx)
            ├─ BrowseCard × N (renderBrowseCard)
            └─ "Common pairings" blurb ← lib/travelSystemBrandInsights.ts

/tools/travel-system/results    app/tools/travel-system/results/page.tsx (906 ln, force-dynamic)
  └─ loadSelection() → SelectedSummaryCard, StrollerProfilePanel, ResultsSection
       └─ ResultCard × N → AdapterCallout, ToolAffiliateLink × ≤3
```
`ResultCard`, `SelectedSummaryCard`, `AdapterCallout`, `ResultsSection`, `EmptyState` are all defined **inline** in `results/page.tsx`.

## 9.2 Data path
Server props, not a client fetch. `page.tsx` awaits `getTravelSystemStrollers()` and `getTravelSystemCarSeats()` and passes both arrays into the client component. The only client fetch in the picker is `/api/babylist/lookup?items=…` for price/image enrichment — unrelated to compatibility.

**Results are entirely server-rendered.** `results/page.tsx` calls the two server functions directly. `/api/compatibility` is never called.

## 9.3 URL parameters — two independent parsers
- `generateMetadata()` in `page.tsx` reads `?carSeatBrand=` / `?strollerBrand=` **server-side, for meta tags only**. The default-exported page component takes **no `searchParams` argument at all**, so these params do not affect the rendered body.
- `TravelSystemGenerator` re-parses the URL **client-side** in a mount-only `useEffect` via `new URLSearchParams(window.location.search)`, handling `stroller`, `carSeat`, `strollerBrand`+`strollerModel`, `carSeatBrand`+`carSeatModel`, and bare `carSeatBrand`/`strollerBrand`.
- `results/page.tsx` consumes **only** `stroller` and `carSeat` slugs.

Slug scheme — `travelSystemSlug()` in `lib/travelSystemRouting.ts`: `"${brand} ${model}"` → NFKD, strip diacritics, lowercase, `&`→`" and "`, non-alphanumerics→`-`, trim. `{brand:'UPPAbaby', model:'Vista V2'}` → `uppababy-vista-v2`.

## 9.4 Result display
Buckets via `resultBucket()`: `direct` (`DIRECT && !adapterRequired`), `adapter` (`adapterRequired || type==='ADAPTER'`), `other`. Section titles: **"Direct Fit"**, **"Adapter Required"**, **"Limited Fit"**.

`AdapterCallout` strings:
- No adapter → **renders nothing at all** (`if (!item.adapterRequired) return null`). The only signal is the section heading.
- Adapter required → eyebrow `"Adapter sold separately"`, label `"Car seat adapter"`, `"Shop adapter"` link, or `"Adapter link unavailable"`.
- Included → eyebrow `"Adapter"` plus `"Included with your stroller"` **or** `"Included with stroller — not sold separately"`.
- **There is no "unknown" state.**

Empty states: `"Choose a stroller or infant car seat first."` / `"Choose one starting point."` / `"We could not find that stroller."` / `"No compatible results are listed yet."` **There is no "incompatible" state** — `INCOMPATIBLE` rows are dropped server-side.

## 9.5 Does the frontend infer compatibility? — **Almost no, with one important exception**

**No** for `/tools/travel-system` and its results page: every `compatibilityType` / `adapterRequired` / `confidence` / `notes` value is computed server-side and only displayed. The `.filter()` calls are display bucketing and picker text search.

**But the results page overrides adapter STATUS with its own hard-coded rules** (`results/page.tsx` ~ln418-446):
```ts
const STROLLERS_WITH_INCLUDED_ADAPTER = new Set(['cybex', 'nuna', 'bugaboo']);
const ADAPTER_SOLD_SEPARATELY = /\bbutterfly\b/i;          // Bugaboo Butterfly excluded
const UNIVERSAL_INCLUDED_SEATS = new Set(['maxi-cosi', 'nuna', 'cybex', 'clek']);
const STROLLERS_WITH_BUNDLED_ONLY_ADAPTER = new Set(['mercedes', 'mercedes baby']);
```
These are **a different rule set from the server's** `ADAPTER_INCLUDED_WITH_STROLLER_BRANDS = {'mercedes','mercedes baby'}`. A Cybex/Nuna/Bugaboo pairing can be stored as "adapter sold separately" with a specific SKU and still display **"Included with your stroller"**.

`lib/travelSystemBrandInsights.ts` (20 hard-coded brand entries with `supportedBrands`) is imported into the client component but wired only to the descriptive "Common pairings" blurb. It does not filter or gate anything, and `results/page.tsx` does not import it.

## 9.6 Orphaned second engine
`components/guides/GuideTravelSystemFinder.tsx` (220 ln) reads `lib/guides/travelSystemCompatibility.ts` — **1,729 lines with no Prisma import at all**, containing static `TRAVEL_SYSTEM_ENTITIES` and `TRAVEL_SYSTEM_PAIRS` arrays with their own `connection`/`note`/`sourceUrl` fields. A repo-wide grep finds **no importer** of the component. **This is a second, fully hard-coded compatibility dataset that is currently unreachable dead code.**

---

# 10. ADMIN FLOW

## 10.1 Routes
| Route | Source | Mutates |
|---|---|---|
| `/admin/catalog/compatibility` | `page.tsx` (560 ln) + `actions.ts` (152 ln) | `Compatibility` create/update/delete; `Stroller.babylistImage`, `CarSeat.babylistImage` |
| `/admin/catalog` | `page.tsx` + `actions.ts` | `AffiliateCatalogProduct`, `ProductEnrichment` |
| `/admin/catalog/health` | `page.tsx` (656 ln) + `actions.ts` | `ProductEnrichment`, `AffiliateCatalogProduct` |
| `/admin/catalog/recategorize` | `page.tsx` + `actions.ts` | `ProductEnrichment.productType`/`tmbcCategory` |
| `/admin/catalog/goodbuygear` | `page.tsx` + `actions.ts` | `GbgBadgeOverride` |
| `/admin/strollers` | `page.tsx` + `StrollerRowEditor.tsx` + `actions.ts` | `Stroller`, `StrollerSpec` |
| `/admin/car-seats` | `page.tsx` + `CarSeatRowEditor.tsx` + `actions.ts` | `CarSeat` |
| `PATCH /api/admin/strollers/[id]` | route.ts | `Stroller.babylistSku` |
| `PATCH /api/admin/stroller-specs/[strollerId]` | route.ts | `StrollerSpec` — **no UI caller** |

## 10.2 Compatibility CRUD
Server Actions in `app/admin/catalog/compatibility/actions.ts`, all gated by `requireAdminSession()`:
- **Create/bulk-create** — `db.compatibility.upsert({ where: { strollerId_carSeatId: {...} }, create, update })` over a multi-select of car seats: one stroller × N seats, **identical settings**.
- **Update** — `db.compatibility.update({ where: { id } })`.
- **Delete** — `db.compatibility.delete({ where: { id } })`, one row at a time.

## 10.3 Editable fields
All five: `compatibilityType` (`DIRECT|ADAPTER|LIMITED|LOCKED|INCOMPATIBLE`), `confidence` (`HIGH|MEDIUM|LOW`), `adapterRequired` (checkbox), `adapterType` (`"Adapter name (shown to shoppers)"`), `notes`. Plus `adapterPrice`, `adapterBabylistUrl`, `adapterImage`, `adapterBabylistSku`, and an `adapterCatalogProductId` picker that auto-fills them. The catalog picker has **no ANB/provider exclusion**.

## 10.4 What admin cannot do
1. **No bulk edit or bulk delete of existing pairings** — only bulk *create*.
2. **No hide/visibility flag** on `Compatibility`, `Stroller` or `CarSeat`. The only levers are delete, or mislabeling a row `INCOMPATIBLE`.
3. **Hard `take: 300` cap** in `loadCompatibilityAdminData()` with no pagination — rows past the 300th are unreachable through the UI.
4. **`brand`/`model` cannot be edited** after creation on `Stroller`/`CarSeat`. `updateStroller`/`updateCarSeat` never read those fields and the forms do not render them. Correcting a name means delete-and-recreate, which **cascades and destroys every pairing**.
5. **The inferred rows (§3.C, §3.D) are invisible to admin** — they never exist as `Compatibility` rows, so the UI cannot see, edit, suppress or override them. Changing that behavior requires a code deploy.
6. No CSV import/export, no confidence bulk-set, no edit history.
7. `/admin/catalog/health` describes itself as `"A read-only control room…"` but wires five mutating actions (`setImageFromHealth`, `markReviewedFromHealth`, `hideFromHealth`, `unhideFromHealth`, `deleteFromHealth`).

## 10.5 Auth
`app/admin/layout.tsx` calls `requireAdminViewSession()` (admits `ADMIN` **or** `REVIEWER`), but every catalog/compatibility/stroller/car-seat page and action additionally calls `requireAdminSession()`, which redirects any non-`ADMIN` role. The reviewer-aware read-only machinery in `lib/server/apiAuth.ts` (`isReviewerRole`, `assertCanMutate`, `requireAdminOrReviewer`) is used only by the token-based API routes. `enum Role { USER | ADMIN | REVIEWER }`.

---

# 11. SOURCE OF TRUTH — CURRENT STATE

**The effective source of truth is a combination, and explicit `Compatibility` rows are only part of it.**

What a user sees for a given stroller is:
```
  ( explicit Compatibility rows
      MINUS rows filtered by the closed-ecosystem rule (forward direction only)
      MINUS rows whose product lacks a public retailer
      MINUS rows typed INCOMPATIBLE )
  PLUS  same-brand defaults      (7 brands, generated at runtime, never stored)
  PLUS  shared-adapter inference (Cybex/Clek/Maxi-Cosi, generated at runtime, never stored)
  with  adapterType overwritten by getAdapterType() for any euro-group seat
  with  adapter status re-decided in the UI for Cybex/Nuna/Bugaboo
```

## 11.1 What can override or augment explicit rows at runtime
| Mechanism | File | Effect |
|---|---|---|
| `getSameBrandDefaultCarSeats/Strollers` | `travelSystemCompatibility.ts` | **Adds** unstored DIRECT pairings for 7 brands |
| `getSharedAdapterInferredSeats/Strollers` | same | **Adds** unstored ADAPTER pairings for 3-4 brands |
| `getAdapterType()` step 3 | same | **Replaces** stored `adapterType` for euro-group seats |
| closed-ecosystem filter | same | **Hides** stored rows, forward direction only |
| `hasPublicTravelSystemRetailer()` | same | **Hides** stored rows whose product lacks a retailer |
| `.filter(!== 'INCOMPATIBLE')` | same | **Hides** stored rows |
| `normalizeCompatibilityType()` fallback | `compatibilityEngine.ts` | Unknown enum → `INCOMPATIBLE` → dropped |
| `STROLLERS_WITH_INCLUDED_ADAPTER` etc. | `results/page.tsx` | **Re-labels** adapter status in the UI |
| `fillAdapterProducts()` Amazon fallback | `travelSystemCompatibility.ts` | **Substitutes** a keyword-search URL for a real adapter link |

## 11.2 What could regenerate deleted compatibility
1. **Runtime inference** — same-brand and shared-adapter pairings are *never deleted* because they are never stored. Deleting them from the DB accomplishes nothing; they reappear on the next page render.
2. **`--apply` scripts** — the 14 marked `REINTRODUCTION RISK` in §4.1, above all `applyUniversalAdapterCompatibility.ts`, `applySameBrandCompatibility.ts` and `scanAdapterCompatibility.ts`.
3. **`syncBabylistCatalog.ts --mode=adapters`** — overwrites adapter fields on existing rows unconditionally.
4. **Migrations** — `prisma migrate deploy` runs on every Heroku release. The six data migrations use `ON CONFLICT … DO UPDATE`, so re-running them **re-asserts** their pairings. `UNVERIFIED: whether already-applied migrations could re-run` — normally `_prisma_migrations` prevents this, but a reset or a new environment would replay all of them.
5. **A Heroku Scheduler job** — `UNVERIFIED`, see §4.4.

## 11.3 Where an exact dataset would need to live
**`Compatibility`, one row per exact `(Stroller.id, CarSeat.id)`, with `Stroller` and `CarSeat` rows carrying the exact manufacturer model strings.** That is the only table the public API reads for pairings.

But storing it there is **not sufficient** for it to survive or display correctly. Based purely on the current implementation, a verified dataset would also require:
- every product in the dataset to have a `Stroller`/`CarSeat` row **with a recognised retailer link**, or it is filtered out;
- the euro-group branch of `getAdapterType()` to stop pre-empting stored `adapterType`;
- `getSameBrandDefaultCarSeats/Strollers` and `getSharedAdapterInferredSeats/Strollers` to be disabled, or they will keep adding unverified pairings on top;
- the `results/page.tsx` adapter-status constants to be reconciled with the server;
- the closed-ecosystem filter to be applied in both directions or neither;
- the `--apply` scripts in §4.1 to be retired or gated, since any future run re-asserts their inference.

---

# 12. FILE MAP

**Core compatibility runtime**
```
lib/server/travelSystemCompatibility.ts   (1612)  engine: queries, inference, adapter fill
lib/compatibilityEngine.ts                 (232)  types, scores, comparators, TRAVEL_SYSTEM_ONLY_SEATS
```
**API**
```
app/api/compatibility/route.ts              (62)  public; no internal callers
app/api/catalog/strollers/route.ts                → getPublicStrollerCatalogBrands()
app/api/catalog/carseats/route.ts                 → getPublicCarSeatBrands()
app/api/babylist/lookup/route.ts                  price/image enrichment (client-called)
app/api/matchmaker/strollers/route.ts             Stroller+StrollerSpec dump; filtering disabled
```
**Database / schema**
```
prisma/schema.prisma
prisma/migrations/20260321183000_add_travel_system_compatibility/
prisma/migrations/20260322184500_expand_travel_system_compatibility_library/
prisma/migrations/20260322201500_expand_travel_system_by_car_seat/
prisma/migrations/20260322214500_normalize_shared_infant_seat_adapter_labels/
prisma/migrations/20260322221000_rename_pipa_lite_rx_to_pipa_aire/
prisma/migrations/20260322223000_remove_selected_travel_system_car_seats/
prisma/migrations/20260612120000_strolleria_compatibility_update/
prisma/migrations/20260613120000_babylist_compatibility_update/
prisma/migrations/20260615120000_goodbuygear_compatibility_update/
```
**Adapter logic**
```
lib/catalog/adapterModelMatching.ts        (356)  adapterTitleMatchesStrollerModel, isCarSeatAdapter
lib/catalog/universalAdapters.ts           (180)  UNIVERSAL_ADAPTER_RULES + extraSeatBrands
lib/catalog/babyJoggerAdapters.ts          (169)  per-stroller/per-seat chart
lib/catalog/britaxAdapters.ts              (144)  Willow/Cypress/Arbor charts, DIRECT_FIT_ONLY
lib/catalog/romerAdapters.ts                (90)  Juni/Sera, DIRECT_FIT_ONLY
lib/catalog/thuleAdapters.ts                (53)  exact SKUs
lib/catalog/pipaUrbnTravelSystems.ts        (39)  PIPA urbn bundle links
```
**Catalog logic**
```
lib/server/publicStrollerCatalog.ts        (451)
lib/server/publicCarSeatCatalog.ts         (211)
lib/catalog/strollerFinderRules.ts         (147)  isExcludedStrollerFinderProduct
lib/catalog/strollerVariantIdentity.ts     (132)
lib/catalog/strollerModelMerges.ts         (103)
lib/catalog/categorize.ts                  (209)  RULES → tmbcCategory / productType
lib/catalog/taxonomy.ts                    (120)
lib/catalog/strollerModel.ts                (72)  parseStrollerModel / parseCarSeatModel
lib/catalog/brandAliases.ts                 (34)  canonicalBrand
lib/catalog/modelIdentity.ts                (12)  productModelKey
```
**Affiliate logic**
```
lib/travelSystemAffiliateLinks.ts          (552)  getAffiliateLinks, TRAVEL_SYSTEM_AFFILIATE_LINKS
lib/catalog/publicRetailerVisibility.ts    (144)  hasPublicCoreRetailer, isGoodBuyGearUrl
lib/catalog/directAffiliateLinks.ts         (69)  Mima / Silver Cross direct
lib/affiliateShopFallbacks.ts                     babylistBrandShopUrl, isAmazonAllowedForBrand
lib/catalog/gbgBadge.ts                     (44)
```
**Admin**
```
app/admin/catalog/compatibility/{page.tsx,actions.ts}
app/admin/catalog/{page.tsx,actions.ts}
app/admin/catalog/health/{page.tsx,actions.ts}
app/admin/catalog/recategorize/{page.tsx,actions.ts}
app/admin/catalog/goodbuygear/{page.tsx,actions.ts}
app/admin/strollers/{page.tsx,StrollerRowEditor.tsx,actions.ts}
app/admin/car-seats/{page.tsx,CarSeatRowEditor.tsx,actions.ts}
app/api/admin/strollers/[id]/route.ts
app/api/admin/stroller-specs/[strollerId]/route.ts     (no UI caller)
lib/server/session.ts, lib/server/apiAuth.ts
```
**Population / update scripts** — see §4. Highest-impact:
```
scripts/applyUniversalAdapterCompatibility.ts   scripts/applySameBrandCompatibility.ts
scripts/scanAdapterCompatibility.ts             scripts/applyBabyJoggerCompatibility.ts
scripts/applyBritaxCompatibility.ts             scripts/applyRomerCompatibility.ts
scripts/wireCybexPriamMiosCompat.ts             scripts/addPipaUrbn.ts
scripts/scanStrollersNoCompat.ts                scripts/syncBabylistCatalog.ts
scripts/prune{BabyJogger,Britax,Romer,ChiccoGracoPeg}*.ts
scripts/import{AffiliateCatalog,MacroBabyCatalog,GoodBuyGearCatalog,AwinAnb,StrollersFromCatalog,CarSeatsFromCatalog}.ts
```
**Frontend**
```
app/tools/travel-system/page.tsx                    (152)
app/tools/travel-system/results/page.tsx            (906)  ← adapter-status override lives here
components/tools/TravelSystemGenerator.tsx          (666)
components/tools/{StrollerProfilePanel,ToolAffiliateLink,StrollerCatalogFinder}.tsx
lib/travelSystemRouting.ts                           (29)
lib/travelSystemBrandInsights.ts                    (298)  display-only
components/guides/GuideTravelSystemFinder.tsx       (220)  ORPHANED
lib/guides/travelSystemCompatibility.ts            (1729)  ORPHANED static dataset
```

---

# 13. TOP 10 RISKS TO AN EXACT MANUFACTURER-VERIFIED COMPATIBILITY DATABASE

### 1. `findStrollerByBrandAndModel()` does not filter on model — wrong-model data served at HTTP 200
`lib/server/travelSystemCompatibility.ts`, `findStrollerByBrandAndModel()` / `findCarSeatByBrandAndModel()`.
`WHERE LOWER("brand") = LOWER($brand)` is the **only** filter; the model is a pure `ORDER BY` ranking key with an `ELSE 4` catch-all and `LIMIT 1`. An unknown model for a known brand returns that brand's shortest-named product. **Live-verified:** `Graco` + a fabricated model returned *Graco Merge*; `Joie` + fabricated returned *Joie Kava*; `Romer` + fabricated returned *Romer Tura* with 8 seats. Unknown brands correctly 404, so the failure is invisible from the brand side. **Also means generation collisions resolve silently to the wrong row** — this is the single biggest threat to a generation-exact dataset. *(Separately noted: `Stokke` 404s like a fabricated brand, suggesting no `Stroller` row exists for it despite Stokke appearing in the picker.)*

### 2. The results page re-decides adapter status, overriding the database
`app/tools/travel-system/results/page.tsx` ~ln418-446 — `STROLLERS_WITH_INCLUDED_ADAPTER = {cybex, nuna, bugaboo}`, `UNIVERSAL_INCLUDED_SEATS = {maxi-cosi, nuna, cybex, clek}`. A pairing stored as "adapter sold separately" with an exact SKU can display **"Included with your stroller."** The server's own rule set (`ADAPTER_INCLUDED_WITH_STROLLER_BRANDS = {mercedes, mercedes baby}`) disagrees.

### 3. `getAdapterType()` discards curated adapter names for the entire euro group
`lib/server/travelSystemCompatibility.ts`, `getAdapterType()` step 3 fires **before** step 4. Any Clek/Cybex/Maxi-Cosi/Nuna seat gets `"<StrollerBrand> adapter for Maxi-Cosi / Nuna / CYBEX / Clek infant seats"` regardless of what is stored. Migration `20260322214500` already bulk-overwrote this column once.

### 4. Runtime inference fabricates pairings that cannot be deleted, edited, or seen by admin
`getSameBrandDefaultCarSeats/Strollers` (7 brands) and `getSharedAdapterInferredSeats/Strollers` (3-4 brands). No model-level check: **every** same-brand seat pairs with **every** same-brand stroller. One explicit Nuna row expands to every Cybex + Clek + Maxi-Cosi seat. These never touch the database, so cleaning `Compatibility` does not remove them and the admin UI cannot manage them.

### 5. `--apply` scripts re-assert inference over a cleaned database
§4.1 — 14 scripts marked REINTRODUCTION RISK. `applyUniversalAdapterCompatibility.ts` and `applySameBrandCompatibility.ts` (8 in-file regex brand rules, ln44-109) rebuild bulk inference as *stored* rows. `scanStrollersNoCompat.ts` writes despite a header comment claiming "Report only — no writes", and its `SAME_BRAND_DEFAULT` Set duplicates rather than imports the runtime constant, so the two can drift.

### 6. Adapter-title scanning generates a combinatorial explosion of rows
`scripts/scanAdapterCompatibility.ts` — seat matching is **brand-level** (`SEAT_BRAND_ALIASES` ln55-73), so one generically-titled adapter creates `|strollerMatches| × |every seat of every named brand|` rows, typed `ADAPTER`/`MEDIUM` with `notes: 'Inferred from the catalog adapter "…"'`. No cap in code.

### 7. The picker and the compatibility engine are different product universes
`AffiliateCatalogProduct` ⋈ `ProductEnrichment` drives the picker; `Stroller`/`Compatibility` drives results. A picker option with no `Stroller` row renders a normal product card with a **silently empty** seat list. Model strings also differ between universes — the catalog carries colorways (`"Nuna PIPA aire rx in Biscotti"`) while the curated tables do not.

### 8. Feed syncs overwrite human-entered links; the field designed to prevent that is dead
`scripts/syncBabylistCatalog.ts` **nulls** `Stroller/CarSeat.babylistUrl` on a failed re-match, and `--mode=adapters` **unconditionally overwrites** `Compatibility.adapterBabylistUrl`/`adapterImage`/`adapterPrice`/`adapterType` with no guard. `manualBabylistUrl` exists for exactly this protection but **is never read by any public code path** — `loadBabylistMap()` selects only `babylistUrl`.

### 9. Retailer availability silently hides verified pairings
`hasPublicTravelSystemRetailer()` filters products lacking a recognised retailer, and `hasInvalidInfantCarSeatBabylistDestination` nulls a seat's Babylist URL when the path contains `travel-system`, `convertible`, `booster`, `adapter`, `cover`, `insert`, `mirror` or `protector`. A correct, manufacturer-verified pairing disappears from the tool purely because its affiliate link lapsed. Only one seat (`nuna:::pipa urbn`) is exempt.

### 10. Directional mismatch: the closed-ecosystem filter is applied in one direction only
`getTravelSystemCompatibility()` filters a Nuna stroller's explicit rows down to Nuna seats; `getTravelSystemCompatibilityByCarSeat()` has **no equivalent filter**. A non-Nuna seat with a stored row against a Nuna stroller is visible seat-first and hidden stroller-first. Related: `normalizeCompatibilityType()` maps any unrecognised enum string to `INCOMPATIBLE`, which is then dropped — a bad value silently deletes a pairing; and `Compatibility`'s `onDelete: Cascade` means renaming a product (only possible via delete-and-recreate) destroys its entire pairing set.

---

## Appendix — verified live API behavior

These were observed against the production endpoint during this session and are reproducible:

| Request | Response |
|---|---|
| `?strollerBrand=ZZZNotARealBrand999&strollerModel=fake` | `404 {"error":"Stroller not found."}` |
| `?strollerBrand=Graco&strollerModel=<fabricated>` | `200`, returns **Graco Merge** data |
| `?strollerBrand=Joie&strollerModel=<fabricated>` | `200`, returns **Joie Kava** data |
| `?strollerBrand=Romer&strollerModel=<fabricated>` | `200`, returns **Romer Tura**, 8 seats |
| `?strollerBrand=Radio Flyer&strollerModel=<fabricated>` | `200`, **Radio Flyer Voya XT Baby**, 0 seats |
| `?strollerBrand=Stokke&strollerModel=<fabricated>` | `404` — no `Stroller` row for the brand |

`UNVERIFIED:` the live tool reported **168 stroller options across 40 brands** on the picker page. Not reconciled against the production database.
