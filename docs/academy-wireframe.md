# TMBC Academy Wireframe

Generated from the live Academy route structure on `2026-04-05`.

This wireframe documents two things:

1. The full Academy information architecture.
2. The shared page-shell patterns the current Academy experience uses.

## Route Types

- `Academy home`
  - Route: `/academy`
  - File: `app/academy/page.tsx`
- `Path hub`
  - Route pattern: `/academy/[academyPath]`
  - File: `app/academy/[academyPath]/page.tsx`
- `Standard module page`
  - Route pattern: `/academy/[academyPath]/[module]`
  - File: `app/academy/[academyPath]/[module]/page.tsx`
  - Shared shell: `components/academy/ModuleLayout.tsx`
- `Custom hub modules`
  - `Gear / Stroller Foundations`
  - `Gear / Car Seat Foundations`
  - `Gear / Daily Use Gear`
  - `Nursery / Furniture That Actually Works`
  - `Registry / Welcome Boxes & Registry Perks`
- `Custom editorial module`
  - `Gear / Feeding Setup & Flow`

## Academy Entry

```mermaid
flowchart TB
  A["/academy<br/>Academy Home<br/>Hero + Choose Your Path + How TMBC Academy Works"]
  C["/consultation<br/>Book a Consultation"]
  R["/academy/registry<br/>Registry Path"]
  N["/academy/nursery<br/>Nursery Path"]
  G["/academy/gear<br/>Gear Path"]
  P["/academy/postpartum<br/>Postpartum Path"]

  A --> R
  A --> N
  A --> G
  A --> P
  A --> C
```

## Registry Path

```mermaid
flowchart TB
  RH["/academy/registry<br/>Registry Path Hub"]
  R1["1. What to Register First"]
  R2["2. Where to Register"]
  R3["3. Shop Local & Get Support"]
  R4["4. Welcome Boxes & Registry Perks<br/>Hub Module"]
  R4A["Target Welcome Kit"]
  R4B["Babylist Hello Baby Box"]
  R4C["Amazon Welcome Box"]
  R4D["MacroBaby Registry Gift Box"]
  R5["5. Loyalty, Rewards & Completion Discounts"]
  R6["6. Smart Purchasing Timeline"]
  R7["7. Registry Mistakes to Avoid"]
  R8["8. Baby Showers & Gifting Strategy"]

  RH --> R1 --> R2 --> R3 --> R4 --> R5 --> R6 --> R7 --> R8
  R4 --> R4A
  R4 --> R4B
  R4 --> R4C
  R4 --> R4D
```

## Nursery Path

```mermaid
flowchart TB
  NH["/academy/nursery<br/>Nursery Path Hub"]
  N1["1. Vision & Lifestyle Foundations"]
  N2["2. Sleep Space Decisions"]
  N3["3. Furniture That Actually Works<br/>Hub Module"]
  N3A["Cribs"]
  N3B["Gliders"]
  N3C["Dressers & Changing"]
  N3D["Diaper Pails"]
  N3E["Baby Monitors"]
  N3F["Baby Proofing"]
  N4["4. Layout & Flow"]
  N5["5. Storage & Organization"]
  N6["6. Atmosphere & Safety"]

  NH --> N1 --> N2 --> N3 --> N4 --> N5 --> N6
  N3 --> N3A
  N3 --> N3B
  N3 --> N3C
  N3 --> N3D
  N3 --> N3E
  N3 --> N3F
```

## Gear Path

