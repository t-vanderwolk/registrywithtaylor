import Image from 'next/image';
import Link from 'next/link';
import type { CaseStudy } from '@/lib/caseStudies';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.72rem] uppercase tracking-[0.22em] text-[#A15B72]">
      <ol className="flex min-w-0 flex-wrap items-center gap-2 text-[0.68rem] tracking-[0.18em] sm:text-[0.72rem] sm:tracking-[0.22em]">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex min-w-0 flex-wrap items-center gap-2">
            {index > 0 ? <span aria-hidden="true" className="text-[rgba(161,91,114,0.35)]">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="max-w-full break-words transition duration-200 hover:text-[#8F4C62]">
                {item.label}
              </Link>
            ) : (
              <span className="max-w-full break-words text-[#8F4C62]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function CaseStudyHeader({
  study,
  breadcrumbs,
}: {
  study: CaseStudy;
  breadcrumbs: BreadcrumbItem[];
}) {
  return (
    <header className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <section className="overflow-hidden rounded-[2.2rem] border border-[rgba(215,161,175,0.18)] bg-[linear-gradient(135deg,rgba(255,252,253,0.98)_0%,rgba(252,243,246,0.97)_48%,rgba(249,241,233,0.96)_100%)] shadow-[0_28px_70px_rgba(58,36,43,0.1)]">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)]">
          <div className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[#A15B72]">TMBC Academy Case Study</p>
            <h1 className="mt-4 max-w-[12ch] break-words font-serif text-[2.35rem] leading-[0.94] tracking-[-0.06em] text-[#2F2430] sm:text-[4rem]">
              {study.title}
            </h1>
            <p className="mt-6 max-w-[42rem] break-words text-[1.02rem] leading-8 text-[#4B3641] sm:text-[1.16rem] sm:leading-9">
              {study.deck}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/academy/case-studies"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(161,91,114,0.18)] bg-white/92 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#4B3641] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(58,36,43,0.08)]"
              >
                All case studies
              </Link>
              <a
                href="#case-study-decisions"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[rgba(232,154,174,0.32)] bg-[#A15B72] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white shadow-[0_16px_34px_rgba(216,137,160,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#8F4C62]"
              >
                Read the decisions
              </a>
            </div>
          </div>

          <div className="min-w-0 border-t border-[rgba(215,161,175,0.16)] bg-[linear-gradient(180deg,#fdf7f8_0%,#fffdf9_100%)] p-5 lg:border-l lg:border-t-0">
            <div className="relative min-h-[20rem] overflow-hidden rounded-[1.7rem] border border-[rgba(215,161,175,0.14)] bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <Image
                src={study.imageSrc}
                alt={study.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 34rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}
