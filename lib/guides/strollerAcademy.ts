import { getStrollerProductExamples } from '@/lib/data/products/strollers';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';
import { getGuidePath } from '@/lib/guides/routing';
import {
  STROLLER_CATEGORY_GUIDE_SLUGS,
  getStrollerCategoryGuideConfig,
  type StrollerCategoryGuideSlug,
} from '@/lib/guides/strollerCluster';
import type { GuideHubIconKey } from '@/lib/guides/hubs';
import { getStrollerSystemCategory } from '@/lib/guides/strollerSystem';

export type AcademyStageId = 'learn' | 'plan' | 'try' | 'buy';

export type AcademyStageDefinition = {
  id: AcademyStageId;
  label: string;
  title: string;
  description: string;
};

export type AcademyLearnModule = {
  title: string;
  description: string;
  icon: GuideHubIconKey;
  bullets: string[];
};

export type AcademyChecklistStatus = 'check' | 'watch' | 'ask';

export type AcademyChecklistItem = {
  label: string;
  detail?: string;
  status: AcademyChecklistStatus;
};

export type AcademyChecklistSection = {
  title: string;
  description?: string;
  items: AcademyChecklistItem[];
};

export type AcademyConsultCard = {
  title: string;
  description: string;
  placeholderLabel: string;
  note: string;
};

export type AcademyFlowchartNode = {
  id: string;
  title: string;
  description: string;
  icon: GuideHubIconKey;
  outcomes: Array<{
    label: string;
    detail: string;
    href?: string;
  }>;
};

export type AcademyPlanningQuestionOption = {
  id: string;
  label: string;
  description: string;
  insight: string;
  laneScores: Partial<Record<StrollerCategoryGuideSlug, number>>;
};

export type AcademyPlanningQuestion = {
  id: string;
  prompt: string;
  description: string;
  options: AcademyPlanningQuestionOption[];
};

export type AcademyLaneLesson = {
  title: string;
  body: string;
};

export type StrollerAcademyLane = {
  slug: StrollerCategoryGuideSlug;
  title: string;
  shortTitle: string;
  href: string;
  icon: GuideHubIconKey;
  definition: string;
  heroDescription: string;
  bestFor: string;
  tradeoff: string;
  everydayFeel: string;
  whyExists: string;
  expertTip: string;
  signatureMoment: string;
  worksForSummary: string;
  worksForBullets: string[];
  notBestFitSummary: string;
  notBestFitBullets: string[];
  compareAgainst: StrollerCategoryGuideSlug[];
  compareNote: string;
  lessons: AcademyLaneLesson[];
  testSections: AcademyChecklistSection[];
  buyNote: string;
  productExamples: GuideProductExampleData[];
};

type LaneCustomContent = {
  definition: string;
  everydayFeel: string;
  whyExists: string;
  expertTip: string;
  compareAgainst: StrollerCategoryGuideSlug[];
  compareNote: string;
  lessons: AcademyLaneLesson[];
  testSections: AcademyChecklistSection[];
  buyNote: string;
};

export const STROLLER_ACADEMY_STAGES: AcademyStageDefinition[] = [
  {
    id: 'learn',
    label: 'Learn',
    title: 'Understand the stroller lanes first.',
    description: 'Start with how stroller jobs differ before brand comparison takes over.',
  },
  {
    id: 'plan',
    label: 'Plan',
    title: 'Match the right lane to real life.',
    description: 'Use your routine, storage, travel, and family timing to narrow the fit.',
  },
  {
    id: 'try',
    label: 'Try',
    title: 'Pressure-test the fit in the real world.',
    description: 'Validate fold, push, storage, and configuration before you buy in theory.',
  },
  {
    id: 'buy',
    label: 'Buy',
    title: 'Buy once with more confidence.',
    description: 'Save, compare, and shortlist the strollers that genuinely fit your week.',
  },
];

