/**
 * Server-rendered content for /tools/stroller-quiz. The quiz itself is an interactive
 * client component; everything here is static SSR HTML so Google and AI engines can
 * index the intro, the "how it works" framework, every stroller-result description, the
 * expert attribution, the reviews, and the FAQ — the content that actually ranks.
 *
 * Sourced from the Stroller Quiz Page SEO brief. The live quiz asks 8 questions (not the
 * brief's placeholder 6), so all copy here says 8. TMBC voice: no em or en dashes.
 */

export const QUIZ_HERO = {
  eyebrow: 'Free Tool · Instant Results · No Sign-Up',
  h1: 'Best Stroller Quiz: Find Your Perfect Stroller Match in 8 Questions',
  attribution:
    'Recommendations powered by Taylor Vanderwolk, Certified Tot Squad Specialist with 7+ years of baby gear experience and 200+ families helped.',
  freebadges: ['Free', 'Instant results', 'No sign-up required', 'Independent, zero affiliate commission'],
};

export const QUIZ_INTRO = {
  heading: 'Answer 8 Questions to Find Your Perfect Stroller',
  paragraphs: [
    'Choosing a stroller is one of the most researched, and most (( confusing )), decisions expecting parents face. There are hundreds of options, dozens of brands, and an overwhelming number of conflicting reviews online.',
    '[[ This quiz cuts through all of it. ]] Answer 8 questions about your lifestyle, home, vehicle, budget, and family plans. The quiz recommends your stroller type and top brand matches, based on the same criteria Taylor Vanderwolk uses in her personal baby registry consultations.',
  ],
};

export const QUIZ_HOW_IT_WORKS = {
  eyebrow: 'How it works',
  heading: 'How the Stroller Quiz Works, 3 Things Taylor Checks First',
  intro: 'The quiz is built on the same three-factor framework Taylor uses in every personal stroller consultation.',
  steps: [
    {
      title: 'Your life, not someone else’s lifestyle',
      body: 'The quiz asks about your actual home type (apartment, house, city, suburban), how you travel day to day, and what terrain you cover. A stroller that works in a suburban driveway may be completely wrong for a third-floor walkup with a narrow lift.',
    },
    {
      title: 'Your vehicle, not the most popular option',
      body: 'Car seat compatibility and boot space are the two most common sources of wrong stroller purchases. The quiz accounts for your vehicle type to filter out options that will not fit your specific car.',
    },
    {
      title: 'Your budget, including your future plans',
      body: 'The best stroller for your life right now may not be the best stroller for your life in two years. The quiz asks about future family plans to factor in whether a single-to-double conversion, a travel system, or a separate pram makes more financial sense.',
    },
  ],
};

export type QuizResultType = {
  name: string;
  keyword: string;
  brands: string;
  recommendedFor: string;
  note: string;
};

