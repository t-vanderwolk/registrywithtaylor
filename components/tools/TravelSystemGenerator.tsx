'use client';

import { useDeferredValue, useEffect, useId, useRef, useState } from 'react';
import { BRAND_LOGOS } from './StrollerCatalogFinder';
import {
  formatCompatibilityConfidence,
  formatCompatibilityType,
  type CompatibleCarSeatResult,
  type CompatibleStrollerResult,
  type TravelSystemCarSeatOption,
  type TravelSystemCompatibilityByCarSeatResponse,
  type TravelSystemCompatibilityResponse,
  type TravelSystemStrollerOption,
} from '@/lib/compatibilityEngine';
import {
  getTravelSystemBrandInsight,
  getTravelSystemCarSeatInsight,
  TRAVEL_SYSTEM_CAR_SEAT_PATTERNS,
  TRAVEL_SYSTEM_STROLLER_PATTERNS,
  type TravelSystemEcosystemType,
} from '@/lib/travelSystemBrandInsights';
import { getAffiliateLinks, babylistAffiliateUrl } from '@/lib/travelSystemAffiliateLinks';

type TravelSystemGeneratorProps = {
  strollers: TravelSystemStrollerOption[];
  carSeats: TravelSystemCarSeatOption[];
};

type LookupMode = 'stroller' | 'carSeat';

type StrollerLookupResult = TravelSystemCompatibilityResponse & {
  queryType: 'stroller';
};

type CarSeatLookupResult = TravelSystemCompatibilityByCarSeatResponse & {
  queryType: 'carSeat';
};

type LookupResult = StrollerLookupResult | CarSeatLookupResult;

function buildOptionValue(option: { brand: string; model: string }) {
  return `${option.brand}:::${option.model}`;
}

function parseOptionValue(value: string) {
  const [brand = '', model = ''] = value.split(':::');
  return { brand, model };
}

function compatibilityBadgeClasses(
  type: CompatibleCarSeatResult['compatibilityType'] | CompatibleStrollerResult['compatibilityType'],
) {
  switch (type) {
    case 'DIRECT':
      return 'tool-badge--direct';
    case 'ADAPTER':
      return 'tool-badge--adapter';
    case 'LIMITED':
      return 'tool-badge--limited';
    case 'LOCKED':
      return 'tool-badge--locked';
    case 'INCOMPATIBLE':
    default:
      return 'tool-badge--incompatible';
  }
}

