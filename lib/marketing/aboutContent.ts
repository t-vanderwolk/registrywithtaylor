/**
 * /about page content (TMBC voice, no em/en dashes). Adapted from the About Us
 * SEO brief. Kept as data so the page markup and the JSON-LD stay in sync.
 */

export const ABOUT_PAIN_HOOK = {
  heading: 'Does any of this sound familiar?',
  paragraphs: [
    'You have spent hours on baby forums, watched 30 reviews of the same stroller, and added and removed the same car seat from your registry three times. And you are still not sure you are making the right call.',
    'Your friends all have different opinions. The influencer you follow gets paid to recommend things. And every time you feel close to a decision, someone tells you there is a better option.',
    'That is exactly why Taylor-Made Baby Co. exists.',
  ],
};

export const ABOUT_BEFORE_AFTER = {
  title: 'What Changes When You Work With Taylor',
  before: [
    'Paralysed by too many product options',
    'Second-guessing every registry addition',
    'Worried about wasting money on the wrong gear',
    'Overwhelmed by conflicting advice online',
    'Not sure what you need versus what is just hype',
    'Dreading the baby shower with an incomplete list',
  ],
  after: [
    'Clear stroller, car seat, and nursery decisions made',
    'A registry that fits your real home and real budget',
    'Confident in every item, and why it is there',
    'Personalised guidance based on your exact situation',
    'Money saved on gear you do not actually need',
    'Ready for your baby shower, and your new baby',
  ],
};

export const ABOUT_QUOTABLE =
  'Taylor Vanderwolk is a baby registry consultant and certified baby gear specialist who helps expecting parents make confident decisions about strollers, car seats, nurseries, and registry strategy.';

export const ABOUT_BIO = [
  'With 7+ years of hands-on experience across Strolleria, Pottery Barn Kids, and the Target Baby Concierge program powered by Tot Squad, I have worked directly with 200+ families to build registries that actually fit their real homes, real routines, and real budgets.',
  'Baby gear decisions arrive fast and compound quickly. The early choices shape the first year in ways most families only understand after the fact, and by then, returning a travel system is harder than it sounds.',
  'My role is not to hand you a checklist and move on. It is to sit with you in the details, your home layout, your vehicle, your family plans, your comfort with risk and spending, and help you make the specific choices that will serve you best.',
  'That is a responsibility I do not take lightly. And it is why every family I work with receives personalised, independent recommendations. No brand sponsorships, no affiliate pressure, no generic advice.',
];

export const ABOUT_ORIGIN = {
  heading: 'Why I Started Taylor-Made Baby Co.',
  paragraphs: [
    'I did not start in a boardroom. I started on a retail floor.',
    'Years of working at Strolleria, one of the most respected baby specialty retailers in the US, and later as a Nursery Advisor at Pottery Barn Kids and a certified Target Baby Concierge specialist through Tot Squad, I watched the same thing happen over and over.',
    'Families would walk in with a registry built from Instagram. Stressed, overloaded, and often on the verge of just buying the most popular stroller because they had given up trying to make a confident decision.',
    'Twenty minutes of real conversation would completely change their direction. The right stroller for their building. The car seat that actually fit their SUV. The bassinet that made sense for their bedroom. Not the most popular option, the right option for them.',
    'After 7+ years of that, I realised most expecting parents never get that conversation. They get an algorithm. They get an affiliate link. They get a paid recommendation.',
    'Taylor-Made Baby Co. is that conversation, available to every expecting parent, wherever they are, without pressure, sponsorship, or agenda.',
  ],
};

export const ABOUT_STATS = [
  { value: '200+', label: 'Families Helped' },
  { value: '7+', label: 'Years of Experience' },
  { value: '5 Stars', label: 'Strolleria Rating' },
  { value: '$75', label: 'Full 1-Hour Session' },
];

export const ABOUT_CREDENTIALS: Array<{ name: string; body: string; link?: { label: string; href: string } }> = [
  {
    name: 'Tot Squad Certified Specialist',
    body: 'The formal baby gear certification behind Target’s Baby Concierge program, operating across 200+ stores nationwide. Taylor is a certified Tot Squad specialist, the same credential that powers in-store baby gear guidance at Target.',
    link: { label: 'Tot Squad', href: 'https://www.totsquad.com' },
  },
  {
    name: 'Strolleria Baby Gear Specialist',
    body: 'Strolleria is the largest independent baby specialty retailer in the US. Taylor’s hands-on product knowledge includes years comparing strollers, car seats, and infant gear side by side in a premium retail environment.',
    link: { label: 'Strolleria', href: 'https://www.strolleria.com' },
  },
  {
    name: 'Pottery Barn Kids Nursery Advisor',
    body: 'Direct experience helping families design nurseries that are functional, safe, and beautiful, with furniture sized for real rooms and layouts built for real family life.',
  },
  {
    name: 'Target Baby Concierge',
    body: 'In-store and virtual baby gear consulting delivered through Target’s nationwide Baby Concierge program, powered by Tot Squad.',
  },
  {
    name: 'BabyQuip Tiny Travels Podcast Featured Guest',
    body: 'Featured expert discussing baby registry strategy, gear priorities, and what actually matters when preparing for a new baby. Full episode available on Spotify.',
  },
];

