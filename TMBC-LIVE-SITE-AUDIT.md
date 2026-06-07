# TAYLOR-MADE BABY CO. — LIVE SITE AUDIT
### taylormadebabyco.com | June 2026

---

## OVERALL SCORE: 51 / 100

The live site is more polished than the codebase audit alone suggests — the design, voice, and UX are genuinely excellent for this category. The score is not a reflection of quality. It is a reflection of a business model that has no revenue mechanism. A site that looks like a premium product and charges nothing will always score in the 50s regardless of how beautiful it is.

| Dimension | Score | Notes |
|---|---|---|
| Visual Design & Brand | 84/100 | Standout in the category. Premium feel is real. |
| Homepage UX | 72/100 | Strong framing, smart entry paths, but no conversion hook beyond a free consult |
| Navigation & IA | 58/100 | "Journal" not "Blog," Guides not in nav, no Pricing |
| Services Page | 44/100 | Three packages listed, zero prices shown, all CTAs go to the same free form |
| Academy Experience | 61/100 | Beautiful but free, anonymous, no completion, product examples are generic |
| Blog / Journal | 70/100 | Strong content, active publishing, good categories — but no monetization layer |
| About Page | 68/100 | Warm, credible, good credentials — but only one CTA (free consult) |
| Consultation Funnel | 38/100 | The primary revenue action is... free. No pricing anywhere. |
| Monetization | 6/100 | Affiliate links are invisible to users. Everything else is free. |
| SEO Foundation | 66/100 | Good structure, metadata present, but dual content systems split authority |

---

## PAGE-BY-PAGE FINDINGS

---

### HOMEPAGE — Score: 72/100

**What works:**
- Hero headline is sharp: "Private Baby Planning & Registry Guidance for Growing Families." It leads with the outcome, not the service.
- Three entry-point cards ("I Don't Know Where to Start," "I Want to Build My Registry," "I'm Comparing Gear") are the best UX decision on the site. They meet the user exactly where they are emotionally.
- The credential strip — Strolleria, Pottery Barn Kids, Target Baby Concierge — builds instant trust for new visitors.
- Testimonials are strong and feel real. The Strolleria verified reviews in particular are credible and specific.
- The email capture ("Get the Free Baby Prep Starter Guide") is well-placed and clearly valued.
- The "What Taylor helps you sort" section (Stroller Strategy, CPST, Registry Strategy, Nursery Setup) is concise and scannable.

**What's broken:**

**No pricing signal anywhere.** A visitor lands on the homepage, sees premium design, excellent testimonials, and three service packages mentioned later — and has no idea what anything costs. The primary CTA is "Book a Consultation" which turns out to be free. The visitor who comes ready to pay has no path to do so.

**The homepage does not convert to the Academy.** "Start with Academy" is a secondary CTA in the hero, below the primary "Book a Consultation." Given that the Academy is the most trafficked content on the site, it should be positioned as a co-equal entry point — not an afterthought.

**One Instagram link in the footer. That's it for social.** A personal brand in 2026 lives on social. The site doesn't connect to TikTok, Pinterest, or YouTube. For an audience that discovers baby content primarily through Instagram and TikTok, the social surface is underbuilt.

**The "Product Finder Available" widget appears on every page** as a floating element. It is never explained. A first-time visitor sees it and has no context for what "Product Finder" means or what it will do. Either feature it properly with copy, or remove it from the passive float.

**The "Start Here" section on the homepage sends "I Don't Know Where to Start" to `/consultation`** — a free intake form with no scheduling visibility and no guaranteed response time. For a user who feels lost, this is not a reassuring next step. It would convert better sending them to the Academy entry point where they get immediate value.

---

### NAVIGATION — Score: 58/100

**Current nav:** Home | Services | About | Academy | Journal | Contact | [Book a Consultation]

**Problems:**

**"Journal" is confusing.** The URL is `/blog`. Every external link, every SEO reference, every share will say "blog." The nav label says "Journal." This creates a split-identity problem for SEO and for returning users who look for "Blog" and can't find it.

**Guides is not in the navigation.** The `/guides` system exists, has 21+ long-form guides, and is linked from the Services page — but it does not appear in the main nav at all. If Guides is a primary content pillar, it needs to be in the nav. If it's not worth navigating to, question whether it should exist.

