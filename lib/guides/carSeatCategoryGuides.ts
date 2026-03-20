import type { StrollerInteractivePlannerConfig } from '@/components/guides/GuideStrollerInteractivePlanner';
import type { ParsedStyledBlock } from '@/lib/blog/styledBlocks';
import { CAR_SEAT_PRODUCT_GROUPS } from '@/lib/guides/carSeatProductCatalog';
import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';
import { CAR_SEAT_SYSTEM_PATHS } from '@/lib/guides/carSeatSystem';

export const CAR_SEAT_CATEGORY_GUIDE_SLUGS = [
  'infant-car-seats',
  'convertible-car-seats',
  'all-in-one-car-seats',
  'booster-seats',
  'rotating-car-seats',
  'travel-lightweight-car-seats',
] as const;

export type CarSeatCategoryGuideSlug = (typeof CAR_SEAT_CATEGORY_GUIDE_SLUGS)[number];

type CarSeatGuideProductExample = Extract<ParsedStyledBlock, { type: 'product' }>;

type CarSeatGuideContext = {
  breadcrumb: readonly string[];
  currentLabel: string;
  compareLabel: string;
  compareHref: string;
  compareCtaLabel: string;
  hubLabel: string;
  hubHref: string;
  hubCtaLabel: string;
};

type CarSeatGuideConfig = {
  heroEyebrow: string;
  heroDescription: string;
  context: CarSeatGuideContext;
  startPanel: {
    startDescription: string;
    questionTitle: string;
    summaryCards: Array<{
      eyebrow: string;
      text: string;
    }>;
  };
  fitCheck: {
    title: string;
    description: string;
    fitSummary: string;
    fitBullets: string[];
    notFitSummary: string;
    notFitBullets: string[];
    signatureMoment: string;
  };
  planner: Pick<
    StrollerInteractivePlannerConfig,
    | 'title'
    | 'description'
    | 'scenarioPrompt'
    | 'scenarioAriaLabel'
    | 'priorityPrompt'
    | 'priorityAriaLabel'
    | 'scenarios'
    | 'priorityLenses'
    | 'topicIcons'
  >;
  productExamples: CarSeatGuideProductExample[];
  continueExploring: {
    title: string;
    description: string;
    links: GuideHubLink[];
  };
};

function guideLink({
  title,
  description,
  bestFor,
  href,
  icon,
}: {
  title: string;
  description: string;
  bestFor: string;
  href: string;
  icon: GuideHubLink['icon'];
}): GuideHubLink {
  return {
    title,
    description,
    bestFor,
    href,
    icon,
  };
}

function anchor(path: string, id: string) {
  return `${path}#${id}`;
}

function createPlannerConfig(
  config: CarSeatGuideConfig['planner'],
): CarSeatGuideConfig['planner'] {
  return config;
}

const BASE_CAR_SEAT_TOPIC_ICONS: Partial<Record<string, GuideHubIconKey>> = {
  introduction: 'book',
  'what-to-watch-out-for': 'shield',
  'product-examples': 'bag',
  'guide-faq': 'checklist',
  'final-thoughts': 'book',
};

function toGuideProductExample(product: GuideProductExampleData): CarSeatGuideProductExample {
  return {
    type: 'product',
    brand: product.brand ?? '',
    productName: product.productName ?? product.name,
    shortReview: product.shortReview ?? 'A useful example for understanding the category more clearly.',
    pros:
      product.pros && product.pros.length > 0
        ? [...product.pros]
        : product.notes && product.notes.length > 0
          ? [...product.notes]
          : ['A thoughtful example for this category.'],
    bestFor: product.bestFor ?? 'Parents who want a clearer fit for this category.',
    standout: product.standout ?? product.typeLabel ?? null,
    affiliateLinks: [],
    imageUrl: product.imageSrc ?? null,
    imageAlt: product.imageAlt ?? null,
    typeLabel: product.typeLabel ?? null,
    specGroups: product.specGroups ? [...product.specGroups] : [],
    notes: product.notes ? [...product.notes] : [],
    ctaLabel: product.ctaLabel ?? null,
  };
}

const INFANT_PRODUCT_EXAMPLES = CAR_SEAT_PRODUCT_GROUPS.infant.map(toGuideProductExample);
const CONVERTIBLE_PRODUCT_EXAMPLES = CAR_SEAT_PRODUCT_GROUPS.convertible.map(toGuideProductExample);
const ALL_IN_ONE_PRODUCT_EXAMPLES = CAR_SEAT_PRODUCT_GROUPS.allInOne.map(toGuideProductExample);
const BOOSTER_PRODUCT_EXAMPLES = CAR_SEAT_PRODUCT_GROUPS.booster.map(toGuideProductExample);
const ROTATING_PRODUCT_EXAMPLES = CAR_SEAT_PRODUCT_GROUPS.rotating.map(toGuideProductExample);
const TRAVEL_LIGHTWEIGHT_PRODUCT_EXAMPLES = CAR_SEAT_PRODUCT_GROUPS.travelLightweight.map(toGuideProductExample);

const INFANT_PLANNER = createPlannerConfig({
  title: 'Test whether the infant-seat lane actually fits your first stage',
  description:
    'Start with the version of early life that sounds most like your week, then pressure-test the tradeoff you care about most before you assume the infant carrier is either essential or silly.',
  scenarioPrompt: 'Choose the early routine that sounds most like your week',
  scenarioAriaLabel: 'Infant car seat routine planner',
  priorityPrompt: 'Pick the infant-seat tradeoff you care about most',
  priorityAriaLabel: 'Infant car seat decision lenses',
  scenarios: [
    {
      id: 'short-trips',
      label: 'We make a lot of short drives',
      icon: 'carseat',
      fitLabel: 'Strong infant fit',
      fitTone: 'yes',
      summary:
        'When the day includes frequent in-and-out stops, the infant seat often earns its keep by making the first stage easier to move through.',
      signals: [
        'Appointments, errands, or daycare-style drop-ins are part of normal life.',
        'You care about moving a sleeping newborn without restarting the whole outing.',
        'You want the car seat to feel like part of the early routine, not the hardest part of it.',
      ],
      priorities: ['Carry ease', 'Sleeping-baby transfers', 'Short-trip flow'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'what-infant-seats-actually-solve'),
      primaryLabel: 'Jump to what infant solves',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'product-examples'),
      secondaryLabel: 'See infant examples',
    },
    {
      id: 'stroller-system',
      label: 'We expect stroller clicks to matter',
      icon: 'road',
      fitLabel: 'Often a strong fit',
      fitTone: 'yes',
      summary:
        'If the infant seat is part of a stroller system you expect to use often, that convenience can be real, not just registry theater.',
      signals: [
        'You want the newborn stage to connect smoothly with stroller use.',
        'Appointments, walks, or quick outings will often start in the car.',
        'You would rather click in than fully unbuckle every time.',
      ],
      priorities: ['Stroller compatibility', 'Fast transitions', 'Newborn convenience'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'when-infant-is-usually-the-right-starting-point'),
      primaryLabel: 'See when infant fits best',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
      secondaryLabel: 'Compare lighter travel paths',
    },
    {
      id: 'one-main-car',
      label: 'The seat will mostly live in one main car',
      icon: 'home',
      fitLabel: 'Proceed carefully',
      fitTone: 'maybe',
      summary:
        'This is where the infant category can start to feel optional. If you do not need the carrier rhythm often, the shorter-use window matters more.',
      signals: [
        'Most drives happen in one predictable vehicle.',
        'You are not expecting a lot of seat-moving between places.',
        'Longer-run simplicity already sounds appealing.',
      ],
      priorities: ['Long-run value', 'Installed simplicity', 'Stage clarity'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'when-skipping-infant-can-be-reasonable'),
      primaryLabel: 'See when skipping infant works',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      secondaryLabel: 'Compare convertible seats',
    },
    {
      id: 'minimalist-start',
      label: 'We want to skip anything short-term',
      icon: 'strategy',
      fitLabel: 'Usually not the easiest lane',
      fitTone: 'no',
      summary:
        'If your whole goal is fewer stages and less gear churn, the infant seat may feel like solving a convenience you do not actually care about.',
      signals: [
        'You keep coming back to one installed seat from day one.',
        'Portability is not the part of newborn life worrying you.',
        'The short-use window already feels annoying, not helpful.',
      ],
      priorities: ['Skip-a-stage logic', 'Longer runway', 'Fewer transitions'],
      primaryHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      primaryLabel: 'Compare convertible seats',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.allInOne,
      secondaryLabel: 'See the longer all-in-one path',
    },
  ],
  priorityLenses: [
    {
      id: 'portability',
      label: 'Portability',
      icon: 'carseat',
      verdict: 'Often the main infant advantage',
      tone: 'yes',
      summary:
        'This category usually proves itself here first. If moving the newborn stage between places feels important, the infant seat has a real job to do.',
      helpsWhen: 'You want easier in-and-out transitions, quicker stops, and less disruption during the earliest months.',
      watchout: 'If you will rarely carry the seat or click it into a stroller, the portable-carrier logic weakens fast.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'what-infant-seats-actually-solve'),
      ctaLabel: 'Review what infant solves',
    },
    {
      id: 'stroller-compatibility',
      label: 'Stroller compatibility',
      icon: 'road',
      verdict: 'Helpful when it matches real life',
      tone: 'maybe',
      summary:
        'Travel-system convenience can be lovely when it fits your routine. It is less impressive when it mostly lives in hypothetical errand planning.',
      helpsWhen: 'Your stroller and car routine are genuinely linked during the newborn stage.',
      watchout: 'Do not buy the whole category for a stroller feature you may barely use.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'when-infant-is-usually-the-right-starting-point'),
      ctaLabel: 'See when infant fits best',
    },
    {
      id: 'installation-confidence',
      label: 'Installation confidence',
      icon: 'shield',
      verdict: 'Still worth taking seriously',
      tone: 'yes',
      summary:
        'Portable does not mean casual. The best infant seat decision still depends on fit, setup confidence, and how the seat works in your actual car.',
      helpsWhen: 'You want the first-stage seat to feel manageable and trustworthy, not just easy to carry.',
      watchout: 'A lighter or more popular seat is not automatically the best fit in your vehicle.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'product-examples'),
      ctaLabel: 'Compare infant examples',
    },
    {
      id: 'short-use-window',
      label: 'Short-use window',
      icon: 'calendar',
      verdict: 'The real tradeoff to weigh',
      tone: 'maybe',
      summary:
        'Infant seats are useful because they solve a specific stage well, not because they last forever. That tradeoff is fine when the stage is worth solving.',
      helpsWhen: 'You can clearly see how the newborn carrier stage would make the first months easier.',
      watchout: 'If you are already annoyed by buying a shorter-use category, that feeling usually matters.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.infant, 'when-skipping-infant-can-be-reasonable'),
      ctaLabel: 'See when skipping infant works',
    },
  ],
  topicIcons: {
    ...BASE_CAR_SEAT_TOPIC_ICONS,
    'why-infant-seats-still-matter': 'strategy',
    'what-infant-seats-actually-solve': 'carseat',
    'when-infant-is-usually-the-right-starting-point': 'road',
    'when-skipping-infant-can-be-reasonable': 'convertible',
  },
});

