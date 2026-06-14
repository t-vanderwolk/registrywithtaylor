import SiteShell from '@/components/SiteShell';
import LessonDivider from '@/components/learn/LessonDivider';
import LessonHeader from '@/components/learn/LessonHeader';
import LessonImage from '@/components/learn/LessonImage';
import LessonNavStrip from '@/components/learn/LessonNavStrip';
import LessonSection from '@/components/learn/LessonSection';
import TaylorsNote from '@/components/learn/TaylorsNote';
import MiniWorkbook from '@/components/learn/MiniWorkbook';
import KeyTakeaways from '@/components/learn/KeyTakeaways';
import LessonCTA from '@/components/learn/LessonCTA';
import LessonBlogLink from '@/components/learn/LessonBlogLink';
import { FREE_PREVIEW_LESSONS, FREE_PREVIEW_LESSON_COUNT } from '@/lib/learn/lessons';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'The Stroller Equation — Free Lesson | Taylor-Made Baby Academy',
  description:
    'The best stroller is not universal — it depends entirely on your life. Learn the variables and all six stroller categories so you can solve the equation with your own data. Free preview lesson from Taylor-Made Baby Co.',
  path: '/learn/stroller-foundations',
  imagePath: '/assets/editorial/strollers.png',
  imageAlt: 'The Stroller Equation lesson preview',
  keywords: [
    'how to choose a stroller',
    'stroller buying guide',
    'best stroller for my lifestyle',
    'stroller types explained',
    'full size vs compact stroller',
  ],
});

const LESSON_NUMBER = 3;

// ─── Life variables ────────────────────────────────────────────────────────────

type StrollerVariable = {
  label: string;
  why: string;
};

const strollerVariables: StrollerVariable[] = [
  {
    label: 'Where you live and what your routes look like',
    why: 'City sidewalks, suburban neighborhoods, gravel paths, grass, and broken pavement all ask for different things from a wheel.',
  },
  {
    label: 'Walk-heavy vs. car-heavy week',
    why: 'A walk-heavy family uses what the bigger frame gives back. A car-heavy family folds and lifts it constantly — and feels that weight every single time.',
  },
  {
    label: 'How tight is your storage',
    why: 'Trunk size, closet depth, building stairs, narrow elevators, and whether someone else has to fit it in their car too. Abstract size becomes very real friction quickly.',
  },
  {
    label: 'Who folds it most — and how many times a day',
    why: 'A fold that feels fine in a showroom feels completely different on your seventh errand of the week. The person doing the loading gets a vote.',
  },
  {
    label: 'How often you travel',
    why: 'Flights, ride shares, visiting family, and grandparent drop-offs are all part of the stroller brief if they happen regularly.',
  },
  {
    label: 'Two seats — now, soon, or not at all',
    why: 'Current two-seat needs, near-term sibling planning, and vague someday thinking are three completely different calculations. Be honest about which one you are actually solving for.',
  },
  {
    label: 'Your car seat compatibility needs',
    why: 'If you plan to click an infant seat into the stroller frame, that compatibility has to be confirmed before you buy either product. Finding out after is a very expensive lesson.',
  },
  {
    label: 'Budget — and what the price difference actually buys',
    why: 'More money usually buys lighter weight, smoother fold, stronger push quality, and a longer-lived frame. It does not always buy the right category.',
  },
];

// ─── Stroller categories ───────────────────────────────────────────────────────

type StrollerCategory = {
  name: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  imageCaption: string;
  definition: string;
  rightFor: string[];
  tradeoff: string;
  passIf: string;
  blogLink?: { href: string; title: string; description: string };
};

