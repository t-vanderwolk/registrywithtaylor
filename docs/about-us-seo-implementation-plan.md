# About Us Page — SEO Audit & Implementation Plan

Source brief: `TaylorMade AboutUs SEO.docx.pdf` (22 pages, July 2026).
Target route: `/about` → `app/about/page.tsx`. Primary keyword: **baby registry consultant**.

This plan maps every requirement in the brief to the current codebase, marks each as
PASS / PARTIAL / MISSING, and lays out a phased build. Voice constraint: the brief copy is
full of em-dashes — **all copy must be rewritten in TMBC style (no em/en dashes, witty/warm/real, nothing AI-sounding)** before it ships.

---

## PART 1 — AUDIT (current site vs brief)

### A. Technical SEO / indexation
| Requirement | Current state | Status |
|---|---|---|
| Next.js SSR, SEO-friendly render | `app/about/page.tsx` is a server component | ✅ PASS |
| Title tag with keyword + name | `About — Taylor-Made Baby Co.` (no keyword/name) | ❌ MISSING |
| Meta description keyword + CTA | Generic, no keyword/CTA | ❌ MISSING |
| `/about` in `sitemap.xml` | Present in `app/sitemap.ts` (priority 0.8) | ✅ PASS (verify in GSC) |
| Person / AboutPage / Breadcrumb schema on /about | Zero JSON-LD on `/about` (site-wide Org+WebSite only, in `app/layout.tsx`) | ❌ MISSING |
| Hero image `sizes` + `priority` | `Hero` uses `/assets/hero/hero-05.jpg`; needs `sizes`/`priority` audit | ⚠️ PARTIAL |
| Explicit width/height on images | Taylor portrait ✅; hero via `Hero` component needs check | ⚠️ PARTIAL |
| Hero image alt keyword | `"Soft baby essentials arranged for planning"` — no keyword | ⚠️ WARN |
| Taylor portrait alt (E-E-A-T) | `"Taylor Vanderwolk, Baby Gear Expert and Registry Consultant"` | ✅ PASS |

### B. On-page (title / meta / headings)
| Element | Current | Target (brief) | Status |
|---|---|---|---|
| Title | About — Taylor-Made Baby Co. | About Taylor Vanderwolk — Baby Registry Consultant \| Taylor-Made Baby Co. | ❌ |
| Meta desc | generic | keyword + credential + CTA (151 chars) | ❌ |
| H1 | A Baby Gear Expert for the Real-Life Details… | Meet Taylor Vanderwolk — Baby Registry Consultant & Certified Baby Gear Expert | ❌ |
| H2 #1 Bio | A Baby Gear Expert in the Details | Taylor Vanderwolk — Your Baby Registry Consultant | ❌ |
| H2 #2 Approach | The Taylor-Made Approach | The Taylor-Made Approach to Baby Registry & Gear Decisions | ❌ |
| H2 #3 Differentiator | What Makes This Different | What Makes Taylor-Made Baby Co. Different — Independent, Unsponsored Baby Gear Advice | ❌ |
| H2 #4 Podcast | (PodcastFeature default) | As Heard On BabyQuip Podcast — Baby Registry Consultant Taylor Vanderwolk | ❌ |
| H2 #5 Lead magnet | (in FinalCTA/newsletter) | Free Baby Prep Starter Guide for Expecting Parents — Registry, Gear & Nursery | ❌ |

### C. GEO / AEO (AI answer-engine signals)
All 11 signals **MISSING** on `/about`: named expert, verifiable credential, 7+ years, 200+ families,
podcast citation w/ show name, Person/AboutPage/Breadcrumb schema, entity disambiguation (not
TaylorMade Golf), one-line quotable "Who is Taylor Vanderwolk?" answer, outbound credential links
(totsquad.com, strolleria.com).
Note: `lib/marketing/homeStructuredData.ts` already contains a **Person** (alumniOf Strolleria/PBK/Target/Tot Squad + credential), **Service**, and **FAQPage** — but on the **homepage**, not `/about`. Reuse this as the pattern and reconcile `@id`s so both pages describe the same entity.