export const QUIZ_RESULT_TYPES = {
  eyebrow: 'The result types',
  heading: 'Your Stroller Recommendation, Based on Your Lifestyle',
  intro:
    'The quiz matches you to one of these stroller types, then names the specific brands worth comparing. Here is what each recommendation means and who it fits.',
  types: [
    {
      name: 'Urban Compact Stroller',
      keyword: 'best stroller for a city apartment',
      brands: 'Babyzen YOYO2, Bugaboo Butterfly, UPPAbaby MINU V2, Joolz Aer+',
      recommendedFor:
        'City apartments, public transport, narrow lifts, and frequent flying. You need a stroller that folds small enough to fit in an overhead bin, fits through a standard lift door, and can be carried up stairs when needed. Cabin-approved folds, lightweight frames, and one-hand fold mechanisms are the priority.',
      note: 'The YOYO2 is the gold standard for city living. It fits in most overhead bins, weighs about 6.2kg, and folds in seconds. But if you are in a hilly city or need a slightly larger basket, the UPPAbaby MINU V2 is worth comparing.',
    },
    {
      name: 'Full-Size Travel System',
      keyword: 'best travel system stroller',
      brands: 'UPPAbaby VISTA V2, Nuna MIXX Next, Bugaboo Fox 5, Cybex Balios S Lux',
      recommendedFor:
        'Suburban families, SUV or large car owners, and parents who want one system that works from newborn to toddler. Full-size travel systems include a pram seat, a compatible infant car seat, and a stroller frame, covering the first 3 to 4 years in one purchase. Best for families who drive primarily and have garage or entrance storage space.',
      note: 'The UPPAbaby VISTA is the most versatile travel system on the market, but it is large and heavy. If you have a compact car or will be lifting this frequently, the Nuna MIXX Next or Cybex Balios are better matched.',
    },
    {
      name: 'Lightweight Everyday Stroller',
      keyword: 'best lightweight stroller for everyday use',
      brands: 'Mockingbird Single-to-Double, Baby Jogger City Mini GT2, UPPAbaby RIDGE, Ergobaby Metro+',
      recommendedFor:
        'Active suburban families, parents who want a balance of performance and portability, and families planning a second child within 2 to 3 years. Lightweight everyday strollers handle most terrain, fold reasonably compact, and many convert to double configurations without buying a second frame.',
      note: 'The Mockingbird offers the best value at this price point: single-to-double functionality, a smooth ride, and strong quality for under $600. The Baby Jogger City Mini GT2 is the industry workhorse if you want tried-and-true durability.',
    },
    {
      name: 'Jogging and Active Stroller',
      keyword: 'best jogging stroller for running parents',
      brands: 'BOB Gear Revolution Flex 3.0, Thule Urban Glide 2, Baby Jogger Summit X3',
      recommendedFor:
        'Runners, trail hikers, and parents with very active outdoor lifestyles. Jogging strollers feature fixed front wheels, pneumatic tyres for shock absorption, wrist safety straps, and recline systems suited for high-speed use. Most are not suitable for newborns without a compatible car seat adapter.',
      note: 'True jogging strollers are large and heavy. They are great on trails but awkward in shops and tight urban spaces. Most families who think they want a jogger actually use a hybrid all-terrain stroller far more frequently in real life.',
    },
    {
      name: 'Double Stroller',
      keyword: 'best double stroller for two children',
      brands: 'UPPAbaby VISTA V2 (rumble seat), Mockingbird Double, Baby Jogger City Select 2, Bugaboo Donkey 5',
      recommendedFor:
        'Families with two children under 4, twin parents, and parents with one child and a baby arriving within 12 to 18 months. Double strollers come in tandem, side-by-side, and convertible single-to-double configurations. Width and weight are the primary trade-offs to consider.',
      note: 'Before buying a dedicated double stroller, check if your existing single converts. The UPPAbaby VISTA adds a rumble seat, and the Mockingbird converts without a second frame purchase. Side-by-side doubles like the Bugaboo Donkey 5 are wider but give both children equal visibility.',
    },
    {
      name: 'Budget-Friendly Stroller',
      keyword: 'best affordable stroller under $400',
      brands: 'Graco Modes Pramette, Chicco Bravo LE, Baby Trend Expedition, Summer Infant 3Dlite+',
      recommendedFor:
        'Families with a tight registry budget, parents expecting a second stroller upgrade within 18 months, and families where the stroller will be used less frequently. Budget strollers have improved significantly, and many now offer one-hand fold, recline systems, and reasonable weight.',
      note: 'The biggest risk with budget strollers is long-term durability and car seat compatibility. Check that your chosen budget stroller is compatible with your car seat before purchasing, because not all budget frames accept premium car seat adapters.',
    },
  ] as QuizResultType[],
};

