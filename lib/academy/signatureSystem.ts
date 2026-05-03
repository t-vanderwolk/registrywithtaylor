import type { AcademyPathSlug } from '@/lib/academy/content';

type SignatureCoreSection = {
  title: string;
  paragraphs?: string[];
};

type SignatureModuleInput = {
  slug: string;
  pathSlug: AcademyPathSlug;
  title: string;
  description: string;
  subhead: string;
  intro: string[];
  coreSections: SignatureCoreSection[];
  decisionBullets: string[];
};

type SignatureContext = {
  decisionStatement: string;
  whyThisExists: string;
  quickCheckLines?: string[];
};

export type AcademySignatureSystem = {
  startHere: {
    title: string;
    description: string;
    paragraphs: string[];
  };
  decisionBlock: {
    title: string;
    description: string;
    contrast: {
      mostPeopleThink: string;
      reality: string;
    };
  };
  whatMatters: {
    title: string;
    items: string[];
  };
  whatDoesNotMatter: {
    title: string;
    items: string[];
  };
  scenarios: {
    title: string;
    items: string[];
  };
  taylorsNote: {
    title: string;
    body: string;
    supportingLine: string;
  };
  howToDecide: {
    title: string;
    description: string;
    prioritize: Array<{
      condition: string;
      recommendation: string;
    }>;
    avoid: Array<{
      condition: string;
      recommendation: string;
    }>;
  };
  decisionFilter: {
    title: string;
    chooseIf: string[];
    skipIf: string[];
  };
  clarityInsight: string;
};

const PATH_LABELS: Record<AcademyPathSlug, string> = {
  registry: 'registry',
  nursery: 'nursery',
  gear: 'gear',
  postpartum: 'postpartum',
};

function uniqueItems(items: Array<string | null | undefined>, maxItems?: number) {
  const deduped = items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  return typeof maxItems === 'number' ? deduped.slice(0, maxItems) : deduped;
}

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value;
}

function sentenceCase(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
}

function ensureSentence(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function stripTrailingPunctuation(value: string) {
  return value.trim().replace(/[.!?]+$/, '');
}

function limitWords(value: string, maxWords: number) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length <= maxWords) {
    return value.trim();
  }

  return `${words.slice(0, maxWords).join(' ').replace(/[.,;:!?]+$/, '')}.`;
}

function firstSentence(value: string) {
  const trimmed = value.trim();
  const sentence = trimmed.match(/^[^.!?]+[.!?]/)?.[0] ?? trimmed;
  return ensureSentence(sentence);
}

function getPrimaryFocus(module: SignatureModuleInput) {
  return module.coreSections[0]?.title.trim() || module.subhead.trim() || module.title;
}

function getStartTitle(module: SignatureModuleInput) {
  const focus = getPrimaryFocus(module);

  if (/^start\b/i.test(focus)) {
    return sentenceCase(focus);
  }

  return `Start with ${lowerFirst(focus)}`;
}

function getIntroParagraphs(module: SignatureModuleInput, whyThisExists: string) {
  return uniqueItems([
    ...module.intro.map((paragraph) => limitWords(paragraph, 54)),
    limitWords(whyThisExists, 54),
  ], 3);
}

function buildMatters(module: SignatureModuleInput) {
  const sectionItems = module.coreSections.map((section) => {
    const detail = section.paragraphs?.[0] ? firstSentence(section.paragraphs[0]) : '';
    const joined = detail ? `${section.title}: ${detail}` : section.title;
    return limitWords(ensureSentence(joined), 30);
  });

  const decisionItems = module.decisionBullets.map((bullet) => limitWords(ensureSentence(bullet), 24));
  return uniqueItems([...sectionItems, ...decisionItems], 5);
}

