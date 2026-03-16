import type { ReactNode } from 'react';

export function renderBrandWordmarkText(text: string, key: string): ReactNode[] {
  const parts = text.split(/(Taylor-Made)/gi);

  return parts.map((part, index) => {
    if (part.toLowerCase() === 'taylor-made') {
      return (
        <span key={`${key}-${index}`} className="font-script text-[var(--color-accent-dark)]">
          {part}
        </span>
      );
    }
    return part;
  });
}