# TAYLOR-MADE BABY ACADEMY — FULL PRODUCT & CODEBASE AUDIT
### Date: June 2026 | Auditor: Full-stack Product Review

---

## THE SINGLE MOST IMPORTANT THING TO UNDERSTAND BEFORE READING THIS

**The Academy does not exist yet.**

What you have is an exceptionally well-designed, editorially sophisticated, free public content website. It is not a course platform. It is not a membership. It has no progress tracking. It has no workbooks. It has no mentors. It has no certification. It has no payment infrastructure. There are no learner accounts. Every single person who visits `/academy` is anonymous, unauthenticated, and leaves without a trace.

That is the honest starting point. Everything else in this document follows from it.

---

## EXECUTIVE SUMMARY

The TMBC Baby Academy is the most polished free content library in the baby preparation space. The editorial voice is exceptional. The decision-framework philosophy is differentiated. The visual design is premium. The SEO architecture is thoughtful.

And it makes almost no money from any of it.

The platform currently functions as a **knowledge base with affiliate links**. It was designed with the vocabulary of a course platform (modules, paths, progress, decisions) but without any of the infrastructure that makes a course platform a business. No logins for learners. No saved progress. No gated content. No recurring revenue. The progress bar that appears inside every module is entirely cosmetic — it reads a hardcoded position number from a TypeScript array, saves nothing to the database, and resets completely when a user refreshes or returns.

The "mentor system" is a contact form. The "workbook system" does not exist. The "member dashboard" is an affiliate analytics screen visible only to admins. The "certification program" is not mentioned in a single file.

The Prisma schema — the database that powers the entire platform — contains zero models for: enrollment, user progress, lesson completion, workbooks, mentor sessions, certificates, subscriptions, or payments.

You are giving away for free what Taking Cara Babies charges $89 for, what Mommy Labor Nurse charges $197 for, and what Tinyhood charges $12.99/month for — and you have built better content than most of them.

The gap between the quality of the content and the sophistication of the business model is the defining problem of this platform.

**Overall Academy Score: 34 / 100**

| Dimension | Score | Notes |
|---|---|---|
| Curriculum Quality | 72/100 | Exceptional voice, strong framework, coverage gaps in postpartum |
| UX / Design | 68/100 | Beautiful desktop, mobile navigation needs work |
| Completion Architecture | 4/100 | Progress bar is cosmetic. Nothing is tracked. |
| Monetization | 8/100 | Affiliate links + consultation form. Zero subscriptions. |
| Scalability | 22/100 | Hardcoded content means every update requires a developer |
| Technical Architecture | 38/100 | Two competing content systems, route chaos, no learner schema |
| Premium Positioning | 61/100 | Looks premium, priced at $0, undermines premium perception |
| Competitive Advantage | 55/100 | Voice and framework are real moats. Execution is not there yet. |

---

## PHASE 1 — SYSTEM INVENTORY

### Route Map

**Public Academy Routes (30 pages)**

```
/academy                                      ← Academy home
/academy/[academyPath]                        ← Path hub (4 paths: registry, nursery, gear, postpartum)
/academy/[academyPath]/[module]              ← Module page (dynamic, catches most modules)
/academy/case-studies                        ← Case study index
/academy/case-studies/[slug]                 ← Individual case study

HARDCODED SUBMODULE ROUTES (bypassing the dynamic system):
/academy/gear/stroller-foundations           ← StrollerFoundationsHub (static, overrides dynamic)
/academy/gear/stroller-foundations/[lane]    ← Lane-specific stroller pages
/academy/gear/car-seat-foundations           ← CarSeatFoundationsHub
/academy/gear/car-seat-foundations/[category] ← Category car seat pages
/academy/gear/daily-use-gear                 ← DailyUseGearHub
/academy/gear/daily-use-gear/baby-bath       ← Submodule
/academy/gear/daily-use-gear/carrier        ← Submodule
/academy/gear/daily-use-gear/daily-support-gear ← Submodule
/academy/gear/daily-use-gear/highchair       ← Submodule
/academy/gear/daily-use-gear/pack-and-play   ← Submodule
/academy/gear/daily-use-gear/swing-bouncer   ← Submodule
/academy/gear/feeding-setup-flow             ← Standalone feeding module
/academy/nursery/furniture-that-actually-works ← NurseryFurnitureHub
/academy/nursery/furniture-that-actually-works/baby-monitors
/academy/nursery/furniture-that-actually-works/baby-proofing
/academy/nursery/furniture-that-actually-works/cribs
/academy/nursery/furniture-that-actually-works/diaper-pails
/academy/nursery/furniture-that-actually-works/dressers-changing
/academy/nursery/furniture-that-actually-works/gliders
/academy/nursery/furniture-that-actually-works/pack-and-play
/academy/registry/welcome-boxes-perks        ← WelcomeBoxesHub
/academy/registry/welcome-boxes-perks/amazon
/academy/registry/welcome-boxes-perks/babylist
/academy/registry/welcome-boxes-perks/macrobaby
/academy/registry/welcome-boxes-perks/target
```

**Parallel Guides System (separate, overlapping)**
```
/guides                                      ← Guide index
/guides/[slug]                               ← Guide article (DB-backed)
/guides/[slug]/[subSlug]                    ← Sub-guide
/guides/essentials                           ← Essentials hub
/guides/feeding                              ← Feeding hub
/guides/postpartum                           ← Postpartum hub
/guides/registry                             ← Registry hub
/guides/registry/[slug]                      ← Registry sub-guide
```

**Non-existent routes (searched, confirmed absent):**
```
/learn                                       ← DOES NOT EXIST
/dashboard/learn                             ← DOES NOT EXIST
/dashboard/progress                          ← DOES NOT EXIST
/workbook                                    ← DOES NOT EXIST
/mentor                                      ← DOES NOT EXIST
/member                                      ← DOES NOT EXIST
/certification                               ← DOES NOT EXIST
/enroll                                      ← DOES NOT EXIST
/pricing                                     ← DOES NOT EXIST
/checkout                                    ← DOES NOT EXIST
```

### Critical Route Problems

**Problem 1: Dual routing pattern for the same content**
The gear path has modules at two different URL patterns simultaneously:
- `/academy/gear/stroller-foundations` is served by `app/academy/gear/stroller-foundations/page.tsx` (hardcoded)
- In Next.js App Router, static segments take precedence over dynamic segments
- This means `/academy/gear/stroller-foundations` renders `StrollerFoundationsHub`, NOT `ModuleLayout`
- But other gear modules like `/academy/gear/how-to-think-about-baby-gear` render through `ModuleLayout`
- A user moving sequentially through the gear path encounters two completely different visual experiences within the same "path"

**Problem 2: Three-level deep submodules break the path metaphor**
`/academy/nursery/furniture-that-actually-works/cribs` is four URL segments deep. The "path" mental model breaks down. A user has no clear sense of where they are in a larger journey.

**Problem 3: The `/guides` system competes with `/academy`**
There are 21 markdown guide files covering: strollers, car seats, nursery furniture, registry, travel with baby — the same topics covered in the Academy. The `/guides` system is database-backed (editable via admin without code deploys). The `/academy` system is hardcoded TypeScript (requires a code deploy to update a single paragraph). These systems serve the same user with overlapping content and no clear delineation of which to use.

