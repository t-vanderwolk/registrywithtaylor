import SiteShell from '@/components/SiteShell';
import LessonDivider from '@/components/learn/LessonDivider';
import LessonHeader from '@/components/learn/LessonHeader';
import LessonNavStrip from '@/components/learn/LessonNavStrip';
import LessonSection from '@/components/learn/LessonSection';
import LessonVideoPlaceholder from '@/components/learn/LessonVideoPlaceholder';
import TaylorsNote from '@/components/learn/TaylorsNote';
import MiniWorkbook from '@/components/learn/MiniWorkbook';
import KeyTakeaways from '@/components/learn/KeyTakeaways';
import LessonCTA from '@/components/learn/LessonCTA';
import { FREE_PREVIEW_LESSONS, FREE_PREVIEW_LESSON_COUNT } from '@/lib/learn/lessons';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Stroller Foundations — Free Lesson | Taylor-Made Baby Academy',
  description:
    'Understand stroller types, what actually matters in a stroller decision, and how to match a stroller to your real lifestyle. Free preview lesson from Taylor-Made Baby Co.',
  path: '/learn/stroller-foundations',
  imagePath: '/assets/editorial/stroller-folds.jpg',
  imageAlt: 'Stroller foundations lesson preview',
  keywords: [
    'how to choose a stroller',
    'stroller buying guide',
    'best stroller for lifestyle',
    'stroller types explained',
  ],
});

const LESSON_NUMBER = 3;

// ─── Lesson data ──────────────────────────────────────────────────────────────

type StrollerType = {
  type: string;
  bestFor: string;
  tradeoff: string;
};

const strollerTypes: StrollerType[] = [
  {
    type: 'Full-size / Modular',
    bestFor: 'Versatility from newborn through toddler; adaptable seat systems',
    tradeoff: 'Heavier and larger trunk footprint than lighter options',
  },
  {
    type: 'Lightweight / Everyday',
    bestFor: 'Daily use, easy car loading, travel — once baby can hold their head up',
    tradeoff: 'Not always suitable for newborns without a specific infant insert or car seat adapter',
  },
  {
    type: 'Travel System',
    bestFor: 'Stroller and car seat sold or designed together for seamless clicks in and out',
    tradeoff: 'Car seat compatibility must be verified before purchase',
  },
  {
    type: 'Jogger',
    bestFor: 'Active parents who run or walk trails; fixed front wheel provides stability',
    tradeoff: 'Too wide and rigid for tight urban spaces or small trunks',
  },
  {
    type: 'Double',
    bestFor: 'Two children close in age; side-by-side or tandem configurations',
    tradeoff: 'Significantly wider; most doors and some elevators are narrow',
  },
];

const whatMatters = [
  {
    factor: 'Fold mechanics',
    detail:
      'You will fold this stroller dozens of times per week. A complicated or two-handed fold gets old fast. Test the fold before buying whenever possible.',
  },
  {
    factor: 'Weight',
    detail:
      'You will lift this into your trunk regularly, often while holding a baby. The difference between 15 lbs and 28 lbs is not abstract — it compounds over time.',
  },
  {
    factor: 'Footprint folded',
    detail:
      'The stroller needs to fit both in your car trunk and in your front entrance, hallway, or elevator. Measure before committing.',
  },
  {
    factor: 'Recline for newborns',
    detail:
      'Infants need to lie flat or at a very low recline. Verify that the specific stroller supports safe newborn positioning, or that the car seat adapter is available.',
  },
  {
    factor: 'Terrain capability',
    detail:
      'Sidewalk-only living is different from gravel paths, beach boardwalks, or snowy winters. Wheel size and suspension matter here.',
  },
  {
    factor: 'Car seat compatibility',
    detail:
      'If you plan to use the stroller as part of a travel system, confirm that your car seat brand and model is compatible before buying either product.',
  },
  {
    factor: 'Seat longevity',
    detail:
      'Check the weight and height limit. A stroller your child outgrows at 18 months may not serve you as long as you think.',
  },
];

