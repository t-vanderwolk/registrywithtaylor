import GuideCategoryCards from '@/components/guides/GuideCategoryCards';
import GuideDecisionHelper from '@/components/guides/GuideDecisionHelper';
import GuideHero from '@/components/guides/GuideHero';
import GuideScrollProgress from '@/components/guides/GuideScrollProgress';
import GuideSectionDivider from '@/components/guides/GuideSectionDivider';
import GuideSoftConversionCta from '@/components/guides/GuideSoftConversionCta';
import GuideStrollerInteractivePlanner, {
  type StrollerInteractivePlannerConfig,
  type StrollerPlannerTopic,
} from '@/components/guides/GuideStrollerInteractivePlanner';
import GuideTableOfContents from '@/components/guides/GuideTableOfContents';
import MarketingSurface from '@/components/ui/MarketingSurface';
import { extractFaqEntries, stripMarkdown } from '@/lib/blog/contentText';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { extractStyledBlocks, isStyledBlockStart, parseStyledBlock } from '@/lib/blog/styledBlocks';
import type { GuideTocItem } from '@/lib/guides/articleOutline';
import { buildGuideOutline, splitGuideSectionContent, stripLeadingGuideHeading } from '@/lib/guides/articleOutline';
import type { GuideHeroJumpLink, GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import { getGuidePath } from '@/lib/guides/routing';
import {
  getStrollerCategoryDecisionItems,
  getStrollerCategoryGuideConfig,
  getStrollerHubBackLinkCard,
  getStrollerRelatedGuideCards,
  type StrollerCategoryGuideSlug,
} from '@/lib/guides/strollerCluster';
import { STROLLER_COMPARISON_CARDS, STROLLER_SERIES_CARDS } from '@/lib/guides/strollerHub';
import type { GuideArticleRecord } from '@/lib/server/guideArticleRecord';

type SharedStrollerGuideSlug = Exclude<
  StrollerCategoryGuideSlug,
  'full-size-modular-strollers' | 'compact-lightweight-strollers'
>;

type CategoryLayoutConfig = {
  startDescription: string;
  questionTitle: string;
  summaryCards: Array<{
    eyebrow: string;
    text: string;
  }>;
  decisionHelperTitle: string;
  decisionHelperDescription: string;
  compareTitle: string;
  compareDescription: string;
  seriesDescription: string;
  softCtaDescription: string;
  heroLabels: Record<string, string>;
  continueTitle: string;
  continueDescription: string;
  productLinksTitle: string;
  productLinksDescription: string;
  productLinks: GuideHubLink[];
  planner: StrollerInteractivePlannerConfig;
};

const STROLLER_GUIDE_PATH = getGuidePath({ slug: 'best-strollers' });
const FULL_SIZE_GUIDE_PATH = getGuidePath({ slug: 'full-size-modular-strollers' });
const COMPACT_GUIDE_PATH = getGuidePath({ slug: 'compact-lightweight-strollers' });
const TRAVEL_GUIDE_PATH = getGuidePath({ slug: 'travel-strollers' });
const JOGGING_GUIDE_PATH = getGuidePath({ slug: 'jogging-all-terrain-strollers' });
const DOUBLE_GUIDE_PATH = getGuidePath({ slug: 'double-strollers' });

const CATEGORY_LAYOUT_CONFIG: Record<SharedStrollerGuideSlug, CategoryLayoutConfig> = {
  'travel-strollers': {
    startDescription:
      'This section separates true travel-first usefulness from the kind of stroller shopping where a smaller fold gets treated like the whole answer.',
    questionTitle: 'Do you need a stroller that disappears between places, or one that still feels decent once you arrive?',
    summaryCards: [
      {
        eyebrow: 'Best signal',
        text: 'Flights, ride shares, tiny trunks, or shared travel routines keep creating the same folding and carrying headache.',
      },
      {
        eyebrow: 'Usually worth paying for',
        text: 'A faster fold, easier carry, and enough seat comfort that the stroller still behaves once the trip becomes real life.',
      },
      {
        eyebrow: 'Common trap',
        text: 'Buying the tiniest stroller in the conversation and realizing it feels flimsy everywhere except the measurements tab.',
      },
    ],
    decisionHelperTitle: 'Is travel really the job?',
    decisionHelperDescription:
      'If the hardest part is airports, ride shares, and smaller storage, the travel lane usually makes sense fast. If the harder part is the destination, the answer can change.',
    compareTitle: 'Still deciding whether travel is really the lane?',
    compareDescription:
      'Travel strollers get mixed up with compact and full-size options constantly. These are the adjacent categories worth comparing before you chase the tiniest fold on principle.',
    seriesDescription:
      'If travel sounds close but not quite right, the answer is usually in one of the surrounding stroller categories, not in another airline-bin rumor.',
    softCtaDescription:
      'The travel stroller decision gets simpler once someone helps you weigh flight frequency, destination walking, trunk size, and how much comfort you still need after the fold.',
    heroLabels: {
      'Interactive Planner': 'Interactive Planner',
      Introduction: 'Overview',
      'Why This Category Feels Overwhelming': 'Why It Feels Hard',
      'What a Travel Stroller Should Actually Do': 'What Travel Should Do',
      'Real-Life Fit': 'Real-Life Fit',
      'Expert Advice': 'Expert Advice',
      'Product Examples': 'Product Picks',
      'Common Mistakes Parents Make': 'Common Mistakes',
      'Final Thoughts': 'Final Thoughts',
      FAQ: 'FAQ',
    },
    continueTitle: 'Still deciding whether you need true travel-first portability?',
    continueDescription:
      'These next guides help when the real question is whether you need a stroller that travels brilliantly, or simply one that feels easier than your current setup.',
    productLinksTitle: 'Want the actual travel stroller shortlist?',
    productLinksDescription:
      'Once the travel lane makes sense, this is where to compare the models that earn the carry-on conversation.',
    productLinks: [
      {
        title: 'Best Travel Strollers',
        description: 'Use the shortlist once you know travel-first portability is part of real life and not just aspirational packing energy.',
        href: '/blog/best-travel-strollers',
        icon: 'plane',
      },
      {
        title: 'Stroller Comparisons',
        description: 'Helpful when multiple travel models all sound tiny and the real differences are hiding in comfort, carry feel, and fold behavior.',
        href: '/blog/stroller-comparisons',
        icon: 'strategy',
      },
      {
        title: 'Travel System Questions Before You Buy',
        description: 'Useful when the stroller choice is getting tangled up with infant car seats, early baby timing, and how much system compatibility matters.',
        href: '/blog/travel-system-questions-before-you-buy',
        icon: 'carseat',
      },
    ],
    planner: {
      title: 'Test whether the travel lane actually fits your week',
      description:
        'Start with the kind of movement your routine asks for, then pressure-test the tradeoff that matters most before you open another overhead-bin thread.',
      scenarioPrompt: 'Choose the routine that sounds most like your week',
      scenarioAriaLabel: 'Travel stroller routine planner',
      priorityPrompt: 'Pick the tradeoff you care about most',
      priorityAriaLabel: 'Travel stroller tradeoff lenses',
      finalCtaTitle: 'Read the best travel stroller shortlist next',
      finalCtaDescription:
        'Once you know this category fits your life, the best next move is the actual travel stroller shortlist, not a fifth debate about folded dimensions in the abstract.',
      finalCtaHref: '/blog/best-travel-strollers',
      finalCtaLabel: 'Open /blog/best-travel-strollers',
      topicIcons: {
        introduction: 'plane',
        'what-a-travel-stroller-should-actually-do': 'bag',
      },
      scenarios: [
        {
          id: 'airport-heavy',
          label: 'Flights and ride shares are a real part of life',
          icon: 'plane',
          fitLabel: 'Strong travel fit',
          fitTone: 'yes',
          summary:
            'When the stroller keeps getting folded, carried, checked, and tucked into smaller transit moments, travel-first design usually earns its keep quickly.',
          signals: [
            'Airports, ride shares, or rental cars show up often enough to matter.',
            'Carry ease feels almost as important as push feel.',
            'The stroller needs to behave in motion, not just at the destination.',
          ],
          priorities: ['Fold speed', 'Carry ease', 'Transit readiness'],
          primaryHref: `${TRAVEL_GUIDE_PATH}#real-life-fit`,
          primaryLabel: 'Jump to Real-Life Fit',
          secondaryHref: '/blog/best-travel-strollers',
          secondaryLabel: 'Read the travel shortlist',
        },
        {
          id: 'second-stroller',
          label: 'We want an easier second stroller for trips and quick outings',
          icon: 'compact',
          fitLabel: 'Often a smart travel fit',
          fitTone: 'yes',
          summary:
            'Travel strollers often make the most sense as a lighter second option when the main stroller at home still handles the heavier everyday work.',
          signals: [
            'You already have a stronger everyday stroller at home.',
            'You want less stroller for trips, errands, or grandparents.',
            'Portability matters more here than basket size or maximum comfort.',
          ],
          priorities: ['Portability', 'Shared ease', 'Quick folds'],
          primaryHref: `${TRAVEL_GUIDE_PATH}#real-life-fit`,
          primaryLabel: 'See who this category helps',
          secondaryHref: COMPACT_GUIDE_PATH,
          secondaryLabel: 'Compare compact strollers',
        },
        {
          id: 'destination-heavy',
          label: 'The destination includes a lot of walking',
          icon: 'road',
          fitLabel: 'Do not over-minimize',
          fitTone: 'maybe',
          summary:
            'This is where parents sometimes buy too much portability and not enough stroller. If the destination feels like real stroller life, comfort still deserves a vote.',
          signals: [
            'You expect long sightseeing days or extended walking.',
            'Seat comfort and steering will matter after the flight too.',
            'You want less bulk, but not a stroller that feels delicate on arrival.',
          ],
          priorities: ['Destination comfort', 'Steering', 'Balance'],
          primaryHref: `${TRAVEL_GUIDE_PATH}#what-a-travel-stroller-should-actually-do`,
          primaryLabel: 'Review what travel should do',
          secondaryHref: FULL_SIZE_GUIDE_PATH,
          secondaryLabel: 'Compare full-size comfort',
        },
        {
          id: 'tiny-storage',
          label: 'Tiny trunks, grandparents, or storage limits keep coming up',
          icon: 'storage',
          fitLabel: 'Another strong travel signal',
          fitTone: 'yes',
          summary:
            'Sometimes the answer is not glamorous at all. It is simply that a stroller with less bulk makes the whole setup easier for more people.',
          signals: [
            'Storage space is annoyingly tight at home or on the road.',
            'Other caregivers need a stroller they can lift and fold confidently.',
            'You want the stroller to disappear faster when not in use.',
          ],
          priorities: ['Storage shape', 'Carry weight', 'Shared usability'],
          primaryHref: `${TRAVEL_GUIDE_PATH}#real-life-fit`,
          primaryLabel: 'See the real-life fit section',
          secondaryHref: '/blog/best-travel-strollers',
          secondaryLabel: 'Read the travel shortlist',
        },
      ],
      priorityLenses: [
        {
          id: 'fold-carry',
          label: 'Fold + carry feel',
          icon: 'plane',
          verdict: 'Usually the main travel advantage',
          tone: 'yes',
          summary:
            'This category usually proves itself here first. If the stroller keeps moving between planes, trunks, and hotel rooms, easier carry is doing real work.',
          helpsWhen: 'The hardest part of stroller life is movement between places, not lingering in one place all day.',
          watchout: 'A fast fold in a demo is not the same as a fold you can trust while juggling the rest of travel life.',
          href: `${TRAVEL_GUIDE_PATH}#what-a-travel-stroller-should-actually-do`,
          ctaLabel: 'Review what travel should do',
        },
        {
          id: 'destination-comfort',
          label: 'Destination comfort',
          icon: 'road',
          verdict: 'Important if the trip includes real walking',
          tone: 'maybe',
          summary:
            'The travel stroller still has to feel decent once you arrive. A stroller that only wins during transit can become surprisingly annoying at the destination.',
          helpsWhen: 'Trips involve long walking days, naps on the go, or enough time out that seat comfort still matters.',
          watchout: 'Chasing the smallest possible fold can quietly trim away the comfort you needed most after landing.',
          href: `${TRAVEL_GUIDE_PATH}#real-life-fit`,
          ctaLabel: 'See the real-life fit section',
        },
        {
          id: 'airline-reality',
          label: 'Airline reality',
          icon: 'bag',
          verdict: 'Worth checking before you buy',
          tone: 'maybe',
          summary:
            'Airline-friendly is one of those phrases that sounds more definitive than it is. The real question is how the stroller behaves in your actual transit chain.',
          helpsWhen: 'You care about gate checks, carry-on hopes, and how much time you spend moving through airports.',
          watchout: 'Do not build the whole purchase around one best-case airline claim and ignore the rest of the trip.',
          href: '/blog/best-travel-strollers',
          ctaLabel: 'Read the travel shortlist',
        },
        {
          id: 'everyday-overlap',
          label: 'Everyday overlap',
          icon: 'compact',
          verdict: 'Sometimes a bonus, sometimes a trap',
          tone: 'maybe',
          summary:
            'Some travel strollers make a great quick-errand stroller at home too. Others feel so specialized that they are happiest only when the trip is the point.',
          helpsWhen: 'You want one smaller stroller to cover both travel and lighter local use.',
          watchout: 'If the real need is everyday convenience rather than travel, compact strollers often make more sense.',
          href: COMPACT_GUIDE_PATH,
          ctaLabel: 'Compare compact strollers',
        },
        {
          id: 'rough-routes',
          label: 'Rougher routes',
          icon: 'terrain',
          verdict: 'Usually not the travel strong suit',
          tone: 'no',
          summary:
            'Travel strollers can handle a lot, but they rarely win where bigger wheels and stronger suspension are the actual need.',
          helpsWhen: 'Most routes are smooth enough that easy carry matters more than terrain performance.',
          watchout: 'If the destination is rough, a more substantial stroller may feel calmer than a tiny travel-first frame.',
          href: FULL_SIZE_GUIDE_PATH,
          ctaLabel: 'Compare full-size options',
        },
      ],
    },
  },
  'jogging-all-terrain-strollers': {
    startDescription:
      'This section is here to separate real route problems from the very understandable urge to buy the stroller that looks most prepared for adventure.',
    questionTitle: 'Does your route actually need bigger wheels, or does the category just look reassuring?',
    summaryCards: [
      {
        eyebrow: 'Best signal',
        text: 'Your real routes include broken sidewalks, gravel, grass, or long outdoor loops often enough that smaller wheels already annoy you.',
      },
      {
        eyebrow: 'Usually worth paying for',
        text: 'Wheel size, suspension, and push stability you feel on every rough route instead of one flashy feature you notice once.',
      },
      {
        eyebrow: 'Common trap',
        text: 'Buying terrain performance for a life that mostly happens in parking lots, restaurants, and quick car-heavy errands.',
      },
    ],
    decisionHelperTitle: 'Is terrain truly the problem?',
    decisionHelperDescription:
      'If the ground itself keeps making stroller life harder, bigger wheels and stronger suspension can be worth the bulk. If not, the size tradeoff gets old fast.',
    compareTitle: 'Still deciding whether jogging is actually your lane?',
    compareDescription:
      'This category often gets confused with strong everyday strollers. These are the nearby paths worth comparing before you commit to the bigger fold.',
    seriesDescription:
      'If jogging and all-terrain feels close but maybe too specialized, the broader stroller guide usually makes the next answer easier to see.',
    softCtaDescription:
      'The terrain decision gets simpler once someone helps you sort route reality, trunk life, actual running plans, and whether bigger wheels are solving a daily problem or a hypothetical one.',
    heroLabels: {
      'Interactive Planner': 'Interactive Planner',
      Introduction: 'Overview',
      'Why This Category Feels Overwhelming': 'Why It Feels Hard',
      'What This Category Actually Solves': 'What It Solves',
      'Real-Life Fit': 'Real-Life Fit',
      'Expert Advice': 'Expert Advice',
      'Product Examples': 'Product Picks',
      'Common Mistakes Parents Make': 'Common Mistakes',
      'Final Thoughts': 'Final Thoughts',
      FAQ: 'FAQ',
    },
    continueTitle: 'Still deciding whether you need true terrain performance?',
    continueDescription:
      'These nearby guides help when the question is whether rough routes justify the bulk, or whether a calmer everyday stroller would do the job just fine.',
    productLinksTitle: 'Want the actual jogging stroller shortlist?',
    productLinksDescription:
      'Once the terrain problem is clear, these are the next reads worth opening before you compare wheel systems for sport.',
    productLinks: [
      {
        title: 'Best Jogging Strollers',
        description: 'Use the shortlist when you know rough routes or active movement are real life and you want the models worth comparing.',
        href: '/blog/best-jogging-strollers',
        icon: 'terrain',
      },
      {
        title: 'Stroller Comparisons',
        description: 'Helpful when the choice is starting to blur between performance strollers and stronger everyday strollers with better wheels.',
        href: '/blog/stroller-comparisons',
        icon: 'strategy',
      },
      {
        title: 'Best Full-Size Strollers of 2026',
        description: 'A useful check when the question may be drifting toward one strong everyday stroller instead of a truly terrain-first one.',
        href: '/blog/best-full-size-strollers-2026',
        icon: 'stroller',
      },
    ],
    planner: {
      title: 'Test whether the jogging lane actually fits your routes',
      description:
        'Start with the ground you really push over, then check whether the performance tradeoff earns the bulk in your everyday life.',
      scenarioPrompt: 'Choose the routine that sounds most like your week',
      scenarioAriaLabel: 'Jogging stroller routine planner',
      priorityPrompt: 'Pick the tradeoff you care about most',
      priorityAriaLabel: 'Jogging stroller tradeoff lenses',
      finalCtaTitle: 'Read the best jogging stroller shortlist next',
      finalCtaDescription:
        'Once you know this category fits your life, the best next move is the actual model shortlist, not another round of rugged-looking product pages.',
      finalCtaHref: '/blog/best-jogging-strollers',
      finalCtaLabel: 'Open /blog/best-jogging-strollers',
      topicIcons: {
        introduction: 'terrain',
        'what-this-category-actually-solves': 'terrain',
      },
      scenarios: [
        {
          id: 'rough-routes',
          label: 'Our real routes are rough, uneven, or outdoor-heavy',
          icon: 'terrain',
          fitLabel: 'Strong jogging fit',
          fitTone: 'yes',
          summary:
            'When the route itself keeps arguing with smaller wheels, bigger wheels and better suspension tend to feel less like a luxury and more like basic manners.',
          signals: [
            'Cracked sidewalks, gravel, grass, or park paths show up constantly.',
            'Long outdoor walks are a normal part of the week.',
            'Push stability already matters more than a compact fold.',
          ],
          priorities: ['Wheel size', 'Suspension', 'Stable push'],
          primaryHref: `${JOGGING_GUIDE_PATH}#real-life-fit`,
          primaryLabel: 'Jump to Real-Life Fit',
          secondaryHref: '/blog/best-jogging-strollers',
          secondaryLabel: 'Read the jogging shortlist',
        },
        {
          id: 'actual-running',
          label: 'Running really is part of the plan',
          icon: 'road',
          fitLabel: 'Very likely the right lane',
          fitTone: 'yes',
          summary:
            'If running is a real use case once your child is developmentally ready and you have pediatric guidance, a dedicated performance lane deserves a serious look.',
          signals: [
            'You want stability at a faster pace, not just better neighborhood comfort.',
            'You are thinking about real running use, not only rough sidewalks.',
            'Performance matters more than a tidy trunk footprint.',
          ],
          priorities: ['Running readiness', 'Stability', 'Brake confidence'],
          primaryHref: `${JOGGING_GUIDE_PATH}#what-this-category-actually-solves`,
          primaryLabel: 'Review what this category solves',
          secondaryHref: '/blog/best-jogging-strollers',
          secondaryLabel: 'Read the jogging shortlist',
        },
        {
          id: 'mixed-life',
          label: 'We walk outdoors a lot but still do plenty of errands',
          icon: 'stroller',
          fitLabel: 'Proceed carefully',
          fitTone: 'maybe',
          summary:
            'This is the blurry middle. Some families truly need the performance. Others realize a strong full-size stroller handles more of their week with less bulk.',
          signals: [
            'Outdoor walks matter, but so do trunks, restaurants, and daily errands.',
            'You want comfort on rougher routes without making indoor life miserable.',
            'The stroller needs to live in normal family spaces too.',
          ],
          priorities: ['Balance', 'Storage penalty', 'Everyday use'],
          primaryHref: FULL_SIZE_GUIDE_PATH,
          primaryLabel: 'Compare full-size strollers',
          secondaryHref: `${JOGGING_GUIDE_PATH}#real-life-fit`,
          secondaryLabel: 'See the real-life fit section',
        },
        {
          id: 'smooth-surface',
          label: 'Most outings are smooth-surface and car-heavy',
          icon: 'compact',
          fitLabel: 'Usually too much stroller',
          fitTone: 'no',
          summary:
            'If the stroller mostly handles errands, smooth sidewalks, and shorter outings, the size and storage penalty can outweigh the performance benefit quickly.',
          signals: [
            'You drive most places and do shorter local outings.',
            'Indoor maneuvering and trunk behavior matter a lot.',
            'Rough terrain is occasional, not the main character.',
          ],
          priorities: ['Fold size', 'Everyday convenience', 'Storage ease'],
          primaryHref: COMPACT_GUIDE_PATH,
          primaryLabel: 'Compare compact strollers',
          secondaryHref: FULL_SIZE_GUIDE_PATH,
          secondaryLabel: 'See full-size alternatives',
        },
      ],
      priorityLenses: [
        {
          id: 'wheel-suspension',
          label: 'Wheel + suspension value',
          icon: 'terrain',
          verdict: 'Usually the main jogging advantage',
          tone: 'yes',
          summary:
            'This category tends to justify itself on rougher ground first. If the route keeps fighting smaller wheels, performance hardware earns its space.',
          helpsWhen: 'Your usual routes are rough enough that steering, stability, and comfort already feel like a daily issue.',
          watchout: 'Do not pay the bulk penalty if the terrain only shows up once in a while.',
          href: `${JOGGING_GUIDE_PATH}#what-this-category-actually-solves`,
          ctaLabel: 'Review what this category solves',
        },
        {
          id: 'trunk-storage',
          label: 'Trunk + storage penalty',
          icon: 'storage',
          verdict: 'The main cost of entry',
          tone: 'maybe',
          summary:
            'Performance strollers are rarely subtle at home. What they solve on the route can still become annoying in hallways, trunks, and restaurant corners.',
          helpsWhen: 'You are trying to decide whether better outdoor handling is worth a larger everyday footprint.',
          watchout: 'A stroller can be brilliant on gravel and still deeply inconvenient in normal indoor life.',
          href: `${JOGGING_GUIDE_PATH}#real-life-fit`,
          ctaLabel: 'See the real-life fit section',
        },
        {
          id: 'running-readiness',
          label: 'Actual running use',
          icon: 'road',
          verdict: 'Important if this is really the goal',
          tone: 'yes',
          summary:
            'Running changes the conversation. It pushes the decision toward true performance and away from strollers that only look rugged in photos.',
          helpsWhen: 'You genuinely expect this stroller to support a running routine once it is developmentally appropriate.',
          watchout: 'If running is mostly aspirational, buying around that identity can create more stroller than you actually use.',
          href: '/blog/best-jogging-strollers',
          ctaLabel: 'Read the jogging shortlist',
        },
        {
          id: 'indoor-manageability',
          label: 'Indoor manageability',
          icon: 'compact',
          verdict: 'Usually not the strong suit',
          tone: 'no',
          summary:
            'This category shines outdoors. Indoors, it can feel like you invited a very capable but very large guest into a small room.',
          helpsWhen: 'Most of the week really does happen outside, on rougher routes, or at a pace where performance matters.',
          watchout: 'If indoor spaces and quick errands dominate the routine, a calmer stroller category usually makes more sense.',
          href: COMPACT_GUIDE_PATH,
          ctaLabel: 'Compare compact options',
        },
        {
          id: 'everyday-balance',
          label: 'Everyday balance',
          icon: 'stroller',
          verdict: 'Worth comparing before you commit',
          tone: 'maybe',
          summary:
            'Some parents do need a terrain-first stroller. Others need a strong everyday stroller that simply handles more than average with less drama.',
          helpsWhen: 'You are torn between route performance and a stroller that fits a broader version of daily life.',
          watchout: 'Do not assume bigger wheels automatically mean the smartest overall stroller for your family.',
          href: FULL_SIZE_GUIDE_PATH,
          ctaLabel: 'Compare full-size options',
        },
      ],
    },
  },
  'double-strollers': {
    startDescription:
      'This section is here to separate real sibling logistics from the very expensive habit of buying for a future maybe.',
    questionTitle: 'Do you have a real two-rider problem, or are you buying reassurance on four wheels?',
    summaryCards: [
      {
        eyebrow: 'Best signal',
        text: 'Two riders really need stroller help now, or soon enough that the extra size is part of current life rather than theoretical planning.',
      },
      {
        eyebrow: 'Usually worth paying for',
        text: 'Seat flexibility that actually matches your age gap and a frame you can still maneuver, store, and load without resentment.',
      },
      {
        eyebrow: 'Common trap',
        text: 'Paying a daily size penalty for future-proofing that never gets used the way you imagined in the showroom.',
      },
    ],
    decisionHelperTitle: 'Is double really the job right now?',
    decisionHelperDescription:
      'The double lane earns its size when two riders truly need it. If the second seat is mostly theoretical, the smarter answer is often a stronger single stroller.',
    compareTitle: 'Still deciding whether double is actually the right move?',
    compareDescription:
      'Double strollers overlap with modular and compact decisions more than most parents expect. These are the nearby categories worth comparing before you size up.',
    seriesDescription:
      'If double feels close but maybe too much for right now, the rest of the stroller guide can help you decide whether a single stroller solves today\'s job better.',
    softCtaDescription:
      'The double stroller decision gets simpler once someone helps you sort age-gap reality, second-child timing, storage tolerance, and whether today\'s life actually needs two stroller seats.',
    heroLabels: {
      'Interactive Planner': 'Interactive Planner',
      Introduction: 'Overview',
      'Why This Category Feels Overwhelming': 'Why It Feels Hard',
      'The Main Double Stroller Paths': 'Double Paths',
      'Real-Life Fit': 'Real-Life Fit',
      'Expert Advice': 'Expert Advice',
      'Product Examples': 'Product Picks',
      'Common Mistakes Parents Make': 'Common Mistakes',
      'Final Thoughts': 'Final Thoughts',
      FAQ: 'FAQ',
    },
    continueTitle: 'Still deciding whether you need a true double, a convertible system, or simply less stroller?',
    continueDescription:
      'These nearby guides help when the real question is whether two-seat capacity is solving a current life stage or just easing planning nerves.',
    productLinksTitle: 'Want the actual double stroller shortlist?',
    productLinksDescription:
      'Once the sibling math is real, these are the next reads that help the model list feel less chaotic.',
    productLinks: [
      {
        title: 'Best Double Strollers',
        description: 'Use the shortlist once the second-seat need is real and you want the models worth comparing side by side.',
        href: '/blog/best-double-strollers',
        icon: 'double',
      },
      {
        title: 'Stroller Comparisons',
        description: 'Helpful when single-to-double, tandem, and side-by-side choices start sounding equally persuasive.',
        href: '/blog/stroller-comparisons',
        icon: 'strategy',
      },
      {
        title: 'Best Full-Size Strollers of 2026',
        description: 'A useful reset when you suspect a strong single stroller may still be the calmer answer for current life.',
        href: '/blog/best-full-size-strollers-2026',
        icon: 'stroller',
      },
    ],
    planner: {
      title: 'Test whether the double lane actually fits your family math',
      description:
        'Start with timing, rider needs, and everyday logistics. Then open the section that answers the next real question before you buy a stroller for a hypothetical future.',
      scenarioPrompt: 'Choose the routine that sounds most like your week',
      scenarioAriaLabel: 'Double stroller routine planner',
      priorityPrompt: 'Pick the tradeoff you care about most',
      priorityAriaLabel: 'Double stroller tradeoff lenses',
      finalCtaTitle: 'Read the best double stroller shortlist next',
      finalCtaDescription:
        'Once you know this category fits your life, the best next move is the actual model shortlist, not another long conversation about future-proofing in theory.',
      finalCtaHref: '/blog/best-double-strollers',
      finalCtaLabel: 'Open /blog/best-double-strollers',
      topicIcons: {
        introduction: 'double',
        'the-main-double-stroller-paths': 'double',
      },
      scenarios: [
        {
          id: 'two-riders-now',
          label: 'We already have two riders who genuinely need stroller help',
          icon: 'double',
          fitLabel: 'Strong double fit',
          fitTone: 'yes',
          summary:
            'When sibling transport is already a current problem, a good double stroller can simplify life in a very real and unglamorous way. Which is usually the best kind.',
          signals: [
            'Both children regularly benefit from stroller support.',
            'Outings feel harder because one stroller seat is not enough.',
            'You are solving current logistics, not just planning nerves.',
          ],
          priorities: ['Seat setup', 'Maneuverability', 'Storage reality'],
          primaryHref: `${DOUBLE_GUIDE_PATH}#real-life-fit`,
          primaryLabel: 'Jump to Real-Life Fit',
          secondaryHref: '/blog/best-double-strollers',
          secondaryLabel: 'Read the double shortlist',
        },
        {
          id: 'close-age-gap',
          label: 'A second baby is likely soon and the age gap feels real',
          icon: 'calendar',
          fitLabel: 'Maybe the right timing',
          fitTone: 'maybe',
          summary:
            'This is where convertible logic can make sense, but only if the everyday single-stroller experience still feels good enough right now.',
          signals: [
            'You have a clear near-term plan rather than a vague someday.',
            'You are weighing today\'s stroller against a likely future second rider.',
            'You want flexibility without dragging around unnecessary bulk too early.',
          ],
          priorities: ['Timing', 'Convertible value', 'Present-day use'],
          primaryHref: `${DOUBLE_GUIDE_PATH}#the-main-double-stroller-paths`,
          primaryLabel: 'Review the double paths',
          secondaryHref: FULL_SIZE_GUIDE_PATH,
          secondaryLabel: 'Compare strong single options',
        },
        {
          id: 'older-sibling-walks',
          label: 'The older sibling may not need a full-time seat',
          icon: 'road',
          fitLabel: 'Proceed carefully',
          fitTone: 'maybe',
          summary:
            'Not every two-child family needs a full double stroller all the time. Sometimes the calmer answer is a single stroller plus a lighter second solution later.',
          signals: [
            'One child already walks well for parts of outings.',
            'You are not sure both seats will be used regularly.',
            'A ride board or simpler solution may cover some of the need.',
          ],
          priorities: ['Actual seat use', 'Flexibility', 'Daily simplicity'],
          primaryHref: `${DOUBLE_GUIDE_PATH}#real-life-fit`,
          primaryLabel: 'See the real-life fit section',
          secondaryHref: FULL_SIZE_GUIDE_PATH,
          secondaryLabel: 'Compare single stroller options',
        },
        {
          id: 'tight-spaces',
          label: 'Storage, trunk space, and doorways are already tight',
          icon: 'storage',
          fitLabel: 'The size penalty matters',
          fitTone: 'no',
          summary:
            'This does not rule out the category, but it does mean the everyday cost of a double stroller needs to be taken very seriously before you commit.',
          signals: [
            'Home storage already feels cramped.',
            'Your trunk, entryway, or everyday routes are tight.',
            'A large stroller would have to earn its place immediately.',
          ],
          priorities: ['Fold size', 'Width', 'Storage tolerance'],
          primaryHref: FULL_SIZE_GUIDE_PATH,
          primaryLabel: 'Compare stronger single strollers',
          secondaryHref: COMPACT_GUIDE_PATH,
          secondaryLabel: 'See lighter alternatives',
        },
      ],
      priorityLenses: [
        {
          id: 'current-need',
          label: 'Current sibling need',
          icon: 'double',
          verdict: 'Usually the deciding factor',
          tone: 'yes',
          summary:
            'This category is strongest when it is solving a real present-tense problem. The farther the need drifts into the future, the shakier the math gets.',
          helpsWhen: 'Two riders genuinely need stroller support now or very soon in a way that changes real outings.',
          watchout: 'Do not let responsible-sounding future-proofing outrank the life you are actually living today.',
          href: `${DOUBLE_GUIDE_PATH}#real-life-fit`,
          ctaLabel: 'See the real-life fit section',
        },
        {
          id: 'width-maneuvering',
          label: 'Width + maneuvering',
          icon: 'road',
          verdict: 'One of the biggest daily tradeoffs',
          tone: 'maybe',
          summary:
            'Double strollers solve sibling transport, but they also change how the stroller behaves in doorways, stores, sidewalks, and every other mildly inconvenient space.',
          helpsWhen: 'You are comparing side-by-side, tandem, and convertible layouts with real daily routes in mind.',
          watchout: 'A stroller can feel strategic on paper and still be deeply annoying in a narrow doorway.',
          href: `${DOUBLE_GUIDE_PATH}#the-main-double-stroller-paths`,
          ctaLabel: 'Review the double paths',
        },
        {
          id: 'seat-flexibility',
          label: 'Seat flexibility',
          icon: 'layers',
          verdict: 'Useful only when it matches real life',
          tone: 'maybe',
          summary:
            'Configuration flexibility can be wonderful. It just should not outrank how the stroller feels when used in its most common setup.',
          helpsWhen: 'Your age gap, infant plans, and outing style genuinely call for multiple seating arrangements.',
          watchout: 'The stroller that can do the most is not always the stroller you will like using most.',
          href: '/blog/best-double-strollers',
          ctaLabel: 'Read the double shortlist',
        },
        {
          id: 'weight-storage',
          label: 'Weight + storage reality',
          icon: 'storage',
          verdict: 'The everyday cost',
          tone: 'no',
          summary:
            'Double strollers do not live only in the highlight reel. They also live in trunks, closets, and tired arms at the end of the day.',
          helpsWhen: 'You know two seats are worth it and want to choose the version that creates the least everyday friction.',
          watchout: 'If the size already sounds exhausting, it probably deserves more attention before you buy.',
          href: `${DOUBLE_GUIDE_PATH}#common-mistakes-parents-make`,
          ctaLabel: 'Review the common mistakes',
        },
        {
          id: 'future-proofing',
          label: 'Future-proofing',
          icon: 'calendar',
          verdict: 'Valuable only when the timing is real',
          tone: 'maybe',
          summary:
            'Planning ahead is useful. Buying daily bulk for a vague future is less strategic than stroller marketing makes it sound.',
          helpsWhen: 'A second child is part of a clear near-term plan and the present single setup still feels acceptable.',
          watchout: 'Do not let hypothetical flexibility overrule current maneuverability, weight, and storage pain.',
          href: FULL_SIZE_GUIDE_PATH,
          ctaLabel: 'Compare strong single options',
        },
      ],
    },
  },
};

function formatArticleDate(value: Date) {
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function stripLeadingTopHeading(content: string) {
  const lines = content.split('\n');
  if (lines.length === 0) {
    return content.trim();
  }

  const firstLine = lines[0]?.trim() ?? '';
  if (firstLine.startsWith('# ')) {
    return lines.slice(1).join('\n').trim();
  }

  return content.trim();
}

function splitPreface(content: string) {
  const paragraphs = stripLeadingTopHeading(content)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const [leadParagraph = '', ...remainingParagraphs] = paragraphs;

  return {
    leadParagraph,
    remainingPreface: remainingParagraphs.join('\n\n'),
  };
}

function stripStyledBlocksOfTypes(content: string, blockTypes: ParsedStyledBlock['type'][]) {
  const typesToStrip = new Set(blockTypes);
  const lines = content.split('\n');
  const keptLines: string[] = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (!trimmed || !isStyledBlockStart(trimmed)) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    const parsed = parseStyledBlock(lines, index);
    if (!parsed) {
      keptLines.push(line);
      index += 1;
      continue;
    }

    if (typesToStrip.has(parsed.block.type)) {
      index = parsed.nextIndex;
      continue;
    }

    keptLines.push(...lines.slice(index, parsed.nextIndex));
    index = parsed.nextIndex;
  }

  return keptLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function sanitizeGuideContent(content: string) {
  return stripLeadingTopHeading(content)
    .replace(/^\[Read the full comparison[^\]]*\]\([^)]+\)\s*$/gim, '')
    .replace(/^!\[[^\]]*\]\([^)]+\)\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n+Start with confidence\.[\s\S]*$/i, '')
    .trim();
}

