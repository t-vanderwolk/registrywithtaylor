'use client';

import { useState } from 'react';
import { getAffiliateLinks } from '@/lib/travelSystemAffiliateLinks';

// ─── Types ─────────────────────────────────────────────────────────────────────

type CategoryKey =
  | 'full-size'
  | 'compact'
  | 'travel'
  | 'convertible'
  | 'double'
  | 'jogging';

type AnswerScore = Partial<Record<CategoryKey, number>>;

type Answer = {
  label: string;
  sublabel?: string;
  scores: AnswerScore;
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
    id: 'kids',
    question: 'How many children will this stroller serve?',
    subtext: 'Be honest about your current situation, not your someday plan.',
    answers: [
      {
        label: 'One baby on the way',
        sublabel: 'No sibling plans in the near future',
        scores: { 'full-size': 1, compact: 1, travel: 1, jogging: 1 },
      },
      {
        label: 'Two kids close in age',
        sublabel: 'Both need a seat most outings — now',
        scores: { double: 5 },
      },
      {
        label: 'Twins or multiples',
        sublabel: 'Two seats from the start',
        scores: { double: 5 },
      },
      {
        label: 'One now, sibling likely soon',
        sublabel: 'Real timeline, not a vague someday',
        scores: { convertible: 4, 'full-size': 1 },
      },
    ],
  },
  {
    id: 'lifestyle',
    question: 'What does a typical week look like for you?',
    subtext: 'Pick the option that most honestly describes your actual days.',
    answers: [
      {
        label: 'Lots of walks — stroller gets real use',
        sublabel: 'Parks, neighborhood loops, errands on foot',
        scores: { 'full-size': 3, jogging: 1 },
      },
      {
        label: 'Mostly driving to places',
        sublabel: 'Stroller gets folded in and out of the car often',
        scores: { compact: 3, travel: 1 },
      },
      {
        label: 'City life — transit, tight spaces, stairs',
        sublabel: 'Elevators, buses, cramped sidewalks',
        scores: { compact: 2, travel: 2 },
      },
      {
        label: 'Active — I run or hike regularly',
        sublabel: 'Trails, gravel, or I want to jog with baby',
        scores: { jogging: 4 },
      },
    ],
  },
  {
    id: 'storage',
    question: 'Where will this stroller live?',
    subtext: 'Storage reality matters more than people expect.',
    answers: [
      {
        label: 'Garage or large closet — no problem',
        sublabel: 'Space is not a daily constraint',
        scores: { 'full-size': 2, jogging: 2, convertible: 1 },
      },
      {
        label: 'Apartment or small space',
        sublabel: 'Compact fold is non-negotiable',
        scores: { compact: 3, travel: 2 },
      },
      {
        label: 'Small car trunk',
        sublabel: 'It has to fit without rearranging everything',
        scores: { compact: 2, travel: 2 },
      },
      {
        label: 'Multiple homes or caregivers',
        sublabel: 'Needs to travel between grandparents, daycare, etc.',
        scores: { travel: 3, compact: 1 },
      },
    ],
  },
  {
    id: 'travel',
    question: 'How often do you travel by plane or rideshare?',
    answers: [
      {
        label: 'Rarely or never',
        sublabel: 'We mostly stay local',
        scores: { 'full-size': 2, jogging: 1 },
      },
      {
        label: 'A few trips a year',
        sublabel: 'Occasional flights, not a defining factor',
        scores: { compact: 2, 'full-size': 1 },
      },
      {
        label: 'Frequently — we fly or rideshare regularly',
        sublabel: 'Gate check, ride-share friendly is essential',
        scores: { travel: 4, compact: 1 },
      },
    ],
  },
  {
    id: 'system',
    question: 'Does your stroller need to work as a complete newborn system?',
    subtext:
      'Modular strollers have a bassinet that attaches to the frame, a reversible or removable seat, and infant car seat click-in with adapters. Travel strollers typically skip all of this in favor of fold.',
    answers: [
      {
        label: 'Yes — bassinet, reversible seat, and car seat adapters all matter',
        sublabel: 'I want one frame that handles every stage from newborn',
        scores: { compact: 4, 'full-size': 2 },
      },
      {
        label: 'Car seat compatibility yes, full bassinet is less important',
        sublabel: 'Adapter support matters; I can solve the bassinet phase separately',
        scores: { compact: 3, 'full-size': 1 },
      },
      {
        label: 'No — I just need it to fold small and be easy to carry',
        sublabel: 'Portability is the whole job; I\'ll solve newborn stage another way',
        scores: { travel: 4 },
      },
      {
        label: 'I already have a newborn solution sorted',
        sublabel: 'Bassinet and car seat aren\'t factors in my stroller decision',
        scores: { travel: 1, compact: 1, 'full-size': 1 },
      },
    ],
  },
  {
    id: 'priority',
    question: 'What matters most to you in a stroller?',
    subtext: 'Pick your actual priority, not the answer that sounds best.',
    answers: [
      {
        label: 'Push quality and basket size',
        sublabel: 'Smooth ride, easy to load, comfortable for long walks',
        scores: { 'full-size': 3 },
      },
      {
        label: 'Easy fold and lighter weight',
        sublabel: 'Quick in and out, less mental overhead daily',
        scores: { compact: 3, travel: 1 },
      },
      {
        label: 'Handles any terrain I throw at it',
        sublabel: 'Rough ground, gravel, grass — I need real wheels',
        scores: { jogging: 4 },
      },
      {
        label: 'Room to grow with my family',
        sublabel: 'Expandable, adaptable, long investment horizon',
        scores: { convertible: 3, 'full-size': 1 },
      },
    ],
  },
  {
    id: 'budget',
    question: 'What is your budget for a stroller?',
    subtext: 'More money usually buys lighter weight and better push — not necessarily the right category.',
    answers: [
      {
        label: 'Under $400',
        sublabel: 'Value-forward pick',
        scores: { compact: 2, travel: 1 },
      },
      {
        label: '$400 – $800',
        sublabel: 'Mid-range sweet spot',
        scores: { compact: 1, 'full-size': 1, travel: 1, jogging: 1 },
      },
      {
        label: '$800 – $1,200',
        sublabel: 'Premium territory',
        scores: { 'full-size': 2, jogging: 1, convertible: 1 },
      },
      {
        label: '$1,200+',
        sublabel: 'Top-tier investment',
        scores: { 'full-size': 2, convertible: 2 },
      },
    ],
  },
  {
    id: 'dealbreaker',
    question: 'What would you absolutely hate to deal with daily?',
    answers: [
      {
        label: 'A heavy, bulky stroller I have to muscle into my trunk',
        sublabel: 'Weight and fold size are my top concern',
        scores: { compact: 3, travel: 2 },
      },
      {
        label: 'A stroller that can\'t handle rough ground',
        sublabel: 'I need real suspension and bigger wheels',
        scores: { jogging: 3 },
      },
      {
        label: 'Outgrowing it too fast or having to buy a second',
        sublabel: 'I want this to last or expand',
        scores: { convertible: 3, 'full-size': 1 },
      },
      {
        label: 'A tight, cramped seat that doesn\'t recline well',
        sublabel: 'Baby comfort and longevity matter',
        scores: { 'full-size': 3 },
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
      'Full-size strollers are built for families who will actually use what a bigger frame gives back — better push quality, a large basket, deeper recline, and a seat that lasts well into toddlerhood. You pay for it in weight and fold size, but families who use it daily never regret it.',
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
      },
      {
        name: 'Nuna MIXX Next',
        tagline: 'Reversible seat, one-hand fold, grows to a second child.',
        brand: 'Nuna',
        model: 'MIXX next',
      },
      {
        name: 'Silver Cross Reef 2',
        tagline: 'Premium full-size comfort with genuine seat longevity into toddlerhood.',
        brand: 'Silver Cross',
        model: 'Reef 2',
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
      'Compact strollers are lighter, fold smaller, and move through parking lots and tight spaces without the drama. You give up some basket depth and push quality over distance, but most families in this lane never miss what they traded away — because what they gained is daily ease.',
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
      },
      {
        name: 'Cybex Mios',
        tagline: 'Sleek mid-size with modular seat and urban maneuverability.',
        brand: 'CYBEX',
        model: 'Mios',
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
      'Travel strollers are built for transit — airports, ride shares, grandparents\' houses, and any situation where the fold, carry weight, and storage footprint are the whole point. The push experience takes a back seat when portability is the job.',
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
      'Convertible strollers start as a single and expand to accommodate a second child later. The ones worth buying are modular: both seats are the same seat — not a smaller sibling seat bolted on — and the frame in single mode typically gains an extra basket or cargo attachment where the second seat will eventually live. True modular convertibles include the Cybex Gazelle S, Nuna DEMI Next, Bugaboo Donkey 6, and Veer Switchback and Roll. This is what makes them a strategic purchase rather than a compromise. You live with more frame before the second seat arrives, so the sibling timeline needs to be real.',
    rightFor: [
      'Families with a real, near-term sibling timeline (within 2–3 years)',
      'Parents who want one frame that grows rather than buying a separate double later',
      'Households where the expansion path is specific, not a hopeful maybe',
      'Buyers who want equal comfort for both children — a true modular design uses the same seat for child one and child two',
    ],
    watchOut:
      'Not all convertibles are created equal. Avoid designs where the second seat is noticeably smaller or less reclined — that\'s not a true modular convertible, it\'s a compromise. The Silver Cross Wave, UPPAbaby Vista, Orbit Baby G5, and Bugaboo Kangaroo all fall into this category: they expand, but the second seat is a different (typically smaller) seat. If the sibling timeline is still fuzzy, a convertible adds daily bulk in exchange for future flexibility you may not need.',
    imageSrc: '/assets/strollers/convertable.png',
    picks: [
      {
        name: 'Bugaboo Donkey 6',
        tagline: 'The benchmark convertible. Mono to duo seamlessly.',
        brand: 'Bugaboo',
        model: 'Donkey 6',
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
      'Double strollers are built for two riders today — twins, close age gaps, or two children who genuinely both need seats on most outings. This is a different brief than convertible planning. You are solving a current, present-tense problem, and the stroller is sized for it.',
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
        name: 'Bugaboo Donkey 6',
        tagline: 'Widest in-class basket. Still manageable for a double.',
        brand: 'Bugaboo',
        model: 'Donkey 6',
      },
      {
        name: 'Baby Jogger City Select 2',
        tagline: 'Inline configuration — fits through more doorways.',
        brand: 'Baby Jogger',
        model: 'City Select 2',
      },
      {
        name: 'Nuna DEMI Next',
        tagline: 'Side-by-side comfort, surprisingly manageable.',
        brand: 'Nuna',
        model: 'DEMI next',
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
      'Jogging and all-terrain strollers have larger wheels, stronger suspension, and a fixed or lockable front wheel for stability at speed. They are built for routes that defeat smaller wheels — trails, gravel, broken sidewalks, grass, and actual running pace.',
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
      },
      {
        name: 'Thule Urban Glide 2',
        tagline: 'Lighter than BOB, smoother on-road, still trail-capable.',
        brand: 'Thule',
        model: 'Urban Glide 2',
      },
      {
        name: 'UPPAbaby Ridge',
        tagline: 'Jogging-capable with a full-size seat. Best of both worlds.',
        brand: 'UPPAbaby',
        model: 'Ridge',
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
  };

  for (const [questionId, answerIndex] of Object.entries(answers)) {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) continue;
    const answer = question.answers[answerIndex];
    if (!answer) continue;
    for (const [cat, pts] of Object.entries(answer.scores) as [CategoryKey, number][]) {
      totals[cat] += pts;
    }
  }

  return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]![0]) as CategoryKey;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StrollerQuiz() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<CategoryResult | null>(null);

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
  }

  if (step === 'intro') {
    return (
      <div style={styles.card}>
        <div style={styles.introIcon}>🛒</div>
        <h2 style={styles.introTitle}>Find Your Stroller Category</h2>
        <p style={styles.introSubtext}>
          There is no universal best stroller — only the one that fits your actual life. Answer 8
          quick questions and we'll match you to one of the six stroller categories, with specific
          picks for your result.
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
        <p style={styles.timeNote}>Takes about 2 minutes</p>
      </div>
    );
  }

  if (step === 'quiz') {
    return (
      <div style={styles.card}>
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
                {i === 0 && (
                  <span style={{ ...styles.pickBadge, background: result.accentColor }}>Top Pick</span>
                )}
                <p style={styles.pickName}>{pick.name}</p>
                <p style={styles.pickTagline}>{pick.tagline}</p>
                {(() => {
                  const links = getAffiliateLinks(pick.brand, pick.model);
                  return (
                    <div style={styles.shopBtnRow}>
                      {links.babylistUrl && (
                        <a
                          href={links.babylistUrl}
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
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

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
    background: 'var(--color-accent, #e89aae)',
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
    borderColor: 'var(--color-accent, #e89aae)',
    boxShadow: '0 0 0 2px rgba(232,154,174,0.25)',
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
    background: 'var(--color-accent, #e89aae)',
    border: 'none',
    borderRadius: '999px',
    padding: '0.75rem 1.75rem',
    cursor: 'pointer',
    letterSpacing: '0.02em',
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
    border: '1px solid #efcad1',
    borderRadius: '1.25rem',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    boxShadow: '0 4px 16px rgba(58,36,43,0.05)',
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
    color: '#c45075',
    padding: '0.45rem 0.85rem',
    borderRadius: '999px',
    textDecoration: 'none',
    border: '1px solid rgba(215,161,175,0.4)',
    background: 'rgba(255,249,246,0.92)',
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