**Problem 4: No `/learn` namespace**
The original prompt asks about `/learn` and `/dashboard/learn` routes. These were either never built or are planned features. Currently absent. This means no concept of "enrolled learning" vs "browsing content" exists.

**Problem 5: Module count mismatch**
The TypeScript slug arrays (RegistryAcademyModuleSlug, etc.) define 8+6+9+6=29 total module slugs, but the grep for "slug:" returned 11+9+12+8=40 hits — because the slug definitions and the module input arrays are declared separately in the same files. Some modules in the slug types may not have corresponding content records. This should be verified.

---

## PHASE 2 — COMPONENT AUDIT

**Total components: 301**
**Academy-specific components: 37**

### Academy Component Inventory

| Component | Purpose | Problem |
|---|---|---|
| `ModuleLayout` | Master layout for all module pages | 350+ lines, does too much — renders structured data, internal links, travel widget, progress bar, product cards, CTAs, all in one file. Split this. |
| `AcademyProgressBar` | Shows "Module X of Y" | **Cosmetic only.** Receives hardcoded `current` and `total` props. Saves nothing. Resets on refresh. Meaningless without user accounts. |
| `YouAreHereCard` | Wayfinding component showing path/module position | Good concept, but again built on hardcoded position, not actual user state. |
| `NextBestDecisionCard` | CTA at bottom of each module linking to next module | Strong UX pattern. Works well. |
| `TaylorsNoteCard` | Editorial note from Taylor | Best component on the platform. Authentic voice. Keep and expand. |
| `DecisionBlock` / `DecisionCard` | Shows decision framework content | Solid. Reused well. |
| `WhatMattersList` / `WhatDoesntMatterList` | Contrasting content lists | Good pattern. Slightly redundant with `DecisionBlock`. |
| `HowToDecideBlock` | Scenario-based decision guidance | Good editorial component. |
| `StartHere` | Intro framing for each module | Works. Slightly generic. |
| `ClarityCallout` | Auto-generated insight card | Feels templated. The `signatureSystem.ts` generates this automatically from module slugs. |
| `ProductInsightCard` | Shows product recommendations | Only shows 3 products max. No affiliate tracking at component level. |
| `AcademyJourneyNavigator` | Cross-path navigation | Appears on path hub pages. Good orientation tool. |
| `DecisionRouter` / `FeedingDecisionRouter` | Interactive decision trees | **Barely used.** Exists in components but the decision routing logic (`enableDecisionRouting` flag) is only true on a handful of modules. |
| `CarSeatFoundationsHub` | Hub for car seat submodules | Custom layout, not `ModuleLayout`. Creates visual inconsistency. |
| `StrollerFoundationsHub` | Hub for stroller lanes | Same problem. |
| `DailyUseGearHub` | Hub for daily gear submodules | Same problem. |
| `NurseryFurnitureHub` | Hub for nursery furniture submodules | Same problem. |
| `RegistryWelcomeBoxesHub` | Hub for welcome box platforms | Same problem. |
| `ScenarioBlock` | Renders case study scenarios | Used only in case study routes. Underutilized. |
| `AcademyModuleHub` | Renders the module grid on path pages | Used only once per path. Could be absorbed into path page. |
| `AcademyModuleRenderer` | Legacy? | Import chain suggests this may be a deprecated rendering approach. Investigate before removing. |

**Components that don't exist but must be built:**
- `WorkbookModule` — learner input, prompts, save/resume
- `ProgressTracker` — real DB-backed tracking
- `MentorInbox` / `MentorSession`
- `EnrollmentGate` — paywalled content wrapper
- `CertificateViewer` — completion certificate
- `LearnerDashboard` — personalized homepage post-login
- `ProgressContinueCard` — "Resume where you left off"

### Components to Consolidate
- The 5 Hub components (`StrollerFoundationsHub`, `CarSeatFoundationsHub`, `DailyUseGearHub`, `NurseryFurnitureHub`, `RegistryWelcomeBoxesHub`) should all become one `SubmoduleHubLayout` with configurable content. They are structurally identical.

### Components to Refactor
- `ModuleLayout` should be split into: `ModuleHeader`, `ModuleBody`, `ModuleProductSection`, `ModuleCTASection`, `ModuleStructuredData`
- `AcademyProgressBar` should be replaced with a real `LearnerProgressBar` connected to DB state

---

## PHASE 3 — DATABASE & DATA MODEL AUDIT

### What the Database Currently Tracks

```
User            → Admin users only. No learner role. No learner-specific fields.
Post            → Blog posts with rich metadata, affiliate tracking, analytics
Guide           → Long-form guides (DB-backed, CMS-editable)
Media           → Uploaded media assets
PrintableResource → Downloadable resources (isPublished flag exists but no delivery mechanism)
PostAnalytics   → Event tracking for blog posts
GuideAnalytics  → Event tracking for guides
Brand           → Affiliate brand records
AffiliateProgram → Program-level affiliate data
AffiliatePartner → Partner-level data (overlaps with Brand + AffiliateProgram)
AffiliateLink   → Trackable affiliate links
AffiliateClick  → Click events on affiliate links
BlogPostAffiliate → Junction: blog ↔ affiliate
BookingEvent    → Generic booking tracking events
ConsultationRequest → Consultation intake forms
ConsultationResponse → Admin response to consultations
ContactInquiry  → General contact form submissions
Stroller        → Stroller product data
CarSeat         → Car seat product data
Compatibility   → Stroller ↔ car seat compatibility
```

### What Is Completely Missing

```
Enrollment          → User signed up for a course/membership
LessonProgress      → User completed/started a lesson
PathProgress        → User's position within a path
WorkbookSession     → User's workbook instance
WorkbookResponse    → User's answers to workbook prompts
MentorSession       → Booked mentor interaction record
MentorNote          → Mentor's notes on a student
Certificate         → Issued completion certificate
Subscription        → Recurring payment record
Payment             → One-time payment record
CommunityPost       → Discussion/community content
```

### What Is Overengineered

**The affiliate model has three overlapping layers:**
- `Brand` (name, website, logo)
- `AffiliateProgram` (brandId, network, campaignId, commission)
- `AffiliatePartner` (name, network, advertiserId, commissionType, commissionRate, slug, partnerType, affiliateTier, paymentRisk, retailerFallback, routingPriority, allowedContexts...)

`AffiliatePartner` has 25 fields. It has relations to both `Brand` AND `AffiliateProgram`. The `Brand` model has a `legacyPartners` relation back to `AffiliatePartner`. This is three models doing the job of one. The `affiliateBrands.ts`, `affiliatePartners.ts`, and `affiliatePrograms` files in lib compound the confusion with a fourth layer of in-memory data.

**PostAuthor junction table** is unnecessary for a personal brand single-author blog.

**BlogPostAffiliate junction** duplicates the relationship already captured in `AffiliateLink.blogPostId`. Two ways to say the same thing in the same schema.

**BookingEvent** is separate from `ConsultationRequest` with no foreign key relationship between them. They track the same user action in parallel.

### Scalability Assessment

The current schema would support roughly 1,000 admin-created content records before performance issues emerge in the Guide/Post tables without better indexing. But that's irrelevant — the bigger problem is that there is no concept of "user" in this system that isn't an admin. The platform cannot scale to 100 learners, let alone 100,000, because there is no learner data model at all.

