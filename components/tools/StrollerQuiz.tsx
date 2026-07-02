'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OpenBoxBadge } from './StrollerCatalogFinder';
import { getAffiliateLinks, babylistAffiliateUrl } from '@/lib/travelSystemAffiliateLinks';
import { travelSystemResultsHref } from '@/lib/travelSystemRouting';
import { type StrollerCategory } from '@/lib/guides/travelSystemCompatibility';

// ─── Types ─────────────────────────────────────────────────────────────────────

type CategoryKey =
  | 'full-size'
  | 'compact'
  | 'travel'
  | 'convertible'
  | 'double'
  | 'jogging'
  | 'double-jogging';

type AnswerScore = Partial<Record<CategoryKey, number>>;

type Answer = {
  label: string;
  sublabel?: string;
  scores: AnswerScore;
  /** If set, the final result is restricted to one of these categories regardless of other scores. */
  forceCategories?: CategoryKey[];
};

type Question = {
  id: string;
  question: string;
  subtext?: string;
  answers: Answer[];
};

type StrollerRecommendation = {
  name: string;
  tagline: string;
  brand: string;
  model: string;
  imageSrc?: string;
};

type CategoryResult = {
  key: CategoryKey;
  name: string;
  tagline: string;
  emoji: string;
  accentColor: string;
  accentBg: string;
  description: string;
  rightFor: string[];
  watchOut: string;
  imageSrc: string;
  blogHref?: string;
  blogTitle?: string;
  picks: StrollerRecommendation[];
};