### D. Content sections (E-E-A-T page)
| Brief section | On page now? | Status |
|---|---|---|
| Hero H1 + subhead + $75 CTA | Hero exists, copy not optimized | ⚠️ PARTIAL |
| Pain-point hook | — | ❌ MISSING |
| Before/After table | — | ❌ MISSING |
| Bio (named, 7+ yrs, 200+, credentials) | Bio exists but unnamed/no stats | ⚠️ PARTIAL |
| Origin story ("Why I Started") | — | ❌ MISSING |
| Social-proof stats bar (200+/7+/5★/$75) | — | ❌ MISSING |
| Credentials block (5 items + outbound links) | — | ❌ MISSING |
| How It Works — 4 steps | — | ❌ MISSING |
| What Taylor Helps You Choose (8 descriptive) | Thin bullet list (`WHAT_I_HELP_FAMILIES_CHOOSE_ITEMS`) | ⚠️ PARTIAL |
| The Taylor-Made Approach | Exists, copy not keyworded | ⚠️ PARTIAL |
| What Makes This Different | Exists, copy not keyworded | ⚠️ PARTIAL |
| Value stack ($75 anchor table) | — | ❌ MISSING |
| Taylor vs Alternatives table | — | ❌ MISSING |
| Client reviews (Strolleria) | — | ❌ MISSING |
| Availability & urgency block | — | ❌ MISSING |
| Podcast/media section | `PodcastFeature` present | ⚠️ PARTIAL (needs keyword copy + show name) |
| Partner logos | Present (15 logos) | ✅ PASS |
| FAQ (8 Q&As) + FAQPage schema | — | ❌ MISSING |
| Lead magnet two-column capture | `NewsletterCapture` exists elsewhere | ⚠️ PARTIAL |
| Final closing CTA (two paths) | `FinalCTA` present | ⚠️ PARTIAL |

### Reusable building blocks already in the repo
`Hero`, `MarketingSection`, `FinalCTA`, `PodcastFeature`, `RevealOnScroll`, `CheckIcon`,
`MarketingHeading` (H2/H3/Body), `components/email/NewsletterCapture.tsx`,
`buildMarketingMetadata`, JSON-LD injection pattern (`app/layout.tsx`, `homeStructuredData.ts`).

---

## PART 2 — IMPLEMENTATION PLAN (phased, mirrors the brief's priority list)

### Phase 1 — CRITICAL (metadata + schema + H1) — biggest ranking impact, lowest effort
1. **Title + meta + keywords** in `app/about/page.tsx` `buildMarketingMetadata`:
   - title → `About Taylor Vanderwolk — Baby Registry Consultant | Taylor-Made Baby Co.`
   - description → the 151-char version (keyword + credential + CTA).
   - keywords → add `baby registry consultant`, `Taylor Vanderwolk`, `baby gear expert`, etc.
   - hero `imageAlt` → `Taylor Vanderwolk baby registry consultant workspace`.
2. **New file `lib/marketing/aboutStructuredData.ts`** exporting the schema graph, injected on `/about` via a `<script type="application/ld+json">` (same pattern as layout). Blocks:
   - **Person** (`@id` `…/about#taylor`) — reuse homepage Person fields; add `knowsAbout`, `hasCredential`, `alumniOf`, `sameAs`.
   - **AboutPage** — `mainEntity` → Person `@id`; `about`/`publisher` → Org `@id`.
   - **BreadcrumbList** — Home → About Taylor Vanderwolk.
   - **FAQPage** — the 8 Q&As (Phase 2 content).
   - **LocalBusiness + AggregateRating + Review** — ⚠️ only real reviews; confirm `ratingCount` (brief says 5; we have 3 named Strolleria quotes — get 2 more or set count to 3).
   - **HowTo** — 4-step booking process.
   - **Service** — updated OfferCatalog (consult + free guide). Reconcile with the existing Service in `homeStructuredData.ts` (shared `@id`).
   - **Entity disambiguation**: add a line/`disambiguatingDescription` "not affiliated with TaylorMade Golf".
   - Validate at schema.org/validator before deploy.
3. **H1** → `Meet Taylor Vanderwolk — Baby Registry Consultant & Certified Baby Gear Expert`.