**No "Pricing" or "Work With Me" in nav.** The entire nav assumes the visitor should funnel through a free consultation before ever knowing what anything costs. For a user who wants to hire Taylor, there's no clear price anchor.

**"Book a Consultation" CTA in the nav is the right move** — it's persistent and visible. But it sends to a free intake form. If the consultation were paid (or led to a paid product), this would be a high-converting nav button. Currently it opens a form that leads to uncertainty.

**Recommendation:**
```
Home | Academy | Journal | Guides | Services | About | [Book a Consultation]
```
Add Guides. Rename Journal → Blog. Add a clear "Pricing" section to Services.

---

### SERVICES PAGE — Score: 44/100

**The single most important finding on the live site: the Services page has no prices.**

Three packages are described:
- Focused Session
- Signature Package (labeled "Most Popular")
- Private Concierge

Every single package links to the same `/consultation` form. That form is free. There is no indication of price, no price range, no "starting at $X." A visitor who lands on the Services page, reads about three tiers of advisory support, and wants to hire Taylor has no way to do so and no idea what it costs.

This is a trust and conversion killer. In service businesses, hiding price signals one of two things to the visitor: either the price is embarrassingly high, or it hasn't been decided yet. Neither is the signal you want.

**The add-ons section is smart** — Nursery Layout Planning, Registry Refresh, Baby Gear Troubleshooting, Travel With Baby Planning, Postpartum Preparation, Sibling and Animal Introduction Prep — but again, no prices.

**The 4-step process** (Fill out intake → Taylor reviews → Your session → Your follow-up plan) is excellent. This is the section that actually sells the experience. It builds confidence. It should be higher on the page and should be accompanied by a specific deliverable ("You'll receive a written summary within 24 hours of your session").

**The "Keep The System Connected" section at the bottom** is good — cross-linking to Guides and Academy from the Services page is smart. It shows how the ecosystem fits together.

**What's missing:** Price. One line. Even a range. "Sessions start at $X." That's all it takes to move a qualified visitor from consideration to booking.

---

### CONSULTATION PAGE — Score: 38/100

**Confirmed live: The consultation is free.**

The FAQ on this page explicitly states: *"Yes. The personal 1:1 video consultation is free. There is no cost to submit a request."*

This is the entire business model problem crystallized in one sentence. The only action a user can take to engage Taylor personally is submit a free intake form. There is no paid booking. There is no scheduling calendar. There is no indication of what happens after submission or when Taylor will respond.

**What the form collects:** First name, email, due date (optional). That's it for step one. Presumably more information is collected in a subsequent step (the "intake" referenced in the FAQ), but this first screen is minimal.

**The testimonial on this page** ("Taylor and I laughed the whole time but still able to get it done!") is warm but not strategic. For a page that asks a visitor to submit personal information, the testimonial should focus on the outcome — what the visitor got from the session — not just the vibe.

**No calendar.** The visitor submits a form. Taylor reviews it. Then what? There's no visible timeline, no scheduling link, no confirmation of when they'll hear back. For a user who is 28 weeks pregnant and time-pressured, this ambiguity loses bookings.

**Fix:** Show a Calendly embed or similar. Let users pick a time. It signals availability, creates commitment, and eliminates the anxiety of "did she get my form?"

---

### ACADEMY (Live Experience) — Score: 61/100

**The Academy homepage** is excellent. The entry-path cards are smart UX. The path grid (Registry 8 modules, Nursery 6, Gear 9, Postpartum 6) is clear. The "choose the path that makes the next decision quieter" headline is on-brand and emotionally resonant.

**The module experience (What to Register First) — key findings:**

**The YouAreHereCard shows "COMPLETED" on a module the user just arrived at.** This is a live bug. When a user arrives at Module 1, the card reads "COMPLETED" at the top with a checkmark, then "Module 1 of 8" below. This is almost certainly because the component logic considers "you are on this URL" as "completed step" — but to a user, seeing "COMPLETED" before they've read anything is confusing and undermines the progress system's credibility.

**The product examples are not real products.** The "Product Examples" section on this module shows three items labeled: "Sleep Setup," "Feeding Basics," and "Diapering and Daily Care Setup." These are not brands. They are not products. They are category descriptions presented in a product card format. There are no prices, no links, no images of actual products. This section was clearly designed to showcase real affiliate products but currently renders generic placeholder-level content. A user who scrolls to "Product Examples to pressure-test" and finds three unnamed category descriptions will feel misled.

