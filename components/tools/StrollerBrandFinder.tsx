'use client';

import { useEffect, useState } from 'react';
import TrackedAffiliateLink from '@/components/analytics/TrackedAffiliateLink';
import { babylistAffiliateUrl } from '@/lib/travelSystemAffiliateLinks';
import styles from './StrollerBrandFinder.module.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

type StrollerModel = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  priceRange: string;
  highlights: string[];
  /** TODO: replace '#' with real affiliate URL before launch */
  shopUrl: string;
};

type StrollerBrand = {
  id: string;
  name: string;
  color: string;
  tagline: string;
  models: StrollerModel[];
};

// ─── Brand + model data ───────────────────────────────────────────────────────

const BRANDS: StrollerBrand[] = [
  {
    id: 'nuna',
    name: 'Nuna',
    color: '#7a9e7e',
    tagline: 'Safety-forward, Scandinavian design sensibility.',
    models: [
      {
        id: 'nuna-demi-grow',
        name: 'Demi Grow',
        category: 'Single-to-Double Convertible',
        tagline:
          'A modular system that grows with your family without making you pay the bulk tax from day one.',
        priceRange: '$750–$900',
        highlights: [
          'Expands to seat two children on the same frame — no new stroller needed',
          'Compatible with Nuna PIPA series infant car seats',
          'Folds with the seat on, compact for a modular system',
          'Four-wheel suspension and premium push quality from day one',
        ],
        shopUrl: '#', // TODO: affiliate URL
      },
      {
        id: 'nuna-mixx-next',
        name: 'MIXX Next',
        category: 'Full Size / Modular',
        tagline: 'A capable everyday frame with reversible seat and premium push quality.',
        priceRange: '$800–$950',
        highlights: [
          'Reversible seat lets you keep baby facing you or facing the world',
          'One-hand recline, large UPF 50+ canopy',
          'Compatible with PIPA series car seats for easy click-in',
          'Smooth push across surfaces with all-wheel suspension',
        ],
        shopUrl: '#',
      },
      {
        id: 'nuna-triv-next',
        name: 'TRIV Next',
        category: 'Compact / Mid-Size',
        tagline: 'Nuna quality in a lighter, car-trunk-friendly package.',
        priceRange: '$650–$750',
        highlights: [
          'Lighter and more compact fold than the MIXX — easier daily carry',
          'Reversible seat with quality canopy coverage',
          'Compatible with PIPA series car seats',
          'Better fit for car-heavy routines without trading away push quality',
        ],
        shopUrl: '#',
      },
      {
        id: 'nuna-trvl',
        name: 'TRVL',
        category: 'Travel',
        tagline: 'A thoughtfully designed travel stroller that does not feel stripped down.',
        priceRange: '$700–$800',
        highlights: [
          'Overhead bin-able fold — one of the more compact carries in its class',
          'Self-standing fold, carry strap included',
          'Compatible with PIPA series infant seats for a full travel system',
          'Better canopy coverage than most in the travel category',
        ],
        shopUrl: '#',
      },
    ],
  },
  {
    id: 'bugaboo',
    name: 'Bugaboo',
    color: '#c9843e',
    tagline: 'Dutch engineering. Smooth-push, thoughtfully designed systems.',
    models: [
      {
        id: 'bugaboo-fox-5',
        name: 'Fox 5',
        category: 'Full Size / Modular',
        tagline:
          'The benchmark for premium daily push — best-in-class suspension, large basket, reversible seat.',
        priceRange: '$1,100–$1,200',
        highlights: [
          'Industry-leading suspension makes uneven terrain feel smooth',
          'Large basket accessible from front and back',
          'Reversible seat, one-hand fold, premium canopy',
          'Long seat longevity — grows with your child well past age three',
        ],
        shopUrl: '#',
      },
      {
        id: 'bugaboo-dragonfly',
        name: 'Dragonfly',
        category: 'Compact / Mid-Size',
        tagline: 'Compact footprint, above-average push quality for the category.',
        priceRange: '$900–$1,000',
        highlights: [
          'Smaller fold than the Fox 5 — better for tighter storage and trunks',
          'Reversible seat with quality push feel',
          'Good basket depth for the compact category',
          'Pairs well with Bugaboo Turtle car seat for a travel system',
        ],
        shopUrl: '#',
      },
      {
        id: 'bugaboo-butterfly',
        name: 'Butterfly',
        category: 'Travel',
        tagline:
          'One-second fold, airline carry-on compatible — Bugaboo quality in a travel-first package.',
        priceRange: '$700–$800',
        highlights: [
          'One-second fold — genuinely fast, not marketing-fast',
          'Fits overhead compartment on most airlines',
          'Compatible with Bugaboo Turtle Air for a full travel system',
          'More substantial seat feel than most travel strollers',
        ],
        shopUrl: '#',
      },
      {
        id: 'bugaboo-donkey-6',
        name: 'Donkey 6',
        category: 'Double / Convertible',
        tagline:
          'The most capable side-by-side system for families with two riders now or on a near-term timeline.',
        priceRange: '$1,400–$1,600',
        highlights: [
          'Converts from mono to duo without changing the frame',
          'Side-by-side seating — both children get equal canopy and sightlines',
          'Folds more compactly than expected for a two-seat system',
          'Long product life — used by families across multiple children',
        ],
        shopUrl: '#',
      },
    ],
  },
  {
    id: 'mockingbird',
    name: 'Mockingbird',
    color: '#c08080',
    tagline: 'Value-leader in the modular space. Capable without the price tag.',
    models: [
      {
        id: 'mockingbird-single-to-double',
        name: 'Single-to-Double 2.0',
        category: 'Single-to-Double Convertible',
        tagline:
          'The most affordable modular system that takes the convertible category seriously.',
        priceRange: '$550–$650',
        highlights: [
          'Expands to a full two-seat configuration — second seat sold separately',
          'Reversible seat, one-hand fold, decent canopy',
          'Compatible with multiple infant car seat brands via adapters',
          'Strong value case for second-child planners watching budget',
        ],
        shopUrl: '#',
      },
      {
        id: 'mockingbird-single-2',
        name: 'Single 2',
        category: 'Compact / Mid-Size',
        tagline:
          'A capable everyday compact at a price point that leaves room for other gear.',
        priceRange: '$450–$550',
        highlights: [
          'Light, one-hand fold, generous canopy for the price',
          'Reversible seat, smooth push on typical surfaces',
          'Compatible with several infant car seat brands',
          'Right for families who want quality without the premium brand tax',
        ],
        shopUrl: '#',
      },
      {
        id: 'mockingbird-sport',
        name: 'Sport',
        category: 'Jogging / All-Terrain',
        tagline:
          'All-terrain capability at a price that does not make jogging feel expensive.',
        priceRange: '$500–$600',
        highlights: [
          'Air-filled tires for genuine all-terrain and jogging performance',
          'Fixed front wheel for running stability, swivel for everyday use',
          'Lockable for jogging, full recline for naps on the go',
          'Best value entry in the jogging category',
        ],
        shopUrl: '#',
      },
    ],
  },
  {
    id: 'uppababy',
    name: 'UPPAbaby',
    color: '#607d9a',
    tagline: 'Trusted modular systems with the largest ecosystem of accessories.',
    models: [
      {
        id: 'uppababy-vista-v3',
        name: 'VISTA V3',
        category: 'Single-to-Double Convertible',
        tagline:
          'The most popular modular stroller system in the premium tier — extensive ecosystem, trusted design.',
        priceRange: '$950–$1,100',
        highlights: [
          'Bassinet, second seat, and car seat adapter included or available',
          'Compatible with MESA series infant car seats and multiple other brands',
          'Enormous basket, premium push feel, toddler step included',
          'Largest ecosystem of accessories in the modular category',
        ],
        shopUrl: '#',
      },
      {
        id: 'uppababy-cruz-v2',
        name: 'CRUZ V2',
        category: 'Full Size / Modular',
        tagline:
          'VISTA-level quality in a frame designed to live a slightly more compact life.',
        priceRange: '$700–$850',
        highlights: [
          'Narrower, lighter fold than the VISTA — better for tighter storage',
          'Same push quality and reversible seat as the larger system',
          'Compatible with MESA series car seats',
          'Right when the VISTA sibling-planning logic does not apply',
        ],
        shopUrl: '#',
      },
      {
        id: 'uppababy-minu-v2',
        name: 'MINU V2',
        category: 'Travel',
        tagline: 'A compact, gate-checkable travel companion with UPPAbaby quality.',
        priceRange: '$350–$450',
        highlights: [
          'Compact self-standing fold — easier to manage alone in transit',
          'Compatible with MESA series car seats for a full travel system',
          'Good canopy, comfortable seat for a travel stroller',
          'Right for families who want UPPAbaby quality in the travel category',
        ],
        shopUrl: '#',
      },
      {
        id: 'uppababy-ridge',
        name: 'Ridge',
        category: 'Jogging / All-Terrain',
        tagline:
          'A capable running stroller that does not feel like a compromise on regular walks.',
        priceRange: '$800–$900',
        highlights: [
          'Air-filled tires with front-wheel suspension for smooth jogging',
          'Folds more compactly than most jogging strollers',
          'Compatible with MESA series car seats',
          'Balanced enough for daily use without the jogging-stroller bulk penalty',
        ],
        shopUrl: '#',
      },
    ],
  },
  {
    id: 'baby-jogger',
    name: 'Baby Jogger',
    color: '#7a6e5e',
    tagline: 'Practical, well-priced, and widely tested by real families.',
    models: [
      {
        id: 'bj-city-select-2',
        name: 'City Select 2',
        category: 'Single-to-Double Convertible',
        tagline:
          'A versatile modular system that handles the sibling transition without a frame swap.',
        priceRange: '$700–$800',
        highlights: [
          '16 riding configurations — more seat position flexibility than most',
          'Second seat available as add-on, does not require a new frame',
          'Compatible with multiple infant car seat brands',
          'Strong value in the convertible category without sacrificing capability',
        ],
        shopUrl: '#',
      },
      {
        id: 'bj-city-mini-gt2',
        name: 'City Mini GT2',
        category: 'Compact / Mid-Size',
        tagline:
          'The compact with genuine all-terrain credentials — more capable than it looks.',
        priceRange: '$350–$450',
        highlights: [
          'All-terrain wheels handle gravel, grass, and broken sidewalks better than typical compact',
          'One-hand quick fold, self-standing',
          'Large UV canopy, generous basket for the category',
          'Compatible with multiple infant car seat brands via adapters',
        ],
        shopUrl: '#',
      },
      {
        id: 'bj-city-tour-lux',
        name: 'City Tour LUX',
        category: 'Travel',
        tagline:
          'A packable travel stroller that handles everyday use better than most in the category.',
        priceRange: '$250–$350',
        highlights: [
          'Double fold — compact enough for overhead bins on most carriers',
          'Self-standing fold, carry strap included',
          'Better seat recline and canopy than most at this price',
          'Compatible with City GO 2 infant car seats',
        ],
        shopUrl: '#',
      },
    ],
  },
  {
    id: 'cybex',
    name: 'Cybex',
    color: '#7a8a9a',
    tagline: 'European design precision. Style-forward with structural quality.',
    models: [
      {
        id: 'cybex-gazelle-s2',
        name: 'Gazelle S2',
        category: 'Single-to-Double Convertible',
        tagline:
          'A modular system with more seat configuration options than most in its class.',
        priceRange: '$700–$900',
        highlights: [
          'Converts to 12 configurations including two-seat and bassinet combos',
          'Compatible with Cybex infant car seats and some universal adapters',
          'Folds with both seats — meaningful for families managing a double daily',
          'Distinctive design without the price tag of other modular systems',
        ],
        shopUrl: '#',
      },
      {
        id: 'cybex-mios',
        name: 'Mios',
        category: 'Full Size / Modular',
        tagline:
          'A stylish everyday stroller with above-average push quality for a full-size frame.',
        priceRange: '$750–$900',
        highlights: [
          'Reversible seat, lightweight aluminum frame',
          'One-hand fold, large canopy with ventilation window',
          'Compatible with Cybex Cloud and Aton infant car seats',
          'Style-forward without sacrificing everyday capability',
        ],
        shopUrl: '#',
      },
      {
        id: 'cybex-coya',
        name: 'Coya',
        category: 'Compact / Mid-Size',
        tagline:
          'A lightweight city stroller with European design in a compact, everyday package.',
        priceRange: '$550–$700',
        highlights: [
          'Lightweight aluminum frame — easy carry for urban daily use',
          'Compact fold, good canopy for the category',
          'Compatible with Cybex infant car seats',
          'Right for car-heavy or city families who want design and convenience',
        ],
        shopUrl: '#',
      },
    ],
  },
];

