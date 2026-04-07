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
const NURSERY_ACADEMY_IMAGES = {
  cribAndClouds: '/assets/nurserypath/cribandclouds.png',
  cribAndToys: '/assets/nurserypath/cribandtopys.png',
  dadadaCrib: '/assets/nurserypath/dadadacrib.png',
  dadadaDresser: '/assets/nurserypath/dadadadresser.png',
  duplicate: '/assets/nurserypath/duplicate.png',
  joolBabyDiaperPail: '/assets/nurserypath/joolbabydiperpail.png',
  miniVsStandardCrib: '/assets/nurserypath/minivsstandadcrib.png',
  momcozyBabyMonitor: '/assets/nurserypath/momcozybabymonitor.png',
  momcozyDiaperPail: '/assets/nurserypath/momcozydiperpail.png',
  nanit: '/assets/nurserypath/nanit.png',
  newton: '/assets/nurserypath/newton.png',
  newtonMattress: '/assets/nurserypath/newtonmatress.png',
  nurseryIdea: '/assets/nurserypath/nurseryidea.png',
  nurseryPlanning: '/assets/nurserypath/nurseryplanning.png',
  nurseryPlayroom: '/assets/nurserypath/nurseryplayroom.png',
  nurseryPrep: '/assets/nurserypath/nurseryprep.png',
  nurseryAtNight: '/assets/nurserypath/nurseyatnight.png',
  owlet: '/assets/nurserypath/owlet.png',
  sereneNursery: '/assets/nurserypath/serenenursery.png',
  simpleNursery: '/assets/nurserypath/simple%20nursery.png',
  space: '/assets/nurserypath/space.png',
  tealNursery: '/assets/nurserypath/tealnursery.png',
  vision: '/assets/nurserypath/vision.png',
} as const;

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
    imagePath: NURSERY_ACADEMY_IMAGES.vision,
    imageAlt: 'Nursery vision board image for the Vision & Lifestyle Foundations module.',
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
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPlanning,
        imageAlt: 'Nursery planning image grounded in a real morning routine.',
        paragraphs: [
          'Most decisions do not fail because the product was wrong. They fail because it did not fit the way your day actually works.',
          'Maybe you move slowly in the mornings. Maybe you are getting out the door quickly. Maybe you spend most of your time at home. Maybe you are constantly in and out. Maybe you value simplicity, or maybe you are comfortable managing more setup.',
          'Those answers matter more than any feature list. The goal here is not to optimize for best. It is to align your setup with what your real day will actually ask of you.',
        ],
      },
      {
        title: 'Where your baby will spend time',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryIdea,
        imageAlt: 'Nursery corner image showing where baby time actually happens.',
        paragraphs: [
          'It is easy to imagine a perfectly styled nursery. In real life, babies spend time wherever you are.',
          'That might be your bedroom, the living room, a small corner of your home, or a fully dedicated nursery.',
          'Instead of designing for an ideal scenario, design for your most-used spaces. Ask yourself where you will actually spend time with your baby, especially in the first few weeks. That answer should guide your decisions more than aesthetics alone.',
        ],
      },
      {
        title: 'What easy means for you',
        imageSrc: NURSERY_ACADEMY_IMAGES.simpleNursery,
        imageAlt: 'Simple uncluttered nursery setup with soft textures and natural light.',
        paragraphs: [
          'Everyone wants things to feel easy, but easy looks different depending on your lifestyle.',
          'For some families, easy means fewer products, minimal setup, and less to manage. For others, it means having multiple stations, feeling fully prepared, and optimizing convenience.',
          'Neither version is right or wrong. What matters is choosing the version of easy that you will actually enjoy living with.',
        ],
      },
      {
        title: 'How your space supports you at night',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryAtNight,
        imageAlt: 'Nursery at night with softer lighting and calmer flow.',
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
        name: 'Crib Mattress',
        description: 'A mattress choice that supports how the sleep space actually functions, not just how the room photographs.',
        pros: ['Supports the core sleep setup', 'Worth getting right before the room gets busier'],
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
    imagePath: NURSERY_ACADEMY_IMAGES.cribAndClouds,
    imageAlt: 'Crib and cloud nursery image for the Sleep Space Decisions module.',
    intro: [
      'After understanding your space, the next decision becomes clearer: where will your baby actually sleep?',
      'This is one of the most talked-about topics and also one of the most overwhelming.',
      'There are opinions, recommendations, and strong preferences everywhere. Most families do not need more opinions. They need clarity.',
      'Because the best sleep setup is not the most popular one. It is the one that works for your space, your routine, and your comfort level.',
    ],
    coreSections: [
      {
        title: 'Room sharing vs. separate space',
        imageSrc: NURSERY_ACADEMY_IMAGES.cribAndClouds,
        imageAlt: 'Sleep-space image showing a softer room-sharing mood.',
        paragraphs: [
          'In the early months, many families choose to keep their baby close. This often looks like a bassinet or bedside sleeper next to your bed. Others prefer setting up a separate nursery from the beginning.',
          'Both approaches can work. What matters is how your space and routine support you.',
          'Ask yourself whether you want to minimize movement at night, whether you feel more comfortable having your baby nearby, and whether your home layout makes one option easier than the other. There is not a single correct answer, only the one that feels sustainable for you.',
        ],
      },
      {
        title: 'Bassinet vs. crib (and when each makes sense)',
        imageSrc: NURSERY_ACADEMY_IMAGES.miniVsStandardCrib,
        imageAlt: 'Mini crib versus standard crib comparison image.',
        paragraphs: [
          'A bassinet is usually an early-months solution. It is smaller, easier to move, and fits well beside your bed.',
          'A crib is the longer-term solution. It is more stable, more spacious, and designed to grow with your baby.',
          'Many families use both, just at different stages. The decision is less about which is better and more about what you need right now and what you will need later.',
        ],
      },
      {
        title: 'Ease during nighttime care',
        imageSrc: NURSERY_ACADEMY_IMAGES.sereneNursery,
        imageAlt: 'Serene nursery image showing calmer nighttime care flow.',
        paragraphs: [
          'Nighttime is where your setup becomes real. You are not thinking about design or aesthetics. You are moving through your space half-awake.',
          'That is where small choices matter: how easily you can reach your baby, whether you need to move rooms, how accessible the essentials are, and how your lighting is set up.',
          'The goal is not perfection. It is reducing friction.',
        ],
      },
      {
        title: 'Planning for transitions',
        imageSrc: NURSERY_ACADEMY_IMAGES.cribAndToys,
        imageAlt: 'Crib setup suggesting the next sleep-space stage over time.',
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
        name: 'Full-Size Crib',
        description: 'A stable, long-term sleep solution.',
        pros: ['Good for families planning a dedicated nursery', 'Designed to grow with your baby'],
      },
      {
        name: 'Crib Mattress',
        description: 'A practical sleep-surface choice that affects how the crib works every single night.',
        pros: ['Supports the crib you actually use', 'Worth pressure-testing before the extras'],
      },
      {
        name: 'Video Monitor',
        description: 'A monitoring layer that helps some families feel more connected to the sleep space once the room and routine are in motion.',
        pros: ['Useful for sleep-space visibility', 'Can support room-to-room confidence when it fits'],
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
    imagePath: NURSERY_ACADEMY_IMAGES.nurseryPrep,
    imageAlt: 'Nursery prep image for the Furniture That Actually Works module.',
    intro: [
      'Once your space and sleep setup are clear, furniture becomes much simpler.',
      'This is where many parents overbuy, not because they want to, but because it is hard to tell what actually matters.',
      'The goal is not to fill a room. It is to support your daily routine with as few pieces as possible.',
    ],
    coreSections: [
      {
        title: 'What you will actually use every day',
        imageSrc: NURSERY_ACADEMY_IMAGES.dadadaCrib,
        imageAlt: 'Convertible crib shown as a daily-use nursery anchor.',
        paragraphs: [
          'The most useful furniture is the furniture you touch daily.',
          'That usually means a crib or sleep space, a place to change your baby, and storage for clothing and essentials.',
          'Anything beyond that should earn its place.',
        ],
      },
      {
        title: 'Multi-purpose vs single-purpose',
        imageSrc: NURSERY_ACADEMY_IMAGES.dadadaDresser,
        imageAlt: 'Dresser with changing setup styled simply and functionally.',
        paragraphs: [
          'A dresser with a changing pad can replace a separate changing table. A comfortable chair can replace multiple seating options.',
          'Choosing multi-purpose pieces reduces clutter and increases flexibility.',
          'It also keeps the room from turning into a category checklist with drawers.',
        ],
      },
      {
        title: 'Comfort vs necessity',
        imageSrc: NURSERY_ACADEMY_IMAGES.tealNursery,
        imageAlt: 'Nursery comfort corner with warm natural light.',
        paragraphs: [
          'Some items are not essential, but they still make a difference.',
          'A glider is the classic example. It is not required, but for many families it becomes one of the most-used pieces in the room.',
          'The better question is not Do I need this. It is Will I use this enough to justify the space.',
        ],
      },
      {
        title: 'Planning for growth',
        imageSrc: NURSERY_ACADEMY_IMAGES.newton,
        imageAlt: 'Nursery setup showing how the room can grow over time.',
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
        name: 'Diaper Pail',
        description: 'A small but daily-use room fixture when the changing zone lives in the nursery and odor control needs a home.',
        pros: ['Supports the nursery workflow', 'Useful when the changing setup happens in the room often'],
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
    imagePath: NURSERY_ACADEMY_IMAGES.space,
    imageAlt: 'Nursery layout image for the Layout & Flow module.',
    intro: [
      'A beautiful nursery is one thing. A functional nursery is something else entirely.',
      'Layout determines how easy your day feels, and maybe more importantly, how your night feels.',
    ],
    coreSections: [
      {
        title: 'Movement through the space',
        imageSrc: NURSERY_ACADEMY_IMAGES.space,
        imageAlt: 'Open nursery layout with clear walking paths.',
        paragraphs: [
          'You should be able to move through your space without thinking, especially at night.',
          'Clear paths matter more than perfect styling.',
          'If you have to negotiate around furniture every time you cross the room, the layout is asking too much of you.',
        ],
      },
      {
        title: 'Proximity of essentials',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPrep,
        imageAlt: 'Nursery setup with essentials kept within easy reach.',
        paragraphs: [
          'Everything you use frequently should be within arm\'s reach.',
          'That reduces friction and makes the setup feel intuitive instead of performative.',
          'The faster the room makes the next step obvious, the better it usually works.',
        ],
      },
      {
        title: 'Lighting placement',
        imageSrc: NURSERY_ACADEMY_IMAGES.vision,
        imageAlt: 'Nursery lighting concept with calmer placement in mind.',
        paragraphs: [
          'Lighting should support both daytime visibility and nighttime calm.',
          'Harsh overhead lighting rarely helps in the middle of the night.',
          'A softer, easier-to-reach light source usually earns its place faster.',
        ],
      },
      {
        title: 'Zones within the room',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPlayroom,
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
        name: 'Dresser + Changing Setup',
        description: 'A furniture anchor that helps the room move better by keeping storage and changing in one clear zone.',
        pros: ['Improves reach and daily flow', 'Useful when the room needs one practical center'],
      },
      {
        name: 'Baby Monitor',
        description: 'A visibility tool that fits the room best when its placement supports how you move and check in from the spaces around it.',
        pros: ['Supports room-to-room visibility', 'Helps monitor placement feel more intentional'],
      },
      {
        name: 'Diaper Pail',
        description: 'A workflow tool that belongs where the changing rhythm actually happens, not wherever it was easiest to tuck out of sight.',
        pros: ['Keeps the changing zone tighter', 'Makes placement part of the routine, not an afterthought'],
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
    imagePath: NURSERY_ACADEMY_IMAGES.duplicate,
    imageAlt: 'Nursery organization image for the Storage & Organization module.',
    intro: [
      'You do not need more storage. You need better organization.',
      'Most overwhelm comes from not knowing where things go or how quickly the room stops resetting itself.',
    ],
    coreSections: [
      {
        title: 'Accessibility',
        imageSrc: NURSERY_ACADEMY_IMAGES.duplicate,
        imageAlt: 'Nursery setup showing what happens when categories start to duplicate.',
        paragraphs: [
          'You should be able to grab what you need quickly, especially during diaper changes or nighttime care.',
          'If the essentials are buried behind the someday layer, the system is doing the opposite of helping.',
        ],
      },
      {
        title: 'Simplicity',
        imageSrc: NURSERY_ACADEMY_IMAGES.joolBabyDiaperPail,
        imageAlt: 'Simple diaper-pail setup as part of a cleaner organization system.',
        paragraphs: [
          'The simpler your system is, the easier it is to maintain.',
          'Over-complicated setups usually look impressive for a week and then quietly fall apart.',
        ],
      },
      {
        title: 'Growth over time',
        imageSrc: NURSERY_ACADEMY_IMAGES.momcozyDiaperPail,
        imageAlt: 'Nursery organization setup that can adapt as the routine changes.',
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
        name: 'Dresser + Drawer Setup',
        description: 'A storage anchor that keeps the highest-use categories easier to separate, reach, and reset.',
        pros: ['Supports the reset layer of the room', 'Useful when storage needs to stay easy to maintain'],
      },
      {
        name: 'Diaper Pail',
        description: 'A nursery-zone storage decision that quietly affects smell, workflow, and how many extra steps you take each day.',
        pros: ['Supports daily reset and cleanup', 'Useful when the nursery handles a real volume of changes'],
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
    imagePath: NURSERY_ACADEMY_IMAGES.sereneNursery,
    imageAlt: 'Calm nursery atmosphere image for the Atmosphere & Safety module.',
    intro: [
      'This is where everything comes together.',
      'Your nursery should feel calm, safe, and easy to use. Not overwhelming.',
    ],
    coreSections: [
      {
        title: 'Lighting & mood',
        imageSrc: NURSERY_ACADEMY_IMAGES.tealNursery,
        imageAlt: 'Soft natural light in a calm nursery space.',
        paragraphs: [
          'Lighting shapes how the space feels.',
          'Soft, warm lighting usually supports calm better than bright, hard lighting that makes the room feel more awake than it needs to.',
        ],
      },
      {
        title: 'Sound environment',
        imageSrc: NURSERY_ACADEMY_IMAGES.momcozyBabyMonitor,
        imageAlt: 'Nursery monitoring setup in a bedside-style room environment.',
        paragraphs: [
          'Sound can help create consistency, especially around sleep.',
          'The goal is not to over-engineer the room. It is to support a steadier environment where possible.',
        ],
      },
      {
        title: 'Safe sleep basics',
        imageSrc: NURSERY_ACADEMY_IMAGES.newtonMattress,
        imageAlt: 'Minimal crib setup with a safe-sleep mattress environment.',
        paragraphs: [
          'A simple, clear sleep space matters most.',
          'This is not the place for unnecessary additions. The setup usually gets stronger as it gets simpler.',
        ],
      },
      {
        title: 'Simplicity over perfection',
        imageSrc: NURSERY_ACADEMY_IMAGES.owlet,
        imageAlt: 'Clean nursery monitoring setup that supports simplicity over gadget sprawl.',
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
        name: 'Crib Mattress',
        description: 'A core safe-sleep choice that supports simplicity best when it quietly does its job night after night.',
        pros: ['Supports the safe sleep setup directly'],
      },
      {
        name: 'Video Monitor',
        description: 'A visibility layer that can support calm when it is reliable, simple, and not trying to become the loudest thing in the room.',
        pros: ['Supports visibility into the sleep space'],
      },
      {
        name: 'Smart Monitor',
        description: 'An extra monitoring layer for families who truly want it, as long as the added data still makes the room feel calmer instead of busier.',
        pros: ['Can add reassurance when that layer genuinely helps'],
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
