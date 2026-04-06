import Link from 'next/link';
import DecisionTag from '@/components/academy/DecisionTag';
import {
  getDecisionRouteOptions,
  type DecisionRouteOption,
} from '@/lib/academy/decisionSupport';
import type { AcademyPathSlug, AcademyRelatedLink } from '@/lib/academy/content';

type DecisionRouterModule = {
  slug: string;
  title: string;
  description: string;
  subhead: string;
  pathSlug: AcademyPathSlug;
  progress: {
    current: number;
    total: number;
  };
  moduleType?: 'bridge' | 'standard';
  decisionBullets: string[];
  coreSections: Array<{
    title: string;
    paragraphs?: string[];
  }>;
  next?: AcademyRelatedLink | null;
  previous?: AcademyRelatedLink | null;
  related?: AcademyRelatedLink | null;
  submoduleSection?: {
    cards: Array<{
      href: string;
      title: string;
      description: string;
      ctaLabel: string;
      eyebrow?: string;
    }>;
  } | null;
  editorialLinks?: AcademyRelatedLink[];
};

function RouterCard({ option }: { option: DecisionRouteOption }) {
  return (
    <Link
      href={option.href}
      className="group flex h-full min-w-0 flex-col rounded-[1.7rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(255,247,250,0.94)_100%)] p-5 shadow-[0_18px_44px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(161,91,114,0.28)] hover:shadow-[0_24px_56px_rgba(58,36,43,0.12)] sm:p-6"
    >
      {option.tag ? <DecisionTag label={option.tag} className="w-fit" /> : null}
      <h3 className="mt-4 break-words font-serif text-[1.42rem] leading-[1.08] tracking-[-0.04em] text-[#2F2430] sm:text-[1.56rem]">
        {option.title}
      </h3>
      <p className="mt-4 break-words text-[0.98rem] leading-8 text-[#5B4B55]">{option.description}</p>
      <span className="mt-auto pt-6 text-sm uppercase tracking-[0.16em] text-[#8F4C62] transition duration-200 group-hover:translate-x-1">
        Continue here -&gt;
      </span>
    </Link>
  );
}

export default function DecisionRouter({
  module,
  options,
}: {
  module: DecisionRouterModule | string;
  options?: DecisionRouteOption[];
}) {
  const resolvedOptions =
    options ??
    (typeof module === 'string'
      ? getDecisionRouteOptions({
          slug: module,
          title: module,
          description: '',
          subhead: '',
          pathSlug: 'gear',
          progress: {
            current: 1,
            total: 1,
          },
          decisionBullets: [],
          coreSections: [],
        })
      : getDecisionRouteOptions(module));

  if (resolvedOptions.length === 0) {
    return null;
  }

  return (
    <div className={`grid gap-4 ${resolvedOptions.length > 1 ? 'md:grid-cols-2' : ''}`}>
      {resolvedOptions.map((option) => (
        <RouterCard key={`${option.href}-${option.title}`} option={option} />
      ))}
    </div>
  );
}
