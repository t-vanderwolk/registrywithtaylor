import type { MetadataRoute } from 'next';
import { SITE_LOGO_PATH, SITE_URL } from '@/lib/marketing/metadata';

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
        src: SITE_LOGO_PATH,
        sizes: '288x572',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: SITE_LOGO_PATH,
        sizes: '288x572',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    id: SITE_URL,
  };
}
