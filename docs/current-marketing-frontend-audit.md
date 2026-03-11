# Current Marketing Frontend Audit

Audit basis:
- Source scan across the public app router, shared layout, navigation, footer, global styles, blog template stack, service components, forms, and metadata helpers.
- Key sources: [app/layout.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/layout.tsx), [components/Header.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/Header.tsx), [components/Footer.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/Footer.tsx), [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx), [app/services/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/services/page.tsx), [app/how-it-works/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/how-it-works/page.tsx), [app/blog/[slug]/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/blog/[slug]/page.tsx), [components/blog/PostArticleView.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/PostArticleView.tsx), [app/globals.css](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/globals.css), [styles/blog.css](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/styles/blog.css).
- Live content check via local Prisma query on March 11, 2026: 3 published public blog posts, all in `Registry Strategy`; 1 public author slug, `admin`.
- This is a current-state documentation pass only. No redesign or refactor was performed.

# 1. CURRENT MARKETING SITE MAP

## ACTIVE PUBLIC MARKETING PAGES

- `/`
  Page purpose: primary front door and broad positioning page.
  Primary audience intent: understand what TMBC is, what help is offered, and how to start.
  Primary CTA: `Request Consultation`.
  Relationship to funnel: strongest top-level conversion hub; also routes to services, process, about, and blog.
  Source: [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx)

- `/about`
  Page purpose: founder credibility and philosophy page.
  Primary audience intent: vet Taylor's expertise and approach before contacting.
  Primary CTA: `Book a Complimentary Consultation` linking to `/contact`.
  Relationship to funnel: trust-building side page; not in main nav, but linked from footer and homepage.
  Source: [app/about/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/about/page.tsx)

- `/services`
  Page purpose: explain support tiers, package structure, partnerships, and add-ons.
  Primary audience intent: self-select a service level.
  Primary CTA: `Request a Consultation` in hero, then service-card CTAs to `/contact?service=...`.
  Relationship to funnel: middle-of-funnel service exploration page; strongest package-detail page.
  Source: [app/services/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/services/page.tsx)

- `/how-it-works`
  Page purpose: process explanation plus embedded consultation request.
  Primary audience intent: understand what happens first and submit a request without leaving the page.
  Primary CTA: `Schedule Your Complimentary Consultation`.
  Relationship to funnel: clearest explanation-to-conversion handoff; strongest embedded form page.
  Source: [app/how-it-works/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/how-it-works/page.tsx)

- `/consultation`
  Page purpose: dedicated standalone consultation request page.
  Primary audience intent: submit a consultation form directly.
  Primary CTA: `Submit Consultation Request`.
  Relationship to funnel: direct conversion page, but partially redundant with `/how-it-works`.
  Source: [app/consultation/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/consultation/page.tsx)

- `/consultation/confirmation`
  Page purpose: post-submit confirmation state.
  Primary audience intent: confirm form receipt and choose where to go next.
  Primary CTA: `Return Home`; secondary CTA is `Back to How It Works`.
  Relationship to funnel: utility endpoint after consultation submission.
  Source: [app/consultation/confirmation/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/consultation/confirmation/page.tsx)

- `/contact`
  Page purpose: general inquiry page and service-specific intake destination.
  Primary audience intent: ask a question or inquire about a specific package.
  Primary CTA: `Submit Inquiry`.
  Relationship to funnel: service-intake branch; receives traffic from service cards and about page.
  Source: [app/contact/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/contact/page.tsx)

- `/faq`
  Page purpose: answer consultation, planning, and service questions.
  Primary audience intent: reduce objections before inquiry.
  Primary CTA: generic Final CTA to `/consultation`.
  Relationship to funnel: objection-handling page; supportive rather than primary entry point.
  Source: [app/faq/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/faq/page.tsx)

- `/blog`
  Page purpose: index of educational guides.
  Primary audience intent: browse educational content by category.
  Primary CTA: article card links; page-level Final CTA to `/consultation`.
  Relationship to funnel: authority/education layer, but currently thin and mostly isolated from the service funnel until page bottom.
  Source: [app/blog/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/blog/page.tsx)

- `/blog/[slug]`
  Page purpose: article template for educational content.
  Primary audience intent: read a guide and optionally continue to related posts or the final consultation CTA.
  Primary CTA: article-specific links if content includes them; otherwise Final CTA to `/consultation`.
  Relationship to funnel: authority content layer; technically capable, but current live articles are light on monetization and proof modules.
  Source: [app/blog/[slug]/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/blog/[slug]/page.tsx), [components/blog/PostArticleView.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/PostArticleView.tsx)

- `/blog/author/[slug]`
  Page purpose: author archive page.
  Primary audience intent: see who wrote the posts and browse that author's articles.
  Primary CTA: article cards and Final CTA.
  Relationship to funnel: supporting authority page; currently weak because the only public author is `Admin`.
  Source: [app/blog/author/[slug]/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/blog/author/[slug]/page.tsx)

## CURRENT LIVE PUBLIC BLOG INSTANCES

- `/blog/gear-decisions-without-guesswork`
  Purpose: educational article about gear evaluation.
  Category: `Registry Strategy`.
  Notes: no featured image, no affiliate block, no downloadable resource, no inline CTA module.

- `/blog/nursery-setup-that-actually-works`
  Purpose: educational article about nursery setup.
  Category: `Registry Strategy`.
  Notes: no featured image, no affiliate block, no downloadable resource, no inline CTA module.

- `/blog/the-art-of-the-registry`
  Purpose: educational article about registry planning.
  Category: `Registry Strategy`.
  Notes: no featured image, no affiliate block, no downloadable resource, no inline CTA module.

- `/blog/author/admin`
  Purpose: current live author archive.
  Notes: renders as `Admin` with fallback copy and no expertise metadata.

## PUBLIC BUT NON-MARKETING / UTILITY ROUTES

- `/login`
  Publicly reachable admin sign-in page wrapped in the same `SiteShell`.
  Not part of the marketing funnel.
  Source: [app/login/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/login/page.tsx)

- `/r/[code]`
  Affiliate redirect route with logging and safety checks.
  Publicly reachable, but not a marketing content page.
  Source: [app/r/[code]/route.ts](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/r/[code]/route.ts)

## LEGACY / UNUSED / UNCLEAR PAGES

- `app/book/`
  Empty directory. No active route file found.

- `app/dashboard/`
  Empty directory. No active route file found.

- `components/blog/BlogSoftCTA.tsx`
  Present but not imported anywhere in the active public routes.

- `app/globals.css` classes for `homepage-section`, `homepage-support-section`, `homepage-method-section`, `homepage-testimonials-section`, `homepage-post-bow-section`, and `services-blueprint-section`
  Styling hooks exist, but no matching active page usage was found in the current route files.

# 2. PAGE-BY-PAGE WIREFRAME INVENTORY

## PAGE: /

Source: [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx)