```mermaid
flowchart TB
  GH["/academy/gear<br/>Gear Path Hub"]
  G1["1. How to Think About Baby Gear"]
  G2["2. Stroller Foundations<br/>Hub Module"]
  G2A["Full Size & Modular"]
  G2B["Compact"]
  G2C["Travel"]
  G2D["Convertible"]
  G2E["Jogging"]
  G2F["Double"]
  G3["3. Car Seat Foundations<br/>Hub Module"]
  G3A["Infant Car Seats"]
  G3B["Convertible Car Seats"]
  G3C["All-in-One Car Seats"]
  G3D["Booster Seats"]
  G3E["Rotating Car Seats"]
  G3F["Travel & Lightweight Car Seats"]
  G4["4. Travel Systems"]
  G5["5. Travel With Baby"]
  G6["6. Daily Use Gear<br/>Hub Module"]
  G6A["Carrier"]
  G6B["Highchair"]
  G6C["Baby Bath"]
  G6D["Pack & Play"]
  G6E["Swing / Bouncer"]
  G6F["Daily Support Gear"]
  G7["7. Feeding Setup & Flow<br/>Custom Editorial Module"]
  G8["8. Breast Pump"]
  G9["9. Bottles & Baby Utensils"]

  GH --> G1 --> G2 --> G3 --> G4 --> G5 --> G6 --> G7 --> G8 --> G9
  G2 --> G2A
  G2 --> G2B
  G2 --> G2C
  G2 --> G2D
  G2 --> G2E
  G2 --> G2F
  G3 --> G3A
  G3 --> G3B
  G3 --> G3C
  G3 --> G3D
  G3 --> G3E
  G3 --> G3F
  G6 --> G6A
  G6 --> G6B
  G6 --> G6C
  G6 --> G6D
  G6 --> G6E
  G6 --> G6F
```

## Postpartum Path

```mermaid
flowchart TB
  PH["/academy/postpartum<br/>Postpartum Path Hub"]
  P1["1. Healing & Recovery"]
  P2["2. First-Weeks Home Rhythm"]
  P3["3. Feeding & Lactation"]
  P4["4. Rest & Sleep"]
  P5["5. Emotional Wellness & Identity"]
  P6["6. Support Systems"]

  PH --> P1 --> P2 --> P3 --> P4 --> P5 --> P6
```

## Academy Home Wireframe

```text
+----------------------------------------------------------------------------------+
| ACADEMY HOME                                                                     |
|----------------------------------------------------------------------------------|
| HERO                                                                             |
| - Eyebrow: TMBC Baby Academy                                                     |
| - Title + subtitle                                                               |
| - Primary CTA: Start with Registry                                               |
| - Secondary CTA: Book a Consultation                                             |
| - Tagline: Registry / Nursery / Gear / Postpartum                               |
| - Editorial hero image                                                           |
+----------------------------------------------------------------------------------+
| CHOOSE YOUR PATH                                                                 |
| - 4 path cards                                                                   |
| - Registry                                                                       |
| - Nursery                                                                        |
| - Gear                                                                           |
| - Postpartum                                                                     |
+----------------------------------------------------------------------------------+
| HOW TMBC ACADEMY WORKS                                                           |
| - Explanation title + body                                                       |
| - Taylor handwritten note                                                        |
+----------------------------------------------------------------------------------+
```

## Path Hub Wireframe

```text
+----------------------------------------------------------------------------------+
| PATH HUB                                                                         |
|----------------------------------------------------------------------------------|
| BREADCRUMBS                                                                      |
+----------------------------------------------------------------------------------+
| HERO                                                                             |
| - Path label                                                                     |
| - Hero title                                                                     |
| - Hero description                                                               |
| - Path overview line                                                             |
| - Editorial support tags / handwritten note                                      |
| - Intro paragraphs                                                               |
| - Path image                                                                      |
+----------------------------------------------------------------------------------+
| OVERALL SUMMARY CARD                  | WHAT YOU'LL LEARN CARD                   |
+----------------------------------------------------------------------------------+
| JOURNEY NAVIGATOR                                                                 |
| - Registry / Nursery / Gear / Postpartum path switcher                           |
+----------------------------------------------------------------------------------+
| MODULE GRID                                                                       |
| - Ordered cards for every module in the path                                     |
+----------------------------------------------------------------------------------+
| TAYLOR HANDWRITTEN NOTE                                                           |
+----------------------------------------------------------------------------------+
```

## Standard Module Wireframe