### Recommended Schema Additions (Priority Order)

```prisma
model Learner {
  id              String   @id @default(cuid())
  email           String   @unique
  name            String?
  dueDate         DateTime?
  babyNumber      Int?
  enrolledAt      DateTime @default(now())
  subscriptionTier String  @default("free")
  progress        LessonProgress[]
  workbooks       WorkbookSession[]
  certificates    Certificate[]
}

model LessonProgress {
  id          String   @id @default(cuid())
  learnerId   String
  pathSlug    String
  moduleSlug  String
  status      String   @default("started") // started | completed
  startedAt   DateTime @default(now())
  completedAt DateTime?
  learner     Learner  @relation(fields: [learnerId], references: [id])
  @@unique([learnerId, pathSlug, moduleSlug])
}

model WorkbookSession {
  id          String   @id @default(cuid())
  learnerId   String
  pathSlug    String
  responses   WorkbookResponse[]
  startedAt   DateTime @default(now())
  completedAt DateTime?
  learner     Learner  @relation(fields: [learnerId], references: [id])
}

model WorkbookResponse {
  id          String   @id @default(cuid())
  sessionId   String
  promptId    String
  response    String
  savedAt     DateTime @default(now())
  session     WorkbookSession @relation(fields: [sessionId], references: [id])
}

model Certificate {
  id          String   @id @default(cuid())
  learnerId   String
  pathSlug    String
  issuedAt    DateTime @default(now())
  verifyCode  String   @unique @default(cuid())
  learner     Learner  @relation(fields: [learnerId], references: [id])
}

model Subscription {
  id          String   @id @default(cuid())
  learnerId   String   @unique
  tier        String   // "academy" | "academy_plus" | "concierge"
  stripeId    String?
  status      String   // "active" | "canceled" | "past_due"
  startedAt   DateTime @default(now())
  renewsAt    DateTime?
  learner     Learner  @relation(fields: [learnerId], references: [id])
}
```

---

## PHASE 4 — LEARNING EXPERIENCE AUDIT

*Walking through the platform as a first-time expecting parent.*

**Step 1: Discovery**
User lands on `/academy`. The hero is beautiful. The editorial tone is immediately calming and differentiated. Three entry-point cards ("I don't know where to start," "I feel overwhelmed by gear," "I already started a registry") are smart UX. **This is one of the best academy landing pages in the baby prep space.**

**Step 2: Path selection**
User selects Registry path. Arrives at `/academy/registry`. Gets a `YouAreHereCard`, a path overview, module grid. Clean. Logical. The `TaylorsNoteCard` is a highlight. Good.

**Step 3: First module**
User clicks Module 1: "What to Register First." Arrives at `/academy/registry/what-to-register-first`. Rendered by `ModuleLayout`. The page is long — very long. It includes: breadcrumbs, YouAreHereCard, hero image, progress bar, Taylor's note, StartHere section, DecisionBlock, WhatMatters, WhatDoesntMatter, core sections (each a `DecisionCard`), HowToDecide, ClarityCallout, optional products, soft CTA, NextBestDecisionCard.

That is 12 distinct content sections on a single module page. For a calm, "reduce overwhelm" platform this is ironic. A learner who came because they feel overwhelmed is now scrolling through 3,000+ words of content with no way to mark anything complete, no way to save their place, and no prompt to take action on what they just learned.

**Step 4: Completion**
Module ends. The "progress bar" shows "Module 1 of 8." User clicks to next module. The progress bar now shows "Module 2 of 8." If they close the browser and return tomorrow, they start at Module 1 again. **Nothing was saved.**

**Step 5: Workbook**
There is no workbook.

**Step 6: Mentor**
User scrolls down, sees "Work With Taylor" → links to `/consultation`. Fills out a form. Taylor receives an email. Responds manually. This is a service, not a mentorship system.

**Step 7: Community**
There is no community.

**Step 8: Certification**
There is no certification.

### Drop-off Points
1. **Immediately on landing** for any user who isn't research-mode (no clear "start here" action that requires commitment)
2. **End of first module** — no completion moment, no reward, nothing to come back for
3. **Return visits** — zero memory of what they did before
4. **The gear path** — visual inconsistency when hitting hardcoded Hub components vs. ModuleLayout breaks trust

### Cognitive Load Issues
- Module pages are too long. Each needs a clear reading-time estimate.
- The `signatureSystem.ts` auto-generates several sections (TaylorsNote, StartHere, DecisionBlock, ClarityCallout) from templates. The generated content sometimes reads as generic because it literally is — it's assembled from string templates based on the module slug.
- "Decision layers," "clarity callouts," "what matters," "what doesn't matter," "how to decide," "scenarios" — the vocabulary is consistent but creates a feeling of pattern-matching rather than genuine instruction.

---

## PHASE 5 — CURRICULUM STRUCTURE AUDIT

### Registry Path (8 modules)
`what-to-register-first` → `where-to-register` → `shop-local-get-support` → `welcome-boxes-perks` → `rewards-completion-discounts` → `smart-purchasing-timeline` → `mistakes-to-avoid` → `baby-showers-gifting`

**Exceptional:** The "What to Register First" module. The decision-first, product-second philosophy is genuinely differentiated in this market. "Mistakes to Avoid" has strong pull for SEO and parent psychology.

**Problems:** "Welcome Boxes & Perks" and "Rewards & Completion Discounts" are essentially the same topic split across two modules. "Shop Local, Get Support" is the weakest module — feels like a thin affiliate play for local retailers. "Baby Showers & Gifting" belongs at the end but doesn't connect to the completion of the registry journey.

**Missing:** How to actually use a registry platform (not just where to register). Gift messaging strategy. How to handle unwanted gifts.

### Nursery Path (6 modules)
`vision-and-lifestyle` → `sleep-space-decisions` → `furniture-that-actually-works` → `layout-and-flow` → `storage-and-organization` → `atmosphere-and-safety`

**Exceptional:** "Sleep Space Decisions" — this is the most safety-critical module and it's handled well. The connection between furniture decisions and daily routine is strong.

**Problems:** `furniture-that-actually-works` spawns 7 submodule pages (cribs, gliders, monitors, etc.) that live at a completely different URL depth. The module architecture breaks down here. If you complete "Sleep Space Decisions" and click to "Furniture That Actually Works," you're about to receive 7 more pages. The path says "6 modules" but delivers 13+ pages of content within module 3 alone.

**Missing:** Nursery air quality / VOC considerations. Safe sleep checklist as a downloadable. Renter-friendly nursery module.

### Gear Path (9 modules)
`how-to-think-about-baby-gear` → `stroller-foundations` → `car-seat-foundations` → `travel-systems` → `travel-with-baby` → `daily-use-gear` → `feeding-setup-flow` → `breast-pump` → `bottles-and-baby-utensils`

**Exceptional:** "How to Think About Baby Gear" — the strongest module in the entire platform. The framing around lifestyle-first, then gear, is the Academy's clearest competitive advantage. The stroller compatibility tool is genuinely useful and technically impressive.

**Problems:** The gear path has the worst routing inconsistency. `stroller-foundations`, `car-seat-foundations`, and `daily-use-gear` each render custom Hub components instead of `ModuleLayout`. A user moves through 3 different visual templates inside the same "gear path." There is no coherent visual language.

