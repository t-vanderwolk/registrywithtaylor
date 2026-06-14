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
    description:
      'Four questions answered honestly will determine more about your nursery than any product comparison. Most parents skip them and spend the rest of the process backtracking.',
    subhead: 'Four questions before any product decisions.',
    imagePath: NURSERY_ACADEMY_IMAGES.vision,
    imageAlt: 'Nursery vision editorial image for the Vision & Lifestyle Foundations module.',
    intro: [
      'The nursery decisions that feel confusing are almost always confusing because they are being made in the wrong order.',
      'Products come after context. Context comes from four specific questions that most parents skip because the questions feel like they are slowing things down.',
      'They are not. They are the reason the rest of the process gets shorter.',
      'The four questions are: What space are you actually working with? Who does the night shift and how does that affect room access? Is your home single-story or multi-story? And is this your first baby or your second?',
      'Answers to those four questions narrow the nursery decision to something much more manageable before a single product comparison begins.',
    ],
    coreSections: [
      {
        title: 'Question one — what space are you actually working with?',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryLifestyle,
        imageAlt: 'Nursery space reality showing a room that has been planned around actual dimensions.',
        paragraphs: [
          'The nursery category assumes a dedicated room. Many families do not have one.',
          'If the nursery is a dedicated room, the layout questions are straightforward — you are filling a defined space with a clear set of functions.',
          'If the baby will sleep in your bedroom, share a room with a sibling, or occupy a designated corner of another living space, the planning is fundamentally different.',
          'A shared-room nursery in a studio apartment needs different furniture, different storage, and different noise/light management than a dedicated nursery in a three-bedroom house.',
          'Before deciding anything, measure the actual space you are working with. Know the dimensions of the room or area, where the door and windows are, and how much usable floor space exists after accounting for the walls.',
          'Every furniture, layout, and storage decision that follows gets easier once the real space is defined.',
        ],
      },
      {
        title: 'Question two — who does night shifts and how do they access the room?',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryAtNight,
        imageAlt: 'Nursery nighttime caregiver access showing how room layout affects night-shift reality.',
        paragraphs: [
          'Night shift logistics are one of the most underplanned aspects of nursery setup.',
          'If one parent does most of the nighttime care and the nursery is down a hallway from the primary bedroom, a bedside bassinet in the primary bedroom may significantly reduce sleep disruption for the first weeks.',
          'If two parents are splitting night shifts and one sleeps more heavily, the monitor placement, sound machine location, and light control strategy need to support both people.',
          'If there is a toddler or other child sleeping nearby, sound management between rooms becomes a much more specific planning variable than general "white noise is good" advice.',
          'Ask: who gets up at night, where do they start, where is the baby, and how many steps and decisions does that journey require? The fewer steps and decisions, the more sustainable the routine.',
          'Night shift logistics are a layout and furniture question. Plan them before you plan anything else about the room.',
        ],
      },
      {
        title: 'Question three — single-story or multi-story home?',
        imageSrc: NURSERY_ACADEMY_IMAGES.miniCribLifestyle,
        imageAlt: 'Mini crib shown as a mobility-first solution in a multi-floor home.',
        paragraphs: [
          'This question determines whether a portable sleep solution deserves priority over a fixed one.',
          'In a single-story home, a mini crib with wheels can follow the household through the day — morning feeding in the kitchen area, afternoon nap near wherever the parent is working, evening sleep in the nursery. The portability is genuinely useful because it covers the whole space without requiring stairs.',
          'In a multi-story home, portability between floors usually requires carrying the baby, not the sleep surface. A mini crib becomes less practical and a pack and play assigned to the non-nursery floor is often more useful.',
          'The sleep solution strategy for a single-story home is often one mobile sleep surface plus a fixed nursery crib for longer night sleep.',
          'For a multi-story home it is often a fixed nursery setup plus a dedicated pack and play or compact sleep surface on the floor where daytime life happens.',
          'The home layout determines the sleep system almost as much as the baby\'s age does.',
        ],
      },
      {
        title: 'Question four — first baby or second?',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPlanning,
        imageAlt: 'Nursery planning context showing how sibling proximity changes the nursery setup.',
        paragraphs: [
          'First nurseries are planned with maximum uncertainty about what will actually matter.',
          'Second nurseries are planned with the knowledge of everything that did and did not get used the first time — but with the added constraint of another child in the house who may be affected by every noise, schedule, and layout decision.',
          'For first babies: the most common mistake is over-planning based on aspirational routines. The nursery that looks perfect on paper often does not survive the first two weeks of real life. Build in more flexibility and fewer fixed decisions.',
          'For second babies: the most common mistake is under-planning for sibling interaction. Where is the older child\'s room relative to the nursery? Can you manage nighttime noise without waking both children? Does the nursery need to eventually convert to a shared room?',
          'The layout, furniture, and storage decisions look different depending on which situation you are in. Know which situation you are planning for.',
        ],
      },
    ],
    decisionBullets: [
      'Measure the actual space before making any furniture decisions — the category assumes a dedicated room that many families do not have.',
      'Plan night shift logistics as a layout variable, not as an afterthought.',
      'Let home layout (single vs. multi-story) determine whether a portable sleep solution deserves priority.',
      'For first babies, build in more flexibility and fewer fixed decisions — the routine you imagine rarely survives the first two weeks.',
      'For second babies, plan for sibling proximity and eventual shared-room scenarios before the paint goes on.',
    ],
    products: [
      {
        name: 'Crib with Defined Footprint',
        description: 'A fixed nursery anchor — right when the room is dedicated and the layout can support a single long-term sleep surface.',
        pros: ['Stable long-term sleep solution', 'Worth prioritizing once the nursery space is confirmed'],
      },
      {
        name: 'Mini Crib with Wheels',
        description: 'The mobility-first solution for single-story homes where the sleep surface needs to follow daily movement.',
        pros: ['Covers the whole floor plan', 'Reduces the need for multiple fixed sleep stations'],
      },
      {
        name: 'Pack and Play',
        description: 'The everywhere-else sleep surface — particularly useful as a dedicated floor-specific solution in multi-story homes.',
        pros: ['Handles the non-nursery floor', 'Provides consistent sleep environment outside the primary nursery'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'These four questions are not a delay. They are the shortcut.',
    softCtaBody: [
      'Parents who answer them honestly at the start almost always have clearer, calmer nursery setups than parents who answered them midway through the shopping process.',
      'Every module that follows builds on what you just established.',
    ],
    nextModuleSlug: 'sleep-space-decisions',
    previousModuleSlug: null,
  }),
  createNurseryModule({
    title: 'Sleep Space Decisions',
    slug: 'sleep-space-decisions',
    moduleOrder: 2,
    description:
      'The sleep system covers four distinct jobs. The mistake is buying one product and expecting it to do all of them.',
    subhead: 'Four sleep jobs. Not one perfect product.',
    imagePath: NURSERY_ACADEMY_IMAGES.cribAndClouds,
    imageAlt: 'Crib and clouds nursery image for the Sleep Space Decisions module.',
    intro: [
      'The sleep category is one of the most overwhelming parts of nursery prep because parents approach it as a single decision.',
      'It is not. It is four decisions that happen to involve the same category.',
      'Job one: bedside nighttime access in the early weeks. Job two: flexible daytime sleep that moves with the household. Job three: the everywhere-else lane — travel, grandparents\' house, downstairs naps. Job four: the long-term nursery sleep surface.',
      'Each job has a cleaner answer than "find the one best product." Once the jobs are separated, the sleep system becomes a small set of obvious choices instead of a stressful comparison of forty-seven options.',
    ],
    coreSections: [
      {
        title: 'Job one — bedside nighttime access',
        imageSrc: NURSERY_ACADEMY_IMAGES.bedsideBassinet,
        imageAlt: 'Bedside bassinet covering the nighttime access job in the early weeks.',
        paragraphs: [
          'The bedside job is about reducing the distance between where you sleep and where the baby sleeps during the early weeks of nighttime feeding.',
          'This job is covered by a bedside bassinet — a sleep surface that sits at bed height next to the primary caregiver and allows quick nighttime access without fully getting up.',
          'The bedside bassinet has a defined lifespan. Most are used for two to four months before the baby outgrows the weight or size limit, or before the family transitions to a nursery sleep setup.',
          'This means the bedside bassinet is a short-horizon purchase. Know the replacement horizon before deciding how much to spend on it. For a two-to-four-month use window, budget accordingly — or borrow one from a family member who is done with it.',
          'Smart bassinets (automated rocking, responsive motion, sound) cover the same bedside job with additional soothing features. The tradeoff is cost and portability — smart bassinets tend to stay put, which reduces their utility if your daily life moves between spaces.',
          'TMBC logic: the bedside bassinet is nice to have, not essential. Parents who skip it and use a mini crib or pack and play beside the bed do just fine.',
        ],
      },
      {
        title: 'Job two — flexible daytime sleep',
        imageSrc: NURSERY_ACADEMY_IMAGES.dadadaMiniCrib,
        imageAlt: 'Mini crib covering the daily flexible sleep job for room-to-room household movement.',
        paragraphs: [
          'The daytime flexibility job is about a sleep surface that can follow the household during waking hours.',
          'This is where the mini crib is the most underrated option in the category.',
          'A mini crib with wheels does not lock the baby into one room. In a single-story home, it can move from bedroom to living area to home office to wherever the caregiver is working. That flexibility replaces multiple early setups for families who use it.',
          'Mini cribs are smaller than standard cribs — typically around 38 by 24 inches versus the standard 52 by 28 inches — which makes them easier to position in tighter spaces and move through doorways.',
          'The limitation: mini cribs require mini crib-sized sheets, which are not the same as standard crib sheets. It is a minor logistical note, but worth knowing before registering for twelve standard crib sheets.',
          'For multi-story homes, the daytime flexibility job is often covered better by a pack and play on the main floor than by a mini crib that struggles with stairs.',
        ],
      },
      {
        title: 'Job three — the everywhere-else lane',
        imageSrc: NURSERY_ACADEMY_IMAGES.bedsidePackAndPlay,
        imageAlt: 'Pack and play covering the travel and portable sleep job.',
        paragraphs: [
          'The everywhere-else lane is travel, other caregivers\' homes, downstairs naps, and any situation where the primary sleep setup cannot come along.',
          'Pack and plays are the clear answer for this job. They fold, they carry, they set up in under five minutes, and they provide a consistent safe sleep environment regardless of destination.',
          'The choice within pack and plays comes down to how often the job runs. If the pack and play is primarily a travel item used four to six times a year, a basic model is sufficient. If it is a daily-use surface that gets set up and broken down regularly, buy the sturdier, better-mattressed version from the start.',
          'An underweight pack and play mattress is one of the most consistent complaints from parents who use their pack and play frequently. The included mattress is typically thin. If the pack and play will see heavy use, a compatible additional pad or mattress insert resolves this.',
          'Stroller bassinets (the Nuna MIXX Next Bassinet, UPPAbaby bassinet attachments) cover a related but different job — extended pram-style transport during outings. They are stroller-specific accessories, not universal sleep solutions. You cannot mix and match stroller bassinets across brands the way you can with car seats.',
        ],
      },
      {
        title: 'Job four — the long-term nursery anchor',
        imageSrc: NURSERY_ACADEMY_IMAGES.cribLifestyle,
        imageAlt: 'Standard crib as the long-term nursery sleep anchor.',
        paragraphs: [
          'The long-term job is the nursery crib — the fixed sleep surface that the baby will use from somewhere around four to six months through toddlerhood.',
          'A standard crib needs to do one thing well: provide a safe, comfortable sleep surface for an extended period. It does not need to convert to a full-size bed someday to be worth the purchase.',
          'Convertible cribs — those that convert to toddler beds, daybeds, and eventually full-size beds — have a longer usefulness horizon and lower long-term cost. The tradeoff is that the conversion requires additional hardware purchases and the full-size conversion often produces a somewhat awkward-looking piece of furniture.',
          'For second babies: be careful about converting the older child\'s crib too early to reclaim it for the newborn. Converting a crib before the toddler is ready creates a toddler sleep transition at the same time as a newborn sleep routine — both problems are happening simultaneously.',
          'A simpler approach for second babies is buying a second crib or keeping the mini crib as the newborn surface while the toddler keeps the original crib.',
          'The long-term job is straightforward. Buy a safe, solid crib that fits the room. That is the whole decision.',
        ],
      },
      {
        title: 'What a real sleep system looks like',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPlanning,
        imageAlt: 'Nursery planning overview showing a multi-product sleep system.',
        paragraphs: [
          'Most families do not use one sleep product. They use a system where different products cover different jobs.',
          'A common system: bedside bassinet for the first two to four months, mini crib for daytime flexibility through the first year, pack and play for travel and the downstairs lane, standard crib for the nursery from four months onward.',
          'Not every family uses all four. Some skip the bedside bassinet entirely and use a mini crib beside the bed. Some skip the mini crib because they live in a multi-story home where it is not practical. Some never use a pack and play because they travel infrequently and have reliable sleep environments wherever they go.',
          'The jobs are the constant. The products that cover each job vary by household.',
          'Build the system by assigning a product to each job that applies to your situation. Then leave the jobs that do not apply empty.',
        ],
      },
    ],
    decisionBullets: [
      'Identify which of the four jobs apply to your situation before comparing any products.',
      'The bedside job: a bassinet, smart or standard, with a realistic short replacement horizon.',
      'The daytime flexibility job: a mini crib with wheels (single-story) or a pack and play on the main floor (multi-story).',
      'The everywhere-else job: a pack and play — basic if travel is occasional, better-mattressed if it is regular.',
      'The long-term nursery job: a standard crib evaluated on safety, size fit, and whether convertibility is worth paying for in your situation.',
    ],
    products: [
      {
        name: 'Newton Baby Travel Crib and Play Yard',
        description: 'A portable sleep surface that covers the everywhere-else lane with a breathable mattress and a consistent safe-sleep environment.',
        pros: ['Handles travel and downstairs sleep', 'Better mattress than most basic pack and plays'],
      },
      {
        name: 'dadada Mini Crib with Wheels',
        description: 'The flexibility-first sleep surface for single-story homes — follows the household through the day without requiring a dedicated room.',
        pros: ['Covers daytime flexibility and bedside access simultaneously', 'Smaller footprint for tighter spaces'],
      },
      {
        name: 'dadada Full-Size Crib',
        description: 'The long-term nursery anchor — built for the four-months-and-beyond nursery sleep job without unnecessary complexity.',
        pros: ['Stable long-term sleep surface', 'Convertible to toddler bed without a full furniture replacement'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The sleep system is simpler once the jobs are assigned.',
    softCtaBody: [
      'Most families need two or three products to cover the sleep category, not one perfect answer to every scenario.',
      'Assign a product to each job that applies to your life. Leave the jobs that do not apply empty. That is the system.',
    ],
    nextModuleSlug: 'furniture-that-actually-works',
    previousModuleSlug: 'vision-and-lifestyle',
  }),
  createNurseryModule({
    title: 'Furniture That Actually Works',
    slug: 'furniture-that-actually-works',
    moduleOrder: 3,
    description:
      'The dresser-as-changing-table is the most consequential furniture decision in the nursery. Most people make it without realizing it is a decision.',
    subhead: 'Three pieces. One real decision. One honest evaluation.',
    imagePath: NURSERY_ACADEMY_IMAGES.nurseryPrep,
    imageAlt: 'Nursery prep image for the Furniture That Actually Works module.',
    intro: [
      'Nursery furniture lists tend to include eight to twelve items. The functional list is closer to three.',
      'A crib or sleep surface (covered in the previous module), a dresser with a changing setup, and seating. That is the core.',
      'Everything else — dedicated changing tables, glider ottomans, toy chests, bookshelves, nightstands — may have a place in your room, but it earns that place or it does not.',
      'This module focuses on the three core pieces and one decision that determines more about how the room functions day-to-day than anything else: whether the dresser doubles as the changing surface.',
    ],
    coreSections: [
      {
        title: 'The three pieces every nursery actually needs',
        imageSrc: NURSERY_ACADEMY_IMAGES.dadadaCrib,
        imageAlt: 'Crib as the nursery anchor, one of three core furniture pieces.',
        paragraphs: [
          'Every nursery needs a sleep surface, a changing and clothing storage setup, and seating. That is the complete list.',
          'The sleep surface is the crib or mini crib covered in the previous module.',
          'The changing and clothing storage setup is usually one piece of furniture doing both jobs — a dresser with a topper pad. Or it is a separate changing table and a separate dresser. The choice between those two approaches is the furniture decision with the biggest day-to-day impact.',
          'Seating is the most underestimated piece in the room. You will use it more than almost anything else for longer than you expect. It is the last place to cut the budget.',
        ],
      },
      {
        title: 'The dresser-as-changing-table — the real decision',
        imageSrc: NURSERY_ACADEMY_IMAGES.dadadaDresser,
        imageAlt: 'Dresser with changing topper covering both storage and daily changing in one footprint.',
        paragraphs: [
          'A dedicated changing table is a single-purpose piece of furniture. It does one job — providing a raised, padded surface for diaper changes — and then it stops being useful. The typical window is twelve to eighteen months.',
          'A dresser with a contoured changing topper does the same job and also stores every piece of clothing, diaper supply, and swaddle in the room. The dresser continues to be useful for years after the baby outgrows the changing pad.',
          'This is why the dresser-as-changing-table is the most consequential furniture decision in the nursery. It is not just about convenience. It is about whether one footprint can cover two of the room\'s biggest jobs simultaneously.',
          'The trade-offs are real. A dedicated changing table typically has a lower surface height, making it easier for shorter caregivers. It also tends to have built-in rails and a more ergonomic angle for the changing position. A dresser topper sits higher and does not always match the ergonomics of a purpose-built surface.',
          'A practical middle path: choose a dresser height that puts the changing surface at a comfortable working height for your primary caregiver, and add a contoured topper with side rails. This recovers most of the ergonomic benefit while keeping the dual-purpose footprint.',
        ],
      },
      {
        title: 'Seating evaluated for 3 AM',
        imageSrc: NURSERY_ACADEMY_IMAGES.glider,
        imageAlt: 'Nursery glider evaluated not for style but for 3 AM usability.',
        paragraphs: [
          'Most people evaluate nursery seating for how it looks during the day. The correct evaluation period is 3 AM after four weeks of interrupted sleep.',
          'The questions that actually matter: Can you get in and out of it one-handed while holding a baby? Does it recline enough to half-sleep during a long feeding without waking the baby when you shift? Does it support your lower back for forty-five-minute feeding sessions?',
          'Gliders move in a smooth, forward-and-back motion that tends to be quieter and better suited to a sleeping baby than a traditional rocking chair. Recliners provide more sleep-ability for the caregiver during long overnight sessions. Some models combine both.',
          'The ottoman is optional but more useful than it looks. Having a place to prop your feet during a feeding significantly reduces lower back fatigue over the first several months. If the budget is tight, a simple footstool covers most of the job.',
          'Buy the seating you will actually want to sit in at 3 AM. This is not a good place to compromise on comfort in exchange for a look that coordinates with the crib.',
        ],
      },
      {
        title: 'What "convertible" actually means — and when it is worth paying for',
        imageSrc: NURSERY_ACADEMY_IMAGES.newtonLifestyle,
        imageAlt: 'Nursery furniture setup evaluated for long-term usefulness.',
        paragraphs: [
          '"Convertible" in nursery furniture marketing typically refers to a crib that converts to a toddler bed and eventually a full-size bed. It can also refer to a changing table that converts to a dresser or bookshelf after the changing phase ends.',
          'The value of convertibility depends entirely on whether the converted version is something you would actually buy independently.',
          'A convertible crib is worth the premium if the toddler bed or full-size bed it becomes is a piece you would have purchased anyway and the hardware to convert it is included, reasonably priced, and available years from now when you need it.',
          'A changing table that converts to a dresser is worth the premium if the resulting dresser is the right size, height, and style for the next stage. Many do not convert gracefully.',
          'The honest test: look at images of the converted form. Would you buy that piece of furniture on its own merit? If yes, convertibility probably adds value. If it looks like an awkward middle ground between two better options, it probably is.',
        ],
      },
    ],
    decisionBullets: [
      'The dresser-as-changing-table is almost always the right call — evaluate it on ergonomics (dresser height vs. your height) and topper quality, not on whether it\'s traditional.',
      'A dedicated changing table makes sense primarily for shorter caregivers for whom dresser height is genuinely uncomfortable, or for very small rooms where a narrow changing table fits better than a full dresser.',
      'Evaluate seating for 3 AM usability: can you get in and out one-handed, does it support your back for long sessions, will you be comfortable in it half-asleep?',
      'Before paying the convertible premium, look at photos of the converted form and ask whether you\'d buy that piece independently.',
      'Everything beyond crib, dresser-changing setup, and seating earns its place or it doesn\'t. A bookshelf, toy chest, or nightstand is optional until your routine proves otherwise.',
    ],
    products: [
      {
        name: 'dadada Furniture Dresser',
        description: 'A well-proportioned nursery dresser designed to carry a changing topper and serve as both storage and daily changing surface in one footprint.',
        pros: ['Covers storage and changing in a single piece', 'Built for long-term use after the changing phase ends'],
      },
      {
        name: 'Kiwi Nursery Glider',
        description: 'A glider-recliner that earns its place at 3 AM — smooth movement, genuine recline, and back support for the long overnight feeding stretch.',
        pros: ['Recliner function for overnight feeding support', 'Quieter motion than a traditional rocker'],
      },
      {
        name: 'dadada Full-Size Convertible Crib',
        description: 'The long-term nursery anchor with a convertible path to toddler bed — worth the premium when the converted form is genuinely useful.',
        pros: ['Converts to toddler bed with included hardware', 'Solid construction designed to last through the full childhood arc'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'Three pieces, done well, cover almost everything.',
    softCtaBody: [
      'The nursery furniture category creates the impression that you need many things. You need three.',
      'Crib. Dresser-as-changing-table. Seating worth sitting in at 3 AM. Get those right and the rest of the room solves itself.',
    ],
    nextModuleSlug: 'layout-and-flow',
    previousModuleSlug: 'sleep-space-decisions',
  }),
  createNurseryModule({
    title: 'Layout & Flow',
    slug: 'layout-and-flow',
    moduleOrder: 4,
    description:
      'The 2:14 AM test: can you enter the room, pick up the baby, change them, feed them, and put them back without turning on an overhead light or stepping on anything?',
    subhead: 'Design the room for 2 AM, and it works fine at noon too.',
    imagePath: NURSERY_ACADEMY_IMAGES.space,
    imageAlt: 'Nursery space layout image for the Layout and Flow module.',
    intro: [
      'Layout decisions are easy to make during the day, staring at an empty room, in good lighting, fully rested.',
      'Those are not the conditions under which the layout will actually be tested.',
      'The nursery layout is tested at 2:14 AM, three nights in, when you are running on four hours of fragmented sleep and moving through a dark room on muscle memory.',
      'This module introduces three audits that expose layout problems before they become 2 AM problems: the path audit, the arm-reach audit, and the light placement audit. Then a framework for dividing the room into three functional zones that make the whole space easier to use.',
    ],
    coreSections: [
      {
        title: 'The path audit — door to crib without a light',
        imageSrc: NURSERY_ACADEMY_IMAGES.twinNursery,
        imageAlt: 'Nursery layout with clear paths between furniture for nighttime navigation.',
        paragraphs: [
          'The path audit is simple: stand at the door of the nursery in the dark and walk to the crib.',
          'Count the objects between the door and the crib. Count the corners you need to navigate. Note whether any of those corners require you to angle sideways while holding a baby.',
          'The fewer obstacles between the door and the crib, the better the layout. This is the primary layout constraint. Everything else — where the dresser goes, where the chair sits, where the monitor lives — is organized around keeping that path clean.',
          'Common path mistakes: placing the dresser perpendicular to the wall in a way that creates a blind corner; positioning the chair so that getting in and out requires stepping past the crib; placing a storage basket or laundry hamper directly on the most-used walking line between door and crib.',
          'Ideal crib placement: visible from the doorway, reachable in a straight line or a single turn, not in a corner that requires a caregiver to angle through a tight space while carrying a baby.',
        ],
      },
      {
        title: 'The arm-reach audit at the changing surface',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPrep,
        imageAlt: 'Nursery changing area setup with supplies within arm reach of the caregiver.',
        paragraphs: [
          'The arm-reach audit: stand at the changing surface with one hand keeping contact with the baby. Everything you need for a complete diaper change should be reachable with the other hand without stepping away from the surface.',
          'The list of what needs to be within arm\'s reach: diapers in the current size, wipes, changing pad covers (at least two), diaper cream, and a disposal option.',
          'This sounds obvious. It is frequently violated because the changing supplies are often stocked in a drawer below the surface or in a closet nearby rather than at surface level within reach.',
          'The fastest fix is a small open basket or caddy at surface height — next to the changing pad, not below it — that holds the daily changing supplies. The drawer below can hold backup stock, extra sizes, and overflow.',
          'A second arm-reach failure point: trash. If the diaper pail requires you to step away from the changing surface to drop the diaper, it is in the wrong place. The diaper pail should be within reach of the changing surface while one hand remains on the baby.',
        ],
      },
      {
        title: 'The three-zone framework — sleep, change, feed',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPlayroom,
        imageAlt: 'Nursery divided into three functional zones for sleep, changing, and feeding.',
        paragraphs: [
          'Nurseries work better when they are divided into three zones rather than one undifferentiated room of baby things.',
          'Zone one is sleep: the crib and its immediate surrounding space. This zone should be quieter, darker, and free of visual clutter. Nothing that makes noise, emits light, or requires interaction should be within the crib zone unless it is the sound machine.',
          'Zone two is change: the dresser-as-changing-table and its immediate surrounding space. This zone should have the highest surface lighting (you need to see clearly during changes) and the highest concentration of daily supplies within arm reach.',
          'Zone three is feed: the chair and its immediate surrounding space. This zone should have the most comfortable ambient light — adjustable enough to be dark for nighttime feeds and light enough during the day. A side table or small surface within reach for a water glass, phone, and burp cloth earns its place here.',
          'The three zones do not require square footage. They require intentional placement. A small nursery can have all three zones as long as each zone has what it needs without requiring the caregiver to cross into another zone mid-task.',
        ],
      },
      {
        title: 'Light control — the last placement decision',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryAtNight,
        imageAlt: 'Nursery at night showing light placement and control for dual-mode use.',
        paragraphs: [
          'Light in the nursery has two modes: daytime visibility and nighttime care.',
          'Daytime mode is bright enough to use the changing surface clearly, evaluate a diaper rash, or read the label on a medication. This typically requires a dedicated overhead or task light near the changing zone.',
          'Nighttime care mode is dim enough not to fully wake the baby during a feeding or nighttime change. Overhead lights almost always fail this. A lamp on a dimmer, a nightlight with a warm spectrum, or a smart bulb on a low setting covers this much better.',
          'The most practical setup: an overhead light on a dimmer switch (or smart bulb), plus a nightlight or small lamp near the feeding chair for overnight sessions. The nightlight handles the middle-of-the-night care moments without requiring the overhead.',
          'One placement mistake worth avoiding: putting the nightlight directly in the baby\'s sightline from the crib. A light that the baby can stare at from their sleep position creates a visual stimulus that can disrupt sleep onset. Position nightlights low and angled away from the crib.',
          'Blackout curtains are separate from the light control framework but worth including in layout planning: confirm where the window is relative to the crib and whether the morning light from that window is going to hit the crib directly. It usually needs to not.',
        ],
      },
    ],
    decisionBullets: [
      'Run the path audit: count the obstacles between the door and the crib and remove anything that creates a corner or obstacle in the dark.',
      'Run the arm-reach audit: confirm that every changing supply you need is reachable with one hand while the other stays on the baby, including the diaper pail.',
      'Identify and build out all three zones — sleep, change, feed — before styling details take over.',
      'Plan lighting for both modes: daytime visibility near the changing surface and nighttime care near the feeding chair, with overhead on a dimmer or smart control.',
      'Confirm that the crib is not in the direct path of morning window light and that any nightlights are angled away from the baby\'s sightline.',
    ],
    products: [
      {
        name: 'Hatch Rest Sound Machine and Nightlight',
        description: 'A combined sound and nightlight tool that covers the nighttime care lighting zone — dim, warm, and controllable from your phone without entering the room.',
        pros: ['Handles nighttime care light without overhead disruption', 'App control means you never have to touch it mid-night'],
      },
      {
        name: 'dadada Dresser with Changing Topper',
        description: 'The anchor for the change zone — dresser height positions the changing surface correctly, and the integrated storage keeps the arm-reach audit passable.',
        pros: ['Positions the change zone correctly without a separate changing table', 'Drawers below for backup stock, surface area above for daily supplies'],
      },
      {
        name: 'Kiwi Nursery Glider',
        description: 'The anchor for the feed zone — places the caregiver in a stable, comfortable position with enough arm control to handle overnight feeds without a full light.',
        pros: ['Defines the feed zone with the right ergonomics', 'Quiet enough for nighttime sessions without disrupting the sleep zone'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'Design it for 2 AM and it works fine the rest of the time.',
    softCtaBody: [
      'Daylight nursery decisions look different at 2 AM. Run the three audits before the room is finished and fix anything that would make a tired version of you miserable.',
      'A room that passes the path audit, the arm-reach audit, and the light control audit is a functional nursery. Everything after that is optional.',
    ],
    nextModuleSlug: 'storage-and-organization',
    previousModuleSlug: 'furniture-that-actually-works',
  }),
  createNurseryModule({
    title: 'Storage & Organization',
    slug: 'storage-and-organization',
    moduleOrder: 5,
    description:
      'The metric that matters is reset speed — how long does it take to put the room back in order after a chaotic night? That is what good storage actually measures.',
    subhead: 'Not how tidy it looks. How fast it resets.',
    imagePath: NURSERY_ACADEMY_IMAGES.storageLifestyle,
    imageAlt: 'Nursery storage lifestyle image for the Storage and Organization module.',
    intro: [
      'Storage in a nursery is not primarily an aesthetic problem. It is a logistics problem.',
      'The question is not how to make the room look organized. It is how to make the room easy to use when you are tired, moving fast, and operating with one hand.',
      'The metric that reveals whether a storage system is working is reset speed: how long does it take to put the room back in usable order after a chaotic night or a full day of caregiving?',
      'A system that resets in five minutes is good. A system that requires fifteen minutes and sustained attention is a system that will quietly collapse by week three.',
    ],
    coreSections: [
      {
        title: 'Three categories of storage — daily, weekly, and seasonal',
        imageSrc: NURSERY_ACADEMY_IMAGES.storage,
        imageAlt: 'Nursery storage system showing the layered daily, weekly, and seasonal categories.',
        paragraphs: [
          'The first step toward faster reset is separating nursery storage into three layers based on use frequency.',
          'Daily storage is everything you touch every single day: current-size diapers, wipes, changing cream, the clothing sizes actively being worn, swaddles in rotation, and the feeding supplies in current use. This category should be at or near the surface level — open bins, top drawers, within arm reach of where the task happens.',
          'Weekly storage is what you restock or rotate on a weekly cycle: diaper box backup, next-size-up clothing still in packaging, extra sheet sets for the crib, backup wipes, extra formula or nursing supplies. This goes in lower drawers, deeper closet shelves, or under-crib storage.',
          'Seasonal storage is what does not move frequently: outgrown clothing sets being kept, future size purchases bought ahead, gear being stored between phases. This belongs outside the active nursery footprint — a hall closet, under-bed storage, or a dedicated bin in a storage area.',
          'The most common nursery storage failure is mixing all three layers together in the same accessible space. The result is that finding what you need in the daily layer requires sorting through the weekly and seasonal layers every time. Separate the layers and the daily reset becomes dramatically faster.',
        ],
      },
      {
        title: 'The changing station supply stack',
        imageSrc: NURSERY_ACADEMY_IMAGES.overTheDoorOrganize,
        imageAlt: 'Organized changing station supply stack with surface caddy and nearby drawer backup.',
        paragraphs: [
          'The changing station has its own storage logic because everything it holds needs to be accessible mid-change with one hand.',
          'The fastest-resetting changing station keeps daily supplies in an open caddy or bin at surface level, next to the changing pad. Diapers (current size, six to ten at surface level), wipes (open and accessible, not buried under a lid), changing cream, and one spare changing pad cover. That is the surface layer.',
          'The drawer immediately below the changing surface holds the backup layer: a full sleeve of diapers, a backup wipes pack, extra cream, and two more changing pad covers.',
          'Over-the-door organizers on the back of the nursery door or closet door are useful for diaper bag refill supplies, medicine, grooming tools, and the miscellaneous daily-use items that do not belong in the dresser drawers. They keep these items accessible without consuming drawer or surface space.',
          'The diaper pail lives in the change zone, not the most convenient corner. Position it within arm reach of the changing surface. A diaper pail that requires you to step away is a diaper pail that creates a safety risk when the baby is on the changing surface.',
        ],
      },
      {
        title: 'Clothing size rotation as a storage problem',
        imageSrc: NURSERY_ACADEMY_IMAGES.storageBasket,
        imageAlt: 'Nursery clothing storage with current-size rotation accessible and next-size stored separately.',
        paragraphs: [
          'Infant clothing size rotation is one of the most overlooked storage challenges in the nursery.',
          'Newborns outgrow clothing sizes in weeks. The practical result is that the nursery dresser needs to hold the current active size, the next size up that is coming soon, and the size that was just outgrown and needs to be stored or passed on — all simultaneously.',
          'The simplest system: dedicate one drawer to the current active size, one drawer to the next size up, and a basket or bin outside the dresser for outgrown clothing staged for storage.',
          'When the baby moves to the next size, the outgrown clothing moves to the storage basket, the next-size drawer moves to the active drawer, and you fill the next-size drawer from your staged supply. The reset takes ten minutes instead of an hour of sorting.',
          'Labeling drawers by size (not by item type) during the newborn stage makes this rotation much smoother. In the early months, a drawer of "3-6 month onesies" is more functional than a drawer of "pants" that contains sizes across three growth periods.',
        ],
      },
      {
        title: 'The proximity-to-use principle',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryPrep,
        imageAlt: 'Nursery storage arranged with highest-use items closest to the point of use.',
        paragraphs: [
          'The proximity-to-use principle is simple: store each item as close as possible to the place where it is used.',
          'Diapers and wipes live at the changing surface, not across the room. The sound machine and its remote live near the crib, not on the dresser on the other side of the room. The nursing supplies live at or near the feeding chair.',
          'Every step between "where the item is" and "where the item is used" is a friction point that accumulates across hundreds of daily repetitions. In the early months, you will use these items dozens of times per day. Friction compounds.',
          'Apply the proximity principle when initially setting up the room and correct it ruthlessly when you discover something is not where it should be. The nursery that works best after a month of living in it is usually the nursery where everything has migrated to where it actually gets used.',
          'This also means the initial setup is a hypothesis. Plan it with proximity-to-use in mind, then watch where things actually end up after two weeks. The things that have migrated are telling you where they actually need to be stored.',
        ],
      },
    ],
    decisionBullets: [
      'Separate storage into three layers (daily, weekly, seasonal) and keep them physically separate — do not mix access frequencies in the same drawer or shelf.',
      'The changing station surface layer holds six to ten diapers, open wipes, cream, and one spare cover — everything accessible one-handed.',
      'Keep the diaper pail within arm reach of the changing surface. Not nearby. Within reach.',
      'Organize clothing drawers by size during the newborn phase, not by item type — it makes rotation ten minutes instead of an hour.',
      'Set up the room with proximity-to-use in mind, then watch for two weeks and move whatever has migrated to where it is actually being used.',
    ],
    products: [
      {
        name: 'dadada Dresser',
        description: 'Four-drawer storage that supports the daily-weekly layer separation — top drawer for active size, next drawer for incoming size, lower drawers for weekly supply backup.',
        pros: ['Drawer depth supports real volume per layer', 'Surface doubles as the changing area, keeping both jobs in the same footprint'],
      },
      {
        name: 'Jool Baby Diaper Pail',
        description: 'A compact diaper pail designed to fit within arm reach of the changing surface without dominating the floor footprint of the change zone.',
        pros: ['Compact enough to position correctly at the changing surface', 'Odor control that works without requiring a full step away to deposit'],
      },
      {
        name: 'Momcozy Diaper Pail',
        description: 'A wider-capacity diaper pail for families with higher daily change volume — still fits close to the changing surface when positioned intentionally.',
        pros: ['Higher capacity for frequent changers', 'Works in the change zone when placed correctly rather than relegated to a corner'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'A storage system that resets in five minutes is a system that will last.',
    softCtaBody: [
      'The goal is not a nursery that looks organized in photos. It is a nursery where you can put everything back in order before the baby wakes from a nap.',
      'Separate the layers. Keep daily supplies at the point of use. Watch where things migrate after two weeks and adjust. That is the whole system.',
    ],
    nextModuleSlug: 'atmosphere-and-safety',
    previousModuleSlug: 'layout-and-flow',
  }),
  createNurseryModule({
    title: 'Atmosphere & Safety',
    slug: 'atmosphere-and-safety',
    moduleOrder: 6,
    description:
      'Safe sleep is subtraction, not addition. The safest crib is the one with the least in it. Everything else in this module supports the room around that principle.',
    subhead: 'Safe sleep is what you remove. Atmosphere is what you add.',
    imagePath: NURSERY_ACADEMY_IMAGES.sereneNursery,
    imageAlt: 'Serene nursery atmosphere image for the Atmosphere and Safety module.',
    intro: [
      'Safe sleep and nursery atmosphere sound like two separate conversations. They are actually one.',
      'The safest sleep environment is a subtraction exercise: removing everything from the crib and the crib zone that does not need to be there. Bumpers, pillows, positioners, stuffed animals, loose blankets — out.',
      'The nursery atmosphere is what you build in the space around the crib after the subtraction is complete: sound, light, and monitoring that support consistent sleep without adding to the sensory load inside the sleep zone.',
      'This module covers both. First, what must be absent from the crib. Then the tools that make the room around the crib work better.',
    ],
    coreSections: [
      {
        title: 'Safe sleep — what must be absent from the crib',
        imageSrc: NURSERY_ACADEMY_IMAGES.newtonMattress,
        imageAlt: 'Minimal crib setup with only a fitted mattress — the safe sleep standard.',
        paragraphs: [
          'The American Academy of Pediatrics safe sleep guidelines are clear and worth understanding, not just following as a rule.',
          'The crib should contain: a firm, flat mattress and one fitted sheet. That is the complete list for the sleep zone itself.',
          'What must be absent: bumper pads (including mesh bumpers — they are not a safe alternative), pillows, loose blankets, stuffed animals, positioners, wedges, sleep positioners, and rolled blankets used to prop the baby\'s position.',
          'The reasoning is straightforward. Infants lack the motor control to reposition themselves if their airway is compromised by soft bedding or objects. Every item added to the crib increases the risk surface. Subtraction is the safety action.',
          'Swaddles and sleep sacks are worn by the baby, not placed in the crib. They are safe. A pacifier is safe in the crib. A monitor camera mounted to the crib or aimed at the crib from outside it is safe. Everything else should earn a very good reason before it enters the sleep zone.',
          'Newton Baby mattresses and similar breathable mattresses offer an additional safety layer through the mattress core — the breathable construction allows airflow even if a baby\'s face is pressed against the surface. This is worth the premium for families who want that additional layer.',
        ],
      },
      {
        title: 'Sound machine — placement and calibration',
        imageSrc: NURSERY_ACADEMY_IMAGES.hatchSoundMachine,
        imageAlt: 'Sound machine positioned at a safe distance from the crib for consistent white noise support.',
        paragraphs: [
          'A sound machine in the nursery serves two jobs: masking environmental noise that would otherwise disrupt sleep, and providing a consistent audio cue that signals the sleep environment.',
          'Placement matters more than most parents realize. The AAP recommends keeping the sound machine at least seven feet from the crib and at a volume below 50 decibels — roughly the level of a quiet conversation. A sound machine placed directly in or next to the crib at high volume creates hearing risk over extended nightly use.',
          'Seven feet is the recommended minimum. The practical placement is across the room from the crib, near the door if possible, which also helps mask hallway and household noise coming from outside the room.',
          'White noise is the most broadly effective sound for infant sleep. Pink noise and brown noise also work and are preferred by some families. The specific color of noise matters less than consistency — using the same sound machine and the same setting creates an environmental cue the baby learns to associate with sleep.',
          'Smart sound machines (Hatch Rest, for example) add light and app control, which is useful for nighttime care without waking the baby. The app control means you can turn it on before entering the room, adjust the light without a switch, and change the volume without physically approaching the machine.',
        ],
      },
      {
        title: 'Light control — daytime visibility and nighttime care',
        imageSrc: NURSERY_ACADEMY_IMAGES.nurseryAtNight,
        imageAlt: 'Nursery nighttime lighting setup showing warm, low ambient light for overnight care.',
        paragraphs: [
          'The nursery has two light modes that require different setups: daytime visibility (bright enough for clear task work at the changing surface) and nighttime care (dim enough not to fully wake the baby during a feeding or diaper change).',
          'Overhead lighting handles daytime visibility but almost always fails the nighttime care requirement. An overhead light turned on at full brightness at 3 AM will register with the baby as "daytime." This is a problem.',
          'The practical solution is overhead lighting on a dimmer switch, combined with a nightlight or small lamp near the feeding chair. The dimmer handles the daytime-to-nighttime transition. The nightlight handles the deepest overnight care moments when even a dimmed overhead is too much.',
          'Blackout curtains are the third element. Morning light entering a nursery without light control is one of the most common early-wake triggers. Confirm that the blackout coverage extends past the edges of the window on all sides — morning light creeping in at the edges has the same effect as no blackout coverage.',
          'The dual-light setup (overhead dimmer plus low nightlight) is sufficient for most families. Smart bulbs that allow color temperature adjustment add the option to shift from daylight spectrum during the day to warm amber at night, which some families find additionally useful for signaling the sleep environment.',
        ],
      },
      {
        title: 'Monitor types — what each actually monitors',
        imageSrc: NURSERY_ACADEMY_IMAGES.nanit,
        imageAlt: 'Baby monitor positioned above the crib providing visual monitoring of the sleep zone.',
        paragraphs: [
          'Baby monitors fall into three categories, and understanding what each category actually measures prevents buying the wrong layer for your concern.',
          'Audio monitors transmit sound. They tell you when the baby is crying. That is the complete monitoring function. They are reliable, simple, and appropriate when visual monitoring is not a priority — typically in very small homes where the caregiver is always within earshot anyway.',
          'Video monitors add a live visual feed of the sleep zone. They tell you when the baby is crying and allow you to observe the baby\'s position, movement, and general state without entering the room. This is the most broadly useful category for families who want to check in visually before deciding whether to respond.',
          'Vital sign monitors — Owlet sock, Nanit breathing band, Miku — add physiological tracking: heart rate, oxygen saturation, breathing motion. They do not replace the visual feed. They add a layer of data that some families find reassuring and others find anxiety-inducing.',
          'The honest assessment: vital sign monitors are appropriate for families with specific clinical concerns (premature birth, known cardiac or respiratory history, or significant parental anxiety that a visual feed does not resolve). For typical full-term healthy infants, a video monitor is sufficient and the AAP does not currently recommend pulse oximetry monitors for home use with healthy babies.',
          'If you are considering a vital sign monitor, be honest about whether the added data will reduce your anxiety or amplify it. For some parents, it is enormously reassuring. For others, every minor fluctuation in the data triggers concern. Know which type you are before you buy.',
        ],
      },
    ],
    decisionBullets: [
      'The crib holds a firm, flat mattress and a fitted sheet. That is the complete list. Remove everything else.',
      'Position the sound machine at least seven feet from the crib, near the door, at or below conversation volume.',
      'Set up two light modes: overhead on a dimmer for daytime visibility and changing, low warm nightlight near the feeding chair for overnight care.',
      'Install blackout curtains and confirm they cover the full window edge-to-edge — morning light leaking around the edges defeats the purpose.',
      'Choose a monitor tier based on what you actually need: audio for simple alert coverage, video for visual check-in, vital signs for families with specific clinical or anxiety concerns.',
    ],
    products: [
      {
        name: 'Newton Essential Breathable Crib Mattress',
        description: 'A breathable-core crib mattress that provides safe sleep compliance plus an additional airflow layer for families who want that extra safety margin.',
        pros: ['Fully breathable core meets AAP safe sleep standards', 'Machine washable cover for the inevitable incidents'],
      },
      {
        name: 'Hatch Rest Sound Machine and Nightlight',
        description: 'The dual-function tool that covers both the sound environment and nighttime care lighting — app-controlled so you never need to touch it mid-night.',
        pros: ['Sound machine plus nightlight in one footprint', 'App control means no light switches or button-pressing at 2 AM'],
      },
      {
        name: 'Nanit Pro Baby Monitor',
        description: 'An overhead video monitor that provides a clear view of the full crib without requiring a repositionable stand — what you see is reliably the full sleep zone.',
        pros: ['Overhead mount gives a stable, unobstructed view of the crib', 'Optional breathing motion monitoring for families who want that layer'],
      },
    ],
    softCtaLabel: 'You\'ve Finished the Nursery Path',
    softCtaTitle: 'The nursery is done when it passes the functional tests.',
    softCtaBody: [
      'Crib clear. Path to the crib clear. Supplies within arm reach. Light controllable at 2 AM. Sound consistent. Monitor placed correctly.',
      'That is a functional nursery. The rest is finishing touches on a room that already works.',
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