```text
+----------------------------------------------------------------------------------+
| STANDARD MODULE PAGE                                                             |
|----------------------------------------------------------------------------------|
| BREADCRUMBS                                                                      |
+----------------------------------------------------------------------------------+
| HERO                                                                             |
| - Module title                                                                   |
| - Subhead                                                                        |
| - Intro paragraphs                                                               |
| - Hero image                                                                     |
| - Progress bar                                                                   |
+----------------------------------------------------------------------------------+
| HANDWRITTEN NOTE / ORIENTATION                                                   |
+----------------------------------------------------------------------------------+
| CORE SECTIONS                                                                    |
| - Repeating editorial section blocks                                             |
| - Section heading                                                                |
| - Body copy                                                                      |
| - Contextual image                                                               |
+----------------------------------------------------------------------------------+
| DECISION FRAMEWORK                                                               |
| - Checklist card set                                                             |
| - Save decision bar                                                              |
+----------------------------------------------------------------------------------+
| PRODUCT EXAMPLES                                                                 |
| - Optional product cards                                                         |
+----------------------------------------------------------------------------------+
| SUBMODULE SECTION                                                                |
| - Only appears when this module branches into a deeper hub                       |
+----------------------------------------------------------------------------------+
| CONNECTED CONTENT / RELATED LINKS                                                |
| - Related module                                                                 |
| - Cross-path resource                                                            |
| - Guides / journal links                                                         |
+----------------------------------------------------------------------------------+
| PREVIOUS / NEXT MODULE NAVIGATION                                                |
+----------------------------------------------------------------------------------+
```

## Hub Module Wireframe

This is the pattern used when a top-level module also acts as a branch hub.

```text
+----------------------------------------------------------------------------------+
| HUB MODULE PAGE                                                                  |
|----------------------------------------------------------------------------------|
| STANDARD MODULE HERO + ORIENTATION                                               |
+----------------------------------------------------------------------------------+
| HUB OVERVIEW                                                                     |
| - What this category solves                                                      |
| - How to think about the branch before product comparison                        |
+----------------------------------------------------------------------------------+
| SUBMODULE CARD GRID                                                              |
| - Ordered branch cards                                                           |
| - Each card opens a lane / category / retailer / product-type deep dive          |
+----------------------------------------------------------------------------------+
| RELATED NEXT STEP LINKS                                                          |
| - Previous module                                                                |
| - Next module                                                                    |
+----------------------------------------------------------------------------------+
```

## Branch Submodule Wireframe

This is the pattern used for stroller lanes, car seat categories, daily-use gear deep dives, nursery furniture categories, and welcome-box retailer breakdowns.

```text
+----------------------------------------------------------------------------------+
| BRANCH SUBMODULE PAGE                                                            |
|----------------------------------------------------------------------------------|
| BREADCRUMBS                                                                      |
| - Academy > Path > Parent Module > Submodule                                     |
+----------------------------------------------------------------------------------+
| HERO                                                                             |
| - Submodule title                                                                |
| - Category-specific deck                                                         |
| - Progress within branch set                                                     |
+----------------------------------------------------------------------------------+
| REPEATING EDITORIAL SECTIONS                                                     |
| - What this category is solving                                                  |
| - When it tends to fit                                                           |
| - Where it gets mis-assigned                                                     |
| - What to pressure-test                                                          |
| - What to compare next                                                           |
+----------------------------------------------------------------------------------+
| EXAMPLE PRODUCTS                                                                 |
| - Up to a few representative examples                                            |
+----------------------------------------------------------------------------------+
| COMPARE / NEXT IN BRANCH                                                         |
| - Previous branch item                                                           |
| - Next branch item                                                               |
| - Return to parent hub                                                           |
+----------------------------------------------------------------------------------+
```

## Current Architecture Notes

- The Academy is not one single route pattern.
- The main shell is data-driven for path hubs and standard modules.
- A handful of high-value learning areas branch into custom hubs because they need a second layer of navigation.
- Gear is currently the deepest path because it includes three separate branch systems plus the new feeding bridge sequence.
- The cleanest future expansion points are:
  - more branch hubs under Gear
  - more submodule-driven experiences where product categories need a category-first explanation
  - richer cross-links between Registry, Gear, and Postpartum once the paths are mature
