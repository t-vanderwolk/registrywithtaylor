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
import { FREE_PREVIEW_LESSONS, FREE_PREVIEW_LESSON_COUNT } from '@/lib/learn/lessons';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Nursery Foundations — Free Lesson | Taylor-Made Baby Academy',
  description:
    'Everything you actually need to know about setting up a nursery — sleep spaces, furniture, layout, storage, and safety. Free preview lesson from Taylor-Made Baby Co.',
  path: '/learn/nursery-foundations',
  imagePath: '/assets/nurserypath/nurseryplanning.png',
  imageAlt: 'Nursery planning setup for the Nursery Foundations lesson.',
  keywords: [
    'nursery setup guide',
    'how to set up a baby nursery',
    'nursery furniture essentials',
    'sleep space for baby',
    'nursery planning',
  ],
});

const LESSON_NUMBER = 2;

const sleepSystemPieces = [
  'Bedside bassinet — the early-weeks convenience play. Close, accessible, short-lived.',
  'Mini crib — the most underrated option. Moves with your day. Can replace multiple early setups.',
  'Pack and play — the everywhere-else lane. Travel, downstairs naps, another caregiver\'s house.',
  'Standard crib — the long-term nursery anchor. You are buying a crib. That is it.',
];

const dailyFurniturePieces = [
  'A crib or sleep space — the primary safe-sleep foundation',
  'A place to change your baby — ideally part of the storage setup, not separate from it',
  'Storage for clothing and essentials — accessible, not impressive',
];

const furnitureSubcategories = [
  {
    name: 'Cribs',
    detail: 'Safe sleep first, mattress fit second. Convertibility is the third thing, not the first.',
  },
  {
    name: 'Gliders',
    detail: 'This is comfort furniture and work furniture. Buy for feeding posture, not the room photo.',
  },
  {
    name: 'Dressers & Changing',
    detail: 'One dual-purpose move that keeps storage and diapering in the same zone.',
  },
  {
    name: 'Diaper Pails',
    detail: 'Odor control versus refill cost. Know the tradeoff before you fall for the packaging.',
  },
  {
    name: 'Baby Monitors',
    detail: 'Reliability over feature count. Simple controls that work when you are tired.',
  },
  {
    name: 'Baby Proofing',
    detail: 'Anchor first, cord-check second. The calm version happens before mobility shows up.',
  },
];

const layoutPrinciples = [
  'Clear walking paths — you should move through the space without thinking, especially at night',
  'Essentials within arm\'s reach — the faster the setup makes the next step obvious, the better it works',
  'Lighting that supports nighttime — soft and reachable, not overhead and punishing',
  'Three zones: sleep, care, and comfort — each one telling you quietly where the next job lives',
];

const keyTakeaways = [
  'Start with how you actually live, not with a product list.',
  'Sleep spaces work as a system — most families end up using more than one.',
  'Mini cribs are the most underrated option in this entire conversation.',
  'Only buy the furniture you will touch daily. Everything else should earn its space.',
  'Gliders are work furniture. Buy for the fourth feed, not the first photo.',
  'One dresser-plus-topper setup usually beats a dedicated changing table and separate storage.',
  'Layout works best when you design for 2 AM, not the afternoon when the light is good.',
  'The best nurseries are the easiest to live in. Calm beats decorated every time.',
];

const workbookPrompts = [
  {
    id: 'night-setup',
    label: 'What does your nighttime routine actually need to look like for the first few weeks?',
    placeholder:
      'Where will baby sleep? Are you room-sharing? How close does the sleep setup need to be? What does 3 AM look like when you are very tired...',
  },
  {
    id: 'daily-furniture',
    label: 'What furniture will you actually use every single day?',
    placeholder:
      'Think through changing setup, storage, feeding chair, the crib — what gets touched constantly vs what just fills the room...',
  },
  {
    id: 'layout-flow',
    label: 'Can you walk from the door to the crib and back in the dark without thinking about it?',
    placeholder:
      'Where are the clear paths? Where are the obstacles? What needs to move or be within arm\'s reach before the room is truly functional...',
  },
];