function ecosystemBadgeClasses(type: TravelSystemEcosystemType) {
  switch (type) {
    case 'closed':
      return 'border-[rgba(123,169,138,0.22)] bg-[rgba(141,189,156,0.16)] text-[rgba(67,106,80,0.98)]';
    case 'semiClosed':
      return 'border-[rgba(196,156,94,0.22)] bg-[rgba(227,190,120,0.16)] text-[rgba(124,90,39,0.98)]';
    case 'universal':
      return 'border-[rgba(112,153,194,0.22)] bg-[rgba(214,228,245,0.68)] text-[rgba(66,95,128,0.98)]';
    case 'niche':
      return 'border-[rgba(126,125,131,0.2)] bg-[rgba(215,212,219,0.28)] text-[rgba(77,77,84,0.96)]';
    case 'openAdapter':
    default:
      return 'border-[rgba(215,161,175,0.22)] bg-[rgba(243,226,232,0.86)] text-[rgba(129,77,93,0.98)]';
  }
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`travel-system-skeleton-${index}`}
          className="animate-pulse rounded-[1.5rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf6_100%)] p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-3 w-20 rounded-full bg-[rgba(215,161,175,0.18)]" />
              <div className="h-6 w-44 rounded-full bg-[rgba(0,0,0,0.07)]" />
            </div>
            <div className="h-8 w-24 rounded-full bg-[rgba(196,156,94,0.16)]" />
          </div>

          <div className="mt-5 h-44 rounded-[1.25rem] bg-[rgba(0,0,0,0.05)]" />

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="h-16 rounded-[1rem] bg-[rgba(0,0,0,0.05)]" />
            <div className="h-16 rounded-[1rem] bg-[rgba(0,0,0,0.05)]" />
            <div className="h-16 rounded-[1rem] bg-[rgba(0,0,0,0.05)]" />
          </div>

          <div className="mt-5 h-16 rounded-[1rem] bg-[rgba(0,0,0,0.05)]" />
        </div>
      ))}
    </div>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: LookupMode;
  onChange: (nextMode: LookupMode) => void;
}) {
  return (
    <div className="tool-segment w-full max-w-[24rem]">
      {([
        { id: 'stroller', label: 'Stroller First' },
        { id: 'carSeat', label: 'Car Seat First' },
      ] as const).map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={mode === option.id}
          onClick={() => onChange(option.id)}
          className="tool-segment__btn"
        >
          <span className="tool-segment__label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

function AffiliateBuyButtons({
  brand,
  model,
  babylistUrl,
  babylistPrice = null,
  albee = null,
  openBox = null,
  kind = 'stroller',
  compact = false,
}: {
  brand: string;
  model: string;
  babylistUrl?: string | null;
  babylistPrice?: number | null;
  albee?: { price: number | null; url: string | null } | null;
  openBox?: { price: number | null; url: string | null } | null;
  kind?: 'stroller' | 'carSeat';
  compact?: boolean;
}) {
  // Every product gets a Babylist affiliate link (synced exact URL wins, then
  // static map, then a tracked brand listing).
  const resolvedBabylistUrl = babylistAffiliateUrl(brand, model, kind, babylistUrl);

  // Compact mode (in-viewport result cards): stacked retailer CTAs matching the
  // stroller finder — Babylist (pink) + Albee Baby (navy) + GoodBuyGear (orange),
  // each with its logo and a price badge.
  if (compact) {
    const offers: Array<{
      key: string;
      label: string;
      btnClass: string;
      logo: string;
      note: string;
      price: number | null;
      url: string | null;
    }> = [
      {
        key: 'babylist',
        label: 'Add to Babylist',
        btnClass: 'tool-btn--primary',
        logo: '/assets/logos/babylist.png',
        note: '',
        price: babylistPrice,
        url: resolvedBabylistUrl,
      },
    ];
    if (albee && (albee.url || albee.price != null)) {
      offers.push({
        key: 'albee',
        label: 'Shop Albee Baby',
        btnClass: 'tool-btn--albee',
        logo: '/assets/logos/albeebaby-round1.png',
        note: '',
        price: albee.price ?? null,
        url: albee.url ?? null,
      });
    }
    if (openBox && (openBox.url || openBox.price != null)) {
      offers.push({
        key: 'goodbuygear',
        label: 'Shop GoodBuyGear',
        btnClass: 'tool-btn--gbg',
        logo: '/assets/logos/goodbuygear.png',
        note: 'as low as ',
        price: openBox.price ?? null,
        url: openBox.url ?? null,
      });
    }
    return (
      <div className="flex flex-col gap-1.5">
        {offers.map((o) => (
          <a
            key={o.key}
            href={o.url ?? undefined}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className={`tool-btn ${o.btnClass} tool-btn--block flex items-center justify-center gap-2`}
          >
            <span className="inline-flex items-center rounded-full bg-white px-1.5 py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.logo} alt="" className="h-3 w-auto object-contain" />
            </span>
            <span>{o.label} →</span>
            {o.price != null ? (
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-[0.72rem] font-bold">
                {o.note}${o.price.toFixed(2)}
              </span>
            ) : null}
          </a>
        ))}
      </div>
    );
  }

  const links = getAffiliateLinks(brand, model);
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a
        href={resolvedBabylistUrl}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(215,161,175,0.28)] bg-[rgba(255,249,246,0.92)] px-4 py-2 text-[0.78rem] font-semibold text-[var(--color-accent-dark)] transition duration-150 hover:bg-[rgba(215,161,175,0.14)]"
      >
        {/* Babylist heart logo */}
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
          <path
            d="M8 13S1 8.5 1 4.5A3.5 3.5 0 0 1 7.75 2.9 3.5 3.5 0 0 1 15 4.5C15 8.5 8 13 8 13Z"
            fill="#f26b8a"
            stroke="#f26b8a"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
        View on Babylist
      </a>
      {links.amazonUrl ? (
        <a
          href={links.amazonUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.09)] bg-white px-4 py-2 text-[0.78rem] font-semibold text-neutral-700 transition duration-150 hover:bg-neutral-50"
        >
          {/* Amazon "a" + smile logo */}
          <svg width="18" height="15" viewBox="0 0 18 15" fill="none" aria-hidden="true">
            <text x="1" y="10" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#1a1a1a">a</text>
            {/* orange smile arc — control point kept inside viewBox */}
            <path d="M2 12.5 Q7 15 13.5 12.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* arrowhead at end of arc */}
            <path d="M11.8 11.6 L13.5 12.5 L12 13.5" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          Check price on Amazon
        </a>
      ) : null}
    </div>
  );
}