The travel-systems module has an interactive compatibility tool (real data from the database). This is the only database-powered interactive feature in the entire Academy. It is buried at module 4. It deserves to be featured much more prominently.

**Missing:** Baby monitor standalone module (currently buried in nursery furniture submodules). Play equipment / activity gear. First-year gear evolution (what you need at month 1 vs. month 6).

### Postpartum Path (6 modules)
`healing-and-recovery` → `first-weeks-home-rhythm` → `feeding-and-lactation` → `rest-and-sleep` → `emotional-wellness-and-identity` → `support-systems`

**Exceptional:** "Emotional Wellness & Identity" — this module is the most emotionally resonant content on the platform. In a market full of logistics, this is a differentiator.

**Problems:** This is the thinnest path. The postpartum modules use the editorial image set (`/assets/editorial/`) rather than dedicated product images, which suggests these modules were built with less investment than the gear/nursery paths. The content is thoughtful but shorter and less developed. "Feeding and Lactation" overlaps with `feeding-setup-flow` in the gear path.

**Missing:** Postpartum is where the platform leaves the most money on the table. Pelvic floor recovery. Postpartum anxiety vs. depression. Returning to work. Partner support frameworks. A postpartum "prep kit" that could be purchased as a standalone product.

### Content That Should Be Downloadable Resources
- Sleep space safety checklist (from nursery path)
- Registry timeline (from registry path)
- Postpartum support system template (from postpartum path)
- Gear decision tree (from gear path)
- Hospital bag checklist

### Content That Should Become Workshops
- "Build Your Registry in 90 Minutes" (based on registry path)
- "Nursery Planning Session" (based on nursery path)
- "Gear Decision Day" (based on stroller + car seat foundations)

### Content That Should Become Standalone Products
- The stroller/car seat compatibility tool deserves its own product tier
- Case studies are undervalued — these could be premium content
- Postpartum planning could be a standalone pre-birth purchase

---

## PHASE 6 — COURSE DESIGN AUDIT

**Does the Academy feel like a structured educational journey or a giant content repository?**

Honest answer: it is a content repository with the visual language of a course platform.

The reasons:
1. **No enrollment moment.** A course starts when you decide to take it. Nothing on this platform marks the beginning of a learner's journey. You just browse to a page.
2. **No completion moment.** The most motivating part of a course is finishing. The Academy has no "you completed the registry path" state. No badge. No certificate. No email. No anything.
3. **No memory.** Every session is fresh. The platform has no idea if you're on your first visit or your twentieth.
4. **No transformation arc.** A great course shows you where you started and how far you've come. The Academy's progress bar shows a number based on content position, not learner state.
5. **No accountability.** A course gives you a reason to return. The Academy gives you excellent content to browse and nothing to come back for.

**What it currently is:** A premium knowledge base with a course aesthetic.

**What it needs to become:** A structured learning system where enrollment is a commitment, progress is real, and completion means something.

---

## PHASE 7 — WORKBOOK SYSTEM AUDIT

**The workbook system does not exist.**

There is no `Workbook` model in the Prisma schema. There are no workbook routes. There are no workbook components. The word "workbook" does not appear in any component or page file.

**What should the workbook be?**

Each Academy path should have a companion workbook — a structured set of prompts that translate the module content into concrete decisions and actions specific to the learner's situation. The workbook is what transforms passive reading into active learning and is what justifies a paid tier.

**Registry Workbook example prompts:**
- "What are the three non-negotiable jobs your registry needs to do in the first 30 days?"
- "What is your actual square footage for baby gear? List every room."
- "Who in your circle tends to buy off-registry? Write their names. Plan accordingly."

**Architectural recommendation:**
```
WorkbookSession (per learner per path)
  └── WorkbookResponse (per prompt)
       ├── promptId (maps to static prompt definitions)
       ├── response (text, could be JSON for structured input)
       └── savedAt

Prompts live in static TypeScript (like current module definitions)
Responses live in the database (per learner)
```

**Should workbooks be gated?** Yes. The workbook should be a paid-tier feature. Free users see the prompts. Paid users can answer, save, and share with a mentor.

---

## PHASE 8 — MENTOR SYSTEM AUDIT

**The mentor system does not exist.**

What exists:
- `ConsultationRequest` model (intake form fields: name, email, dueDate, city, babyNumber, message, intakeSummary, status)
- `ConsultationResponse` model (adminMessage, meetingLink, scheduledTime)
- A "Work With Taylor" CTA button at the bottom of every module → links to `/consultation`
- An admin page at `/admin/consultations` to view and respond

This is a contact-form-to-email workflow. It does not scale. It does not create a mentorship product. It cannot serve more than a handful of clients per month without Taylor doing all the work manually.

**What a real mentor system requires:**

1. **Availability management** — calendar integration (Calendly or native)
2. **Session records** — what was discussed, what was recommended
3. **Workbook access** — mentor can see learner's workbook responses before a session
4. **Progress visibility** — mentor can see which modules a learner has completed
5. **Note-taking** — mentor can add notes to a learner record
6. **Async messaging** — for follow-up between sessions
7. **Scalable mentor tiers** — Taylor reviews, trained mentors deliver

**Is mentor involvement currently scalable?** No. Every consultation runs through Taylor personally. At $197/session (estimated), this is a services business, not a product business. Mentorship at scale requires other certified mentors trained in the TMBC framework.

**What should remain human:** The first session. Framework reviews. Complex situations (multiples, medically complex babies, anxiety-driven decision making).

**What can be automated:** Intake qualification. Module assignment based on intake responses. Workbook review prompts. Follow-up sequences.

---

## PHASE 9 — DASHBOARD AUDIT

**Member Dashboard:** Does not exist.

**Mentor Dashboard:** Does not exist. (Consultations are reviewed at `/admin/consultations`, which is part of the admin panel, not a mentor-facing tool.)

**Admin Dashboard:** Exists at `/admin`. Covers blog management, guide management, academy module inventory, affiliate analytics, media, consultations, partners. Well-organized for a single admin operator. Will not scale when content volume grows.

**The only "dashboard" visible to non-admin authenticated users:** `/dashboard/affiliate` — an affiliate analytics page that requires admin role to access. Essentially an admin page with a different URL prefix.

**What the Member Dashboard must show:**
- Current path + module (resume where you left off)
- Progress across all paths (real percentage, DB-backed)
- Workbook completion status
- Upcoming mentor sessions
- Certificates earned
- Recommended next step based on due date / progress

**What the Mentor Dashboard must show:**
- Active learner roster
- Each learner's path progress and workbook responses
- Upcoming sessions
- Session note history
- Flagged learners (those who have stalled)

---

## PHASE 10 — UX & UI AUDIT

### Visual Design
The visual design is exceptional for the category. The rose/ivory/blush palette, the serif/sans-serif pairing, the card-based layouts, the animation system (`academy-load-in`, `academy-sheen`) — all of this creates a premium aesthetic that is genuinely differentiated from competitors.

### Desktop Experience
Strong. Navigation is clear. The path-to-module flow makes sense. Module pages are long but scrollable. The `NextBestDecisionCard` at the bottom of every module is the best navigation pattern on the platform — it eliminates the dead end.