const whatDoesNotMatter = [
  'Cup holder placement — convenient, but not a deciding factor',
  'Color and aesthetics — every stroller gets dirty within weeks',
  'Social media popularity — what performs well in a flat city may be wrong for your terrain',
  'Feature count — more adjustments usually means more weight and complexity',
  'Brand prestige alone — fit for your actual life matters more than the name on the frame',
];

const lifestyleQuestions = [
  'Do you live in a city, suburb, or rural area?',
  'How often do you use public transit, narrow elevators, or crowded spaces?',
  'Do you have stairs at home, in your building, or in places you visit often?',
  'What is your car trunk size — and have you actually measured it?',
  'Do you plan to jog or do trail walking with the stroller?',
  'Will you travel frequently by plane with this stroller?',
  'Do you have or plan to have a second child soon?',
];

const budgetTiers = [
  {
    range: '$150–$350',
    label: 'Entry-level',
    description: 'Functional and safe. Heavier, fewer adjustment points, basic fold mechanics.',
  },
  {
    range: '$350–$700',
    label: 'Mid-range',
    description:
      'Better fold quality, lighter weight, more flexibility in seating configurations and adapter options.',
  },
  {
    range: '$700+',
    label: 'Premium',
    description:
      'Smoother ride, longer longevity, stronger brand ecosystem with accessories and adapters. Worth it only if the specific features match how you will actually use it.',
  },
];

const workbookPrompts = [
  {
    id: 'stroller-use',
    label: 'Where will this stroller be used most? Describe your typical routine.',
    placeholder:
      'City sidewalks, suburban trails, airport travel, neighborhood walks, parking lots, narrow apartment hallways...',
  },
  {
    id: 'car-situation',
    label: 'What is your car situation, and how much trunk space do you have?',
    placeholder:
      'SUV with large trunk, sedan with small trunk, no car, ride-share only, measure if you have not already...',
  },
  {
    id: 'stroller-draw',
    label: 'What stroller type or price point have you been drawn to — and what has been driving that?',
    placeholder:
      'Instagram recommendations, a friend had it, price felt right, looks compact — be honest about what is behind the pull...',
  },
];

