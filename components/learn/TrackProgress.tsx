'use client';

import { useEffect } from 'react';

/**
 * Fires a silent POST to record this module visit for the logged-in learner.
 * Renders nothing — pure side-effect component.
 */
export default function TrackProgress({
  pathSlug,
  moduleSlug,
}: {
  pathSlug: string;
  moduleSlug: string;
}) {
  useEffect(() => {
    fetch('/api/user/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathSlug, moduleSlug }),
    }).catch(() => {
      // Non-critical — silently swallow errors
    });
  }, [pathSlug, moduleSlug]);

  return null;
}