**The module is very long.** The full text of the "What to Register First" module is substantial — multiple major sections, each with its own headers and sub-content. On mobile, this is a 10+ minute scroll with no checkpoints and no way to resume.

**The "Work With Me ->" CTA appears twice** — once mid-module and once at the bottom. Neither appearance is particularly compelling because neither tells the user what working with Taylor looks like, how much it costs, or what they'd get.

**No email gate.** A user reads the entire module, finds it excellent, reaches the end — and there's no capture moment. Not even a "Enter your email to get the next module" gate. The user just… leaves.

---

### BLOG / JOURNAL — Score: 70/100

**Content quality is strong.** The active publishing cadence (multiple posts in 2026), the mix of evergreen comparisons and news-reactive content (Nuna Demi ICON, Bugaboo Donkey 6), and the category organization (Registry Strategy, Nursery & Home, Gear & Safety) make this a legitimate content operation.

**Reading time shown** — good practice. Readers appreciate knowing upfront.

**The "Share" and "Save" buttons on articles are a problem.** The Save button appears on every article. Without a user account system, what does "Save" do? If it uses localStorage, it's not persistent across devices or browsers. If it's a dead UI element, it's actively misleading. Either build the save functionality (requires accounts) or remove the button.

**The email capture runs mid-feed** — this is smart placement. It appears between articles, not just at the bottom of the page.

**Missing: related articles, author bio section, and internal linking to Academy modules.** A blog post about strollers should link to the Stroller Foundations Academy module. A post about registry strategy should link to the Registry Academy path. These connections exist in the data layer (the internal links system is built in the codebase) but are not consistently surfaced in the live articles.

**The "Momcozy Makes More Than Breast Pumps" article** has no author attribution visible in the listing — just a date and category. Every other article shows "By Taylor Vanderwolk." Inconsistent attribution in the listing undermines personal brand.

---

### ABOUT PAGE — Score: 68/100

**The writing is strong.** "When you invite me into that space — into your home, your routines, your questions at 10 p.m. — you're trusting me with more than a checklist. You're trusting me with your story." This is excellent personal brand copy. It earns trust.

**The credentials are real and specific.** Strolleria, Pottery Barn Kids, Target Baby Concierge, CPST certification — these are named institutions with recognizable authority in the baby gear space.

**What's missing:**

**No photo.** The about page text was extracted — there may be a photo in the visual layout, but based on the accessibility tree there is no image element with a "Taylor" or "headshot" alt text on this page. An about page for a personal brand without a clear personal photo is a trust gap.

**Only one CTA: "Book a Consultation."** The about page is where a converted user confirms their decision. At this stage they should be offered the full range of next steps: Book a Consultation, Explore the Academy, Read the Journal. One CTA undersells the moment.

**No story arc.** The copy jumps from credential to philosophy without a clear personal story. "Here's the tea" is a good opener but the section doesn't deliver on a narrative — it goes straight into methodology. The about page should answer: *how did Taylor become the person who does this?* Right now it answers: *what does Taylor do and how?* The first version creates a deeper connection.

---

## THE BUSINESS MODEL PROBLEM — AS SEEN ON THE LIVE SITE

After walking through every page:

**Free:** Academy (all content) | Blog (all content) | Guides (all content) | Consultation (yes, actually free)

**Paid:** Nothing visible. No pricing. No checkout. No subscription. No course purchase.

**Monetization that exists but is invisible to users:** Affiliate links embedded in content. Users never see "this is an affiliate link" in a way that registers — the tracking is backend-only.

The live site presents as a premium service business. The actual business model is 100% lead generation for a free consultation, hoping that consultation leads to some paid engagement that is never described or priced on the site.

This is not a sustainable content business. It's a services business with an extraordinary content moat that is currently being given away.

---

## THE "PRODUCT FINDER" WIDGET

A floating button on every page says "Product Finder Available" with a "Search Now" label. This feature was not visible in the codebase review. It appears to be a third-party product recommendation tool. It is never explained in any surrounding copy. No page introduces it. No CTA points to it.

This is either: (a) a genuinely useful tool that is severely under-promoted, or (b) a vendor widget that was installed and forgotten. Either way, it should either be featured prominently with context ("Not sure what to buy? Try the Product Finder →") or removed entirely. A floating unexplained widget on every page creates cognitive noise.

---

## TOP 15 LIVE SITE FIXES