// ─── Quiz questions ────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: 'family',
    question: 'Who is going to be riding in the stroller?',
    subtext: 'Think about the next year or two of your life, not someday.',
    answers: [
      {
        label: 'Just one little one',
        sublabel: 'No siblings joining anytime soon',
        scores: { 'full-size': 1, compact: 1, travel: 1, jogging: 1 },
      },
      {
        label: 'One now — but another baby is in the near-term plan',
        sublabel: 'A real timeline, within a couple of years',
        scores: { convertible: 6, 'full-size': 1 },
      },
      {
        label: 'Two little ones who both still need to ride',
        sublabel: 'Both kids, most outings, right now',
        scores: { double: 6 },
        forceCategories: ['double', 'double-jogging'],
      },
      {
        label: 'Twins or more on the way',
        sublabel: 'Two seats needed from day one',
        scores: { double: 6 },
        // A single-to-double convertible is fine for twins — it's just bought as a double.
        forceCategories: ['double', 'double-jogging', 'convertible'],
      },
    ],
  },
  {
    id: 'home',
    question: 'Which of these sounds the most like where you live?',
    answers: [
      {
        label: 'Apartment or condo — space is tight',
        sublabel: 'Every extra inch counts',
        scores: { compact: 3, travel: 2 },
      },
      {
        label: 'A house in the suburbs',
        sublabel: 'A yard, a driveway, room to spread out',
        scores: { 'full-size': 3, jogging: 1 },
      },
      {
        label: 'Right in the city',
        sublabel: 'Sidewalks, transit, lots of people',
        scores: { compact: 3, travel: 1 },
      },
      {
        label: 'Out in the country or pretty spread out',
        sublabel: 'We drive just about everywhere',
        scores: { 'full-size': 2, jogging: 1, compact: 1 },
      },
    ],
  },
  {
    id: 'getaround',
    question: 'On a normal day, how do you mostly get from place to place?',
    answers: [
      {
        label: 'On foot',
        sublabel: 'Walking the neighborhood, errands close by',
        scores: { 'full-size': 3, jogging: 1 },
      },
      {
        label: 'In the car',
        sublabel: 'We drive to most things',
        scores: { compact: 3, travel: 1 },
      },
      {
        label: 'Public transit',
        sublabel: 'Buses, trains, and subways',
        scores: { compact: 2, travel: 2 },
      },
      {
        label: 'A mix of walking and driving',
        sublabel: 'A little of both, depending on the day',
        scores: { 'full-size': 1, compact: 1 },
      },
    ],
  },
  {
    id: 'car',
    question: 'What is your car situation?',
    answers: [
      {
        label: 'Small car — the trunk fills up fast',
        sublabel: 'Whatever I get has to pack down',
        scores: { compact: 3, travel: 2 },
      },
      {
        label: 'Midsize car or a small SUV',
        sublabel: 'A decent trunk, nothing huge',
        scores: { 'full-size': 1, compact: 1, convertible: 1 },
      },
      {
        label: 'Big SUV, truck, or minivan',
        sublabel: 'Plenty of room back there',
        scores: { 'full-size': 2, jogging: 1, convertible: 1 },
      },
      {
        label: 'We don\'t really use a car',
        sublabel: 'Walking and transit are our default',
        scores: { compact: 2, travel: 1 },
      },
    ],
  },
  {
    id: 'storage',
    question: 'Where will the stroller usually live at home?',
    answers: [
      {
        label: 'By the door in a small entryway',
        sublabel: 'It can\'t be a big thing in the way',
        scores: { compact: 3, travel: 1 },
      },
      {
        label: 'A garage, mudroom, or roomy closet',
        sublabel: 'Plenty of space to park it',
        scores: { 'full-size': 2, jogging: 2, convertible: 1 },
      },
      {
        label: 'Wherever it fits — space is limited',
        sublabel: 'Smaller is safer for us',
        scores: { compact: 2, travel: 1 },
      },
      {
        label: 'It\'ll move between our place and others\'',
        sublabel: 'Grandparents, daycare, or two homes',
        scores: { travel: 4, compact: 1 },
      },
    ],
  },
  {
    id: 'active',
    question: 'How would you describe your outdoor life?',
    subtext: 'Picture what you\'ll actually do, not what you hope to.',
    answers: [
      {
        label: 'I want to run or jog with the baby',
        sublabel: 'Keeping up my pace matters to me',
        scores: { jogging: 6, 'double-jogging': 6 },
      },
      {
        label: 'Lots of outdoor time — trails, parks, the beach',
        sublabel: 'We\'re outside in all kinds of places',
        scores: { jogging: 3, 'full-size': 1, 'double-jogging': 3 },
      },
      {
        label: 'Mostly easy walks on smooth paths',
        sublabel: 'Sidewalks, paved trails, the mall',
        scores: { 'full-size': 2, compact: 1 },
      },
      {
        label: 'We\'re honestly more of an indoor family',
        sublabel: 'Quick trips out, not long adventures',
        scores: { compact: 2, travel: 1 },
      },
    ],
  },
  {
    id: 'ground',
    question: 'What is the ground like where you\'ll walk the most?',
    answers: [
      {
        label: 'Smooth and paved',
        sublabel: 'Sidewalks, shops, flat paths',
        scores: { compact: 2, 'full-size': 1 },
      },
      {
        label: 'Bumpy — gravel, grass, dirt, or cobblestones',
        sublabel: 'Little wheels would get stuck',
        scores: { jogging: 3, 'full-size': 1, 'double-jogging': 2 },
      },
      {
        label: 'Hilly — lots of up and down',
        sublabel: 'A good push really matters here',
        scores: { 'full-size': 2, jogging: 2, 'double-jogging': 1 },
      },
      {
        label: 'Snow or rough weather part of the year',
        sublabel: 'It needs to handle the seasons',
        scores: { jogging: 2, 'full-size': 1 },
      },
    ],
  },
  {
    id: 'flights',
    question: 'How often do you picture flying with the baby?',
    answers: [
      {
        label: 'Pretty often',
        sublabel: 'We travel, or family lives far away',
        scores: { travel: 6, compact: 1 },
      },
      {
        label: 'A couple of trips a year',
        sublabel: 'Now and then, not constantly',
        scores: { compact: 2, travel: 1 },
      },
      {
        label: 'Rarely or never',
        sublabel: 'We mostly stay close to home',
        scores: { 'full-size': 2, jogging: 1 },
      },
    ],
  },
  {
    id: 'caregivers',
    question: 'Besides you, who will be pushing the stroller?',
    answers: [
      {
        label: 'Mostly just me and my partner',
        sublabel: 'It pretty much stays with us',
        scores: { 'full-size': 1, compact: 1 },
      },
      {
        label: 'Grandparents, a nanny, or daycare — often',
        sublabel: 'It needs to be easy for anyone to fold',
        scores: { compact: 2, travel: 2 },
      },
      {
        label: 'It\'ll bounce between a few different people',
        sublabel: 'Lots of hands, lots of different cars',
        scores: { travel: 4, compact: 1 },
      },
      {
        label: 'Not totally sure yet',
        sublabel: 'Still figuring that part out',
        scores: { compact: 1, 'full-size': 1 },
      },
    ],
  },
  {
    id: 'outings',
    question: 'What does a typical outing look like for you?',
    answers: [
      {
        label: 'Quick in-and-out',
        sublabel: 'A store run, an appointment, a short errand',
        scores: { compact: 3, travel: 1 },
      },
      {
        label: 'Long days out',
        sublabel: 'Parks, the zoo, shopping, all-day adventures',
        scores: { 'full-size': 3 },
      },
      {
        label: 'Mostly walks to get out of the house',
        sublabel: 'Fresh air and a change of scenery',
        scores: { 'full-size': 2, jogging: 1 },
      },
      {
        label: 'A bit of everything',
        sublabel: 'It really depends on the day',
        scores: { 'full-size': 1, compact: 1 },
      },
    ],
  },
  {
    id: 'frustration',
    question: 'Day to day, what would frustrate you the most?',
    subtext: 'There are no wrong answers here — just go with your gut.',
    answers: [
      {
        label: 'Wrestling something heavy in and out of the car',
        sublabel: 'Lifting and folding all day would wear me out',
        scores: { compact: 3, travel: 2 },
      },
      {
        label: 'A stroller that gets stuck on bumpy ground',
        sublabel: 'I need it to roll over just about anything',
        scores: { jogging: 4, 'double-jogging': 4 },
      },
      {
        label: 'Having to buy a second stroller later on',
        sublabel: 'I\'d rather get it right the first time',
        scores: { convertible: 4, 'full-size': 1 },
      },
      {
        label: 'A cramped seat my baby outgrows quickly',
        sublabel: 'Comfort and lasting a while matter to me',
        scores: { 'full-size': 3 },
      },
    ],
  },
  {
    id: 'horizon',
    question: 'How long do you want this stroller to last?',
    answers: [
      {
        label: 'Just the early months, then we\'ll see',
        sublabel: 'Happy to reassess down the road',
        scores: { compact: 2, travel: 1 },
      },
      {
        label: 'Years — well into the toddler stage',
        sublabel: 'One stroller we can really live with',
        scores: { 'full-size': 3, convertible: 1 },
      },
      {
        label: 'Long enough to grow with another kid',
        sublabel: 'Planning for a bigger family',
        scores: { convertible: 4 },
      },
      {
        label: 'No strong feeling either way',
        sublabel: 'Whatever makes the most sense',
        scores: { 'full-size': 1, compact: 1 },
      },
    ],
  },
  {
    id: 'priority',
    question: 'If you could only have one, what matters most?',
    subtext: 'Go with the one you\'d actually pick.',
    answers: [
      {
        label: 'Easy and light — grab it and go',
        sublabel: 'Quick fold, simple to carry',
        scores: { compact: 3, travel: 1 },
      },
      {
        label: 'A smooth, comfy ride for the baby',
        sublabel: 'Cushioned, roomy, and nice to push',
        scores: { 'full-size': 3 },
      },
      {
        label: 'Tough enough for anything',
        sublabel: 'Weather, terrain, the great outdoors',
        scores: { jogging: 5, 'double-jogging': 5 },
      },
      {
        label: 'Room to grow with our family',
        sublabel: 'It can turn into a double later on',
        scores: { convertible: 4, 'full-size': 1 },
      },
    ],
  },
  {
    id: 'budget',
    question: 'Last one — what feels comfortable to spend?',
    subtext: 'There is a great option at every level. This just narrows the picks.',
    answers: [
      {
        label: 'Keep it budget-friendly',
        sublabel: 'Around $300 or less',
        scores: { compact: 2, travel: 1 },
      },
      {
        label: 'Somewhere in the middle',
        sublabel: 'Roughly $300 to $800',
        scores: { compact: 1, 'full-size': 1, travel: 1, jogging: 1 },
      },
      {
        label: 'Happy to invest in something that lasts',
        sublabel: '$800 and up',
        scores: { 'full-size': 2, convertible: 1, jogging: 1 },
      },
      {
        label: 'Budget is not really a factor',
        sublabel: 'Just match me to the best fit',
        scores: { 'full-size': 1, compact: 1, travel: 1, jogging: 1, convertible: 1 },
      },
    ],
  },
];