const CONVERTIBLE_PLANNER = createPlannerConfig({
  title: 'Test whether the convertible lane actually fits your week',
  description:
    'Start with the routine your seat needs to survive, then test the tradeoff that matters most before you decide whether starting with a stay-in-the-car seat is smart or premature.',
  scenarioPrompt: 'Choose the installed-seat routine that sounds most like your life',
  scenarioAriaLabel: 'Convertible car seat routine planner',
  priorityPrompt: 'Pick the convertible tradeoff you care about most',
  priorityAriaLabel: 'Convertible car seat decision lenses',
  scenarios: [
    {
      id: 'one-main-car',
      label: 'We mostly use one main car',
      icon: 'home',
      fitLabel: 'Strong convertible fit',
      fitTone: 'yes',
      summary:
        'When the seat will mostly stay installed in one place, the convertible lane usually makes much more sense than the portable-carrier lane.',
      signals: [
        'Your routine is predictable and centered around one main vehicle.',
        'You want the seat to stay put and do the everyday job well.',
        'Longer-run simplicity matters more than moving the seat around.',
      ],
      priorities: ['Installed simplicity', 'Long-run fit', 'Daily comfort'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'what-convertible-actually-solves'),
      primaryLabel: 'Jump to what convertible solves',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'product-examples'),
      secondaryLabel: 'See convertible examples',
    },
    {
      id: 'skip-infant',
      label: 'We may skip the infant seat',
      icon: 'convertible',
      fitLabel: 'Often a strong fit',
      fitTone: 'yes',
      summary:
        'This is the classic convertible question. If you do not need the newborn carrier rhythm, starting here can feel refreshingly straightforward.',
      signals: [
        'You are actively comparing infant versus convertible from the start.',
        'You care more about one solid seat than a shorter portable stage.',
        'The idea of fewer category transitions sounds calming, not limiting.',
      ],
      priorities: ['From-birth use', 'Long-run value', 'Stage clarity'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'when-convertible-makes-sense-from-birth'),
      primaryLabel: 'See when convertible works from birth',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.infant,
      secondaryLabel: 'Compare infant seats',
    },
    {
      id: 'need-portability',
      label: 'We still care a lot about in-and-out convenience',
      icon: 'carseat',
      fitLabel: 'Proceed carefully',
      fitTone: 'maybe',
      summary:
        'This is where parents sometimes pick convertible because it sounds practical, then miss the newborn convenience they actually needed first.',
      signals: [
        'You keep imagining lots of short trips and sleeping-baby transfers.',
        'Stroller clicks still sound useful to you.',
        'Portable early-stage ease is hard to ignore.',
      ],
      priorities: ['Newborn logistics', 'Carry convenience', 'Stage timing'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'when-infant-may-still-fit-better'),
      primaryLabel: 'See when infant may fit better',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.infant,
      secondaryLabel: 'Compare infant seats',
    },
    {
      id: 'everyday-workhorse',
      label: 'We want one strong everyday seat',
      icon: 'road',
      fitLabel: 'Strong convertible fit',
      fitTone: 'yes',
      summary:
        'If the goal is a reliable daily workhorse that stays installed and covers a long stretch well, this is usually the right lane to study first.',
      signals: [
        'You want the seat to feel settled rather than constantly in motion.',
        'Daily use matters more than feature novelty.',
        'You want a clear installed-seat answer before chasing extra bells and whistles.',
      ],
      priorities: ['Everyday comfort', 'Longevity', 'Simplicity'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'what-convertible-actually-solves'),
      primaryLabel: 'Review the convertible job',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.rotating,
      secondaryLabel: 'Compare rotating versions',
    },
  ],
  priorityLenses: [
    {
      id: 'newborn-logistics',
      label: 'Newborn logistics',
      icon: 'carseat',
      verdict: 'Usually the deciding tradeoff',
      tone: 'maybe',
      summary:
        'This is the question underneath almost every convertible debate from birth. If you still want the seat to come with you, convertible may not be the cleanest first move.',
      helpsWhen: 'You want to be honest about whether the newborn stage needs portability or just a strong installed seat.',
      watchout: 'Do not force a long-run answer onto a short-term stage that still needs different help.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'when-infant-may-still-fit-better'),
      ctaLabel: 'See when infant fits better',
    },
    {
      id: 'long-run-value',
      label: 'Long-run value',
      icon: 'calendar',
      verdict: 'A real convertible strength',
      tone: 'yes',
      summary:
        'Convertible seats usually shine when you want a longer runway without shopping for the broadest all-in-one promise.',
      helpsWhen: 'You want the installed everyday lane to last well beyond the newborn phase.',
      watchout: 'Longer use only feels valuable if the seat also suits the life you are living right now.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'when-convertible-makes-sense-from-birth'),
      ctaLabel: 'See when convertible works',
    },
    {
      id: 'ease-of-loading',
      label: 'Ease of loading',
      icon: 'road',
      verdict: 'Worth pressure-testing honestly',
      tone: 'maybe',
      summary:
        'A standard convertible can still be the right category even if loading is not magical. The question is whether you need better ergonomics badly enough to compare rotating options too.',
      helpsWhen: 'You want to separate the convertible stage itself from the swivel-feature conversation.',
      watchout: 'Do not assume loading frustration means the whole category is wrong before you understand which version of the category you need.',
      href: CAR_SEAT_SYSTEM_PATHS.rotating,
      ctaLabel: 'Compare rotating car seats',
    },
    {
      id: 'vehicle-fit',
      label: 'Vehicle fit',
      icon: 'storage',
      verdict: 'Always part of the real decision',
      tone: 'yes',
      summary:
        'Installed seats live with your vehicle every day. Size, footprint, and setup confidence matter more here than they do in a purely abstract category debate.',
      helpsWhen: 'You want the seat to feel realistic in your actual car, not just sensible on paper.',
      watchout: 'A well-liked convertible can still be the wrong answer if the fit in your vehicle feels awkward.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.convertible, 'product-examples'),
      ctaLabel: 'Compare convertible examples',
    },
  ],
  topicIcons: {
    ...BASE_CAR_SEAT_TOPIC_ICONS,
    'why-convertible-seats-appeal-so-early': 'strategy',
    'what-convertible-actually-solves': 'convertible',
    'when-convertible-makes-sense-from-birth': 'road',
    'when-infant-may-still-fit-better': 'carseat',
  },
});

