import type { DecisionBlockItem } from '@/components/guides/DecisionBlock';
import type { GuideStageLabel } from '@/lib/guides/guideFlow';
import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

export const NURSERY_FURNITURE_HUB_PATH = '/academy/nursery/furniture-that-actually-works' as const;

export const NURSERY_FURNITURE_HUB_SLIDES = [
  { id: 'nursery-furniture-orientation', label: 'Orientation', shortLabel: 'Start' },
  { id: 'nursery-furniture-what-this-is', label: 'What This Module Is', shortLabel: 'Why' },
  { id: 'nursery-furniture-why-this-matters', label: 'Why This Matters', shortLabel: 'Matters' },
  { id: 'nursery-furniture-category-cards', label: 'Category Cards', shortLabel: 'Cards' },
  { id: 'nursery-furniture-how-to-approach', label: 'How To Approach This', shortLabel: 'Approach' },
  { id: 'nursery-furniture-next-step', label: 'Next Step', shortLabel: 'Next' },
] as const;

export const NURSERY_FURNITURE_JOURNEY_PATH = ['Academy', 'Nursery', 'Furniture That Actually Works'] as const;

export const NURSERY_FURNITURE_HUB_ORIENTATION_BODY = [
  'This is the part of the nursery that supports your real life.',
  'Not the aesthetic.',
  'Not the Pinterest version.',
  "The version where you're:",
  'changing diapers at 2am',
  'feeding half asleep',
  'looking for wipes with one hand',
  'These are the pieces that make that easier—or harder.',
] as const;

export const NURSERY_FURNITURE_HUB_PULLQUOTE =
  'Good nursery furniture doesn’t just look good.\n\nIt works without you thinking about it.';

export type NurseryFurnitureCategorySlug =
  | 'cribs'
  | 'gliders'
  | 'dressers-changing'
  | 'diaper-pails'
  | 'baby-monitors'
  | 'baby-proofing';

type NurseryFurnitureCategoryDefinition = {
  slug: NurseryFurnitureCategorySlug;
  title: string;
  description: string;
  metadataDescription: string;
  icon: GuideHubIconKey;
  heroEyebrow: string;
  heroImageSrc: string;
  heroImageAlt: string;
  orientation: string[];
  whatItDoes: {
    description: string;
    intro: string[];
    supportPoints: string[];
    calloutBody: string;
    whatThisIs: string;
    whyItExists: string;
  };
  typesDescription: string;
  types: string[];
  whatActuallyMattersDescription: string;
  whatActuallyMatters: string[];
  commonMistakesDescription: string;
  commonMistakes: string[];
  howToChooseDescription: string;
  howToChoose: DecisionBlockItem[];
};

type NurseryFurnitureNextStep = {
  label: string;
  href: string;
  description: string;
  stage: GuideStageLabel;
};

const CATEGORY_ORDER: NurseryFurnitureCategorySlug[] = [
  'cribs',
  'gliders',
  'dressers-changing',
  'diaper-pails',
  'baby-monitors',
  'baby-proofing',
];

function createNextStep(
  label: string,
  href: string,
  description: string,
  stage: GuideStageLabel,
): NurseryFurnitureNextStep {
  return { label, href, description, stage };
}

export function getNurseryFurnitureCategoryPath(slug: NurseryFurnitureCategorySlug) {
  return `${NURSERY_FURNITURE_HUB_PATH}/${slug}` as const;
}

export const NURSERY_FURNITURE_CATEGORIES: Record<
  NurseryFurnitureCategorySlug,
  NurseryFurnitureCategoryDefinition