export const STROLLER_ACADEMY_LEARN_MODULES: AcademyLearnModule[] = [
  {
    title: 'Your real life matters more than the product page.',
    description:
      'Parents usually do not buy the wrong stroller because they missed a feature. They buy the wrong stroller because they skipped the workflow question.',
    icon: 'road',
    bullets: [
      'Drive-heavy and walk-heavy weeks need different kinds of stroller help.',
      'Tight trunks, stairs, elevators, and storage closets are part of the decision.',
      'Who folds the stroller matters almost as much as who pushes it.',
    ],
  },
  {
    title: 'A stroller is a workflow tool, not a baby trophy.',
    description:
      'The real job is not to look polished in a parking lot. It is to make errands, naps, transfers, and daily movement feel less annoying.',
    icon: 'strategy',
    bullets: [
      'Basket access, fold behavior, and one-hand steering affect ordinary days.',
      'Canopy, seat comfort, and curb handling matter when outings run long.',
      'The best stroller is the one you still like after a tired grocery run.',
    ],
  },
  {
    title: 'The lane usually comes before the shortlist.',
    description:
      'Most stroller overwhelm eases up once the category is clear. Then the product comparison becomes much smaller and much less dramatic.',
    icon: 'layers',
    bullets: [
      'Full-size, compact, and travel solve the most common one-child routines.',
      'Convertible, double, and jogging solve more specialized family or route questions.',
      'Choosing the lane first keeps future shopping from turning into tab-based performance art.',
    ],
  },
];

export const STROLLER_ACADEMY_FLOWCHART: AcademyFlowchartNode[] = [
  {
    id: 'two-seats',
    title: 'Need two seats now?',
    description: 'Start by separating current sibling logistics from future planning.',
    icon: 'double',
    outcomes: [
      {
        label: 'Yes, now or immediately',
        detail: 'Begin with the Double lane. A current two-seat need should outrank hypothetical flexibility.',
        href: getGuidePath({ slug: 'double-strollers' }),
      },
      {
        label: 'Not yet',
        detail: 'Keep going. The next question is whether planning ahead is actually part of this purchase.',
      },
    ],
  },
  {
    id: 'future-child',
    title: 'Planning another child soon?',
    description: 'Near-term family math can justify a convertible lane. Vague someday math usually does not.',
    icon: 'calendar',
    outcomes: [
      {
        label: 'Yes, on a real timeline',
        detail: 'Convertible is worth comparing if the second seat has an actual job to do later.',
        href: getGuidePath({ slug: 'convertible-strollers' }),
      },
      {
        label: 'No, or not clear yet',
        detail: 'Keep the focus on the stroller that fits present-day life best.',
      },
    ],
  },
  {
    id: 'storage-travel',
    title: 'Is portability the friction point?',
    description: 'If the stroller mostly lives in the trunk, the fold and lift get a louder vote.',
    icon: 'storage',
    outcomes: [
      {
        label: 'Yes, travel or storage pressure is constant',
        detail: 'Travel and Compact become the main comparison.',
        href: getGuidePath({ slug: 'travel-strollers' }),
      },
      {
        label: 'No, the stroller stays out and in use',
        detail: 'Keep moving toward the everyday-use lanes.',
      },
    ],
  },
  {
    id: 'route',
    title: 'What do your routes ask for?',
    description: 'Smooth sidewalks, long walks, rough terrain, and fast errands do not need the same stroller answer.',
    icon: 'terrain',
    outcomes: [
      {
        label: 'Daily walks and longer outings',
        detail: 'Full-Size / Modular usually makes the most sense.',
        href: getGuidePath({ slug: 'full-size-modular-strollers' }),
      },
      {
        label: 'Quick errands and tight storage',
        detail: 'Compact usually wins when convenience is the recurring job.',
        href: getGuidePath({ slug: 'compact-lightweight-strollers' }),
      },
      {
        label: 'Rough routes or jogging plans',
        detail: 'Jogging / All-Terrain earns its bulk when the ground is the problem.',
        href: getGuidePath({ slug: 'jogging-all-terrain-strollers' }),
      },
    ],
  },
];

