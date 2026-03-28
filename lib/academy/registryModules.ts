export type RegistryAcademyModuleSlug =
  | 'where-to-register'
  | 'shop-local-get-support'
  | 'welcome-boxes-perks'
  | 'rewards-completion-discounts'
  | 'smart-purchasing-timeline'
  | 'baby-showers-gifting';

type RegistryAcademyCoreSection = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
};

type RegistryAcademyProductExample = {
  name: string;
  description: string;
  pros: string[];
};

export type RegistryAcademyModuleRecord = {
  title: string;
  slug: RegistryAcademyModuleSlug;
  path: 'registry';
  moduleOrder: number;
  totalModules: number;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  intro: string[];
  coreSections: RegistryAcademyCoreSection[];
  decisionBullets: string[];
  products: RegistryAcademyProductExample[];
  softCtaLabel: string;
  softCtaTitle: string;
  softCtaBody: string[];
  nextModuleSlug: RegistryAcademyModuleSlug | null;
  previousModuleSlug: RegistryAcademyModuleSlug | null;
  markdownContent: string;
};

type RegistryAcademyModuleInput = Omit<RegistryAcademyModuleRecord, 'path' | 'totalModules' | 'markdownContent'>;

const TOTAL_MODULES = 6;
const PLACEHOLDER_IMAGE = '/assets/placeholders/tmbc-guide-image-placeholder.svg';