> = {
  cribs: {
    slug: 'cribs',
    title: 'Cribs',
    description: 'safe sleep foundation',
    metadataDescription:
      'Learn how to choose a crib based on safe sleep, mattress fit, nightly ease of use, and real room fit instead of convertibility hype.',
    icon: 'sleep',
    heroEyebrow: 'Nursery Furniture',
    heroImageSrc: '/assets/editorial/babyincrib.png',
    heroImageAlt: 'Baby in a calm crib setup with soft nursery light.',
    orientation: [
      'A crib is the quiet center of the nursery.',
      'It does not need to impress anyone. It needs to make safe sleep feel straightforward at midnight.',
      'This category gets louder than it deserves because marketing loves the word convertible.',
      'Your baby mostly cares that the mattress fits and the sleep setup works.',
    ],
    whatItDoes: {
      description: 'A crib creates the primary sleep space, which means it should reduce mental load instead of adding another layer of nursery theater.',
      intro: [
        'This is where sleep safety, room fit, and nightly ease all meet in one place.',
        'A crib should feel stable, simple to use, and boring in the best possible way. Sleep furniture earns trust by disappearing into the routine.',
      ],
      supportPoints: [
        'Families setting up a primary nursery sleep space.',
        'Parents who want nighttime transfers to feel simpler, not more delicate.',
        'Anyone trying to sort real sleep needs from convertible-crib marketing energy.',
        'People who want the room footprint and the sleep setup to make sense together.',
      ],
      calloutBody:
        'Start with safe sleep and mattress fit. The rest only matters if those two pieces are already solid.',
      whatThisIs: 'A safe sleep foundation, not a design statement with bars.',
      whyItExists:
        'Because a good crib should support sleep with as little drama as possible, and a bad fit gets very obvious once nights become repetitive.',
    },
    typesDescription:
      'Most crib decisions get easier once you stop comparing every style and start comparing the stage, footprint, and long-term expectations.',
    types: [
      'Standard cribs: The straightforward full-size option for families who want simplicity and a familiar sleep setup.',
      'Mini cribs: Smaller-footprint cribs that work well in tighter rooms, shared spaces, or homes where every inch keeps receipts.',
      'Convertible cribs: Cribs designed to transition later, which can be useful, but are not automatically the smarter choice for every family.',
      'Pack-and-play sleep setups: A flexible option for earlier months or room-sharing situations, but not a one-to-one crib replacement in every nursery.',
    ],
    whatActuallyMattersDescription:
      'This category should be judged by safety, fit, and how it behaves at night, not by whether it sounds like a future heirloom.',
    whatActuallyMatters: [
      'Current safety standards and a correctly fitting mattress with no guesswork around gaps.',
      'How easy it is to reach baby in and out without turning your lower back into the volunteer.',
      'Whether the crib footprint genuinely fits the room and still leaves space to move.',
      'Mattress height adjustability for the early months and the next stage after that.',
      'Whether convertibility is something you will realistically use, not just admire in theory.',
    ],
    commonMistakesDescription:
      'Crib regret usually starts when families shop for the toddler room before they have even survived the newborn nights.',
    commonMistakes: [
      'Choosing based on future convertibility without checking whether the crib works beautifully right now.',
      'Assuming every standard-size mattress and crib combination will fit equally well.',
      'Using decorative style as the lead decision instead of safe sleep and room usability.',
      'Buying the largest crib for a smaller room and then losing the easy walking path around it.',
    ],
    howToChooseDescription:
      'Make the first decision about the sleep stage you are actually entering. Future flexibility only matters if the current setup works cleanly.',
    howToChoose: [
      {
        condition: 'want simplicity and have the room for a classic full-size setup',
        recommendation: 'Choose a standard crib and let straightforward win.',
      },
      {
        condition: 'need to protect floor space or are furnishing a smaller room',
        recommendation: 'Choose a mini crib if it still covers the sleep timeline you want.',
      },
      {
        condition: 'want long-term use and are comfortable with the extra cost or later conversion pieces',
        recommendation: 'A convertible crib can make sense, but only if the current crib setup is still the better fit today.',
      },
      {
        condition: 'need early flexibility more than a permanent nursery sleep piece',
        recommendation: 'Start with a room-sharing sleep setup first and move to a crib when the timing is cleaner.',
      },
    ],
  },
  gliders: {
    slug: 'gliders',
    title: 'Gliders',
    description: 'feeding + soothing support',
    metadataDescription:
      'Learn how to choose a nursery glider based on comfort, arm support, feeding ergonomics, and long-session use instead of nursery aesthetics.',
    icon: 'home',
    heroEyebrow: 'Nursery Furniture',
    heroImageSrc: '/assets/editorial/feeding.png',
    heroImageAlt: 'Comfortable feeding corner in a calm nursery.',
    orientation: [
      'A glider is not essential in the strictest sense.',
      'It is simply one of those products that becomes very important the minute you are feeding half awake for the fourth time that night.',
      'This is comfort furniture, yes.',
      'But it is also work furniture, and that is the part worth respecting.',
    ],
    whatItDoes: {
      description: 'A glider gives you a consistent place to feed, soothe, settle, and sit still long enough for the baby to finally decide that sleep is back on the table.',
      intro: [
        'You will likely spend more time in this chair than you expect, especially in the early months.',
        'That makes ergonomics more important than nursery styling. A beautiful chair that leaves your shoulders wrecked is not winning anything meaningful.',
      ],
      supportPoints: [
        'Parents planning to feed or soothe in the nursery for longer stretches.',
        'Families who want one reliable comfort zone instead of perching wherever a pillow happens to be.',
        'Anyone sharing feedings and needing a chair that works for more than one body.',
        'People who would like their arms, neck, and back to remain on speaking terms.',
      ],
      calloutBody:
        'Start with your body, the baby’s feeding position, and how long you expect to sit there at a time.',
      whatThisIs: 'A support chair for feeding and settling, not just a soft accent piece.',
      whyItExists:
        'Because long sessions feel very different in a chair that supports your body well than they do in one that merely matched the wallpaper.',
    },
    typesDescription:
      'The main split here is movement style, support level, and whether you want the chair to stay useful after the baby stage calms down.',
    types: [
      'Classic gliders: Smooth back-and-forth motion with a nursery-first feel and usually the most familiar look.',
      'Rockers: A slightly simpler motion style that can work well if the seat shape and arm support are still strong.',
      'Reclining gliders: Better for parents who want more body support during longer sessions, assuming the footprint still works.',
      'Upholstered accent chairs: Useful if you already know you want the chair to live beyond the nursery, but only if the ergonomics are still there.',
    ],
    whatActuallyMattersDescription:
      'This category should be tested like a workstation. Because in practice, that is exactly what it is.',
    whatActuallyMatters: [
      'Arm height that supports feeding instead of leaving your elbows searching for a better life.',
      'Seat depth and back support that feel good for a long hold, not just a quick sit.',
      'A motion style that is smooth and helpful without making the chair bulky for the room.',
      'Fabric and cleanup reality if snacks, spit-up, or life in general plan to get involved.',
      'Whether the chair is easy to get in and out of while holding a sleepy baby.',
    ],
    commonMistakesDescription:
      'Most glider disappointment comes from buying the chair for the room photo instead of the actual feeding posture.',
    commonMistakes: [
      'Choosing a chair because it looks expensive instead of because it feels supportive.',
      'Ignoring arm height and then discovering feeding pillows have become a structural requirement.',
      'Buying a huge recliner for a small room and giving away the walking space.',
      'Assuming any comfortable living-room chair will automatically work as a nursery chair.',
    ],
    howToChooseDescription:
      'Think about the sessions first. The right chair is the one you can keep using when you are tired, tucked in, and not in the mood to readjust six times.',
    howToChoose: [
      {
        condition: 'want the most classic nursery feeding setup',
        recommendation: 'Choose a glider with good arm support and an easy in-and-out seat height.',
      },
      {
        condition: 'want the most body support for longer sessions',
        recommendation: 'A reclining glider is usually the stronger fit if the room can handle the footprint.',
      },
      {
        condition: 'care about using the chair after the nursery years',
        recommendation: 'Choose an upholstered chair that still passes the feeding-ergonomics test.',
      },
      {
        condition: 'have limited room around the feeding corner',
        recommendation: 'Prioritize a slimmer glider or rocker with better proportions over extra features.',
      },
    ],
  },
  'dressers-changing': {
    slug: 'dressers-changing',
    title: 'Dressers & Changing',
    description: 'storage + changing workflow',
    metadataDescription:
      'Learn how to choose dressers and changing setups based on workflow, reach, storage access, and long-term use instead of extra nursery furniture.',
    icon: 'storage',
    heroEyebrow: 'Nursery Furniture',
    heroImageSrc: '/assets/editorial/organize.png',
    heroImageAlt: 'Nursery dresser with organized storage and changing essentials.',
    orientation: [
      'This category is less about drawers and more about workflow.',
      'Because changing your baby is not a furniture concept. It is a repeated, practical task that gets much easier when the setup is in the right place.',
      'A good dresser-changing setup saves steps.',
      'A clumsy one turns every diaper change into a scavenger hunt.',
    ],
    whatItDoes: {
      description: 'This setup stores the daily essentials and creates the changing station, which means it shapes both the room and the routine more than people expect.',
      intro: [
        'When storage and changing live together well, the whole nursery feels calmer.',
        'You know where the diapers are, the spare clothes are already there, and you are not leaning over a narrow station wishing the wipes were somehow closer than they currently are.',
      ],
      supportPoints: [
        'Families who want one furniture piece to do more than one job.',
        'Parents trying to keep changing supplies, backup clothes, and laundry triage in one zone.',
        'Anyone deciding between a dedicated changing table and a dresser topper.',
        'People who would like the nursery to remain useful after the diaper era fades a little.',
      ],
      calloutBody:
        'Start with the changing workflow, not the drawer count. The point is better reach, not more furniture.',
      whatThisIs: 'The storage-and-changing engine of the nursery, not just a place to fold small socks.',
      whyItExists:
        'Because diaper changes happen often enough that a better setup saves energy quickly, especially when extra clothes and backup supplies also need a home.',
    },
    typesDescription:
      'The main question is whether you want a dedicated changing piece, a dual-purpose dresser, or a setup that stays useful long after diapers stop running the show.',
    types: [
      'Dresser with changing topper: The most common long-game setup because it gives storage now and still works later.',
      'Dedicated changing table: Simple and obvious for the diaper stage, but more limited once that stage passes.',
      'Combo changing dresser: A built-in version of both jobs, often useful if the proportions fit the room well.',
      'Low wide dresser setups: Helpful when you want the changing surface broad, stable, and easy to work from.',
    ],
    whatActuallyMattersDescription:
      'This category works best when you judge it by hand reach, drawer access, and repeat use instead of by how nicely the drawer pulls photograph.',
    whatActuallyMatters: [
      'Changing-surface height that feels comfortable for the adult doing the work most often.',
      'Enough accessible storage for diapers, wipes, extra clothes, and the small chaos that tends to arrive with them.',
      'A stable top surface if you are using a changing topper or pad.',
      'Drawer function that stays easy with one hand because the other hand will often be busy.',
      'Whether the piece will still make sense in the room once changing is not its main job anymore.',
    ],
    commonMistakesDescription:
      'The biggest mistake here is buying separate furniture for separate tasks before asking whether one cleaner setup could handle both.',
    commonMistakes: [
      'Choosing a dedicated changing table without thinking about what replaces it later.',
      'Buying a dresser that looks lovely but stores very little of what the nursery actually needs.',
      'Forgetting to anchor the dresser once the setup is in place.',
      'Setting up the changing zone far from the rest of the daily supplies and creating extra steps every time.',
    ],
    howToChooseDescription:
      'Start with the room size and the routine. The best setup usually solves changing and storage in one move.',
    howToChoose: [
      {
        condition: 'want the strongest long-term value from one nursery piece',
        recommendation: 'Choose a dresser with a topper or changing pad and let it grow with the room.',
      },
      {
        condition: 'want the most obvious diaper-stage setup and have room for a single-purpose piece',
        recommendation: 'A dedicated changing table can work, but make that choice on purpose.',
      },
      {
        condition: 'need a wider, more stable work surface',
        recommendation: 'Choose a low wide dresser setup.',
      },
      {
        condition: 'want one purchase that handles storage and changing cleanly from day one',
        recommendation: 'A combo changing dresser is usually the easiest middle lane.',
      },
    ],
  },
  'diaper-pails': {
    slug: 'diaper-pails',
    title: 'Diaper Pails',
    description: 'daily function + odor control',
    metadataDescription:
      'Learn how to choose a diaper pail based on odor control, refill cost, convenience, and placement so the daily routine stays easier.',
    icon: 'bag',
    heroEyebrow: 'Nursery Furniture',
    heroImageSrc: '/assets/editorial/notebook-bunny.png',
    heroImageAlt: 'Calm nursery corner with everyday care supplies.',
    orientation: [
      'This is not the glamorous part of nursery planning.',
      'It is, however, the part that becomes surprisingly personal once the room starts smelling honest.',
      'A diaper pail should reduce friction.',
      'If it adds chores, bulk, or refill resentment, it is not helping nearly as much as the box promised.',
    ],
    whatItDoes: {
      description: 'A diaper pail contains the daily mess, which means it influences smell, convenience, and how annoying the changing setup feels over time.',
      intro: [
        'This category is really about tradeoffs: odor control versus cost, convenience versus upkeep, special refills versus simpler systems.',
        'There is no medal for overcomplicating the diaper-disposal part of the room. The goal is to keep it manageable.',
      ],
      supportPoints: [
        'Families changing diapers in the nursery multiple times a day.',
        'Parents who care about odor but would also prefer not to adopt an expensive refill subscription by accident.',
        'Anyone trying to keep the changing zone efficient instead of constantly trekking to another trash can.',
        'People who want to think about diaper disposal exactly as little as possible.',
      ],
      calloutBody:
        'Start with the rhythm of the room. The best pail is the one that stays easy on the busiest day, not just the cleanest day.',
      whatThisIs: 'A routine-support tool for the changing zone, not a tech product in disguise.',
      whyItExists:
        'Because odor, bag changes, and placement turn into daily friction very quickly when the system is wrong for the room.',
    },
    typesDescription:
      'The big divide is whether the system uses proprietary refills, standard trash bags, or a simpler closed-lid approach.',
    types: [
      'Proprietary refill pails: Strong odor control in many cases, but the refill cost becomes part of the long-term math.',
      'Standard-bag diaper pails: A simpler setup for parents who want more flexibility around bag choices.',
      'Sealed-lid nursery trash cans: A lower-fuss option when diaper volume is lighter or the nursery is not the only changing station.',
      'Minimalist open-bin approaches: Usually fine for very temporary use, but not the strongest long-term answer inside the nursery.',
    ],
    whatActuallyMattersDescription:
      'This category should be judged by smell, upkeep, and whether you resent using it by week three.',
    whatActuallyMatters: [
      'How well it controls odor in a closed room.',
      'How often it needs emptying compared with how often you realistically want to empty it.',
      'Refill or bag cost over time, not just on day one.',
      'Whether the opening and closing mechanism feels fast and easy during an actual diaper change.',
      'Placement near the changing area without crowding the workflow.',
    ],
    commonMistakesDescription:
      'Most diaper-pail frustration comes from buying for the idea of freshness without thinking about the daily maintenance attached to it.',
    commonMistakes: [
      'Choosing the strongest odor-control claim without checking refill cost.',
      'Placing the pail too far from the changing setup and adding unnecessary steps.',
      'Buying a very small pail and discovering it demands constant attention.',
      'Assuming a regular nursery trash can will feel identical in practice.',
    ],
    howToChooseDescription:
      'Decide how much odor control you need, how much upkeep you will tolerate, and how close the pail needs to live to the station.',
    howToChoose: [
      {
        condition: 'want the strongest odor control and are fine with specialty refills',
        recommendation: 'Choose a proprietary refill pail.',
      },
      {
        condition: 'want simpler long-term cost and more flexibility',
        recommendation: 'Choose a standard-bag diaper pail.',
      },
      {
        condition: 'change diapers in more than one room or do not need a full dedicated system',
        recommendation: 'A sealed-lid trash can may be enough.',
      },
      {
        condition: 'want the nursery setup to feel easiest day to day',
        recommendation: 'Place the pail within quick reach of the changing zone, whichever style you choose.',
      },
    ],
  },
  'baby-monitors': {
    slug: 'baby-monitors',
    title: 'Baby Monitors',
    description: 'visibility + peace of mind',
    metadataDescription:
      'Learn how to choose a baby monitor based on reliability, simplicity, night use, and WiFi versus non-WiFi tradeoffs instead of feature overload.',
    icon: 'shield',
    heroEyebrow: 'Nursery Furniture',
    heroImageSrc: '/assets/editorial/teddy-glow.png',
    heroImageAlt: 'Soft nighttime nursery scene with calming low light.',
    orientation: [
      'A baby monitor should give you clarity.',
      'Not another device relationship.',
      'This category gets crowded with features quickly, but most parents end up wanting one thing: a monitor that works when they need it without creating new problems.',
    ],
    whatItDoes: {
      description: 'A baby monitor helps you check the room, hear your baby, and stay connected to the sleep space without hovering over it every five minutes.',
      intro: [
        'The best monitor is usually the one that feels reliable and simple enough to use in the dark without a troubleshooting subplot.',
        'This is less about maximal technology and more about what actually helps you rest, respond, and check in confidently.',
      ],
      supportPoints: [
        'Parents who want clearer visibility into the sleep space without camping inside it.',
        'Families deciding between WiFi convenience and simpler dedicated monitoring.',
        'Anyone who knows that too many features can become one extra thing to manage at 1:17 AM.',
        'People who care more about reliability than novelty.',
      ],
      calloutBody:
        'Start with reliability and nighttime usability. A monitor that is easy to trust is usually the better monitor.',
      whatThisIs: 'A visibility tool for sleep and room checks, not a tech ecosystem to manage.',
      whyItExists:
        'Because peace of mind usually comes from consistency, not from an app with twelve tabs you did not ask for.',
    },
    typesDescription:
      'The main decision is whether you want audio only, dedicated video, app-based video, or extra sensor layers on top of that.',
    types: [
      'Audio monitors: A simpler option when hearing the room is enough and the rest can stay uncomplicated.',
      'Non-WiFi video monitors: Dedicated camera-and-parent-unit setups that usually prioritize reliability and simplicity.',
      'WiFi monitors: App-connected systems that offer flexibility and remote access, with a little more setup and dependence on your connection.',
      'Sensor-heavy systems: Added tracking or alerts layered onto video or audio monitoring for parents who truly want that extra layer.',
    ],
    whatActuallyMattersDescription:
      'This category works best when you judge it by reliability, speed, and nighttime clarity instead of by feature count.',
    whatActuallyMatters: [
      'Clear picture or sound when the room is dark.',
      'Reliable connection without constant lag or reconnection issues.',
      'Simple controls you can use when you are tired.',
      'Battery life or charging logic that fits the way you will actually use it.',
      'Whether WiFi feels genuinely useful for your routine or simply more complicated.',
    ],
    commonMistakesDescription:
      'Monitor disappointment usually comes from overbuying features and underestimating how valuable simple, dependable function really is.',
    commonMistakes: [
      'Choosing based on app features before confirming the core monitor quality.',
      'Assuming WiFi is always better, even when a dedicated monitor would be more straightforward.',
      'Ignoring nighttime image quality and then discovering the monitor is not especially helpful after lights out.',
      'Buying the most feature-heavy system when a simpler one would have answered the actual need.',
    ],
    howToChooseDescription:
      'Use the type of reassurance you actually want. More monitoring is not automatically better monitoring.',
    howToChoose: [
      {
        condition: 'want the simplest setup and mainly need to hear the room',
        recommendation: 'Choose an audio monitor.',
      },
      {
        condition: 'want video and prefer a dedicated system with fewer moving parts',
        recommendation: 'Choose a non-WiFi video monitor.',
      },
      {
        condition: 'want remote access or app-based flexibility and are comfortable with the tradeoffs',
        recommendation: 'A WiFi monitor can make sense.',
      },
      {
        condition: 'know you will feel calmer with extra data and alerts',
        recommendation: 'Choose a system with sensors, but only if you truly want to manage them.',
      },
    ],
  },
  'baby-proofing': {
    slug: 'baby-proofing',
    title: 'Baby Proofing',
    description: 'safety as baby grows',
    metadataDescription:
      'Learn how to approach baby proofing with better timing, anchoring, and layered safety so the nursery stays safer as your baby gets mobile.',
    icon: 'shield',
    heroEyebrow: 'Nursery Furniture',
    heroImageSrc: '/assets/editorial/nurseryzones.png',
    heroImageAlt: 'Nursery layout with zones and safe furniture placement.',
    orientation: [
      'Baby proofing matters most right before you wish you had done it sooner.',
      'Which is why this category works best when you approach it a little early instead of very dramatically later.',
      'This is not about wrapping the room in foam.',
      'It is about removing the highest-risk problems before mobility gets faster than expected.',
    ],
    whatItDoes: {
      description: 'Baby proofing reduces risk as your baby becomes mobile, curious, and strangely committed to the exact object you hoped they would ignore.',
      intro: [
        'In the nursery, that usually means anchoring furniture, managing cords, checking blind pulls, securing drawers, and thinking ahead to climbing and grabbing.',
        'The goal is not to create a zero-risk universe. It is to layer practical safety into the room before the next stage starts moving quickly.',
      ],
      supportPoints: [
        'Families setting up the room before rolling, scooting, pulling up, or climbing enters the conversation.',
        'Parents who want a calmer, layered approach instead of a last-minute panic order.',
        'Anyone with dressers, cords, drawers, or glider mechanisms that need a second look.',
        'People who know the nursery has to stay usable while also becoming safer.',
      ],
      calloutBody:
        'Start with anchoring and the highest-risk areas first. Safety works best when the critical parts happen early.',
      whatThisIs: 'A layered safety plan for the nursery, not a single product category with a tidy finish line.',
      whyItExists:
        'Because babies grow into the room faster than most people expect, and the best time to reduce risk is before the room starts getting explored in earnest.',
    },
    typesDescription:
      'This category is easier when you break it into risk groups instead of trying to proof the entire room in one anxious afternoon.',
    types: [
      'Furniture anchoring: The non-negotiable layer for dressers, bookshelves, and other tip-risk pieces.',
      'Drawer, cabinet, and access locks: Useful once baby can reach, pull, or open what you hoped stayed shut.',
      'Outlet and cord management: Important for the parts of the room that look harmless until they very much are not.',
      'Gates and zone barriers: Helpful when you need to limit access, though not every nursery will need them immediately.',
    ],
    whatActuallyMattersDescription:
      'This category is about timing, anchoring, and focusing on the most meaningful risks first.',
    whatActuallyMatters: [
      'Anchoring dressers and larger furniture before mobility ramps up.',
      'Checking cords, blinds, lamps, and anything hanging within reach.',
      'Thinking through how the room changes once drawers, gliders, and storage become tempting.',
      'Layering safety instead of assuming one product kit solves the room.',
      'Revisiting the room as your baby grows instead of treating baby proofing as a one-time event.',
    ],
    commonMistakesDescription:
      'Most baby-proofing stress comes from waiting too long and then trying to solve everything in one sweep.',
    commonMistakes: [
      'Treating baby proofing as something to start only after crawling begins.',
      'Buying a big kit without focusing first on furniture anchoring and the clearest hazards.',
      'Forgetting that gliders, cords, blind pulls, and drawers can all become part of the problem set.',
      'Assuming once the first round is done, the room never needs another look.',
    ],
    howToChooseDescription:
      'Start with the highest-risk hazards, then layer the rest in as your baby starts using the room differently.',
    howToChoose: [
      {
        condition: 'want to do the most important safety work first',
        recommendation: 'Start with furniture anchors and cord management.',
      },
      {
        condition: 'baby is already reaching, pulling, or getting suspiciously fast',
        recommendation: 'Add drawer or cabinet locks and review the whole room again.',
      },
      {
        condition: 'the nursery opens into an area you need to control more closely',
        recommendation: 'Consider gates or barriers where they meaningfully reduce risk.',
      },
      {
        condition: 'want the simplest long-term approach',
        recommendation: 'Think in layers and revisit the room at each new mobility stage.',
      },
    ],
  },
};