function getContrarianBase(pathSlug: AcademyPathSlug) {
  switch (pathSlug) {
    case 'registry':
      return [
        'A registry that looks impressively full but hides the items you will use in the first few weeks.',
        'Perks that nudge you into buying sooner or bigger than your actual plan requires.',
        'Adding duplicate products because each one promises to solve the same ordinary moment.',
        'Choosing a platform guests cannot shop without needing a small pep talk.',
      ];
    case 'nursery':
      return [
        'A nursery that photographs beautifully but makes the night route harder at 2:14 AM.',
        'Furniture that fills a wall but does not support sleep, feeding, changing, or storage.',
        'Buying every container before you know what actually needs a home.',
        'Styling choices that make safety or access harder.',
      ];
    case 'gear':
      return [
        'The feature that sounds clever but will not change your actual Tuesday.',
        'Owning the biggest version of a category when the smaller setup fits your car, storage, and routine better.',
        'Buying backups for every possible future before the first routine exists.',
        "A product with great reviews that solves someone else's life.",
      ];
    case 'postpartum':
      return [
        'A plan that assumes you will recover, feed, rest, and host like your energy is unchanged.',
        "Support that only exists vaguely in everyone's good intentions.",
        'Trying to look steady instead of naming what would actually help.',
        'Treating rest, food, and emotional support as extras.',
      ];
    default:
      return [
        'The option that looks complete but does not make your real day easier.',
        'Buying more just because the category feels uncertain.',
      ];
  }
}

function buildDoesNotMatter(module: SignatureModuleInput) {
  const moduleSpecific = `For ${module.title.toLowerCase()}, the least useful answer is the one that looks complete but ignores ${lowerFirst(getPrimaryFocus(module))}.`;

  return uniqueItems([moduleSpecific, ...getContrarianBase(module.pathSlug)], 5);
}

function buildScenarios(module: SignatureModuleInput) {
  switch (module.pathSlug) {
    case 'registry':
      return [
        `You are adding items late at night and the list is starting to collect duplicates. Use ${module.title} to sort the job before adding another version of the same promise.`,
        'A guest asks what would actually help. This keeps the answer practical instead of sending them into a maze of cute options.',
        'A sale or perk makes something feel urgent. Use the filter before the discount makes the decision for you.',
      ];
    case 'nursery':
      return [
        `You are standing in the room wondering what belongs where. Use ${module.title} to plan the route you will repeat when you are tired.`,
        'The room looks close to finished, but the changing, feeding, or sleep flow still feels awkward. Fix function before styling.',
        'A pretty piece is calling. Make it earn a job in the nighttime routine before it earns floor space.',
      ];
    case 'gear':
      return [
        `You are comparing three products with similar promises and no clear winner. Use ${module.title} to decide which job the category needs to solve first.`,
        'Your car, storage space, or daily errands are already telling you something. This helps those details get a vote.',
        'A product looks impressive online but annoying in motion. Let the real routine break the tie.',
      ];
    case 'postpartum':
      return [
        `The plan sounds reasonable before birth, but the first week has more motion than expected. Use ${module.title} to make support concrete.`,
        'You can feel yourself trying to power through. Name what needs help before everything depends on endurance.',
        'A partner, family member, or friend asks what they can do. Turn good intentions into a clearer job.',
      ];
    default:
      return [
        `You need a calmer way to compare the options inside ${module.title}. Start with the job before the shortlist.`,
        'The decision feels bigger than it needs to because too many unrelated details are competing at once.',
      ];
  }
}

function buildChooseIf(module: SignatureModuleInput, quickCheckLines: string[]) {
  const pathSpecific: Record<AcademyPathSlug, string> = {
    registry: 'it makes the registry easier to shop, edit, return, or live with in the first months.',
    nursery: 'it makes the room easier to move through when everyone is tired.',
    gear: 'it fits your car, storage, body, outing rhythm, or cleanup reality.',
    postpartum: 'it makes support more specific, easier to accept, or easier to repeat.',
  };

  return uniqueItems([
    ...module.decisionBullets,
    ...quickCheckLines,
    pathSpecific[module.pathSlug],
  ].map(ensureSentence), 5);
}

