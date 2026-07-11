/**
 * All /services page copy, in the TMBC voice (witty, wise, real, relatable) and
 * free of em/en dashes. Source: "Taylor-Made Baby service page" SEO + content
 * brief. Kept in one module so the page and the JSON-LD (HowTo / FAQPage) stay in
 * sync with the visible sections.
 */

export const SERVICES_HERO_STATS = [
  { value: '$75', label: '1-Hour Virtual Session' },
  { value: '200+', label: 'Families Helped' },
  { value: '5 Stars', label: 'Strolleria Verified' },
] as const;

export const SERVICES_PAIN_HOOK = {
  lead: 'You are not confused because you have not done enough research. You are confused because you have done too much.',
  body: 'The forums say one thing. The YouTube reviewer has an affiliate deal. Your friend swears by a stroller that does not even fit your car. Your registry has 94 items and you have bought exactly zero of them.',
  close: 'A one-hour consultation with Taylor cuts through all of it.',
} as const;

export const SERVICES_DECISIONS = [
  {
    title: 'Which stroller is right for your life',
    body: 'Brand, frame, seat compatibility, vehicle fit, storage, folding, and terrain, narrowed to your top 2 options with a clear recommendation.',
  },
  {
    title: 'Infant seat vs convertible car seat',
    body: 'The honest answer based on your vehicle, your budget, your plans for a second child, and how long you actually want to keep it.',
  },
  {
    title: 'What your nursery actually needs',
    body: 'Safe sleep setup, furniture that fits your real room, and what to buy now vs wait on. No staging-photo fantasy, your actual floor plan.',
  },
  {
    title: 'Registry strategy: where, what, and when',
    body: 'Which retailer to use, what to prioritise for the shower, what to self-purchase, and how to structure your list so guests buy what you need.',
  },
  {
    title: 'What to skip entirely',
    body: 'The items that are aggressively marketed but rarely used. The category your baby will outgrow in 8 weeks. The expensive purchase with a $40 alternative.',
  },
  {
    title: 'What feeding gear fits your plan',
    body: 'Whether you plan to breastfeed, formula feed, or combine, the right pump, bottles, steriliser, and high chair for your approach.',
  },
] as const;

export const SERVICES_WHY = {
  heading: 'Why Expecting Parents Book a Baby Registry Consultation',
  paragraphs: [
    'Baby gear decisions arrive (( fast )), compound quickly, and carry more weight than most first-time parents expect.',
    'The stroller you choose affects whether you can fit through your apartment door, whether it clips into your specific car seat, and whether you can navigate the neighbourhood you walk every day. The car seat you choose is a safety decision that most parents make without ever having the full picture.',
    'Generic registry checklists do not answer these questions. YouTube reviews do not know your car. Instagram recommendations are (( paid )) to say what they say. And by the time you realise a purchase was wrong, [[ the return window has closed. ]]',
    'A baby registry consultation with Taylor-Made Baby Co. is one focused hour where all of that gets resolved, personalised to your specific home, vehicle, lifestyle, and budget. [[ Before you spend a dollar. ]]',
  ],
} as const;

export const SERVICES_ROI = {
  heading: 'The Real Cost of Getting Baby Gear Wrong',
  intro: 'Most families do not realise how expensive a single wrong decision is [[ until they are living with it. ]]',
  rows: [
    { mistake: 'Wrong car seat for your car', cost: '$600 to $1,100', why: 'Bought based on Instagram, not LATCH compatibility', prevents: 'Taylor checks car seat fit against your exact vehicle model' },
    { mistake: 'Infant seat that lasts 6 months', cost: '$180 to $350', why: 'Did not account for baby’s weight trajectory', prevents: 'Taylor explains the convertible vs infant decision honestly' },
    { mistake: 'Nursery furniture too big', cost: '$400 to $900', why: 'Ordered from a catalogue, not a real room', prevents: 'Taylor plans around your actual room dimensions' },
    { mistake: 'Duplicate registry items', cost: '$200 to $500', why: 'Multiple people bought variations of the same thing', prevents: 'Taylor structures the registry so guests buy distinctly' },
    { mistake: 'Travel system not compatible', cost: '$250 to $700', why: 'Did not verify car seat clips to stroller frame', prevents: 'Taylor confirms compatibility before you register' },
  ],
  total: { label: 'Total preventable waste', cost: '$1,630 to $3,550', note: 'One consultation: $75' },
} as const;

