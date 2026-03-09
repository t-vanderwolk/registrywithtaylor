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
    <div className={[index < total - 1 ? 'border-b border-black/5' : '', 'py-5 sm:py-6'].filter(Boolean).join(' ')}>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((value) => !value)}
          className="flex min-h-[44px] w-full items-start justify-between gap-4 text-left text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)] md:gap-6"
        >
          <span className="text-[0.98rem] font-medium leading-relaxed sm:text-base md:text-lg">
            {item.question}
          </span>
          <span aria-hidden className="shrink-0 pt-1 text-black/60">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{
          maxHeight,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pt-4 pr-0 sm:pr-8 md:pr-10">
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
    <div className={['overflow-hidden rounded-2xl bg-white/30 shadow-sm', className].join(' ')}>
      <div className="px-4 sm:px-6 md:px-8">
        {items.map((item, index) => (
          <FAQAccordionItem key={item.question} item={item} index={index} total={items.length} groupId={groupId} />
        ))}
      </div>
    </div>
  );
}