const strollerCategories: StrollerCategory[] = [
  {
    name: 'Full Size / Modular',
    tagline: 'The everyday workhorse for families who will actually use what a bigger frame gives back.',
    imageSrc: '/assets/editorial/fullsizemodular.png',
    imageAlt: 'Full size modular stroller — the primary everyday stroller with strong push quality and basket capacity.',
    imageCaption: 'If the stroller shows up four days a week, comfort is not indulgent. It is workflow.',
    definition:
      'Full-size strollers are built for repeated daily use. Better push quality, larger baskets, more recline, and longer seat longevity. You get more stroller — and you feel that in every lift.',
    rightFor: [
      'Walk-heavy routines where you push for long stretches, not just parking lots',
      'Longer outings where seat comfort, canopy coverage, and basket access matter',
      'Families with open storage — large trunk, garage, or dedicated stroller space',
      'Parents who want one capable primary stroller and are fine living with more frame to get it',
    ],
    tradeoff:
      'More weight, more trunk presence, and a bigger fold. The families who regret this category are usually the ones who bought it for the aesthetic and then lived a car-heavy life.',
    passIf:
      'Your week is mostly quick errands and the stroller gets folded three times a day. Full-size earns its keep through use, not through ownership.',
    blogLink: {
      href: '/blog/best-full-size-strollers-2026',
      title: 'The 5 Best Full-Size Strollers of 2026',
      description: 'A real-life comparison of the top full-size strollers — push feel, basket, fold, and who each one actually fits.',
    },
  },
  {
    name: 'Compact / Mid-Size',
    tagline: 'The convenience lane for families who want the stroller to fit their life a little more quietly.',
    imageSrc: '/assets/editorial/compact.png',
    imageAlt: 'Compact lightweight stroller — easier fold, lighter lift, less trunk drama for everyday use.',
    imageCaption: 'Compact is not the consolation prize. For a lot of families, it is the grown-up answer.',
    definition:
      'Compact strollers are lighter, fold smaller, and move through parking lots and tight spaces without the drama. You give up some basket depth and push quality, but most families in this lane never miss what they traded away.',
    rightFor: [
      'Car-heavy routines where the stroller gets folded and lifted frequently',
      'Smaller trunks, tighter storage, or shared caregiver use',
      'Families who prioritize easy exits over long-outing comfort',
      'Parents who want a stroller they will actually reach for instead of dreading',
    ],
    tradeoff:
      'Smaller basket, less substantial seat feel, and a trade-off on push quality over longer distances. Some compact strollers also have a shorter seat longevity than full-size models.',
    passIf:
      'Your week includes long daily walks and you will genuinely miss the larger seat, better suspension, and bigger basket. Compact wins on convenience, not capability.',
    blogLink: {
      href: '/blog/blog-best-compact-strollers-2026',
      title: 'The Best Compact Strollers of 2026',
      description: 'A practical guide to the compact lane — which ones fold cleanest, weigh least, and still feel like enough stroller.',
    },
  },
  {
    name: 'Travel',
    tagline: 'The fold-first lane for families who need the stroller to disappear quickly between places.',
    imageSrc: '/assets/strollers/travel.png',
    imageAlt: 'Travel stroller — compact fold designed for flights, ride shares, and families who move between places.',
    imageCaption: 'The best travel stroller makes transit feel lighter. The worst one is just a small stroller that is annoying in two ways instead of one.',
    definition:
      'Travel strollers are built for transit — airports, ride shares, grandparents\' houses, and any situation where the fold, carry weight, and storage footprint are the whole point. The push experience usually gets quiet when portability is the job.',
    rightFor: [
      'Families who travel by plane regularly and want cabin-bag portability or easy gate check',
      'Ride-share households where the stroller gets pulled in and out of strangers\' trunks',
      'Grandparent-adjacent families who need the stroller to live at multiple homes',
      'Parents who want a genuine second stroller for travel while a primary handles daily life',
    ],
    tradeoff:
      'A smaller fold usually means less basket, less suspension, and a more minimal seat. A travel stroller that earns its keep in transit often feels like it is working harder at the destination.',
    passIf:
      'Travel is occasional and a compact stroller would solve the same problem with more everyday capability. Travel-first only pays off when transit friction is genuinely the recurring job.',
    blogLink: {
      href: '/blog/best-travel-strollers-2026',
      title: 'The Best Travel Strollers of 2026',
      description: 'A real-life breakdown of the travel stroller lane — what folds small enough, carries well, and still pushes decently once you get there.',
    },
  },
  {
    name: 'Single-to-Double Convertible',
    tagline: 'The planning-ahead lane — but only when the second seat has an actual job to do.',
    imageSrc: '/assets/strollers/convertable.png',
    imageAlt: 'Convertible stroller frame that expands from single to double configuration for sibling use.',
    imageCaption: 'Planning ahead is smart. Paying a daily bulk tax for a maybe is not.',
    definition:
      'Convertible strollers are designed to start as a single and expand to accommodate a second child later. This category splits into two distinct approaches — and understanding the difference matters before you buy.',
    rightFor: [
      'Families with a real, near-term sibling timeline who want one strategic purchase',
      'Parents who want to delay a second major stroller purchase without compromising too early',
      'Households where the expansion path is specific, not vague future planning',
    ],
    tradeoff:
      'You live with more frame, more weight, and more complexity before the second seat ever arrives. A convertible that starts too bulky as a single rarely earns back the goodwill once the second seat finally shows up.',
    passIf:
      'The sibling timeline is still fuzzy. Buying bulk for a someday you cannot date usually creates daily frustration long before it creates any value.',
  },
  {
    name: 'Double',
    tagline: 'Two seats now — built for twins, close age gaps, and current sibling reality.',
    imageSrc: '/assets/editorial/double-strollers.jpg',
    imageAlt: 'Double stroller for twins or two children close in age — current two-seat capacity solved honestly.',
    imageCaption: 'Two seats now is a very different question than flexibility later. Buy for the problem you actually have.',
    definition:
      'Double strollers are built for two riders today. Twins, close age gaps, or two children who genuinely both need seats on regular outings. This is a different brief than convertible planning — it is solving a current, present-tense problem.',
    rightFor: [
      'Twins or multiples from day one',
      'Two children close enough in age that both need a seat on most outings',
      'Families who need a dedicated solution now, not a future-flexible frame today',
    ],
    tradeoff:
      'Width, weight, and harder maneuvering. Most doubles do not fit neatly through standard doorways. Tight spaces, narrow aisles, and small elevators become real daily friction.',
    passIf:
      'Only one child rides most of the time. A dedicated double is a lot of daily size to carry for the one afternoon a week both kids are in strollers.',
    blogLink: {
      href: '/blog/bugaboo-donkey-6-stroller-release',
      title: 'The Bugaboo Donkey 6 Has Arrived',
      description: 'A closer look at the updated Donkey 6 — what changed, what it is actually designed for, and who it fits.',
    },
  },
  {
    name: 'Jogging / All-Terrain',
    tagline: 'Built for the families where rough ground or real running is actually part of the routine.',
    imageSrc: '/assets/strollers/revolution.png',
    imageAlt: 'Jogging stroller with larger wheels and suspension designed for running and rough terrain.',
    imageCaption: 'If the ground is doing the arguing, bigger wheels may be the calmer answer.',
    definition:
      'Jogging and all-terrain strollers have larger wheels, stronger suspension, and a fixed or lockable front wheel for stability at speed. They are built for routes that defeat smaller wheels — trails, gravel, broken sidewalks, grass, and actual running.',
    rightFor: [
      'Parents who actively run and want a stroller that keeps up with real jogging pace',
      'Outdoor-heavy families whose routes regularly include rough terrain',
      'Neighborhoods where broken sidewalks, curb gaps, or unpaved paths are the norm',
    ],
    tradeoff:
      'More bulk, larger fold, and a wider frame that becomes conspicuous in stores, restaurants, and tighter urban spaces. A jogging stroller that never jogs is a very large errand cart.',
    passIf:
      'Your routes are mostly smooth surfaces and the appeal is the rugged look rather than a genuine terrain or running need. The bulk only makes sense when the ground earns it.',
  },
];