export const SERVICES_INCLUDES = {
  heading: 'What Your Baby Registry Consultation Includes, $75 for 1 Hour',
  intro: 'Every consultation is fully (( personalised )). Taylor reviews your intake form before the session so the full hour is spent on recommendations, not background questions.',
  items: [
    { title: 'Pre-Session Intake Review', body: 'Taylor personally reviews your due date, home setup, vehicle type, budget, and gear questions before the session begins. You arrive to a consultant who is already prepared for you specifically.' },
    { title: '1-Hour Video Consultation', body: 'A structured session via Zoom or Google Meet covering your biggest gear decisions in priority order. No upselling, no pressure, no brand agenda.' },
    { title: 'Stroller and Car Seat Guidance', body: 'Brand comparisons, vehicle compatibility checks, weight limits, installation considerations, and an honest recommendation for your specific situation.' },
    { title: 'Nursery and Registry Strategy', body: 'Furniture sizing for your real room, safe sleep setup, registry priorities, where to register, what to add first, and what to skip entirely.' },
    { title: 'Feeding, Travel, and Newborn Essentials', body: 'Breast pump, bottles, carrier, monitor, diaper bag, the core newborn kit calibrated to your feeding plan and lifestyle.' },
    { title: 'Written Follow-Up Notes', body: 'Your recommendations, decisions, and next steps in writing, delivered after the session. Share with your partner, revisit at any time.' },
  ],
} as const;

export const SERVICES_COVERAGE = {
  heading: 'What We Cover in Your Registry Consultation: Strollers, Car Seats, Nursery & More',
  categories: [
    { name: 'Strollers', body: 'Full-size, lightweight, travel systems, double strollers. Brands like UPPAbaby, Nuna, Bugaboo, Cybex, Baby Jogger, and Mockingbird. Matched to your vehicle, lifestyle, and home.' },
    { name: 'Car Seats', body: 'Infant vs convertible, LATCH compatibility, height and weight limits, vehicle-specific installation notes, and honest safety comparisons beyond crash test data.' },
    { name: 'Nursery Setup', body: 'Crib vs bassinet, safe sleep configuration, furniture that fits your real room, monitor selection, storage, and layout for spaces of every size.' },
    { name: 'Feeding Gear', body: 'Breast pump types, bottle comparisons, steriliser options, high chair timing, formula equipment, and newborn feeding organisation.' },
    { name: 'Travel & On-the-Go', body: 'Diaper bags, travel cribs, baby carriers vs wraps vs structured carriers, and how to fly with a newborn without losing your mind.' },
    { name: 'Registry Strategy', body: 'Where to register, what to prioritise, what to leave off, how to time your registry for the baby shower, and how to structure it so guests buy what you actually need.' },
  ],
} as const;

export const SERVICES_STEPS = [
  { title: 'Book Your Session', body: 'Choose your session time and complete Taylor’s intake form: due date, home setup, vehicle, budget, and gear questions. Takes 5 minutes. Available at taylormadebabyco.com/book.' },
  { title: 'Taylor Reviews Your Intake', body: 'Taylor personally reads your form before the session and prepares tailored recommendations. Your hour is spent on answers, not background.' },
  { title: '1-Hour Video Consultation', body: 'A focused session covering your biggest decisions in priority order: strollers, car seats, nursery, registry, feeding, travel. No upselling. No pressure.' },
  { title: 'Receive Written Follow-Up Notes', body: 'Taylor sends a written summary of your recommendations and next steps after the session. Keep it, share it, revisit it.' },
] as const;

export const SERVICES_COMPARE = {
  heading: 'How Taylor-Made Baby Co. Compares, An Honest Look',
  intro: 'We know you have options. Here is a (( direct )), feature-by-feature comparison so you can make the right choice for where you are right now.',
  columns: ['Taylor-Made', 'YouTube', 'Reddit / Forums', 'Parenting Apps', 'Buy Buy Baby'],
  rows: [
    { feature: 'Tailored to YOUR vehicle', values: ['yes', 'no', 'no', 'no', 'no'] },
    { feature: 'Stroller compatibility verified', values: ['yes', 'partial', 'no', 'no', 'partial'] },
    { feature: 'Zero affiliate income', values: ['yes', 'no', 'varies', 'varies', 'no'] },
    { feature: 'Written notes included', values: ['yes', 'no', 'no', 'no', 'no'] },
    { feature: 'Car seat safety context', values: ['yes', 'partial', 'partial', 'no', 'partial'] },
    { feature: 'Full registry strategy', values: ['yes', 'no', 'partial', 'partial', 'no'] },
    { feature: 'One-to-one session', values: ['yes', 'no', 'no', 'no', 'partial'] },
    { feature: 'Nursery sizing for real room', values: ['yes', 'no', 'no', 'no', 'no'] },
    { feature: 'Covers feeding + travel', values: ['yes', 'partial', 'partial', 'partial', 'no'] },
    { feature: 'Independent from all brands', values: ['yes', 'no', 'varies', 'varies', 'no'] },
  ] as Array<{ feature: string; values: Array<'yes' | 'no' | 'partial' | 'varies'> }>,
} as const;