Purpose: explain the full public-facing offer and drive consultation or service exploration.
Current positioning role: primary brand and funnel hub.
Primary CTA: `Request Consultation`.
Secondary CTA: `Explore Services`.
Visual tone: editorial, soft-luxury, blush/ivory, full-bleed hero with ribbon divider and soft trust cards.
Observed issues / notes: strongest page structurally; still mixes authority language with service-selling; repeats service/process content that later reappears on `/services` and `/how-it-works`.

Section order:
1. Header / nav
   Visible copy hierarchy: brand wordmark; `Home`, `How It Works`, `Services`, `Guides`, `FAQ`, `Contact`.
   Approximate role in funnel: orientation.
   Type: navigation / trust.
   Repeated component patterns: global sticky header.
   Likely source component/file: [components/Header.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/Header.tsx).
   Assessment: essential; no persistent conversion CTA and no `About` link.

2. Hero
   Visible copy hierarchy: `Taylor-Made Baby Co.` eyebrow, headline `Baby planning guidance that makes the next decisions feel clear.`, supporting body, authority chip strip, two CTAs, micro-proof line.
   Approximate role in funnel: positioning plus immediate conversion.
   Type: authority-building / conversion.
   Repeated component patterns: Hero variant with custom children, ribbon divider, authority chips.
   Likely source component/file: [components/ui/Hero.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/Hero.tsx), [components/ui/AuthorityStrip.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/AuthorityStrip.tsx).
   Assessment: essential and strongest positioning block on the site.

3. Trust strip / proof surface
   Visible copy hierarchy: eyebrow `You're in capable hands`, title `Trusted support for the details families second-guess most.`, three cards for premium retail expertise, partner-backed safety support, warm concierge guidance.
   Approximate role in funnel: early credibility.
   Type: trust-building.
   Repeated component patterns: section intro plus three `MarketingSurface` cards.
   Likely source component/file: inline composition in [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx), [components/ui/SectionIntro.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/SectionIntro.tsx), [components/ui/MarketingSurface.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/MarketingSurface.tsx).
   Assessment: essential; trust claims are still mostly self-asserted rather than externally validated.

4. Problem framing + fit checklist
   Visible copy hierarchy: `The problem`, title `The registry is not the hard part. Making confident decisions is.`, three friction cards, adjacent checklist surface `This is for you if`.
   Approximate role in funnel: pain articulation and self-qualification.
   Type: educational / empathy / conversion pre-work.
   Repeated component patterns: split two-column section, small cards, checklist.
   Likely source component/file: inline in [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx), [components/ui/CheckIcon.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/CheckIcon.tsx).
   Assessment: essential; good bridge from authority to need state.

5. Process preview
   Visible copy hierarchy: `How it works`, title `A clear path from the first conversation to a more confident plan.`, three process cards, CTA to `/how-it-works`.
   Approximate role in funnel: process simplification.
   Type: educational / conversion.
   Repeated component patterns: numbered cards on `MarketingSurface`.
   Likely source component/file: inline in [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx).
   Assessment: useful, but conceptually overlaps the dedicated `/how-it-works` page.

6. Services preview
   Visible copy hierarchy: `Services preview`, title `Curated support for registries, gear, safety, and home prep.`, CTA to `/services`, four pillar cards.
   Approximate role in funnel: offer preview.
   Type: service explanation / conversion.
   Repeated component patterns: `AddonServiceShowcase` with pillar-card variant.
   Likely source component/file: [components/services/AddonServiceShowcase.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/AddonServiceShowcase.tsx), [components/services/AddonServiceCard.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/AddonServiceCard.tsx).
   Assessment: essential, but largely duplicated by `/services`.

7. Method section
   Visible copy hierarchy: eyebrow `The Taylor-Made Method`, title `Not louder. Just more useful.`, left quote card, right three method cards.
   Approximate role in funnel: philosophy articulation.
   Type: authority / differentiation.
   Repeated component patterns: quote card plus numbered horizontal cards.
   Likely source component/file: inline in [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx).
   Assessment: strong positioning, though some of the same language appears on `/about`.

8. Support levels / package cards
   Visible copy hierarchy: `Support levels`, title `Choose the level of planning support that fits.`, three package cards, small text link to `/consultation`.
   Approximate role in funnel: package selection.
   Type: conversion.
   Repeated component patterns: `PlanningPackageCards`.
   Likely source component/file: [components/services/PlanningPackageCards.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/PlanningPackageCards.tsx).
   Assessment: essential to the current services-first funnel, but repeated again on `/services`.

9. Journal preview
   Visible copy hierarchy: `From the Journal`, title `Educational guidance that reinforces expertise between consultations.`, CTA to `/blog`, 3 article cards.
   Approximate role in funnel: authority expansion.
   Type: educational / trust-building.
   Repeated component patterns: `JournalCard`.
   Likely source component/file: [components/blog/JournalCard.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/JournalCard.tsx).
   Assessment: strategically important, but thin because the live content library is small and all current posts are in one category.

10. Testimonials + founder proof
   Visible copy hierarchy: `From families`, testimonial cards, adjacent `Meet Taylor` founder card with trust bullets and partner logos.
   Approximate role in funnel: social proof and founder credibility.
   Type: trust-building.
   Repeated component patterns: custom testimonial card and founder card.
   Likely source component/file: inline in [app/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/page.tsx).
   Assessment: essential; limited by only two testimonials and light proof detail.

11. Final CTA band
   Visible copy hierarchy: `Ready when you are`, title `Request your consultation before the list gets louder.`, CTA button, note `Complimentary 45-minute consultation`.
   Approximate role in funnel: close.
   Type: conversion.
   Repeated component patterns: sitewide `FinalCTA`.
   Likely source component/file: [components/layout/FinalCTA.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/layout/FinalCTA.tsx).
   Assessment: essential; repeated heavily sitewide.

12. Footer
   Visible copy hierarchy: support descriptor, email, Instagram, copyright, footer nav including `About`.
   Approximate role in funnel: support navigation and soft trust.
   Type: navigation / trust.
   Repeated component patterns: global footer.
   Likely source component/file: [components/Footer.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/Footer.tsx).
   Assessment: essential; `About` is only consistently accessible here, not in header.

## PAGE: /about

Source: [app/about/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/about/page.tsx)

Purpose: founder credibility and philosophy.
Current positioning role: authority-through-founder story.
Primary CTA: `Book a Complimentary Consultation` linking to `/contact`.
Secondary CTA: none.
Visual tone: editorial founder portrait, long-form narrative, airy white/ivory sections.
Observed issues / notes: strong voice and story, but CTA path differs from homepage; page leans founder-led consultant more than scalable authority brand.

Section order:
1. Header / nav
   Role: global navigation.
   Pattern: global header.
   Assessment: essential; `About` page itself is not in primary nav.

2. Hero
   Visible copy hierarchy: `Meet Taylor`, headline `A Baby Gear Expert for the Real-Life Details of Early Parenthood`, short subhead, CTA.
   Funnel role: establish trust fast.
   Type: authority / conversion.
   Pattern: Hero with custom copy.
   Source: [components/ui/Hero.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/Hero.tsx).
   Assessment: essential.