// ─── Category badge styling ───────────────────────────────────────────────────

const CATEGORY_BADGE: Record<string, { bg: string; color: string }> = {
  'Full Size / Modular':            { bg: 'rgba(91,127,166,0.12)',  color: 'rgba(35,65,105,0.9)' },
  'Compact / Mid-Size':             { bg: 'rgba(107,142,122,0.12)', color: 'rgba(45,85,65,0.9)'  },
  'Travel':                          { bg: 'rgba(196,133,94,0.14)',  color: 'rgba(115,65,25,0.9)' },
  'Single-to-Double Convertible':   { bg: 'rgba(175,120,160,0.12)', color: 'rgba(95,45,85,0.9)'  },
  'Double / Convertible':           { bg: 'rgba(175,120,160,0.12)', color: 'rgba(95,45,85,0.9)'  },
  'Jogging / All-Terrain':          { bg: 'rgba(120,140,90,0.12)',  color: 'rgba(55,75,25,0.9)'  },
};

function getBadgeStyle(category: string) {
  return CATEGORY_BADGE[category] ?? { bg: 'rgba(200,200,200,0.15)', color: '#404040' };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StrollerBrandFinder() {
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [live, setLive] = useState<
    Record<string, { babylistUrl: string | null; babylistPrice: number | null; babylistImage: string | null }>
  >({});

  // Pull live Babylist price/link for every model once on mount. Models that map
  // to a synced stroller get a live price + exact affiliate link; the rest fall
  // back to the static range and a brand-level affiliate link.
  useEffect(() => {
    const items = BRANDS.flatMap((b) => b.models.map((m) => `${b.name}:::${m.name}`));
    fetch(`/api/babylist/lookup?items=${encodeURIComponent(items.join(','))}`)
      .then((r) => (r.ok ? r.json() : { results: {} }))
      .then((d) => setLive(d.results ?? {}))
      .catch(() => undefined);
  }, []);

  const selectedBrand = BRANDS.find((b) => b.id === selectedBrandId) ?? null;
  const selectedModel  = selectedBrand?.models.find((m) => m.id === selectedModelId) ?? null;
  const badgeStyle     = selectedModel ? getBadgeStyle(selectedModel.category) : null;

  const selectedLive =
    selectedBrand && selectedModel
      ? live[`${selectedBrand.name}:::${selectedModel.name}`]
      : undefined;
  const selectedShopUrl =
    selectedBrand && selectedModel
      ? babylistAffiliateUrl(selectedBrand.name, selectedModel.name, 'stroller', selectedLive?.babylistUrl)
      : '#';

  function selectBrand(id: string) {
    if (selectedBrandId === id) return;
    setSelectedBrandId(id);
    setSelectedModelId(null);
  }

  return (
    <div className={styles.tool}>

      {/* ── Phase 1: Brand grid ─────────────────────────────────────── */}
      {!selectedBrand ? (
        <>
          <p className={styles.toolPrompt}>Which brand are you considering?</p>
          <div className={styles.brandGrid}>
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                type="button"
                className={styles.brandTile}
                onClick={() => selectBrand(brand.id)}
                aria-label={`Select ${brand.name}`}
              >
                <span
                  className={styles.brandInitial}
                  style={{ backgroundColor: brand.color }}
                  aria-hidden="true"
                >
                  {brand.name[0]}
                </span>
                <span className={styles.brandName}>{brand.name}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* ── Phase 2: Selected brand header ──────────────────────── */}
          <div className={styles.selectedBrandBar}>
            <span
              className={styles.selectedBrandInitial}
              style={{ backgroundColor: selectedBrand.color }}
              aria-hidden="true"
            >
              {selectedBrand.name[0]}
            </span>
            <div className={styles.selectedBrandInfo}>
              <p className={styles.selectedBrandName}>{selectedBrand.name}</p>
              <p className={styles.selectedBrandTagline}>{selectedBrand.tagline}</p>
            </div>
            <button
              type="button"
              className={styles.changeBtn}
              onClick={() => { setSelectedBrandId(null); setSelectedModelId(null); }}
            >
              ← Change
            </button>
          </div>

          {/* ── Phase 2: Model chips ─────────────────────────────────── */}
          {/* key forces re-mount + re-animation when brand changes */}
          <div key={`chips-${selectedBrand.id}`} className={styles.modelSection}>
            <p className={styles.modelSectionLabel}>Choose a model</p>
            <div className={styles.modelChips}>
              {selectedBrand.models.map((model) => {
                const isSelected = selectedModelId === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    className={`${styles.modelChip}${isSelected ? ` ${styles.modelChipSelected}` : ''}`}
                    onClick={() => setSelectedModelId(model.id)}
                    aria-pressed={isSelected}
                  >
                    <span className={styles.modelChipName}>{model.name}</span>
                    <span className={styles.modelChipCategory}>{model.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Phase 3: Result card ─────────────────────────────────── */}
          {selectedModel && (
            <div key={`result-${selectedModel.id}`} className={styles.resultCard}>
              <div className={styles.resultCardInner}>

                {/* Category badge */}
                <span
                  className={styles.resultBadge}
                  style={{ backgroundColor: badgeStyle!.bg, color: badgeStyle!.color }}
                >
                  {selectedModel.category}
                </span>

                {/* Model name + brand */}
                <h3 className={styles.resultName}>{selectedModel.name}</h3>
                <p className={styles.resultBrandLine}>by {selectedBrand.name}</p>

                {/* Tagline */}
                <p className={styles.resultTagline}>{selectedModel.tagline}</p>

                {/* Highlights */}
                <ul className={styles.resultHighlights} aria-label="Key considerations">
                  {selectedModel.highlights.map((h) => (
                    <li key={h} className={styles.resultHighlight}>
                      <span
                        className={styles.highlightDot}
                        style={{ backgroundColor: selectedBrand.color }}
                        aria-hidden="true"
                      />
                      {h}
                    </li>
                  ))}
                </ul>

                {/* Footer: price + CTA */}
                <div className={styles.resultFooter}>
                  <p>
                    <span className={styles.resultPriceLabel}>Price </span>
                    {selectedLive?.babylistPrice != null ? (
                      <span className={styles.resultPrice}>
                        ${selectedLive.babylistPrice.toFixed(2)}
                        <span
                          style={{
                            marginLeft: '0.35rem',
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.14em',
                            color: '#9b9499',
                          }}
                        >
                          via Babylist
                        </span>
                      </span>
                    ) : (
                      <span className={styles.resultPrice}>{selectedModel.priceRange}</span>
                    )}
                  </p>

                  <TrackedAffiliateLink
                    href={selectedShopUrl}
                    ctaText={`Shop ${selectedModel.name}`}
                    className={styles.shopCta}
                    ariaLabel={`Shop the ${selectedBrand.name} ${selectedModel.name}`}
                    meta={{
                      brand: selectedBrand.name,
                      product: selectedModel.name,
                      category: selectedModel.category,
                      position: 'stroller-brand-finder',
                    } as Parameters<typeof TrackedAffiliateLink>[0]['meta']}
                  >
                    Shop {selectedModel.name} →
                  </TrackedAffiliateLink>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
