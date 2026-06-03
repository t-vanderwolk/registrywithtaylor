import SiteShell from '@/components/SiteShell';
import LessonHeader from '@/components/learn/LessonHeader';
import LessonSection from '@/components/learn/LessonSection';
import TaylorsNote from '@/components/learn/TaylorsNote';
import MiniWorkbook from '@/components/learn/MiniWorkbook';
import KeyTakeaways from '@/components/learn/KeyTakeaways';
import LessonCTA from '@/components/learn/LessonCTA';
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

const registryCategories = [
  'Sleep',
  'Feeding',
  'Diapering',
  'Bath',
  'Travel',
  'Gear',
  'Health & Safety',
  'Postpartum',
  'Home & Organization',
];

const lifestyleFactors = [
  'Where you live',
  'How much space you have',
  'How you move through the day',
  'Who will help care for the baby',
  'Your feeding preferences',
  'Your sleep setup',
  'Your travel habits',
  'Your budget and gifting community',
];

const thoughtfulQuestions = [
  'Does this fit my space?',
  'Does this fit my routine?',
  'Will I actually use it?',
  'Is this solving a real problem?',
  'Is this worth the storage space?',
];

const keyTakeaways = [
  'A registry is a planning tool, not just a product list.',
  'Start with categories before choosing products.',
  'Your lifestyle should guide your decisions.',
  'The best registry supports both baby and parent.',
  'Thoughtful choices beat trendy ones.',
];