export const QUIZ_CONSULT_CTA = {
  eyebrow: 'Highest-intent moment',
  heading: 'Want a Full Registry Review? Book a Baby Registry Consultation.',
  body:
    'The stroller quiz gives you a direction. A consultation gives you a specific, verified recommendation for your exact home, vehicle, and budget, plus your car seat, nursery, feeding gear, and full registry strategy.',
  covers: [
    'Your exact stroller matched to your specific car make and model',
    'Car seat compatibility check for your LATCH system',
    'Nursery planning and safe sleep setup',
    'Full registry strategy: what to add, skip, and wait on',
    'Feeding gear, travel essentials, and newborn kit',
    'Written follow-up notes with all your recommendations',
  ],
};

export const QUIZ_CREATOR = {
  eyebrow: 'Who built this',
  heading: 'About the Quiz Creator, Taylor Vanderwolk',
  bio: [
    'This stroller quiz was built by Taylor Vanderwolk, a certified baby gear specialist and baby registry consultant with 7+ years of hands-on stroller experience at Strolleria (the leading US baby specialty retailer), Pottery Barn Kids, and the Target Baby Concierge programme powered by Tot Squad.',
    'The quiz recommendations reflect the same framework Taylor uses in every personal consultation, matching strollers to real homes, real vehicles, and real lifestyles rather than to a generic best-of list.',
  ],
  credentials: [
    {
      title: 'Tot Squad Certified Specialist',
      body: 'Certification behind Target’s Baby Concierge programme, serving 200+ stores nationwide.',
    },
    {
      title: 'Strolleria Baby Gear Specialist',
      body: 'Years comparing 100+ strollers hands-on in a premium specialty retail environment.',
    },
    {
      title: '200+ Families Helped',
      body: 'Real-world stroller recommendation experience across 200+ personal consultations.',
    },
    {
      title: 'Zero Affiliate Commission',
      body: 'Every quiz recommendation is independent: no sponsorship, no paid placements, no brand deals.',
    },
  ],
};

export type QuizReview = {
  stars: number;
  headline: string;
  quote: string;
  outcome: string;
  author: string;
  source: string;
};

export const QUIZ_REVIEWS = {
  eyebrow: 'Client stories',
  heading: 'What Families Say About Taylor’s Stroller Guidance',
  reviews: [
    {
      stars: 5,
      headline: 'Completely changed our entire stroller decision.',
      quote:
        'Taylor showed us more options than we would have known to ask about. She completely changed what we wanted for our whole stroller setup. The way she walked us through each option against our actual lifestyle felt nothing like what we were getting from YouTube or Reddit.',
      outcome:
        'Switched to a stroller that fit her vehicle and lifestyle, from a popular travel system that would not have worked for her car.',
      author: 'Jennifer R.',
      source: 'Strolleria Verified Review',
    },
    {
      stars: 5,
      headline: 'Our online research had us completely wrong.',
      quote:
        'We were about to spend $1,200 on a stroller that would have been completely wrong for our car. Taylor identified the compatibility issue before we bought it. We switched to a system that actually worked and saved several hundred dollars.',
      outcome: 'Prevented a wrong stroller purchase, with a car seat compatibility issue caught before buying.',
      author: 'Kathryn G.',
      source: 'Strolleria Verified Review',
    },
  ] as QuizReview[],
};

export const QUIZ_LEAD_MAGNET = {
  eyebrow: 'Free download',
  heading: 'Download the Free Stroller Buying Checklist',
  body:
    'Completed the quiz but want a checklist to take to the shop or use when comparing online? Download the free Stroller Buying Checklist, the exact questions Taylor asks before recommending any stroller.',
  bullets: [
    'Vehicle boot measurement guide: length, width, depth',
    'LATCH compatibility checklist for car seat pairing',
    'Lift and doorway clearance measurement guide',
    'Fold type comparison: what to test in-store',
    'Weight check: can you actually carry this?',
    'Canopy coverage test: shade at your location',
    'Basket size guide: does it hold your daily bag?',
    'Brand-by-brand one-line verdict from Taylor',
  ],
};

