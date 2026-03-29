export type GearAcademyModuleSlug =
  | 'how-to-think-about-baby-gear'
  | 'stroller-foundations'
  | 'car-seat-foundations'
  | 'travel-systems'
  | 'daily-use-gear';

type GearAcademyCoreSection = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
};

type GearAcademyProductExample = {
  name: string;
  description: string;
  pros: string[];
};

export type GearAcademyModuleRecord = {
  title: string;
  slug: GearAcademyModuleSlug;
  path: 'gear';
  moduleOrder: number;
  totalModules: number;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  intro: string[];
  coreSections: GearAcademyCoreSection[];
  decisionBullets: string[];
  products: GearAcademyProductExample[];
  softCtaLabel?: string;
  softCtaTitle?: string;
  softCtaBody?: string[];
  nextModuleSlug: GearAcademyModuleSlug | null;
  previousModuleSlug: GearAcademyModuleSlug | null;
  markdownContent: string;
};

type GearAcademyModuleInput = Omit<GearAcademyModuleRecord, 'path' | 'totalModules' | 'markdownContent'>;

const TOTAL_MODULES = 5;
const PLACEHOLDER_IMAGE = '/assets/placeholders/tmbc-guide-image-placeholder.svg';

function renderProductMarkdown(product: GearAcademyProductExample) {
  const lines = [
    ':::product',
    'Brand: TMBC Guided Example',
    `Product: ${product.name}`,
    `Review: ${product.description}`,
  ];

  if (product.pros.length > 0) {
    lines.push(`Pros: ${product.pros.join(' | ')}`);
  }

  lines.push(':::');
  return lines.join('\n');
}