const workbookPrompts = [
  {
    id: 'daily-routine',
    label: 'What does a normal day in your home look like?',
    placeholder:
      'Think about your morning, midday, and evening rhythms — work schedule, who else is home, how much you move around...',
  },
  {
    id: 'gear-space',
    label: 'Where do you expect baby gear to live in your space?',
    placeholder:
      'Apartment, house, shared rooms, storage limitations, car situation, stroller storage...',
  },
  {
    id: 'support-system',
    label: 'What kind of support would make the first few months feel easier?',
    placeholder:
      'Partner involvement, family nearby, feeding preferences, postpartum help, household help...',
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
          progressLabel="Lesson 1 of 3 Free Preview Lessons"
        />

        {/* Main lesson body */}
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="space-y-14">

            {/* 1 — Overview */}
            <LessonSection eyebrow="Overview" title="Why most registries are built backwards.">
              <p>
                Most baby registries are built backwards. Parents start by adding products before
                they have a clear sense of their lifestyle, space, priorities, or support system.
                That is how registries become overwhelming, overfilled, and oddly unhelpful.
              </p>
              <p>
                The goal of a registry is not to collect as much as possible. The goal is to build
                a thoughtful support system for the first year of your baby&apos;s life.
              </p>
            </LessonSection>

            {/* 2 — Watch / Learn placeholder */}
            <div>
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-accent-dark)]/72">
                Watch + Learn
              </p>
              <div className="flex aspect-video w-full items-center justify-center rounded-[1.35rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(180deg,rgba(255,248,249,0.96)_0%,rgba(253,244,240,0.94)_100%)]">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(215,161,175,0.28)] bg-white shadow-[0_8px_20px_rgba(72,49,56,0.06)]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-7 w-7 text-[var(--color-accent-dark)]"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M10 8.5l5 3.5-5 3.5V8.5Z" fill="currentColor" />
                    </svg>
                  </div>
                  <p className="mt-4 text-[0.82rem] font-medium text-neutral-500">
                    Video lesson coming soon
                  </p>
                  <p className="mt-1 text-[0.78rem] text-neutral-400">
                    Continue with the written lesson below
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="h-px w-full bg-[linear-gradient(90deg,transparent_0%,rgba(215,161,175,0.3)_30%,rgba(215,161,175,0.3)_70%,transparent_100%)]"
            />

            {/* 3 — Core Lesson */}
            <div className="space-y-12">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/72">
                Core Lesson
              </p>

              {/* 3.1 */}
              <LessonSection stepNumber={1} title="Your Registry Is Not a Shopping Cart">
                <p>
                  A registry is not simply a list of things people say parents need. The most
                  helpful registry is one that reflects how your family actually lives — not how
                  someone else lives, not what a retailer recommends, and not what went viral on
                  social media last week.
                </p>
                <p>Before adding a single product, your registry should reflect:</p>
                <ul className="mt-4 space-y-2.5">
                  {lifestyleFactors.map((factor) => (
                    <li key={factor} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  When those pieces are in place, the product decisions become far easier. When
                  they are missing, even the most popular gear can feel like a mistake once it
                  arrives.
                </p>
              </LessonSection>

              {/* 3.2 */}
              <LessonSection stepNumber={2} title="Most Registry Mistakes Come From Starting Too Late">
                <p>
                  When parents wait until the second or third trimester to build a registry — or
                  rush it all in one afternoon because a shower deadline is approaching — the
                  results are predictable. Rushed decisions lead to copied lists, impulse adds,
                  and gear that never quite fits the life it was meant to support.
                </p>
                <p>
                  Starting early gives you time to think through each category deliberately,
                  research at a pace that feels calm, and make decisions based on your actual
                  needs rather than someone else&apos;s. A registry built with intention is a
                  registry you will actually use.
                </p>
              </LessonSection>

              {/* 3.3 */}
              <LessonSection stepNumber={3} title="A Better Registry Starts With Categories, Not Products">
                <p>
                  Before you search for a specific stroller or crib, spend time with the
                  categories first. Understanding what each category covers — and what you
                  actually need within it — makes individual product decisions faster, clearer,
                  and less overwhelming.
                </p>
                <p>The nine core registry categories are:</p>
                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {registryCategories.map((cat) => (
                    <div
                      key={cat}
                      className="rounded-[0.85rem] border border-[rgba(215,161,175,0.18)] bg-[rgba(255,248,249,0.9)] px-4 py-3 text-[0.88rem] font-medium text-neutral-700"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
                <p className="mt-5">
                  Once the categories are clear, each product slot has a defined role. You stop
                  adding things because they look useful and start evaluating them against a
                  real need.
                </p>
              </LessonSection>

              {/* 3.4 */}
              <LessonSection stepNumber={4} title="The Registry Should Support the Parent Too">
                <p>
                  The word &ldquo;baby registry&rdquo; puts the focus entirely on the baby — but
                  a strong registry supports the whole household. Postpartum recovery takes longer
                  than most families expect. Feeding setups affect sleep schedules. A disorganized
                  changing station at 3 AM is a different problem than it sounds.
                </p>
                <p>
                  Your registry should include items for the parent recovering postpartum:
                  comfort supplies, feeding tools (whether breastfeeding or bottle-feeding),
                  household systems that reduce friction, and the kinds of support tools that make
                  the first few weeks feel manageable rather than chaotic.
                </p>
                <p>
                  A registry that only accounts for the baby is a registry that misses half the
                  picture.
                </p>
              </LessonSection>

              {/* 3.5 */}
              <LessonSection stepNumber={5} title="Thoughtful Beats Trendy">
                <p>
                  The most viral product is not always the right product for your family. What
                  works beautifully for one home, one lifestyle, or one baby may be unnecessary,
                  uncomfortable, or simply wrong for yours.
                </p>
                <p>
                  Before adding anything to your registry, ask these questions:
                </p>
                <ul className="mt-4 space-y-3">
                  {thoughtfulQuestions.map((question) => (
                    <li key={question} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  If the answer to any of these is &ldquo;no&rdquo; or &ldquo;I&apos;m not
                  sure,&rdquo; that product probably does not belong on the list yet.
                </p>
              </LessonSection>
            </div>

            {/* Divider */}
            <div
              aria-hidden="true"
              className="h-px w-full bg-[linear-gradient(90deg,transparent_0%,rgba(215,161,175,0.3)_30%,rgba(215,161,175,0.3)_70%,transparent_100%)]"
            />

            {/* 4 — Taylor's Note */}
            <TaylorsNote>
              <p>
                After years of helping parents build registries, one thing has become very clear:
                overwhelm is universal. Whether a family is shopping at Target or comparing luxury
                strollers, the real challenge is not finding more options. It is knowing which
                options actually make sense for their life.
              </p>
              <p>That is why I always start with lifestyle before products.</p>
            </TaylorsNote>

            {/* 5 — Mini Workbook */}
            <MiniWorkbook prompts={workbookPrompts} />

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