// ─── Convertible sub-types ─────────────────────────────────────────────────────

const convertibleTypes = [
  {
    type: 'Modular Frame Systems',
    detail:
      'The frame is the product. You build around it. These strollers accept multiple interchangeable seat modules — parent-facing, forward-facing, infant bassinet, car seat adapter, and a second expandable seat — all on the same platform. The frame does not change. The configuration does. Think of it as a stroller system more than a stroller.',
    examples: 'Think UPPAbaby VISTA, Bugaboo Fox, Nuna Demi Grow — frames designed to accept multiple seat types from the same brand ecosystem.',
  },
  {
    type: 'Seat-Specific Convertible',
    detail:
      'The stroller comes with a primary seat that works for one child, and a specific second seat product is designed to attach to that exact frame. Less modular — the expansion path is more defined and usually narrower. You are not building a system; you are adding one specific seat to one specific stroller.',
    examples: 'Frames where the second seat or glider board has one clear attachment point and the expansion options do not flex much beyond the brand\'s designated solution.',
  },
];

// ─── Workbook & takeaways ──────────────────────────────────────────────────────

const workbookPrompts = [
  {
    id: 'your-routine',
    label: 'Describe a typical week. Is it more walk-heavy or car-heavy? How often does the stroller actually get folded?',
    placeholder:
      'Neighborhood walks daily, grocery runs by car, two trips to the park, one errand-heavy afternoon — be specific about what the stroller actually needs to do...',
  },
  {
    id: 'storage-situation',
    label: 'What does your storage actually look like — trunk, hallway, elevator, stairs?',
    placeholder:
      'Sedan with a small trunk, third-floor walkup, narrow apartment entry, no garage — measure if you have not already...',
  },
  {
    id: 'two-seats',
    label: 'Do you need two seats now, on a real near-term timeline, or is this still a vague someday?',
    placeholder:
      'Second child due in X months, already have a toddler + newborn, single child and no plans for siblings, somewhere in between — be honest about which calculation you are actually solving...',
  },
];