// ─── Category results ──────────────────────────────────────────────────────────

const CATEGORIES: Record<CategoryKey, CategoryResult> = {
  'full-size': {
    key: 'full-size',
    name: 'Full Size / Modular',
    tagline: 'The everyday workhorse.',
    emoji: '🏆',
    accentColor: '#8b3a4a',
    accentBg: '#fdf0f2',
    description:
      'This is the comfortable, do-it-all stroller — a smooth ride, a big basket for everything you end up carrying, and a roomy seat that stays comfy from newborn naps well into the toddler years. It is bigger and heavier to fold, but if you are out with it most days, that trade is an easy one to live with.',
    rightFor: [
      'Walk-heavy routines where you push for long stretches, not just parking lots',
      'Longer outings where basket access, canopy coverage, and recline matter',
      'Open storage — large trunk, garage, or dedicated stroller space',
      'Parents who want one capable primary stroller they can live with for years',
    ],
    watchOut:
      'If your week is mostly quick car errands and the stroller gets folded three times a day, a full-size earns its keep through use, not through ownership.',
    imageSrc: '/assets/editorial/fullsizemodular.png',
    blogHref: '/blog/best-full-size-strollers-2026',
    blogTitle: 'The 5 Best Full-Size Strollers of 2026',
    picks: [
      {
        name: 'Bugaboo Fox 5',
        tagline: 'Best-in-class push quality. The benchmark full-size.',
        brand: 'Bugaboo',
        model: 'Fox 5',
        imageSrc: '/assets/strollers/fox5.png',
      },
      {
        name: 'Nuna MIXX Next',
        tagline: 'Reversible seat, one-hand fold, grows to a second child.',
        brand: 'Nuna',
        model: 'MIXX next',
        imageSrc: '/assets/strollers/mixxnext.png',
      },
      {
        name: 'Silver Cross Reef 2',
        tagline: 'Premium full-size comfort with genuine seat longevity into toddlerhood.',
        brand: 'Silver Cross',
        model: 'Reef 2',
        imageSrc: '/assets/strollers/reef.png',
      },
    ],
  },
  compact: {
    key: 'compact',
    name: 'Compact / Mid-Size',
    tagline: 'The convenience lane.',
    emoji: '✨',
    accentColor: '#6b7fa8',
    accentBg: '#f0f3f8',
    description:
      'Lighter, folds smaller, and slips through tight spaces and parking lots without a fight. You give up a little room and a little cushion on long walks, but most families never miss it — what they get instead is a stroller that is genuinely easy to grab and go every single day.',
    rightFor: [
      'Car-heavy routines where the stroller gets folded and lifted constantly',
      'Smaller trunks, tighter storage, or multiple caregivers sharing the stroller',
      'Families who prioritize easy exits over long-outing comfort',
      'Parents who want a stroller they will actually reach for, not dread',
    ],
    watchOut:
      'If your week includes long daily walks, you may miss the larger seat, better suspension, and bigger basket. Compact wins on convenience, not raw capability.',
    imageSrc: '/assets/editorial/compact.png',
    blogHref: '/blog/blog-best-compact-strollers-2026',
    blogTitle: 'The Best Compact Strollers of 2026',
    picks: [
      {
        name: 'Bugaboo Dragonfly',
        tagline: 'Compact city stroller. Smaller footprint, still a real everyday push.',
        brand: 'Bugaboo',
        model: 'Dragonfly',
      },
      {
        name: 'Nuna TRIV Next',
        tagline: 'Lightweight, reversible seat, one-hand fold under 20 lbs.',
        brand: 'Nuna',
        model: 'TRIV next',
        imageSrc: '/assets/strollers/triv.png',
      },
      {
        name: 'Cybex Mios',
        tagline: 'Sleek mid-size with modular seat and urban maneuverability.',
        brand: 'CYBEX',
        model: 'Mios',
        imageSrc: '/assets/strollers/mios.png',
      },
    ],
  },
  travel: {
    key: 'travel',
    name: 'Travel Stroller',
    tagline: 'The fold-first lane.',
    emoji: '✈️',
    accentColor: '#5a8a6a',
    accentBg: '#f0f5f1',
    description:
      'Made for life on the move — airports, taxis, and grandparents\' houses, anywhere the stroller needs to fold tiny and weigh almost nothing. It is not the plushest ride, but when getting through a gate or into a trunk is the whole point, nothing else comes close.',
    rightFor: [
      'Families who fly regularly and want cabin-bag portability or easy gate check',
      'Ride-share households where the stroller moves in and out of strangers\' trunks',
      'Grandparent-adjacent families who need the stroller at multiple addresses',
      'Parents who want a genuine second stroller for travel while a primary handles everyday life',
    ],
    watchOut:
      'Travel is occasional and a compact stroller would solve the same problem with more everyday capability. Travel-first only pays off when transit friction is genuinely recurring.',
    imageSrc: '/assets/strollers/travel.png',
    blogHref: '/blog/best-travel-strollers-2026',
    blogTitle: 'The Best Travel Strollers of 2026',
    picks: [
      {
        name: 'Babyzen YOYO2',
        tagline: 'The gold standard. Fits overhead bin on most airlines.',
        brand: 'BABYZEN',
        model: 'YOYO2',
      },
      {
        name: 'Silver Cross Clic',
        tagline: 'Standing fold, 13 lbs, genuinely compact.',
        brand: 'Silver Cross',
        model: 'Clic',
      },
      {
        name: 'Bugaboo Butterfly',
        tagline: 'One-motion fold, 19 lbs — the most airline-ready Bugaboo.',
        brand: 'Bugaboo',
        model: 'Butterfly',
        imageSrc: '/assets/strollers/butterfly.png',
      },
    ],
  },
  convertible: {
    key: 'convertible',
    name: 'Single-to-Double Convertible',
    tagline: 'The planning-ahead lane.',
    emoji: '🔄',
    accentColor: '#b5922a',
    accentBg: '#fdf8ee',
    description:
      'This is the one stroller that becomes two. It starts as a single and adds a second seat when your next baby arrives, so you do not have to buy a whole new stroller down the road. The best ones give both kids the same comfortable seat — not a roomy seat for one and a cramped add-on for the other. It does mean pushing a slightly bigger frame before that second baby shows up, so it pays off most when another little one is a real plan, not a maybe.',
    rightFor: [
      'Families who already know a second baby is coming in the next couple of years',
      'Parents who would rather buy once than add a separate double stroller later',
      'Anyone who wants both kids to ride in the same comfortable seat',
      'Homes with room to handle a slightly larger frame in the meantime',
    ],
    watchOut:
      'If a second baby is still a someday-maybe, this is a lot of stroller to push around in the meantime — a simpler single now (and a double later, only if you need it) can be the easier path. And when you do shop, check that both seats are equally roomy and comfortable; some so-called convertibles give the second child a noticeably smaller seat.',
    imageSrc: '/assets/strollers/convertable.png',
    blogHref: '/blog/best-convertible-single-to-double-strollers-2026',
    blogTitle: 'The Best Convertible Single-to-Double Strollers of 2026',
    picks: [
      {
        name: 'Bugaboo Donkey 6',
        tagline: 'The benchmark convertible. Mono to duo seamlessly.',
        brand: 'Bugaboo',
        model: 'Donkey 6',
        imageSrc: '/assets/strollers/donkey.png',
      },
      {
        name: 'Nuna DEMI Next',
        tagline: 'Side-by-side double configuration, born as a single.',
        brand: 'Nuna',
        model: 'DEMI next',
      },
      {
        name: 'Cybex Gazelle S',
        tagline: 'Modular expansion, compact for a convertible.',
        brand: 'CYBEX',
        model: 'Gazelle S',
        imageSrc: '/assets/strollers/gazelle.png',
      },
    ],
  },
  double: {
    key: 'double',
    name: 'Double Stroller',
    tagline: 'Two seats, right now.',
    emoji: '👶👶',
    accentColor: '#8a5a88',
    accentBg: '#f5f0f5',
    description:
      'Two seats, ready right now — for twins, or two little ones close enough in age that they both still need to ride. This is not planning for someday; it is solving today, and the whole stroller is built around carrying two.',
    rightFor: [
      'Twins or multiples from day one',
      'Two children close enough in age that both need a seat on most outings',
      'Families who need a dedicated two-seat solution now',
    ],
    watchOut:
      'Width, weight, and harder maneuvering. Most doubles do not fit neatly through standard doorways. Tight spaces, narrow aisles, and small elevators become real daily friction.',
    imageSrc: '/assets/editorial/double-strollers.jpg',
    blogHref: '/blog/bugaboo-donkey-6-stroller-release',
    blogTitle: 'The Bugaboo Donkey 6 Has Arrived',
    picks: [
      {
        name: 'Baby Jogger City Mini GT2 Double',
        tagline: 'A roomy everyday double that still folds with one hand.',
        brand: 'Baby Jogger',
        model: 'City Mini GT2 Double',
      },
      {
        name: 'Nuna TRVL Dubl',
        tagline: 'A lighter, compact double that is easy to fold and store.',
        brand: 'Nuna',
        model: 'TRVL Dubl',
      },
      {
        name: 'Silver Cross Jet Double',
        tagline: 'One of the most compact folds in a side-by-side double.',
        brand: 'Silver Cross',
        model: 'Jet Double',
      },
    ],
  },
  jogging: {
    key: 'jogging',
    name: 'Jogging / All-Terrain',
    tagline: 'Built for the ground you actually push on.',
    emoji: '🏃',
    accentColor: '#4a7a5a',
    accentBg: '#eef4f0',
    description:
      'Big, sturdy wheels and a bouncy frame built to roll right over the stuff that stops smaller strollers cold — trails, gravel, grass, broken sidewalks, and an actual running pace. If you want to jog with the baby, or you are simply outside on rough ground a lot, this is your lane.',
    rightFor: [
      'Parents who actively run and want a stroller that keeps up with real jogging pace',
      'Outdoor-heavy families whose routes regularly include rough terrain',
      'Neighborhoods where broken sidewalks, curb gaps, or unpaved paths are the norm',
    ],
    watchOut:
      'More bulk, larger fold, and a wider frame that becomes conspicuous in stores and tighter urban spaces. A jogging stroller that never jogs is a very large errand cart.',
    imageSrc: '/assets/strollers/revolution.png',
    picks: [
      {
        name: 'BOB Revolution Flex 3.0',
        tagline: 'The running stroller. Suspension built for actual pace.',
        brand: 'BOB',
        model: 'Revolution Flex 3.0',
        imageSrc: '/assets/strollers/revolution.png',
      },
      {
        name: 'Thule Urban Glide 2',
        tagline: 'Lighter than BOB, smoother on-road, still trail-capable.',
        brand: 'Thule',
        model: 'Urban Glide 2',
        imageSrc: '/assets/strollers/urbnglide.png',
      },
      {
        name: 'UPPAbaby Ridge',
        tagline: 'Jogging-capable with a full-size seat. Best of both worlds.',
        brand: 'UPPAbaby',
        model: 'Ridge',
        imageSrc: '/assets/strollers/ridge.png',
      },
    ],
  },
  'double-jogging': {
    key: 'double-jogging',
    name: 'Double Jogger',
    tagline: 'Two seats, built to run.',
    emoji: '🏃‍♀️',
    accentColor: '#3f7d83',
    accentBg: '#e9f3f3',
    description:
      'Two seats side by side on big, air-filled wheels — built to roll over trails, gravel, and a real running pace with both kids along for the ride. If you run (or just spend a lot of time on rough ground) and you have two little ones, this is the rare stroller made for exactly that.',
    rightFor: [
      'Parents of two who actually run, jog, or power-walk',
      'Two kids plus lots of trails, gravel, grass, or broken sidewalks',
      'Active families who are not ready to give up the outdoors with a second baby',
      'Anyone who needs one stroller for both kids and rough ground',
    ],
    watchOut:
      'These are wide and heavy — among the widest strollers on the road. Measure your doorways, car trunk, and storage before you buy, and know it is overkill if you never actually run or hit rough ground.',
    imageSrc: '/assets/strollers/urbnglide.png',
    picks: [
      {
        name: 'BOB Revolution Flex 3.0 Duallie',
        tagline: 'The classic running double — plush suspension, smooth at speed.',
        brand: 'BOB',
        model: 'Revolution Flex 3.0 Duallie',
        imageSrc: '/assets/strollers/revolution.png',
      },
      {
        name: 'Thule Urban Glide 2 Double',
        tagline: 'Lighter and nimble for a double — easy to steer one-handed.',
        brand: 'Thule',
        model: 'Urban Glide 2 Double',
        imageSrc: '/assets/strollers/urbnglide.png',
      },
      {
        name: 'Baby Jogger Summit X3 Double',
        tagline: 'A true double jogger with all-wheel suspension and air tires for real pace.',
        brand: 'Baby Jogger',
        model: 'Summit X3 Double',
      },
    ],
  },
};