function ResultCard({
  item,
  kind,
}: {
  item: (CompatibleCarSeatResult | CompatibleStrollerResult) & {
    openBox?: { price: number; url: string | null } | null;
    albee?: { price: number; url: string | null } | null;
  };
  kind: 'stroller' | 'carSeat';
}) {
  return (
    <div className="tool-card tool-card--interactive overflow-hidden">
      <div className="tool-card__media" style={{ height: '4.75rem' }}>
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.imageAlt ?? item.displayName} />
        ) : (
          <span className="text-[0.58rem] uppercase tracking-[0.16em] text-neutral-300">{item.brand}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[var(--color-accent-dark)]">
              {item.brand}
            </p>
            <p className="font-serif text-[1.04rem] leading-tight text-neutral-900">{item.displayName}</p>
          </div>
          <span className={`tool-badge shrink-0 ${compatibilityBadgeClasses(item.compatibilityType)}`}>
            {formatCompatibilityType(item.compatibilityType)}
          </span>
        </div>

        {item.adapterRequired ? (
          <div className="flex items-center gap-2 rounded-[0.7rem] border border-[rgba(196,156,94,0.22)] bg-[rgba(251,247,244,0.7)] px-2.5 py-1.5">
            {item.adapterImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.adapterImage} alt="" className="h-7 w-7 shrink-0 rounded bg-white object-contain p-0.5" />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.66rem] font-semibold text-neutral-700">
                {item.adapterType ?? 'Adapter needed'}
              </p>
              {item.adapterPrice != null ? (
                <p className="text-[0.64rem] font-semibold text-[var(--gold)]">${item.adapterPrice.toFixed(2)}</p>
              ) : null}
            </div>
            {item.adapterUrl ? (
              <a
                href={item.adapterUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--color-accent-dark)] hover:underline"
              >
                Shop →
              </a>
            ) : null}
          </div>
        ) : (
          <p className="text-[0.72rem] font-semibold text-[rgba(58,99,72,0.92)]">Direct fit · no adapter needed</p>
        )}

        <div className="mt-auto pt-1.5">
          <AffiliateBuyButtons
            brand={item.brand}
            model={item.model}
            babylistUrl={item.babylistUrl}
            babylistPrice={item.babylistPrice}
            albee={item.albee}
            openBox={item.openBox}
            kind={kind}
            compact
          />
        </div>
      </div>
    </div>
  );
}

