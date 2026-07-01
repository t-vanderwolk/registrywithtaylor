'use client';

import { useRouter } from 'next/navigation';
import { useDeferredValue, useEffect, useId, useRef, useState } from 'react';
import { BRAND_LOGOS } from './StrollerCatalogFinder';
import type {
  TravelSystemCarSeatOption,
  TravelSystemStrollerOption,
} from '@/lib/compatibilityEngine';
import {
  getTravelSystemBrandInsight,
  getTravelSystemCarSeatInsight,
  TRAVEL_SYSTEM_CAR_SEAT_PATTERNS,
  TRAVEL_SYSTEM_STROLLER_PATTERNS,
  type TravelSystemEcosystemType,
} from '@/lib/travelSystemBrandInsights';
import {
  findTravelSystemOptionBySlug,
  travelSystemResultsHref,
} from '@/lib/travelSystemRouting';

type TravelSystemGeneratorProps = {
  strollers: TravelSystemStrollerOption[];
  carSeats: TravelSystemCarSeatOption[];
};

type LookupMode = 'stroller' | 'carSeat';

function buildOptionValue(option: { brand: string; model: string }) {
  return `${option.brand}:::${option.model}`;
}

function parseOptionValue(value: string) {
  const [brand = '', model = ''] = value.split(':::');
  return { brand, model };
}

function displayNameWithoutBrand(displayName: string, brand: string) {
  const normalizedBrand = brand.trim();
  if (!normalizedBrand) return displayName;
  const escapedBrand = normalizedBrand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const brandPrefix = new RegExp(`^(?:${escapedBrand}\\s+)+`, 'i');
  return displayName.replace(brandPrefix, '').trim() || displayName;
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

function BrowseCard({
  option,
  image,
  price,
  priceSource,
  cta,
  onSelect,
}: {
  option: { brand: string; model: string };
  image: string | null;
  price: number | null;
  priceSource: 'Babylist' | 'MacroBaby' | null;
  cta: string;
  onSelect: () => void;
}) {
  const displayTitle = displayNameWithoutBrand(option.model, option.brand);

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group tool-card tool-card--interactive tool-product-card text-left"
    >
      <div className="tool-card__media tool-product-card__media tool-product-card__media--compact">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={option.model} className="tool-product-card__image" />
        ) : (
          <span className="tool-product-card__image-fallback">{option.brand}</span>
        )}
      </div>
      <div className="tool-product-card__body tool-product-card__body--compact">
        <p className="tool-product-card__brand">{option.brand}</p>
        <p className="tool-product-card__title tool-product-card__title--compact">{displayTitle}</p>
        {price != null ? (
          <p className="tool-product-card__price">
            ${price.toFixed(2)}
            {priceSource ? <span>via {priceSource}</span> : null}
          </p>
        ) : null}
        <span className="mt-1 inline-flex items-center gap-1 text-[0.64rem] font-semibold text-[var(--color-accent-dark)]">
          {cta}
          <span aria-hidden className="transition duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </button>
  );
}

function selectedOptionFromValue<T extends TravelSystemStrollerOption | TravelSystemCarSeatOption>(
  options: T[],
  value: string,
): T | null {
  const { brand, model } = parseOptionValue(value);
  return findOptionByBrandModel(options, brand, model);
}

function findOptionByBrandModel<T extends TravelSystemStrollerOption | TravelSystemCarSeatOption>(
  options: T[],
  brand: string,
  model: string,
): T | null {
  const normalizedBrand = brand.trim().toLowerCase();
  const normalizedModel = model.trim().toLowerCase();
  if (!normalizedBrand || !normalizedModel) return null;

  return (
    options.find(
      (option) =>
        option.brand.trim().toLowerCase() === normalizedBrand &&
        option.model.trim().toLowerCase() === normalizedModel,
    ) ?? null
  );
}

