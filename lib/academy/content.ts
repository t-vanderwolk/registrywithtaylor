import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { cache } from 'react';
import {
  getGearAcademyModule,
  isGearAcademyModuleSlug,
  GEAR_ACADEMY_MODULES,
  type GearAcademyModuleSlug,
} from '@/lib/academy/gearModules';
import {
  getRegistryAcademyModule,
  isRegistryAcademyModuleSlug,
  REGISTRY_ACADEMY_MODULES,
  REGISTRY_PATH_IMAGES,
  type RegistryAcademyModuleSlug,
} from '@/lib/academy/registryModules';
import {
  getNurseryAcademyModule,
  isNurseryAcademyModuleSlug,
  NURSERY_ACADEMY_MODULES,
  type NurseryAcademyModuleSlug,
} from '@/lib/academy/nurseryModules';
import {
  getPostpartumAcademyModule,
  isPostpartumAcademyModuleSlug,
  POSTPARTUM_ACADEMY_MODULES,
  type PostpartumAcademyModuleSlug,
} from '@/lib/academy/postpartumModules';
import { getDailyUseGearAcademySubmoduleCards } from '@/lib/academy/dailyUseGearAcademy';
import { getRegistryWelcomeBoxesAcademySubmoduleCards } from '@/lib/academy/registryWelcomeBoxesAcademy';
import { getNurseryFurnitureSubmoduleCards } from '@/lib/academy/nurseryFurnitureAcademy';
import { getCarSeatFoundationsAcademySubmoduleCards } from '@/lib/academy/carSeatFoundationsAcademy';
import { resolveAcademyProductExamples } from '@/lib/academy/productExampleResolver';
import { getStrollerFoundationsAcademySubmoduleCards } from '@/lib/academy/strollerFoundationsAcademy';
import { STROLLER_PRODUCT_GROUPS } from '@/lib/data/products/strollers';
import { stripMarkdown } from '@/lib/blog/contentText';
import {
  buildGuideOutline,
  splitGuideSectionContent,
  stripLeadingGuideHeading,
  type GuideSection,
  type GuideSectionSubsection,
} from '@/lib/guides/articleOutline';
import { extractMarkdownListItems } from '@/lib/guides/guideFlow';
import { hasResolvedGuideAffiliateUrl } from '@/lib/guides/resolveGuideAffiliateUrl';
import { CAR_SEAT_PRODUCT_GROUPS } from '@/lib/guides/carSeatProductCatalog';
import type { GuideProductExampleData } from '@/lib/guides/productExamples';

export type AcademyPathSlug = 'registry' | 'nursery' | 'gear' | 'postpartum';

export type AcademyModuleSlug =
  | GearAcademyModuleSlug
  | RegistryAcademyModuleSlug
  | NurseryAcademyModuleSlug
  | PostpartumAcademyModuleSlug
  | 'car-seat-basics';

export type AcademyBreadcrumbItem = {
  label: string;
  href?: string;
};

export type AcademyCoreSection = {
  title: string;
  paragraphs: string[];
  imageSrc: string;
  imageAlt: string;
  imageCaption?: string;
};

