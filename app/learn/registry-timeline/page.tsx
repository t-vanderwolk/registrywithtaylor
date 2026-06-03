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
  title: 'The Registry Timeline — Free Lesson | Taylor-Made Baby Academy',
  description:
    'A month-by-month guide to when to start your registry, when to finalize it, and what to do at every stage of pregnancy. Free preview lesson from Taylor-Made Baby Co.',
  path: '/learn/registry-timeline',
  imagePath: '/assets/editorial/registry.jpg',
  imageAlt: 'The Registry Timeline lesson preview',
  keywords: [
    'baby registry timeline',
    'when to start a baby registry',
    'registry planning by trimester',
    'registry checklist by month',
  ],
});

const LESSON_NUMBER = 2;

// ─── Timeline phase data ──────────────────────────────────────────────────────

type TimelinePhase = {
  weeks: string;
  label: string;
  title: string;
  focus: string;
  actions: string[];
  note?: string;
};

const timelinePhases: TimelinePhase[] = [
  {
    weeks: '8–14 weeks',
    label: 'First Trimester',
    title: 'Start with intention, not products.',
    focus: 'Orientation and category mapping',
    actions: [
      'Open one or two retailer registries to activate welcome box perks early',
      'Research which retailers fit your needs — not just the most popular ones',
      'Begin thinking through lifestyle: how you live, where gear will go, who will help',
      'Avoid adding specific products yet — this is a research phase, not a buying phase',
      'Make note of categories that feel confusing or overwhelming',
    ],
    note: 'Opening a registry early costs you nothing and starts the welcome-gift clock at most retailers.',
  },
  {
    weeks: '14–26 weeks',
    label: 'Second Trimester',
    title: 'Your best research window.',
    focus: 'Active research and intentional adding',
    actions: [
      'Research strollers, car seats, and sleep gear — the big decisions',
      'Compare products within categories before committing to specific items',
      'Add products you have actually researched, not products you have just seen',
      'Decide on retailers: most families benefit from registering at 2–3 strategic locations',
      'Build your category framework — make sure every major area has at least a placeholder',
      'Share registry links with whoever is planning your shower',
    ],
    note: 'The second trimester is the calm before the urgency. Use it. You have time to think clearly right now.',
  },
  {
    weeks: '27–34 weeks',
    label: 'Third Trimester — Before the Shower',
    title: 'Finalize before the gifts arrive.',
    focus: 'Review, refine, and lock in decisions',
    actions: [
      'Do a full registry audit — remove anything you added impulsively or no longer want',
      'Make sure every category has clear, researched options',
      'Add higher-priority items near the top so guests see them first',
      'Confirm your most important items are in stock at reasonable prices',
      'Set up price alerts on big-ticket items you plan to purchase yourself',
      'Finalize your shower registry link — what guests see should reflect your actual plan',
    ],
    note: 'Your registry is a communication tool for your guests. A well-organized registry makes gifting easier for everyone.',
  },
  {
    weeks: '34–38 weeks',
    label: 'After the Shower',
    title: 'The real work starts here.',
    focus: 'Completion discount window and final purchases',
    actions: [
      'Activate your retailer completion discount as soon as your window opens (most open 60 days before due date)',
      'Review what was gifted and what still needs to be purchased',
      'Use completion discounts on high-ticket items: stroller, car seat, crib if applicable',
      'Return or exchange anything that no longer fits your plan',
      'Price-match anything you have already purchased if better prices appeared',
      'Stock essentials: diapers, wipes, feeding supplies, postpartum recovery items',
    ],
    note: "Most families leave completion discounts on the table because they do not know the window is limited. Check each retailer's policy now.",
  },
  {
    weeks: '36–40 weeks',
    label: 'Before Baby Arrives',
    title: 'What actually needs to be ready.',
    focus: 'Installation, setup, and true essentials only',
    actions: [
      'Car seat installed and checked — this is the one non-negotiable',
      'Sleep surface set up and safe: firm, flat, and separate',
      'At least 2 weeks of diaper and wipe supply on hand',
      'Feeding setup ready: bottles, formula if using, nursing supplies if breastfeeding',
      'Postpartum supplies in place: recovery items, snacks, easy-reach water station',
      'Everything else can wait — babies need less than most registries suggest in the first days',
    ],
    note: 'A stressed parent in week 38 does not need to build anything. The goal is clarity about what actually needs to happen before you go into labor.',
  },
];

const workbookPrompts = [
  {
    id: 'trimester',
    label: 'What trimester are you in right now, and how does your registry feel at this stage?',
    placeholder:
      'Early and nervous, mid-way and overwhelmed, late and rushing — wherever you are is the right place to start...',
  },
  {
    id: 'registry-status',
    label: 'Have you opened a registry anywhere yet? If so, where?',
    placeholder:
      'Target, Amazon, Buy Buy Baby, Babylist — and if not, what has been holding you back...',
  },
  {
    id: 'urgency',
    label: 'What feels most urgent to figure out right now?',
    placeholder:
      'Car seat, stroller, nursery, shower timing, completion discounts, postpartum prep...',
  },
];