### Mobile Experience
The design is responsive but the module pages are brutal on mobile. A `ModuleLayout` page renders 12 distinct content sections, often totaling 4,000+ words. On a 375px screen, a user is scrolling for 8-12 minutes of reading with no checkpoints, no breaks, and no way to resume.

The header navigation on mobile collapses correctly but the Academy path navigation (which path you're in, which module you're on) is not visible in a collapsed state.

### Cognitive Load
The module template includes too many sections. Count: breadcrumbs → YouAreHereCard → header → image → progress bar → TaylorsNote → StartHere → DecisionBlock → WhatMatters/WhatDoesntMatter grid → core sections → HowToDecide → ClarityCallout → products → soft CTA → consultation CTA → NextBestDecisionCard.

That is 15 discrete sections. Users cannot retain the pedagogical goal of the module when it is surrounded by 14 other things.

### Comparison to Platforms
- **Kajabi**: TMBC has better editorial voice. Kajabi has better learner infrastructure (progress, certificates, community).
- **Teachable**: TMBC has better design. Teachable has video-first completion-driven architecture.
- **Coursera**: Not relevant — different market.
- **Circle**: TMBC has no community whatsoever.
- **Tinyhood**: TMBC has better written content. Tinyhood has video, which converts better for this demographic.

**What TMBC is closest to:** A premium editorial publication (think Wirecutter for baby gear) that has applied course-platform aesthetics but hasn't built course-platform infrastructure. The editorial quality rivals or exceeds any competitor. The learning architecture lags every competitor by 2-3 years.

---

## PHASE 11 — MONETIZATION AUDIT

### Current Revenue Streams
1. **Affiliate links** — clicks tracked in `AffiliateClick`. Revenue estimated (no verified conversion data). CJ, Impact, Awin, Direct networks. No Stripe. No verified revenue reporting.
2. **Consultation bookings** — intake form → manual follow-up. No pricing displayed anywhere in the codebase. No Stripe integration.

### What Is Currently Free
**Everything.** All 29 modules. All 4 paths. All case studies. All submodules. All guides. All blog posts. All tools (including the compatibility checker). No email gate. No login required for anything except the admin panel.

### The Core Problem
You are operating a free public library with a consultation service attached. The consultation is the only real product. The Academy drives zero recurring revenue.

### Recommended Monetization Architecture

**Tier 1: Free (Lead Generation Layer)**
- Academy home + path overview pages
- First module of each path (registry, nursery, gear, postpartum)
- Blog posts
- Guides index

**Tier 2: TMBC Academy ($12–19/month or $97/year)**
- All 29 modules, all paths
- Workbooks with save/resume
- Path certificates on completion
- Downloadable resources (checklists, timelines, decision trees)
- Email support for questions

**Tier 3: TMBC Academy + Mentor ($49–79/month or $297/year)**
- Everything in Tier 2
- Monthly group mentor call (Taylor or certified TMBC mentor)
- Workbook review by mentor
- Async Q&A thread

**Tier 4: TMBC Concierge ($500–1,500 flat)**
- Private 1:1 sessions with Taylor
- Full registry review
- Personalized gear shortlist
- Postpartum prep plan

**Standalone Products**
- "Registry In A Day" workshop — $47
- "Nursery Planning Guide" PDF — $27
- "Gear Decision Playbook" PDF — $27
- "Postpartum Prep Kit" — $47
- Travel system compatibility checker (premium, personalized) — $19

**Affiliate Strategy (existing, improve)**
- Current affiliate model is solid technically. The routing priority system in `AffiliatePartner` is thoughtful.
- Missing: verified revenue attribution. Affiliate clicks are tracked but there is no confirmed conversion data. The "revenueEstimator.ts" file admits this is a proxy.
- Fix: Apply for Amazon Associates and retailer programs that provide conversion data, not just click data.

### Revenue Projection (conservative)
- 1,000 Academy subscribers at $12/month = $12,000/month
- 5% upgrade to Mentor tier at $49/month = $2,450/month
- 20 Concierge clients at $750 = $15,000/month
- Affiliate estimated (current traffic) = $2,000–5,000/month
- **Total potential at 1,000 paying users: ~$31,000–35,000/month**

---

## PHASE 12 — SCALABILITY AUDIT

### 100 Users
Current system handles this fine — it's all static content serving. Affiliate tracking and consultation intake work at this scale. The problem: these 100 users are all anonymous. You know nothing about them. You cannot email them. You cannot bring them back.

### 1,000 Users
Content delivery still fine. The consultation-as-mentorship model breaks here. Taylor cannot personally serve 1,000 consultation clients. The affiliate click database starts accumulating significant volume; the current schema handles it but analytics queries will slow without better indexing on `AffiliateClick`. The hardcoded TypeScript content system means every module update requires a developer and a deployment.

### 10,000 Users
Three things break simultaneously:
1. **The consultation model is dead.** 10,000 users generating even 1% consultation requests = 100 manual consultations per month. Impossible without a team.
2. **The hardcoded content system creates a bottleneck.** A content team cannot update academy modules. Every content change goes through a developer. The CMS-backed `/guides` system can scale but the Academy cannot.
3. **No learner data means zero retention tools.** 10,000 visitors with no email capture, no accounts, no history. You cannot run a re-engagement campaign, personalize anything, or measure learning outcomes.

### 100,000 Users
The entire architecture needs to be different. At this scale you need:
- A proper CMS (Contentful, Sanity, or a database-first approach like the existing `/guides` system expanded)
- Video delivery infrastructure (Mux or Wistia)
- A community platform (Circle.so or native)
- A proper LMS database schema (as outlined in Phase 3)
- A trained mentor team (5–10 certified TMBC mentors)
- Automated email sequences
- Analytics beyond affiliate click tracking

The good news: the content, the voice, and the framework are scalable intellectual property. What breaks is the delivery infrastructure, not the thing being delivered.

---

## PHASE 13 — COMPETITIVE POSITIONING

### Competitor Analysis

**Tinyhood**
- Model: $12.99/month subscription, video courses
- Coverage: Sleep, breastfeeding, CPR, newborn care
- Strengths: Video production quality, OB/pediatrician credibility markers
- Weaknesses: Generic, no personal voice, no gear/registry guidance
- **TMBC vs Tinyhood:** TMBC wins on gear and registry. Tinyhood wins on video and medical credibility. TMBC's editorial voice is 10x stronger. Tinyhood charges; TMBC gives it away.

**Babylist**
- Model: Free registry platform, affiliate/brand revenue, guides
- Coverage: Registry, gear, product reviews
- Strengths: Network effects (millions of registries), brand relationships, shopping integration
- Weaknesses: Content is generic comparison-style, no educational framework, no learning journey
- **TMBC vs Babylist:** Babylist has distribution TMBC cannot compete with. TMBC's content quality and framework are meaningfully better. TMBC should be a content partner for Babylist, not a competitor.

**Taking Cara Babies**
- Model: $39–89 per course (sleep-focused), strong Instagram funnel
- Coverage: Sleep exclusively
- Strengths: Dominant brand authority in sleep, massive social following, very high conversion rate
- Weaknesses: Single-topic, no registry/gear/postpartum integration
- **TMBC vs TCB:** TCB is in a different lane (sleep). TMBC should not try to win on sleep. TMBC's total-preparation framework has no equivalent competitor.

