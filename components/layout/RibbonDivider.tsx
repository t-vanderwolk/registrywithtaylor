'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type RibbonDividerProps = {
  className?: string;
  enhanced?: boolean;
  decorative?: boolean;
};

export default function RibbonDivider({
  className = '',
  enhanced = false,
  decorative = true,
}: RibbonDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!enhanced);

  useEffect(() => {
    if (!enhanced) return;
    const node = containerRef.current;
    if (!node) return;

    // Trigger once when the divider enters viewport for a soft scroll reveal.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enhanced]);

  const wrapperClassName = [
    'relative w-full overflow-visible pointer-events-none bg-transparent',
    enhanced ? 'py-14 md:py-24 lg:py-28 transition-all duration-700 ease-out motion-reduce:transition-none' : '',
    enhanced ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4') : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const ribbonHeight = enhanced ? 132 : 110;

  return (
    <div
      ref={containerRef}
      className={wrapperClassName}
      aria-hidden={decorative ? 'true' : undefined}
    >
      {enhanced && (
        <>
          <div className="absolute inset-0 rounded-[36%_36%_24%_24%/16%_16%_10%_10%] bg-[radial-gradient(ellipse_at_center,rgba(248,240,232,0.45)_0%,rgba(248,240,232,0.18)_45%,rgba(248,240,232,0)_100%)]" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(0deg,rgba(163,137,120,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(163,137,120,0.2)_1px,transparent_1px)] [background-size:26px_26px]" />
        </>
      )}

      <div
        className="absolute z-10 bg-transparent"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          minWidth: '100vw',
          maxWidth: 'none',
          pointerEvents: 'none',
          height: `${ribbonHeight}px`,
          background: 'transparent',
        }}
      >
        <Image
          src="/assets/dividers/ribbon-divider.png"
          alt=""
          aria-hidden="true"
          fill
          priority={enhanced}
          className="object-fill bg-transparent"
        />
        <div className="absolute inset-0 blur-[3px] opacity-30 pointer-events-none bg-transparent" />
      </div>

      <div className={enhanced ? 'h-[132px] bg-transparent' : 'h-[100px] bg-transparent'} />
    </div>
  );
}