### Phase 2 — HIGH (content depth + E-E-A-T + conversion) — new `/about` build
Rebuild `app/about/page.tsx` section order (content in a new `lib/marketing/aboutContent.ts`, all TMBC-voiced, no dashes):
1. Hero (optimized H1 + subhead + `[Book a Registry Consultation — $75]`).
2. Pain-point hook (below H1).
3. Before/After table (new `AboutBeforeAfter` component or a styled 2-col grid).
4. Bio rewrite — named, 7+ years, 200+ families, credentials named; open with the one-line quotable "Who is Taylor Vanderwolk?" answer for AI extraction.
5. Origin story ("Why I Started…").
6. Social-proof stats bar (200+ / 7+ / 5★ / $75) — small stat-row component.
7. Credentials block (5 cards) with **outbound links** Tot Squad→totsquad.com, Strolleria→strolleria.com (rel="noopener").
8. How It Works — 4 steps (new component, feeds the HowTo schema).
9. "What Taylor Helps You Choose" — replace thin bullets with the 8 descriptive categories.
10. Approach + Differentiator — keep, update H2s + weave keywords.
11. Value stack table ($75 anchor).
12. Taylor vs Alternatives comparison table.
13. Client reviews (real Strolleria quotes) → feeds Review schema.
14. Availability & urgency block.
15. Podcast section (keyword copy + BabyQuip show name above the existing embed).
16. Partner logos (keep).
17. FAQ accordion (8 Q&As) → feeds FAQPage schema.
18. Lead magnet two-column capture (reuse `NewsletterCapture`).
19. Final closing CTA (two paths: Book / Free guide).

### Phase 3 — MEDIUM (polish + Core Web Vitals)
- Update all 5 H2s to keyword-led versions (covered in Phase 2 but list explicitly).
- Hero image: add `sizes="(max-width:768px) 100vw, 50vw"` + `priority`; confirm width/height to protect CLS/LCP.
- Enrich podcast paragraph with keywords + listener/show name.
- Confirm all `<Image>` have width/height; keep the strong portrait alt pattern.

### Deploy
Standard: `git push heroku main` (pure front-end + metadata + JSON-LD — **no DB migration**).
Post-deploy: submit `/about` in Google Search Console, validate schema, watch Core Web Vitals report.

---

## PART 3 — FILE-BY-FILE CHANGE LIST
- `app/about/page.tsx` — metadata rewrite; full section rebuild; inject `<script ld+json>`.
- `lib/marketing/aboutStructuredData.ts` — **new**; all schema blocks (Person/AboutPage/Breadcrumb/FAQPage/LocalBusiness+Review/HowTo/Service).
- `lib/marketing/aboutContent.ts` — **new**; all copy (TMBC voice, no dashes), stats, credentials, FAQ, value-stack, comparison, reviews arrays.
- `components/marketing/about/*` — **new** small components: `PainHook`, `BeforeAfter`, `StatsBar`, `CredentialsBlock`, `HowItWorks`, `ValueStack`, `CompareTable`, `Reviews`, `Availability`, `FaqAccordion` (or fold into the page with `MarketingSection`).
- `lib/marketing/homeStructuredData.ts` — reconcile Person/Service `@id`s so /about and / describe one entity.
- Reuse: `components/email/NewsletterCapture.tsx`, `components/marketing/PodcastFeature.tsx`, `FinalCTA`.

---

## PART 4 — RISKS / DECISIONS TO CONFIRM
1. **Voice/dashes**: brief copy is dash-heavy; every line ships rewritten to TMBC no-dash style. (Non-negotiable constraint.)
2. **Reviews / AggregateRating**: Google requires genuine, on-page reviews for star-rich results. We have 3 named Strolleria quotes; brief schema claims `ratingCount: 5`. Confirm 5 real reviews or set count to 3 to stay policy-safe.
3. **Stats (200+, 7+ years, $75)**: client-provided facts — safe to state. Don't invent new numbers.
4. **Schema dedupe**: homepage already emits Person + Service + FAQPage. Use consistent `@id`s so we consolidate the entity rather than create duplicates; avoid two different FAQPage graphs competing.
5. **Podcast embed**: episode id `7e2c0icuRxEKotUPdB0aOS` (Spotify) — confirm it matches the live `PodcastFeature`.
6. **Outbound links**: add `rel="noopener"` (not nofollow) to totsquad.com/strolleria.com so they pass entity association, per the brief's GEO intent.

---

## SUGGESTED BUILD ORDER (if you want me to execute)
1. Phase 1 (metadata + schema + H1) — 1 commit, immediate SEO win, low risk.
2. Phase 2 content + components — 2–3 commits, reviewable per section.
3. Phase 3 CWV/polish — 1 commit.
Each phase typechecks + commits independently; nothing here needs a data migration.
