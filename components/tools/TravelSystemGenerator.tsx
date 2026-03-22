'use client';

import { useDeferredValue, useEffect, useId, useState } from 'react';
import {
  formatCompatibilityConfidence,
  formatCompatibilityType,
  type TravelSystemCompatibilityResponse,
  type TravelSystemStrollerOption,
  type CompatibleCarSeatResult,
} from '@/lib/compatibilityEngine';

type TravelSystemGeneratorProps = {
  strollers: TravelSystemStrollerOption[];
};

function buildStrollerValue(stroller: TravelSystemStrollerOption) {
  return `${stroller.brand}:::${stroller.model}`;
}

function parseStrollerValue(value: string) {
  const [brand = '', model = ''] = value.split(':::');

  return {
    brand,
    model,
  };
}

function compatibilityBadgeClasses(type: CompatibleCarSeatResult['compatibilityType']) {
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

export default function TravelSystemGenerator({ strollers }: TravelSystemGeneratorProps) {
  const searchId = useId();
  const selectId = useId();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStroller, setSelectedStroller] = useState('');
  const [result, setResult] = useState<TravelSystemCompatibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const filteredStrollers = deferredSearchQuery
    ? strollers.filter((stroller) => {
        const haystack = `${stroller.brand} ${stroller.model} ${stroller.displayName}`.toLowerCase();
        return haystack.includes(deferredSearchQuery);
      })
    : strollers;

  const strollerGroups = filteredStrollers.reduce<Record<string, TravelSystemStrollerOption[]>>((groups, stroller) => {
    if (!groups[stroller.brand]) {
      groups[stroller.brand] = [];
    }

    groups[stroller.brand].push(stroller);
    return groups;
  }, {});

  useEffect(() => {
    if (!selectedStroller) {
      setResult(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const { brand, model } = parseStrollerValue(selectedStroller);
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const params = new URLSearchParams({
          strollerBrand: brand,
          strollerModel: model,
        });
        const response = await fetch(`/api/compatibility?${params.toString()}`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });

        const payload = (await response.json().catch(() => null)) as
          | TravelSystemCompatibilityResponse
          | { error?: string }
          | null;

        if (!response.ok) {
          setError(payload && 'error' in payload && payload.error ? payload.error : 'Unable to load compatibility right now.');
          return;
        }

        setResult(payload as TravelSystemCompatibilityResponse);
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
  }, [selectedStroller]);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf2ec_100%)] p-6 shadow-[0_20px_60px_rgba(55,40,46,0.06)] md:p-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div className="rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-white/92 p-5 shadow-[0_14px_32px_rgba(0,0,0,0.04)]">
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">
            Stroller selector
          </p>
          <h2 className="mt-3 font-serif text-[1.7rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">
            Start with the stroller you already have or already love.
          </h2>
          <p className="mt-3 text-sm leading-7 text-neutral-700">
            The generator will pull infant car seats that fit, flag when an adapter is involved, and keep the answer readable.
          </p>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor={searchId}
                className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-600"
              >
                Search strollers
              </label>
              <input
                id={searchId}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Try MIXX, Cruz, Butterfly, Gazelle..."
                className="w-full rounded-[1rem] border border-[rgba(0,0,0,0.08)] bg-[#fcfaf7] px-4 py-3 text-[0.98rem] text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor={selectId}
                className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-600"
              >
                Select stroller
              </label>
              <select
                id={selectId}
                value={selectedStroller}
                onChange={(event) => setSelectedStroller(event.target.value)}
                className="w-full rounded-[1rem] border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3 text-[0.98rem] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-blush)]"
              >
                <option value="">Choose a stroller</option>
                {Object.entries(strollerGroups).map(([brand, brandStrollers]) => (
                  <optgroup key={brand} label={brand}>
                    {brandStrollers.map((stroller) => (
                      <option key={buildStrollerValue(stroller)} value={buildStrollerValue(stroller)}>
                        {stroller.model}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 rounded-[1.2rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-4 py-4 text-sm leading-7 text-neutral-600">
            {filteredStrollers.length > 0 ? (
              <p>
                {filteredStrollers.length} stroller option{filteredStrollers.length === 1 ? '' : 's'} in the current compatibility library. Convertible seats are intentionally excluded.
              </p>
            ) : (
              <p>No stroller matches that search yet. Try the brand name or the core model name.</p>
            )}
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-[rgba(0,0,0,0.06)] bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6">
          {!selectedStroller ? (
            <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-6 py-10 text-center md:min-h-[24rem]">
              <h3 className="font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">
                Start by selecting your stroller to see compatible car seats.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">
                This keeps the answer grounded in real fit, not a long list that still leaves you guessing.
              </p>
            </div>
          ) : loading ? (
            <ResultsSkeleton />
          ) : error ? (
            <div className="rounded-[1.4rem] border border-[rgba(189,95,95,0.22)] bg-[rgba(255,243,243,0.92)] px-5 py-6 text-sm leading-7 text-[rgba(142,69,69,0.98)]">
              {error}
            </div>
          ) : result ? (
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
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.4rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-5 py-6 text-sm leading-7 text-neutral-600">
                  No compatible infant car seats are listed for this stroller yet.
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
