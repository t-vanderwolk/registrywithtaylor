'use client';

import { useEffect } from 'react';

/**
 * Fires a silent POST to record a free preview lesson view.
 * Deduplicates within the same browser session via sessionStorage.
 * Renders nothing — pure side-effect component.
 */
export default function TrackPreviewView({ slug }: { slug: string }) {
  useEffect(() => {
    const sessionKey = `preview_view_${slug}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      return;
    }

    // Generate a lightweight visitor hash from session for unique-visitor counting
    let visitorHash: string | null = null;
    try {
      if (typeof sessionStorage !== 'undefined') {
        let stored = sessionStorage.getItem('tmbc_visitor');
        if (!stored) {
          stored = Math.random().toString(36).slice(2) + Date.now().toString(36);
          sessionStorage.setItem('tmbc_visitor', stored);
        }
        visitorHash = stored;
      }
    } catch {
      // sessionStorage may be blocked — proceed without visitor hash
    }

    fetch('/api/learn/preview/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, visitorHash }),
    })
      .then(() => {
        try {
          sessionStorage.setItem(sessionKey, '1');
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // Non-critical — silently swallow errors
      });
  }, [slug]);

  return null;
}
