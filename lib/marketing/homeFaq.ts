/**
 * Homepage FAQ content — single source of truth for both the visible FAQ section
 * and the FAQPage JSON-LD schema, so the two never drift apart.
 *
 * Voice: Taylor's. Plain, warm, honest. No em dashes. Accurate to the real offer
 * ($75, one hour, virtual, longer-term support available on request).
 */
export type HomeFaqItem = {
  question: string;
  /** Plain-text answer used verbatim in the FAQPage schema and rendered in the UI. */
  answer: string;
};

export const HOME_FAQ: HomeFaqItem[] = [
  {
    question: 'What does a baby registry consultant do?',
    answer:
      'A baby registry consultant helps expecting parents choose the right strollers, car seats, nursery gear, and baby products for their actual home, lifestyle, and budget. At Taylor-Made Baby Co., Taylor Vanderwolk runs one hour virtual consultations that cover your whole registry, so you avoid expensive mistakes, narrow the big decisions, and end up with a list that fits your real life instead of the internet.',
  },
  {
    question: 'How much does a baby registry consultation cost?',
    answer:
      'A registry consultation with Taylor-Made Baby Co. is $75 for a one hour virtual session. That includes personalized gear guidance, help narrowing your biggest product decisions, and written follow up notes with your next best steps. Longer-term planning support is available too, just reach out through the contact form and Taylor will point you to the right level.',
  },
  {
    question: 'Is a baby registry consultation worth it?',
    answer:
      'For most expecting parents, one hour of expert guidance saves several hundred dollars in gear that would have been returned or never used. A consultant helps you skip the common mistakes, like buying a stroller that does not fit your car, registering for things that do not fit your home, or doubling up on items that do the same job. Plenty of clients change their original picks completely once they talk it through.',
  },
  {
    question: 'What is a Target Baby Concierge Specialist?',
    answer:
      'Target Baby Concierge Specialists are trained baby gear advisors placed in Target stores through the Baby Concierge program powered by Tot Squad. Taylor is a certified Tot Squad specialist, and it is the same expertise she brings to virtual consultations at Taylor-Made Baby Co.',
  },
  {
    question: 'When should I book a baby registry consultation?',
    answer:
      'Most families get the most out of a consultation somewhere between weeks 20 and 28. That is early enough to build the registry before baby shower season, but far enough along that you know your due date, home setup, and budget. That said, any stage works, including families who already have a partial registry and want help refining it.',
  },
  {
    question: 'What baby gear does a consultation cover?',
    answer:
      'A consultation covers stroller selection and compatibility, car seat safety and fit, nursery essentials and setup, sleep gear, feeding equipment, and registry strategy and timing. If you have specific product questions, like comparing two brands or choosing between options, bring them to the session and we will work through them together.',
  },
  {
    question: 'Do I need to have started my registry before booking?',
    answer:
      'No. Some clients show up with a blank registry and build from scratch in the session. Others arrive with a 150 item list and need help cutting it down. Both are completely normal, and both are exactly what the consultation is for. Taylor reviews your intake before you meet so she arrives ready for your situation.',
  },
  {
    question: 'Is the consultation virtual or in person?',
    answer:
      'Every consultation is virtual, held over video call, and available to expecting parents anywhere in the United States. The session is a one hour video call with Taylor, followed by written notes afterward. For families in the Phoenix area, Taylor can also connect you with CPST certified car seat specialists and local baby safety professionals.',
  },
];