3. Founder story and expertise section
   Visible copy hierarchy: portrait image, H2 `A Baby Gear Expert in the Details`, multiple narrative paragraphs, bold subheading `What I Help Families Choose`, checklist of categories.
   Funnel role: deepen credibility.
   Type: authority / trust-building.
   Pattern: two-column image-text split, checklist.
   Source: [app/about/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/about/page.tsx), [lib/marketing/copy.ts](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/lib/marketing/copy.ts).
   Assessment: essential; long, text-heavy, and highly consultant-personal.

4. Taylor-Made Approach
   Visible copy hierarchy: H2 `The Taylor-Made Approach`, three stacked statements, body copy on fit over noise.
   Funnel role: philosophy framing.
   Type: educational / differentiation.
   Pattern: centered narrative section.
   Source: [app/about/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/about/page.tsx).
   Assessment: useful but overlaps homepage method language.

5. What Makes This Different
   Visible copy hierarchy: H2 `What Makes This Different`, contrast statements, narrative explanation, closing lines `Not louder. Just more useful.`
   Funnel role: differentiate from generic product-first advice.
   Type: authority / differentiation.
   Pattern: centered long-form copy.
   Source: [app/about/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/about/page.tsx).
   Assessment: useful, but also duplicates homepage framing.

6. Partner logo strip
   Visible copy hierarchy: `Trusted retail and service partners.`, one visible Albee Baby logo.
   Funnel role: proof.
   Type: trust-building.
   Pattern: centered logo strip.
   Source: [app/about/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/about/page.tsx).
   Assessment: weak; the heading implies broader proof than the current single-logo output delivers.

7. Final CTA
   Funnel role: conversion close.
   Pattern: global FinalCTA.
   Assessment: essential.

8. Footer
   Funnel role: support navigation.
   Pattern: global footer.
   Assessment: essential.

## PAGE: /services

Source: [app/services/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/services/page.tsx)

Purpose: full service catalog and package selection.
Current positioning role: service-first explainer.
Primary CTA: `Request a Consultation` in hero; package CTAs route to `/contact?service=...`.
Secondary CTA: external `Book Target Baby Concierge`, internal `Ask About Store Visit Prep`, and final consultation CTA.
Visual tone: card-heavy, structured, blush-and-ivory luxury grid system.
Observed issues / notes: most exhaustive page in the marketing layer; useful for inventory, but structurally long and message-dense with several repeated frameworks.

Section order:
1. Header / nav
   Role: global orientation.
   Pattern: global header.
   Assessment: essential.

2. Hero
   Visible copy hierarchy: headline `Thoughtful Support for Every Stage of Baby Preparation`, body copy, CTA to `/contact`.
   Funnel role: service orientation.
   Type: conversion.
   Pattern: Hero.
   Source: [components/ui/Hero.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/Hero.tsx).
   Assessment: essential; CTA destination differs from homepage and FinalCTA.

3. Choose Your Support
   Visible copy hierarchy: section intro plus `PlanningPackageCards` for Focused Session, Signature Package, Concierge Experience.
   Funnel role: package selection.
   Type: conversion.
   Pattern: repeated package cards.
   Source: [components/services/PlanningPackageCards.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/PlanningPackageCards.tsx).
   Assessment: essential; duplicate of homepage package block.

4. What Is Included in Every Package
   Visible copy hierarchy: section intro and 3 inclusion cards for stroller/car seat, registry strategy, nursery layout.
   Funnel role: outcome clarification.
   Type: educational / conversion support.
   Pattern: 3-card grid on `MarketingSurface`.
   Source: [app/services/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/services/page.tsx).
   Assessment: useful.

5. Retailer Expertise & Partnerships
   Visible copy hierarchy: intro plus two large cards for Target Baby Concierge and NYC Store Visit Prep.
   Funnel role: proof plus alternate acquisition path.
   Type: trust-building / conversion.
   Pattern: large image cards with checklist and CTA.
   Source: [app/services/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/services/page.tsx).
   Assessment: mixed; differentiating, but introduces offsite leakage and keeps retailer expertise close to the core offer.

6. A Thoughtful Path to Preparation
   Visible copy hierarchy: section intro plus 3 method cards, `Registry Clarity`, `Home & Nursery Preparation`, `Intentional Gear Planning`.
   Funnel role: explain service flow.
   Type: educational / conversion support.
   Pattern: numbered 3-card grid.
   Source: [app/services/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/services/page.tsx).
   Assessment: useful, but overlaps homepage and `/how-it-works`.

7. Optional Add-On Support intro
   Visible copy hierarchy: eyebrow and H2 both `Optional Add-On Support`, body copy.
   Funnel role: expand scope.
   Type: service expansion.
   Pattern: centered section intro.
   Source: [app/services/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/services/page.tsx).
   Assessment: necessary for page setup; duplicate eyebrow and heading feel redundant.

8. Add-on group: Planning & Strategy
   Visible copy hierarchy: group title and description, then cards for Registry Clarity, Intentional Gear Planning, Intentional Purchasing Timeline, Grandparents Planning Session, Surrogacy & Adoption Planning Support.
   Funnel role: service expansion.
   Type: conversion / service catalog.
   Pattern: `AddonServiceGroup` plus `AddonServiceShowcase`.
   Source: [components/services/AddonServiceGroup.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/AddonServiceGroup.tsx), [data/serviceAddons.ts](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/data/serviceAddons.ts).
   Assessment: useful inventory, but broadens scope substantially.

9. Add-on group: Home & Safety Preparation
   Visible copy hierarchy: title and description, then cards for Home & Nursery Preparation, Gear Cleaning & Reset Strategy, CPST Installation & Safety Checks, In-Home Baby & Toddler Proofing Installation, Sibling & Pet Preparation.
   Funnel role: service expansion.
   Type: conversion / service catalog.
   Pattern: same as above.
   Assessment: useful inventory; partner-based offers strengthen trust but also create scope sprawl.

10. Add-on group: Family & Caregiver Support
   Visible copy hierarchy: title and description, then cards for Nanny Interview Preparation, Virtual Parent Community Sessions, Phoenix Parent Circles.
   Funnel role: scope expansion beyond core baby gear advisor positioning.
   Type: service catalog.
   Pattern: same as above.
   Assessment: currently weak for positioning discipline; moves away from the clearest authority lane.

11. Add-on group: Optional Celebration Support
   Visible copy hierarchy: title and description, then cards for Shower Registry Support, Gender Reveal Support, Post-Baby Gathering Support, Welcome Box Registration Setup, Birth Announcements, Birthday Parties.
   Funnel role: incremental upsell.
   Type: service catalog.
   Pattern: same as above.
   Assessment: least aligned with future authority positioning; broadens the offer into event/lifestyle support.

