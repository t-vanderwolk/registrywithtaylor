import {
  FEEDING_SETUP_FLOW_ACADEMY_DESCRIPTION,
  FEEDING_SETUP_FLOW_ACADEMY_IMAGE_ALT,
  FEEDING_SETUP_FLOW_ACADEMY_IMAGE_PATH,
  FEEDING_SETUP_FLOW_ACADEMY_SUBHEAD,
  FEEDING_SETUP_FLOW_ACADEMY_TITLE,
  FEEDING_SETUP_FLOW_CORE_SECTIONS,
  FEEDING_SETUP_FLOW_DECISION_BULLETS,
  FEEDING_SETUP_FLOW_MODULE_INTRO,
  FEEDING_SETUP_FLOW_SOFT_CTA_BODY,
  FEEDING_SETUP_FLOW_SOFT_CTA_LABEL,
  FEEDING_SETUP_FLOW_SOFT_CTA_TITLE,
  buildFeedingSetupFlowMarkdownContent,
} from '@/lib/academy/feedingSetupFlowAcademy';

export type GearAcademyModuleSlug =
  | 'how-to-think-about-baby-gear'
  | 'stroller-foundations'
  | 'car-seat-foundations'
  | 'travel-systems'
  | 'travel-with-baby'
  | 'daily-use-gear'
  | 'feeding-setup-flow'
  | 'breast-pump'
  | 'bottles-and-baby-utensils';

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

type GearAcademyModuleInputWithMarkdown = GearAcademyModuleInput & {
  customMarkdownContent?: string;
};

const TOTAL_MODULES = 9;
const GEAR_ACADEMY_IMAGES = {
  carrierLifestyle: '/assets/gearpath/carrierergobaby.png',
  colugoStroller: '/assets/gearpath/cogulo.png',
  formulaNara: '/assets/breastfeeding/formulanara.png',
  lifestyleInBraPump: '/assets/breastfeeding/lifestyleinbrapump.png',
  lifestylePump: '/assets/breastfeeding/lifestylepump.png',
  medelaInBra: '/assets/breastfeeding/medelainbra.png',
  medelaPump: '/assets/breastfeeding/medelapump.png',
  momcozyAir1: '/assets/breastfeeding/momcozyair1.png',
  momcozyHighChair: '/assets/gearpath/momcozyhighchair.png',
  momcozyHospitalGrade: '/assets/breastfeeding/momcozyhospitalgrade.png',
  momcozyMobileFlow: '/assets/breastfeeding/momcozymobileflow.png',
  momcozyPureHug: '/assets/gearpath/momcozypurehug.png',
  munchkinPump: '/assets/gearpath/munchkinpump.png',
  omniCarrier: '/assets/gearpath/omni.png',
  pumpLifestyle: '/assets/breastfeeding/pumplifestyle.png',
  storageBags: '/assets/breastfeeding/storagebags.png',
  storageBagsMedela: '/assets/breastfeeding/storagebagsmedela.png',
  storageBottles: '/assets/breastfeeding/storagebottttles.png',
  carSeatCarrier: '/assets/car-seats/piparx.png',
  carSeatBase: '/assets/car-seats/piparxbase.png',
  compactStroller: '/assets/strollers/compact.png',
  mixxNext: '/assets/strollers/mixxnext.png',
  travelPacked: '/assets/strollers/travel.png',
  bottleSystem: '/assets/breastfeeding/storagebottttles.png',
  gearOverview: '/assets/editorial/gear.jpg',
  strollerComparison: '/assets/editorial/strollers.png',
  strollerEveryday: '/assets/editorial/editorialstroller.png',
  strollerFold: '/assets/editorial/stroller-folds.jpg',
  strollerFullSize: '/assets/editorial/fullsize.png',
  strollerCompact: '/assets/editorial/compact.png',
  planningNotes: '/assets/editorial/clipboard.png',
  organization: '/assets/editorial/organize.png',
  fitBlueprint: '/assets/editorial/ipadblueprint.png',
  infantStage: '/assets/editorial/welcome.png',
} as const;

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

