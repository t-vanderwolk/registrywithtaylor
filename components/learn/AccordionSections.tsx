'use client';

import Image from 'next/image';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CoreSection = {
  title: string;
  paragraphs: string[];
  imageSrc?: string | null;
  imageAlt?: string | null;
  imageCaption?: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractPreview(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  if (match && match[0].length >= 20 && match[0].length <= 160) return match[0].trim();
  if (text.length <= 120) return text;
  return text.slice(0, 120).replace(/\s+\S+$/, '') + '…';
}

function extractFirstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  if (match && match[0].length >= 20 && match[0].length <= 200) return match[0].trim();
  if (text.length <= 160) return text;
  return text.slice(0, 160).replace(/\s+\S+$/, '') + '…';
}

// ─── AccordionItem ────────────────────────────────────────────────────────────

function AccordionItem({
  section,
  index,
  isOpen,
  onToggle,
}: {
  section: CoreSection;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const preview = section.paragraphs[0] ? extractPreview(section.paragraphs[0]) : '';
  // Pull quote after every other section (2nd, 4th…)
  const pullQuote =
    index % 2 === 1 && section.paragraphs.length > 0
      ? extractFirstSentence(section.paragraphs[section.paragraphs.length - 1])
      : null;

  return (
    <div
      className={[
        'overflow-hidden rounded-[1.25rem] border transition-all duration-300',
        isOpen
          ? 'border-[rgba(215,161,175,0.32)] bg-white shadow-[0_12px_32px_rgba(72,49,56,0.08)]'
          : 'border-[rgba(215,161,175,0.16)] bg-white shadow-[0_4px_12px_rgba(72,49,56,0.03)] hover:border-[rgba(215,161,175,0.28)] hover:shadow-[0_8px_24px_rgba(72,49,56,0.07)]',
      ].join(' ')}
    >
      {/* ── Trigger ───────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-[rgba(253,248,250,0.8)] sm:px-8 sm:py-6"
      >
        {/* Number badge */}
        <span
          className={[
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-bold transition-all duration-300',
            isOpen
              ? 'border-[rgba(215,161,175,0.45)] bg-[rgba(232,154,174,0.14)] text-[var(--color-accent-dark)]'
              : 'border-[rgba(215,161,175,0.22)] bg-transparent text-neutral-400',
          ].join(' ')}
        >
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <p
            className={[
              'font-serif text-[1.08rem] leading-tight tracking-[-0.025em] transition-colors duration-200 sm:text-[1.18rem]',
              isOpen ? 'text-neutral-900' : 'text-neutral-700',
            ].join(' ')}
          >
            {section.title}
          </p>
          {/* Preview first sentence when collapsed */}
          {!isOpen && preview && (
            <p className="mt-1 line-clamp-1 text-[0.82rem] leading-relaxed text-neutral-400">
              {preview}
            </p>
          )}
        </div>

        {/* Chevron */}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={[
            'h-4 w-4 shrink-0 text-[var(--color-accent-dark)]/40 transition-transform duration-300',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
          aria-hidden
        >
          <path
            d="M2 4.5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Expandable content (CSS grid trick for smooth height animation) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows 360ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="border-t border-[rgba(0,0,0,0.05)] bg-[rgba(253,250,251,0.5)] px-6 py-6 sm:px-8 sm:py-7">
            <div className="tmbc-blog">
              {/* Optional section image */}
              {section.imageSrc && (
                <div className="relative mb-6 aspect-video overflow-hidden rounded-[0.9rem] bg-[rgba(253,245,247,0.8)]">
                  <Image
                    src={section.imageSrc}
                    alt={section.imageAlt ?? ''}
                    fill
                    className="object-contain p-4"
                    sizes="(min-width: 768px) 600px, 100vw"
                  />
                  {section.imageCaption && (
                    <p className="mt-2 text-center text-[0.8rem] italic text-neutral-400">
                      {section.imageCaption}
                    </p>
                  )}
                </div>
              )}

              {/* Paragraphs */}
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              {/* Pull quote (every other section) */}
              {pullQuote && (
                <blockquote className="tmbc-quote">{pullQuote}</blockquote>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function AccordionSections({ sections }: { sections: CoreSection[] }) {
  // First section open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!sections.length) return null;

  const toggle = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <div>
      {/* Section label bar */}
      <div className="mb-5 flex items-center gap-3">
        <span className="text-[0.63rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent-dark)]/55">
          Lesson content
        </span>
        <span className="flex-1 border-t border-[rgba(215,161,175,0.2)]" />
        <span className="text-[0.68rem] text-neutral-400">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <AccordionItem
            key={index}
            section={section}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => toggle(index)}
          />
        ))}
      </div>
    </div>
  );
}
