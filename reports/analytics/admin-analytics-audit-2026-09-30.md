# Admin analytics audit — September 30, 2026

## Result

First-party tracking is active. Production contained blog views and tool activity from September 30, and affiliate clicks from September 29. Several reporting and delivery defects were confirmed and corrected. Historical rows were preserved; no analytics events were inserted during this audit.

## Confirmed issues and fixes

- **Duplicate outbound events:** global capture and managed link handlers could both emit a click. Tool and checklist links now declare a single tracking owner; blog links persist their outbound click once. The collector serializes its duplicate check and insert per visitor/destination. Reporting applies the same five-second rule to historical records without deleting them.
- **Lost tool attribution:** generic `link` events from tool pages hid clicks from the tool table. A shared path-to-source resolver recovers the appropriate tool, including historical records and travel-system results pages.
- **Missing brand attribution:** newer blog cards use `brand` and `product`; the old report only recognized older field names. Both formats are now supported, and unattributed clicks remain visible.
- **Incorrect checklist totals:** totals were calculated after truncating to 25 rows, and the 28-day lookup combined identical product names across brands. Totals now include every click, use brand + product identity, and report the full product count.
- **Misleading revenue:** all inspected program order-value/commission settings were null. Missing inputs appeared as $0, and the old formula treated every click as an order. The dashboard/API now explicitly return revenue as not connected / null. Charts show actual click activity. The reusable estimate helper requires an explicit conversion-rate assumption.
- **Sample affiliate dashboard:** `/dashboard/affiliate` used fixed March sample events. It now uses the same production outbound records as admin analytics. Click share is no longer labeled a conversion proxy.
- **Stale open dashboard:** added one-minute refresh while visible, manual refresh, load time, and latest blog/tool/affiliate timestamps in Arizona time. Read failures are disclosed instead of silently looking like no activity.
- **Incorrect compare abandonment:** subtracting result interactions from daily-deduplicated opens cannot establish abandonment. Removed this metric and clarified what the comparison counts measure.
- **Missing finder result events:** brand/category result displays now emit a result event once per distinct selection per visit.
- **Dropped beacons:** affiliate, tool, and guide delivery now falls back to keepalive fetch if `sendBeacon` refuses to queue a request.
- **GA pageview configuration:** the site disables automatic config pageviews. The route tracker now explicitly sends `page_view`, retaining its route deduplication. Reference: [Google's manual pageview guidance](https://developers.google.com/analytics/devguides/collection/ga4/views?hl=en).

## Production reconciliation at 12:13 PM Arizona time

| Metric | Verified count |
| --- | ---: |
| Raw outbound rows retained | 545 |
| Reported outbound clicks after five-second deduplication | 337 |
| Duplicate rows excluded from reports | 208 |
| Reported outbound clicks, last 28 days | 142 |
| Checklist clicks, all time / last 28 days | 68 / 58 |
| Distinct checklist products / rows displayed | 42 / 25 |
| Blog affiliate clicks, all time | 182 |
| Blog brands or legacy partners, including unattributed | 46 |
| Unattributed blog clicks | 2 |

The blog table uses its own PostAnalytics click events. The site-wide outbound table uses OutboundClick. Their historical coverage and deduplication differ, so their totals are not interchangeable. Older partner labels can identify retailers rather than product manufacturers. Retired retailers may legitimately remain in historical click reports.

## Main implementation paths

- `app/admin/analytics/page.tsx` — counts, status, refresh, honest scope and labels.
- `components/admin/analytics/AnalyticsRefresh.tsx` — refresh behavior.
- `lib/analytics/outboundReporting.ts`, `lib/analytics/outboundSource.ts`, `lib/server/outboundAnalytics.ts` — shared normalization, historical duplicate filtering and checklist aggregation.
- `app/api/affiliate/click/route.ts` — atomic duplicate guard.
- `components/tools/ToolAffiliateLink.tsx`, `components/affiliate/ProductRetailerActions.tsx`, `components/analytics/TrackedAffiliateLink.tsx` — single tracking ownership.
- `lib/blog/clientTracking.ts`, `lib/server/blogRevenueAnalytics.ts` — modern and legacy blog attribution.
- `lib/server/affiliateAnalyticsDashboard.ts` — real data replaces samples.
- `lib/analytics/gtag.ts` — explicit pageviews.

## Verification and remaining boundaries

Regression tests cover duplicate reporting, duplicate insert suppression, complete checklist totals, source recovery, current and legacy brand metadata, unavailable revenue, fallback delivery, GA emission, ShopMy attribution, and rendered tracking ownership. TypeScript checks pass. Production reporting services were exercised against real data, and the transaction lock was verified without inserting events.

The automated browser was not signed into admin, and the attempt to inspect the user's signed-in browser stalled. Admin visual verification was therefore not completed. Existing authentication was preserved.

Confirmed orders, returns and paid commissions are **not connected** to these reports. They require affiliate-network reporting integrations; clicks cannot establish actual earnings. GA4 property-side settings (including enhanced measurement/history pageviews), Realtime receipt, and network-side conversion attribution were not verified in their external dashboards. Do not interpret this audit as confirming those external systems.
