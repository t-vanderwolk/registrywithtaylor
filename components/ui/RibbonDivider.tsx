"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function RibbonDivider({
  className = "",
  alt = "Decorative ribbon divider",
}: {
  className?: string;
  alt?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const dividerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = dividerRef.current;
    if (!node) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const containerClasses = [
    "ribbon-divider",
    className,
    // Extra vertical breathing room around the divider for editorial pacing.
    "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden py-12 sm:py-16 lg:py-24 xl:py-28",
    // Soft fade-up on reveal; disabled by prefers-reduced-motion.
    "transition-all duration-300 ease-out motion-reduce:transform-none motion-reduce:opacity-100",
    isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div aria-hidden="true" ref={dividerRef} className={containerClasses}>
      <div className="relative h-[140px] w-full overflow-hidden rounded-[28px] sm:h-[170px] md:h-[210px] lg:rounded-[44px]">
        {/* Very low-opacity linen texture to avoid a flat decorative feel. */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-[0.05] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(246,241,236,0.4)),repeating-linear-gradient(90deg,rgba(58,58,58,0.08)_0,rgba(58,58,58,0.08)_1px,transparent_1px,transparent_12px)]"
          aria-hidden="true"
        />
        <Image
          src="/assets/dividers/ribbon-divider.png"
          alt={alt}
          fill
          sizes="100vw"
          priority
          className="h-auto w-full object-cover"
        />
      </div>
    </div>
  );
}