const keyTakeaways = [
  'Start with your lifestyle and your trunk, not the stroller model.',
  'Most families need one primary stroller; some need a primary plus a lightweight for travel.',
  'Weight, fold quality, and folded footprint matter more than most listed features.',
  'Car seat compatibility must be confirmed before buying both products.',
  'Test the fold in person whenever possible — it is a daily interaction.',
  'The right stroller is the one you will actually use without dreading it.',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StrollerFoundationsPage() {
  return (
    <SiteShell currentPath="/learn">
      <main className="site-main" style={{ backgroundColor: '#faf9f6' }}>
        {/* Lesson Header */}
        <LessonHeader
          breadcrumbs={[
            { label: 'Academy', href: '/learn' },
            { label: 'Gear Foundations', href: null },
            { label: 'Stroller Foundations', href: null },
          ]}
          title="Stroller Foundations"
          lessonLabel="Free Preview Lesson"
          estimatedMinutes={18}
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
            <LessonSection eyebrow="Overview" title="The most emotionally charged gear decision — simplified.">
              <p>
                Strollers are one of the most researched, most debated, and most over-complicated
                gear decisions expecting parents face. The combination of wide price ranges,
                hundreds of options, and unsolicited opinions from everyone around you makes it
                easy to spend weeks in research paralysis without getting any closer to a clear
                answer.
              </p>
              <p>
                This lesson will not tell you which stroller to buy. What it will do is give you
                a framework for narrowing the category to the options that actually make sense for
                your home, your car, and your daily routine — so when you do look at specific
                models, you are comparing the right things.
              </p>
            </LessonSection>

            {/* 2 — Video placeholder */}
            <LessonVideoPlaceholder />

            <LessonDivider />

            {/* 3 — Core Lesson */}
            <div className="space-y-14">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/72">
                Core Lesson
              </p>

              {/* 3.1 — The five types */}
              <LessonSection stepNumber={1} title="The Five Stroller Types — and What Each One Is Actually For">
                <p>
                  Most stroller confusion starts with mixing up categories. A jogger is designed
                  for running and is too wide for most city apartments. A full-size modular is
                  built for longevity and versatility but may be overkill if your priority is
                  easy folding. Understanding what each type is built for makes elimination
                  faster than comparison.
                </p>

                <div className="mt-6 space-y-3">
                  {strollerTypes.map((item) => (
                    <div
                      key={item.type}
                      className="rounded-[1.1rem] border border-[rgba(215,161,175,0.18)] bg-white px-5 py-4 shadow-[0_4px_14px_rgba(72,49,56,0.04)]"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-5">
                        <p className="min-w-[10rem] font-serif text-[1rem] font-semibold leading-tight tracking-[-0.015em] text-neutral-900 sm:text-[1.05rem]">
                          {item.type}
                        </p>
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-[0.9rem] leading-[1.7] text-neutral-600">
                            <span className="font-medium text-neutral-700">Best for:</span>{' '}
                            {item.bestFor}
                          </p>
                          <p className="text-[0.88rem] leading-[1.65] text-neutral-400">
                            <span className="font-medium text-neutral-500">Trade-off:</span>{' '}
                            {item.tradeoff}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5">
                  Most families only need one stroller. Some benefit from a primary (full-size
                  or modular) and a lightweight option for travel once the baby is old enough.
                  Buying two strollers before birth is rarely necessary.
                </p>
              </LessonSection>

              {/* 3.2 — What actually matters */}
              <LessonSection stepNumber={2} title="What Actually Matters When You Are Evaluating Options">
                <p>
                  Most stroller spec sheets emphasize features. The factors that actually
                  determine whether you will enjoy using a stroller day-to-day are different.
                </p>

                <div className="mt-6 space-y-4">
                  {whatMatters.map((item) => (
                    <div key={item.factor} className="flex gap-4">
                      <div
                        aria-hidden="true"
                        className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[rgba(215,161,175,0.28)] bg-[rgba(232,154,174,0.1)] text-[var(--color-accent-dark)]"
                      >
                        <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5">
                          <circle cx="6" cy="6" r="3" />
                        </svg>
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-[0.95rem] font-semibold text-neutral-800">{item.factor}</p>
                        <p className="text-[0.9rem] leading-[1.72] text-neutral-600">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </LessonSection>

              {/* 3.3 — What doesn't matter */}
              <LessonSection stepNumber={3} title="What Does Not Actually Matter">
                <p>
                  The stroller market is full of features designed to look important on a spec
                  sheet but that have little bearing on daily usability. Recognizing them helps
                  you filter faster.
                </p>
                <ul className="mt-5 space-y-3">
                  {whatDoesNotMatter.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[0.97rem] leading-[1.75] text-neutral-600">
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </LessonSection>

              {/* 3.4 — Lifestyle-match framework */}
              <LessonSection stepNumber={4} title="The Lifestyle-Match Framework">
                <p>
                  Before looking at any specific model, answer these questions honestly. Your
                  answers will eliminate more options than any review, comparison article, or
                  recommendation from someone whose life looks different from yours.
                </p>

                <div className="mt-6 space-y-2.5">
                  {lifestyleQuestions.map((question, index) => (
                    <div
                      key={question}
                      className="flex items-start gap-4 rounded-[0.9rem] border border-[rgba(215,161,175,0.15)] bg-[rgba(255,248,249,0.8)] px-4 py-3.5"
                    >
                      <span className="mt-0.5 font-handwritten-print text-[1.1rem] leading-none text-[var(--color-accent-dark)]/70">
                        {index + 1}.
                      </span>
                      <p className="text-[0.92rem] leading-[1.7] text-neutral-700">{question}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-5">
                  If you have answered these questions and a specific stroller type or model
                  still keeps coming up as the right fit, that is meaningful signal. If you are
                  still unsure, that is useful information too — it means you need more clarity
                  on one of these lifestyle factors before the stroller decision gets easier.
                </p>
              </LessonSection>

              {/* 3.5 — The car seat question */}
              <LessonSection stepNumber={5} title="The Car Seat Question">
                <p>
                  Stroller and car seat decisions are more connected than most parents realize
                  at first. If you plan to use your stroller as part of a travel system —
                  clicking the infant car seat directly into the stroller frame — you need to
                  confirm that your specific car seat and stroller are compatible before buying
                  either one.
                </p>
                <p>
                  Some strollers come sold as a travel system. Others accept universal car seat
                  adapters. Some popular car seat brands have limited stroller compatibility.
                  Finding out after the fact is a common and frustrating mistake.
                </p>
                <div className="mt-5 rounded-[1rem] border border-[rgba(196,156,94,0.2)] bg-[rgba(252,248,242,0.9)] px-5 py-4 text-[0.88rem] leading-[1.75] text-neutral-600">
                  <span className="mr-1.5 font-semibold text-[var(--color-gold-soft)]">CPST note:</span>
                  Before purchasing any infant car seat, consider having a certified Child
                  Passenger Safety Technician (CPST) verify proper fit for your specific
                  vehicle. Car seat fit varies by vehicle model. Taylor is a certified CPST and
                  this is part of what she covers in consultations.
                </div>
              </LessonSection>

              {/* 3.6 — Budget */}
              <LessonSection stepNumber={6} title="Budget and Premium: What the Price Difference Actually Buys">
                <p>
                  The stroller market spans a wide price range. Understanding what the money
                  actually buys — and where the meaningful quality differences are — prevents
                  both overpaying and frustrating under-buying.
                </p>

                <div className="mt-6 space-y-3">
                  {budgetTiers.map((tier) => (
                    <div
                      key={tier.range}
                      className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 rounded-[1.1rem] border border-[rgba(215,161,175,0.18)] bg-white px-5 py-4 shadow-[0_4px_14px_rgba(72,49,56,0.04)] sm:grid-cols-[6rem_auto_1fr]"
                    >
                      <span className="text-[0.78rem] font-semibold text-[var(--color-accent-dark)] sm:row-span-2">
                        {tier.range}
                      </span>
                      <span className="font-serif text-[1rem] font-semibold leading-tight text-neutral-900">
                        {tier.label}
                      </span>
                      <p className="col-span-2 text-[0.9rem] leading-[1.7] text-neutral-600 sm:col-span-1">
                        {tier.description}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-5">
                  The right stroller is not the most expensive one you can justify. It is the
                  one you will actually use without dreading the fold, the lift, or the fit
                  in your space.
                </p>
              </LessonSection>
            </div>

            <LessonDivider />

            {/* 4 — Taylor's Note */}
            <TaylorsNote>
              <p>
                When I work with families on stroller decisions, I almost always start with two
                questions: What is your trunk size? And how often will you be lifting this into
                your car? Those two questions eliminate more options than any spec sheet. A
                stroller that feels effortless at a Strolleria showroom can feel like a workout
                after three weeks of daily loading.
              </p>
              <p>
                The families who end up happiest with their strollers are the ones who chose for
                their real life — not for the aesthetic, not for the brand, and not because it
                is what their favorite influencer pushed last month. Your lifestyle is the filter.
                Everything else is noise.
              </p>
            </TaylorsNote>

            {/* 5 — Mini Workbook */}
            <MiniWorkbook
              subtitle="Before you look at a single stroller model, answer these three questions honestly:"
              prompts={workbookPrompts}
            />

            {/* 6 — Key Takeaways */}
            <KeyTakeaways items={keyTakeaways} />

            {/* 7 — Lesson CTA */}
            <LessonCTA
              heading="You have finished the free preview lessons."
              body="The full Taylor-Made Baby Academy goes deeper on strollers, car seats, nursery setup, registry strategy, and postpartum preparation — all in the same calm, practical format."
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