export const NURSERY_FURNITURE_HUB_WHO_THIS_IS_FOR = [
  'Parents who want the nursery to work well at 2am, not just when the room is clean and the light is flattering.',
  'Families trying to decide which furniture deserves actual square footage and which pieces are more optional than they first appear.',
  'Anyone choosing between a dedicated baby item and a longer-use piece that can do more than one job.',
  'People who want the room to feel calmer by buying fewer pieces with better logic behind them.',
] as const;

export const NURSERY_FURNITURE_HUB_WHY_THIS_MATTERS = [
  'Sleep feels easier when the crib setup is safe, simple, and properly fitted.',
  'Feeding and soothing go better when the chair supports your body instead of decorating around it.',
  'Changing gets faster when diapers, wipes, and spare clothes live where your hands already are.',
  'Monitor and diaper-pail decisions look small until they start affecting every single day.',
  'Baby proofing works best before mobility becomes the reason you suddenly care about anchoring furniture.',
] as const;

export const NURSERY_FURNITURE_HUB_DECISION_ITEMS: DecisionBlockItem[] = [
  {
    condition: 'need to solve the nighttime foundation first',
    recommendation: 'Start with cribs.',
    href: getNurseryFurnitureCategoryPath('cribs'),
  },
  {
    condition: 'expect to feed, soothe, or settle in the nursery regularly',
    recommendation: 'Open gliders next.',
    href: getNurseryFurnitureCategoryPath('gliders'),
  },
  {
    condition: 'want one move that improves both storage and changing',
    recommendation: 'Start with dressers and changing.',
    href: getNurseryFurnitureCategoryPath('dressers-changing'),
  },
  {
    condition: 'daily friction is mostly smell, quick checks, or setup annoyance',
    recommendation: 'Look at diaper pails and baby monitors.',
    href: getNurseryFurnitureCategoryPath('diaper-pails'),
  },
  {
    condition: 'baby is getting more mobile or you want to future-proof the room now',
    recommendation: 'Jump to baby proofing before you need it urgently.',
    href: getNurseryFurnitureCategoryPath('baby-proofing'),
  },
];

