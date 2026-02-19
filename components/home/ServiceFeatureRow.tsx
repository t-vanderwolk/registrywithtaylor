import Image from 'next/image'
import Link from 'next/link'
import MarketingSection from '@/components/layout/MarketingSection'
import { Eyebrow, SectionTitle, Lead } from '@/components/Typography'

type ServiceFeatureRowProps = {
  id?: string
  eyebrow: string
  title: string
  description: string
  bullets?: string[]
  detailedBullets?: {
    emoji: string
    text: string
  }[]
  sectionHeader?: string
  sectionIntro?: string
  className?: string
  image: string
  alt?: string
  href?: string
  isExpanded?: boolean
  onToggle?: () => void
  reverse?: boolean
  tone?: 'white' | 'ivory' | 'ivoryWarm' | 'neutral' | 'blush'
  priority?: boolean
}

export default function ServiceFeatureRow({
  id,
  eyebrow,
  title,
  description,
  detailedBullets,
  sectionHeader,
  sectionIntro,
  className = '',
  image,
  alt,
  href,
  isExpanded,
  onToggle,
  reverse = false,
  tone = 'ivoryWarm',
  priority = false,
}: ServiceFeatureRowProps) {
  const expanded = isExpanded ?? false
  const detailsId = id ? `${id}-details` : undefined

  return (
    <MarketingSection
      id={id}
      tone={tone}
      spacing="spacious"
      container="wide"
      className={[sectionHeader ? '!pt-8 md:!pt-12' : '', className].filter(Boolean).join(' ')}
    >
      {sectionHeader && (
        <div className="mb-8 w-full text-left">
          <p className="!mb-0 text-xs tracking-[0.3em] uppercase text-[var(--color-muted)]">
            {sectionHeader}
          </p>
          {sectionIntro && (
            <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-[var(--color-muted)]">
              {sectionIntro}
            </p>
          )}
        </div>
      )}

      <div
        className={`group service-preview-row ${reverse ? 'service-preview-row--reverse' : 'service-preview-row--normal'}`}
      >
        {/* TEXT */}
        <div
          className={`service-preview-text ${reverse ? 'service-preview-text--reverse' : 'service-preview-text--normal'} w-full max-w-[520px]`}
        >
          <Eyebrow className="!mb-0">{eyebrow}</Eyebrow>

          <SectionTitle className="mt-2 !mb-0 leading-[1.2]">
            {title}
          </SectionTitle>

          <Lead className="mt-7 !mb-0 max-w-[520px] text-[var(--color-muted)]">
            {description}
          </Lead>

          {onToggle && (
            <div className="mt-6 flex w-full justify-center">
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                aria-controls={detailsId}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--color-muted)] transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-white hover:text-[var(--text-primary)]"
              >
                {expanded ? 'Show Less' : 'Read More'}
                <span
                  aria-hidden
                  className={`inline-block transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                >
                  ↓
                </span>
              </button>
            </div>
          )}

          {expanded && detailedBullets && (
            <div id={detailsId} className="mt-10 grid sm:grid-cols-2 gap-x-12 gap-y-6">
              {detailedBullets.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-xl leading-none mt-1 select-none">
                    {item.emoji}
                  </span>
                  <span className="text-[15px] md:text-base leading-relaxed text-neutral-700">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          {href && (
            <div className="pt-7">
              <Link
                href={href}
                className="group/cta btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
              >
                Explore Service
                <span
                  aria-hidden
                  className="ml-1 inline-block transition-transform duration-300 group-hover/cta:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* IMAGE */}
        <div
          className={`
            service-preview-image ${reverse ? 'service-preview-image--reverse' : 'service-preview-image--normal'}
            relative w-full max-w-[440px] aspect-square
            overflow-hidden
            rounded-2xl
            shadow-[0_16px_36px_rgba(0,0,0,0.08)]
          `}
        >
          <Image
            src={image}
            alt={alt || title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 440px"
            priority={priority}
          />
        </div>

      </div>
    </MarketingSection>
  )
}
