'use client';

import { useId, useState } from 'react';

type LuxuryAccordionProps = {
  items: string[];
  className?: string;
  panelClassName?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  closedLabel?: string;
  openLabel?: string;
};

function CheckCircleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 flex-shrink-0 text-blush"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.3 2.3 2.3 4.8-5.1" />
    </svg>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={[
        'h-5 w-5 flex-shrink-0 text-black/45 transition-all duration-300 ease-in-out',
        isOpen ? 'rotate-180' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function LuxuryAccordion({
  items,
  className = '',
  panelClassName = '',
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  closedLabel = 'Learn more',
  openLabel = 'Show less',
}: LuxuryAccordionProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const accordionId = useId().replace(/:/g, '');
  const buttonId = `${accordionId}-button`;
  const panelId = `${accordionId}-panel`;
  const isControlled = typeof controlledIsOpen === 'boolean';
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  function handleToggle() {
    if (isControlled) {
      onToggle?.();
      return;
    }

    setUncontrolledIsOpen((value) => {
      const nextValue = !value;
      onToggle?.();
      return nextValue;
    });
  }

  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')}>
      <div className="order-2 mt-6 flex justify-center">
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={handleToggle}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-black/10 bg-[#F7F4EF] px-5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-800 transition-all duration-300 ease-in-out hover:border-black/15 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
        >
          <span>{isOpen ? openLabel : closedLabel}</span>
          <ChevronIcon isOpen={isOpen} />
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={[
          'order-1 grid overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">
          <div
            className={[
              'rounded-xl bg-neutral-50 p-6',
              panelClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <ul className="max-w-md space-y-3">
              {items.map((item) => (
                <li key={item}>
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon />
                    <span className="max-w-md text-sm leading-relaxed text-neutral-700">{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