const ALL_IN_ONE_PLANNER = createPlannerConfig({
  title: 'Test whether the all-in-one lane actually earns its larger footprint',
  description:
    'Start with the kind of planning you are trying to do, then test the tradeoff that matters most before you decide whether the broadest runway is helpful or just more seat than you need right now.',
  scenarioPrompt: 'Choose the planning style that sounds most like your family',
  scenarioAriaLabel: 'All-in-one car seat routine planner',
  priorityPrompt: 'Pick the all-in-one tradeoff you care about most',
  priorityAriaLabel: 'All-in-one car seat decision lenses',
  scenarios: [
    {
      id: 'planning-ahead',
      label: 'We like planning farther ahead',
      icon: 'calendar',
      fitLabel: 'Strong all-in-one fit',
      fitTone: 'yes',
      summary:
        'When you genuinely care about the longer runway and are comfortable with a larger seat, the all-in-one lane can make sense fast.',
      signals: [
        'You would rather plan broadly once than restart every stage decision from scratch.',
        'Long-term coverage sounds useful, not just impressive.',
        'You are comfortable trading some simplicity now for fewer changes later.',
      ],
      priorities: ['Stage runway', 'Long-run value', 'Planning ease'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'what-all-in-one-actually-solves'),
      primaryLabel: 'Jump to what all-in-one solves',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'product-examples'),
      secondaryLabel: 'See all-in-one examples',
    },
    {
      id: 'one-seat-long-haul',
      label: 'We want one seat to cover more of the journey',
      icon: 'layers',
      fitLabel: 'Often a strong fit',
      fitTone: 'yes',
      summary:
        'This is the big promise of the category. It works best when you truly want the longer arc, not just the idea of doing everything in one purchase.',
      signals: [
        'You are less interested in portability and more interested in fewer future transitions.',
        'You want the category to feel like a long-haul seat, not a newborn convenience tool.',
        'A broader stage promise sounds clarifying rather than overwhelming.',
      ],
      priorities: ['Longevity', 'Fewer transitions', 'One-seat logic'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'when-all-in-one-is-usually-worth-it'),
      primaryLabel: 'See when all-in-one is worth it',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      secondaryLabel: 'Compare convertible seats',
    },
    {
      id: 'still-solvin-newborn',
      label: 'We are still solving the newborn stage first',
      icon: 'carseat',
      fitLabel: 'Proceed carefully',
      fitTone: 'maybe',
      summary:
        'If the first chapter still needs portability or a simpler answer, the all-in-one promise can be solving tomorrow before it helps today.',
      signals: [
        'You still care a lot about easier early-stage movement.',
        'The newborn chapter feels more urgent than long-range planning.',
        'The larger seat already sounds like a lot.',
      ],
      priorities: ['Current-stage fit', 'Newborn logistics', 'Practicality now'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'when-convertible-may-fit-better'),
      primaryLabel: 'See when convertible fits better',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.infant,
      secondaryLabel: 'Compare infant seats',
    },
    {
      id: 'tight-space',
      label: 'Vehicle space and seat bulk already matter',
      icon: 'storage',
      fitLabel: 'Usually not the easiest lane',
      fitTone: 'no',
      summary:
        'This is where the all-in-one lane can stop feeling efficient and start feeling simply large. Bigger coverage is not always the better everyday answer.',
      signals: [
        'You already notice vehicle space limitations.',
        'You prefer cleaner, simpler gear decisions over broad feature sets.',
        'A larger seat footprint would meaningfully affect daily life.',
      ],
      priorities: ['Seat bulk', 'Vehicle fit', 'Everyday manageability'],
      primaryHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      primaryLabel: 'Compare convertible seats',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'what-to-watch-out-for'),
      secondaryLabel: 'Review all-in-one watchouts',
    },
  ],
  priorityLenses: [
    {
      id: 'stage-runway',
      label: 'Stage runway',
      icon: 'layers',
      verdict: 'The main all-in-one promise',
      tone: 'yes',
      summary:
        'This category earns its size when the longer runway genuinely matters to you and feels worth the extra seat from the start.',
      helpsWhen: 'You want a broader long-term plan and are comfortable with a seat designed around more than one stage.',
      watchout: 'A broader age range is not automatically better if the current stage still needs a more specialized answer.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'what-all-in-one-actually-solves'),
      ctaLabel: 'Review what all-in-one solves',
    },
    {
      id: 'seat-bulk',
      label: 'Seat bulk',
      icon: 'storage',
      verdict: 'The tradeoff to respect',
      tone: 'maybe',
      summary:
        'All-in-one seats often ask you to accept more seat right now in exchange for more runway later. That is a real tradeoff, not a small footnote.',
      helpsWhen: 'You have the vehicle space and the patience for a larger setup.',
      watchout: 'If the bulk already feels annoying in theory, it usually does not become charming in practice.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'what-to-watch-out-for'),
      ctaLabel: 'See the watchouts',
    },
    {
      id: 'simplicity-now',
      label: 'Simplicity now',
      icon: 'convertible',
      verdict: 'Sometimes convertible wins here',
      tone: 'maybe',
      summary:
        'Parents often think all-in-one equals simplest. Sometimes the cleaner answer for right now is actually the narrower convertible lane.',
      helpsWhen: 'You want to separate a broad long-term plan from the simplest installed seat for the current stage.',
      watchout: 'Do not confuse broader coverage with an automatically easier everyday experience.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'when-convertible-may-fit-better'),
      ctaLabel: 'See when convertible fits better',
    },
    {
      id: 'value-over-time',
      label: 'Value over time',
      icon: 'calendar',
      verdict: 'Only useful if the path really fits',
      tone: 'yes',
      summary:
        'The value story works when the seat truly matches your family’s long-range plan. It works less well when it is mostly an emotional hedge against future decisions.',
      helpsWhen: 'You know the long runway matters more to you than an early-stage specialized seat.',
      watchout: 'Buying for every possible future only feels efficient if the present still works well.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.allInOne, 'when-all-in-one-is-usually-worth-it'),
      ctaLabel: 'See when all-in-one is worth it',
    },
  ],
  topicIcons: {
    ...BASE_CAR_SEAT_TOPIC_ICONS,
    'why-all-in-one-sounds-so-good': 'strategy',
    'what-all-in-one-actually-solves': 'layers',
    'when-all-in-one-is-usually-worth-it': 'road',
    'when-convertible-may-fit-better': 'convertible',
  },
});

