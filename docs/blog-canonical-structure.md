# TMBC Canonical Blog Post Structure

The reference skeleton every public post is normalized against. Wording of headings,
the H1/title, product cards, prose, and all metadata/SEO are **frozen** — normalization
only reorders/inserts non-heading blocks, standardizes the affiliate disclosure position,
and fixes heading *levels* (never heading wording).

## 1. Already standardized by the page template (no action needed)

Rendered by `PostArticleView` / `PostContent` around your markdown, identical on every post:

- Category eyebrow + H1 title (`post.title`)
- Dek / subtitle (`post.deck`)
- "Inside This Guide" table of contents (auto-built from the body headings)
- Related Reading strip
- Gear Picks / Brand Partners (auto-built from the post's product cards / affiliate brands)
- Author bio, newsletter signup, soft CTA, share bar, comments, "More from the Journal"

Because these are template-level, they are already consistent site-wide. Normalization
does not touch them.

## 2. The markdown body — canonical order (what we normalize)

1. **Intro** — `## <intro heading>` (H2)
   - Opening paragraph
   - **Affiliate disclosure** (standard line) placed immediately after the opening paragraph
   - Remaining intro paragraphs
   - Optional intro pull-quote (`> "..."`)
2. **Body sections** — one `## <Heading>` (H2) per product/topic. Recurring sub-blocks
   under each are H3:
   - `### TMBC Take`
   - `### Taylor's Top Picks` (or `### Taylor's Top Pick`)
   - `### Pros`, `### Cons`, `### Highlights`, `### Quick Specs`, `### Why It Wins`, `### Why It Matters`
3. **Closing** — `## Final Thoughts` (or the post's existing closing heading, e.g. "The Real Secret") (H2)
4. **FAQ** — `## Frequently Asked Questions` (H2); **each question is `### <question>` (H3)**
   with its answer paragraph beneath. H3 is required for the FAQ rich-result schema to
   pick the questions up.
5. `### Key takeaways` (H3) list, then a short "Start there." line
6. Optional "Looking for more?" internal links
7. **Sign-off** — `xoxo` / `- T` marker (renders the handwritten GuideSignoffMark)

## 3. Heading-level rules (wording frozen, only levels normalized)

- Major sections (Intro, each product/topic, Final Thoughts, FAQ) = `##`
- Recurring sub-blocks (TMBC Take, Taylor's Top Pick[s], Pros, Cons, Highlights, Quick
  Specs, Why It Wins/Matters, FAQ questions, Key takeaways) = `###`
- The H1 is the post title (never appears in the body) and is never changed.

## 4. Affiliate disclosure

Standard line, verbatim:

> Some links in this article are affiliate links. Taylor-Made Baby Co. may earn a commission at no additional cost to you.

Placed as its own paragraph immediately after the intro's opening paragraph.

## 5. Frozen — never changed by normalization

- All heading **wording**, the H1/title, and all metadata/SEO (title tag, meta
  description, keywords, JSON-LD schemas).
- Product cards, CTA blocks, images, and prose.

## 6. Common drift this repairs

- FAQ questions written as `##` instead of `###` (breaks the FAQPage schema).
- TMBC Take / Taylor's Top Picks written as `##` (same level as the product) instead of `###`.
- Affiliate disclosure buried mid-intro instead of right after the opening paragraph.
