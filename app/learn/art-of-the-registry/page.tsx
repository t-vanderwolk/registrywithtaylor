import SiteShell from '@/components/SiteShell';
import LessonDivider from '@/components/learn/LessonDivider';
import LessonHeader from '@/components/learn/LessonHeader';
import LessonImage from '@/components/learn/LessonImage';
import LessonNavStrip from '@/components/learn/LessonNavStrip';
import LessonSection from '@/components/learn/LessonSection';
import LessonVideoPlaceholder from '@/components/learn/LessonVideoPlaceholder';
import TaylorsNote from '@/components/learn/TaylorsNote';
import MiniWorkbook from '@/components/learn/MiniWorkbook';
import KeyTakeaways from '@/components/learn/KeyTakeaways';
import LessonCTA from '@/components/learn/LessonCTA';
import LessonBlogLink from '@/components/learn/LessonBlogLink';
import { FREE_PREVIEW_LESSONS, FREE_PREVIEW_LESSON_COUNT } from '@/lib/learn/lessons';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'The Art of the Registry — Free Lesson | Taylor-Made Baby Academy',
  description:
    'Why most registries fail and how to create one that actually supports your lifestyle. Free preview lesson from Taylor-Made Baby Co.',
  path: '/learn/art-of-the-registry',
  imagePath: '/assets/editorial/registry.jpg',
  imageAlt: 'The Art of the Registry lesson preview',
  keywords: [
    'baby registry lesson',
    'how to build a baby registry',
    'registry planning guide',
    'registry foundations',
  ],
});

const LESSON_NUMBER = 1;

const firstPassCategories = [
  'Where baby sleeps',
  'How feeding works',
  'How diapering works',
  'How you move through the day',
  'What keeps the house functional when everyone is tired',
];

const registryMistakes = [
  'Duplicate jobs — solving the same problem three different ways',
  'Fantasy planning — building for every possible version of parenthood at once',
  'Letting platform perks drive the list instead of support it',
  'Mixing private maybes into the public-facing guest list',
];

const smartTimingPrinciples = [
  'Buy the first-stage essentials with delivery time in mind',
  'Let gifts come in before you fill the gaps yourself',
  'Use the completion-discount window for what actually remains',
  'Move uncertain categories to a private note, not the public list',
];

const keyTakeaways = [
  'A registry is a planning tool, not a product collection.',
  'Register by function — start with what the house needs to do.',
  'Your platform choice affects perks, guest experience, and long-term flexibility.',
  'Local stores, expert guidance, and hybrid support exist so you do not have to figure this out alone.',
  'Welcome boxes are product testing, not the point.',
  'Timing and patience are the highest-yield registry strategies.',
  'The edit pass is where a registry gets useful — subtraction beats accumulation.',
  'One clean public list is almost always better than multiple scattered links.',
];

const workbookPrompts = [
  {
    id: 'first-stretch',
    label: 'What does the first week at home actually need to function?',
    placeholder:
      'Think through sleep setup, feeding plan, diapering flow — the jobs that need to work immediately, not the items that look impressive on a list...',
  },
  {
    id: 'platform-fit',
    label: 'Which registry platform fits how your guests actually shop?',
    placeholder:
      'Consider where your community tends to buy, how you handle returns, whether you need flexibility across multiple stores or one simpler path...',
  },
  {
    id: 'private-maybes',
    label: 'What categories are you genuinely uncertain about right now?',
    placeholder:
      'These belong on a private maybe list, not the public registry — which items can you move out of the main list until you have more information?',
  },
];