const BOOSTER_PLANNER = createPlannerConfig({
  title: 'Test whether the booster conversation is actually the one you need right now',
  description:
    'Start with the stage your child is truly in, then test the later-stage tradeoff you care about most before you treat booster like either a trivial checkbox or a newborn problem in disguise.',
  scenarioPrompt: 'Choose the later-stage situation that sounds most like your reality',
  scenarioAriaLabel: 'Booster seat routine planner',
  priorityPrompt: 'Pick the booster-stage tradeoff you care about most',
  priorityAriaLabel: 'Booster seat decision lenses',
  scenarios: [
    {
      id: 'actual-transition',
      label: 'We are truly at the booster transition',
      icon: 'shield',
      fitLabel: 'Strong booster fit',
      fitTone: 'yes',
      summary:
        'When the harnessed stage is genuinely ending, booster deserves a real decision of its own instead of being treated like a quick last errand.',
      signals: [
        'You are no longer solving the first seat from birth.',
        'The next job is belt positioning, comfort, and later-stage everyday use.',
        'You want the booster stage explained clearly before choosing one quickly.',
      ],
      priorities: ['Stage readiness', 'Everyday comfort', 'Belt positioning'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'what-booster-actually-does'),
      primaryLabel: 'Jump to what booster does',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'product-examples'),
      secondaryLabel: 'See booster examples',
    },
    {
      id: 'high-back-question',
      label: 'We are deciding between high-back and backless',
      icon: 'layers',
      fitLabel: 'A very normal booster question',
      fitTone: 'yes',
      summary:
        'This is where booster finally becomes specific. Once the stage is right, the next question is what kind of booster makes the most sense.',
      signals: [
        'You are beyond the earlier harnessed conversation.',
        'You want the differences between booster types to feel practical, not abstract.',
        'Comfort and fit still matter in your daily routine.',
      ],
      priorities: ['Seat type', 'Comfort', 'Later-stage usability'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'high-back-vs-backless'),
      primaryLabel: 'Compare booster types',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'when-booster-is-usually-the-right-next-step'),
      secondaryLabel: 'See when booster fits',
    },
    {
      id: 'still-earlier-stage',
      label: 'We may still be solving an earlier stage',
      icon: 'carseat',
      fitLabel: 'Usually not this lane',
      fitTone: 'no',
      summary:
        'If you are still choosing an infant, convertible, or all-in-one seat, the booster conversation can wait. Helpful context is fine, but it is not the main job yet.',
      signals: [
        'Your child is not actually at the booster transition yet.',
        'You are still building a birth-through-toddler setup.',
        'Your current confusion is about earlier seats, not later-stage belt positioning.',
      ],
      priorities: ['Stage order', 'Earlier-seat clarity', 'Timing'],
      primaryHref: CAR_SEAT_SYSTEM_PATHS.allInOne,
      primaryLabel: 'Compare all-in-one seats',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.hub,
      secondaryLabel: 'Return to the car seat hub',
    },
    {
      id: 'later-stage-daily-use',
      label: 'We need a booster for real everyday use',
      icon: 'road',
      fitLabel: 'Strong booster fit',
      fitTone: 'yes',
      summary:
        'Once the stage is real, comfort, fit, and everyday routine still matter. Booster may be later, but it is still a real seat decision.',
      signals: [
        'The seat will get regular daily use, not just occasional backup duty.',
        'You want later-stage comfort and fit to feel intentional.',
        'You are not interested in treating booster like an afterthought.',
      ],
      priorities: ['Daily comfort', 'Vehicle fit', 'Ease of use'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'when-booster-is-usually-the-right-next-step'),
      primaryLabel: 'See when booster fits',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'what-to-watch-out-for'),
      secondaryLabel: 'Review booster watchouts',
    },
  ],
  priorityLenses: [
    {
      id: 'stage-readiness',
      label: 'Stage readiness',
      icon: 'calendar',
      verdict: 'The first booster question',
      tone: 'yes',
      summary:
        'Booster only works when the stage is genuinely here. That is what makes the whole later-stage conversation feel more grounded.',
      helpsWhen: 'You want to know whether booster is the right next step, not just the next thing people mention.',
      watchout: 'If you are still in an earlier harnessed stage, booster is useful future context but not the current decision.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'when-booster-is-usually-the-right-next-step'),
      ctaLabel: 'See when booster fits',
    },
    {
      id: 'booster-type',
      label: 'High-back vs backless',
      icon: 'layers',
      verdict: 'The next practical split',
      tone: 'maybe',
      summary:
        'Once the stage is right, this is the next distinction that actually helps. Different booster types solve slightly different everyday situations.',
      helpsWhen: 'You want the later-stage choice to feel specific and practical instead of vague.',
      watchout: 'Do not jump straight to the smallest-looking option without thinking about comfort and routine.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'high-back-vs-backless'),
      ctaLabel: 'Compare booster types',
    },
    {
      id: 'comfort-daily-use',
      label: 'Comfort for daily use',
      icon: 'road',
      verdict: 'Still matters a lot',
      tone: 'yes',
      summary:
        'Booster shopping is later-stage shopping, not lesser shopping. If the seat gets used often, comfort and ease still matter.',
      helpsWhen: 'You want a booster that works well in the actual daily rhythm, not just on a spec sheet.',
      watchout: 'Treating booster like a throwaway stage can make everyday use more annoying than it needs to be.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'what-booster-actually-does'),
      ctaLabel: 'Review the booster job',
    },
    {
      id: 'vehicle-fit',
      label: 'Vehicle fit',
      icon: 'storage',
      verdict: 'A real part of the decision',
      tone: 'yes',
      summary:
        'Later-stage seats still live in real cars with real belt paths and real sibling setups. Booster does not escape the fit question just because it comes later.',
      helpsWhen: 'You want the stage to work well in the vehicle you actually drive most.',
      watchout: 'A booster that looks simple can still be awkward in your specific everyday setup.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.booster, 'product-examples'),
      ctaLabel: 'Compare booster examples',
    },
  ],
  topicIcons: {
    ...BASE_CAR_SEAT_TOPIC_ICONS,
    'why-booster-is-a-different-conversation': 'strategy',
    'what-booster-actually-does': 'shield',
    'high-back-vs-backless': 'layers',
    'when-booster-is-usually-the-right-next-step': 'road',
  },
});

