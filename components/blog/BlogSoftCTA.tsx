import Link from 'next/link';
import RevealOnScroll from '@/components/ui/RevealOnScroll';

type BlogSoftCTAProps = {
  className?: string;
};

export default function BlogSoftCTA({ className = '' }: BlogSoftCTAProps) {
  return (
    <div
      className={[
        'rounded-[28px] border border-black/5 bg-[#F7F4EF] px-8 py-12 text-center shadow-sm md:px-12',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <RevealOnScroll>
        <div className="mx-auto max-w-2xl space-y-6">
          <span className="block text-xs uppercase tracking-[0.28em] text-charcoal/55">
            Thoughtful Support
          </span>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight text-neutral-900">
            Start with confidence.
          </h2>
          <p className="mx-auto text-lg leading-relaxed text-charcoal/75">
            Clear, calm preparation begins with one thoughtful conversation.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="btn btn--primary btn-underline-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