export const STROLLER_ACADEMY_TRY_CHECKLIST: AcademyChecklistSection[] = [
  {
    title: 'What to test with your own hands',
    description: 'These are the moves that expose whether a stroller fits your actual week.',
    items: [
      { label: 'Fold it fully and lift it into your trunk', detail: 'Do it without the brand rep stepping in.', status: 'check' },
      { label: 'Push with one hand', detail: 'Especially while turning or navigating a doorway.', status: 'check' },
      { label: 'Check turning radius', detail: 'A tight aisle or coffee shop corner tells the truth quickly.', status: 'check' },
      { label: 'Reach the basket with the seat reclined', detail: 'Storage only counts if you can still use it.', status: 'check' },
      { label: 'Notice seat comfort and child placement', detail: 'A stroller can look roomy and still feel awkward in use.', status: 'check' },
      { label: 'Adjust the handlebar', detail: 'Comfort for the adult still matters after minute three.', status: 'check' },
      { label: 'Test the future seat setup if applicable', detail: 'Especially for convertible and double paths.', status: 'watch' },
    ],
  },
  {
    title: 'Ask this in store or on a consult',
    items: [
      { label: 'Show me the real fold', detail: 'Not the best-case fold with no bag, no baby, and infinite patience.', status: 'ask' },
      { label: 'What do parents regret most?', detail: 'This usually gets to size, weight, or setup friction fast.', status: 'ask' },
      { label: 'Does this feel bulky as a single?', detail: 'Especially important for convertible systems.', status: 'ask' },
      { label: 'What changes when I add a second seat?', detail: 'Useful for convertible or double comparisons.', status: 'ask' },
      { label: 'Which setup actually fits my life?', detail: 'The answer should sound like your routes, not a spec sheet.', status: 'ask' },
    ],
  },
];

export const STROLLER_ACADEMY_CONSULT_CARDS: AcademyConsultCard[] = [
  {
    title: 'Target Baby Concierge',
    description: 'Use this when you want a lower-pressure in-store check on fold, steering, and car-seat setup questions.',
    placeholderLabel: '[CTA_PLACEHOLDER: Book Target Baby Concierge]',
    note: 'Best for quick in-person validation and hands-on stroller testing.',
  },
  {
    title: 'MacroBaby Consult',
    description: 'Useful when you want a broader side-by-side comparison, either virtually or in person.',
    placeholderLabel: '[CTA_PLACEHOLDER: Schedule MacroBaby Consult]',
    note: 'Best for seeing multiple stroller lanes in one session.',
  },
  {
    title: 'Hip Baby Gear Virtual Session',
    description: 'Helpful when you want a specialty-gear conversation without committing to store traffic first.',
    placeholderLabel: '[CTA_PLACEHOLDER: Book Hip Baby Gear Virtual Session]',
    note: 'Best for expert walkthroughs and honest category comparison.',
  },
];