function buildSkipIf(module: SignatureModuleInput, doesNotMatter: string[]) {
  const pathSpecific: Record<AcademyPathSlug, string> = {
    registry: 'it only makes the list look more complete without making the first stretch easier.',
    nursery: 'it makes the room prettier but the repeated route harder.',
    gear: 'it solves a version of daily life you are not actually living.',
    postpartum: 'it depends on you having more energy, privacy, or help than the plan currently includes.',
  };

  return uniqueItems([
    `${module.title} is moving forward mainly because a product page made it feel urgent.`,
    pathSpecific[module.pathSlug],
    ...doesNotMatter.slice(0, 3),
  ].map(ensureSentence), 5);
}

function getTaylorNote(module: SignatureModuleInput) {
  const focus = lowerFirst(getPrimaryFocus(module));

  switch (module.pathSlug) {
    case 'registry':
      return {
        title: 'Most parents do not need a bigger registry. They need a calmer first pass.',
        body: `This is usually the point where ${module.title.toLowerCase()} starts sounding like a productivity project. It does not need to. Let the first weeks, your home, and your actual bandwidth do more of the editing.`,
        supportingLine: 'You are not behind. The list just needs better order.',
      };
    case 'nursery':
      return {
        title: 'This part gets easier once the room stops trying to impress anyone.',
        body: `${module.title} works better when the nighttime route, the room size, and the repeat-use jobs get the deciding vote. Pretty is welcome. Functional while tired is the part that keeps earning itself.`,
        supportingLine: 'You do not need showroom logic. You need real-room logic.',
      };
    case 'gear':
      return {
        title: 'This confuses almost everyone at first. You do not need to solve the whole category today.',
        body: `Start with ${focus}, not with the product page that yells the loudest. Once the routine gets a vote, the shortlist usually calms down on its own.`,
        supportingLine: 'Fit first. Features can wait their turn.',
      };
    case 'postpartum':
      return {
        title: 'This is where people quietly expect themselves to be more fine than they really are.',
        body: `${module.title} is about making the adult side of early parenthood more supported and less improvised. The stronger plan is the one that assumes real energy, real emotions, and real limits.`,
        supportingLine: 'Support is not extra credit. It is part of the plan.',
      };
    default:
      return {
        title: 'This does not need to be louder to get clearer.',
        body: `Use ${module.title.toLowerCase()} to make the next decision smaller, not to open more tabs.`,
        supportingLine: 'One honest layer at a time is enough.',
      };
  }
}

function getPrioritizeRecommendation(module: SignatureModuleInput, index: number) {
  const recommendationsByPath: Record<AcademyPathSlug, string[]> = {
    registry: [
      'Prioritize the option that keeps the registry easier to shop and easier to live with.',
      'Prioritize the item or setup that helps in the first stretch, not the theoretical later one.',
      'Prioritize the version that stays editable once real life gives you better information.',
    ],
    nursery: [
      'Prioritize the option that makes the room easier to move through when you are tired.',
      'Prioritize the version that earns its footprint more than once a day.',
      'Prioritize flow, reach, and repeat use before styling details.',
    ],
    gear: [
      'Prioritize the option that fits your actual routine without needing heroic optimism.',
      'Prioritize everyday fit over the feature list that only sounds impressive online.',
      'Prioritize the version you would still willingly use in a parking lot, trunk, or hallway.',
    ],
    postpartum: [
      'Prioritize the option that lowers the daily lift for the adults in the room.',
      'Prioritize the support that is repeatable, specific, and easy to accept.',
      'Prioritize the plan that works with real energy, not imaginary energy.',
    ],
  };

  const options = recommendationsByPath[module.pathSlug];
  return options[index % options.length];
}

