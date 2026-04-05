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

const GEAR_ACADEMY_MODULE_INPUTS: GearAcademyModuleInputWithMarkdown[] = [
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
    imagePath: '/assets/editorial/stroller-folds.jpg',
    imageAlt: 'Editorial travel with baby image for the Travel With Baby module.',
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
        imageSrc: '/assets/editorial/stroller-folds.jpg',
        imageAlt: 'Compact baby gear staged for portability and trunk space.',
        paragraphs: [
          'At home, bulk can feel manageable. In a trunk, overhead bin, or restaurant entryway, it becomes very persuasive very quickly.',
          'Weight, fold, wipeability, and how fast something deploys matter more once you are moving with it.',
          'Travel gear does not need to be impressive. It needs to be cooperative.',
        ],
      },
      {
        title: 'Build around the hardest transition',
        imageSrc: '/assets/editorial/editorialstroller.png',
        imageAlt: 'Parent transitioning between car, stroller, and carrier with baby gear.',
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
    imagePath: '/assets/editorial/feeding.png',
    imageAlt: 'Editorial breast pump planning image for the Breast Pump module.',
    intro: [
      'Breast pumps get marketed like one purchase is about to solve your entire feeding future.',
      'In real life, the right pump depends on how often you expect to use it, where you will use it, and whether it is supporting daily feeding or occasional flexibility.',
      'Some families need one early. Some need one later. Some barely use one at all.',
      'This module is here to make that decision feel more practical and much less identity-based.',
    ],
    coreSections: [
      {
        title: 'Start with the job, not the pump category',
        imageSrc: '/assets/editorial/clipboard.png',
        imageAlt: 'Breast pump parts and notes arranged around a practical feeding plan.',
        paragraphs: [
          'Ask what the pump is for before you compare features.',
          'Is it supporting a return to work, occasional bottles, supply maintenance while away, or a more pump-heavy routine at home?',
          'Once the job is clearer, the pump type usually gets easier to narrow.',
        ],
      },
      {
        title: 'Manual, wearable, and double electric answer different routines',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Different pump styles arranged to compare routine fit.',
        paragraphs: [
          'Manual pumps can be useful for occasional relief or backup. Wearables can help with mobility. Double electric pumps often make the most sense when pumping is repeated and time matters.',
          'The best option is not the fanciest one. It is the one your real schedule can maintain.',
          'If this is likely to become a regular routine, efficiency matters more than novelty very quickly.',
        ],
      },
      {
        title: 'Accessories can help, but they multiply fast',
        imageSrc: '/assets/editorial/organize.png',
        imageAlt: 'Breast pump accessories organized into essentials and extras.',
        paragraphs: [
          'A few support pieces can make pumping much easier: a pump bra, storage containers, a parts-drying plan, and a practical place to clean everything.',
          'Extra flanges, extra bottles, extra cords, and extra backup kits have a way of appearing before the routine exists to justify them.',
          'Start with the support pieces that reduce actual friction, then add duplicates only if repeated use proves the case.',
        ],
      },
      {
        title: 'Think through location before you buy for convenience',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Work and home pumping setup comparison.',
        paragraphs: [
          'A home-only setup has different needs than a work bag, commute, or travel setup.',
          'Where you will pump, where parts will dry, and how milk gets stored will matter just as much as the motor specs.',
          'A cleaner logistics plan usually beats a more expensive pump with no place to live.',
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
        name: 'Manual Pump',
        description: 'A simpler option for occasional use, relief, or backup support when daily pumping is not the goal.',
        pros: ['Lower-commitment tool', 'Useful as a backup or occasional helper'],
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
    imagePath: '/assets/editorial/bottle-booties.png',
    imageAlt: 'Editorial bottles and baby utensils image for the Bottles & Baby Utensils module.',
    intro: [
      'Bottles seem like a small purchase until they quietly become a full countertop workflow.',
      'The bottle itself matters, but so do nipple flow, cleaning, storage, and how many you actually need before the routine is real.',
      'And despite the very confident packaging, babies do occasionally have their own opinions about the setup.',
      'This module helps you start with enough support to function without building a museum of bottle experiments on day one.',
    ],
    coreSections: [
      {
        title: 'Start with one bottle system',
        imageSrc: '/assets/editorial/bottle-booties.png',
        imageAlt: 'A simple bottle starter set styled for clarity rather than excess.',
        paragraphs: [
          'A few bottles from one system usually gives you enough information to start.',
          'Committing to multiple bottle styles before you have tried anything usually creates clutter, not confidence.',
          'The calmer move is a starter setup, not a full shelf.',
        ],
      },
      {
        title: 'Nipple flow and baby response matter',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Bottle nipples arranged by flow stage in a clean layout.',
        paragraphs: [
          'Bottle acceptance is not just about the bottle shape. Nipple flow, pacing, and how feeds are offered matter too.',
          'This is one reason it helps to buy small at first. Real use gives better information than optimistic bulk ordering.',
          'If adjustments are needed, you want room to adjust without replacing an entire bottle ecosystem.',
        ],
      },
      {
        title: 'Cleanup determines whether the system feels easy',
        imageSrc: '/assets/editorial/organize.png',
        imageAlt: 'Bottle drying rack and brush arranged in a simple cleanup workflow.',
        paragraphs: [
          'A bottle setup is only as nice as it is to wash, dry, and reset while you are tired.',
          'One brush, one drying area, and a practical storage zone usually matter more than extra accessories with very passionate marketing copy.',
          'If the cleanup plan is messy, the whole category gets louder than it needs to be.',
        ],
      },
      {
        title: 'Utensils are often a later chapter',
        imageSrc: PLACEHOLDER_IMAGE,
        imageAlt: 'Minimal feeding utensils staged as a later-stage add-on rather than an early must-buy.',
        paragraphs: [
          'Spoons, bowls, snack containers, and other feeding tools usually make more sense once solids and routine timing are actually on the calendar.',
          'It is fine to note them. It is usually unnecessary to stockpile them now.',
          'The same rule applies: let the chapter arrive before the accessories audition for it.',
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
    lines.push('', '---', '', `## ${module.softCtaLabel}`, '', module.softCtaTitle, '');
    (module.softCtaBody ?? []).forEach((paragraph) => {
      lines.push(paragraph, '');
    });
  }

  lines.push('', '---', '', '## Next Steps', '');
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
