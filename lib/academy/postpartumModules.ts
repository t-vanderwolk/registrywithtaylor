export type PostpartumAcademyModuleSlug =
  | 'healing-and-recovery'
  | 'first-weeks-home-rhythm'
  | 'feeding-and-lactation'
  | 'rest-and-sleep'
  | 'emotional-wellness-and-identity'
  | 'support-systems';

type PostpartumAcademyCoreSection = {
  title: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
  paragraphs: string[];
};

type PostpartumAcademyProductExample = {
  name: string;
  description: string;
  pros: string[];
};

export type PostpartumAcademyModuleRecord = {
  title: string;
  slug: PostpartumAcademyModuleSlug;
  path: 'postpartum';
  moduleOrder: number;
  totalModules: number;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  intro: string[];
  coreSections: PostpartumAcademyCoreSection[];
  decisionBullets: string[];
  products: PostpartumAcademyProductExample[];
  softCtaLabel: string;
  softCtaTitle: string;
  softCtaBody: string[];
  nextModuleSlug: PostpartumAcademyModuleSlug | null;
  previousModuleSlug: PostpartumAcademyModuleSlug | null;
  markdownContent: string;
};

type PostpartumAcademyModuleInput = Omit<PostpartumAcademyModuleRecord, 'path' | 'totalModules'>;

const TOTAL_MODULES = 6;
const BREASTFEEDING_IMAGES = {
  formulaNara: '/assets/breastfeeding/formulanara.png',
  lifestylePump: '/assets/breastfeeding/lifestylepump.png',
  pumpLifestyle: '/assets/breastfeeding/pumplifestyle.png',
  storageBags: '/assets/breastfeeding/storagebags.png',
  storageBottles: '/assets/breastfeeding/storagebottttles.png',
} as const;
const POSTPARTUM_IMAGES = {
  healingIntro: '/assets/editorial/teddy-glow.png',
  healingReality: '/assets/editorial/organize.png',
  healingSupport: '/assets/editorial/babyroom.png',
  restIntro: '/assets/editorial/babyincrib.png',
  restReality: '/assets/editorial/teddy-glow.png',
  restSupport: '/assets/editorial/babyroom.png',
  emotionalIntro: '/assets/editorial/notebook-bunny.png',
  emotionalReality: '/assets/editorial/teddy-glow.png',
  emotionalSupport: '/assets/editorial/bunny-gift.png',
  supportIntro: '/assets/editorial/notebook-bunny.png',
  supportLooksLike: '/assets/editorial/babyroom.png',
  supportTruth: '/assets/editorial/bear-blocks.png',
} as const;