export const STROLLER_ACADEMY_PLANNING_QUESTIONS: AcademyPlanningQuestion[] = [
  {
    id: 'two-seats-now',
    prompt: 'Do you need two seats now?',
    description: 'This question splits current sibling logistics from future planning.',
    options: [
      {
        id: 'yes-now',
        label: 'Yes, now or right away',
        description: 'Two children will genuinely need seats soon.',
        insight: 'A current two-seat need usually points toward a dedicated double solution first.',
        laneScores: { 'double-strollers': 6, 'convertible-strollers': 2 },
      },
      {
        id: 'not-yet',
        label: 'No, not right now',
        description: 'We are still solving one-child life first.',
        insight: 'Present-day single-stroller use should stay louder than future flexibility if two seats are not current.',
        laneScores: {
          'full-size-modular-strollers': 2,
          'compact-lightweight-strollers': 2,
          'travel-strollers': 2,
          'jogging-all-terrain-strollers': 2,
        },
      },
    ],
  },
  {
    id: 'future-child-soon',
    prompt: 'Are you planning another child soon?',
    description: 'Near-term family timing changes the convertible conversation quite a bit.',
    options: [
      {
        id: 'yes-soon',
        label: 'Yes, on a real timeline',
        description: 'Future sibling planning is part of this purchase.',
        insight: 'Convertible strollers earn their bulk only when future expansion is real enough to matter now.',
        laneScores: { 'convertible-strollers': 6, 'double-strollers': 1, 'full-size-modular-strollers': 1 },
      },
      {
        id: 'not-sure',
        label: 'Not sure yet',
        description: 'We do not want to buy daily bulk for a maybe.',
        insight: 'When the second-child timeline is still fuzzy, buying for current life usually leads to less regret.',
        laneScores: { 'full-size-modular-strollers': 2, 'compact-lightweight-strollers': 2, 'travel-strollers': 1 },
      },
      {
        id: 'no',
        label: 'No, current life is the whole question',
        description: 'This stroller just needs to fit the life we have.',
        insight: 'Keeping the decision in the present usually narrows the field to the primary stroller lanes quickly.',
        laneScores: {
          'full-size-modular-strollers': 2,
          'compact-lightweight-strollers': 3,
          'travel-strollers': 2,
          'jogging-all-terrain-strollers': 2,
        },
      },
    ],
  },
  {
    id: 'routine-shape',
    prompt: 'Is your week more car-heavy or walk-heavy?',
    description: 'This is often the clearest split between convenience-first and comfort-first lanes.',
    options: [
      {
        id: 'car-heavy',
        label: 'Mostly car-heavy',
        description: 'The stroller gets folded and lifted a lot.',
        insight: 'When trunk life is the recurring routine, easier lifting and folding deserve a louder vote.',
        laneScores: { 'compact-lightweight-strollers': 5, 'travel-strollers': 4, 'convertible-strollers': 1 },
      },
      {
        id: 'walk-heavy',
        label: 'Mostly walk-heavy',
        description: 'Neighborhood walks and longer outings are common.',
        insight: 'Walk-heavy routines usually justify more stroller because push feel, basket access, and comfort get used.',
        laneScores: { 'full-size-modular-strollers': 5, 'jogging-all-terrain-strollers': 3, 'convertible-strollers': 2 },
      },
      {
        id: 'mixed',
        label: 'Fairly mixed',
        description: 'We need a stroller that balances both.',
        insight: 'Mixed routines often live in the tension between full-size capability and compact convenience.',
        laneScores: { 'full-size-modular-strollers': 3, 'compact-lightweight-strollers': 3, 'convertible-strollers': 2 },
      },
    ],
  },
  {
    id: 'storage',
    prompt: 'How tight is storage?',
    description: 'Closets, trunks, elevators, and stairs turn abstract size into real friction.',
    options: [
      {
        id: 'very-tight',
        label: 'Very tight',
        description: 'Small trunk, small closet, or regular stairs.',
        insight: 'Tight storage pushes portability and folded size much higher on the priority list.',
        laneScores: { 'travel-strollers': 5, 'compact-lightweight-strollers': 4, 'jogging-all-terrain-strollers': 1 },
      },
      {
        id: 'manageable',
        label: 'Manageable',
        description: 'Some constraints, but not a constant fight.',
        insight: 'Moderate storage pressure usually keeps compact and full-size in the same conversation.',
        laneScores: { 'compact-lightweight-strollers': 3, 'full-size-modular-strollers': 2, 'travel-strollers': 2 },
      },
      {
        id: 'open',
        label: 'Not really an issue',
        description: 'Space is not the thing making this hard.',
        insight: 'When storage is not the bottleneck, comfort, future use, and route quality can matter more.',
        laneScores: {
          'full-size-modular-strollers': 3,
          'convertible-strollers': 3,
          'double-strollers': 2,
          'jogging-all-terrain-strollers': 2,
        },
      },
    ],
  },
  {
    id: 'travel',
    prompt: 'How often do you travel?',
    description: 'Flights, ride shares, grandparents, and road trips can create a very different stroller brief.',
    options: [
      {
        id: 'often',
        label: 'Often',
        description: 'Travel is part of real life, not a one-off fantasy.',
        insight: 'Travel-heavy routines usually reward a stroller that lowers transit friction first.',
        laneScores: { 'travel-strollers': 6, 'compact-lightweight-strollers': 3, 'full-size-modular-strollers': 1 },
      },
      {
        id: 'sometimes',
        label: 'Sometimes',
        description: 'We need some portability, but not a whole second identity.',
        insight: 'Occasional travel usually points toward compact before true travel-only minimalism.',
        laneScores: { 'compact-lightweight-strollers': 4, 'travel-strollers': 3, 'full-size-modular-strollers': 2 },
      },
      {
        id: 'rarely',
        label: 'Rarely',
        description: 'This stroller is mostly for home life.',
        insight: 'If travel is rare, everyday use usually deserves the louder vote.',
        laneScores: {
          'full-size-modular-strollers': 3,
          'convertible-strollers': 2,
          'double-strollers': 2,
          'jogging-all-terrain-strollers': 2,
        },
      },
    ],
  },
  {
    id: 'terrain',
    prompt: 'Do rough routes or jogging matter?',
    description: 'Wheel size only earns its keep when the ground keeps making small wheels annoying.',
    options: [
      {
        id: 'yes-rough',
        label: 'Yes, rough routes or jogging matter',
        description: 'Broken sidewalks, gravel, trails, or real jogging plans are in the mix.',
        insight: 'If the ground is the thing arguing with your stroller, bigger wheels may be the calmer answer.',
        laneScores: { 'jogging-all-terrain-strollers': 6, 'full-size-modular-strollers': 3 },
      },
      {
        id: 'somewhat',
        label: 'Somewhat, but not constantly',
        description: 'We need decent performance without a dedicated running frame.',
        insight: 'Occasional rough ground often keeps the decision between full-size and a specialized terrain lane.',
        laneScores: { 'full-size-modular-strollers': 4, 'jogging-all-terrain-strollers': 3, 'compact-lightweight-strollers': 1 },
      },
      {
        id: 'smooth',
        label: 'Mostly smooth surfaces',
        description: 'The stroller is living on sidewalks, stores, and paved paths.',
        insight: 'Smooth-surface routines usually reward lighter, simpler, or more storage-friendly lanes.',
        laneScores: { 'compact-lightweight-strollers': 3, 'travel-strollers': 2, 'double-strollers': 2, 'convertible-strollers': 2 },
      },
    ],
  },
  {
    id: 'priority',
    prompt: 'What sounds best right now?',
    description: 'This is the tie-breaker between lightweight, full-featured, and future-flexible.',
    options: [
      {
        id: 'lightweight',
        label: 'Lightweight and easy to carry',
        description: 'I want less stroller overall.',
        insight: 'A strong portability preference usually narrows the fit to compact or travel quickly.',
        laneScores: { 'compact-lightweight-strollers': 5, 'travel-strollers': 4 },
      },
      {
        id: 'full-featured',
        label: 'Full-featured and comfortable',
        description: 'I want one strong primary stroller.',
        insight: 'If comfort and capability matter more than the smallest fold, full-size usually stays in front.',
        laneScores: { 'full-size-modular-strollers': 5, 'jogging-all-terrain-strollers': 2, 'convertible-strollers': 2 },
      },
      {
        id: 'future-flexible',
        label: 'Future-flexible and expandable',
        description: 'I want to understand the family-growth path clearly.',
        insight: 'Future flexibility can be useful, but it should still earn its everyday size and weight.',
        laneScores: { 'convertible-strollers': 5, 'double-strollers': 2, 'full-size-modular-strollers': 1 },
      },
    ],
  },
];

