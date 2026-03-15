'use client';

import { useDeferredValue, useId, useState } from 'react';
import GuideGlyph from '@/components/guides/GuideGlyph';
import {
  findTravelSystemEntities,
  getFeaturedTravelSystemEntities,
  getTravelSystemEntity,
  getTravelSystemResults,
} from '@/lib/guides/travelSystemCompatibility';

function resultPillClasses(connectionLabel: string) {
  if (connectionLabel === 'Direct attach') {
    return 'bg-[rgba(143,182,154,0.16)] text-[rgba(72,114,87,0.95)]';
  }

  if (connectionLabel === 'Included adapter') {
    return 'bg-[rgba(196,156,94,0.14)] text-[rgba(124,94,46,0.95)]';
  }

  return 'bg-[rgba(217,134,162,0.14)] text-[rgba(153,86,115,0.98)]';
}

export default function GuideTravelSystemFinder() {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query.trim());

  const featuredEntities = getFeaturedTravelSystemEntities();
  const matches = deferredQuery ? findTravelSystemEntities(deferredQuery).slice(0, 8) : [];
  const selectedEntity = selectedEntityId ? getTravelSystemEntity(selectedEntityId) : null;
  const activeEntity = selectedEntity ?? (matches.length === 1 ? matches[0] : null);
  const results = activeEntity ? getTravelSystemResults(activeEntity.id) : [];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#fffdfa_0%,#fbf2ec_100%)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] md:p-8">
      <div className="space-y-2">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-accent-dark)]/82">Compatibility finder</p>
        <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.04em] text-neutral-900">Travel system compatibility generator</h2>
        <p className="max-w-3xl text-sm leading-7 text-neutral-700">
          Type a stroller or infant car seat from TMBC&apos;s featured compatibility library to see the travel-system pairings, adapter details, and the official brand note behind each match.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <div className="rounded-[1.6rem] border border-black/6 bg-white/92 p-5 shadow-[0_14px_32px_rgba(0,0,0,0.04)]">
          <label htmlFor={inputId} className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-dark)]/82">
            Search by stroller or seat
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-[1.2rem] border border-[rgba(0,0,0,0.08)] bg-[#fcfaf7] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
              <GuideGlyph icon="strategy" />
            </div>
            <input
              id={inputId}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedEntityId(null);
              }}
              type="text"
              placeholder="Try Butterfly, PIPA RX, Cruz V2, Mesa Max..."
              className="w-full border-0 bg-transparent p-0 text-[0.98rem] text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="mt-5">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">Quick picks</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {featuredEntities.map((entity) => (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => {
                    setQuery(entity.label);
                    setSelectedEntityId(entity.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 text-sm text-neutral-800 transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.22)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
                >
                  <GuideGlyph icon={entity.icon} className="h-4 w-4" />
                  <span>{entity.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>

          {deferredQuery ? (
            <div className="mt-6">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">Matches</p>
              {matches.length > 0 ? (
                <div className="mt-3 grid gap-2">
                  {matches.map((entity) => {
                    const isActive = activeEntity?.id === entity.id;
                    return (
                      <button
                        key={entity.id}
                        type="button"
                        onClick={() => {
                          setQuery(entity.label);
                          setSelectedEntityId(entity.id);
                        }}
                        className={`flex items-start gap-3 rounded-[1.2rem] border p-3 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] ${
                          isActive
                            ? 'border-[rgba(196,156,94,0.28)] bg-[rgba(255,248,241,0.96)] shadow-[0_10px_24px_rgba(0,0,0,0.04)]'
                            : 'border-[rgba(0,0,0,0.06)] bg-white hover:-translate-y-0.5 hover:border-[rgba(196,156,94,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)]'
                        }`}
                      >
                        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                          <GuideGlyph icon={entity.icon} className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900">{entity.label}</p>
                          <p className="mt-1 text-sm leading-6 text-neutral-600">{entity.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 rounded-[1.2rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-white/75 px-4 py-4 text-sm leading-7 text-neutral-600">
                  No compatibility matches yet for that search. Try the full model name or one of the quick picks.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-6 rounded-[1.2rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-white/75 px-4 py-4 text-sm leading-7 text-neutral-600">
              This finder covers the stroller and infant-seat models currently featured across the TMBC stroller and car seat guide ecosystem.
            </p>
          )}
        </div>

        <div className="rounded-[1.6rem] border border-black/6 bg-white/94 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.04)] md:p-6">
          {activeEntity ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[rgba(0,0,0,0.06)] pb-5">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-neutral-500">
                    {activeEntity.type === 'stroller' ? 'Compatible infant seats' : 'Compatible strollers'}
                  </p>
                  <h3 className="mt-2 font-serif text-[1.7rem] leading-[1.04] tracking-[-0.03em] text-neutral-900">{activeEntity.label}</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(196,156,94,0.12)] px-3 py-2 text-sm text-[var(--color-accent-dark)]">
                  <GuideGlyph icon={activeEntity.icon} className="h-4 w-4" />
                  <span>{results.length} option{results.length === 1 ? '' : 's'}</span>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {results.map((result) => (
                    <article
                      key={result.id}
                      className="flex h-full flex-col rounded-[1.4rem] border border-[rgba(0,0,0,0.06)] bg-[linear-gradient(180deg,#ffffff_0%,#fcfaf6_100%)] p-5 shadow-[0_12px_28px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] ${resultPillClasses(result.connectionLabel)}`}>
                          {result.connectionLabel}
                        </span>
                        <div className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.14em] text-neutral-500">
                          <GuideGlyph icon={result.counterpart.icon} className="h-4 w-4" />
                          <span>{result.counterpart.type === 'stroller' ? 'Stroller' : 'Infant seat'}</span>
                        </div>
                      </div>

                      <h4 className="mt-5 font-serif text-[1.35rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">{result.counterpart.label}</h4>
                      <p className="mt-2 text-sm leading-7 text-neutral-600">
                        {result.stroller.shortLabel} + {result.carSeat.shortLabel}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-neutral-700">{result.note}</p>

                      <div className="mt-auto pt-5">
                        <a
                          href={result.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 underline decoration-[rgba(196,156,94,0.45)] underline-offset-4"
                        >
                          <span>{result.sourceLabel}</span>
                          <span aria-hidden="true">-&gt;</span>
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-[1.2rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-4 py-5 text-sm leading-7 text-neutral-600">
                  There are no pairings in the current TMBC compatibility library for this model yet.
                </p>
              )}
            </>
          ) : (
            <div className="flex h-full min-h-[22rem] flex-col justify-center rounded-[1.4rem] border border-dashed border-[rgba(0,0,0,0.12)] bg-[#fcfaf7] px-5 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(196,156,94,0.12)] text-[var(--color-accent-dark)]">
                <GuideGlyph icon="carseat" className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-[1.55rem] leading-[1.08] tracking-[-0.03em] text-neutral-900">Search one anchor item first</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-neutral-600">
                Start with the stroller you already love or the infant seat you are trying to protect. The generator will pull the compatible travel-system pairings from there.
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs leading-6 text-neutral-500">
        Compatibility changes over time. This tool is intentionally limited to the stroller and infant-seat models currently featured in TMBC editorial content, and each result links back to the official brand page it came from.
      </p>
    </section>
  );
}