// ─── Scoring ───────────────────────────────────────────────────────────────────

function scoreAnswers(answers: Record<string, number>): CategoryKey {
  const totals: Record<CategoryKey, number> = {
    'full-size': 0,
    compact: 0,
    travel: 0,
    convertible: 0,
    double: 0,
    jogging: 0,
    'double-jogging': 0,
  };

  let allowedCategories: CategoryKey[] | null = null;

  for (const [questionId, answerIndex] of Object.entries(answers)) {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) continue;
    const answer = question.answers[answerIndex];
    if (!answer) continue;
    for (const [cat, pts] of Object.entries(answer.scores) as [CategoryKey, number][]) {
      totals[cat] += pts;
    }
    if (answer.forceCategories) {
      // Intersect with any previously accumulated constraint
      allowedCategories = allowedCategories
        ? allowedCategories.filter((k) => answer.forceCategories!.includes(k))
        : [...answer.forceCategories];
    }
  }

  const sorted = (Object.entries(totals) as [CategoryKey, number][]).sort((a, b) => b[1] - a[1]);

  if (allowedCategories && allowedCategories.length > 0) {
    const constrained = sorted.filter(([k]) => allowedCategories!.includes(k));
    if (constrained.length > 0) return constrained[0]![0];
  }

  return sorted[0]![0];
}