export type AcademyProductExample = {
  name: string;
  brand: string;
  description: string;
  pros: string[];
  affiliateUrl: string | null;
  category: string;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

export type AcademyModuleCard = {
  slug: AcademyModuleSlug;
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export type AcademySubmoduleCard = {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
  eyebrow?: string;
};

export type AcademySubmoduleSection = {
  title: string;
  description: string;
  cards: AcademySubmoduleCard[];
};

export type AcademyRelatedLink = {
  href: string;
  title: string;
  description: string;
  ctaLabel: string;
};

export type AcademyPathData = {
  slug: AcademyPathSlug;
  href: string;
  title: string;
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  intro: string[];
  overallSummary: string[];
  learningHighlights: string[];
  moduleSectionDescription: string;
  imagePath: string;
  imageAlt: string;
  moduleCards: AcademyModuleCard[];
  breadcrumb: AcademyBreadcrumbItem[];
};

export type AcademyModuleData = {
  slug: AcademyModuleSlug;
  pathSlug: AcademyPathSlug;
  moduleType?: 'bridge' | 'standard';
  enableDecisionRouting?: boolean;
  href: string;
  title: string;
  description: string;
  subhead: string;
  intro: string[];
  imagePath: string;
  imageAlt: string;
  progress: {
    current: number;
    total: number;
  };
  coreSections: AcademyCoreSection[];
  decisionTitle: string;
  decisionBullets: string[];
  products: AcademyProductExample[];
  softCtaLabel: string;
  softCtaTitle: string;
  softCtaBody: string[];
  previous: AcademyRelatedLink | null;
  next: AcademyRelatedLink | null;
  related: AcademyRelatedLink | null;
  editorialLinks: AcademyRelatedLink[];
  submoduleSection: AcademySubmoduleSection | null;
  breadcrumb: AcademyBreadcrumbItem[];
  trackingGuideId?: string | null;
};

export type AcademyHomePathCard = {
  slug: AcademyPathSlug;
  href: string;
  title: string;
  description: string;
  eyebrow: string;
  imagePath: string;
  imageAlt: string;
};

export type AcademyHomeData = {
  title: string;
  description: string;
  explanationTitle: string;
  explanationBody: string;
  paths: AcademyHomePathCard[];
};

type AcademyPathDefinition = {
  title: string;
  shortDescription: string;
  heroTitle: string;
  heroDescription: string;
  intro: string[];
  overallSummary: string[];
  learningHighlights: string[];
  moduleSectionDescription: string;
  imagePath: string;
  imageAlt: string;
};

type AcademyModuleDefinition = {
  pathSlug: AcademyPathSlug;
  moduleType?: 'bridge' | 'standard';
  enableDecisionRouting?: boolean;
  title: string;
  description: string;
  subhead: string;
  imagePath: string;
  imageAlt: string;
  relatedSlug: AcademyModuleSlug | null;
};

type AcademyModuleContent = {
  intro: string[];
  coreSections: AcademyCoreSection[];
  decisionBullets: string[];
  products: AcademyProductExample[];
  softCtaLabel?: string;
  softCtaTitle?: string;
  softCtaBody?: string[];
};

const GUIDE_FILES = {
  stroller: 'taylor-made-stroller-guide.md',
  compact: 'taylor-made-compact-lightweight-stroller-guide.md',
  travelStroller: 'taylor-made-travel-stroller-guide.md',
  travel: 'taylor-made-travel-with-baby-guide.md',
  changing: 'taylor-made-changing-station-guide.md',
  storage: 'taylor-made-nursery-storage-guide.md',
  furniture: 'taylor-made-nursery-furniture-guide.md',
  carSeat: 'taylor-made-car-seat-guide.md',
  infantCarSeat: 'taylor-made-infant-car-seat-guide.md',
  convertibleCarSeat: 'taylor-made-convertible-car-seat-guide.md',
  allInOneCarSeat: 'taylor-made-all-in-one-car-seat-guide.md',
} as const;

const ACADEMY_PATH_ORDER: AcademyPathSlug[] = ['registry', 'nursery', 'gear', 'postpartum'];

const ACADEMY_PATH_MODULES: Record<AcademyPathSlug, AcademyModuleSlug[]> = {
  registry: REGISTRY_ACADEMY_MODULES.map((module) => module.slug),
  nursery: NURSERY_ACADEMY_MODULES.map((module) => module.slug),
  gear: GEAR_ACADEMY_MODULES.map((module) => module.slug),
  postpartum: POSTPARTUM_ACADEMY_MODULES.map((module) => module.slug),
};

const ACADEMY_PATH_DEFINITIONS: Record<AcademyPathSlug, AcademyPathDefinition> = {
  registry: {
    title: 'Registry',
    shortDescription: 'Build it step by step',
    heroTitle: 'Registry Path',
    heroDescription:
      'Build your registry in the right order, from first-pass essentials through platforms, support, perks, timing, cleanup, and gifting.',
    intro: [
      'This path is where registry planning gets more strategic and much less random.',
      'You will start with what belongs on the list first, then decide where to register, where to get actual shopping support, how to use the perks, when to buy, and how to keep the list from turning into a polite overbuying contest.',
    ],
    overallSummary: [
      'This path turns the registry into a system instead of one giant list. You are not just choosing products here. You are choosing where the list lives, where real support can come from, how it earns value back, and when it actually makes sense to buy.',
      'By the end, your registry should feel more edited, easier for guests to use, and much less likely to leave you with duplicates, clutter, or late-stage regret.',
    ],
    learningHighlights: [
      'How to choose between a universal registry, one main retailer, or a combined setup.',
      'How to use local stores, virtual help, and hybrid support to make the biggest registry decisions with more clarity.',
      'How welcome boxes, perks, and samples can become useful product testing instead of random extras.',
      'How to time rewards, loyalty programs, and completion discounts so savings actually stack.',
      'How to phase purchases so you buy what matters first and let the rest wait for real need.',
      'How to catch the registry mistakes that quietly create duplicate spending, clutter, and guest confusion.',
      'How to guide showers and gifting without making the registry harder for guests to shop.',
    ],
    moduleSectionDescription:
      'Each module builds the registry from first-pass structure into setup, support, perks, timing, cleanup, and gifting so the list gets smarter instead of longer.',
    imagePath: '/assets/editorial/registry.jpg',
    imageAlt: 'Registry planning editorial image for TMBC Baby Academy.',
  },
  nursery: {
    title: 'Nursery',
    shortDescription: 'Start with your space',
    heroTitle: 'Nursery Path',
    heroDescription:
      'Build the room around sleep, storage, and the route you will actually repeat when everyone is tired.',
    intro: [
      'Nursery planning works better when it starts as a working system, not a decorating sprint.',
      'This path moves from the big-picture vision into room flow and then into the smaller station decisions that make the room easier to live in.',
    ],
    overallSummary: [
      'This path helps you build the room around real life, not just the reveal photo. We start with the space you have, the routines you are about to repeat, and the decisions that matter most when everyone is tired.',
      'By the end, the nursery should feel less like a shopping project and more like a setup that supports sleep, storage, movement, and calmer resets.',
    ],
    learningHighlights: [
      'How to start with your lifestyle, room constraints, and real nursery priorities before buying furniture.',
      'How to think through sleep space decisions with your home setup and comfort level in mind.',
      'How to choose furniture that earns its footprint instead of filling the room for the sake of completion.',
      'How to organize the room around flow, changing routines, and the routes you will repeat most.',
      'How to bring the nursery together with calmer storage, atmosphere, and safety choices.',
    ],
    moduleSectionDescription:
      'Each module moves from the big room decisions into the smaller routines and systems that make the nursery actually usable.',
    imagePath: '/assets/editorial/nursery.jpg',
    imageAlt: 'Calm nursery editorial image for TMBC Baby Academy.',
  },
  gear: {
    title: 'Gear',
    shortDescription: 'Understand before you choose',
    heroTitle: 'Gear Path',
    heroDescription:
      'Understand before you choose, with a calmer path through the gear decisions that shape daily life most.',
    intro: [
      'Most gear overwhelm starts when parents compare products before they understand the category or the job that gear needs to do.',
      'This path keeps the order calmer: first how to think, then stroller foundations, car seats, travel systems, travel logistics, the gear that truly earns daily use, and the feeding systems that need to work in real life.',
    ],
    overallSummary: [
      'This path is about understanding before choosing. Instead of jumping straight into brands and features, you will start with fit, then work through the categories that shape daily life most.',
      'By the end, the gear conversation should feel smaller, clearer, and much easier to shortlist without buying for a life you are not actually living.',
    ],
    learningHighlights: [
      'How to think about baby gear through the lens of routine, space, car setup, and real fit.',
      'How stroller categories differ, and how the compact-versus-full-size decision helps simplify the shortlist.',
      'How to make the infant-versus-convertible car seat decision with your vehicle and daily use in mind.',
      'How travel systems, adapters, and compatibility actually work in the early months.',
      'How leaving the house changes what portability, cleanup, and transitions really matter.',
      'How to focus on the daily-use gear that truly earns a place in your routine.',
      'How feeding setups, pumps, bottles, and cleanup work as connected systems instead of isolated products.',
    ],
    moduleSectionDescription:
      'Each module narrows the gear conversation so you can understand the category first, then compare products later with much less noise and much better timing.',
    imagePath: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial baby gear image for TMBC Baby Academy.',
  },
  postpartum: {
    title: 'Postpartum',
    shortDescription: 'Move through it with support',
    heroTitle: 'Postpartum Path',
    heroDescription:
      'Move through recovery, home rhythm, feeding, rest, emotional change, and support with a calmer system for the adult side of early parenthood.',
    intro: [
      'Postpartum is often the least-prepared-for part of baby prep, which is a fairly brutal design flaw in the whole process.',
      'This path gives recovery, home rhythm, feeding, rest, emotional wellness, and support their own real sequence so the household can prepare for the adult side of early parenthood too.',
    ],
    overallSummary: [
      'This path brings the adult side of early parenthood back into the plan. Postpartum works better when it is treated like a chapter you move through with support, not a vague stretch you are supposed to absorb while caring for a newborn.',
      'By the end, you should have a steadier picture of healing, feeding, rest, emotional adjustment, and the support system that helps the first stretch feel more workable and much less lonely.',
    ],
    learningHighlights: [
      'What physical recovery actually looks like, what supports healing, and how to build a more realistic recovery rhythm.',
      'How the first weeks at home actually move through the house, and what support keeps that rhythm more workable.',
      'How to think about breastfeeding, bottle feeding, and combination feeding with more flexibility and less guilt.',
      'How to set more realistic sleep expectations, share responsibilities, and protect rest without waiting for perfect schedules.',
      'How emotional shifts and identity changes show up in postpartum, and what helps them feel less isolating.',
      'How to build a usable support system, ask for help more clearly, and stop treating support like a bonus instead of a need.',
    ],
    moduleSectionDescription:
      'Each module helps turn the adult side of early parenthood into something more structured, more supportive, and much less dependent on winging it.',
    imagePath: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Postpartum and early parenthood editorial image for TMBC Baby Academy.',
  },
};

const ACADEMY_MODULE_DEFINITIONS: Record<AcademyModuleSlug, AcademyModuleDefinition> = {
  'what-to-register-first': {
    pathSlug: 'registry',
    title: 'What to Register First',
    description:
      'Build the first-pass registry around the jobs that need to work immediately, then let the maybes wait until real life gives you better information.',
    subhead: 'Start with the jobs the house needs to do.',
    imagePath: REGISTRY_PATH_IMAGES.registryPlanning,
    imageAlt: 'Registry planning image for the What to Register First academy module.',
    relatedSlug: 'how-to-think-about-baby-gear',
  },
  'where-to-register': {
    pathSlug: 'registry',
    title: 'Where to Register',
    description: 'Choose the registry setup that fits your perks, your guests, and how much flexibility you actually want.',
    subhead: 'Choosing the right platform matters more than most people realize.',
    imagePath: REGISTRY_PATH_IMAGES.whereToRegister,
    imageAlt: 'Registry planning image for the Where to Register academy module.',
    relatedSlug: null,
  },
  'shop-local-get-support': {
    pathSlug: 'registry',
    title: 'Shop Local & Get Support',
    description:
      'Use local stores, hybrid shopping, and real expert guidance so registry decisions feel calmer, faster, and much less isolating.',
    subhead: 'Shop locally, think strategically, and stop trying to figure this out alone.',
    imagePath: REGISTRY_PATH_IMAGES.shopLocal,
    imageAlt: 'Registry support and guided shopping image for the Shop Local & Get Support academy module.',
    relatedSlug: null,
  },
  'welcome-boxes-perks': {
    pathSlug: 'registry',
    title: 'Welcome Boxes & Registry Perks',
    description: 'Use welcome boxes on purpose so they become product testing and early value, not random freebies you forget about.',
    subhead: "The hidden benefits most parents don't fully use.",
    imagePath: REGISTRY_PATH_IMAGES.welcomeBox,
    imageAlt: 'Welcome boxes and registry perks image for the Welcome Boxes & Registry Perks academy module.',
    relatedSlug: null,
  },
  'rewards-completion-discounts': {
    pathSlug: 'registry',
    title: 'Loyalty, Rewards & Completion Discounts',
    description: 'Use discounts, rewards, and timing together so you can save well without filling the house too early.',
    subhead: 'How to save without overbuying.',
    imagePath: REGISTRY_PATH_IMAGES.rewards,
    imageAlt: 'Registry savings and planning image for the Loyalty, Rewards & Completion Discounts academy module.',
    relatedSlug: null,
  },
  'smart-purchasing-timeline': {
    pathSlug: 'registry',
    title: 'Smart Purchasing Timeline',
    description: 'Buy in phases so the essentials get covered, the maybes stay flexible, and the discount windows still do their job.',
    subhead: 'When to buy matters just as much as what you buy.',
    imagePath: REGISTRY_PATH_IMAGES.purchasingTimeline,
    imageAlt: 'Registry purchasing timeline image for the Smart Purchasing Timeline academy module.',
    relatedSlug: null,
  },
  'mistakes-to-avoid': {
    pathSlug: 'registry',
    title: 'Registry Mistakes to Avoid',
    description:
      'Catch the common decisions that make a registry longer, noisier, and less useful before the list turns into a very polite clutter plan.',
    subhead: 'This is the edit pass most registries need.',
    imagePath: REGISTRY_PATH_IMAGES.overwhelm,
    imageAlt: 'Registry mistakes image for the Registry Mistakes to Avoid academy module.',
    relatedSlug: 'daily-use-gear',
  },
  'baby-showers-gifting': {
    pathSlug: 'registry',
    title: 'Baby Showers & Gifting Strategy',
    description: 'Guide gifting clearly so guests can shop confidently, duplicates stay down, and the registry still feels easy to use.',
    subhead: 'How to guide what you receive without overcomplicating it.',
    imagePath: REGISTRY_PATH_IMAGES.babyShower,
    imageAlt: 'Baby shower and gifting image for the Baby Showers & Gifting Strategy academy module.',
    relatedSlug: 'stroller-foundations',
  },
  'vision-and-lifestyle': {
    pathSlug: 'nursery',
    title: 'Vision & Lifestyle Foundations',
    description: 'Start with your space and your real rhythm before the nursery turns into a shopping list.',
    subhead: 'Start with your space - not your shopping list.',
    imagePath: '/assets/nurserypath/vision.png',
    imageAlt: 'Nursery vision image for the Vision & Lifestyle Foundations academy module.',
    relatedSlug: 'where-to-register',
  },
  'sleep-space-decisions': {
    pathSlug: 'nursery',
    title: 'Sleep Space Decisions',
    description: 'Decide where your baby will actually sleep based on your space, your nights, and your comfort level.',
    subhead: 'Where your baby sleeps - and why it matters more than you think.',
    imagePath: '/assets/nurserypath/cribandclouds.png',
    imageAlt: 'Crib and clouds image for the Sleep Space Decisions module.',
    relatedSlug: 'where-to-register',
  },
  'furniture-that-actually-works': {
    pathSlug: 'nursery',
    title: 'Furniture That Actually Works',
    description: 'Choose the pieces that support your routine instead of filling the room for the sake of completion.',
    subhead: 'What you need - and what you do not.',
    imagePath: '/assets/nurserypath/nurseryprep.png',
    imageAlt: 'Nursery prep image for the Furniture That Actually Works module.',
    relatedSlug: 'where-to-register',
  },
  'layout-and-flow': {
    pathSlug: 'nursery',
    title: 'Layout & Flow',
    description: 'Design the room around movement, access, and nighttime usability before styling details take over.',
    subhead: 'How your nursery actually works in real life.',
    imagePath: '/assets/nurserypath/space.png',
    imageAlt: 'Nursery layout image for the Layout & Flow module.',
    relatedSlug: 'healing-and-recovery',
  },
  'storage-and-organization': {
    pathSlug: 'nursery',
    title: 'Storage & Organization',
    description: 'Build an organization system that is easy to maintain before the room starts collecting quiet chaos.',
    subhead: 'How to reduce chaos before it starts.',
    imagePath: '/assets/nurserypath/duplicate.png',
    imageAlt: 'Nursery organization image for the Storage & Organization module.',
    relatedSlug: 'feeding-and-lactation',
  },
  'atmosphere-and-safety': {
    pathSlug: 'nursery',
    title: 'Atmosphere & Safety',
    description: 'Bring the room together around calm, safety, and the kind of simplicity that still works at 2:14 AM.',
    subhead: 'How your nursery feels - and functions.',
    imagePath: '/assets/nurserypath/serenenursery.png',
    imageAlt: 'Calm nursery atmosphere image for the Atmosphere & Safety module.',
    relatedSlug: 'stroller-foundations',
  },
  'how-to-think-about-baby-gear': {
    pathSlug: 'gear',
    title: 'How to Think About Baby Gear',
    description: 'Understand how to choose baby gear based on your life, your routine, and real fit before the features start talking too loudly.',
    subhead: 'Before you choose anything, understand how to choose.',
    imagePath: '/assets/gearpath/carrierergobaby.png',
    imageAlt: 'Baby carrier image for the How to Think About Baby Gear academy module.',
    relatedSlug: 'where-to-register',
  },
  'stroller-foundations': {
    pathSlug: 'gear',
    title: 'Stroller Foundations',
    description:
      'Choose the stroller setup that fits your routine, your environment, and your storage reality, then use the compact-versus-full-size call to shrink the shortlist.',
    subhead: 'Not all strollers are built for the same life.',
    imagePath: '/assets/gearpath/cogulo.png',
    imageAlt: 'Colugo stroller image for the Stroller Foundations academy module.',
    relatedSlug: null,
  },
  'car-seat-foundations': {
    pathSlug: 'gear',
    title: 'Car Seat Foundations',
    description: 'Use the car seat categories, your vehicle, and your routine to choose the safer everyday fit with less confusion.',
    subhead: 'Safety is the baseline. Fit is what matters next.',
    imagePath: '/assets/car-seats/piparx.png',
    imageAlt: 'Car seat image for the Car Seat Foundations academy module.',
    relatedSlug: null,
  },
  'travel-systems': {
    pathSlug: 'gear',
    title: 'Travel Systems',
    description: 'Understand how stroller and car seat compatibility works so the setup stays practical instead of more complicated than it needs to be.',
    subhead: 'How your stroller and car seat actually work together.',
    imagePath: '/assets/strollers/mixxnext.png',
    imageAlt: 'Travel system image for the Travel Systems academy module.',
    relatedSlug: null,
  },
  'travel-with-baby': {
    pathSlug: 'gear',
    title: 'Travel With Baby',
    description:
      'Plan for errands, road trips, flights, and everyday outings by focusing on portability, transitions, and what leaving the house actually asks your setup to do.',
    subhead: 'Leaving the house is its own gear category.',
    imagePath: '/assets/gearpath/cogulo.png',
    imageAlt: 'Travel stroller image for the Travel With Baby academy module.',
    relatedSlug: null,
  },
  'daily-use-gear': {
    pathSlug: 'gear',
    title: 'Daily Use Gear',
    description: "The products you'll use every single day - and feel immediately if they're wrong.",
    subhead: 'The products that shape the routine fast.',
    imagePath: '/assets/gearpath/momcozypurehug.png',
    imageAlt: 'Daily-use baby carrier image for the Daily Use Gear academy module.',
    relatedSlug: 'where-to-register',
  },
  'feeding-setup-flow': {
    pathSlug: 'gear',
    moduleType: 'bridge',
    enableDecisionRouting: true,
    title: 'Feeding Setup & Flow',
    description:
      'Understand the main feeding pathways, what tools each one may require, what to buy now versus later, and how to build a feeding setup that supports real life without overbuying.',
    subhead: 'You are not choosing isolated products. You are building the system that has to work in real life.',
    imagePath: '/assets/editorial/feeding.png',
    imageAlt: 'Editorial feeding setup image for the Feeding Setup & Flow academy module.',
    relatedSlug: 'feeding-and-lactation',
  },
  'breast-pump': {
    pathSlug: 'gear',
    title: 'Breast Pump',
    description:
      'Decide if and when a pump belongs in your setup, which type matches your likely routine, and which accessories are practical instead of aspirational.',
    subhead: 'A pump is a tool, not a personality.',
    imagePath: '/assets/gearpath/lifestylepump.png',
    imageAlt: 'Breast pump lifestyle image for the Breast Pump academy module.',
    relatedSlug: 'feeding-and-lactation',
  },
  'bottles-and-baby-utensils': {
    pathSlug: 'gear',
    title: 'Bottles & Baby Utensils',
    description:
      'Build a calm bottle starting point, understand nipple flow and cleanup, and avoid buying a whole feeding drawer before your baby has an opinion.',
    subhead: 'Bottles become a system faster than most parents expect.',
    imagePath: '/assets/editorial/bottle-booties.png',
    imageAlt: 'Bottles and baby utensils image for the Bottles & Baby Utensils academy module.',
    relatedSlug: 'feeding-and-lactation',
  },
  'car-seat-basics': {
    pathSlug: 'gear',
    title: 'Car Seat Foundations',
    description: 'Use the car seat categories, your vehicle, and your routine to choose the safer everyday fit with less confusion.',
    subhead: 'Safety is the baseline. Fit is what matters next.',
    imagePath: '/assets/editorial/gear.jpg',
    imageAlt: 'Editorial car seat planning image for the Car Seat Foundations academy module.',
    relatedSlug: null,
  },
  'healing-and-recovery': {
    pathSlug: 'postpartum',
    title: 'Healing & Recovery',
    description:
      'Understand what physical recovery actually looks like, what supports healing, and how to move through the first stretch without pressure to bounce back.',
    subhead: 'What no one fully prepares you for.',
    imagePath: '/assets/editorial/teddy-glow.png',
    imageAlt: 'Soft postpartum recovery image for the Healing & Recovery academy module.',
    relatedSlug: 'layout-and-flow',
  },
  'first-weeks-home-rhythm': {
    pathSlug: 'postpartum',
    title: 'First-Weeks Home Rhythm',
    description:
      'Plan how recovery, feeding, rest, visitors, meals, and household logistics actually move through the house so the first stretch feels more workable and less improvised.',
    subhead: 'The house needs a rhythm before it needs perfection.',
    imagePath: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'First-weeks home rhythm image for the First-Weeks Home Rhythm academy module.',
    relatedSlug: 'feeding-setup-flow',
  },
  'feeding-and-lactation': {
    pathSlug: 'postpartum',
    title: 'Feeding & Lactation',
    description:
      'Understand breastfeeding, bottle feeding, and combination feeding with more flexibility, less guilt, and a calmer view of what support actually helps.',
    subhead: 'Without pressure or perfection.',
    imagePath: '/assets/editorial/feeding.png',
    imageAlt: 'Feeding editorial image for the Feeding & Lactation academy module.',
    relatedSlug: 'storage-and-organization',
  },
  'rest-and-sleep': {
    pathSlug: 'postpartum',
    title: 'Rest & Sleep',
    description:
      'Build more realistic expectations, shared responsibility, and a steadier rest rhythm so sleep deprivation feels less personal and more manageable.',
    subhead: 'How to survive it without losing yourself.',
    imagePath: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Rest and sleep image for the Rest & Sleep academy module.',
    relatedSlug: 'sleep-space-decisions',
  },
  'emotional-wellness-and-identity': {
    pathSlug: 'postpartum',
    title: 'Emotional Wellness & Identity',
    description:
      'Understand emotional shifts, identity changes, and the support conversations that make postpartum feel more human and less isolating.',
    subhead: 'The part no one talks about enough.',
    imagePath: '/assets/editorial/notebook-bunny.png',
    imageAlt: 'Emotional wellness image for the Emotional Wellness & Identity academy module.',
    relatedSlug: 'atmosphere-and-safety',
  },
  'support-systems': {
    pathSlug: 'postpartum',
    title: 'Support Systems',
    description:
      'Build the support system around you with more intention, clearer asks, and less guilt so the first stretch does not depend on you carrying everything alone.',
    subhead: 'You were never meant to do this alone.',
    imagePath: '/assets/editorial/growing-with-confidence.jpg',
    imageAlt: 'Support systems image for the Support Systems academy module.',
    relatedSlug: 'shop-local-get-support',
  },
};

function normalizeTitle(value: string) {
  return stripMarkdown(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function uniqueItems(items: Array<string | null | undefined>, maxItems?: number) {
  const deduped = items
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .filter((item, index, collection) => collection.indexOf(item) === index);

  return typeof maxItems === 'number' ? deduped.slice(0, maxItems) : deduped;
}

function isParagraphBlock(block: string) {
  const trimmed = block.trim();

  return (
    Boolean(trimmed) &&
    !trimmed.startsWith('#') &&
    !trimmed.startsWith(':::') &&
    !trimmed.startsWith('![') &&
    !trimmed.startsWith('>') &&
    !trimmed.startsWith('::cta-slot') &&
    !/^[-*]\s+/.test(trimmed) &&
    !/^\d+\.\s+/.test(trimmed)
  );
}

function extractParagraphs(content: string, maxParagraphs = 4) {
  return stripLeadingGuideHeading(content)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(isParagraphBlock)
    .map((block) => stripMarkdown(block))
    .filter(Boolean)
    .slice(0, maxParagraphs);
}

function buildCoreSection({
  title,
  paragraphs,
  imageSrc,
  imageAlt,
  imageCaption,
}: AcademyCoreSection) {
  return {
    title,
    paragraphs,
    imageSrc,
    imageAlt,
    imageCaption,
  } satisfies AcademyCoreSection;
}

const readGuideFile = cache(async (fileName: string) => {
  const absolutePath = path.join(process.cwd(), 'content', 'guides', fileName);
  return fs.readFile(absolutePath, 'utf8');
});

const getGuideDocument = cache(async (fileName: string) => {
  const content = await readGuideFile(fileName);
  const outline = buildGuideOutline(content);

  return {
    content,
    outline,
  };
});

function findSectionByTitle(sections: GuideSection[], title: string) {
  const target = normalizeTitle(title);

  return (
    sections.find((section) => {
      const candidate = normalizeTitle(section.title);
      return candidate === target || candidate.includes(target) || target.includes(candidate);
    }) ?? null
  );
}

function findSubsectionByTitle(subsections: GuideSectionSubsection[], title: string) {
  const target = normalizeTitle(title);

  return (
    subsections.find((subsection) => {
      const candidate = normalizeTitle(subsection.title);
      return candidate === target || candidate.includes(target) || target.includes(candidate);
    }) ?? null
  );
}

async function getPrefaceParagraphs(fileName: string, maxParagraphs = 2) {
  const document = await getGuideDocument(fileName);
  return extractParagraphs(document.outline.preface, maxParagraphs);
}

async function getSectionParagraphs(fileName: string, sectionTitle: string, maxParagraphs = 2) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  return section ? extractParagraphs(section.content, maxParagraphs) : [];
}

async function getSubsectionParagraphs(
  fileName: string,
  sectionTitle: string,
  subsectionTitle: string,
  maxParagraphs = 2,
) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  if (!section) {
    return [];
  }

  const subsection = findSubsectionByTitle(splitGuideSectionContent(section.content).subsections, subsectionTitle);
  return subsection ? extractParagraphs(subsection.content, maxParagraphs) : [];
}

async function getSectionListItems(fileName: string, sectionTitle: string, maxItems = 5) {
  const document = await getGuideDocument(fileName);
  const section = findSectionByTitle(document.outline.sections, sectionTitle);

  return section ? extractMarkdownListItems(section.content, maxItems) : [];
}

function toSentence(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function buildGenericProductExample({
  name,
  description,
  pros,
  category,
}: {
  name: string;
  description: string;
  pros: string[];
  category: string;
}): AcademyProductExample {
  return {
    name,
    brand: '',
    description: toSentence(description),
    pros: uniqueItems(pros, 3),
    affiliateUrl: null,
    category,
  };
}

function buildStrollerProductExample({
  groupSlug,
  index,
  category,
}: {
  groupSlug: keyof typeof STROLLER_PRODUCT_GROUPS;
  index: number;
  category: string;
}) {
  const products = STROLLER_PRODUCT_GROUPS[groupSlug] as GuideProductExampleData[];
  const product = products[index];

  return {
    name: product.productName ?? product.name,
    brand: product.brand ?? '',
    description: toSentence(product.shortReview ?? product.bestFor ?? 'A helpful guided example.'),
    pros: uniqueItems(product.pros ?? [], 3),
    affiliateUrl: product.affiliateUrl ?? null,
    category,
  } satisfies AcademyProductExample;
}

function buildCarSeatProductExample({
  groupSlug,
  index,
  category,
}: {
  groupSlug: keyof typeof CAR_SEAT_PRODUCT_GROUPS;
  index: number;
  category: string;
}) {
  const products = CAR_SEAT_PRODUCT_GROUPS[groupSlug] as GuideProductExampleData[];
  const product = products[index];

  return {
    name: product.productName ?? product.name,
    brand: product.brand ?? '',
    description: toSentence(product.shortReview ?? product.bestFor ?? 'A helpful guided example.'),
    pros: uniqueItems(product.pros ?? [], 3),
    affiliateUrl: product.affiliateUrl ?? null,
    category,
  } satisfies AcademyProductExample;
}

function filterRenderableAcademyProducts(products: AcademyProductExample[]) {
  return products.filter((product) =>
    hasResolvedGuideAffiliateUrl({
      affiliateUrl: product.affiliateUrl,
      brand: product.brand,
      productName: product.name,
      name: product.name,
    }),
  );
}

function getAcademyPathHref(pathSlug: AcademyPathSlug) {
  return `/academy/${pathSlug}`;
}

function getAcademyModuleHref(pathSlug: AcademyPathSlug, moduleSlug: AcademyModuleSlug) {
  return `/academy/${pathSlug}/${moduleSlug}`;
}

function getModuleCard(slug: AcademyModuleSlug): AcademyModuleCard {
  const definition = ACADEMY_MODULE_DEFINITIONS[slug];

  return {
    slug,
    href: getAcademyModuleHref(definition.pathSlug, slug),
    title: definition.title,
    description: definition.description,
    ctaLabel: 'Start module ->',
  };
}

function getRelatedLink(slug: AcademyModuleSlug, ctaLabel: string): AcademyRelatedLink {
  const definition = ACADEMY_MODULE_DEFINITIONS[slug];
  const pathDefinition = ACADEMY_PATH_DEFINITIONS[definition.pathSlug];

  return {
    href: getAcademyModuleHref(definition.pathSlug, slug),
    title: definition.title,
    description: `${definition.description} Inside the ${pathDefinition.title} path.`,
    ctaLabel,
  };
}

function getAcademyEditorialLinks(slug: AcademyModuleSlug): AcademyRelatedLink[] {
  if (slug === 'stroller-foundations') {
    return [
      {
        href: '/blog/best-full-size-strollers-2026',
        title: 'Best Full-Size Strollers of 2026',
        description:
          'Use this once you know the full-size lane is in play and you want a calmer shortlist of the strongest everyday contenders.',
        ctaLabel: 'Read journal post ->',
      },
      {
        href: '/blog/blog-best-compact-strollers-2026',
        title: 'Best Compact Strollers of 2026',
        description:
          'Use this when the smaller-footprint lane is winning and you want the shortlist without turning it into another feature spiral.',
        ctaLabel: 'Read journal post ->',
      },
      {
        href: '/blog/best-convertible-single-to-double-strollers-2026',
        title: 'Best Convertible Single-to-Double Strollers of 2026',
        description:
          'Use this if you are planning around growth and want to see which expandable stroller setups are actually worth the space.',
        ctaLabel: 'Read journal post ->',
      },
    ];
  }

  if (slug === 'travel-systems') {
    return [
      {
        href: '/blog/best-travel-strollers-2026',
        title: 'Best Travel Strollers of 2026',
        description:
          'Use this when portability is the point and you want a cleaner look at the travel-first options before you commit.',
        ctaLabel: 'Read journal post ->',
      },
    ];
  }

  if (slug === 'travel-with-baby') {
    return [
      {
        href: '/guides/travel-with-baby',
        title: 'Travel Guide',
        description:
          'Use the wider travel hub when you want the fuller system for outings, packing, portability, and what deserves space away from home.',
        ctaLabel: 'Open travel guide ->',
      },
      {
        href: '/blog/best-travel-strollers-2026',
        title: 'Best Travel Strollers of 2026',
        description:
          'Use this once portability is clearly part of the plan and you want the tighter shortlist of travel-first stroller options.',
        ctaLabel: 'Read journal post ->',
      },
    ];
  }

  if (slug === 'feeding-setup-flow') {
    return [
      {
        href: '/guides/feeding',
        title: 'Feeding Hub',
        description:
          'Use the wider feeding guide hub when you want the higher-level view of bottles, pumps, storage, and what can wait.',
        ctaLabel: 'Open feeding guide ->',
      },
      {
        href: '/guides/registry/where-to-register',
        title: 'Registry Strategy',
        description:
          'Step back to registry structure if the bigger question is still where feeding gear should live and how much to buy before baby arrives.',
        ctaLabel: 'Open registry guide ->',
      },
    ];
  }

  if (slug === 'breast-pump') {
    return [
      {
        href: '/guides/feeding',
        title: 'Feeding Hub',
        description:
          'Use the broader feeding hub when the bigger question is still how pumping fits with bottles, storage, and the rest of the feeding setup.',
        ctaLabel: 'Open feeding guide ->',
      },
      {
        href: '/guides/registry/essentials',
        title: 'Registry Essentials',
        description:
          'Step back here if you are still deciding whether a pump belongs on the first-pass registry or on the later decision list.',
        ctaLabel: 'Open registry guide ->',
      },
    ];
  }

  if (slug === 'bottles-and-baby-utensils') {
    return [
      {
        href: '/guides/feeding',
        title: 'Feeding Hub',
        description:
          'Use the feeding hub when you want the wider view of bottles, pumping, cleanup, and where the bottle system fits in the bigger plan.',
        ctaLabel: 'Open feeding guide ->',
      },
      {
        href: '/guides/registry/essentials',
        title: 'Registry Essentials',
        description:
          'Use this when the bottle question is really a registry question about what belongs now versus later.',
        ctaLabel: 'Open registry guide ->',
      },
    ];
  }

  if (slug === 'what-to-register-first') {
    return [
      {
        href: '/guides/registry/essentials',
        title: 'Registry Essentials Guide',
        description:
          'Use the guide-side essentials page when you want a companion view of the first-pass categories and the logic behind them.',
        ctaLabel: 'Open essentials guide ->',
      },
      {
        href: '/guides/registry',
        title: 'Registry Hub',
        description:
          'Step back to the full registry hub if you want the wider map before you keep building the list.',
        ctaLabel: 'Open registry hub ->',
      },
    ];
  }

  if (slug === 'mistakes-to-avoid') {
    return [
      {
        href: '/guides/registry/mistakes',
        title: 'Registry Mistakes Guide',
        description:
          'Use the guide-side version when you want the broader editorial read on where lists usually drift into clutter and duplicate spending.',
        ctaLabel: 'Open mistakes guide ->',
      },
      {
        href: '/guides/registry',
        title: 'Registry Hub',
        description:
          'Step back to the hub if this edit pass makes you want the wider registry sequence again before you finish the list.',
        ctaLabel: 'Open registry hub ->',
      },
    ];
  }

  if (slug === 'first-weeks-home-rhythm') {
    return [
      {
        href: '/guides/postpartum',
        title: 'Postpartum Hub',
        description:
          'Use the broader postpartum hub when you want the wider view of recovery, support, and what helps the adult side of early parenthood feel more workable.',
        ctaLabel: 'Open postpartum hub ->',
      },
      {
        href: '/guides/feeding',
        title: 'Feeding Hub',
        description:
          'Use this when the home-rhythm question keeps intersecting with feeding setup, cleanup, and how the day actually gets organized.',
        ctaLabel: 'Open feeding guide ->',
      },
    ];
  }

  return [];
}

function getAcademySubmoduleSection(slug: AcademyModuleSlug): AcademySubmoduleSection | null {
  if (slug === 'stroller-foundations') {
    return {
      title: 'Stroller Foundations Sub Modules',
      description:
        'Once the category basics click, use these stroller category guides to go deeper into the lane that actually fits your routine.',
      cards: getStrollerFoundationsAcademySubmoduleCards().map((card) => ({
        ...card,
        ctaLabel: 'Open sub module ->',
        eyebrow: 'Stroller Lane',
      })),
    };
  }

  if (slug === 'car-seat-foundations') {
    return {
      title: 'Car Seat Foundations Sub Modules',
      description:
        'Once the stage basics click, use these car seat category guides to go deeper into the lane that actually fits your vehicle, your routine, and the chapter you are in.',
      cards: getCarSeatFoundationsAcademySubmoduleCards().map((card) => ({
        ...card,
        ctaLabel: 'Open sub module ->',
        eyebrow: 'Car Seat Category',
      })),
    };
  }

  if (slug === 'furniture-that-actually-works') {
    return {
      title: 'Furniture That Actually Works Sub Modules',
      description:
        'Use these nursery furniture submodules to sort the pieces that support sleep, feeding, changing, storage, and safety without turning the room into a shopping checklist.',
      cards: getNurseryFurnitureSubmoduleCards(),
    };
  }

  if (slug === 'daily-use-gear') {
    return {
      title: 'Daily Use Gear Sub Modules',
      description:
        'Use these Daily Use Gear submodules to sort the products that shape movement, feeding, soothing, cleanup, and the smaller repeated parts of the day without overbuying the category.',
      cards: getDailyUseGearAcademySubmoduleCards(),
    };
  }

  if (slug === 'welcome-boxes-perks') {
    return {
      title: 'Welcome Boxes & Registry Perks Sub Modules',
      description:
        'Use these welcome box submodules to understand qualification, platform fit, and which registry perks are actually worth the effort.',
      cards: getRegistryWelcomeBoxesAcademySubmoduleCards().map((card) => ({
        ...card,
        ctaLabel: 'Open sub module ->',
      })),
    };
  }

  return null;
}

function buildGearAcademyModule(slug: GearAcademyModuleSlug): AcademyModuleContent {
  const module = getGearAcademyModule(slug);
  return {
    intro: module.intro,
    coreSections: module.coreSections.map((section) =>
      buildCoreSection({
        title: section.title,
        paragraphs: section.paragraphs,
        imageSrc: section.imageSrc,
        imageAlt: section.imageAlt,
      }),
    ),
    decisionBullets: module.decisionBullets,
    products: module.products.map((product) =>
      buildGenericProductExample({
        name: product.name,
        description: product.description,
        pros: product.pros,
        category: module.title,
      }),
    ),
    softCtaLabel: module.softCtaLabel,
    softCtaTitle: module.softCtaTitle,
    softCtaBody: module.softCtaBody,
  };
}

function buildRegistryAcademyModule(slug: RegistryAcademyModuleSlug): AcademyModuleContent {
  const module = getRegistryAcademyModule(slug);
  return {
    intro: module.intro,
    coreSections: module.coreSections.map((section) =>
      buildCoreSection({
        title: section.title,
        paragraphs: section.paragraphs,
        imageSrc: section.imageSrc,
        imageAlt: section.imageAlt,
      }),
    ),
    decisionBullets: module.decisionBullets,
    products: module.products.map((product) =>
      buildGenericProductExample({
        name: product.name,
        description: product.description,
        pros: product.pros,
        category: module.title,
      }),
    ),
    softCtaLabel: module.softCtaLabel,
    softCtaTitle: module.softCtaTitle,
    softCtaBody: module.softCtaBody,
  };
}

function buildNurseryAcademyModule(slug: NurseryAcademyModuleSlug): AcademyModuleContent {
  const module = getNurseryAcademyModule(slug);
  return {
    intro: module.intro,
    coreSections: module.coreSections.map((section) =>
      buildCoreSection({
        title: section.title,
        paragraphs: section.paragraphs,
        imageSrc: section.imageSrc,
        imageAlt: section.imageAlt,
      }),
    ),
    decisionBullets: module.decisionBullets,
    products: module.products.map((product) =>
      buildGenericProductExample({
        name: product.name,
        description: product.description,
        pros: product.pros,
        category: module.title,
      }),
    ),
    softCtaLabel: module.softCtaLabel,
    softCtaTitle: module.softCtaTitle,
    softCtaBody: module.softCtaBody,
  };
}

function buildPostpartumAcademyModule(slug: PostpartumAcademyModuleSlug): AcademyModuleContent {
  const module = getPostpartumAcademyModule(slug);
  return {
    intro: module.intro,
    coreSections: module.coreSections.map((section) =>
      buildCoreSection({
        title: section.title,
        paragraphs: section.paragraphs,
        imageSrc: section.imageSrc,
        imageAlt: section.imageAlt,
      }),
    ),
    decisionBullets: module.decisionBullets,
    products: module.products.map((product) =>
      buildGenericProductExample({
        name: product.name,
        description: product.description,
        pros: product.pros,
        category: module.title,
      }),
    ),
    softCtaLabel: module.softCtaLabel,
    softCtaTitle: module.softCtaTitle,
    softCtaBody: module.softCtaBody,
  };
}

async function buildStrollerFoundationsModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['stroller-foundations'].title;

  const intro = uniqueItems([
    ...(await getPrefaceParagraphs(GUIDE_FILES.stroller, 2)),
    ...(await getPrefaceParagraphs(GUIDE_FILES.compact, 1)),
  ], 3);

  const decisionBullets = uniqueItems([
    ...(await getSectionListItems(GUIDE_FILES.stroller, 'Decision Framework', 5)),
    ...(await getSectionListItems(GUIDE_FILES.compact, 'Real-Life Fit', 4)),
  ], 5);

  return {
    intro,
    coreSections: [
      buildCoreSection({
        title: 'Start with the lane',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.stroller, 'What This Is', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.compact, 'Why This Category Feels Overwhelming', 1)),
        ], 3),
        imageSrc: '/assets/editorial/strollers.png',
        imageAlt: 'Editorial stroller lane image.',
        imageCaption: 'The category map comes first. The brand rabbit hole can wait.',
      }),
      buildCoreSection({
        title: 'Full-size and compact solve different days',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Full-size and modular strollers', 2)),
          ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Compact and travel strollers', 2)),
        ], 4),
        imageSrc: '/assets/editorial/fullsizemodular.png',
        imageAlt: 'Full-size stroller editorial image.',
        imageCaption: 'This is rarely about which stroller is more impressive. It is about which tradeoff is easier to live with.',
      }),
      buildCoreSection({
        title: 'Compact is a routine answer, not a downgrade',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.compact, 'What Defines a Compact or Lightweight Stroller', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.compact, 'Real-Life Fit', 2)),
        ], 4),
        imageSrc: '/assets/editorial/compact.png',
        imageAlt: 'Compact stroller editorial image.',
        imageCaption: 'Compact wins because it keeps the week moving more easily, not because it wins a smaller-is-purer competition.',
      }),
      buildCoreSection({
        title: 'Compatibility matters, but longevity wins',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.stroller, 'Core Content', 'Car seat compatibility matters, but not more than longevity', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters More', 1)),
        ], 3),
        imageSrc: '/assets/editorial/stroller-folds.jpg',
        imageAlt: 'Stroller fold editorial image.',
        imageCaption: 'The stroller usually has the longer job. That should change the order of the decision.',
      }),
    ],
    decisionBullets,
    products: [
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 0, category: title }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 1, category: title }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 2, category: title }),
    ],
  };
}