12. Common Questions
   Visible copy hierarchy: H2 `Common Questions`, short body, FAQ accordion with 3 questions.
   Funnel role: objection handling.
   Type: trust / conversion support.
   Pattern: `FAQAccordion`.
   Source: [components/faq/FAQAccordion.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/faq/FAQAccordion.tsx).
   Assessment: useful but duplicative of `/faq`.

13. Final CTA
   Visible copy hierarchy: `Start Your Baby Preparation With Confidence`, short description, CTA `Schedule Your Consultation`.
   Funnel role: close.
   Type: conversion.
   Pattern: FinalCTA variant.
   Assessment: essential.

14. Footer
   Pattern: global footer.
   Assessment: essential.

## PAGE: /how-it-works

Source: [app/how-it-works/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/how-it-works/page.tsx)

Purpose: explain the process and capture consultation requests.
Current positioning role: process page with strongest in-page conversion.
Primary CTA: `Schedule Your Complimentary Consultation`.
Secondary CTA: internal anchors back to the embedded form.
Visual tone: process-oriented, structured, softer utility than homepage.
Observed issues / notes: clear handoff to conversion; still anchored in complimentary consultation language and partially framed through the Target Baby Concierge program.

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Hero
   Visible copy hierarchy: H1 `How Baby Planning with Taylor-Made Baby Co. Works`, short body, CTA to `#free-consultation`.
   Funnel role: orient and drive to embedded form.
   Type: educational / conversion.
   Pattern: Hero.
   Assessment: essential.

3. Complimentary consultation split section
   Visible copy hierarchy: left column has `Complimentary Consultation`, H2 `Free 1:1 Consultation (30 Minutes)`, explanatory body and checklist; right column has `Start Here`, H3 `Request your consultation`, embedded consultation form.
   Funnel role: strongest current process-to-form handoff.
   Type: educational / conversion.
   Pattern: split content + `ConsultationRequestForm`.
   Source: [components/contact/ConsultationRequestForm.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/contact/ConsultationRequestForm.tsx), [components/analytics/HowItWorksAnalytics.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/analytics/HowItWorksAnalytics.tsx).
   Assessment: essential and strongest conversion section outside the homepage hero.

4. A Calm, Guided Path
   Visible copy hierarchy: H2 plus 3 process cards, `Start with a Conversation`, `Design Your Plan`, `Prepare with Confidence`.
   Funnel role: process explanation.
   Type: educational.
   Pattern: 3-card grid.
   Assessment: useful; overlaps homepage and services process language.

5. What Families Gain from the Process
   Visible copy hierarchy: H2 plus 5 benefit cards with accordions for registry clarity, purchasing decisions, nursery layout, confidence in gear, preparation that fits your life.
   Funnel role: benefits articulation.
   Type: educational / conversion support.
   Pattern: icon cards plus `LuxuryAccordion`.
   Source: [components/ui/LuxuryAccordion.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/LuxuryAccordion.tsx).
   Assessment: useful, though accordion interaction adds one more click to read value statements.

6. Final CTA
   Visible copy hierarchy: `Start Your Baby Planning Journey`, CTA to consultation.
   Funnel role: close.
   Type: conversion.
   Pattern: FinalCTA variant.
   Assessment: essential.

7. Footer
   Pattern: global footer.
   Assessment: essential.

## PAGE: /consultation

Source: [app/consultation/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/consultation/page.tsx)

Purpose: dedicated consultation intake page.
Current positioning role: direct-response conversion page.
Primary CTA: `Submit Consultation Request`.
Secondary CTA: inline text link to `/how-it-works`.
Visual tone: stripped-down, direct, minimal.
Observed issues / notes: useful as a direct endpoint, but materially duplicates the embedded form flow on `/how-it-works`.

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Hero
   Visible copy hierarchy: H1 `Book Your Free 45-Minute Consultation`, short body.
   Funnel role: conversion framing.
   Type: conversion.
   Pattern: Hero.
   Assessment: essential; duration here is 45 minutes, while `/how-it-works` says 30 minutes.

3. Form surface
   Visible copy hierarchy: consultation form, note `Prefer to read the process first? View How It Works`.
   Funnel role: direct conversion.
   Type: conversion.
   Pattern: `ConsultationRequestForm` inside `MarketingSurface`.
   Assessment: essential; duplicate intake path.

4. Footer
   Pattern: global footer.
   Assessment: essential.

## PAGE: /consultation/confirmation

Source: [app/consultation/confirmation/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/consultation/confirmation/page.tsx)

Purpose: confirmation after consultation request submission.
Current positioning role: utility state.
Primary CTA: `Return Home`.
Secondary CTA: `Back to How It Works`.
Visual tone: minimal and functional.
Observed issues / notes: useful, but thin; no next-step expectation-setting beyond "Taylor will respond shortly."

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Confirmation card
   Visible copy hierarchy: H1 `Request Received`, supporting sentence, 2 CTA buttons.
   Funnel role: post-conversion reassurance.
   Type: utility / conversion recovery.
   Pattern: single `MarketingSurface`.
   Assessment: essential but underdeveloped.

3. Footer
   Pattern: global footer.
   Assessment: essential.

## PAGE: /contact

Source: [app/contact/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/contact/page.tsx)

Purpose: general contact and service-specific inquiry intake.
Current positioning role: secondary conversion page.
Primary CTA: `Submit Inquiry`.
Secondary CTA: Final CTA to `/consultation`.
Visual tone: simple form-first page.
Observed issues / notes: important branch in the current funnel; creates a parallel intake path separate from consultation requests.

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Hero
   Visible copy hierarchy: H1 `Get in Touch`, subhead about registry, gear, nursery, and home prep.
   Funnel role: orient for general inquiry.
   Type: conversion.
   Pattern: Hero.
   Assessment: essential.

3. Contact form surface
   Visible copy hierarchy: optional selected-service pill, dynamic inquiry form fields based on query param.
   Funnel role: capture service-specific lead detail.
   Type: conversion.
   Pattern: `ContactInquiryForm`.
   Source: [components/contact/ContactInquiryForm.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/contact/ContactInquiryForm.tsx).
   Assessment: essential; flexible, but it creates a separate conversion system from the consultation form.

4. Final CTA
   Funnel role: secondary conversion push.
   Type: conversion.
   Pattern: global FinalCTA.
   Assessment: slightly circular because the page already is a conversion page.

5. Footer
   Pattern: global footer.
   Assessment: essential.

## PAGE: /faq

Source: [app/faq/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/faq/page.tsx)

Purpose: answer objections and explain service mechanics.
Current positioning role: objection-handling page.
Primary CTA: Final CTA to consultation.
Secondary CTA: none in hero.
Visual tone: calm, spare, text-first.
Observed issues / notes: informative, but uses older positioning language such as `Private Planning Services`, `white-glove`, and `Brand-Trained Expertise`.

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Hero
   Visible copy hierarchy: H1 `Frequently Asked Questions`, short subhead `A little clarity before we begin.`, tertiary line `Baby Gear Specialist · Brand-Trained Expertise · Private Planning for Modern Families`.
   Funnel role: objection handling.
   Type: trust / education.
   Pattern: Hero.
   Assessment: essential; copy leans more consultant/luxury-service than advisor/authority brand.

