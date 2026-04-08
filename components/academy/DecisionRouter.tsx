import { AcademyRouteCard } from '@/components/academy/AcademyPrimitives';
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
    <AcademyRouteCard
      href={option.href}
      title={option.title}
      description={option.description}
      ctaLabel="Continue here ->"
      tag={option.tag}
    />
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