async function buildTravelSystemsModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['travel-systems'].title;

  const intro = uniqueItems([
    ...(await getPrefaceParagraphs(GUIDE_FILES.travel, 2)),
    ...(await getPrefaceParagraphs(GUIDE_FILES.travelStroller, 1)),
  ], 3);

  const decisionBullets = uniqueItems([
    ...(await getSectionListItems(GUIDE_FILES.travel, 'Decision Framework', 5)),
    ...(await getSectionListItems(GUIDE_FILES.infantCarSeat, 'How to Think About It Simply', 3)),
  ], 5);

  return {
    intro,
    coreSections: [
      buildCoreSection({
        title: 'Travel is mostly a transition problem',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.travel, 'Core Content', 'Travel is really about transitions', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Why This Category Feels Overwhelming', 1)),
        ], 3),
        imageSrc: '/assets/editorial/gear.jpg',
        imageAlt: 'Baby travel planning image.',
        imageCaption: 'The hardest repeated transition should shape the setup more than the smallest spec sheet number.',
      }),
      buildCoreSection({
        title: 'The stroller should match the trip',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.travel, 'Core Content', 'The stroller should match the trip', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'What a Travel Stroller Should Actually Do', 2)),
        ], 4),
        imageSrc: '/assets/editorial/stroller-folds.jpg',
        imageAlt: 'Travel stroller fold and portability image.',
        imageCaption: 'Airport days, road trips, and destination-heavy walking are not all asking the stroller to do the same job.',
      }),
      buildCoreSection({
        title: 'A travel system is early-stage convenience, not the whole plan',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What a Travel System Actually Means', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters More', 2)),
        ], 4),
        imageSrc: '/assets/editorial/fullsize.png',
        imageAlt: 'Everyday stroller and travel-system planning image.',
        imageCaption: 'The click-in convenience is real. It still does not get to outrank the stroller you will use much longer.',
      }),
      buildCoreSection({
        title: 'Choose the hardest transition first',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Expert Advice', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.travelStroller, 'Real-Life Fit', 2)),
        ], 4),
        imageSrc: '/assets/editorial/growing-with-confidence.jpg',
        imageAlt: 'Parent traveling confidently with baby gear.',
        imageCaption: 'Families are usually happiest when the setup solves the most stressful part of the trip first.',
      }),
    ],
    decisionBullets,
    products: [
      buildStrollerProductExample({ groupSlug: 'full-size-modular-strollers', index: 0, category: title }),
      buildStrollerProductExample({ groupSlug: 'full-size-modular-strollers', index: 1, category: title }),
      buildStrollerProductExample({ groupSlug: 'compact-lightweight-strollers', index: 0, category: title }),
    ],
  };
}

