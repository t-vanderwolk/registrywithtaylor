import IconFrame from '@/components/ui/IconFrame';

type CheckIconProps = {
  frameClassName?: string;
  iconClassName?: string;
};

export default function CheckIcon({ frameClassName = 'mt-1', iconClassName = '' }: CheckIconProps) {
  return (
    <IconFrame size="inline" className={frameClassName} syncWithGroup>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={['h-5 w-5 text-[var(--color-accent-dark)]', iconClassName].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </IconFrame>
  );
}