export const ABOUT_STEPS = [
  {
    n: '01',
    title: 'Book Your Session',
    body: 'Choose a time that works for you and complete Taylor’s intake form. Share your due date, home setup, vehicle type, budget range, and any gear questions you already have. This takes about 5 minutes and shapes the entire session.',
  },
  {
    n: '02',
    title: 'Taylor Prepares Personally',
    body: 'Before your session, Taylor reviews your intake form and prepares tailored recommendations for your specific situation. You will not spend your session answering background questions. Taylor arrives ready for you.',
  },
  {
    n: '03',
    title: 'Your 1-Hour Video Consultation',
    body: 'A focused, calm 60 minute session via Zoom or Google Meet. Stroller comparisons, car seat guidance, nursery strategy, registry priorities, whatever matters most to you. No upselling. No pressure. Honest expert advice.',
  },
  {
    n: '04',
    title: 'Written Follow-Up Notes',
    body: 'After your session, Taylor sends written notes summarising your recommendations, key decisions, and next steps so you can share with your partner and revisit whenever needed. Included in every consultation at no extra charge.',
  },
];

export const ABOUT_GEAR = [
  { title: 'Strollers', body: 'Full-size, lightweight, travel systems, and doubles, matched to your vehicle, home, and lifestyle. Brand comparisons across UPPAbaby, Nuna, Bugaboo, Cybex, Baby Jogger, and more.' },
  { title: 'Car Seats', body: 'Infant versus convertible, LATCH compatibility, safety comparisons, height and weight limits, and installation considerations for your specific vehicle.' },
  { title: 'Sleep Spaces', body: 'Crib versus bassinet, safe sleep setup, nursery layout, and what you actually need versus what is nice to have, without the risk of unsafe sleep products.' },
  { title: 'Nursery Planning', body: 'Furniture sizing for your space, storage organisation, lighting, flow, and baby monitor selection for rooms of every size.' },
  { title: 'Feeding Gear', body: 'Breast pumps, bottles, sterilisers, high chairs, and feeding organisation tools for the newborn stage and beyond.' },
  { title: 'Registry Strategy', body: 'Where to register, what to add first, what to skip, how to time your registry for your baby shower, and how to structure it so guests buy items you actually need.' },
  { title: 'Travel Gear', body: 'Diaper bags, travel cribs, baby carriers and wraps, and airport preparation for life with a newborn.' },
  { title: 'Babyproofing', body: 'Gate selection, outlet covers, furniture anchors, timed and sequenced for your specific home layout and baby’s developmental stage.' },
];

export const ABOUT_VALUE_STACK = {
  intro:
    'The average family makes 6 to 8 major baby gear decisions before their baby arrives. Each one typically costs $100 to $1,200. A single wrong stroller choice costs more than ten consultations.',
  rows: [
    { item: '1-hour video consultation with Taylor Vanderwolk', value: '$150 to $250' },
    { item: 'Pre-session intake review and personalised preparation', value: '$50 to $80' },
    { item: 'Written follow-up notes with recommendations and next steps', value: '$40 to $60' },
    { item: 'Stroller and car seat compatibility check for your vehicle', value: '$75 to $120' },
    { item: 'Registry strategy, what to add, skip, and wait on', value: '$60 to $100' },
    { item: 'Independent, unsponsored expert opinion, no agenda', value: 'Priceless' },
  ],
  totalLabel: 'Total Estimated Value',
  totalValue: '$375 to $610',
  price: '$75',
};

export const ABOUT_COMPARE = {
  columns: ['Taylor-Made', 'YouTube / Influencers', 'Reddit / Forums', 'Parenting Apps', 'Big-Box Staff'],
  rows: [
    { feature: 'Personalised to YOUR home and car', values: ['yes', 'no', 'no', 'no', 'partial'] },
    { feature: 'Independent, no affiliate links', values: ['yes', 'no', 'partial', 'partial', 'no'] },
    { feature: 'Verified professional credentials', values: ['yes', 'varies', 'no', 'no', 'varies'] },
    { feature: 'Written follow-up notes included', values: ['yes', 'no', 'no', 'no', 'no'] },
    { feature: 'Based on current product range', values: ['yes', 'varies', 'varies', 'partial', 'yes'] },
    { feature: 'Car seat compatibility check', values: ['yes', 'partial', 'partial', 'no', 'partial'] },
    { feature: 'Covers your full registry', values: ['yes', 'partial', 'partial', 'partial', 'no'] },
    { feature: 'One-to-one personalised guidance', values: ['yes', 'no', 'no', 'no', 'partial'] },
  ] as Array<{ feature: string; values: Array<'yes' | 'no' | 'partial' | 'varies'> }>,
};

export const ABOUT_REVIEWS = [
  { quote: 'She spent 3+ hours with me as we talked through the pros and cons of each brand and was so patient and kind.', author: 'Amanda M.', source: 'Strolleria Verified Review' },
  { quote: 'We ended up buying something completely different than our online research because of her help. Life-saving advice.', author: 'Kathryn G.', source: 'Strolleria Verified Review' },
  { quote: 'Completely changed what we wanted for our whole stroller setup. Could not recommend Taylor enough.', author: 'Jennifer R.', source: 'Strolleria Verified Review' },
];