3. FAQ group: Complimentary Consultation
   Visible copy hierarchy: H2 and accordion with 8 questions.
   Funnel role: reduce first-step friction.
   Type: educational / trust-building.
   Pattern: `FAQAccordion`.
   Assessment: essential.

4. FAQ group: After the Consultation
   Visible copy hierarchy: H2 and accordion with 3 questions.
   Funnel role: explain post-consultation path.
   Type: educational / trust-building.
   Pattern: `FAQAccordion`.
   Assessment: useful.

5. FAQ group: Private Planning Services
   Visible copy hierarchy: H2 and accordion with 6 questions.
   Funnel role: service objection handling.
   Type: educational / conversion support.
   Pattern: `FAQAccordion`.
   Assessment: useful, but the terminology drifts from the newer "baby preparation" framing.

6. Final CTA
   Pattern: global FinalCTA.
   Assessment: essential.

7. Footer
   Pattern: global footer.
   Assessment: essential.

## PAGE: /blog

Source: [app/blog/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/blog/page.tsx), [components/blog/BlogIndexView.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/BlogIndexView.tsx)

Purpose: educational index.
Current positioning role: authority layer.
Primary CTA: click into articles.
Secondary CTA: Final CTA to consultation.
Visual tone: blog-specific ivory/blush editorial system distinct from the rest of the marketing site.
Observed issues / notes: technically solid, but current live library is very small and concentrated in a single category.

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Hero
   Visible copy hierarchy: H1 `Baby Prep Guides`, short explanatory body.
   Funnel role: position the journal as educational layer.
   Type: educational / authority.
   Pattern: Hero.
   Assessment: essential.

3. Category filter bar
   Visible copy hierarchy: `All Guides` plus 5 category buttons.
   Funnel role: content discovery.
   Type: educational navigation.
   Pattern: client-side filter bar with horizontal mobile scroll.
   Source: [components/blog/BlogIndexView.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/BlogIndexView.tsx).
   Assessment: useful, but 4 of 5 categories are currently empty.

4. Journal grid / empty state
   Visible copy hierarchy: article cards or empty-state surface.
   Funnel role: content browsing.
   Type: educational / authority.
   Pattern: `JournalCard` grid.
   Assessment: essential; because all live posts lack cover images, cards fall back to the placeholder image.

5. Final CTA
   Pattern: global FinalCTA.
   Assessment: useful but generic.

6. Footer
   Pattern: global footer.
   Assessment: essential.

## PAGE: /blog/[slug]

Source: [app/blog/[slug]/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/blog/[slug]/page.tsx), [components/blog/PostArticleView.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/PostArticleView.tsx), [components/blog/TMBCBlogTemplate.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/TMBCBlogTemplate.tsx), [components/blog/PostContent.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/PostContent.tsx)

Purpose: article detail page.
Current positioning role: authority content template.
Primary CTA: depends on content; currently Final CTA at page bottom is the main one.
Secondary CTA: related post cards and share bar.
Visual tone: editorial long-form with custom blog tokens, serif headlines, soft cards, and blush divider system.
Observed issues / notes: template is more advanced than the current content set. Live articles are plain text guides with no images, inline CTA buttons, resources, affiliate blocks, product cards, or pull quotes.

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Article hero
   Visible copy hierarchy: category tag, H1 title, subtitle from deck or excerpt, author/date/reading time metadata, divider.
   Funnel role: authority framing.
   Type: educational / trust-building.
   Pattern: `TMBCBlogTemplate` hero.
   Assessment: essential.

3. Featured image
   Visible copy hierarchy: optional large image below hero.
   Funnel role: visual support.
   Type: decorative / editorial.
   Pattern: conditional image block.
   Assessment: currently absent on all 3 live posts.

4. Affiliate disclosure
   Visible copy hierarchy: simple disclosure card if affiliate brands or CTA partners exist.
   Funnel role: compliance / trust.
   Type: trust-building.
   Pattern: conditional `AffiliateDisclosure`.
   Assessment: currently absent on all 3 live posts.

5. Article body
   Visible copy hierarchy: long-form article with H2/H3, paragraphs, divider insertion between H2 sections, support for quotes, styled blocks, product cards, resources, image figures, lists, and CTA buttons.
   Funnel role: education.
   Type: authority / educational.
   Pattern: markdown-like parser in `PostContent`.
   Assessment: essential; current live posts are simple 4-section text articles with no enhanced content modules.

6. Downloadable resource block
   Pattern: conditional `MarketingSurface`.
   Assessment: currently absent.

7. Image gallery
   Pattern: optional media gallery.
   Assessment: currently absent.

8. Affiliate CTA / Gear Picks section
   Pattern: optional brand partner block and affiliate CTAs.
   Assessment: currently absent.

9. Share section
   Visible copy hierarchy: `Share This Guide` with Pinterest, Instagram, Twitter, Reddit, Email, and Copy Link actions.
   Funnel role: reach extension.
   Type: authority distribution.
   Pattern: `BlogShareBar`.
   Assessment: useful, though it is more distribution-oriented than conversion-oriented.

10. Related posts
   Visible copy hierarchy: `Continue Reading`, `More Baby Prep Guides`, 3 related cards.
   Funnel role: keep users in the education layer.
   Type: authority / retention.
   Pattern: `JournalCard` grid.
   Assessment: useful.

11. Final CTA
   Pattern: global FinalCTA.
   Assessment: currently the main monetization handoff for live blog posts.

12. Footer
   Pattern: global footer.
   Assessment: essential.

Current live article notes:
- All 3 live posts sit in `Registry Strategy`, despite the 5-category taxonomy.
- All 3 live posts currently render without featured imagery, so the index and related cards use the placeholder image.
- All 3 live posts are text-led with 4 H2 sections each and no advanced article blocks active.

## PAGE: /blog/author/[slug]

Source: [app/blog/author/[slug]/page.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/app/blog/author/[slug]/page.tsx)

Purpose: author archive.
Current positioning role: supporting trust page for writers.
Primary CTA: article cards and Final CTA.
Secondary CTA: none.
Visual tone: simple and utility-oriented compared to the article pages.
Observed issues / notes: current live author is `Admin` with no bio and no expertise chips, which weakens authority signaling.

Section order:
1. Header / nav
   Pattern: global header.
   Assessment: essential.

2. Author hero
   Visible copy hierarchy: `Author`, author name, bio or fallback copy, optional expertise chips, avatar or initial fallback.
   Funnel role: trust / authorship.
   Type: authority support.
   Pattern: custom two-column author header.
   Assessment: useful, but currently weak in its live state.

3. Article grid / empty state
   Visible copy hierarchy: `Articles`, H2 `Guides by [Author]`, article grid or empty state.
   Funnel role: content browsing.
   Type: educational / authority.
   Pattern: `JournalCard` grid.
   Assessment: useful.

