'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type FAQEntry = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQEntry[];
  className?: string;
};

type FAQAccordionItemProps = {
  item: FAQEntry;
  index: number;
  total: number;
  groupId: string;
};

function FAQAccordionItem({ item, index, total, groupId }: FAQAccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState('0px');
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonId = `${groupId}-button-${index}`;
  const panelId = `${groupId}-panel-${index}`;

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
      return;
    }

    setMaxHeight('0px');
  }, [isOpen, item.answer]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleResize = () => {
      if (contentRef.current) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div
      className={[
        index < total - 1 ? 'border-b border-black/10' : '',
        'transition-colors duration-300',
        isOpen ? 'bg-white/50 ring-1 ring-inset ring-black/5' : 'bg-transparent',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((value) => !value)}
          className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left text-neutral-900 md:px-8 md:py-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
        >
          <span className="text-base md:text-lg font-medium leading-relaxed">
            {item.question}
          </span>
          <span
            aria-hidden
            className={[
              'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/15 text-lg leading-none text-neutral-500',
              'transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
              isOpen ? 'rotate-45 text-neutral-700 border-black/20' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            +
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{
          maxHeight,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-6 pb-6 md:px-8 md:pb-8">
          <p className="text-sm md:text-base leading-relaxed text-neutral-700">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const groupId = useId().replace(/:/g, '');

  return (
    <div className={['overflow-hidden rounded-2xl border border-black/5 bg-white/30 shadow-sm', className].join(' ')}>
      {items.map((item, index) => (
        <FAQAccordionItem key={item.question} item={item} index={index} total={items.length} groupId={groupId} />
      ))}
    </div>
  );
}
