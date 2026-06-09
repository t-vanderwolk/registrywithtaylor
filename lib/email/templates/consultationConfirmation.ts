import 'server-only';

import { renderEmailLayout } from '@/lib/email/templates/shared';

export function consultationConfirmationTemplate({ name }: { name: string }) {
  return renderEmailLayout({
    previewText: 'Next step: fill out your intake form so I can come prepared.',
    eyebrow: 'TMBC Consultation',
    title: `Hi ${name},`,
    paragraphs: [
      "I've received your consultation request — thank you for reaching out.",
      'Before our free 30-minute call, I\'d love for you to fill out a short intake form. It covers your home, routine, and the decisions you\'re working through, so I can come to our call fully prepared with recommendations that actually fit your situation.',
      'The form takes about 5–10 minutes and makes the conversation a lot more useful from the very first minute.',
    ],
    cta: {
      label: 'Fill Out Your Intake Form',
      href: 'https://taylormadebabyco.com/consultation/intake',
    },
    note: "If you have any questions before we connect, just reply directly to this email.",
    signature: ['Warmly,', 'Taylor'],
  });
}
