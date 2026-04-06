import type { DecisionTagLabel } from '@/lib/academy/decisionSupport';

const TAG_STYLES: Record<DecisionTagLabel, string> = {
  'Start Here':
    'border-[rgba(161,91,114,0.18)] bg-[rgba(255,251,252,0.96)] text-[#8F4C62]',
  'Most Important':
    'border-[rgba(216,137,160,0.24)] bg-[rgba(252,241,245,0.96)] text-[#8F4C62]',
  'Most Overbought':
    'border-[rgba(184,116,138,0.18)] bg-[rgba(248,240,234,0.96)] text-[#7D4B5D]',
  'Wait on This':
    'border-[rgba(122,98,106,0.14)] bg-[rgba(255,255,255,0.92)] text-[#5B4B55]',
  'Most common path':
    'border-[rgba(215,161,175,0.22)] bg-[rgba(250,244,246,0.98)] text-[#8F4C62]',
  'Skip this for now':
    'border-[rgba(122,98,106,0.14)] bg-[rgba(250,247,244,0.98)] text-[#5B4B55]',
};

export default function DecisionTag({
  label,
  className = '',
}: {
  label: DecisionTagLabel;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex min-h-[30px] items-center rounded-full border px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.16em] ${TAG_STYLES[label]} ${className}`.trim()}
    >
      {label}
    </span>
  );
}