export default function NurseryFoundationsPage() {
  return (
    <SiteShell currentPath="/learn">
      <main className="site-main" style={{ backgroundColor: '#faf9f6' }}>
        {/* Lesson Header */}
        <LessonHeader
          breadcrumbs={[
            { label: 'Academy', href: '/learn' },
            { label: 'Nursery', href: null },
            { label: 'Nursery Foundations', href: null },
          ]}
          title="Nursery Foundations"
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
            <LessonSection eyebrow="Overview" title="Most nursery advice starts with products. This one starts with your life.">
              <p>
                The TMBC Nursery Path has six modules, and none of them begin with a shopping cart.
                They begin with how you actually move through your day, where your baby will
                realistically spend time, and what the word &ldquo;easy&rdquo; looks like
                specifically for you at 2 AM in a dark room.
              </p>

              <LessonImage
                src="/assets/nurserypath/nurseryplanning.png"
                alt="Nursery planning setup — where the right decisions start before any product is chosen"
                priority
              />

              <p>
                That is a different starting point than most people use. Most people open a browser
                and start comparing cribs. The families who feel confident later on usually started
                somewhere else entirely — with the space, the routine, and a clear sense of what
                the room actually needs to do.
              </p>
              <p>
                This lesson is a complete walkthrough of everything the nursery path covers: sleep
                spaces, furniture, layout, storage, and how the room comes together around calm and
                safety instead of a category checklist.
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

              {/* 3.1 — Vision & Lifestyle */}
              <LessonSection stepNumber={1} title="Start with your space and how you actually live">
                <p>
                  Before you choose a single product, your nursery decisions should be grounded in
                  how your day works. Not the aspirational version. The actual one.
                </p>

                <LessonImage
                  src="/assets/nurserypath/simplenursery.png"
                  alt="Simple, uncluttered nursery built around how a family actually lives rather than how a room is supposed to look"
                  caption="The right setup is the one that fits the life you are actually living."
                />

                <p>
                  That means thinking through things like: how quickly you move in the mornings,
                  whether you spend most of your time at home, how much complexity you genuinely
                  want to manage, and — most usefully — how the room needs to work when you are
                  tired and it is dark and you are running on almost nothing.
                </p>
                <p>
                  Nighttime is where your setup gets honest. The most beautiful nurseries are
                  irrelevant at 3 AM if you are negotiating furniture to reach the baby. Small
                  decisions about where things are placed become large ones when your eyes are
                  barely open.
                </p>
                <p>
                  For some families, easy means minimal. Fewer pieces, less to manage, nothing
                  the room does not truly need. For others, easy means fully prepared — multiple
                  stations, convenience optimized, comfort corners. Neither is wrong. What matters
                  is building toward your version, not the one that photographs best.
                </p>
              </LessonSection>

              {/* 3.2 — Sleep Space */}
              <LessonSection stepNumber={2} title="Sleep spaces work as a system, not a single product">
                <p>
                  You do not need to pick one perfect sleep setup. Most newborns sleep in more
                  than one place because real life happens in more than one place. That is not a
                  sign you did something wrong. It is usually a sign your setup is keeping up with
                  your day.
                </p>

                <LessonImage
                  src="/assets/nurserypath/criblifestyle.png"
                  alt="Standard crib in a nursery setting — the long-term sleep anchor in a multi-piece system"
                  caption="A standard crib is the long-term anchor. It does not need to be the only piece."
                />

                <p>
                  The four main sleep setups and what they each handle:
                </p>
                <ul className="mt-4 space-y-3">
                  {sleepSystemPieces.map((piece) => (
                    <li key={piece} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span className="text-[1rem] leading-[1.85] text-neutral-600">{piece}</span>
                    </li>
                  ))}
                </ul>

                <LessonImage
                  src="/assets/nurserypath/dadadaminicrib.png"
                  alt="Mini crib — a flexible, room-to-room sleep setup that is the most underrated option in nursery planning"
                  caption="Mini cribs do not lock you into one room. The good ones move with your day."
                  aspectRatio="4/3"
                />

                <p>
                  Mini cribs are the most underrated choice in this whole conversation. For some
                  families they can replace multiple early setups — they handle bedside access and
                  room-to-room flexibility without asking you to buy three products for three
                  different short phases.
                </p>
                <p>
                  The practical case for pack and plays: if you will use it often, buy the sturdier
                  version from the start. Choose the model whose fold, sleep surface, and setup
                  already feel good enough for regular use. Do not buy the minimal version planning
                  to upgrade it.
                </p>

                <LessonImage
                  src="/assets/nurserypath/packandplay.png"
                  alt="Pack and play portable sleep setup — the everywhere-else lane for travel, secondary sleep, and flexible daily use"
                  caption="Pack and plays are the real-life MVP because they handle the everywhere-else lane."
                />
              </LessonSection>

              {/* 3.3 — Furniture */}
              <LessonSection stepNumber={3} title="Only buy the furniture you will touch every single day">
                <p>
                  Once your sleep setup is clear, furniture gets much simpler. This is where most
                  parents overbuy — not because they want to, but because it is hard to tell what
                  actually matters when every category claims to be essential in slightly different
                  fonts.
                </p>
                <p>The furniture you will actually use every day is a very short list:</p>
                <ul className="mt-4 space-y-2.5">
                  {dailyFurniturePieces.map((piece) => (
                    <li key={piece} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span>{piece}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  Anything beyond that should earn its place. Here is how each category actually
                  works:
                </p>

                <div className="mt-6 space-y-4">
                  {furnitureSubcategories.map((cat) => (
                    <div
                      key={cat.name}
                      className="rounded-[1.1rem] border border-[rgba(215,161,175,0.15)] bg-[rgba(255,248,249,0.7)] px-5 py-4"
                    >
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-dark)]">
                        {cat.name}
                      </p>
                      <p className="mt-1.5 text-[0.97rem] leading-[1.75] text-neutral-600">
                        {cat.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <LessonImage
                  src="/assets/nurserypath/glider.png"
                  alt="Nursery glider — comfort furniture and work furniture, chosen for feeding posture not room aesthetics"
                  caption="A glider becomes one of the most-used pieces in the room. Buy it for the fourth feed, not the first photo."
                />

                <p>
                  On cribs specifically: safe sleep and mattress fit are the lead decisions, in
                  that order. Convertibility is a reasonable third consideration — not a reason to
                  pay a premium before the current sleep setup has been solved cleanly.
                </p>
                <p>
                  On dressers and changing: one dresser with a changing topper usually beats a
                  dedicated changing table plus separate storage because it keeps daily supplies
                  and the changing surface in the same zone and still works after the diaper years.
                  That is a better use of the space.
                </p>

                <LessonImage
                  src="/assets/nurserypath/dadadadresser.png"
                  alt="Nursery dresser with changing setup — storage and diapering solved in one furniture move"
                  caption="The dresser-plus-topper setup is the strongest long-term value move in this whole category."
                />
              </LessonSection>

              {/* 3.4 — Layout & Flow */}
              <LessonSection stepNumber={4} title="The room works at 2 AM or it does not work">
                <p>
                  A functional nursery is different from a beautiful nursery. Layout determines
                  how easy the day feels — and more importantly, how the night feels.
                </p>

                <LessonImage
                  src="/assets/nurserypath/space.png"
                  alt="Open nursery layout with clear walking paths designed for how the room works in real use"
                  caption="Clear paths matter more than perfect styling. If you have to negotiate furniture at midnight, the layout is asking too much."
                />

                <p>The four layout principles that matter most:</p>
                <ul className="mt-4 space-y-3">
                  {layoutPrinciples.map((principle) => (
                    <li key={principle} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent-dark)]"
                      />
                      <span className="text-[1rem] leading-[1.85] text-neutral-600">{principle}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4">
                  Think in zones: sleep, care, and comfort. That makes the room easier to use and
                  easier to navigate when you are tired. A room that quietly tells you where each
                  job lives usually feels calmer without needing more space to do it.
                </p>
              </LessonSection>

              {/* 3.5 — Storage */}
              <LessonSection stepNumber={5} title="You do not need more storage — you need better access">
                <p>
                  Most nursery overwhelm comes not from a lack of space but from not knowing where
                  things go or how quickly the room stops resetting itself when life gets busy.
                </p>

                <LessonImage
                  src="/assets/nurserypath/storagelifestyle.png"
                  alt="Calm nursery storage setup with everyday essentials accessible and the room easy to maintain"
                  caption="The simpler the system, the easier it is to keep working on the busiest days."
                />

                <p>
                  Three things make a storage system actually useful: you can grab what you need
                  quickly (especially during a diaper change or nighttime moment), the system is
                  simple enough to maintain after a few weeks of sleep deprivation, and it can
                  adapt as needs change — because they will change, often and quickly.
                </p>
                <p>
                  Over-complicated storage setups look impressive for about a week. Then they
                  become the pile in the corner and a source of mild shame. Build for simplicity
                  and change from the start.
                </p>
              </LessonSection>

              {/* 3.6 — Atmosphere & Safety */}
              <LessonSection stepNumber={6} title="Calm beats decorated. Every time.">
                <p>
                  The last nursery module brings the room together around atmosphere and safety.
                  These are not afterthoughts — they are where the setup earns its keep.
                </p>

                <LessonImage
                  src="/assets/nurserypath/serenenursery.png"
                  alt="Serene, calm nursery that prioritizes ease of use and simplicity over decoration"
                  caption="The best nurseries are not the most decorated. They are the easiest to live in."
                />

                <p>
                  Lighting shapes how the space feels. Soft, warm, and within reach is almost
                  always more useful than overhead and bright. If you have to squint and adjust
                  every time you enter the room at night, the lighting is working against you.
                </p>

                <LessonImage
                  src="/assets/nurserypath/hatchsoundmachine.png"
                  alt="Sound machine in the nursery — creates consistency in the sleep environment without over-engineering the room"
                  caption="Sound can help create consistency around sleep without turning the room into a sensory experiment."
                />

                <p>
                  Safe sleep basics are not optional. The principle is: simple, clear, no
                  unnecessary additions. The sleep surface should be firm, flat, and empty. The
                  setup gets stronger as it gets simpler, not the other way around.
                </p>
                <p>
                  On baby proofing: most people plan to do it later. Then later shows up rolling,
                  reaching, and pulling with deeply unearned confidence. The calm version of baby
                  proofing — anchoring furniture, checking cords, clearing reach zones — happens
                  before mobility makes it urgent. Start with the highest-risk items and add layers
                  as your baby changes. It is not a one-time event.
                </p>

                <LessonImage
                  src="/assets/nurserypath/nurserylifestyle.png"
                  alt="Nursery lifestyle image showing a room that works in real daily life, not just in photographs"
                  caption="When the room feels calm and clear, it asks less of you. That is the goal."
                />
              </LessonSection>
            </div>

            <LessonDivider />

            {/* 4 — Taylor's Note */}
            <TaylorsNote>
              <p>
                The most common thing I hear from parents who are setting up their nursery is that
                they feel behind. They have not researched enough, decided enough, or bought enough.
                The room is not done and neither are they.
              </p>
              <p>
                What I have learned after years of walking through this with families is that the
                most prepared rooms are not the most stocked ones. They are the ones where someone
                slowed down early enough to ask what the room actually needs to do — and then built
                around that question instead of around a category checklist.
              </p>
              <p>
                The nursery does not need to be perfect before your baby arrives. It needs to be
                functional. Clear paths, essentials nearby, a safe sleep setup, and lighting you
                can actually use without waking everyone up at 2 AM. That is it. Everything else
                is optional and most of it is patient.
              </p>
            </TaylorsNote>

            {/* 5 — Mini Workbook */}
            <MiniWorkbook
              subtitle="Before making any nursery purchases, work through these three questions:"
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
