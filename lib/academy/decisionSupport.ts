import type {
  AcademyPathSlug,
  AcademyProductExample,
  AcademyRelatedLink,
} from '@/lib/academy/content';

export type DecisionTagLabel =
  | 'Start Here'
  | 'Most Important'
  | 'Most Overbought'
  | 'Wait on This'
  | 'Most common path'
  | 'Skip this for now';

export type DecisionRouteOption = {
  title: string;
  description: string;
  href: string;
  tag?: DecisionTagLabel;
};

export type ConnectedAcademyPath = {
  label: string;
  href: string;
  current?: boolean;
};

export type ProductInsight = {
  name: string;
  brand: string;
  description: string;
  affiliateUrl: string | null;
  category: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
  problemItSolves: string;
  whenItFits: string;
  whenItDoesNotFit: string;
  tag?: DecisionTagLabel;
};

type DecisionSupportModule = {
  slug: string;
  title: string;
  description: string;
  subhead: string;
  pathSlug: AcademyPathSlug;
  progress: {
    current: number;
    total: number;
  };
  moduleType?: 'bridge' | 'standard';
  decisionBullets: string[];
  coreSections: Array<{
    title: string;
    paragraphs?: string[];
  }>;
  next?: AcademyRelatedLink | null;
  previous?: AcademyRelatedLink | null;
  related?: AcademyRelatedLink | null;
  submoduleSection?: {
    cards: Array<{
      href: string;
      title: string;
      description: string;
      ctaLabel: string;
      eyebrow?: string;
    }>;
  } | null;
  editorialLinks?: AcademyRelatedLink[];
  products?: AcademyProductExample[];
};

const PATH_LABELS: Record<AcademyPathSlug, string> = {
  registry: 'Registry',
  nursery: 'Nursery',
  gear: 'Gear',
  postpartum: 'Postpartum',
};

const PATH_PHASES: Record<AcademyPathSlug, [string, string, string]> = {
  registry: [
    "You're in the Registry foundation phase",
    "You're in the Registry strategy phase",
    "You're in the Registry refinement phase",
  ],
  nursery: [
    "You're in the Nursery planning phase",
    "You're in the Nursery flow phase",
    "You're in the Nursery finishing phase",
  ],
  gear: [
    "You're in the Gear foundation phase",
    "You're in the Gear comparison phase",
    "You're in the Gear buildout phase",
  ],
  postpartum: [
    "You're in the Postpartum support phase",
    "You're in the Postpartum adjustment phase",
    "You're in the Postpartum continuity phase",
  ],
};

const PHASE_OVERRIDES: Record<string, string> = {
  'feeding-setup-flow': "You're in the Gear feeding bridge phase",
  'breast-pump': "You're in the Gear feeding buildout phase",
  'bottles-and-baby-utensils': "You're in the Gear feeding buildout phase",
  'first-weeks-home-rhythm': "You're in the Postpartum home-rhythm phase",
};

const DECISION_STATEMENT_OVERRIDES: Record<string, string> = {
  'how-to-think-about-baby-gear':
    'how to choose gear around your actual life before any product page gets a vote',
  'stroller-foundations':
    'which stroller lane fits your week before the shortlist gets loud',
  'car-seat-foundations':
    'which car seat category fits your stage, your vehicle, and the way you actually load in and out',
  'travel-systems':
    'whether a travel system will simplify your routine or just sound efficient on paper',
  'travel-with-baby':
    'what leaving the house with a baby actually requires before you buy for every hypothetical outing',
  'daily-use-gear':
    'which daily-use categories deserve space in your real routine',
  'feeding-setup-flow':
    'what feeding setup supports your likely routine without overbuying for every possible path',
  'breast-pump':
    'whether pumping belongs in your plan, and what kind of setup makes sense if it does',
  'bottles-and-baby-utensils':
    'how much bottle gear to start with and what can wait until the routine is real',
  'what-to-register-first':
    'what belongs on the first-pass registry before the list starts shopping for a fantasy version of life',
  'where-to-register':
    'where your registry should live so the setup stays easy for both you and your guests',
  'shop-local-get-support':
    'where real registry support should come from before you default to doing the whole thing alone',
  'welcome-boxes-perks':
    'which registry perks are actually useful and which ones are just loud packaging',
  'rewards-completion-discounts':
    'how to stack registry savings without buying too early',
  'smart-purchasing-timeline':
    'when to buy, what to wait on, and how to keep timing from turning into panic',
  'mistakes-to-avoid':
    'which registry habits quietly create clutter, duplicate spending, and regret',
  'baby-showers-gifting':
    'how to make gifting easier without making the registry messier',
  'vision-and-lifestyle':
    'what kind of nursery actually fits your home, your taste, and your daily flow',
  'sleep-space-decisions':
    'how bassinets, mini cribs, pack and plays, and cribs should work together before one product tries to do every shift',
  'furniture-that-actually-works':
    'which nursery furniture pieces genuinely earn their space through repetition',
  'layout-and-flow':
    'how the room should move when you are tired, carrying a baby, and not interested in decorative obstacles',
  'storage-and-organization':
    'what needs a home in the nursery and what really does not',
  'atmosphere-and-safety':
    'how to make the room feel calm without making safety the afterthought',
  'healing-and-recovery':
    'what recovery actually asks of you and what support makes that stretch more workable',
  'first-weeks-home-rhythm':
    'how recovery, feeding, visitors, meals, and household rhythm should move through the house together',
  'feeding-and-lactation':
    'what support may matter if feeding becomes more complicated than expected',
  'rest-and-sleep':
    'how to protect rest without pretending the first stretch runs on perfect sleep hygiene',
  'emotional-wellness-and-identity':
    'how to make space for the emotional side of postpartum before it gets treated like background noise',
  'support-systems':
    'what support to line up so the first stretch does not depend on you carrying everything alone',
};

