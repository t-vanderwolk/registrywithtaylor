'use client';

import Image from 'next/image';
import { useDeferredValue, useEffect, useId, useState } from 'react';
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
import { getAffiliateLinks } from '@/lib/travelSystemAffiliateLinks';

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
      return 'border-[rgba(123,169,138,0.22)] bg-[rgba(141,189,156,0.18)] text-[rgba(67,106,80,0.98)]';
    case 'ADAPTER':
      return 'border-[rgba(0,0,0,0.08)] bg-[rgba(255,255,255,0.86)] text-neutral-700';
    case 'LIMITED':
      return 'border-[rgba(196,156,94,0.2)] bg-[rgba(227,190,120,0.18)] text-[rgba(124,90,39,0.98)]';
    case 'LOCKED':
      return 'border-[rgba(126,125,131,0.2)] bg-[rgba(215,212,219,0.28)] text-[rgba(77,77,84,0.96)]';
    case 'INCOMPATIBLE':
    default:
      return 'border-[rgba(189,95,95,0.22)] bg-[rgba(226,135,135,0.16)] text-[rgba(149,68,68,0.98)]';
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
    <div className="rounded-[1.2rem] border border-[rgba(0,0,0,0.08)] bg-[#fcfaf7] p-1.5">
      <div className="grid gap-1 sm:grid-cols-2">
        {([
          {
            id: 'stroller',
            label: 'Stroller First',
            description: 'Choose the stroller, then see which infant seats fit it.',
          },
          {
            id: 'carSeat',
            label: 'Car Seat First',
            description: 'Choose the infant seat, then see which strollers support it.',
          },
        ] as const).map((option) => {
          const isActive = mode === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-[1rem] px-4 py-3 text-left transition duration-200 ${
                isActive
                  ? 'bg-white shadow-[0_10px_24px_rgba(0,0,0,0.06)]'
                  : 'hover:bg-white/70'
              }`}
            >
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">
                {option.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AffiliateBuyButtons({ brand, model }: { brand: string; model: string }) {
  const links = getAffiliateLinks(brand, model);
  if (!links.babylistUrl && !links.amazonUrl) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.babylistUrl ? (
        <a
          href={links.babylistUrl}
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
      ) : null}
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

function ResultImage({
  imageUrl,
  imageAlt,
  fallbackLabel,
}: {
  imageUrl?: string | null;
  imageAlt?: string | null;
  fallbackLabel: string;
}) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[rgba(0,0,0,0.05)] bg-[linear-gradient(180deg,#fffdf9_0%,#f8f3ed_100%)]">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={imageUrl}
          alt={imageAlt ?? fallbackLabel}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-contain p-4"
        />
      </div>
    </div>
  );
}

export default function TravelSystemGenerator({ strollers, carSeats }: TravelSystemGeneratorProps) {
  const searchId = useId();
  const selectId = useId();
  const [lookupMode, setLookupMode] = useState<LookupMode>('stroller');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  useEffect(() => {
    setSearchQuery('');
    setSelectedValue('');
    setResult(null);
    setError(null);
    setLoading(false);
  }, [lookupMode]);

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

  const selectorEyebrow = lookupMode === 'stroller' ? 'Stroller selector' : 'Car seat selector';
  const selectorTitle =
    lookupMode === 'stroller'
      ? 'Start with the stroller you already have or already love.'
      : 'Start with the infant car seat you already trust or already narrowed down.';
  const selectorDescription =
    lookupMode === 'stroller'
      ? 'The generator will pull infant car seats that fit, flag when an adapter is involved, and keep the answer readable.'
      : 'The generator will pull stroller matches, show where the ecosystem is clean, and flag where adapter planning starts to matter.';
  const searchLabel = lookupMode === 'stroller' ? 'Search strollers' : 'Search infant car seats';
  const searchPlaceholder =
    lookupMode === 'stroller'
      ? 'Try MIXX, Cruz, Butterfly, Gazelle...'
      : 'Try PIPA RX, KeyFit 35, Mico Luxe, Liing...';
  const selectLabel = lookupMode === 'stroller' ? 'Select stroller' : 'Select infant car seat';
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
    <section className="overflow-hidden rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf2ec_100%)] p-6 shadow-[0_20px_60px_rgba(55,40,46,0.06)] md:p-8">
      <ModeToggle mode={lookupMode} onChange={setLookupMode} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-white/92 p-5 shadow-[0_14px_32px_rgba(0,0,0,0.04)]">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
            {selectorEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-[1.7rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">
            {selectorTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">{selectorDescription}</p>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor={searchId}
                className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-600"
              >
                {searchLabel}
              </label>
              <input
                id={searchId}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-[1rem] border border-[rgba(0,0,0,0.08)] bg-[#fcfaf7] px-4 py-3 text-[0.98rem] text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={selectId}
                className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-600"
              >
                {selectLabel}
              </label>
              <select
                id={selectId}
                value={selectedValue}
                onChange={(event) => setSelectedValue(event.target.value)}
                className="w-full rounded-[1rem] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 text-[0.98rem] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]"
              >
                <option value="">{lookupMode === 'stroller' ? 'Choose a stroller' : 'Choose an infant car seat'}</option>
                {Object.entries(optionGroups).map(([brand, options]) => (
                  <optgroup key={brand} label={brand}>
                    {options.map((option) => (
                      <option key={buildOptionValue(option)} value={buildOptionValue(option)}>
                        {option.model}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

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
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[rgba(0,0,0,0.06)] pb-5">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">Compatible infant car seats</p>
                  <h3 className="mt-2 font-serif text-[1.75rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">
                    {result.stroller.displayName}
                  </h3>
                  {result.stroller.summary ? (
                    <p className="mt-2 text-sm leading-7 text-neutral-600">{result.stroller.summary}</p>
                  ) : null}
                </div>
                <div className="inline-flex items-center rounded-full bg-[rgba(215,161,175,0.14)] px-3 py-2 text-sm text-[var(--color-accent-dark)]">
                  {result.compatibleCarSeats.length} option{result.compatibleCarSeats.length === 1 ? '' : 's'}
                </div>
              </div>

              {activeInsight ? (
                <div className="mt-5 grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">System type</p>
                    <span
                      className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${ecosystemBadgeClasses(activeInsight.ecosystemType)}`}
                    >
                      {activeInsight.ecosystemLabel}
                    </span>
                  </div>

                  <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">What most parents should know first</p>
                    <p className="mt-2 text-sm leading-7 text-neutral-700">{activeInsight.tmbcInsight}</p>
                  </div>
                </div>
              ) : null}

              {result.compatibleCarSeats.length > 0 ? (
                <div className="mt-6 grid gap-4">
                  {result.compatibleCarSeats.map((seat) => (
                    <article
                      key={`${result.stroller.brand}-${result.stroller.model}-${seat.brand}-${seat.model}`}
                      className="rounded-[1.5rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf6_100%)] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">{seat.brand}</p>
                          <h4 className="mt-2 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                            {seat.displayName}
                          </h4>
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${compatibilityBadgeClasses(seat.compatibilityType)}`}
                        >
                          {formatCompatibilityType(seat.compatibilityType)}
                        </span>
                      </div>

                      <ResultImage
                        imageUrl={seat.imageUrl}
                        imageAlt={seat.imageAlt}
                        fallbackLabel={seat.displayName}
                      />

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">Adapter required</p>
                          <p className="mt-2 text-sm font-semibold text-neutral-900">{seat.adapterRequired ? 'Yes' : 'No'}</p>
                        </div>

                        <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">Adapter type</p>
                          <p className="mt-2 text-sm font-semibold text-neutral-900">{seat.adapterType ?? 'Not needed'}</p>
                        </div>

                        <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">Confidence</p>
                          <p className="mt-2 text-sm font-semibold text-neutral-900">{formatCompatibilityConfidence(seat.confidence)}</p>
                        </div>
                      </div>

                      {seat.notes ? (
                        <p className="mt-4 text-sm leading-7 text-neutral-700">{seat.notes}</p>
                      ) : null}

                      <AffiliateBuyButtons brand={seat.brand} model={seat.model} />
                    </article>
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
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[rgba(0,0,0,0.06)] pb-5">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">Compatible strollers</p>
                  <h3 className="mt-2 font-serif text-[1.75rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">
                    {result.carSeat.displayName}
                  </h3>
                  {result.carSeat.summary ? (
                    <p className="mt-2 text-sm leading-7 text-neutral-600">{result.carSeat.summary}</p>
                  ) : null}
                </div>
                <div className="inline-flex items-center rounded-full bg-[rgba(215,161,175,0.14)] px-3 py-2 text-sm text-[var(--color-accent-dark)]">
                  {result.compatibleStrollers.length} option{result.compatibleStrollers.length === 1 ? '' : 's'}
                </div>
              </div>

              {activeInsight ? (
                <div className="mt-5 grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)]">
                  <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">System type</p>
                    <span
                      className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${ecosystemBadgeClasses(activeInsight.ecosystemType)}`}
                    >
                      {activeInsight.ecosystemLabel}
                    </span>
                  </div>

                  <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">What most parents should know first</p>
                    <p className="mt-2 text-sm leading-7 text-neutral-700">{activeInsight.tmbcInsight}</p>
                  </div>
                </div>
              ) : null}

              {result.compatibleStrollers.length > 0 ? (
                <div className="mt-6 grid gap-4">
                  {result.compatibleStrollers.map((stroller) => (
                    <article
                      key={`${result.carSeat.brand}-${result.carSeat.model}-${stroller.brand}-${stroller.model}`}
                      className="rounded-[1.5rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf6_100%)] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">{stroller.brand}</p>
                          <h4 className="mt-2 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                            {stroller.displayName}
                          </h4>
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${compatibilityBadgeClasses(stroller.compatibilityType)}`}
                        >
                          {formatCompatibilityType(stroller.compatibilityType)}
                        </span>
                      </div>

                      <ResultImage
                        imageUrl={stroller.imageUrl}
                        imageAlt={stroller.imageAlt}
                        fallbackLabel={stroller.displayName}
                      />

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">Adapter required</p>
                          <p className="mt-2 text-sm font-semibold text-neutral-900">{stroller.adapterRequired ? 'Yes' : 'No'}</p>
                        </div>

                        <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">Adapter type</p>
                          <p className="mt-2 text-sm font-semibold text-neutral-900">{stroller.adapterType ?? 'Not needed'}</p>
                        </div>

                        <div className="rounded-[1rem] bg-[rgba(251,247,244,0.88)] px-4 py-3">
                          <p className="text-[0.68rem] uppercase tracking-[0.16em] text-neutral-500">Confidence</p>
                          <p className="mt-2 text-sm font-semibold text-neutral-900">{formatCompatibilityConfidence(stroller.confidence)}</p>
                        </div>
                      </div>

                      {stroller.summary ? (
                        <p className="mt-4 text-sm leading-7 text-neutral-700">{stroller.summary}</p>
                      ) : null}
                      {stroller.notes ? (
                        <p className="mt-3 text-sm leading-7 text-neutral-700">{stroller.notes}</p>
                      ) : null}

                      <AffiliateBuyButtons brand={stroller.brand} model={stroller.model} />
                    </article>
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