export const SERVICES_FIT = {
  heading: 'Is This Consultation Right for You?',
  yes: [
    'You are expecting and overwhelmed by gear choices',
    'You have a partial registry and need expert review',
    'You want advice that fits your home, car, and budget',
    'You want to avoid buying wrong before the baby shower',
    'You want written notes to reference after the session',
  ],
  no: [
    'You need in-person car seat installation, see a CPST',
    'You want medical advice about your pregnancy or baby’s health',
    'You want Taylor to agree with decisions you have already made',
    'You need a full-service event coordinator',
    'You want sponsored brand recommendations',
  ],
} as const;

export const SERVICES_TESTIMONIALS = [
  {
    headline: 'Nearly bought a $1,200 stroller that would not fit the car.',
    quote: 'We ended up buying something completely different than what our online research led us to. Taylor identified that the travel system we had in our cart was not compatible with our SUV’s LATCH points. We switched to a different system that actually worked, and saved several hundred dollars in the process.',
    saving: 'Estimated saving: $300 to $600 on a wrong stroller plus potential car seat reinstall costs.',
    author: 'Kathryn G.',
    source: 'Strolleria Verified Review',
  },
  {
    headline: 'Realised a full nursery set would not fit her bedroom.',
    quote: 'She spent 3+ hours with me as we walked through everything. We realised the full nursery furniture set I had chosen would not fit the dimensions of our actual bedroom. Taylor helped me redesign around a smaller crib and a dresser that doubled as a changing table, saving space and money.',
    saving: 'Estimated saving: $400 to $700 on oversized nursery furniture.',
    author: 'Amanda M.',
    source: 'Strolleria Verified Review',
  },
  {
    headline: 'Removed 40+ items from the registry she would never have used.',
    quote: 'Taylor completely changed what we wanted for our whole stroller setup and helped us strip our registry back from 140 items to about 60, keeping only what we would actually use. The process of removing things was as valuable as adding them.',
    saving: 'Estimated saving: $200 to $400 in duplicate and unnecessary registry items.',
    author: 'Jennifer R.',
    source: 'Strolleria Verified Review',
  },
] as const;

export const SERVICES_AVAILABILITY = {
  heading: 'Check Session Availability',
  body: 'Sessions are prepared individually. Taylor personally reviews every intake before the session, so availability is genuinely limited each week. During weeks 20 to 30 of pregnancy, sessions typically book 1 to 2 weeks in advance. If your due date is coming up, [[ book early. ]]',
  windows: [
    { label: 'Weeks 16 to 20', note: 'Best window, most time to act on recommendations' },
    { label: 'Weeks 20 to 24', note: 'Peak window, before baby shower invites go out' },
    { label: 'Weeks 25 to 30', note: 'Final window, before the third-trimester rush' },
    { label: 'After week 30', note: 'Still available, come with your urgent questions' },
  ],
} as const;

export const SERVICES_CREDENTIALS = {
  heading: 'Why Book with Taylor?',
  lead: 'Taylor is a certified baby registry consultant with hands-on baby gear experience at Strolleria, Pottery Barn Kids, and the Target Baby Concierge programme powered by Tot Squad. She has helped 200+ families, and receives (( zero commission )) from any brand she recommends.',
  items: [
    { title: 'Tot Squad Certified Specialist', body: 'The credential behind Target’s Baby Concierge programme, 200+ stores nationwide.' },
    { title: 'Strolleria Baby Gear Specialist', body: 'Years comparing strollers and car seats hands-on in a leading baby specialty showroom.' },
    { title: 'Pottery Barn Kids Nursery Advisor', body: 'Furniture sizing, safe sleep layout, and nursery design for real rooms.' },
    { title: 'Zero Affiliate Commission', body: 'Every recommendation is based on your situation. No sponsorship. No paid placements.' },
  ],
} as const;

export const SERVICES_PRICING = {
  heading: 'Book Your Baby Registry Consultation: $75, Virtual, US Nationwide',
  included: [
    '1-hour video call with Taylor',
    'Pre-session personal intake review',
    'Stroller, car seat, nursery and registry guidance',
    'Written follow-up notes after the session',
    'Independent advice, zero brand sponsorship',
    'Full refund if cancelled 24+ hours before',
  ],
  contact: 'hello@taylormadebabyco.com',
} as const;