export const QUIZ_FAQ = [
  {
    question: 'How does the stroller quiz work?',
    answer:
      'The Taylor-Made Baby Co. stroller quiz asks 8 questions about your lifestyle, home type, vehicle, budget, family plans, and terrain preferences. Based on your answers, the quiz recommends the stroller type and specific brands most suited to your situation. Recommendations are built by certified baby gear specialist Taylor Vanderwolk using the same criteria she applies in her 1-hour personal consultations. The quiz is free and requires no sign-up.',
  },
  {
    question: 'What stroller brands does the quiz cover?',
    answer:
      'The stroller quiz covers all major brands including UPPAbaby, Nuna, Bugaboo, Cybex, Baby Jogger, Mockingbird, Doona, Babyzen YOYO, Chicco, and Graco. Recommendations are based on your specific answers, not on brand sponsorship or affiliate arrangements. Taylor-Made Baby Co. is fully independent and receives zero commission from any stroller brand.',
  },
  {
    question: 'Is the stroller quiz free?',
    answer:
      'Yes. The Taylor-Made Baby Co. stroller quiz is completely free, requires no sign-up, and delivers instant results. For a deeper, fully personalised stroller recommendation that accounts for your specific vehicle make and model, apartment dimensions, and car seat compatibility, book a 1-hour virtual baby registry consultation with Taylor Vanderwolk at $75.',
  },
  {
    question: 'How accurate is the quiz recommendation?',
    answer:
      'The quiz provides a recommended stroller type and brand direction based on your answers. It is designed using the same criteria Taylor applies in her personal consultations: vehicle type, home space, lifestyle, terrain, budget, and family plans. For a recommendation verified against your specific vehicle model and car seat, a personal consultation provides more precision.',
  },
  {
    question: 'What is the best stroller for a small apartment or city living?',
    answer:
      'For small apartments, tight hallways, and city living, compact-fold and lightweight strollers are typically best. The Babyzen YOYO2, Bugaboo Butterfly, and UPPAbaby MINU V2 are commonly recommended for urban parents. The stroller quiz asks about your home type and lift or hallway access to narrow the recommendation for your specific space.',
  },
  {
    question: 'What is the best stroller for an SUV?',
    answer:
      'For SUV owners, boot space and travel system compatibility are the primary factors. Full-size systems including UPPAbaby VISTA V2, Nuna MIXX Next, and Bugaboo Fox 5 work with most SUVs. The stroller quiz includes a vehicle type question to account for your car category. For exact boot measurement verification, book a consultation where Taylor checks your specific make and model.',
  },
  {
    question: 'Can I use the quiz if I already have a partial stroller shortlist?',
    answer:
      'Yes. Many expecting parents use the quiz to validate a shortlist they have already started. If your quiz result matches one of your shortlisted options, that is a good signal. If it does not, it is worth understanding why, which is exactly the kind of question Taylor addresses in a 1-hour consultation. The quiz result also links to relevant journal articles for each recommended stroller type.',
  },
  {
    question: 'What if I need more than a quiz result?',
    answer:
      'After completing the stroller quiz, you can book a 1-hour virtual baby registry consultation with Taylor Vanderwolk at $75. The consultation covers your full registry: strollers, car seats, nursery, feeding gear, and registry strategy, with personalised recommendations based on your specific home, vehicle, and lifestyle. Written follow-up notes are included in every session.',
  },
  {
    question: 'Can I get a personalised stroller recommendation for my specific car?',
    answer:
      'The stroller quiz provides a type recommendation based on your vehicle category. For a recommendation verified against your specific car make, model, boot dimensions, and LATCH system, book a 1-hour virtual baby registry consultation with Taylor Vanderwolk. Taylor checks stroller compatibility against your specific vehicle as part of every consultation.',
  },
];

export const QUIZ_CLOSING = {
  headline: 'The quiz gives you a direction. A consultation gives you the answer.',
  body:
    'One hour with Taylor covers your specific stroller matched to your exact car, your car seat compatibility, your nursery, your registry, and everything else, with written notes at the end.',
  meta: '$75 · 1 Hour · Virtual · US Nationwide · Full refund if cancelled 24+ hrs before',
};