const LANE_CUSTOM_CONTENT: Record<StrollerCategoryGuideSlug, LaneCustomContent> = {
  'full-size-modular-strollers': {
    definition: 'The everyday lane when the stroller is part of normal life, not just the occasional trunk appearance.',
    everydayFeel: 'Steady, capable, and built to stay in rotation.',
    whyExists:
      'This lane exists for parents who need a stroller to carry the week well: longer walks, deeper baskets, smoother handling, and a seat that feels ready for repeated use.',
    expertTip: 'If the stroller shows up in your ordinary week, comfort and handling are not extra credit.',
    compareAgainst: ['compact-lightweight-strollers', 'travel-strollers', 'convertible-strollers'],
    compareNote:
      'Compare against Compact when lifting and storage are the recurring headache. Compare against Convertible if future sibling planning is starting to shape the decision.',
    lessons: [
      {
        title: 'Why parents choose it',
        body: 'It feels calmer once the stroller is doing real daily work instead of cameo appearances.',
      },
      {
        title: 'Best for',
        body: 'Walk-heavy routines, longer outings, basket use, and families who want one primary stroller that feels capable.',
      },
      {
        title: 'Tradeoff',
        body: 'You pay for comfort with more frame, more lift, and more stroller living in your trunk or closet.',
      },
    ],
    testSections: [
      {
        title: 'Test this before buying full-size',
        items: [
          { label: 'Push it one-handed over a curb or threshold', status: 'check' },
          { label: 'Load the basket with something real', detail: 'A big basket only matters if it stays accessible.', status: 'check' },
          { label: 'Fold it into your real trunk height', status: 'check' },
          { label: 'Check seat recline and canopy coverage', status: 'check' },
        ],
      },
      {
        title: 'Ask before you commit',
        items: [
          { label: 'Will this still feel manageable in quick errand mode?', status: 'ask' },
          { label: 'Do parents actually keep this as the primary stroller?', status: 'ask' },
          { label: 'What are the most common storage complaints?', status: 'ask' },
        ],
      },
    ],
    buyNote: 'Buy full-size when the stroller is part of your week. Skip it when it mostly lives folded in the trunk.',
  },
  'compact-lightweight-strollers': {
    definition: 'The convenience lane for families who want less stroller to lift, fold, store, and live with.',
    everydayFeel: 'Lighter, quicker, and easier to reset between outings.',
    whyExists:
      'This lane exists because many families do not need the biggest stroller. They need the stroller that feels easiest to use in trunks, closets, errands, and tighter spaces.',
    expertTip: 'Compact is usually a lifestyle answer, not a compromise answer.',
    compareAgainst: ['full-size-modular-strollers', 'travel-strollers', 'convertible-strollers'],
    compareNote:
      'Compare against Full-Size when longer walks and bigger baskets still matter. Compare against Travel if flights and transit are the true job.',
    lessons: [
      {
        title: 'Why parents choose it',
        body: 'The daily fold-and-lift routine starts to matter more than maximum stroller presence.',
      },
      {
        title: 'Best for',
        body: 'Car-heavy routines, smaller homes, shared caregiver use, and parents who want easier everyday storage.',
      },
      {
        title: 'Tradeoff',
        body: 'You usually give up some basket size, seat substance, or long-walk comfort to get the lighter footprint.',
      },
    ],
    testSections: [
      {
        title: 'Test this before buying compact',
        items: [
          { label: 'Lift it with one hand', detail: 'Especially while holding the diaper bag.', status: 'check' },
          { label: 'Practice the fold without watching the rep', status: 'check' },
          { label: 'Push it through a tight aisle or doorway', status: 'check' },
          { label: 'Check basket access once the seat reclines', status: 'watch' },
        ],
      },
      {
        title: 'Ask before you commit',
        items: [
          { label: 'Does this feel like enough stroller for longer outings?', status: 'ask' },
          { label: 'What do parents usually miss compared with full-size?', status: 'ask' },
          { label: 'Would this work as a primary stroller or better as a second?', status: 'ask' },
        ],
      },
    ],
    buyNote: 'Compact wins when convenience keeps showing up in your week. It loses when you keep wishing for more stroller.',
  },
  'travel-strollers': {
    definition: 'The fold-first lane for families who need easier transit, smaller storage pressure, and less stroller overall.',
    everydayFeel: 'Smaller, faster, and built for the moments between places.',
    whyExists:
      'This lane exists to solve movement friction: airports, ride shares, grandparents, tiny trunks, and quick outings where the fold matters almost as much as the push.',
    expertTip: 'Travel-first only works when portability is the real job, not just a category fantasy.',
    compareAgainst: ['compact-lightweight-strollers', 'full-size-modular-strollers'],
    compareNote:
      'Compare against Compact if the stroller is mostly for local life with occasional trips. Compare against Full-Size if destination comfort matters more than transit ease.',
    lessons: [
      {
        title: 'Why parents choose it',
        body: 'It makes travel and high-movement days feel less like a gear negotiation.',
      },
      {
        title: 'Best for',
        body: 'Flights, ride shares, grandparents, tiny trunks, and families who want the stroller to disappear faster between uses.',
      },
      {
        title: 'Tradeoff',
        body: 'A smaller fold often means less basket, less suspension, and a more minimal feel once you arrive.',
      },
    ],
    testSections: [
      {
        title: 'Test this before buying travel',
        items: [
          { label: 'Fold and carry it one-handed', status: 'check' },
          { label: 'Check the carry handle or shoulder strap in real motion', status: 'check' },
          { label: 'Push it for more than a parking-lot lap', status: 'check' },
          { label: 'Load the seat and basket with the travel day in mind', status: 'watch' },
        ],
      },
      {
        title: 'Ask before you commit',
        items: [
          { label: 'How does this behave at the destination, not just in transit?', status: 'ask' },
          { label: 'What do parents regret after the honeymoon phase?', status: 'ask' },
          { label: 'Would compact make more sense if travel is only occasional?', status: 'ask' },
        ],
      },
    ],
    buyNote: 'Do not buy the tiniest stroller in the conversation. Buy the one that makes travel easier without becoming annoying on arrival.',
  },
  'convertible-strollers': {
    definition: 'The planning-ahead lane for single-to-double systems when future sibling timing is real enough to matter now.',
    everydayFeel: 'Flexible, thoughtful, and best when current life can tolerate more stroller for future value.',
    whyExists:
      'This lane exists for families trying to make one strategic purchase for today and tomorrow. It only works when the expansion path is useful enough to earn the present-day size and complexity.',
    expertTip: 'Planning for your life matters more than planning for the stroller.',
    compareAgainst: ['double-strollers', 'full-size-modular-strollers', 'compact-lightweight-strollers'],
    compareNote:
      'Compare against Double if the second seat is immediate. Compare against Full-Size if current life still mostly needs one excellent stroller now.',
    lessons: [
      {
        title: 'Why parents choose it',
        body: 'The second child feels real enough that future expansion could genuinely change what they buy now.',
      },
      {
        title: 'Best for',
        body: 'Families who want to understand single-to-double planning before buying a stroller twice.',
      },
      {
        title: 'Tradeoff',
        body: 'You often live with more frame, more weight, and more complexity before the second seat ever shows up.',
      },
    ],
    testSections: [
      {
        title: 'Test this before buying convertible',
        items: [
          { label: 'Push it as a single stroller first', detail: 'That is the version you will live with first.', status: 'check' },
          { label: 'Ask to add the second seat in front of you', status: 'check' },
          { label: 'Check basket access once the seat configuration changes', status: 'watch' },
          { label: 'Fold it with the seat setup you would actually use most', status: 'check' },
        ],
      },
      {
        title: 'Ask before you commit',
        items: [
          { label: 'Does this feel bulky as a single?', status: 'ask' },
          { label: 'Which two-seat setup do parents actually use most?', status: 'ask' },
          { label: 'What becomes harder once the second seat is added?', status: 'ask' },
        ],
      },
    ],
    buyNote:
      'Do not buy flexibility for sport. Buy convertible only when the future seat path is useful enough to earn the present-day bulk.',
  },
  'double-strollers': {
    definition: 'The immediate two-rider lane for twins, close age gaps, and families solving sibling logistics in the present tense.',
    everydayFeel: 'Honest, practical, and built for two children who really need seats now.',
    whyExists:
      'This lane exists because current two-seat life is a different job than planning ahead. When both seats matter now, a dedicated double often solves the problem more honestly.',
    expertTip: 'Two seats now is a different question than flexibility later.',
    compareAgainst: ['convertible-strollers', 'compact-lightweight-strollers', 'full-size-modular-strollers'],
    compareNote:
      'Compare against Convertible if the second child is still part of the near future, not the current week. Compare against Compact if only one child rides most of the time.',
    lessons: [
      {
        title: 'Why parents choose it',
        body: 'It solves the current sibling math without pretending a future-planning stroller can do the same job equally well.',
      },
      {
        title: 'Best for',
        body: 'Twins, close age gaps, and two children who both need a real seat on ordinary outings.',
      },
      {
        title: 'Tradeoff',
        body: 'You live with width, weight, and harder maneuvering because immediate capacity is the priority.',
      },
    ],
    testSections: [
      {
        title: 'Test this before buying double',
        items: [
          { label: 'Push it through a standard doorway', status: 'check' },
          { label: 'Turn it in a tight aisle or coffee shop layout', status: 'check' },
          { label: 'Fold and lift it into your trunk', status: 'check' },
          { label: 'Load both seats or simulate the second rider', status: 'watch' },
        ],
      },
      {
        title: 'Ask before you commit',
        items: [
          { label: 'Which layout do parents regret less long-term?', status: 'ask' },
          { label: 'Is this still manageable when only one child rides?', status: 'ask' },
          { label: 'What is hardest about living with this at home?', status: 'ask' },
        ],
      },
    ],
    buyNote: 'Buy double when two seats are a current job. If they are not, the size penalty usually arrives before the value does.',
  },
  'jogging-all-terrain-strollers': {
    definition: 'The bigger-wheel lane for rough routes, outdoor-heavy weeks, and true jogging or performance needs.',
    everydayFeel: 'Confident, capable, and best when the ground itself is the problem.',
    whyExists:
      'This lane exists because some routes are hard enough on small wheels that performance stops being a nice-to-have and becomes the calmer everyday answer.',
    expertTip: 'If the ground is doing the arguing, bigger wheels may be the calmer answer.',
    compareAgainst: ['full-size-modular-strollers', 'compact-lightweight-strollers'],
    compareNote:
      'Compare against Full-Size if you want stronger everyday comfort without a dedicated terrain frame. Compare against Compact if your routes are mostly smooth and storage pressure is louder.',
    lessons: [
      {
        title: 'Why parents choose it',
        body: 'Rough sidewalks, gravel, grass, or true jogging plans keep exposing the limits of smaller wheels.',
      },
      {
        title: 'Best for',
        body: 'Outdoor-heavy routines, uneven routes, and families who really will use bigger wheels regularly.',
      },
      {
        title: 'Tradeoff',
        body: 'You take on more bulk and a larger fold, which can feel silly if your routine is mostly smooth-surface errands.',
      },
    ],
    testSections: [
      {
        title: 'Test this before buying jogging',
        items: [
          { label: 'Push it over rougher ground if possible', status: 'check' },
          { label: 'Check the fold and wheel footprint in your trunk', status: 'check' },
          { label: 'Notice how it behaves indoors and in tighter spaces', status: 'watch' },
          { label: 'Adjust the handlebar for your natural stride', status: 'check' },
        ],
      },
      {
        title: 'Ask before you commit',
        items: [
          { label: 'Do I need true jogging or just better terrain help?', status: 'ask' },
          { label: 'What becomes annoying in stores or restaurants?', status: 'ask' },
          { label: 'Would a strong full-size stroller solve enough of this?', status: 'ask' },
        ],
      },
    ],
    buyNote: 'Do not buy a rugged-looking identity. Buy this lane only when rough ground or real running has an actual job to do.',
  },
};