// ─── Category → strollerCategory mapping ──────────────────────────────────────

const CATEGORY_TO_STROLLER_TYPES: Record<CategoryKey, StrollerCategory[]> = {
  'full-size':   ['full-size', 'full-size-non-modular'],
  'compact':     ['compact', 'umbrella'],
  'travel':      ['travel'],
  'convertible': ['convertible-modular', 'convertible-non-modular'],
  'double':      ['double', 'double-travel'],
  'jogging':     ['jogging', 'wagon'],
  'double-jogging': ['double-jogging'],
};

// The browse list is sourced from the live affiliate catalog (same /api/catalog/
// strollers the finder uses), shaped brand → type → products.
type RetailerOffer = { price: number | null; url: string | null };
type CatalogProduct = {
  name: string;
  model: string;
  price: number | null;
  image: string | null;
  affiliateUrl: string | null;
  retailers?: {
    babylist?: RetailerOffer | null;
    anb?: RetailerOffer | null;
    goodbuygear?: RetailerOffer | null;
  } | null;
};
type CatalogType = { category: StrollerCategory; label: string; products: CatalogProduct[] };
type CatalogBrand = { brand: string; count: number; types: CatalogType[] };
type BabylistLookup = {
  babylistUrl: string | null;
  babylistPrice: number | null;
  babylistImage: string | null;
  openBoxPrice: number | null;
  openBoxUrl: string | null;
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StrollerQuiz() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<CategoryResult | null>(null);
  const [pickData, setPickData] = useState<Record<string, BabylistLookup>>({});
  // The full per-category browse list comes straight from the affiliate catalog.
  const [catalogBrands, setCatalogBrands] = useState<CatalogBrand[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/catalog/strollers')
      .then((r) => (r.ok ? r.json() : { brands: [] }))
      .then((d) => {
        if (!cancelled) setCatalogBrands(Array.isArray(d.brands) ? d.brands : []);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // When a result is shown, pull live Babylist price/link for its picks from the
  // synced DB. Unmatched picks come back as nulls and fall back to the static map.
  useEffect(() => {
    if (!result) return;
    const items = result.picks.map((p) => `${p.brand}:::${p.model}`).join(',');
    let cancelled = false;
    fetch(`/api/babylist/lookup?items=${encodeURIComponent(items)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((payload) => {
        if (!cancelled && payload?.results) setPickData(payload.results);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [result]);
  const [showAllStrollers, setShowAllStrollers] = useState(false);

  const question = QUESTIONS[currentQ]!;
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  function handleSelect(index: number) {
    setSelected(index);
  }

  function handleNext() {
    if (selected === null) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      const winner = scoreAnswers(newAnswers);
      setResult(CATEGORIES[winner]);
      setStep('result');
    }
  }

  function handleRestart() {
    setStep('intro');
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setResult(null);
    setShowAllStrollers(false);
  }

  if (step === 'intro') {
    return (
      <div className="tool-shell" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={styles.introIcon}>🛒</div>
        <h2 style={styles.introTitle}>Find the Stroller That Fits Your Life</h2>
        <p style={styles.introSubtext}>
          There is no single best stroller — only the one that fits your actual life. Answer a
          handful of quick questions about your days, and we'll match you to the kind of stroller
          that fits, with specific picks for your result.
        </p>
        <div style={styles.categoryPreview}>
          {Object.values(CATEGORIES).map((cat) => (
            <span key={cat.key} style={{ ...styles.categoryChip, background: cat.accentBg, color: cat.accentColor }}>
              {cat.emoji} {cat.name}
            </span>
          ))}
        </div>
        <button style={styles.primaryBtn} onClick={() => setStep('quiz')}>
          Start the Quiz →
        </button>
        <p style={styles.timeNote}>Takes about 3 minutes</p>
      </div>
    );
  }

  if (step === 'quiz') {
    return (
      <div className="tool-shell" style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Progress */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.progressLabel}>
          Question {currentQ + 1} of {QUESTIONS.length}
        </p>

        {/* Question */}
        <h2 style={styles.questionText}>{question.question}</h2>
        {question.subtext && <p style={styles.questionSub}>{question.subtext}</p>}

        {/* Answers */}
        <div style={styles.answersGrid}>
          {question.answers.map((answer, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              style={{
                ...styles.answerCard,
                ...(selected === i ? styles.answerCardSelected : {}),
              }}
            >
              <span style={styles.answerLabel}>{answer.label}</span>
              {answer.sublabel && (
                <span style={styles.answerSublabel}>{answer.sublabel}</span>
              )}
              {selected === i && <span style={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div style={styles.navRow}>
          {currentQ > 0 && (
            <button
              style={styles.backBtn}
              onClick={() => {
                setCurrentQ((q) => q - 1);
                setSelected(answers[QUESTIONS[currentQ - 1]!.id] ?? null);
              }}
            >
              ← Back
            </button>
          )}
          <button
            style={{
              ...styles.primaryBtn,
              marginLeft: 'auto',
              opacity: selected === null ? 0.45 : 1,
              cursor: selected === null ? 'not-allowed' : 'pointer',
            }}
            onClick={handleNext}
            disabled={selected === null}
          >
            {currentQ < QUESTIONS.length - 1 ? 'Next →' : 'See My Result →'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div>
        {/* Result hero */}
        <div style={{ ...styles.resultHero, borderColor: result.accentColor, background: result.accentBg }}>
          <p style={{ ...styles.resultEyebrow, color: result.accentColor }}>Your stroller category</p>
          <div style={styles.resultTitleRow}>
            <span style={styles.resultEmoji}>{result.emoji}</span>
            <h2 style={{ ...styles.resultTitle, color: result.accentColor }}>{result.name}</h2>
          </div>
          <p style={styles.resultTagline}>{result.tagline}</p>
          <p style={styles.resultDescription}>{result.description}</p>
        </div>

        {/* Right for / Watch out */}
        <div style={styles.twoCol}>
          <div style={styles.infoBox}>
            <p style={styles.infoBoxLabel}>✓ Right for you if</p>
            <ul style={styles.infoList}>
              {result.rightFor.map((item, i) => (
                <li key={i} style={styles.infoItem}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ ...styles.infoBox, background: '#fdf8f5', borderColor: '#e8d5c8' }}>
            <p style={{ ...styles.infoBoxLabel, color: '#8b5e3c' }}>⚠ Pass if</p>
            <p style={styles.infoText}>{result.watchOut}</p>
          </div>
        </div>

        {/* Product picks */}
        <div style={styles.picksSection}>
          <p style={styles.picksSectionLabel}>Taylor's top picks in this category</p>
          <div style={styles.picksGrid}>
            {result.picks.map((pick, i) => (
              <div key={i} style={styles.pickCard}>
                {(() => {
                  // Prefer the live Babylist product photo when this pick is synced.
                  const live = pickData[`${pick.brand}:::${pick.model}`];
                  const imgSrc = live?.babylistImage ?? pick.imageSrc;
                  const openBoxOffer =
                    live && (live.openBoxUrl || live.openBoxPrice != null)
                      ? { price: live.openBoxPrice, url: live.openBoxUrl }
                      : null;
                  return (
                    <>
                      <OpenBoxBadge offer={openBoxOffer} />
                      {imgSrc ? (
                        <div style={styles.pickImgWrap}>
                          <img src={imgSrc} alt={pick.name} style={styles.pickImg} />
                        </div>
                      ) : null}
                    </>
                  );
                })()}
                {i === 0 && (
                  <span style={{ ...styles.pickBadge, background: result.accentColor }}>Top Pick</span>
                )}
                <p style={styles.pickName}>{pick.name}</p>
                <p style={styles.pickTagline}>{pick.tagline}</p>
                {(() => {
                  const links = getAffiliateLinks(pick.brand, pick.model);
                  const live = pickData[`${pick.brand}:::${pick.model}`];
                  const babylistUrl = babylistAffiliateUrl(pick.brand, pick.model, 'stroller', live?.babylistUrl);
                  return (
                    <>
                      {live?.babylistPrice ? (
                        <p style={{ margin: '0.15rem 0 0.55rem', fontSize: '0.98rem', fontWeight: 700, color: 'var(--gold)' }}>
                          ${live.babylistPrice.toFixed(2)}
                          <span style={{ marginLeft: '0.4rem', fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#9b9499' }}>
                            via Babylist
                          </span>
                        </p>
                      ) : null}
                    <div style={styles.shopBtnRow}>
                      {babylistUrl && (
                        <a
                          href={babylistUrl}
                          target="_blank"
                          rel="sponsored nofollow noopener noreferrer"
                          style={styles.shopBtnBabylist}
                        >
                          <svg width="12" height="11" viewBox="0 0 16 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M8 13S1 8.5 1 4.5A3.5 3.5 0 0 1 7.75 2.9 3.5 3.5 0 0 1 15 4.5C15 8.5 8 13 8 13Z" fill="#f26b8a" stroke="#f26b8a" strokeWidth="0.5" strokeLinejoin="round" />
                          </svg>
                          Babylist
                        </a>
                      )}
                      {links.amazonUrl && (
                        <a
                          href={links.amazonUrl}
                          target="_blank"
                          rel="sponsored nofollow noopener noreferrer"
                          style={styles.shopBtnAmazon}
                        >
                          <svg width="14" height="11" viewBox="0 0 18 15" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <text x="1" y="10" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#1a1a1a">a</text>
                            <path d="M2 12.5 Q7 15 13.5 12.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                            <path d="M11.8 11.6 L13.5 12.5 L12 13.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                          Amazon
                        </a>
                      )}
                    </div>
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        {/* Browse all strollers in this category — live from the affiliate catalog */}
        {(() => {
          const matchedTypes = CATEGORY_TO_STROLLER_TYPES[result.key];
          const pickModels = new Set(result.picks.map((p) => `${p.brand}:::${p.model}`.toLowerCase()));
          const seen = new Set<string>();
          const categoryStrollers = catalogBrands
            .flatMap((b) =>
              b.types
                .filter((t) => matchedTypes.includes(t.category))
                .flatMap((t) => t.products.map((p) => ({ ...p, brand: b.brand }))),
            )
            .filter((p) => {
              const key = `${p.brand}:::${p.model}`.toLowerCase();
              if (!p.model || pickModels.has(key) || seen.has(key)) return false;
              seen.add(key);
              return true;
            });
          if (categoryStrollers.length === 0) return null;
          const INITIAL_COUNT = 6;
          const visible = showAllStrollers ? categoryStrollers : categoryStrollers.slice(0, INITIAL_COUNT);
          return (
            <div style={styles.allStrollersSection}>
              <p style={styles.allStrollersLabel}>All strollers in this category</p>
              <p style={styles.allStrollersSublabel}>
                Every {result.name.toLowerCase()} stroller in our live catalog — prices and links straight from Babylist.
              </p>
              <div style={styles.allStrollersGrid}>
                {visible.map((s, i) => {
                  const links = getAffiliateLinks(s.brand, s.model);
                  const babylistUrl = babylistAffiliateUrl(s.brand, s.model, 'stroller', s.affiliateUrl);
                  return (
                    <div key={`${s.brand}-${s.model}-${i}`} style={styles.allStrollerCard}>
                      <OpenBoxBadge offer={s.retailers?.goodbuygear ?? null} />
                      {s.image ? (
                        <div style={styles.allStrollerImgWrap}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.image} alt={s.name} style={styles.pickImg} />
                        </div>
                      ) : null}
                      <p style={styles.allStrollerBrand}>{s.brand}</p>
                      <p style={styles.allStrollerModel}>{s.model}</p>
                      {s.price != null ? (
                        <p style={styles.allStrollerPrice}>
                          ${s.price.toFixed(2)}
                          <span style={styles.allStrollerPriceNote}>via Babylist</span>
                        </p>
                      ) : null}
                      <div style={styles.shopBtnRow}>
                        <a href={babylistUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" style={styles.shopBtnBabylist}>
                          <svg width="12" height="11" viewBox="0 0 16 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M8 13S1 8.5 1 4.5A3.5 3.5 0 0 1 7.75 2.9 3.5 3.5 0 0 1 15 4.5C15 8.5 8 13 8 13Z" fill="#f26b8a" stroke="#f26b8a" strokeWidth="0.5" strokeLinejoin="round" />
                          </svg>
                          Babylist
                        </a>
                        {links.amazonUrl && (
                          <a href={links.amazonUrl} target="_blank" rel="sponsored nofollow noopener noreferrer" style={styles.shopBtnAmazon}>
                            <svg width="14" height="11" viewBox="0 0 18 15" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                              <text x="1" y="10" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#1a1a1a">a</text>
                              <path d="M2 12.5 Q7 15 13.5 12.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                              <path d="M11.8 11.6 L13.5 12.5 L12 13.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                            Amazon
                          </a>
                        )}
                      </div>
                      <Link
                        href={travelSystemResultsHref('stroller', { brand: s.brand, model: s.model })}
                        style={styles.compatLink}
                      >
                        Compatible car seats →
                      </Link>
                    </div>
                  );
                })}
              </div>
              {categoryStrollers.length > INITIAL_COUNT && (
                <button style={styles.showAllBtn} onClick={() => setShowAllStrollers((v) => !v)}>
                  {showAllStrollers
                    ? `Show fewer`
                    : `Show all ${categoryStrollers.length} options →`}
                </button>
              )}
            </div>
          );
        })()}

        {/* Blog link */}
        {result.blogHref && (
          <a href={result.blogHref} style={styles.blogLink}>
            <span style={styles.blogLinkInner}>
              <span style={styles.blogLinkText}>
                <span style={styles.blogLinkEyebrow}>Read the full guide</span>
                <span style={styles.blogLinkTitle}>{result.blogTitle}</span>
              </span>
              <span style={styles.blogLinkArrow}>→</span>
            </span>
          </a>
        )}

        {/* Retake */}
        <div style={styles.retakeRow}>
          <button style={styles.backBtn} onClick={handleRestart}>
            ← Retake the quiz
          </button>
          <p style={styles.retakeNote}>
            Not sure? <a href="/book" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>Book a consultation</a> — Taylor can talk you through it.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: '#fff',
    borderRadius: '1.5rem',
    padding: 'clamp(1.5rem, 5vw, 3rem)',
    boxShadow: '0 18px 44px rgba(58,36,43,0.06)',
    border: '1px solid #efcad1',
    maxWidth: '720px',
    margin: '0 auto',
  },
  introIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  introTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 600,
    color: '#3d2328',
    textAlign: 'center',
    marginBottom: '0.75rem',
  },
  introSubtext: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1rem',
    color: '#6b5055',
    textAlign: 'center',
    lineHeight: 1.65,
    marginBottom: '1.5rem',
    maxWidth: '520px',
    margin: '0 auto 1.5rem',
  },
  categoryPreview: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  categoryChip: {
    fontSize: '0.75rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    letterSpacing: '0.01em',
  },
  progressBar: {
    height: '3px',
    background: '#f4e0e4',
    borderRadius: '999px',
    marginBottom: '0.5rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--color-cta-pink, #D889A0), var(--color-accent, #e89aae))',
    borderRadius: '999px',
    transition: 'width 0.35s ease',
  },
  progressLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    color: '#a07880',
    marginBottom: '1.75rem',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  questionText: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
    fontWeight: 600,
    color: '#3d2328',
    marginBottom: '0.5rem',
    lineHeight: 1.3,
  },
  questionSub: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    color: '#8a6068',
    marginBottom: '1.5rem',
    fontStyle: 'italic',
  },
  answersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  answerCard: {
    position: 'relative',
    background: '#fdfaf9',
    border: '1.5px solid #efcad1',
    borderRadius: '1rem',
    padding: '1rem 1.25rem',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  answerCardSelected: {
    background: '#fef0f3',
    borderColor: 'var(--color-cta-pink, #D889A0)',
    boxShadow: '0 0 0 2px rgba(216,137,160,0.3)',
  },
  answerLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#3d2328',
    lineHeight: 1.3,
  },
  answerSublabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    color: '#8a6068',
    lineHeight: 1.4,
  },
  checkmark: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    color: 'var(--color-accent, #e89aae)',
    fontWeight: 700,
    fontSize: '1rem',
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  primaryBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#fff',
    background: 'var(--color-cta-pink, #D889A0)',
    border: 'none',
    borderRadius: '999px',
    padding: '0.8rem 1.9rem',
    cursor: 'pointer',
    letterSpacing: '0.02em',
    boxShadow: '0 8px 20px rgba(216,137,160,0.26)',
    transition: 'background 0.15s ease',
    display: 'block',
  },
  backBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#a07880',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem 0',
  },
  timeNote: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    color: '#a07880',
    textAlign: 'center',
    marginTop: '0.75rem',
  },
  resultHero: {
    borderRadius: '1.5rem',
    border: '2px solid',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    marginBottom: '1.5rem',
  },
  resultEyebrow: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  resultTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  resultEmoji: {
    fontSize: '2rem',
  },
  resultTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
    fontWeight: 700,
    lineHeight: 1.15,
  },
  resultTagline: {
    fontFamily: 'var(--font-accent)',
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: '#5a3a3e',
    fontStyle: 'italic',
    marginBottom: '0.75rem',
  },
  resultDescription: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    color: '#4a3035',
    lineHeight: 1.7,
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  infoBox: {
    background: '#f5f9f6',
    borderRadius: '1rem',
    border: '1px solid #c8dece',
    padding: '1.25rem',
  },
  infoBoxLabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#4a7a5a',
    marginBottom: '0.75rem',
  },
  infoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  infoItem: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    color: '#3a4a3e',
    lineHeight: 1.5,
    paddingLeft: '1rem',
    position: 'relative',
  },
  infoText: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    color: '#5a3a28',
    lineHeight: 1.6,
  },
  picksSection: {
    marginBottom: '1.5rem',
  },
  picksSectionLabel: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#3d2328',
    marginBottom: '1rem',
  },
  picksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  pickCard: {
    position: 'relative',
    background: '#fff',
    border: '1px solid rgba(215,161,175,0.2)',
    borderRadius: '1.25rem',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    boxShadow: '0 6px 18px rgba(72,49,56,0.05)',
    overflow: 'hidden',
  },
  pickImgWrap: {
    width: '100%',
    height: '140px',
    background: '#fdf8f5',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.25rem',
    overflow: 'hidden',
  },
  pickImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
    padding: '0.5rem',
  },
  pickBadge: {
    display: 'inline-block',
    fontSize: '0.65rem',
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#fff',
    padding: '0.2rem 0.6rem',
    borderRadius: '999px',
    width: 'fit-content',
    marginBottom: '0.25rem',
  },
  pickName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#3d2328',
  },
  pickTagline: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    color: '#7a5860',
    lineHeight: 1.4,
    flex: 1,
  },
  shopBtnRow: {
    display: 'flex',
    gap: '0.4rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap',
  },
  shopBtnBabylist: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#4a252f',
    padding: '0.45rem 0.85rem',
    borderRadius: '999px',
    textDecoration: 'none',
    border: '1px solid rgba(215,161,175,0.34)',
    background: 'rgba(255,240,244,0.96)',
    boxShadow: '0 8px 18px rgba(216,137,160,0.14)',
    whiteSpace: 'nowrap' as const,
  },
  shopBtnAmazon: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#1a1a1a',
    padding: '0.45rem 0.85rem',
    borderRadius: '999px',
    textDecoration: 'none',
    border: '1px solid rgba(0,0,0,0.1)',
    background: '#fff',
    whiteSpace: 'nowrap' as const,
  },
  allStrollersSection: {
    marginBottom: '1.5rem',
    borderTop: '1px solid #efcad1',
    paddingTop: '1.5rem',
  },
  allStrollersLabel: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#3d2328',
    marginBottom: '0.35rem',
  },
  allStrollersSublabel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.82rem',
    color: '#8a6068',
    lineHeight: 1.55,
    marginBottom: '1rem',
  },
  allStrollerImgWrap: {
    width: '100%',
    height: '120px',
    background: '#fdf8f5',
    borderRadius: '0.65rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
    overflow: 'hidden',
  },
  allStrollerPrice: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--gold)',
    margin: '0 0 0.35rem',
  },
  allStrollerPriceNote: {
    marginLeft: '0.4rem',
    fontSize: '0.58rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.14em',
    color: '#9b9499',
  },
  compatLink: {
    display: 'inline-block',
    marginTop: '0.55rem',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.73rem',
    fontWeight: 700,
    color: '#704756',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(112,71,86,0.24)',
    width: 'fit-content',
  },
  allStrollersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  allStrollerCard: {
    position: 'relative',
    background: '#fff',
    border: '1px solid rgba(215,161,175,0.2)',
    borderRadius: '1.25rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    boxShadow: '0 6px 18px rgba(72,49,56,0.05)',
    overflow: 'hidden',
  },
  allStrollerBrand: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#a07880',
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
  },
  allStrollerModel: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#3d2328',
    marginBottom: '0.35rem',
  },
  allStrollerNoLink: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    color: '#a07880',
    fontStyle: 'italic',
  },
  showAllBtn: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--color-accent, #e89aae)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem 0',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  blogLink: {
    display: 'block',
    background: '#fdfaf9',
    border: '1px solid #efcad1',
    borderRadius: '1rem',
    padding: '1rem 1.25rem',
    textDecoration: 'none',
    marginBottom: '1.5rem',
    transition: 'background 0.15s ease',
  },
  blogLinkInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  blogLinkText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  blogLinkEyebrow: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#a07880',
  },
  blogLinkTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#3d2328',
  },
  blogLinkArrow: {
    fontSize: '1.1rem',
    color: 'var(--color-accent, #e89aae)',
    flexShrink: 0,
  },
  retakeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.75rem',
    paddingTop: '1rem',
    borderTop: '1px solid #f0e0e4',
  },
  retakeNote: {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8rem',
    color: '#8a6068',
  },
};
