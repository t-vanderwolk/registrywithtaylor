export type RegistryAcademyModuleSlug =
  | 'what-to-register-first'
  | 'where-to-register'
  | 'shop-local-get-support'
  | 'welcome-boxes-perks'
  | 'rewards-completion-discounts'
  | 'smart-purchasing-timeline'
  | 'mistakes-to-avoid'
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

const TOTAL_MODULES = 8;
export const REGISTRY_PATH_IMAGES = {
  whereToRegister: '/assets/registrypath/universalregistry.png',
  guestGifting: '/assets/registrypath/gifts.png',
  planning: '/assets/registrypath/planning.png',
  shopLocal: '/assets/registrypath/babystore.png',
  hybridSupport: '/assets/registrypath/coupleplanning.png',
  expertGuidance: '/assets/registrypath/influencerexpert.png',
  welcomeBox: '/assets/registrypath/welcomebox.png',
  insideWelcomeBox: '/assets/registrypath/insidewelcomebox.png',
  openingWelcomeBox: '/assets/registrypath/openingwelcomebox.png',
  babyStore: '/assets/registrypath/babystore.png',
  overwhelm: '/assets/registrypath/overwhelm.png',
  research: '/assets/registrypath/research.png',
  rewards: '/assets/registrypath/rewards.png',
  smartBuying: '/assets/registrypath/smartbuying.jpeg',
  purchasingTimeline: '/assets/registrypath/calanderplan.png',
  firstBuys: '/assets/registrypath/pregnantplanning.png',
  registryPlanning: '/assets/registrypath/registry.png',
  babyShower: '/assets/registrypath/babyshower.png',
  babyPresents: '/assets/registrypath/babypresents.png',
  completionDiscount: '/assets/registrypath/completiondiscount.png',
  registryPlatform: '/assets/registrypath/registryplatform.png',
  strollerShopping: '/assets/registrypath/strollershopping.png',
  babyShowerBalloon: '/assets/registrypath/babyshowerbaloon.png',
  babyPrep: '/assets/registrypath/babyprep.png',
  nurseryCouple: '/assets/registrypath/nurserycouple.png',
} as const;

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
    title: 'What to Register First',
    slug: 'what-to-register-first',
    moduleOrder: 1,
    description:
      'Every registry starts with a choice: build around products or build around jobs. The ones that actually work start with the jobs.',
    subhead: 'Think in daily jobs, not shopping categories.',
    imagePath: REGISTRY_PATH_IMAGES.babyPrep,
    imageAlt: 'Registry planning editorial image for the What to Register First module.',
    intro: [
      'Here is the thing nobody tells you at the start of a registry: the list does not actually care about your enthusiasm.',
      'It cares whether it can do five jobs. Sleep. Feeding. Diapering. Getting dressed. Getting out the door.',
      'Those are the jobs your house needs to cover on day one, and they are the jobs that should anchor every opening decision.',
      'Most registries skip this step and go straight to product browsing, which is how you end up with a beautiful, curated list that does not actually solve a single Tuesday morning.',
      'This module introduces a different starting question: not "what should I add?" but "what job does this cover?"',
      'Run every candidate item through that filter once, and the registry stops being a wish list and starts being a plan.',
    ],
    coreSections: [
      {
        title: 'The five daily jobs your registry needs to cover',
        imageSrc: REGISTRY_PATH_IMAGES.firstBuys,
        imageAlt: 'Early registry planning setup focused on five core daily jobs.',
        paragraphs: [
          'Sleep is the first job. Where baby sleeps, how the space is set up, and what makes middle-of-the-night resets manageable — that is a job your registry should address with real items, not aspirational ones.',
          'Feeding is the second. Whether that is bottles, nursing support, or a combination approach, the feeding setup belongs near the top of the list before anything else does.',
          'Diapering and daily care is the third. It is high-frequency, unglamorous, and impossible to skip. The items that make this job faster are usually worth more than the items that make it cuter.',
          'Clothing and temperature management is the fourth. A practical wardrobe in the right size window — not a capsule collection, just enough — keeps this job from becoming an emergency at 2 AM.',
          'Movement is the fifth. One clear plan for getting baby from place to place, whether that is a stroller, a carrier, or both, closes the loop on what the household needs to function in the first weeks.',
          'That is the whole framework. Anything that does not serve one of these five jobs belongs on a private maybe list, not the public registry.',
        ],
      },
      {
        title: 'The which-job test',
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Simple framework for evaluating registry items by the job they cover.',
        paragraphs: [
          'Before adding anything, ask: which job does this cover?',
          'If the answer is clear and immediate, the item probably belongs. If the answer involves some version of "it might be useful if..." the item probably does not belong yet.',
          'This test does not make the registry boring. It makes it honest.',
          'The most common registry mistake is adding items that feel essential because of their price, their reviews, or the frequency with which they appear on other people\'s lists — not because they fill a real gap in your specific setup.',
          'One product solving one job well is worth more than three products circling the same job from slightly different angles.',
          'When in doubt, ask the question again. Which job? If the answer requires a paragraph, that is a sign.',
        ],
      },
      {
        title: 'What a covered job actually looks like',
        imageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
        imageAlt: 'Registry plan showing clearly covered jobs with no redundancy.',
        paragraphs: [
          'A covered job looks like a single clear answer, not a backup plan for every possible scenario.',
          'Sleep covered: one safe sleep surface, the right sheets, something that helps with sound or light if needed for your space. That is it.',
          'Feeding covered: items that support your most likely approach — not every approach, and not three versions of the same approach.',
          'Diapering covered: a changing setup with the supplies you will actually use at volume. Not the fanciest option. The functional one.',
          'What covered does not look like is two bouncers, four swaddle methods, and a travel bassinet for a trip you have not planned yet.',
          'Each job has a relatively simple answer once you remove the products competing for the same spot.',
        ],
      },
      {
        title: 'The later-chapter test',
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Registry items sorted into now vs later categories.',
        paragraphs: [
          'Some items only become useful once you have a baby in the house and a routine that has settled enough to know what is missing.',
          'These items are not wrong. They are just early.',
          'A good registry makes room for what you can confidently choose now, and routes the rest into a private later list that does not pressure your guests or inflate your opening draft.',
          'The later-chapter test is simple: does this item solve a problem you have not lived yet? If yes, move it to a private note and revisit it in month two.',
          'You will know much more then. And the item will either belong clearly or reveal itself as unnecessary.',
          'Registries that leave room for later information are almost always better than registries that try to solve every chapter in one sitting.',
        ],
      },
    ],
    decisionBullets: [
      'Anchor the opening draft to the five daily jobs: sleep, feeding, diapering, clothing, and movement.',
      'Run every item through the which-job test before adding it to the public list.',
      'One clear answer per job is more useful than multiple overlapping options for the same job.',
      'Move items that solve later-stage problems to a private note instead of the opening registry.',
      'A registry built around jobs is cleaner, easier to gift from, and much less stressful to finish.',
    ],
    products: [
      {
        name: 'Sleep Surface and Setup',
        description: 'The anchor item for job one — where baby sleeps and what makes that space work at 3 AM.',
        pros: ['First-job essential', 'Defines the rest of the sleep category'],
      },
      {
        name: 'Feeding Starter Kit',
        description: 'A category starter built around your most likely feeding approach, without covering every possible backup at once.',
        pros: ['Second-job essential', 'Keeps feeding setup grounded in your actual plan'],
      },
      {
        name: 'Diapering Station Basics',
        description: 'The workhorse category. High frequency, immediate need, and usually clearer to decide before baby arrives.',
        pros: ['Third-job essential', 'Used more than almost any other item in the first weeks'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'A useful registry tends to look a little boring at first.',
    softCtaBody: [
      'That is not a problem. That is the point.',
      'Once the five jobs are covered, there is room to add the things that feel good to give and good to receive — without the list drifting into chaos.',
    ],
    nextModuleSlug: 'where-to-register',
    previousModuleSlug: null,
  },
  {
    title: 'Where to Register',
    slug: 'where-to-register',
    moduleOrder: 2,
    description:
      'Platform mechanics determine how easy your registry is to build, edit, shop from, and return from. The logo on the page matters less than the infrastructure underneath it.',
    subhead: 'Choose the platform, not the branding.',
    imagePath: REGISTRY_PATH_IMAGES.registryPlatform,
    imageAlt: 'Registry platform selection editorial image for the Where to Register module.',
    intro: [
      'Once you know what belongs on your registry, the next question is where it should live.',
      'Most parents approach this decision backwards — they choose a store based on familiarity or perks, then try to fit their list into whatever that platform allows.',
      'The better approach is to understand what each platform type actually does, then choose the one that fits how your list works and how your guests shop.',
      'Platform mechanics are the hidden layer of the registry decision. The return policy, the guest checkout experience, the editing tools, the discount structure — these things affect the daily reality of having a registry far more than the brand name at the top of the page.',
      'This module is not about which retailer to choose. It is about what to look for when you are choosing.',
      'Four things matter: platform type, guest experience, return policy, and whether one list is better than two. That is the whole framework.',
    ],
    coreSections: [
      {
        title: 'What platform type you are actually choosing between',
        imageSrc: REGISTRY_PATH_IMAGES.whereToRegister,
        imageAlt: 'Registry platform comparison between single-retailer and universal registry types.',
        paragraphs: [
          'There are two types of registry platforms: retailer-based and universal.',
          'A retailer-based registry lives inside one store\'s ecosystem. Your list is made up of that store\'s products, your guests checkout through that store, and your perks come from that store. The tradeoff is simplicity — everything is in one place, and the return path is clean.',
          'A universal registry aggregates products from multiple sources into one list. You can include specialty items, local store finds, or products from retailers that do not have a native registry tool. The tradeoff is complexity — the guest experience can vary by item, and returns are handled by the original retailer, not a single registry platform.',
          'Neither is automatically better. If your list pulls heavily from one retailer and your guests are comfortable shopping there, a retailer registry simplifies everything. If your list genuinely spans multiple sources, a universal registry avoids the workaround of maintaining separate lists.',
          'The mistake is choosing based on which platform seems more impressive rather than which one matches how your list actually works.',
          'Start with that question. The platform type usually becomes obvious once you answer it honestly.',
        ],
      },
      {
        title: 'Guest checkout experience',
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Registry gifting experience showing clear checkout path for guests.',
        paragraphs: [
          'Your registry will be used by people who are not thinking as carefully about it as you are.',
          'Grandparents, coworkers, and friends who have not bought baby gear in years will arrive at your list, look for something in their budget, and try to check out. If that path has friction, they will go off-list, text you a question you did not expect, or buy something that does not match what you actually wanted.',
          'Friction is not a character flaw in your guests. It is a platform design problem.',
          'The clearest guest checkout paths are usually retailer-based registries at stores guests already have accounts with. The experience feels familiar because it is familiar.',
          'Universal registries can have cleaner guest experiences than they used to, but the experience still depends on which items are clicked and where they route for checkout.',
          'Before committing to a platform, click through the guest-facing side once. The question is not whether it looks good to you. It is whether it would feel easy to your mom at 7 PM on a Tuesday.',
        ],
      },
      {
        title: 'Return policies are part of the decision',
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Return policy and registry flexibility planning setup.',
        paragraphs: [
          'Nobody talks about return policies when they are building a registry. Everyone wishes they had once the baby arrives and the duplicate swaddles and wrong-size clothes start accumulating.',
          'Return policies affect two things: what happens when gifts do not work out, and what happens when you buy something during the completion discount window that turns out to be the wrong choice.',
          'Retailer-based registries typically have consolidated, extended return windows for registry items. Universal registries inherit whatever policy applies at the source retailer.',
          'The practical question is: if a gift arrives that does not fit your situation, how complicated is the process of returning or exchanging it?',
          'Some platforms offer registry return consolidation tools. Some do not. Knowing the answer before the gifts arrive is much better than figuring it out while sleep-deprived.',
          'This is not a dramatic consideration, but it is a real one. A smoother return path is worth factoring into the platform decision.',
        ],
      },
      {
        title: 'One clean public link versus multiple scattered registries',
        imageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
        imageAlt: 'Clean single registry list versus multiple scattered registry links.',
        paragraphs: [
          'Many parents are tempted to create registries at two or three different places — one for the perks, one for the flexibility, one because someone asked if they could shop at a specific store.',
          'The practical result is that gifts get fragmented, purchase tracking becomes unreliable, and guests spend more time figuring out which list to use than actually shopping.',
          'One primary registry usually works better than multiple scattered public links.',
          'If there is a secondary list you genuinely want — a specialty store, a local retailer, a specific category you cannot get elsewhere — keep it private and share it only when someone directly asks.',
          'The public registry is a guest-facing tool. It should make shopping easy, not give people research homework before they can choose a gift.',
          'Clarity here saves more friction than most parents expect. One clean link, one checkout experience, one place to see what has been purchased. That is the version that tends to work.',
        ],
      },
    ],
    decisionBullets: [
      'Choose platform type based on how your list actually works, not which store has the most appealing welcome kit.',
      'Walk the guest checkout path yourself before committing — if it is confusing for you, it will be harder for your guests.',
      'Understand the return policy before gifts arrive, not after.',
      'One primary public registry is almost always better than two or three scattered lists.',
      'Platform mechanics matter more than platform branding.',
    ],
    products: [
      {
        name: 'Universal Registry Platform',
        description: 'Pulls products from multiple retailers into one list — useful when your real list spans more than one store.',
        pros: ['Flexible across sources', 'One public link even with a diverse product list'],
      },
      {
        name: 'Retailer-Based Registry',
        description: 'Keeps the experience inside one store ecosystem with clean guest checkout and consolidated returns.',
        pros: ['Familiar guest checkout', 'Typically stronger perks and return windows'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The platform decision shapes everything that comes after it.',
    softCtaBody: [
      'A registry that is easy to manage, easy to edit, and easy for guests to use will cause you fewer headaches than the one that looked most impressive at signup.',
      'Pick the infrastructure that fits your list, then let the perks be a bonus — not the reason.',
    ],
    nextModuleSlug: 'shop-local-get-support',
    previousModuleSlug: 'what-to-register-first',
  },
  {
    title: 'Shop Local & Get Support',
    slug: 'shop-local-get-support',
    moduleOrder: 3,
    description:
      'Not every category needs an in-person visit, but some genuinely do. Knowing which is which is one of the most useful things you can learn before you start shopping.',
    subhead: 'Some gear requires physical contact. Most does not.',
    imagePath: REGISTRY_PATH_IMAGES.shopLocal,
    imageAlt: 'Registry support and guided shopping editorial image for the Shop Local & Get Support module.',
    intro: [
      'Online shopping is efficient, but it has a blind spot.',
      'Some categories — a meaningful number of them — require physical contact before you can make a confident decision.',
      'Not because reviews are wrong, but because the variables that matter most in those categories are weight, fold ergonomics, seat feel, handlebar height, and spatial presence in a car trunk.',
      'Those things do not translate to images and written descriptions the same way a bottle or a monitor does.',
      'This module does not tell you to go test everything in person. That would waste your time on categories where the in-store visit adds very little.',
      'It tells you which categories need physical contact, which ones do not, and how to make a store visit genuinely useful when you do go.',
    ],
    coreSections: [
      {
        title: 'Categories that require in-person testing',
        imageSrc: REGISTRY_PATH_IMAGES.strollerShopping,
        imageAlt: 'In-person stroller testing at a baby specialty store.',
        paragraphs: [
          'Strollers are the clearest example. The most important variables — fold mechanics, handlebar height, seat recline, how it feels to push with one hand, how it fits in your specific car trunk — are physically experienced, not read.',
          'A stroller that gets excellent reviews from parents with different heights, different cars, and different daily routines may feel like a completely different product in your hands. The only way to know is to try it.',
          'Car seats have a similar physical dimension. How the harness adjusts, how the base installs in your specific vehicle, and how the seat actually sits in your back seat are not things a description can fully resolve.',
          'Baby carriers and soft-structured carriers also belong in this category. The fit against a body is individual. Shoulder padding, waist belt placement, and fabric weight all vary significantly by body type and carry preference.',
          'For these categories, an in-person visit before purchasing is not overcautious. It is the efficient choice — it eliminates return shipping and replaces weeks of research with a thirty-minute session.',
          'The list is not long. But it matters.',
        ],
      },
      {
        title: 'Categories where online research is sufficient',
        imageSrc: REGISTRY_PATH_IMAGES.research,
        imageAlt: 'Registry research for categories that do not require in-person testing.',
        paragraphs: [
          'The majority of baby registry categories do not require a store visit. They require good research and a reasonable return policy.',
          'Monitors, swaddles, sleep sacks, bottles, bouncers, sound machines, diaper pails, changing pad covers, baby grooming kits, and most feeding accessories fall into this category.',
          'The variables that matter in these categories are size, specs, safety standards, and whether the design fits your space or routine. Those things can be assessed through descriptions, dimensions, and a reasonable sample of reviews.',
          'Going in-person for these categories often does not add useful information. You are looking at a box on a shelf rather than using the product in a way that illuminates whether it fits your life.',
          'Where parents lose time is spending in-person visits on these categories while skipping the visit for the categories that genuinely need it.',
          'Know the difference and you will spend your research time much more productively.',
        ],
      },
      {
        title: 'How to run a productive store visit',
        imageSrc: REGISTRY_PATH_IMAGES.hybridSupport,
        imageAlt: 'Productive baby store visit with stroller and car seat testing.',
        paragraphs: [
          'A productive store visit is a focused one. Go in knowing which two or three categories you are there to test, not to browse the whole store.',
          'For strollers: arrive knowing your car make and model, your approximate height and your partner\'s height, and whether you primarily need a one-hand fold for hands-full moments. Try the fold. Push it with one hand. Open the trunk on your car in the parking lot.',
          'For car seats: know your vehicle make, model, and year before you arrive. Ask whether they can show you the base installation. The demo will either confirm the fit or reveal a compatibility issue you would otherwise only discover at home.',
          'For carriers: wear what you would wear most days. The fit question is specific to your body and your clothing, not to a generic demo model.',
          'Bring the person who will be using the gear too, not just the person running the research. Two users, two opinions, one fewer post-purchase return.',
          'A prepared store visit takes thirty to sixty minutes and eliminates most of the uncertainty in the categories where physical testing actually matters.',
        ],
      },
      {
        title: 'Expert guidance versus general content',
        imageSrc: REGISTRY_PATH_IMAGES.expertGuidance,
        imageAlt: 'Expert baby gear guidance versus general influencer content.',
        paragraphs: [
          'The internet has an enormous amount of baby gear content. Most of it is not guidance. Most of it is content that performs like guidance.',
          'The difference is specificity. Real expert guidance asks about your car, your home layout, your daily routine, your budget, and your partner\'s height before recommending a stroller lane. General content says "here are the top five strollers for 2026" and applies it equally to everyone.',
          'One of those narrows your decision. The other gives you five more things to research.',
          'Independent baby stores tend to have people on the floor who have given stroller consultations to hundreds of families. That experience builds a pattern-recognition that most online content cannot replicate.',
          'If you can access a skilled consultant — local, virtual, or hybrid — one good conversation is almost always worth more than a week of saved posts.',
          'The goal is not more information. It is a shorter, more confident path to a decision. Expert guidance tends to produce that. General content tends to delay it.',
        ],
      },
    ],
    decisionBullets: [
      'Know which categories need physical testing before you book any store visits: strollers, car seats, and carriers are the core three.',
      'Do not waste in-person time on categories that can be researched effectively online.',
      'Arrive at the store with specific questions, not open-ended browsing intentions.',
      'Bring both users to test gear that depends on physical fit.',
      'One good expert conversation beats a week of general content for the categories that require real narrowing.',
    ],
    products: [
      {
        name: 'Independent Baby Store Consultation',
        description: 'A hands-on session with someone who tests and recommends gear regularly — especially useful for strollers and car seats.',
        pros: ['Physical testing in context', 'Pattern recognition from real experience with many families'],
      },
      {
        name: 'Virtual Registry Consultation',
        description: 'A conversation-based session for families without a local specialty store nearby, or when schedule flexibility matters more.',
        pros: ['Accessible from home', 'Good for narrowing categories before an in-store visit'],
      },
      {
        name: 'Target Baby Concierge',
        description: 'A guided registry walkthrough available at Target locations — useful for families who will register there and want in-person support.',
        pros: ['Available at most Target stores', 'Combines store familiarity with a guided experience'],
      },
    ],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'You do not need to see everything in person. You need to see the right things.',
    softCtaBody: [
      'A focused, well-prepared store visit for the physical-testing categories eliminates more uncertainty than months of research tabs.',
      'Know what you\'re going to test. Go test it. Make the decision and move on.',
    ],
    nextModuleSlug: 'welcome-boxes-perks',
    previousModuleSlug: 'where-to-register',
  },
  {
    title: 'Welcome Boxes & Registry Perks',
    slug: 'welcome-boxes-perks',
    moduleOrder: 4,
    description:
      'Welcome boxes are product sampling tools, not jackpots. Understanding how to use what is inside them is worth more than the box itself.',
    subhead: 'Treat samples like research data, not free stuff.',
    imagePath: REGISTRY_PATH_IMAGES.welcomeBox,
    imageAlt: 'Welcome boxes and registry perks editorial image for the Welcome Boxes & Registry Perks module.',
    intro: [
      'Every major baby registry platform offers some version of a welcome box.',
      'Most families treat it as a pleasant bonus. A small group of parents use it much more intentionally — and that group tends to buy less random stuff in the first few months.',
      'The distinction comes down to one mental reframe: samples are research tools, not gifts.',
      'A sample diaper is not a free diaper. It is an opportunity to test whether that diaper works on your baby before you commit to a case of them.',
      'A sample bottle is not a freebie. It is a chance to learn, before you register for six of the same one, whether your baby will take that particular nipple flow.',
      'That shift — from "free stuff" to "research data" — changes how you interact with the box and what decisions it actually supports.',
    ],
    coreSections: [
      {
        title: 'How to qualify and why timing matters',
        imageSrc: REGISTRY_PATH_IMAGES.openingWelcomeBox,
        imageAlt: 'Registry checklist completion step required to unlock welcome box perks.',
        paragraphs: [
          'Welcome boxes are not automatic. Each platform has its own qualification criteria, and the details tend to be more specific than the marketing copy suggests.',
          'Typical requirements include creating the registry, adding a minimum number of items, completing a checklist, or maintaining the registry for a minimum period before requesting the box.',
          'The mistake most families make is assuming the box will appear once the registry exists. It usually does not. There are steps, and the steps have windows.',
          'Sign up early — ideally in the second trimester — so you have time to meet the requirements without scrambling close to the due date.',
          'Read the platform\'s specific qualification page before you assume you have unlocked anything. The terms change, and "free welcome box" in the headline does not always mean "no conditions attached."',
          'This is administrative work, not exciting work. It is also reliably worth the five minutes it takes.',
        ],
      },
      {
        title: 'What is inside and why it is actually useful',
        imageSrc: REGISTRY_PATH_IMAGES.insideWelcomeBox,
        imageAlt: 'Flat lay of baby sample products from a registry welcome box.',
        paragraphs: [
          'Most welcome boxes include trial-size versions of products in the highest-preference-variation categories: diapers, wipes, nipple cream, postpartum pads, formula samples if applicable, and occasionally a small bottle or pacifier.',
          'These categories are not random. They are the categories where brand loyalty is driven almost entirely by what works on your specific body or your specific baby, and where that information is impossible to know in advance.',
          'A diaper that works perfectly for one baby leaks constantly on another. A nipple flow that one newborn takes immediately is refused by the next. Postpartum products that are widely recommended feel completely wrong to some people.',
          'Samples let you start collecting that information before you have committed to larger quantities.',
          'The box is not a substitute for buying those categories. It is the first round of information that makes buying them smarter.',
          'Use what is in the box, note what works, and let that data shape the registry.',
        ],
      },
      {
        title: 'The one-brand-at-a-time testing method',
        imageSrc: REGISTRY_PATH_IMAGES.welcomeBox,
        imageAlt: 'Registry product testing with one brand at a time approach.',
        paragraphs: [
          'If a welcome box includes samples from multiple brands in the same category, do not use them all simultaneously.',
          'Test one brand at a time, for at least a few days in the same category, before switching to the next.',
          'This matters because simultaneous testing produces inconclusive information. If you use two diaper brands in one week and have a leaking problem, you do not know which brand caused it. If you used one brand for three days and everything worked, you have a clear data point.',
          'For postpartum products, the same logic applies. Rotating through three nipple creams in a week tells you nothing useful. Testing one consistently for a few days tells you whether it is working for your body.',
          'The method sounds slow. It is actually the fastest path to a confident answer.',
          'Structured testing produces clear conclusions. Random sampling produces confusion and an eventual panic-buy of whichever product someone on your feed is loudest about.',
        ],
      },
      {
        title: 'What to do after the samples are used',
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Registry update and decision planning after using welcome box samples.',
        paragraphs: [
          'After testing, update the registry.',
          'If a sample diaper worked well, move that brand to the confirmed section of your list and adjust quantities. If it did not, remove it and replace it with a trial of the next brand.',
          'The same applies to any category where the sample gave you useful information. The box is not the end of the research — it is one round of it.',
          'Where families misuse the sample experience is treating it as permission to keep all options open indefinitely. The point of a sample is to narrow, not to expand.',
          'One brand that worked is worth more than five brands on standby. Make the call and move on.',
          'Your registry should get cleaner and more specific as information arrives, not more crowded with backup options.',
        ],
      },
    ],
    decisionBullets: [
      'Sign up early and read the qualification requirements for your specific platform before assuming the box is automatic.',
      'Reframe welcome box samples as research tools, not free gifts.',
      'Focus on preference-variable categories: diapers, wipes, bottles, postpartum basics.',
      'Test one brand at a time with enough time to evaluate results before switching.',
      'Use what you learn to update and narrow the registry, not to expand the backup inventory.',
    ],
    products: [
      {
        name: 'Registry Welcome Kit',
        description: 'A sample-based perk that opens a research opportunity in the categories where preference variation is highest.',
        pros: ['Covers highest-variation categories', 'Low-risk testing before bulk purchasing'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The box is useful. The method is what makes it actually valuable.',
    softCtaBody: [
      'One intentional round of testing with a clear conclusion updates your registry.',
      'Unstructured sampling just adds boxes to the counter and questions to the list.',
    ],
    nextModuleSlug: 'rewards-completion-discounts',
    previousModuleSlug: 'shop-local-get-support',
  },
  {
    title: 'Loyalty, Rewards & Completion Discounts',
    slug: 'rewards-completion-discounts',
    moduleOrder: 5,
    description:
      'The completion discount is the most misunderstood perk in the registry system. Most parents use it too early and leave most of the value on the table.',
    subhead: 'The completion discount works best when you use it last.',
    imagePath: REGISTRY_PATH_IMAGES.completionDiscount,
    imageAlt: 'Registry savings and planning editorial image for the Rewards & Completion Discounts module.',
    intro: [
      'Most registry platforms offer a completion discount window — typically 10 to 20 percent off remaining items — for a period around the due date.',
      'It sounds simple: buy what is left at a discount. But most families misuse it in the same specific way.',
      'They use the window too early, before gifts have arrived and before the list has been edited by real information.',
      'The result is paying a discounted price for things that would have been gifted, or buying categories that turn out to be the wrong choice once the baby is home.',
      'The completion discount rewards a specific strategy: gift first, edit with information, then buy what remains.',
      'That is the whole framework. Everything in this module is a version of that idea.',
    ],
    coreSections: [
      {
        title: 'What the window actually is and is not',
        imageSrc: REGISTRY_PATH_IMAGES.completionDiscount,
        imageAlt: 'Registry completion discount window timing and mechanics.',
        paragraphs: [
          'The completion discount is not a sale on everything. It is a discount on items remaining on your registry after a qualification point — usually tied to your due date or a minimum registry spend.',
          'The window itself varies by platform. Some give 60 days before the due date. Some start after. Some require a minimum number of purchases made through the registry before the discount activates.',
          'Critically: most completion discounts apply to a specific list of qualifying items and exclude certain categories, brands, or already-discounted products.',
          'Reading the actual terms — not the marketing headline — before you plan around the discount is the only way to know what you are actually working with.',
          'The most common mistake is arriving at the discount window expecting it to apply broadly and discovering mid-checkout that half the remaining list does not qualify.',
          'Know the rules before the window opens. Then plan accordingly.',
        ],
      },
      {
        title: 'The gift-first strategy',
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Gifting strategy that lets gifts arrive before using the completion discount.',
        paragraphs: [
          'The most effective completion discount strategy is patience.',
          'Let the shower happen. Let the gifts arrive. Let the thank-you notes go out. Then look at what remains on the list.',
          'What is left after gifts are accounted for is the real completion purchase list — not the phantom list you had before any gifting happened.',
          'Parents who use the discount window before the shower often spend it on items that arrive as gifts two weeks later, turning a 15 percent discount into a return trip and a store credit.',
          'The gift-first approach requires timing the shower early enough that gifts arrive before the completion discount window closes.',
          'If your shower is close to your due date, talk to whoever is hosting about pushing it earlier. The math usually works out in your favor.',
        ],
      },
      {
        title: 'Reward programs and how they actually work',
        imageSrc: REGISTRY_PATH_IMAGES.rewards,
        imageAlt: 'Registry reward program terms and what actually qualifies for points and credits.',
        paragraphs: [
          'Reward programs — points, cashback, store credits accumulated through registry purchases — are a secondary savings layer that most families underuse.',
          'They work best when you understand two things: what qualifies, and when the reward posts.',
          '"Qualifying purchases" is a term that does double duty in most programs — it sounds inclusive but often excludes sale items, certain brands, and third-party marketplace purchases.',
          '"Reward posts" sounds like it means the reward appears immediately. It usually means it posts on a delayed cycle — sometimes 30 to 90 days after purchase.',
          'If you are counting on reward credits to offset a completion discount purchase, verify that the credits will be available before the discount window closes.',
          'These programs are genuinely useful. They just require the same five minutes of terms-reading that saves you from assuming the savings will manage themselves.',
        ],
      },
      {
        title: 'Stacking discounts intelligently',
        imageSrc: REGISTRY_PATH_IMAGES.smartBuying,
        imageAlt: 'Stacking registry discounts, rewards, and timing for maximum savings.',
        paragraphs: [
          'The best registry savings come from combining the completion discount, accumulated rewards, and purchase timing in sequence.',
          'A rough version of that sequence looks like this: build the registry, qualify for the welcome box, accumulate any rewards through the gifting period, let the shower happen, check remaining items, then use the completion window on what genuinely remains.',
          'If your platform also offers cashback or store credit for purchases made through the registry, factor in when those credits become available before deciding which items to buy with personal funds versus which to route through registry purchase links.',
          'The goal is not to game the system. It is to avoid paying full price for things you were always going to buy anyway, and to not spend money twice on the same item because the timing was off.',
          'This is a ten-minute planning exercise that can easily save a few hundred dollars in total.',
          'It does not require a spreadsheet. It just requires not rushing.',
        ],
      },
    ],
    decisionBullets: [
      'Read the actual terms of your platform\'s completion discount before planning around it — not the headline, the full terms.',
      'Let gifts arrive before using the completion window so you are spending on what truly remains.',
      'Time your baby shower early enough that gifts arrive before the discount window closes.',
      'Understand the reward posting cycle before counting on credits to be available at a specific moment.',
      'Sequence gift arrival, reward accumulation, and completion purchasing in that order for the best outcome.',
    ],
    products: [
      {
        name: 'Registry Completion Discount Program',
        description: 'A discount window on remaining registry items — most valuable when used after gifting is complete and the true remaining list is clear.',
        pros: ['Reduces final purchase costs', 'Most effective when used at the end of the gifting period, not the beginning'],
      },
    ],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The discount rewards the plan, not the urgency.',
    softCtaBody: [
      'The parents who get the most out of the completion window are the ones who waited until the list was real before they used it.',
      'A shorter, more accurate remaining list plus a 15 percent discount is better than a long, uncertain list at the same discount.',
    ],
    nextModuleSlug: 'smart-purchasing-timeline',
    previousModuleSlug: 'welcome-boxes-perks',
  },
  {
    title: 'Smart Purchasing Timeline',
    slug: 'smart-purchasing-timeline',
    moduleOrder: 6,
    description:
      'Baby gear purchases happen in three distinct phases, and mixing them up is how families end up buying the right things at the wrong time — and paying for it twice.',
    subhead: 'Three phases of baby buying, and what belongs in each one.',
    imagePath: REGISTRY_PATH_IMAGES.purchasingTimeline,
    imageAlt: 'Registry purchasing timeline editorial image for the Smart Purchasing Timeline module.',
    intro: [
      'The single most common registry regret is not about the wrong product. It is about the wrong timing.',
      'Parents buy things in month five of pregnancy that they would have chosen differently in month eight. They buy things in month eight that they would have chosen differently after two weeks with a baby at home.',
      'The categories that reveal themselves over time — feeding preferences, soothing preferences, movement routines — are exactly the ones that are most heavily marketed before birth.',
      'The categories that should be bought confidently early are, by comparison, relatively quiet.',
      'This module introduces a three-phase purchasing framework that helps separate what you can know now from what you cannot, and routes each category to the phase where you will have the best information to decide.',
      'Nothing in the framework is rigid. It is a starting map, not a mandate.',
    ],
    coreSections: [
      {
        title: 'Phase One — what needs to exist before birth',
        imageSrc: REGISTRY_PATH_IMAGES.firstBuys,
        imageAlt: 'Phase one baby gear setup — essentials that need to exist before birth.',
        paragraphs: [
          'Phase One is the category of items that must be in place before baby comes home. These decisions have a defined deadline and enough objective criteria to make confidently.',
          'A safe sleep surface, the infant car seat and installed base, the initial diapering station with adequate supplies, newborn clothing in sizes that reflect real newborn dimensions (not the optimistic "newborn" sizing on most packaging), and whatever feeding setup matches your most likely approach.',
          'The phrase "most likely approach" is doing important work there. Phase One feeding setup means the baseline — enough to start with — not every possible feeding contingency at maximum supply.',
          'For gear with long shipping windows or installation requirements, Phase One purchases should happen by week 34 or 35 at the latest. That is not overcautious. It is appropriate margin.',
          'The distinguishing feature of a Phase One purchase is that you would have strong regret if it were not in place when the baby arrives. If the category would be survivable without it for a few days, it is probably Phase Two.',
          'Phase One is shorter than most registries suggest. That is a feature, not a gap.',
        ],
      },
      {
        title: 'Phase Two — what you will send someone to get',
        imageSrc: REGISTRY_PATH_IMAGES.nurseryCouple,
        imageAlt: 'Phase two baby gear — items that become clear in the first two weeks at home.',
        paragraphs: [
          'Phase Two is the category of items you will not know you need until you have been home for a few days.',
          'This is where most families get surprised — not because they failed to plan, but because some things only reveal themselves once baby is present and routines are live.',
          'Common Phase Two items include: a particular type of nursing pillow that works for your body position, a specific pacifier that baby actually takes, an additional swaddle style when the first one is constantly in the wash, blackout curtains once you discover the room is less dark than expected, or a specific white noise solution after you learn your baby\'s sleep environment preferences.',
          'These are not planning failures. They are information that only becomes available once the system is running.',
          'Phase Two purchases are typically small, relatively inexpensive, and fast to acquire. The model is: identify the gap, send a partner or family member, solve it same-day or next-day.',
          'Having a Phase Two mindset in advance — knowing this is normal and expected — removes a significant amount of new-parent anxiety when the gaps appear.',
        ],
      },
      {
        title: 'Phase Three — what reveals itself over months',
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Phase three baby gear — items that become relevant from months one through six.',
        paragraphs: [
          'Phase Three is the long tail: categories that become genuinely relevant somewhere between month one and month six, when the baby\'s preferences and the household\'s rhythms are clearer.',
          'This is where high chairs live. And baby food gear. And the "stage two" toys and activity items. And the sit-to-stand push toys, the bath seats, and a lot of the developmental gear that is heavily marketed to pregnant parents but used by infants.',
          'Phase Three is also where some Phase One decisions get revised — the stroller that worked great for newborn walks may get supplemented or replaced once the baby can sit up and the use case changes.',
          'The important distinction is that Phase Three items should stay off the pre-birth public registry unless they are gifts you genuinely want now and have clear, immediate storage for.',
          'Adding Phase Three items to the opening registry bloats the list, creates gifting confusion, and fills the house with gear that is useful in six months but takes up space now.',
          'Register for Phase One. Keep Phase Two in a private note. Let Phase Three come to you.',
        ],
      },
      {
        title: 'How to handle early-buying pressure',
        imageSrc: REGISTRY_PATH_IMAGES.overwhelm,
        imageAlt: 'Managing early buying pressure during pregnancy registry planning.',
        paragraphs: [
          'The cultural pressure to buy early and buy completely is real. It is also, in most cases, not aligned with how useful gear actually reveals itself.',
          'Some of it comes from genuine enthusiasm — from family members who want to give early, from friends who found something they loved and want to share it immediately.',
          'Some of it comes from marketing built around first-trimester anxiety, which is extremely productive anxiety for a lot of companies.',
          'The practical response is to have a clear answer for both categories: "We\'re doing our Phase One purchases around week 34 — can you help us with something from the registry then?" handles the family question.',
          '"This looks like something we might want after the baby is home" handles the product pressure. A private list, a future note, a screenshot folder — any of these is a reasonable placeholder that does not cost money now.',
          'Early buying is not inherently wrong. Buying Phase Two and Three items on a Phase One timeline is where the regret tends to come from.',
        ],
      },
    ],
    decisionBullets: [
      'Phase One covers the essentials that must exist before baby comes home — plan to have these by week 34 or 35.',
      'Phase Two covers the items that reveal themselves in the first two weeks — plan for flexibility, not for a pre-built backup inventory.',
      'Phase Three covers the gear that becomes relevant between months one and six — let it stay off the public registry until you know what you actually need.',
      'Early-buying pressure usually comes from family enthusiasm or marketing, not from real urgency.',
      'A clear three-phase framework turns "when do I buy this?" from an anxiety spiral into a practical decision.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'Three phases, much less regret.',
    softCtaBody: [
      'The parents who buy Phase One early and wait on everything else almost always feel better about their purchases than the parents who bought everything in one big push.',
      'Information is the most valuable variable in most baby gear decisions. Time is how you collect it.',
    ],
    nextModuleSlug: 'mistakes-to-avoid',
    previousModuleSlug: 'rewards-completion-discounts',
  },
  {
    title: 'Registry Mistakes to Avoid',
    slug: 'mistakes-to-avoid',
    moduleOrder: 7,
    description:
      'Registry bloat is almost never caused by bad products. It is caused by five specific cognitive patterns that are easy to identify once you know what to look for.',
    subhead: 'Five named traps that make registries longer without making them better.',
    imagePath: REGISTRY_PATH_IMAGES.overwhelm,
    imageAlt: 'Registry overwhelm editorial image for the Registry Mistakes to Avoid module.',
    intro: [
      'There is a specific kind of registry that looks responsible and exhaustive and prepared — and then arrives in boxes that fill a spare bedroom with items that never get used.',
      'The products are usually not the problem. The thinking patterns behind adding them are.',
      'Registry bloat almost always comes from one of five cognitive patterns. They each have a trigger, a manifestation inside the registry, and a question that cuts through them.',
      'Learning to recognize these patterns by name is the fastest way to keep an edit pass from turning into an argument about whether a product is good or bad.',
      'The patterns are: the research spiral, the anxiety hedge, the social proof pull, gifter guilt, and the feature halo.',
      'Most over-built registries contain at least three of these. Some contain all five.',
    ],
    coreSections: [
      {
        title: 'The research spiral',
        imageSrc: REGISTRY_PATH_IMAGES.research,
        imageAlt: 'Registry research spiral showing too many open browser tabs.',
        paragraphs: [
          'The research spiral is triggered by a feeling that more information will produce a safer decision.',
          'It manifests as an ever-expanding comparison list that keeps adding candidates instead of eliminating them. The registry starts with two stroller options and gradually becomes a tab with six, then nine, then a private document tracking twenty-two.',
          'The spiral feels productive. It is producing more and more content while the actual decision keeps getting deferred.',
          'What makes the spiral hard to break is that the information it generates is real information. Each new product has genuine features and legitimate reviews. The problem is not the information. It is the belief that one more comparison will deliver certainty that did not arrive from the previous fifty.',
          'The edit question for the research spiral: "If I found out this was the right choice and no longer had to research alternatives, would I feel relief or anxiety?" If relief — it is the right choice. If anxiety — the problem is the process, not the product.',
          'Narrowing to two strong candidates and choosing one is almost always the correct exit from this pattern.',
        ],
      },
      {
        title: 'The anxiety hedge',
        imageSrc: REGISTRY_PATH_IMAGES.overwhelm,
        imageAlt: 'Registry anxiety hedge showing duplicate safety-oriented items.',
        paragraphs: [
          'The anxiety hedge is triggered by uncertainty about what the baby will need or prefer.',
          'It manifests as parallel registrations in the same category: two types of bottles "just in case," three swaddle styles "because babies are all different," backup soothing items for every possible scenario.',
          'The anxiety hedge is uniquely resistant to editing because its logic is emotionally sound. Babies are unpredictable. Having options feels responsible.',
          'What the hedge misses is that when all options are present simultaneously, none of them get a real test. If three bottle brands are in the house at once, you will rotate through them randomly rather than testing one long enough to draw a conclusion. You end up with partial information about everything and clear information about nothing.',
          'The edit question for the anxiety hedge: "Am I registering for a backup, or for a whole parallel system?" A backup is one item in a second category. A parallel system is solving the same problem from six directions at once.',
          'Keep one clear first option. Move the backup to a private list. Buy the backup only if the first option fails.',
        ],
      },
      {
        title: 'The social proof pull',
        imageSrc: REGISTRY_PATH_IMAGES.expertGuidance,
        imageAlt: 'Social media influence on baby registry decisions.',
        paragraphs: [
          'The social proof pull is triggered by seeing someone else confidently recommend something, especially someone who seems similarly situated.',
          'It manifests as adding items to the registry based on enthusiasm borrowed from someone else\'s experience — without running that item through the which-job test or checking whether the variable that made it work for them is the same variable you have.',
          'Social proof is a reasonable heuristic. If a large number of people with similar situations love a product, that is useful signal.',
          'The problem is specificity. The stroller that a 5\'4" person with a Honda CR-V loves may be a genuinely poor fit for a 6\'1" person with a compact sedan. The bottle an exclusively breastfed baby refused may be exactly what a formula-fed baby accepts immediately.',
          'The edit question for the social proof pull: "Does the reason they love this apply to my situation?" If you cannot answer that question, you are borrowing their conclusion without the context that generated it.',
          'One grounded reason this works for your specific situation is worth more than fifty enthusiastic recommendations from different situations.',
        ],
      },
      {
        title: 'Gifter guilt',
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Registry inflated by gifter guilt and price range concerns.',
        paragraphs: [
          'Gifter guilt is triggered by thinking about the person who will be shopping rather than the function of the item.',
          'It manifests as adding items that feel giftable — usually items that photograph well or arrive in attractive packaging — rather than items that solve real problems.',
          'It also manifests as keeping price placeholders on the list so there are options across many budget ranges, even when some of those options are duplicates of items in other price ranges that do the same job.',
          'The underlying feeling is that editing the registry too aggressively will leave guests without enough good options. It is a generous impulse.',
          'But a registry filled with things you do not actually need is not a gift to your guests. It is a request for items that will clutter your house or get returned.',
          'The edit question for gifter guilt: "Would I buy this for myself if no one was looking?" If the answer is no, it is a gifter-guilt item.',
          'A clear, edited registry with obvious price variety is more generous to guests than a padded registry that obscures what you actually want.',
        ],
      },
      {
        title: 'The feature halo',
        imageSrc: REGISTRY_PATH_IMAGES.smartBuying,
        imageAlt: 'Registry feature halo effect showing premium gear added for the wrong reasons.',
        paragraphs: [
          'The feature halo is triggered by a list of impressive specifications on a product page.',
          'It manifests as adding a product because of features that sound valuable but are not actually relevant to how you will use the item.',
          'A stroller with a one-second fold sounds extraordinary until you realize that all quality strollers fold in under ten seconds and the difference between a one-second fold and a three-second fold will not meaningfully affect your life.',
          'A baby monitor with twelve connectivity features sounds more secure until you realize you live in a 1,200 square foot house and the basic model has more than adequate range.',
          'The feature halo works because features are easy to compare and easy to impress with. Actual fit to your real life is harder to assess from a product page.',
          'The edit question for the feature halo: "Which of these features will I actually use in my specific situation, and how many?" If the honest answer is one or two, the feature list is not a reason to prefer this product over a simpler one that does those same things well.',
          'More features is not better gear. It is more expensive gear with a longer spec sheet.',
        ],
      },
    ],
    decisionBullets: [
      'The research spiral: narrow to two candidates, choose one, and stop.',
      'The anxiety hedge: keep one clear first option and move the backup to a private list.',
      'The social proof pull: borrow enthusiasm only when the context matches yours.',
      'Gifter guilt: ask whether you would buy the item for yourself — if not, remove it.',
      'The feature halo: count only the features you will actually use, not the ones that sound impressive.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'The edit pass is not about eliminating good products.',
    softCtaBody: [
      'It is about eliminating the thinking patterns that put them on the list for the wrong reasons.',
      'A registry that passes the five-pattern check is not a minimal registry. It is a confident one.',
    ],
    nextModuleSlug: 'baby-showers-gifting',
    previousModuleSlug: 'smart-purchasing-timeline',
  },
  {
    title: 'Baby Showers & Gifting Strategy',
    slug: 'baby-showers-gifting',
    moduleOrder: 8,
    description:
      'The baby shower is a logistics event that determines how much of your registry gets covered by gifts before you have to spend your own money. Most parents treat it as a party. The ones who get the most from it treat it as both.',
    subhead: 'The shower is a logistics event. Plan it like one.',
    imagePath: REGISTRY_PATH_IMAGES.babyShowerBalloon,
    imageAlt: 'Baby shower and gifting editorial image for the Baby Showers & Gifting Strategy module.',
    intro: [
      'Every registry ends with a baby shower. Most people think of the shower as the celebration that comes after the registry work is done.',
      'The more useful frame is to think of the shower as an integrated part of the registry strategy — because the timing, structure, and clarity of the shower directly affect how much of your list gets covered by gifts versus your own wallet.',
      'A shower that happens at 36 weeks does not leave time for a post-shower registry refresh before the completion discount window closes.',
      'A shower with an unclear or overwhelming registry produces off-list gifts and a post-shower inbox full of questions about returns.',
      'A shower list that is easy to shop — clear items, varied price range, obvious gifting priority — produces high on-list gifting rates and very few "I just got you something small" duplicates.',
      'None of this requires turning the shower into a planning spreadsheet. It just requires understanding the logistics before the invitations go out.',
    ],
    coreSections: [
      {
        title: 'Shower timing relative to your registry strategy',
        imageSrc: REGISTRY_PATH_IMAGES.babyShower,
        imageAlt: 'Baby shower timing and its relationship to registry completion strategy.',
        paragraphs: [
          'The optimal shower window, from a registry strategy perspective, is between weeks 28 and 34.',
          'Earlier than 28 weeks and many guests feel like things are still too early to shop with confidence. Later than 34 weeks and the turnaround time between gifts arriving and the completion discount window closing gets very tight.',
          'The math is simple: you want gifts to arrive, be opened and tracked, and the remaining list to be updated — all before you use the completion discount on what is actually left.',
          'If the shower happens at 34 weeks and the completion discount starts at 36 weeks, that is a two-week window that tends to feel rushed when combined with the rest of late-pregnancy preparation.',
          'If you do not have control over the timing because someone else is hosting, communicate the timeline to the host early. Ask that the shower happen by a specific week and explain why. Most people hosting a shower want it to be useful.',
          'Timing the shower is the least glamorous part of this process. It is also one of the most directly impactful decisions on how much the registry actually saves you.',
        ],
      },
      {
        title: 'Making the list easy to shop',
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Registry clarity and price range variety that makes gifting easier.',
        paragraphs: [
          'A registry that is easy to shop produces better gifting outcomes than a registry that is comprehensive.',
          'Easy to shop means three things: clear items with minimal ambiguity about size, color, or version; a genuine spread of price points so guests with different budgets can find something comfortable; and a list that has been edited enough that everything on it is actually wanted.',
          'Most guests will click through the registry, look at what is in their budget range, and choose something that looks clear and useful. If that process takes less than five minutes, they feel good about the gift. If it takes twenty minutes of comparison and second-guessing, they often go off-list.',
          'Going off-list is not a character flaw. It is the natural response to a registry that does not make the choice obvious.',
          'Before the shower, scroll through your registry as if you were a guest with a $50 budget. Can you find three or four clear options easily? If not, edit until you can.',
          'Clear and easy wins over comprehensive and thorough every time.',
        ],
      },
      {
        title: 'The post-shower registry refresh',
        imageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
        imageAlt: 'Post-shower registry update and completion list refresh.',
        paragraphs: [
          'Within one to two weeks of the shower, update the registry to reflect what arrived.',
          'Mark purchased items. Remove items that were given off-list but cover the same job as something on the list. Adjust quantities if you received multiples of something.',
          'This refresh has two purposes. First, it gives you a clear picture of what still needs to be purchased — which is the actual input for the completion discount phase.',
          'Second, it keeps the registry current for late buyers. There are always guests who could not attend, who ship late, or who buy after the shower. A registry that still shows already-purchased items as available creates duplicate gifts.',
          'The refresh takes less than an hour and produces a much cleaner completion purchase list.',
          'It is the step that connects the shower back to the savings strategy, and most parents skip it because it feels like post-event administrative work.',
          'It is worth doing.',
        ],
      },
      {
        title: 'Off-registry gifts and duplicates',
        imageSrc: REGISTRY_PATH_IMAGES.babyPresents,
        imageAlt: 'Off-registry baby shower gifts and how to handle duplicates.',
        paragraphs: [
          'Off-registry gifts will happen. Some of them will be things you genuinely needed and would have chosen yourself. Some will not.',
          'The key to handling them well is having a clear return and exchange policy in place before the shower — not after the gifts arrive.',
          'Most major retailers have extended registry return windows. Some go to 90 days or longer. Knowing this in advance means you are not in the position of trying to remember where something was purchased three months after the shower.',
          'For duplicates: if you receive two of the same item, return or exchange one promptly rather than keeping both. Two of something you need is not twice the value. It is one item you use and one item that takes up storage space and eventually gets donated.',
          'The gift receipt approach is worth asking for consistently. A brief note in the shower invitation or with the registry link that says "gift receipts are always appreciated" is completely normal and makes returns much simpler.',
          'People who give off-registry gifts typically want you to have something useful. Making returns easy honors that intention.',
        ],
      },
      {
        title: 'The late buyer',
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Registry management for late buyers and post-shower purchases.',
        paragraphs: [
          'Late buyers are guests who purchase after the shower — sometimes by days, sometimes by months.',
          'They are often family members who could not attend, coworkers who are doing a group gift, or people who genuinely intended to shop early and did not.',
          'The updated post-shower registry is your best tool for the late buyer. If the registry is current, they land on a list that reflects real remaining needs rather than items that were already gifted.',
          'Two things make the late buyer experience better for everyone: a current registry and a note on the registry page (most platforms allow a short message) that says something like "updated after our shower — anything remaining is something we genuinely still need."',
          'That note removes the uncertainty a late buyer feels about whether the remaining items are actually wanted or just forgotten placeholders.',
          'After the baby arrives, it is worth leaving the registry active for four to six weeks. Some gifts arrive after the birth. Some guests want to send a small something once the baby is here.',
          'A current registry is always more useful than a stale one.',
        ],
      },
    ],
    decisionBullets: [
      'Time the shower between weeks 28 and 34 to leave enough gap before the completion discount window.',
      'Make the registry easy to shop — clear items, varied price range, edited list — before invitations go out.',
      'Do the post-shower registry refresh within two weeks to create an accurate completion purchase list.',
      'Ask for gift receipts consistently and have a return plan in place before the shower.',
      'Keep the registry current for four to six weeks after the birth for late buyers.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'You have finished the Registry Path.',
    softCtaBody: [
      'The registry is one chapter. The gear decisions that support it — strollers, car seats, nursery setup — are the next ones.',
      'When you are ready, the Gear Path picks up exactly where this one left off.',
    ],
    nextModuleSlug: null,
    previousModuleSlug: 'mistakes-to-avoid',
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
    `## Module ${module.moduleOrder} of ${module.totalModules} · Registry`,
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

  lines.push('', `## ${module.softCtaLabel}`, '', module.softCtaTitle, '');
  module.softCtaBody.forEach((paragraph) => {
    lines.push(paragraph, '');
  });

  lines.push('', '## Next Steps', '');
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
).sort((left, right) => left.moduleOrder - right.moduleOrder);

export const REGISTRY_ACADEMY_MODULES_BY_SLUG = Object.fromEntries(
  REGISTRY_ACADEMY_MODULES.map((module) => [module.slug, module]),
) as Record<RegistryAcademyModuleSlug, RegistryAcademyModuleRecord>;

export function isRegistryAcademyModuleSlug(value: string): value is RegistryAcademyModuleSlug {
  return value in REGISTRY_ACADEMY_MODULES_BY_SLUG;
}

export function getRegistryAcademyModule(slug: RegistryAcademyModuleSlug) {
  return REGISTRY_ACADEMY_MODULES_BY_SLUG[slug];
}