export const NURSERY_FURNITURE_HUB_NEXT_STEPS: NurseryFurnitureNextStep[] = [
  createNextStep(
    'Sleep Space Decisions',
    '/academy/nursery/sleep-space-decisions',
    'Go back to sleep setup if the room still needs a clearer foundation before you choose the furniture around it.',
    'Start',
  ),
  createNextStep(
    'Atmosphere & Safety',
    '/academy/nursery/atmosphere-and-safety',
    'Return to the calmer, room-level layer once the practical furniture pieces are doing their jobs.',
    'Refine',
  ),
  createNextStep(
    'Gear Journey',
    '/academy/gear',
    'Move into the gear path once the room itself feels more settled and the next decisions belong outside the nursery.',
    'Decide',
  ),
];

export function getNurseryFurnitureCategoryCards(): GuideHubLink[] {
  return CATEGORY_ORDER.map((slug) => {
    const category = NURSERY_FURNITURE_CATEGORIES[slug];
    return {
      title: category.title,
      description: category.description,
      href: getNurseryFurnitureCategoryPath(slug),
      icon: category.icon,
    };
  });
}

export function getNurseryFurnitureSubmoduleCards() {
  return CATEGORY_ORDER.map((slug) => {
    const category = NURSERY_FURNITURE_CATEGORIES[slug];
    return {
      href: getNurseryFurnitureCategoryPath(slug),
      title: category.title,
      description: category.description,
      ctaLabel: 'Open sub module ->',
      eyebrow: 'Nursery Category',
    };
  });
}

