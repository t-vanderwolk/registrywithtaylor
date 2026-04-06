export type NurseryAcademyModuleSlug =
  | 'vision-and-lifestyle'
  | 'sleep-space-decisions'
  | 'furniture-that-actually-works'
  | 'layout-and-flow'
  | 'storage-and-organization'
  | 'atmosphere-and-safety';

type NurseryAcademyCoreSection = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
};

type NurseryAcademyProductExample = {
  name: string;
  description: string;
  pros: string[];
};

export type NurseryAcademyModuleRecord = {
  title: string;
  slug: NurseryAcademyModuleSlug;
  path: 'nursery';
  moduleOrder: number;
  totalModules: number;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  intro: string[];
  coreSections: NurseryAcademyCoreSection[];
  decisionBullets: string[];
  products: NurseryAcademyProductExample[];
  softCtaLabel: string;
  softCtaTitle: string;
  softCtaBody: string[];
  nextModuleSlug: NurseryAcademyModuleSlug | null;
  previousModuleSlug: NurseryAcademyModuleSlug | null;
  markdownContent: string;
};

const TOTAL_MODULES = 6;
const PLACEHOLDER_IMAGE = '/assets/placeholders/tmbc-guide-image-placeholder.svg';

function renderProductMarkdown(product: NurseryAcademyProductExample) {
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

function slugToLabel(slug: NurseryAcademyModuleSlug) {
  return slug
    .split('-')
    .map((part) => (part ? `${part.charAt(0).toUpperCase()}${part.slice(1)}` : part))
    .join(' ');
}

function renderMarkdownContent(module: Omit<NurseryAcademyModuleRecord, 'markdownContent'>) {
  const lines: string[] = [
    `# ${module.title}`,
    '',
    module.subhead,
    '',
    `## Module ${module.moduleOrder} of ${module.totalModules} · Nursery`,
    '',
  ];

  module.intro.forEach((paragraph) => {
    lines.push(paragraph, '');
  });

  lines.push('## Core Considerations', '');

  module.coreSections.forEach((section) => {
    lines.push(`### ${section.title}`, '', `![${section.imageAlt}](${section.imageSrc})`, '');
    section.paragraphs.forEach((paragraph) => {
      lines.push(paragraph, '');
    });
  });

  lines.push('## What This Means For You', '');
  module.decisionBullets.forEach((bullet) => {
    lines.push(`- ${bullet}`);
  });

  lines.push('', '## Examples That Support This Setup', '');
  module.products.forEach((product) => {
    lines.push(renderProductMarkdown(product), '');
  });

  lines.push(`## ${module.softCtaLabel}`, '');
  lines.push(module.softCtaTitle, '');
  module.softCtaBody.forEach((paragraph) => {
    lines.push(paragraph, '');
  });

  lines.push('## Next Steps', '');
  if (module.nextModuleSlug) {
    lines.push(`- Continue to ${slugToLabel(module.nextModuleSlug)}`);
  }
  if (module.previousModuleSlug) {
    lines.push(`- Back to ${slugToLabel(module.previousModuleSlug)}`);
  }

  return lines.join('\n').trim();
}

function createNurseryModule(
  module: Omit<NurseryAcademyModuleRecord, 'path' | 'totalModules' | 'markdownContent'>,
): NurseryAcademyModuleRecord {
  const record: Omit<NurseryAcademyModuleRecord, 'markdownContent'> = {
    ...module,
    path: 'nursery',
    totalModules: TOTAL_MODULES,
  };

  return {
    ...record,
    markdownContent: renderMarkdownContent(record),
  };
}

export const NURSERY_ACADEMY_MODULES: NurseryAcademyModuleRecord[] = [
  createNurseryModule({
    title: 'Vision & Lifestyle Foundations',
    slug: 'vision-and-lifestyle',
    moduleOrder: 1,
    description: 'Start with your space, your routine, and the version of easy that actually fits your life.',
    subhead: 'Start with your space - not your shopping list.',
    imagePath: '/assets/editorial/nursery.jpg',
    imageAlt: 'Calm nursery image for the Vision & Lifestyle Foundations module.',
    intro: [
      'Most parents begin preparing for a baby the same way. They start researching products.',
      'Strollers. Car seats. Monitors. Swings.',
      'But the families who feel the most confident later on usually start somewhere else entirely: they start with how they actually live.',
      'Because your space, your routine, and your daily rhythm will quietly shape every decision that comes after this.',
      'Before you choose anything, this is where you get clear.',
    ],
    coreSections: [
      {
        title: 'How you actually move through your day',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft editorial image of a calm morning routine in a neutral-toned home with natural light.',
        paragraphs: [
          'Most decisions do not fail because the product was wrong. They fail because it did not fit the way your day actually works.',
          'Maybe you move slowly in the mornings. Maybe you are getting out the door quickly. Maybe you spend most of your time at home. Maybe you are constantly in and out. Maybe you value simplicity, or maybe you are comfortable managing more setup.',
          'Those answers matter more than any feature list. The goal here is not to optimize for best. It is to align your setup with what your real day will actually ask of you.',
        ],
      },
      {
        title: 'Where your baby will spend time',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal nursery corner with crib, soft lighting, and neutral textures.',
        paragraphs: [
          'It is easy to imagine a perfectly styled nursery. In real life, babies spend time wherever you are.',
          'That might be your bedroom, the living room, a small corner of your home, or a fully dedicated nursery.',
          'Instead of designing for an ideal scenario, design for your most-used spaces. Ask yourself where you will actually spend time with your baby, especially in the first few weeks. That answer should guide your decisions more than aesthetics alone.',
        ],
      },
      {
        title: 'What easy means for you',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Close-up of a simple, uncluttered baby setup with soft textures and natural light.',
        paragraphs: [
          'Everyone wants things to feel easy, but easy looks different depending on your lifestyle.',
          'For some families, easy means fewer products, minimal setup, and less to manage. For others, it means having multiple stations, feeling fully prepared, and optimizing convenience.',
          'Neither version is right or wrong. What matters is choosing the version of easy that you will actually enjoy living with.',
        ],
      },
      {
        title: 'How your space supports you at night',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Dimly lit nursery scene with soft lamp lighting and calm nighttime atmosphere.',
        paragraphs: [
          'Nighttime is where your setup matters most. This is when you are tired, adjusting, and moving through your space without thinking much about it.',
          'Small decisions become big ones at night: where the bassinet is placed, how accessible essentials are, and how your lighting is set up.',
          'The best setups are not necessarily the most beautiful. They are the ones that feel intuitive in the middle of the night.',
        ],
      },
    ],
    decisionBullets: [
      'If your space is limited, prioritize flexibility and simplicity.',
      'If you move between rooms often, create small, repeatable setups.',
      'If you value calm and minimalism, reduce what you bring in early.',
      'If you prefer convenience, build support into your environment.',
      'There is no perfect setup. There is only the one that fits your life.',
    ],
    products: [
      {
        name: 'Crib (Foundation Piece)',
        description: 'A simple, well-built crib that fits your space without overwhelming it.',
        pros: ['Good for parents who want a long-term, stable sleep solution', 'Prioritizes simplicity and longevity'],
      },
      {
        name: 'Bassinet (Early Flexibility)',
        description: 'A smaller sleep space that can stay close to you during the first months.',
        pros: ['Good for room sharing and nighttime ease', 'Helps reduce movement during early weeks'],
      },
      {
        name: 'Dresser + Changing Setup',
        description: 'A dual-purpose piece that supports both storage and daily care.',
        pros: ['Good for reducing clutter', 'Keeps essentials in one place'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where most families want a second opinion.',
    softCtaBody: [
      'You can absolutely figure this out on your own.',
      'But this is usually where things start to feel more personal, because the right setup is not about what works in general. It is about what works in your home, your routine, and your day.',
    ],
    nextModuleSlug: 'sleep-space-decisions',
    previousModuleSlug: null,
  }),
  createNurseryModule({
    title: 'Sleep Space Decisions',
    slug: 'sleep-space-decisions',
    moduleOrder: 2,
    description: 'Decide where your baby will actually sleep based on your space, your nights, and your comfort level.',
    subhead: 'Where your baby sleeps - and why it matters more than you think.',
    imagePath: '/assets/editorial/babyincrib.png',
    imageAlt: 'Baby sleep editorial image for the Sleep Space Decisions module.',
    intro: [
      'After understanding your space, the next decision becomes clearer: where will your baby actually sleep?',
      'This is one of the most talked-about topics and also one of the most overwhelming.',
      'There are opinions, recommendations, and strong preferences everywhere. Most families do not need more opinions. They need clarity.',
      'Because the best sleep setup is not the most popular one. It is the one that works for your space, your routine, and your comfort level.',
    ],
    coreSections: [
      {
        title: 'Room sharing vs. separate space',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft nighttime bedroom scene with bassinet beside bed, warm low lighting.',
        paragraphs: [
          'In the early months, many families choose to keep their baby close. This often looks like a bassinet or bedside sleeper next to your bed. Others prefer setting up a separate nursery from the beginning.',
          'Both approaches can work. What matters is how your space and routine support you.',
          'Ask yourself whether you want to minimize movement at night, whether you feel more comfortable having your baby nearby, and whether your home layout makes one option easier than the other. There is not a single correct answer, only the one that feels sustainable for you.',
        ],
      },
      {
        title: 'Bassinet vs. crib (and when each makes sense)',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal crib setup in a neutral nursery with soft textures and natural light.',
        paragraphs: [
          'A bassinet is usually an early-months solution. It is smaller, easier to move, and fits well beside your bed.',
          'A crib is the longer-term solution. It is more stable, more spacious, and designed to grow with your baby.',
          'Many families use both, just at different stages. The decision is less about which is better and more about what you need right now and what you will need later.',
        ],
      },
      {
        title: 'Ease during nighttime care',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Dim nursery lighting with a soft lamp and organized essentials within reach.',
        paragraphs: [
          'Nighttime is where your setup becomes real. You are not thinking about design or aesthetics. You are moving through your space half-awake.',
          'That is where small choices matter: how easily you can reach your baby, whether you need to move rooms, how accessible the essentials are, and how your lighting is set up.',
          'The goal is not perfection. It is reducing friction.',
        ],
      },
      {
        title: 'Planning for transitions',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Crib in a nursery with soft daylight, suggesting a longer-term sleep setup.',
        paragraphs: [
          'Your baby will not stay in the same sleep setup forever. Bassinet to crib. Room sharing to separate room. Those transitions happen over time.',
          'The mistake many parents make is trying to solve every stage at once.',
          'Instead, focus on what will work for the next phase. You can adjust later.',
        ],
      },
    ],
    decisionBullets: [
      'If you want simplicity early, start with a bassinet near your bed.',
      'If you prefer a long-term setup, begin with a crib in your nursery.',
      'If your space is flexible, plan for both stages instead of forcing one answer.',
      'If nighttime ease matters most, reduce distance and movement.',
      'You do not need the perfect setup. You need one that feels manageable, especially at night.',
    ],
    products: [
      {
        name: 'Bedside Bassinet',
        description: 'A compact sleep space that stays within arm\'s reach.',
        pros: ['Good for reducing movement during nighttime care', 'Supports room sharing in early months'],
      },
      {
        name: 'Full-Size Crib',
        description: 'A stable, long-term sleep solution.',
        pros: ['Good for families planning a dedicated nursery', 'Designed to grow with your baby'],
      },
      {
        name: 'Convertible Crib',
        description: 'A crib that transitions into toddler stages over time.',
        pros: ['Good for long-term planning', 'Reduces the need for future furniture changes'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is often where a second opinion can make things feel much clearer.',
    softCtaBody: [
      'Sleep decisions can feel bigger than they need to be because this is not just about furniture. It is about comfort, confidence, and how you move through your nights.',
      'Most families do not need a perfect plan. They need one that feels right for them.',
    ],
    nextModuleSlug: 'furniture-that-actually-works',
    previousModuleSlug: 'vision-and-lifestyle',
  }),
  createNurseryModule({
    title: 'Furniture That Actually Works',
    slug: 'furniture-that-actually-works',
    moduleOrder: 3,
    description: 'Choose the pieces that support your routine instead of filling the room for the sake of completion.',
    subhead: 'What you need - and what you do not.',
    imagePath: '/assets/editorial/nursery2.png',
    imageAlt: 'Nursery furniture editorial image for the Furniture That Actually Works module.',
    intro: [
      'Once your space and sleep setup are clear, furniture becomes much simpler.',
      'This is where many parents overbuy, not because they want to, but because it is hard to tell what actually matters.',
      'The goal is not to fill a room. It is to support your daily routine with as few pieces as possible.',
    ],
    coreSections: [
      {
        title: 'What you will actually use every day',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal nursery setup with crib and dresser in neutral tones.',
        paragraphs: [
          'The most useful furniture is the furniture you touch daily.',
          'That usually means a crib or sleep space, a place to change your baby, and storage for clothing and essentials.',
          'Anything beyond that should earn its place.',
        ],
      },
      {
        title: 'Multi-purpose vs single-purpose',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Dresser with changing pad styled simply and functionally.',
        paragraphs: [
          'A dresser with a changing pad can replace a separate changing table. A comfortable chair can replace multiple seating options.',
          'Choosing multi-purpose pieces reduces clutter and increases flexibility.',
          'It also keeps the room from turning into a category checklist with drawers.',
        ],
      },
      {
        title: 'Comfort vs necessity',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft glider chair near a window with warm natural light.',
        paragraphs: [
          'Some items are not essential, but they still make a difference.',
          'A glider is the classic example. It is not required, but for many families it becomes one of the most-used pieces in the room.',
          'The better question is not Do I need this. It is Will I use this enough to justify the space.',
        ],
      },
      {
        title: 'Planning for growth',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Convertible crib in a neutral nursery setting.',
        paragraphs: [
          'Some furniture grows with your baby: convertible cribs, adaptable storage, flexible layouts. Other pieces are more temporary.',
          'Both approaches can work. What matters is choosing intentionally.',
          'Longer-term only helps if the piece also fits the room and the stage you are actually in.',
        ],
      },
    ],
    decisionBullets: [
      'If you prefer simplicity, stick to the essentials only.',
      'If you want flexibility, choose multi-use furniture.',
      'If comfort matters, invest in one or two upgrades that will see real use.',
      'If you are planning long-term, consider convertible options.',
    ],
    products: [
      {
        name: 'Convertible Crib',
        description: 'A long-term sleep solution that grows with your baby.',
        pros: ['Supports long-term planning', 'Reduces future furniture changes'],
      },
      {
        name: 'Dresser + Changing Setup',
        description: 'Storage and daily function in one footprint.',
        pros: ['Combines storage and function', 'Reduces the need for extra furniture'],
      },
      {
        name: 'Glider Chair',
        description: 'A comfort-first piece for feeding, settling, and longer nighttime stretches.',
        pros: ['Helpful during feeding and nighttime care', 'Optional, but often high-use'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is usually where families want reassurance.',
    softCtaBody: [
      'Furniture decisions feel big, but they do not need to be complicated.',
      'Most families are really looking for permission to choose the right pieces for their space instead of every piece the category says is available.',
    ],
    nextModuleSlug: 'layout-and-flow',
    previousModuleSlug: 'sleep-space-decisions',
  }),
  createNurseryModule({
    title: 'Layout & Flow',
    slug: 'layout-and-flow',
    moduleOrder: 4,
    description: 'Design the room around movement, access, and nighttime usability before styling details take over.',
    subhead: 'How your nursery actually works in real life.',
    imagePath: '/assets/editorial/nurseryzones.png',
    imageAlt: 'Nursery zones editorial image for the Layout & Flow module.',
    intro: [
      'A beautiful nursery is one thing. A functional nursery is something else entirely.',
      'Layout determines how easy your day feels, and maybe more importantly, how your night feels.',
    ],
    coreSections: [
      {
        title: 'Movement through the space',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Open nursery layout with clear walking paths.',
        paragraphs: [
          'You should be able to move through your space without thinking, especially at night.',
          'Clear paths matter more than perfect styling.',
          'If you have to negotiate around furniture every time you cross the room, the layout is asking too much of you.',
        ],
      },
      {
        title: 'Proximity of essentials',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Changing station with organized essentials within reach.',
        paragraphs: [
          'Everything you use frequently should be within arm\'s reach.',
          'That reduces friction and makes the setup feel intuitive instead of performative.',
          'The faster the room makes the next step obvious, the better it usually works.',
        ],
      },
      {
        title: 'Lighting placement',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft lamp lighting in a calm nursery at night.',
        paragraphs: [
          'Lighting should support both daytime visibility and nighttime calm.',
          'Harsh overhead lighting rarely helps in the middle of the night.',
          'A softer, easier-to-reach light source usually earns its place faster.',
        ],
      },
      {
        title: 'Zones within the room',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Nursery divided into sleep, care, and comfort zones.',
        paragraphs: [
          'Think in zones: sleep, care, and comfort.',
          'That makes the room easier to use and easier to navigate when you are tired.',
          'A room that quietly tells you where each job lives often feels calmer without needing more space.',
        ],
      },
    ],
    decisionBullets: [
      'Keep movement simple.',
      'Keep essentials close.',
      'Use lighting intentionally.',
      'Design for function first.',
    ],
    products: [
      {
        name: 'Soft Lighting Setup',
        description: 'A calmer lighting layer for nighttime care.',
        pros: ['Supports nighttime care', 'Reduces overstimulation'],
      },
      {
        name: 'Changing Station Organizer',
        description: 'A simple system that keeps repeat-use items within reach.',
        pros: ['Keeps essentials close', 'Simplifies the routine'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where your nursery becomes usable.',
    softCtaBody: [
      'Small layout changes can make a surprisingly big difference once the room starts working like part of your day instead of a project.',
    ],
    nextModuleSlug: 'storage-and-organization',
    previousModuleSlug: 'furniture-that-actually-works',
  }),
  createNurseryModule({
    title: 'Storage & Organization',
    slug: 'storage-and-organization',
    moduleOrder: 5,
    description: 'Build an organization system that is easy to maintain before the room starts collecting quiet chaos.',
    subhead: 'How to reduce chaos before it starts.',
    imagePath: '/assets/editorial/clipboard.png',
    imageAlt: 'Nursery organization editorial image for the Storage & Organization module.',
    intro: [
      'You do not need more storage. You need better organization.',
      'Most overwhelm comes from not knowing where things go or how quickly the room stops resetting itself.',
    ],
    coreSections: [
      {
        title: 'Accessibility',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Drawer organization with neatly folded baby clothes.',
        paragraphs: [
          'You should be able to grab what you need quickly, especially during diaper changes or nighttime care.',
          'If the essentials are buried behind the someday layer, the system is doing the opposite of helping.',
        ],
      },
      {
        title: 'Simplicity',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal storage bins in a clean nursery space.',
        paragraphs: [
          'The simpler your system is, the easier it is to maintain.',
          'Over-complicated setups usually look impressive for a week and then quietly fall apart.',
        ],
      },
      {
        title: 'Growth over time',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Closet with staged baby clothing sizes.',
        paragraphs: [
          'Your storage needs will change quickly, so the better system is the one that can adapt without needing a total reset.',
          'Build for change instead of pretending the first arrangement is the final one.',
        ],
      },
    ],
    decisionBullets: [
      'Prioritize ease of access.',
      'Keep systems simple.',
      'Plan for change.',
    ],
    products: [
      {
        name: 'Drawer Organizers',
        description: 'A simple layer that keeps the highest-use categories separated and easy to reset.',
        pros: ['Keeps items separated', 'Easy to maintain'],
      },
      {
        name: 'Storage Bins',
        description: 'Flexible organization that can move with the room as needs change.',
        pros: ['Flexible organization', 'Useful across multiple stages'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'Organization is not about perfection.',
    softCtaBody: [
      'It is about reducing friction before it starts multiplying.',
    ],
    nextModuleSlug: 'atmosphere-and-safety',
    previousModuleSlug: 'layout-and-flow',
  }),
  createNurseryModule({
    title: 'Atmosphere & Safety',
    slug: 'atmosphere-and-safety',
    moduleOrder: 6,
    description: 'Bring the room together around calm, safety, and the kind of simplicity that still works at 2:14 AM.',
    subhead: 'How your nursery feels - and functions.',
    imagePath: '/assets/editorial/teddy-glow.png',
    imageAlt: 'Calm nursery atmosphere image for the Atmosphere & Safety module.',
    intro: [
      'This is where everything comes together.',
      'Your nursery should feel calm, safe, and easy to use. Not overwhelming.',
    ],
    coreSections: [
      {
        title: 'Lighting & mood',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Soft natural light in a neutral nursery space.',
        paragraphs: [
          'Lighting shapes how the space feels.',
          'Soft, warm lighting usually supports calm better than bright, hard lighting that makes the room feel more awake than it needs to.',
        ],
      },
      {
        title: 'Sound environment',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Sound machine on a bedside table in nursery.',
        paragraphs: [
          'Sound can help create consistency, especially around sleep.',
          'The goal is not to over-engineer the room. It is to support a steadier environment where possible.',
        ],
      },
      {
        title: 'Safe sleep basics',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal crib setup with safe sleep environment.',
        paragraphs: [
          'A simple, clear sleep space matters most.',
          'This is not the place for unnecessary additions. The setup usually gets stronger as it gets simpler.',
        ],
      },
      {
        title: 'Simplicity over perfection',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Clean, uncluttered nursery space.',
        paragraphs: [
          'The best nurseries are not the most decorated. They are the easiest to live in.',
          'When the room feels calm and clear, it usually asks less of you.',
        ],
      },
    ],
    decisionBullets: [
      'Prioritize calm.',
      'Keep things simple.',
      'Focus on function.',
    ],
    products: [
      {
        name: 'Sound Machine',
        description: 'A simple support piece for a more consistent sleep environment.',
        pros: ['Supports a steady sleep environment'],
      },
      {
        name: 'Blackout Curtains',
        description: 'A useful layer when light control helps the room feel more settled.',
        pros: ['Helps regulate sleep conditions'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'At this point, your nursery is complete.',
    softCtaBody: [
      'Now the focus shifts beyond the room and into the rest of your baby-prep decisions.',
    ],
    nextModuleSlug: null,
    previousModuleSlug: 'storage-and-organization',
  }),
];

export const NURSERY_ACADEMY_MODULES_BY_SLUG = Object.fromEntries(
  NURSERY_ACADEMY_MODULES.map((module) => [module.slug, module]),
) as Record<NurseryAcademyModuleSlug, NurseryAcademyModuleRecord>;

export function isNurseryAcademyModuleSlug(value: string): value is NurseryAcademyModuleSlug {
  return value in NURSERY_ACADEMY_MODULES_BY_SLUG;
}

export function getNurseryAcademyModule(slug: NurseryAcademyModuleSlug) {
  return NURSERY_ACADEMY_MODULES_BY_SLUG[slug];
}
