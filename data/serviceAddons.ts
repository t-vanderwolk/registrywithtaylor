import type { AddonServiceCardData } from '@/components/services/AddonServiceCard';
import type { ServiceGroupIconName } from '@/components/services/ServiceGroupIcon';

export type ServiceAddonGroup = {
  title: string;
  description: string;
  icon: ServiceGroupIconName;
  services: AddonServiceCardData[];
};

const serviceIcons = {
  babyShower: '/assets/icons/giftbox.png',
  babyproof: '/assets/icons/babyproof.png',
  birthAnnouncement: '/assets/icons/birthannouncment.png',
  birthday: '/assets/icons/birthday.png',
  calendar: '/assets/icons/calender.png',
  carSeat: '/assets/icons/cpst.png',
  cleaningReset: '/assets/icons/cleaningreset.png',
  clipboard: '/assets/icons/buildregistry.png',
  community: '/assets/icons/family.png',
  genderReveal: '/assets/icons/genderreveal.png',
  giftBox: '/assets/icons/giftbox.png',
  grandparents: '/assets/icons/grandparent.png',
  nannyInterview: '/assets/icons/family.png',
  nurseryRoom: '/assets/icons/nursery.png',
  sibling: '/assets/icons/pets.png',
  sipSee: '/assets/icons/sipsee.png',
  stroller: '/assets/icons/gear-plan.png',
  surrogacy: '/assets/icons/surrogacy.png',
  virtual: '/assets/icons/virtual.png',
} as const;

