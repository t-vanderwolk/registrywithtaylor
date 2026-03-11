'use client';

import IconFrame from '@/components/ui/IconFrame';

type PartnerBrandMarkProps = {
  lines: string[];
  className?: string;
  size?: 'default' | 'addon' | 'card';
};

const frameSizeMap = {
  default: 'lg',
  addon: 'hero',
  card: 'jumbo',
} as const;

const bodyClassMap = {
  default: 'px-2.5 py-2',
  addon: 'px-3 py-2.5',
  card: 'px-3.5 py-3',
} as const;

const lineClassMap = {
  default: {
    primary: 'text-[0.7rem] tracking-[0.2em]',
    secondary: 'text-[0.55rem] tracking-[0.12em]',
  },
  addon: {
    primary: 'text-[0.84rem] tracking-[0.18em] md:text-[0.92rem]',
    secondary: 'text-[0.62rem] tracking-[0.1em] md:text-[0.68rem]',
  },
  card: {
    primary: 'text-[0.98rem] tracking-[0.18em] md:text-[1.08rem]',
    secondary: 'text-[0.74rem] tracking-[0.1em] md:text-[0.8rem]',
  },
} as const;

export default function PartnerBrandMark({
  lines,
  className = '',
  size = 'default',
}: PartnerBrandMarkProps) {
  const normalizedLines = lines.filter(Boolean);
  const [primary, ...rest] = normalizedLines;

  return (
    <IconFrame
      size={frameSizeMap[size]}
      className={className}
      innerClassName="h-full w-full"
      interactive
      syncWithGroup
    >
      <div
        className={[
          'flex h-full w-full flex-col items-center justify-center text-center',
          'bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.22)_46%,transparent_80%)]',
          bodyClassMap[size],
        ].join(' ')}
      >
        <span
          className={[
            'mb-2 h-px bg-[linear-gradient(90deg,transparent_0%,rgba(184,116,138,0.44)_28%,rgba(184,116,138,0.44)_72%,transparent_100%)]',
            size === 'card' ? 'w-12' : 'w-10',
          ].join(' ')}
          aria-hidden="true"
        />
        {primary ? (
          <span
            className={[
              'font-sans font-semibold uppercase leading-none text-[var(--tmbc-rose)]',
              lineClassMap[size].primary,
            ].join(' ')}
          >
            {primary}
          </span>
        ) : null}
        {rest.map((line, index) => (
          <span
            key={`${line}-${index}`}
            className={[
              index === 0 ? 'mt-1.5' : 'mt-0.5',
              'font-sans font-medium uppercase leading-none text-[rgba(107,103,104,0.88)]',
              lineClassMap[size].secondary,
            ].join(' ')}
          >
            {line}
          </span>
        ))}
      </div>
    </IconFrame>
  );
}
