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
  lifestyleTravelStroller: '/assets/gearpath/lifestyletravelstroller.png',
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
    description:
      'Every gear decision in the next nine modules is easier when you have three variables in place before you start comparing products.',
    subhead: 'Three variables. Every gear decision, forever.',
    imagePath: GEAR_ACADEMY_IMAGES.gearOverview,
    imageAlt: 'Editorial gear overview image for the How to Think About Baby Gear module.',
    intro: [
      'The baby gear category is enormous because it is designed to feel that way.',
      'Thousands of products, each one described as essential by someone, each one reviewed enthusiastically by parents for whom it happened to work.',
      'None of that information is wrong. Almost none of it is relevant to your specific life.',
      'The reason most baby gear decisions feel overwhelming is not that the products are complicated. It is that the evaluation framework is missing.',
      'This module introduces three variables that make every gear decision in the Gear Path shorter, calmer, and more accurate.',
      'The variables are: lifestyle compatibility, transition cost, and replacement horizon. Once those are clear, the product comparison is almost always straightforward.',
    ],
    coreSections: [
      {
        title: 'Variable one — lifestyle compatibility',
        imageSrc: GEAR_ACADEMY_IMAGES.carrierLifestyle,
        imageAlt: 'Parent using baby carrier in a real daily lifestyle context.',
        paragraphs: [
          'Lifestyle compatibility is the question of whether a piece of gear fits how you actually live — not how you plan to live once you have a more organized version of parenthood.',
          'It starts with three sub-questions: Where do you live (apartment, house, urban block, suburbs, rural)? What is your car situation? How often do you realistically leave the house, and for what kinds of outings?',
          'A stroller that is perfect for a Brooklyn brownstone with four flights of stairs is a different stroller than the one that works for daily suburban errands with a minivan and a flat parking lot.',
          'Neither parent is wrong. They just have different lifestyle profiles, and the right gear comes from that profile, not from a shared review.',
          'Before comparing any product, map the lifestyle first. The comparison gets much shorter when the irrelevant options reveal themselves early.',
        ],
      },
      {
        title: 'Variable two — transition cost',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerFold,
        imageAlt: 'Stroller fold transition showing daily use friction.',
        paragraphs: [
          'Transition cost is the friction of interacting with a piece of gear in repeated daily use.',
          'How heavy is it to carry? How many steps does it take to fold, unfold, load, and unload? How long does it take to set up at a destination?',
          'Transition cost is invisible when you are reading about a product and brutally obvious by week two.',
          'A stroller that folds in four steps feels fine on a Saturday demo. By Tuesday of week three, when you are doing it one-handed in a parking lot in January, four steps starts to feel like a character test you did not sign up for.',
          'Evaluate transition cost by simulating your real daily move: getting in and out of the car, getting through a door, collapsing and storing the item at the end of the day. The friction that emerges in that simulation is the actual product.',
          'Low-transition-cost gear almost always earns its spot faster. High-transition-cost gear almost always gets used less than expected.',
        ],
      },
      {
        title: 'Variable three — replacement horizon',
        imageSrc: GEAR_ACADEMY_IMAGES.infantStage,
        imageAlt: 'Infant stage product lifecycle showing replacement horizon.',
        paragraphs: [
          'The replacement horizon is how long the job this gear is doing will exist before the baby outgrows it, the need changes, or a different product takes over.',
          'Some gear has a long replacement horizon. A high chair might serve from six months to three years.',
          'Some gear has a short replacement horizon. An infant car seat is typically replaced by a convertible seat somewhere between 12 and 24 months, depending on the baby\'s size.',
          'The replacement horizon matters because it affects how much you should spend, how carefully you should evaluate, and whether borrowing or buying secondhand makes more sense than a full purchase.',
          'A short-horizon item that costs $300 is a different financial decision than a long-horizon item at the same price. That calculation should happen before the purchase, not as regret after.',
          'Map the horizon before the product review. The spending question almost always becomes clearer.',
        ],
      },
      {
        title: 'Why feature lists are the wrong starting point',
        imageSrc: GEAR_ACADEMY_IMAGES.planningNotes,
        imageAlt: 'Planning notes representing a feature-comparison framework that misses the real questions.',
        paragraphs: [
          'Feature lists are designed to create preference, not to help you evaluate fit.',
          'When you read "one-second fold," "self-standing storage," "lie-flat recline," and "UPF 50+ canopy," you are reading a list of attributes that sounds compelling in isolation but tells you nothing about whether those attributes matter in your specific situation.',
          'The one-second fold is valuable if you do a lot of transitions under time pressure. It is irrelevant if the stroller lives in a garage and only comes out on weekend walks.',
          'The lie-flat recline is meaningful if you plan to use the stroller for newborn naps. It is not meaningful if your baby will be five months old before the stroller becomes a regular part of the routine.',
          'Run the three variables first. Then use features to distinguish between the two or three options that already pass the lifestyle, transition, and horizon filters.',
          'That sequence is faster, less stressful, and almost always produces a better decision than starting with the feature grid.',
        ],
      },
    ],
    decisionBullets: [
      'Map lifestyle compatibility before comparing any product — your daily context is the most important variable.',
      'Simulate transition cost in your real environment, not in an imaginary best-case scenario.',
      'Know the replacement horizon before deciding how much to spend or whether to buy new.',
      'Use feature lists only after the three variables have already narrowed the field.',
      'If a gear decision still feels overwhelming after running the variables, the product is not the problem — one of the variables is still unclear.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This framework applies to every module that follows.',
    softCtaBody: [
      'You do not need to re-read it for each category. You just need to ask the same three questions in a new context.',
      'The modules get shorter once the variables become habit.',
    ],
    nextModuleSlug: 'stroller-foundations',
    previousModuleSlug: null,
  },
  {
    title: 'Stroller Foundations',
    slug: 'stroller-foundations',
    moduleOrder: 2,
    description:
      'The stroller lane comes before the stroller model. Choosing the right lane eliminates most of the confusion before a single product comparison begins.',
    subhead: 'Choose your lane, then choose your stroller.',
    imagePath: GEAR_ACADEMY_IMAGES.colugoStroller,
    imageAlt: 'Colugo stroller image for the Stroller Foundations module.',
    intro: [
      'There is no best stroller. There is only the stroller that fits your lane.',
      'The lane is determined by how often you use the stroller, where you use it, how it needs to transport, and how much of your weekly movement it is expected to support.',
      'Most stroller confusion comes from comparing models across lanes. A full-size stroller and a travel stroller are not competing answers to the same question. They are answers to different questions entirely.',
      'Once the lane is clear, the model comparison gets dramatically shorter. You are no longer comparing everything. You are comparing two or three options that already match how your life actually works.',
      'This module is about making the lane decision confidently so the model decision that follows it is actually manageable.',
    ],
    coreSections: [
      {
        title: 'Understanding the three lanes',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerComparison,
        imageAlt: 'Stroller lane comparison showing full-size, compact, and travel options side by side.',
        paragraphs: [
          'Full-size strollers are designed for comfort, storage capacity, and smooth handling over repeated daily use. They tend to have larger wheels, more recline options, larger canopies, and more basket space. They are heavier and fold larger.',
          'Compact strollers balance everyday usability with a more manageable footprint. They are lighter than full-size strollers and fold smaller, but they still handle regular outings and typical storage without significant compromise.',
          'Travel strollers prioritize portability above everything else. They fold very small, weigh under fifteen pounds, and are optimized for overhead bins, small car trunks, and trips where the stroller needs to be carried more often than pushed.',
          'The lanes are not a quality hierarchy. A travel stroller is not a lesser stroller. It is a stroller designed for a specific use case, and it outperforms full-size strollers in that use case while losing to them in others.',
          'The goal is to identify which lane your use case actually belongs in before looking at any specific model.',
          'Most families belong clearly in one lane. Some families genuinely need two strollers for two different jobs. Very few families need three.',
        ],
      },
      {
        title: 'How terrain and use frequency determine the lane',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerEveryday,
        imageAlt: 'Stroller in an everyday urban walking and errand environment.',
        paragraphs: [
          'If the stroller will be used four or more times a week for walks, grocery runs, and daily outings, lane one or lane two is almost always the right starting point. Frequent use justifies the weight and footprint of a stroller with more comfort and durability.',
          'If the stroller will be used primarily on weekends, vacations, or whenever the car seat routine is inconvenient, lane two or lane three makes more sense. The stroller does not need to perform like a daily workhorse.',
          'Terrain is the other filter. Urban environments with uneven sidewalks, curbs, and tight store aisles tend to favor compact strollers with decent wheel clearance. Suburban environments with wide smooth paths and parking lots are more forgiving of full-size dimensions.',
          'A useful question: on a typical Tuesday, where does the stroller go? Not on the best day of the month. The ordinary day is the one that determines the lane.',
          'If the answer to "typical Tuesday" does not involve a stroller at all, that is also information. A family who primarily car-seats everywhere may need a lighter, smaller stroller for specific occasions rather than a daily-driver setup.',
        ],
      },
      {
        title: 'The two specs that matter more than any other',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerFold,
        imageAlt: 'Stroller fold and trunk storage test showing the two most important practical specs.',
        paragraphs: [
          'Of all the specifications on a stroller, two produce disproportionate quality-of-life impact: folded dimensions and carry weight.',
          'Folded dimensions determine whether the stroller fits in your trunk with room for other things. Measure your trunk opening and your trunk depth before buying. Then look at the stroller\'s folded dimensions and check whether the numbers actually clear that space.',
          'This sounds obvious. It is astonishing how rarely it is checked before purchase. "Fits most trunks" is a marketing phrase, not a trunk measurement.',
          'Carry weight determines whether you will genuinely use the stroller everywhere or quietly avoid it when the route involves stairs, a bus, or anything other than a perfectly level parking lot.',
          'A stroller you weigh for the first time in the parking lot of the baby store will feel fine. The same stroller at the end of a travel day, when you are lifting it into an overhead bin, will feel exactly like what it weighs.',
          'Know the folded dimensions and the carry weight of any stroller you are seriously considering. Those two numbers will tell you more about real daily fit than the rest of the spec sheet combined.',
        ],
      },
      {
        title: 'The second stroller question',
        imageSrc: GEAR_ACADEMY_IMAGES.lifestyleTravelStroller,
        imageAlt: 'Travel stroller representing the second stroller decision for families who need both.',
        paragraphs: [
          'Some families genuinely need two strollers. Most families think they need two strollers until they buy the right first stroller.',
          'The two-stroller setup makes sense when the primary stroller genuinely cannot cover the secondary use case. The clearest example: a family with a large everyday stroller that is too heavy and bulky for flights. A travel stroller in that situation is a clear secondary tool with a clear job.',
          'The two-stroller setup is less sensible when the secondary stroller is solving a problem the primary stroller could handle with a different configuration.',
          'Before buying a second stroller, ask: what specific situation is the primary stroller failing in? If the answer is specific and repeated, a second stroller may be justified. If the answer is "it seems heavy" or "it looked nice in the photos," the primary stroller may just need to be replaced with a better lane choice.',
          'A well-chosen stroller in the right lane covers most families\' needs without a second purchase. The second stroller question is worth asking honestly before the purchase, not after the garage fills up.',
        ],
      },
      {
        title: 'What to test in person',
        imageSrc: GEAR_ACADEMY_IMAGES.strollerFullSize,
        imageAlt: 'In-person stroller testing at a specialty store showing physical fit variables.',
        paragraphs: [
          'Strollers are one of the gear categories where in-person testing is genuinely useful before buying.',
          'The three things to test: fold mechanics, handlebar height, and how the stroller fits in your actual car trunk.',
          'Fold mechanics are impossible to evaluate from a video. The sequence, the weight of the frame during the fold, and whether the stroller stands independently once folded are all things you only feel correctly when you do them.',
          'Handlebar height matters if there is a significant height difference between the two people who will push the stroller most. A handlebar that sits perfectly for one height becomes a mild lower-back complaint for the other, repeated across thousands of pushes.',
          'And the trunk test — bring your car keys. Ask if there is a parking lot you can walk to. Open the trunk, put the stroller in, and see whether there is room for anything else.',
          'Those three tests take fifteen minutes and replace hours of second-guessing.',
        ],
      },
    ],
    decisionBullets: [
      'Determine your stroller lane before comparing any specific models.',
      'Use use frequency and terrain to confirm the lane — ordinary Tuesday, not best-day-of-the-month.',
      'Check folded dimensions against your actual trunk before buying.',
      'Know the carry weight and simulate the load before the purchase becomes permanent.',
      'Ask the second stroller question honestly — most families need better lane selection, not a second stroller.',
    ],
    products: [
      {
        name: 'Full-Size Stroller',
        description: 'The right choice when the stroller has a genuine daily job — frequent use, regular outings, and a storage situation that can accommodate it.',
        pros: ['Comfort and handlebar ergonomics for repeated pushing', 'Basket capacity and canopy coverage for longer outings'],
      },
      {
        name: 'Compact Stroller',
        description: 'The balanced lane — lighter and smaller than full-size without sacrificing the usability that makes a stroller worth having.',
        pros: ['Better trunk fit than full-size options', 'More manageable for families who push and store daily'],
      },
      {
        name: 'Travel Stroller',
        description: 'Portability above everything else — chosen when the stroller needs to fly, fit in a cab, or be carried more often than pushed.',
        pros: ['Overhead bin clearance and low carry weight', 'The right second stroller if the primary choice is a full-size'],
      },
    ],
    nextModuleSlug: 'car-seat-foundations',
    previousModuleSlug: 'how-to-think-about-baby-gear',
  },
  {
    title: 'Car Seat Foundations',
    slug: 'car-seat-foundations',
    moduleOrder: 3,
    description:
      'Car seats have a stage architecture. The real decision is how many stages you want to purchase across, and the answer depends almost entirely on your vehicle and your routine.',
    subhead: 'Understand the stage architecture, then let your car decide.',
    imagePath: GEAR_ACADEMY_IMAGES.carSeatCarrier,
    imageAlt: 'Infant car seat image for the Car Seat Foundations module.',
    intro: [
      'Car seat confusion is almost always a category confusion.',
      'Parents arrive at the decision knowing they need "a car seat" and discover there are four distinct product types, each with a different age range, size range, installation method, and set of tradeoffs.',
      'The category confusion resolves very quickly once you understand one thing: car seats follow a stage architecture.',
      'Every child moves through rear-facing, forward-facing, and eventually booster stages. The question is not which stage to buy — the baby will need all of them. The question is how many separate products you want to purchase to cover those stages.',
      'That question, combined with a hard look at your vehicle and your daily routine, produces a clear answer almost every time.',
    ],
    coreSections: [
      {
        title: 'The stage architecture explained',
        imageSrc: GEAR_ACADEMY_IMAGES.carSeatCarrier,
        imageAlt: 'Infant car seat representing the first stage in the car seat architecture.',
        paragraphs: [
          'Stage one is rear-facing. All newborns and infants begin here. The question is whether you cover this stage with an infant-only seat or a convertible seat installed rear-facing.',
          'An infant-only seat (also called an infant carrier) clicks in and out of a base and can be carried separately. It is typically used from birth until somewhere between 12 and 24 months, depending on the baby\'s size and the seat\'s rear-facing weight limit.',
          'A convertible seat is a fixed installation that starts rear-facing and then converts to forward-facing as the child grows. It stays in the car. It does not detach. The baby comes out, not the seat.',
          'Stage two is forward-facing, covered by a convertible or all-in-one seat with a harness.',
          'Stage three is booster, which comes well after the infant years and is a separate purchase decision entirely.',
          'An all-in-one seat covers all three stages without replacement. The tradeoff is that all-in-ones are large, heavy, and expensive, and they solve the booster problem before anyone is ready to think about it.',
          'Most families are choosing between: infant seat now + convertible later, or skip the infant seat and start with a convertible.',
        ],
      },
      {
        title: 'The infant seat versus convertible question',
        imageSrc: GEAR_ACADEMY_IMAGES.carSeatBase,
        imageAlt: 'Infant car seat base installed in a vehicle showing daily click-in convenience.',
        paragraphs: [
          'The infant seat is one of the most genuinely useful pieces of baby gear — but its value is almost entirely tied to one specific convenience: being able to move a sleeping baby from car to stroller to home without waking them.',
          'If that transfer matters in your daily routine — and for many families in the early months, it is significant — the infant seat earns its cost.',
          'If your routine does not depend on sleeping-baby transfers, if you live somewhere you rarely drive, or if you have a car situation where click-in convenience is awkward, the infant seat may be the first thing worth skipping.',
          'The convertible seat strategy means buying one seat that serves from birth through the forward-facing years, skipping the infant seat entirely. It is cheaper over the full stage arc and produces no transition at 12 to 24 months.',
          'The main thing convertible seats do not do is travel in and out of the car. They stay installed. The baby comes to them.',
          'Neither approach is wrong. The infant seat is right when click-in portability genuinely serves your routine. The convertible-from-birth approach is right when it does not.',
        ],
      },
      {
        title: 'Your vehicle is a hard constraint',
        imageSrc: GEAR_ACADEMY_IMAGES.fitBlueprint,
        imageAlt: 'Car seat vehicle fit planning showing installation angle and space constraints.',
        paragraphs: [
          'Car seat fit is not a preference. It is a physical constraint imposed by your specific vehicle.',
          'Rear-facing car seats need seat angle, LATCH anchor placement, and enough depth in the back seat to accommodate the seat without it pressing against the front seat headrest.',
          'Some vehicles are difficult with some seats and excellent with others — and those relationships are not predictable from the product page. A specific car seat that fits perfectly in a Toyota Highlander may create significant installation challenges in a Honda Civic.',
          'The cleanest way to check fit before purchase is to use the manufacturer\'s vehicle compatibility checker and then confirm in person. Many specialty baby stores will let you bring the car in and try the installation before you buy.',
          'Know your vehicle\'s make, model, and year before any car seat conversation. It is the single most important variable in the decision.',
          'Do not buy a car seat without checking fit in your actual car.',
        ],
      },
      {
        title: 'Why install confidence is a safety variable',
        imageSrc: GEAR_ACADEMY_IMAGES.omniCarrier,
        imageAlt: 'Car seat installation showing the relationship between ease of use and correct daily use.',
        paragraphs: [
          'A car seat that is difficult to use correctly is less safe than a car seat that is easy to use correctly, even if the difficult one has better specs on paper.',
          'Safety features only work when they are properly engaged. A harness that takes significant effort to adjust correctly gets adjusted less carefully over time. A base that is difficult to click in securely produces daily moments of "that\'s probably fine."',
          'This is not a criticism of parents. It is an acknowledgment of how human beings actually behave under time pressure with a screaming newborn in the parking lot.',
          'When evaluating car seats, specifically test the harness adjustment, the base installation indicator, and how the seat handles in your vehicle in a realistic simulation.',
          'A seat that you can install correctly and feel confident about repeatedly is the seat that will actually be used correctly repeatedly. That quality matters as much as any rating.',
          'The best car seat is the one you and your co-parent can install correctly and use confidently every day.',
        ],
      },
    ],
    decisionBullets: [
      'Understand the stage architecture before comparing products — you are choosing how many stages to purchase across, not just which seat to buy.',
      'Choose between infant seat + convertible later or convertible from birth based on whether click-in portability genuinely matters in your routine.',
      'Check your vehicle\'s make, model, and year against compatibility data before committing to any seat.',
      'Test installation in your actual car before purchase — fit is physical, not theoretical.',
      'Prioritize install confidence and daily ease of use as safety variables, not just comfort features.',
    ],
    products: [
      {
        name: 'Infant Car Seat',
        description: 'The right choice when click-in portability — moving a sleeping baby from car to stroller to home — genuinely serves your daily routine.',
        pros: ['Removable carrier for sleeping-baby transfers', 'Easy in and out of travel system setups'],
      },
      {
        name: 'Convertible Car Seat',
        description: 'The right choice when portability is not a priority and you want one seat to cover rear-facing and forward-facing without a mid-stage replacement.',
        pros: ['No replacement at 12–24 months', 'Lower cost over the full rear-facing stage'],
      },
    ],
    nextModuleSlug: 'travel-systems',
    previousModuleSlug: 'stroller-foundations',
  },
  {
    title: 'Travel Systems',
    slug: 'travel-systems',
    moduleOrder: 4,
    description:
      'Compatibility is binary — the pieces either connect or they do not. Understanding how stroller and car seat compatibility actually works prevents the most expensive gear mistake in the category.',
    subhead: 'Compatibility is a yes or no question. Plan it like one.',
    imagePath: GEAR_ACADEMY_IMAGES.mixxNext,
    imageAlt: 'Travel-system stroller image for the Travel Systems module.',
    intro: [
      'A travel system is a stroller and infant car seat combination designed to work together.',
      'The appeal is obvious: click the car seat out of the car, walk it to the stroller, click it in, and push without waking the baby. That single transition is what the entire travel system concept is built around.',
      'What most parents do not understand before buying is that compatibility is not a feature you can assume. It is a binary outcome — the pieces either connect or they do not — and the combinations that do connect are specific to brand, product line, and sometimes model year.',
      'The module that follows stroller and car seat decisions is this one for a reason: you need to know both pieces before you can evaluate whether they are compatible and whether the travel system setup is even the right path for your routine.',
    ],
    coreSections: [
      {
        title: 'What compatibility actually means',
        imageSrc: GEAR_ACADEMY_IMAGES.mixxNext,
        imageAlt: 'Travel system stroller showing compatible infant car seat connection.',
        paragraphs: [
          'A travel system works in one of two ways: direct connection or adapter connection.',
          'Direct connection means the infant car seat clicks directly onto the stroller frame without any additional hardware. This usually means same-brand systems — buying the stroller and car seat from the same manufacturer.',
          'Adapter connection means the stroller has adapter mounts (either built in or purchased separately) that allow specific non-brand car seats to attach. This is how cross-brand combinations work.',
          'Both methods produce a functional travel system when done correctly. The difference is how many steps stand between "car seat in my hands" and "car seat clicked onto stroller."',
          'Direct systems are simpler. Adapter systems are more flexible. The right choice depends on whether the best stroller and the best car seat for your situation happen to come from the same brand.',
          'If they do, great. If they do not, an adapter setup allows you to keep both best-fit choices without forcing a brand compromise.',
        ],
      },
      {
        title: 'The click-in window — how long this actually matters',
        imageSrc: GEAR_ACADEMY_IMAGES.carSeatCarrier,
        imageAlt: 'Infant car seat click-in transfer shown as the core value of a travel system.',
        paragraphs: [
          'The travel system\'s core value — clicking the infant seat from car to stroller without waking the baby — is only relevant during the infant seat stage.',
          'That window is typically birth to somewhere between 12 and 24 months, depending on the baby\'s size and the seat\'s weight limit. For many babies, the practical window is closer to 12 months.',
          'After that point, the stroller becomes a stroller and the car seat is a separate car item, and the click-in compatibility is no longer a daily variable.',
          'This matters for two reasons. First: the value of the travel system is front-loaded. The first year is when it earns its keep. Second: if your stroller will need to outlast the infant seat stage — and most do — the stroller choice should be evaluated on its own merits beyond the click-in feature.',
          'A stroller that is excellent for travel system use but mediocre for everyday pushing at 18 months has a problem after the first year ends.',
          'Choose the stroller for the full duration of stroller use. Treat the click-in compatibility as a useful early bonus, not the primary reason for the purchase.',
        ],
      },
      {
        title: 'Same-brand versus cross-brand systems',
        imageSrc: GEAR_ACADEMY_IMAGES.compactStroller,
        imageAlt: 'Cross-brand travel system setup showing flexible stroller and car seat pairing.',
        paragraphs: [
          'Same-brand systems are the path of least resistance. Buy the Graco stroller and the Graco car seat, and they click together without any compatibility research.',
          'The downside is that same-brand systems require both products to be the best fit from that one brand. That is a reasonable outcome if one brand genuinely has the right stroller and the right car seat for your situation. It is a compromise if you are keeping an inferior stroller because it matches the car seat you already bought.',
          'Cross-brand systems, with adapters, allow you to pair the best stroller for your routine with the best car seat for your vehicle, regardless of brand.',
          'The process for cross-brand compatibility: choose your stroller, check which adapter kits that stroller offers, verify which car seat brands and models are listed as compatible with those adapters.',
          'That verification step is important. "Compatible with most infant car seats" is not a promise. Check the specific adapter compatibility chart for your specific stroller and your specific car seat, by model number.',
          'The research is ten minutes. The alternative is buying the wrong combination and discovering the click-in does not work in your driveway.',
        ],
      },
      {
        title: 'When to skip the travel system entirely',
        imageSrc: GEAR_ACADEMY_IMAGES.carrierLifestyle,
        imageAlt: 'Baby carrier as an alternative to travel system when stroller compatibility is not the priority.',
        paragraphs: [
          'The travel system is a convenience tool, not a requirement.',
          'Some families do not use it as much as expected because their daily routine does not produce many click-in moments. If most outings start from a parking lot rather than a car-to-stroller transition, the click-in value may be lower than anticipated.',
          'Other families effectively replace the travel system with a carrier for the infant stage. A structured carrier handles a sleeping newborn on most outings where the stroller would have been the vehicle. Once the baby is older and the carrier becomes less practical for longer outings, the stroller takes over.',
          'This is a legitimate approach. It avoids the click-in compatibility question entirely and is especially practical for urban families where a stroller is not the primary movement tool anyway.',
          'If you are starting with a convertible car seat instead of an infant seat, the travel system question does not apply — convertible seats do not click into strollers. A car-seat-compatible snack bar stroller insert is the infant-friendly alternative in that case.',
          'The travel system is worth planning for when click-in transitions are genuinely part of your daily life. It is worth skipping when they are not.',
        ],
      },
    ],
    decisionBullets: [
      'Verify compatibility by specific model, not by brand — same brand does not always mean every model connects.',
      'For cross-brand systems, check the adapter compatibility chart for your exact stroller model against your exact car seat model.',
      'Choose the stroller for its full useful life, not primarily for the click-in window.',
      'If the best stroller and best car seat are different brands, an adapter system preserves both choices.',
      'If the click-in routine is not part of your daily life, the travel system may not be the right starting framework.',
    ],
    products: [
      {
        name: 'Same-Brand Travel System',
        description: 'The path of least resistance when one brand has both the right stroller and the right car seat for your situation.',
        pros: ['Direct connection, no adapter needed', 'Simpler to set up and verify compatibility'],
      },
      {
        name: 'Cross-Brand Adapter Setup',
        description: 'The flexible path when the best stroller and best car seat come from different brands — compatibility verified by adapter chart.',
        pros: ['Allows best-fit choices regardless of brand', 'Widely available for most major stroller and car seat combinations'],
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
      'Travel with a baby is four different situations that need four different setups. Building one packing list to cover all of them is exactly how parents end up bringing too much and using too little.',
    subhead: 'Four kinds of travel. Four different setups.',
    imagePath: GEAR_ACADEMY_IMAGES.lifestyleTravelStroller,
    imageAlt: 'Lifestyle travel stroller image for the Travel With Baby module.',
    intro: [
      'Most parents approach baby travel as one category: "stuff you need when you leave the house."',
      'That framing is why baby bags get heavy and trunks get cluttered. If one setup has to cover every outing, it has to cover the worst-case outing — which means carrying three days of supplies for a forty-minute grocery run.',
      'The more useful frame is to separate travel with a baby into four distinct situations: errands, day trips, overnight trips, and flights.',
      'Each one makes different demands on the gear. Each one has a different edit point. And identifying which situation you are preparing for is the step that makes the packing list actually manageable.',
    ],
    coreSections: [
      {
        title: 'Errands — the most common and most over-packed situation',
        imageSrc: GEAR_ACADEMY_IMAGES.colugoStroller,
        imageAlt: 'Compact stroller and minimal errand bag setup for local outings.',
        paragraphs: [
          'The errand run is the situation that gets over-packed most consistently. Because the bag lives in the car and does not get actively unpacked after each trip, it accumulates.',
          'A functional errand setup is smaller than most parents expect: diapers and wipes for the duration of the outing plus one, a change of clothes, feeding support if applicable, and something to cover the baby from sun or cold.',
          'The bag does not need to carry every possible contingency. It needs to carry what you would use on a two-hour round trip.',
          'A smaller bag is not less prepared. It is just calibrated to the actual outing rather than to the hypothetical longest day you could ever have.',
          'Audit the errand bag once every few weeks. Take out what has not been touched. The bag usually gets cleaner and faster to load when the audit becomes a habit.',
        ],
      },
      {
        title: 'Day trips — the setup that expands deliberately',
        imageSrc: GEAR_ACADEMY_IMAGES.travelPacked,
        imageAlt: 'Day-trip baby travel gear packed with deliberate expansion for longer outings.',
        paragraphs: [
          'A day trip — a longer outing away from home that does not include an overnight stay — needs everything the errand setup has, plus a realistic read on what the day will actually require.',
          'The additions are usually: more feeding volume, a more comfortable place for the baby to be set down (a blanket, a portable lounger, depending on age and destination), and potentially a carrier if the destination has limited stroller access.',
          'Day trips are where the travel stroller earns its keep in situations where the everyday stroller is too heavy or too bulky for the destination.',
          'The planning question for a day trip is: what are the transitions? Getting in and out of the car, getting through the destination, eating on the go, nap management if applicable. Name the transitions, then pack for those specifically rather than for the full menu of possible scenarios.',
          'The most common day-trip packing mistake is adding backup layers rather than thinking through the actual day. Transitions named, transitions packed for, transitions handled.',
        ],
      },
      {
        title: 'Overnight and road trips — when sleep becomes a variable',
        imageSrc: GEAR_ACADEMY_IMAGES.organization,
        imageAlt: 'Organized overnight travel kit for baby with sleep support included.',
        paragraphs: [
          'Overnight travel with a baby changes the calculus in one specific direction: sleep.',
          'Where the baby sleeps at the destination determines a significant portion of what needs to come with you. If the destination has a crib, the portable sleep situation is handled. If it does not, a travel bassinet or compact sleep solution becomes a core item, not an optional one.',
          'Beyond sleep: overnight trips need the same categories as day trips but with enough supply for the actual trip duration. The math is straightforward — diapers per day times days, clothing sets times days plus two, feeding supplies for the full period.',
          'Road trips specifically create one unique challenge: long stretches in the car seat with a baby who has opinions about that. The reliable approach is to build in stops rather than expecting the baby to handle the drive comfortably. Forty-five to sixty minutes between stops is a reasonable baseline; shorter if needed.',
          'Pack the car with the car-seat-stop supplies accessible from the back seat, not buried in the trunk. When the stop happens, the supply needed is within reach.',
        ],
      },
      {
        title: 'Flights — where the overhead bin test applies',
        imageSrc: GEAR_ACADEMY_IMAGES.lifestyleTravelStroller,
        imageAlt: 'Travel stroller packed for airline gate-check showing portability requirements.',
        paragraphs: [
          'Flying with a baby is a different gear conversation than every other situation because the gear has to survive the flight itself and then be functional on the other side.',
          'The overhead bin test is simple: if you needed to carry this item through an airport, down the jetway, and either gate-check it or carry it on, would you actually do that?',
          'Items that fail the test should not come on the flight. Items that pass the test earn a spot.',
          'The diaper bag specifically earns most of its real estate on a flight. Everything that is needed for the duration of the flight — not the trip, just the flight — needs to fit in the bag that comes into the cabin. Feeding, diapers, wipes, a change of clothes for the baby and for you (specific to flight, not general trip use), entertainment for older babies, and whatever the baby uses to soothe for sleep.',
          'Gate-checking a stroller is free on most airlines. Check your airline\'s gate-check policy and bag size limits before packing. Some airlines have gate-check size restrictions.',
          'The family that arrives at the destination calm is usually the family that brought less than they thought they needed and figured the rest out.',
        ],
      },
    ],
    decisionBullets: [
      'Name the travel situation first — errand, day trip, overnight, or flight — and pack for that situation specifically.',
      'Audit the errand bag regularly and remove what has not been used.',
      'For day trips, name the transitions before you pack — transitions identified, transitions planned for.',
      'For overnight trips, solve the sleep question first and build the rest of the packing around it.',
      'Apply the overhead bin test to every item that wants to come on a flight.',
    ],
    products: [
      {
        name: 'Travel Stroller',
        description: 'The right choice when the destination makes the everyday stroller too heavy, too bulky, or too difficult to gate-check.',
        pros: ['Passes the overhead bin test', 'Designed for the transition-heavy situations the everyday stroller does not suit'],
      },
      {
        name: 'Structured Carrier',
        description: 'A portable movement tool when hands are needed for stairs, security lines, or destinations with limited stroller access.',
        pros: ['Works where strollers cannot', 'Reduces trip complexity when multiple transition types are expected'],
      },
      {
        name: 'Compact Travel Sleep Solution',
        description: 'A portable sleep surface for overnight destinations that do not have a safe sleep setup already in place.',
        pros: ['Solves the overnight sleep variable', 'Worth the bag space when the destination is uncertain'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The calmer the travel setup, the more likely you are to actually use it.',
    softCtaBody: [
      'Over-packed bags do not get grabbed. They get left in the garage.',
      'Build the setup for the actual outing, and the outing almost always goes better.',
    ],
    nextModuleSlug: 'daily-use-gear',
    previousModuleSlug: 'travel-systems',
  },
  {
    title: 'Daily Use Gear',
    slug: 'daily-use-gear',
    moduleOrder: 6,
    description:
      'The frequency test separates gear that earns its place from gear that mostly sounds useful. High-frequency items deserve more thought — and more spending — than low-frequency items that only seem essential on the product page.',
    subhead: 'Ask how often before you ask how much.',
    imagePath: GEAR_ACADEMY_IMAGES.momcozyPureHug,
    imageAlt: 'Daily-use baby carrier image for the Daily Use Gear module.',
    intro: [
      'Not all baby gear is equally important. Some of it gets used every single day and shapes the rhythm of ordinary life.',
      'Some of it gets used three times and then takes up dedicated counter space for two years.',
      'The distinction between those two categories is not obvious on a product page because product pages are not designed to show you how often the item will actually be used. They are designed to make the item look essential.',
      'The frequency test is a simple pre-purchase question: how many times per week, on a typical week, will this item genuinely be touched?',
      'If the answer is once or twice, the item may still be worth having — but it should be evaluated as a low-frequency tool, not a daily essential.',
      'If the answer is five or more times, the item deserves more evaluation time, more budget, and more physical testing before the purchase.',
    ],
    coreSections: [
      {
        title: 'The frequency audit',
        imageSrc: GEAR_ACADEMY_IMAGES.planningNotes,
        imageAlt: 'Frequency audit framework for evaluating daily-use baby gear.',
        paragraphs: [
          'A frequency audit is straightforward: before buying any piece of gear, estimate how many times per week it will realistically be used in its first three months of service.',
          'Items used daily (a carrier, a high chair, a swing during the fussiest hours) are high-frequency items. They shape the routine and get evaluated rigorously.',
          'Items used a few times a week (a bouncer seat, a specific soothing item, a specialty feeding tool) are medium-frequency. Worth buying if the use case is real; not worth buying out of defensive planning.',
          'Items used rarely — "just in case" items, single-occasion tools, backup options for scenarios that have not happened — are low-frequency. These belong on a private maybe list, not the active registry.',
          'The audit does not require precision. It requires honesty about the difference between how often you expect to use something and how often you will actually use it in a real week with a real baby.',
          'That difference is usually significant, and catching it before the purchase is much easier than managing it afterward.',
        ],
      },
      {
        title: 'Carriers — why physical testing is non-negotiable',
        imageSrc: GEAR_ACADEMY_IMAGES.carrierLifestyle,
        imageAlt: 'Baby carrier worn in daily use context showing importance of physical fit testing.',
        paragraphs: [
          'Carriers are one of the highest-frequency items in many families\' early routines. They are also one of the most fit-dependent purchases in the entire gear category.',
          'A carrier that fits one body well may be genuinely uncomfortable on a different body. Shoulder strap padding, waist belt position, panel width, and how the weight distributes across the torso all vary significantly by body type.',
          'Unlike most other gear, "I\'ll just try it at home and return it if it doesn\'t work" often fails for carriers because carriers need to be worn long enough to test the weight distribution — usually 30 minutes or more — which most return policies around "tried" items do not accommodate.',
          'The right approach: try carriers in person at a store where you can walk with them loaded. If that is not available, look for carriers with explicit generous return policies for worn items.',
          'There are two broad carrier types to understand: soft-structured carriers (padded, buckled, adjustable, usually more supportive for longer wear) and ring slings and wraps (more compact, simpler, with a steeper comfort learning curve for some users).',
          'Most parents who end up loving their carrier tested it before committing. Most parents who end up not using it bought it online based on photos.',
        ],
      },
      {
        title: 'High chairs — a later-stage item that often lands too early',
        imageSrc: GEAR_ACADEMY_IMAGES.momcozyHighChair,
        imageAlt: 'High chair shown as a feeding milestone item that belongs at the right stage.',
        paragraphs: [
          'High chairs are one of the most misplaced items in many first-year registries.',
          'Most babies do not need a high chair until somewhere between four and six months of age, when they can sit upright with support and the solid food introduction process begins.',
          'Registering for a high chair in the second trimester is not wrong. Expecting to use it in month one is.',
          'When evaluating high chairs, the frequency variable is straightforward — once solids start, the high chair becomes one of the highest-frequency items in the house. Multiple times a day, every day.',
          'That frequency level justifies genuine evaluation: how easy is the tray to remove and clean? Does the seat wipe down simply or trap food in every crevice? Can it grow with the baby from the first solid foods through toddler meals?',
          'A high chair that is easy to clean will be cleaned more consistently. A high chair that is annoying to clean will be cleaned less thoroughly than it should be. That is a hygiene consideration masquerading as a convenience feature.',
          'Evaluate the high chair as the high-frequency daily tool it will become, not as a nursery aesthetic accessory it starts as.',
        ],
      },
      {
        title: 'What the daily friction points actually reveal',
        imageSrc: GEAR_ACADEMY_IMAGES.omniCarrier,
        imageAlt: 'Baby carrier resolving a daily friction point in a real household routine.',
        paragraphs: [
          'Daily friction points are the moments in your week that currently require the most effort to manage.',
          'For some families, the friction point is cooking dinner while a baby needs to be held — a carrier solves this.',
          'For others, it is the transition from car to destination when the baby is asleep — a travel-system setup solves this.',
          'For others, it is getting out of the house efficiently — a lighter stroller with a faster fold solves this.',
          'Daily-use gear earns its place when it is solving a real, repeated friction point — not when it is solving the friction point that a product page said you would have.',
          'The most useful question before buying any high-frequency item: what is the daily friction it is removing? If the answer is clear and the friction is real, the item belongs. If the answer requires imagination about scenarios that have not happened yet, the item may be aspirational rather than necessary.',
          'Real friction gets solved quickly and gratefully. Imagined friction produces gear that sits in a corner.',
        ],
      },
    ],
    decisionBullets: [
      'Run the frequency audit before buying anything — how many times per week, on a real week, will this actually be used?',
      'High-frequency items (used daily or more) deserve more evaluation time, more physical testing, and more budget than low-frequency items.',
      'Test carriers in person before buying — body fit for this category cannot be assessed from a product page.',
      'Evaluate high chairs by cleaning ease, not by aesthetic appeal — the item that is easiest to clean will be used most correctly.',
      'Identify real daily friction points and buy the gear that solves them, not the gear that sounds like it should.',
    ],
    products: [
      {
        name: 'Soft-Structured Carrier',
        description: 'A high-frequency daily tool when hands-free carrying is part of the routine — evaluated by physical fit before purchase.',
        pros: ['Solves the held-baby friction point for longer stretches', 'Buckled and adjustable for multiple wearers'],
      },
      {
        name: 'Ring Sling or Wrap',
        description: 'A compact alternative carrier that suits shorter carries and parents who want a simpler, less structured option.',
        pros: ['Smaller footprint than structured carriers', 'Works well for quick carries and transitions'],
      },
      {
        name: 'Full-Feature High Chair',
        description: 'A daily-use feeding station once solids start — evaluated by how easy it is to clean, not how it looks in a nursery.',
        pros: ['Supports daily mealtime as a high-frequency routine', 'Grows with the baby from first solids through toddler meals'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The most important gear you own is the gear you actually use.',
    softCtaBody: [
      'High-frequency items shape the rhythm of ordinary parenthood. They deserve ordinary-day standards, not showroom standards.',
    ],
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
      'Pump type is a frequency decision, not a feature decision. The routine you expect to maintain determines which pump belongs in the setup — and which accessories actually support it versus which ones just fill the drawer.',
    subhead: 'Choose the pump for the frequency, not the feature list.',
    imagePath: GEAR_ACADEMY_IMAGES.lifestylePump,
    imageAlt: 'Lifestyle pumping image for the Breast Pump module.',
    intro: [
      'There are three distinct types of breast pumps, and they are not interchangeable products with slightly different price points.',
      'They are answers to three different pumping routines: occasional use, regular daily use, and hands-free mobility during use.',
      'The mistake most parents make is choosing a pump based on features — output speed, noise level, number of settings — before establishing which type of pump the expected routine actually calls for.',
      'A pump with an impressive suction range does not help you if the routine needs hands-free mobility and the pump requires both hands.',
      'A wearable pump does not help you if the routine requires hospital-grade efficiency and the wearable cannot deliver it.',
      'The type selection comes before the model comparison. This module is about making that type selection clearly.',
    ],
    coreSections: [
      {
        title: 'The three pump types and what they actually answer',
        imageSrc: GEAR_ACADEMY_IMAGES.medelaPump,
        imageAlt: 'Double electric breast pump as the daily-use frequency category.',
        paragraphs: [
          'Manual pumps are single-session tools designed for occasional, low-frequency use. They require hands to operate, produce output slower than electric options, and are most useful as a backup or supplement — not as a primary pumping system.',
          'Double electric pumps are the standard daily-driver for parents who pump regularly. They express from both sides simultaneously, run on a motor, and prioritize efficiency over mobility. The tradeoff is that they require a dedicated setup: sitting down, tubing connected, motor running. They are the right choice when pumping sessions are frequent and efficiency matters.',
          'Wearable pumps (in-bra pumps, hands-free pumps) prioritize mobility over efficiency. They insert into the bra, operate quietly, and allow movement during a session. The tradeoff is that they typically produce less per session than a double electric under the same conditions, and they require more cleaning due to more parts.',
          'The right type is almost always the one that fits the actual frequency and location of the pumping routine.',
          'If the routine involves regular sessions at home or at a work desk, a double electric is almost always the right starting choice. If mobility during sessions is genuinely necessary — working while pumping, nursing and pumping simultaneously, pumping during commutes — a wearable supplements or replaces the double electric for those specific sessions.',
          'The manual pump is a backup tool. It belongs in the bag, not as the primary system.',
        ],
      },
      {
        title: 'Insurance coverage and how to actually use it',
        imageSrc: GEAR_ACADEMY_IMAGES.medelaInBra,
        imageAlt: 'Breast pump insurance coverage showing available pump types through benefits.',
        paragraphs: [
          'Most US insurance plans cover a breast pump under the ACA, and most parents do not fully understand what that coverage includes.',
          'Coverage varies by plan, but typically allows one pump per pregnancy — usually a double electric, a wearable, or occasionally a hospital-grade rental. The specific models covered vary by the pump supplier your insurance works with.',
          'The process: call or check your insurance\'s website for their durable medical equipment (DME) supplier. Go to that supplier\'s website, enter your insurance information, and see which specific pumps are covered at no cost versus which require an upgrade fee.',
          'The upgrade fee is where the confusion often lives. Many insurance plans cover a base double electric at no cost, but the wearable pump you saw on Instagram requires an upgrade fee of $50 to $150.',
          'That fee may or may not be worth it depending on your routine. Know the fee before you decide whether the upgrade makes sense.',
          'Process the insurance claim before buying any pump out of pocket. It is one of the cleaner financial wins available during baby prep, and it requires about fifteen minutes of research.',
        ],
      },
      {
        title: 'The accessory ecosystem trap',
        imageSrc: GEAR_ACADEMY_IMAGES.storageBagsMedela,
        imageAlt: 'Pumping accessories and storage showing the ecosystem that builds around a primary pump.',
        paragraphs: [
          'Every breast pump has an accessory ecosystem: flanges, valves, membranes, tubing, storage bags, bottles, drying racks, and cleaning tools.',
          'The accessory marketing around pumps is extremely effective at making every item in the ecosystem feel essential before you have pumped a single session.',
          'What is actually essential from the start: flanges that fit your body (many pumps ship with a size that does not fit most people — flange fit affects output and comfort significantly), enough bottles or storage bags to handle a day\'s sessions, and a cleaning brush for in-between washes.',
          'What can wait: backup flanges in multiple sizes, specialized cleaning sterilizers, a dedicated pumping station, and any accessory that is described primarily as "convenient."',
          'Flange size is worth specific attention. The standard flange that ships with most pumps is sized for a population median, not for individual fit. An incorrectly sized flange reduces output and causes discomfort. If pumping feels uncomfortable or output is lower than expected, check flange fit before assuming the pump is wrong.',
          'Start with the essentials. Add accessories that solve real friction once the pumping routine is established and you can identify what is missing.',
        ],
      },
      {
        title: 'Location as the deciding variable for pump type',
        imageSrc: GEAR_ACADEMY_IMAGES.momcozyMobileFlow,
        imageAlt: 'Wearable pump showing location flexibility as the core use case.',
        paragraphs: [
          'The single most useful question for choosing pump type is: where will I be when I pump?',
          'If the answer is "at my desk, at home, in a dedicated pumping room" — a double electric is almost always right. The setup time and seated requirement are manageable when the location is consistent.',
          'If the answer is "wherever I happen to be, including during work meetings, while nursing the baby\'s twin, or in a car" — a wearable becomes genuinely necessary rather than merely convenient.',
          'If the location question is honestly "I do not know yet because I am not sure how the routine will develop" — start with a double electric through insurance coverage, and wait to see whether the routine produces a location problem the wearable would solve.',
          'Buying a wearable pump before knowing whether mobility during sessions is actually needed often results in using neither pump as effectively as possible. The double electric gets set aside because setup feels like extra work. The wearable gets overused in situations where it is less effective than the electric would be.',
          'Know where before you know which.',
        ],
      },
    ],
    decisionBullets: [
      'Identify the pump type that fits your frequency and location before comparing models within that type.',
      'Process your insurance coverage before buying any pump — know what is covered at no cost and what the upgrade fee is.',
      'Check flange fit specifically — the standard size that ships with most pumps does not fit most people.',
      'Start with essential accessories only and add the rest once the routine reveals what is actually missing.',
      'Answer "where will I be when I pump?" before deciding between a double electric and a wearable.',
    ],
    products: [
      {
        name: 'Double Electric Pump',
        description: 'The right daily-driver for regular pumping sessions — efficient, consistent, and typically covered by insurance.',
        pros: ['Highest output per session for the price', 'The standard choice when pumping location is predictable'],
      },
      {
        name: 'Wearable Pump',
        description: 'The right choice when mobility during sessions is genuinely necessary — supplements or replaces the double electric for specific use cases.',
        pros: ['Hands-free during sessions', 'Practical for commutes, work meetings, or nursing simultaneously'],
      },
      {
        name: 'Milk Storage Bags and Bottles',
        description: 'The infrastructure that makes the pumping routine repeatable — sized for daily session volume, not for maximum theoretical output.',
        pros: ['Supports a clean handoff workflow', 'Worth having in quantity once pumping is a regular part of the day'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The pump that gets used is better than the pump that looks impressive.',
    softCtaBody: [
      'Match the type to the routine. Cover the essentials. Let the accessory purchases wait until the routine tells you what is actually missing.',
    ],
    nextModuleSlug: 'bottles-and-baby-utensils',
    previousModuleSlug: 'feeding-setup-flow',
  },
  {
    title: 'Bottles & Baby Utensils',
    slug: 'bottles-and-baby-utensils',
    moduleOrder: 9,
    description:
      'Start with three bottles, not thirty. Nipple flow is the most important spec nobody reads. And a sustainable washing setup matters more than the brand on the bottle.',
    subhead: 'Nipple flow first. Quantity second. Brand last.',
    imagePath: GEAR_ACADEMY_IMAGES.storageBottles,
    imageAlt: 'Bottle starter setup image for the Bottles & Baby Utensils module.',
    intro: [
      'Bottles are one of those categories that seems straightforward until you find yourself standing in a baby store looking at forty-seven bottle options and a wall of nipple parts.',
      'Most of the complexity is manufactured. Bottles have been turned into a brand identity category when they are fundamentally a functional tool that needs to do two things: hold liquid and allow the baby to feed from it.',
      'The variables that actually matter are nipple flow rate, bottle capacity, ease of cleaning, and how many you genuinely need in rotation before the routine is established.',
      'This module introduces those variables in the order that makes the decision most efficient — starting with the one almost everyone ignores.',
    ],
    coreSections: [
      {
        title: 'Why nipple flow is the most important spec nobody reads',
        imageSrc: GEAR_ACADEMY_IMAGES.storageBottles,
        imageAlt: 'Bottle nipple flow rates shown as the primary variable in bottle selection.',
        paragraphs: [
          'Nipple flow rate is the speed at which milk or formula moves through the nipple when the baby sucks.',
          'Flow rates are typically labeled as slow, medium, fast, or as numbered levels (0, 1, 2, 3, etc.) depending on the brand. A newborn almost always needs the slowest flow available. A faster flow can cause choking, gulping, gas, and feeding refusal in a baby who is not ready for it.',
          'Most bottles come packaged with a medium or standard flow nipple, which is not the right starting point for a newborn. The packaging looks like a newborn product. The nipple inside is frequently not calibrated for newborn feeding.',
          'Check the nipple flow rate on any bottle before buying. If it does not specify "newborn" or "level 0/slow" in the product description, look at the nipple description directly. Do not assume the packaging is telling you what the nipple is doing.',
          'Different brands also have different flow calibrations for the same label. A "slow flow" from one brand may be faster than the "medium flow" from another. Until you know how a specific brand\'s nipple performs, start with the slowest available.',
          'Nipple flow is also the most common reason a baby "rejects" a bottle. Before switching brands, check whether a slower nipple from the same brand resolves the issue.',
        ],
      },
      {
        title: 'Starting with three, not thirty',
        imageSrc: GEAR_ACADEMY_IMAGES.storageBags,
        imageAlt: 'Small bottle starter set showing the right quantity before the baby has weighed in.',
        paragraphs: [
          'Before the baby has weighed in on bottles, buying a large quantity from a single brand is a bet.',
          'Most bottle brands sell starter sets of two to four bottles. That is the right starting quantity. It gives enough to run a day without continuous washing, but not so many that a brand switch becomes a significant financial loss.',
          'The exception is if you know with confidence that a specific bottle will work. If you have a close family member who used that bottle with their baby, if a lactation consultant has specifically recommended it for your situation, or if your pediatrician has guidance — those are legitimate reasons to start with more.',
          'Without that specific information, two to three bottles from one system, with the slowest flow nipple available, is the right first purchase.',
          'If the bottle works — if the baby accepts it, the flow is appropriate, and the cleanup is manageable — then buy more.',
          'If the bottle does not work, you have not committed a major purchase to a system that does not fit.',
        ],
      },
      {
        title: 'The washing infrastructure question',
        imageSrc: GEAR_ACADEMY_IMAGES.formulaNara,
        imageAlt: 'Bottle washing setup showing sustainable cleaning infrastructure for repeated use.',
        paragraphs: [
          'A sustainable bottle setup is one you can actually maintain the cleaning for over multiple sessions per day.',
          'Bottle parts need to be cleaned after each use. That means the washing setup needs to work quickly, store cleanly, and dry without becoming a bacteria surface.',
          'The first question is dishwasher compatibility. If the bottles and nipples you choose are dishwasher safe and you have a dishwasher, the cleaning routine is manageable. Put the small parts in the dishwasher\'s basket, run it, done.',
          'If you are hand-washing — which many families do in the early days — you need a bottle brush that reaches the bottom of the bottle, a nipple brush for the inside of the nipple, and a drying rack that is not shared with adult dish items (to avoid cross-contamination with cleaning product residue).',
          'The counter footprint of the drying rack matters more than it sounds. If the drying rack takes up a significant portion of the counter and does not have a drip tray, it will become an annoyance that does not get used correctly.',
          'A compact, drip-tray-equipped drying rack and a bottle brush set is the right infrastructure. Not a sterilizer machine, not a UV dryer, not three different brush sizes for three different bottle profiles. Simple and consistent wins.',
        ],
      },
      {
        title: 'When to expand — and what triggers the expansion',
        imageSrc: GEAR_ACADEMY_IMAGES.momcozyMobileFlow,
        imageAlt: 'Bottle system expansion shown after the routine has been established.',
        paragraphs: [
          'There are two legitimate reasons to expand the bottle setup: rotation demand and a confirmed brand change.',
          'Rotation demand: if you are washing bottles more than twice per day because there are not enough in the rotation, buy more bottles of the same system. The target is enough bottles to cover a full day without washing until the end of the day.',
          'Brand change: if the current bottle is not working — the baby is refusing it, the flow is causing feeding problems, or the cleaning is unmanageable — switch brands. Buy a small set from the new system, confirm it works, then transition over.',
          'What does not trigger a legitimate expansion: another parent enthusiastically recommending their bottle, a product review that mentions a feature that sounds interesting, or a sale on a different brand.',
          'Utensils — spoons, bowls, snack containers — belong in a different chapter entirely. Most babies do not use feeding utensils until four to six months of age when solids begin. Buying them before that point is just a way to fill a drawer early.',
          'Let the bottle routine settle first. Let the utensil chapter arrive when solids do.',
        ],
      },
    ],
    decisionBullets: [
      'Check nipple flow before buying any bottle — start with the slowest flow available for newborns, regardless of what the packaging looks like.',
      'Start with two to three bottles from one brand before committing to a larger quantity.',
      'Evaluate washing infrastructure before buying — dishwasher compatibility, counter footprint, and drip management matter for sustainable daily use.',
      'Expand the bottle quantity only after confirming the brand works for your baby and your routine.',
      'Feeding utensils belong at the solids stage, not the newborn cart.',
    ],
    products: [
      {
        name: 'Bottle Starter Set (2–4 bottles)',
        description: 'The right first purchase before the baby has shown whether the bottle works — enough to run initial sessions, small enough to replace without significant cost if it does not.',
        pros: ['Tests brand and nipple fit before full commitment', 'Reduces the cost of a brand switch if needed'],
      },
      {
        name: 'Drying Rack with Drip Tray and Brush Set',
        description: 'The washing infrastructure that makes the bottle routine maintainable — prioritized by counter footprint and ease of use, not features.',
        pros: ['Supports consistent daily cleaning', 'A drip tray prevents the counter situation most parents regret buying without'],
      },
      {
        name: 'Slow-Flow Newborn Nipples',
        description: 'Replacement nipples in the slowest available flow — often needed because the nipple in the starter set is calibrated for a later stage.',
        pros: ['Correct starting flow rate for newborn feeding', 'Worth buying alongside the bottle if the starter set does not specify newborn flow'],
      },
    ],
    softCtaLabel: 'Final Thoughts',
    softCtaTitle: 'You have finished the Gear Path.',
    softCtaBody: [
      'The biggest gear decisions are behind you. Strollers, car seats, travel systems, daily-use tools, and feeding setup are all clearer now than they were at the start.',
      'The Nursery Path is next — where room flow, storage logic, and sleep setup come together.',
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