export default function TravelSystemGenerator({ strollers, carSeats }: TravelSystemGeneratorProps) {
  const searchId = useId();
  const [selectorBrand, setSelectorBrand] = useState<string | null>(null);
  const [lookupMode, setLookupMode] = useState<LookupMode>('stroller');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookup, setLookup] = useState<
    Record<
      string,
      {
        babylistUrl: string | null;
        babylistPrice: number | null;
        babylistImage: string | null;
        openBoxPrice: number | null;
        openBoxUrl: string | null;
        albeePrice: number | null;
        albeeUrl: string | null;
      }
    >
  >({});
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  // A car-seat deep-link sets the mode + value on mount; that mode change would
  // normally trip the reset below, so we let the deep-link skip it once.
  const skipModeResetRef = useRef(false);

  useEffect(() => {
    if (skipModeResetRef.current) {
      skipModeResetRef.current = false;
      return;
    }
    setSearchQuery('');
    setSelectedValue('');
    setSelectorBrand(null);
    setResult(null);
    setError(null);
    setLoading(false);
  }, [lookupMode]);

  // Deep-link entry: /tools/travel-system?strollerBrand=…&strollerModel=… pre-
  // selects that stroller. This powers the finder's "check compatible infant car
  // seats" CTA. Stroller is the default mode, so setting the value alone runs the
  // lookup without tripping the mode-reset effect above. Runs once on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const sBrand = params.get('strollerBrand');
    const sModel = params.get('strollerModel');
    const cBrand = params.get('carSeatBrand');
    const cModel = params.get('carSeatModel');
    if (sBrand && sModel) {
      setSelectorBrand(sBrand);
      setSelectedValue(`${sBrand}:::${sModel}`);
    } else if (cBrand && cModel) {
      // The finder's car-seat "check compatible strollers" CTA lands here.
      skipModeResetRef.current = true;
      setLookupMode('carSeat');
      setSelectorBrand(cBrand);
      setSelectedValue(`${cBrand}:::${cModel}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync with the selected stroller so a specific compatibility
  // result is shareable and bookmarkable — shoppers and retailers can send the
  // exact link. (replaceState: no history spam, no navigation.)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('strollerBrand');
    url.searchParams.delete('strollerModel');
    url.searchParams.delete('carSeatBrand');
    url.searchParams.delete('carSeatModel');
    if (selectedValue) {
      const { brand, model } = parseOptionValue(selectedValue);
      if (lookupMode === 'stroller') {
        url.searchParams.set('strollerBrand', brand);
        url.searchParams.set('strollerModel', model);
      } else {
        url.searchParams.set('carSeatBrand', brand);
        url.searchParams.set('carSeatModel', model);
      }
    }
    window.history.replaceState(null, '', url.toString());
  }, [lookupMode, selectedValue]);

  const filteredStrollers = deferredSearchQuery
    ? strollers.filter((stroller) => {
        const haystack = `${stroller.brand} ${stroller.model} ${stroller.displayName}`.toLowerCase();
        return haystack.includes(deferredSearchQuery);
      })
    : strollers;

  const filteredCarSeats = deferredSearchQuery
    ? carSeats.filter((carSeat) => {
        const haystack = `${carSeat.brand} ${carSeat.model} ${carSeat.displayName}`.toLowerCase();
        return haystack.includes(deferredSearchQuery);
      })
    : carSeats;

  const activeOptions = lookupMode === 'stroller' ? filteredStrollers : filteredCarSeats;
  const optionGroups = activeOptions.reduce<Record<string, Array<TravelSystemStrollerOption | TravelSystemCarSeatOption>>>(
    (groups, option) => {
      if (!groups[option.brand]) {
        groups[option.brand] = [];
      }

      groups[option.brand].push(option);
      return groups;
    },
    {},
  );

  const selectedBrand =
    result?.queryType === 'stroller'
      ? result.stroller.brand
      : result?.queryType === 'carSeat'
        ? result.carSeat.brand
        : selectedValue
          ? parseOptionValue(selectedValue).brand
          : '';

  const activeInsight =
    lookupMode === 'stroller'
      ? (selectedBrand ? getTravelSystemBrandInsight(selectedBrand) : null)
      : (selectedBrand ? getTravelSystemCarSeatInsight(selectedBrand) : null);

  const ecosystemPatterns =
    lookupMode === 'stroller' ? TRAVEL_SYSTEM_STROLLER_PATTERNS : TRAVEL_SYSTEM_CAR_SEAT_PATTERNS;

  useEffect(() => {
    if (!selectedValue) {
      setResult(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const { brand, model } = parseOptionValue(selectedValue);
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const params = new URLSearchParams(
          lookupMode === 'stroller'
            ? {
                strollerBrand: brand,
                strollerModel: model,
              }
            : {
                carSeatBrand: brand,
                carSeatModel: model,
              },
        );

        const response = await fetch(`/api/compatibility?${params.toString()}`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });

        const payload = (await response.json().catch(() => null)) as LookupResult | { error?: string } | null;

        if (!response.ok) {
          setError(payload && 'error' in payload && payload.error ? payload.error : 'Unable to load compatibility right now.');
          return;
        }

        setResult(payload as LookupResult);
      } catch (fetchError) {
        if ((fetchError as Error).name === 'AbortError') {
          return;
        }

        setError('Unable to load compatibility right now.');
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [lookupMode, selectedValue]);

  // Pull fresh Babylist price/image/link for the result's products from the same
  // /api/babylist/lookup the matchmaker quiz uses; prefer it over the synced fields.
  useEffect(() => {
    if (!result) {
      setLookup({});
      return;
    }
    const products =
      result.queryType === 'stroller'
        ? [result.stroller, ...result.compatibleCarSeats]
        : [result.carSeat, ...result.compatibleStrollers];
    const items = products.map((p) => `${p.brand}:::${p.model}`).join(',');
    if (!items) return;
    let cancelled = false;
    fetch(`/api/babylist/lookup?items=${encodeURIComponent(items)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.results) setLookup(d.results);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [result]);

  // Merge fresh catalog fields onto each result row (same shape → cards unchanged).
  const mergedCarSeats =
    result?.queryType === 'stroller'
      ? result.compatibleCarSeats.map((seat) => {
          const m = lookup[`${seat.brand}:::${seat.model}`];
          return m
            ? {
                ...seat,
                babylistPrice: m.babylistPrice ?? seat.babylistPrice,
                imageUrl: m.babylistImage ?? seat.imageUrl,
                babylistUrl: m.babylistUrl ?? seat.babylistUrl,
                openBox: m.openBoxPrice != null ? { price: m.openBoxPrice, url: m.openBoxUrl } : null,
                albee: m.albeePrice != null ? { price: m.albeePrice, url: m.albeeUrl } : null,
              }
            : seat;
        })
      : [];
  const mergedStrollers =
    result?.queryType === 'carSeat'
      ? result.compatibleStrollers.map((stroller) => {
          const m = lookup[`${stroller.brand}:::${stroller.model}`];
          return m
            ? {
                ...stroller,
                babylistPrice: m.babylistPrice ?? stroller.babylistPrice,
                imageUrl: m.babylistImage ?? stroller.imageUrl,
                babylistUrl: m.babylistUrl ?? stroller.babylistUrl,
                openBox: m.openBoxPrice != null ? { price: m.openBoxPrice, url: m.openBoxUrl } : null,
                albee: m.albeePrice != null ? { price: m.albeePrice, url: m.albeeUrl } : null,
              }
            : stroller;
        })
      : [];

  const selectorEyebrow = lookupMode === 'stroller' ? 'Stroller selector' : 'Car seat selector';
  const searchLabel = lookupMode === 'stroller' ? 'Search strollers' : 'Search infant car seats';
  const searchPlaceholder =
    lookupMode === 'stroller'
      ? 'Try MIXX, Cruz, Butterfly, Gazelle...'
      : 'Try PIPA RX, KeyFit 35, Mico Luxe, Liing...';
  const emptyTitle =
    lookupMode === 'stroller'
      ? 'Start by selecting your stroller to see compatible car seats.'
      : 'Start by selecting your infant car seat to see compatible strollers.';
  const emptyDescription =
    lookupMode === 'stroller'
      ? 'This keeps the answer grounded in real fit, not a long list that still leaves you guessing.'
      : 'This keeps the answer anchored in ecosystem fit, not a general stroller list that still leaves the real question unresolved.';
  const countDescription =
    lookupMode === 'stroller'
      ? `${filteredStrollers.length} stroller option${filteredStrollers.length === 1 ? '' : 's'} in the current compatibility library. Convertible seats are intentionally excluded.`
      : `${filteredCarSeats.length} infant car seat option${filteredCarSeats.length === 1 ? '' : 's'} in the current compatibility library. This tool is intentionally limited to the infant-seat stage.`;
  const noMatchDescription =
    lookupMode === 'stroller'
      ? 'No stroller matches that search yet. Try the brand name or the core model name.'
      : 'No infant car seat matches that search yet. Try the brand name or the core model name.';

  return (
    <section className="tool-shell">
      <div className="mb-6 flex flex-col gap-3">
        <span className="tool-eyebrow">Travel system checker</span>
        <h2 className="tool-title">Find the infant car seats that fit your stroller</h2>
        <p className="tool-lead">
          Pick your stroller or your infant seat — we’ll show every match in our live compatibility
          library, flag direct fits versus the ones that need an adapter, and surface the exact
          adapter to buy. Prices and links straight from Babylist.
        </p>
      </div>
      {/* Top controls: mode toggle + search, matching the stroller finder */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ModeToggle mode={lookupMode} onChange={setLookupMode} />
        <div className="w-full sm:max-w-xs">
          <label htmlFor={searchId} className="tool-label">
            {searchLabel}
          </label>
          <input
            id={searchId}
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="tool-input"
          />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-white/92 p-5 shadow-[0_14px_32px_rgba(0,0,0,0.04)]">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
            {selectorEyebrow}
          </p>

          {/* Brand-grid selector, mirroring the stroller finder: search → flat
              results; otherwise browse brands → drill into that brand's models. */}
          {deferredSearchQuery ? (
            <div className="mt-4">
              <p className="mb-2.5 text-[0.72rem] text-neutral-500">
                {activeOptions.length} match{activeOptions.length === 1 ? '' : 'es'}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {activeOptions.map((option) => {
                  const value = buildOptionValue(option);
                  const isSel = selectedValue === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedValue(value)}
                      aria-pressed={isSel}
                      className={`rounded-[0.85rem] border px-3.5 py-2.5 text-left text-sm transition ${
                        isSel
                          ? 'border-[var(--color-cta-pink)] bg-[rgba(232,154,174,0.12)] font-semibold text-neutral-900'
                          : 'border-[rgba(0,0,0,0.08)] bg-white text-neutral-700 hover:border-[rgba(215,161,175,0.4)]'
                      }`}
                    >
                      <span className="block text-[0.58rem] font-bold uppercase tracking-[0.14em] text-neutral-400">
                        {option.brand}
                      </span>
                      <span className="block">{option.model}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : !selectorBrand ? (
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Object.entries(optionGroups)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([brand, options]) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setSelectorBrand(brand)}
                    className="tool-card tool-card--interactive items-center justify-center gap-1.5 px-3 py-4 text-center"
                  >
                    <div className="flex h-9 w-full items-center justify-center">
                      {BRAND_LOGOS[brand] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={BRAND_LOGOS[brand]} alt={brand} className="max-h-full max-w-[82%] object-contain" />
                      ) : (
                        <span className="font-serif text-[0.95rem] leading-tight text-neutral-900">{brand}</span>
                      )}
                    </div>
                    <span className="text-[0.62rem] text-neutral-400">{options.length}</span>
                  </button>
                ))}
            </div>
          ) : (
            <div className="mt-4">
              <nav className="flex items-center gap-1.5 text-[0.74rem]">
                <button
                  type="button"
                  onClick={() => setSelectorBrand(null)}
                  className="font-semibold text-[var(--color-accent-dark)] transition hover:underline"
                >
                  All brands
                </button>
                <span className="text-neutral-300">/</span>
                <span className="text-neutral-500">{selectorBrand}</span>
              </nav>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {[...(optionGroups[selectorBrand] ?? [])]
                  .sort((a, b) => a.model.localeCompare(b.model))
                  .map((option) => {
                    const value = buildOptionValue(option);
                    const isSel = selectedValue === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSelectedValue(value)}
                        aria-pressed={isSel}
                        className={`flex items-center justify-between gap-2 rounded-[0.85rem] border px-3.5 py-2.5 text-left text-sm transition ${
                          isSel
                            ? 'border-[var(--color-cta-pink)] bg-[rgba(232,154,174,0.12)] font-semibold text-neutral-900'
                            : 'border-[rgba(0,0,0,0.08)] bg-white text-neutral-700 hover:border-[rgba(215,161,175,0.4)]'
                        }`}
                      >
                        <span>{option.model}</span>
                        {isSel ? <span className="text-[var(--color-accent-dark)]">✓</span> : null}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-[1.2rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-4 py-4 text-sm leading-7 text-neutral-600">
            {activeOptions.length > 0 ? <p>{countDescription}</p> : <p>{noMatchDescription}</p>}
          </div>

          {activeInsight ? (
            <div className="mt-6 rounded-[1.25rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(252,246,242,0.92)_100%)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">System read</p>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${ecosystemBadgeClasses(activeInsight.ecosystemType)}`}
                >
                  {activeInsight.ecosystemLabel}
                </span>
              </div>

              <p className="mt-3 text-sm leading-7 text-neutral-700">{activeInsight.compatibilityPattern}</p>

              <div className="mt-4 rounded-[1rem] bg-white/75 px-4 py-3">
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">Common pairings</p>
                <p className="mt-2 text-sm font-semibold text-neutral-900">{activeInsight.supportedBrands.join(' • ')}</p>
              </div>

              <p className="mt-4 text-sm leading-7 text-neutral-700">
                <span className="font-semibold text-neutral-900">TMBC read:</span> {activeInsight.tmbcInsight}
              </p>
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6">
          {!selectedValue ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-6 py-10 text-center md:min-h-[24rem]">
              <h3 className="font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                {emptyTitle}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">{emptyDescription}</p>

              <div className="mt-8 grid w-full gap-3 text-left md:grid-cols-3">
                {ecosystemPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="rounded-[1rem] border border-[rgba(0,0,0,0.06)] bg-white/90 px-4 py-4 shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
                  >
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${ecosystemBadgeClasses(pattern.id)}`}
                    >
                      {pattern.label}
                    </span>
                    <p className="mt-3 text-sm leading-7 text-neutral-700">{pattern.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : loading ? (
            <ResultsSkeleton />
          ) : error ? (
            <div className="rounded-[1.4rem] border border-[rgba(189,95,95,0.22)] bg-[rgba(255,243,243,0.92)] px-5 py-6 text-sm leading-7 text-[rgba(142,69,69,0.98)]">
              {error}
            </div>
          ) : result?.queryType === 'stroller' ? (
            <>
              <div className="border-b border-[rgba(0,0,0,0.06)] pb-3">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="text-[0.6rem] uppercase tracking-[0.18em] text-neutral-500">Compatible infant car seats</p>
                    <h3 className="font-serif text-[1.3rem] leading-tight tracking-[-0.03em] text-neutral-900">
                      {result.stroller.displayName}
                    </h3>
                  </div>
                  {result.compatibleCarSeats.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold">
                      <span className="rounded-full bg-[rgba(251,247,244,0.95)] px-2.5 py-1 text-neutral-700">
                        {result.compatibleCarSeats.length} matches
                      </span>
                      <span className="rounded-full bg-[rgba(232,154,174,0.16)] px-2.5 py-1 text-[var(--color-accent-dark)]">
                        {result.compatibleCarSeats.filter((s) => s.compatibilityType === 'DIRECT').length} direct fit
                      </span>
                      <span className="rounded-full bg-[rgba(198,167,94,0.18)] px-2.5 py-1 text-[#8a6d24]">
                        {result.compatibleCarSeats.filter((s) => s.adapterRequired).length} need adapter
                      </span>
                      {activeInsight ? (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${ecosystemBadgeClasses(activeInsight.ecosystemType)}`}
                        >
                          {activeInsight.ecosystemLabel}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {activeInsight ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer list-none text-[0.72rem] font-semibold text-[var(--color-accent-dark)] [&::-webkit-details-marker]:hidden">
                      What most parents should know first ›
                    </summary>
                    <p className="mt-1.5 text-[0.82rem] leading-6 text-neutral-700">{activeInsight.tmbcInsight}</p>
                  </details>
                ) : null}
              </div>

              {result.compatibleCarSeats.length > 0 ? (
                <div className="mt-4 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr))]">
                  {mergedCarSeats.map((seat) => (
                    <ResultCard
                      key={`${result.stroller.brand}-${result.stroller.model}-${seat.brand}-${seat.model}`}
                      item={seat}
                      kind="carSeat"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.4rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-5 py-6 text-sm leading-7 text-neutral-600">
                  No compatible infant car seats are listed for this stroller yet.
                </div>
              )}
            </>
          ) : result?.queryType === 'carSeat' ? (
            <>
              <div className="border-b border-[rgba(0,0,0,0.06)] pb-3">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="text-[0.6rem] uppercase tracking-[0.18em] text-neutral-500">Compatible strollers</p>
                    <h3 className="font-serif text-[1.3rem] leading-tight tracking-[-0.03em] text-neutral-900">
                      {result.carSeat.displayName}
                    </h3>
                  </div>
                  {result.compatibleStrollers.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold">
                      <span className="rounded-full bg-[rgba(251,247,244,0.95)] px-2.5 py-1 text-neutral-700">
                        {result.compatibleStrollers.length} matches
                      </span>
                      <span className="rounded-full bg-[rgba(232,154,174,0.16)] px-2.5 py-1 text-[var(--color-accent-dark)]">
                        {result.compatibleStrollers.filter((s) => s.compatibilityType === 'DIRECT').length} direct fit
                      </span>
                      <span className="rounded-full bg-[rgba(198,167,94,0.18)] px-2.5 py-1 text-[#8a6d24]">
                        {result.compatibleStrollers.filter((s) => s.adapterRequired).length} need adapter
                      </span>
                      {activeInsight ? (
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.14em] ${ecosystemBadgeClasses(activeInsight.ecosystemType)}`}
                        >
                          {activeInsight.ecosystemLabel}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                {activeInsight ? (
                  <details className="mt-2">
                    <summary className="cursor-pointer list-none text-[0.72rem] font-semibold text-[var(--color-accent-dark)] [&::-webkit-details-marker]:hidden">
                      What most parents should know first ›
                    </summary>
                    <p className="mt-1.5 text-[0.82rem] leading-6 text-neutral-700">{activeInsight.tmbcInsight}</p>
                  </details>
                ) : null}
              </div>

              {result.compatibleStrollers.length > 0 ? (
                <div className="mt-4 grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(9.5rem,1fr))]">
                  {mergedStrollers.map((stroller) => (
                    <ResultCard
                      key={`${result.carSeat.brand}-${result.carSeat.model}-${stroller.brand}-${stroller.model}`}
                      item={stroller}
                      kind="stroller"
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.4rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-5 py-6 text-sm leading-7 text-neutral-600">
                  No compatible strollers are listed for this infant car seat yet.
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
