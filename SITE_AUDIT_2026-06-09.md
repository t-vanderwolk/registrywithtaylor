# Taylor-Made Baby Co. — Full Site Audit
**Date:** June 9, 2026  
**Auditor:** Claude (Cowork session)  
**Scope:** All major pages, funnel integrity, content consistency, conversion path

---

## Overall Score: 8.2 / 10
*(8.6 / 10 once the Calendly fix is confirmed live)*

The site is in genuinely strong shape. Brand voice is consistent, pricing is now accurate across every surface, and the funnel logic is sound. The only critical issue is the Calendly widget on `/book` — that's the one thing standing between a warm lead and a booked call.

---

## Page-by-Page Scores

### Homepage (`/`) — 8.5 / 10

**What's working:**
- Hero headline is clear and premium: *"Private Baby Planning & Registry Guidance for Growing Families"*
- Nav is clean: HOME / SERVICES / ABOUT / ACADEMY / JOURNAL / CONTACT + primary "BOOK A FREE CONSULTATION" button
- Dual CTAs serve two audience types: consultation-ready visitors and browsers not yet ready to commit
- Tagline strip (STROLLERS | CAR SEATS | REGISTRY | NURSERY SETUP) quickly communicates scope
- Brand aesthetic is premium and consistent

**Gaps:**
- The services section on the homepage doesn't show prices — visitors who want to self-qualify before clicking to Services can't. A price range mention ("starting at $149") would reduce drop-off.
- No Taylor photo in the hero. For a personal brand, a face in the hero significantly increases trust.

---

### Services (`/services`) — 9 / 10

**What's working:**
- All three packages display correctly: $149 / $547 / $997
- Meeting pill badges are accurate: 1 SESSION · 90 min, 3 SESSIONS · 90 min each, Monthly sessions · 90 min each
- Full Academy access included ($97 value) shown on all three packages
- Signature Package includes Lani Car Seats + AZ Childproofers — this is a genuine differentiator
- Upgrade note ("pay only the difference") removes a common objection
- Add-ons all show prices ($59–$79)
- Testimonials section is strong — Strolleria attributions add third-party credibility
- Services FAQ accordion is a nice addition at the bottom

**Gaps:**
- No visual hierarchy distinction between "most popular" and base tier. The featured styling exists (`pkg.featured`) — make sure Signature Package renders with the featured treatment.
- Add-ons section doesn't have a CTA. People browsing add-ons should see a "Book a Free Consultation to Add This" prompt.

---

### FAQ (`/faq`) — 8 / 10

**What's working:**
- Full page with 5 well-organized sections: Consultation, Services, Car Seats, Academy, General
- All answers are now internally consistent:
  - Focused Session correctly says "One 90-minute session" and "$149"
  - Academy correctly says "included with every TMBC service package, or available separately for $97"
  - Signature Package answer includes Lani Car Seats + AZ Childproofers + written plans
- Dual CTAs at bottom: Book a Consultation + Contact Taylor

**Gaps:**
- The page has metadata with keywords, but no internal link from the main nav. FAQ is currently an orphan — only reachable if someone navigates directly or follows a footer link. Consider linking FAQ from the nav or from the consultation page.

---

### Consultation (`/consultation`) — 8 / 10

**What's working:**
- 3-step process clearly explained
- "Free 30-minute call" — accurate label (this is the free intake, not the 90-min paid session)
- Package interest field lets Taylor prep for the call
- No-pressure copy throughout
- Testimonial present for social proof

**Gaps:**
- No pricing indication before the form. Someone who doesn't know what the packages cost is walking in blind. A quick "See packages and pricing →" link near the form would help.
- The form's success state redirects to `/book` — this flow is correct but needs the Calendly fix confirmed (see below).

---

### Book (`/book`) — 4 / 10 now → 9 / 10 after fix

**CRITICAL ISSUE.** The Calendly widget is not rendering. The page header loads correctly (name personalization works, brand colors applied), but the embed area is blank.

**Root cause:** `next/script` with `strategy="lazyOnload"` doesn't fire reliably on this Heroku deployment.

**Fix committed:** `BookContent.tsx` rewritten to use `useEffect` + manual `document.createElement('script')` injection with `Calendly.initInlineWidget()`. This fix is in the repo but deployment is unconfirmed.

**Action required:** Run `git push heroku main` if not already done. Verify at taylormadebabyco.com/book?name=Test&email=test@test.com — you should see the Calendly calendar within 2–3 seconds.

Once deployed, this page is strong: personalized header, warm copy, brand-colored embed, correct URL pre-fills name + email.

---

### About (`/about`) — 8 / 10

**What's working:**
- Personal voice and clear methodology (Real life over registry noise / Fit over features / Buy with purpose)
- CPST certification mentioned — strong authority signal
- Strolleria background gives retail credibility
- Trusted partners section (Lani Car Seats, AZ Childproofers)
- Newsletter capture present

**Gaps:**
- Two different professional titles appear across the site: "Baby Gear Expert" and "Registry Consultant." Pick one primary title and use it consistently in the About hero, meta descriptions, and Google Business profile.
- No clear CTA pathway from About into services. The page builds trust but doesn't capitalize on it — add a "Work with Taylor →" CTA section near the bottom.

---

### Contact (`/contact`) — 7 / 10

**What's working:**
- Clearly scoped: "This form is for general contact — not for booking sessions"
- Points visitors toward the consultation form
- Prevents the wrong leads from filling the wrong form