**Mommy Labor Nurse (Liesel Teen)**
- Model: $197 one-time course bundles (birth prep primarily)
- Coverage: Labor, delivery, breastfeeding
- Strengths: Huge TikTok/Instagram presence, strong conversion from video
- Weaknesses: Nurse-as-brand is narrow, no gear/registry/nursery coverage
- **TMBC vs MLN:** Different lanes. MLN wins on birth. TMBC wins on everything that comes after (and before, for registry/gear).

**Newborn Foundations (Cara Harvey)**
- Model: $49–97 courses, postpartum focus
- Coverage: Postpartum planning, sleep
- Strengths: Postpartum positioning is underserved
- Weaknesses: Low production quality, generic content
- **TMBC vs Newborn Foundations:** TMBC's postpartum content quality is better. Newborn Foundations is charging for it.

**The Baby Academy (UK)**
- Model: Membership
- Coverage: Baby development, sleep, feeding
- Strengths: Professional credentials, structured curriculum
- Weaknesses: UK-focused, limited gear/registry relevance for US market
- **TMBC vs The Baby Academy:** Different markets primarily.

**Karrie Locher (Postpartum University)**
- Model: $97–297 courses, postpartum mental health
- Coverage: Postpartum mental health, recovery
- Strengths: Clinical positioning, specific niche
- Weaknesses: Mental health focus excludes the logistics preparation market
- **TMBC vs Karrie Locher:** TMBC's emotional wellness module touches Karrie's territory but doesn't compete directly.

### TMBC's Competitive Position

**Defensible moats:**
1. **The framework.** Decision-first, product-second is a genuine philosophical differentiation. No competitor frames baby prep this way.
2. **The voice.** "Calm, don't add to the noise" is immediately recognizable and emotionally resonant with the target parent.
3. **Total-preparation coverage.** Registry + Nursery + Gear + Postpartum in one integrated system is unique. Competitors are single-topic.
4. **The compatibility tool.** The stroller/car seat database with real compatibility data is a technical asset no competitor has.
5. **The affiliate data architecture.** The routing priority and context-aware affiliate system is more sophisticated than anything competitors have built.

**Competitive weaknesses:**
1. **No video.** This demographic converts primarily on video. The entire platform is text.
2. **No social presence visible in the codebase.** No Instagram feed integration, no TikTok embeds, no UGC.
3. **No email capture on the Academy.** The entire learner funnel has no email gate at any point.
4. **Priced at $0.** Free content signals "good but not expert-level" in this market. TCB at $89 signals expertise. TMBC at $0 fights that signal.
5. **No completion proof.** No certificate, no badge, no "I completed TMBC Academy" shareable moment. Zero word-of-mouth from completions.

---

## PHASE 14 — ACADEMY 2.0 DESIGN

### Route Structure

```
# Public (Free) — Lead generation
/academy                              ← Homepage (keep, improve)
/academy/[path]                       ← Path overview (keep, improve)
/academy/[path]/module-1              ← First module only, free preview
/academy/case-studies                 ← Keep (strong SEO, social proof)

# Learner (Authenticated, Paid)
/learn                                ← Learner dashboard (new)
/learn/[path]                         ← Path progress view
/learn/[path]/[module]               ← Authenticated module with progress tracking
/learn/[path]/workbook               ← Path workbook (new)
/learn/profile                        ← Learner profile + settings
/learn/certificates                   ← Earned certificates

# Mentor (Authenticated, Mentor Role)
/mentor                               ← Mentor dashboard (new)
/mentor/learners                      ← Learner roster
/mentor/learners/[id]                ← Individual learner view + workbook access
/mentor/sessions                      ← Upcoming sessions
/mentor/sessions/[id]                ← Session notes

# Admin (existing, cleanup)
/admin                                ← Keep
/admin/academy                        ← Connect to real DB (not just guides)
/admin/learners                       ← New: manage learner accounts
/admin/mentors                        ← New: manage mentor accounts
/admin/revenue                        ← Consolidate affiliate + subscription revenue

# Tools (keep, improve)
/tools/travel-system                  ← Promote this much more aggressively

# Pricing (new)
/pricing                              ← New: required
/checkout                             ← New: Stripe integration

# Eliminate confusion
/guides/[slug]                        ← CONSOLIDATE into /academy or /blog
                                         The dual-system problem must be resolved
```

### Navigation Structure

```
Public nav: Academy | Blog | Guides | Work With Taylor | [Login / Get Started]

Learner nav (post-login):
  My Academy (dashboard) | Continue Learning | Workbook | Certificates | Mentor Sessions

Mentor nav:
  My Learners | Sessions | Notes | Resources
```

### Dashboard Architecture

**Learner Dashboard (`/learn`)**
```
┌─────────────────────────────────────────────────────┐
│  Hello, [Name]. You're 23 weeks along.              │
│  Your next step: Gear Path, Module 3                │
│  [Continue → ]                                       │
├──────────────┬──────────────┬───────────────────────┤
│  Registry    │  Nursery     │  Gear                 │
│  ████████░░  │  ██░░░░░░░░  │  ████░░░░░░           │
│  5/8 done    │  1/6 done    │  3/9 done             │
├──────────────┴──────────────┴───────────────────────┤
│  Workbook: Registry Workbook — 4 of 12 prompts done │
│  [Continue Workbook →]                              │
├─────────────────────────────────────────────────────┤
│  Upcoming: Mentor Session — Tue Jun 10 at 2pm EST   │
│  [Add to Calendar] [View Details]                    │
└─────────────────────────────────────────────────────┘
```

### Workbook Architecture

Each path has one workbook. Each workbook has 10–15 structured prompts. Prompts are static TypeScript (no DB needed for prompts — just their IDs). Responses are saved to `WorkbookResponse` per learner.

Workbook is accessible alongside the module it relates to — not as a separate app. Every module gets a "Workbook Prompt" card at the bottom (replacing or supplementing the current soft CTA). Free users see the prompt but cannot save. Paid users answer and save.

### Certification Architecture

Path certificate issued automatically when all modules in a path are marked complete. Certificate has: learner name, path name, date, verification URL (`/verify/[code]`). Verification page is public. Certificate is sharable as an image (og:image generated server-side).

**"TMBC Fully Prepared" certification** issued when all four paths are complete. This is the flagship credential. Shareable. Embeds on social. Creates word-of-mouth.

### Monetization Architecture

```
FREE TIER (no account required)
 └── Academy path overviews
 └── Module 1 of each path
 └── Blog + Guides
 └── Compatibility tool (basic)

ACADEMY ($14.99/month or $99/year)
 └── All 29+ modules
 └── Path workbooks with save/resume
 └── Path completion certificates
 └── TMBC Fully Prepared cert (all 4 paths)
 └── Downloadable resources
 └── Compatibility tool (full, personalized)
 └── [Stripe Checkout → /checkout]

ACADEMY + MENTOR ($49/month or $329/year)
 └── Everything in Academy
 └── Monthly group Q&A call
 └── Workbook review by TMBC mentor
 └── Async mentor messaging

CONCIERGE (by application, $750–1,500)
 └── 1:1 with Taylor
 └── Full registry audit
 └── Custom gear shortlist
 └── Postpartum prep plan
```

---

## TOP 25 PROBLEMS (Ranked by Severity)