async function buildCarSeatBasicsModule() {
  const title = ACADEMY_MODULE_DEFINITIONS['car-seat-basics'].title;

  const intro = uniqueItems([
    ...(await getPrefaceParagraphs(GUIDE_FILES.carSeat, 2)),
    ...(await getPrefaceParagraphs(GUIDE_FILES.infantCarSeat, 1)),
  ], 3);

  const decisionBullets = uniqueItems([
    ...(await getSectionListItems(GUIDE_FILES.carSeat, 'Decision Framework', 5)),
    'Choose the stage first.',
    'Confirm the seat fits your vehicle and your routine before the features start auditioning for attention.',
  ], 5);

  return {
    intro,
    coreSections: [
      buildCoreSection({
        title: 'Stage first, always',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.carSeat, 'What This Is', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.carSeat, 'What People Get Wrong', 1)),
        ], 3),
        imageSrc: '/assets/editorial/gear.jpg',
        imageAlt: 'Car seat stage planning image.',
        imageCaption: 'The category gets calmer once the stage is clear enough to filter the rest.',
      }),
      buildCoreSection({
        title: 'Infant seats are about portability',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.carSeat, 'Core Content', 'Infant seats are about portability, not superiority', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'Base vs Baseless Installation', 2)),
        ], 4),
        imageSrc: '/assets/editorial/welcome.png',
        imageAlt: 'Infant stage editorial image.',
        imageCaption: 'Portability can be incredibly helpful. It is still not mandatory for every family.',
      }),
      buildCoreSection({
        title: 'Convertible and all-in-one seats answer a different question',
        paragraphs: uniqueItems([
          ...(await getSectionParagraphs(GUIDE_FILES.convertibleCarSeat, 'What Convertible Actually Solves', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.allInOneCarSeat, 'What All-in-One Actually Solves', 2)),
        ], 4),
        imageSrc: '/assets/editorial/bear-blocks.png',
        imageAlt: 'Long-run planning image for car seat stages.',
        imageCaption: 'Installed-seat convenience and long-run coverage are not the same thing, even when the category names sound efficient.',
      }),
      buildCoreSection({
        title: 'Fit and installation confidence matter most',
        paragraphs: uniqueItems([
          ...(await getSubsectionParagraphs(GUIDE_FILES.carSeat, 'Core Content', 'Fit and installation confidence matter most', 2)),
          ...(await getSectionParagraphs(GUIDE_FILES.infantCarSeat, 'What Actually Matters in Real Life', 1)),
        ], 3),
        imageSrc: '/assets/editorial/ipadblueprint.png',
        imageAlt: 'Car seat planning and fit image.',
        imageCaption: 'The right answer is the seat that fits your child, your vehicle, and your real week well enough to use correctly every time.',
      }),
    ],
    decisionBullets,
    products: [
      buildCarSeatProductExample({ groupSlug: 'infant', index: 0, category: title }),
      buildCarSeatProductExample({ groupSlug: 'convertible', index: 0, category: title }),
      buildCarSeatProductExample({ groupSlug: 'allInOne', index: 0, category: title }),
    ],
  };
}

