'use client';

import { useEffect, useState } from 'react';

export default function GuideScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }

      setProgress(Math.min(window.scrollY / maxScroll, 1));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 bg-transparent">
      <div
        className="h-full origin-left bg-[linear-gradient(90deg,rgba(201,116,85,0.95)_0%,rgba(215,161,175,1)_100%)] shadow-[0_4px_16px_rgba(201,116,85,0.22)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
