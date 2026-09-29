# Nordstrom infant car-seat audit — September 28, 2026

Subsequent status: the 17 candidates were seeded after user approval; code updates are tested locally and await deployment. See [implementation result](infant-car-seat-seed-result-2026-09-28.md). The findings below describe the original read-only audit.

Read-only audit. No database, catalogue, seed data, application code, or live-page changes. Only these audit reports were created.

## Results

Reviewed 47 curated infant CarSeat records, the 37-card public infant finder response, and 57 distinct Nordstrom category listings after deduplicating sponsored placements.

- **17 exact available candidates** for existing curated records.
- **2 exact sold-out matches:** Clek Liing and Britax Willow SC.
- **1 identity conflict:** Mico Pro versus Mico Pro+.
- **7 near matches:** leave untouched.
- **20 records with no exact listing verified.**
- **1 additional available public-feed match:** Kindred Collection Peri 180, without a separate curated row.

Source: [Nordstrom infant car seats](https://www.nordstrom.com/browse/kids/baby-gear/car-seats/infant-car-seats). This category includes convertible seats, travel systems, bases, and accessories. Each available candidate below was opened directly and showed the matching product heading and an enabled Add to Bag control. Sold-out judgments use live detail pages rather than cached search snippets. Availability is for the selected option at audit time; colors can differ from catalogue images. This is an identity and availability audit, not a safety assessment.

## Exact available candidates

No Nordstrom links were present on the 47 infant records. Existing Bloomingdale’s entries must be preserved. These links have not been seeded.

| Catalogue record | Destination | Match note |
| --- | --- | --- |
| Bugaboo Turtle Air Shield by Nuna | [Nordstrom](https://www.nordstrom.com/s/turtle-air-shield-by-nuna-infant-car-seat-and-base/7995949) | Seat and recline base; not Turtle Air or Turtle One. |
| Chicco KeyFit Max Zip ClearLux | [Nordstrom](https://www.nordstrom.com/s/chicco-keyfit-max-zip-clearlux-extended-use-infant-car-seat/8990337) | ClearLux, not ClearTex or non-Zip. |
| Cybex Aton G2 | [Nordstrom](https://www.nordstrom.com/s/aton-g2-infant-car-seat-with-load-leg-base/8828004) | Standard load-leg base, not Swivel. |
| Cybex Aton G2 Swivel | [Nordstrom](https://www.nordstrom.com/s/cybex-aton-g2-infant-car-seat-with-swivel-load-leg-base/8827995) | Swivel load-leg base. |
| Cybex Cloud G Pro Comfort Extend | [Nordstrom](https://www.nordstrom.com/s/cloud-g-pro-with-load-leg-base/8630173) | Cloud G Pro and base, not Cloud G Lux. |
| Cybex Cloud T | [Nordstrom](https://www.nordstrom.com/s/cloud-t-infant-car-seat-with-leg-load-base/8059966) | Cloud T Comfort Extend SensorSafe; public model uses the longer name. |
| Doona Doona | [Nordstrom](https://www.nordstrom.com/s/doona-convertible-infant-car-seat-compact-stroller-system-with-base/9136882) | Standard integrated seat/stroller with base; use one standard listing only. |
| Doona X | [Nordstrom](https://www.nordstrom.com/s/doona-x-car-seat-stroller/9192604) | Doona X, separate from standard Doona. |
| Maxi-Cosi Ambra | [Nordstrom](https://www.nordstrom.com/s/ambra-infant-car-seat/8945714) | Exact Ambra; absent from current infant finder snapshot. |
| Maxi-Cosi Peri 180 | [Nordstrom](https://www.nordstrom.com/s/peri-180o-rotating-infant-car-seat/7809401) | Standard Peri 180; keep Kindred Collection separate. |
| Nuna PIPA Aire rx | [Nordstrom](https://www.nordstrom.com/s/pipa-aire-rx-pipa-relx-base-infant-car-seat/7574714) | Aire RX plus RELX base, not Aire without RX. |
| Nuna PIPA RX | [Nordstrom](https://www.nordstrom.com/s/pipa-rx-car-seat-base/5518435) | PIPA RX seat and base. |
| Orbit Baby G5 | [Nordstrom](https://www.nordstrom.com/s/g5-infant-car-seat-base/7741848) | Database displayName explicitly says Orbit Baby G5+ despite G5 model key. Matches that display identity, not an unverified older G5. |
| Romer Juni | [Nordstrom](https://www.nordstrom.com/s/romer-juni-infant-car-seat/7947915) | Juni seat and base, not Juni/Tura stroller bundle. |
| UPPAbaby Aria | [Nordstrom](https://www.nordstrom.com/s/uppababy-aria-infant-car-seat/7777404) | Original Aria, not V2. |
| UPPAbaby Aria V2 | [Nordstrom](https://www.nordstrom.com/s/uppababy-aria-v2-infant-car-seat/8573250) | Aria V2. |
| UPPAbaby Mesa V3 | [Nordstrom](https://www.nordstrom.com/s/mesa-v3-infant-car-seat/8471127) | Mesa V3, not Mesa Max or base only. |

Also available: [Kindred Collection Peri 180](https://www.nordstrom.com/s/kindred-collection-peri-180o-rotating-infant-car-seat/7938995). It matches a distinct public-feed card but has no separate curated CarSeat row. Do not reuse the standard Peri row.

## Held and unmatched records

| Catalogue record | Status | Reason |
| --- | --- | --- |
| Baby Jogger City GO 2 | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Baby Trend EZ-Lift Pro | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Baby Trend Secure-Lift 35 | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Britax Cypress S | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Britax Willow S | NEAR_DO_NOT_SEED | Willow/Brook S+ stroller travel system is not a standalone Willow S. |
| Britax Willow SC | EXACT_SOLD_OUT | Live detail page says Sold Out. Hold pending availability recheck. [Page](https://www.nordstrom.com/s/willow-sc-infant-car-seat-with-alpine-base/8796766) |
| Chicco KeyFit 30 | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Chicco KeyFit 30 ClearTex | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Chicco KeyFit Max ClearTex | NEAR_DO_NOT_SEED | ClearLux Zip differs in trim/fabric; no exact standalone found. |
| Chicco KeyFit Max Zip ClearTex | NEAR_DO_NOT_SEED | Stroller bundles found; standalone ClearLux is a different variant. |
| Clek Liing | EXACT_SOLD_OUT | Live detail page says Sold Out. Hold pending availability recheck. [Page](https://www.nordstrom.com/s/clek-liing-infant-car-seat/8661855) |
| Clek Liingo | NEAR_DO_NOT_SEED | Liing is a different model; no exact Liingo listing verified. |
| Evenflo LiteMax NXT | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Evenflo Revolve180 LiteMax NXT Rotational | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Graco GoMax | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Graco SnugRide Lite LX | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Graco SnugRide SnugFit | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Graco SnugRide SnugFit DLX | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Graco SnugRide SnugFit LX | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Joie Mint Latch | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Joie Rue | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Maxi-Cosi Mico Luxe | NEAR_DO_NOT_SEED | Gia XP/Mico Luxe listing is a stroller bundle. |
| Maxi-Cosi Mico Pro | HOLD_IDENTITY | Database model/displayName say Mico Pro; public product title says Mico Pro+. Both are separate available Nordstrom products. Pro+ URL: https://www.nordstrom.com/s/mico-pro-infant-car-seat-base/8600172 . Resolve identity first. [Page](https://www.nordstrom.com/s/mico-pro-infant-car-seat/8600169) |
| Maxi-Cosi Mico XP | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Nuna PIPA Aire | NEAR_DO_NOT_SEED | Aire RX plus base is a different model/package. |
| Nuna PIPA urbn | NEAR_DO_NOT_SEED | Current verified matches were stroller bundles. An older Nordstrom pop-up announcement mentions standalone availability, but no current standalone URL was verified. |
| Peg Perego Primo Viaggio 4-35 | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Peg Perego Primo Viaggio Lounge | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Peg Perego Primo Viaggio Nido | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |
| Safety 1st onBoard FLX | NO_EXACT_FOUND | No exact standalone match verified in reviewed category and supplemental searches; not a claim Nordstrom never carries it. |

## Current implementation and risks

**Seeding alone will not populate the infant finder.** `lib/server/publicCarSeatCatalog.ts` builds public cards from active AffiliateCatalogProduct entries. It does not load CarSeat.retailerLinks or return extraRetailers. `app/api/catalog/carseats/route.ts` exposes that result. This differs from the stroller catalogue implementation.

**Travel-system compatible-seat cards already support extras.** `lib/server/travelSystemCompatibility.ts:181` loads CarSeat.retailerLinks using exact lowercase brand/model keys, and the compatible-seat results pass them to `app/tools/travel-system/results/page.tsx`. However, the car-seat-first selected-seat response near line 1849 omits extraRetailers, and the selected summary chooses one primary CTA. Verify all intended surfaces before claiming full coverage.

**Identity aliases need explicit handling.** Current public model keys include full color-bearing titles for Nuna PIPA RX, PIPA Aire RX, UPPAbaby Aria V2 and Mesa V3. Cloud T appears as Cloud T Comfort Extend. Exact-key merging alone would miss them. Preserve versions, Swivel, Plus, and package distinctions instead of broad fuzzy matching.

**Mico Pro must be held.** The curated model/displayName say Mico Pro, but the public card title says Mico Pro+. Nordstrom's [Pro](https://www.nordstrom.com/s/mico-pro-infant-car-seat/8600169) and [Pro+](https://www.nordstrom.com/s/mico-pro-infant-car-seat-base/8600172) are separate available products. Resolve the identity before assigning either destination.

**Database and public feed have different coverage.** Some exact curated matches are not currently public. Kindred Peri, two Evenflo DualRide cards, and Joie Mint Latch And Base AR have no equivalent separate curated entries. AXKID ONE 3 Extended Rear Facing also appears in the infant feed despite being outside detachable infant-carrier scope; flag its category for separate correction. No records were created or reclassified.

**Routing and order:** `lib/retailerLinks.ts` stores plain retailer destinations. Existing tool retailer components apply ShopMy. A later change should append Nordstrom, preserve existing entries and priorities, and verify the rendered `go.shopmy.us/apx/y5Etg8?url=...` links. The infant public catalogue needs the missing merge before it can display those links.

Standard Doona has two available category listings; use one destination per card. Keep Doona X separate. Cloud G Lux and Mesa Max do not match current curated infant rows. Bases, convertible seats, and stroller bundles were excluded. “No exact found” is bounded to the reviewed category and supplemental searches; it does not establish that a brand or model is never sold by Nordstrom.

## Proposed next step

1. Resolve Mico Pro/Pro+ and define explicit infant-model aliases.
2. Add the missing curated extra-retailer merge to the infant finder, and selected-seat propagation where needed, preserving ShopMy routing and existing priority.
3. Recheck availability and preview an append-only seed for the 17 candidates. Back up affected records and retain existing retailer entries. Leave sold-out, near, unresolved, and absent matches untouched.
4. Following a separate instruction to seed, apply the reviewed changes and verify live infant finder and travel-system results. Check version-sensitive pairs and confirm a second dry run produces zero changes.

Full record-level audit: [infant-car-seat-audit-2026-09-28.json](infant-car-seat-audit-2026-09-28.json).
