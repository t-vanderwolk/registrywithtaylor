# TMBC — Session Memory (context checkpoint)

Saved before pivoting focus to the **About Us SEO** PDF. This captures work state so nothing is lost.

## Standing constraints (always honor)
- Never commit secrets; avoid `git add -A` (use explicit paths — Mailchimp incident).
- Web content only via WebFetch/WebSearch — never curl/wget/other HTTP.
- Do NOT revert the MacroBaby rework.
- TMBC voice: witty, wise, real, relatable, humorous; remove em/en dashes; nothing should read as AI.
- Never fabricate volatile facts (prices, etc.) — ask or leave blank.
- Scripts run against prod as: `DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)" PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npx tsx scripts/<name>.ts [--apply]` (dry-run default).
- Sandbox can't reach prod DB and can't run tsx (esbuild darwin-arm64); verify pure TS via `npx tsc` + node harness.

## Blog redesign + interactive features (all committed; need `git push heroku main`)
- Typography/spacing/measure pass (72ch, left-aligned column, tighter rhythm), imagery normalization, scroll reveal (`components/blog/BlogReveal.tsx`), pull-quote polish — in `styles/blog.css`, `components/blog/PostContent.tsx`.
- Inline product card = centered full-width banner (not floated); mobile fixes; compat link full-width row inside card under the CTA. In `app/globals.css` `.tool-product-card--inline`.
- Open-box badge tucked top-left corner, scaled 0.8, scoped to `.blog-product-card`.
- Handwriting margin notes: `components/blog/BlogMarginNotes.tsx` (Caveat, right margin, ≥1400px, seeded by slug).
- Circled words: `((word))` inline syntax → hand-drawn pink SVG loop, draw-on-scroll (PostContent + blog.css). Widened so it clears text.
- Polls: `:::poll` block → `components/blog/BlogPoll.tsx`, real shared tally via `app/api/blog/poll/route.ts` + `BlogPollVote` model + migration `prisma/migrations/20260708150000_add_blog_poll_vote`. **Needs `prisma migrate deploy` on Heroku.**
- Reverted the "more pink" forced title gradient / pink H2 / rose bold (kept margin notes, circles, poll pink).

### Blog data migrations (scripts written; run per instructions, dry-run first)
- `setCompactStrollerAmazonPrices.ts` — Thule $449.95 / Peg $411.59 via Amazon.
- `migrateTravelStrollersProductCards.ts` — APPLIED (best-travel-strollers-2026 cards).
- `migrateNunaDemiIconProductCards.ts` — reads CTA `::cta-slot` store; Babylist-only card. Run `--apply`.
- `migrateSilverCrossComparisonProductCards.ts` + `cleanupSilverCrossAlbeeCards.ts` — Nia/Clic/Jet; Albee removed; Jet uses kiddies-kingdom image.
- `demoBlogSignature.ts` (circle + poll demo) and `uncircleBlogPost.ts` (remove circles) for best-travel-strollers-2026.

## Catalog / travel-system compatibility (scripts; run dry-run then --apply)
- Cybex restore: `restoreCybexPriamMiosGazelle.ts` APPLIED → then `npm run strollers:import` (done).
- `normalizeCybexPriam.ts` APPLIED (renamed "Priam Comfort" → "Priam").
- Finder parser now collapses Priam4/PRIAM/Priam Comfort → one "Priam" (`lib/catalog/strollerModel.ts`) — deploy only.
- `wireCybexPriamMiosCompat.ts` — mirror Gazelle S seat coverage onto Priam/Mios/e-Priam, **excludes Britax**. Run --apply.
- `pruneChiccoGracoPegCompat.ts` — remove Chicco/Graco/Peg from all strollers except Cybex Gazelle/e-Gazelle. Run --apply.
- `scanAdapterCompatibility.ts` — now permanently excludes Chicco/Graco/Peg for non-Gazelle strollers.
- Engine: removed Britax from shared universal adapter group (`lib/server/travelSystemCompatibility.ts`) — Britax only via explicit manufacturer rows. Deploy only.

## Pending deploy
`git push heroku main` for all code; `heroku run "npx prisma migrate deploy" -a registrywithtaylor` for the poll table.

## NEW FOCUS
`TaylorMade AboutUs SEO.docx.pdf` (22 pages) → scan all pages, full site audit, implementation plan to fulfill all requirements.
Other uploaded SEO docs present: Homepage SEO (`.docx`), sitemap xml, Terms/Privacy/Refund docs (already implemented).
