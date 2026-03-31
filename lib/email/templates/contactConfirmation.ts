import 'server-only';

import { renderEmailLayout } from '@/lib/email/templates/shared';

export function contactConfirmationTemplate({ name }: { name: string }) {
  return renderEmailLayout({
    previewText: 'Thank you for reaching out to Taylor-Made Baby Co.',
    eyebrow: 'TMBC Contact',
    title: `Hi ${name},`,
    paragraphs: [
      'Thank you for reaching out to Taylor-Made Baby Co.',
      "I've received your message and will be in touch shortly.",
      'In the meantime, you can start with the Academy if you want a calmer place to sort the next step.',
    ],
    cta: {
      label: 'Start with the Academy',
      href: 'https://taylormadebabyco.com/academy',
    },
    note: 'You do not need to send anything again. Your note is in the right place.',
    signature: ['Warmly,', 'Taylor'],
  });
}