const ROTATING_PLANNER = createPlannerConfig({
  title: 'Test which rotating lane you are actually shopping inside',
  description:
    'Start with the stage where the swivel feature is catching your eye, then test the tradeoff that matters most before rotation starts pretending it is the whole category.',
  scenarioPrompt: 'Choose the stage where rotation is actually showing up',
  scenarioAriaLabel: 'Rotating car seat routine planner',
  priorityPrompt: 'Pick the rotating-seat tradeoff you care about most',
  priorityAriaLabel: 'Rotating car seat decision lenses',
  scenarios: [
    {
      id: 'rotating-infant',
      label: 'We are still in the newborn stage',
      icon: 'carseat',
      fitLabel: 'Infant rotating lane',
      fitTone: 'maybe',
      summary:
        'This is where rotation can matter inside the infant stage, not instead of it. The feature only makes sense once the newborn job is still the right job.',
      signals: [
        'You still want the infant-stage setup to feel like the right stage.',
        'You are comparing swivel convenience inside the newborn lane.',
        'Portability is still part of the conversation, not a finished chapter.',
      ],
      priorities: ['Newborn stage fit', 'Loading ease', 'Stage clarity'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'infant-rotating-car-seats'),
      primaryLabel: 'Open infant rotating guidance',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.infant,
      secondaryLabel: 'Compare standard infant seats',
    },
    {
      id: 'rotating-convertible',
      label: 'We want easier daily loading in one main car',
      icon: 'convertible',
      fitLabel: 'Strong rotating fit',
      fitTone: 'yes',
      summary:
        'This is the most common rotating conversation. If the seat stays installed in one main car, the swivel payoff can be genuinely useful.',
      signals: [
        'The seat will mostly live in one primary vehicle.',
        'Daily buckle-ins are the friction point you want to solve.',
        'You are already in the installed-seat lane, not the travel lane.',
      ],
      priorities: ['Daily loading ease', 'Primary-car comfort', 'Convertible tradeoffs'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'rotating-convertible-car-seats'),
      primaryLabel: 'Open rotating convertible guidance',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      secondaryLabel: 'Compare standard convertibles',
    },
    {
      id: 'rotating-all-in-one',
      label: 'We want a longer-run swivel path',
      icon: 'layers',
      fitLabel: 'Rotating all-in-one lane',
      fitTone: 'maybe',
      summary:
        'This is the lane for families combining the longer multi-stage promise with the swivel feature. It is a specific kind of planning, not the default rotating answer.',
      signals: [
        'You care about both longevity and easier loading.',
        'You are comfortable with a bigger seat if the longer runway is real.',
        'You are comparing within the all-in-one stage, not just chasing the swivel itself.',
      ],
      priorities: ['Longer runway', 'Swivel convenience', 'Stage-specific value'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'rotating-all-in-one-car-seats'),
      primaryLabel: 'Open rotating all-in-one guidance',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.allInOne,
      secondaryLabel: 'Compare standard all-in-ones',
    },
    {
      id: 'need-portability',
      label: 'We mostly need lighter travel or transfers',
      icon: 'plane',
      fitLabel: 'Usually not the easiest lane',
      fitTone: 'no',
      summary:
        'If your real problem is movement between cars, airports, or caregivers, rotation usually solves the wrong problem and adds weight where you least wanted it.',
      signals: [
        'You keep moving the seat between places.',
        'Carry weight or portability already matters a lot.',
        'You are solving logistics more than loading angle.',
      ],
      priorities: ['Portability', 'Transfer ease', 'Seat weight'],
      primaryHref: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
      primaryLabel: 'Compare travel & lightweight seats',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'how-to-choose-the-right-rotating-lane'),
      secondaryLabel: 'See how to choose the lane',
    },
  ],
  priorityLenses: [
    {
      id: 'stage-first',
      label: 'Stage first',
      icon: 'layers',
      verdict: 'Always the first question',
      tone: 'yes',
      summary:
        'Rotation is a feature inside a stage, not a replacement for picking the right stage. This is the distinction that keeps the whole category from getting blurry.',
      helpsWhen: 'You want to separate infant rotating, rotating convertible, and rotating all-in-one clearly before comparing products.',
      watchout: 'If you skip the stage question, the swivel feature can make almost anything sound more useful than it is.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'where-rotating-fits-in-the-car-seat-map'),
      ctaLabel: 'See where rotating fits',
    },
    {
      id: 'loading-convenience',
      label: 'Loading convenience',
      icon: 'road',
      verdict: 'The real rotating payoff',
      tone: 'yes',
      summary:
        'The swivel feature is at its best when daily loading in one main car is the problem that actually needs solving.',
      helpsWhen: 'You want easier buckle-ins often enough that the convenience payoff is real.',
      watchout: 'If you are barely in the car or keep moving the seat between places, the tradeoff can get less compelling quickly.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'when-rotating-is-usually-worth-it'),
      ctaLabel: 'See when rotating is worth it',
    },
    {
      id: 'size-weight',
      label: 'Size and weight',
      icon: 'storage',
      verdict: 'The tradeoff to respect',
      tone: 'maybe',
      summary:
        'Rotation usually adds heft. That is fine when the seat stays put and the convenience matters. It is less charming when portability is part of the job.',
      helpsWhen: 'You are using one primary vehicle and are comfortable with a more substantial seat.',
      watchout: 'Do not buy a heavier seat for a routine that really needed something easier to move.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'how-to-choose-the-right-rotating-lane'),
      ctaLabel: 'See how to choose the lane',
    },
    {
      id: 'cost-payoff',
      label: 'Cost versus payoff',
      icon: 'strategy',
      verdict: 'Worth being honest about',
      tone: 'maybe',
      summary:
        'The swivel feature tends to cost more. The question is whether the convenience shows up often enough in your life to feel genuinely worth it.',
      helpsWhen: 'You can picture the loading advantage improving your daily routine repeatedly.',
      watchout: 'If the feature mostly feels impressive on paper, the payoff usually fades after checkout.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.rotating, 'product-examples'),
      ctaLabel: 'Compare rotating examples',
    },
  ],
  topicIcons: {
    ...BASE_CAR_SEAT_TOPIC_ICONS,
    'why-rotating-seats-keep-pulling-parents-in': 'strategy',
    'what-rotating-actually-solves': 'convertible',
    'where-rotating-fits-in-the-car-seat-map': 'layers',
    'infant-rotating-car-seats': 'carseat',
    'rotating-convertible-car-seats': 'convertible',
    'rotating-all-in-one-car-seats': 'layers',
    'when-rotating-is-usually-worth-it': 'road',
    'how-to-choose-the-right-rotating-lane': 'checklist',
  },
});

const TRAVEL_LIGHTWEIGHT_PLANNER = createPlannerConfig({
  title: 'Test whether the travel and lightweight lane actually fits your life',
  description:
    'Start with the kind of movement your routine demands, then test the portability tradeoff that matters most before you buy a lighter seat for a life that mostly stays parked.',
  scenarioPrompt: 'Choose the movement pattern that sounds most like your week',
  scenarioAriaLabel: 'Travel and lightweight car seat routine planner',
  priorityPrompt: 'Pick the portability tradeoff you care about most',
  priorityAriaLabel: 'Travel and lightweight car seat decision lenses',
  scenarios: [
    {
      id: 'flights-and-rideshares',
      label: 'Flights, ride shares, or taxis keep coming up',
      icon: 'plane',
      fitLabel: 'Strong travel fit',
      fitTone: 'yes',
      summary:
        'When the seat keeps moving between destinations, a lighter travel-friendly answer can start making a lot more sense than a heavier full-time setup.',
      signals: [
        'Air travel or away-from-home movement is a real part of life.',
        'You care about the seat being easier to carry and transfer.',
        'The seat needs to behave well between places, not only in one parked routine.',
      ],
      priorities: ['Carry weight', 'Transfer ease', 'Movement-first design'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'travel-and-lightweight-is-a-filter-not-a-stage'),
      primaryLabel: 'Jump to the travel filter',
      secondaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'product-examples'),
      secondaryLabel: 'See travel examples',
    },
    {
      id: 'second-car-or-grandparents',
      label: 'Grandparents, carpools, or a second car matter',
      icon: 'calendar',
      fitLabel: 'Often a strong fit',
      fitTone: 'yes',
      summary:
        'This category often makes the most sense when you need something easier for a secondary seat situation, not necessarily for the primary daily car.',
      signals: [
        'The seat needs to move between caregivers or vehicles.',
        'Less bulk would make occasional-use logistics easier.',
        'You are solving flexibility, not just one fixed setup.',
      ],
      priorities: ['Secondary-seat ease', 'Simpler transfers', 'Less bulk'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'when-this-category-makes-sense'),
      primaryLabel: 'See when this category fits',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.infant,
      secondaryLabel: 'Compare standard infant seats',
    },
    {
      id: 'one-main-car',
      label: 'The seat mostly lives in one main car',
      icon: 'home',
      fitLabel: 'Proceed carefully',
      fitTone: 'maybe',
      summary:
        'If the seat is mostly staying installed in one vehicle, portability can start sounding more important on paper than it feels in real life.',
      signals: [
        'You have one main vehicle and a predictable routine.',
        'You are not moving the seat around often.',
        'Long-run everyday comfort may matter more than lighter movement.',
      ],
      priorities: ['Everyday fit', 'Installed use', 'Longer-run value'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'what-to-watch-out-for'),
      primaryLabel: 'Review the watchouts',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      secondaryLabel: 'Compare convertible seats',
    },
    {
      id: 'stage-confusion',
      label: 'We need to separate newborn travel from later travel',
      icon: 'layers',
      fitLabel: 'A very normal question',
      fitTone: 'maybe',
      summary:
        'This is where the category gets clearer: some families are solving newborn travel with an infant seat, while others are solving later-stage portability with a very different seat.',
      signals: [
        'You are not sure whether this is an infant conversation or a later-stage travel one.',
        'You want stage clarity before buying on vibe alone.',
        'Portability matters, but the right stage is still part of the answer.',
      ],
      priorities: ['Stage clarity', 'Travel use case', 'Realistic fit'],
      primaryHref: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'the-two-main-lanes'),
      primaryLabel: 'Compare the two travel lanes',
      secondaryHref: CAR_SEAT_SYSTEM_PATHS.rotating,
      secondaryLabel: 'Compare rotating seats',
    },
  ],
  priorityLenses: [
    {
      id: 'carry-weight',
      label: 'Carry weight',
      icon: 'plane',
      verdict: 'Usually the main advantage',
      tone: 'yes',
      summary:
        'This category usually proves itself here first. When the seat keeps moving, less weight and less bulk can feel disproportionately valuable.',
      helpsWhen: 'You want the seat to become easier to carry, store, or transfer between places.',
      watchout: 'Lightweight only matters if movement is the problem you are actually solving.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'when-this-category-makes-sense'),
      ctaLabel: 'See when this category fits',
    },
    {
      id: 'transfers-between-cars',
      label: 'Transfers between cars',
      icon: 'carseat',
      verdict: 'A strong reason to look here',
      tone: 'yes',
      summary:
        'If the seat keeps moving between caregivers or vehicles, a less cumbersome setup can be the difference between useful and exhausting.',
      helpsWhen: 'You need easier movement for grandparents, carpools, travel, or occasional-use cars.',
      watchout: 'Do not assume every light-looking seat is automatically easier to live with in actual installs.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'travel-and-lightweight-is-a-filter-not-a-stage'),
      ctaLabel: 'Review the travel filter',
    },
    {
      id: 'install-simplicity',
      label: 'Install simplicity',
      icon: 'shield',
      verdict: 'Still worth checking closely',
      tone: 'maybe',
      summary:
        'Travel-friendly should still be workable, not chaotic. The best seat here still has to make sense in the real transfer and install moments of your life.',
      helpsWhen: 'You want portability without turning every setup into a fresh puzzle.',
      watchout: 'Less weight is not the same thing as less hassle if the install still feels awkward every time.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'product-examples'),
      ctaLabel: 'Compare travel examples',
    },
    {
      id: 'everyday-comfort-tradeoff',
      label: 'Everyday comfort tradeoff',
      icon: 'road',
      verdict: 'The question to keep honest',
      tone: 'maybe',
      summary:
        'Sometimes the lighter answer is exactly right. Sometimes it quietly gives away the comfort or sturdiness you needed more in daily life.',
      helpsWhen: 'You want to be honest about whether this seat is a specialist or a full-time everyday answer.',
      watchout: 'Do not buy a travel solution for a routine that mostly stays home.',
      href: anchor(CAR_SEAT_SYSTEM_PATHS.travelLightweight, 'what-to-watch-out-for'),
      ctaLabel: 'Review the watchouts',
    },
  ],
  topicIcons: {
    ...BASE_CAR_SEAT_TOPIC_ICONS,
    'why-this-category-exists': 'strategy',
    'travel-and-lightweight-is-a-filter-not-a-stage': 'plane',
    'the-two-main-lanes': 'layers',
    'when-this-category-makes-sense': 'road',
  },
});

