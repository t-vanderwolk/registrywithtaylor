'use client';

import { useEffect } from 'react';

export default function PostViewTracker({ postId }: { postId: string }) {
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

  return null;
}
