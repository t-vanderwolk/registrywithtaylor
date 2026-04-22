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
  audioMonitor: '/assets/nurserypath/audiomonitor.png',
  bedsideBassinet: '/assets/nurserypath/bedsidebassinet.png',
  bedsidePackAndPlay: '/assets/nurserypath/bedsidepackandplay.png',
  cribAndClouds: '/assets/nurserypath/cribandclouds.png',
  cribAndToys: '/assets/nurserypath/cribandtopys.png',
  cribLifestyle: '/assets/nurserypath/criblifestyle.png',
  dadadaCrib: '/assets/nurserypath/dadadacrib.png',
  dadadaDresser: '/assets/nurserypath/dadadadresser.png',
  dadadaMiniCrib: '/assets/nurserypath/dadadaminicrib.png',
  dresserAndRecliner: '/assets/nurserypath/dresserandrecliner.png',
  duplicate: '/assets/nurserypath/duplicate.png',
  glider: '/assets/nurserypath/glider.png',
  hatchGo: '/assets/nurserypath/hatchgo.png',
  hatchProductExample: '/assets/nurserypath/hatchproductexample.png',
  hatchSoundMachine: '/assets/nurserypath/hatchsoundmachine.png',
  joolBabyDiaperPail: '/assets/nurserypath/joolbabydiperpail.png',
  kiwiRecliner: '/assets/nurserypath/kiwirecliner.png',
  miniCrib: '/assets/nurserypath/minicrib.png',
  miniCribLifestyle: '/assets/nurserypath/minicriblifestyle.png',
  miniCribLifestyle2: '/assets/nurserypath/minicriblifestyle2.png',
  miniCribSize: '/assets/nurserypath/minicribsize.png',
  miniVsStandardCrib: '/assets/nurserypath/minivsstandadcrib.png',
  momcozyBabyMonitor: '/assets/nurserypath/momcozybabymonitor.png',
  momcozyDiaperPail: '/assets/nurserypath/momcozydiperpail.png',
  nanit: '/assets/nurserypath/nanit.png',
  newton: '/assets/nurserypath/newton.png',
  newtonLifestyle: '/assets/nurserypath/newtonlifestyle.png',
  newtonMattress: '/assets/nurserypath/newtonmatress.png',
  nurseryIdea: '/assets/nurserypath/nurseryidea.png',
  nurseryLifestyle: '/assets/nurserypath/nurserylifestyle.png',
  nurseryPlanning: '/assets/nurserypath/nurseryplanning.png',
  nurseryPlayroom: '/assets/nurserypath/nurseryplayroom.png',
  nurseryPrep: '/assets/nurserypath/nurseryprep.png',
  nurseryAtNight: '/assets/nurserypath/nurseyatnight.png',
  origamiMiniCrib: '/assets/nurserypath/origamiminicrib.png',
  overTheDoorOrganize: '/assets/nurserypath/overthedoororganize.png',
  owlet: '/assets/nurserypath/owlet.png',
  packAndPlay: '/assets/nurserypath/packandplay.png',
  packPlayStorage: '/assets/nurserypath/packplaystorage.png',
  sereneNursery: '/assets/nurserypath/serenenursery.png',
  simpleNursery: '/assets/nurserypath/simplenursery.png',
  space: '/assets/nurserypath/space.png',
  storage: '/assets/nurserypath/storage.png',
  storageBasket: '/assets/nurserypath/storagebasket.png',
  storageLifestyle: '/assets/nurserypath/storagelifestyle.png',
  tealNursery: '/assets/nurserypath/tealnursery.png',
  twinNursery: '/assets/nurserypath/twinnursery.png',
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

  lines.push('## Signature Decision Map', '');

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
    description:
      'Understand how bassinets, pack and plays, mini cribs, and cribs work together so the sleep plan feels calmer from the start.',
    subhead: "Your baby won't sleep in just one place, and that's exactly how it should be.",
    imagePath: NURSERY_ACADEMY_IMAGES.cribAndClouds,
    imageAlt: 'Crib and cloud nursery image for the Sleep Space Decisions module.',
    intro: [
      'You do not need to pick one perfect sleep setup.',
      'Most newborns sleep in more than one place because real life happens in more than one place.',
      'That is not a sign you are doing it wrong. It is usually a sign that your setup is keeping up with your day.',
      'This module is here to show how the main sleep spaces work together so the plan feels smaller, calmer, and much less dramatic.',
    ],
    coreSections: [
      {
        title: 'The sleep setups that actually matter',
        imageSrc: NURSERY_ACADEMY_IMAGES.cribAndToys,
        imageAlt: 'Sleep-space image showing the calmer nursery categories that matter most.',
        paragraphs: [
          'You do not need ten categories. You need to understand how bassinets, pack and plays, mini cribs, and standard cribs work together.',
          'Most families use more than one. That is not indecisive. That is just what happens when early sleep moves between beside-the-bed nights, daytime naps, room-to-room life, and the longer-term nursery setup.',
          'The calmer question is not Which one is best? It is Which jobs need to be covered, and by what?',
        ],
      },
      {
        title: 'Bedside bassinets',
        imageSrc: NURSERY_ACADEMY_IMAGES.bedsideBassinet,
        imageAlt: 'Bedside sleep setup shown in the early-weeks stage.',
        paragraphs: [
          'Bedside bassinets are usually an early-weeks convenience play. They keep baby close, make nighttime feeds less theatrical, and can feel especially helpful in the first stretch.',
          "They are also short-lived. For many families, this is a two-to-three-month product before the baby, the room, or everyone's patience moves on.",
          'The pros are obvious: closeness, quick access, and less midnight hiking. The cons are just as real: short lifespan, limited flexibility, and one more transition coming quickly. TMBC Take: nice to have, not necessary.',
        ],
      },
      {
        title: 'Smart bassinets',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryAtNight,
        imageAlt: 'Nighttime nursery image that reflects a more controlled sleep setup.',
        paragraphs: [
          'Smart bassinets can be helpful. They are still a tool, not a solution.',
          'The draw is motion, sound, and a more controlled sleep environment. The risk is that the setup starts doing so much of the work that the routine feels harder to transfer anywhere else.',
          'They also tend to stay put. So if your real life moves between rooms, floors, or houses, the value can shrink quickly. TMBC Take: helpful, but not something to rely on long-term.',
        ],
      },
      {
        title: 'Stroller bassinets are their own thing',
        imageSrc: '/assets/strollers/mixxnext.png',
        imageAlt: 'Stroller image illustrating stroller-specific bassinet compatibility.',
        paragraphs: [
          'Think Nuna MIXX Next Bassinet or UPPAbaby V3 Bassinet. These are stroller-specific, which means they only work with the stroller system they were designed for.',
          'You cannot mix and match stroller bassinets the way you can with car seats. That is where a lot of perfectly reasonable confusion begins.',
          'They are best for long-duration transport and the families who want that flatter pram-style ride. Even when a brand allows more sleep use, this is still not the same thing as having a universal nursery sleep solution.',
          `"You can't mix and match stroller bassinets the way you can with car seats."`,
        ],
      },
      {
        title: 'Mini cribs',
        imageSrc: NURSERY_ACADEMY_IMAGES.dadadaMiniCrib,
        imageAlt: 'Mini crib shown as a flexible room-to-room sleep setup.',
        paragraphs: [
          'Mini cribs are the most underrated option in this whole conversation.',
          'A mini crib does not lock you into one room. The good ones move with your day, especially if they have wheels, which makes them unusually practical in single-story homes.',
          'That is why they can replace multiple early setups for some families. A mini crib does not ask you to choose between bedside convenience and daily flexibility. It can do both more often than people realize.',
          'A mini crib does not lock you into one room. It moves with your day.',
        ],
      },
      {
        title: 'Pack and plays',
        imageSrc: NURSERY_ACADEMY_IMAGES.bedsidePackAndPlay,
        imageAlt: 'Portable sleep setup shown in a lived-in, flexible routine.',
        paragraphs: [
          'Pack and plays are the real-life MVP because they handle the everywhere-else lane.',
          "They work for daily movement, travel, downstairs naps, another caregiver's house, and the moments when you just need sleep to be portable.",
          'If you expect to use one often, buy the sturdier version from the start. Choose a model whose built-in sleep surface, fold, and overall setup already feel good enough for regular use.',
          'That is the practical case here: buy the version you actually want to live with if it is going to do real work.',
        ],
      },
      {
        title: 'Standard cribs',
        imageSrc: NURSERY_ACADEMY_IMAGES.cribLifestyle,
        imageAlt: 'Standard crib shown as the long-term nursery anchor.',
        paragraphs: [
          'A standard crib is the long-term nursery anchor. You are buying a crib. That is it.',
          'It does not need to sell you a whole future life story about becoming a full-size bed someday. If it converts to a toddler bed later, great. That is usually enough.',
          "For a second baby, this matters even more. Converting the older child's crib into a full-size bed too early can just create another furniture problem when what you still need is, very inconveniently, a crib.",
        ],
      },
      {
        title: 'What this actually looks like',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPlanning,
        imageAlt: 'Nursery planning image used as a mental model for a multi-setup sleep system.',
        paragraphs: [
          'In real life, the system often looks like this: bassinet for the earliest weeks, mini crib for flexible daily use, pack and play for the everywhere-else lane, and standard crib for the long game.',
          'Not every family uses all four. But many families use more than one, and that is the point.',
          'Sleep setups work better when they are allowed to share the job instead of forcing one product to pretend it can do every shift.',
        ],
      },
    ],
    decisionBullets: [
      'Do you need mobility, or do you want the main sleep setup to stay put?',
      'Are you in a single-story home, or will sleep need to move between levels?',
      'Do you want one flexible solution doing more work, or multiple lighter stations?',
      'Which sleep job matters right now: bedside access, daily flexibility, travel, or long-term nursery sleep?',
      'Are you buying for this stage, or for a later one you do not need to solve yet?',
    ],
    products: [
      {
        name: 'Newton Baby Travel Crib & Play Yard',
        description: 'Portable sleep setup that earns its place when the plan has to move with your real day.',
        pros: ['travel or backup sleep matters', 'one flexible setup needs to do real work'],
      },
      {
        name: 'HALO Flex Portable Crib',
        description: 'Flexible early sleep setup for the families who want room-sharing support without overcommitting to a tiny bedside-only lane.',
        pros: ['room-sharing flexibility matters', 'secondary sleep needs to stay lighter and easier to move'],
      },
      {
        name: 'dadada Baby Full-Size Crib',
        description: 'Long-term nursery crib that handles the stable part of the sleep plan without turning it into a personality trait.',
        pros: ['a dedicated nursery anchor matters', 'the long game starts after the early shuffle settles down'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This gets easier when one product stops trying to do every job.',
    softCtaBody: [
      'Sleep decisions get loud when the goal becomes finding one perfect answer.',
      'Most families do better when they build a system instead: one setup for the early stretch, one for flexibility, one for the longer nursery lane, and permission to let those jobs be different.',
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
        imageSrc: NURSERY_ACADEMY_IMAGES.dresserAndRecliner,
        imageAlt: 'Nursery dresser and chair shown as the kind of multi-purpose furniture mix that supports the room better.',
        paragraphs: [
          'A dresser with a changing pad can replace a separate changing table. A comfortable chair can replace multiple seating options.',
          'Choosing multi-purpose pieces reduces clutter and increases flexibility.',
          'It also keeps the room from turning into a category checklist with drawers.',
        ],
      },
      {
        title: 'Comfort vs necessity',
        imageSrc: NURSERY_ACADEMY_IMAGES.glider,
        imageAlt: 'Nursery glider and ottoman shown as a comfort-focused nursery upgrade.',
        paragraphs: [
          'Some items are not essential, but they still make a difference.',
          'A glider is the classic example. It is not required, but for many families it becomes one of the most-used pieces in the room.',
          'The better question is not Do I need this. It is Will I use this enough to justify the space.',
        ],
      },
      {
        title: 'Planning for growth',
        imageSrc: NURSERY_ACADEMY_IMAGES.newtonLifestyle,
        imageAlt: 'Nursery sleep setup that still feels useful as the room grows.',
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
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryAtNight,
        imageAlt: 'Nursery lighting setup with calmer nighttime placement.',
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
    imagePath: NURSERY_ACADEMY_IMAGES.storageLifestyle,
    imageAlt: 'Nursery organization image showing a calm storage setup with everyday essentials within reach.',
    intro: [
      'You do not need more storage. You need better organization.',
      'Most overwhelm comes from not knowing where things go or how quickly the room stops resetting itself.',
    ],
    coreSections: [
      {
        title: 'Accessibility',
        imageSrc: NURSERY_ACADEMY_IMAGES.storage,
        imageAlt: 'Nursery storage tray keeping the highest-use essentials easy to reach.',
        paragraphs: [
          'You should be able to grab what you need quickly, especially during diaper changes or nighttime care.',
          'If the essentials are buried behind the someday layer, the system is doing the opposite of helping.',
        ],
      },
      {
        title: 'Simplicity',
        imageSrc: NURSERY_ACADEMY_IMAGES.storageBasket,
        imageAlt: 'Simple woven nursery storage basket shown as part of a maintainable organization system.',
        paragraphs: [
          'The simpler your system is, the easier it is to maintain.',
          'Over-complicated setups usually look impressive for a week and then quietly fall apart.',
        ],
      },
      {
        title: 'Growth over time',
        imageSrc: NURSERY_ACADEMY_IMAGES.overTheDoorOrganize,
        imageAlt: 'Nursery dresser setup that can adapt as storage needs change.',
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
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryAtNight,
        imageAlt: 'Nursery with softer nighttime lighting and a calmer mood.',
        paragraphs: [
          'Lighting shapes how the space feels.',
          'Soft, warm lighting usually supports calm better than bright, hard lighting that makes the room feel more awake than it needs to.',
        ],
      },
      {
        title: 'Sound environment',
        imageSrc: NURSERY_ACADEMY_IMAGES.hatchSoundMachine,
        imageAlt: 'Sound machine shown as part of a calmer nursery sound environment.',
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
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryLifestyle,
        imageAlt: 'Calm nursery lifestyle image that supports simplicity over clutter.',
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