4. Final CTA
   Pattern: global FinalCTA.
   Assessment: generic.

5. Footer
   Pattern: global footer.
   Assessment: essential.

# 3. GLOBAL COMPONENT INVENTORY

- Header / Navbar
  Where it appears: every `SiteShell` page.
  Variants: 1 active desktop/mobile pair.
  What it is trying to do: consistent navigation and brand anchor.
  Likely unification need later: add a persistent conversion CTA and decide whether `About` and `Consultation` belong in primary nav.
  Source: [components/Header.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/Header.tsx)

- Footer
  Where it appears: every `SiteShell` page.
  Variants: 1 active variant with a minor home-page class adjustment.
  What it is trying to do: support navigation, soft trust, contact access.
  Likely unification need later: probably keep as one system; refine content hierarchy.
  Source: [components/Footer.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/Footer.tsx)

- Hero
  Where it appears: all core marketing pages and blog index.
  Variants: one base component with per-page custom children and imagery.
  What it is trying to do: establish mood, headline hierarchy, and CTA orientation.
  Likely unification need later: yes; headline scale and CTA behavior are consistent, but messaging intent varies heavily page to page.
  Source: [components/ui/Hero.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/Hero.tsx)

- Ribbon divider
  Where it appears: below Hero by default.
  Variants: 1.
  What it is trying to do: create a signature editorial transition from hero to content.
  Likely unification need later: probably keep; it is one of the strongest visual signatures.
  Source: [components/layout/RibbonDivider.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/layout/RibbonDivider.tsx)

- MarketingSection wrapper
  Where it appears: most marketing pages.
  Variants: tone variants `white`, `ivory`, `blush`, `neutral`, `ivoryWarm`; spacing variants `tight`, `default`, `spacious`.
  What it is trying to do: normalize section spacing and container widths.
  Likely unification need later: yes; current page-specific spacing hooks exist in CSS but are mostly unused.
  Source: [components/layout/MarketingSection.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/layout/MarketingSection.tsx)

- Final CTA
  Where it appears: homepage, about, services, how-it-works, contact, faq, blog index, blog article, author page.
  Variants: 1 base component with copy overrides.
  What it is trying to do: close most pages with the same consultation ask.
  Likely unification need later: yes; active everywhere, but overused enough that it becomes generic.
  Source: [components/layout/FinalCTA.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/layout/FinalCTA.tsx)

- SectionIntro + SectionDivider
  Where it appears: heavily on homepage and services/how-it-works.
  Variants: alignment and width variants.
  What it is trying to do: provide a consistent section-heading system.
  Likely unification need later: keep as a foundation; it is one of the most reusable patterns already.
  Source: [components/ui/SectionIntro.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/SectionIntro.tsx), [components/ui/SectionDivider.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/SectionDivider.tsx)

- MarketingSurface
  Where it appears: almost every card-based section.
  Variants: one base shell with page-specific class overrides.
  What it is trying to do: create the consistent rounded-card luxury surface.
  Likely unification need later: keep; it is already the dominant card primitive.
  Source: [components/ui/MarketingSurface.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/MarketingSurface.tsx)

- AuthorityStrip
  Where it appears: homepage hero only.
  Variants: 1.
  What it is trying to do: compress service scope into chip-like authority claims.
  Likely unification need later: likely; it works as a useful pattern but is underused.
  Source: [components/ui/AuthorityStrip.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/AuthorityStrip.tsx)

- PlanningPackageCards
  Where it appears: homepage and services page.
  Variants: 1 active package set with one featured card.
  What it is trying to do: present support tiers and drive service-specific inquiry.
  Likely unification need later: yes; same component already reused on multiple pages.
  Source: [components/services/PlanningPackageCards.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/PlanningPackageCards.tsx)

- AddonServiceCard / AddonServiceShowcase / AddonServiceGroup
  Where it appears: homepage preview and services page full catalog.
  Variants: pillar-card preview variant and default add-on variant.
  What it is trying to do: expose service pillars and expand into long-tail support offers.
  Likely unification need later: yes; likely needs scope discipline before visual unification.
  Source: [components/services/AddonServiceCard.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/AddonServiceCard.tsx), [components/services/AddonServiceShowcase.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/AddonServiceShowcase.tsx), [components/services/AddonServiceGroup.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/services/AddonServiceGroup.tsx)

- FAQAccordion
  Where it appears: services and faq page.
  Variants: 1 accordion style.
  What it is trying to do: collapse objection-handling copy.
  Likely unification need later: keep; already shared.
  Source: [components/faq/FAQAccordion.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/faq/FAQAccordion.tsx)

- ConsultationRequestForm
  Where it appears: `/how-it-works` and `/consultation`.
  Variants: same form, customizable return/success paths.
  What it is trying to do: convert intent into a consultation request.
  Likely unification need later: yes; decide whether a standalone page, embedded page, or both are necessary.
  Source: [components/contact/ConsultationRequestForm.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/contact/ConsultationRequestForm.tsx)

- ContactInquiryForm
  Where it appears: `/contact`.
  Variants: one form with query-driven field sets by service.
  What it is trying to do: capture more detailed, service-specific lead data.
  Likely unification need later: maybe; it is structurally separate from consultation intake and may need funnel consolidation.
  Source: [components/contact/ContactInquiryForm.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/contact/ContactInquiryForm.tsx)

- ServiceIconBadge / PartnerBrandMark / icon frame system
  Where it appears: trust cards, service cards, benefit cards, footer social, FAQ icons.
  Variants: `default`, `addon`, `card`.
  What it is trying to do: create a luxury-icon visual signature.
  Likely unification need later: keep, but use more selectively; it is heavily repeated.
  Source: [components/ui/ServiceIconBadge.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/ServiceIconBadge.tsx), [components/ui/PartnerBrandMark.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/ui/PartnerBrandMark.tsx)

- JournalCard / BlogCard
  Where it appears: homepage journal preview, blog index, related posts, author archive.
  Variants: one core card.
  What it is trying to do: surface articles in an editorial card layout.
  Likely unification need later: keep; current issue is content depth, not card structure.
  Source: [components/blog/BlogCard.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/BlogCard.tsx), [components/blog/JournalCard.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/JournalCard.tsx)

- BlogCardActions
  Where it appears: every blog card.
  Variants: share/save buttons.
  What it is trying to do: encourage save/share behavior.
  Likely unification need later: maybe remove or rethink; it is more content-product behavior than service conversion behavior.
  Source: [components/blog/BlogCardActions.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/BlogCardActions.tsx)

- TMBCBlogTemplate
  Where it appears: every article page.
  Variants: 1 base template with optional featured image, disclosure, resource, gallery, affiliate CTA, share, related posts.
  What it is trying to do: create a consistent editorial container.
  Likely unification need later: keep; it is one of the stronger systemized pieces.
  Source: [components/blog/TMBCBlogTemplate.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/TMBCBlogTemplate.tsx)