async function buildModuleContent(slug: AcademyModuleSlug): Promise<AcademyModuleContent | null> {
  if (isGearAcademyModuleSlug(slug)) {
    return buildGearAcademyModule(slug);
  }

  if (isRegistryAcademyModuleSlug(slug)) {
    return buildRegistryAcademyModule(slug);
  }

  if (isNurseryAcademyModuleSlug(slug)) {
    return buildNurseryAcademyModule(slug);
  }

  if (isPostpartumAcademyModuleSlug(slug)) {
    return buildPostpartumAcademyModule(slug);
  }

  switch (slug) {
    case 'car-seat-basics':
      return buildGearAcademyModule('car-seat-foundations');
    default:
      return null;
  }
}

export function getAcademyHomeData(): AcademyHomeData {
  return {
    title: 'TMBC Baby Academy',
    description: 'A calm, structured way to prepare for baby - without the overwhelm.',
    explanationTitle: 'Most people start with products. We start with your life.',
    explanationBody:
      'The academy is designed to move from context into decisions, then into guided examples. You do not need a louder checklist. You need a clearer next step.',
    paths: ACADEMY_PATH_ORDER.map((pathSlug) => {
      const definition = ACADEMY_PATH_DEFINITIONS[pathSlug];

      return {
        slug: pathSlug,
        href: getAcademyPathHref(pathSlug),
        title: definition.title,
        description: definition.shortDescription,
        eyebrow: `${ACADEMY_PATH_MODULES[pathSlug].length} modules`,
        imagePath: definition.imagePath,
        imageAlt: definition.imageAlt,
      };
    }),
  };
}