const WHY_THIS_EXISTS_OVERRIDES: Record<string, string> = {
  'feeding-setup-flow':
    'This category exists to turn feeding into a workable system before bottles, pumps, and what-if purchases start piling up faster than clarity.',
  'breast-pump':
    'This category exists because pumping gets treated like either effortless freedom or a full-time identity, when the real question is whether it fits your life and how much setup it actually adds.',
  'bottles-and-baby-utensils':
    'This category exists because bottles look simple until you realize they quietly become a whole system with flow rates, cleaning, compatibility, and just enough room for overbuying.',
  'what-to-register-first':
    'This category exists because most registries start filling before anyone has separated first-pass essentials from maybe-later extras.',
  'mistakes-to-avoid':
    'This category exists because registry regret usually comes from a handful of patterns, not one dramatic mistake.',
  'first-weeks-home-rhythm':
    'This category exists because the first weeks feel easier when recovery, feeding, food, visitors, and household expectations are treated like one shared system.',
  'sleep-space-decisions':
    'This category exists because newborn sleep rarely happens in one fixed place, and most of the overwhelm comes from thinking you need one perfect answer instead of a few setups that work together.',
};

const SPECIAL_ROUTE_OPTIONS: Record<string, DecisionRouteOption[]> = {
  'sleep-space-decisions': [
    {
      title: 'Go deeper on pack and plays',
      description: 'Open the flexible-sleep submodule if the real question is backup sleep, travel, or the everywhere-else lane.',
      href: '/academy/nursery/furniture-that-actually-works/pack-and-play',
      tag: 'Start Here',
    },
    {
      title: 'Go deeper on cribs',
      description: 'Open the crib submodule if the longer-term nursery anchor is the next layer you need to pressure-test.',
      href: '/academy/nursery/furniture-that-actually-works/cribs',
      tag: 'Most common path',
    },
    {
      title: 'Keep the nursery path moving',
      description: 'Step into the furniture module once the sleep system makes more sense than the one-product fantasy.',
      href: '/academy/nursery/furniture-that-actually-works',
      tag: 'Skip this for now',
    },
  ],
  'feeding-setup-flow': [
    {
      title: 'Planning to pump or combo feed?',
      description: 'Move into pump types, setup, and what that routine really asks of the day.',
      href: '/academy/gear/breast-pump',
      tag: 'Most common path',
    },
    {
      title: 'Planning to use bottles in any form?',
      description: 'Open the bottle system next so flow, cleaning, and quantity stay realistic.',
      href: '/academy/gear/bottles-and-baby-utensils',
      tag: 'Start Here',
    },
  ],
  'breast-pump': [
    {
      title: 'Keep the bottle side simple',
      description: 'Move into bottles next so pumping decisions stay connected to the feeding system they create.',
      href: '/academy/gear/bottles-and-baby-utensils',
      tag: 'Most common path',
    },
    {
      title: 'Zoom back out to the feeding bridge',
      description: 'Go back if the bigger question is still what your overall feeding setup should look like.',
      href: '/academy/gear/feeding-setup-flow',
      tag: 'Skip this for now',
    },
  ],
  'bottles-and-baby-utensils': [
    {
      title: 'Check the pump side next',
      description: 'Open pumps if bottles are only one part of a combo-feeding or expressed-milk setup.',
      href: '/academy/gear/breast-pump',
      tag: 'Most common path',
    },
    {
      title: 'Zoom back out to the feeding bridge',
      description: 'Step back if you still need the system view before committing to a bottle setup.',
      href: '/academy/gear/feeding-setup-flow',
      tag: 'Skip this for now',
    },
  ],
};

function uniqueItems<T>(items: T[]) {
  return items.filter((item, index) => items.indexOf(item) === index);
}