export default function ArtOfTheRegistryPage() {
  return (
    <SiteShell currentPath="/learn">
      <main className="site-main" style={{ backgroundColor: '#faf9f6' }}>
        {/* Lesson Header */}
        <LessonHeader
          breadcrumbs={[
            { label: 'Academy', href: '/learn' },
            { label: 'Registry Foundations', href: null },
            { label: 'The Art of the Registry', href: null },
          ]}
          title="The Art of the Registry"
          lessonLabel="Free Preview Lesson"
          estimatedMinutes={15}
          progressLabel={`Lesson ${LESSON_NUMBER} of ${FREE_PREVIEW_LESSON_COUNT} Free Preview Lessons`}
        />

        {/* Lesson nav strip */}
        <LessonNavStrip
          current={LESSON_NUMBER}
          total={FREE_PREVIEW_LESSON_COUNT}
          lessons={FREE_PREVIEW_LESSONS}
        />

        {/* Main lesson body */}
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="space-y-14">

            {/* 1 — Overview */}
            <LessonSection eyebrow="Overview" title="The registry path exists because most registries are built backwards.">
              <p>
                Most families start a registry by opening a browser tab, searching for &ldquo;best
                baby products,&rdquo; and adding whatever looks credible enough. That is how you end
                up with a list that is too long, too scattered, and strangely useless once the baby
                actually arrives.
              </p>
              <p>
                The TMBC Registry Path walks through eight modules in a specific order for a reason.
                The goal is not to collect products. The goal is to build a registry that makes the
                first stretch of life at home more workable — for both of you.
              </p>

              <LessonImage
                src="/assets/registrypath/registry.png"
                alt="Registry planning setup — the starting point for building an intentional baby registry"
                priority
              />

              <p>
                This lesson is the foundation. It covers what the registry path teaches, why the
                order matters, and what it looks like to approach this with intention instead of
                anxiety.
              </p>
            </LessonSection>

            {/* 2 — Watch / Learn placeholder */}
            <LessonVideoPlaceholder />

            {/* Divider */}
            <LessonDivider />

            {/* 3 — Core Lesson */}
            <div className="space-y-14">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/72">
                Core Lesson
              </p>

              {/* 3.1 */}
              <LessonSection stepNumber={1} title="Start with the jobs the house needs to do">
                <p>
                  The smartest first-pass registry is not the most complete one. It is the most
                  functional one.
                </p>

                <LessonImage
                  src="/assets/registrypath/pregnantplanning.png"
                  alt="Expectant parent planning what the home needs before baby arrives"
                  caption="The first-pass registry should make the house more workable, not just look more complete."
                />

                <p>
                  Before worrying about perks, discount windows, or whether something has excellent
                  branding, you need a first-pass structure built around the first stretch of daily
                  life. The categories that matter immediately are:
                </p>
                <ul className="mt-4 space-y-2.5">
                  {firstPassCategories.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  That list is usually shorter than people expect. The goal is not to make the
                  registry look full. It is to make it work. Register by function — not by aisle —
                  and the duplicate jobs get easier to spot before you add a fifth version of the
                  same idea.
                </p>
              </LessonSection>

              {/* 3.2 */}
              <LessonSection stepNumber={2} title="Your platform choice is a strategy decision">
                <p>
                  Most parents treat the registry platform like a formality. Pick a store, add
                  items, done. In reality, where you register affects what perks you unlock, how
                  easy the list is to manage, and — most importantly — how easy it is for the
                  people actually trying to buy from it.
                </p>

                <LessonImage
                  src="/assets/registrypath/universalregistry.png"
                  alt="Universal registry platform setup showing one list across multiple stores"
                  caption="Single-retailer vs. universal — the choice depends on your guests, not just your preferences."
                />

                <p>
                  Single-retailer registries often offer stronger perks and a cleaner guest
                  checkout path. Universal registries give you flexibility when your list genuinely
                  spans multiple stores or specialty brands. Neither is automatically smarter. The
                  better choice depends on whether you care more about customization, convenience,
                  or a little of both.
                </p>
                <p>
                  One clean public registry is almost always easier than multiple scattered links.
                  If the list is confusing, guests do not become more strategic. They text you from
                  the store aisle. That is not their fault. That is a systems problem.
                </p>
              </LessonSection>

              {/* 3.3 */}
              <LessonSection stepNumber={3} title="You do not have to figure this out alone">
                <p>
                  This is where most parents fall into the same pattern: they scroll, compare, read
                  reviews, watch videos, and try to piece the whole thing together independently.
                  The shift that actually changes things is realizing you do not need more research.
                  You need better guidance.
                </p>

                <LessonImage
                  src="/assets/registrypath/strollershopping.png"
                  alt="Shopping at a local baby store where you can test gear in person"
                  caption="Local stores let you test in person, compare side by side, and ask questions that apply to your actual life."
                />

                <p>
                  If there is a locally owned baby store near you, start there. You can test
                  strollers in person, compare car seats side by side, feel the materials, and ask
                  questions that actually apply to your car, your neighborhood, and your life.
                  Clarity saves money in its own very glamorous way.
                </p>
                <p>
                  If a local store is not available or your schedule does not cooperate, hybrid and
                  virtual support is a real option. The difference between an expert and an
                  influencer is simple: an expert explains why something works for your specific
                  situation. An influencer tells you it changed their whole life before breakfast.
                  You do not need louder recommendations. You need better filters.
                </p>
                <LessonBlogLink
                  href="/blog/target-baby-concierge-virtual-specialist-guide-2026"
                  title="Target's Baby Boutique Is Changing Everything"
                  description="What most parents do not know yet about Target's baby specialist program — and how to actually use it."
                />
              </LessonSection>

              {/* 3.4 */}
              <LessonSection stepNumber={4} title="Work the perks on purpose">
                <p>
                  Most registries come with welcome boxes and perk programs. Most families do not
                  fully use them — or use them the wrong way.
                </p>

                <LessonImage
                  src="/assets/registrypath/insidewelcomebox.png"
                  alt="Inside a registry welcome box — sample products for testing before committing to full sizes"
                  caption="A sample is data. Treat it like data."
                />

                <p>
                  Welcome boxes are product testing opportunities, not registry jackpots. The
                  samples inside let you try a bottle, a diaper, or a wipe before committing to a
                  full-size purchase. That is genuinely useful in categories where baby preference
                  and body preference are real. Treat a sample as data. One sample pacifier does
                  not mean you are now in a long-term relationship with that brand.
                </p>
                <p>
                  Sign up early. Each platform has requirements — minimum items, checklist
                  completion, purchase thresholds — and that is the part most families miss. The
                  box does not arrive automatically just because you created the registry. The
                  administrative detail is easy to handle early and annoying to chase after.
                </p>

                <LessonImage
                  src="/assets/registrypath/completiondiscount.png"
                  alt="Completion discount window — the cleanup pass for buying remaining registry items at a reduced cost"
                  caption="Completion discounts are most useful when the list has already been edited by real gifts and changing priorities."
                  aspectRatio="16/9"
                />

                <p>
                  Completion discounts and reward programs are where registry savings actually
                  compound. The window exists to help you buy the remaining essentials at a reduced
                  cost after gifts have settled. Using it too early wastes the advantage on items
                  that might have been gifted or cut. Patience is often the highest-yield registry
                  strategy.
                </p>
                <LessonBlogLink
                  href="/blog/blog-free-baby-welcome-boxes-newborn-clubs-2026"
                  title="The Taylor-Made Guide to Free Baby Welcome Boxes & Newborn Clubs (2026)"
                  description="Every registry welcome box, what is actually inside them, and how to qualify before the window closes."
                />
              </LessonSection>

              {/* 3.5 */}
              <LessonSection stepNumber={5} title="Buy in phases — timing matters as much as what you buy">
                <p>
                  One of the most common registry mistakes is buying everything too early. That
                  creates unnecessary spending, clutter, and regret, usually in that order.
                </p>

                <LessonImage
                  src="/assets/registrypath/calanderplan.png"
                  alt="Calendar-based registry purchasing timeline — buying in phases instead of all at once"
                  caption="A smarter timeline gives the registry room to work before the boxes start stacking up."
                />

                <p>
                  A smarter timeline gives the registry room to work before the boxes start
                  stacking up. That looks like:
                </p>
                <ul className="mt-4 space-y-2.5">
                  {smartTimingPrinciples.map((principle) => (
                    <li key={principle} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span>{principle}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  Some categories deserve early action. Others only feel urgent because they are
                  heavily marketed or unusually photogenic on social media. Urgent-looking is not
                  the same thing as urgent. Your future self does not need a garage full of unopened
                  certainty.
                </p>
              </LessonSection>

              {/* 3.6 */}
              <LessonSection stepNumber={6} title="The edit pass is where the registry gets useful">
                <p>
                  Most registry advice focuses on what to add. The more useful conversation is
                  about what to catch before the list gets louder than your real life.
                </p>

                <LessonImage
                  src="/assets/registrypath/overwhelm.png"
                  alt="Registry overwhelm — what happens when the list grows faster than the logic behind it"
                  caption="The problems are predictable once you know what to look for."
                />

                <p>The common problems are predictable:</p>
                <ul className="mt-4 space-y-2.5">
                  {registryMistakes.map((mistake) => (
                    <li key={mistake} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  The cleanup pass is usually subtraction plus better timing. A registry that looks
                  more edited by the end is almost always getting better, not worse. If the list
                  feels calmer after you cut something, that is a good sign.
                </p>
              </LessonSection>

              {/* 3.7 */}
              <LessonSection stepNumber={7} title="Gifting strategy is part of registry strategy">
                <p>
                  A baby shower is not just a celebration. It is part of how your registry does its
                  job. When the list is clear and easy to shop from, gifting usually works well for
                  everyone involved. When it is confusing, gifting gets creative in ways that are
                  not always especially helpful.
                </p>

                <LessonImage
                  src="/assets/registrypath/gifts.png"
                  alt="Baby shower gifts — what a clear, well-structured registry makes possible"
                  caption="Clarity is generous on both sides of the shower invitation."
                />

                <p>
                  Clear categories, a reasonable price spread, and a list that feels edited instead
                  of infinite — that is what makes a registry easy to give from. Most guests want
                  direction. They just do not want homework. One clean public list gives them
                  confidence. A dozen scattered links and a few hundred unsorted items does not.
                </p>
                <p>
                  A strong registry usually includes both practical essentials and a few genuinely
                  giftable extras. Function first, then a little room for delight. That is not
                  overcomplicating it. That is just good list design.
                </p>
              </LessonSection>
            </div>

            {/* Divider */}
            <LessonDivider />

            {/* 4 — Taylor's Note */}
            <TaylorsNote>
              <p>
                The thing I see most often is not parents who are lazy about their registries. It is
                parents who are genuinely trying too hard in the wrong direction — more tabs, more
                reviews, more opinions, more categories — without a clear structure underneath any
                of it.
              </p>
              <p>
                The registry path exists because I have watched that spiral happen enough times to
                know it is not a personal failing. The category is noisy on purpose. There are
                entire industries built around making you feel like you have not prepared enough
                yet.
              </p>
              <p>
                The fastest way through is not more research. It is a better sequence. Start with
                function. Build the structure before you touch the products. Let the perks support
                the plan instead of becoming the plan. And accept that a calmer registry is usually
                a more useful one.
              </p>
            </TaylorsNote>

            {/* 5 — Mini Workbook */}
            <MiniWorkbook
              subtitle="Before moving into the full registry path, answer these three questions:"
              prompts={workbookPrompts}
            />

            {/* 6 — Key Takeaways */}
            <KeyTakeaways items={keyTakeaways} />

            {/* 7 — Lesson CTA */}
            <LessonCTA
              heading="Ready to keep going?"
              body="The full Taylor-Made Baby Academy walks you step by step through registry planning, nursery setup, gear decisions, and postpartum preparation."
              primaryLabel="Unlock the Complete Academy"
              primaryHref={null}
              secondaryLabel="Book a Consultation"
              secondaryHref="/consultation"
            />
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