const CAR_SEAT_CATEGORY_GUIDE_CONFIG: Record<CarSeatCategoryGuideSlug, CarSeatGuideConfig> = {
  'infant-car-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A calmer guide to what infant car seats actually solve, when the portable newborn setup is worth it, and when skipping straight to a stay-in-the-car seat can make more sense.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Core Categories'],
      currentLabel: 'Infant Car Seats',
      compareLabel: 'Convertible Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      compareCtaLabel: 'Compare the stay-in-the-car lane ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the full stage map ->',
    },
    startPanel: {
      startDescription:
        'Infant seats are about newborn logistics first. They matter when portability, click-in transitions, and easier early movement would meaningfully improve the stage you are in right now.',
      questionTitle: 'Do you want a portable newborn carrier, or do you actually want a seat that can stay installed from day one?',
      summaryCards: [
        {
          eyebrow: 'Best signal',
          text: 'Appointments, short drives, stroller clicks, and moving a sleeping newborn without unbuckling sound genuinely useful in your real week.',
        },
        {
          eyebrow: 'Usually worth it',
          text: 'A setup that makes the first stage feel more portable, especially when you expect a lot of short trips, winter-weather loading, or stroller-system use.',
        },
        {
          eyebrow: 'Common trap',
          text: 'Buying an infant seat because everyone says you should, even though you already know you do not care about carrying the seat or using the click-in rhythm often.',
        },
      ],
    },
    fitCheck: {
      title: 'Use portability as the fit check',
      description:
        'The right infant seat should make the first stage easier to move through. If you do not need the carry-out convenience, a shorter-use category can feel less compelling very quickly.',
      fitSummary:
        'This guide is for you if you are still deciding whether the portable infant-seat stage would make early life easier or just create one more category to manage.',
      fitBullets: [
        'You want to understand what infant seats solve before assuming they are mandatory.',
        'Newborn portability, stroller clicks, or frequent short outings matter to your routine.',
        'You are choosing between starting with infant or skipping straight to a convertible.',
      ],
      notFitSummary:
        'This may not be your best fit if you already know you want one installed seat from the start and do not care about the portable-carrier rhythm.',
      notFitBullets: [
        'You plan to babywear most outings and do not need the seat to come with you.',
        'Long-term use in one main car matters more than portable convenience.',
        'You already know you are comparing convertibles or all-in-ones instead.',
      ],
      signatureMoment: 'The right infant seat should make the newborn stage easier, not just shorter.',
    },
    planner: INFANT_PLANNER,
    productExamples: INFANT_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'Once the infant lane is clearer, the next question is usually whether you want to stay in a portable newborn setup or move toward a longer-run installed seat instead.',
      links: [
        guideLink({
          title: 'Convertible Car Seats',
          description: 'Open this next if you are deciding whether to skip the infant seat and start with a seat that stays installed from the beginning.',
          bestFor: 'Parents comparing newborn portability against longer-run installed simplicity.',
          href: CAR_SEAT_SYSTEM_PATHS.convertible,
          icon: 'convertible',
        }),
        guideLink({
          title: 'Travel & Lightweight Car Seats',
          description: 'Helpful when the infant conversation overlaps with air travel, frequent car swaps, grandparents, or lighter carrying.',
          bestFor: 'Families whose newborn stage is already tied to movement between cars or destinations.',
          href: CAR_SEAT_SYSTEM_PATHS.travelLightweight,
          icon: 'plane',
        }),
        guideLink({
          title: 'Car Seat Guide',
          description: 'Return to the full stage map if you still need the bigger category picture before narrowing the decision further.',
          bestFor: 'Parents who want the full infant-versus-convertible-versus-all-in-one context again.',
          href: CAR_SEAT_SYSTEM_PATHS.hub,
          icon: 'carseat',
        }),
      ],
    },
  },
  'convertible-car-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A grounded guide to the seat that stays in the car, covers the long middle stretch of early car seat life, and makes the most sense when portable newborn convenience is not the main job.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Core Categories'],
      currentLabel: 'Convertible Car Seats',
      compareLabel: 'All-in-One Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.allInOne,
      compareCtaLabel: 'Compare the longer multi-stage lane ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the full stage map ->',
    },
    startPanel: {
      startDescription:
        'Convertible seats make the most sense when you want the seat to stay installed and do one long, steady job well instead of serving the portable newborn stage.',
      questionTitle: 'Do you want long-run installed simplicity, or are you still solving the in-and-out convenience of the newborn stage?',
      summaryCards: [
        {
          eyebrow: 'Best signal',
          text: 'You care more about a strong everyday seat living in one main car than about carrying the seat in and out of the house.',
        },
        {
          eyebrow: 'Usually worth it',
          text: 'Starting with a seat that stays put, covers a long rear-facing and forward-facing runway, and avoids buying an infant category first if you do not need it.',
        },
        {
          eyebrow: 'Common trap',
          text: 'Choosing convertible because it sounds practical, then realizing what you actually wanted was the newborn convenience of moving a sleeping baby without unbuckling.',
        },
      ],
    },
    fitCheck: {
      title: 'Use installed simplicity as the fit check',
      description:
        'The right convertible seat should feel like a good long-run everyday answer. If you keep coming back to click-in portability, you may still be solving the infant stage instead.',
      fitSummary:
        'This guide is for you if you are weighing the long-run installed seat against the shorter portable infant stage and need the tradeoff explained clearly.',
      fitBullets: [
        'You want one seat to stay in the car and do the everyday job well.',
        'Long-term value matters more than infant portability.',
        'You are deciding whether starting with a convertible fits your actual routine from birth onward.',
      ],
      notFitSummary:
        'This may not be your best fit if the first stage would feel meaningfully easier with a portable infant carrier or if you are really shopping for multi-stage longevity instead.',
      notFitBullets: [
        'You want to move the seat in and out of the car regularly.',
        'Stroller compatibility and click-in convenience are high on your list.',
        'You are actually deciding between convertible and all-in-one, not infant and convertible.',
      ],
      signatureMoment: 'A convertible seat works best when you want the seat to stay put and do the long middle job well.',
    },
    planner: CONVERTIBLE_PLANNER,
    productExamples: CONVERTIBLE_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'Once convertible is clearer, the next question is usually whether you still want the infant stage first, or whether you are actually shopping for an even longer all-in-one runway.',
      links: [
        guideLink({
          title: 'Infant Car Seats',
          description: 'Open this next if the portable newborn stage still sounds more useful than skipping straight to an installed seat.',
          bestFor: 'Parents still testing whether portability matters more than long-run simplicity right away.',
          href: CAR_SEAT_SYSTEM_PATHS.infant,
          icon: 'carseat',
        }),
        guideLink({
          title: 'All-in-One Car Seats',
          description: 'Helpful when you are already leaning installed-seat, but want to know whether the broader multi-stage promise is worth the added bulk.',
          bestFor: 'Families comparing the standard convertible lane against the longer all-in-one lane.',
          href: CAR_SEAT_SYSTEM_PATHS.allInOne,
          icon: 'layers',
        }),
        guideLink({
          title: 'Rotating Car Seats',
          description: 'Compare this next if your real question is not the convertible stage itself, but whether rotation inside that stage would make daily life easier.',
          bestFor: 'Parents deciding between a standard convertible and a convenience-first rotating version.',
          href: CAR_SEAT_SYSTEM_PATHS.rotating,
          icon: 'convertible',
        }),
      ],
    },
  },
  'all-in-one-car-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A practical guide to the seat category that promises the broadest runway, when that longer view is genuinely useful, and when the bigger seat is solving tomorrow before it helps today.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Core Categories'],
      currentLabel: 'All-in-One Car Seats',
      compareLabel: 'Convertible Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      compareCtaLabel: 'Compare the simpler installed lane ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the full stage map ->',
    },
    startPanel: {
      startDescription:
        'All-in-one seats matter when you are thinking beyond the first chapter. The category is for planners who want one broader seat, not for families who still need the easiest newborn logistics.',
      questionTitle: 'Do you want the broadest runway possible, or do you want the seat that fits this stage best right now?',
      summaryCards: [
        {
          eyebrow: 'Best signal',
          text: 'You are comfortable with a larger seat because you care more about long-run coverage than about portable newborn convenience.',
        },
        {
          eyebrow: 'Usually worth it',
          text: 'One seat covering a bigger stretch of childhood when the tradeoff of more bulk feels acceptable in exchange for fewer transitions later.',
        },
        {
          eyebrow: 'Common trap',
          text: 'Assuming a seat that does more stages is automatically the best seat for each stage, even when the earliest phase still has its own needs.',
        },
      ],
    },
    fitCheck: {
      title: 'Use long-run planning as the fit check',
      description:
        'The right all-in-one seat should feel like a deliberate longer-view choice. If you still need portable newborn convenience, the big multi-stage promise may be solving the wrong moment first.',
      fitSummary:
        'This guide is for you if you are already thinking beyond the newborn chapter and want to know when a longer-run all-in-one seat is actually the better answer.',
      fitBullets: [
        'You care about long-term coverage more than portable early-stage convenience.',
        'You are comfortable with a larger seat if the broader runway is real.',
        'You are deciding whether the all-in-one promise is better than a simpler convertible path.',
      ],
      notFitSummary:
        'This may not be your best fit if you still need the easiest early-stage portability or if you are mainly solving the installed everyday seat without needing the broadest stage coverage.',
      notFitBullets: [
        'You still want the newborn phase to feel portable and easy to move through.',
        'You prefer a simpler installed seat over the broadest possible age-range promise.',
        'Vehicle space or seat bulk already feels like a meaningful constraint.',
      ],
      signatureMoment: 'All-in-one only feels smart when the longer runway matters more than the extra bulk.',
    },
    planner: ALL_IN_ONE_PLANNER,
    productExamples: ALL_IN_ONE_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'Once the all-in-one lane is clearer, the next question is usually whether you truly need the broader runway or whether a simpler convertible or later booster plan is the better answer.',
      links: [
        guideLink({
          title: 'Convertible Car Seats',
          description: 'Open this next if you are deciding whether the broader all-in-one promise is worth more to you than the cleaner everyday job of a standard convertible.',
          bestFor: 'Parents comparing long-run coverage against simpler installed use.',
          href: CAR_SEAT_SYSTEM_PATHS.convertible,
          icon: 'convertible',
        }),
        guideLink({
          title: 'Booster Seats',
          description: 'Helpful when you want the later stage to feel more concrete instead of treating booster as an abstract future footnote.',
          bestFor: 'Families thinking farther down the road and wanting the later stage explained more clearly.',
          href: CAR_SEAT_SYSTEM_PATHS.booster,
          icon: 'shield',
        }),
        guideLink({
          title: 'Rotating Car Seats',
          description: 'Compare this next if you are interested in all-in-one longevity, but the convenience question is really about swivel loading inside that longer stage path.',
          bestFor: 'Parents curious about rotation inside the all-in-one lane.',
          href: CAR_SEAT_SYSTEM_PATHS.rotating,
          icon: 'convertible',
        }),
      ],
    },
  },
  'booster-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A grounded guide to the later-stage seat that often gets treated like an afterthought, what the booster stage actually does, and how to think about high-back, backless, and timing without turning it into guesswork.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Core Categories'],
      currentLabel: 'Booster Seats',
      compareLabel: 'All-in-One Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.allInOne,
      compareCtaLabel: 'Compare the prior longer-run stage ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the full stage map ->',
    },
    startPanel: {
      startDescription:
        'Booster seats are later-stage seats, not part of the newborn registry decision. Once you reach this chapter, though, the category deserves the same clear thinking as the earlier stages.',
      questionTitle: 'Are you actually at the booster transition, or are you trying to solve an earlier harnessed stage first?',
      summaryCards: [
        {
          eyebrow: 'Best signal',
          text: 'You are no longer solving the rear-facing or harnessed starter stage and need the next seat to do a different job: proper belt positioning for an older child.',
        },
        {
          eyebrow: 'Usually worth it',
          text: 'A booster that matches your child, your vehicle, and your everyday routine instead of treating the stage like a quick final checkbox.',
        },
        {
          eyebrow: 'Common trap',
          text: 'Thinking booster is too late-stage to matter much, then realizing later that comfort, fit, and everyday use still affect whether the seat works well.',
        },
      ],
    },
    fitCheck: {
      title: 'Use stage readiness as the fit check',
      description:
        'The right booster only makes sense when your child is truly at the booster stage. The category matters later, but it still deserves an intentional choice once you get there.',
      fitSummary:
        'This guide is for you if the later-stage transition has arrived and you want the booster category explained clearly instead of treated like a footnote.',
      fitBullets: [
        'You are no longer solving the first car seat purchase from birth.',
        'You want to understand booster timing, seat type, and everyday fit more clearly.',
        'You are deciding between high-back context and the broader booster-stage picture.',
      ],
      notFitSummary:
        'This may not be your best fit if you are still in the infant, convertible, or all-in-one decision and mainly need the earlier stages to feel less confusing.',
      notFitBullets: [
        'You are still building a newborn or toddler-stage setup.',
        'You are not yet at the booster transition in actual life.',
        'Your current question is about starting from birth, not later-stage belt positioning.',
      ],
      signatureMoment: 'Booster is a later stage, not a lesser stage.',
    },
    planner: BOOSTER_PLANNER,
    productExamples: BOOSTER_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'Booster is the later chapter, but it makes the full car seat journey easier to understand once you can see where the earlier harnessed stages were leading.',
      links: [
        guideLink({
          title: 'All-in-One Car Seats',
          description: 'Open this next if you want to understand the longer installed stage that often comes right before the booster conversation becomes real.',
          bestFor: 'Parents tracing the path from longer-run harnessed seats into booster timing.',
          href: CAR_SEAT_SYSTEM_PATHS.allInOne,
          icon: 'layers',
        }),
        guideLink({
          title: 'Convertible Car Seats',
          description: 'Helpful when you want the earlier installed seat stage to feel clearer in contrast to where the booster stage eventually begins.',
          bestFor: 'Families mapping the broader journey instead of treating stages in isolation.',
          href: CAR_SEAT_SYSTEM_PATHS.convertible,
          icon: 'convertible',
        }),
        guideLink({
          title: 'Car Seat Guide',
          description: 'Return to the full stage map if you want to zoom back out and see the entire car seat progression again.',
          bestFor: 'Parents who want the big-picture category system back in view.',
          href: CAR_SEAT_SYSTEM_PATHS.hub,
          icon: 'carseat',
        }),
      ],
    },
  },
  'rotating-car-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A calmer guide to what rotating car seats actually solve, and how to separate the category into infant, convertible, and all-in-one lanes before the swivel feature starts pretending it is the whole decision.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Specialized Paths'],
      currentLabel: 'Rotating Car Seats',
      compareLabel: 'Convertible Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.convertible,
      compareCtaLabel: 'Compare the non-rotating installed lane ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the stage map ->',
    },
    startPanel: {
      startDescription:
        'Rotating is not its own life stage. It is a feature lane inside other stages. The real question is whether you are choosing a rotating infant seat, a rotating convertible, or a rotating all-in-one.',
      questionTitle: 'Which stage are you rotating inside: infant, convertible, or all-in-one?',
      summaryCards: [
        {
          eyebrow: 'Infant rotating',
          text: 'This lane matters when you still want newborn portability, but the swivel feature is part of making the earliest stage easier to manage.',
        },
        {
          eyebrow: 'Rotating convertible',
          text: 'This is the convenience-first primary-car lane for families choosing a seat that stays installed and makes daily buckle-ins less awkward.',
        },
        {
          eyebrow: 'Rotating all-in-one',
          text: 'This lane blends the longer-run multi-stage promise with the swivel feature, which can be appealing when you want both longevity and easier loading in one main car.',
        },
      ],
    },
    fitCheck: {
      title: 'Use stage first, swivel second',
      description:
        'The right rotating seat should solve a real everyday loading problem inside the correct stage. If the stage is wrong, the swivel feature will not rescue the decision.',
      fitSummary:
        'This guide is for you if the rotating feature keeps catching your eye and you want the category split clearly enough to know whether you are really shopping infant, convertible, or all-in-one.',
      fitBullets: [
        'You are comparing rotating seats to their non-rotating stage equivalents.',
        'You want to know how infant rotation differs from rotating convertible or rotating all-in-one.',
        'Daily loading ease matters more than portability between multiple cars for at least one seat in your routine.',
      ],
      notFitSummary:
        'This may not be your best fit if your main need is portability, easy travel, or simply understanding the primary stage first without adding a specialized feature lane on top.',
      notFitBullets: [
        'You are mostly solving flights, ride shares, grandparents, or frequent seat transfers.',
        'You want the lightest or simplest seat rather than the easiest buckle-in angle.',
        'You have not yet decided whether you are actually in the infant, convertible, or all-in-one stage.',
      ],
      signatureMoment: 'Rotation is a feature lane inside a stage, not a replacement for choosing the right stage.',
    },
    planner: ROTATING_PLANNER,
    productExamples: ROTATING_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'Once you split rotating into stages, the next step is usually the non-rotating version of that stage so you can decide whether the convenience payoff is actually worth the tradeoff.',
      links: [
        guideLink({
          title: 'Infant Car Seats',
          description: 'Open this next if the rotating conversation is really happening inside the newborn portable-carrier stage.',
          bestFor: 'Parents comparing a rotating infant seat with a standard infant setup.',
          href: CAR_SEAT_SYSTEM_PATHS.infant,
          icon: 'carseat',
        }),
        guideLink({
          title: 'Convertible Car Seats',
          description: 'Helpful when the swivel question is actually part of a bigger installed-seat decision from birth through toddler life.',
          bestFor: 'Families weighing a rotating convertible against a standard convertible.',
          href: CAR_SEAT_SYSTEM_PATHS.convertible,
          icon: 'convertible',
        }),
        guideLink({
          title: 'All-in-One Car Seats',
          description: 'Compare this next if the rotating feature is attached to a longer multi-stage plan, not just a single-stage convenience need.',
          bestFor: 'Parents comparing rotating all-in-one seats against the broader all-in-one lane.',
          href: CAR_SEAT_SYSTEM_PATHS.allInOne,
          icon: 'layers',
        }),
      ],
    },
  },
  'travel-lightweight-car-seats': {
    heroEyebrow: 'Car Seat Sub-Guide',
    heroDescription:
      'A practical guide to the car seats that matter when you need less weight, easier transfers, and fewer logistics headaches once flights, ride shares, grandparents, or second vehicles enter the picture.',
    context: {
      breadcrumb: ['TMBC Guides', 'Car Seats', 'Specialized Paths'],
      currentLabel: 'Travel & Lightweight Car Seats',
      compareLabel: 'Rotating Car Seats',
      compareHref: CAR_SEAT_SYSTEM_PATHS.rotating,
      compareCtaLabel: 'Compare the convenience-first lane ->',
      hubLabel: 'Car Seat Hub',
      hubHref: CAR_SEAT_SYSTEM_PATHS.hub,
      hubCtaLabel: 'Return to the stage map ->',
    },
    startPanel: {
      startDescription:
        'Travel and lightweight is not one life stage. It is a use-case filter. This category matters when moving the seat between places becomes the real problem to solve.',
      questionTitle: 'Do you need one seat for one main car, or one that keeps moving with you?',
      summaryCards: [
        {
          eyebrow: 'Best signal',
          text: 'Flights, ride shares, grandparents, taxis, second vehicles, or frequent transfers keep showing up often enough to shape the purchase.',
        },
        {
          eyebrow: 'Usually worth paying for',
          text: 'Lower carry weight, cleaner movement between cars, and a setup that does not become the hardest part of getting out the door.',
        },
        {
          eyebrow: 'Common trap',
          text: 'Buying the lightest-looking option and realizing later that lightweight did not automatically mean easier install, better comfort, or the right stage.',
        },
      ],
    },
    fitCheck: {
      title: 'Use portability as the fit check',
      description:
        'The right travel or lightweight seat should reduce carrying, transferring, or second-car friction. If the seat mostly lives in one vehicle, the value story can change fast.',
      fitSummary:
        'This guide is for you if your car seat decision keeps overlapping with movement: airports, carpools, grandparents, taxis, or lighter everyday carrying.',
      fitBullets: [
        'You need less weight, less bulk, or easier movement between vehicles.',
        'You want to separate newborn portability from later-stage travel needs.',
        'You are trying to avoid turning a travel problem into a giant full-time seat setup.',
      ],
      notFitSummary:
        'This may not be your best fit if the seat will stay installed in one primary car and your bigger priority is long-term everyday use rather than portability.',
      notFitBullets: [
        'You are mostly choosing for a single main vehicle and a predictable routine.',
        'You care more about a long runway in one seat than moving that seat often.',
        'You are drawn to lightweight as a vibe, but not because your real life asks for it.',
      ],
      signatureMoment: 'A travel-friendly seat is not about doing less. It is about asking the seat to do the right job in a more mobile life.',
    },
    planner: TRAVEL_LIGHTWEIGHT_PLANNER,
    productExamples: TRAVEL_LIGHTWEIGHT_PRODUCT_EXAMPLES,
    continueExploring: {
      title: 'Continue exploring the car seat map',
      description:
        'Once you know portability matters, the next question is whether you need a specialized movement-first answer, a more standard infant setup, or a convenience-first rotating lane instead.',
      links: [
        guideLink({
          title: 'Infant Car Seats',
          description: 'Open this next if your portability question is really happening inside the newborn carrier stage rather than later-stage travel only.',
          bestFor: 'Parents deciding whether a standard infant setup already solves enough of the movement question.',
          href: CAR_SEAT_SYSTEM_PATHS.infant,
          icon: 'carseat',
        }),
        guideLink({
          title: 'Rotating Car Seats',
          description: 'Compare this next if the real friction point is not movement between cars, but the ergonomics of loading and buckling in one main vehicle.',
          bestFor: 'Families deciding between portability and a swivel convenience feature.',
          href: CAR_SEAT_SYSTEM_PATHS.rotating,
          icon: 'convertible',
        }),
        guideLink({
          title: 'Car Seat Guide',
          description: 'Return to the main stage map if you still need the infant-versus-convertible-versus-all-in-one decision to feel more settled first.',
          bestFor: 'Parents who want the bigger category system back in view before narrowing further.',
          href: CAR_SEAT_SYSTEM_PATHS.hub,
          icon: 'carseat',
        }),
      ],
    },
  },
};

export function isCarSeatCategoryGuideSlug(slug: string): slug is CarSeatCategoryGuideSlug {
  return (CAR_SEAT_CATEGORY_GUIDE_SLUGS as readonly string[]).includes(slug);
}

export function getCarSeatCategoryGuideConfig(slug: CarSeatCategoryGuideSlug) {
  return CAR_SEAT_CATEGORY_GUIDE_CONFIG[slug];
}
