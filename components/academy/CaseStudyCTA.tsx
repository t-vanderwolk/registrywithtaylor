import Link from 'next/link';
import type { CaseStudy } from '@/lib/caseStudies';
import { getCaseStudyHref } from '@/lib/caseStudies';

export default function CaseStudyCTA({
  studies,
  eyebrow = 'Case Studies',
  title = 'See how this plays out in real life',
  description = 'Use these case studies when the framework is clear, but you want to see what the decision looks like in an actual home with actual constraints.',
  className = '',
}: {
  studies: CaseStudy[];
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  if (studies.length === 0) {
    return null;
  }

  return (
    <section className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">{eyebrow}</p>
        <h2 className="mt-4 break-words font-serif text-[clamp(1.9rem,3.6vw,2.55rem)] leading-[1.08] tracking-[-0.04em] text-[#2F2430]">
          {title}
        </h2>
        <p className="mt-5 break-words text-[1rem] leading-8 text-[#5B4B55] sm:text-[1.04rem]">
          {description}
        </p>
      </div>

      <div className={`grid gap-5 ${studies.length > 2 ? 'md:grid-cols-2 xl:grid-cols-3' : studies.length > 1 ? 'md:grid-cols-2' : ''}`}>
        {studies.map((study) => (
          <Link
            key={study.slug}
            href={getCaseStudyHref(study.slug)}
            className="group flex h-full min-w-0 flex-col rounded-[1.75rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(255,247,250,0.92)_100%)] px-5 py-6 shadow-[0_18px_42px_rgba(58,36,43,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:bg-white hover:shadow-[0_26px_58px_rgba(58,36,43,0.11)] sm:px-6"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{study.snapshot.home}</p>
            <h3 className="mt-4 break-words font-serif text-[1.5rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430] sm:text-[1.7rem]">
              {study.title}
            </h3>
            <p className="mt-4 break-words text-[0.98rem] leading-7 text-[#5B4B55]">{study.deck}</p>
            <div className="mt-5 rounded-[1.25rem] border border-[rgba(215,161,175,0.14)] bg-white/72 px-4 py-4">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#A15B72]">Best first move</p>
              <p className="mt-2 break-words text-[0.95rem] leading-7 text-[#4B3641]">{study.snapshot.bestFirstMove}</p>
            </div>
            <span className="mt-auto pt-6 text-sm uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
              See how this plays out <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