function stripMarkdownSeparators(value: string) {
  return value
    .replace(/^\s*-{3}\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function createPostpartumModule(module: PostpartumAcademyModuleInput): PostpartumAcademyModuleRecord {
  return {
    ...module,
    markdownContent: stripMarkdownSeparators(module.markdownContent),
    path: 'postpartum',
    totalModules: TOTAL_MODULES,
  };
}

export const POSTPARTUM_ACADEMY_MODULES: PostpartumAcademyModuleRecord[] = [
  createPostpartumModule({
    title: 'Healing & Recovery',
    slug: 'healing-and-recovery',
    moduleOrder: 1,
    description:
      'Physical recovery has three distinct phases with different constraints and care needs at each one. The six-week mark is a medical checkpoint, not a finish line.',
    subhead: 'Three phases. Not one blob called "recovery."',
    imagePath: '/assets/editorial/teddy-glow.png',
    imageAlt: 'Soft postpartum recovery editorial image for the Healing & Recovery module.',
    intro: [
      'Most postpartum preparation focuses on the baby. The physical reality of recovering from birth often goes underprepared.',
      'This is partly because recovery is unpredictable. It is partly because the cultural message around postpartum is to bounce back quickly and quietly.',
      'The bounce-back framing is not just unhelpful — it is medically inaccurate. Birth is a significant physical event. Recovery follows a real timeline with real phases, and understanding what each phase involves changes how you move through it.',
      'This module maps that timeline, covers the practical tools that support healing, and names the red-flag symptoms that deserve more than patience.',
    ],
    coreSections: [
      {
        title: 'The three phases of physical recovery',
        imageSrc: POSTPARTUM_IMAGES.healingIntro,
        imageAlt: 'Postpartum recovery essentials shown in soft, calm editorial tones.',
        paragraphs: [
          'Physical recovery after birth moves through roughly three phases, each with different constraints and different care priorities.',
          'Weeks one and two are the acute phase. This is when physical healing is most active and most demanding. Uterine contractions continue as the uterus returns to its pre-pregnancy size — the cramping from this, called afterpains, can be significant especially during breastfeeding and especially with second or subsequent births. Perineal healing (vaginal birth) or incision healing (C-section) is in its earliest and most sensitive stage. Lochia — postpartum bleeding — is typically heaviest during this window. Fatigue in weeks one and two is not ordinary tiredness. It is physiological depletion layered on top of emotional shock layered on top of caring for a newborn. Rest in this window is not optional.',
          'Weeks three and four are stabilization. Many of the acute symptoms begin to reduce. Lochia lightens and often transitions from red to pink to brown. The most significant tissue healing continues underneath the surface even when surface symptoms improve. Energy does not return uniformly — there are better days and harder ones, sometimes back to back, without a clear pattern.',
          'Weeks five and beyond are rebuilding. The six-week postpartum appointment is often framed as a clearance — the point at which recovery is "done." It is not. The six-week mark is a medical checkpoint, not a finish line. Pelvic floor recovery, hormonal stabilization, and physical rebuilding continue for months. Returning to exercise before the core and pelvic floor are structurally ready is one of the most common ways recovery gets complicated. A pelvic floor physical therapist is the most underused postpartum resource available.',
        ],
      },
      {
        title: 'Vaginal birth and C-section recovery — two different paths',
        imageSrc: POSTPARTUM_IMAGES.healingReality,
        imageAlt: 'Calm recovery space reflecting the different timelines for vaginal and cesarean recovery.',
        paragraphs: [
          'Vaginal birth and C-section recovery involve different tissue, different healing constraints, and different restrictions. They are not faster or slower versions of the same thing.',
          'Vaginal birth recovery centers on perineal healing. Tears and episiotomies range from minor (first-degree, surface skin only) to more significant (fourth-degree, involving rectal tissue). The healing timeline and discomfort level vary accordingly. Sitting, walking, and using the bathroom can all be uncomfortable in the first weeks. Sitz baths, peri bottles, witch hazel pads, and ice packs address the most common discomforts directly.',
          'C-section recovery is major abdominal surgery recovery. The incision involves multiple tissue layers, and healing requires real activity restrictions. Lifting anything heavier than the baby is typically restricted for the first several weeks. Driving is restricted until you can make sudden movements without pain — usually three to six weeks. The scar itself can cause sensitivity, numbness, or tightness for months. Core rehabilitation after a C-section requires working with a provider who understands post-surgical abdominal recovery.',
          'Both paths involve significant hormonal shifts in the first days and weeks: estrogen and progesterone drop sharply after delivery, which contributes to mood volatility (the "baby blues"), night sweats, and hair loss that typically begins around three months postpartum. These are normal physiological responses to a normal hormonal change.',
        ],
      },
      {
        title: 'The postpartum recovery kit — what each item actually does',
        imageSrc: POSTPARTUM_IMAGES.healingSupport,
        imageAlt: 'Postpartum recovery supply setup with practical healing tools.',
        paragraphs: [
          'The postpartum recovery kit is not glamorous, but it covers the most uncomfortable early symptoms with direct, practical tools.',
          'The peri bottle is a squeeze bottle used to rinse the perineal area with warm water after using the toilet. It reduces stinging, supports cleanliness, and is typically provided at the hospital — ask for extras before discharge. This is the most used item in the kit for vaginal birth recovery.',
          'Witch hazel pads (Tucks or a generic equivalent) reduce swelling and soothe perineal soreness. They can be placed directly on a pad or used to cool and compress the area. They work and they are inexpensive.',
          'Stool softeners. Constipation after birth is extremely common and can be painful given perineal soreness or abdominal incision. Stool softeners are often started in the hospital and continued at home. Staying ahead of constipation is significantly easier than managing it after the fact.',
          'Ice packs or padsicles (frozen pads with witch hazel) address swelling and soreness in the first days. The hospital will typically provide ice packs — take as many as they offer.',
          'For C-section recovery: high-waisted underwear or recovery shorts that sit above rather than on the incision are one of the most practical comfort investments. They reduce friction on the incision line and can be worn under regular clothing without cutting across the healing tissue.',
        ],
      },
      {
        title: 'When to call — symptoms that should not wait',
        imageSrc: '/assets/editorial/notebook-bunny.png',
        imageAlt: 'Postpartum notes and planning reflecting awareness of when symptoms need attention.',
        paragraphs: [
          'Most postpartum discomfort is normal and expected. Some symptoms require prompt medical attention. Knowing the difference matters.',
          'Call your provider same-day for: heavy bleeding that soaks more than one pad per hour for two or more hours; passing blood clots larger than a golf ball; fever above 100.4°F (38°C); signs of infection at the perineum or C-section incision (increasing redness, swelling, warmth, discharge, or odor); painful, red, or swollen areas in the legs that could indicate a blood clot; severe or worsening headache, vision changes, or upper abdominal pain (signs of postpartum preeclampsia).',
          'Postpartum preeclampsia deserves its own emphasis because many people do not know it can develop after delivery. High blood pressure and its associated symptoms can occur in the days and weeks after birth even in people who had no blood pressure issues during pregnancy. It is a medical emergency.',
          'For emotional symptoms: feeling deeply sad, empty, hopeless, or disconnected for more than two weeks; intrusive thoughts you cannot control; difficulty bonding with the baby; thoughts of harming yourself or the baby. These warrant a call to your provider and are not signs of weakness or failure — they are treatable medical conditions.',
        ],
      },
    ],
    decisionBullets: [
      'Physical recovery has three phases: acute (weeks 1-2), stabilization (weeks 3-4), rebuilding (weeks 5+). The six-week appointment is a checkpoint, not a finish line.',
      'Vaginal birth recovery centers on perineal healing; C-section recovery is post-surgical abdominal recovery. They have different restrictions and different timelines.',
      'The postpartum kit basics: peri bottle, witch hazel pads, stool softener, ice packs. For C-section: high-waisted recovery underwear.',
      'Pelvic floor physical therapy is the most underused postpartum resource. It supports both vaginal and C-section recovery.',
      'Know the red-flag symptoms that require same-day medical attention: heavy bleeding, fever, signs of infection, severe headache, vision changes.',
    ],
    products: [
      {
        name: 'FridaMom Postpartum Recovery Kit',
        description: 'A practical all-in-one kit covering the most common perineal recovery needs: peri bottle, mesh underwear, ice maxi pads, and witch hazel wipes.',
        pros: ['Covers the acute recovery window without multiple separate purchases', 'Peri bottle and witch hazel pads are the two highest-use items in early recovery'],
      },
      {
        name: 'Frida Mom Upside Down Peri Bottle',
        description: 'An ergonomically angled peri bottle that works without requiring awkward positioning to direct the stream correctly.',
        pros: ['Easier to use than a standard squeeze bottle given mobility limitations in the first days', 'Works with one hand'],
      },
      {
        name: 'Belly Bandit C-Section Recovery Shorts',
        description: 'High-waisted compression shorts designed to sit above the C-section incision line, reducing friction and supporting the abdominal area during early recovery.',
        pros: ['Reduces incision friction during movement', 'Wearable under regular clothing'],
      },
    ],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'Recovery is a real timeline, not a performance.',
    softCtaBody: [
      'The six-week mark does not mean you are done. Pelvic floor recovery, hormonal stabilization, and physical rebuilding continue longer.',
      'Know the phases, use the practical tools, recognize the red-flag symptoms. That is the foundation of realistic postpartum recovery.',
    ],
    nextModuleSlug: 'first-weeks-home-rhythm',
    previousModuleSlug: null,
    markdownContent: `# Healing & Recovery

Three phases. Not one blob called "recovery."

## Module 1 of 6 · Postpartum

Most postpartum preparation focuses on the baby. The physical reality of recovering from birth often goes underprepared.

The bounce-back framing is not just unhelpful — it is medically inaccurate. Birth is a significant physical event. Recovery follows a real timeline with real phases, and understanding what each phase involves changes how you move through it.

This module maps that timeline, covers the practical tools that support healing, and names the red-flag symptoms that deserve more than patience.

## Signature Decision Map

### The Three Phases of Physical Recovery

Physical recovery after birth moves through roughly three phases, each with different constraints and different care priorities.

**Weeks one and two** are the acute phase. Uterine contractions continue as the uterus returns to its pre-pregnancy size. Perineal or incision healing is in its earliest and most sensitive stage. Lochia is typically heaviest. Fatigue is not ordinary tiredness — it is physiological depletion layered on emotional adjustment layered on newborn care. Rest in this window is not optional.

**Weeks three and four** are stabilization. Acute symptoms begin to reduce. Lochia lightens. Energy does not return uniformly — there are better days and harder days, sometimes back to back, without a clear pattern.

**Weeks five and beyond** are rebuilding. The six-week postpartum appointment is often framed as clearance — the point at which recovery is "done." It is not. It is a medical checkpoint. Pelvic floor recovery, hormonal stabilization, and physical rebuilding continue for months. A pelvic floor physical therapist is the most underused postpartum resource available.

![Postpartum recovery essentials shown in soft, calm editorial tones.](${POSTPARTUM_IMAGES.healingIntro})

### Vaginal Birth and C-Section Recovery — Two Different Paths

Vaginal birth and C-section recovery involve different tissue, different healing constraints, and different restrictions. They are not faster or slower versions of the same thing.

**Vaginal birth recovery** centers on perineal healing. Tears and episiotomies range from minor to more significant. Sitz baths, peri bottles, witch hazel pads, and ice packs address the most common discomforts directly.

**C-section recovery** is major abdominal surgery recovery. Lifting anything heavier than the baby is typically restricted for several weeks. Driving is restricted until you can make sudden movements without pain. The scar can cause sensitivity, numbness, or tightness for months. Core rehabilitation requires working with a provider who understands post-surgical abdominal recovery.

Both paths involve significant hormonal shifts: estrogen and progesterone drop sharply after delivery, contributing to mood volatility, night sweats, and hair loss that typically begins around three months postpartum. These are normal physiological responses.

![Calm recovery space reflecting the different timelines for vaginal and cesarean recovery.](${POSTPARTUM_IMAGES.healingReality})

### The Postpartum Recovery Kit — What Each Item Actually Does

The peri bottle rinses the perineal area after using the toilet. Ask for extras at the hospital before discharge. This is the most-used item in early vaginal birth recovery.

Witch hazel pads reduce swelling and soothe perineal soreness. They can be placed directly on a pad. They work and they are inexpensive.

Stool softeners address constipation after birth, which is extremely common and painful given perineal or abdominal healing. Stay ahead of it rather than waiting until it is a problem.

Ice packs or padsicles address swelling in the first days. Take as many as the hospital offers.

For C-section recovery: high-waisted underwear or recovery shorts that sit above the incision are one of the most practical investments. They reduce friction and can be worn under regular clothing.

![Postpartum recovery supply setup with practical healing tools.](${POSTPARTUM_IMAGES.healingSupport})

### When to Call — Symptoms That Should Not Wait

Most postpartum discomfort is normal. Some symptoms require prompt medical attention.

**Call your provider same-day for:** heavy bleeding soaking more than one pad per hour for two or more hours; passing clots larger than a golf ball; fever above 100.4°F; signs of infection at the incision or perineum; painful, red, or swollen areas in the legs; severe or worsening headache, vision changes, or upper abdominal pain.

**Postpartum preeclampsia** deserves specific mention: high blood pressure and its symptoms can develop after delivery even with no blood pressure issues during pregnancy. It is a medical emergency.

**For emotional symptoms:** feeling deeply sad, empty, or disconnected for more than two weeks; intrusive thoughts; difficulty bonding; thoughts of harming yourself or the baby. These warrant a call to your provider. They are treatable medical conditions, not personal failures.

![ Postpartum notes and planning reflecting awareness of when symptoms need attention.](/assets/editorial/notebook-bunny.png)

## What This Means For You

- Physical recovery has three phases: acute (weeks 1-2), stabilization (weeks 3-4), rebuilding (weeks 5+). The six-week appointment is a checkpoint, not a finish line.
- Vaginal birth and C-section recovery have different restrictions and timelines. Know which path applies to you.
- The postpartum kit: peri bottle, witch hazel pads, stool softener, ice packs. For C-section: high-waisted recovery underwear.
- Pelvic floor physical therapy supports both vaginal and C-section recovery — it is consistently underused.
- Know the red-flag symptoms that require same-day attention.

## Before You Move Forward

Recovery is a real timeline, not a performance.

The six-week mark does not mean you are done. Know the phases, use the practical tools, and recognize the symptoms that need more than patience.

## Next Steps

- Continue to First-Weeks Home Rhythm`,
  }),
  createPostpartumModule({
    title: 'First-Weeks Home Rhythm',
    slug: 'first-weeks-home-rhythm',
    moduleOrder: 2,
    description:
      'Instead of trying to keep the whole house functional, build two or three anchor stations — self-sufficient zones where caregiving actually happens — and let the rest of the house wait.',
    subhead: 'The anchor station approach to surviving the first stretch.',
    imagePath: '/assets/editorial/babyroom.png',
    imageAlt: 'First-weeks home rhythm editorial image for the First-Weeks Home Rhythm module.',
    intro: [
      'The first weeks at home are rarely hard because you forgot one product. They are hard because nothing in the house was designed for the new workflow.',
      'Recovery is happening. Feeding is happening every two to three hours around the clock. Sleep is fragmented. Meals need to happen. Laundry is accumulating. Visitors may be arriving. Dishes exist.',
      'These things are all happening in the same house, often in the same rooms, on the same surfaces, without a system for any of it.',
      'The most useful concept for this period is the anchor station — a small, self-sufficient zone stocked for the tasks that happen most frequently, so you are not crossing the house or hunting for supplies when you are already tired.',
    ],
    coreSections: [
      {
        title: 'Why "getting back to normal" is the wrong goal',
        imageSrc: '/assets/editorial/organize.png',
        imageAlt: 'Home organization editorial representing the shift from pre-baby to postpartum household expectations.',
        paragraphs: [
          'The most common source of home friction in the first weeks is trying to return the household to its pre-baby operating state while simultaneously absorbing a newborn into it.',
          'The house will not function the way it did before. Not for a while. Setting the goal as "back to normal" means failing constantly against a standard that does not apply to the current situation.',
          'The more useful goal is: what does this house need to do right now? Right now, it needs to support recovery, feeding, and sleep — for the baby and for the adults. Everything else is optional until the household has enough capacity to take it on.',
          'Housework backlogs during the first weeks are not evidence that something went wrong. They are evidence that the adults correctly prioritized the things that matter more.',
          'This reframe is not permission to let the house deteriorate permanently. It is permission to let it be imperfect for a defined period without treating that as failure.',
        ],
      },
      {
        title: 'The anchor station framework',
        imageSrc: '/assets/editorial/babyroom.png',
        imageAlt: 'Baby room as an anchor station with caregiving essentials organized within reach.',
        paragraphs: [
          'An anchor station is a small stocked zone set up wherever you spend significant caregiving time, so that you can handle a 90-minute cycle of feeding, changing, and settling without leaving that zone.',
          'Most homes need two anchor stations: one in the main living area where daytime caregiving happens, and one in the bedroom for overnight caregiving. Multi-story homes often need one per floor.',
          'Each station needs the same core supplies: diapers in the current size, wipes, one or two spare changing surfaces or pads, a burp cloth, a water bottle and snacks for the adult, a phone charger, and a nursing or feeding setup if needed.',
          'The stations do not need to be elaborate. A small basket or tray with the right supplies on a side table is enough. What matters is that every item needed for a complete care cycle is within arm reach of where you already are, so that the care cycle does not require you to locate and retrieve supplies from another room while managing a baby.',
          'Build the stations before the baby arrives. Stock them with at least a week of supplies so they do not require frequent restocking. The goal is to make the station a set-it-and-forget-it system, not another thing to manage.',
        ],
      },
      {
        title: 'Meals as infrastructure, not luxury',
        paragraphs: [
          'The postpartum period is physiologically demanding. Recovery requires calories. Breastfeeding requires additional calories. The adults in the house need to eat regularly even when regular meal preparation is not happening.',
          'Meal support is not a luxury for people with help. It is infrastructure. The options are: meals prepared ahead and frozen before the birth, a meal train coordinated with family and friends, food delivery, or a combination.',
          'Freezer meals prepared in the third trimester are the most cost-effective approach for families who have the capacity to prepare them. They are also the most reliable — they do not depend on coordination, scheduling, or anyone showing up.',
          'A meal train organized by a family member or friend is the second most effective option. The key is coordinating it so that meals arrive spread over several weeks rather than concentrated in the first few days when hospital food and takeout are still covering things.',
          'The honest case for investing in meal support: in the first weeks, the time and energy required to prepare a meal from scratch is the same time and energy that could be used to sleep for an hour. Sleep is the scarcer resource. A meal that arrives already made is not an indulgence — it is an hour of recovery.',
        ],
      },
      {
        title: 'The visitor protocol — converting guests into help',
        paragraphs: [
          'Visitors during the first weeks fall into two categories: people who come to hold the baby while you perform okayness, and people who come to make the house function better so you can rest.',
          'The default is the first category. Visitors arrive, you hand them the baby, someone makes tea, everyone talks, and when they leave the house has not materially improved. You are also more tired than before they arrived because social performance is work.',
          'The visitor protocol is about converting more visits into the second category by giving people something specific to do when they ask how they can help.',
          'Specific asks that visitors can reliably do: bring a meal; do a load of laundry from start to folded; run a specific errand; hold the baby for a defined block of time (two hours, not an open-ended visit) so you can sleep; clean the kitchen; walk the dog.',
          'The ask needs to be specific enough that the visitor does not have to make decisions. "Can you hold the baby for two hours while I sleep?" is a usable ask. "Let me know if you need anything" is not.',
          'For relatives who will stay for multiple days: define the jobs before they arrive. A relative who knows they are responsible for dinner preparation and laundry for four days is a different kind of help than a relative who arrives expecting to be hosted.',
        ],
      },
    ],
    decisionBullets: [
      'Let go of "getting back to normal." The goal is a house that supports recovery, feeding, and sleep — not a house that looks pre-baby.',
      'Build anchor stations before the birth: one in the main living area, one in the bedroom, one per floor in multi-story homes. Stock each for a complete 90-minute care cycle.',
      'Treat meals as infrastructure. Freezer meals, meal trains, or food delivery are not luxuries — they are hours of recovery in food form.',
      'Convert visitors into help by giving them specific asks before they arrive. "Can you hold the baby for two hours so I can sleep?" beats "let us know what you need."',
      'For multi-day relatives: define the jobs before they arrive so their help is structured rather than ambiguous.',
    ],
    products: [
      {
        name: 'Boppy Nursing Pillow',
        description: 'A positioning tool that anchors the feeding station — keeps the baby at the right height during breastfeeding or bottle feeding without requiring the adult to hold all the weight.',
        pros: ['Reduces arm and shoulder fatigue during long feeding sessions', 'Works for bottle feeding too, making it useful for both parents'],
      },
      {
        name: 'FridaMom Postpartum Recovery Kit',
        description: 'The recovery supply layer for the bedroom anchor station — covers the most common perineal recovery needs without requiring separate purchases.',
        pros: ['Covers the recovery station in one purchase', 'Most-used items in early postpartum recovery already assembled'],
      },
      {
        name: 'Owala FreeSip Water Bottle',
        description: 'A large-capacity, leak-proof water bottle that belongs in every anchor station — breastfeeding and recovery both require consistent hydration.',
        pros: ['One-handed operation for caregiving moments', 'Large enough to reduce how often it needs refilling'],
      },
    ],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'Build the stations. Accept the help. Let the rest wait.',
    softCtaBody: [
      'The first weeks are not a test of how well you can maintain a household while recovering from birth. They are a period of focused recovery.',
      'Anchor stations reduce friction. Meal support reduces work. Specific asks convert visitors into help. That is the infrastructure for surviving the first stretch.',
    ],
    nextModuleSlug: 'feeding-and-lactation',
    previousModuleSlug: 'healing-and-recovery',
    markdownContent: `# First-Weeks Home Rhythm

The anchor station approach to surviving the first stretch.

## Module 2 of 6 · Postpartum

The first weeks at home are rarely hard because you forgot one product. They are hard because nothing in the house was designed for the new workflow.

Recovery is happening. Feeding is happening every two to three hours. Sleep is fragmented. Meals need to happen. Laundry is accumulating. Visitors may be arriving.

The most useful concept for this period is the anchor station: a small, self-sufficient zone stocked for the tasks that happen most frequently, so you are not crossing the house for supplies when you are already tired.

## Signature Decision Map

### Why "Getting Back to Normal" Is the Wrong Goal

The house will not function the way it did before. Not for a while. Setting the goal as "back to normal" means failing constantly against a standard that does not apply to the current situation.

The more useful goal: what does this house need to do right now? Right now, it needs to support recovery, feeding, and sleep — for the baby and for the adults. Everything else is optional until the household has enough capacity.

Housework backlogs during the first weeks are not evidence that something went wrong. They are evidence that the adults correctly prioritized the things that matter more.

![Home organization editorial representing the shift from pre-baby to postpartum household expectations.](/assets/editorial/organize.png)

### The Anchor Station Framework

An anchor station is a small stocked zone set up wherever you spend significant caregiving time, so you can handle a complete care cycle without leaving that zone.

Most homes need two stations: one in the main living area for daytime caregiving, and one in the bedroom for overnight caregiving. Multi-story homes often need one per floor.

Each station needs the same core supplies: diapers in the current size, wipes, one or two spare changing surfaces, a burp cloth, a water bottle and snacks for the adult, a phone charger, and a feeding setup if needed.

The stations do not need to be elaborate. A basket or tray with the right supplies is enough. What matters is that every item needed for a complete care cycle is within arm reach of where you already are.

Build the stations before the baby arrives. Stock them with at least a week of supplies so they do not require frequent restocking.

![Baby room as an anchor station with caregiving essentials organized within reach.](/assets/editorial/babyroom.png)

### Meals as Infrastructure, Not Luxury

The postpartum period is physiologically demanding. Recovery requires calories. Breastfeeding requires additional calories. The adults need to eat regularly even when regular meal preparation is not happening.

The options are: meals prepared ahead and frozen before the birth, a meal train coordinated with family and friends, food delivery, or a combination.

Freezer meals prepared in the third trimester are the most cost-effective and reliable — they do not depend on coordination or anyone showing up.

The honest case: in the first weeks, the time required to prepare a meal from scratch is the same time that could be used to sleep for an hour. Sleep is the scarcer resource. A meal that arrives already made is an hour of recovery.

![Postpartum meal support and food as practical household infrastructure.](/assets/editorial/bunny-gift.png)

### The Visitor Protocol — Converting Guests into Help

Visitors during the first weeks default to the hold-the-baby-while-you-perform-okayness mode. Social performance is work. When visitors leave, you are often more tired than before they arrived.

Convert more visits into the second category — people who make the house function better so you can rest — by giving them something specific to do.

Specific asks that work: bring a meal; do a load of laundry from start to folded; hold the baby for a defined block of time so you can sleep; clean the kitchen; run a specific errand.

The ask needs to be specific enough that the visitor does not have to make decisions. "Can you hold the baby for two hours while I sleep?" is a usable ask.

For relatives staying multiple days: define the jobs before they arrive. A relative who knows they are responsible for dinner and laundry for four days is a different kind of help.

![Postpartum support concept showing guests as helpers rather than audience.](/assets/editorial/bear-blocks.png)

## What This Means For You

- Let go of "getting back to normal." The goal is a house that supports recovery, feeding, and sleep.
- Build anchor stations before the birth: one in the main living area, one in the bedroom, one per floor in multi-story homes.
- Treat meals as infrastructure. Freezer meals, meal trains, or food delivery are hours of recovery.
- Convert visitors into help with specific asks before they arrive.
- For multi-day relatives: define the jobs before they arrive.

## Before You Move Forward

Build the stations. Accept the help. Let the rest wait.

The first weeks are not a test of household management. They are a period of focused recovery.

## Next Steps

- Continue to Feeding & Lactation
- Back to Healing & Recovery`,
  }),
  createPostpartumModule({
    title: 'Feeding & Lactation',
    slug: 'feeding-and-lactation',
    moduleOrder: 3,
    description:
      'Breastfed, formula-fed, and combination-fed babies all get fed. The goal is a sustainable feeding system — not the "best" method. Here is what each path actually involves.',
    subhead: 'A fed baby is the goal. The path is yours to choose.',
    imagePath: BREASTFEEDING_IMAGES.formulaNara,
    imageAlt: 'Flexible feeding setup image for the Feeding & Lactation module.',
    intro: [
      'Feeding your baby carries a level of emotional weight that nutrition alone does not explain.',
      'It is wrapped up in identity, expectations, recovery, connection, and — frequently — a plan that meets real life and has to change.',
      'This module is the support conversation, not the gear conversation. The gear (pumps, bottles, storage) is covered in the Gear path.',
      'This module covers what breastfeeding actually involves in the first days, what the three most common problems look like and who can help, how combination feeding works as a deliberate strategy, and how to evaluate formula without the marketing noise.',
    ],
    coreSections: [
      {
        title: 'What breastfeeding actually requires in the first 72 hours',
        imageSrc: BREASTFEEDING_IMAGES.lifestylePump,
        imageAlt: 'Breastfeeding and pumping lifestyle image showing the reality of early feeding establishment.',
        paragraphs: [
          'The first 72 hours of breastfeeding are the most physiologically critical window for establishing supply, and also the most frequently misunderstood.',
          'In the first hours and days, the breast produces colostrum — a small-volume, nutrient-dense early milk that the baby\'s stomach is sized for. The volume is intentionally small; a newborn\'s stomach holds roughly five to seven milliliters at birth. A colostrum-only baby who is feeding frequently and producing wet and dirty diapers is getting what they need.',
          'Supply is established through demand. Frequent, effective feeding in the first days signals the body to build the milk supply that will be needed later. Every skipped or supplemented feeding in this window can affect supply establishment — which is the central reason medical providers emphasize demand feeding rather than scheduled feeding in the early weeks.',
          'Around days two to five, milk transitions from colostrum to transitional and then mature milk. Engorgement — significant breast fullness that can cause hardness, warmth, and discomfort — often accompanies this transition. Frequent feeding resolves engorgement; leaving breasts full for extended periods worsens it and can affect supply.',
          'An IBCLC (International Board Certified Lactation Consultant) in the first days and weeks is the single most useful investment for breastfeeding families. Hospital lactation consultants are available during the birth admission; private IBCLCs provide follow-up support after discharge. Insurance often covers IBCLC visits — it is worth checking before assuming out-of-pocket cost.',
        ],
      },
      {
        title: 'The latch-supply-pain triad — what each problem looks like',
        imageSrc: BREASTFEEDING_IMAGES.pumpLifestyle,
        imageAlt: 'Pumping lifestyle showing the practical reality of milk expression and supply management.',
        paragraphs: [
          'The three most common breastfeeding difficulties — latch problems, supply concerns, and pain — often interact with each other, which makes them harder to separate without help.',
          'Latch problems: a shallow or poorly positioned latch is the most common source of nipple pain in the early weeks. Signs of a latch issue include nipple pain or damage, a clicking sound during feeding, the baby seeming unsatisfied after long feeding sessions, and slow weight gain. An IBCLC can assess and correct latch issues in most cases; the key is seeking help before nipple damage becomes too painful to continue feeding.',
          'Supply concerns: low supply is far less common than perceived low supply. A baby who is feeding frequently, producing adequate wet and dirty diapers, and gaining weight appropriately is almost certainly getting enough milk, even if pumped output seems low or the mother does not feel "full." Pumped output is a poor proxy for actual milk supply. True low supply exists and is real, but it is frequently overdiagnosed by parents comparing output to bottles or to each other. An IBCLC or pediatrician can assess supply with a weighted feeding — the most accurate measurement available.',
          'Pain: breastfeeding should not be routinely painful beyond the initial latch moment. Ongoing nipple pain, damage, or deep breast pain during or between feedings are signs something needs to be addressed. Thrush, mastitis, and vasospasm are all potential causes beyond latch issues. Each has a different treatment. Pain that persists deserves attention, not tolerance.',
        ],
      },
      {
        title: 'Combination feeding as a deliberate strategy',
        imageSrc: BREASTFEEDING_IMAGES.formulaNara,
        imageAlt: 'Formula and breastfeeding combination shown as a sustainable feeding strategy.',
        paragraphs: [
          'Combination feeding — using both breast milk and formula — is one of the most common infant feeding approaches and one of the least discussed.',
          'It is frequently encountered as a last resort: breastfeeding is not working the way the parent hoped, so formula is introduced to supplement. When it arrives this way, it often carries a sense of failure.',
          'It does not need to arrive that way. Combination feeding can be a deliberate choice from the start — or at any point in the feeding journey — when it better supports the parent\'s recovery, return to work, shared feeding responsibilities with a partner, or long-term sustainability.',
          'Introducing supplemental formula is easiest before milk supply is fully established. After supply is established, supplementing with formula can affect supply if bottle feeding replaces breast feeds rather than supplementing them. Timing matters, and an IBCLC can help navigate the transition without supply disruption when that is the goal.',
          'The honest framing: the goal is a fed baby and a functional adult. A combination feeding approach that allows the breastfeeding parent to sleep a longer stretch, allows a partner to participate in nighttime feeding, and reduces stress is achieving all three goals simultaneously.',
        ],
      },
      {
        title: 'Formula as a tool — what to know and what to ignore',
        imageSrc: BREASTFEEDING_IMAGES.storageBags,
        imageAlt: 'Breast milk storage supplies representing the feeding support ecosystem.',
        paragraphs: [
          'Formula is a safe, nutritionally complete option for feeding an infant. It has been engineered to closely approximate breast milk nutritionally, though the two are not identical.',
          'Choosing a formula does not require extensive research in most cases. The AAP recommends iron-fortified, cow\'s-milk-based formula for most healthy full-term infants as the standard starting point. Most major brands meet this specification and are substantively similar in nutritional content.',
          'The marketing-heavy categories — "gentler," "sensitive," "comfort" formulas with various claims about digestion and fussiness — are not necessarily better than standard formula and are often significantly more expensive. Specialty formulas (hydrolyzed, amino acid-based) are for specific medical indications and are typically recommended by a pediatrician, not self-selected at the store.',
          'European formulas marketed as superior to US options are not FDA-regulated and have caused infant illness in some cases due to contamination or nutritional inconsistency during shipping and storage. The AAP does not recommend them.',
          'The practical decision: start with a standard iron-fortified cow\'s-milk-based formula. If the baby shows signs of intolerance (persistent vomiting, blood in stool, significant eczema, failure to gain weight) talk to the pediatrician before switching formulas on your own.',
        ],
      },
    ],
    decisionBullets: [
      'In the first 72 hours, colostrum volume is small by design. A baby with adequate wet and dirty diapers is getting what they need. Frequent feeding establishes supply.',
      'An IBCLC is the single most useful investment for breastfeeding families — in the hospital and through the first weeks. Insurance often covers visits.',
      'The latch-supply-pain triad: each problem has a different presentation and a different solution. Do not tolerate persistent pain or assume low output means low supply without a proper assessment.',
      'Combination feeding can be a deliberate strategy, not a failure mode. Timing the introduction of supplemental formula matters for supply; an IBCLC can help navigate this.',
      'Start with standard iron-fortified, cow\'s-milk-based formula. Specialty and "gentler" formulas are for specific indications, not universal upgrades.',
    ],
    products: [
      {
        name: 'Lansinoh Nipple Cream',
        description: 'A lanolin-based nipple cream for the early weeks of breastfeeding when nipple sensitivity and soreness are most common — safe for the baby without wiping off before feeding.',
        pros: ['Addresses nipple soreness without requiring removal before feeding', 'Inexpensive and broadly available'],
      },
      {
        name: 'Haakaa Manual Breast Pump',
        description: 'A suction-based collection device that catches letdown from the opposite breast during feeding — useful for building a small freezer stash without dedicated pumping sessions.',
        pros: ['Passive collection during nursing sessions', 'Low cost and no setup compared to an electric pump'],
      },
      {
        name: 'Larq Self-Cleaning Bottle Warmer',
        description: 'A bottle warmer for the anchor stations — formula or stored breast milk, heated to the right temperature without the guess-work or the wait.',
        pros: ['Consistent warming temperature reduces formula preparation inconsistency', 'Useful at the overnight anchor station where precision matters and patience is short'],
      },
    ],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'Fed is the goal. The path is yours.',
    softCtaBody: [
      'Breastfed, formula-fed, and combination-fed babies all get fed. The method that is sustainable for the adults in the household is the right method.',
      'If feeding is physically painful, call an IBCLC. If it feels emotionally impossible, call your provider. Both are treatable situations with available support.',
    ],
    nextModuleSlug: 'rest-and-sleep',
    previousModuleSlug: 'first-weeks-home-rhythm',
    markdownContent: `# Feeding & Lactation

A fed baby is the goal. The path is yours to choose.

## Module 3 of 6 · Postpartum

Feeding your baby carries emotional weight that nutrition alone does not explain.

It is wrapped up in identity, expectations, recovery, connection, and — frequently — a plan that meets real life and has to change.

This module covers what breastfeeding actually involves in the first days, what the three most common problems look like, how combination feeding works as a strategy, and how to evaluate formula without the marketing noise.

## Signature Decision Map

### What Breastfeeding Actually Requires in the First 72 Hours

The first 72 hours are the most physiologically critical window for establishing supply, and also the most frequently misunderstood.

In the first hours and days, the breast produces colostrum — a small-volume, nutrient-dense early milk. The volume is intentionally small; a newborn's stomach holds roughly five to seven milliliters at birth. A colostrum-only baby who is feeding frequently and producing wet and dirty diapers is getting what they need.

Supply is established through demand. Frequent, effective feeding in the first days signals the body to build the supply that will be needed later. Every skipped or supplemented feeding in this window can affect supply establishment.

Around days two to five, milk transitions from colostrum to mature milk. Engorgement — significant breast fullness that can cause hardness, warmth, and discomfort — often accompanies this transition. Frequent feeding resolves engorgement.

An IBCLC in the first days and weeks is the single most useful investment for breastfeeding families. Insurance often covers visits.

![Breastfeeding and pumping lifestyle image showing the reality of early feeding establishment.](${BREASTFEEDING_IMAGES.lifestylePump})

### The Latch-Supply-Pain Triad — What Each Problem Looks Like

The three most common breastfeeding difficulties often interact, which makes them harder to separate without help.

**Latch problems:** shallow or poorly positioned latch is the most common source of nipple pain in early weeks. Signs: nipple pain or damage, clicking sound during feeding, baby seeming unsatisfied, slow weight gain. An IBCLC can assess and correct latch issues in most cases.

**Supply concerns:** low supply is far less common than perceived low supply. Pumped output is a poor proxy for actual milk supply. A baby who is feeding frequently, producing adequate diapers, and gaining weight is almost certainly getting enough. True low supply exists but is frequently overdiagnosed. An IBCLC or pediatrician can assess supply with a weighted feeding.

**Pain:** breastfeeding should not be routinely painful beyond the initial latch moment. Ongoing pain, damage, or deep breast pain deserve attention. Thrush, mastitis, and vasospasm are all potential causes with different treatments.

![Pumping lifestyle showing the practical reality of milk expression and supply management.](${BREASTFEEDING_IMAGES.pumpLifestyle})

### Combination Feeding as a Deliberate Strategy

Combination feeding — using both breast milk and formula — is one of the most common infant feeding approaches and one of the least discussed without a sense of failure attached.

It does not need to arrive as a last resort. Combination feeding can be a deliberate choice from the start — or at any point — when it better supports recovery, return to work, shared feeding responsibilities, or long-term sustainability.

Introducing supplemental formula is easiest before milk supply is fully established. After supply is established, supplementing affects supply if bottle feeding replaces breast feeds rather than supplementing them. An IBCLC can help navigate the transition.

The honest framing: a combination approach that allows the breastfeeding parent to sleep a longer stretch, allows a partner to participate in nighttime feeding, and reduces stress is achieving all three goals simultaneously.

![Formula and breastfeeding combination shown as a sustainable feeding strategy.](${BREASTFEEDING_IMAGES.formulaNara})

### Formula as a Tool — What to Know and What to Ignore

Formula is a safe, nutritionally complete option for feeding an infant.

The AAP recommends iron-fortified, cow's-milk-based formula for most healthy full-term infants as the standard starting point. Most major brands meet this specification and are substantively similar in nutritional content.

"Gentler," "sensitive," and "comfort" formulas with various digestion and fussiness claims are not necessarily better than standard formula and are often significantly more expensive. Specialty formulas are for specific medical indications recommended by a pediatrician.

European formulas are not FDA-regulated and have caused infant illness in some cases. The AAP does not recommend them.

Start with standard iron-fortified cow's-milk-based formula. Talk to your pediatrician before switching if the baby shows signs of intolerance.

![Breast milk storage supplies representing the feeding support ecosystem.](${BREASTFEEDING_IMAGES.storageBags})

## What This Means For You

- In the first 72 hours, colostrum volume is small by design. Frequent feeding with adequate diapers means the baby is getting what they need.
- An IBCLC is the single most useful investment for breastfeeding families. Insurance often covers visits.
- The latch-supply-pain triad: each has a different presentation and solution. Persistent pain is not something to tolerate.
- Combination feeding can be a deliberate strategy. Timing the introduction of supplemental formula matters.
- Start with standard iron-fortified cow's-milk-based formula. Skip the specialty marketing unless your pediatrician recommends otherwise.

## Before You Move Forward

Fed is the goal. The path is yours.

If feeding is physically painful, call an IBCLC. If it feels emotionally impossible, call your provider. Both are treatable situations with available support.

## Next Steps

- Continue to Rest & Sleep
- Back to First-Weeks Home Rhythm`,
  }),
  createPostpartumModule({
    title: 'Rest & Sleep',
    slug: 'rest-and-sleep',
    moduleOrder: 4,
    description:
      'Sleep debt in postpartum is managed through distributed responsibility, not solo willpower. The shift handoff model and a few honest reframes make more difference than any sleep schedule.',
    subhead: 'Sleep debt is a logistics problem, not a personal one.',
    imagePath: '/assets/editorial/babyincrib.png',
    imageAlt: 'Baby resting in crib editorial image for the Rest & Sleep module.',
    intro: [
      'Postpartum sleep is one of the most discussed and least honestly framed topics in early parenthood.',
      'The conversation tends to land in one of two modes: tips for getting the baby to sleep longer (useful, but beside the point in the early weeks) or permission slips to validate how hard it is (true, but not actionable).',
      'This module takes a different angle: sleep debt in the postpartum period is a logistics problem. It is managed through distributed responsibility, realistic structuring of overnight shifts, and letting go of the idea that one person tracking every wake-up will eventually develop a pattern that solves the problem.',
      'It will not. Newborns do not have a predictable sleep architecture that gets cracked by optimizing response patterns. They wake because of hunger, developmental needs, and digestive discomfort. The logistics question is not how to stop them from waking — it is how to distribute the responsibility for responding so that no single adult accumulates all of it.',
    ],
    coreSections: [
      {
        title: 'What sleep deprivation actually does',
        imageSrc: POSTPARTUM_IMAGES.restIntro,
        imageAlt: 'Calm bedside setup for postpartum rest reflecting the need for genuine recovery.',
        paragraphs: [
          'Sleep deprivation is not just tiredness. It has real cognitive, emotional, and physiological effects that are worth understanding because understanding them makes the experience feel less like personal failure.',
          'Cognitively: sustained sleep deprivation impairs working memory, decision-making, and emotional regulation in ways that closely resemble mild intoxication. This is why simple decisions feel hard, why you cannot remember whether you already took your medication, and why minor frustrations feel disproportionately large. These are not personality changes — they are sleep deficit effects.',
          'Emotionally: the threshold for emotional response drops significantly under sleep deprivation. Grief, anger, anxiety, and overwhelm all feel amplified. This effect is particularly pronounced at 3 AM when the world is quiet, the night is long, and there is no social context to buffer how difficult things feel.',
          'Physiologically: recovery from birth is impaired by sustained sleep deprivation. The immune system is suppressed. Wound healing is slower. Hormonal regulation is more disrupted. Sleep is not just a comfort need during postpartum recovery — it is a physiological requirement for healing.',
          'Knowing this does not fix the problem. But it reframes it. The cognitive and emotional effects you are experiencing are not signs that you cannot handle this. They are signs that you are sleep deprived. Those are different problems with different solutions.',
        ],
      },
      {
        title: 'The shift handoff model',
        imageSrc: POSTPARTUM_IMAGES.restReality,
        imageAlt: 'Overnight care setup that supports distributed rest responsibility between caregivers.',
        paragraphs: [
          'The most effective structural response to postpartum sleep deprivation in a two-adult household is the shift handoff model: dividing overnight responsibility into defined shifts with clear start and end times, so that each adult gets a protected block of uninterrupted sleep each night.',
          'The model requires two adults and works most cleanly when at least one is not the exclusive breastfeeding parent. When one adult is exclusively breastfeeding, the shift handoff can still work — one adult handles all nursing wakes, the other handles everything else (settling, diapering, burping, returning to sleep) — but the breastfeeding parent\'s protected block will be shorter.',
          'A basic structure: one adult takes the first half of the night (roughly 9 PM to 2 AM) while the other sleeps. At 2 AM, they exchange. The adult who slept the first half takes the second half. Neither adult has a full night, but both adults have an uninterrupted block.',
          'The key discipline: the sleeping adult does not get partially awakened for consultation or emotional support during their off-shift. The sleeping block is protected. When the sleeping block is interrupted, the model does not work.',
          'For single-adult households or households where both adults need to be functional the following day: postpartum doulas who provide overnight coverage exist specifically for this need. A postpartum doula handles overnight infant care so that the parent can sleep. One night per week of overnight coverage can meaningfully change the cumulative sleep debt picture.',
        ],
      },
      {
        title: 'Why "sleep when the baby sleeps" fails — and what actually works',
        imageSrc: POSTPARTUM_IMAGES.restSupport,
        imageAlt: 'Postpartum home setup reflecting the real conditions of daytime rest attempts.',
        paragraphs: [
          '"Sleep when the baby sleeps" is the most commonly given postpartum sleep advice. It is physiologically correct and practically broken.',
          'The physiological case: the most restorative sleep is in the first sleep cycle after waking, and daytime naps are genuinely useful for reducing sleep debt. If you could sleep every time the baby sleeps, you would sleep a meaningful amount.',
          'The practical problem: when the baby finally sleeps during the day, there are also dishes, laundry, meals, and a functional need for twenty minutes of being a person without a baby attached to you. The choice between sleep and personhood is real. The advice "sleep when the baby sleeps" does not account for it.',
          'What actually helps: lowering the floor, not raising the ceiling. The goal is not an ideal sleep architecture — it is reducing the cumulative sleep debt below the point where cognitive and emotional functioning are significantly impaired. That requires protecting specific blocks more aggressively than trying to optimize every available nap window.',
          'Practically: if you have a protected overnight shift (see previous section), use the daytime to recover from that specific shift\'s deficit — not to try to recover from all of the deficit at once. One decent nap is more restorative than four interrupted attempts to sleep.',
          'Lower your standards for sleep quality during this period. Sleep on the couch if the bedroom is too far. Use a white noise app so you can nap in a room that is not perfectly quiet. The goal is sleep, not optimal sleep conditions.',
        ],
      },
      {
        title: 'The 3 AM emotional cascade',
        imageSrc: '/assets/editorial/notebook-bunny.png',
        imageAlt: 'Postpartum reflection space representing the emotional amplification of overnight care.',
        paragraphs: [
          'At 3 AM, after weeks of fragmented sleep, in a quiet house where no one else is awake, difficult feelings are significantly amplified.',
          'This is predictable and worth naming explicitly, because many of the biggest emotional decisions of the postpartum period get made in the 3 AM window when they should not.',
          'Decisions made at 3 AM that feel urgent and clear often look different at 10 AM. Feelings that feel permanent at 3 AM are frequently better at noon. The 3 AM window is the worst time to evaluate whether feeding is working, whether the relationship is okay, whether you are capable of this, or whether something has gone irreparably wrong.',
          'The practice that helps most: when a thought at 3 AM feels clear and final, write it down. Agree with yourself to look at it again at a defined future time — 10 AM the next morning, or after the next full sleep block. Many 3 AM urgencies do not survive contact with rest.',
          'When 3 AM thoughts involve genuine safety concerns — feeling unable to care for the baby safely, thoughts of harming yourself or the baby, or significant dissociation — these require more than waiting until morning. Call a support person, call your provider, or use a crisis line. Safety concerns at 3 AM are not subject to the "wait until morning" heuristic.',
        ],
      },
    ],
    decisionBullets: [
      'Sleep deprivation impairs cognitive function, emotional regulation, and physical recovery. The effects you are experiencing are physiological, not personal failures.',
      'In a two-adult household: implement the shift handoff model. Define the shifts. Protect the sleeping adult\'s block from interruption. This is the most effective structural response to postpartum sleep debt.',
      '"Sleep when the baby sleeps" is correct but impractical. The more useful version: protect a specific daily block more aggressively than trying to optimize every nap window.',
      'At 3 AM, feelings are amplified and decisions should be deferred. Write down 3 AM thoughts and revisit them after rest.',
      'Exception: safety concerns at 3 AM — inability to care safely, thoughts of harm — are not deferred. Those get addressed immediately.',
    ],
    products: [
      {
        name: 'Hatch Rest Sound Machine',
        description: 'The overnight anchor station sound tool — consistent white noise that masks household sounds during the sleeping adult\'s shift and reduces the likelihood of waking during light sleep phases.',
        pros: ['App-controlled so the sleeping adult does not have to move to adjust it', 'Consistent sound environment supports the "sleep when you can" approach for the sleeping adult'],
      },
      {
        name: 'Owala FreeSip Insulated Bottle',
        description: 'A large-capacity water bottle for the overnight anchor station — breastfeeding and recovery both require consistent hydration, and getting up to refill water at 3 AM is a friction point worth eliminating.',
        pros: ['Large enough to last a full overnight shift', 'Insulated for cold water; one-handed operation for caregiving moments'],
      },
      {
        name: 'Sleep Mask (Manta or equivalent)',
        description: 'A blackout sleep mask for the sleeping adult during daytime shift coverage — especially useful in households where full room darkening is not possible during daytime rest.',
        pros: ['Makes daytime rest more effective when you cannot control room light', 'Signals to the partner that the shift is in effect'],
      },
    ],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'Sleep debt is a logistics problem. Treat it like one.',
    softCtaBody: [
      'Assign the shifts. Protect the blocks. Defer the 3 AM decisions. Lower the floor for what "good enough sleep" means during this window.',
      'The goal is not optimal sleep. It is reducing cumulative sleep debt to a level where you can function without significant impairment.',
    ],
    nextModuleSlug: 'emotional-wellness-and-identity',
    previousModuleSlug: 'feeding-and-lactation',
    markdownContent: `# Rest & Sleep

Sleep debt is a logistics problem, not a personal one.

## Module 4 of 6 · Postpartum

Postpartum sleep is one of the most discussed and least honestly framed topics in early parenthood.

This module takes a different angle: sleep debt in the postpartum period is a logistics problem. It is managed through distributed responsibility and realistic structuring of overnight shifts — not by one person tracking every wake-up until they develop a pattern that solves it.

## Signature Decision Map

### What Sleep Deprivation Actually Does

Sleep deprivation is not just tiredness. It has real cognitive, emotional, and physiological effects worth understanding.

**Cognitively:** sustained sleep deprivation impairs working memory, decision-making, and emotional regulation in ways that closely resemble mild intoxication. Simple decisions feel hard. Minor frustrations feel disproportionately large. These are not personality changes — they are sleep deficit effects.

**Emotionally:** the threshold for emotional response drops significantly. Grief, anger, anxiety, and overwhelm all feel amplified — especially at 3 AM when the night is long and there is no social context to buffer how difficult things feel.

**Physiologically:** recovery from birth is impaired by sustained sleep deprivation. The immune system is suppressed. Wound healing is slower. Sleep is not a comfort need during postpartum recovery — it is a physiological requirement for healing.

Knowing this does not fix the problem. But it reframes it. What you are experiencing is sleep deprivation, not incapacity.

![Calm bedside setup for postpartum rest reflecting the need for genuine recovery.](${POSTPARTUM_IMAGES.restIntro})

### The Shift Handoff Model

The most effective structural response to postpartum sleep deprivation in a two-adult household is dividing overnight responsibility into defined shifts with clear start and end times — so each adult gets a protected block of uninterrupted sleep.

A basic structure: one adult takes the first half of the night (roughly 9 PM to 2 AM) while the other sleeps. At 2 AM, they exchange. Neither adult has a full night, but both have an uninterrupted block.

The key discipline: the sleeping adult is not partially awakened for consultation during their off-shift. The sleeping block is protected. When the block is interrupted, the model does not work.

For single-adult households: postpartum doulas who provide overnight coverage exist specifically for this need. One night per week of overnight coverage can meaningfully change the cumulative sleep debt picture.

![Overnight care setup that supports distributed rest responsibility between caregivers.](${POSTPARTUM_IMAGES.restReality})

### Why "Sleep When the Baby Sleeps" Fails — and What Actually Works

"Sleep when the baby sleeps" is physiologically correct and practically broken.

When the baby finally sleeps, there are also dishes, laundry, meals, and a need for twenty minutes of being a person without a baby attached to you. The advice does not account for that choice.

What actually helps: lowering the floor, not raising the ceiling. The goal is not an ideal sleep architecture — it is reducing cumulative sleep debt below the point where functioning is significantly impaired. That requires protecting specific blocks more aggressively than trying to optimize every nap window.

If you have a protected overnight shift, use the daytime to recover from that specific shift's deficit. One decent nap is more restorative than four interrupted attempts to sleep.

Lower your standards for sleep quality during this period. Sleep on the couch if it is closer. Use a white noise app in a room that is not perfectly quiet. The goal is sleep, not optimal sleep conditions.

![Postpartum home setup reflecting the real conditions of daytime rest attempts.](${POSTPARTUM_IMAGES.restSupport})

### The 3 AM Emotional Cascade

At 3 AM, after weeks of fragmented sleep, difficult feelings are significantly amplified.

Many of the biggest emotional decisions of the postpartum period get made in the 3 AM window when they should not.

Decisions made at 3 AM that feel urgent and clear often look different at 10 AM. Feelings that feel permanent at 3 AM are frequently better at noon. The 3 AM window is the worst time to evaluate whether feeding is working, whether the relationship is okay, whether you are capable of this, or whether something has gone irreparably wrong.

The practice: when a thought at 3 AM feels clear and final, write it down. Agree to look at it again at a defined future time — 10 AM the next morning, or after the next full sleep block. Many 3 AM urgencies do not survive contact with rest.

When 3 AM thoughts involve genuine safety concerns — feeling unable to care for the baby safely, thoughts of harming yourself or the baby, or significant dissociation — those require more than waiting until morning.

![Postpartum reflection space representing the emotional amplification of overnight care.](/assets/editorial/notebook-bunny.png)

## What This Means For You

- Sleep deprivation impairs cognitive function, emotional regulation, and physical recovery. What you are experiencing is physiological, not personal.
- In a two-adult household: implement the shift handoff model. Define the shifts. Protect the sleeping adult's block from interruption.
- Protect a specific daily block more aggressively than trying to optimize every nap window.
- At 3 AM, feelings are amplified and decisions should be deferred. Write down 3 AM thoughts and revisit them after rest.
- Safety concerns at 3 AM are not deferred. Those get addressed immediately.

## Before You Move Forward

Sleep debt is a logistics problem. Treat it like one.

Assign the shifts. Protect the blocks. Defer the 3 AM decisions. The goal is not optimal sleep — it is reducing cumulative debt to a level where you can function.

## Next Steps

- Continue to Emotional Wellness & Identity
- Back to Feeding & Lactation`,
  }),
  createPostpartumModule({
    title: 'Emotional Wellness & Identity',
    slug: 'emotional-wellness-and-identity',
    moduleOrder: 5,
    description:
      'There is a spectrum from normal postpartum adjustment to postpartum mood disorders. Knowing where you are on that spectrum changes what kind of support you need and when to seek it.',
    subhead: 'Baby blues, PPD, and the identity shift that does not have a name.',
    imagePath: '/assets/editorial/notebook-bunny.png',
    imageAlt: 'Emotional wellness editorial image for the Emotional Wellness & Identity module.',
    intro: [
      'Postpartum is not only physical. The emotional landscape of early parenthood is as variable as the physical one, and significantly less discussed.',
      'Part of why it is less discussed is that emotional difficulty in postpartum often carries shame — the feeling that difficulty is evidence of inadequacy rather than a normal feature of a major life transition.',
      'This module covers the clinical distinction between normal adjustment, postpartum blues, and postpartum mood disorders; the identity shift that accompanies new parenthood; the specific cultural pressures that make the emotional experience harder; and when and how to seek clinical support.',
      'The goal is to give the emotional experience of postpartum more language, more context, and clearer thresholds for action.',
    ],
    coreSections: [
      {
        title: 'Baby blues vs. postpartum depression vs. postpartum anxiety — the clinical distinction',
        imageSrc: POSTPARTUM_IMAGES.emotionalIntro,
        imageAlt: 'Notebook and calm space for postpartum emotional reflection and awareness.',
        paragraphs: [
          'Understanding the difference between baby blues, postpartum depression, and postpartum anxiety matters because they have different timelines and different treatment implications.',
          'Baby blues: a common emotional response to the hormonal drop that occurs after delivery. Estrogen and progesterone fall sharply in the first days after birth, and many people experience mood swings, tearfulness, irritability, and emotional lability that feel intense and somewhat random. Baby blues typically begin within the first few days after delivery and resolve within two weeks. They do not require treatment beyond rest, support, and awareness that they are normal and time-limited.',
          'Postpartum depression (PPD): a clinical mood disorder that can begin during pregnancy or within the first year after birth. PPD is not an intensified version of baby blues — it is a distinct condition. Symptoms include persistent sadness or emptiness, loss of interest in activities you normally enjoy, difficulty bonding with the baby, significant changes in appetite or sleep, difficulty concentrating, feelings of worthlessness or excessive guilt, and in severe cases, thoughts of harm. PPD affects approximately one in seven new mothers. It is not caused by personal weakness or a failure to love the baby. It is a treatable medical condition.',
          'Postpartum anxiety: equally common as PPD and less frequently discussed. Postpartum anxiety presents as persistent excessive worry, racing thoughts, difficulty sleeping even when the baby is asleep, physical symptoms (racing heart, difficulty breathing), a constant sense that something is about to go wrong, and in some cases, intrusive thoughts about harm coming to the baby. Intrusive thoughts — unwanted, upsetting thoughts about something bad happening to the baby — are a symptom of anxiety, not a sign of danger. They are distressing precisely because they are ego-dystonic (the thoughts feel wrong and unwanted). Parents who have intrusive thoughts are not at risk of acting on them; those who feel a desire to act on harmful thoughts toward the baby are experiencing something different that requires immediate support.',
          'The practical threshold: if emotional symptoms are significant enough to interfere with daily functioning, persist for more than two weeks, or involve thoughts of harm to yourself or the baby, contact your provider. This is a medical situation, not a personal failure.',
        ],
      },
      {
        title: 'Matrescence — the identity shift that does not have a name',
        imageSrc: POSTPARTUM_IMAGES.emotionalReality,
        imageAlt: 'Quiet postpartum reflection space representing the identity transition of new parenthood.',
        paragraphs: [
          'Matrescence is a term coined by anthropologist Dana Raphael in 1973 to describe the psychological, social, and physical transition of becoming a mother.',
          'Like adolescence, matrescence involves a fundamental reorganization of identity. The person you were before the birth does not disappear — but the relationship between who you were and who you are becoming is in flux. This transition is normal, expected, and genuinely disorienting.',
          'What makes matrescence difficult is that it happens at the same time as every other postpartum demand: recovery, feeding, sleep deprivation, and relationship reorganization. There is rarely space to process the identity shift because the functional demands do not stop to make room for it.',
          'Some specific manifestations worth naming: feeling like you have lost yourself or your pre-baby identity is a common matrescence experience, not a sign that motherhood is wrong for you. Grief for your pre-baby life — even if you wanted the baby — is normal and does not mean you do not love the baby. Ambivalence about the new identity is common. Most parents feel some mixture of profound love and genuine loss at the same time.',
          'Matrescence applies to all new parents regardless of gender, though it was originally described in the context of mothers. The identity reorganization that accompanies becoming a primary caregiver is not gender-specific.',
        ],
      },
      {
        title: 'The good-enough parent — where the performance pressure causes harm',
        imageSrc: POSTPARTUM_IMAGES.emotionalSupport,
        imageAlt: 'Supportive postpartum atmosphere free from the pressure to perform perfection.',
        paragraphs: [
          'The postpartum period arrives with a specific cultural pressure: the expectation that you will be doing this not just adequately but visibly well, and that you will feel lucky and grateful in proportion to how hard it was to become a parent.',
          'This pressure is particularly pronounced in the age of social media, where the postpartum experience is often filtered through images of organized nurseries, recovered bodies, and parents who appear to be experiencing transcendent joy without also experiencing confusion or depletion.',
          'The pediatrician and psychoanalyst Donald Winnicott introduced the concept of the "good-enough mother" in the 1950s as a counterargument to perfectionism in parenting: children do not need perfect parents. They need parents who are responsive enough, most of the time. The occasional mistake, the day you did not have enough, the moment you lost patience — these do not harm a baby\'s development when the baseline of the relationship is warm and consistent.',
          'The performance pressure harms adults by making normal experiences feel like failures. Feeling depleted is not evidence that you are doing this wrong. Needing help is not evidence that you are inadequate. A difficult day does not define the relationship.',
          'Lower the standard from "perfect" to "good enough." Good enough is both achievable and sufficient.',
        ],
      },
      {
        title: 'When to seek clinical support — not "when things get bad"',
        imageSrc: '/assets/editorial/teddy-glow.png',
        imageAlt: 'Calm postpartum environment reflecting the importance of early support-seeking.',
        paragraphs: [
          'The most common advice about seeking mental health support in postpartum is to seek it "when things get bad." This is the wrong threshold.',
          'Waiting until things get bad means waiting until functioning is significantly impaired, which usually means waiting longer than necessary and experiencing more unnecessary suffering than necessary.',
          'The more useful threshold: seek support when you are struggling consistently for more than a week. Not when you cannot get out of bed. Not when you have a crisis. When you are consistently struggling.',
          'How to access support: your OB or midwife can screen for postpartum depression and anxiety at your postpartum appointments — ask specifically if they do not bring it up. Your primary care provider can do the same. A therapist who specializes in perinatal mental health (pregnancy and postpartum) is the most targeted resource for postpartum mood and adjustment issues.',
          'Medication for postpartum depression and anxiety is safe, including during breastfeeding. Several antidepressants have established safety records for breastfeeding parents. If medication is indicated, the concern that it will require stopping breastfeeding is frequently not accurate — discuss it with your provider.',
          'Postpartum Support International (PSI) maintains a helpline (1-800-944-4773) and a provider directory for postpartum-specialized support. The PSI helpline is staffed by trained volunteers and can help locate local resources.',
        ],
      },
    ],
    decisionBullets: [
      'Baby blues: normal, begins in the first days, resolves within two weeks. No treatment required — rest, support, and awareness.',
      'Postpartum depression and postpartum anxiety: clinical conditions affecting approximately one in seven new parents. Treatable. Not a personal failure.',
      'Matrescence — the identity shift of new parenthood — is normal, disorienting, and expected. Grief for your pre-baby self and ambivalence are common features.',
      'Lower the standard from "perfect parent" to "good-enough parent." Good enough is what children need and what is achievable.',
      'Seek clinical support when you are consistently struggling for more than a week — not when things get bad. Postpartum Support International helpline: 1-800-944-4773.',
    ],
    products: [
      {
        name: 'Postpartum Support International (PSI) Helpline',
        description: 'Not a product — a resource. The PSI helpline (1-800-944-4773) provides support and provider referrals for postpartum mood and anxiety disorders.',
        pros: ['Staffed by trained volunteers who specialize in postpartum mental health', 'Provider directory available at postpartum.net'],
      },
      {
        name: 'The Motherly Podcast and App',
        description: 'A community and content resource for postpartum identity, wellness, and the practical dimensions of new parenthood — useful as a steady source of non-judgmental information.',
        pros: ['Postpartum-specific content', 'Normalizes the range of postpartum experiences without toxic positivity'],
      },
      {
        name: 'Perinatal Therapist (Psychology Today Directory)',
        description: 'A licensed therapist specializing in pregnancy and postpartum mental health — the most targeted clinical resource for postpartum mood and identity adjustment.',
        pros: ['Specialized training in perinatal mental health', 'Often covered by insurance; Psychology Today directory filters by specialty and insurance'],
      },
    ],
    softCtaLabel: 'Before You Move Forward',
    softCtaTitle: 'Name what you are experiencing. Then get the right support for it.',
    softCtaBody: [
      'Baby blues, postpartum depression, postpartum anxiety, matrescence, and the pressure to perform adequacy are all real and distinct. Knowing which one you are dealing with changes what helps.',
      'If you are consistently struggling, that is the threshold for seeking support. Not when things get bad — when you are consistently struggling.',
    ],
    nextModuleSlug: 'support-systems',
    previousModuleSlug: 'rest-and-sleep',
    markdownContent: `# Emotional Wellness & Identity

Baby blues, PPD, and the identity shift that does not have a name.

## Module 5 of 6 · Postpartum

Postpartum is not only physical. The emotional landscape of early parenthood is as variable as the physical one, and significantly less discussed.

This module covers the clinical distinction between normal adjustment and postpartum mood disorders; the identity shift that accompanies new parenthood; the cultural pressures that make the emotional experience harder; and when and how to seek clinical support.

## Signature Decision Map

### Baby Blues vs. Postpartum Depression vs. Postpartum Anxiety

Understanding the difference matters because they have different timelines and different treatment implications.

**Baby blues:** a common emotional response to the hormonal drop after delivery. Mood swings, tearfulness, irritability — typically beginning within the first days and resolving within two weeks. Normal and time-limited.

**Postpartum depression (PPD):** a clinical mood disorder, not an intensified version of baby blues. Symptoms include persistent sadness, loss of interest in activities, difficulty bonding, appetite and sleep changes, feelings of worthlessness, and in severe cases, thoughts of harm. Affects approximately one in seven new mothers. Treatable. Not a personal failure.

**Postpartum anxiety:** equally common as PPD and less frequently discussed. Persistent excessive worry, racing thoughts, physical symptoms (racing heart, difficulty breathing), intrusive thoughts. Intrusive thoughts — unwanted upsetting images of harm — are a symptom of anxiety, not a sign of danger. They are distressing because they feel wrong and unwanted.

The practical threshold: if emotional symptoms persist for more than two weeks, significantly interfere with daily functioning, or involve thoughts of harm, contact your provider.

![Notebook and calm space for postpartum emotional reflection and awareness.](${POSTPARTUM_IMAGES.emotionalIntro})

### Matrescence — the Identity Shift That Does Not Have a Name

Matrescence describes the psychological, social, and physical transition of becoming a parent — a term coined by anthropologist Dana Raphael.

Like adolescence, matrescence involves a fundamental reorganization of identity. The person you were before the birth does not disappear — but who you were and who you are becoming is in flux. This is normal, expected, and genuinely disorienting.

Common manifestations: feeling like you have lost your pre-baby identity; grief for your pre-baby life even if you wanted the baby; ambivalence about the new identity. These experiences are features of the transition, not signs that something has gone wrong.

Matrescence happens simultaneously with every other postpartum demand: recovery, feeding, sleep deprivation, relationship reorganization. There is rarely space to process the identity shift because the functional demands do not stop to make room for it.

![Quiet postpartum reflection space representing the identity transition of new parenthood.](${POSTPARTUM_IMAGES.emotionalReality})

### The Good-Enough Parent — Where the Performance Pressure Causes Harm

The postpartum period arrives with a specific cultural pressure: the expectation that you will be doing this visibly well, and that you will feel lucky and grateful in proportion to how hard it was to become a parent.

Pediatrician Donald Winnicott introduced the "good-enough mother" as a counterargument to perfectionism in parenting: children do not need perfect parents. They need parents who are responsive enough, most of the time. The occasional mistake, the day you did not have enough — these do not harm a baby when the baseline of the relationship is warm and consistent.

The performance pressure harms adults by making normal experiences feel like failures. Feeling depleted is not evidence that you are doing this wrong. A difficult day does not define the relationship.

Lower the standard from "perfect" to "good enough." Good enough is both achievable and sufficient.

![Supportive postpartum atmosphere free from the pressure to perform perfection.](${POSTPARTUM_IMAGES.emotionalSupport})

### When to Seek Clinical Support — Not "When Things Get Bad"

Waiting until things get bad means waiting longer than necessary and experiencing more unnecessary suffering than necessary.

The more useful threshold: seek support when you are consistently struggling for more than a week.

How to access support: your OB or midwife can screen for postpartum depression and anxiety — ask if they do not bring it up. A therapist who specializes in perinatal mental health is the most targeted resource. Postpartum Support International maintains a helpline (1-800-944-4773) and a provider directory.

Medication for postpartum depression and anxiety is safe, including during breastfeeding. Several antidepressants have established safety records for breastfeeding parents. The concern that medication requires stopping breastfeeding is frequently not accurate — discuss it with your provider.

![Calm postpartum environment reflecting the importance of early support-seeking.](/assets/editorial/teddy-glow.png)

## What This Means For You

- Baby blues: normal, begins in the first days, resolves within two weeks.
- PPD and postpartum anxiety: clinical conditions affecting approximately one in seven new parents. Treatable. Not a personal failure.
- Matrescence — grief for your pre-baby self and ambivalence — are normal features of the identity transition.
- Lower the standard from "perfect parent" to "good-enough parent."
- Seek clinical support when consistently struggling for more than a week. PSI helpline: 1-800-944-4773.

## Before You Move Forward

Name what you are experiencing. Then get the right support for it.

Baby blues, PPD, postpartum anxiety, and matrescence are real and distinct. Knowing which one you are dealing with changes what helps.

## Next Steps

- Continue to Support Systems
- Back to Rest & Sleep`,
  }),
  createPostpartumModule({
    title: 'Support Systems',
    slug: 'support-systems',
    moduleOrder: 6,
    description:
      'Vague offers of help are functionally useless. The support system that works has specific asks assigned to specific people before you need them — built before the birth, not improvised after.',
    subhead: 'Specific asks, built before you need them.',
    imagePath: '/assets/editorial/bear-blocks.png',
    imageAlt: 'Support systems editorial image for the Support Systems module.',
    intro: [
      '"Let me know if you need anything." This is the most commonly offered form of postpartum help and the least useful one.',
      'It puts the burden of specificity on the person who is most depleted, least able to think clearly, and most likely to respond "we are fine, thank you."',
      'The support system that actually functions in the postpartum period is built before the birth, assigned to specific people with specific jobs, and designed to reduce the amount of coordination required when you are already tired.',
      'This module covers why vague offers fail, the four types of support and how to inventory them, how to make asks specific enough to be actionable, and when professional postpartum support is worth the cost.',
    ],
    coreSections: [
      {
        title: 'Why "let me know if you need anything" fails',
        imageSrc: POSTPARTUM_IMAGES.supportIntro,
        imageAlt: 'Postpartum planning notes reflecting the need for specific, pre-built support.',
        paragraphs: [
          'Vague offers of help fail because they require the person receiving the offer to do the cognitive work of converting a general willingness into a specific actionable request, and then asking for it.',
          'In the postpartum window — when you are sleep deprived, recovering physically, managing feeding, and navigating a new household reality — that cognitive work is genuinely hard. Many people cannot name what they need in the moment. Many others can name it but do not want to ask.',
          'The result is that most vague offers go uncashed. The people who offered feel like they tried. The new parents carry on without help. The support gap widens.',
          'The fix is not waiting for better offers — it is converting general willingness into specific assignments before the birth, so that the coordination is done in advance rather than real-time.',
          'The conversation to have in the third trimester: "We are going to need some specific help in the first few weeks. Would you be willing to take on [specific job] on [specific days]?" People who genuinely want to help almost always say yes to a specific ask. The specificity is not imposing — it is giving the person a clear way to be useful.',
        ],
      },
      {
        title: 'The support inventory — four types of help',
        imageSrc: POSTPARTUM_IMAGES.supportLooksLike,
        imageAlt: 'Support network concept with practical and emotional help layered around a new family.',
        paragraphs: [
          'Support in the postpartum period falls into four categories. Most families need at least a little of each; the balance depends on what the household can cover independently.',
          'Physical support: direct caregiving labor — holding the baby, helping with feeding, handling nighttime shifts, performing household tasks (cooking, cleaning, laundry, errands). This is the category most people think of when they think of postpartum help.',
          'Logistical support: coordination and planning help — managing the meal train schedule, organizing the visitor calendar, handling communication with extended family so the new parents do not have to, managing household procurement (diapers, formula, medications that need to be picked up).',
          'Emotional support: the regular presence of someone who asks how you are actually doing and can sit with an honest answer without trying to fix it. This is a distinct need from physical and logistical help and is often undervalued in the planning conversation.',
          'Professional support: paid support from people whose job is postpartum care — postpartum doulas, lactation consultants, pelvic floor physical therapists, postpartum therapists. Professional support is not a luxury for the people who have resources; it is a category of help that covers things that informal support cannot provide.',
          'Map your inventory against each category before the birth. Where are the gaps? The gaps are where you focus the specific asks.',
        ],
      },
      {
        title: 'Making the ask specific enough to be actionable',
        imageSrc: POSTPARTUM_IMAGES.supportTruth,
        imageAlt: 'Clear postpartum support planning reflecting the value of specific, actionable requests.',
        paragraphs: [
          'A specific, actionable ask has four components: who, what, when, and how long.',
          '"Would you be willing to bring dinner on Tuesday at 6 PM and leave it at the door?" That is actionable. The person knows exactly what is needed and can say yes or no.',
          '"Would you be willing to come on Wednesday mornings for the first month and hold the baby for two hours while I sleep?" That is actionable. It gives the person a concrete commitment to evaluate and the new parent a defined rest block.',
          '"Would you be willing to handle all the communication with [family member] for the first three weeks so we do not have to respond to every check-in individually?" That is actionable. It delegates a specific cognitive task to a specific person.',
          'The ask does not need to feel comfortable to be worth making. Most people who genuinely want to help are relieved to be given a specific job. The ambiguity of a vague offer is often its own frustration — they did not know what to do, and now they do.',
          'Accept help without guilt. Help that is offered and accepted is not a debt. It is how communities support new families. Most people who help in the postpartum period will someday be in a similar situation and will benefit from the same kind of support.',
        ],
      },
      {
        title: 'Professional postpartum support — when it is worth the cost',
        imageSrc: '/assets/editorial/organize.png',
        imageAlt: 'Organized postpartum support planning reflecting the value of professional postpartum resources.',
        paragraphs: [
          'Professional postpartum support covers the gaps that informal support cannot fill — specialized expertise, availability on demand, and emotional neutrality.',
          'Postpartum doulas provide in-home postpartum support: newborn care, feeding support, household help, and educational guidance on infant care. Unlike birth doulas, postpartum doulas work after the birth — often during daytime hours, overnight shifts, or both. For families without strong informal support networks, a postpartum doula is one of the highest-value investments in the postpartum period.',
          'IBCLCs (International Board Certified Lactation Consultants) are the clinical experts for breastfeeding support. Insurance often covers IBCLC visits — it is worth verifying before the birth. A private IBCLC who makes home visits is especially useful in the first weeks when leaving the house is a significant undertaking.',
          'Pelvic floor physical therapists provide rehabilitation after birth for both vaginal and C-section recovery. Most postpartum parents would benefit from at least an initial assessment. In many countries, pelvic floor PT after birth is standard; in the US, it is self-referred but increasingly covered by insurance.',
          'Postpartum therapists or perinatal mental health counselors provide targeted mental health support for the emotional landscape of new parenthood. Postpartum Support International (postpartum.net) maintains a directory of perinatal mental health providers.',
          'The cost calculation: professional postpartum support is less expensive than the outcomes it prevents — prolonged physical recovery, untreated postpartum depression, breastfeeding challenges that lead to early cessation when the parent wanted to continue. When budget is a consideration, prioritize the professional support that covers the most significant gap in your informal support network.',
        ],
      },
    ],
    decisionBullets: [
      'Convert vague offers to specific asks before the birth: who, what, when, and how long. People who want to help say yes to specific asks.',
      'Map your support inventory across the four categories: physical, logistical, emotional, professional. The gaps are where to focus the specific asks.',
      'Accept help without treating it as a debt. It is how communities support new families.',
      'Postpartum doulas, IBCLCs, pelvic floor PTs, and perinatal therapists cover specialized needs that informal support cannot. Insurance covers many of these more than parents expect.',
      'Postpartum Support International helpline: 1-800-944-4773. Provider directory: postpartum.net.',
    ],
    products: [
      {
        name: 'DONA International Postpartum Doula Directory',
        description: 'A directory for finding a certified postpartum doula in your area — the professional resource for in-home newborn and postpartum support.',
        pros: ['Postpartum doulas cover the newborn care, feeding support, and household help gap', 'DONA certification provides a baseline training standard'],
      },
      {
        name: 'Postpartum Support International (PSI)',
        description: 'A nonprofit organization providing postpartum mental health support, a provider directory, and a helpline (1-800-944-4773) for postpartum mood and anxiety disorders.',
        pros: ['Helpline staffed by trained volunteers who specialize in postpartum', 'Provider directory connects to perinatal mental health specialists nationwide'],
      },
      {
        name: 'Meal Train App',
        description: 'A free coordination tool for organizing a meal train — allows a family member or friend to manage the schedule without ongoing coordination from the new parents.',
        pros: ['Removes coordination burden from the new parents', 'Spreads meal support across several weeks rather than concentrated in the first days'],
      },
    ],
    softCtaLabel: 'You Have Completed the Postpartum Path',
    softCtaTitle: 'The support system that works is built before you need it.',
    softCtaBody: [
      'Specific asks, assigned before the birth. Four categories of support mapped against who can cover each. Professional support where informal support has gaps.',
      'Support is not optional in the postpartum period. Build the system. Accept the help. Use it without guilt.',
    ],
    nextModuleSlug: null,
    previousModuleSlug: 'emotional-wellness-and-identity',
    markdownContent: `# Support Systems

Specific asks, built before you need them.

## Module 6 of 6 · Postpartum

"Let me know if you need anything." This is the most commonly offered form of postpartum help and the least useful one.

It puts the burden of specificity on the person who is most depleted, least able to think clearly, and most likely to respond "we are fine, thank you."

The support system that actually functions is built before the birth, assigned to specific people with specific jobs, and designed to reduce the coordination required when you are already tired.

## Signature Decision Map

### Why "Let Me Know If You Need Anything" Fails

Vague offers fail because they require the depleted person to do the cognitive work of converting general willingness into a specific actionable request — and then asking for it.

Most vague offers go uncashed. The people who offered feel like they tried. The new parents carry on without help.

The fix: convert general willingness into specific assignments before the birth.

The conversation to have in the third trimester: "We are going to need specific help in the first few weeks. Would you be willing to take on [specific job] on [specific days]?" People who genuinely want to help almost always say yes to a specific ask. Specificity is not imposing — it is giving someone a clear way to be useful.

![Postpartum planning notes reflecting the need for specific, pre-built support.](${POSTPARTUM_IMAGES.supportIntro})

### The Support Inventory — Four Types of Help

Support in the postpartum period falls into four categories. Most families need at least a little of each.

**Physical support:** direct caregiving labor — holding the baby, helping with feeding, handling nighttime shifts, cooking, cleaning, laundry, errands.

**Logistical support:** coordination and planning — managing the meal train, organizing the visitor calendar, handling communication with extended family so the new parents do not have to.

**Emotional support:** the regular presence of someone who asks how you are actually doing and can sit with an honest answer without trying to fix it.

**Professional support:** paid support from people whose job is postpartum care — postpartum doulas, lactation consultants, pelvic floor PTs, postpartum therapists.

Map your inventory against each category before the birth. Where are the gaps? The gaps are where you focus the specific asks.

![Support network concept with practical and emotional help layered around a new family.](${POSTPARTUM_IMAGES.supportLooksLike})

### Making the Ask Specific Enough to Be Actionable

A specific, actionable ask has four components: who, what, when, and how long.

"Would you be willing to bring dinner on Tuesday at 6 PM and leave it at the door?" That is actionable.

"Would you be willing to come on Wednesday mornings for the first month and hold the baby for two hours while I sleep?" That is actionable.

"Would you be willing to handle all communication with [family member] for the first three weeks so we do not have to respond to every check-in?" That is actionable.

The ask does not need to feel comfortable to be worth making. Most people who genuinely want to help are relieved to be given a specific job. The ambiguity of a vague offer is often its own frustration.

Accept help without guilt. Help that is offered and accepted is not a debt. It is how communities support new families.

![Clear postpartum support planning reflecting the value of specific, actionable requests.](${POSTPARTUM_IMAGES.supportTruth})

### Professional Postpartum Support — When It Is Worth the Cost

Professional support covers the gaps that informal support cannot fill: specialized expertise, availability on demand, and emotional neutrality.

**Postpartum doulas** provide in-home postpartum support: newborn care, feeding support, household help, and infant care guidance. For families without strong informal support networks, a postpartum doula is one of the highest-value investments in the postpartum period.

**IBCLCs** are the clinical experts for breastfeeding support. Insurance often covers IBCLC visits — verify before the birth. A private IBCLC who makes home visits is especially useful in the first weeks.

**Pelvic floor physical therapists** provide rehabilitation after both vaginal and C-section birth. Most postpartum parents would benefit from at least an initial assessment.

**Postpartum therapists** provide targeted mental health support for the emotional landscape of new parenthood. Postpartum Support International (postpartum.net) maintains a directory of perinatal mental health providers.

The cost calculation: professional postpartum support is less expensive than the outcomes it prevents. When budget is a consideration, prioritize the professional support that covers the most significant gap in your informal network.

![Organized postpartum support planning reflecting the value of professional postpartum resources.](/assets/editorial/organize.png)

## What This Means For You

- Convert vague offers to specific asks before the birth: who, what, when, and how long.
- Map support across four categories: physical, logistical, emotional, professional. The gaps are where to focus.
- Accept help without treating it as a debt.
- Postpartum doulas, IBCLCs, pelvic floor PTs, and perinatal therapists cover specialized needs that informal support cannot. Insurance covers more than parents expect.
- PSI helpline: 1-800-944-4773. Provider directory: postpartum.net.

## You Have Completed the Postpartum Path

The support system that works is built before you need it.

Specific asks, assigned before the birth. Four categories of support mapped against who can cover each. Professional support where informal support has gaps.

Support is not optional in the postpartum period. Build the system. Accept the help. Use it without guilt.

## Next Steps

- Back to Emotional Wellness & Identity`,
  }),
];

export const POSTPARTUM_ACADEMY_MODULES_BY_SLUG = Object.fromEntries(
  POSTPARTUM_ACADEMY_MODULES.map((module) => [module.slug, module]),
) as Record<PostpartumAcademyModuleSlug, PostpartumAcademyModuleRecord>;

export function isPostpartumAcademyModuleSlug(value: string): value is PostpartumAcademyModuleSlug {
  return value in POSTPARTUM_ACADEMY_MODULES_BY_SLUG;
}

export function getPostpartumAcademyModule(slug: PostpartumAcademyModuleSlug) {
  return POSTPARTUM_ACADEMY_MODULES_BY_SLUG[slug];
}