function getAvoidRecommendation(module: SignatureModuleInput, index: number) {
  const recommendationsByPath: Record<AcademyPathSlug, string[]> = {
    registry: [
      'Avoid the version that only makes the list look more complete.',
      'Avoid adding it now if the first-pass jobs are still not clear.',
      'Avoid the setup that sounds efficient but makes the list harder for guests to use.',
    ],
    nursery: [
      'Avoid the version that fills the room faster than it helps the route.',
      'Avoid the item that looks lovely but adds one more obstacle at 2:14 AM.',
      'Avoid giving decorative logic more power than daily logic.',
    ],
    gear: [
      'Avoid the option that solves someone else’s week better than yours.',
      'Avoid the heavier, more featured version if the routine does not actually need it.',
      'Avoid letting portability, cleanup, or storage become tomorrow’s problem.',
    ],
    postpartum: [
      'Avoid the plan that depends on you quietly pushing through.',
      'Avoid treating support like a backup option instead of part of the base plan.',
      'Avoid the version that works only if no one needs rest, help, or flexibility.',
    ],
  };

  const options = recommendationsByPath[module.pathSlug];
  return options[index % options.length];
}

function buildRulePairs(
  items: string[],
  module: SignatureModuleInput,
  kind: 'prioritize' | 'avoid',
) {
  return items.slice(0, 3).map((item, index) => ({
    condition: stripTrailingPunctuation(item),
    recommendation:
      kind === 'prioritize'
        ? getPrioritizeRecommendation(module, index)
        : getAvoidRecommendation(module, index),
  }));
}

function getClarityInsight(pathSlug: AcademyPathSlug) {
  switch (pathSlug) {
    case 'registry':
      return 'You do not need a registry that proves you thought of everything. You need a list that makes the next few months easier to live.';
    case 'nursery':
      return 'You do not need a nursery that wins the reveal. You need a room that still makes sense when you are tired.';
    case 'gear':
      return 'You do not need the most impressive product in the category. You need the one that fits the routine you will actually repeat.';
    case 'postpartum':
      return 'You do not need to earn support by struggling first. You need support built into the plan from the beginning.';
    default:
      return 'You do not need a louder list. You need a clearer next decision.';
  }
}

function getContrast(module: SignatureModuleInput) {
  const focus = lowerFirst(getPrimaryFocus(module));

  if (module.pathSlug === 'postpartum') {
    return {
      mostPeopleThink: 'postpartum planning can wait until the baby gear decisions are handled.',
      reality: `the adult side needs a plan too, especially around ${focus}.`,
    };
  }

  return {
    mostPeopleThink: `the right ${module.title.toLowerCase()} answer comes from comparing every option until one looks best.`,
    reality: `the better answer starts with ${focus}, then lets the shortlist shrink around real life.`,
  };
}

export function buildAcademySignatureSystem(
  module: SignatureModuleInput,
  context: SignatureContext,
): AcademySignatureSystem {
  const whatDoesNotMatter = buildDoesNotMatter(module);
  const chooseIf = buildChooseIf(module, context.quickCheckLines ?? []);
  const skipIf = buildSkipIf(module, whatDoesNotMatter);
  const taylorsNote = getTaylorNote(module);

  return {
    startHere: {
      title: getStartTitle(module),
      description: module.description,
      paragraphs: getIntroParagraphs(module, context.whyThisExists),
    },
    decisionBlock: {
      title: `The ${PATH_LABELS[module.pathSlug]} decision inside ${module.title}`,
      description: ensureSentence(`Use this module to decide ${context.decisionStatement}`),
      contrast: getContrast(module),
    },
    whatMatters: {
      title: `What shapes ${module.title.toLowerCase()}`,
      items: buildMatters(module),
    },
    whatDoesNotMatter: {
      title: `What can stop carrying the decision`,
      items: whatDoesNotMatter,
    },
    scenarios: {
      title: `${module.title} in real life`,
      items: buildScenarios(module),
    },
    taylorsNote,
    howToDecide: {
      title: `How to decide ${module.title.toLowerCase()} in real life`,
      description: `Use the real constraint first. The right answer usually gets quieter once ${lowerFirst(
        getPrimaryFocus(module),
      )} has a vote.`,
      prioritize: buildRulePairs(chooseIf, module, 'prioritize'),
      avoid: buildRulePairs(skipIf, module, 'avoid'),
    },
    decisionFilter: {
      title: `A cleaner yes or no for ${module.title.toLowerCase()}`,
      chooseIf,
      skipIf,
    },
    clarityInsight: getClarityInsight(module.pathSlug),
  };
}
