'use client';

import { useEffect } from 'react';
import type { ReactNode } from 'react';

type PostContentProps = {
  postId: string;
  content: string;
  className?: string;
};

const orderedListPattern = /^\d+\.\s+/;

export default function PostContent({ postId, content, className }: PostContentProps) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/blog/${postId}/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'view' }),
      signal: controller.signal,
    }).catch(() => {
      // silently ignore tracking failures
    });

    return () => controller.abort();
  }, [postId]);

  return (
    <div className={className ?? 'body-copy'}>
      {(() => {
        const nodes: ReactNode[] = [];
        const lines = content.split('\n');
        let i = 0;
        let paragraphCount = 0;
        let h2Count = 0;

        while (i < lines.length) {
          const line = lines[i]?.trim() ?? '';

          if (!line) {
            i += 1;
            continue;
          }

          if (line.startsWith('## ')) {
            if (h2Count > 0) {
              nodes.push(
                <div
                  key={`${postId}-divider-${i}`}
                  className="border-t border-neutral-100 my-16"
                />,
              );
            }

            nodes.push(
              <h2 key={`${postId}-h2-${i}`} className="mt-14 mb-6 text-2xl md:text-3xl font-serif">
                {line.replace(/^##\s+/, '')}
              </h2>,
            );
            h2Count += 1;
            i += 1;
            continue;
          }

          if (line.startsWith('# ')) {
            i += 1;
            continue;
          }

          if (line.startsWith('- ')) {
            const items: string[] = [];
            while (i < lines.length) {
              const candidate = lines[i]?.trim() ?? '';
              if (!candidate.startsWith('- ')) break;
              items.push(candidate.replace(/^-+\s+/, ''));
              i += 1;
            }

            nodes.push(
              <ul key={`${postId}-ul-${i}`} className="my-6">
                {items.map((item, index) => (
                  <li key={`${postId}-ul-${i}-${index}`} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>,
            );
            continue;
          }

          if (orderedListPattern.test(line)) {
            const items: string[] = [];
            while (i < lines.length) {
              const candidate = lines[i]?.trim() ?? '';
              if (!orderedListPattern.test(candidate)) break;
              items.push(candidate.replace(/^\d+\.\s+/, ''));
              i += 1;
            }

            nodes.push(
              <ol key={`${postId}-ol-${i}`} className="my-6">
                {items.map((item, index) => (
                  <li key={`${postId}-ol-${i}-${index}`} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>,
            );
            continue;
          }

          const paragraphLines: string[] = [];
          while (i < lines.length) {
            const candidate = lines[i]?.trim() ?? '';
            if (
              !candidate ||
              candidate.startsWith('# ') ||
              candidate.startsWith('## ') ||
              candidate.startsWith('- ') ||
              orderedListPattern.test(candidate)
            ) {
              break;
            }
            paragraphLines.push(candidate);
            i += 1;
          }

          if (paragraphLines.length > 0) {
            paragraphCount += 1;
            nodes.push(
              <p
                key={`${postId}-p-${i}`}
                className={paragraphCount === 1 ? 'text-lg md:text-xl text-neutral-700 leading-relaxed' : 'leading-relaxed text-[1.05rem]'}
              >
                {paragraphLines.join(' ')}
              </p>,
            );
          }
        }

        return nodes;
      })()}
    </div>
  );
}