export function getNurseryFurnitureCategory(slug: NurseryFurnitureCategorySlug) {
  return NURSERY_FURNITURE_CATEGORIES[slug];
}

export function getNurseryFurnitureCategoryNextStepLinks(slug: NurseryFurnitureCategorySlug): NurseryFurnitureNextStep[] {
  const currentIndex = CATEGORY_ORDER.indexOf(slug);
  const nextSlug = currentIndex >= 0 ? CATEGORY_ORDER[currentIndex + 1] : null;

  if (nextSlug) {
    const nextCategory = getNurseryFurnitureCategory(nextSlug);
    return [
      createNextStep(
        nextCategory.title,
        getNurseryFurnitureCategoryPath(nextSlug),
        `Continue into ${nextCategory.title.toLowerCase()} while the nursery workflow is still fresh in your head.`,
        'Compare',
      ),
      createNextStep(
        'Furniture That Actually Works',
        NURSERY_FURNITURE_HUB_PATH,
        'Return to the furniture hub if you want the full module map again before opening another category.',
        'Start',
      ),
      createNextStep(
        'Gear Journey',
        '/academy/gear',
        'Move out of the room and into baby gear once the nursery furniture decisions feel calmer.',
        'Decide',
      ),
    ];
  }

  return [
    createNextStep(
      'Gear Journey',
      '/academy/gear',
      'Continue into the gear path once the room itself feels functional and the next big decisions live outside it.',
      'Decide',
    ),
    createNextStep(
      'Atmosphere & Safety',
      '/academy/nursery/atmosphere-and-safety',
      'Revisit the final nursery layer if you want the room to feel calmer now that the hard-working furniture is in place.',
      'Refine',
    ),
    createNextStep(
      'Furniture That Actually Works',
      NURSERY_FURNITURE_HUB_PATH,
      'Jump back to the furniture hub if you want the full module overview again.',
      'Start',
    ),
  ];
}