function renderProductMarkdown(product: RegistryAcademyProductExample) {
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

const REGISTRY_ACADEMY_MODULE_INPUTS: RegistryAcademyModuleInput[] = [
  {
    title: 'Where to Register',
    slug: 'where-to-register',
    moduleOrder: 1,
    description: 'Choose the registry setup that fits your perks, your guests, and how much flexibility you actually want.',
    subhead: 'Choosing the right platform matters more than most people realize.',
    imagePath: PLACEHOLDER_IMAGE,
    imageAlt: 'Registry planning editorial image for the Where to Register module.',
    intro: [
      'Most parents think a registry is just a list.',
      'In reality, it is a system.',
      'Where you register affects what perks you get, how easy it is to manage, and how flexible your options are.',
      'This is not just a technical decision. It is a strategic one.',
    ],
    coreSections: [
      {
        title: 'Single retailer vs universal registry',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Clean desk with laptop and registry planning setup.',
        paragraphs: [
          'Some registries are tied to one store. Others let you pull products from anywhere.',
          'A universal registry gives you flexibility. A single retailer can offer stronger perks.',
          'The better choice depends on whether you care more about customization, convenience, or a little of both.',
        ],
      },
      {
        title: 'Ease for your guests',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal gifting setup with wrapped baby gifts in neutral tones.',
        paragraphs: [
          'Your registry is not just for you. It needs to feel easy for the people using it.',
          'Simple navigation, clear product choices, and a familiar checkout experience matter more than people expect.',
          'A registry that feels confusing to guests usually creates more off-list buying, not better gifting.',
        ],
      },
      {
        title: 'Long-term flexibility',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Neutral workspace with registry planning notes.',
        paragraphs: [
          'Your needs will change as you go, and the registry should be able to change with you.',
          'Choose a platform that lets you swap items, adjust quantities, and update priorities without friction.',
          'That flexibility matters even more once you start timing discounts and final purchases.',
        ],
      },
    ],
    decisionBullets: [
      'If you want flexibility, choose a universal registry.',
      'If you want simplicity, choose one main retailer.',
      'If you want both, combine them strategically.',
    ],
    products: [
      {
        name: 'Universal Registry Platform',
        description: 'Pull products from multiple retailers so one registry can hold the items that actually fit your plan.',
        pros: ['Flexible and customizable', 'Useful when you want one list across multiple stores'],
      },
      {
        name: 'Retailer-Based Registry',
        description: 'Keep the experience simpler with one main store and a clearer guest checkout path.',
        pros: ['Often includes stronger perks', 'Useful when ease and simplicity matter most'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where your registry starts to take shape.',
    softCtaBody: ['Small decisions here can affect everything that follows.'],
    nextModuleSlug: 'shop-local-get-support',
    previousModuleSlug: null,
  },
  {
    title: 'Shop Local & Get Support',
    slug: 'shop-local-get-support',
    moduleOrder: 2,
    description:
      'Use local stores, hybrid shopping, and real expert guidance so registry decisions feel calmer, faster, and much less isolating.',
    subhead: 'Shop locally, think strategically, and stop trying to figure this out alone.',
    imagePath: '/assets/editorial/registry.jpg',
    imageAlt: 'Registry support and guided shopping editorial image for the Shop Local & Get Support module.',
    intro: [
      'Once you know where your registry lives, the next question becomes where you should actually shop.',
      'This is where most parents fall into the same pattern: they scroll, compare, read reviews, watch videos, and try to piece everything together on their own.',
      'The shift that changes everything is realizing you do not need more research. You need better guidance.',
    ],
    coreSections: [
      {
        title: 'Start here: shop local if you can',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Independent baby store shopping and stroller testing setup.',
        paragraphs: [
          'Before anything else, check whether there is a locally owned baby store near you.',
          'Independent stores let you test strollers in person, compare car seats side by side, feel the materials, and ask questions that actually apply to your life.',
          'That kind of hands-on guidance is often the closest thing to having someone walk through the registry with you.',
        ],
      },
      {
        title: 'Hybrid and virtual support',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Virtual baby registry consultation and shopping support.',
        paragraphs: [
          'If a local store is not available or your schedule does not leave much room for in-person visits, there is still a strong middle ground.',
          'Hybrid shopping lets you learn virtually, confirm in store when needed, and build the registry with actual support instead of guesswork.',
          'Virtual guidance works best when it feels like a real conversation about your lifestyle, not just another product page with better branding.',
        ],
      },
      {
        title: 'Experts vs influencers',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Editorial comparison between expert guidance and general baby product content.',
        paragraphs: [
          'There is a lot of baby content online, but much of it is sponsored, generalized, or built to sell faster than it guides.',
          'Real guidance sounds different. It explains why something works for your car, your home, your routine, and your priorities.',
          'The fastest way to clarity is not more content. It is the right conversation with someone who can help you narrow instead of overwhelm.',
        ],
      },
    ],
    decisionBullets: [
      'You do not have to figure everything out alone.',
      'Start with real expert support, whether that is local, virtual, or hybrid.',
      'Narrow the big decisions first so the registry becomes easier to build strategically.',
    ],
    products: [
      {
        name: 'Target Baby Concierge',
        description: 'A guided registry support option that gives you one-on-one help, product comparisons, and real conversation about your lifestyle.',
        pros: ['Virtual and in-store support', 'Useful when you want a clearer starting point'],
      },
      {
        name: 'Independent Baby Store Consultation',
        description: 'A local or virtual walkthrough that helps you test products, ask better questions, and choose with more confidence.',
        pros: ['Hands-on product testing', 'Relationship-based guidance'],
      },
      {
        name: 'Specialty Retailer Hybrid Support',
        description: 'A deeper education-driven option from specialty retailers that combine consults, product testing, and more strategic recommendations.',
        pros: ['Good for comparing categories', 'Works well when you need more decision support'],
      },
    ],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'If this feels like a shift, it is.',
    softCtaBody: [
      'Most people try to solve this with more information. You are solving it with better guidance.',
      'Support does not make this process more complicated. It makes it easier.',
    ],
    nextModuleSlug: 'welcome-boxes-perks',
    previousModuleSlug: 'where-to-register',
  },
  {
    title: 'Welcome Boxes & Perks',
    slug: 'welcome-boxes-perks',
    moduleOrder: 3,
    description: 'Use welcome boxes on purpose so they become product testing and early value, not random freebies you forget about.',
    subhead: "The hidden benefits most parents don't fully use.",
    imagePath: '/assets/editorial/welcome.png',
    imageAlt: 'Welcome boxes and registry perks editorial image for the Welcome Boxes & Perks module.',
    intro: [
      'Many registries offer welcome boxes, but most families do not realize how to use them well.',
      'This is where your registry starts to give back.',
      'Handled intentionally, these perks can help you test products, reduce early spending, and learn what works before you buy more.',
    ],
    coreSections: [
      {
        title: 'What welcome boxes actually include',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Flat lay of baby sample products in soft neutral tones.',
        paragraphs: [
          'Welcome boxes often include sample products, essentials, and trial sizes.',
          'They are designed to introduce you to brands before you commit to full-size purchases.',
          'That makes them more useful as testing tools than as some grand registry jackpot.',
        ],
      },
      {
        title: 'How to qualify',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Laptop with registry checklist in progress.',
        paragraphs: [
          'Each platform has its own requirements, and that is where families often miss the window.',
          'Usually you need to create the registry, add items, and complete a few minimum actions before the box unlocks.',
          'Sign up early enough that you can meet those steps without scrambling later.',
        ],
      },
      {
        title: 'Why they matter',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal baby products neatly arranged.',
        paragraphs: [
          'These boxes help you test products, reduce initial spending, and discover what works in real life.',
          'They are especially useful for the categories where preferences vary more than people expect.',
          'Think of them as low-stakes information, not as proof you now need the full brand lineup.',
        ],
      },
    ],
    decisionBullets: [
      'Sign up early.',
      'Understand the requirements before you assume the perk is automatic.',
      'Use welcome boxes as testing tools, not as a reason to overbuy.',
    ],
    products: [
      {
        name: 'Registry Welcome Kit',
        description: 'A sample-based perk that lets you test a few basics before you commit to more of the same category.',
        pros: ['Includes trial-size products', 'Useful for low-stakes product testing'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is one of the easiest ways to get value from your registry.',
    softCtaBody: ['But only if you approach it intentionally.'],
    nextModuleSlug: 'rewards-completion-discounts',
    previousModuleSlug: 'shop-local-get-support',
  },
  {
    title: 'Loyalty, Rewards & Completion Discounts',
    slug: 'rewards-completion-discounts',
    moduleOrder: 4,
    description: 'Use discounts, rewards, and timing together so you can save well without filling the house too early.',
    subhead: 'How to save without overbuying.',
    imagePath: '/assets/editorial/registry.png',
    imageAlt: 'Registry savings and planning editorial image for the Rewards & Completion Discounts module.',
    intro: [
      'This is where strategy matters.',
      'Timing your purchases well can save you more than most people expect.',
      'The goal is not to buy everything at once. It is to let the registry work for you before you start closing the gaps yourself.',
    ],
    coreSections: [
      {
        title: 'Completion discounts',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft image of baby products neatly arranged.',
        paragraphs: [
          'Most registries offer a discount window before your due date.',
          'That is your chance to buy the remaining essentials at a lower cost after gifts and priorities have settled a bit.',
          'The value comes from waiting long enough to see what still needs to be purchased.',
        ],
      },
      {
        title: 'Reward programs',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal credit and reward concept visual.',
        paragraphs: [
          'Some retailers also offer points, credits, or cashback through their registry systems.',
          'Those programs can help, but only if you understand what qualifies and when the reward actually posts.',
          'If the rules are fuzzy, read them before you assume the savings will stack themselves.',
        ],
      },
      {
        title: 'Stackable savings',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Organized shopping setup with minimal items.',
        paragraphs: [
          'The real advantage comes from combining discounts, rewards, and timing.',
          'That might mean waiting for the completion window, then using earned credits or retailer rewards on the final essentials.',
          'A little strategy here usually beats a lot of early, scattered shopping.',
        ],
      },
    ],
    decisionBullets: [
      'Do not buy everything early.',
      'Use your completion window strategically.',
      'Combine savings where possible.',
    ],
    products: [
      {
        name: 'Registry Discount Program',
        description: 'A savings setup that helps reduce the final cost of the items still left on your list.',
        pros: ['Helps reduce final costs', 'Works best when paired with timing and rewards'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where your registry becomes a financial tool, not just a list.',
    softCtaBody: ['A little patience here can save you from paying full price for the things you were always going to buy anyway.'],
    nextModuleSlug: 'smart-purchasing-timeline',
    previousModuleSlug: 'welcome-boxes-perks',
  },
  {
    title: 'Smart Purchasing Timeline',
    slug: 'smart-purchasing-timeline',
    moduleOrder: 5,
    description: 'Buy in phases so the essentials get covered, the maybes stay flexible, and the discount windows still do their job.',
    subhead: 'When to buy matters just as much as what you buy.',
    imagePath: '/assets/editorial/clipboard.png',
    imageAlt: 'Registry purchasing timeline editorial image for the Smart Purchasing Timeline module.',
    intro: [
      'One of the biggest mistakes parents make is buying everything too early.',
      'That usually creates unnecessary spending, clutter, and regret.',
      'A smarter timeline gives your registry room to work before the boxes start stacking up in the corner.',
    ],
    coreSections: [
      {
        title: 'What to buy first',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal nursery setup early stage.',
        paragraphs: [
          'Start with the nursery foundation and the first-stage essentials that support life right away.',
          'These are the categories that make the house work, not just the registry look complete.',
          'If an item solves an immediate daily job, it probably belongs earlier in the timeline.',
        ],
      },
      {
        title: 'What to wait on',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft image of optional baby gear.',
        paragraphs: [
          'Some items can wait, especially extra gear, duplicates, and upgrades.',
          'A lot of later-stage products look urgent on paper and much less urgent once the baby actually arrives.',
          'Waiting is not under-preparing. It is often how you avoid buying the wrong version too soon.',
        ],
      },
      {
        title: 'Timing your purchases',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Calendar-style visual in neutral tones.',
        paragraphs: [
          'Use registry milestones, discount windows, and real needs to guide the timing.',
          'That usually means registering early, letting gifts come in, then closing the gaps closer to the due date.',
          'The calmer approach is to buy in phases, not in one dramatic weekend.',
        ],
      },
    ],
    decisionBullets: [
      'Buy in phases.',
      'Avoid rushing.',
      'Let your actual needs guide you.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where your registry becomes intentional.',
    softCtaBody: ['Buy in phases, use the windows well, and let real need do the editing.'],
    nextModuleSlug: 'baby-showers-gifting',
    previousModuleSlug: 'rewards-completion-discounts',
  },
  {
    title: 'Baby Showers & Gifting Strategy',
    slug: 'baby-showers-gifting',
    moduleOrder: 6,
    description: 'Guide gifting clearly so guests can shop confidently, duplicates stay down, and the registry still feels easy to use.',
    subhead: 'How to guide what you receive without overcomplicating it.',
    imagePath: '/assets/editorial/bunny-gift.png',
    imageAlt: 'Baby shower and gifting editorial image for the Baby Showers & Gifting Strategy module.',
    intro: [
      'A baby shower is not just a celebration.',
      'It is part of your registry strategy.',
      'When the registry is clear and easy to use, gifting usually gets simpler for everyone involved.',
    ],
    coreSections: [
      {
        title: 'Guiding your guests',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft baby shower setup in neutral tones.',
        paragraphs: [
          'Clear registries help guests feel confident about what to buy.',
          'The more obvious your categories and priorities are, the easier it is for people to choose something useful.',
          'Most guests want direction. They just do not want homework.',
        ],
      },
      {
        title: 'Avoiding duplicates',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal gift arrangement.',
        paragraphs: [
          'A well-structured registry reduces overlap because it shows what has already been claimed and what still matters.',
          'That becomes even more important when people are shopping across different budgets and timelines.',
          'The clearer the list, the less likely you are to end up with three versions of the same maybe-useful item.',
        ],
      },
      {
        title: 'Balancing essentials and gifts',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft styled baby gifts.',
        paragraphs: [
          'A strong registry usually includes both practical items and a few meaningful extras.',
          'That balance gives guests room to choose something that feels good to give without abandoning the essentials.',
          'You do not need to make it precious. You just need to make it easy to shop well.',
        ],
      },
    ],
    decisionBullets: [
      'Guide, do not overwhelm.',
      'Keep the registry clear.',
      'Balance practical needs with a few giftable extras.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where everything comes together.',
    softCtaBody: ['A clear registry helps people give well without turning the whole process into a group project.'],
    nextModuleSlug: null,
    previousModuleSlug: 'smart-purchasing-timeline',
  },
];

const REGISTRY_ACADEMY_TITLES_BY_SLUG = Object.fromEntries(
  REGISTRY_ACADEMY_MODULE_INPUTS.map((module) => [module.slug, module.title]),
) as Record<RegistryAcademyModuleSlug, string>;

function getModuleTitle(slug: RegistryAcademyModuleSlug) {
  return REGISTRY_ACADEMY_TITLES_BY_SLUG[slug];
}

function renderMarkdownContent(module: Omit<RegistryAcademyModuleRecord, 'markdownContent'>) {
  const lines: string[] = [
    `# ${module.title}`,
    '',
    module.subhead,
    '',
    '---',
    '',
    `## Module ${module.moduleOrder} of ${module.totalModules} · Registry`,
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

  lines.push('---', '', `## ${module.softCtaLabel}`, '', module.softCtaTitle, '');
  module.softCtaBody.forEach((paragraph) => {
    lines.push(paragraph, '');
  });

  lines.push('---', '', '## Next Steps', '');
  if (module.nextModuleSlug) {
    lines.push(`- Continue to ${getModuleTitle(module.nextModuleSlug)}`);
  } else {
    lines.push('- Continue to Gear Path');
  }

  if (module.previousModuleSlug) {
    lines.push(`- Back to ${getModuleTitle(module.previousModuleSlug)}`);
  } else {
    lines.push('- Back to Registry Path');
  }

  return lines.join('\n').trim();
}

function createRegistryModule(module: RegistryAcademyModuleInput): RegistryAcademyModuleRecord {
  const record: Omit<RegistryAcademyModuleRecord, 'markdownContent'> = {
    ...module,
    path: 'registry',
    totalModules: TOTAL_MODULES,
  };

  return {
    ...record,
    markdownContent: renderMarkdownContent(record),
  };
}

export const REGISTRY_ACADEMY_MODULES: RegistryAcademyModuleRecord[] = REGISTRY_ACADEMY_MODULE_INPUTS.map(
  createRegistryModule,
);

export const REGISTRY_ACADEMY_MODULES_BY_SLUG = Object.fromEntries(
  REGISTRY_ACADEMY_MODULES.map((module) => [module.slug, module]),
) as Record<RegistryAcademyModuleSlug, RegistryAcademyModuleRecord>;

export function isRegistryAcademyModuleSlug(value: string): value is RegistryAcademyModuleSlug {
  return value in REGISTRY_ACADEMY_MODULES_BY_SLUG;
}

export function getRegistryAcademyModule(slug: RegistryAcademyModuleSlug) {
  return REGISTRY_ACADEMY_MODULES_BY_SLUG[slug];
}
