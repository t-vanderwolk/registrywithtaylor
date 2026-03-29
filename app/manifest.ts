import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/marketing/metadata';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Taylor-Made Baby Co.',
    short_name: 'TMBC',
    description: 'Expert baby gear guidance, registry strategy, and calm planning support for growing families.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#fdf8f5',
    theme_color: '#d889a0',
    icons: [
      {
        src: '/assets/editorial/ribbonbow.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/assets/editorial/ribbonbow.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    id: SITE_URL,
  };
}