export const SERVICES_ADDONS = [
  { title: 'Registry Review Add-On', tag: 'Included with consultation', body: 'Already have a registry and need expert review? Taylor goes through your existing list, flags redundant items, identifies gaps, and refines your choices based on your real situation. Included as part of your consultation session.' },
  { title: 'Private Planning Package', tag: 'Custom pricing, enquire', body: 'Extended multi-session support covering registry, nursery, newborn preparation, and ongoing planning. Custom scope and pricing. Contact hello@taylormadebabyco.com to discuss.' },
] as const;

export const SERVICES_LEAD_MAGNET = {
  heading: 'Not Ready to Book? Download the Free Stroller Decision Guide.',
  body: 'The single most common question in every consultation is about strollers. Before you book, or even if you never book, this free guide gives you the (( framework )) Taylor uses in every session to narrow the stroller decision for your specific situation.',
  bullets: [
    '7 questions to ask before choosing any stroller',
    'The vehicle compatibility checklist (LATCH + boot space)',
    'Full-size vs lightweight vs travel system, who each is for',
    'Brand guide: UPPAbaby, Nuna, Bugaboo, Cybex, Baby Jogger side by side',
    'Double stroller timing, when to buy and which type',
    'What to try in-store before you commit',
    'The 5 strollers Taylor recommends most often, and why',
  ],
} as const;

export const SERVICES_FAQ = [
  {
    question: 'How much does a baby registry consultation cost?',
    answer:
      'Taylor-Made Baby Co. offers 1-hour virtual baby registry consultations at $75. This includes a pre-session intake review, a 60-minute video call with Taylor, and written follow-up notes delivered after the session. A full refund is available for cancellations made 24 or more hours before the scheduled session.',
  },
  {
    question: 'What does a baby registry consultation include?',
    answer:
      'Every Taylor-Made Baby Co. consultation includes: pre-session intake review by Taylor personally, a 1-hour video call covering stroller selection, car seat safety, nursery planning, feeding gear, and registry strategy, and written follow-up notes summarising your recommendations and next steps. No upselling, no brand sponsorship, no affiliate recommendations.',
  },
  {
    question: 'Is the baby registry consultation virtual or in-person?',
    answer:
      'All Taylor-Made Baby Co. consultations are conducted virtually via Zoom or Google Meet and are available to expecting parents across all 50 US states. For Phoenix, AZ families, Taylor can additionally connect you with CPST-certified car seat installation specialists and local baby resources.',
  },
  {
    question: 'How do I book a baby registry consultation?',
    answer:
      'Visit taylormadebabyco.com/book to select your session time and complete Taylor’s intake form. Payment of $75 is due at booking. Taylor personally reviews your intake before the session so your consultation begins with tailored recommendations immediately, no background questions at the start of your hour.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      'A full refund is issued for cancellations made 24 or more hours before the scheduled session, processed within 5 to 7 business days to the original payment method. Cancellations within 24 hours and no-shows are non-refundable. If Taylor-Made Baby Co. cancels for any reason, a full refund is issued within 3 to 5 business days plus a complimentary 30-minute follow-up session.',
  },
  {
    question: 'Do I need to have started my registry before booking?',
    answer:
      'No. Clients arrive at every stage, from a completely blank registry to a 150-item list that needs trimming. Both are equally suited to the consultation format. Taylor reviews your intake form beforehand so the session is immediately focused on your specific situation, not gathering background information.',
  },
  {
    question: 'What stroller and car seat brands does Taylor cover?',
    answer:
      'Taylor has hands-on experience with all major brands including UPPAbaby, Nuna, Bugaboo, Cybex, Baby Jogger, Mockingbird, Doona, Chicco, Graco, Maxi-Cosi, and Britax. Every recommendation is based on your vehicle, home, lifestyle, and budget, not on brand sponsorship or affiliate commission. Taylor-Made Baby Co. is fully independent.',
  },
  {
    question: 'Is Taylor-Made Baby Co. available outside of Phoenix, AZ?',
    answer:
      'Yes. All consultations are virtual and available to expecting parents across the entire United States. Taylor-Made Baby Co. is based in Phoenix, AZ but serves clients nationwide via Zoom or Google Meet. Phoenix-area families gain additional access to Taylor’s local professional network including CPST-certified car seat technicians.',
  },
] as const;

export const SERVICES_CLOSING = {
  headline: 'Six big decisions. One focused hour.',
  categories: 'Stroller. Car seat. Nursery. Feeding. Registry. Travel.',
  body: 'In 60 minutes with Taylor, you will walk away knowing exactly what to buy, what to register for, and what to skip, with written notes to back it up. No more research spirals. No more second-guessing. No more buying something that turns out to be wrong.',
  proof: '$75. One session. Clear answers. Written follow-up.',
} as const;