const keyTakeaways = [
  'Starting before you feel ready is better than waiting until you feel rushed.',
  'The second trimester is the best research window — use the calm intentionally.',
  'Open retailer registries early to activate welcome box perks and completion discount timelines.',
  'Your shower is not the endpoint — it is the start of the final purchasing phase.',
  'Completion discount windows are time-sensitive and often missed. Know yours.',
  'Before birth, focus only on the true essentials: car seat, sleep setup, feeding supplies.',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegistryTimelinePage() {
  return (
    <SiteShell currentPath="/learn">
      <main className="site-main" style={{ backgroundColor: '#faf9f6' }}>
        {/* Lesson Header */}
        <LessonHeader
          breadcrumbs={[
            { label: 'Academy', href: '/learn' },
            { label: 'Registry Foundations', href: null },
            { label: 'The Registry Timeline', href: null },
          ]}
          title="The Registry Timeline"
          lessonLabel="Free Preview Lesson"
          estimatedMinutes={12}
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
            <LessonSection eyebrow="Overview" title="Timing your registry is as important as building it.">
              <p>
                Most parents know they should build a registry. Fewer know when — and the timing
                matters more than most people realize. A registry built too late gets rushed. A
                registry that never gets updated becomes a source of guilt and second-guessing.
                And the practical perks built into the retailer system go unused when families
                do not know the windows exist.
              </p>
              <p>
                This lesson is a month-by-month guide to what actually needs to happen, when it
                should happen, and why the sequence matters. You do not need to do everything at
                once. You need to do the right things at the right time.
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

              {/* Timeline phases */}
              {timelinePhases.map((phase, index) => (
                <div key={phase.label} className="space-y-6">
                  {/* Phase card header */}
                  <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(180deg,rgba(255,248,249,0.9)_0%,rgba(255,244,246,0.85)_100%)] px-5 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(215,161,175,0.3)] bg-white text-[0.78rem] font-bold text-[var(--color-accent-dark)] shadow-[0_4px_12px_rgba(216,137,160,0.12)]">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-dark)]">
                          {phase.label}
                        </span>
                        <span className="text-[0.72rem] text-neutral-400">{phase.weeks}</span>
                      </div>
                      <p className="mt-1 font-serif text-[1.15rem] leading-tight tracking-[-0.025em] text-neutral-900 sm:text-[1.3rem]">
                        {phase.title}
                      </p>
                    </div>
                    <div className="sm:ml-auto">
                      <span className="inline-flex items-center rounded-full bg-[rgba(0,0,0,0.04)] px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-neutral-400">
                        {phase.focus}
                      </span>
                    </div>
                  </div>

                  {/* Action list */}
                  <ul className="space-y-3 pl-2">
                    {phase.actions.map((action) => (
                      <li key={action} className="flex items-start gap-3.5 text-[0.97rem] leading-[1.75] text-neutral-600">
                        <span
                          aria-hidden="true"
                          className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                        />
                        {action}
                      </li>
                    ))}
                  </ul>

                  {/* Optional inline note */}
                  {phase.note && (
                    <div className="rounded-[1rem] border border-[rgba(196,156,94,0.2)] bg-[rgba(252,248,242,0.9)] px-5 py-4 text-[0.88rem] leading-[1.75] text-neutral-600">
                      <span className="mr-1.5 font-semibold text-[var(--color-gold-soft)]">Note:</span>
                      {phase.note}
                    </div>
                  )}

                  {/* Connector between phases */}
                  {index < timelinePhases.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="ml-[1.25rem] h-8 w-px bg-[linear-gradient(180deg,rgba(215,161,175,0.4)_0%,rgba(215,161,175,0.1)_100%)]"
                    />
                  )}
                </div>
              ))}
            </div>

            <LessonDivider />

            {/* 4 — Taylor's Note */}
            <TaylorsNote>
              <p>
                The advice I give most often about registry timing is simple: the window between
                feeling ready and feeling rushed is shorter than it looks. Most families I work
                with wish they had started their research a few weeks earlier — not because they
                were behind, but because having a little more time made the decisions feel much
                calmer.
              </p>
              <p>
                You do not need a finished registry today. You need a clear sense of where you
                are in the process and what the next right step is. That is what this timeline
                is designed to give you.
              </p>
            </TaylorsNote>

            {/* 5 — Mini Workbook */}
            <MiniWorkbook
              subtitle="Reflect on where you are in the registry timeline right now:"
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
