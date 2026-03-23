import type { ReactNode } from 'react';
import GuideSignoffMark from '@/components/blog/GuideSignoffMark';

export default function GuideHandwrittenNote({
  eyebrow,
  title,
  description,
  tone = 'blush',
  size = 'default',
  presentation = 'card',
  showSignoff = true,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  tone?: 'white' | 'blush' | 'linen';
  size?: 'default' | 'compact';
  presentation?: 'card' | 'margin';
  showSignoff?: boolean;
  className?: string;
}) {
  const toneClassName =
    tone === 'linen'
      ? 'border-[rgba(196,156,94,0.18)] bg-[linear-gradient(180deg,#FFFDF8_0%,#F6EEE4_100%)]'
      : tone === 'white'
        ? 'border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#FFFFFF_0%,#FBF3F6_100%)]'
        : 'border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,#FFF9FB_0%,#F8EEF2_100%)]';

  const isCompact = size === 'compact';
  const isMargin = presentation === 'margin';

  return (
    <aside
      className={`relative overflow-hidden border ${isMargin ? 'rotate-[-1.5deg] border-[rgba(217,134,162,0.18)] bg-[linear-gradient(180deg,rgba(255,249,252,0.98)_0%,rgba(252,244,247,0.98)_100%)] shadow-[0_10px_24px_rgba(58,36,43,0.05)]' : `${toneClassName} shadow-[0_18px_44px_rgba(58,36,43,0.07)]`} ${isCompact ? 'rounded-[1.3rem] p-3.5 sm:rounded-[1.45rem] sm:p-5' : 'rounded-[1.55rem] p-4 sm:rounded-[1.75rem] sm:p-6'} ${className}`.trim()}
    >
      {isMargin ? (
        <>
          <div className="pointer-events-none absolute left-3 top-3 h-2 w-2 rounded-full bg-[rgba(217,134,162,0.22)]" />
          <div className="pointer-events-none absolute left-7 top-3 h-[1px] w-16 bg-[rgba(217,134,162,0.16)]" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute left-[-2.5rem] top-2 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(232,154,174,0.18)_0%,rgba(232,154,174,0)_72%)] blur-3xl" />
          <div className="pointer-events-none absolute right-[-2rem] bottom-[-1.5rem] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(228,138,167,0.16)_0%,rgba(228,138,167,0)_74%)] blur-3xl" />
        </>
      )}

      <div className={`relative flex flex-col gap-4 sm:gap-5 ${isMargin ? '' : 'md:flex-row md:items-end md:justify-between'}`}>
        <div className="max-w-3xl">
          <h3
            className={`${isMargin ? 'mt-1 text-[1.45rem] font-medium leading-[1.12] text-[#D986A2] sm:text-[1.62rem]' : `${eyebrow ? 'mt-3' : 'mt-0'} font-semibold leading-[0.92] tracking-[0.01em] text-[#D986A2] ${isCompact ? 'text-[1.5rem] sm:text-[1.8rem]' : 'text-[2.05rem] sm:text-[2.45rem]'}`}`}
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            {title}
          </h3>
          {description ? (
            <div className={`mt-4 ${isMargin ? 'font-normal text-[#C77996]' : 'text-[#5B4B55]'} ${isCompact ? 'text-[0.9rem] leading-6 sm:text-[0.92rem] sm:leading-7' : 'text-sm leading-6 sm:text-[0.98rem] sm:leading-7'}`}>
              {description}
            </div>
          ) : null}

          {showSignoff && isMargin ? (
            <div
              className="mt-4 flex flex-col items-end text-[#D986A2]"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              <span className="text-[1.2rem] leading-none sm:text-[1.35rem]">XOXO</span>
              <span className="mt-1 text-[1.02rem] leading-none sm:text-[1.15rem]">-T</span>
            </div>
          ) : null}
        </div>

        {showSignoff && !isMargin ? (
          <div className={`shrink-0 text-[#D986A2] ${isCompact ? 'w-[5.8rem] sm:w-[6.4rem]' : 'w-[7rem] sm:w-[7.75rem]'}`}>
            <GuideSignoffMark className="h-auto w-full max-w-full" />
          </div>
        ) : null}
      </div>
    </aside>
  );
}