Ranked by impact, not effort.

**1. Add pricing to the Services page.**
Even a range. "Sessions from $X." This is a one-line copy change that removes the biggest friction in the conversion funnel. Do this today.

**2. Add a scheduling link to the Consultation page.**
Calendly, Cal.com, or equivalent. Let users pick a time when they submit. Eliminates the post-form anxiety gap.

**3. Fix the "COMPLETED" label on YouAreHereCard.**
Module 1 should not show "COMPLETED" when a user arrives for the first time. This is a live content credibility bug.

**4. Replace generic product examples with real products.**
"Sleep Setup," "Feeding Basics," and "Diapering and Daily Care" are not products. Pull real affiliate products with real names, brands, and links into the product cards. This is the Academy's biggest content quality gap in the live experience.

**5. Add an email gate or capture at the end of every module.**
Even a simple "Want a recap of this module + the next one?" email capture at the module footer. Every module completion is currently a dead end.

**6. Add "Guides" to the main navigation.**
The /guides system has 21+ long-form pieces not surfaced in the nav. Either put Guides in the nav or merge the content into Academy and Blog.

**7. Rename "Journal" → "Blog" in the nav.**
The URL is /blog. Match the label to the URL. Simple, immediate, SEO-relevant.

**8. Fix or remove the "Save" button on blog articles.**
If there's no account system, the Save button doesn't save anything persistently. Remove it until accounts exist, or replace it with a "Save to Email" flow that captures the lead.

**9. Feature the Product Finder widget properly or remove it.**
Add context, a headline, and a clear CTA if it's a real tool. Remove it if it's not being actively used.

**10. Rethink the "I Don't Know Where to Start" CTA on the homepage.**
Currently sends to the free consultation form. Should send to the Academy entry or a short "which path is right for you" quiz. The user who doesn't know where to start needs immediate value, not a form to fill out.

**11. Add a photo of Taylor to the About page.**
If one isn't there already, this is an immediate trust gap on a personal brand site.

**12. Fix the Momcozy article author attribution.**
One article in the blog listing has no author shown. Fix for consistency.

**13. Add an Academy → Blog internal link layer.**
Every Academy module should have 1-2 related Journal links at the bottom. Every relevant Blog post should link to the corresponding Academy path. The content ecosystem is disconnected on the live site.

**14. Add social links beyond Instagram.**
At minimum: TikTok (if active), Pinterest (high-intent baby content audience), YouTube (if any video exists). The footer has one social link for a personal brand in 2026.

**15. Make the "Start with Academy" hero CTA co-equal with "Book a Consultation."**
The Academy is the highest-value free asset on the site. It should not be the secondary CTA in the hero. Swap the visual weight or make them equal — the Academy drives more long-term trust than a consultation form.

---

## WHAT THE LIVE SITE DOES BRILLIANTLY

This deserves to be said directly.

The visual design is exceptional for this market. The rose/ivory palette, the serif typography, the card layouts, the editorial photography — it competes with brands that spend 10x on design.

The editorial voice is the best in the category. "Calm, don't add to the noise" is not a tagline — it's a worldview that runs through every headline, every module intro, every CTA. Taking Cara Babies is authoritative. Tinyhood is clinical. Babylist is utilitarian. TMBC is the only one that sounds like a thoughtful person talking to another thoughtful person. This is a genuine competitive advantage.

The Academy content framework is intellectually coherent. Decision-first, product-second, lifestyle-shaped — this is a differentiated pedagogical position in a market that otherwise leads with product recommendations. The framework is worth protecting, building, and eventually charging for.

The testimonials are specific, credible, and numerous. Five Strolleria verified reviews plus four consultation stories on the homepage alone is more social proof than most competitors show anywhere on their sites.

---

## THE FINAL HONEST ASSESSMENT

The live site is a beautifully built, expertly voiced, professionally designed content platform with a consultation business attached that has no visible price and no checkout flow.

The content moat is real. The audience trust is being earned every day. The design earns a premium price signal that the business model has not yet caught up to.

The site is ready to charge. The infrastructure to do so doesn't exist yet.

Build the infrastructure. The audience will pay.

---

**Live Site Score: 51 / 100**
*Score would jump to 72+ with pricing added to Services and a scheduling link on the Consultation page alone — two changes that could be made this week.*

---

*Live Site Audit — taylormadebabyco.com | June 2026*