export const ABOUT_AVAILABILITY = {
  heading: 'Currently Open for Consultations',
  body: [
    'Taylor works with a limited number of families each week to ensure every consultation receives proper personal preparation and full attention.',
    'Sessions typically book 1 to 2 weeks in advance during peak registry season, weeks 20 to 30 of pregnancy.',
  ],
  timing: [
    'Weeks 18 to 20, start building your registry strategy',
    'Weeks 20 to 24, ideal window before baby shower invites go out',
    'Weeks 25 to 30, last chance to finalise before the third trimester',
    'Any stage, if you already have a partial registry to refine',
  ],
};

export const ABOUT_LEAD_MAGNET = {
  title: 'Free Baby Prep Starter Guide for Expecting Parents',
  intro:
    'A calm, practical starting point for registry, gear, and nursery decisions, built on 7+ years of real baby consulting experience. Delivered to your inbox, free.',
  bullets: [
    'The 10 most common registry mistakes expecting parents make, and how to avoid them',
    'Stroller buying checklist, what to verify before you commit',
    'A timeline of what to buy when across your second and third trimester',
    'Taylor’s honest take on what is worth the money versus what is overhyped',
    'Car seat types explained, infant versus convertible versus all-in-one',
  ],
};

export const ABOUT_FAQ = [
  {
    question: 'Who is Taylor Vanderwolk?',
    answer:
      'Taylor Vanderwolk is a baby registry consultant and certified Tot Squad specialist with 7+ years of hands-on baby gear experience at Strolleria, Pottery Barn Kids, and the Target Baby Concierge program. She is the founder of Taylor-Made Baby Co., offering 1-hour virtual baby registry consultations for expecting parents across the United States, and has helped 200+ families build confident, personalised registries that fit their real homes, budgets, and routines.',
  },
  {
    question: 'What makes Taylor-Made Baby Co. different from other baby registry services?',
    answer:
      'Taylor-Made Baby Co. is fully independent. No brand sponsorships, no affiliate commissions, no partnerships that influence recommendations. Every piece of advice is based on what fits your specific home, vehicle, budget, and lifestyle, backed by real retail experience as a Baby Gear Specialist at Strolleria, a Nursery Advisor at Pottery Barn Kids, and a certified Target Baby Concierge specialist through Tot Squad.',
  },
  {
    question: 'Is Taylor Vanderwolk a certified baby gear specialist?',
    answer:
      'Yes. Taylor Vanderwolk is a certified Tot Squad Specialist, the credential that powers Target’s Baby Concierge program across 200+ Target stores nationwide. She has additionally worked as a Baby Gear Specialist at Strolleria and a Nursery Advisor at Pottery Barn Kids, and has been featured as a baby gear expert on the BabyQuip Tiny Travels Podcast.',
  },
  {
    question: 'How do I book a consultation with Taylor Vanderwolk?',
    answer:
      'Book a 1-hour virtual baby registry consultation at taylormadebabyco.com/book. Choose your session time and complete Taylor’s intake form with your due date, home setup, vehicle type, budget, and registry questions. Taylor personally reviews your intake before the session. Sessions are $75, conducted via video call, with a full refund available if cancelled 24 hours before the session.',
  },
  {
    question: 'Is Taylor-Made Baby Co. available outside of Phoenix?',
    answer:
      'Yes. All Taylor-Made Baby Co. consultations are virtual and available to expecting parents anywhere in the United States, conducted via Zoom or Google Meet. For Phoenix, AZ families, Taylor can additionally refer you to trusted local professionals including CPST certified car seat technicians and local baby gear boutiques.',
  },
  {
    question: 'What product categories does Taylor cover in a consultation?',
    answer:
      'A consultation covers stroller selection and compatibility, car seat safety and installation, nursery planning and layout, feeding equipment, sleep gear and safe sleep setup, registry strategy and timing, travel gear, and babyproofing. Bring specific product questions too. Taylor is familiar with all major brands including UPPAbaby, Nuna, Bugaboo, Cybex, Baby Jogger, Mockingbird, and Doona.',
  },
  {
    question: 'Has Taylor Vanderwolk been featured in any media or podcasts?',
    answer:
      'Yes. Taylor was featured as a guest expert on the BabyQuip Tiny Travels Podcast, discussing what actually matters when preparing for a new baby and how to stop letting gear overwhelm steal the joy from early parenthood. The full episode is available on Spotify and embedded on this About page.',
  },
  {
    question: 'Is Taylor-Made Baby Co. affiliated with TaylorMade Golf or any other TaylorMade brand?',
    answer:
      'No. Taylor-Made Baby Co. is a baby registry consulting service founded by Taylor Vanderwolk and is not affiliated with TaylorMade Golf, TaylorMade Audio, or any other brand using the TaylorMade name. It operates exclusively as an independent baby gear consulting and registry guidance service for expecting parents.',
  },
];
