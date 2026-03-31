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
export const REGISTRY_PATH_IMAGES = {
  whereToRegister: '/assets/registrypath/universalregistry.png',
  guestGifting: '/assets/registrypath/gifts.png',
  planning: '/assets/registrypath/planning.png',
  shopLocal: '/assets/registrypath/strollershopping.png',
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
    title: 'Where to Register',
    slug: 'where-to-register',
    moduleOrder: 1,
    description: 'Choose the registry setup that fits your perks, your guests, and how much flexibility you actually want.',
    subhead: 'Choosing the right platform matters more than most people realize.',
    imagePath: REGISTRY_PATH_IMAGES.whereToRegister,
    imageAlt: 'Registry planning editorial image for the Where to Register module.',
    intro: [
      'Most parents think a registry is just a list.',
      'In reality, it is a system.',
      'Where you register affects what perks you get, how easy it is to manage, and how flexible your options are.',
      'It also affects how easy the list feels for the people actually trying to buy from it, which is the part many families do not fully consider until the texts start rolling in.',
      'The logo on the page matters a lot less than the experience underneath it.',
      'A good registry platform makes editing, gifting, returns, and later buying feel clean. A messy one makes every next step a little more annoying than it needed to be.',
      'This is not just a technical decision. It is a strategic one.',
    ],
    coreSections: [
      {
        title: 'Single retailer vs universal registry',
        imageSrc: REGISTRY_PATH_IMAGES.whereToRegister,
        imageAlt: 'Clean desk with laptop and registry planning setup.',
        paragraphs: [
          'Some registries are tied to one store. Others let you pull products from anywhere.',
          'A universal registry gives you flexibility. A single retailer can offer stronger perks.',
          'A single-retailer registry is often easier for guests because the buying path is obvious, the returns are cleaner, and the perks usually live in one dashboard.',
          'A universal registry is stronger when your real list pulls from specialty brands, local stores, or products that do not live neatly under one roof.',
          'Neither option is automatically smarter. The better choice depends on whether you care more about customization, convenience, or a little of both.',
          'TMBC logic is simple here: choose the system that makes real-life shopping easier, not the one that sounds the most impressive in theory.',
        ],
      },
      {
        title: 'Ease for your guests',
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Minimal gifting setup with wrapped baby gifts in neutral tones.',
        paragraphs: [
          'Your registry is not just for you. It needs to feel easy for the people using it.',
          'Simple navigation, clear product choices, and a familiar checkout experience matter more than people expect.',
          'Some guests will happily compare options and click around. Others want one clean link, one clear list, and a checkout process that does not feel like an escape room.',
          'If the registry feels confusing, people do not usually become more strategic. They go off list, buy duplicates, or text you while standing in the store.',
          'That does not make them difficult. It makes them normal.',
          'A registry that is easy to shop is one of the quietest ways to keep gifting useful.',
        ],
      },
      {
        title: 'Long-term flexibility',
        imageSrc: REGISTRY_PATH_IMAGES.planning,
        imageAlt: 'Neutral workspace with registry planning notes.',
        paragraphs: [
          'Your needs will change as you go, and the registry should be able to change with you.',
          'Choose a platform that lets you swap items, adjust quantities, and update priorities without friction.',
          'This matters because the first registry draft is rarely the final version. Your room plan changes. Your gear shortlist tightens. Your sense of what actually belongs gets better.',
          'A platform with stronger editing tools, cleaner returns, and better visibility into what has been purchased makes those revisions much less dramatic.',
          'That flexibility matters even more once you start timing discounts, late additions, and final purchases.',
          'A calmer registry is usually a registry that can evolve without turning into administrative theater.',
        ],
      },
    ],
    decisionBullets: [
      'Choose the registry for the shopping and return experience, not the welcome-box headline.',
      'If your people mostly shop one retailer easily, simplicity may matter more than maximum flexibility.',
      'If your list genuinely spans specialty brands and multiple stores, a universal registry can be the cleaner answer.',
      'One primary public registry is usually easier than multiple scattered public links.',
      'Perks are helpful. Usability is usually more important.',
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
    softCtaBody: [
      'Small decisions here affect everything that follows, from guest experience to returns to how easy it feels to finish the list later.',
      'If the setup feels cleaner now, the rest of the registry process usually gets quieter fast.',
    ],
    nextModuleSlug: 'welcome-boxes-perks',
    previousModuleSlug: null,
  },
  {
    title: 'Shop Local & Get Support',
    slug: 'shop-local-get-support',
    moduleOrder: 3,
    description:
      'Use local stores, hybrid shopping, and real expert guidance so registry decisions feel calmer, faster, and much less isolating.',
    subhead: 'Shop locally, think strategically, and stop trying to figure this out alone.',
    imagePath: REGISTRY_PATH_IMAGES.shopLocal,
    imageAlt: 'Registry support and guided shopping editorial image for the Shop Local & Get Support module.',
    intro: [
      'Once you know where your registry lives, the next question becomes where you should actually shop.',
      'This is where most parents fall into the same pattern: they scroll, compare, read reviews, watch videos, and try to piece everything together on their own.',
      'The shift that changes everything is realizing you do not need more research. You need better guidance.',
      'Registry decisions get dramatically easier when you can ask one grounded question and get one grounded answer instead of ten tabs arguing with each other.',
      'This module is really about reducing isolation in the decision-making process.',
      'Because baby gear confusion is rarely a sign that you need to try harder. It is usually a sign that the category needs a better guide.',
    ],
    coreSections: [
      {
        title: 'Start here: shop local if you can',
        imageSrc: REGISTRY_PATH_IMAGES.shopLocal,
        imageAlt: 'Independent baby store shopping and stroller testing setup.',
        paragraphs: [
          'Before anything else, check whether there is a locally owned baby store near you.',
          'Independent stores let you test strollers in person, compare car seats side by side, feel the materials, and ask questions that actually apply to your life.',
          'That kind of hands-on guidance is often the closest thing to having someone walk through the registry with you in real time.',
          'It also gives you a faster read on what feels solid, what folds badly, what looks nicer online than in person, and what will annoy you by week two.',
          'Local support is not always cheaper, but it is often more clarifying.',
          'And clarity saves money in its own very glamorous way.',
        ],
      },
      {
        title: 'Hybrid and virtual support',
        imageSrc: REGISTRY_PATH_IMAGES.hybridSupport,
        imageAlt: 'Virtual baby registry consultation and shopping support.',
        paragraphs: [
          'If a local store is not available or your schedule does not leave much room for in-person visits, there is still a strong middle ground.',
          'Hybrid shopping lets you learn virtually, confirm in store when needed, and build the registry with actual support instead of guesswork.',
          'Virtual guidance works best when it feels like a real conversation about your lifestyle, not just another product page with better branding.',
          'A good hybrid setup can narrow the category before you ever set foot in a store, which makes in-person time much more productive.',
          'It can also help partners or long-distance family members stay involved without turning the whole process into group homework.',
          'The goal is not to create more steps. It is to make the steps you take more useful.',
        ],
      },
      {
        title: 'Experts vs influencers',
        imageSrc: REGISTRY_PATH_IMAGES.expertGuidance,
        imageAlt: 'Editorial comparison between expert guidance and general baby product content.',
        paragraphs: [
          'There is a lot of baby content online, but much of it is sponsored, generalized, or built to sell faster than it guides.',
          'Real guidance sounds different. It explains why something works for your car, your home, your routine, and your priorities.',
          'It also leaves room for tradeoffs. Good advice is rarely, "This is the best stroller for everyone on earth."',
          'The fastest way to clarity is not more content. It is the right conversation with someone who can help you narrow instead of overwhelm.',
          'TMBC is firmly pro-expertise and mildly skeptical of anyone who says one product changed their whole life before breakfast.',
          'You do not need louder recommendations. You need better filters.',
        ],
      },
    ],
    decisionBullets: [
      'You do not have to figure everything out alone.',
      'Start with real expert support, whether that is local, virtual, or hybrid.',
      'Use support to narrow the biggest gear categories before they dominate the list.',
      'Hands-on clarity is often worth more than another week of scrolling.',
      'The right conversation can remove more noise than ten saved posts ever will.',
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
      'That is not outsourcing the decision. That is making the decision with a smarter set of inputs.',
    ],
    nextModuleSlug: 'rewards-completion-discounts',
    previousModuleSlug: 'welcome-boxes-perks',
  },
  {
    title: 'Welcome Boxes & Registry Perks',
    slug: 'welcome-boxes-perks',
    moduleOrder: 2,
    description: 'Use welcome boxes on purpose so they become product testing and early value, not random freebies you forget about.',
    subhead: "The hidden benefits most parents don't fully use.",
    imagePath: REGISTRY_PATH_IMAGES.welcomeBox,
    imageAlt:
      'Welcome boxes and registry perks editorial image for the Welcome Boxes & Registry Perks module.',
    intro: [
      'Many registries offer welcome boxes, but most families do not realize how to use them well.',
      'This is where your registry starts to give back.',
      'Handled intentionally, these perks can help you test products, reduce early spending, and learn what works before you buy more.',
      'Handled randomly, they turn into one more pile of samples you feel vaguely responsible for.',
      'The box itself is not the strategy. The way you use what is inside can be.',
      'This module is about getting the value without letting the freebies become the main character.',
    ],
    coreSections: [
      {
        title: 'What welcome boxes actually include',
        imageSrc: REGISTRY_PATH_IMAGES.insideWelcomeBox,
        imageAlt: 'Flat lay of baby sample products in soft neutral tones.',
        paragraphs: [
          'Welcome boxes often include sample products, essentials, and trial sizes.',
          'They are designed to introduce you to brands before you commit to full-size purchases.',
          'That makes them more useful as testing tools than as some grand registry jackpot.',
          'The real win is not the dollar value on the promo page. It is the chance to test a bottle, diaper, wipe, or postpartum basic without buying a full commitment first.',
          'That is especially helpful in categories where baby preference and body preference are very real.',
          'A sample is data. Treat it like data.',
        ],
      },
      {
        title: 'How to qualify',
        imageSrc: REGISTRY_PATH_IMAGES.openingWelcomeBox,
        imageAlt: 'Laptop with registry checklist in progress.',
        paragraphs: [
          'Each platform has its own requirements, and that is where families often miss the window.',
          'Usually you need to create the registry, add items, and complete a few minimum actions before the box unlocks.',
          'Usually you need to create the registry, add items, and complete a few minimum actions before the box unlocks.',
          'That sounds simple until you assume it will happen automatically and then realize a deadline, purchase minimum, or checklist percentage was involved.',
          'Sign up early enough that you can meet those steps without scrambling later.',
          'This is one of those annoyingly administrative details that is much easier when handled early.',
        ],
      },
      {
        title: 'Why they matter',
        imageSrc: REGISTRY_PATH_IMAGES.welcomeBox,
        imageAlt: 'Minimal baby products neatly arranged.',
        paragraphs: [
          'These boxes help you test products, reduce initial spending, and discover what works in real life.',
          'They are especially useful for the categories where preferences vary more than people expect.',
          'They can also reduce pressure to buy every small category perfectly on the first try.',
          'Think of them as low-stakes information, not as proof you now need the full brand lineup.',
          'One sample pacifier does not mean you are now in a long-term relationship with that brand.',
          'The purpose is to learn faster and spend a little smarter.',
        ],
      },
    ],
    decisionBullets: [
      'Sign up early.',
      'Understand the requirements before you assume the perk is automatic.',
      'Use samples to test preference, not to build a bigger shopping list.',
      'Treat welcome boxes as support for the registry plan, not as the reason for the registry plan.',
      'Take the value. Skip the category creep.',
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
    softCtaBody: [
      'But only if you approach it intentionally.',
      'The sample is useful. The discipline to not spiral into fifteen related purchases is even more useful.',
    ],
    nextModuleSlug: 'shop-local-get-support',
    previousModuleSlug: 'where-to-register',
  },
  {
    title: 'Loyalty, Rewards & Completion Discounts',
    slug: 'rewards-completion-discounts',
    moduleOrder: 4,
    description: 'Use discounts, rewards, and timing together so you can save well without filling the house too early.',
    subhead: 'How to save without overbuying.',
    imagePath: REGISTRY_PATH_IMAGES.rewards,
    imageAlt: 'Registry savings and planning editorial image for the Rewards & Completion Discounts module.',
    intro: [
      'This is where strategy matters.',
      'Timing your purchases well can save you more than most people expect.',
      'The goal is not to buy everything at once. It is to let the registry work for you before you start closing the gaps yourself.',
      'This part rewards patience, which is not always the internet\'s favorite personality trait.',
      'But it is often the difference between buying once with intention and buying twice because the first pass happened too early.',
      'Registry savings work best when they are attached to a plan, not a panic.',
    ],
    coreSections: [
      {
        title: 'Completion discounts',
        imageSrc: REGISTRY_PATH_IMAGES.rewards,
        imageAlt: 'Soft image of baby products neatly arranged.',
        paragraphs: [
          'Most registries offer a discount window before your due date.',
          'That is your chance to buy the remaining essentials at a lower cost after gifts and priorities have settled a bit.',
          'The value comes from waiting long enough to see what still needs to be purchased.',
          'Completion discounts are most useful when the list has already been edited by actual gifts, changing priorities, and a clearer sense of what belongs.',
          'If you shop too early, you waste part of the advantage on items that might have been gifted or cut later.',
          'The discount window is not the starting gun. It is the cleanup pass.',
        ],
      },
      {
        title: 'Reward programs',
        imageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
        imageAlt: 'Minimal credit and reward concept visual.',
        paragraphs: [
          'Some retailers also offer points, credits, or cashback through their registry systems.',
          'Those programs can help, but only if you understand what qualifies and when the reward actually posts.',
          'Those details matter because "reward" can mean store credit later, category exclusions, or a threshold that is easier to miss than the marketing copy suggests.',
          'If the rules are fuzzy, read them before you assume the savings will stack themselves.',
          'This is not glamorous work, but it is excellent money-saving behavior.',
          'A five-minute read of the terms can be more valuable than another registry coupon email.',
        ],
      },
      {
        title: 'Stackable savings',
        imageSrc: REGISTRY_PATH_IMAGES.smartBuying,
        imageAlt: 'Organized shopping setup with minimal items.',
        paragraphs: [
          'The real advantage comes from combining discounts, rewards, and timing.',
          'That might mean waiting for the completion window, then using earned credits or retailer rewards on the final essentials.',
          'It may also mean separating truly urgent buys from late-stage buys so you can let the better discounts work on the right items.',
          'A little strategy here usually beats a lot of early, scattered shopping.',
          'This is where the registry shifts from being a list to being a financial tool.',
          'And no, that is not overkill. Baby gear is expensive enough to justify a plan.',
        ],
      },
    ],
    decisionBullets: [
      'Do not rush to fill every gap before the registry has had time to do its job.',
      'Use the completion window for the items that truly remain.',
      'Understand which rewards are real, which are delayed, and which come with strings attached.',
      'Stack discounts carefully instead of assuming the checkout page will do the thinking for you.',
      'Patience is often the highest-yield registry strategy.',
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
    softCtaBody: [
      'A little patience here can save you from paying full price for the things you were always going to buy anyway.',
      'Let the list get edited before you reach for your own wallet too aggressively.',
    ],
    nextModuleSlug: 'smart-purchasing-timeline',
    previousModuleSlug: 'welcome-boxes-perks',
  },
  {
    title: 'Smart Purchasing Timeline',
    slug: 'smart-purchasing-timeline',
    moduleOrder: 5,
    description: 'Buy in phases so the essentials get covered, the maybes stay flexible, and the discount windows still do their job.',
    subhead: 'When to buy matters just as much as what you buy.',
    imagePath: REGISTRY_PATH_IMAGES.purchasingTimeline,
    imageAlt: 'Registry purchasing timeline editorial image for the Smart Purchasing Timeline module.',
    intro: [
      'One of the biggest mistakes parents make is buying everything too early.',
      'That usually creates unnecessary spending, clutter, and regret.',
      'A smarter timeline gives your registry room to work before the boxes start stacking up in the corner.',
      'It also gives your actual decision-making time to catch up with your enthusiasm.',
      'Some categories deserve early action. Others only feel urgent because they are heavily marketed or unusually photogenic on social media.',
      'This module is about putting the buying order back in a calmer, more useful sequence.',
    ],
    coreSections: [
      {
        title: 'What to buy first',
        imageSrc: REGISTRY_PATH_IMAGES.firstBuys,
        imageAlt: 'Minimal nursery setup early stage.',
        paragraphs: [
          'Start with the nursery foundation and the first-stage essentials that support life right away.',
          'These are the categories that make the house work, not just the registry look complete.',
          'If an item solves an immediate daily job, it probably belongs earlier in the timeline.',
          'Think sleep setup, diapering flow, feeding basics, and the items that keep the first weeks from feeling chaotic.',
          'The first-pass purchases should make the house more functional, not just fuller.',
          'Useful beats impressive here every time.',
        ],
      },
      {
        title: 'What to wait on',
        imageSrc: REGISTRY_PATH_IMAGES.registryPlanning,
        imageAlt: 'Soft image of optional baby gear.',
        paragraphs: [
          'Some items can wait, especially extra gear, duplicates, and upgrades.',
          'A lot of later-stage products look urgent on paper and much less urgent once the baby actually arrives.',
          'Waiting is not under-preparing. It is often how you avoid buying the wrong version too soon.',
          'A delayed purchase is sometimes just a better-timed purchase with better information behind it.',
          'If the category depends on baby preference, your home flow, or a routine you have not lived yet, caution is smart.',
          'The registry can hold the placeholder thought without forcing the immediate spend.',
        ],
      },
      {
        title: 'Timing your purchases',
        imageSrc: REGISTRY_PATH_IMAGES.purchasingTimeline,
        imageAlt: 'Calendar-style visual in neutral tones.',
        paragraphs: [
          'Use registry milestones, discount windows, and real needs to guide the timing.',
          'That usually means registering early, letting gifts come in, then closing the gaps closer to the due date.',
          'That usually means deciding certain categories early, purchasing the must-haves with delivery time in mind, and saving some categories for the completion-discount phase.',
          'The calmer approach is to buy in phases, not in one dramatic weekend.',
          'Your future self does not need a garage full of unopened certainty.',
          'Your future self needs the right things at the right time.',
        ],
      },
    ],
    decisionBullets: [
      'Buy in phases instead of treating the registry like a one-weekend event.',
      'Prioritize what supports the first stretch of life at home.',
      'Delay categories that depend on preference, fit, or later-stage routine.',
      'Use the registry timeline to reduce regret, not just to reduce last-minute errands.',
      'Urgent-looking is not the same thing as urgent.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where your registry becomes intentional.',
    softCtaBody: [
      'Buy in phases, use the windows well, and let real need do the editing.',
      'A better timeline usually creates a better list because fewer decisions get made in a rush.',
    ],
    nextModuleSlug: 'baby-showers-gifting',
    previousModuleSlug: 'rewards-completion-discounts',
  },
  {
    title: 'Baby Showers & Gifting Strategy',
    slug: 'baby-showers-gifting',
    moduleOrder: 6,
    description: 'Guide gifting clearly so guests can shop confidently, duplicates stay down, and the registry still feels easy to use.',
    subhead: 'How to guide what you receive without overcomplicating it.',
    imagePath: REGISTRY_PATH_IMAGES.babyShower,
    imageAlt: 'Baby shower and gifting editorial image for the Baby Showers & Gifting Strategy module.',
    intro: [
      'A baby shower is not just a celebration.',
      'It is part of your registry strategy.',
      'When the registry is clear and easy to use, gifting usually gets simpler for everyone involved.',
      'When it is confusing, gifting gets creative in ways that are not always especially helpful.',
      'This module is about making the list easy to give from without turning it into a rigid little museum exhibit.',
      'Guests want to feel generous. You want what arrives to make sense. Both can happen at the same time.',
    ],
    coreSections: [
      {
        title: 'Guiding your guests',
        imageSrc: REGISTRY_PATH_IMAGES.babyShower,
        imageAlt: 'Soft baby shower setup in neutral tones.',
        paragraphs: [
          'Clear registries help guests feel confident about what to buy.',
          'The more obvious your categories and priorities are, the easier it is for people to choose something useful.',
          'Most guests want direction. They just do not want homework.',
          'That means clear item choices, reasonable price spread, and a list that feels edited instead of infinite.',
          'A registry can be thoughtful without being intimidating.',
          'Clarity is generous on both sides of the shower invitation.',
        ],
      },
      {
        title: 'Avoiding duplicates',
        imageSrc: REGISTRY_PATH_IMAGES.guestGifting,
        imageAlt: 'Minimal gift arrangement.',
        paragraphs: [
          'A well-structured registry reduces overlap because it shows what has already been claimed and what still matters.',
          'That becomes even more important when people are shopping across different budgets and timelines.',
          'The clearer the list, the less likely you are to end up with three versions of the same maybe-useful item.',
          'This is another reason one clean public registry usually works better than a handful of scattered links.',
          'Guests are much more likely to stay on-list when the list itself feels trustworthy.',
          'Duplicates are often a systems issue, not a guest-character issue.',
        ],
      },
      {
        title: 'Balancing essentials and gifts',
        imageSrc: REGISTRY_PATH_IMAGES.babyPresents,
        imageAlt: 'Soft styled baby gifts.',
        paragraphs: [
          'A strong registry usually includes both practical items and a few meaningful extras.',
          'That balance gives guests room to choose something that feels good to give without abandoning the essentials.',
          'You do not need to make it precious. You just need to make it easy to shop well.',
          'A list made entirely of utilitarian basics can feel a little sterile. A list made entirely of adorable extras becomes financially unhelpful very quickly.',
          'The sweet spot is a registry that covers function first, then leaves a little room for delight.',
          'That is not overcomplicating it. That is just good list design.',
        ],
      },
    ],
    decisionBullets: [
      'Guide guests clearly without making the list feel like an exam.',
      'Keep one clean public registry whenever possible.',
      'Use clear categories and price range variety to make gifting easier.',
      'Balance daily-use essentials with a few genuinely giftable extras.',
      'A registry should feel easy to shop and useful to receive.',
    ],
    products: [],
    softCtaLabel: 'A Note Before You Move Forward',
    softCtaTitle: 'This is where everything comes together.',
    softCtaBody: [
      'A clear registry helps people give well without turning the whole process into a group project.',
      'The easier the list is to understand, the more likely it is to bring in things you actually need.',
    ],
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