export const serviceAddonGroups: ServiceAddonGroup[] = [
  {
    title: 'Planning & Strategy',
    description:
      'Expert guidance to help families make early registry, gear, and purchasing decisions with less second-guessing and more real-life fit.',
    icon: 'planning',
    services: [
      {
        label: 'REGISTRY SUPPORT',
        title: 'Registry Clarity',
        iconSrc: serviceIcons.clipboard,
        description:
          'Refine what truly belongs on your registry with guidance that keeps your selections practical, aligned, and easier to navigate.',
        features: [
          'Brand-informed recommendations',
          'Clear buy-now versus later prioritization',
          'Registry structure built around your real life',
        ],
      },
      {
        label: 'PLANNING',
        title: 'Intentional Gear Planning',
        iconSrc: serviceIcons.stroller,
        description:
          'Choose strollers, car seats, carriers, and everyday gear with longevity, safety, and real family routines in mind.',
        features: [
          'Stroller and car seat strategy',
          'Real-world usage planning',
          'Streamlined daily systems',
        ],
      },
      {
        label: 'PLANNING',
        title: 'Intentional Purchasing Timeline',
        iconSrc: serviceIcons.calendar,
        description:
          'A personalized buying roadmap for purchasing the right baby gear at the right time while maximizing rewards, discounts, and seasonal savings.',
        features: [
          'Gear and nursery purchase timeline',
          'Rewards and loyalty optimization',
          'Completion discounts and welcome gifts',
          'Price matching, sales, and brand promotions',
          'Open-box, floor model, shipping, and price-drop guidance',
        ],
      },
      {
        label: 'FAMILY PREPARATION',
        title: 'Grandparents Planning Session',
        iconSrc: serviceIcons.grandparents,
        description:
          'Practical support for grandparents and extended family who want to feel prepared, aligned, and useful from day one.',
        features: [
          'Family alignment guidance',
          'Gift planning and registry support',
          'Practical preparation plan',
        ],
      },
      {
        label: 'FAMILY PREPARATION',
        title: 'Surrogacy & Adoption Planning Support',
        iconSrc: serviceIcons.surrogacy,
        description:
          'Tailored support for families growing through surrogacy or adoption, with planning shaped around your timeline and transition home.',
        features: [
          'Timeline and travel coordination',
          'Registry strategy alignment',
          'Newborn setup planning',
        ],
      },
    ],
  },
  {
    title: 'Home & Safety Preparation',
    description:
      'Practical support for shaping a home that feels functional, safer, and ready for everyday life once baby arrives.',
    icon: 'homeSafety',
    services: [
      {
        label: 'HOME PREPARATION',
        title: 'Home & Nursery Preparation',
        iconSrc: serviceIcons.nurseryRoom,
        description:
          'Shape a home and nursery setup that feels functional, organized, and genuinely ready for daily life with baby.',
        features: [
          'Layout and furniture planning',
          'Safety-focused recommendations',
          'Sourcing and implementation guidance',
        ],
      },
      {
        label: 'HOME PREPARATION',
        title: 'Gear Cleaning & Reset Strategy',
        iconSrc: serviceIcons.cleaningReset,
        description:
          'Prepare existing gear for safe reuse with simple guidance on what to clean, what to refresh, and what to let go.',
        features: [
          'Sanitizing best practices',
          'Reuse readiness checklist',
          'Donation and resale prep',
        ],
      },
      {
        label: 'SAFETY & INSTALLATION',
        title: 'CPST Car Seat Installation & Safety Checks',
        iconSrc: serviceIcons.carSeat,
        description:
          'Car seat support with Lani Car Seat Consulting, including in-person installation in Phoenix and virtual safety checks nationwide.',
        features: [
          'Installation and hands-on harness education',
          'Virtual safety checks and fit review',
          'Ongoing guidance as your child grows',
        ],
      },
      {
        label: 'SAFETY & INSTALLATION',
        title: 'In-Home Baby & Toddler Proofing Installation',
        iconSrc: serviceIcons.babyproof,
        description:
          'In-home safety assessment and childproofing installation with Arizona Childproofers before little ones begin rolling, crawling, climbing, and exploring.',
        features: [
          'In-home childproofing assessment',
          'Installation of gates, locks, and safety devices',
          'Pool barrier and hazard guidance',
          'Safety recommendations as your child grows',
        ],
      },
      {
        label: 'FAMILY PREPARATION',
        title: 'Sibling & Pet Preparation',
        iconSrc: serviceIcons.sibling,
        description:
          'Create a practical transition plan for siblings and pets so everyone feels safer and more settled before baby arrives.',
        features: [
          'Introduction game plan',
          'Safety and routine guidance',
          'Adjustment support strategy',
        ],
      },
    ],
  },
  {
    title: 'Family & Caregiver Support',
    description:
      'Practical support for the people, routines, and conversations that surround your growing family beyond the nursery itself.',
    icon: 'familySupport',
    services: [
      {
        label: 'FAMILY PREPARATION',
        title: 'Nanny Interview Preparation & Guidance',
        iconSrc: serviceIcons.nannyInterview,
        description:
          'Structured support to help you interview caregivers with a better sense of day-to-day fit and what will actually work for your family.',
        features: [
          'Customized interview question framework',
          'Compatibility and experience evaluation guidance',
          'Post-interview decision support',
        ],
      },
      {
        label: 'COMMUNITY',
        title: 'Virtual Parent Community Sessions',
        iconSrc: serviceIcons.virtual,
        description:
          'Live monthly virtual sessions for families everywhere to ask questions, learn together, and connect in a supportive setting.',
        features: [
          'Live monthly sessions with Taylor',
          'Open Q&A on baby gear, registry planning, and prep',
          'Guest speakers and expert spotlights',
          'Interactive discussions and community activities',
        ],
      },
      {
        label: 'COMMUNITY',
        title: 'Phoenix Parent Circles',
        iconSrc: serviceIcons.community,
        description:
          'In-person Phoenix gatherings for expecting and new parents to ask questions, share experiences, and meet others preparing for baby.',
        features: [
          'Monthly gatherings in Phoenix',
          'Conversations on baby gear, registries, and prep',
          'Guest experts and community topics',
          'Connection with parents in the same season',
        ],
      },
    ],
  },
  {
    title: 'Optional Celebration Support',
    description:
      'For families who want light help coordinating a shower, reveal, or small post-baby gathering without making celebration support the center of the work.',
    icon: 'celebrations',
    services: [
      {
        label: 'OPTIONAL CELEBRATION SUPPORT',
        title: 'Shower Registry Support',
        iconSrc: serviceIcons.babyShower,
        description:
          'Refine your registry before invitations go out so gifting feels clear, organized, and useful.',
        features: [
          'Registry audit and refinement',
          'Priority item sequencing',
          'Gift flow timing strategy',
        ],
      },
      {
        label: 'OPTIONAL CELEBRATION SUPPORT',
        title: 'Gender Reveal Support',
        iconSrc: serviceIcons.genderReveal,
        description:
          'Light planning support for families who want a simple reveal moment without turning it into a full event-production project.',
        features: [
          'Reveal concept planning',
          'Timeline and hosting guidance',
          'Day-of setup support',
        ],
      },
      {
        label: 'OPTIONAL CELEBRATION SUPPORT',
        title: 'Post-Baby Gathering Support',
        iconSrc: serviceIcons.sipSee,
        description:
          'Prepare for a small post-arrival gathering with support that keeps timing, updates, and guest flow manageable.',
        features: [
          'Gathering timeline planning',
          'Registry update guidance',
          'Simple hosting strategy',
        ],
      },
      {
        label: 'REGISTRY SUPPORT',
        title: 'Welcome Box Registration Setup',
        iconSrc: serviceIcons.giftBox,
        description:
          'Set up retailer welcome boxes, perks, and completion discounts with a clear plan for what to join and when.',
        features: [
          'Retailer perk mapping',
          'Completion discount tracking',
          'Enrollment setup support',
        ],
      },
      {
        label: 'OPTIONAL CELEBRATION SUPPORT',
        title: 'Birth Announcements',
        iconSrc: serviceIcons.birthAnnouncement,
        description:
          'Light support for announcement timing, wording, and rollout when you want the details to feel simple and polished.',
        features: [
          'Timing and rollout guidance',
          'Wording and format support',
          'Simple next-step planning',
        ],
      },
      {
        label: 'OPTIONAL CELEBRATION SUPPORT',
        title: 'Birthday Parties',
        iconSrc: serviceIcons.birthday,
        description:
          'Thoughtful planning help for first birthdays and early milestone parties without turning them into a full production.',
        features: [
          'Party scope and timing guidance',
          'Simple hosting plan',
          'Milestone celebration checklist',
        ],
      },
    ],
  },
];
