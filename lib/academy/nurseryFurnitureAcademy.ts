import type { ModuleLayoutData } from '@/components/academy/ModuleLayout';
import type { DecisionBlockItem } from '@/components/guides/DecisionBlock';
import type { GuideStageLabel } from '@/lib/guides/guideFlow';
import type { GuideHubIconKey, GuideHubLink } from '@/lib/guides/hubs';

export const NURSERY_FURNITURE_HUB_PATH = '/academy/nursery/furniture-that-actually-works' as const;

export const NURSERY_FURNITURE_HUB_SLIDES = [
  { id: 'nursery-furniture-orientation', label: 'Orientation', shortLabel: 'Start' },
  { id: 'nursery-furniture-room-job', label: 'Room Job', shortLabel: 'Why' },
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
  | 'pack-and-play'
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
  overviewImageSrc?: string;
  overviewImageAlt?: string;
  overviewImageCaption?: string;
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
  skipReasons: string[];
  howToChooseDescription: string;
  howToChoose: DecisionBlockItem[];
};

type NurseryFurnitureNextStep = {
  label: string;
  href: string;
  description: string;
  stage: GuideStageLabel;
};

type NurseryFurnitureGroundingExample = ModuleLayoutData['products'][number];

const NURSERY_FURNITURE_LINKS = {
  dadadaBaby: 'https://dadadababy.com',
  halo: 'https://www.halosleep.com',
  hatch: 'https://www.hatch.co',
  joolBaby: 'https://joolbaby.com',
  momcozy: 'https://momcozy.com',
  nanit: 'https://www.nanit.com',
  newtonBaby: 'https://www.newtonbaby.com',
  owlet: 'https://owletcare.com',
} as const;