export function getStrollerAcademyStages() {
  return [...STROLLER_ACADEMY_STAGES];
}

export function getStrollerAcademyLanes() {
  return STROLLER_CATEGORY_GUIDE_SLUGS.flatMap((slug) => {
    const systemCategory = getStrollerSystemCategory(slug);
    const guideConfig = getStrollerCategoryGuideConfig(slug);
    const custom = LANE_CUSTOM_CONTENT[slug];
    if (!systemCategory || !guideConfig || !custom) {
      return [];
    }

    return [
      {
        slug,
        title: systemCategory.title,
        shortTitle: guideConfig.shortTitle,
        href: systemCategory.href,
        icon: systemCategory.icon,
        definition: custom.definition,
        heroDescription: guideConfig.heroDescription,
        bestFor: systemCategory.bestFor,
        tradeoff: systemCategory.tradeoff,
        everydayFeel: custom.everydayFeel,
        whyExists: custom.whyExists,
        expertTip: custom.expertTip,
        signatureMoment: guideConfig.signatureMoment,
        worksForSummary: guideConfig.worksForSummary,
        worksForBullets: [...guideConfig.worksForBullets],
        notBestFitSummary: guideConfig.notBestFitSummary,
        notBestFitBullets: [...guideConfig.notBestFitBullets],
        compareAgainst: [...custom.compareAgainst],
        compareNote: custom.compareNote,
        lessons: [...custom.lessons],
        testSections: custom.testSections.map((section) => ({
          ...section,
          items: section.items.map((item) => ({ ...item })),
        })),
        buyNote: custom.buyNote,
        productExamples: getStrollerProductExamples(slug).slice(0, 3),
      } satisfies StrollerAcademyLane,
    ];
  });
}

export function getStrollerAcademyLane(slug: string) {
  return getStrollerAcademyLanes().find((lane) => lane.slug === slug) ?? null;
}

export function getStrollerAcademyPlanQuestions() {
  return STROLLER_ACADEMY_PLANNING_QUESTIONS.map((question) => ({
    ...question,
    options: question.options.map((option) => ({ ...option, laneScores: { ...option.laneScores } })),
  }));
}

export function getStrollerAcademyLearnModules() {
  return STROLLER_ACADEMY_LEARN_MODULES.map((module) => ({ ...module, bullets: [...module.bullets] }));
}

export function getStrollerAcademyFlowchart() {
  return STROLLER_ACADEMY_FLOWCHART.map((node) => ({
    ...node,
    outcomes: node.outcomes.map((outcome) => ({ ...outcome })),
  }));
}

export function getStrollerAcademyTryChecklist() {
  return STROLLER_ACADEMY_TRY_CHECKLIST.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item })),
  }));
}

export function getStrollerAcademyConsultCards() {
  return STROLLER_ACADEMY_CONSULT_CARDS.map((card) => ({ ...card }));
}