function toSentence(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function lowerFirst(value: string) {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function formatInlineList(items: string[]) {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function getDefaultDecisionStatement(module: DecisionSupportModule) {
  const title = module.title.toLowerCase();

  switch (module.pathSlug) {
    case 'gear':
      return `how ${title} should fit your routine before features start running the meeting`;
    case 'registry':
      return `how ${title} should make the registry clearer before the list gets bigger`;
    case 'nursery':
      return `how ${title} should support the room before the room starts leading the plan`;
    case 'postpartum':
      return `how ${title} should support the adults in the room, not just the plan on paper`;
    default:
      return `what ${title} should actually solve before the decision gets louder than it needs to`;
  }
}

function getDefaultWhyThisExists(module: DecisionSupportModule) {
  switch (module.pathSlug) {
    case 'gear':
      return 'This category exists to keep the gear decision grounded in your real routine instead of letting features, hype, and backup scenarios run the whole conversation.';
    case 'registry':
      return 'This category exists to keep the registry useful, giftable, and easier to edit before it turns into a giant maybe pile.';
    case 'nursery':
      return 'This category exists to make the room function better in real life, not just look more finished on paper.';
    case 'postpartum':
      return 'This category exists because the adult side of new parenthood needs support too, and that part gets underplanned more often than it should.';
    default:
      return 'This category exists to make the decision quieter before the list, cart, or room gets busier.';
  }
}

export function getAcademyPhaseLabel(module: Pick<DecisionSupportModule, 'slug' | 'pathSlug' | 'progress'>) {
  const override = PHASE_OVERRIDES[module.slug];
  if (override) {
    return override;
  }

  const safeTotal = Math.max(module.progress.total, 1);
  const ratio = module.progress.current / safeTotal;
  const phases = PATH_PHASES[module.pathSlug];

  if (ratio <= 0.34) {
    return phases[0];
  }

  if (ratio <= 0.67) {
    return phases[1];
  }

  return phases[2];
}

export function getModuleDecisionStatement(module: DecisionSupportModule) {
  return DECISION_STATEMENT_OVERRIDES[module.slug] ?? getDefaultDecisionStatement(module);
}

export function getModuleWhyThisExists(module: DecisionSupportModule) {
  return WHY_THIS_EXISTS_OVERRIDES[module.slug] ?? getDefaultWhyThisExists(module);
}

export function getQuickCheckLines(module: DecisionSupportModule) {
  const decisionLines = uniqueItems(
    module.decisionBullets
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 2),
  );

  if (decisionLines.length > 0) {
    return decisionLines;
  }

  const sectionLines = uniqueItems(
    module.coreSections
      .map((section) => section.paragraphs?.[0]?.trim() ?? '')
      .filter(Boolean)
      .slice(0, 2),
  );

  if (sectionLines.length > 0) {
    return sectionLines;
  }

  return [
    'You want the framework before the shortlist.',
    'You would rather buy for the routine than the hypothetical.',
  ];
}

export function getQuickCheckTags(module: DecisionSupportModule): DecisionTagLabel[] {
  const tags: DecisionTagLabel[] = [];

  if (module.progress.current === 1 || module.slug === 'feeding-setup-flow') {
    tags.push('Start Here');
  }

  if (module.next || module.submoduleSection?.cards?.length) {
    tags.push('Most common path');
  }

  if (module.progress.current > 1 || module.related || module.previous) {
    tags.push('Skip this for now');
  }

  if (module.slug.includes('mistakes') || module.slug.includes('discount')) {
    tags.push('Most Important');
  }

  return uniqueItems(tags).slice(0, 3);
}

function getPathOverviewOption(module: DecisionSupportModule): DecisionRouteOption {
  return {
    title: `Back to the ${PATH_LABELS[module.pathSlug]} path`,
    description: 'Zoom back out if you need the wider decision map before you keep building.',
    href: `/academy/${module.pathSlug}`,
    tag: 'Skip this for now',
  };
}

export function getDecisionRouteOptions(module: DecisionSupportModule): DecisionRouteOption[] {
  const special = SPECIAL_ROUTE_OPTIONS[module.slug];
  if (special) {
    return special.slice(0, 3);
  }

  const cards = [];

  if (module.submoduleSection?.cards?.[0]) {
    cards.push({
      title: module.submoduleSection.cards[0].title,
      description: module.submoduleSection.cards[0].description,
      href: module.submoduleSection.cards[0].href,
      tag: 'Start Here' as const,
    });
  }

  if (module.next) {
    cards.push({
      title: module.next.title,
      description: module.next.description,
      href: module.next.href,
      tag: module.progress.current === 1 ? ('Start Here' as const) : ('Most common path' as const),
    });
  }

  if (module.related) {
    cards.push({
      title: module.related.title,
      description: module.related.description,
      href: module.related.href,
      tag: 'Most Important' as const,
    });
  }

  cards.push(getPathOverviewOption(module));

  return Array.from(new Map(cards.map((card) => [card.href, card])).values()).slice(0, 2);
}

export function getConnectedAcademyPaths(pathSlug: AcademyPathSlug): ConnectedAcademyPath[] {
  const connected: Record<AcademyPathSlug, AcademyPathSlug[]> = {
    gear: ['gear', 'registry', 'postpartum'],
    registry: ['registry', 'gear', 'nursery'],
    nursery: ['nursery', 'registry', 'gear'],
    postpartum: ['postpartum', 'gear', 'registry'],
  };

  return connected[pathSlug].map((slug) => ({
    label: PATH_LABELS[slug],
    href: `/academy/${slug}`,
    current: slug === pathSlug,
  }));
}

function getFallbackWhenItFits(module: DecisionSupportModule, product: AcademyProductExample) {
  const pros = uniqueItems(product.pros.map((item) => lowerFirst(item.trim())).filter(Boolean)).slice(0, 2);

  if (pros.length > 0) {
    return `A better fit when ${formatInlineList(pros)} matter most in your actual routine.`;
  }

  switch (module.pathSlug) {
    case 'registry':
      return 'A better fit when it supports a repeated job that belongs on the first-pass list.';
    case 'gear':
      return 'A better fit when this category clearly has a real job in your everyday routine.';
    case 'nursery':
      return 'A better fit when it makes the room work better at the times of day you will actually feel it.';
    case 'postpartum':
      return 'A better fit when the support problem is concrete and the routine already shows where the friction lives.';
    default:
      return 'A better fit when the routine is real enough for the product to have an obvious job.';
  }
}

function getFallbackWhenItDoesNotFit(module: DecisionSupportModule) {
  switch (module.pathSlug) {
    case 'registry':
      return 'Not the move if the list still needs true first-pass essentials more than another maybe-later category.';
    case 'gear':
      return 'Not the move if you are still solving the category question more than the product question.';
    case 'nursery':
      return 'Not the move if it fills the room faster than it improves the routine.';
    case 'postpartum':
      return 'Not the move if the support gap is bigger than the product gap.';
    default:
      return 'Not the move if you are still buying for the hypothetical more than the real routine.';
  }
}

function getProductInsightTag(product: AcademyProductExample, index: number, total: number): DecisionTagLabel | undefined {
  const signal = `${product.name} ${product.description} ${product.pros.join(' ')}`.toLowerCase();

  if (/(extra|specialty|duplicate|accessory|deluxe|stash|multiple)/.test(signal)) {
    return 'Most Overbought';
  }

  if (/(optional|later|wait|travel|portable|convertible)/.test(signal)) {
    return 'Wait on This';
  }

  if (index === 0) {
    return 'Most Important';
  }

  if (index === total - 1 && total > 1) {
    return 'Wait on This';
  }

  return undefined;
}

function buildFallbackProductInsights(module: DecisionSupportModule): ProductInsight[] {
  if (module.pathSlug === 'postpartum') {
    return [];
  }

  return module.coreSections
    .filter((section) => !/^what /i.test(section.title))
    .slice(0, 2)
    .map((section, index, collection) => ({
      name: section.title,
      brand: '',
      description: toSentence(section.paragraphs?.[0] ?? 'A useful grounding example to keep the decision attached to real life.'),
      affiliateUrl: null,
      category: 'TMBC Academy grounding example',
      imageSrc: null,
      imageAlt: null,
      problemItSolves: toSentence(
        section.paragraphs?.[0] ??
          'This is here to keep the category grounded in a real-life job before the list gets bigger.',
      ),
      whenItFits: toSentence(
        section.paragraphs?.[1] ??
          'A better fit when this is one of the repeated jobs your home, registry, or routine actually needs covered.',
      ),
      whenItDoesNotFit: getFallbackWhenItDoesNotFit(module),
      tag: index === 0 ? 'Most Important' : collection.length > 1 ? 'Wait on This' : 'Start Here',
    }));
}

export function getProductInsights(module: DecisionSupportModule): ProductInsight[] {
  const products = module.products ?? [];

  if (products.length === 0) {
    return buildFallbackProductInsights(module);
  }

  return products.slice(0, 3).map((product, index, collection) => ({
    name: product.name,
    brand: product.brand,
    description: product.description,
    affiliateUrl: product.affiliateUrl,
    category: product.category,
    imageSrc: product.imageSrc,
    imageAlt: product.imageAlt,
    problemItSolves: toSentence(product.description),
    whenItFits: getFallbackWhenItFits(module, product),
    whenItDoesNotFit: getFallbackWhenItDoesNotFit(module),
    tag: getProductInsightTag(product, index, collection.length),
  }));
}