**Gaps:**
- This page does no selling. Someone who lands here from a Google search for "baby registry consultant" sees a form with no pricing or package context. Add a one-liner with pricing and a link to `/services`.
- No phone number or turnaround-time expectation shown. "Taylor responds personally within 24 hours" from the FAQ doesn't appear here.

---

### Blog Index (`/blog`) — 7.5 / 10

**What's working:**
- 16 articles — good content depth for SEO
- Clean grid layout
- Category organization

**Gaps:**
- Newsletter capture is only at the bottom of the index. Consider a mid-feed prompt after the first 6 articles.
- No "Start Here" or featured/pinned article. For a new visitor, 16 equal-weight cards is overwhelming. Pin one article per major category (strollers, registry, nursery, car seats) and surface it visually.

---

### Blog Post (`/blog/momcozy-baby-products`) — 9 / 10

**What's working:**
- Table of contents
- Author bio: Taylor Vanderwolk
- Affiliate disclosure present
- Newsletter capture mid-article
- Services CTA at bottom
- Related articles section
- Comments section
- "Keep the next step obvious" section — excellent conversion thinking

**Gaps:**
- Affiliate disclosure appears after the intro copy, not above it. FTC guidance expects disclosure before the affiliated products are discussed. Move it to above the intro ("Some links in this article are affiliate links...") or use a sticky banner.

---

### Academy (`/learn`) — 8.5 / 10

**What's working:**
- 3 free lessons clearly marked
- 4 paths with module counts (29 modules total)
- "Full Academy access requires enrollment" with pricing link
- Clean, structured layout

**Gaps:**
- The 4-path grid doesn't show module-level previews. Showing even one example module title per path would reduce uncertainty for people deciding whether to enroll.
- No testimonial or social proof on the Academy landing page.

---

### Academy Pricing (`/learn/pricing`) — 9 / 10

**What's working:**
- Clear two-tier structure: $0 Preview / $97 Full Access
- "Full Academy access is included with all TMBC service packages" footnote with link to services
- Monthly option ($14.99/mo) is a smart low-barrier entry
- "Join the Waitlist" CTA (correct staging behavior if course isn't fully live)
- FAQ section covers the most common hesitations

**Gaps:**
- If the Academy is on a waitlist, be explicit about expected availability. "Expected launch: [date]" manages expectations and creates urgency.
- The FAQ answer for "Is there a 1:1 option with Taylor?" links to "Concierge service" but the correct page is `/consultation` or `/services`. Check this link.

---

## Funnel Assessment

**Primary funnel:** Blog/Homepage → Services → Consultation form → `/book` (Calendly) → Scheduled call → Package purchase

**Status:** Functionally correct. The `/consultation` → `/book` redirect on form success is working. The `/book` page personalizes correctly. Only blocker is Calendly not rendering — resolved in code, needs deploy confirmation.

**Secondary funnel:** Homepage/Blog → Academy (free lessons) → Pricing → Waitlist/purchase

**Status:** Clean. The Academy is clearly positioned as self-serve prep that complements 1:1 services, not a replacement. The footnote linking Academy pricing back to services is a nice cross-sell.

---

## Priority Action List

### 🔴 Critical (blocks revenue)
1. **Confirm Calendly is live on `/book`** — run `git push heroku main` and verify the widget loads at `taylormadebabyco.com/book?name=Test&email=test@test.com`

### 🟡 High (meaningful conversion impact)
2. **FAQ needs a nav entry or internal link** — it's a fully built, high-value page that nobody will find organically without a pointer from the nav or the consultation page
3. **About page CTA** — add "Work with Taylor →" leading to `/services` or `/consultation` near the bottom
4. **Blog affiliate disclosure placement** — move disclosure above the intro copy for FTC compliance
5. **Contact page needs context** — add pricing range and 24-hour response note

### 🟢 Medium (polish and optimization)
6. **Consistent professional title** — pick "Baby Gear Expert" or "Registry Consultant" and use it everywhere
7. **Homepage price anchoring** — add "starting at $149" or "packages from $149" to the homepage services section
8. **Blog index pinned articles** — feature one article per major category to reduce overwhelm for new visitors
9. **Academy launch timeline** — add expected date to the waitlist CTA if the Academy isn't fully live

### ⚪ Low (nice-to-have)
10. **Taylor photo in the hero** — for a personal brand, a face dramatically increases trust
11. **Mid-feed newsletter prompt** on the blog index (after card 6)
12. **Academy module previews** — show one example module title per path on `/learn`
13. **Services add-ons CTA** — add "Book a consultation to add this" below the add-on grid

---

## Content Consistency Status

All of the following were verified as consistent across the site:

| Dimension | Status |
|---|---|
| Session duration (90 min paid, 30 min free consult) | ✅ Consistent |
| Package names (Focused Session, Signature Package, Private Concierge) | ✅ Consistent |
| Academy pricing ($97 standalone, included with all packages) | ✅ Consistent |
| Add-on prices ($59–$79) | ✅ Consistent |
| Signature Package inclusions (Lani, AZ Childproofers, written plans) | ✅ Consistent |
| Focused Session written summary mention | ✅ Consistent |
| Upgrade/pay-difference note | ✅ Present on services |

---

*Audit conducted June 9, 2026 across: /, /services, /faq, /consultation, /book, /about, /contact, /blog, /blog/momcozy-baby-products, /learn, /learn/pricing*
