# Deploy checklist — tools & catalog catch-up

One clean pass to land everything built this session onto production, in
dependency order, then re-audit against real data. Run top to bottom.

> **Flag placement matters.** `-a registrywithtaylor` is a *Heroku* flag — it
> goes OUTSIDE the quotes, attached to `heroku run`. Inside the quotes it's just
> a meaningless arg and the command runs against your LOCAL database.
>
> ✅ `heroku run "npm run <script>" -a registrywithtaylor`
> ❌ `npm run <script> -a registrywithtaylor`   ← runs locally, wrong DB

Every script is **dry-run by default**. Always run the plain command first, read
the output, then re-run the `-apply` variant.

---

## 0. Ship the code first

The `heroku run` scripts execute on the *deployed slug*, so the matcher fixes,
seed data, normalize logic, and image setter must be live before any script runs
— otherwise you're running the OLD code against prod.

- [ ] `git push` your branch and deploy to Heroku (your normal pipeline)
- [ ] Confirm the deploy succeeded and the app booted

## 1. Schema (probably already current)

- [ ] `heroku run "npx prisma migrate deploy" -a registrywithtaylor`

> Last run reported *"No pending migrations"* — prod is likely already migrated.
> The `manualAmazonUrl does not exist` error you saw was from a LOCAL run; prod
> is fine. This step just confirms it.

## 2. Normalize brand casing (CYBEX → Cybex)

Run BEFORE the adapter/compat scripts so brands are canonical — otherwise you get
doubled "CYBEX"/"Cybex" rows and split matches.

- [ ] `heroku run "npm run catalog:normalize-brands" -a registrywithtaylor`
- [ ] review RENAME vs MERGE lines, then:
- [ ] `heroku run "npm run catalog:normalize-brands-apply" -a registrywithtaylor`

## 3. Stroller specs (46 brands)

Independent of the compat work; safe any time after deploy.

- [ ] `heroku run "npm run catalog:stroller-specs" -a registrywithtaylor`
- [ ] confirm the "No seed match" list only names the 4 known skips
      (Baby Jogger City Prix ×2, Britax BOB-Wayfinder, Bugaboo Kangaroo), then:
- [ ] `heroku run "npm run catalog:stroller-specs-apply" -a registrywithtaylor`

## 4. Baby Jogger compatibility (manufacturer matrix)

Compat first, then prune — prune removes rows the manufacturer doesn't publish
(City Tour 2 euro rows, City Prix, etc.).

- [ ] `heroku run "npm run catalog:baby-jogger-compat" -a registrywithtaylor`
- [ ] `heroku run "npm run catalog:baby-jogger-compat-apply" -a registrywithtaylor`
- [ ] `heroku run "npm run catalog:baby-jogger-prune" -a registrywithtaylor`
- [ ] `heroku run "npm run catalog:baby-jogger-prune-apply" -a registrywithtaylor`

## 5. Universal adapter compatibility (incl. new Inglesina Quid³ / DFY R1)

- [ ] `heroku run "npm run catalog:universal-adapter-compatibility" -a registrywithtaylor`
- [ ] `heroku run "npm run catalog:universal-adapter-compatibility-apply" -a registrywithtaylor`

## 6. Adapter scan — attach link + image (uses the fixed matcher)

This is the one that fills the missing adapter links/images. It only works now
that the version-strip + Switchback matcher fixes are deployed (step 0).

- [ ] `heroku run "npm run catalog:scan-adapters" -a registrywithtaylor`
- [ ] confirm Minu/Vista/Switchback now show a matched stroller (not "—"), then:
- [ ] `heroku run "npm run catalog:scan-adapters -- --apply" -a registrywithtaylor`

## 7. Thule Shine product image

- [ ] `heroku run "npm run catalog:product-images" -a registrywithtaylor`
- [ ] `heroku run "npm run catalog:product-images-apply" -a registrywithtaylor`

## 8. Re-audit (read-only — the source of truth)

- [ ] `heroku run "npm run catalog:audit-stroller-adapters" -a registrywithtaylor`

> Expect: categories resolve cleanly (no big "(uncategorized)" bucket), no
> doubled CYBEX lines, and the flagged count drops from the ~121 baseline. What
> remains flagged = the genuine content gaps (WonderFold, Zoe, YOYO, Ergobaby,
> Mompush, Mercedes) that need adapter PRODUCTS added to the feed — no script
> fixes those.

## 9. After deploy — SEO housekeeping

- [ ] Resubmit the sitemap in Google Search Console (new brand landing pages)
- [ ] Request indexing for the homepage to nudge the favicon re-crawl

---

### Still open after this pass (not blocked by deploy)

- Adapter products for WonderFold / Zoe / YOYO / Ergobaby / Mompush / Mercedes
  (manual catalog entry — nothing in the feed to match)
- "Switchback" display-name rename on the Veer strollers (currently Switch&Jog /
  Switch&Roll — matcher handles it, but the finder still shows the old names)
- Brand pages are query-param URLs, not real `/tools/stroller-finder/<brand>`
  routes (indexable, but path routes rank marginally better)
