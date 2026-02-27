# App Wireframe

## 1) Route Tree (App Router)

### Layouts

| Path | Type | Render Mode | Wrapped By | Primary Components | Data Source | Auth Guard | Purpose |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/*` (`app/layout.tsx`) | layout | Server layout | n/a | `Providers` + global shell/metadata | Static/env | none | Root document, global CSS, session provider |
| `/admin/*` (`app/admin/layout.tsx`) | layout | Server layout | Root layout | `AdminShell` | Static nav config | `proxy.ts` (`/admin/:path*`) + `requireAdminSession()` | Admin-only shell + navigation |

### Pages

| Path | Type | Render Mode | Wrapped By | Primary Components | Data Source | Auth Guard | Purpose |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | page | Server dynamic (Prisma query) | Root layout + `SiteShell` | `Hero`, `MarketingSection`, `EndBowDivider` | Prisma (`Post` previews) + static | none | Marketing homepage with latest insight previews |
| `/about` | page | Static/server | Root layout + `SiteShell` | `Hero`, `MarketingSection` | Static | none | About/brand page |
| `/services` | page | Static/server | Root layout + `SiteShell` | `Hero`, `MarketingSection`, `EndBowDivider` | Static | none | Services and package details |
| `/how-it-works` | page | Static/server | Root layout + `SiteShell` | `Hero`, `MarketingSection`, `EndBowDivider` | Static + external embed | none | Process overview and consultation flow |
| `/faq` | page | Static/server | Root layout + `SiteShell` | `MarketingSection`, `RibbonDivider` | Static | none | FAQ content |
| `/contact` | page | Static/server (uses search params) | Root layout + `SiteShell` | `MarketingSection`, `RibbonDivider` | Static | none | Contact and service-intake form UI |
| `/blog` | page | `force-dynamic` | Root layout + `SiteShell` | `MarketingSection`, `RibbonDivider` | Prisma (`Post`) | none | Public blog index |
| `/blog/[slug]` | page | `force-dynamic` | Root layout + `SiteShell` | `PostContent`, `MarketingSection` | Prisma (`Post`, `BlogPostAffiliate`) | none | Public blog detail page |
| `/login` | page | Server page with client form | Root layout + `SiteShell` | `LoginForm` | NextAuth credentials | none | Admin sign-in |
| `/admin` | page | `force-dynamic` | Root layout -> Admin layout | `AdminHeader`, KPI cards | Prisma (`Post` counts) | `requireAdminSession()` (layout) | Admin dashboard overview |
| `/admin/blog` | page | `force-dynamic` | Root layout -> Admin layout | `AdminTabs`, `AdminTable`, `AdminHeader` | Prisma (`Post`) | `requireAdminSession()` (layout) | Blog post list + status filters |
| `/admin/blog/new` | page | `force-dynamic` | Root layout -> Admin layout | `PostEditor`, `AdminHeader` | Prisma (`Post`, `AffiliatePartner`) | `requireAdminSession()` (layout + local for author ID) | Create and edit new post |
| `/admin/blog/[id]/edit` | page | `force-dynamic` | Root layout -> Admin layout | `PostEditor`, `AdminHeader` | Prisma (`Post`, `BlogPostAffiliate`, `AffiliatePartner`) | `requireAdminSession()` (layout) | Edit existing post |
| `/admin/analytics` | page | Server dynamic (Prisma query) | Root layout -> Admin layout | KPI cards, `AdminTable`, `AdminHeader` | Prisma (`Post`) | `requireAdminSession()` (layout) | Blog analytics snapshot |
| `/admin/affiliates` | page | `force-dynamic` | Root layout -> Admin layout | `AffiliateCanonPanel` | Prisma (`AffiliatePartner`) | `requireAdminSession()` (layout) | Read-only affiliate canon surface |
| `/admin/affiliate-links` | page | `force-dynamic` | Root layout -> Admin layout | `AdminTable`, `AdminTabs`, `AffiliateLinkCopyButton` | Prisma (`AffiliateLink`, `AffiliateClick`, `AffiliatePartner`, `Post`) | `requireAdminSession()` (layout + server action) | Create short links + review click stats |

### Route Handlers

| Path | Type | Render Mode | Wrapped By | Primary Components / Logic | Data Source | Auth Guard | Purpose |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/api/auth/[...nextauth]` | route handler (`GET`,`POST`) | Node runtime | n/a | NextAuth handler (`authOptions`) | Prisma (`User`) | NextAuth internals | Auth/session endpoints |
| `/api/blog` | route handler (`GET`,`POST`) | Node runtime | n/a | Blog list/create logic | Prisma (`Post`, `BlogPostAffiliate`) | `POST`: `requireAdmin(req)` / `GET`: token-aware visibility | Admin/editor API for posts |
| `/api/blog/[id]` | route handler (`GET`,`PUT`,`DELETE`) | Node runtime | n/a | Post fetch/update/delete | Prisma (`Post`, `BlogPostAffiliate`) | `PUT`/`DELETE`: `requireAdmin(req)`; `GET`: token-aware draft visibility | Per-post editor/read API |
| `/api/blog/[id]/track` | route handler (`POST`) | Node runtime | n/a | View/click event recording | Prisma (`Post`, `PostAnalytics`) | none | Track blog engagement |
| `/api/affiliates` | route handler (`GET`,`POST`) | Node runtime | n/a | Affiliate partner list/create | Prisma (`AffiliatePartner`) | `requireAdmin(req)` | Admin affiliate partner API |
| `/api/affiliates/[id]` | route handler (`GET`,`PUT`,`DELETE`) | Node runtime | n/a | Affiliate partner CRUD by ID | Prisma (`AffiliatePartner`) | `requireAdmin(req)` | Admin affiliate partner API |
| `/r/[code]` | route handler (`GET`) | Node runtime | n/a | Resolve short code, log click, redirect | Prisma (`AffiliateLink`, `AffiliateClick`) | none | Public affiliate redirect endpoint |

## 2) Layout Hierarchy

- Root layout: `app/layout.tsx`
  - Applies global styles and metadata.
  - Wraps tree in `SessionProvider` via `app/providers.tsx`.
- Marketing/public shell:
  - No separate marketing layout file.
  - Public pages compose `SiteShell` directly.
  - `SiteShell` provides shared `Header` + `Footer`.
- Admin shell:
  - `app/admin/layout.tsx` wraps `/admin/*` with `AdminShell`.
  - `proxy.ts` gates `/admin/*` at middleware level.
  - `requireAdminSession()` enforces role checks at server layout level.

## 3) Data Flow Map (Text Diagram)

### Blog publishing pipeline
1. Admin opens `/admin/blog/new` or `/admin/blog/[id]/edit`.
2. `PostEditor` autosaves via `/api/blog/[id]` (`PUT`) and toggles publish state.
3. API persists post and post-affiliate joins in Prisma (`Post`, `BlogPostAffiliate`).
4. Public pages read published content from Prisma:
   - `/blog`
   - `/blog/[slug]`
5. Reader tracking calls `/api/blog/[id]/track` to write `PostAnalytics` (and increment views).

### Affiliate canon pipeline
1. Canon data defined in `scripts/seedAffiliateCanon.ts`.
2. Script upserts Prisma `AffiliatePartner`.
3. Admin canon panel (`/admin/affiliates`) reads grouped partners using `lib/server/affiliateCanon.ts`.

### Affiliate redirect pipeline
1. Admin creates short link in `/admin/affiliate-links` (server action).
2. Action writes Prisma `AffiliateLink` with unique `shortCode`.
3. Public request to `/r/[code]` resolves destination.
4. Handler logs `AffiliateClick` metadata and returns 302 redirect.

## 4) Prisma Model Map (Phase 0)

| Model | Role in Phase 0 | Access Pattern |
| --- | --- | --- |
| `Post` | Core blog content (draft/published), views counter | Admin pages, `/api/blog*`, public `/blog*`, homepage preview |
| `AffiliatePartner` | Canonical affiliate partner registry | Seed scripts, admin canon view, affiliate APIs, link generator |
| `AffiliateLink` | Short-link records tied to partner/context/post | Admin affiliate-link UI, `/r/[code]` |
| `AffiliateClick` | Click telemetry for short links | `/r/[code]` writes, admin affiliate-link table reads counts/latest |
| `BlogPostAffiliate` | Join table between posts and partners | `/api/blog*` updates, `/blog/[slug]` reads |
| `PostAnalytics` | Blog event tracking (VIEW/CLICK/AFFILIATE_CLICK) | `/api/blog/[id]/track` writes |
| `User` | Credentials auth identity + role gating (`ADMIN`/`USER`) | NextAuth authorize/session callbacks, admin gate checks |

## 5) Frozen Marketing Declaration

Frozen marketing routes in this mode (no UI or copy changes):
- `/`
- `/about`
- `/services`
- `/how-it-works`
- `/faq`
- `/contact`

Note: this cleanup pass only refactors internals, structure, and dead code paths. Prisma-backed blog and affiliate canon behavior remain intact.