export function getAcademyPathSlugs() {
  return [...ACADEMY_PATH_ORDER];
}

export function getAcademyModuleParams() {
  return ACADEMY_PATH_ORDER.flatMap((pathSlug) =>
    ACADEMY_PATH_MODULES[pathSlug].map((moduleSlug) => ({
      academyPath: pathSlug,
      module: moduleSlug,
    })),
  );
}

export function getAcademySitemapPaths() {
  return [
    '/academy',
    ...ACADEMY_PATH_ORDER.map((pathSlug) => getAcademyPathHref(pathSlug)),
    ...ACADEMY_PATH_ORDER.flatMap((pathSlug) =>
      ACADEMY_PATH_MODULES[pathSlug].map((moduleSlug) => getAcademyModuleHref(pathSlug, moduleSlug)),
    ),
    ...getStrollerFoundationsAcademySubmoduleCards().map((card) => card.href),
    ...getCarSeatFoundationsAcademySubmoduleCards().map((card) => card.href),
    ...getDailyUseGearAcademySubmoduleCards().map((card) => card.href),
    ...getRegistryWelcomeBoxesAcademySubmoduleCards().map((card) => card.href),
    ...getNurseryFurnitureSubmoduleCards().map((card) => card.href),
  ];
}

export function isAcademyPathSlug(value: string): value is AcademyPathSlug {
  return value in ACADEMY_PATH_DEFINITIONS;
}