- BlogShareBar
  Where it appears: article pages.
  Variants: 1.
  What it is trying to do: encourage guide sharing and content distribution.
  Likely unification need later: keep only if content distribution remains a strategic priority.
  Source: [components/blog/BlogShareBar.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/BlogShareBar.tsx)

- AffiliateDisclosure / BlogAffiliateCTA / ProductRecommendationCard / styled article blocks
  Where it appears: article template and content renderer when article content uses those modules.
  Variants: multiple optional article-specific modules.
  What it is trying to do: support monetized and enhanced editorial content.
  Likely unification need later: current issue is not component fragmentation; it is underuse. The live article set does not currently activate most of this system.
  Source: [components/blog/AffiliateDisclosure.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/AffiliateDisclosure.tsx), [components/blog/BlogAffiliateCTA.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/BlogAffiliateCTA.tsx), [components/blog/ProductRecommendationCard.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/ProductRecommendationCard.tsx), [components/blog/PostContent.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/PostContent.tsx)

- BlogSoftCTA
  Where it appears: nowhere active.
  Variants: 1 inactive component.
  What it is trying to do: provide a softer in-article consultation handoff.
  Likely unification need later: likely worth evaluating because current live articles lack stronger in-content conversion bridges.
  Source: [components/blog/BlogSoftCTA.tsx](/Users/taylorvanderwolk/Desktop/code/registrywithtaylor/components/blog/BlogSoftCTA.tsx)

# 4. CURRENT CONTENT HIERARCHY AUDIT

What the brand currently appears to be:
- A high-touch baby registry and gear consultant with concierge overtones.
- A founder-led expert service brand that is trying to grow into a broader advisor/authority role.
- Not yet a fully developed education-first authority platform.

How it reads today:
- Strongest reading: consultant / concierge with expert retail knowledge.
- Secondary reading: educational guide brand, mostly via the homepage journal preview and blog system.
- Weaker reading: affiliate site. The affiliate infrastructure exists, but the live content does not currently foreground it.

Which pages are strongest:
- `/` because it does the best job combining authority, pain framing, services, trust, and multiple next steps.
- `/how-it-works` because it clearly explains the process and embeds the form directly in-context.
- `/about` because it gives the founder voice and rationale behind the service.

Which pages dilute the positioning:
- `/services` because the long-tail add-ons pull the brand into family support, celebration support, and event-adjacent territory.
- `/faq` because terminology such as `Private Planning Services`, `white-glove`, and `Brand-Trained Expertise` signals a more premium-consultant framing than advisor-authority framing.
- `/blog/author/admin` because the live author identity is generic rather than brand-credible.

Where the message changes or becomes inconsistent:
- Consultation duration changes from 30 minutes on `/how-it-works` to 45 minutes on `/consultation`.
- CTAs split between `/consultation` and `/contact`, depending on page and component.
- Positioning nouns vary across the site: `baby planning guidance`, `baby gear expert`, `registry consultant`, `private planning`, `concierge guidance`, `Target Baby Concierge`.
- Service scope ranges from core advisor territory to broader event and family-support territory.

Where the site leads with services vs education vs proof:
- Services lead on `/services`, the homepage package sections, and the contact-service flow.
- Education leads on `/blog`, article pages, and partially the homepage process and journal sections.
- Proof is present, but lighter than the service emphasis. Trust signals are mostly founder claims, partner logos, and two testimonials rather than deep case-study proof.

Specific assessment of the current flow:
- The current site is closer to `A. services -> explanation -> consultation` than `B. authority -> education -> consultation`.
- The homepage is trying to move toward `authority -> education -> consultation`.
- The broader system still resolves to service selection or consultation before the authority layer has enough depth to carry the brand on its own.

# 5. VISUAL / UX PATTERN AUDIT

- Spacing rhythm
  Current standard spacing is systemized in CSS: `section-tight` at 3rem mobile / 5rem desktop, `section-base` at 4.25rem mobile / 7rem desktop, and `section-spacious` at 5.25rem mobile / 8.5rem desktop.
  Result: consistent vertical rhythm across most pages, especially homepage, services, and how-it-works.

- Background alternation
  The marketing site alternates primarily between white, ivory, and blush sections.
  Result: clear banding, though some pages become visually repetitive because many sections use the same white-card-on-soft-background language.

- Typography hierarchy
  Playfair Display is the dominant headline font, Inter is the body font, and Cormorant appears mainly in blog pull quotes.
  Result: editorial-luxury tone with strong H1/H2 hierarchy and uppercase eyebrow labels.

- Card styling
  Rounded 20px to 32px corners, rose-tinted borders, soft shadows, hover lift, and white-to-pink gradient fills dominate.
  Result: coherent premium system, but cards are used so often that some sections start to feel interchangeable.

- CTA styling
  Primary buttons are rounded pink pills; secondary buttons are pale white/rose pills.
  Result: visually consistent. The UX inconsistency is not button style, but destination choice.

- Image usage
  Heroes use full-bleed editorial/lifestyle images.
  Services page uses retailer/store imagery in the partnership cards.
  About uses a founder portrait.
  Blog cards fall back to a placeholder for all current live posts because no cover images are set.

- Trust signal placement
  Homepage places trust early through the proof strip and later through testimonials/founder proof.
  About places founder credibility centrally.
  Services places partnership proof mid-page.
  FAQ provides process reassurance, but not much concrete proof.
  Result: trust exists, but is unevenly distributed.

- Mobile / desktop assumptions visible in code
  Header collapses to a hamburger under `md`.
  Hero content recenters and becomes fully stacked on small screens.
  Blog category filters become horizontally scrollable on mobile.
  Card grids collapse responsibly from 3 to 1 columns.
  Result: responsive intent is visible and generally well handled.

- Luxury / editorial motifs
  Ribbon divider, blush gradients, serif headlines, icon frames, soft-glow surfaces, and pale neutrals are the main recurring motifs.
  Result: the site feels intentionally styled rather than generic.

- Visual inconsistencies
  Blog pages use their own token system and feel like a sibling brand surface rather than a perfectly integrated extension of the core marketing pages.
  About is more narrative and sparse than the more modular homepage/services pages.
  Consultation confirmation is materially plainer than the rest of the site.

- Overused patterns
  Repeated card grids.
  Repeated Final CTA band.
  Repeated process-step frameworks.
  Repeated "what to buy, what to skip, what can wait" style framing.

- Underdeveloped patterns
  Deeper proof systems such as case studies, founder credentials, before/after frameworks, and richer article visuals.
  Educational entry-point design beyond the basic article grid.

# 6. CONVERSION PATH AUDIT

Strongest current conversion paths:
- `/` -> `/consultation`
  Strong because the homepage hero leads directly there and the page closes with the same ask.

- `/how-it-works` -> embedded consultation form -> `/consultation/confirmation`
  Strong because explanation and form are on the same page.

- `/` -> `/services` -> `/contact?service=...`
  Strong for users already shopping for support levels.

