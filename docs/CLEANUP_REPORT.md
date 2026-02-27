# Cleanup Report

## Summary
- Completed a Phase 0 cleanup focused on dead-code removal, auth-guard consolidation, and architecture clarity.
- Preserved public marketing route UI/copy and kept Prisma-backed blog + affiliate canon behavior intact.
- Validation passed:
  - `npm run lint` (`tsc --noEmit`)
  - `npm run build`

## Files Removed

### Legacy route surfaces removed
- `app/dashboard/admin/layout.tsx`: duplicate legacy admin namespace; redundant with `/admin/*`.
- `app/dashboard/admin/affiliates/page.tsx`: duplicate of `/admin/affiliates`.
- `app/dashboard/admin/affiliate-links/page.tsx`: duplicate of `/admin/affiliate-links`.
- `app/api/admin/blog/route.ts`: legacy duplicate blog admin API using old draft-shaped responses.
- `app/api/admin/blog/[id]/route.ts`: legacy duplicate per-post admin API.

### Legacy data/code remnants removed
- `data/blog-drafts.json`: unused local JSON draft store remnant; Prisma is canonical.

### Unreferenced components/utilities removed
- `components/AdminPortalNav.tsx`: unused legacy admin nav.
- `components/home/ServiceFeatureRow.tsx`: unused marketing component.
- `components/admin/AdminCard.tsx`: wrapper unused after UI kit consolidation.
- `components/admin/AdminPageHeader.tsx`: wrapper unused.
- `components/admin/patterns/AdminConfirmDialog.tsx`: unused pattern.
- `components/Section.tsx`: unused section wrapper.
- `components/layout/Section.tsx`: unused section wrapper variant.
- `lib/marketing/services.ts`: unused marketing data module.

### Replaced by `lib/server/**` structure
- `lib/prisma.ts`: moved to `lib/server/prisma.ts`.
- `lib/blog.ts`: moved to `lib/server/blog.ts`.
- `lib/authOptions.ts`: moved to `lib/server/authOptions.ts`.
- `lib/auth.ts`: no remaining usages after API auth unification.

## Files Refactored

### Auth and API guard standardization
- `lib/server/apiAuth.ts` (new):
  - Added shared `getRequestToken(req)`, `requireAdmin(req)`, and `unauthorizedResponse()`.
- `app/api/blog/route.ts`:
  - Replaced ad hoc token logic with shared auth helper.
- `app/api/blog/[id]/route.ts`:
  - Removed per-file `requireAdmin` duplication; unified with shared helper.
- `app/api/affiliates/route.ts` and `app/api/affiliates/[id]/route.ts`:
  - Replaced boolean token checks with shared `requireAdmin(req)` + consistent `401` JSON.

### Server utility organization
- Added:
  - `lib/server/prisma.ts`
  - `lib/server/blog.ts`
  - `lib/server/authOptions.ts`
- Updated imports across app/scripts to use `lib/server/**`.
- `lib/server/session.ts` updated to import `authOptions` from `lib/server/authOptions`.
- `lib/server/affiliateCanon.ts`, `scripts/seedAffiliateCanon.ts`, `scripts/seedProductionBlogPosts.ts` updated to new server utility paths.

### Admin naming normalization
- Replaced editor component naming:
  - `components/admin/BlogDraftEditor.tsx` -> `components/admin/PostEditor.tsx`.
- Updated usage:
  - `app/admin/blog/new/page.tsx`
  - `app/admin/blog/[id]/edit/page.tsx`
- Renamed editor props/locals from `draft*` to `post*` for consistency.
- Minor admin text cleanup:
  - `app/admin/layout.tsx` nav label `Blog Drafts` -> `Blog Posts`.
  - `app/admin/page.tsx` labels/subtitle aligned to `Post` naming.

### Duplicate guard reduction on admin pages
- `app/admin/analytics/page.tsx`: removed redundant page-level `requireAdminSession()` (layout already guards).
- `app/admin/affiliate-links/page.tsx`: removed redundant page-level `requireAdminSession()` while keeping server-action guard.

### Internal import-only updates on public routes
- Updated Prisma import paths on public pages/handlers only (`@/lib/server/prisma`), with no marketing UI/copy changes:
  - `app/page.tsx`
  - `app/blog/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `app/r/[code]/route.ts`
  - `app/api/blog/[id]/track/route.ts`

## Conventions Enforced
- `lib/server/**` now contains server-only runtime helpers:
  - Prisma client
  - blog slug utility
  - NextAuth options
  - API auth guard helpers
  - admin session guard
  - affiliate canon query helper
- Admin editor naming standardized to `PostEditor`.
- API route guard pattern standardized to:
  - `requireAdmin(req)` for protected methods
  - consistent `401` JSON response from one helper.

## Remaining Technical Debt (Prioritized)
- High: `npm run lint` is currently type-check only; no ESLint/static style rule enforcement.
- Medium: duplicated markdown parsing/excerpt helpers exist in multiple public blog/home pages and could be centralized.
- Medium: `/api/affiliates*` is not currently consumed by in-repo UI flows; validate external usage before potential deprecation.
- Low: admin `/admin/blog/new` immediately creates a persisted post record; consider draft lifecycle/cleanup policy for abandoned creations.
- Low: contact form is UI-only (no submission handler/persistence) by design in this phase.

## Risks / Notes
- Marketing UI/copy was intentionally left unchanged for frozen routes.
- Legacy duplicate routes/APIs were removed because there were no in-repo call sites.
- Kept affiliate APIs and tracking endpoints to avoid breaking potential external/admin workflows.