export function isAcademyModuleSlug(value: string): value is AcademyModuleSlug {
  return value in ACADEMY_MODULE_DEFINITIONS;
}

export function getAcademyPathTitle(pathSlug: AcademyPathSlug) {
  return ACADEMY_PATH_DEFINITIONS[pathSlug].title;
}

export function getAcademyModuleTitle(slug: AcademyModuleSlug) {
  return ACADEMY_MODULE_DEFINITIONS[slug].title;
}

export async function getAcademyPathData(pathSlug: AcademyPathSlug): Promise<AcademyPathData> {
  const definition = ACADEMY_PATH_DEFINITIONS[pathSlug];

  return {
    slug: pathSlug,
    href: getAcademyPathHref(pathSlug),
    title: definition.title,
    shortDescription: definition.shortDescription,
    heroTitle: definition.heroTitle,
    heroDescription: definition.heroDescription,
    intro: definition.intro,
    overallSummary: definition.overallSummary,
    learningHighlights: definition.learningHighlights,
    moduleSectionDescription: definition.moduleSectionDescription,
    imagePath: definition.imagePath,
    imageAlt: definition.imageAlt,
    moduleCards: ACADEMY_PATH_MODULES[pathSlug].map((moduleSlug) => getModuleCard(moduleSlug)),
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: definition.title },
    ],
  };
}