const GEAR_ACADEMY_MODULE_INPUTS: GearAcademyModuleInput[] = [
  {
    title: 'How to Think About Baby Gear',
    slug: 'how-to-think-about-baby-gear',
    moduleOrder: 1,
    description: 'Understand how to choose baby gear based on your life, your routine, and real fit before the features start talking too loudly.',
    subhead: 'Before you choose anything, understand how to choose.',
    imagePath: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial baby gear image for the How to Think About Baby Gear module.',
    intro: [
      'Most parents start baby prep by asking what they should buy.',
      'The better question is what their life actually needs.',
      'Because baby gear is not really about features. It is about fit.',
      'And once you understand that, everything becomes simpler.',
    ],
    coreSections: [
      {
        title: 'Lifestyle first, products second',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal home entryway with stroller and natural light.',
        paragraphs: [
          'Your daily life determines your gear, not trends, popularity, or reviews.',
          'Think about your car, your space, your routine, and how often you actually leave the house.',
          'Those answers usually matter more than the brand names do.',
        ],
      },
      {
        title: 'Where most people go wrong',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Overwhelming baby store aisle concept with many options.',
        paragraphs: [
          'Most parents buy too early, buy too much, or let trends do too much of the thinking.',
          'That usually creates clutter, regret, and a setup that feels busier than it needs to be.',
          'The calmer move is to understand the job before you start collecting products for it.',
        ],
      },
      {
        title: 'Simplicity wins long-term',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Clean, minimal gear setup in a neutral environment.',
        paragraphs: [
          'The best setups are usually simpler than people expect.',
          'Fewer decisions, fewer products, and better fit almost always age better than a bigger pile of options.',
          'The goal is not to own more gear. It is to own the gear that actually helps.',
        ],
      },
    ],
    decisionBullets: [
      'Start with your lifestyle.',
      'Avoid early decisions.',
      'Focus on fit, not features.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is the foundation for everything that follows.',
    softCtaBody: ['And it is usually where most people wish they had guidance earlier.'],
    nextModuleSlug: 'stroller-foundations',
    previousModuleSlug: null,
  },
  {
    title: 'Stroller Foundations',
    slug: 'stroller-foundations',
    moduleOrder: 2,
    description:
      'Choose the stroller setup that fits your routine, your environment, and your storage reality, then use the compact-versus-full-size call to shrink the shortlist.',
    subhead: 'Not all strollers are built for the same life.',
    imagePath: '/assets/editorial/strollers.png',
    imageAlt: 'Editorial stroller image for the Stroller Foundations module.',
    intro: [
      'The biggest mistake parents make is choosing a stroller before understanding how they will use it.',
      'There is no best stroller.',
      'There is only the one that fits your day.',
      'And for most families, the compact-versus-full-size decision is the point where the shortlist finally gets smaller in a useful way.',
    ],
    coreSections: [
      {
        title: 'Full-size vs compact vs travel',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Three stroller types in soft neutral environment.',
        paragraphs: [
          'Full-size strollers are usually about everyday comfort.',
          'Compact strollers balance size and usability. Travel strollers lean into portability.',
          'Each one serves a different purpose, which is why the category decision matters first.',
        ],
      },
      {
        title: 'Where you will use it most',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Sidewalk and urban walking environment.',
        paragraphs: [
          'Think about sidewalks, stores, travel days, and the errands you actually repeat.',
          'Your environment affects what feels smooth, what feels annoying, and what quietly becomes too much stroller.',
          'That is why the route matters more than the feature grid.',
        ],
      },
      {
        title: 'Storage and transport',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Stroller folded into car trunk.',
        paragraphs: [
          'Can it fit in your car easily, and can you lift it without resenting it by week two?',
          'Those questions sound unglamorous because they are. They are also daily questions.',
          'If the fold or the trunk reality is annoying now, it rarely gets more charming later.',
        ],
      },
      {
        title: 'Everyday life vs occasional use',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Compact vs full-size visual comparison.',
        paragraphs: [
          'Full-size strollers usually make the most sense when the stroller has a real everyday job.',
          'Compact strollers make more sense when flexibility, smaller size, and easier loading matter more.',
          'How often you use it should shape the answer more than the idea of owning the bigger option.',
        ],
      },
      {
        title: 'Trade-offs that actually matter',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Stroller size comparison visual.',
        paragraphs: [
          'This choice is mostly about size versus portability and comfort versus convenience.',
          'Full-size usually wins some comfort and storage points. Compact usually wins many portability points.',
          'The right trade-off is the one that makes your regular routine easier, not the one that sounds most impressive.',
        ],
      },
    ],
    decisionBullets: [
      'Choose based on routine and frequency of use.',
      'Test size and fold mentally before you buy.',
      'Let the everyday trade-off decide the category.',
      'Prioritize ease over features.',
    ],
    products: [
      {
        name: 'Full-Size Stroller',
        description: 'A stronger fit when everyday comfort, storage, and smoother repeated outings matter most.',
        pros: ['Comfort and everyday use', 'Useful when the stroller has a real weekly job'],
      },
      {
        name: 'Compact Stroller',
        description: 'A balanced option when you want a stroller that stays flexible without feeling too stripped down.',
        pros: ['Balanced and flexible', 'Easier to live with in tighter spaces'],
      },
      {
        name: 'Travel Stroller',
        description: 'A portability-first option when lighter weight and easier carrying matter more than maximum comfort.',
        pros: ['Lightweight and portable', 'Helpful when lifting and travel matter most'],
      },
    ],
    nextModuleSlug: 'car-seat-foundations',
    previousModuleSlug: 'how-to-think-about-baby-gear',
  },
  {
    title: 'Car Seat Foundations',
    slug: 'car-seat-foundations',
    moduleOrder: 3,
    description: 'Use the car seat categories, your vehicle, and your routine to choose the safer everyday fit with less confusion.',
    subhead: 'Safety is the baseline. Fit is what matters next.',
    imagePath: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial car seat planning image for the Car Seat Foundations module.',
    intro: [
      'Car seats are one of the most important decisions you will make.',
      'Most confusion starts when people do not understand the categories first.',
      'Once the categories are clearer, the decision usually gets smaller and easier to manage.',
    ],
    coreSections: [
      {
        title: 'Infant vs convertible',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Infant car seat vs convertible car seat comparison.',
        paragraphs: [
          'Infant seats are about portability and removability. Convertible seats are about longer-term use.',
          'Neither one wins in every situation because each comes with different trade-offs.',
          'The right choice depends on which version of convenience your day will actually use.',
        ],
      },
      {
        title: 'Your car matters',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Car interior showing installed car seat.',
        paragraphs: [
          'Not all seats fit all cars equally well, and that matters more than many first-time parents expect.',
          'Space, angle, front-seat room, and vehicle layout all affect what feels workable.',
          'A seat that fits beautifully in theory can still be annoying in your actual car.',
        ],
      },
      {
        title: 'Ease of use',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Simple click-in car seat setup.',
        paragraphs: [
          'Daily usability matters right alongside safety because hard-to-use gear is more likely to create stress and inconsistency.',
          'Installation confidence, carrying, buckling, and the repeated in-and-out routine deserve real attention.',
          'A seat that is easy to use well usually becomes the better real-life choice.',
        ],
      },
    ],
    decisionBullets: [
      'Choose based on your car.',
      'Consider your daily routine.',
      'Prioritize ease.',
    ],
    products: [
      {
        name: 'Infant Car Seat',
        description: 'A useful option when portability and easy transfers are part of the daily plan.',
        pros: ['Flexibility and portability', 'Helpful in the early months when removability matters'],
      },
      {
        name: 'Convertible Car Seat',
        description: 'A stronger fit when you want the longer-term installed solution from the start.',
        pros: ['Long-term solution', 'Useful when portability matters less than longevity'],
      },
    ],
    nextModuleSlug: 'travel-systems',
    previousModuleSlug: 'stroller-foundations',
  },
  {
    title: 'Travel Systems',
    slug: 'travel-systems',
    moduleOrder: 4,
    description: 'Understand how stroller and car seat compatibility works so the setup stays practical instead of more complicated than it needs to be.',
    subhead: 'How your stroller and car seat actually work together.',
    imagePath: '/assets/editorial/stroller-folds.jpg',
    imageAlt: 'Editorial travel system image for the Travel Systems module.',
    intro: [
      'This is where a lot of parents get stuck because compatibility is not always obvious.',
      'The good news is that it gets much simpler once you understand how the connections work.',
      'The goal is not to make the setup impressive. It is to make it easy enough to use.',
    ],
    coreSections: [
      {
        title: 'Direct vs adapter systems',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Stroller and car seat connection setup.',
        paragraphs: [
          'Some systems connect directly. Others need adapters to make the stroller and car seat work together.',
          'Direct systems are usually simpler. Adapter setups offer more flexibility.',
          'Neither is automatically better. It depends on how much mixing and matching you actually need.',
        ],
      },
      {
        title: 'When it matters',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Parent moving car seat from car to stroller.',
        paragraphs: [
          'Travel systems matter most in the early months when the click-in convenience gets used regularly.',
          'If those quick transitions are a big part of your routine, this decision deserves more attention.',
          'If not, you do not need to build the whole stroller plan around a convenience window that will be relatively short.',
        ],
      },
      {
        title: 'Simplicity vs flexibility',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Clean minimal travel system setup.',
        paragraphs: [
          'Same-brand systems usually feel simpler. Cross-brand setups usually create more flexibility.',
          'The right answer depends on whether you want the cleanest path or the wider set of options.',
          'Either way, keep the setup as simple as your life allows.',
        ],
      },
    ],
    decisionBullets: [
      'Do not overcomplicate it.',
      'Choose based on use, not theory.',
      'Keep the setup simple.',
    ],
    products: [
      {
        name: 'Full Travel System',
        description: 'A cleaner option when you want one coordinated setup with fewer compatibility questions.',
        pros: ['Seamless integration', 'Helpful when simplicity matters most'],
      },
      {
        name: 'Adapter Setup',
        description: 'A flexible option when you want to mix brands without giving up travel-system functionality.',
        pros: ['Cross-brand flexibility', 'Useful when the best stroller and best seat are not the same brand'],
      },
    ],
    nextModuleSlug: 'daily-use-gear',
    previousModuleSlug: 'car-seat-foundations',
  },
  {
    title: 'Daily Use Gear',
    slug: 'daily-use-gear',
    moduleOrder: 5,
    description: "The products you'll use every single day - and feel immediately if they're wrong.",
    subhead: 'The products that shape the routine fast.',
    imagePath: '/assets/editorial/babystuff.png',
    imageAlt: 'Editorial daily-use baby gear image for the Daily Use Gear module.',
    intro: [
      'Not all gear matters equally.',
      'Some items become part of your daily rhythm. Others mostly sit there looking hopeful.',
      'This is where you focus on what actually earns a place in everyday life.',
    ],
    coreSections: [
      {
        title: 'High-frequency items',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal baby gear setup used daily.',
        paragraphs: [
          'Think about the categories that truly get used often, like carriers, feeding setups, and daily seating support.',
          'These are the items that shape the rhythm of ordinary days, not just the nursery shelf.',
          'If something gets touched constantly, it deserves more thought than the gear that only sounds useful online.',
        ],
      },
      {
        title: 'Avoiding overbuying',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal vs clutter gear comparison.',
        paragraphs: [
          'The cleaner list focuses on what supports your real routine and skips the duplicate layers that mostly create clutter.',
          'A lot of daily-use categories get overbought because parents try to solve the same job in three different ways.',
          'Usually one strong version is better than several almost-useful backups.',
        ],
      },
    ],
    decisionBullets: [
      'Prioritize daily use.',
      'Keep it simple.',
      'Avoid duplicates.',
    ],
    products: [
      {
        name: 'Baby Carrier',
        description: 'A practical daily-use tool when hands-free movement solves real friction in your week.',
        pros: ['Useful for everyday movement', 'Often earns its place quickly'],
      },
      {
        name: 'High Chair',
        description: 'A meaningful daily-use item once feeding rhythm becomes a repeated part of the day.',
        pros: ['Supports repeated feeding routines', 'Worth prioritizing when used often'],
      },
      {
        name: 'Bouncer',
        description: 'A helpful support item when you need one simple place to set baby down during the repeated parts of the day.',
        pros: ['Useful for short daily moments', 'Helps when one safe, repeatable spot matters'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where everything becomes real.',
    softCtaBody: ['And it is usually where personalized guidance makes the biggest difference.'],
    nextModuleSlug: null,
    previousModuleSlug: 'travel-systems',
  },
];

const GEAR_ACADEMY_TITLES_BY_SLUG = Object.fromEntries(
  GEAR_ACADEMY_MODULE_INPUTS.map((module) => [module.slug, module.title]),
) as Record<GearAcademyModuleSlug, string>;

function getModuleTitle(slug: GearAcademyModuleSlug) {
  return GEAR_ACADEMY_TITLES_BY_SLUG[slug];
}

function renderMarkdownContent(module: Omit<GearAcademyModuleRecord, 'markdownContent'>) {
  const lines: string[] = [
    `# ${module.title}`,
    '',
    module.subhead,
    '',
    '---',
    '',
    `## Module ${module.moduleOrder} of ${module.totalModules} · Gear`,
    '',
  ];

  module.intro.forEach((paragraph) => {
    lines.push(paragraph, '');
  });

  lines.push('---', '', '## Core Considerations', '');

  module.coreSections.forEach((section) => {
    lines.push(`### ${section.title}`, '', `![${section.imageAlt}](${section.imageSrc})`, '');
    section.paragraphs.forEach((paragraph) => {
      lines.push(paragraph, '');
    });
  });

  lines.push('---', '', '## What This Means For You', '');
  module.decisionBullets.forEach((bullet) => {
    lines.push(`- ${bullet}`);
  });

  if (module.products.length > 0) {
    lines.push('', '---', '', '## Examples That Support This Setup', '');
    module.products.forEach((product) => {
      lines.push(renderProductMarkdown(product), '');
    });
  }

  if (module.softCtaLabel && module.softCtaTitle) {
    lines.push('---', '', `## ${module.softCtaLabel}`, '', module.softCtaTitle, '');
    (module.softCtaBody ?? []).forEach((paragraph) => {
      lines.push(paragraph, '');
    });
  }

  lines.push('---', '', '## Next Steps', '');
  if (module.nextModuleSlug) {
    lines.push(`- Continue to ${getModuleTitle(module.nextModuleSlug)}`);
  } else {
    lines.push('- Continue to Registry Path');
  }

  if (module.previousModuleSlug) {
    lines.push(`- Back to ${getModuleTitle(module.previousModuleSlug)}`);
  } else {
    lines.push('- Back to Gear Path');
  }

  return lines.join('\n').trim();
}

function createGearModule(module: GearAcademyModuleInput): GearAcademyModuleRecord {
  const record: Omit<GearAcademyModuleRecord, 'markdownContent'> = {
    ...module,
    path: 'gear',
    totalModules: TOTAL_MODULES,
  };

  return {
    ...record,
    markdownContent: renderMarkdownContent(record),
  };
}

export const GEAR_ACADEMY_MODULES: GearAcademyModuleRecord[] = GEAR_ACADEMY_MODULE_INPUTS.map(createGearModule);

export const GEAR_ACADEMY_MODULES_BY_SLUG = Object.fromEntries(
  GEAR_ACADEMY_MODULES.map((module) => [module.slug, module]),
) as Record<GearAcademyModuleSlug, GearAcademyModuleRecord>;

export function isGearAcademyModuleSlug(value: string): value is GearAcademyModuleSlug {
  return value in GEAR_ACADEMY_MODULES_BY_SLUG;
}

export function getGearAcademyModule(slug: GearAcademyModuleSlug) {
  return GEAR_ACADEMY_MODULES_BY_SLUG[slug];
}