1. **No learner accounts.** The entire platform is anonymous. No retention, no tracking, no personalization, no recurring revenue is possible without this. Everything else on this list is downstream of this problem.

2. **No payment infrastructure.** No Stripe. No pricing page. No checkout. The platform has zero mechanism to convert users to paying customers.

3. **The progress bar is fake.** It displays a hardcoded module position number. It resets on every visit. It has created technical debt — the UI vocabulary of a course platform without the backend to support it. Users who trust it are being misled.

4. **No email capture in the Academy funnel.** A user can read all 29 modules, find them life-changing, close the browser, and you have zero information about who they were. No newsletter prompt, no "save your progress" gate, no opt-in anywhere in the module flow.

5. **Dual content system.** `/academy` (hardcoded TypeScript) and `/guides` (database CMS) cover the same topics with different systems, different URLs, different update workflows, and no clear user-facing distinction. This splits SEO authority and creates a maintenance burden.

6. **All premium content is free.** Competitors charge $40–200 for what TMBC gives away. This undermines perceived value and eliminates the most obvious revenue stream.

7. **No workbook system.** The most valuable tool for converting passive readers into active learners doesn't exist.

8. **No mentor infrastructure.** What is sold as mentorship is a contact form. It cannot scale and it captures no structured data about client progress.

9. **Academy content is hardcoded TypeScript.** Every module update requires a developer, a code review, and a deployment. This is not a content management system; it is a content prison. The marketing team (or Taylor herself) cannot update a single sentence without engineering support.

10. **Route inconsistency inside the gear path.** The stroller, car seat, and daily-use-gear modules render through completely different layout components than the rest of the path. A user experiences three visual templates inside one "gear path."

11. **Module pages are too long.** 15 content sections per module page creates cognitive overload, especially on mobile. There is no progressive disclosure — everything is presented at once.

12. **No video content.** The target demographic (expecting parents aged 28–38) converts primarily on video. Text-only in this market is a structural disadvantage.

13. **The database schema has no learner model.** This isn't a missing feature — it's a missing foundation. Building membership on the current schema means a full migration.

14. **No certification program.** Completion of 29 modules earns a user nothing. No badge, no credential, no shareable moment. Zero word-of-mouth generated from completion.

15. **No community.** Learning is social. The Academy has no forum, no cohort, no community touchpoint. Learners are isolated.

16. **The consultation CTA appears on every single module page.** "Work With Taylor" appears 29+ times across the Academy. It creates consultation fatigue and feels like a sales pitch interrupting an educational experience.

17. **The affiliate data model is overengineered.** Three overlapping models (Brand, AffiliateProgram, AffiliatePartner) create confusion and maintenance overhead. No verified revenue data — all estimates.

18. **The signatureSystem.ts generates module content from templates.** Several sections of each module page (TaylorsNote title, StartHere paragraphs, ClarityCallout) are auto-assembled from string templates. This works but it means modules feel structurally identical and the "voice" is sometimes mechanical.

19. **No mobile-first reading experience.** Module pages on mobile are 8–12 minute reads with no chapter breaks, no progress saves, and no resume capability. This is the primary use case for this demographic (pregnant people reading on their phones) and it's the worst experience.

20. **The admin "academy" workspace manages database guides, not hardcoded academy modules.** An admin who navigates to `/admin/academy` to update a module will find the guide CMS — because the actual academy content cannot be edited without code changes. The workspace is misleadingly named.

21. **No SEO breadcrumb/URL consistency.** Submodules at `/academy/gear/daily-use-gear/carrier` are orphaned from the path structure. They appear to be standalone pages to Google, not part of a structured learning path. Internal link equity is scattered.

22. **No pricing page.** There is no `/pricing` route. A user who wants to pay has no path to do so. The consultation page doesn't show pricing. The Academy doesn't offer a paid option. There is literally no way to give TMBC money except to book a mystery-priced consultation.

23. **The tools/travel-system page is buried.** The most technically differentiated feature on the platform — a real stroller/car seat compatibility database with filtering — lives at `/tools/travel-system` and receives minimal promotion. It also appears embedded in a single gear module. It should be a flagship product.

24. **No A/B testing infrastructure.** Every module is served identically to every user. There is no mechanism to test whether a different CTA, a shorter module, or a different entry path increases engagement or conversion.

25. **No analytics on learning behavior.** Affiliate clicks are tracked (`PostAnalytics`, `GuideAnalytics`, `AffiliateClick`). Module reads are not. There is no data on how far users scroll, which modules they abandon, which paths they complete, or what their reading behavior looks like. Decisions about content are made without evidence.

---

## TOP 25 OPPORTUNITIES (Ranked by Impact)

1. **Build a Learner account system.** Email + password signup (or Google OAuth). This single change enables every other improvement on this list.

2. **Add a pricing page and Stripe checkout.** The content, the framework, and the audience are ready. The payment infrastructure is not. This could generate meaningful MRR within 30 days of launch.

3. **Gate the full Academy behind a $14.99/month subscription.** Keep one free module per path as a preview. The rest requires an account.

4. **Add a newsletter/save prompt after the first module.** "Want to save your progress and get the next module delivered to your inbox?" This builds a list and creates a re-engagement mechanism.

5. **Build the workbook system.** This is the feature that justifies the paid tier more than anything else. Registry workbook alone is worth the price of admission.

6. **Convert the compatibility tool into a standalone featured product.** Give it its own prominent homepage section. Build a paid "personalized report" version.

7. **Add real progress tracking.** Replace the cosmetic progress bar with DB-backed tracking. "You completed Module 3. 4 more to earn your Registry Certificate." This alone increases completion rates dramatically.

8. **Build path completion certificates.** Shareable. Beautiful. Verifiable. The word-of-mouth value is significant.

9. **Migrate academy content to the database.** Use the existing `Guide` model or create a new `AcademyModule` model. Allow Taylor (or a content team) to update modules without a developer.

10. **Consolidate the dual content system.** Merge `/guides` into `/academy` or clearly delineate them. Stop splitting SEO authority across two systems covering the same topics.

11. **Add video to the top of each module.** Even 2–3 minute intro videos per module would dramatically increase completion and conversion. Taylor talking directly to camera in the TMBC voice would be highly differentiating.

12. **Build a learner dashboard.** "Resume where you left off" + progress overview + workbook status. This is the primary retention mechanism.

13. **Create a group mentor call product.** Monthly group Q&A at $49/month is scalable mentorship. Taylor runs one call; 50 people attend. $2,450 for one hour.

14. **Launch the "Registry In A Day" workshop.** Based on the existing registry path. Delivered live quarterly. $47/person. Evergreen recording at $27. High conversion from Academy traffic.

15. **Promote the postpartum path more aggressively.** This is the most underserved topic in the market. TMBC's emotional wellness module is genuinely exceptional. Build it out and position it as the premium product.

16. **Add an email sequence for free users.** 8-week "Baby Prep" email course that drips one module recommendation per week. Builds habit, demonstrates value, converts to paid.

17. **Build case studies into the learner journey.** Currently case studies are a separate section. They should appear inline at relevant module points. "A family in a 1BR apartment navigated this exact module like this..."

18. **Create a "TMBC Fully Prepared" certification.** Complete all 4 paths. Get a certificate. Share it. This is the flagship engagement mechanic.