- `/services` -> Target Baby Concierge external booking
  Strong for that partner path, but it takes the user off the TMBC funnel.

Secondary current conversion paths:
- `/about` -> `/contact`
- `/faq` -> Final CTA -> `/consultation`
- `/blog` -> article -> Final CTA -> `/consultation`
- footer nav -> `/contact`

Dead ends or soft dead ends:
- `/consultation/confirmation`
  Clear utility page, but low momentum after submission.

- `/blog/author/admin`
  Useful as an archive, but weak for trust because the author identity is generic.

- Empty blog categories
  Category filters currently route users into empty-state experiences for 4 of 5 categories.

Weak transitions:
- `About` goes to `/contact`, not to the clearer consultation path.
- `Services` uses `/contact?service=...` rather than a more unified consultation-first flow.
- Blog articles rely on the sitewide Final CTA instead of stronger in-article authority-to-consultation handoffs.

Missing handoffs:
- No sticky or header-level CTA to book a consultation.
- No dedicated educational bridge between blog content and service selection beyond the generic final CTA.
- No explicit handoff from FAQ answers into tailored next-step choices.

Pages with high informational value but weak monetization paths:
- `/blog`
- `/blog/[slug]`
- `/blog/author/[slug]`
- `/about`

Places where authority should be doing more work:
- Blog category breadth and live content volume.
- Founder proof and credentials on about and homepage.
- Educational framing inside services and FAQ.
- Author identity and article richness.

# 7. SEO / AUTHORITY STRUCTURE AUDIT

- Page titles / metadata patterns
  Most marketing pages use `buildMarketingMetadata`, which gives them canonical handling plus Open Graph and Twitter metadata.
  Exception: `/contact` uses a plain metadata object and does not currently use the same canonical/OG helper as the rest of the marketing pages.

- H1 patterns
  Most core pages have one clear H1 centered on baby planning, gear guidance, or process clarity.
  Result: structurally solid.

- Blog / category structure
  The taxonomy supports 5 categories:
  `Registry Strategy`, `Gear & Safety`, `Nursery & Home`, `Transitions & Family`, `Planning & Events`.
  Current live content does not use that breadth. All 3 public posts are in `Registry Strategy`.

- Educational entry points
  Present:
  `/blog`
  `/blog/[slug]`
  homepage journal preview
  FAQ as support content
  Missing:
  category archive routes
  resources hub
  topic landing pages
  glossary/checklist/tool-style authority pages

- Service-content overlap
  Registry, gear, nursery, home prep, and purchase timing appear across homepage, about, services, FAQ, and blog.
  Result: the topical territory is coherent, but the content hierarchy is not yet disciplined.

- Current likely keyword targets
  Homepage: baby gear and registry guidance.
  Services: baby prep services, registry and nursery help.
  How it works: process / consultation framing.
  Blog index: baby prep guides.
  Articles: registry strategy and adjacent prep questions.

- Blog article SEO quality
  Strong technical implementation:
  canonical support
  Open Graph/Twitter metadata
  keyword arrays
  `BlogPosting` schema
  optional `FAQPage` schema
  author schema
  Weak current content-state factors:
  no featured images on live posts
  no topic breadth across categories
  current author page is generic

- Does the current structure support becoming a `Baby Gear Advisor` / `Baby Preparation Advisor` brand?
  Partially.
  The service vocabulary and topical territory are already close.
  The authority infrastructure is not yet deep enough. The live educational layer is too narrow, the author layer is underdeveloped, and some service branches dilute the clearest advisor territory.

# 8. REDUNDANCY + REFACTOR FLAGS

## REFACTOR FLAGS

- Duplicate sections
  `PlanningPackageCards` appears on both `/` and `/services`.
  Process-step sections appear on `/`, `/how-it-works`, and `/services`.
  Founder philosophy language appears on both `/` and `/about`.
  FAQ exists as a dedicated page and a services-page subsection.
  Consultation form exists on `/how-it-works` and `/consultation`.

- Overlapping messaging
  `what to buy, what to skip, and what can wait`
  `clarity instead of overwhelm`
  `real life fit`
  `complimentary consultation`
  `registry, gear, nursery, home prep`
  These are repeated across multiple pages with only light variation.

- Repeated trust claims
  Premium retail expertise.
  Partner-backed safety support.
  Concierge-level guidance.
  Founder experience across retail / programs / private consulting.
  These claims are present, but not always supported by new proof each time they recur.

- Pages with bloated structure
  `/` because it tries to do positioning, process, services, journal, testimonials, founder trust, and close.
  `/services` because it includes package selection, outcomes, partnerships, process, 4 add-on groups, FAQ, and a final CTA.
  `/about` because it repeats philosophy and differentiation in multiple long-form sections.

- Weak components worth replacing later
  The single-logo proof strip on `/about`.
  The generic consultation confirmation page.
  The blog author page in its current `Admin` state.
  Blog card save/share actions if the core business goal is consultation rather than content-product behavior.

- Pages missing educational authority
  `/services`
  `/faq`
  `/contact`
  `/about`
  They support services well, but do not deeply reinforce the advisor/educator role.

- Pages that should likely be merged, simplified, or elevated later
  `/consultation` and the embedded consultation flow on `/how-it-works` should likely be rationalized.
  `/contact` and `/consultation` currently represent two separate intake systems.
  Long-tail service add-ons in celebration and broader family support should likely be reconsidered against the future positioning.

- Taxonomy / content misalignment
  The blog taxonomy suggests a multi-lane authority site, but the live content footprint is still one-lane.

- Unused or unclear artifacts
  Empty `app/book/` and `app/dashboard/` directories.
  Unused `BlogSoftCTA` component.
  Unused CSS hooks for `services-blueprint-section` and older page-specific section spacing classes.

# 9. FINAL CURRENT-STATE SUMMARY

What the marketing site is doing well right now:
- It has a coherent visual system with a distinct editorial-luxury tone.
- The homepage and `/how-it-works` are structurally solid and clearly communicate the service promise.
- The component system is more mature than the content system. Shared wrappers, cards, package components, FAQs, and the blog template are already reasonably systemized.

What type of brand it currently feels like:
- Primarily a founder-led baby registry and gear consultant with concierge polish.
- Secondarily an emerging educational authority brand.
- Not yet fully reading as a broad `Baby Gear Advisor` / `Baby Preparation Advisor` platform.

What is missing for the next stage of authority positioning:
- More educational depth and breadth.
- Stronger author and credential presentation.
- More disciplined service scope.
- Better alignment between the core funnel and the authority layer.
- More proof that feels specific, external, and repeatable.

What the likely top priorities for refactor will be after this audit:
- Unify the intake architecture across consultation and contact flows.
- Decide which repeated section systems stay on the homepage versus move deeper into the site.
- Tighten the service catalog around the clearest advisor-authority lane.
- Expand and structure the educational layer so authority does more of the funnel work before consultation.
- Standardize positioning language across homepage, services, FAQ, and about.