function buildPrefaceBrief(content: string) {
  const cleanedContent = sanitizeGuideContent(content);
  const blocks = extractStyledBlocks(cleanedContent);
  const callout = blocks.find((block): block is Extract<ParsedStyledBlock, { type: 'callout' }> => block.type === 'callout') ?? null;
  const textOnlyContent = stripStyledBlocksOfTypes(cleanedContent, ['callout']);
  const { leadParagraph, remainingPreface } = splitPreface(textOnlyContent);

  return {
    leadParagraph,
    supportingParagraphs: remainingPreface
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    callout,
  };
}

function dedupeFaqEntries({
  guide,
  articleContent,
}: {
  guide: GuideArticleRecord;
  articleContent: string;
}) {
  return [
    ...guide.faqItems.map((entry) => ({
      question: entry.question,
      answer: entry.answer,
    })),
    ...extractFaqEntries(articleContent),
  ].filter(
    (entry, index, collection) =>
      collection.findIndex(
        (candidate) =>
          candidate.question.toLowerCase() === entry.question.toLowerCase() &&
          candidate.answer.toLowerCase() === entry.answer.toLowerCase(),
      ) === index,
  );
}

function extractSectionSummary(content: string) {
  const blocks = sanitizeGuideContent(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter(
      (block) =>
        !block.startsWith('### ') &&
        !block.startsWith(':::') &&
        !block.startsWith('![') &&
        !block.startsWith('- ') &&
        !/^\d+\.\s/.test(block),
    );

  return blocks[0] ? stripMarkdown(blocks[0]) : '';
}

function extractSectionHighlights(content: string) {
  const { subsections } = splitGuideSectionContent(sanitizeGuideContent(content));
  return subsections.map((subsection) => stripMarkdown(subsection.title)).slice(0, 3);
}

function buildVisibleTocItems({
  outline,
  faqCount,
  heroLabels,
}: {
  outline: ReturnType<typeof buildGuideOutline>;
  faqCount: number;
  heroLabels: Record<string, string>;
}): GuideTocItem[] {
  const sectionItems = outline.tocItems
    .filter((item) => item.level === 2 && item.label !== 'FAQ')
    .map((item) => ({
      ...item,
      label: heroLabels[item.label] ?? item.label,
    }));

  if (faqCount > 0) {
    sectionItems.splice(Math.max(sectionItems.length - 1, 0), 0, {
      id: 'guide-faq',
      label: heroLabels.FAQ ?? 'FAQ',
      level: 2,
    });
  }

  return sectionItems;
}

function buildPlannerTopics({
  sectionOrder,
  faqEntries,
  disclosureText,
  showDisclosureAfterIntro,
  showDisclosureBeforeConclusion,
  showDisclosureBeforeAffiliates,
  heroLabels,
  continueMatchTitle,
  continueTitle,
  continueDescription,
  continueLinks,
  productLinksTitle,
  productLinksDescription,
  productLinks,
}: {
  sectionOrder: ReturnType<typeof buildGuideOutline>['sections'];
  faqEntries: { question: string; answer: string }[];
  disclosureText: string;
  showDisclosureAfterIntro: boolean;
  showDisclosureBeforeConclusion: boolean;
  showDisclosureBeforeAffiliates: boolean;
  heroLabels: Record<string, string>;
  continueMatchTitle: string;
  continueTitle: string;
  continueDescription: string;
  continueLinks: GuideHubLink[];
  productLinksTitle: string;
  productLinksDescription: string;
  productLinks: GuideHubLink[];
}): StrollerPlannerTopic[] {
  const topics: StrollerPlannerTopic[] = sectionOrder.map((section) => {
    const cleanedContent = sanitizeGuideContent(stripLeadingGuideHeading(section.content));
    const { introContent, subsections } = splitGuideSectionContent(cleanedContent);
    const overviewContent = sanitizeGuideContent(stripLeadingGuideHeading(introContent));
    const companions: StrollerPlannerTopic['companions'] = [];
    const isProductSection = section.title === 'Product Examples';
    const isFinalSection = section.title === 'Final Thoughts';
    const isCommonMistakes = section.title === 'Common Mistakes Parents Make';
    const isContinueSection = section.title === continueMatchTitle;

    if (showDisclosureBeforeAffiliates && isProductSection) {
      companions.push({
        kind: 'disclosure',
        text: disclosureText,
      });
    }

    if (showDisclosureBeforeConclusion && isFinalSection) {
      companions.push({
        kind: 'disclosure',
        text: disclosureText,
      });
    }

    if (showDisclosureAfterIntro && sectionOrder[0]?.title === section.title) {
      companions.push({
        kind: 'disclosure',
        text: disclosureText,
      });
    }

    if (isContinueSection && continueLinks.length > 0) {
      companions.push({
        kind: 'continue',
        title: continueTitle,
        description: continueDescription,
        links: continueLinks,
      });
    }

    if (isProductSection && productLinks.length > 0) {
      companions.push({
        kind: 'comparison',
        title: productLinksTitle,
        description: productLinksDescription,
        cards: productLinks,
      });
    }

    if (isCommonMistakes) {
      companions.push({
        kind: 'comparison',
        title: 'Compare the next part of the decision',
        description:
          'These supporting reads help when the category conversation starts overlapping with brand shortlists, adjacent stroller types, or the next real tradeoff in your week.',
        cards: STROLLER_COMPARISON_CARDS,
      });
    }

    return {
      id: section.id,
      label: heroLabels[section.title] ?? section.title,
      title: section.title,
      summary: extractSectionSummary(cleanedContent),
      highlights: extractSectionHighlights(cleanedContent),
      overviewContent: overviewContent || undefined,
      cards: subsections.map((subsection) => ({
        id: subsection.id,
        eyebrow: 'Focus area',
        title: subsection.title,
        content: sanitizeGuideContent(stripLeadingGuideHeading(subsection.content)),
      })),
      companions,
    };
  });

  if (faqEntries.length > 0) {
    topics.splice(Math.max(topics.length - 1, 0), 0, {
      id: 'guide-faq',
      label: heroLabels.FAQ ?? 'FAQ',
      title: 'FAQ',
      summary: 'Quick answers to the questions parents usually still have once the category starts making sense.',
      highlights: [],
      cards: [],
      companions: [],
      faqItems: faqEntries,
    });
  }

  return topics;
}

export default function GuideStrollerCategoryLiveLayout({
  guide,
  displayDate,
  readingTime,
  sourceRoute,
}: {
  guide: GuideArticleRecord;
  displayDate: Date;
  readingTime: number;
  sourceRoute: string;
}) {
  const config = CATEGORY_LAYOUT_CONFIG[guide.slug as SharedStrollerGuideSlug];
  const clusterConfig = getStrollerCategoryGuideConfig(guide.slug);

  if (!config || !clusterConfig) {
    return null;
  }

  const articleContent = [guide.intro, guide.content, guide.conclusion].filter(Boolean).join('\n\n');
  const outline = buildGuideOutline(articleContent);
  const prefaceBrief = buildPrefaceBrief(outline.preface);
  const faqEntries = dedupeFaqEntries({ guide, articleContent }).slice(0, 6);
  const visibleTocItems: GuideTocItem[] = [
    {
      id: 'interactive-planner',
      label: config.heroLabels['Interactive Planner'] ?? 'Interactive Planner',
      level: 2,
    },
    ...buildVisibleTocItems({
      outline,
      faqCount: faqEntries.length,
      heroLabels: config.heroLabels,
    }),
  ];
  const heroJumpLinks: GuideHeroJumpLink[] = visibleTocItems.slice(0, 6).map((item) => ({
    label: item.label,
    href: `${sourceRoute}#${item.id}`,
  }));
  const sectionOrder = outline.sections.filter((section) => section.title !== 'FAQ');
  const disclosureText =
    guide.affiliateDisclosureText?.trim() ||
    'Some links in this guide are affiliate links. Taylor-Made Baby Co. may earn a commission at no additional cost to you.';
  const showDisclosureAfterIntro =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'after_intro';
  const showDisclosureBeforeConclusion =
    guide.affiliateDisclosureEnabled && guide.affiliateDisclosurePlacement === 'before_conclusion';
  const showDisclosureBeforeAffiliates =
    guide.affiliateDisclosureEnabled &&
    (!guide.affiliateDisclosurePlacement || guide.affiliateDisclosurePlacement === 'before_affiliates');
  const relatedGuideCards = getStrollerRelatedGuideCards(guide.slug);
  const plannerTopics = buildPlannerTopics({
    sectionOrder,
    faqEntries,
    disclosureText,
    showDisclosureAfterIntro,
    showDisclosureBeforeConclusion,
    showDisclosureBeforeAffiliates,
    heroLabels: config.heroLabels,
    continueMatchTitle: clusterConfig.whatSectionTitles[0] ?? sectionOrder[1]?.title ?? 'Introduction',
    continueTitle: config.continueTitle,
    continueDescription: config.continueDescription,
    continueLinks: relatedGuideCards,
    productLinksTitle: config.productLinksTitle,
    productLinksDescription: config.productLinksDescription,
    productLinks: config.productLinks,
  });
  const seriesCards = STROLLER_SERIES_CARDS.filter((card) => card.href !== getGuidePath({ slug: guide.slug }));
  const decisionItems = getStrollerCategoryDecisionItems({
    slug: guide.slug,
    sourceRoute,
  });

  return (
    <>
      <GuideScrollProgress />

      <GuideHero
        eyebrow={guide.category}
        title={guide.title}
        description={guide.excerpt?.trim() || clusterConfig.heroDescription}
        readTime={`${readingTime} min`}
        publishedLabel={formatArticleDate(displayDate)}
        sectionCount={visibleTocItems.length}
        jumpLinks={heroJumpLinks}
        imageSrc={guide.heroImageUrl}
        imageAlt={guide.heroImageAlt}
        variant="stroller-category"
      />

      <section className="bg-[var(--tmbc-blog-ivory)]">
        <div className="mx-auto max-w-[1300px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
          <div className="stroller-hub-shell space-y-8 md:space-y-16">
            <MarketingSurface className="mx-auto max-w-6xl rounded-[1.75rem] border border-stone-200/70 bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] sm:p-6 md:rounded-[2rem] md:p-8 lg:p-10">
              <div className="max-w-3xl space-y-3">
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Start here</p>
                <h2 className="font-serif text-[1.9rem] leading-[1.04] tracking-tight text-neutral-900 sm:text-3xl">
                  What this guide is helping you decide
                </h2>
                <p className="text-[0.98rem] leading-relaxed text-neutral-700">{config.startDescription}</p>
              </div>

              <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                <div className="relative overflow-hidden rounded-[1.7rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fff8f8_0%,#f9f2ea_100%)] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.04)] sm:p-6 md:p-7">
                  <div className="absolute right-[-1.5rem] top-[-1.75rem] h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(215,161,175,0.22)_0%,rgba(215,161,175,0)_72%)]" />
                  <div className="relative space-y-6">
                    <div className="space-y-3">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">The real question</p>
                      <h3 className="max-w-[10ch] font-serif text-[2.15rem] leading-[0.98] tracking-[-0.04em] text-neutral-900 sm:text-[2.45rem]">
                        {config.questionTitle}
                      </h3>
                    </div>

                    {prefaceBrief.leadParagraph ? (
                      <p className="max-w-[34rem] text-[1rem] leading-8 text-neutral-700 sm:text-[1.04rem]">
                        {stripMarkdown(prefaceBrief.leadParagraph)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-4">
                  {prefaceBrief.supportingParagraphs[0] ? (
                    <div className="rounded-[1.55rem] border border-stone-200/70 bg-[#fcfaf7] p-5 sm:p-6">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">What this category solves</p>
                      <p className="mt-4 text-[1rem] leading-8 text-neutral-700">{stripMarkdown(prefaceBrief.supportingParagraphs[0])}</p>
                    </div>
                  ) : null}

                  {prefaceBrief.supportingParagraphs[1] ? (
                    <div className="rounded-[1.55rem] border border-stone-200/70 bg-[#fcfaf7] p-5 sm:p-6">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">What this guide will sort out</p>
                      <p className="mt-4 text-[1rem] leading-8 text-neutral-700">{stripMarkdown(prefaceBrief.supportingParagraphs[1])}</p>
                    </div>
                  ) : null}

                  {prefaceBrief.callout ? (
                    <div className="rounded-[1.55rem] border border-[rgba(232,154,174,0.26)] bg-[linear-gradient(180deg,#fffdfd_0%,#f9edf1_100%)] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.05)] sm:p-6">
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
                        {prefaceBrief.callout.title?.trim() || 'Start with the routine'}
                      </p>
                      <p className="mt-4 text-[1rem] leading-8 text-[var(--color-accent-dark)]/92">
                        {stripMarkdown(prefaceBrief.callout.body)}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {config.summaryCards.map((card) => (
                  <div
                    key={card.eyebrow}
                    className="rounded-[1.2rem] border border-[rgba(196,156,94,0.14)] bg-[rgba(255,255,255,0.74)] p-4"
                  >
                    <p className="text-[0.66rem] uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/76">{card.eyebrow}</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-700">{card.text}</p>
                  </div>
                ))}
              </div>
            </MarketingSurface>

            <GuideDecisionHelper
              id={`${guide.slug}-decision-helper`}
              eyebrow="Quick decision helper"
              title={config.decisionHelperTitle}
              description={config.decisionHelperDescription}
              items={decisionItems}
              variant="stroller-hub"
              ctaLabel="Open guide"
            />

            <GuideSectionDivider />

            <GuideCategoryCards
              id={`${guide.slug}-category-compare`}
              eyebrow="Compare nearby categories"
              title={config.compareTitle}
              description={config.compareDescription}
              cards={relatedGuideCards}
              variant="stroller-hub"
              ctaLabel="Read guide"
            />

            <GuideSectionDivider />

            <div className="space-y-4">
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="mobile" />
              <GuideTableOfContents currentPath={sourceRoute} items={visibleTocItems} mode="desktop" layout="band" />
            </div>

            <GuideStrollerInteractivePlanner topics={plannerTopics} config={config.planner} />

            <GuideSectionDivider />

            <GuideCategoryCards
              id="stroller-series"
              eyebrow="Continue the series"
              title="Compare this category with the rest of the stroller guide"
              description={config.seriesDescription}
              cards={seriesCards}
              variant="stroller-hub"
              ctaLabel="Read guide"
            />

            <GuideSectionDivider />

            <GuideSoftConversionCta
              title="Want stroller advice matched to your actual week?"
              description={config.softCtaDescription}
              href="/services"
              ctaLabel="Learn about Taylor-Made Baby Planning"
            />

            <GuideSectionDivider />

            <GuideCategoryCards
              eyebrow="Back to the hub"
              title="Use the stroller guide as your bigger map"
              description="The category guide should sharpen the decision. The main stroller hub helps you step back and compare the whole stroller map again if you need the broader view."
              cards={getStrollerHubBackLinkCard()}
              variant="stroller-hub"
              ctaLabel="Open hub"
            />
          </div>
        </div>
      </section>
    </>
  );
}
