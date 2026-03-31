import 'server-only';

import { renderEmailLayout } from '@/lib/email/templates/shared';

export function consultationConfirmationTemplate({ name }: { name: string }) {
  return renderEmailLayout({
    previewText: 'Your consultation inquiry has been received.',
    eyebrow: 'TMBC Consultation',
    title: `Hi ${name},`,
    paragraphs: [
      'Your consultation inquiry has been received.',
      'This is where we start turning your preparation into a clear, confident plan.',
      "I'll follow up shortly with next steps that match what you shared in your intake.",
    ],
    cta: {
      label: 'Browse the Academy',
      href: 'https://taylormadebabyco.com/academy',
    },
    note: 'No need to re-submit anything. The intake already did the heavy lifting.',
    signature: ['Warmly,', 'Taylor'],
  });
}