export async function getAcademyModuleData(slug: AcademyModuleSlug): Promise<AcademyModuleData> {
  const definition = ACADEMY_MODULE_DEFINITIONS[slug];
  const pathDefinition = ACADEMY_PATH_DEFINITIONS[definition.pathSlug];
  const modulesInPath = ACADEMY_PATH_MODULES[definition.pathSlug];
  const currentIndex = modulesInPath.indexOf(slug);
  const content = await buildModuleContent(slug);

  if (!content) {
    throw new Error(`Missing academy module content for ${slug}.`);
  }

  const previousSlug = currentIndex > 0 ? modulesInPath[currentIndex - 1] ?? null : null;
  const nextSlug = currentIndex < modulesInPath.length - 1 ? modulesInPath[currentIndex + 1] ?? null : null;

  return {
    slug,
    pathSlug: definition.pathSlug,
    moduleType: definition.moduleType,
    enableDecisionRouting: definition.enableDecisionRouting ?? false,
    href: getAcademyModuleHref(definition.pathSlug, slug),
    title: definition.title,
    description: definition.description,
    subhead: definition.subhead,
    intro: content.intro,
    imagePath: definition.imagePath,
    imageAlt: definition.imageAlt,
    progress: {
      current: currentIndex + 1,
      total: modulesInPath.length,
    },
    coreSections: content.coreSections,
    decisionTitle: 'What This Means For You',
    decisionBullets: content.decisionBullets,
    products: filterRenderableAcademyProducts(resolveAcademyProductExamples(slug, content.products)),
    softCtaLabel: content.softCtaLabel ?? '',
    softCtaTitle: content.softCtaTitle ?? '',
    softCtaBody: content.softCtaBody ?? [],
    previous: previousSlug ? getRelatedLink(previousSlug, 'Previous module ->') : null,
    next: nextSlug ? getRelatedLink(nextSlug, 'Next module ->') : null,
    related: definition.relatedSlug ? getRelatedLink(definition.relatedSlug, 'Related module ->') : null,
    editorialLinks: getAcademyEditorialLinks(slug),
    submoduleSection: getAcademySubmoduleSection(slug),
    breadcrumb: [
      { label: 'Academy', href: '/academy' },
      { label: pathDefinition.title, href: getAcademyPathHref(definition.pathSlug) },
      { label: definition.title },
    ],
  };
}