19. **Add mobile chapter navigation to module pages.** A sticky "In This Module" table of contents that collapses on mobile. Reduces bounce from long pages.

20. **Normalize the affiliate data model.** Merge Brand + AffiliateProgram + AffiliatePartner. The current three-model structure is a maintenance burden.

21. **Build a real mentor management system.** Session scheduling, learner progress visibility, workbook review, async messaging. This makes the consultation product scalable.

22. **Add social proof to the Academy.** "4,200 parents have completed the Registry Path." Aggregate learner numbers (even estimated) create FOMO and trust signals.

23. **Create a gift version of the Academy subscription.** "Give the TMBC Academy to someone expecting" at $99/year. Baby showers are an obvious gifting moment.

24. **Fix the submodule URL structure.** Bring all submodules under the dynamic `/academy/[path]/[module]` pattern. Eliminate the 3-level-deep hardcoded routes.

25. **Add completion emails.** When a learner finishes a module, send an email with a summary, a workbook prompt, and a link to the next module. Basic automation that dramatically increases return visits.

---

## FASTEST WINS (7 days or less)

These require no infrastructure changes and minimal development.

**Day 1:**
- Add an email opt-in at the end of every module. "Save your place. Get the next module in your inbox." Integrate with any ESP (ConvertKit, Beehiiv, etc.). This alone begins building a monetizable list.
- Add a "Reading time: 8 min" indicator to each module header.

**Day 2–3:**
- Collapse the module page from 15 sections to 8. Remove: the second TaylorsNoteCard duplicate, the ClarityCallout (auto-generated and weakest section), and move the consultation CTA to appear only once (not within module AND at bottom).
- Add a "Table of Contents" anchor nav to each module page. Fixes mobile UX immediately.

**Day 4:**
- Add a pricing page at `/pricing`. Even before Stripe is integrated. Show the three tiers. "Coming Soon — Join the waitlist." Captures demand signal.
- Feature the travel system tool more prominently. Put it in the main nav under "Tools."

**Day 5–6:**
- Consolidate the 5 Hub components into one `SubmoduleHubLayout`. This is a pure refactor with no user-visible change but eliminates 4 redundant files.
- Fix the module URL inconsistency: add proper `canonical` tags on hardcoded gear/nursery submodule routes pointing to their parent module. This consolidates SEO equity.

**Day 7:**
- Write a "You completed [Module Name]!" in-page moment. A simple CSS animation + encouraging message when the user reaches the `NextBestDecisionCard`. This is cosmetic but creates a micro-completion moment that didn't exist before.

---

## MVP IMPROVEMENTS (30 days)

These require real development but are achievable in a month with focused effort.

**Week 1: Authentication + Basic Learner Model**
- Add `Learner` model to Prisma schema (separate from the admin `User` model)
- Build signup/login flow for learners (`/signup`, extend `/login`)
- Add Google OAuth as second login option (much higher conversion than email/password for this demographic)
- Protect all module pages behind optional auth (free users can read; logged-in users get progress tracking)

**Week 2: Real Progress Tracking**
- Add `LessonProgress` model
- Replace cosmetic `AcademyProgressBar` with DB-backed version
- Add "Mark Complete" button to each module page
- Build learner dashboard at `/learn` with path progress overview and "Resume" CTA

**Week 3: Stripe + Pricing**
- Add Stripe integration
- Build `/pricing` page
- Build `/checkout` flow
- Gate full module access behind paid tier (free users see Module 1 of each path only)
- Add `Subscription` model to Prisma

**Week 4: Workbook MVP**
- Build `WorkbookSession` and `WorkbookResponse` models
- Add workbook prompts to the Registry path (start with one path)
- Build workbook UI within the `/learn/registry/workbook` route
- Gate workbook behind paid tier

---

## ACADEMY 2.0 ROADMAP

### Phase 1: Foundation (Months 1–2)
- Learner accounts (signup, login, Google OAuth)
- Real progress tracking (LessonProgress model)
- Learner dashboard (`/learn`)
- Stripe checkout + subscription model
- Pricing page
- Email capture throughout Academy
- Module page redesign (reduce sections, add mobile ToC)
- Free tier: first module per path; paid tier: all modules

### Phase 2: Engagement (Months 3–4)
- Workbook system (all 4 paths)
- Path completion certificates (auto-generated, shareable)
- "TMBC Fully Prepared" certification
- Completion emails (module + path level)
- Email sequence for free users (8-week drip)
- Case studies integrated into module flow
- Mobile reading experience overhaul

### Phase 3: Monetization Expansion (Months 5–6)
- Group mentor call product (live Zoom sessions, monthly)
- Mentor management system (scheduling, learner notes, workbook review)
- Standalone workshop products (Registry In A Day, etc.)
- Gift subscription option
- Affiliate revenue verification (partner with programs that share conversion data)
- Analytics dashboard showing learner behavior, completion rates, drop-off points

### Phase 4: Content and Scale (Months 7–12)
- Migrate academy content to database (eliminate hardcoded TypeScript system)
- Consolidate `/guides` into `/academy` or clearly separate the products
- Video layer for module introductions
- Community platform (async discussion, cohorts)
- Partner certifications (TMBC-endorsed retailers, brands)
- Second creator onboarding (scale mentor team beyond Taylor)
- Native mobile app consideration (PWA or React Native)

---

## ULTIMATE VISION — WHAT TMBC ACADEMY BECOMES IN 3 YEARS

**Year 1 Goal: The Paid Academy ($500K ARR)**
TMBC launches a subscription at $14.99/month. It builds to 3,000 paying subscribers through content marketing, the existing blog and guide traffic, and targeted social. The consultation product becomes a premium tier. Taylor steps back from 1:1 work to run monthly group calls.

**Year 2 Goal: The Platform ($2M ARR)**
TMBC trains and certifies 10 TMBC Mentors — pediatric nurses, registry specialists, postpartum doulas — who deliver the mentor tier. Taylor becomes the curriculum director, not the service provider. TMBC adds a community layer. Completion rates and word-of-mouth drive organic growth. The Fully Prepared certification becomes a recognized credential in the baby prep space.

**Year 3 Goal: The Category ($5M+ ARR)**
TMBC is the operating system for baby preparation. Registry + Nursery + Gear + Postpartum + Community + Expert network, all in one platform. Brand partnerships move from affiliate links to official curriculum integrations (a crib brand sponsors the nursery path; a stroller brand sponsors the gear path). The baby registry occasion becomes a TMBC onramp for an entire family's first year. B2B: hospitals, OB practices, and employer benefits programs license TMBC Academy for their expecting parents.

The defensible moat in year 3 is not the content — it is the learner data. TMBC knows what decisions 100,000 parents made, how they made them, and what they bought. No competitor has that dataset. It becomes the foundation for a recommendation engine that is genuinely personalized, genuinely helpful, and genuinely unmatched in this market.

**The thesis:**
Every year, 3.6 million babies are born in the United States. Every one of those births involves at least one caregiver who is overwhelmed, decision-fatigued, and desperate for a trusted guide. TMBC has already built the clearest, calmest, most intellectually honest baby preparation framework in the market. The only thing missing is the infrastructure to charge for it, track it, and scale it.

Build the infrastructure. The content will do the rest.

---

*End of Audit — Taylor-Made Baby Academy | June 2026*