const CATEGORY_ORDER: NurseryFurnitureCategorySlug[] = [
  'cribs',
  'pack-and-play',
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

export function isNurseryFurnitureCategorySlug(value: string): value is NurseryFurnitureCategorySlug {
  return CATEGORY_ORDER.includes(value as NurseryFurnitureCategorySlug);
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
    heroImageSrc: '/assets/nurserypath/criblifestyle.png',
    heroImageAlt: 'Crib lifestyle image in a calm nursery setup.',
    overviewImageSrc: '/assets/nurserypath/dadadaminicrib.png',
    overviewImageAlt: 'Mini crib shown as part of the broader crib category.',
    overviewImageCaption: 'The crib lane gets clearer when you separate room fit, mattress fit, and long-term use from conversion marketing.',
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
      'Crib mattress pairing: The mattress is part of the sleep setup, not a side errand. Standard and mini sizes need the right match from the beginning.',
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
    skipReasons: [
      'You are still in the room-sharing stage, and a bassinet or portable sleep setup solves the current season more cleanly.',
      'The room footprint points more clearly to a mini crib or another smaller sleep setup than to a full-size crib right now.',
      'You are shopping for future conversion stories before the current sleep setup feels honestly solved.',
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
        condition: 'are choosing between standard and mini crib sizes',
        recommendation: 'Choose the mattress at the same time so fit, airflow, and sheet size are solved together.',
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
  'pack-and-play': {
    slug: 'pack-and-play',
    title: 'Pack & Play',
    description: 'flex sleep + backup setup',
    metadataDescription:
      'Learn how to choose a pack and play based on sleep use, portability, fold, and whether it is solving nursery flexibility, room sharing, or travel.',
    icon: 'sleep',
    heroEyebrow: 'Nursery Furniture',
    heroImageSrc: '/assets/nurserypath/packandplay.png',
    heroImageAlt: 'Portable crib and pack-and-play style sleep setup.',
    overviewImageSrc: '/assets/nurserypath/bedsidepackandplay.png',
    overviewImageAlt: 'Pack-and-play used beside the bed as part of a flexible sleep setup.',
    overviewImageCaption: 'This category is really about portability, flexibility, and whether the setup earns its place in daily life.',
    orientation: [
      'A pack and play is not just a travel item.',
      'For some families, it is the flexible sleep space that quietly does the most work in the house.',
      'This category gets easier once you decide whether it is solving nursery overflow, room sharing, travel, or all three.',
      'The right one should feel easy to fold, easy to place, and easy to trust.',
    ],
    whatItDoes: {
      description:
        'A pack and play creates a portable sleep and set-down zone, which makes it useful for room sharing, secondary sleep spaces, travel, and homes that need more flexibility than a fixed crib can provide.',
      intro: [
        'This category earns its keep when you need one piece to move between jobs without turning every room into a second nursery.',
        'The important question is not whether it can technically do a lot. It is whether the version you choose fits the way you actually plan to use it.',
      ],
      supportPoints: [
        'Families planning to room share or create a secondary sleep zone outside the main nursery.',
        'Parents who want a portable reset option for naps, travel, or time at another caregiver’s house.',
        'Homes that need flexibility more than they need one more full-size furniture commitment.',
        'Anyone trying to decide whether this belongs in the nursery plan, the travel plan, or both.',
      ],
      calloutBody:
        'Start with the real job: daily secondary sleep, occasional travel, or room-to-room flexibility. That decision narrows the field fast.',
      whatThisIs: 'A flexible sleep-and-set-down station, not just a folded rectangle living in the closet.',
      whyItExists:
        'Because some families need portability built into the nursery plan, and not every sleep decision wants a fixed-footprint answer.',
    },
    typesDescription:
      'The main split here is whether you need a true daily-use secondary sleep space, a lighter travel-first option, or a playard with attachments that only matter for one short phase.',
    types: [
      'Classic playards: The familiar full-size foldable option for homes that want one flexible base and do not mind a bigger footprint.',
      'Travel-crib style models: Lighter, simpler, and often better for families who care more about portability than add-ons.',
      'Bassinet-attachment models: Useful if early room sharing is the goal, as long as you know how quickly the top level may be outgrown.',
      'Multi-level systems with changers or accessories: Helpful for some families, but only when those attachments actually match the way the room will be used.',
    ],
    whatActuallyMattersDescription:
      'This category works best when you judge it by fold, weight, sleep use, and how often you will move it instead of by how many accessories were clipped onto the box.',
    whatActuallyMatters: [
      'Whether it is approved and practical for the kind of sleep use you actually have in mind.',
      'Fold simplicity, because irritation during setup does not get cuter on the third reset of the day.',
      'Weight and footprint, especially if the whole point is flexibility.',
      'How easy it is to clean, store, and move when the nursery is not the only room involved.',
      'Whether the attachments help long enough to justify the bulk they add.',
    ],
    commonMistakesDescription:
      'Pack-and-play regret usually comes from buying the most feature-stuffed version before deciding what the setup actually needs to do.',
    commonMistakes: [
      'Buying a giant all-in-one system when the real job was one simple backup sleep space.',
      'Assuming every pack and play feels equally good to fold, carry, and reset.',
      'Treating this like a permanent crib replacement without checking whether the sleep plan really supports that.',
      'Paying for attachments that solve a very short phase and then stay attached to your resentment instead.',
    ],
    skipReasons: [
      'Your main crib or bassinet plan already covers the real use case, and travel or backup sleep is too occasional to justify another large item.',
      'The fold, weight, or footprint already sounds more annoying than helpful for the way you live.',
      'The add-ons are what look appealing, but the actual flexible sleep job still feels vague.',
    ],
    howToChooseDescription:
      'Choose the version of flexibility that matches the real use case. The point is fewer compromises in motion, not more accessories on paper.',
    howToChoose: [
      {
        condition: 'need a daily secondary sleep space or room-sharing backup',
        recommendation: 'Choose a sturdier playard or travel crib that feels stable and easy to access at night.',
      },
      {
        condition: 'mostly need something for travel or visiting another house',
        recommendation: 'Choose the lighter, simpler fold before you chase extra attachments.',
      },
      {
        condition: 'want the early-months convenience of a raised bassinet level',
        recommendation: 'Choose a model with that feature only if you know the short use window still makes sense for your plan.',
      },
      {
        condition: 'care most about long-term usability',
        recommendation: 'Let fold, footprint, and how often you will actually move it decide the category.',
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
    heroImageSrc: '/assets/nurserypath/glider.png',
    heroImageAlt: 'Nursery glider and ottoman setup.',
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
    skipReasons: [
      'You are not planning to feed or soothe in the nursery often enough to justify a dedicated chair there.',
      'The room cannot handle the chair footprint without making the layout worse.',
      'An existing chair already supports your body well enough, which means this category may not need another purchase.',
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
    heroImageSrc: '/assets/nurserypath/dadadadresser.png',
    heroImageAlt: 'Nursery dresser with changing essentials.',
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
    skipReasons: [
      'You already have storage and changing solved separately in a way that works cleanly.',
      'The room needs a slimmer changing solution than a dresser-top setup can provide.',
      'You are choosing based on drawer fantasy instead of the actual changing workflow you plan to repeat.',
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
    heroImageSrc: '/assets/nurserypath/joolbabydiperpail.png',
    heroImageAlt: 'Diaper pail placed inside a nursery care zone.',
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
    skipReasons: [
      'Trash access is already easy, and a dedicated pail would not improve the routine enough to matter.',
      'You do not want one more refill or bag system to manage.',
      'The changing setup is temporary or split across rooms, so one fixed pail would add more hassle than help.',
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
    heroImageSrc: '/assets/nurserypath/nanit.png',
    heroImageAlt: 'Nanit monitor in a nursery setting.',
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
    skipReasons: [
      'You want the simplest possible sleep setup and do not need video, app, or sensor layers yet.',
      'More alerts or data would likely raise your stress more than lower it.',
      'Your home layout or sleep plan makes room sharing or direct listening enough for now.',
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
    heroImageSrc: '/assets/nurserypath/space.png',
    heroImageAlt: 'Nursery layout with safe furniture spacing.',
    orientation: [
      'Baby proofing is one of those categories people plan to do later.',
      'Then later shows up rolling, reaching, pulling, and moving with deeply unearned confidence.',
      'This works best when you do the calm version first.',
      'Not the panicked version after the room has already started fighting back.',
      'The goal is not to bubble-wrap the nursery. It is to remove the risks that become obvious the minute your baby gets mobile.',
    ],
    whatItDoes: {
      description:
        'Baby proofing reduces the room-level risks that show up once curiosity, movement, and furniture all start sharing the same floor plan.',
      intro: [
        'In the nursery, that usually means anchoring furniture, managing cords, checking blind pulls, securing drawers, and looking at the room from a lower, faster, much less reasonable point of view.',
        'The strongest baby-proofing plan is layered. You handle the biggest risks first, then revisit the room as your baby starts using it differently.',
        'This is not a one-cart category. It is an evolving safety pass that keeps the nursery usable while making the obvious hazards harder to reach, pull, climb, or tip.',
      ],
      supportPoints: [
        'Families setting up the nursery before rolling, scooting, pulling up, or climbing becomes part of the daily personality profile.',
        'Parents who want the calm, earlier version of baby proofing instead of the frantic cleanup tour.',
        'Anyone with dressers, changing stations, cords, blinds, drawers, shelves, or glider mechanisms that deserve a second look.',
        'People trying to keep the room functional instead of turning it into a maze of plastic regrets.',
      ],
      calloutBody:
        'Start with anchoring, cords, and the high-risk reach zones first. That is where the safety payoff shows up fastest.',
      whatThisIs: 'A layered nursery safety plan, not a one-time shopping errand with a false finish line.',
      whyItExists:
        'Because babies start interacting with the room faster than most people expect, and the easiest time to reduce risk is before the room becomes part obstacle course.',
    },
    typesDescription:
      'This gets much easier when you sort the room into risk groups instead of trying to “finish” baby proofing in one long, slightly irritated afternoon.',
    types: [
      'Furniture anchoring: The first and most important layer for dressers, shelves, changing furniture, and anything that could tip when pulled or climbed.',
      'Drawer, cabinet, and access control: Useful once curiosity turns handles, drawers, and low storage into a personal challenge.',
      'Outlet, monitor-cord, lamp-cord, and blind-cord management: Important because the quiet hazards are still hazards.',
      'Barrier planning and room boundaries: Helpful when the nursery opens into another area or when you need cleaner control over access points.',
    ],
    whatActuallyMattersDescription:
      'The right baby-proofing plan is mostly about timing, anchoring, and focusing on the risks that matter more than the gadgets.',
    whatActuallyMatters: [
      'Anchoring dressers and larger furniture before rolling becomes climbing with a sequel.',
      'Checking cords, blinds, monitors, lamps, and anything hanging, dangling, or oddly inviting.',
      'Looking at reach zones around gliders, changing stations, and low storage instead of only the obvious surfaces.',
      'Layering safety changes over time instead of assuming one kit solved the room forever.',
      'Rechecking the nursery each time mobility changes, because the room changes the minute your baby does.',
    ],
    commonMistakesDescription:
      'Most baby-proofing stress is self-inflicted by waiting too long and then trying to solve an evolving problem in one sweep.',
    commonMistakes: [
      'Waiting until crawling or pulling up starts before thinking seriously about tip risks and reach zones.',
      'Buying a giant kit first instead of handling furniture anchors and the clearest hazards immediately.',
      'Forgetting that gliders, cords, blinds, drawers, diaper caddies, and changing supplies can all become part of the problem.',
      'Treating baby proofing like a one-time install instead of an ongoing room check as your baby grows.',
    ],
    skipReasons: [
      'Baby is not mobile yet, and the room still needs a lighter anchor-and-cord pass more than a full category rollout.',
      'The nursery already has very few reachable hazards, so a targeted safety edit makes more sense than a giant kit.',
      'You are being sold a full proofing system when the room really only needs a few concrete fixes.',
    ],
    howToChooseDescription:
      'Start with the highest-risk hazards now, then add the next layer before the room starts asking for it loudly.',
    howToChoose: [
      {
        condition: 'want the highest-impact safety work done first',
        recommendation: 'Start with furniture anchors, blind and monitor cords, and anything that could tip, wrap, or pull.',
      },
      {
        condition: 'baby is already reaching, pulling, or moving faster than your original timeline suggested',
        recommendation: 'Add drawer or cabinet locks and walk the entire nursery again from the floor-level view.',
      },
      {
        condition: 'the nursery opens into another area or has a doorway you need to manage more intentionally',
        recommendation: 'Use gates or barriers only where they actually reduce access risk and do not make the room more annoying to use.',
      },
      {
        condition: 'want the simplest long-term approach',
        recommendation: 'Think in stages: anchor first, lock next, recheck often, and let mobility changes tell you what gets added.',
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
  'Pack-and-play decisions matter when the nursery also needs portability, room-sharing flexibility, or a backup sleep plan.',
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
    condition: 'need nursery flexibility, room-sharing backup, or a more portable sleep zone',
    recommendation: 'Open pack and play next.',
    href: getNurseryFurnitureCategoryPath('pack-and-play'),
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

export const NURSERY_FURNITURE_HUB_GROUNDING_EXAMPLES: NurseryFurnitureGroundingExample[] = [
  {
    name: 'dadada Baby Convertible Crib',
    brand: 'dadada Baby',
    description: 'A crib grounding example for families who want the primary sleep setup to feel simple, stable, and not overly decorated.',
    pros: ['Sleep-space anchor', 'Useful when the nursery needs one clear foundation piece'],
    affiliateUrl: NURSERY_FURNITURE_LINKS.dadadaBaby,
    category: 'Nursery furniture grounding example',
    imageSrc: '/assets/nurserypath/dadadacrib.png',
    imageAlt: 'dadada Baby convertible crib.',
  },
  {
    name: 'dadada Baby Dresser + Changing Setup',
    brand: 'dadada Baby',
    description: 'A dual-purpose dresser example that keeps storage and changing in one zone instead of adding a second furniture decision unnecessarily.',
    pros: ['Storage plus changing', 'Useful when one piece needs to work harder'],
    affiliateUrl: NURSERY_FURNITURE_LINKS.dadadaBaby,
    category: 'Nursery furniture grounding example',
    imageSrc: '/assets/nurserypath/dadadadresser.png',
    imageAlt: 'dadada Baby dresser and changing setup.',
  },
  {
    name: 'Newton Baby Travel Crib & Play Yard',
    brand: 'Newton Baby',
    description: 'A portable sleep example for families who need a secondary nursery sleep zone, travel flexibility, or a room-sharing backup that still feels intentional.',
    pros: ['Flexible sleep zone', 'Useful when portability is part of the plan'],
    affiliateUrl: NURSERY_FURNITURE_LINKS.newtonBaby,
    category: 'Nursery furniture grounding example',
    imageSrc: '/assets/nurserypath/newtonnestcrib.png',
    imageAlt: 'Newton Baby travel crib and play yard.',
  },
] as const;

const NURSERY_FURNITURE_CATEGORY_PRODUCTS: Record<
  NurseryFurnitureCategorySlug,
  NurseryFurnitureGroundingExample[]
> = {
  cribs: [
    {
      name: 'dadada Baby Convertible Crib',
      brand: 'dadada Baby',
      description: 'A crib grounding example for families who want the main sleep space to feel stable, simple, and easy to live with at night.',
      pros: ['Primary sleep anchor', 'Useful when the nursery needs one clear crib decision'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.dadadaBaby,
      category: 'Crib grounding example',
      imageSrc: '/assets/nurserypath/dadadacrib.png',
      imageAlt: 'dadada Baby convertible crib.',
    },
    {
      name: 'Newton Baby Original Crib Mattress',
      brand: 'Newton Baby',
      description: 'A crib mattress grounding example that keeps standard-size crib fit and the actual sleep surface part of the same decision.',
      pros: ['Standard crib fit', 'Useful when you want to solve mattress pairing at the same time'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.newtonBaby,
      category: 'Crib mattress grounding example',
      imageSrc: '/assets/nurserypath/newtonmatress.png',
      imageAlt: 'Newton Baby original crib mattress.',
    },
    {
      name: 'Newton Baby Mini Crib Mattress',
      brand: 'Newton Baby',
      description: 'A mini crib mattress example for smaller-footprint nurseries where the mattress decision needs to stay as intentional as the crib itself.',
      pros: ['Mini crib fit', 'Useful when square footage is tight but sleep still needs to feel solved'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.newtonBaby,
      category: 'Crib mattress grounding example',
      imageSrc: '/assets/nurserypath/minicribmatressnewton.png',
      imageAlt: 'Newton Baby mini crib mattress.',
    },
  ],
  'pack-and-play': [
    {
      name: 'Newton Baby Travel Crib & Play Yard',
      brand: 'Newton Baby',
      description: 'A pack-and-play grounding example for families who want a more intentional portable sleep zone instead of a pure backup item.',
      pros: ['Portable sleep setup', 'Useful when travel or room-sharing flexibility is part of the nursery plan'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.newtonBaby,
      category: 'Pack-and-play grounding example',
      imageSrc: '/assets/nurserypath/newtonnestcrib.png',
      imageAlt: 'Newton Baby travel crib and play yard.',
    },
    {
      name: 'HALO Flex Portable Crib',
      brand: 'HALO',
      description: 'A lighter mesh-sided portable-crib example for families who need a secondary sleep setup that folds and moves without a huge nursery footprint.',
      pros: ['Portable mesh setup', 'Useful when the room needs flexibility more than extra bulk'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.halo,
      category: 'Pack-and-play grounding example',
      imageSrc: '/assets/nurserypath/halominimeshcrib.png',
      imageAlt: 'HALO portable crib or pack-and-play style setup.',
    },
  ],
  gliders: [
    {
      name: 'Classic nursery glider setup',
      brand: '',
      description: 'A grounding example for the smoother, classic nursery-chair lane where feeding comfort and motion are the main jobs.',
      pros: ['Comfort-focused seating', 'Useful when the nursery needs one reliable feeding chair'],
      affiliateUrl: null,
      category: 'Glider grounding example',
      imageSrc: '/assets/nurserypath/glider.png',
      imageAlt: 'Classic nursery glider and ottoman setup.',
    },
    {
      name: 'Reclining support chair',
      brand: '',
      description: 'A more lounge-forward seating example for parents who want stronger body support during longer feeding or settling sessions.',
      pros: ['Long-session support', 'Useful when comfort outranks compact footprint'],
      affiliateUrl: null,
      category: 'Glider grounding example',
      imageSrc: '/assets/nurserypath/kiwirecliner.png',
      imageAlt: 'Reclining nursery chair with stronger arm and back support.',
    },
    {
      name: 'Compact upholstered nursery chair',
      brand: '',
      description: 'A smaller-footprint chair example for rooms that need a feeding corner without letting the seating take over the entire layout.',
      pros: ['Smaller footprint', 'Useful when the room needs a slimmer chair decision'],
      affiliateUrl: null,
      category: 'Glider grounding example',
      imageSrc: '/assets/nurserypath/dresserandrecliner.png',
      imageAlt: 'Compact nursery chair beside a dresser setup.',
    },
  ],
  'dressers-changing': [
    {
      name: 'dadada Baby Dresser + Changing Setup',
      brand: 'dadada Baby',
      description: 'A dresser-and-changing example for families who want storage and diaper duty solved in one cleaner move.',
      pros: ['Dual-purpose furniture', 'Useful when the room needs fewer larger pieces'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.dadadaBaby,
      category: 'Changing setup grounding example',
      imageSrc: '/assets/nurserypath/dadadadresser.png',
      imageAlt: 'dadada Baby dresser and changing setup.',
    },
    {
      name: 'Hatch Grow Changing Pad',
      brand: 'Hatch',
      description: 'A changing-pad example that keeps the dresser-top setup feeling more intentional when you want the changing surface to stay low-profile.',
      pros: ['Dresser-top changing surface', 'Useful when you want changing built into the storage zone'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.hatch,
      category: 'Changing setup grounding example',
      imageSrc: '/assets/nurserypath/hatchproductexample.png',
      imageAlt: 'Hatch Grow changing pad product example.',
    },
  ],
  'diaper-pails': [
    {
      name: 'Jool Baby Diaper Pail',
      brand: 'Jool Baby',
      description: 'A diaper-pail grounding example for families who want the changing zone to stay easier without turning every bag change into drama.',
      pros: ['Nursery odor control', 'Useful when the pail lives close to the station'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.joolBaby,
      category: 'Diaper pail grounding example',
      imageSrc: '/assets/nurserypath/joolbabydiperpail.png',
      imageAlt: 'Jool Baby diaper pail.',
    },
    {
      name: 'Momcozy Diaper Pail',
      brand: 'Momcozy',
      description: 'A standard-bag diaper-pail example for parents who want the daily routine to stay simpler over the long haul.',
      pros: ['Simpler bag strategy', 'Useful when refill resentment is not on the wish list'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.momcozy,
      category: 'Diaper pail grounding example',
      imageSrc: '/assets/nurserypath/momcozydiperpail.png',
      imageAlt: 'Momcozy diaper pail.',
    },
  ],
  'baby-monitors': [
    {
      name: 'Nanit Pro Camera + Wall Mount',
      brand: 'Nanit',
      description: 'A WiFi-monitor grounding example for families who want app-based visibility and are comfortable with the extra setup that comes with it.',
      pros: ['App-connected monitoring', 'Useful when remote access actually fits the routine'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.nanit,
      category: 'Baby monitor grounding example',
      imageSrc: '/assets/nurserypath/nanit.png',
      imageAlt: 'Nanit Pro baby monitor.',
    },
    {
      name: 'Owlet Dream Sock',
      brand: 'Owlet',
      description: 'A sensor-layer monitoring example for families who know they want more data and are comfortable managing another device relationship.',
      pros: ['Additional monitoring layer', 'Useful when extra alerts genuinely help you rest'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.owlet,
      category: 'Baby monitor grounding example',
      imageSrc: '/assets/nurserypath/owlet.png',
      imageAlt: 'Owlet Dream Sock monitoring example.',
    },
    {
      name: 'Momcozy Baby Monitor',
      brand: 'Momcozy',
      description: 'A dedicated-monitor grounding example for families who want video visibility without turning the sleep space into one more app problem.',
      pros: ['Dedicated monitor setup', 'Useful when simplicity outranks extra connectivity'],
      affiliateUrl: NURSERY_FURNITURE_LINKS.momcozy,
      category: 'Baby monitor grounding example',
      imageSrc: '/assets/nurserypath/momcozybabymonitor.png',
      imageAlt: 'Momcozy baby monitor.',
    },
  ],
  'baby-proofing': [
    {
      name: 'Furniture anchoring pass',
      brand: '',
      description: 'A grounding example for the highest-impact safety move: anchoring the larger nursery pieces before curiosity decides to start testing leverage.',
      pros: ['High-impact safety layer', 'Useful when the nursery has dressers, shelves, or tip-risk furniture'],
      affiliateUrl: null,
      category: 'Baby-proofing grounding example',
      imageSrc: '/assets/nurserypath/dadadadresser.png',
      imageAlt: 'Anchored dresser and nursery furniture safety example.',
    },
    {
      name: 'Reach-zone floor sweep',
      brand: '',
      description: 'A grounding example for scanning the nursery from the lower, faster point of view your baby is about to adopt.',
      pros: ['Floor-level safety edit', 'Useful when the room needs a calmer second pass before mobility ramps up'],
      affiliateUrl: null,
      category: 'Baby-proofing grounding example',
      imageSrc: '/assets/nurserypath/nurseryplayroom.png',
      imageAlt: 'Nursery reach-zone and mobility safety example.',
    },
    {
      name: 'Cord and blind management pass',
      brand: '',
      description: 'A grounding example for the quiet hazards that rarely photograph like a problem and still deserve attention early.',
      pros: ['Quiet-hazard cleanup', 'Useful when cords, monitors, lamps, or blinds are part of the room'],
      affiliateUrl: null,
      category: 'Baby-proofing grounding example',
      imageSrc: '/assets/nurserypath/nurseyatnight.png',
      imageAlt: 'Nursery cord and nighttime safety example.',
    },
  ],
};

const NURSERY_FURNITURE_CATEGORY_SECTION_IMAGES: Record<
  NurseryFurnitureCategorySlug,
  {
    types: { src: string; alt: string; caption: string };
    matters: { src: string; alt: string; caption: string };
    mistakes: { src: string; alt: string; caption: string };
    choose: { src: string; alt: string; caption: string };
  }
> = {
  cribs: {
    types: {
      src: '/assets/nurserypath/minicribsize.png',
      alt: 'Mini crib size and footprint planning image.',
      caption: 'The size question gets quieter once the room footprint and sleep plan are both on the table.',
    },
    matters: {
      src: '/assets/nurserypath/minivsstandadcrib.png',
      alt: 'Mini crib and standard crib comparison image.',
      caption: 'The right crib setup comes from matching the room, the sleep stage, and the footprint instead of defaulting to the biggest option.',
    },
    mistakes: {
      src: '/assets/nurserypath/cribandclouds.png',
      alt: 'Styled nursery crib image.',
      caption: 'Pretty stops mattering fast if the sleep setup is harder to use than it needs to be.',
    },
    choose: {
      src: '/assets/nurserypath/dadadaminicrib.png',
      alt: 'Mini crib example used to show room-fit crib thinking.',
      caption: 'Choose the crib setup that fits the room you are actually furnishing now.',
    },
  },
  'pack-and-play': {
    types: {
      src: '/assets/nurserypath/packplaystorage.png',
      alt: 'Pack-and-play setup with practical storage and transport context.',
      caption: 'This category gets easier once you know whether you care more about portability, sleep use, or attachments.',
    },
    matters: {
      src: '/assets/nurserypath/newtonlifestyle.png',
      alt: 'Portable sleep setup lifestyle image.',
      caption: 'The strongest setup is the one that folds, moves, and resets without becoming a side project.',
    },
    mistakes: {
      src: '/assets/nurserypath/space.png',
      alt: 'Nursery space-planning image.',
      caption: 'Buying more system than the room or routine actually needs is where this category gets bulky fast.',
    },
    choose: {
      src: '/assets/nurserypath/nurseryplanning.png',
      alt: 'Nursery planning image for flexible sleep setup.',
      caption: 'Start with the job: room sharing, travel, or backup sleep. That does most of the narrowing for you.',
    },
  },
  gliders: {
    types: {
      src: '/assets/nurserypath/glider.png',
      alt: 'Nursery glider and ottoman image.',
      caption: 'The chair should match the way you plan to sit, feed, and settle, not just the rest of the room.',
    },
    matters: {
      src: '/assets/nurserypath/kiwirecliner.png',
      alt: 'Nursery recliner with stronger body support.',
      caption: 'Arm support, seat depth, and getting up cleanly while holding a baby matter more than chair drama.',
    },
    mistakes: {
      src: '/assets/nurserypath/nurseryidea.png',
      alt: 'Styled nursery corner image.',
      caption: 'A chair can look beautiful and still leave your back wondering why you did this to it.',
    },
    choose: {
      src: '/assets/nurserypath/dresserandrecliner.png',
      alt: 'Smaller-footprint nursery chair beside dresser setup.',
      caption: 'Pick the chair you would still want during the fourth feed, not just the first photo.',
    },
  },
  'dressers-changing': {
    types: {
      src: '/assets/nurserypath/dadadatopper.png',
      alt: 'Dresser topper and changing setup example.',
      caption: 'Most families are deciding between a dedicated changing piece and one better dual-purpose move.',
    },
    matters: {
      src: '/assets/nurserypath/hatchchangingpad.png',
      alt: 'Changing pad on dresser setup.',
      caption: 'Reach, stability, and where the daily essentials already live do more of the work here than drawer count.',
    },
    mistakes: {
      src: '/assets/nurserypath/changingpad.png',
      alt: 'Changing setup image.',
      caption: 'The setup gets annoying fast when storage and diaper duty live too far apart.',
    },
    choose: {
      src: '/assets/nurserypath/milkstreettopper.png',
      alt: 'Nursery dresser with topper example.',
      caption: 'The cleanest choice usually solves storage and changing in one move.',
    },
  },
  'diaper-pails': {
    types: {
      src: '/assets/nurserypath/momcozydiperpail.png',
      alt: 'Momcozy diaper pail in a nursery.',
      caption: 'The big tradeoff is usually odor control versus refill dependence, not whether the pail is especially exciting.',
    },
    matters: {
      src: '/assets/nurserypath/joolbabydiperpail.png',
      alt: 'Jool Baby diaper pail inside a nursery zone.',
      caption: 'If the opening, emptying, and placement feel easy on the busiest day, the pail is doing its job.',
    },
    mistakes: {
      src: '/assets/nurserypath/duplicate.png',
      alt: 'Duplicate nursery gear image.',
      caption: 'This is a category where overbuying often looks like paying for a fancier hassle.',
    },
    choose: {
      src: '/assets/nurserypath/nurseyatnight.png',
      alt: 'Nighttime nursery workflow image.',
      caption: 'Choose the setup that keeps the changing zone quicker and less annoying in real use.',
    },
  },
  'baby-monitors': {
    types: {
      src: '/assets/nurserypath/audiomonitor.png',
      alt: 'Dedicated audio baby monitor image.',
      caption: 'The real choice is usually between simple dedicated monitoring, WiFi flexibility, or extra sensor layers.',
    },
    matters: {
      src: '/assets/nurserypath/owlet.png',
      alt: 'Owlet monitoring example.',
      caption: 'Night usability and reliability matter more than how many app tabs the system can generate.',
    },
    mistakes: {
      src: '/assets/nurserypath/nurseyatnight.png',
      alt: 'Nighttime nursery monitoring image.',
      caption: 'The wrong monitor gets exposed quickly once the room is dark and you just need the thing to work.',
    },
    choose: {
      src: '/assets/nurserypath/nanit.png',
      alt: 'Nanit monitor example.',
      caption: 'Pick the type of reassurance that genuinely helps. More features are not automatically more useful.',
    },
  },
  'baby-proofing': {
    types: {
      src: '/assets/nurserypath/dadadadresser.png',
      alt: 'Anchored dresser and nursery furniture image.',
      caption: 'Anchoring large furniture and handling obvious reach hazards are the first pass, not the final one.',
    },
    matters: {
      src: '/assets/nurserypath/nurseryplayroom.png',
      alt: 'Nursery floor-level safety image.',
      caption: 'The calm version of baby proofing starts by looking at the room from the lower, faster point of view that is coming.',
    },
    mistakes: {
      src: '/assets/nurserypath/nurseyatnight.png',
      alt: 'Nighttime nursery safety image.',
      caption: 'Waiting until mobility is already happening is usually how safety work turns into a rushed cleanup tour.',
    },
    choose: {
      src: '/assets/nurserypath/nurseryplanning.png',
      alt: 'Nursery planning image for staged baby proofing.',
      caption: 'Think in layers: anchor first, edit the hazards next, then recheck when mobility changes.',
    },
  },
};

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

function uniqueItems(items: Array<string | null | undefined>, maxItems?: number) {
  const deduped = items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  return typeof maxItems === 'number' ? deduped.slice(0, maxItems) : deduped;
}

export function buildNurseryFurnitureAcademySubmoduleModule(
  slug: NurseryFurnitureCategorySlug,
): ModuleLayoutData {
  const category = getNurseryFurnitureCategory(slug);
  const sectionImages = NURSERY_FURNITURE_CATEGORY_SECTION_IMAGES[slug];
  const currentIndex = CATEGORY_ORDER.indexOf(slug);
  const previousSlug = currentIndex > 0 ? CATEGORY_ORDER[currentIndex - 1] ?? null : null;
  const nextSlug = currentIndex >= 0 && currentIndex < CATEGORY_ORDER.length - 1 ? CATEGORY_ORDER[currentIndex + 1] ?? null : null;
  const overviewImageSrc = category.overviewImageSrc ?? category.heroImageSrc;
  const overviewImageAlt = category.overviewImageAlt ?? category.heroImageAlt;
  const overviewImageCaption = category.overviewImageCaption ?? category.whatItDoes.calloutBody;

  return {
    slug,
    pathSlug: 'nursery',
    href: getNurseryFurnitureCategoryPath(slug),
    title: category.title,
    description: category.whatItDoes.description,
    subhead: category.whatItDoes.whatThisIs,
    intro: uniqueItems(category.orientation, 4),
    imagePath: category.heroImageSrc,
    imageAlt: category.heroImageAlt,
    progress: {
      current: currentIndex + 1,
      total: CATEGORY_ORDER.length,
    },
    coreSections: [
      {
        title: 'What the product is',
        paragraphs: uniqueItems(
          [
            category.whatItDoes.whatThisIs,
            ...category.whatItDoes.intro,
            category.typesDescription,
            ...category.types.slice(0, 2),
          ],
          5,
        ),
        imageSrc: overviewImageSrc,
        imageAlt: overviewImageAlt,
        imageCaption: overviewImageCaption,
      },
      {
        title: 'What the purpose of the product is',
        paragraphs: uniqueItems(
          [category.whatItDoes.description, category.whatItDoes.whyItExists, category.whatItDoes.calloutBody],
          4,
        ),
        imageSrc: sectionImages.types.src,
        imageAlt: sectionImages.types.alt,
        imageCaption: sectionImages.types.caption,
      },
      {
        title: 'Reasons a person needs it',
        paragraphs: uniqueItems([...category.whatItDoes.supportPoints, ...category.whatActuallyMatters.slice(0, 2)], 5),
        imageSrc: sectionImages.matters.src,
        imageAlt: sectionImages.matters.alt,
        imageCaption: sectionImages.matters.caption,
      },
      {
        title: 'Reasons a person would skip it',
        paragraphs: uniqueItems([category.commonMistakesDescription, ...category.skipReasons], 5),
        imageSrc: sectionImages.mistakes.src,
        imageAlt: sectionImages.mistakes.alt,
        imageCaption: sectionImages.mistakes.caption,
      },
    ],
    decisionTitle: 'What This Means For You',
    decisionBullets: uniqueItems(
      [
        ...category.whatActuallyMatters.slice(0, 3),
        ...category.howToChoose.map((item) => item.recommendation),
      ],
      5,
    ),
    products: NURSERY_FURNITURE_CATEGORY_PRODUCTS[slug] ?? [],
    softCtaLabel: 'TMBC note',
    softCtaTitle: 'This piece should earn its space through repetition.',
    softCtaBody: [category.whatItDoes.calloutBody],
    previous: previousSlug
      ? {
          href: getNurseryFurnitureCategoryPath(previousSlug),
          title: getNurseryFurnitureCategory(previousSlug).title,
          description: `Go back one step inside Furniture That Actually Works if ${getNurseryFurnitureCategory(previousSlug).title.toLowerCase()} still needs the cleaner answer.`,
          ctaLabel: 'Previous category ->',
        }
      : {
          href: NURSERY_FURNITURE_HUB_PATH,
          title: 'Furniture That Actually Works',
          description: 'Return to the furniture hub if you want the full nursery category map again.',
          ctaLabel: 'Back to hub ->',
        },
    next: nextSlug
      ? {
          href: getNurseryFurnitureCategoryPath(nextSlug),
          title: getNurseryFurnitureCategory(nextSlug).title,
          description: `Keep the nursery flow moving into ${getNurseryFurnitureCategory(nextSlug).title.toLowerCase()} while the logic is still fresh.`,
          ctaLabel: 'Next category ->',
        }
      : {
          href: '/academy/gear',
          title: 'Gear Path',
          description: 'Continue into the Gear path once the nursery furniture layer feels calmer and more functional.',
          ctaLabel: 'Continue the Academy ->',
        },
    related: {
      href: NURSERY_FURNITURE_HUB_PATH,
      title: 'Furniture That Actually Works',
      description: 'Return to the full furniture module map before opening another nursery category.',
      ctaLabel: 'Back to hub ->',
    },
    submoduleSection: null,
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: 'Nursery', href: '/academy/nursery' },
      { label: 'Furniture That Actually Works', href: NURSERY_FURNITURE_HUB_PATH },
      { label: category.title },
    ],
  };
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
