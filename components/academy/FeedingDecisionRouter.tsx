'use client';

import Link from 'next/link';

type Option = {
  title: string;
  description: string;
  href: string;
  eyebrow: string;
};

const OPTIONS: Option[] = [
  {
    title: 'Planning to pump or combo feed?',
    description: 'Explore pumps, setup, and what that routine actually requires in real life.',
    href: '/academy/gear/breast-pump',
    eyebrow: 'Next module',
  },
  {
    title: 'Planning to use bottles in any form?',
    description: 'Learn the bottle system, nipple flow, cleanup rhythm, and what to buy first.',
    href: '/academy/gear/bottles-and-baby-utensils',
    eyebrow: 'Next module',
  },
  {
    title: 'Not totally sure yet?',
    description: 'Start with pumps, then move into bottles. That is the most common next path from here.',
    href: '/academy/gear/breast-pump',
    eyebrow: 'Most common next step',
  },
];

export default function FeedingDecisionRouter() {
  return (
    <section className="space-y-6">
      <div className="max-w-3xl min-w-0">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">Decision Routing</p>
        <h2 className="mt-4 break-words font-serif text-[clamp(2rem,4vw,2.7rem)] leading-[1.06] tracking-[-0.04em] text-[#2F2430]">
          Where to go next
        </h2>
        <p className="mt-4 break-words text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.05rem]">
          Based on the routine you are most likely building, start with the next layer that answers the actual question instead of buying for every feeding possibility at once.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {OPTIONS.map((option) => (
          <Link
            key={option.title}
            href={option.href}
            className="group flex h-full min-w-0 flex-col rounded-[1.75rem] border border-[rgba(215,161,175,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,247,250,0.93)_100%)] p-5 shadow-[0_18px_44px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.3)] hover:shadow-[0_24px_56px_rgba(58,36,43,0.12)] sm:p-6"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{option.eyebrow}</p>
            <h3 className="mt-4 break-words font-serif text-[1.45rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
              {option.title}
            </h3>
            <p className="mt-4 break-words text-[0.98rem] leading-8 text-[#5B4B55]">{option.description}</p>
            <span className="mt-auto pt-6 text-sm uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
              {'Open module ->'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