const GEAR_ACADEMY_MODULE_INPUTS: GearAcademyModuleInputWithMarkdown[] = [
  {
    title: 'How to Think About Baby Gear',
    slug: 'how-to-think-about-baby-gear',
    moduleOrder: 1,
    description: 'Understand how to choose baby gear based on your life, your routine, and real fit before the features start talking too loudly.',
    subhead: 'Before you choose anything, understand how to choose.',
    imagePath: GEAR_ACADEMY_IMAGES.carrierLifestyle,
    imageAlt: 'Lifestyle image of a parent using a baby carrier in real life.',
    intro: [
      'Most parents start baby prep by asking what they should buy.',
      'The better question is what their life actually needs.',
      'Because baby gear is not really about features. It is about fit.',
      'And once you understand that, everything becomes simpler.',
    ],
    coreSections: [
      {
        title: 'Lifestyle first, products second',
        imageSrc: GEAR_ACADEMY_IMAGES.carrierLifestyle,
        imageAlt: 'Parent using everyday baby gear in a calm home setting.',
        paragraphs: [
          'Your daily life determines your gear, not trends, popularity, or reviews.',
          'Think about your car, your space, your routine, and how often you actually leave the house.',
          'Those answers usually matter more than the brand names do.',
        ],
      },
      {
        title: 'Where most people go wrong',
        imageSrc: GEAR_ACADEMY_IMAGES.gearOverview,
        imageAlt: 'Edited baby gear setup that keeps the category grounded in real use.',
        paragraphs: [
          'Most parents buy too early, buy too much, or let trends do too much of the thinking.',
          'That usually creates clutter, regret, and a setup that feels busier than it needs to be.',
          'The calmer move is to understand the job before you start collecting products for it.',
        ],
      },
      {
        title: 'Simplicity wins long-term',
        imageSrc: GEAR_ACADEMY_IMAGES.omniCarrier,
        imageAlt: 'Simple everyday baby carrier setup in a neutral environment.',
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
    imagePath: GEAR_ACADEMY_IMAGES.colugoStroller,
    imageAlt: 'Colugo stroller image for the Stroller Foundations module.',
    intro: [
      'The biggest mistake parents make is choosing a stroller before understanding how they will use it.',
      'There is no best stroller.',
      'There is only the one that fits your day.',
      'And for most families, the compact-versus-full-size decision is the point where the shortlist finally gets smaller in a useful way.',
    ],
    coreSections: [
      {
        title: 'Full-size vs compact vs travel',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerComparison,
        imageAlt: 'Stroller comparison image showing different use cases.',
        paragraphs: [
          'Full-size strollers are usually about everyday comfort.',
          'Compact strollers balance size and usability. Travel strollers lean into portability.',
          'Each one serves a different purpose, which is why the category decision matters first.',
        ],
      },
      {
        title: 'Where you will use it most',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerEveryday,
        imageAlt: 'Stroller in an everyday walking environment.',
        paragraphs: [
          'Think about sidewalks, stores, travel days, and the errands you actually repeat.',
          'Your environment affects what feels smooth, what feels annoying, and what quietly becomes too much stroller.',
          'That is why the route matters more than the feature grid.',
        ],
      },
      {
        title: 'Storage and transport',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerFold,
        imageAlt: 'Stroller folded for trunk storage.',
        paragraphs: [
          'Can it fit in your car easily, and can you lift it without resenting it by week two?',
          'Those questions sound unglamorous because they are. They are also daily questions.',
          'If the fold or the trunk reality is annoying now, it rarely gets more charming later.',
        ],
      },
      {
        title: 'Everyday life vs occasional use',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerFullSize,
        imageAlt: 'Full-size stroller shown as an everyday-use option.',
        paragraphs: [
          'Full-size strollers usually make the most sense when the stroller has a real everyday job.',
          'Compact strollers make more sense when flexibility, smaller size, and easier loading matter more.',
          'How often you use it should shape the answer more than the idea of owning the bigger option.',
        ],
      },
      {
        title: 'Trade-offs that actually matter',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerCompact,
        imageAlt: 'Compact stroller shown as a portability-first option.',
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
    imagePath: GEAR_ACADEMY_IMAGES.carSeatCarrier,
    imageAlt: 'Infant car seat image for the Car Seat Foundations module.',
    intro: [
      'Car seats are one of the most important decisions you will make.',
      'Most confusion starts when people do not understand the categories first.',
      'Once the categories are clearer, the decision usually gets smaller and easier to manage.',
    ],
    coreSections: [
      {
        title: 'Infant vs convertible',
        imageSrc: GEAR_ACADEMY_IMAGES.carSeatCarrier,
        imageAlt: 'Infant car seat example for category comparison.',
        paragraphs: [
          'Infant seats are about portability and removability. Convertible seats are about longer-term use.',
          'Neither one wins in every situation because each comes with different trade-offs.',
          'The right choice depends on which version of convenience your day will actually use.',
        ],
      },
      {
        title: 'Your car matters',
        imageSrc: GEAR_ACADEMY_IMAGES.fitBlueprint,
        imageAlt: 'Car seat fit and installation planning image.',
        paragraphs: [
          'Not all seats fit all cars equally well, and that matters more than many first-time parents expect.',
          'Space, angle, front-seat room, and vehicle layout all affect what feels workable.',
          'A seat that fits beautifully in theory can still be annoying in your actual car.',
        ],
      },
      {
        title: 'Ease of use',
        imageSrc: GEAR_ACADEMY_IMAGES.carSeatBase,
        imageAlt: 'Infant car seat base setup showing daily ease of use.',
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
    imagePath: GEAR_ACADEMY_IMAGES.mixxNext,
    imageAlt: 'Travel-system stroller image for the Travel Systems module.',
    intro: [
      'This is where a lot of parents get stuck because compatibility is not always obvious.',
      'The good news is that it gets much simpler once you understand how the connections work.',
      'The goal is not to make the setup impressive. It is to make it easy enough to use.',
    ],
    coreSections: [
      {
        title: 'Direct vs adapter systems',
        imageSrc: GEAR_ACADEMY_IMAGES.mixxNext,
        imageAlt: 'Travel-system stroller showing a coordinated setup.',
        paragraphs: [
          'Some systems connect directly. Others need adapters to make the stroller and car seat work together.',
          'Direct systems are usually simpler. Adapter setups offer more flexibility.',
          'Neither is automatically better. It depends on how much mixing and matching you actually need.',
        ],
      },
      {
        title: 'When it matters',
        imageSrc: GEAR_ACADEMY_IMAGES.carSeatCarrier,
        imageAlt: 'Infant car seat moving through a travel-system routine.',
        paragraphs: [
          'Travel systems matter most in the early months when the click-in convenience gets used regularly.',
          'If those quick transitions are a big part of your routine, this decision deserves more attention.',
          'If not, you do not need to build the whole stroller plan around a convenience window that will be relatively short.',
        ],
      },
      {
        title: 'Simplicity vs flexibility',
        imageSrc: GEAR_ACADEMY_IMAGES.compactStroller,
        imageAlt: 'Compact stroller image representing flexible travel-system planning.',
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
    nextModuleSlug: 'travel-with-baby',
    previousModuleSlug: 'car-seat-foundations',
  },
  {
    title: 'Travel With Baby',
    slug: 'travel-with-baby',
    moduleOrder: 5,
    description:
      'Plan for errands, road trips, flights, and everyday outings by focusing on portability, transitions, and what leaving the house actually asks your setup to do.',
    subhead: 'Leaving the house is its own gear category.',
    imagePath: GEAR_ACADEMY_IMAGES.colugoStroller,
    imageAlt: 'Colugo stroller image for the Travel With Baby module.',
    intro: [
      'Travel with a baby sounds like one category. It is actually several versions of the same question.',
      'What needs to come with you, what can stay home, and which pieces make movement easier instead of more theatrical?',
      'A grocery run, a weekend road trip, and an airport day are not asking the same thing from your gear.',
      'This module is about building the portable version of your routine without packing for every possible emergency at once.',
    ],
    coreSections: [
      {
        title: 'Errands, trips, and flights need different setups',
        imageSrc: '/assets/strollers/travel.png',
        imageAlt: 'Packed diaper bag and travel gear arranged for different outing lengths.',
        paragraphs: [
          'Most travel stress starts when one setup is expected to solve every kind of outing.',
          'Short local trips usually need a tight edit. Longer days need more feeding, sleep, and backup planning.',
          'When you separate those lanes, the packing list usually gets smaller and much more usable.',
        ],
      },
      {
        title: 'Portability changes what earns a spot',
        imageSrc: GEAR_ACADEMY_IMAGES.colugoStroller,
        imageAlt: 'Compact stroller staged for portability and trunk space.',
        paragraphs: [
          'At home, bulk can feel manageable. In a trunk, overhead bin, or restaurant entryway, it becomes very persuasive very quickly.',
          'Weight, fold, wipeability, and how fast something deploys matter more once you are moving with it.',
          'Travel gear does not need to be impressive. It needs to be cooperative.',
        ],
      },
      {
        title: 'Build around the hardest transition',
        imageSrc: GEAR_ACADEMY_IMAGES.carrierLifestyle,
        imageAlt: 'Parent moving through a baby-gear transition with carrier support.',
        paragraphs: [
          'Think about the most annoying repeat move in your week: stairs, parking lots, airport security, nap transfers, or feeding away from home.',
          'That one friction point should shape the setup more than the longest feature list on the product page.',
          'The calmest travel gear usually solves the hardest transition first and lets the rest stay simpler.',
        ],
      },
      {
        title: 'Travel gear should reduce duplicate jobs',
        imageSrc: '/assets/editorial/organize.png',
        imageAlt: 'Minimal travel kit showing multi-use baby gear and fewer duplicates.',
        paragraphs: [
          'Travel categories get expensive fast when every problem gets a dedicated item.',
          'A tighter setup leans on multi-use pieces, clear packing zones, and one or two truly portable wins.',
          'If two products are solving the same job, the lighter, easier-to-pack answer usually deserves first dibs.',
        ],
      },
    ],
    decisionBullets: [
      'Match the setup to the outing, not to the most dramatic travel scenario.',
      'Let portability, cleanup, and speed matter more once the gear leaves the house.',
      'Solve the hardest transition first.',
      'Favor multi-use pieces over duplicate jobs.',
      'Travel goes better when the kit is edited before it is packed.',
    ],
    products: [
      {
        name: 'Travel Stroller',
        description: 'A portability-first option when lighter weight, smaller fold, and faster loading matter more than maximum comfort.',
        pros: ['Helpful for flights and tighter trunks', 'Useful when carry weight matters'],
      },
      {
        name: 'Structured Carrier',
        description: 'A practical movement tool when hands-free portability solves more friction than wheels do.',
        pros: ['Useful for stairs and crowded spaces', 'Helpful for faster transitions'],
      },
      {
        name: 'Edited Diaper Bag Setup',
        description: 'A bag strategy built around the real outing length so essentials stay easy to reach instead of getting buried under just-in-case clutter.',
        pros: ['Supports faster packing', 'Keeps travel setups easier to maintain'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'Travel gear works best when it travels lightly.',
    softCtaBody: [
      'The setup does not need to cover every hypothetical moment. It needs to make the repeated ones less annoying.',
    ],
    nextModuleSlug: 'daily-use-gear',
    previousModuleSlug: 'travel-systems',
  },
  {
    title: 'Daily Use Gear',
    slug: 'daily-use-gear',
    moduleOrder: 6,
    description: "The products you'll use every single day - and feel immediately if they're wrong.",
    subhead: 'The products that shape the routine fast.',
    imagePath: GEAR_ACADEMY_IMAGES.momcozyPureHug,
    imageAlt: 'Daily-use baby carrier image for the Daily Use Gear module.',
    intro: [
      'Not all gear matters equally.',
      'Some items become part of your daily rhythm. Others mostly sit there looking hopeful.',
      'This is where you focus on what actually earns a place in everyday life.',
    ],
    coreSections: [
      {
        title: 'High-frequency items',
        imageSrc: GEAR_ACADEMY_IMAGES.momcozyPureHug,
        imageAlt: 'Soft baby carrier shown as a high-frequency daily-use item.',
        paragraphs: [
          'Think about the categories that truly get used often, like carriers, feeding setups, and daily seating support.',
          'These are the items that shape the rhythm of ordinary days, not just the nursery shelf.',
          'If something gets touched constantly, it deserves more thought than the gear that only sounds useful online.',
        ],
      },
      {
        title: 'Avoiding overbuying',
        imageSrc: GEAR_ACADEMY_IMAGES.momcozyHighChair,
        imageAlt: 'High chair shown as one strong daily-use choice instead of duplicates.',
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
        name: 'Soft Carrier',
        description: 'A lower-bulk daily-use option when closeness, flexibility, and quick on-off support matter more than maximum structure.',
        pros: ['Helpful for shorter repeated stretches', 'Useful when softness and lighter weight matter'],
      },
      {
        name: 'High Chair',
        description: 'A meaningful daily-use item once feeding rhythm becomes a repeated part of the day.',
        pros: ['Supports repeated feeding routines', 'Worth prioritizing when used often'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where everything becomes real.',
    softCtaBody: ['And it is usually where personalized guidance makes the biggest difference.'],
    nextModuleSlug: 'feeding-setup-flow',
    previousModuleSlug: 'travel-with-baby',
  },
  {
    title: FEEDING_SETUP_FLOW_ACADEMY_TITLE,
    slug: 'feeding-setup-flow',
    moduleOrder: 7,
    description: FEEDING_SETUP_FLOW_ACADEMY_DESCRIPTION,
    subhead: FEEDING_SETUP_FLOW_ACADEMY_SUBHEAD,
    imagePath: FEEDING_SETUP_FLOW_ACADEMY_IMAGE_PATH,
    imageAlt: FEEDING_SETUP_FLOW_ACADEMY_IMAGE_ALT,
    intro: [...FEEDING_SETUP_FLOW_MODULE_INTRO],
    coreSections: FEEDING_SETUP_FLOW_CORE_SECTIONS.map((section) => ({
      ...section,
      paragraphs: [...section.paragraphs],
    })),
    decisionBullets: [...FEEDING_SETUP_FLOW_DECISION_BULLETS],
    products: [],
    softCtaLabel: FEEDING_SETUP_FLOW_SOFT_CTA_LABEL,
    softCtaTitle: FEEDING_SETUP_FLOW_SOFT_CTA_TITLE,
    softCtaBody: [...FEEDING_SETUP_FLOW_SOFT_CTA_BODY],
    nextModuleSlug: 'breast-pump',
    previousModuleSlug: 'daily-use-gear',
    customMarkdownContent: buildFeedingSetupFlowMarkdownContent(),
  },
  {
    title: 'Breast Pump',
    slug: 'breast-pump',
    moduleOrder: 8,
    description:
      'Decide if and when a pump belongs in your setup, which type matches your likely routine, and which accessories are practical instead of aspirational.',
    subhead: 'A pump is a tool, not a personality.',
    imagePath: GEAR_ACADEMY_IMAGES.lifestylePump,
    imageAlt: 'Lifestyle pumping image for the Breast Pump module.',
    intro: [
      'Breast pumps get marketed like one purchase is about to solve your entire feeding future.',
      'In real life, the right pump depends on how often you expect to use it, where you will use it, and whether it is supporting daily feeding or occasional flexibility.',
      'Some families need one early. Some need one later. Some barely use one at all.',
      'This module is the gear side of the decision: the pump, the setup, and the routine that has to work around real life.',
    ],
    coreSections: [
      {
        title: 'What the product is',
        imageSrc: GEAR_ACADEMY_IMAGES.medelaPump,
        imageAlt: 'Breast pump shown as a feeding tool, not a lifestyle identity.',
        paragraphs: [
          'A breast pump is a feeding tool for expressing milk when direct nursing is not the only way the routine is working.',
          'Manual pumps, wearables, and double electric pumps are not interchangeable personalities. They answer different levels of frequency, efficiency, and movement.',
          'The cleaner question is not which pump is most impressive. It is which kind of pump fits the rhythm you actually expect to maintain.',
        ],
      },
      {
        title: 'What the purpose of the product is',
        imageSrc: GEAR_ACADEMY_IMAGES.pumpLifestyle,
        imageAlt: 'Pumping routine shown in a real-life home setting.',
        paragraphs: [
          'The purpose of a pump is to support the feeding system when milk expression needs to happen outside of direct nursing.',
          'That might mean supporting work separation, occasional bottles, supply maintenance, shared feeding, or a more pump-heavy routine at home.',
          'A good pump setup should reduce friction around time, milk collection, and repeated use. If it adds more logistics than it solves, the setup is wrong for the job.',
        ],
      },
      {
        title: 'Reasons a person needs it',
        imageSrc: GEAR_ACADEMY_IMAGES.storageBagsMedela,
        imageAlt: 'Milk storage bags and pumping accessories shown as part of a repeated pumping workflow.',
        paragraphs: [
          'You plan to pump regularly enough that time efficiency, storage, and cleanup will matter almost immediately.',
          'You expect separation from baby because of work, appointments, sleep shifts, or the need for more feeding flexibility.',
          'You want a repeatable system for expressed milk, not just a hopeful backup gadget living in a drawer.',
        ],
      },
      {
        title: 'Reasons a person would skip it',
        imageSrc: GEAR_ACADEMY_IMAGES.momcozyMobileFlow,
        imageAlt: 'Wearable pump shown in a work-and-home routine context where convenience may or may not justify the purchase.',
        paragraphs: [
          'Direct nursing may cover the real plan well enough that a pump does not need day-one urgency.',
          'The routine is still too hypothetical to know whether you need a manual backup, a daily driver, or anything at all yet.',
          'You are being tempted into buying a whole accessory ecosystem before the primary pumping rhythm even exists.',
        ],
      },
    ],
    decisionBullets: [
      'Choose the pump based on the routine it is supporting.',
      'If pumping is likely to be regular, efficiency matters fast.',
      'Start with the accessories that reduce real friction.',
      'Do not buy a backup ecosystem before you have a primary rhythm.',
      'A workable location plan matters as much as the pump itself.',
    ],
    products: [
      {
        name: 'Double Electric Pump',
        description: 'A practical fit when pumping is likely to happen regularly and time efficiency matters.',
        pros: ['Useful for repeated pumping', 'Supports a stronger work or separation routine'],
      },
      {
        name: 'Wearable Pump',
        description: 'A flexibility-first option when mobility matters, as long as the routine and budget justify it.',
        pros: ['Helpful for movement', 'Useful when convenience is worth the tradeoffs'],
      },
      {
        name: 'Milk Storage Bags',
        description: 'A practical support tool when pumping becomes part of the routine and you need a simple way to store and hand off milk.',
        pros: ['Supports a cleaner storage workflow', 'Worth adding once expressed milk is part of the system'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'You do not need to buy every pumping accessory in one sitting.',
    softCtaBody: [
      'A strong starting setup plus a workable cleaning and storage plan will usually tell you what deserves to come next.',
    ],
    nextModuleSlug: 'bottles-and-baby-utensils',
    previousModuleSlug: 'feeding-setup-flow',
  },
  {
    title: 'Bottles & Baby Utensils',
    slug: 'bottles-and-baby-utensils',
    moduleOrder: 9,
    description:
      'Build a calm bottle starting point, understand nipple flow and cleanup, and avoid buying a whole feeding drawer before your baby has an opinion.',
    subhead: 'Bottles become a system faster than most parents expect.',
    imagePath: GEAR_ACADEMY_IMAGES.bottleSystem,
    imageAlt: 'Bottle starter setup image for the Bottles & Baby Utensils module.',
    intro: [
      'Bottles seem like a small purchase until they quietly become a full countertop workflow.',
      'The bottle itself matters, but so do nipple flow, cleaning, storage, and how many you actually need before the routine is real.',
      'And despite the very confident packaging, babies do occasionally have their own opinions about the setup.',
      'This module helps you start with enough support to function without building a museum of bottle experiments on day one.',
    ],
    coreSections: [
      {
        title: 'What the product is',
        imageSrc: GEAR_ACADEMY_IMAGES.bottleSystem,
        imageAlt: 'A simple bottle starter set shown as one feeding system rather than a full bottle collection.',
        paragraphs: [
          'A bottle setup is not just the bottle. It is the nipples, the flows, the cleanup, the storage, and how the whole thing behaves once feeds repeat.',
          'A few bottles from one system is usually enough to learn something useful. A full shelf of contenders is usually just a louder way to be unsure.',
          'Utensils live in the same broader feeding category, but many of them belong to the later solids chapter rather than the newborn cart.',
        ],
      },
      {
        title: 'What the purpose of the product is',
        imageSrc: GEAR_ACADEMY_IMAGES.bottleSystem,
        imageAlt: 'Bottle parts arranged as a starter system that needs to work as a repeated routine.',
        paragraphs: [
          'The purpose of the bottle system is to support feeding in a way that is practical to offer, wash, dry, and repeat.',
          'That system may support expressed milk, formula, shared feeding, or combination feeding. The point is not the brand story. It is the workflow.',
          'A good starting system gives you enough structure to function without locking you into a giant bottle identity before your baby has weighed in.',
        ],
      },
      {
        title: 'Reasons a person needs it',
        imageSrc: GEAR_ACADEMY_IMAGES.storageBags,
        imageAlt: 'Feeding support tools shown as part of a bottle routine that becomes real quickly.',
        paragraphs: [
          'Bottles will be part of your feeding path, whether that is occasional, daily, or combination feeding.',
          'Shared feeding, expressed milk, or formula are already likely enough that having a clean starting system would lower friction fast.',
          'You want the cleanup routine to stay manageable instead of letting the counter turn into a bottle parts negotiation.',
        ],
      },
      {
        title: 'Reasons a person would skip it',
        imageSrc: GEAR_ACADEMY_IMAGES.momcozyHighChair,
        imageAlt: 'High chair shown as a reminder that many feeding utensils belong to a later stage.',
        paragraphs: [
          'You are still unsure whether bottles will be part of the routine often enough to justify building the whole system right now.',
          'The baby has not shown you what works yet, which means bulk buying is more likely to create duplicates than clarity.',
          'Utensils, bowls, and snack gear are still a later chapter, and letting them wait keeps the category much quieter.',
        ],
      },
    ],
    decisionBullets: [
      'Start with a bottle starter setup, not a giant bottle commitment.',
      'Let nipple flow and baby response guide the next purchase.',
      'Choose the system your cleanup routine can maintain.',
      'Keep accessory creep on a short leash.',
      'Many feeding utensils belong in the later chapter, not the day-one cart.',
    ],
    products: [
      {
        name: 'Bottle Starter Set',
        description: 'A smaller set that gives you a real starting point without locking you into a full-system purchase too early.',
        pros: ['Helps test fit before expanding', 'Keeps overbuying down'],
      },
      {
        name: 'Drying Rack and Brush Setup',
        description: 'A simple cleanup pair that supports the bottle routine more than a larger pile of single-use accessories.',
        pros: ['Makes cleanup easier to repeat', 'Supports a cleaner counter workflow'],
      },
      {
        name: 'Later-Stage Feeding Utensils',
        description: 'A note-for-later category that usually earns space once solids and actual mealtime rhythm are closer.',
        pros: ['Better bought with timing', 'Less likely to become premature clutter'],
      },
    ],
    softCtaLabel: 'Final Thoughts',
    softCtaTitle: 'The best bottle setup usually starts smaller than people expect.',
    softCtaBody: [
      'A clear starter system plus room to adjust will almost always age better than a large early purchase made in the dark.',
    ],
    nextModuleSlug: null,
    previousModuleSlug: 'breast-pump',
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
    `## Module ${module.moduleOrder} of ${module.totalModules} · Gear`,
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

  if (module.products.length > 0) {
    lines.push('', '## Examples That Support This Setup', '');
    module.products.forEach((product) => {
      lines.push(renderProductMarkdown(product), '');
    });
  }

  if (module.softCtaLabel && module.softCtaTitle) {
    lines.push('', `## ${module.softCtaLabel}`, '', module.softCtaTitle, '');
    (module.softCtaBody ?? []).forEach((paragraph) => {
      lines.push(paragraph, '');
    });
  }

  lines.push('', '## Next Steps', '');
  if (module.nextModuleSlug) {
    lines.push(`- Continue to ${getModuleTitle(module.nextModuleSlug)}`);
  } else {
    lines.push('- Continue to Postpartum Path');
  }

  if (module.previousModuleSlug) {
    lines.push(`- Back to ${getModuleTitle(module.previousModuleSlug)}`);
  } else {
    lines.push('- Back to Gear Path');
  }

  return lines.join('\n').trim();
}

function createGearModule(module: GearAcademyModuleInputWithMarkdown): GearAcademyModuleRecord {
  const { customMarkdownContent, ...moduleData } = module;
  const record: Omit<GearAcademyModuleRecord, 'markdownContent'> = {
    ...moduleData,
    path: 'gear',
    totalModules: TOTAL_MODULES,
  };

  return {
    ...record,
    markdownContent: customMarkdownContent?.trim() || renderMarkdownContent(record),
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