const keyTakeaways = [
  'There is no best stroller. There is only the right stroller for your specific life.',
  'Plug in your variables before you look at a single model — route, storage, fold frequency, travel, and family timing.',
  'Walk-heavy families get value from full size. Car-heavy families usually get sanity from compact.',
  'Travel strollers solve transit friction. They are not an upgrade on compact — they are a different job.',
  'Convertible strollers only make sense when the second seat has a real, near-term timeline behind it.',
  'Modular systems give you seat configuration flexibility. Seat-specific convertibles give you one defined expansion path.',
  'Double strollers solve a current problem. Do not buy one for a maybe.',
  'Jogging and all-terrain earn their bulk only when the ground or pace actually demands it.',
  'Test the fold yourself. In your trunk. Without the brand rep stepping in to help.',

];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function StrollerFoundationsPage() {
  return (
    <SiteShell currentPath="/learn">
      <main className="site-main" style={{ backgroundColor: '#faf9f6' }}>
        {/* Lesson Header */}
        <LessonHeader
          breadcrumbs={[
            { label: 'Academy', href: '/learn' },
            { label: 'Gear Foundations', href: null },
            { label: 'The Stroller Equation', href: null },
          ]}
          title="The Stroller Equation"
          lessonLabel="Free Preview Lesson"
          estimatedMinutes={20}
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
            <LessonSection eyebrow="Overview" title="The best stroller for someone else might be completely wrong for you.">
              <p>
                Strollers are one of the most researched and most emotionally charged gear
                decisions in the whole baby prep process. People spend weeks in comparison tabs,
                come out more confused than when they started, and eventually buy whatever an
                influencer recommended to someone in a different city with a different car and
                a completely different life.
              </p>

              <LessonImage
                src="/assets/editorial/strollers.png"
                alt="Stroller options — the category is wide because the lives using them are wide"
                priority
              />

              <p>
                The category is wide because the lives using strollers are wide. A stroller that
                is perfect for a walk-heavy urban family with a large trunk is genuinely wrong for
                a car-heavy suburban family with a small sedan and two kids. Neither family is
                confused. They just have different variables.
              </p>
              <p>
                This lesson is about the equation, not the answer. First you will learn all the
                variables that shape a stroller decision. Then you will get a clear breakdown of
                every category — full size, compact, travel, single-to-double convertible (and
                the two very different types within that), double, and jogging. Once the equation
                is clear, the right category usually resolves faster than the internet made it look.
              </p>
            </LessonSection>

            <LessonDivider />

            {/* 3 — Core Lesson */}
            <div className="space-y-14">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/72">
                Core Lesson
              </p>

              {/* 3.1 — The variables */}
              <LessonSection stepNumber={1} title="Plug in your variables before you look at a single model">
                <p>
                  Most stroller shopping starts too late — at the product comparison stage — before
                  anyone has answered the questions that actually determine which category fits.
                  These are the variables that change the answer. Yours are different from everyone
                  else&apos;s. That is the point.
                </p>

                <div className="mt-6 space-y-3">
                  {strollerVariables.map((variable, index) => (
                    <div
                      key={variable.label}
                      className="rounded-[1.1rem] border border-[rgba(215,161,175,0.18)] bg-white px-5 py-4 shadow-[0_4px_14px_rgba(72,49,56,0.04)]"
                    >
                      <div className="flex gap-4">
                        <span className="mt-0.5 shrink-0 font-serif text-[1.05rem] font-semibold leading-tight text-[var(--color-accent-dark)]">
                          {index + 1}.
                        </span>
                        <div className="min-w-0 space-y-1.5">
                          <p className="font-semibold text-[0.95rem] leading-tight text-neutral-900">
                            {variable.label}
                          </p>
                          <p className="text-[0.88rem] leading-[1.7] text-neutral-500">
                            {variable.why}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-5">
                  If you answer these questions honestly, you will eliminate more stroller
                  categories than any comparison article ever will. The equation gets faster
                  the more specific your variables are.
                </p>
              </LessonSection>

              {/* 3.2 — The categories */}
              <LessonSection stepNumber={2} title="The six stroller categories — what each one actually solves">
                <p>
                  Each category is built for a different job. Understanding what job a stroller
                  was designed to do makes it easy to tell whether that job matches your actual
                  week — or belongs to someone else&apos;s.
                </p>

                <div className="mt-8 space-y-12">
                  {strollerCategories.map((category) => (
                    <div key={category.name} className="space-y-5">

                      {/* Category header */}
                      <div className="space-y-1">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
                          Stroller Category
                        </p>
                        <h3 className="font-serif text-[1.55rem] leading-[1.04] tracking-[-0.03em] text-neutral-900 sm:text-[1.8rem]">
                          {category.name}
                        </h3>
                        <p className="text-[0.97rem] italic leading-[1.7] text-neutral-500">
                          {category.tagline}
                        </p>
                      </div>

                      {/* Category image */}
                      <LessonImage
                        src={category.imageSrc}
                        alt={category.imageAlt}
                        caption={category.imageCaption}
                      />

                      {/* Definition */}
                      <p className="text-[1rem] leading-[1.85] text-neutral-600">
                        {category.definition}
                      </p>

                      {/* Convertible sub-types inline */}
                      {category.name === 'Single-to-Double Convertible' && (
                        <div className="space-y-3 rounded-[1.25rem] border border-[rgba(215,161,175,0.2)] bg-[rgba(255,248,249,0.6)] px-5 py-5 sm:px-6">
                          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
                            Two distinct types — and the difference matters
                          </p>
                          {convertibleTypes.map((type) => (
                            <div key={type.type} className="space-y-1.5 border-t border-[rgba(215,161,175,0.18)] pt-4 first:border-0 first:pt-0">
                              <p className="font-semibold text-[0.95rem] text-neutral-800">
                                {type.type}
                              </p>
                              <p className="text-[0.9rem] leading-[1.75] text-neutral-600">
                                {type.detail}
                              </p>
                              <p className="text-[0.83rem] leading-[1.65] text-neutral-400">
                                {type.examples}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Right for */}
                      <div className="space-y-2">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                          Right for
                        </p>
                        <ul className="space-y-2">
                          {category.rightFor.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-[0.93rem] leading-[1.75] text-neutral-600">
                              <span
                                aria-hidden="true"
                                className="mt-[0.48rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tradeoff + Pass if */}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1rem] border border-[rgba(215,161,175,0.18)] bg-white px-4 py-3.5">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                            The tradeoff
                          </p>
                          <p className="mt-1.5 text-[0.88rem] leading-[1.72] text-neutral-600">
                            {category.tradeoff}
                          </p>
                        </div>
                        <div className="rounded-[1rem] border border-[rgba(215,161,175,0.18)] bg-white px-4 py-3.5">
                          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                            Pass if
                          </p>
                          <p className="mt-1.5 text-[0.88rem] leading-[1.72] text-neutral-600">
                            {category.passIf}
                          </p>
                        </div>
                      </div>

                      {/* Per-category blog link */}
                      {category.blogLink && (
                        <LessonBlogLink
                          href={category.blogLink.href}
                          title={category.blogLink.title}
                          description={category.blogLink.description}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </LessonSection>

              {/* 3.3 — One universal rule */}
              <LessonSection stepNumber={3} title="One rule that applies to every category">
                <p>
                  Test the fold yourself. In your trunk. Without the brand representative stepping
                  in to help. If you cannot fold it cleanly and lift it into your car in under
                  ten seconds without a tutorial, you will dread that interaction every single day.
                </p>

                <LessonImage
                  src="/assets/editorial/stroller-folds.jpg"
                  alt="Stroller fold and lift — the test that tells you more than any spec sheet or showroom demo"
                  caption="The fold is a daily interaction. Test it like one."
                />

                <p>
                  The other thing worth knowing: weight on a spec sheet feels very different from
                  weight in a parking lot at 6 PM when you are holding the baby, the diaper bag,
                  and your own unraveling patience. The difference between 18 lbs and 26 lbs is
                  not abstract. It compounds over weeks.
                </p>
                <p>
                  Car seat compatibility deserves a separate check before you buy anything.
                  If you plan to click an infant seat into the stroller frame, confirm that your
                  specific car seat model is compatible with your specific stroller model before
                  you purchase either one. Not the brand. The model. Finding out after is a very
                  expensive and very avoidable lesson.
                </p>
                <LessonBlogLink
                  href="/blog/taylor-made-baby-co-lani-car-seat-partnership"
                  title="Taylor-Made Baby Co. Announces Partnership with Lani Car Seat Installation Specialist"
                  description="Why car seat installation matters, what a CPST actually checks, and how to get it done right before baby arrives."
                />
              </LessonSection>

            </div>

            <LessonDivider />

            {/* 4 — Taylor's Note */}
            <TaylorsNote>
              <p>
                When I work with families on strollers, I almost never start with the stroller.
                I start with the trunk. Then I ask who is doing the folding and how often. Then I
                ask whether the week is mostly car-heavy or walk-heavy. By the time I have those
                three answers, at least two or three categories have already eliminated themselves.
              </p>
              <p>
                The families who end up happiest with their strollers are not the ones who bought
                the most popular option. They are the ones who bought the option that matched their
                actual week — the route they walk, the car they drive, the storage they have, and
                the lifestyle they are actually living, not the one that photographs best.
              </p>
              <p>
                Your variables are the whole equation. The category resolves itself once you know
                what you are actually solving for.
              </p>
            </TaylorsNote>

            {/* 5 — Mini Workbook */}
            <MiniWorkbook
              subtitle="Before comparing a single stroller model, answer these three questions with your actual life in mind:"
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
