# Catalog + deploy runbook — Orbit Baby & manual strollers

Ordered steps to push every outstanding catalog change to production, then
deploy the front-end. Every script is **idempotent** (safe to re-run) and every
`*-apply` step has a matching dry-run (drop the `-apply`) that changes nothing —
always dry-run first and read the output before applying.

> All catalog scripts talk to the **production** database. They do **not** run on
> `git push`; you run them from your terminal.

---

## 0. Point your shell at the prod database (once per terminal session)

```bash
export DB="$(heroku config:get DATABASE_URL -a registrywithtaylor)"
```

Every command below is prefixed with `PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB"`
so it uses that connection. If you open a new terminal, re-run the `export`.

---

## 1. Add / update the catalog products

Run each dry-run, eyeball it, then the `-apply`.

**a. Orbit Baby G5 stroller + car-seat adapter** (correct $1,200 price, MacroBaby
image + buy link, adapter):

```bash
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-orbit-baby
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:add-orbit-baby-apply
```

**b. Rename the Orbit Baby G5 infant car seat** → "G5 Infant Car Seat" and move it
to Car Seats, so it stops colliding with the G5 stroller in the finder:

```bash
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:rename-orbit-g5-carseat
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:rename-orbit-g5-carseat-apply
```

**c. Move the GoodBuy Gear open-box badge from the G5 to the M+ travel stroller**
(hides the G5's GoodBuy Gear stroller rows, adds the M+ open-box at $570.94):

```bash
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:orbit-goodbuy
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:orbit-goodbuy-apply
```

**d. Manual strollers** (Nuna TRIV LX $950, Nuna FLEX $400, Nuna VIAA Cabn,
Stokke YOYO 3 $499 — with images + buy links):

```bash
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:seed-manual
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:seed-manual-apply
```

---

## 2. Promote catalog strollers into the checker

`strollers:import` copies catalog strollers into the `Stroller` table so they show
up in the Travel-System Checker (not just the finder). Run it **after** all of
step 1:

```bash
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run strollers:import
```

---

## 3. Wire car-seat compatibility

Run **after** the import so the new strollers exist as rows to attach to.

**a. Same-brand seats** (e.g. Nuna stroller → Nuna infant seats):

```bash
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:same-brand-compatibility
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:same-brand-compatibility-apply
```

**b. Universal-adapter brands** (wires the Orbit Baby G5's car-seat compatibility
via its universal adapter):

```bash
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:universal-adapter-compatibility
PRISMA_DATABASE_URL="$DB" DATABASE_URL="$DB" npm run catalog:universal-adapter-compatibility-apply
```

---

## 4. Deploy the front-end

The code changes from this session — footer phone + WhatsApp, the redesigned
"Virtual Consult / Starting at $75" price seal, the new `:::thisorthat` blog block,
the blog export script, and the finder change that lets a hand-added GoodBuy Gear
open-box surface as a shoppable product — ship on deploy:

```bash
git push heroku main
```

> The M+ open-box card only renders correctly **after** this deploy (it relies on
> the finder change) **and** after step 1c.

---

## 5. Verify

Open the finder and confirm:

- **Orbit Baby G5** — full-size, MacroBaby buy link, **no** open-box badge.
- **Orbit Baby M+** — travel, open-box badge + "Shop open box at GoodBuy Gear".
- **Car seats** — "Orbit Baby G5 Infant Car Seat" shows under Car Seats, not
  merged onto the G5 stroller.
- **Nuna TRIV LX / FLEX / VIAA Cabn, Stokke YOYO 3** — present with prices + links.

Quick JSON check (no browser):

```bash
curl -s https://www.taylormadebabyco.com/api/catalog/strollers \
  | python3 -c "import sys,json; d=json.load(sys.stdin); \
    ob=[b for b in d if b['brand']=='Orbit Baby'][0]; \
    [print(t['category'], p['name'], list(k for k,v in (p.get('retailers') or {}).items() if v)) \
     for t in ob['types'] for p in t['products']]"
```

---

### One-liner order (once you've dry-run everything)

```
add-orbit-baby-apply → rename-orbit-g5-carseat-apply → orbit-goodbuy-apply →
seed-manual-apply → strollers:import → same-brand-compatibility-apply →
universal-adapter-compatibility-apply → git push heroku main
```
