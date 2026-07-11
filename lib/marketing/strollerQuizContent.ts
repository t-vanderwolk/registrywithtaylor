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
    'The quiz matches you to one of seven stroller types, then names the specific brands worth comparing. Here is what each category means and who it fits.',
  types: [
    {
      name: 'Full Size / Modular',
      keyword: 'best full-size stroller',
      brands: 'Bugaboo Fox 5, Nuna MIXX Next, Silver Cross Reef 2',
      recommendedFor:
        'Walk-heavy routines where you push for long stretches, longer outings where basket access, canopy coverage, and recline matter, and open storage like a large trunk or garage. The one capable primary stroller you can live with for years.',
      note: 'Bigger and heavier to fold, but if you are out with it most days that trade is an easy one. If your week is mostly quick car errands and it gets folded three times a day, a compact may earn its keep better.',
    },
    {
      name: 'Compact / Mid-Size',
      keyword: 'best compact stroller',
      brands: 'Bugaboo Dragonfly Plus, Nuna TRIV Next, Cybex Mios',
      recommendedFor:
        'Car-heavy routines where the stroller gets folded and lifted constantly, smaller trunks and tighter storage, or multiple caregivers sharing one stroller. The stroller you will actually reach for, not dread.',
      note: 'You give up a little seat room and suspension on long walks, but most families never miss it. Compact wins on convenience, not raw capability.',
    },
    {
      name: 'Travel Stroller',
      keyword: 'best travel stroller',
      brands: 'Babyzen YOYO2, Silver Cross Clic, Bugaboo Butterfly',
      recommendedFor:
        'Families who fly regularly and want cabin-bag portability or easy gate check, ride-share households where the stroller moves in and out of strangers’ trunks, and grandparent-adjacent families who need it at multiple addresses.',
      note: 'Not the plushest ride, but when getting through a gate or into a trunk is the whole point, nothing else comes close. If travel is only occasional, a compact solves the same problem with more everyday capability.',
    },
    {
      name: 'Single-to-Double Convertible',
      keyword: 'best single-to-double stroller',
      brands: 'Bugaboo Donkey 6, Nuna DEMI Next, Cybex Gazelle S',
      recommendedFor:
        'Families expecting a second baby on a real timeline who want one stroller that becomes two. The best ones give both kids the same comfortable seat, not a roomy seat for one and a cramped add-on for the other.',
      note: 'It means pushing a slightly bigger frame before that second baby shows up, so it pays off most when another little one is a real plan, not a maybe.',
    },
    {
      name: 'Double Stroller',
      keyword: 'best double stroller',
      brands: 'Baby Jogger City Mini GT2 Double, Nuna TRVL Dubl, Silver Cross Jet Double',
      recommendedFor:
        'Twins or multiples from day one, or two children close enough in age that both still need a seat on most outings. A dedicated two-seat solution for right now, not for someday.',
      note: 'Width, weight, and harder maneuvering come with the territory, and most doubles do not fit neatly through standard doorways. Tight spaces, narrow aisles, and small elevators become real daily friction.',
    },
    {
      name: 'Jogging / All-Terrain',
      keyword: 'best jogging stroller',
      brands: 'BOB Revolution Flex 3.0, Thule Urban Glide 2, UPPAbaby Ridge',
      recommendedFor:
        'Parents who actively run and want a stroller that keeps a real jogging pace, outdoor-heavy families whose routes include rough terrain, and neighborhoods where broken sidewalks, curb gaps, or unpaved paths are the norm.',
      note: 'More bulk, a larger fold, and a wider frame that becomes conspicuous in stores and tight urban spaces. A jogging stroller that never jogs is a very large errand cart.',
    },
    {
      name: 'Double Jogger',
      keyword: 'best double jogging stroller',
      brands: 'BOB Revolution Flex 3.0 Duallie, Thule Urban Glide 2 Double, Baby Jogger Summit X3 Double',
      recommendedFor:
        'Parents of two who actually run, jog, or power-walk, families with two kids plus lots of trails and rough ground, and active households not ready to give up the outdoors with a second baby.',
      note: 'These are among the widest strollers on the road. Measure your doorways, trunk, and storage before you buy, and know it is overkill if you never actually run or hit rough ground.',
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