export default function TravelSystemGenerator({ strollers, carSeats }: TravelSystemGeneratorProps) {
  const router = useRouter();
  const searchId = useId();
  const [selectorBrand, setSelectorBrand] = useState<string | null>(null);
  const [lookupMode, setLookupMode] = useState<LookupMode>('stroller');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [browseLookup, setBrowseLookup] = useState<
    Record<string, { babylistImage: string | null; babylistPrice: number | null }>
  >({});
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const skipModeResetRef = useRef(false);

  useEffect(() => {
    if (skipModeResetRef.current) {
      skipModeResetRef.current = false;
      return;
    }
    setSearchQuery('');
    setSelectedValue('');
    setSelectorBrand(null);
  }, [lookupMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const strollerSlug = params.get('stroller');
    const carSeatSlug = params.get('carSeat');
    const sBrand = params.get('strollerBrand');
    const sModel = params.get('strollerModel');
    const cBrand = params.get('carSeatBrand');
    const cModel = params.get('carSeatModel');

    if (strollerSlug) {
      const stroller = findTravelSystemOptionBySlug(strollers, strollerSlug);
      if (stroller) {
        setSelectorBrand(stroller.brand);
        setSelectedValue(buildOptionValue(stroller));
      }
      return;
    }

    if (carSeatSlug) {
      const carSeat = findTravelSystemOptionBySlug(carSeats, carSeatSlug);
      if (carSeat) {
        skipModeResetRef.current = true;
        setLookupMode('carSeat');
        setSelectorBrand(carSeat.brand);
        setSelectedValue(buildOptionValue(carSeat));
      }
      return;
    }

    if (sBrand && sModel) {
      const stroller = findOptionByBrandModel(strollers, sBrand, sModel);
      if (stroller) {
        setSelectorBrand(stroller.brand);
        setSelectedValue(buildOptionValue(stroller));
      }
    } else if (cBrand && cModel) {
      const carSeat = findOptionByBrandModel(carSeats, cBrand, cModel);
      if (!carSeat) return;
      skipModeResetRef.current = true;
      setLookupMode('carSeat');
      setSelectorBrand(carSeat.brand);
      setSelectedValue(buildOptionValue(carSeat));
    }
    // Runs once on mount; the option lists are stable page props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const browseOptions = deferredSearchQuery
    ? activeOptions
    : selectorBrand
      ? optionGroups[selectorBrand] ?? []
      : [];
  const browseItems = browseOptions.map((option) => `${option.brand}:::${option.model}`).join(',');
  const selectedOption =
    selectedValue
      ? lookupMode === 'stroller'
        ? selectedOptionFromValue(strollers, selectedValue)
        : selectedOptionFromValue(carSeats, selectedValue)
      : null;
  const selectedBrand = selectedOption?.brand ?? '';
  const resultsHref = selectedOption ? travelSystemResultsHref(lookupMode, selectedOption) : null;

  const activeInsight =
    lookupMode === 'stroller'
      ? (selectedBrand ? getTravelSystemBrandInsight(selectedBrand) : null)
      : (selectedBrand ? getTravelSystemCarSeatInsight(selectedBrand) : null);

  const ecosystemPatterns =
    lookupMode === 'stroller' ? TRAVEL_SYSTEM_STROLLER_PATTERNS : TRAVEL_SYSTEM_CAR_SEAT_PATTERNS;

  useEffect(() => {
    if (!browseItems) return;
    let cancelled = false;
    fetch(`/api/babylist/lookup?items=${encodeURIComponent(browseItems)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data?.results) setBrowseLookup((previous) => ({ ...previous, ...data.results }));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [browseItems]);

  const selectorEyebrow = lookupMode === 'stroller' ? 'Stroller selector' : 'Car seat selector';
  const searchLabel = lookupMode === 'stroller' ? 'Search strollers' : 'Search infant car seats';
  const searchPlaceholder =
    lookupMode === 'stroller'
      ? 'Try MIXX, Cruz, Butterfly, Gazelle...'
      : 'Try PIPA RX, KeyFit 35, Mico Luxe, Liing...';
  const emptyTitle =
    lookupMode === 'stroller'
      ? 'Start by selecting your stroller.'
      : 'Start by selecting your infant car seat.';
  const emptyDescription =
    lookupMode === 'stroller'
      ? 'Then we will open a dedicated results page with compatible infant car seats, direct fits first.'
      : 'Then we will open a dedicated results page with compatible strollers, direct fits first.';
  const countDescription =
    lookupMode === 'stroller'
      ? `${filteredStrollers.length} stroller option${filteredStrollers.length === 1 ? '' : 's'} in the current public stroller catalog. Compatibility results appear where model-specific matches exist.`
      : `${filteredCarSeats.length} infant car seat option${filteredCarSeats.length === 1 ? '' : 's'} in the current compatibility library. This tool is intentionally limited to the infant-seat stage.`;
  const noMatchDescription =
    lookupMode === 'stroller'
      ? 'No stroller matches that search yet. Try the brand name or the core model name.'
      : 'No infant car seat matches that search yet. Try the brand name or the core model name.';
  const ctaCopy = lookupMode === 'stroller' ? 'Check Compatible Car Seats' : 'Check Compatible Strollers';
  const selectedSummary =
    lookupMode === 'stroller'
      ? 'We will check infant car seats that fit this stroller and separate direct fits from adapter-required options.'
      : 'We will check strollers that fit this infant car seat and separate direct fits from adapter-required options.';
  const handleResultsClick = () => {
    if (!resultsHref) return;
    router.push(resultsHref);
  };
  // Match the Stroller Finder: one click on a card routes straight to results.
  const browseCta = lookupMode === 'stroller' ? 'Compatible car seats' : 'Compatible strollers';
  const goToResults = (option: TravelSystemStrollerOption | TravelSystemCarSeatOption) => {
    router.push(travelSystemResultsHref(lookupMode, option));
  };

  return (
    <section className="tool-shell">
      <div className="mb-6 flex flex-col gap-3">
        <span className="tool-eyebrow">Travel system checker</span>
        <h2 className="tool-title">Find the gear that works together</h2>
        <p className="tool-lead">
          Start with the stroller or the infant seat. The results page will show the compatible side,
          direct fits first, then the adapter-required options.
        </p>
      </div>

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

          {deferredSearchQuery ? (
            <div className="mt-4">
              <p className="mb-2.5 text-[0.72rem] text-neutral-500">
                {activeOptions.length} match{activeOptions.length === 1 ? '' : 'es'}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeOptions.map((option) => {
                  const value = buildOptionValue(option);
                  const babylist = browseLookup[`${option.brand}:::${option.model}`];
                  const image = option.babylistImage ?? option.macroBabyImage ?? babylist?.babylistImage ?? null;
                  const price = option.babylistPrice ?? option.macroBabyPrice ?? babylist?.babylistPrice ?? null;
                  const priceSource =
                    option.babylistPrice != null || babylist?.babylistPrice != null
                      ? 'Babylist'
                      : option.macroBabyPrice != null
                        ? 'MacroBaby'
                        : null;
                  return (
                    <BrowseCard
                      key={value}
                      option={option}
                      image={image}
                      price={price}
                      priceSource={priceSource}
                      cta={browseCta}
                      onSelect={() => goToResults(option)}
                    />
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
                    className="tool-card tool-card--interactive tool-brand-card tool-brand-card--compact"
                  >
                    <div className="tool-brand-card__mark">
                      {BRAND_LOGOS[brand] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={BRAND_LOGOS[brand]} alt={brand} className="tool-brand-card__logo" />
                      ) : (
                        <span className="tool-brand-card__fallback">{brand}</span>
                      )}
                    </div>
                    <span className="tool-brand-card__count">{options.length}</span>
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
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...(optionGroups[selectorBrand] ?? [])]
                  .sort((a, b) => a.model.localeCompare(b.model))
                  .map((option) => {
                    const value = buildOptionValue(option);
                    const babylist = browseLookup[`${option.brand}:::${option.model}`];
                    const image = option.babylistImage ?? option.macroBabyImage ?? babylist?.babylistImage ?? null;
                    const price = option.babylistPrice ?? option.macroBabyPrice ?? babylist?.babylistPrice ?? null;
                    const priceSource =
                      option.babylistPrice != null || babylist?.babylistPrice != null
                        ? 'Babylist'
                        : option.macroBabyPrice != null
                          ? 'MacroBaby'
                          : null;
                    return (
                      <BrowseCard
                        key={value}
                        option={option}
                        image={image}
                        price={price}
                        priceSource={priceSource}
                        cta={browseCta}
                        onSelect={() => goToResults(option)}
                      />
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
          {!selectedOption ? (
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
          ) : (
            <div className="grid gap-5 rounded-[1.4rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(180deg,#fffdfb_0%,#fbf5f0_100%)] p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]">
                  Selected {lookupMode === 'stroller' ? 'stroller' : 'infant car seat'}
                </p>
                <h3 className="mt-2 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                  {selectedOption.displayName}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">{selectedSummary}</p>
              </div>

              <button
                type="button"
                onClick={handleResultsClick}
                className="tool-btn tool-btn--primary min-w-[13.5rem] px-5 py-3 text-center"
              >
                {ctaCopy}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
