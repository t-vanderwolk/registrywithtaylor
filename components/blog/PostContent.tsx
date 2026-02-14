'use client';

import { useEffect } from 'react';

type PostContentProps = {
  postId: string;
  content: string;
};

export default function PostContent({ postId, content }: PostContentProps) {
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
    <div className="body-copy">
      {content.split('\n').map((paragraph, index) => {
        if (!paragraph.trim()) {
          return null;
        }
        return <p key={`${postId}-${index}`}>{paragraph}</p>;
      })}
    </div>
  );
}
